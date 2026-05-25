"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateConfetti, type ConfettiParticle } from "@/lib/utils";

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  originX?: number;
  originY?: number;
  count?: number;
}

export default function ConfettiBurst({
  trigger,
  onComplete,
  originX = 50,
  originY = 50,
  count = 30,
}: ConfettiBurstProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(generateConfetti(count, originX, originY));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, count, originX, originY, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9990]">
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const endX = p.x + Math.cos(rad) * p.velocity * 15;
            const endY = p.y + Math.sin(rad) * p.velocity * 10 + 30;
            return (
              <motion.div
                key={p.id}
                initial={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  scale: 0,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  left: `${endX}%`,
                  top: `${endY}%`,
                  scale: p.scale,
                  rotate: p.spin * 36,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute text-lg"
                style={{ fontSize: `${p.scale * 20}px` }}
              >
                {p.emoji}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Click Sparkle — show sparkles on every click
// ============================================================
interface Sparkle {
  id: number;
  x: number;
  y: number;
}

export function ClickSparkleProvider({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const id = Date.now();
    const sparkle: Sparkle = {
      id,
      x: e.clientX,
      y: e.clientY,
    };
    setSparkles((prev) => [...prev, sparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 600);
  }, []);

  return (
    <div onClick={handleClick} className="contents">
      {children}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed pointer-events-none z-[9995]"
            style={{ left: s.x - 12, top: s.y - 12 }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
