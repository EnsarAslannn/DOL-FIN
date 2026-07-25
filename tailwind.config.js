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
      colors: {
        abyss: "#071316",
        depth: "#0e2126",
        "depth-2": "#14313a",
        ridge: "#1b4a47",
        pulse: "#45e8d6",
        "pulse-dim": "#2b9c90",
        gain: "#5fe3a6",
        loss: "#ff7a66",
        foam: "#eaf6f4",
        mist: "#82a6a3",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      spacing: {
        180: "32rem",
      },
    },
  },
  plugins: [],
};