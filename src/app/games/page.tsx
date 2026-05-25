"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { quizQuestions } from "@/lib/content";
import { useLocalStorage, useHaptic, useSoundEffect } from "@/lib/hooks";
import ConfettiBurst from "@/components/ui/ConfettiBurst";
import { randomBetween } from "@/lib/utils";

type GameMode = "hub" | "catch" | "quiz";

// ============================================================
// GAME HUB
// ============================================================
function GameHub({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("catch")}
          className="sticker-card p-6 cursor-pointer bg-gradient-to-br from-blush/30 to-rose/20 relative overflow-hidden"
          style={{ transform: "rotate(-1deg)" }}
        >
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              💗
            </motion.span>
            <div>
              <h3 className="font-handwritten text-2xl text-deep-rose">
                Catch the Hearts 💗
              </h3>
              <p className="font-body text-sm text-ink/50 mt-1">
                Tangkep hati yang jatoh! 30 detik, berapa banyak yang kamu dapet?
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("quiz")}
          className="sticker-card p-6 cursor-pointer bg-gradient-to-br from-lavender/30 to-sky/20 relative overflow-hidden"
          style={{ transform: "rotate(1deg)" }}
        >
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🤔
            </motion.span>
            <div>
              <h3 className="font-handwritten text-2xl text-deep-rose">
                Seberapa Kenal? 🤔
              </h3>
              <p className="font-body text-sm text-ink/50 mt-1">
                Quiz tentang Nanda! 10 pertanyaan, buktiin kamu soulmate-nya.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// CATCH THE HEARTS GAME
// ============================================================
interface FallingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
  isGolden: boolean;
  emoji: string;
}

function CatchHeartsGame({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [gameState, setGameState] = useState<"ready" | "playing" | "ended">("ready");
  const [highScore, setHighScore] = useLocalStorage("catch-hearts-high", 0);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const haptic = useHaptic();
  const sound = useSoundEffect();
  const heartIdRef = useRef(0);

  // Spawn hearts
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const isGolden = Math.random() < 0.1;
      const newHeart: FallingHeart = {
        id: heartIdRef.current++,
        x: randomBetween(10, 90),
        y: -5,
        speed: randomBetween(1.5, 3.5),
        isGolden,
        emoji: isGolden ? "⭐" : ["💗", "💕", "💖", "❤️", "🩷"][Math.floor(Math.random() * 5)],
      };
      setHearts((prev) => [...prev, newHeart]);
    }, 500);
    return () => clearInterval(interval);
  }, [gameState]);

  // Move hearts down
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((h) => ({ ...h, y: h.y + h.speed }))
          .filter((h) => h.y < 110) // Remove hearts that fell off
      );
    }, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // End game
  useEffect(() => {
    if (gameState === "ended") {
      if (score > highScore) {
        setHighScore(score);
        setShowConfetti(true);
      }
    }
  }, [gameState, score, highScore, setHighScore]);

  const catchHeart = (heart: FallingHeart) => {
    haptic(30);
    sound.playPop();
    const points = heart.isGolden ? 5 : 1;
    setScore((prev) => prev + points);
    setHearts((prev) => prev.filter((h) => h.id !== heart.id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setHearts([]);
    setGameState("playing");
    heartIdRef.current = 0;
  };

  const getEndMessage = () => {
    if (score >= 50) return "AMAZING!! Kamu cinta banget ya sama Nanda 🥹💗";
    if (score >= 30) return "Hebat! Nanda bangga sama kamu 🥰";
    if (score >= 15) return "Lumayan! Coba lagi biar lebih banyak 💪";
    return "Yah dikit banget 😂 Ayo coba lagi!";
  };

  return (
    <div className="max-w-md mx-auto">
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <AnimatePresence mode="wait">
        {gameState === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.span
              animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl inline-block mb-4"
            >
              💗
            </motion.span>
            <h2 className="font-handwritten text-3xl text-deep-rose mb-2">
              Catch the Hearts!
            </h2>
            <p className="font-body text-sm text-ink/50 mb-4">
              Tap hati yang jatoh untuk dapetin poin!<br />
              ⭐ = 5 poin, 💗 = 1 poin
            </p>
            {highScore > 0 && (
              <p className="font-body text-xs text-deep-rose mb-4">
                High Score: {highScore} 🏆
              </p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-deep-rose text-white font-accent text-base px-8 py-3.5 rounded-full shadow-soft-lg"
            >
              Mulai! 🎮
            </motion.button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* HUD */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-white rounded-full px-4 py-2 shadow-soft">
                <span className="font-accent text-sm font-bold text-deep-rose">
                  💗 {score}
                </span>
              </div>
              <motion.div
                animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`bg-white rounded-full px-4 py-2 shadow-soft ${
                  timeLeft <= 5 ? "border-2 border-rose" : ""
                }`}
              >
                <span className={`font-accent text-sm font-bold ${
                  timeLeft <= 5 ? "text-red-500" : "text-ink"
                }`}>
                  ⏰ {timeLeft}s
                </span>
              </motion.div>
            </div>

            {/* Game area */}
            <div
              ref={gameRef}
              className="relative w-full h-[60vh] bg-gradient-to-b from-sky/20 to-blush/20 rounded-3xl overflow-hidden border-2 border-blush/30 touch-none"
            >
              {hearts.map((heart) => (
                <motion.button
                  key={heart.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute text-2xl sm:text-3xl cursor-pointer select-none ${
                    heart.isGolden ? "text-3xl sm:text-4xl" : ""
                  }`}
                  style={{
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onPointerDown={() => catchHeart(heart)}
                >
                  <motion.span
                    animate={heart.isGolden ? { 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    } : {
                      rotate: [-10, 10, -10],
                    }}
                    transition={{
                      duration: heart.isGolden ? 1 : 0.5,
                      repeat: Infinity,
                    }}
                    className="inline-block"
                  >
                    {heart.emoji}
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === "ended" && (
          <motion.div
            key="ended"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-6xl inline-block mb-4"
            >
              🏆
            </motion.span>
            <h2 className="font-handwritten text-3xl text-deep-rose mb-2">
              Skor kamu: {score}!
            </h2>
            <p className="font-body text-sm text-ink/60 mb-2">
              {getEndMessage()}
            </p>
            {score > highScore && (
              <p className="font-accent text-sm text-deep-rose font-bold mb-4">
                🎉 New High Score!!
              </p>
            )}
            {score <= highScore && highScore > 0 && (
              <p className="font-body text-xs text-ink/40 mb-4">
                High Score: {highScore} 🏆
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-deep-rose text-white font-accent text-sm px-6 py-3 rounded-full shadow-soft"
              >
                Main Lagi! 🔄
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-white text-deep-rose font-accent text-sm px-6 py-3 rounded-full shadow-soft border border-blush/30"
              >
                Kembali
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// QUIZ GAME
// ============================================================
function QuizGame({ onBack }: { onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"playing" | "ended">("playing");
  const [showConfetti, setShowConfetti] = useState(false);
  const haptic = useHaptic();
  const sound = useSoundEffect();

  const question = quizQuestions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    haptic(30);
    setSelectedIdx(idx);
    setAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
      setShowConfetti(true);
    } else {
      sound.playWrong();
    }
  };

  const nextQuestion = () => {
    if (currentQ >= quizQuestions.length - 1) {
      setGameState("ended");
      return;
    }
    setCurrentQ((prev) => prev + 1);
    setAnswered(false);
    setSelectedIdx(null);
  };

  const getResultMessage = () => {
    const percent = (score / quizQuestions.length) * 100;
    if (percent === 100) return { emoji: "💍", text: "Soulmate confirmed 💍✨" };
    if (percent >= 70) return { emoji: "🥰", text: "Lumayan kenal! 🥰" };
    if (percent >= 40) return { emoji: "🙃", text: "Hmm, perlu lebih sering ngobrol 🙃" };
    return { emoji: "😭", text: "Tiare ini Nanda apa siapa sih 😭" };
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedIdx(null);
    setGameState("playing");
  };

  return (
    <div className="max-w-md mx-auto">
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <AnimatePresence mode="wait">
        {gameState === "playing" && (
          <motion.div
            key={`question-${currentQ}`}
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-blush/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-rose to-deep-rose rounded-full"
                />
              </div>
              <span className="font-body text-xs text-ink/50">
                {currentQ + 1}/{quizQuestions.length}
              </span>
            </div>

            {/* Question card */}
            <div className="sticker-card p-6 mb-6">
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl inline-block mb-3"
              >
                {question.emoji}
              </motion.span>
              <h3 className="font-handwritten text-2xl text-deep-rose">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {question.options.map((option, idx) => {
                const isCorrect = idx === question.correctIndex;
                const isSelected = idx === selectedIdx;

                let bgClass = "bg-white border-blush/20 hover:border-rose/50";
                if (answered) {
                  if (isCorrect) bgClass = "bg-mint/40 border-mint";
                  else if (isSelected) bgClass = "bg-rose/20 border-rose";
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(idx)}
                    className={`text-left p-4 rounded-2xl border-2 ${bgClass} shadow-soft transition-all font-body text-sm text-ink/80`}
                  >
                    <span className="font-accent text-xs text-deep-rose/60 mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                    {answered && isCorrect && " ✅"}
                    {answered && isSelected && !isCorrect && " ❌"}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback + Next */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <p className="font-handwritten text-lg mb-3">
                    {selectedIdx === question.correctIndex
                      ? "Bener! Kamu emang kenal Nanda 🥰"
                      : "Yah salah 🥲 Nggak apa-apa!"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="bg-deep-rose text-white font-accent text-sm px-6 py-3 rounded-full shadow-soft"
                  >
                    {currentQ >= quizQuestions.length - 1 ? "Lihat Hasil! 🎉" : "Lanjut →"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === "ended" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-6xl inline-block mb-4"
            >
              {getResultMessage().emoji}
            </motion.span>
            <h2 className="font-handwritten text-3xl text-deep-rose mb-2">
              Skor: {score}/{quizQuestions.length}
            </h2>
            <p className="font-body text-base text-ink/60 mb-6">
              {getResultMessage().text}
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="bg-deep-rose text-white font-accent text-sm px-6 py-3 rounded-full shadow-soft"
              >
                Coba Lagi! 🔄
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-white text-deep-rose font-accent text-sm px-6 py-3 rounded-full shadow-soft border border-blush/30"
              >
                Kembali
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// GAMES PAGE
// ============================================================
export default function GamesPage() {
  const [gameMode, setGameMode] = useState<GameMode>("hub");

  return (
    <div className="min-h-screen bg-pastel-gradient-3 px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          {gameMode === "hub" ? "Mini Games 🎮" : gameMode === "catch" ? "Catch Hearts 💗" : "Quiz Time 🤔"}
        </h1>
        <p className="font-body text-sm text-ink/50">
          {gameMode === "hub" ? "Yuk main game-nya, sayang! ✨" : "Semangat! 💪"}
        </p>
        {gameMode !== "hub" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("hub")}
            className="mt-3 font-body text-xs text-deep-rose/60 underline"
          >
            ← Kembali ke Game Hub
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {gameMode === "hub" && (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameHub onSelect={setGameMode} />
          </motion.div>
        )}
        {gameMode === "catch" && (
          <motion.div
            key="catch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CatchHeartsGame onBack={() => setGameMode("hub")} />
          </motion.div>
        )}
        {gameMode === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizGame onBack={() => setGameMode("hub")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
