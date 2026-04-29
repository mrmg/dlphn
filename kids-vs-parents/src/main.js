import '../../src/firebase.js';
import './styles.css';

const BASE_PATH = '/kids-vs-parents';

function routeFromPathname(pathname) {
  const safePath = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : '/';
  const segments = safePath.split('/').filter(Boolean);
  const [mode, quizSlug = ''] = segments;
  return { mode: mode || 'home', quizSlug };
}

function routeDescription({ mode, quizSlug }) {
  if (mode === 'quiz') {
    return `Parent quiz flow for "${quizSlug || 'missing-quiz-slug'}".`;
  }
  if (mode === 'kids') {
    return `Kids team entry flow for "${quizSlug || 'missing-quiz-slug'}".`;
  }
  if (mode === 'admin') {
    return `Admin dashboard for "${quizSlug || 'missing-quiz-slug'}".`;
  }
  if (mode === 'result') {
    return `Result view route scaffold.`;
  }
  if (mode === 'final') {
    return `Public final reveal route scaffold.`;
  }
  return 'Landing route scaffold. Choose a quiz route below.';
}

function buildLink(path, label) {
  return `<a class="button" href="${path}">${label}</a>`;
}

function render() {
  const app = document.querySelector('#app');
  if (!app) return;

  const route = routeFromPathname(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const player = params.get('player') || 'parent';
  const key = params.get('key') ? '(key present)' : '(no key)';

  app.innerHTML = `
    <main class="page">
      <section class="card">
        <h1>Dolphin Kids vs Parents</h1>
        <p>
          Route scaffold for local and Firebase-hosted deep links.
          This shell is quiz-agnostic and resolves route info from the URL.
        </p>
        <p><strong>Current route:</strong> <code>${window.location.pathname}</code></p>
        <p><strong>Resolved mode:</strong> <code>${route.mode}</code></p>
        <p><strong>Quiz slug:</strong> <code>${route.quizSlug || 'none'}</code></p>
        <p><strong>Player param:</strong> <code>${player}</code> - <strong>Admin key:</strong> <code>${key}</code></p>
      </section>

      <section class="card">
        <h2>Route behavior</h2>
        <p>${routeDescription(route)}</p>
      </section>

      <section class="card">
        <h2>Quick route checks</h2>
        <div class="button-row">
          ${buildLink('/kids-vs-parents', 'Landing')}
          ${buildLink('/kids-vs-parents/quiz/battle-1066?player=parent', 'Parent: battle-1066')}
          ${buildLink('/kids-vs-parents/quiz/space-explorers?player=parent', 'Parent: space-explorers')}
          ${buildLink('/kids-vs-parents/kids/battle-1066?key=DEMO', 'Kids mode')}
          ${buildLink('/kids-vs-parents/admin/battle-1066?key=DEMO', 'Admin mode')}
          ${buildLink('/kids-vs-parents/final/battle-1066', 'Final reveal')}
        </div>
      </section>
    </main>
  `;
}

render();
