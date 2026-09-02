// Poster gallery: one grid per year group, chosen by the URL (/gallery or /gallery?reception).
import { hydrateIcons, initMenu, renderMenu, initSegmented, syncSegmented, readViews, VIEWS } from './site.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// sets: { year4: [{src, week, dates}], reception: [...] }
export function initGallery(sets = {}) {
  hydrateIcons();

  const grid = document.getElementById('galleryGrid');
  const heading = document.getElementById('galleryTitle');
  const count = document.getElementById('posterCount');
  const back = document.getElementById('backLink');
  const dialog = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (!grid) return;

  let posters = [];
  let current = 0;

  function render() {
    const views = readViews();
    const view = views[0];
    const label = VIEWS[view].label;
    posters = Array.isArray(sets[view]) ? sets[view] : [];

    document.body.dataset.year = view;
    document.title = `${label} poster gallery | Dolphin School`;
    if (heading) heading.textContent = `${label} posters`;
    if (back) back.href = VIEWS[view].href;
    syncSegmented(views);
    renderMenu(views);

    grid.innerHTML = '';
    if (!posters.length) {
      grid.appendChild(el('p', 'gallery-empty', `No ${label} posters yet.`));
      if (count) count.textContent = '';
      return;
    }
    if (count) count.textContent = `${posters.length} ${posters.length === 1 ? 'poster' : 'posters'}`;

    posters.forEach((p, i) => {
      const figure = el('figure', 'poster-card');
      figure.style.setProperty('--i', i);
      const button = el('button', 'thumb');
      button.type = 'button';
      button.setAttribute('aria-label', `Open ${p.week} poster, ${p.dates}`);
      const image = el('img');
      image.src = p.src;
      image.alt = `${p.week} poster, ${p.dates}`;
      image.loading = i < 3 ? 'eager' : 'lazy';
      image.decoding = 'async';
      button.appendChild(image);
      button.addEventListener('click', () => openAt(i));
      const cap = el('figcaption');
      cap.appendChild(el('span', 'week', p.week));
      cap.appendChild(el('span', 'dates', p.dates));
      figure.append(button, cap);
      grid.appendChild(figure);
    });
  }

  function show(i) {
    if (!posters.length || !img) return;
    current = (i + posters.length) % posters.length;
    const p = posters[current];
    img.src = p.src;
    img.alt = `${p.week} poster, ${p.dates}`;
    if (caption) caption.textContent = `${p.week}, ${p.dates}`;
  }
  function openAt(i) {
    show(i);
    if (dialog && !dialog.open) dialog.showModal();
  }

  if (dialog) {
    closeBtn && closeBtn.addEventListener('click', () => dialog.close());
    prevBtn && prevBtn.addEventListener('click', () => show(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => show(current + 1));
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  initSegmented(render);
  initMenu(render);
  window.addEventListener('popstate', render);
  window.addEventListener('hashchange', render);
  render();
}
