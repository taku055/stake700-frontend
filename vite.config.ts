import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        // Make SVGR emit Preact-compatible JSX
        jsxRuntime: "automatic",
        // jsxImportSource: "preact",
        // Optional: scale to 1em so icons size with font
        icon: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3002,
    host: "0.0.0.0",
  },
});
