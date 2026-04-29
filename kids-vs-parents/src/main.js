import './styles.css';
import confetti from 'canvas-confetti';
import {
  loadAdminSummary,
  loadLatestKidsSubmission,
  loadQuizBySlug,
  loadSubmissionById,
  scoreAnswers,
  submitKidsQuiz,
  submitParentQuiz
} from './services/quizService.js';

const BASE_PATH = '/kids-vs-parents';
const DEFAULT_QUIZ_SLUG = 'east-sussex';

const state = {
  loading: false,
  error: '',
  info: '',
  submitted: false,
  submissionId: '',
  name: '',
  currentIndex: 0,
  selectedByQuestionId: {},
  quiz: null,
  questions: [],
  route: null,
  resultSubmission: null,
  kidsLatest: null,
  adminSummary: null,
  confettiFired: false
};

function routeFromPathname(pathname) {
  const safePath = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : '/';
  const segments = safePath.split('/').filter(Boolean);
  const [mode, quizSlug = '', routeId = ''] = segments;
  return { mode: mode || 'home', quizSlug, routeId };
}

function setError(message) {
  state.error = message;
}

function setInfo(message) {
  state.info = message;
}

function resetTransientState() {
  state.error = '';
  state.info = '';
  state.submitted = false;
  state.submissionId = '';
  state.currentIndex = 0;
  state.selectedByQuestionId = {};
  state.resultSubmission = null;
  state.kidsLatest = null;
  state.adminSummary = null;
  state.confettiFired = false;
}

async function loadRouteData() {
  const route = routeFromPathname(window.location.pathname);
  state.route = route;
  const quizSlug = route.quizSlug || DEFAULT_QUIZ_SLUG;
  resetTransientState();
  state.loading = true;
  render();

  const data = await loadQuizBySlug(quizSlug);
  if (!data || !data.quiz || !Array.isArray(data.questions) || data.questions.length === 0) {
    setError(`No quiz data found for "${quizSlug}".`);
    state.quiz = null;
    state.questions = [];
    state.loading = false;
    render();
    return;
  }

  state.quiz = data.quiz;
  state.questions = data.questions;

  try {
    if (route.mode === 'result' && route.routeId) {
      state.resultSubmission = await loadSubmissionById(quizSlug, route.routeId);
      state.kidsLatest = await loadLatestKidsSubmission(quizSlug);
      if (!state.resultSubmission) {
        setError(`Result "${route.routeId}" was not found.`);
      }
    }
    if (route.mode === 'admin') {
      state.adminSummary = await loadAdminSummary(quizSlug);
    }
  } catch (error) {
    setError(`Failed to load route data: ${error.message}`);
  }

  state.loading = false;
  render();
}

function onSelect(questionId, selectedOptionId) {
  state.selectedByQuestionId = {
    ...state.selectedByQuestionId,
    [questionId]: selectedOptionId
  };
  const app = document.querySelector('#app');
  if (!app) return;
  app.querySelectorAll(`[data-choice-question="${questionId}"]`).forEach((btn) => {
    const optId = btn.dataset.choiceOption;
    if (optId === selectedOptionId) {
      btn.classList.add('kvp-choice--selected');
    } else {
      btn.classList.remove('kvp-choice--selected');
    }
  });
  const submitBtn = app.querySelector('[data-submit]');
  if (submitBtn) {
    if (allQuestionsAnswered()) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', '');
    }
  }
}

function allQuestionsAnswered() {
  return state.questions.every((q) => state.selectedByQuestionId[q.id]);
}

async function onSubmit() {
  if (!state.quiz || !state.route) return;
  if (!allQuestionsAnswered()) {
    setError('Please answer every question before submitting.');
    render();
    return;
  }
  setError('');
  setInfo('');
  const scoring = scoreAnswers(state.questions, state.selectedByQuestionId);
  state.loading = true;
  render();
  try {
    const quizSlug = state.quiz.slug || state.quiz.id || DEFAULT_QUIZ_SLUG;
    let submissionId = '';
    if (state.route.mode === 'kids') {
      submissionId = await submitKidsQuiz({
        quizSlug,
        quizTitle: state.quiz.title || 'Dolphin Kids vs Parents Quiz',
        scoring
      });
      setInfo('Kids team score saved.');
    } else {
      submissionId = await submitParentQuiz({
        quizSlug,
        quizTitle: state.quiz.title || 'Dolphin Kids vs Parents Quiz',
        playerName: state.name,
        scoring
      });
    }
    state.submitted = true;
    state.submissionId = submissionId;
  } catch (error) {
    setError(`Unable to save submission: ${error.message}`);
  } finally {
    state.loading = false;
    render();
  }
}

function renderMedia(media) {
  if (!media) return '';

  if (media.type === 'image') {
    return `
      <div class="kvp-media kvp-media--image">
        <img src="${media.url}" alt="${media.altText || 'Question image'}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="kvp-media-fallback" style="display:none;">
          <span>🖼️ Image failed to load</span>
        </div>
      </div>
    `;
  }

  if (media.type === 'audio') {
    return `
      <div class="kvp-media kvp-media--audio">
        <div class="kvp-media-placeholder">
          <span style="font-size:2rem;">🎵</span>
          <span>${media.caption || 'Audio clip'}</span>
        </div>
      </div>
    `;
  }

  if (media.type === 'video') {
    return `
      <div class="kvp-media kvp-media--video">
        <div class="kvp-media-placeholder">
          <span style="font-size:2rem;">🎬</span>
          <span>${media.caption || 'Video clip'}</span>
        </div>
      </div>
    `;
  }

  return '';
}

function renderProgressBar() {
  const current = state.currentIndex + 1;
  const total = state.questions.length;
  const percent = Math.round((current / total) * 100);
  return `
    <div class="kvp-progress">
      <div class="kvp-progress-text">Question ${current} of ${total}</div>
      <div class="kvp-progress-bar">
        <div class="kvp-progress-fill" style="width:${percent}%"></div>
      </div>
    </div>
  `;
}

function fireConfetti(type) {
  if (state.confettiFired) return;
  state.confettiFired = true;

  setTimeout(() => {
    if (type === 'win') {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'] });
      confetti({ particleCount: 75, spread: 120, origin: { y: 0.6 }, angle: 60, colors: ['#FFD700', '#FF6B6B'] });
      confetti({ particleCount: 75, spread: 120, origin: { y: 0.6 }, angle: 120, colors: ['#FFD700', '#FF6B6B'] });
    } else if (type === 'draw') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700', '#C0C0C0', '#CD7F32'] });
    } else if (type === 'lose') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#87CEEB', '#98FB98'] });
    }
  }, 300);
}

function render() {
  const app = document.querySelector('#app');
  if (!app) return;

  const route = state.route || routeFromPathname(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const player = params.get('player') || 'parent';
  const key = params.get('key') || '';
  const isParentQuiz = route.mode === 'quiz' && player !== 'kids';
  const isKidsMode = route.mode === 'kids';
  const isAdminMode = route.mode === 'admin';
  const isResultMode = route.mode === 'result';
  const isHomeMode = !isParentQuiz && !isKidsMode && !isAdminMode && !isResultMode;
  const adminKeyExpected = import.meta.env.VITE_KVP_ADMIN_KEY || 'DEMO';
  const adminAuthed = (isKidsMode || isAdminMode) ? key === adminKeyExpected : false;
  const currentQuestion = state.questions[state.currentIndex];
  const scoring = state.submitted ? scoreAnswers(state.questions, state.selectedByQuestionId) : null;

  if (isHomeMode) {
    app.innerHTML = `
      <div class="kvp-landing">
        <section class="kvp-hero">
          <span class="kvp-hero-icon">🛡️</span>
          <h1>Dolphin Kids vs Parents</h1>
          <p class="kvp-hero-subtitle">East Sussex Quiz &mdash; Can the grown-ups beat the kids?</p>
          <div class="kvp-hero-meta">
            <span class="kvp-hero-badge">🏰 Local History</span>
            <span class="kvp-hero-badge">🗺️ East Sussex</span>
          </div>
        </section>

        <div class="kvp-roles">
          <a class="kvp-role-btn kvp-role-btn--parent" href="${BASE_PATH}/quiz/${DEFAULT_QUIZ_SLUG}">
            <span class="kvp-role-icon">👔</span>
            <span>Parent Quiz &mdash; Take the challenge!</span>
          </a>
          <a class="kvp-role-btn kvp-role-btn--kid" href="${BASE_PATH}/kids/${DEFAULT_QUIZ_SLUG}?key=DEMO">
            <span class="kvp-role-icon">🔒</span>
            <span>Kids Team Entry &mdash; Admin key required</span>
          </a>
          <a class="kvp-role-btn" href="${BASE_PATH}/admin/${DEFAULT_QUIZ_SLUG}?key=DEMO">
            <span class="kvp-role-icon">⚙️</span>
            <span>Admin Dashboard</span>
          </a>
        </div>

        <details style="margin-top:2rem;opacity:0.5;font-size:0.8rem;color:var(--kvp-parchment);max-width:300px;">
          <summary>Route Debug</summary>
          <p><strong>Path:</strong> <code>${window.location.pathname}</code></p>
          <p><strong>Mode:</strong> <code>${route.mode}</code></p>
          <p><strong>Slug:</strong> <code>${route.quizSlug || 'none'}</code></p>
          <p><strong>Player:</strong> <code>${player}</code></p>
        </details>
      </div>
    `;
    return;
  }

  if (state.loading) {
    app.innerHTML = `
      <div class="kvp-container">
        <div class="kvp-loading">
          <div class="kvp-loading-spinner"></div>
          <p class="kvp-loading-text">Loading quiz data...</p>
        </div>
      </div>
    `;
    return;
  }

  if (state.error && !state.quiz) {
    app.innerHTML = `
      <div class="kvp-container">
        <div class="kvp-error">
          <p>${state.error}</p>
          <button class="kvp-btn kvp-btn--primary" onclick="window.location.reload()">Retry</button>
        </div>
      </div>
    `;
    return;
  }

  const canAnswerQuiz = (isParentQuiz || isKidsMode) && currentQuestion && (isParentQuiz || adminAuthed);

  if (canAnswerQuiz) {
    app.innerHTML = `
      <div class="kvp-container kvp-quiz">
        ${renderProgressBar()}

        <section class="kvp-quiz-card">
          <div class="kvp-question-number">${state.currentIndex + 1}</div>
          ${renderMedia(currentQuestion.media)}
          <p class="kvp-question">${currentQuestion.text}</p>
          <div class="kvp-choices">
            ${(currentQuestion.options || []).map((option) => {
              const selected = state.selectedByQuestionId[currentQuestion.id] === option.id;
              return `
                <button
                  class="kvp-choice ${selected ? 'kvp-choice--selected' : ''}"
                  data-choice-question="${currentQuestion.id}"
                  data-choice-option="${option.id}"
                  type="button"
                >
                  ${option.text}
                </button>
              `;
            }).join('')}
          </div>
          <div class="kvp-btn-row">
            <button class="kvp-btn kvp-btn--back" type="button" data-back ${state.currentIndex === 0 ? 'disabled' : ''}>Back</button>
            ${state.currentIndex < state.questions.length - 1 ? `
              <button class="kvp-btn kvp-btn--primary" type="button" data-next>Next Question →</button>
            ` : `
              <button class="kvp-btn kvp-btn--primary" type="button" data-submit ${allQuestionsAnswered() ? '' : 'disabled'}>${isKidsMode ? 'Save Kids Score' : 'Submit Answers'}</button>
            `}
          </div>
        </section>

        ${state.error ? `<div class="kvp-error">${state.error}</div>` : ''}
        ${state.info ? `<div class="kvp-success">${state.info}</div>` : ''}

        ${isParentQuiz ? `
          <div class="kvp-name-input-wrapper">
            <label class="kvp-name-label" for="playerName">Your name (optional)</label>
            <input id="playerName" data-player-name class="kvp-name-input" value="${state.name}" placeholder="Enter your name" />
          </div>
        ` : ''}

        ${isKidsMode && !adminAuthed ? '<div class="kvp-error">Add a valid <code>?key=...</code> for Kids Team entry.</div>' : ''}
      </div>
    `;
    return;
  }

  if (isAdminMode) {
    const quizSlug = state.quiz?.slug || state.quiz?.id || DEFAULT_QUIZ_SLUG;
    app.innerHTML = `
      <div class="kvp-admin">
        <div class="kvp-admin-header">
          <h2 class="kvp-admin-title">Admin Dashboard</h2>
        </div>

        ${!adminAuthed ? '<div class="kvp-error">Admin key missing or invalid.</div>' : ''}

        ${adminAuthed && state.adminSummary ? `
          <div class="kvp-admin-stats">
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${state.adminSummary.parentCount}</div>
              <div class="kvp-admin-stat-label">Parent Submissions</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${state.adminSummary.parentAverageScore}</div>
              <div class="kvp-admin-stat-label">Average Score</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${state.adminSummary.parentHighestScore}</div>
              <div class="kvp-admin-stat-label">Highest</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${state.adminSummary.parentLowestScore}</div>
              <div class="kvp-admin-stat-label">Lowest</div>
            </div>
          </div>

          <h3 class="kvp-admin-section-title">📊 Latest Kids Score</h3>
          <p style="color:var(--kvp-parchment);margin-bottom:1.5rem;">
            ${state.adminSummary.kidsLatest
              ? `${state.adminSummary.kidsLatest.score} / ${state.adminSummary.kidsLatest.maxScore}`
              : 'Not submitted yet'}
          </p>

          <h3 class="kvp-admin-section-title">📋 Quick Actions</h3>
          <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;">
            <button class="kvp-btn" data-copy-parent-link>Copy Parent Link</button>
            <button class="kvp-btn" data-copy-kids-link>Copy Kids Entry Link</button>
          </div>

          <h3 class="kvp-admin-section-title">📜 Recent Submissions</h3>
          <div class="kvp-admin-list">
            <div class="kvp-admin-list-header">
              <span>Name</span>
              <span>Score</span>
              <span>%</span>
              <span>Date</span>
            </div>
            ${(state.adminSummary.recentParents || []).map((item) => `
              <div class="kvp-admin-list-row">
                <span>${item.name || 'Anonymous'}</span>
                <span>${item.score} / ${item.maxScore}</span>
                <span>${item.percentage || 0}%</span>
                <span>${item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}</span>
              </div>
            `).join('') || '<div class="kvp-admin-list-row"><span>No parent submissions yet.</span></div>'}
          </div>
        ` : ''}

        ${state.info ? `<div class="kvp-success" style="margin-top:1rem;">${state.info}</div>` : ''}
      </div>
    `;
    return;
  }

  if (isResultMode && state.resultSubmission) {
    const parentScore = state.resultSubmission.score;
    const parentMax = state.resultSubmission.maxScore;
    const parentPercent = state.resultSubmission.percentage;

    let resultClass = '';
    let resultTitle = '';
    let resultIcon = '';
    let resultCopy = '';
    let confettiType = '';

    if (state.kidsLatest) {
      const kidsScore = state.kidsLatest.score;
      const kidsMax = state.kidsLatest.maxScore;
      const diff = parentScore - kidsScore;

      if (diff > 0) {
        resultClass = 'kvp-result--win';
        resultTitle = 'Victory!';
        resultIcon = '🏆';
        resultCopy = `You scored ${parentScore}/${parentMax}. The Kids scored ${kidsScore}/${kidsMax}. You beat the Kids by ${diff} points. Suspicious. Very suspicious. The Witan may need to investigate.`;
        confettiType = 'win';
      } else if (diff === 0) {
        resultClass = 'kvp-result--draw';
        resultTitle = 'Standoff!';
        resultIcon = '⚖️';
        resultCopy = `You scored ${parentScore}/${parentMax}. The Kids scored ${kidsScore}/${kidsMax}. A tense standoff on the battlefield. No one breaks the shield wall today.`;
        confettiType = 'draw';
      } else {
        resultClass = 'kvp-result--lose';
        resultTitle = 'Defeated!';
        resultIcon = '🛡️';
        resultCopy = `You scored ${parentScore}/${parentMax}. The Kids scored ${kidsScore}/${kidsMax}. The Kids beat you by ${Math.abs(diff)} points. The shield wall holds. Back to history class with you.`;
        confettiType = 'lose';
      }
    } else {
      resultTitle = 'Pending';
      resultIcon = '⏳';
      resultCopy = `You scored ${parentScore}/${parentMax}. The Kids' official score has not been entered yet. Check back later for your battlefield result.`;
    }

    if (confettiType) fireConfetti(confettiType);

    app.innerHTML = `
      <div class="kvp-container">
        <section class="kvp-result ${resultClass}">
          <div class="kvp-result-badge">${resultIcon}</div>
          <h2 class="kvp-result-title">${resultTitle}</h2>
          <div class="kvp-result-score">${parentPercent}%</div>
          <div style="color:var(--kvp-text-light);font-size:0.9rem;margin-bottom:1rem;">${parentScore} / ${parentMax}</div>
          <p class="kvp-result-message">${resultCopy}</p>
          <div style="display:flex;gap:0.75rem;justify-content:center;margin-top:1.5rem;">
            <a class="kvp-btn kvp-btn--primary" href="${BASE_PATH}/quiz/${state.quiz?.slug || state.quiz?.id || DEFAULT_QUIZ_SLUG}">Try Again</a>
            <a class="kvp-btn kvp-btn--ghost" href="${BASE_PATH}">Back to Home</a>
          </div>
        </section>
      </div>
    `;
    return;
  }

  if (isResultMode && !state.resultSubmission) {
    app.innerHTML = `
      <div class="kvp-container">
        <div class="kvp-error">
          <p>Result not found.</p>
          <a class="kvp-btn kvp-btn--primary" href="${BASE_PATH}">Back to Home</a>
        </div>
      </div>
    `;
    return;
  }

  if (isKidsMode && !adminAuthed) {
    app.innerHTML = `
      <div class="kvp-container">
        <div class="kvp-error">
          <p>🔒 Kids Team Entry requires an admin key.</p>
          <p>Add <code>?key=YOUR_KEY</code> to the URL.</p>
          <a class="kvp-btn kvp-btn--primary" href="${BASE_PATH}">Back to Home</a>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="kvp-container">
      <div class="kvp-error"><p>No quiz data loaded.</p></div>
      <a class="kvp-btn kvp-btn--primary" href="${BASE_PATH}">Back to Home</a>
    </div>
  `;
}

function mountEvents() {
  const app = document.querySelector('#app');
  if (!app) return;

  app.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('[data-choice-question]')) {
      const questionId = target.dataset.choiceQuestion;
      const optionId = target.dataset.choiceOption;
      if (!questionId || !optionId) return;
      onSelect(questionId, optionId);
      return;
    }

    if (target.matches('[data-next]')) {
      state.currentIndex = Math.min(state.currentIndex + 1, state.questions.length - 1);
      render();
      return;
    }
    if (target.matches('[data-back]')) {
      state.currentIndex = Math.max(state.currentIndex - 1, 0);
      render();
      return;
    }
    if (target.matches('[data-submit]')) {
      await onSubmit();
      if (state.route?.mode === 'quiz' && state.submissionId) {
        const slug = state.quiz?.slug || state.quiz?.id || DEFAULT_QUIZ_SLUG;
        window.location.href = `${BASE_PATH}/result/${slug}/${state.submissionId}`;
      }
    }

    if (target.matches('[data-copy-parent-link]')) {
      const slug = state.quiz?.slug || state.quiz?.id || DEFAULT_QUIZ_SLUG;
      const url = `${window.location.origin}${BASE_PATH}/quiz/${slug}`;
      navigator.clipboard.writeText(url).then(() => {
        setInfo('Parent link copied!');
        render();
        setTimeout(() => { state.info = ''; render(); }, 3000);
      });
    }

    if (target.matches('[data-copy-kids-link]')) {
      const slug = state.quiz?.slug || state.quiz?.id || DEFAULT_QUIZ_SLUG;
      const urlKey = import.meta.env.VITE_KVP_ADMIN_KEY || 'DEMO';
      const url = `${window.location.origin}${BASE_PATH}/kids/${slug}?key=${urlKey}`;
      navigator.clipboard.writeText(url).then(() => {
        setInfo('Kids entry link copied!');
        render();
        setTimeout(() => { state.info = ''; render(); }, 3000);
      });
    }
  });

  app.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.matches('[data-player-name]')) {
      state.name = target.value;
    }
  });
}

mountEvents();
loadRouteData();
