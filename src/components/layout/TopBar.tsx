"use client";

import { motion } from "framer-motion";
import { config } from "@/lib/content";
import { useDaysTogether } from "@/lib/hooks";
import Link from "next/link";

export default function TopBar() {
  const days = useDaysTogether(config.startDate);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-cream/80 border-b border-blush/30"
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <motion.span
            className="font-handwritten text-xl text-deep-rose"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {config.names.me}
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-rose text-lg"
          >
            💗
          </motion.span>
          <motion.span
            className="font-handwritten text-xl text-deep-rose"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {config.names.her}
          </motion.span>
        </Link>

        {/* Days counter */}
        <motion.div
          className="flex items-center gap-1.5 bg-blush/40 px-3 py-1 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-sm">💕</span>
          <span className="text-xs font-body font-semibold text-deep-rose">
            {days} hari
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
}
