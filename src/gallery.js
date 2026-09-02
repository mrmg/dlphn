// Poster gallery: grid of past weekly posters with a native <dialog> lightbox.
import { hydrateIcons, initMenu } from './site.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initGallery(posters = []) {
  hydrateIcons();
  initMenu();

  const grid = document.getElementById('galleryGrid');
  const count = document.getElementById('posterCount');
  const dialog = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (!grid) return;

  grid.innerHTML = '';
  if (!posters.length) {
    grid.appendChild(el('p', 'gallery-empty', 'No posters archived yet.'));
    if (count) count.textContent = '';
    return;
  }
  if (count) count.textContent = `${posters.length} ${posters.length === 1 ? 'poster' : 'posters'}`;

  posters.forEach((p, i) => {
    const figure = el('figure', 'poster-card');
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

  if (!dialog || !img) return;
  let current = 0;

  function show(i) {
    current = (i + posters.length) % posters.length;
    const p = posters[current];
    img.src = p.src;
    img.alt = `${p.week} poster, ${p.dates}`;
    if (caption) caption.textContent = `${p.week}, ${p.dates}`;
  }
  function openAt(i) {
    show(i);
    if (!dialog.open) dialog.showModal();
  }

  closeBtn && closeBtn.addEventListener('click', () => dialog.close());
  prevBtn && prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
