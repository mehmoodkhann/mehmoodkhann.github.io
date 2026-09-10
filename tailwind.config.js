const color = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          "base",
          "surface",
          "surfacealt",
          "line",
          "ink",
          "muted",
          "accent",
          "signal",
        ].map((name) => [name, color(name)]),
      ),
      fontFamily: {
        display: ['"Space Grotesk"', "Arial", "sans-serif"],
        body: ['"IBM Plex Sans"', "Arial", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 5.6vw, 5.2rem)",
          { lineHeight: "1.08", letterSpacing: "-0.055em" },
        ],
        "display-lg": [
          "clamp(2.5rem, 5vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.045em" },
        ],
        "display-md": [
          "clamp(2rem, 3.5vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.04em" },
        ],
      },
      maxWidth: { prose: "65ch", shell: "1280px" },
      transitionTimingFunction: { signature: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [],
};
