import './styles.css';
import {
  validateManifest,
  isReady,
  createAttempt,
  currentQuestion,
  responseFor,
  phaseOf,
  selectOption,
  lockAnswer,
  skipQuestion,
  nextQuestion,
  finishAttempt,
  replay,
  scoreAttempt,
  scoreBand,
  validateAttempt,
  resolveEligibility,
} from './state.js';
import { createStorage } from './storage.js';
import { createAudioController } from './audio.js';

function h(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function initThemeQuiz({ posterElement, config, round } = {}) {
  const state = {
    round,
    config: config || null,
    ctx: { primaryView: null, weekId: null, eligible: false },
    attempt: null,
    storage: null,
    storageEphemeral: false,
    launcher: null,
    dialog: null,
    ui: null,
    audio: null,
    unsub: null,
    lastFocus: null,
  };

  function manifestOk() {
    if (!state.round) return false;
    return validateManifest(state.round).ok;
  }
  function roundReady() {
    return isReady(state.round);
  }
  function ensureAttempt() {
    if (!state.round) return null;
    state.storage = createStorage(state.round.id, state.round.version);
    const loaded = state.storage.load(null);
    state.storageEphemeral = loaded.ephemeral === true;
    const valid = loaded.data ? validateAttempt(loaded.data, state.round) : null;
    state.attempt = valid || createAttempt(state.round);
    persist();
    return state.attempt;
  }
  function persist() {
    if (!state.storage || !state.attempt) return;
    const res = state.storage.save(state.attempt);
    state.storageEphemeral = res.ephemeral === true;
    const note = state.ui && state.ui.ephemeralNote;
    if (note) note.hidden = !state.storageEphemeral;
  }

  function buildLauncher() {
    const wrap = h('div', 'theme-quiz-launcher');
    wrap.hidden = true;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-quiz-launcher-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-controls', 'themeQuizDialog');
    btn.setAttribute('aria-label', 'Play Name That Theme');
    btn.innerHTML = '<svg viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm36.44,110.34-48,32a8,8,0,0,1-12.44-6.34V96a8,8,0,0,1,12.44-6.34l48,32a8,8,0,0,1,0,12.68Z"/></svg>';
    btn.addEventListener('click', onLaunch);
    const cap = h('div', 'theme-quiz-launcher-cap');
    cap.appendChild(h('strong', null, 'Name That Theme'));
    cap.appendChild(h('span', null, '10 TV & film themes. How many do you know?'));
    wrap.append(btn, cap);
    return { wrap, btn, cap };
  }

  function buildDialog() {
    const dialog = document.createElement('dialog');
    dialog.id = 'themeQuizDialog';
    dialog.className = 'theme-quiz';
    dialog.setAttribute('aria-labelledby', 'themeQuizTitle');
    const body = h('div', 'theme-quiz-body');
    const head = h('div', 'theme-quiz-head');
    const titleWrap = h('div');
    const title = h('h2', null, 'Name That Theme');
    title.id = 'themeQuizTitle';
    title.tabIndex = -1;
    titleWrap.append(title, h('p', 'theme-quiz-sub', 'The birthday edition'));
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'theme-quiz-close';
    closeBtn.textContent = 'Close quiz';
    closeBtn.addEventListener('click', () => dialog.close());
    head.append(titleWrap, closeBtn);
    const meta = h('div', 'theme-quiz-meta');
    const qpos = h('span', null, 'Question 1 of 10');
    const score = h('span', null, 'Score: 0');
    meta.append(qpos, score);
    const progress = h('div', 'theme-quiz-progress');
    progress.setAttribute('role', 'progressbar');
    const main = h('main', 'theme-quiz-main');
    const foot = h('div', 'theme-quiz-foot');
    const ephemeralNote = h('p', 'theme-quiz-live', 'Progress will last until you close this page.');
    ephemeralNote.hidden = true;
    body.append(head, meta, progress, main, ephemeralNote, foot);
    dialog.append(body);
    dialog.addEventListener('cancel', onDialogCancel);
    dialog.addEventListener('close', onDialogClose);
    return { dialog, title, qpos, score, progress, main, foot, ephemeralNote, closeBtn };
  }

  function clipUrl(q) {
    return q && q.audio ? q.audio.src : '';
  }

  function render() {
    if (!state.ui || !state.attempt || !state.round) return;
    const { main, foot, qpos, score, progress, title, ephemeralNote } = state.ui;
    ephemeralNote.hidden = !state.storageEphemeral;
    main.innerHTML = '';
    foot.innerHTML = '';
    progress.innerHTML = '';
    const sc = scoreAttempt(state.round, state.attempt);
    score.textContent = `Score: ${sc.score}`;
    state.round.questions.forEach((q, i) => {
      const dot = h('span', 'theme-quiz-dot' + (i < state.attempt.questionIndex || state.attempt.completed ? ' is-done' : i === state.attempt.questionIndex ? ' is-current' : ''));
      progress.append(dot);
    });
    progress.setAttribute('aria-valuetext', `Question ${Math.min(state.attempt.questionIndex + 1, state.round.questions.length)} of ${state.round.questions.length}`);
    if (state.attempt.completed) {
      renderResults();
      return;
    }
    const q = currentQuestion(state.round, state.attempt);
    const resp = responseFor(state.attempt, q.id);
    qpos.textContent = `Question ${state.attempt.questionIndex + 1} of ${state.round.questions.length}`;
    const qh = h('h3', 'theme-quiz-q', 'Which TV show or film is this from?');
    main.append(qh);
    const clip = h('div', 'theme-quiz-clip');
    const row = h('div', 'theme-quiz-clip-row');
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'theme-quiz-play';
    playBtn.textContent = 'Play';
    const replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.className = 'theme-quiz-replay';
    replayBtn.textContent = 'Replay from start';
    const time = h('span', 'theme-quiz-time', `0:00 / ${formatTime(q.audio.durationSeconds)}`);
    row.append(playBtn, replayBtn, time);
    const bar = h('div', 'theme-quiz-bar');
    const fill = h('i');
    bar.append(fill);
    const err = h('p', 'theme-quiz-error');
    err.setAttribute('role', 'status');
    const live = h('p', 'theme-quiz-live', 'This round uses audio. Play with someone who can listen if that helps.');
    clip.append(row, bar, err, live);
    main.append(clip);
    let audioError = '';
    function paintAudio(snap) {
      const dur = snap.duration > 0 ? snap.duration : q.audio.durationSeconds;
      time.textContent = `${formatTime(snap.elapsed)} / ${formatTime(dur)}`;
      fill.style.width = dur > 0 ? `${Math.min(100, (snap.elapsed / dur) * 100)}%` : '0';
      playBtn.textContent = snap.phase === 'playing' ? 'Pause' : snap.phase === 'ended' ? 'Play again' : 'Play';
    }
    playBtn.addEventListener('click', async () => {
      err.textContent = '';
      const r = state.audio.snapshot();
      if (r.phase === 'playing') {
        state.audio.pause();
        return;
      }
      const res = await state.audio.play();
      if (!res.ok && res.message) err.textContent = res.message;
    });
    replayBtn.addEventListener('click', async () => {
      err.textContent = '';
      const res = await state.audio.replay();
      if (!res.ok && res.message) err.textContent = res.message;
    });
    const off = state.audio.subscribe((patch) => {
      if (patch && patch.stalled) {
        err.textContent = "This clip couldn't load. Try again or skip this question.";
        return;
      }
      paintAudio(state.audio.snapshot());
    });
    state.ui.audioOff = off;
    state.audio.load(clipUrl(q), q.id);
    paintAudio({ phase: 'paused', elapsed: 0, duration: 0 });
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'theme-quiz-options';
    const legend = document.createElement('legend');
    legend.textContent = 'Choose one answer';
    fieldset.append(legend);
    const order = state.attempt.optionOrderByQuestionId[q.id] || [];
    const byId = new Map(q.options.map((o) => [o.id, o]));
    order.forEach((id) => {
      const opt = byId.get(id);
      if (!opt) return;
      const label = document.createElement('label');
      label.className = 'theme-quiz-opt';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `tq-${q.id}`;
      input.value = id;
      input.disabled = Boolean(resp);
      if (state.attempt.draftOptionId === id) input.checked = true;
      if (resp && resp.optionId === id) input.checked = true;
      input.addEventListener('change', () => {
        if (responseFor(state.attempt, q.id)) return;
        state.attempt = selectOption(state.attempt, id);
        persist();
        render();
      });
      const span = h('span', null, opt.label);
      label.append(input, span);
      if (!resp && state.attempt.draftOptionId === id) label.classList.add('is-selected');
      if (resp) {
        if (id === q.correctOptionId) {
          label.classList.add('is-correct');
          const tag = h('span', null, resp.optionId === id ? ' — your correct answer ✓' : ' — correct answer ✓');
          label.append(tag);
        } else if (resp.optionId === id) {
          label.classList.add('is-wrong');
          const tag = h('span', null, ' — your answer ✗');
          label.append(tag);
        }
      }
      fieldset.append(label);
    });
    main.append(fieldset);
    if (!resp) {
      const lock = document.createElement('button');
      lock.type = 'button';
      lock.className = 'theme-quiz-primary';
      lock.textContent = 'Lock in answer';
      lock.disabled = !state.attempt.draftOptionId;
      lock.addEventListener('click', () => {
        const out = lockAnswer(state.round, state.attempt);
        if (!out.changed) return;
        state.attempt = out.attempt;
        state.audio.stop(true);
        persist();
        render();
        announce(out.correct ? 'Correct!' : `The answer was ${labelFor(q, q.correctOptionId)}.`);
        state.ui.title.focus({ preventScroll: true });
      });
      const skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'theme-quiz-secondary';
      skip.textContent = 'Skip question';
      skip.addEventListener('click', () => {
        const out = skipQuestion(state.round, state.attempt);
        if (!out.changed) return;
        state.attempt = out.attempt;
        state.audio.stop(true);
        persist();
        render();
        announce(`Skipped. The answer was ${labelFor(q, q.correctOptionId)}.`);
        state.ui.title.focus({ preventScroll: true });
      });
      foot.append(lock, skip);
    } else {
      const fb = h('p', 'theme-quiz-feedback', resp.skipped ? `The answer was ${labelFor(q, q.correctOptionId)}.` : resp.optionId === q.correctOptionId ? 'Correct!' : `The answer was ${labelFor(q, q.correctOptionId)}.`);
      const note = h('p', 'theme-quiz-note', q.explanation);
      main.append(fb, note);
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'theme-quiz-primary';
      const last = state.attempt.questionIndex >= state.round.questions.length - 1;
      next.textContent = last ? 'See my score' : 'Next question';
      next.addEventListener('click', () => {
        if (last) {
          state.attempt = finishAttempt(state.round, state.attempt);
          state.audio.stop(true);
          persist();
          render();
          state.ui.title.focus({ preventScroll: true });
          return;
        }
        state.attempt = nextQuestion(state.round, state.attempt);
        state.audio.stop(true);
        persist();
        render();
        state.ui.title.focus({ preventScroll: true });
      });
      foot.append(next);
    }
    void title;
  }

  function labelFor(q, id) {
    const o = q.options.find((x) => x.id === id);
    return o ? o.label : id;
  }

  function announce(msg) {
    if (!state.ui) return;
    let live = state.ui.dialog.querySelector('.theme-quiz-announce');
    if (!live) {
      live = h('p', 'theme-quiz-announce');
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      live.style.position = 'absolute';
      live.style.width = '1px';
      live.style.height = '1px';
      live.style.overflow = 'hidden';
      live.style.clip = 'rect(0 0 0 0)';
      state.ui.dialog.append(live);
    }
    live.textContent = msg;
  }

  function renderResults() {
    const { main, foot, qpos, title } = state.ui;
    const sc = scoreAttempt(state.round, state.attempt);
    qpos.textContent = `Results`;
    main.append(h('h3', 'theme-quiz-q', 'Your score'));
    const box = h('div', 'theme-quiz-results');
    box.append(h('p', 'theme-quiz-score', `${sc.score} / ${sc.total}`));
    box.append(h('p', null, `${sc.percentage}%`));
    box.append(h('p', 'theme-quiz-band', scoreBand(sc.score, sc.total)));
    box.append(h('p', 'theme-quiz-counts', `Correct: ${sc.correct} · Incorrect: ${sc.incorrect} · Skipped: ${sc.skipped}`));
    const det = document.createElement('details');
    det.className = 'theme-quiz-review';
    const sum = document.createElement('summary');
    sum.textContent = 'Review answers';
    det.append(sum);
    const ul = document.createElement('ul');
    state.round.questions.forEach((q, i) => {
      const r = responseFor(state.attempt, q.id);
      const li = document.createElement('li');
      li.textContent = `Q${i + 1}: chose ${r && r.optionId ? labelFor(q, r.optionId) : 'Skipped'}; correct: ${labelFor(q, q.correctOptionId)}. ${q.explanation}`;
      ul.append(li);
    });
    det.append(ul);
    box.append(det);
    const shareRow = h('div', 'theme-quiz-share-row');
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'theme-quiz-primary';
    shareBtn.textContent = 'Share score';
    shareBtn.addEventListener('click', onShare);
    const againBtn = document.createElement('button');
    againBtn.type = 'button';
    againBtn.className = 'theme-quiz-secondary';
    againBtn.textContent = 'Play again';
    againBtn.addEventListener('click', () => {
      state.attempt = replay(state.round);
      state.audio.stop(true);
      persist();
      render();
      state.ui.title.focus({ preventScroll: true });
    });
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'theme-quiz-secondary';
    backBtn.textContent = 'Back to this week';
    backBtn.addEventListener('click', () => state.ui.dialog.close());
    shareRow.append(shareBtn, againBtn, backBtn);
    const shareMsg = h('p', 'theme-quiz-live', '');
    shareMsg.hidden = true;
    box.append(shareRow, shareMsg);
    state.ui.shareMsg = shareMsg;
    main.append(box);
    void title;
  }

  function shareText() {
    const sc = scoreAttempt(state.round, state.attempt);
    const url = new URL(window.location.href);
    url.searchParams.delete('themeQuizPreview');
    return { text: `I got ${sc.score}/${sc.total} on Name That Theme! Can you beat me?`, url: url.toString() };
  }

  async function onShare(e) {
    const btn = e.currentTarget;
    const { text, url } = shareText();
    const full = `${text} ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      throw new Error('no-share');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(full);
          if (state.ui.shareMsg) {
            state.ui.shareMsg.hidden = false;
            state.ui.shareMsg.textContent = 'Score copied. Paste it anywhere to share.';
          }
          return;
        }
        throw new Error('no-clipboard');
      } catch {
        if (state.ui.shareMsg) {
          state.ui.shareMsg.hidden = false;
          state.ui.shareMsg.textContent = `Copy this: ${full}`;
        }
        btn.textContent = 'Copy score';
      }
    }
  }

  function onLaunch() {
    if (!state.ctx.eligible || !state.round) return;
    ensureAttempt();
    state.lastFocus = document.activeElement;
    if (!state.ui.dialog.open) state.ui.dialog.showModal();
    render();
    state.ui.title.focus({ preventScroll: true });
    const q = currentQuestion(state.round, state.attempt);
    if (q && !responseFor(state.attempt, q.id) && !state.attempt.completed) {
      state.audio.load(clipUrl(q), q.id);
      state.audio.play().then((res) => {
        if (!res.ok && res.message && state.ui) {
          const err = state.ui.dialog.querySelector('.theme-quiz-error');
          if (err) err.textContent = res.message;
        }
      });
    }
    updateLauncherLabel();
  }

  function onDialogCancel() {
    state.audio.stop(true);
  }
  function onDialogClose() {
    if (state.ui && state.ui.audioOff) {
      state.ui.audioOff();
      state.ui.audioOff = null;
    }
    state.audio.stop(true);
    updateLauncherLabel();
    const target = state.launcher && !state.launcher.wrap.hidden ? state.launcher.btn : document.querySelector('#yearSeg a[aria-current="page"], #yearSeg a');
    if (state.lastFocus && document.contains(state.lastFocus) && state.launcher && !state.launcher.wrap.hidden) state.lastFocus.focus({ preventScroll: true });
    else if (target) target.focus({ preventScroll: true });
  }

  function updateLauncherLabel() {
    if (!state.launcher) return;
    const btn = state.launcher.btn;
    if (!state.attempt) {
      btn.setAttribute('aria-label', 'Play Name That Theme');
      return;
    }
    if (state.attempt.completed) btn.setAttribute('aria-label', 'View your score for Name That Theme');
    else if (Object.keys(state.attempt.responses).length > 0 || state.attempt.questionIndex > 0 || state.attempt.draftOptionId) btn.setAttribute('aria-label', 'Continue Name That Theme quiz');
    else btn.setAttribute('aria-label', 'Play Name That Theme');
  }

  function updateContext({ primaryView, weekId, eligible }) {
    const prev = state.ctx;
    state.ctx = { primaryView, weekId, eligible: Boolean(eligible) };
    if (!state.launcher) return;
    const changed = prev.primaryView !== primaryView || prev.weekId !== weekId || prev.eligible !== state.ctx.eligible;
    if (changed && state.ui && state.ui.dialog.open) state.ui.dialog.close();
    if (changed) state.audio.stop(true);
    state.launcher.wrap.hidden = !state.ctx.eligible;
    if (state.ctx.eligible) ensureAttempt();
    updateLauncherLabel();
  }

  function destroy() {
    if (state.unsub) state.unsub();
    if (state.ui && state.ui.audioOff) state.ui.audioOff();
    if (state.audio) state.audio.destroy();
    if (state.launcher) state.launcher.wrap.remove();
    if (state.ui) state.ui.dialog.remove();
  }

  try {
    if (!posterElement || !state.round || !manifestOk()) return { updateContext: () => {}, close: () => {}, destroy: () => {} };
    state.audio = createAudioController({});
    state.launcher = buildLauncher();
    const zoomWrap = posterElement.querySelector('.zoom-wrap');
    if (zoomWrap && zoomWrap.parentElement === posterElement) posterElement.insertBefore(state.launcher.wrap, zoomWrap.nextSibling);
    else posterElement.append(state.launcher.wrap);
    state.ui = buildDialog();
    document.body.append(state.ui.dialog);
    state.unsub = (() => {
      const onHide = () => state.audio.stop(true);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) onHide();
      });
      window.addEventListener('pagehide', onHide);
      return () => window.removeEventListener('pagehide', onHide);
    })();
  } catch {
    return { updateContext: () => {}, close: () => {}, destroy: () => {} };
  }

  return {
    updateContext,
    close() {
      if (state.ui && state.ui.dialog.open) state.ui.dialog.close();
      if (state.audio) state.audio.stop(true);
    },
    destroy,
  };
}
