/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Tailwind v4 reads the real tokens from the `@theme` block in
      // src/index.css — this file is never `@config`-imported and has no
      // effect on the build. It exists only so editor tooling sees the same
      // DESIGN.md values. Keep it in sync by hand, or delete it.
      colors: {
        cobalt: "#5266eb",
        "onyx-canvas": "#171721",
        "graphite-card": "#1e1e2a",
        "obsidian-button": "#272735",
        "slate-border": "#70707d",
        "ash-text": "#c3c3cc",
        "mist-border": "#e2e3ed",
        "ivory-text": "#ededf3",
        "pure-white": "#ffffff",
        "cream-canvas": "#ece5d8",
        "ink-muted": "#55555f",
        "footer-navy": "#14141b",
        gain: "#4ec98a",
        loss: "#f2707f",
      },
      fontFamily: {
        sans: ["Inter Tight", "sans-serif"],
        display: ["Inter Tight", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        caption: ["11px", { lineHeight: "1.5", letterSpacing: "-0.005em" }],
        body: ["15px", { lineHeight: "1.5", letterSpacing: "-0.005em" }],
        "body-lg": ["17px", { lineHeight: "1.4", letterSpacing: "-0.009em" }],
        subheading: ["19px", { lineHeight: "1.4", letterSpacing: "-0.009em" }],
        "heading-sm": ["22px", { lineHeight: "1.25", letterSpacing: "-0.012em" }],
        heading: ["30px", { lineHeight: "1.2", letterSpacing: "-0.013em" }],
        "heading-lg": ["45px", { lineHeight: "1.13", letterSpacing: "-0.015em" }],
        display: ["66px", { lineHeight: "1", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        smallcard: "5px",
        icon: "7.5px",
        card: "15px",
        nav: "15px",
        block: "28px",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "rgba(0, 0, 0, 0.05) 0px 2px 2px 0px",
      },
      maxWidth: {
        page: "1200px",
        wide: "1440px",
        terminal: "1760px",
      },
      spacing: {
        section: "75px",
        card: "19px",
        element: "11px",
        180: "32rem",
      },
    },
  },
  plugins: [],
};
