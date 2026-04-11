import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'


/**
 * Vite configuration for the Black Hole Basin frontend.
 * Registers plugins for Tailwind CSS and React Router SSR.
 * tsconfig path aliases are resolved natively via `resolve.tsconfigPaths`.
 */
export default defineConfig({
  plugins: [ tailwindcss(), reactRouter() ],
  resolve: { tsconfigPaths: true }
})
