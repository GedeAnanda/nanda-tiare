"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, MapPin, Compass } from "lucide-react";
import { useHaptic } from "@/lib/hooks";

// Bandung city center coordinates
const BANDUNG_LAT = -6.9175;
const BANDUNG_LON = 107.6191;
const ALLOWED_RADIUS_KM = 35; // 35 km radius covers Bandung area

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((rawLon2: number) => {
    return ((rawLon2 - lon1) * Math.PI) / 180;
  })(lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

interface LocationLockProps {
  children: React.ReactNode;
}

export default function LocationLock({ children }: LocationLockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingGPS, setCheckingGPS] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bypassClicksRef = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [passcode, setPasscode] = useState("");
  const haptic = useHaptic();

  useEffect(() => {
    setHasMounted(true);
    const unlockedStatus = localStorage.getItem("bandung-unlocked");
    if (unlockedStatus === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const checkLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      haptic(100);
      setErrorMsg("Browser kamu tidak mendukung fitur GPS 📍");
      return;
    }

    haptic(30);
    setCheckingGPS(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const dist = getDistanceKm(lat, lon, BANDUNG_LAT, BANDUNG_LON);
        const roundedDist = Math.round(dist);

        if (dist <= ALLOWED_RADIUS_KM) {
          haptic(100);
          setIsUnlocked(true);
          localStorage.setItem("bandung-unlocked", "true");
        } else {
          haptic(80);
          setErrorMsg(
            `Jarak kamu ke Bandung masih ${roundedDist} km. Tunggu Nanda kembali ke Bandung dulu ya sayang! 🫂`
          );
        }
        setCheckingGPS(false);
      },
      (err) => {
        haptic(100);
        console.error(err);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Izin lokasi ditolak. Tolong berikan akses GPS di browser kamu ya! 📍");
        } else {
          setErrorMsg("Gagal membaca sinyal GPS. Coba lagi beberapa saat lagi ya! 🛰️");
        }
        setCheckingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [haptic]);

  const handleVerifyPasscode = () => {
    haptic(30);
    const cleanCode = passcode.trim().toLowerCase();
    if (cleanCode === "nandasayangtiare") {
      haptic(100);
      setIsUnlocked(true);
      localStorage.setItem("bandung-unlocked", "true");
      setErrorMsg(null);
    } else {
      haptic(120);
      setErrorMsg("Kodenya salah nih sayang, coba tanya Nanda dulu ya! 🤫");
    }
  };

  const handleBypassClick = () => {
    bypassClicksRef.current += 1;
    haptic(20);
    if (bypassClicksRef.current >= 5) {
      haptic(100);
      setIsUnlocked(true);
      localStorage.setItem("bandung-unlocked", "true");
      bypassClicksRef.current = 0;
    }
  };

  if (!hasMounted) {
    return null; // Avoid hydration mismatch
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-pastel-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sticker-card max-w-sm w-full p-8 text-center bg-white/80 backdrop-blur-md relative overflow-hidden"
      >
        {/* Animated padlock icon */}
        <div className="flex justify-center mb-6 relative">
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={handleBypassClick}
            className="w-20 h-20 rounded-full bg-blush/40 flex items-center justify-center cursor-pointer relative z-10 shadow-soft"
          >
            <Lock className="w-10 h-10 text-deep-rose" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-blush/20 rounded-full"
          />
        </div>

        {/* Locked message */}
        <h2 className="font-handwritten text-3xl text-deep-rose mb-3">
          Halaman Terkunci 🔒
        </h2>
        <p className="font-body text-sm text-ink/70 leading-relaxed mb-6">
          Fitur ini baru akan terbuka setelah Nanda selesai liburan di Tangerang dan sudah pulang kembali ke Bandung 🌸
        </p>

        {/* GPS checking layout */}
        <AnimatePresence mode="wait">
          {checkingGPS ? (
            <motion.div
              key="checking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <Compass className="w-8 h-8 text-deep-rose animate-spin" />
              <p className="font-body text-xs text-ink/50">Mengecek koordinat GPS kamu... 🛰️</p>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 w-full"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkLocation}
                className="bg-deep-rose text-white font-accent text-sm px-8 py-3.5 rounded-full shadow-soft flex items-center justify-center gap-2 hover:bg-deep-rose/90 transition-colors w-full"
              >
                <MapPin className="w-4 h-4" />
                Cek Lokasi Aku 📍
              </motion.button>

              <div className="text-[10px] text-ink/30 font-body my-1">— ATAU MASUKKAN KODE 🔑 —</div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan kode rahasia... 🤫"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="flex-1 font-body text-xs px-4 py-2.5 rounded-2xl border border-blush/30 bg-white/50 focus:outline-none focus:border-rose/50 text-ink text-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerifyPasscode();
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVerifyPasscode}
                  className="bg-blush text-deep-rose font-accent text-xs px-4 py-2.5 rounded-2xl border border-blush/30 hover:bg-blush/70 transition-colors"
                >
                  Buka
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-rose/10 rounded-2xl border border-rose/20"
          >
            <p className="font-body text-xs text-deep-rose leading-relaxed">{errorMsg}</p>
          </motion.div>
        )}

        {/* Small hint */}
        <p className="font-body text-[10px] text-ink/30 mt-6">
          Gunakan browser mobile/desktop dan berikan akses izin lokasi ya.
        </p>
      </motion.div>
    </div>
  );
}
