import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" para que el build funcione servido desde un subdirectorio (GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
