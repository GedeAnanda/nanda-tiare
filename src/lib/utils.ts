// ============================================================
// Utility functions
// ============================================================

/**
 * Get a deterministic letter index for today's date
 */
export function getDailyLetterIndex(totalLetters: number): number {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    const char = today.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % totalLetters;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string, date2?: Date): number {
  const d1 = new Date(date1 + "T00:00:00");
  const d2 = date2 || new Date();
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Generate random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate array of floating element configs
 */
export interface FloatingConfig {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity: number;
}

const FLOATING_EMOJIS = ["💗", "✨", "🌸", "⭐", "☁️", "🦋", "🌷", "🎀", "💌", "🍓"];

export function generateFloatingElements(count: number): FloatingConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: FLOATING_EMOJIS[i % FLOATING_EMOJIS.length],
    x: randomBetween(5, 95),
    y: randomBetween(0, 100),
    size: randomBetween(16, 32),
    duration: randomBetween(10, 25),
    delay: randomBetween(0, 10),
    rotation: randomBetween(-30, 30),
    opacity: randomBetween(0.1, 0.3),
  }));
}

/**
 * Confetti particle config
 */
export interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  emoji: string;
  angle: number;
  velocity: number;
  spin: number;
  scale: number;
}

const CONFETTI_COLORS = ["#FFD6E0", "#FFB4A2", "#FF8FA3", "#E0BBE4", "#B5EAD7", "#FFF3B0", "#C7F0FF"];
const CONFETTI_EMOJIS = ["💗", "✨", "🎀", "💕", "⭐", "🌸", "🦋"];

export function generateConfetti(count: number, originX = 50, originY = 50): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: originX,
    y: originY,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    angle: randomBetween(0, 360),
    velocity: randomBetween(2, 8),
    spin: randomBetween(-10, 10),
    scale: randomBetween(0.5, 1.5),
  }));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format number with leading zero
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}
