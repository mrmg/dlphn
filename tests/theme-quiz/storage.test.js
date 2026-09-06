import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage, keyFor } from '../../src/theme-quiz/storage.js';

function memBackend() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
    removeItem: (k) => m.delete(k),
  };
}

describe('storage', () => {
  it('round-trips validated data', () => {
    const s = createStorage('birthday-tv-film-v1', 1, memBackend());
    assert.equal(s.key, keyFor('birthday-tv-film-v1', 1));
    const data = { questionIndex: 2 };
    assert.equal(s.save(data).ephemeral, false);
    assert.deepEqual(s.load(null).data, data);
  });
  it('falls back to memory on exceptions', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const s = createStorage('birthday-tv-film-v1', 1, broken);
    const res = s.save({ questionIndex: 1 });
    assert.equal(res.ephemeral, true);
    assert.equal(s.load(null).ephemeral, true);
  });
});
