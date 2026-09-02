import { defineConfig } from 'vite';

// Clean URLs for the top-level pages, matching the Firebase rewrites. Used by dev and preview.
const CLEAN_URLS = {
  '/gallery': '/gallery.html',
  '/games': '/games.html',
  '/ideas': '/ideas.html',
  '/horrid': '/horrid/horrid.html',
  '/card': '/card/index.html'
};

function cleanUrls(req, res, next) {
  const [requestPath, query] = (req.url || '').split('?');
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(requestPath);
  const qs = query ? '?' + query : '';

  // The old Reception page is now a view of the home page.
  if (requestPath === '/reception') {
    res.statusCode = 302;
    res.setHeader('Location', '/?reception');
    res.end();
    return;
  }
  if (CLEAN_URLS[requestPath]) {
    req.url = CLEAN_URLS[requestPath] + qs;
    next();
    return;
  }
  if (requestPath === '/is-it-swimming-today') {
    req.url = '/is-it-swimming-today/index.html' + qs;
    next();
    return;
  }
  if (
    (requestPath === '/kids-vs-parents' || requestPath.startsWith('/kids-vs-parents/')) &&
    !hasFileExtension &&
    !requestPath.startsWith('/kids-vs-parents/src/')
  ) {
    req.url = '/kids-vs-parents/index.html' + qs;
    next();
    return;
  }
  if (
    (requestPath === '/half-term-fighter' || requestPath.startsWith('/half-term-fighter/')) &&
    !hasFileExtension &&
    !requestPath.startsWith('/half-term-fighter/src/') &&
    !requestPath.startsWith('/half-term-fighter/assets/')
  ) {
    req.url = '/half-term-fighter/index.html' + qs;
    next();
    return;
  }
  next();
}

export default defineConfig({
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) { server.middlewares.use(cleanUrls); },
      configurePreviewServer(server) { server.middlewares.use(cleanUrls); }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        gallery: 'gallery.html',
        games: 'games.html',
        ideas: 'ideas.html',
        card: 'card/index.html',
        horrid: 'horrid.html',
        'horrid-gallery': 'horrid-gallery.html',
        'horrid-main': 'horrid/horrid.html',
        'horrid-gallery-main': 'horrid/gallery.html',
        'horrid-gallery-redirect': 'horrid/gallery/index.html',
        'horrid-admin': 'horrid/admin.html',
        'kids-vs-parents': 'kids-vs-parents/index.html',
        'half-term-fighter': 'half-term-fighter/index.html'
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
