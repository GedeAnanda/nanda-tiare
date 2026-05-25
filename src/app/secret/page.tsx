"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { secretMessage, config } from "@/lib/content";
import { randomBetween } from "@/lib/utils";

interface FloatingPhoto {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  gradient: string;
}

const gradients = [
  "from-pink-200 to-rose-300",
  "from-purple-200 to-pink-300",
  "from-blue-200 to-cyan-300",
  "from-orange-200 to-yellow-300",
  "from-teal-200 to-green-300",
  "from-violet-200 to-purple-300",
];

export default function SecretPage() {
  const [photos, setPhotos] = useState<FloatingPhoto[]>([]);
  const isAnniversaryPassed = new Date() >= new Date(config.anniversaryDate + "T00:00:00");
  const vaultOpen = false;

  useEffect(() => {
    const generated: FloatingPhoto[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: randomBetween(10, 80),
      y: randomBetween(20, 70),
      size: randomBetween(80, 140),
      rotation: randomBetween(-20, 20),
      gradient: gradients[i % gradients.length],
    }));
    setPhotos(generated);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink/90 to-ink/95 relative overflow-hidden px-4 py-12">
      {/* Floating photo collage */}
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          className="absolute rounded-xl opacity-20"
          style={{
            left: `${photo.x}%`,
            top: `${photo.y}%`,
            width: photo.size,
            height: photo.size,
            transform: `rotate(${photo.rotation}deg)`,
          }}
          animate={{
            x: [0, randomBetween(-30, 30), randomBetween(-20, 20), 0],
            y: [0, randomBetween(-20, 20), randomBetween(-30, 30), 0],
          }}
          transition={{
            duration: randomBetween(15, 25),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${photo.gradient}`} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto text-center">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl inline-block mb-4"
          >
            🤫
          </motion.span>
          <h1 className="font-handwritten text-4xl sm:text-5xl text-blush mb-4">
            {secretMessage.greeting}
          </h1>
        </motion.div>

        {/* Secret message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 mb-8"
        >
          <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line">
            {secretMessage.message}
          </p>
        </motion.div>

        {/* Vault */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10"
        >
          <h2 className="font-handwritten text-2xl text-butter mb-4">
            🔐 Vault Terakhir
          </h2>

          {isAnniversaryPassed || vaultOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl inline-block mb-3"
              >
                🎀
              </motion.span>
              <p className="font-body text-sm text-white/80 leading-relaxed whitespace-pre-line">
                {secretMessage.vaultMessage}
              </p>
            </motion.div>
          ) : (
            <div>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl inline-block mb-3"
              >
                🔒
              </motion.div>
              <p className="font-body text-xs text-white/40">
                Vault ini terbuka di tanggal 29 Mei 2026 ✨
              </p>
              <p className="font-body text-[10px] text-white/20 mt-2">
                Sabar ya sayang...
              </p>
            </div>
          )}
        </motion.div>

        {/* Stars decoration */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{
              left: `${randomBetween(5, 95)}%`,
              top: `${randomBetween(5, 95)}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: randomBetween(2, 4),
              repeat: Infinity,
              delay: randomBetween(0, 3),
            }}
          >
            ✨
          </motion.div>
        ))}

        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="inline-block mt-8 font-body text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          ← Kembali ke halaman utama
        </motion.a>
      </div>
    </div>
  );
}
