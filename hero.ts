// hero.ts
import { heroui } from "@heroui/react";
export default heroui({
  defaultTheme: "dark",
  themes: {
    dark: {
      colors: {
        background: "#1a2c38",
        foreground: {
          50: "#0f212e",
          100: "#1a2c38",
          200: "#213743",
          300: "#2f4553",
          400: "#557086",
          500: "#b1bad3",
          600: "#c5cde0",
          700: "#d5dbe6",
          800: "#eef1f6",
          900: "#ffffff",
          DEFAULT: "#ffffff",
        },
        default: {
          50: "#0f212e",
          100: "#1a2c38",
          200: "#213743",
          300: "#2f4553",
          400: "#3d5564",
          500: "#557086",
          600: "#8b9bb0",
          700: "#b1bad3",
          800: "#d5dbe6",
          900: "#f4f6f8",
          DEFAULT: "#213743",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#1475e1",
          foreground: "#ffffff",
        },
        focus: "#1475e1",
        content1: "#213743",
        content2: "#0f212e",
        content3: "#2f4553",
        content4: "#3d5564",
        divider: "rgba(177, 186, 211, 0.16)",
      },
    },
  },
});
