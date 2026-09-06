import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateManifest,
  isReady,
  createAttempt,
  selectOption,
  lockAnswer,
  skipQuestion,
  nextQuestion,
  finishAttempt,
  replay,
  scoreAttempt,
  validateAttempt,
  resolveEligibility,
  shuffle,
} from '../../src/theme-quiz/state.js';
import { birthdayRound } from '../../src/theme-quiz/rounds/birthday-tv-film-v1.js';

const fixedRand = () => 0.999999;

describe('manifest', () => {
  it('draft birthday round validates structurally but is not ready', () => {
    const v = validateManifest(birthdayRound);
    assert.equal(v.ok, true);
    assert.equal(isReady(birthdayRound), false);
  });
  it('rejects duplicates and bad correct id', () => {
    const bad = JSON.parse(JSON.stringify(birthdayRound));
    bad.questions[0].options[1].id = bad.questions[0].options[0].id;
    assert.equal(validateManifest(bad).ok, false);
    const bad2 = JSON.parse(JSON.stringify(birthdayRound));
    bad2.questions[0].correctOptionId = 'missing';
    assert.equal(validateManifest(bad2).ok, false);
  });
  it('rejects non mp3 src and bad duration', () => {
    const bad = JSON.parse(JSON.stringify(birthdayRound));
    bad.questions[0].audio.src = 'https://example.com/song.mp3';
    assert.equal(validateManifest(bad).ok, false);
  });
});

describe('attempt', () => {
  it('all-correct scores 10, double lock scores once', () => {
    let a = createAttempt(birthdayRound, fixedRand);
    for (let i = 0; i < birthdayRound.questions.length; i += 1) {
      const q = birthdayRound.questions[i];
      a = selectOption(a, q.correctOptionId);
      const r1 = lockAnswer(birthdayRound, a);
      a = r1.attempt;
      assert.equal(r1.correct, true);
      const r2 = lockAnswer(birthdayRound, a);
      assert.equal(r2.changed, false);
      if (i < birthdayRound.questions.length - 1) a = nextQuestion(birthdayRound, a);
    }
    a = finishAttempt(birthdayRound, a);
    assert.equal(scoreAttempt(birthdayRound, a).score, 10);
  });
  it('skip scores zero and blocks next before reveal', () => {
    let a = createAttempt(birthdayRound, fixedRand);
    assert.equal(nextQuestion(birthdayRound, a).questionIndex, 0);
    const s = skipQuestion(birthdayRound, a);
    a = s.attempt;
    assert.equal(scoreAttempt(birthdayRound, a).score, 0);
    a = nextQuestion(birthdayRound, a);
    assert.equal(a.questionIndex, 1);
  });
  it('selection alone never scores', () => {
    let a = createAttempt(birthdayRound, fixedRand);
    a = selectOption(a, birthdayRound.questions[0].correctOptionId);
    assert.equal(scoreAttempt(birthdayRound, a).score, 0);
  });
  it('shuffle keeps membership and replay reshuffles', () => {
    const a = createAttempt(birthdayRound, fixedRand);
    const order = a.optionOrderByQuestionId.q01;
    assert.equal(order.length, 4);
    const b = replay(birthdayRound, () => 0.000001);
    assert.equal(b.questionIndex, 0);
    assert.equal(b.completed, false);
  });
  it('corrupt storage resets', () => {
    const a = createAttempt(birthdayRound, fixedRand);
    assert.equal(validateAttempt(null, birthdayRound), null);
    assert.equal(validateAttempt({ ...a, roundVersion: 999 }, birthdayRound), null);
    assert.equal(validateAttempt({ ...a, questionIndex: 99 }, birthdayRound), null);
  });
});

describe('eligibility', () => {
  it('requires enabled ready week view', () => {
    const ready = { ...birthdayRound, status: 'ready' };
    const base = { enabled: true, weekId: '2026-08-31', quizId: ready.id, views: ['year4'] };
    assert.equal(resolveEligibility({ config: base, round: ready, roundReady: true, primaryView: 'year4', weekId: '2026-08-31' }).eligible, true);
    assert.equal(resolveEligibility({ config: { ...base, enabled: false }, round: ready, roundReady: true, primaryView: 'year4', weekId: '2026-08-31' }).eligible, false);
    assert.equal(resolveEligibility({ config: base, round: ready, roundReady: true, primaryView: 'reception', weekId: '2026-08-31' }).eligible, false);
  });
  it('shuffle is deterministic with injected rand', () => {
    assert.deepEqual(shuffle(['a', 'b', 'c'], () => 0), ['b', 'c', 'a']);
  });
});
