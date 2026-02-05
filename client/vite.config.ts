import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            return null;
          }

          if (["react"].some((chunk) => id.includes(chunk))) {
            return "react";
          }

          if (["@apollo/client", "graphql"].some((chunk) => id.includes(chunk))) {
            return "graphql";
          }

          if (["@material-ui"].some((chunk) => id.includes(chunk))) {
            return "mui";
          }

          if (["@emotion"].some((chunk) => id.includes(chunk))) {
            return "emotion";
          }

          return "vendor";
        }
      }
    }
  }
});
