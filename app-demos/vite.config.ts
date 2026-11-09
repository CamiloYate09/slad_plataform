import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site has no build step: these demos are built here and committed to
// static/js/app-demos/. Stable file names (no hashes) because sw.js caches by
// CACHE_VERSION, not by file name; bump it after rebuilding.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/static/js/app-demos/' : '/',
  // In dev the site root is served as-is, so preview.html gets the site's
  // fonts and /image/ icons at the same URLs the published page uses
  publicDir: command === 'serve' ? '..' : false,
  build: {
    outDir: '../static/js/app-demos',
    emptyOutDir: true,
    target: 'es2020',
    // The polyfill is an inline script, which the CSP (script-src 'self') blocks
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'app-demos.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        // One React chunk shared by every demo
        manualChunks: { react: ['react', 'react-dom', 'react-dom/client'] },
      },
    },
  },
}))
