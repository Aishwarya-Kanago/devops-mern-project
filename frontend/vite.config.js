import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  // Serve app from root path
  base: "/",
  plugins: [react()],
});
