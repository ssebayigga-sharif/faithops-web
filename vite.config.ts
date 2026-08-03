import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          router: ["react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/database"],
          carbon: ["@carbon/react", "@carbon/icons-react"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
