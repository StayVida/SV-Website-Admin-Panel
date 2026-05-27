import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-recharts";
            }
            if (id.includes("@radix-ui") || id.includes("class-variance-authority") || id.includes("tailwind-merge")) {
              return "vendor-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
}));
