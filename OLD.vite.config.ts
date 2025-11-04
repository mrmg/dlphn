import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import fs from 'fs-extra';
import { createHtmlPlugin } from 'vite-plugin-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/',
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'firebase/app': 'firebase/app',
      'firebase/functions': 'firebase/functions',
      'firebase/firestore': 'firebase/firestore'
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/functions', 'firebase/firestore']
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ideas: resolve(__dirname, 'ideas.html'),
        card: resolve(__dirname, 'card/index.html'),
        monster: resolve(__dirname, 'monster.html')
      },
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/functions', 'firebase/firestore'],
          phaser: ['phaser']
        }
      }
    }
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Memory Art Generator'
        }
      }
    }),
    {
      name: 'copy-assets',
      closeBundle: async () => {
        await fs.copy('src/assets', 'dist/assets');
      }
    }
  ]
}); 
