"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateFloatingElements, type FloatingConfig } from "@/lib/utils";

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingConfig[]>([]);

  useEffect(() => {
    setElements(generateFloatingElements(15));
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            opacity: el.opacity,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [el.rotation, el.rotation + 15, el.rotation - 10, el.rotation],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}
