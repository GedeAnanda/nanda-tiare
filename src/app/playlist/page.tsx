"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { songs } from "@/lib/content";
import { useHaptic } from "@/lib/hooks";

export default function PlaylistPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const haptic = useHaptic();

  const togglePlay = (id: number) => {
    haptic(30);
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-pastel-gradient-2 px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Lagu-lagu Kita 🎵
        </h1>
        <p className="font-body text-sm text-ink/50">
          Playlist yang nyeritain cerita kita ✨
        </p>
      </motion.div>

      {/* Music Box Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex justify-center mb-10"
      >
        <div className="relative w-40 h-40">
          {/* Music box body */}
          <div className="absolute inset-0 bg-gradient-to-br from-peach to-rose rounded-3xl shadow-soft-lg flex items-center justify-center">
            <span className="text-5xl">🎵</span>
          </div>
          {/* Wind-up key */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -right-6 top-1/2 -translate-y-1/2"
          >
            <div className="w-8 h-3 bg-ink/30 rounded-full relative">
              <div className="absolute -right-1 -top-1 w-5 h-5 border-3 border-ink/30 rounded-full" />
            </div>
          </motion.div>
          {/* Floating music notes */}
          {["🎵", "🎶", "♪"].map((note, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{ left: `${20 + i * 30}%`, top: "-20px" }}
              animate={{
                y: [-10, -40, -10],
                x: [0, (i - 1) * 15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              {note}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Song cards */}
      <div className="max-w-md mx-auto flex flex-col gap-4">
        {songs.map((song, i) => {
          const isPlaying = playingId === song.id;
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={isPlaying ? { 
                  boxShadow: "0 8px 40px rgba(255, 143, 163, 0.3)",
                  y: -4
                } : {}}
                className={`sticker-card p-4 sm:p-5 flex gap-4 items-center relative overflow-hidden ${
                  isPlaying ? "border-rose/50" : ""
                }`}
              >
                {/* Album art placeholder */}
                <motion.div
                  animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
                  transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${song.color || "from-pink-200 to-rose-300"} flex items-center justify-center flex-shrink-0 shadow-soft`}
                >
                  <span className="text-2xl">{song.emoji}</span>
                </motion.div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-accent text-sm font-bold text-ink truncate">
                    {song.title}
                  </h3>
                  <p className="font-body text-xs text-ink/50 truncate">
                    {song.artist}
                  </p>
                  <p className="font-body text-xs text-ink/40 mt-1 line-clamp-2">
                    {song.note}
                  </p>
                </div>

                {/* Play button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => togglePlay(song.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-soft ${
                    isPlaying ? "bg-deep-rose text-white" : "bg-blush/50 text-deep-rose"
                  }`}
                >
                  {isPlaying ? "⏸" : "▶️"}
                </motion.button>

                {/* Playing indicator: floating notes */}
                <AnimatePresence>
                  {isPlaying && (
                    <>
                      {[0, 1, 2].map((j) => (
                        <motion.span
                          key={j}
                          initial={{ opacity: 0, y: 0, x: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            y: -40,
                            x: (j - 1) * 20,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: j * 0.4,
                          }}
                          className="absolute right-4 top-2 text-sm"
                        >
                          {["🎵", "🎶", "♪"][j]}
                        </motion.span>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="font-handwritten text-base text-deep-rose/60 text-center mt-10"
      >
        Setiap lagu punya cerita kita 💕
      </motion.p>
    </div>
  );
}
