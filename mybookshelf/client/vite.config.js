// vite.config.js
// Vite is the dev server + bundler for the React frontend.
// The proxy below means any request your code makes to "/api/..."
// gets forwarded to http://localhost:4000 (your Express server),
// which avoids CORS headaches during development.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
