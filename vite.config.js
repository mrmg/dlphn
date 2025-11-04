import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        ideas: 'ideas.html',
        card: 'card/index.html',
        horrid: 'horrid.html',
        'horrid-gallery': 'horrid-gallery.html',
        'horrid-main': 'horrid/horrid.html',
        'horrid-gallery-main': 'horrid/gallery.html',
        'horrid-gallery-redirect': 'horrid/gallery/index.html',
        'horrid-admin': 'horrid/admin.html'
      },
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/functions', 'firebase/firestore'],
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: '/',
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/functions', 'firebase/firestore']
  },
  publicDir: 'public'
}); 
