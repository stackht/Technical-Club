import type { Config } from "tailwindcss"
import daisyui from "daisyui"

const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00E5FF",
        neonGreen: "#00FF00",
        ink: "#050805",
        white: "#D7FFD9",
        black: "#040604",
      },
      fontFamily: {
        orbitron: [
          "Cascadia Mono",
          "Consolas",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Liberation Mono",
          "ui-monospace",
          "monospace",
        ],
        space: [
          "Cascadia Mono",
          "Consolas",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Liberation Mono",
          "ui-monospace",
          "monospace",
        ],
        cinzel: [
          "Cascadia Mono",
          "Consolas",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Liberation Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        neon: "0 0 18px rgba(0, 255, 0, 0.55), 0 0 50px rgba(0, 229, 255, 0.3)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 15% 15%, rgba(0,255,0,0.22), transparent 35%), radial-gradient(circle at 80% 20%, rgba(0,229,255,0.16), transparent 40%)",
      },
    },
  },
  plugins: [daisyui],
  // DaisyUI config (cast to avoid type errors in strict TS)
  daisyui: {
    themes: ["dark"],
    darkTheme: "dark",
  },
} satisfies Config & { daisyui: { themes: string[]; darkTheme: string } }

export default config
