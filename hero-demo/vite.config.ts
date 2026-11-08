import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site has no build step: this bundle is built here and committed to
// static/js/hero-demo/. Stable file names (no hashes) because sw.js caches by
// CACHE_VERSION, not by file name; bump it after rebuilding.
export default defineConfig({
  plugins: [react()],
  base: '/static/js/hero-demo/',
  build: {
    outDir: '../static/js/hero-demo',
    emptyOutDir: true,
    target: 'es2020',
    // The polyfill is an inline script, which the CSP (script-src 'self') blocks
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'hero-demo.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
