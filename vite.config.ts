import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration for the Black Hole Basin frontend.
 * Registers plugins for Tailwind CSS, React Router SSR, and tsconfig path aliases.
 */
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
