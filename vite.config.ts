import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [tanstackStart()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});