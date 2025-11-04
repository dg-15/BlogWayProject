import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [daisyui, require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        blogLight: {
          // Base theme: light, minimalist, and professional
          ...require("daisyui/src/theming/themes")["light"],

          /* 🎨 BlogWay Blue–White Theme */
          primary: "#2563eb", // Blue (main brand color)
          "primary-focus": "#1e3a8a", // Deeper blue hover
          "primary-content": "#ffffff",

          secondary: "#e0f2fe", // Subtle light-blue tint
          accent: "#93c5fd", // Accent blue
          neutral: "#64748b", // Muted gray-blue for text

          "base-100": "#ffffff", // Page background
          "base-200": "#f9fafb", // Card backgrounds
          "base-300": "#f3f4f6",
          "base-content": "#1f2937", // Text color (near-black)

          info: "#3b82f6",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#dc2626",
        },
      },
    ],
    darkTheme: "blogLight", // we stay light-mode only for clean blog UI
  },
};
