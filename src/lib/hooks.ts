"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// useLocalStorage — Persist state to localStorage
// ============================================================
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const newValue = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(newValue));
          return newValue;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

// ============================================================
// useCountdown — Live countdown to a target date
// ============================================================
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAfter: boolean;
  totalDays: number;
}

export function useCountdown(targetDate: string): CountdownResult {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(targetDate + "T00:00:00");
  const diff = target.getTime() - now.getTime();
  const isAfter = diff <= 0;
  const absDiff = Math.abs(diff);

  const totalDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const days = totalDays;
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isAfter, totalDays };
}

// ============================================================
// useDaysTogether — Count days since start date
// ============================================================
export function useDaysTogether(startDate: string): number {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const start = new Date(startDate + "T00:00:00");
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setDays(Math.max(0, diff));
  }, [startDate]);

  return days;
}

// ============================================================
// useTripleTap — Detect triple tap on an element
// ============================================================
export function useTripleTap(callback: () => void, delay = 500) {
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    tapCount.current += 1;

    if (tapTimer.current) clearTimeout(tapTimer.current);

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      callback();
      return;
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, delay);
  }, [callback, delay]);

  return handleTap;
}

// ============================================================
// useSecretCode — Detect typed sequence (e.g. "tiare")
// ============================================================
export function useSecretCode(code: string, callback: () => void) {
  const buffer = useRef("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer.current += e.key.toLowerCase();
      if (buffer.current.length > code.length) {
        buffer.current = buffer.current.slice(-code.length);
      }
      if (buffer.current === code.toLowerCase()) {
        buffer.current = "";
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, callback]);
}

// ============================================================
// useSoundEffect — Tiny Web Audio API sounds
// ============================================================
export function useSoundEffect() {
  const contextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getContext = useCallback(() => {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return contextRef.current;
  }, []);

  const playPop = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [getContext]);

  const playSuccess = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getContext();
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.2);
      });
    } catch {}
  }, [getContext]);

  const playWrong = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = "square";
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [getContext]);

  const setEnabled = useCallback((val: boolean) => {
    enabledRef.current = val;
  }, []);

  return { playPop, playSuccess, playWrong, setEnabled };
}

// ============================================================
// useHaptic — Vibration feedback
// ============================================================
export function useHaptic() {
  const vibrate = useCallback((duration = 50) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }, []);

  return vibrate;
}
