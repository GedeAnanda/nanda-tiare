"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { galleryPhotos } from "@/lib/content";
import { useHaptic } from "@/lib/hooks";

type ViewMode = "polaroid" | "filmstrip";

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("polaroid");
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof galleryPhotos)[0] | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const haptic = useHaptic();

  const toggleFlip = (id: number) => {
    haptic(30);
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Galeri Kita 📸
        </h1>
        <p className="font-body text-sm text-ink/50">
          Momen-momen yang nggak mau aku lupain ✨
        </p>
      </motion.div>

      {/* View toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center gap-2 mb-8"
      >
        <button
          onClick={() => setViewMode("polaroid")}
          className={`font-accent text-sm px-5 py-2.5 rounded-full transition-all ${viewMode === "polaroid"
              ? "bg-deep-rose text-white shadow-soft"
              : "bg-white text-ink/60 shadow-soft border border-blush/30"
            }`}
        >
          📷 Polaroid
        </button>
        <button
          onClick={() => setViewMode("filmstrip")}
          className={`font-accent text-sm px-5 py-2.5 rounded-full transition-all ${viewMode === "filmstrip"
              ? "bg-deep-rose text-white shadow-soft"
              : "bg-white text-ink/60 shadow-soft border border-blush/30"
            }`}
        >
          🎬 Filmstrip
        </button>
      </motion.div>

      {/* Polaroid Mode */}
      <AnimatePresence mode="wait">
        {viewMode === "polaroid" && (
          <motion.div
            key="polaroid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {galleryPhotos.map((photo, i) => {
                const rotation = ((i * 7 + 3) % 17) - 8; // -8 to +8 degrees
                const isFlipped = flippedCards.has(photo.id);

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0, rotate: rotation }}
                    animate={{ opacity: 1, scale: 1, rotate: rotation }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFlip(photo.id)}
                    className="cursor-pointer"
                    style={{ perspective: "800px" }}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative"
                    >
                      {/* Front - Polaroid */}
                      <div
                        className="bg-white p-2.5 pb-12 rounded-lg shadow-soft-lg"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div
                          className={`w-full aspect-square rounded-md bg-gradient-to-br ${photo.gradient} flex items-center justify-center`}
                        >
                          {photo.src ? (
                            <Image
                              src={photo.src}
                              alt={photo.caption}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <span className="font-body text-xs text-white/70 text-center px-2">
                              Foto akan di sini 📸
                            </span>
                          )}
                        </div>
                        <p className="font-handwritten text-sm text-ink/70 mt-2 text-center absolute bottom-3 left-0 right-0 px-3">
                          {photo.caption}
                        </p>
                      </div>

                      {/* Back - Date & Note */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blush to-lavender/50 rounded-lg shadow-soft-lg flex flex-col items-center justify-center p-4"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <span className="text-3xl mb-2">📅</span>
                        <p className="font-handwritten text-lg text-deep-rose">
                          {photo.date}
                        </p>
                        <p className="font-body text-xs text-ink/60 text-center mt-2">
                          {photo.caption}
                        </p>
                        <p className="font-body text-[10px] text-ink/40 mt-2">
                          Tap untuk balik 🔄
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Hidden easter egg heart */}
            <motion.button
              onClick={() => {
                haptic(100);
                window.location.href = "/secret";
              }}
              className="absolute opacity-[0.08] text-[8px] hover:opacity-30 transition-opacity"
              style={{ bottom: "20px", right: "20px" }}
              whileTap={{ scale: 2 }}
            >
              💗
            </motion.button>
          </motion.div>
        )}

        {/* Filmstrip Mode */}
        {viewMode === "filmstrip" && (
          <motion.div
            key="filmstrip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {galleryPhotos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      haptic(30);
                      setSelectedPhoto(photo);
                    }}
                    className="cursor-pointer flex-shrink-0"
                  >
                    <div className="film-strip">
                      <div
                        className={`w-48 h-64 sm:w-56 sm:h-72 rounded bg-gradient-to-br ${photo.gradient} flex items-center justify-center mx-6`}
                      >
                        {photo.src ? (
                          <Image
                            src={photo.src}
                            alt={photo.caption}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <span className="font-body text-xs text-white/70 text-center px-2">
                            📸
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-handwritten text-sm text-ink/60 text-center mt-2 max-w-[200px]">
                      {photo.caption}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="font-body text-xs text-ink/30 text-center mt-2">
              ← Swipe untuk liat semua →
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white p-3 pb-16 rounded-xl shadow-2xl max-w-sm w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-full aspect-square rounded-lg bg-gradient-to-br ${selectedPhoto.gradient} flex items-center justify-center`}
              >
                {selectedPhoto.src ? (
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.caption}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <span className="font-body text-sm text-white/70">
                    Foto akan di sini 📸
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center px-4">
                <p className="font-handwritten text-lg text-ink/80">
                  {selectedPhoto.caption}
                </p>
                <p className="font-body text-xs text-ink/40">{selectedPhoto.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
