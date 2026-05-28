"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { voiceNotes, config } from "@/lib/content";
import { useHaptic } from "@/lib/hooks";
import LocationLock from "@/components/layout/LocationLock";

function WaveformBars({ playing }: { playing: boolean }) {
  const bars = 20;
  return (
    <div className="flex items-center gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-deep-rose/60"
          animate={
            playing
              ? {
                  height: [8, 24, 12, 20, 8],
                }
              : { height: 8 }
          }
          transition={
            playing
              ? {
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          style={{ minHeight: 4 }}
        />
      ))}
    </div>
  );
}

export default function VoicePage() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const haptic = useHaptic();

  // Check if anniversary has passed
  const isAnniversaryPassed = new Date() >= new Date(config.anniversaryDate + "T00:00:00");

  const togglePlay = (id: number) => {
    haptic(30);
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <LocationLock>
      <div className="min-h-screen bg-pastel-gradient px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Voice Notes 🎤
        </h1>
        <p className="font-body text-sm text-ink/50">
          Pesan suara dari Nanda buat Tiare 💕
        </p>
      </motion.div>

      <div className="max-w-md mx-auto">
        {/* Featured / Locked voice note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mb-8"
        >
          <div className={`sticker-card p-5 border-2 ${isAnniversaryPassed ? "border-rose/50 bg-gradient-to-r from-blush/30 to-lavender/30" : "border-blush/30"} relative overflow-hidden`}>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={isAnniversaryPassed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-deep-rose flex items-center justify-center"
              >
                <span className="text-lg">{isAnniversaryPassed ? "🎂" : "🔒"}</span>
              </motion.div>
              <div>
                <h3 className="font-accent text-sm font-bold text-deep-rose">
                  Voice Note Spesial — Buka di Hari Anniv 🎂
                </h3>
                <p className="font-body text-xs text-ink/40">
                  {isAnniversaryPassed 
                    ? "Selamat anniversary sayang! 🥹 Buka voice note-nya!" 
                    : "Terkunci sampai 29 Mei 2026 ✨"}
                </p>
              </div>
            </div>

            {isAnniversaryPassed ? (
              <div>
                <WaveformBars playing={playingId === -1} />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePlay(-1)}
                  className="mt-3 bg-deep-rose text-white font-accent text-sm px-5 py-2.5 rounded-full shadow-soft"
                >
                  {playingId === -1 ? "⏸ Pause" : "▶️ Play"}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl"
                >
                  🔐
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Voice note cards */}
        <div className="flex flex-col gap-4">
          {voiceNotes.map((note, i) => {
            const isPlaying = playingId === note.id;
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`${
                    isLeft ? "chat-bubble bg-white" : "chat-bubble-right bg-sky/30"
                  } p-4 rounded-2xl shadow-soft max-w-[85%] border border-blush/20`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-deep-rose/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-accent text-xs font-bold text-deep-rose">N</span>
                    </div>
                    <div>
                      <h4 className="font-accent text-xs font-bold text-ink">
                        {note.title} {note.emoji}
                      </h4>
                      <p className="font-body text-[10px] text-ink/40">{note.date}</p>
                    </div>
                  </div>

                  {/* Waveform */}
                  <WaveformBars playing={isPlaying} />

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-body text-[10px] text-ink/40">{note.duration}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePlay(note.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isPlaying ? "bg-deep-rose text-white" : "bg-blush/40 text-deep-rose"
                      }`}
                    >
                      {isPlaying ? "⏸" : "▶️"}
                    </motion.button>
                  </div>

                  <p className="font-body text-xs text-ink/50 mt-2 italic">
                    {note.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="font-handwritten text-base text-deep-rose/60 text-center mt-10"
        >
          Audio files bisa ditambahin nanti ya 🎧
        </motion.p>
      </div>
      </div>
    </LocationLock>
  );
}
