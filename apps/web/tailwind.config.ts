import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        magenta: {
          50: "#fef0f7",
          100: "#fee3f0",
          200: "#ffc6e1",
          300: "#ff99c8",
          400: "#ff5ca3",
          500: "#E20074",
          600: "#cc0068",
          700: "#a30053",
          800: "#870045",
          900: "#70003a",
        },
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
