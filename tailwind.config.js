/** @type {import('tailwindcss').Config} */
export default {
  // 🎯 DÜZELTME: index.html dosyasını da tarama listesine ekledik
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1020px",
      xl: "1440px",
    },
    extend: {
      // Tailwind v4 reads the real tokens from the `@theme` block in
      // src/index.css; this mirror exists only so editor tooling and anything
      // still reaching for a config file see the same Obsidian Pulse values.
      colors: {
        abyss: "#0e0e0e",
        depth: "#1c1b1b",
        "depth-2": "#2a2a2a",
        ridge: "#5c4037",
        pulse: "#ff571a",
        "pulse-dim": "#ffb59e",
        gain: "#5fe3a6",
        loss: "#ff5d73",
        orchid: "#d1bcff",
        foam: "#e5e2e1",
        mist: "#ad897e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        180: "32rem",
      },
    },
  },
  plugins: [],
};