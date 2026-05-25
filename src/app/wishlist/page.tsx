"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { wishlistItems as defaultItems, type WishlistItem, type WishlistCategory } from "@/lib/content";
import { useLocalStorage, useHaptic } from "@/lib/hooks";
import ConfettiBurst from "@/components/ui/ConfettiBurst";

const categories: WishlistCategory[] = ["Travel", "Food", "Experience", "Date", "Random"];
const categoryEmojis: Record<WishlistCategory, string> = {
  Travel: "✈️",
  Food: "🍜",
  Experience: "🎭",
  Date: "💑",
  Random: "🎲",
};

export default function WishlistPage() {
  const [items, setItems] = useLocalStorage<WishlistItem[]>("wishlist-items", defaultItems);
  const [activeCategory, setActiveCategory] = useState<WishlistCategory | "All">("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<WishlistCategory>("Random");
  const [showConfetti, setShowConfetti] = useState(false);
  const haptic = useHaptic();

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  const completedCount = items.filter((item) => item.done).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const toggleItem = useCallback((id: number) => {
    haptic(30);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) setShowConfetti(true);
          return { ...item, done: newDone };
        }
        return item;
      })
    );
  }, [haptic, setItems]);

  const addItem = () => {
    if (!newItemText.trim()) return;
    haptic(50);
    const newItem: WishlistItem = {
      id: Date.now(),
      text: newItemText.trim(),
      category: newItemCategory,
      emoji: categoryEmojis[newItemCategory],
      done: false,
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemText("");
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:py-12">
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-6"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Bucket List 📝
        </h1>
        <p className="font-body text-sm text-ink/50">
          Hal-hal yang mau kita lakuin bareng ✨
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mb-6"
      >
        <div className="bg-white rounded-full p-3 shadow-soft flex items-center gap-3">
          <div className="flex-1 bg-blush/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-rose to-deep-rose rounded-full"
            />
          </div>
          <span className="font-body text-xs font-bold text-deep-rose whitespace-nowrap">
            {completedCount}/{items.length} 💪
          </span>
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mb-8 max-w-md mx-auto"
      >
        <button
          onClick={() => setActiveCategory("All")}
          className={`font-accent text-xs px-4 py-2 rounded-full transition-all ${
            activeCategory === "All"
              ? "bg-deep-rose text-white shadow-soft"
              : "bg-white text-ink/60 shadow-soft border border-blush/20"
          }`}
        >
          Semua ✨
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-accent text-xs px-4 py-2 rounded-full transition-all ${
              activeCategory === cat
                ? "bg-deep-rose text-white shadow-soft"
                : "bg-white text-ink/60 shadow-soft border border-blush/20"
            }`}
          >
            {categoryEmojis[cat]} {cat}
          </button>
        ))}
      </motion.div>

      {/* Notepad */}
      <div className="max-w-md mx-auto">
        <div className="notepad-bg p-4 sm:p-6 shadow-soft-lg">
          <div className="flex flex-col gap-3">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3 cursor-pointer group pl-16 py-1"
              >
                {/* Custom checkbox */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                    item.done
                      ? "bg-rose border-deep-rose"
                      : "bg-white border-blush hover:border-rose"
                  }`}
                >
                  <AnimatePresence>
                    {item.done && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-xs text-white"
                      >
                        💗
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Item text */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-body text-sm ${
                      item.done ? "wavy-strike text-ink/40" : "text-ink/80"
                    }`}
                  >
                    {item.emoji} {item.text}
                  </span>
                </div>

                {/* Category tag */}
                <span className="font-body text-[10px] text-ink/30 bg-blush/20 px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline">
                  {item.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="mt-6 w-full bg-white text-deep-rose font-accent text-sm px-6 py-3.5 rounded-full shadow-soft border-2 border-blush/30"
        >
          + Tambah Baru 🌟
        </motion.button>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-soft-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-handwritten text-2xl text-deep-rose text-center mb-4">
                Tambah Wishlist Baru ✨
              </h3>

              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Mau ngapain bareng? ✍️"
                className="w-full bg-cream rounded-2xl px-4 py-3 font-body text-sm text-ink outline-none border-2 border-blush/20 focus:border-rose/50 transition-colors mb-4"
              />

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewItemCategory(cat)}
                    className={`font-accent text-xs px-3 py-1.5 rounded-full transition-all ${
                      newItemCategory === cat
                        ? "bg-deep-rose text-white"
                        : "bg-blush/20 text-ink/60"
                    }`}
                  >
                    {categoryEmojis[cat]} {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 font-accent text-sm px-4 py-3 rounded-full bg-cream text-ink/60"
                >
                  Batal
                </button>
                <button
                  onClick={addItem}
                  className="flex-1 font-accent text-sm px-4 py-3 rounded-full bg-deep-rose text-white shadow-soft"
                >
                  Tambah! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
