"use client";

import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { config } from "@/lib/content";
import { useCountdown, useDaysTogether, useTripleTap, useSecretCode, useHaptic } from "@/lib/hooks";
import { padZero } from "@/lib/utils";
import ConfettiBurst from "@/components/ui/ConfettiBurst";
import { useRouter } from "next/navigation";
import Link from "next/link";

const headingText = "Happy 2 Years, Sayang";
const featureCards = [
  { href: "/timeline", emoji: "📅", title: "Timeline Kita", desc: "Perjalanan 2 tahun bareng", color: "bg-sky/40" },
  { href: "/gallery", emoji: "📸", title: "Galeri Foto", desc: "Momen-momen favorit", color: "bg-mint/40" },
  { href: "/letters", emoji: "💌", title: "Surat Cinta", desc: "15 surat dari Nanda", color: "bg-blush/40" },
  { href: "/games", emoji: "🎮", title: "Mini Games", desc: "Main bareng yuk!", color: "bg-butter/40" },
  { href: "/playlist", emoji: "🎵", title: "Playlist Kita", desc: "Lagu-lagu spesial", color: "bg-lavender/40" },
  { href: "/wishlist", emoji: "📝", title: "Bucket List", desc: "Impian bareng kita", color: "bg-peach/40" },
  { href: "/voice", emoji: "🎤", title: "Voice Notes", desc: "Pesan suara dari Nanda", color: "bg-sky/40" },
];

export default function HomePage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const haptic = useHaptic();
  
  const countdown = useCountdown(config.anniversaryDate);
  const daysTogether = useDaysTogether(config.startDate);
  
  // Easter egg: triple-tap heading
  const handleTripleTap = useTripleTap(
    useCallback(() => {
      haptic(100);
      router.push("/secret");
    }, [haptic, router])
  );

  // Easter egg: type "tiare"
  useSecretCode("tiare", useCallback(() => {
    haptic(100);
    router.push("/secret");
  }, [haptic, router]));

  // Typewriter effect for welcome message
  const welcomeText = "Halo, Tiare 👋 Website ini aku bikin khusus buat kamu. Setiap halaman, setiap animasi, setiap kata — semuanya buat kamu, sayang.";
  
  useEffect(() => {
    if (!revealed) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(welcomeText.slice(0, i + 1));
      i++;
      if (i >= welcomeText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [revealed]);

  const handleCTA = () => {
    setShowConfetti(true);
    haptic(100);
    setTimeout(() => {
      setRevealed(true);
      document.getElementById("welcome-section")?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const countdownItems = [
    { label: "Hari", value: padZero(countdown.days) },
    { label: "Jam", value: padZero(countdown.hours) },
    { label: "Menit", value: padZero(countdown.minutes) },
    { label: "Detik", value: padZero(countdown.seconds) },
  ];

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unlockedStatus = localStorage.getItem("bandung-unlocked");
    if (unlockedStatus === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const rotations = [-3, 2, -2, 3];
  const lockedRoutes = ["/letters", "/wishlist", "/voice"];

  return (
    <div className="relative">
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section
        ref={heroRef}
        className="min-h-[calc(100dvh-3.5rem)] flex flex-col items-center justify-center px-6 bg-pastel-gradient relative overflow-hidden"
      >
        {/* "untuk tiare 🎀" */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-handwritten text-lg text-deep-rose/70 mb-4"
        >
          untuk tiare 🎀
        </motion.p>

        {/* Main heading — letter by letter animation */}
        <div onClick={handleTripleTap} className="cursor-default select-none">
          <h1 className="font-handwritten text-4xl sm:text-5xl md:text-6xl text-deep-rose text-center leading-tight">
            {headingText.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.5 + i * 0.04,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className="inline-block"
                style={{ marginRight: char === " " ? "0.3em" : "0" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="font-body text-base sm:text-lg text-ink/60 mt-3 text-center"
        >
          Dibuat sama Nanda buat kamu 💌
        </motion.p>

        {/* Countdown / Count-up */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
          className="mt-8"
        >
          {countdown.isAfter ? (
            <div className="text-center">
              <p className="font-handwritten text-xl text-deep-rose mb-2">
                🥹 Anniversary ke-2 kita!
              </p>
              <p className="font-body text-sm text-ink/60">
                Sudah {countdown.days} hari sejak anniv ke-2 kita 💗
              </p>
            </div>
          ) : (
            <>
              <p className="font-handwritten text-lg text-deep-rose/70 text-center mb-3">
                ⏰ Menuju 29 Mei 2026
              </p>
              <div className="flex gap-3 justify-center">
                {countdownItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: rotations[i] }}
                    transition={{
                      delay: 2 + i * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    className="sticker-card w-16 h-20 sm:w-20 sm:h-24 flex flex-col items-center justify-center"
                  >
                    <span className="font-accent text-2xl sm:text-3xl text-deep-rose font-bold">
                      {item.value}
                    </span>
                    <span className="font-body text-[10px] sm:text-xs text-ink/50 mt-1">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Days together counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-6 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 shadow-soft"
        >
          <span className="font-body text-sm text-ink/70">
            💕 Sudah <span className="font-bold text-deep-rose">{daysTogether}</span> hari bareng
          </span>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="mt-8 bg-deep-rose text-white font-accent text-lg px-8 py-4 rounded-full shadow-soft-lg hover:shadow-soft-xl transition-shadow"
        >
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            Buka Kejutannya 🎁
          </motion.span>
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 10, 0] }}
          transition={{ delay: 3.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-ink/30"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ============================================================
          WELCOME SECTION (revealed after CTA click)
          ============================================================ */}
      {revealed && (
        <section id="welcome-section" className="min-h-screen px-6 py-16 bg-cream relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            {/* Typewriter message */}
            <div className="sticker-card p-8 mb-12">
              <p className="font-body text-base sm:text-lg text-ink/80 leading-relaxed">
                {typedText}
                {typedText.length < welcomeText.length && (
                  <span className="typewriter-cursor" />
                )}
              </p>
            </div>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-handwritten text-2xl text-deep-rose text-center mb-6">
                Website ini isinya... ✨
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {featureCards.map((card, i) => {
                  const isLocked = !isUnlocked && lockedRoutes.includes(card.href);
                  return (
                    <motion.div
                      key={card.href}
                      initial={{ opacity: 0, scale: 0, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <Link href={card.href}>
                        <motion.div
                          whileHover={{ scale: 1.05, rotate: 0 }}
                          whileTap={{ scale: 0.95 }}
                          className={`sticker-card p-4 sm:p-5 flex flex-col items-center text-center gap-2 relative overflow-hidden ${card.color}`}
                        >
                          {isLocked && (
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md w-6 h-6 rounded-full flex items-center justify-center shadow-soft border border-blush/30">
                              <span className="text-[10px]">🔒</span>
                            </div>
                          )}
                          <span className="text-3xl">{card.emoji}</span>
                          <h3 className="font-accent text-sm font-bold text-ink">
                            {card.title}
                          </h3>
                          <p className="font-body text-[11px] text-ink/50">
                            {isLocked ? "Terkunci (Buka di Bandung) 📍" : card.desc}
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="font-handwritten text-xl text-deep-rose text-center mt-10"
              >
                Klik mana aja, semuanya buat kamu 💗
              </motion.p>
            </motion.div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
