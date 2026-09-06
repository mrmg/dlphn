export const EPHEMERAL_MESSAGE = 'Progress will last until you close this page.';
export function keyFor(roundId, version) {
  return `dlphn:themeQuiz:${roundId}:v${version}`;
}
export function createStorage(roundId, version, backend) {
  const key = keyFor(roundId, version);
  const memory = { value: null, ephemeral: false };
  const store = backend || (typeof localStorage !== 'undefined' ? localStorage : null);
  function load(fallback) {
    if (store) {
      try {
        const raw = store.getItem(key);
        if (!raw) return { data: fallback, ephemeral: false };
        return { data: JSON.parse(raw), ephemeral: false };
      } catch {
        return { data: memory.value !== null ? memory.value : fallback, ephemeral: true, message: EPHEMERAL_MESSAGE };
      }
    }
    return { data: memory.value !== null ? memory.value : fallback, ephemeral: memory.ephemeral };
  }
  function save(data) {
    if (store) {
      try {
        store.setItem(key, JSON.stringify(data));
        return { ephemeral: false };
      } catch {
        memory.value = data;
        memory.ephemeral = true;
        return { ephemeral: true, message: EPHEMERAL_MESSAGE };
      }
    }
    memory.value = data;
    return { ephemeral: false };
  }
  function clear() {
    memory.value = null;
    memory.ephemeral = false;
    if (store) {
      try {
        store.removeItem(key);
      } catch {
        memory.ephemeral = true;
      }
    }
  }
  return { key, load, save, clear };
}
