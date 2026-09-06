// Pure quiz engine: manifest validation, attempt transitions, scoring.
// No DOM, no Firebase, no Audio. All transitions return new objects.
export const SCHEMA_VERSION = 1;

export function shuffle(arr, rand = Math.random) {
  const a = Array.isArray(arr) ? arr.slice() : [];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isSameOriginVersionedMp3(src) {
  if (typeof src !== 'string') return false;
  if (!src.startsWith('/theme-quiz/')) return false;
  if (/\s/.test(src)) return false;
  if (!src.toLowerCase().endsWith('.mp3')) return false;
  return true;
}

export function validateQuestion(q, seenQuestionIds) {
  const errors = [];
  if (!q || typeof q !== 'object') return ['question must be an object'];
  if (!isNonEmptyString(q.id)) errors.push('question.id must be non-empty');
  else if (seenQuestionIds.has(q.id)) errors.push(`duplicate question id: ${q.id}`);
  else seenQuestionIds.add(q.id);
  const audio = q.audio || {};
  if (!isSameOriginVersionedMp3(audio.src)) errors.push(`question ${q.id || '?'}: audio.src must be a same-origin /theme-quiz/… .mp3 path`);
  if (!Number.isFinite(audio.durationSeconds) || audio.durationSeconds <= 0) {
    errors.push(`question ${q.id || '?'}: audio.durationSeconds must be a finite positive number`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`question ${q.id || '?'}: exactly 4 options required`);
  } else {
    const ids = new Set();
    const labels = new Set();
    for (const o of q.options) {
      if (!o || !isNonEmptyString(o.id)) errors.push(`question ${q.id}: option id must be non-empty`);
      else if (ids.has(o.id)) errors.push(`question ${q.id}: duplicate option id ${o.id}`);
      else ids.add(o.id);
      if (!isNonEmptyString(o.label)) errors.push(`question ${q.id}: option label must be non-empty`);
      else {
        const key = o.label.trim().toLowerCase();
        if (labels.has(key)) errors.push(`question ${q.id}: duplicate option label "${o.label}"`);
        else labels.add(key);
      }
    }
    if (!isNonEmptyString(q.correctOptionId)) errors.push(`question ${q.id}: correctOptionId must be non-empty`);
    else if (!ids.has(q.correctOptionId)) errors.push(`question ${q.id}: correctOptionId must match one option id`);
  }
  if (!isNonEmptyString(q.explanation)) errors.push(`question ${q.id || '?'}: explanation must be non-empty`);
  return errors;
}

export function validateManifest(round) {
  const errors = [];
  if (!round || typeof round !== 'object') return { ok: false, errors: ['manifest must be an object'] };
  if (!isNonEmptyString(round.id)) errors.push('round.id must be non-empty');
  if (!Number.isFinite(round.version) || round.version <= 0) errors.push('round.version must be a finite positive number');
  if (!isNonEmptyString(round.title)) errors.push('round.title must be non-empty');
  if (round.poster) {
    if (!isNonEmptyString(round.poster.src)) errors.push('poster.src must be non-empty');
    if (!isNonEmptyString(round.poster.alt)) errors.push('poster.alt must be non-empty');
    if (round.poster.fit && !['contain', 'auto'].includes(round.poster.fit)) errors.push('poster.fit must be contain or auto');
  }
  const seen = new Set();
  if (!Array.isArray(round.questions) || round.questions.length === 0) {
    errors.push('round.questions must be a non-empty array');
  } else {
    for (const q of round.questions) errors.push(...validateQuestion(q, seen));
  }
  return { ok: errors.length === 0, errors };
}

export function isReady(round) {
  if (!round || round.status !== 'ready') return false;
  if (!Array.isArray(round.questions) || round.questions.length !== 10) return false;
  return validateManifest(round).ok;
}

export function createAttempt(round, rand = Math.random) {
  const optionOrderByQuestionId = {};
  for (const q of round.questions) {
    optionOrderByQuestionId[q.id] = shuffle(q.options.map((o) => o.id), rand);
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    roundId: round.id,
    roundVersion: round.version,
    questionIndex: 0,
    optionOrderByQuestionId,
    responses: {},
    draftOptionId: null,
    completed: false,
  };
}

export function currentQuestion(round, attempt) {
  return round.questions[attempt.questionIndex] || null;
}

export function isRevealed(attempt) {
  const q = attempt && attempt.questionIndex;
  return Boolean(attempt.responses && Object.prototype.hasOwnProperty.call(attempt.responses, `__q${q}`));
}

export function responseFor(attempt, questionId) {
  return (attempt.responses && attempt.responses[questionId]) || null;
}

export function phaseOf(attempt, round) {
  if (attempt.completed) return 'results';
  const q = currentQuestion(round, attempt);
  if (q && responseFor(attempt, q.id)) return 'revealed';
  return 'question';
}

export function selectOption(attempt, optionId) {
  if (attempt.completed) return attempt;
  return { ...attempt, draftOptionId: optionId };
}

export function lockAnswer(round, attempt) {
  const q = currentQuestion(round, attempt);
  if (!q || attempt.completed) return { attempt, correct: false, changed: false };
  if (responseFor(attempt, q.id)) return { attempt, correct: responseFor(attempt, q.id).optionId === q.correctOptionId, changed: false };
  const draft = attempt.draftOptionId;
  const order = attempt.optionOrderByQuestionId[q.id] || [];
  if (!draft || !order.includes(draft)) return { attempt, correct: false, changed: false };
  const responses = { ...attempt.responses, [q.id]: { optionId: draft, skipped: false } };
  const next = { ...attempt, responses, draftOptionId: null };
  return { attempt: next, correct: draft === q.correctOptionId, changed: true };
}

export function skipQuestion(round, attempt) {
  const q = currentQuestion(round, attempt);
  if (!q || attempt.completed) return { attempt, changed: false };
  if (responseFor(attempt, q.id)) return { attempt, changed: false };
  const responses = { ...attempt.responses, [q.id]: { optionId: null, skipped: true } };
  return { attempt: { ...attempt, responses, draftOptionId: null }, changed: true };
}

export function canGoNext(round, attempt) {
  const q = currentQuestion(round, attempt);
  return Boolean(q && responseFor(attempt, q.id) && !attempt.completed);
}

export function nextQuestion(round, attempt) {
  if (!canGoNext(round, attempt)) return attempt;
  if (attempt.questionIndex >= round.questions.length - 1) return attempt;
  return { ...attempt, questionIndex: attempt.questionIndex + 1, draftOptionId: null };
}

export function canFinish(round, attempt) {
  if (attempt.completed) return false;
  if (attempt.questionIndex !== round.questions.length - 1) return false;
  const q = currentQuestion(round, attempt);
  return Boolean(q && responseFor(attempt, q.id));
}

export function finishAttempt(round, attempt) {
  if (!canFinish(round, attempt)) return attempt;
  return { ...attempt, completed: true, draftOptionId: null };
}

export function replay(round, rand = Math.random) {
  return createAttempt(round, rand);
}

export function scoreAttempt(round, attempt) {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  for (const q of round.questions) {
    const r = responseFor(attempt, q.id);
    if (!r) continue;
    if (r.skipped) skipped += 1;
    else if (r.optionId === q.correctOptionId) correct += 1;
    else incorrect += 1;
  }
  const total = round.questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { score: correct, correct, incorrect, skipped, total, percentage };
}

export function scoreBand(score, total = 10) {
  if (score <= 3) return 'A few deep cuts in there.';
  if (score <= 6) return 'A very respectable trip down memory lane.';
  if (score <= 8) return 'You know your theme tunes.';
  return 'Theme-tune royalty.';
}

function isValidPermutation(order, optionIds) {
  if (!Array.isArray(order) || order.length !== optionIds.length) return false;
  const a = new Set(order);
  if (a.size !== order.length) return false;
  return optionIds.every((id) => a.has(id));
}

export function validateAttempt(stored, round) {
  try {
    if (!stored || typeof stored !== 'object') return null;
    if (stored.schemaVersion !== SCHEMA_VERSION) return null;
    if (stored.roundId !== round.id || stored.roundVersion !== round.version) return null;
    if (!Number.isInteger(stored.questionIndex) || stored.questionIndex < 0 || stored.questionIndex >= round.questions.length) return null;
    if (!stored.optionOrderByQuestionId || typeof stored.optionOrderByQuestionId !== 'object') return null;
    for (const q of round.questions) {
      if (!isValidPermutation(stored.optionOrderByQuestionId[q.id], q.options.map((o) => o.id))) return null;
    }
    const responses = stored.responses && typeof stored.responses === 'object' ? stored.responses : null;
    if (!responses) return null;
    for (let i = 0; i < stored.questionIndex; i += 1) {
      const r = responses[round.questions[i].id];
      if (!r || typeof r !== 'object') return null;
      if (r.skipped !== true && !isNonEmptyString(r.optionId)) return null;
      if (r.skipped !== true && !round.questions[i].options.some((o) => o.id === r.optionId)) return null;
    }
    const cur = round.questions[stored.questionIndex];
    const curR = responses[cur.id];
    if (curR) {
      if (curR.skipped !== true && !cur.options.some((o) => o.id === curR.optionId)) return null;
    }
    for (let i = stored.questionIndex + 1; i < round.questions.length; i += 1) {
      if (responses[round.questions[i].id]) return null;
    }
    if (stored.completed === true) {
      if (stored.questionIndex !== round.questions.length - 1) return null;
      if (!responses[cur.id]) return null;
    }
    if (stored.draftOptionId != null) {
      const order = stored.optionOrderByQuestionId[cur.id] || [];
      if (!order.includes(stored.draftOptionId)) return null;
      if (responses[cur.id]) return null;
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      roundId: stored.roundId,
      roundVersion: stored.roundVersion,
      questionIndex: stored.questionIndex,
      optionOrderByQuestionId: stored.optionOrderByQuestionId,
      responses,
      draftOptionId: stored.draftOptionId || null,
      completed: stored.completed === true,
    };
  } catch {
    return null;
  }
}

export function resolveEligibility({ config, round, roundReady, primaryView, weekId }) {
  if (!config || config.enabled !== true) return { eligible: false, reason: 'disabled' };
  if (!round || !roundReady) return { eligible: false, reason: 'not-ready' };
  if (config.quizId !== round.id) return { eligible: false, reason: 'unknown-quiz' };
  if (!isNonEmptyString(config.weekId)) return { eligible: false, reason: 'no-week' };
  if (config.weekId !== weekId) return { eligible: false, reason: 'week-mismatch' };
  const views = Array.isArray(config.views) ? config.views : [];
  if (!views.includes(primaryView)) return { eligible: false, reason: 'view' };
  return { eligible: true, reason: 'ok' };
}
