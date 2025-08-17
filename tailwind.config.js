/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)",
      },
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          300: "#cbd5e1",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        red: {
          100: "#fee2e2",
          400: "#f87171",
          700: "#b91c1c",
        },
        blue: {
          50: "#eff6ff",
          600: "#2563eb",
        },
        indigo: {
          100: "#e0e7ff",
        },
        gray: {
          600: "#4b5563",
          900: "#111827",
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
