import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ApolloProvider: path.resolve(__dirname, "./src/ApolloProvider"),
      App: path.resolve(__dirname, "./src/App"),
      AppRouter: path.resolve(__dirname, "./src/AppRouter"),
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      images: path.resolve(__dirname, "./src/images"),
      services: path.resolve(__dirname, "./src/services"),
      stores: path.resolve(__dirname, "./src/stores"),
      styles: path.resolve(__dirname, "./src/styles"),
      types: path.resolve(__dirname, "./src/types")
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: "build"
  }
});
