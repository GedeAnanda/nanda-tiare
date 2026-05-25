import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        blush: "#FFD6E0",
        peach: "#FFB4A2",
        rose: "#FF8FA3",
        lavender: "#E0BBE4",
        mint: "#B5EAD7",
        butter: "#FFF3B0",
        sky: "#C7F0FF",
        "deep-rose": "#D4527A",
        ink: "#4A3B47",
      },
      fontFamily: {
        handwritten: ["var(--font-caveat)", "cursive"],
        body: ["var(--font-quicksand)", "sans-serif"],
        accent: ["var(--font-fredoka)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(255, 143, 163, 0.15)",
        "soft-lg": "0 8px 40px rgba(255, 143, 163, 0.2)",
        "soft-xl": "0 12px 60px rgba(255, 143, 163, 0.25)",
        pink: "0 4px 20px rgba(255, 214, 224, 0.5)",
        lavender: "0 4px 20px rgba(224, 187, 228, 0.5)",
        mint: "0 4px 20px rgba(181, 234, 215, 0.5)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "drift": "drift 15s linear infinite",
        "drift-reverse": "drift-reverse 18s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        drift: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(10px, -20px) rotate(5deg)" },
          "50%": { transform: "translate(-5px, -40px) rotate(-3deg)" },
          "75%": { transform: "translate(15px, -60px) rotate(7deg)" },
          "100%": { transform: "translate(0, -100vh) rotate(0deg)" },
        },
        "drift-reverse": {
          "0%": { transform: "translate(0, -100vh) rotate(0deg)" },
          "100%": { transform: "translate(0, 100vh) rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
