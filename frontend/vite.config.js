import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/treatment-stages": {
        target: "https://rilcet.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/evaluation": {
        target: "https://rilcet.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
