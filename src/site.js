// dlphn.app shared behaviour for the weekly pages and the gallery.
// Icons are Phosphor (regular weight), https://phosphoricons.com, MIT.

export const ICONS = {
  caretDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
  images: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"/></svg>',
  arrowUpRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>'
};

export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SITE_LINKS = [
  { group: 'This week', items: [
    { href: '/', label: 'Year 4' },
    { href: '/?reception', label: 'Reception' },
    { href: '/gallery', label: 'Poster gallery' }
  ]},
  { group: 'Projects', items: [
    { href: '/card', label: 'Card' },
    { href: '/games', label: 'Games' },
    { href: '/horrid', label: 'Horrid' },
    { href: '/is-it-swimming-today', label: 'Is it swimming today?' },
    { href: '/kids-vs-parents', label: 'Kids vs Parents' },
    { href: '/half-term-fighter', label: 'Half Term Fighter' },
    { href: '/ideas', label: 'Ideas' }
  ]}
];

const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Fill any [data-icon] placeholder with its Phosphor glyph.
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(node => {
    const svg = ICONS[node.dataset.icon];
    if (svg) node.innerHTML = svg;
  });
}

// ── Menu sheet ──
export function initMenu(currentPath = location.pathname + location.search) {
  const button = document.getElementById('menuBtn');
  if (!button) return;

  const backdrop = el('div', 'sheet-backdrop');
  const sheet = el('nav', 'sheet');
  sheet.id = 'siteMenu';
  sheet.setAttribute('aria-label', 'Site menu');
  sheet.setAttribute('aria-hidden', 'true');

  const head = el('div', 'sheet-head');
  const titleWrap = el('div');
  titleWrap.appendChild(el('div', 'title', 'dlphn.app'));
  titleWrap.appendChild(el('div', 'sub', 'Family project hub'));
  const close = el('button', 'icon-btn');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close menu');
  close.innerHTML = ICONS.x;
  head.append(titleWrap, close);

  const body = el('div', 'sheet-body');
  let index = 0;
  SITE_LINKS.forEach(group => {
    body.appendChild(el('div', 'sheet-group', group.group));
    const list = el('ul', 'sheet-links');
    group.items.forEach(item => {
      const li = el('li');
      li.style.setProperty('--i', index++);
      const a = el('a');
      a.href = item.href;
      a.appendChild(el('span', null, item.label));
      const arrow = el('span');
      arrow.innerHTML = ICONS.arrowUpRight;
      a.appendChild(arrow.firstChild);
      if (normalise(item.href) === normalise(currentPath)) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      list.appendChild(li);
    });
    body.appendChild(list);
  });

  sheet.append(head, body);
  document.body.append(backdrop, sheet);

  button.setAttribute('aria-controls', 'siteMenu');
  button.setAttribute('aria-expanded', 'false');

  function open() {
    sheet.classList.add('is-open');
    backdrop.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll: true });
  }
  function shut() {
    sheet.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.focus({ preventScroll: true });
  }

  button.addEventListener('click', () => sheet.classList.contains('is-open') ? shut() : open());
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet.classList.contains('is-open')) shut();
  });
}

function normalise(url) {
  const [path, query = ''] = url.split('?');
  const cleanPath = path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/';
  return cleanPath + (query ? '?' + query : '');
}

// ── Year group dropdown ──
export function initYearMenu(onChange) {
  const menu = document.getElementById('yearMenu');
  if (!menu) return;
  document.addEventListener('click', e => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  if (onChange) {
    menu.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      history.pushState({}, '', a.getAttribute('href'));
      menu.open = false;
      onChange();
    }));
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
}

// ── Week badge ──
export function setBadge(label) {
  const badge = document.getElementById('weekBadge');
  if (!badge) return;
  const text = String(label || '').trim();
  badge.textContent = /^[A-Za-z]$/.test(text) ? 'Week ' + text.toUpperCase() : text;
}

// "6-12 July 2026" within a month, "31 Aug-6 Sep 2026" across two.
export function formatRange(start, end) {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}-${end.getDate()} ${MONTHS_LONG[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}-${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
}

export function setDateRange(text) {
  const node = document.getElementById('dateRange');
  if (node) node.textContent = text;
}

export function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Chip classification (Year 4 data uses plain strings) ──
export const DEFAULT_CHIP_RULES = [
  { test: /Birthday/i, cls: 'chip-birthday' },
  { test: /Mum Cinema|Eurovision|James|Summer Fair|Careers|Performance/i, cls: 'chip-school' },
  { test: /Dance|Swim|PE Kit/i, cls: 'chip-kit' },
  { test: /All Stars|Cricket|Party/i, cls: 'chip-kids' },
  { test: /Mum|Dad|Parent|PYJAMARAMA|Discover Dolphin|Digital Detox|Dolphin Forum|East Sussex|Trip|Forest School/i, cls: 'chip-parents' }
];

export function classifyActivity(label, rules = DEFAULT_CHIP_RULES) {
  for (const rule of rules) {
    if (rule.test.test(label)) return rule.cls;
  }
  return 'chip-default';
}

// ── Day strip ──
// days: [{ name, date, month, weather, temp, chips:[{label, cls}], isToday, isWeekend }]
export function renderDays(container, days) {
  container.innerHTML = '';
  if (!days || !days.length) {
    container.appendChild(el('div', 'days-empty', 'No week data yet.'));
    return;
  }
  let chipIndex = 0;
  days.forEach(d => {
    const day = el('article', 'day' + (d.isToday ? ' is-today' : '') + (d.isWeekend ? ' is-weekend' : ''));
    if (d.isToday) day.setAttribute('aria-current', 'date');
    day.appendChild(el('div', 'day-name', d.name));
    day.appendChild(el('div', 'day-date', `${d.date} ${d.month}`));
    if (d.weather || d.temp) {
      const w = el('div', 'day-weather');
      if (d.weather) w.appendChild(el('span', 'glyph', d.weather));
      if (d.temp) w.appendChild(el('span', 'temp', d.temp));
      day.appendChild(w);
    }
    if (d.chips && d.chips.length) {
      const chips = el('div', 'chips');
      d.chips.forEach(c => {
        const chip = el('span', 'chip ' + (c.cls || 'chip-default'), c.label);
        chip.style.setProperty('--i', chipIndex++);
        chips.appendChild(chip);
      });
      day.appendChild(chips);
    }
    container.appendChild(day);
  });
  scrollTodayIntoView(container);
}

function scrollTodayIntoView(container) {
  if (!isMobile()) return;
  const today = container.querySelector('.is-today');
  if (!today) return;
  requestAnimationFrame(() => {
    container.scrollLeft = today.offsetLeft - (container.clientWidth - today.offsetWidth) / 2;
  });
}

// Build the day list from the inline WEEK_DATA block.
export function daysFromWeekData(data, rules = DEFAULT_CHIP_RULES) {
  if (!data || !Array.isArray(data.days)) return [];
  const todayKey = localDateKey(new Date());
  return data.days.map((d, i) => {
    const monthIndex = d.month ? MONTHS_SHORT.indexOf(String(d.month).slice(0, 3)) : data.startMonth - 1;
    const date = new Date(data.year, monthIndex, d.date);
    return {
      name: d.name,
      date: d.date,
      month: MONTHS_SHORT[monthIndex] || '',
      weather: d.weather,
      temp: d.temp,
      chips: (d.activities || []).map(label => ({ label, cls: classifyActivity(label, rules) })),
      isToday: localDateKey(date) === todayKey,
      isWeekend: i >= 5,
      dateObj: date
    };
  });
}

// ── Poster zoom (pinch, pan, double tap, double click) ──
export function initZoom(poster) {
  const wrap = poster.querySelector('.zoom-wrap');
  const img = wrap && wrap.querySelector('img');
  const bg = poster.querySelector('.poster-bg');
  if (!wrap || !img) return;

  let imgW = 0, imgH = 0, baseScale = 1, scale = 1, tx = 0, ty = 0;
  let lastDist = 0, panStart = null, lastTap = 0, gestured = false;

  const flexX = () => (wrap.clientWidth - imgW) / 2;
  const flexY = () => (wrap.clientHeight - imgH) / 2;

  function apply() {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    wrap.classList.toggle('is-zoomed', scale > baseScale * 1.02);
  }

  function clamp() {
    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    const sw = imgW * scale, sh = imgH * scale;
    if (sw <= cw) tx = (cw - sw) / 2 - flexX();
    else tx = Math.max(cw - sw - flexX(), Math.min(-flexX(), tx));
    if (sh <= ch) ty = (ch - sh) / 2 - flexY();
    else ty = Math.max(ch - sh - flexY(), Math.min(-flexY(), ty));
  }

  function fit() {
    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    if (!cw || !ch || !imgW || !imgH) return;
    const contain = Math.min(cw / imgW, ch / imgH);
    const cover = Math.max(cw / imgW, ch / imgH);
    const useContain = cw / ch >= 1;
    baseScale = useContain ? contain : cover;
    poster.classList.toggle('is-contain', useContain);
    scale = baseScale;
    clamp();
    apply();
  }

  function zoomAt(clientX, clientY, targetScale) {
    const rect = wrap.getBoundingClientRect();
    const cx = clientX - rect.left, cy = clientY - rect.top;
    const next = Math.max(baseScale, Math.min(baseScale * 6, targetScale));
    const ratio = next / scale;
    tx = cx - (cx - tx) * ratio;
    ty = cy - (cy - ty) * ratio;
    scale = next;
    clamp();
    apply();
  }

  function ready() {
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    if (!imgW || !imgH) return;
    if (bg) bg.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    img.classList.add('is-loaded');
    fit();
  }

  if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true });
  img.addEventListener('error', () => {
    poster.appendChild(el('div', 'poster-empty', 'No poster for this week yet.'));
  }, { once: true });
  new ResizeObserver(() => fit()).observe(wrap);

  wrap.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      lastDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      panStart = null;
      gestured = true;
    } else if (e.touches.length === 1) {
      gestured = false;
      const overflowing = imgW * scale > wrap.clientWidth + 1 || imgH * scale > wrap.clientHeight + 1;
      panStart = overflowing ? { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty } : null;
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && lastDist) {
      const [a, b] = e.touches;
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      zoomAt((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2, scale * dist / lastDist);
      lastDist = dist;
    } else if (e.touches.length === 1 && panStart) {
      const nx = e.touches[0].clientX - panStart.x;
      const ny = e.touches[0].clientY - panStart.y;
      if (Math.abs(nx - tx) > 3 || Math.abs(ny - ty) > 3) gestured = true;
      tx = nx;
      ty = ny;
      clamp();
      apply();
    }
  }, { passive: true });

  wrap.addEventListener('touchend', e => {
    lastDist = 0;
    if (e.changedTouches.length === 1 && e.touches.length === 0 && !gestured) {
      const now = Date.now();
      if (now - lastTap < 300) toggleZoom(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      lastTap = now;
    }
    panStart = null;
  });
  wrap.addEventListener('touchcancel', () => { lastDist = 0; panStart = null; });

  function toggleZoom(x, y) {
    if (scale > baseScale * 1.5) { scale = baseScale; clamp(); apply(); }
    else zoomAt(x, y, baseScale * 2.5);
  }

  wrap.addEventListener('dblclick', e => toggleZoom(e.clientX, e.clientY));

  // Desktop drag when zoomed in.
  let dragging = null;
  wrap.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || scale <= baseScale * 1.02) return;
    dragging = { x: e.clientX - tx, y: e.clientY - ty };
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove', e => {
    if (!dragging || e.pointerType === 'touch') return;
    tx = e.clientX - dragging.x;
    ty = e.clientY - dragging.y;
    clamp();
    apply();
  });
  wrap.addEventListener('pointerup', () => { dragging = null; });
  wrap.addEventListener('pointercancel', () => { dragging = null; });
}

// ── Views: which year groups the URL asks for ──
// "/" is Year 4. "?reception" or "#reception" is Reception. Naming both ("?year4&reception") shows both.
export const VIEWS = {
  year4: { key: 'year4', label: 'Year 4', href: '/' },
  reception: { key: 'reception', label: 'Reception', href: '/?reception' }
};

export function readViews(search = location.search, hash = location.hash) {
  const tokens = new Set();
  [search, hash].forEach(part => {
    new URLSearchParams(part.replace(/^[?#]/, '')).forEach((v, k) => tokens.add(k.trim().toLowerCase()));
  });
  const reception = tokens.has('reception') || tokens.has('rec');
  const year4 = tokens.has('year4') || tokens.has('year-4') || tokens.has('y4');
  if (reception && year4) return ['year4', 'reception'];
  if (reception) return ['reception'];
  return ['year4'];
}

// ── Reception: fortnightly timetable plus live weather ──
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function mondayOf(date) {
  const d = new Date(date);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function schoolWeek(weekAStart, today = new Date()) {
  const diffWeeks = Math.round((mondayOf(today) - mondayOf(weekAStart)) / (7 * 86400000));
  return diffWeeks % 2 === 0 ? 'A' : 'B';
}

export function daysFromTimetable(timetable, weekLabel, today = new Date()) {
  const monday = mondayOf(today);
  const todayKey = localDateKey(today);
  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const week = timetable && timetable[weekLabel];
    const list = i < 5 && week && week[name.toLowerCase()] ? week[name.toLowerCase()] : [];
    return {
      name,
      date: d.getDate(),
      month: MONTHS_SHORT[d.getMonth()],
      chips: list.map(a => ({ label: a.label, cls: a.cls })),
      isToday: localDateKey(d) === todayKey,
      isWeekend: i >= 5,
      dateObj: d
    };
  });
}

export function weatherGlyph(condition) {
  const c = String(condition || '').toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return '☀️';
  if (c.includes('partly') || c.includes('few') || c.includes('scattered') || c.includes('broken')) return '⛅';
  if (c.includes('overcast')) return '☁️';
  if (c.includes('drizzle') || c.includes('light rain')) return '🌦';
  if (c.includes('rain') || c.includes('shower')) return '🌧';
  if (c.includes('thunder')) return '⛈';
  if (c.includes('snow')) return '🌨';
  if (c.includes('mist') || c.includes('fog')) return '🌫';
  return '☁️';
}

function mergeWeather(days, entries) {
  const byDate = {};
  (entries || []).forEach(w => { (byDate[w.date] ||= []).push(w); });
  days.forEach(d => {
    const list = byDate[localDateKey(d.dateObj)];
    if (!list || !list.length) return;
    const temps = list.map(e => Number(e.temp)).filter(n => !Number.isNaN(n));
    const mid = list[Math.floor(list.length / 2)];
    d.weather = weatherGlyph(mid.condition);
    if (temps.length) d.temp = `${Math.max(...temps)}°`;
  });
}

let weatherPromise = null;
function loadWeather() {
  if (!weatherPromise) {
    weatherPromise = fetch('/data.json?ts=' + Date.now())
      .then(r => (r.ok ? r.json() : null))
      .then(data => (data && Array.isArray(data.weather) ? data.weather : null))
      .catch(() => null);
  }
  return weatherPromise;
}

// ── Page bootstrap ──
export function initChrome(onViewChange) {
  hydrateIcons();
  initYearMenu(onViewChange);
  initMenu();
  const poster = document.getElementById('poster');
  if (poster) initZoom(poster);
}

function buildModel(view, { data, rules, timetable, weekAStart }) {
  if (view === 'reception') {
    const start = weekAStart instanceof Date ? weekAStart : new Date(2026, 1, 9);
    const weekLabel = schoolWeek(start);
    const days = daysFromTimetable(timetable, weekLabel);
    return { view, label: VIEWS.reception.label, weekLabel, days, liveWeather: true };
  }
  const chipRules = Array.isArray(rules) && rules.length ? rules : DEFAULT_CHIP_RULES;
  const days = daysFromWeekData(data, chipRules);
  return { view, label: VIEWS.year4.label, weekLabel: data ? data.weekLabel : '', days, liveWeather: false };
}

function rangeOf(days) {
  return days.length === 7 ? formatRange(days[0].dateObj, days[6].dateObj) : '';
}

function renderStrips(wrapper, models) {
  wrapper.innerHTML = '';
  models.forEach(m => {
    if (models.length > 1) {
      const title = el('div', 'days-title');
      title.appendChild(el('span', 'name', m.label));
      const badge = /^[A-Za-z]$/.test(String(m.weekLabel).trim()) ? 'Week ' + String(m.weekLabel).toUpperCase() : String(m.weekLabel || '');
      title.appendChild(el('span', 'meta', [badge, rangeOf(m.days)].filter(Boolean).join(', ')));
      wrapper.appendChild(title);
    }
    const strip = el('section', 'days');
    strip.dataset.view = m.view;
    strip.setAttribute('aria-label', `${m.label}, day by day`);
    renderDays(strip, m.days);
    wrapper.appendChild(strip);
    m.strip = strip;
  });
}

function syncYearMenu(views) {
  const menu = document.getElementById('yearMenu');
  if (!menu) return;
  const label = views.length > 1 ? 'Year 4 + Reception' : VIEWS[views[0]].label;
  const summary = menu.querySelector('summary');
  const text = summary.querySelector('span');
  if (text) text.textContent = label;
  summary.setAttribute('aria-label', `Change year group, currently ${label}`);
  menu.querySelectorAll('a[data-view]').forEach(a => {
    if (views.length === 1 && a.dataset.view === views[0]) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// Single weekly page. The URL decides which year group(s) to show; data blocks are inline in index.html.
export function initWeekPage(sources = {}) {
  const wrapper = document.getElementById('dayStrip');

  function render() {
    const views = readViews();
    const models = views.map(v => buildModel(v, sources));
    const primary = models[0];

    document.body.dataset.year = views.length === 1 ? views[0] : 'year4';
    document.body.dataset.views = views.join(' ');
    document.title = `${views.length > 1 ? 'Year 4 and Reception' : primary.label} this week | Dolphin School`;

    setBadge(primary.weekLabel);
    setDateRange(rangeOf(primary.days));
    syncYearMenu(views);
    if (wrapper) renderStrips(wrapper, models);

    const live = models.filter(m => m.liveWeather);
    if (live.length) {
      loadWeather().then(entries => {
        if (!entries) return;
        live.forEach(m => { mergeWeather(m.days, entries); if (m.strip) renderDays(m.strip, m.days); });
      });
    }
  }

  initChrome(render);
  window.addEventListener('popstate', render);
  window.addEventListener('hashchange', render);
  render();
}
