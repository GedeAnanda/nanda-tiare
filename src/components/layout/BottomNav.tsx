"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Clock, Camera, Mail, Gamepad2, Music, Mic, Heart, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const mainNavItems = [
  { href: "/", icon: Home, label: "Home", emoji: "🏠" },
  { href: "/timeline", icon: Clock, label: "Timeline", emoji: "📅" },
  { href: "/gallery", icon: Camera, label: "Gallery", emoji: "📸" },
  { href: "/letters", icon: Mail, label: "Letters", emoji: "💌" },
  { href: "/games", icon: Gamepad2, label: "Games", emoji: "🎮" },
];

const moreNavItems = [
  { href: "/playlist", icon: Music, label: "Playlist", emoji: "🎵" },
  { href: "/wishlist", icon: Heart, label: "Wishlist", emoji: "📝" },
  { href: "/voice", icon: Mic, label: "Voice", emoji: "🎤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu popup */}
      {showMore && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-24 right-4 z-50 bg-white rounded-3xl shadow-soft-xl p-3 flex flex-col gap-1 min-w-[160px] border border-blush/30"
        >
          {moreNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowMore(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                isActive(item.href)
                  ? "bg-blush/40 text-deep-rose"
                  : "hover:bg-blush/20 text-ink/70"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-body font-semibold">{item.label}</span>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Bottom Nav Bar */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[480px] md:max-w-lg"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-soft-xl border border-blush/30 px-2 py-2 flex items-center justify-around gap-1"
             style={{ paddingBottom: `calc(0.5rem + env(safe-area-inset-bottom, 0px))` }}>
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-colors ${
                    active ? "bg-blush/40" : ""
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-blush/40 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-lg">{item.emoji}</span>
                  {active && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 text-[10px] font-body font-bold text-deep-rose mt-0.5"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
                {active && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 text-[8px]"
                  >
                    💗
                  </motion.div>
                )}
              </Link>
            );
          })}

          {/* More button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-colors ${
              showMore ? "bg-lavender/40" : ""
            }`}
          >
            <MoreHorizontal className="w-5 h-5 text-ink/60" />
            <span className="text-[10px] font-body text-ink/50 mt-0.5">Lagi</span>
          </motion.button>
        </div>
      </motion.nav>
    </>
  );
}
