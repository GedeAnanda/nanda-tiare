"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { letters } from "@/lib/content";
import { getDailyLetterIndex } from "@/lib/utils";
import { useLocalStorage, useHaptic } from "@/lib/hooks";
import ConfettiBurst from "@/components/ui/ConfettiBurst";

export default function LettersPage() {
  const [openedLetters, setOpenedLetters] = useLocalStorage<number[]>("opened-letters", []);
  const [currentLetter, setCurrentLetter] = useState<(typeof letters)[0] | null>(null);
  const [envelopeState, setEnvelopeState] = useState<"closed" | "opening" | "open">("closed");
  const [typedBody, setTypedBody] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const haptic = useHaptic();

  // Get today's letter
  const dailyIndex = getDailyLetterIndex(letters.length);

  const openLetter = useCallback(
    (letter: (typeof letters)[0]) => {
      haptic(50);
      setCurrentLetter(letter);
      setEnvelopeState("opening");
      setShowConfetti(true);
      setTypedBody("");

      // Mark as opened
      if (!openedLetters.includes(letter.id)) {
        setOpenedLetters((prev) => [...prev, letter.id]);
      }

      // After opening animation, start typewriter
      setTimeout(() => {
        setEnvelopeState("open");
        // Start typewriter effect
        let i = 0;
        const interval = setInterval(() => {
          setTypedBody(letter.body.slice(0, i + 1));
          i++;
          if (i >= letter.body.length) clearInterval(interval);
        }, 30);
      }, 1000);
    },
    [haptic, openedLetters, setOpenedLetters]
  );

  const openDailyLetter = () => {
    openLetter(letters[dailyIndex]);
  };

  const openRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * letters.length);
    openLetter(letters[randomIndex]);
  };

  const closeLetter = () => {
    setEnvelopeState("closed");
    setCurrentLetter(null);
    setTypedBody("");
  };

  return (
    <div className="min-h-screen bg-pastel-gradient px-4 py-8 sm:py-12">
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Surat Cinta 💌
        </h1>
        <p className="font-body text-sm text-ink/50">
          Klik amplop buat baca surat dari Nanda
        </p>
        <div className="mt-3 inline-block bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5">
          <span className="font-body text-xs text-deep-rose font-semibold">
            Sudah dibuka {openedLetters.length}/{letters.length} 💕
          </span>
        </div>
      </motion.div>

      {/* Envelope / Letter view */}
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {envelopeState === "closed" && !currentLetter && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Envelope illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-72 h-48 sm:w-80 sm:h-56 cursor-pointer"
                onClick={openDailyLetter}
                whileTap={{ scale: 0.95 }}
              >
                {/* Envelope body */}
                <div className="absolute inset-0 bg-gradient-to-br from-blush to-peach/80 rounded-2xl shadow-soft-lg border-2 border-white/30 overflow-hidden">
                  {/* Inner flap shadow */}
                  <div className="absolute top-0 left-0 right-0 h-1/2">
                    <svg
                      viewBox="0 0 320 120"
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,0 L160,100 L320,0 Z"
                        fill="rgba(255,255,255,0.2)"
                      />
                    </svg>
                  </div>
                  {/* Envelope lines */}
                  <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-2">
                    <div className="h-1.5 bg-white/20 rounded-full" />
                    <div className="h-1.5 bg-white/20 rounded-full w-3/4" />
                    <div className="h-1.5 bg-white/20 rounded-full w-1/2" />
                  </div>
                </div>

                {/* Wax seal */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(212,82,122,0.3)",
                      "0 0 25px rgba(212,82,122,0.6)",
                      "0 0 10px rgba(212,82,122,0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-deep-rose rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <span className="text-2xl">💗</span>
                </motion.div>

                {/* Top flap */}
                <svg
                  viewBox="0 0 320 120"
                  className="absolute -top-0 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 L160,100 L320,0 Z"
                    fill="#FFB4A2"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openDailyLetter}
                  className="bg-deep-rose text-white font-accent text-base px-6 py-3.5 rounded-full shadow-soft-lg w-full"
                >
                  Ambil Surat untuk Hari Ini 💌
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openRandomLetter}
                  className="bg-white text-deep-rose font-accent text-base px-6 py-3.5 rounded-full shadow-soft border-2 border-blush/50 w-full"
                >
                  Ambil Surat Random ✨
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Open letter view */}
          {(envelopeState === "opening" || envelopeState === "open") && currentLetter && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center"
            >
              {/* Letter paper */}
              <div className="paper-texture rounded-2xl p-6 sm:p-8 shadow-soft-lg w-full max-w-md relative">
                {/* Letter title */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
                    className="inline-block bg-blush/30 rounded-full px-4 py-1.5 mb-3"
                  >
                    <span className="font-body text-xs text-deep-rose font-semibold">
                      Surat #{currentLetter.id}
                    </span>
                  </motion.div>
                  <h2 className="font-handwritten text-2xl sm:text-3xl text-deep-rose">
                    {currentLetter.title}
                  </h2>
                  <p className="font-body text-xs text-ink/40 mt-1">
                    Surat untuk Tiare — dari Nanda 💗
                  </p>
                </div>

                {/* Letter body with typewriter */}
                <div className="min-h-[200px]">
                  <p className="font-handwritten text-lg text-ink/80 leading-relaxed whitespace-pre-line">
                    {typedBody}
                    {typedBody.length < (currentLetter?.body.length || 0) && (
                      <span className="typewriter-cursor" />
                    )}
                  </p>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-3 left-3 text-lg opacity-20">🌸</div>
                <div className="absolute top-3 right-3 text-lg opacity-20">✨</div>
                <div className="absolute bottom-3 left-3 text-lg opacity-20">💗</div>
                <div className="absolute bottom-3 right-3 text-lg opacity-20">🌷</div>
              </div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={closeLetter}
                className="mt-6 bg-white text-deep-rose font-accent text-sm px-6 py-3 rounded-full shadow-soft border-2 border-blush/50"
              >
                Tutup Surat 📬
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter collection grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-md mx-auto mt-12"
      >
        <h3 className="font-handwritten text-xl text-deep-rose text-center mb-4">
          Koleksi Surat 📮
        </h3>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {letters.map((letter) => {
            const isOpened = openedLetters.includes(letter.id);
            return (
              <motion.button
                key={letter.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openLetter(letter)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-lg shadow-soft transition-colors ${
                  isOpened
                    ? "bg-blush/50 border-2 border-rose/30"
                    : "bg-white/60 border-2 border-blush/20"
                }`}
              >
                {isOpened ? "💌" : "✉️"}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
