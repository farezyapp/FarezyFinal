import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "Client/src"),      // '@' points to Client/src
      "@shared": path.resolve(__dirname, "shared"),    // shared folder at repo root
      "@assets": path.resolve(__dirname, "attached_assets"), // assets folder at repo root
    },
  },
  root: path.resolve(__dirname, "Client"),             // project root for Vite is Client
  build: {
    outDir: path.resolve(__dirname, "dist/public"),    // build output
    emptyOutDir: true,
  },
});
