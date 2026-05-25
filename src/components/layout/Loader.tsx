"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9998] bg-pastel-gradient flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-5xl"
      >
        💗
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="font-handwritten text-xl text-deep-rose"
      >
        Sebentar ya...
      </motion.p>
    </div>
  );
}
