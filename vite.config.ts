import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Base path for GitHub Pages.
 * - Default './' works for ANY repository name (project pages live under /<repo>/),
 *   because the site uses HashRouter and only relative asset URLs.
 * - To force an absolute base, build with:  VITE_BASE=/your-repo/ npm run build
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react()],
  build: { sourcemap: false, chunkSizeWarningLimit: 700 },
});
