export const STALL_TIMEOUT_MS = 12000;
export function createAudioController({ onStalled } = {}) {
  const audio = typeof Audio !== 'undefined' ? new Audio() : null;
  if (audio) {
    audio.preload = 'none';
    audio.loop = false;
  }
  let generation = 0;
  let targetId = null;
  let stallTimer = null;
  const listeners = new Set();
  function emit(patch) {
    for (const fn of listeners) {
      try {
        fn(patch);
      } catch {}
    }
  }
  function snapshot() {
    if (!audio) return { phase: 'idle', elapsed: 0, duration: 0 };
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    return { phase: audio.paused ? 'paused' : 'playing', elapsed: audio.currentTime || 0, duration };
  }
  function clearStall() {
    if (stallTimer) {
      clearTimeout(stallTimer);
      stallTimer = null;
    }
  }
  function armStall(gen) {
    clearStall();
    stallTimer = setTimeout(() => {
      if (gen !== generation) return;
      if (onStalled) {
        try {
          onStalled();
        } catch {}
      }
      emit({ stalled: true });
    }, STALL_TIMEOUT_MS);
  }
  function bind() {
    if (!audio) return () => {};
    const gen = () => generation;
    const onPlaying = () => {
      clearStall();
      emit({ phase: 'playing' });
    };
    const onPause = () => emit({ phase: 'paused' });
    const onEnded = () => {
      clearStall();
      emit({ phase: 'ended' });
    };
    const onError = () => {
      if (gen() !== generation) return;
      clearStall();
      emit({ phase: 'error' });
    };
    const onProgress = () => {
      clearStall();
      emit(snapshot());
    };
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', onProgress);
    audio.addEventListener('loadedmetadata', onProgress);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', onProgress);
      audio.removeEventListener('loadedmetadata', onProgress);
    };
  }
  const unbind = bind();
  async function play() {
    if (!audio) return { ok: false, reason: 'unsupported' };
    const gen = generation;
    armStall(gen);
    try {
      await audio.play();
      if (gen !== generation) {
        try {
          audio.pause();
        } catch {}
        return { ok: false, reason: 'superseded' };
      }
      return { ok: true };
    } catch (err) {
      if (gen !== generation) return { ok: false, reason: 'aborted' };
      clearStall();
      const name = err && err.name ? err.name : '';
      if (name === 'NotAllowedError') return { ok: false, reason: 'blocked', message: 'Tap Play to hear the clip.' };
      if (name === 'AbortError') return { ok: false, reason: 'aborted' };
      return { ok: false, reason: 'load', message: "This clip couldn't load. Try again or skip this question." };
    }
  }
  return {
    element: audio,
    load(src, questionId) {
      generation += 1;
      targetId = questionId || null;
      clearStall();
      if (!audio) return;
      try {
        audio.pause();
      } catch {}
      if (audio.getAttribute('src') !== src) audio.setAttribute('src', src);
      try {
        audio.currentTime = 0;
      } catch {}
    },
    play,
    pause() {
      generation += 1;
      clearStall();
      if (!audio) return;
      try {
        audio.pause();
      } catch {}
    },
    async replay() {
      if (!audio) return { ok: false, reason: 'unsupported' };
      try {
        audio.pause();
      } catch {}
      try {
        audio.currentTime = 0;
      } catch {}
      return play();
    },
    stop(reset = true) {
      generation += 1;
      clearStall();
      if (!audio) return;
      try {
        audio.pause();
      } catch {}
      if (reset) {
        try {
          audio.currentTime = 0;
        } catch {}
      }
      emit({ phase: 'paused', elapsed: 0 });
    },
    setTarget(questionId) {
      targetId = questionId;
      return targetId;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    snapshot,
    destroy() {
      generation += 1;
      clearStall();
      listeners.clear();
      unbind();
      if (audio) {
        try {
          audio.pause();
        } catch {}
        audio.removeAttribute('src');
        try {
          audio.load();
        } catch {}
      }
    },
  };
}
