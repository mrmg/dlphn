/** Touch / small-screen layout — scale fighters/HUD while the stage backdrop stays full-bleed. */

export function isMobileLayout() {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(w, h) < 720 || w < 980;
}

/** Camera zoom for fighters/HUD only (stage bg uses scrollFactor 0). */
export function getGameZoom() {
  if (!isMobileLayout()) return 1;
  const h = window.innerHeight;
  const w = window.innerWidth;
  const arenaH = h * 0.62;
  const arenaW = w * 0.92;
  const byHeight = arenaH / 480;
  const byWidth = arenaW / 1180;
  const raw = Math.max(byHeight, byWidth) * 1.55;
  return Math.min(2.65, Math.max(1.75, raw));
}

/** Extra sprite scale on top of character spriteScale (mobile only). */
export function getFighterScaleBoost() {
  if (!isMobileLayout()) return 1;
  return 1.08 + (getGameZoom() - 1) * 0.12;
}
