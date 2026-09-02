export function setupTouchControls(scene, onInput) {
  const container = document.createElement('div');
  container.id = 'touch-controls';
  container.innerHTML = `
    <div class="touch-dpad">
      <button type="button" data-dir="up" class="touch-btn dpad-up">▲</button>
      <button type="button" data-dir="left" class="touch-btn dpad-left">◀</button>
      <button type="button" data-dir="right" class="touch-btn dpad-right">▶</button>
      <button type="button" data-dir="down" class="touch-btn dpad-down">▼</button>
    </div>
    <div class="touch-actions">
      <div class="touch-power-row">
        <button type="button" data-action="special" class="touch-btn action-special">SP</button>
        <button type="button" data-action="super" class="touch-btn action-super">SUPER</button>
      </div>
      <div class="touch-basic-row">
        <button type="button" data-action="punch" class="touch-btn action-punch">PUNCH</button>
        <button type="button" data-action="kick" class="touch-btn action-kick">KICK</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const state = {
    left: false, right: false, up: false, down: false,
    punch: false, kick: false, special: false, super: false
  };

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    container.style.display = 'none';
    return () => container.remove();
  }

  onInput({ ...state });

  const setDir = (dir, active) => {
    state[dir] = active;
    onInput({ ...state });
  };

  container.querySelectorAll('[data-dir]').forEach((btn) => {
    const dir = btn.dataset.dir;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); setDir(dir, true); }, { passive: false });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); setDir(dir, false); }, { passive: false });
    btn.addEventListener('touchcancel', () => setDir(dir, false));
  });

  container.querySelectorAll('[data-action]').forEach((btn) => {
    const action = btn.dataset.action;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      state[action] = true;
      onInput({ ...state });
    }, { passive: false });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      state[action] = false;
      onInput({ ...state });
    }, { passive: false });
    btn.addEventListener('touchcancel', () => {
      state[action] = false;
      onInput({ ...state });
    });
  });

  window.addEventListener('blur', () => {
    Object.keys(state).forEach((k) => { state[k] = false; });
    onInput({ ...state });
  });

  scene.events.on('shutdown', () => container.remove());
  scene.events.on('destroy', () => container.remove());

  return () => container.remove();
}
