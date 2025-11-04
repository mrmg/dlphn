const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');

// Background card template (dynamic by House)
const CARD_VARIANTS = {
  default: '/assets/cards/dolphin-football-card.png',
  red: '/assets/cards/dolphin-football-card-red.png',
  green: '/assets/cards/dolphin-football-card-green.png',
  blue: '/assets/cards/dolphin-football-card-blue.png',
  yellow: '/assets/cards/dolphin-football-card-yellow.png',
  gold: '/assets/cards/dolphin-football-card-gold.png',
  silver: '/assets/cards/dolphin-football-card-silver.png',
  white: '/assets/cards/dolphin-football-card-white.png',
  black: '/assets/cards/dolphin-football-card-black.png'
};
const cardImg = new Image();

function resolveHouseVariant(val){
  if (!val) return 'default';
  const v = val.toLowerCase();
  // Map named houses
  if (v === 'york') return 'blue';
  if (v === 'lancaster') return 'red';
  if (v === 'plantagenet') return 'yellow';
  if (v === 'tudor') return 'green';
  // Direct colours
  if (CARD_VARIANTS[v]) return v;
  return 'default';
}

function updateCardBackground(){
  const variant = resolveHouseVariant(houseSelect ? houseSelect.value : '');
  const src = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  if (cardImg.src.endsWith(src)) return; // already set
  cardImg.onload = () => draw();
  cardImg.src = src;
}

// Photo state
let userImg = null;
let imgScale = 1;
let minScale = 1; // cover scale based on frame size
const MIN_ZOOM_RATIO = 0.2; // allow reducing to 20% of cover
const MAX_ZOOM_RATIO = 4.0; // allow up to 4x cover
let imgX = 0;
let imgY = 0;
let dragging = false;
let dragStart = { x: 0, y: 0 };
let lastPos = { x: 0, y: 0 };

// Define a photo frame area on the card (relative to 720x1024 canvas)
// Photo frame aligned to the card's upper panel (bottom near the divider line)
const frame = { x: 75, y: 200, w: 570, h: 350, radius: 24 };
// Extra bottom cap as a proportion of frame height relative to its center (0.5 = no extra cap)
// Optional extra bottom cap relative to frame center (0.5 = center). Set to null to disable.
const BOTTOM_CAP_RATIO = null;

// Typography sizing
const SIZES = {
  name: 65,
  overall: 90,      // +15%
  position: 48,     // +20%
  stats: 55,        // slightly larger base for stats
  flagH: 44,        // +20%
  stroke: 6
};

// UI elements
const nameInput = document.getElementById('playerName');
const posSelect = document.getElementById('position');
const countrySelect = document.getElementById('country');
const houseSelect = document.getElementById('houseSelect');
const zoomRange = document.getElementById('zoomRange');
const resetBtn = document.getElementById('resetPhoto');
const downloadBtn = document.getElementById('downloadBtn');
const uploadBtnWrap = document.getElementById('uploadBtnWrap');
const uploadInput = document.getElementById('photoInput');
const uploadText = uploadBtnWrap ? uploadBtnWrap.querySelector('span') : null;
const overallEl = document.getElementById('overallValue');
const removeBgBtn = document.getElementById('removeBgBtn');
const removeBgThresholdEl = document.getElementById('removeBgThreshold');
const invertMaskToggle = document.getElementById('invertMaskToggle');
const bgStatus = document.getElementById('bgStatus');
const bgSubControls = document.getElementById('bgSubControls');
const bgSpinner = document.getElementById('bgSpinner');
const zoomControls = document.getElementById('zoomControls');
const bgTools = document.getElementById('bgTools');
const thrPlus = document.getElementById('thrPlus');
const thrMinus = document.getElementById('thrMinus');
const thrValue = document.getElementById('thrValue');
// Background removal active flag (must be initialized before draw can run)
let bgActive = false;

const statIds = ['PAC','SHO','PAS','DRI','DEF','PHY','AGI','GKDIV','GKHAN','GKKIC','GKREF','GKSPD','GKPOS','SOX'];
const stats = Object.fromEntries(statIds.map(id => [id, document.getElementById('stat' + id)]));

// Position-based stat sets (6 + SOX)
const POSITION_STAT_IDS = {
  FWD: ['PAC','SHO','DRI','PAS','PHY','AGI'],
  MID: ['PAS','DRI','PAC','PHY','DEF','AGI'],
  DEF: ['DEF','PHY','PAC','PAS','DRI','AGI'],
  GK:  ['GKDIV','GKHAN','GKKIC','GKREF','GKSPD','GKPOS']
};

function getActiveStatIds() {
  const pos = (posSelect.value || 'DEF');
  return POSITION_STAT_IDS[pos] || POSITION_STAT_IDS.DEF;
}

function updateStatInputVisibility() {
  const active = new Set([...getActiveStatIds(), 'SOX']);
  const nodes = document.querySelectorAll('.stats-grid [data-stat]');
  nodes.forEach(node => {
    const id = node.getAttribute('data-stat');
    node.style.display = active.has(id) ? '' : 'none';
  });
}

// Flag CDN (rectangular, flat). Using flag-icons via jsDelivr.
const FLAG_CDN_BASE = 'https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3';

let countries = [];

async function loadCountries(){
  // Try to fetch ISO country codes and names from flagcdn (English names)
  try {
    const resp = await fetch('https://flagcdn.com/en/codes.json');
    if (!resp.ok) throw new Error('Failed to fetch codes');
    const data = await resp.json(); // {"ad":"Andorra", ...}
    countries = Object.entries(data).map(([code, name]) => ({ code: code.toLowerCase(), name }));
  } catch {
    // Fallback minimal set if network blocked
    countries = [
      { code: 'gb', name: 'United Kingdom' },
      { code: 'ie', name: 'Republic of Ireland' },
      { code: 'fr', name: 'France' },
      { code: 'de', name: 'Germany' },
      { code: 'es', name: 'Spain' },
      { code: 'it', name: 'Italy' },
      { code: 'us', name: 'United States' }
    ];
  }
  // Add home nations (if missing)
  const home = [
    { code: 'gb-eng', name: 'England' },
    { code: 'gb-sct', name: 'Scotland' },
    { code: 'gb-wls', name: 'Wales' },
    { code: 'gb-nir', name: 'Northern Ireland' }
  ];
  const homeCodes = new Set(home.map(h => h.code));
  const existing = new Set(countries.map(c => c.code));
  home.forEach(h => { if (!existing.has(h.code)) countries.push(h); });

  // Sort others alphabetically by name
  const others = countries.filter(c => !homeCodes.has(c.code))
    .sort((a,b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

  // Populate select with home nations first, then optgroup for others
  countrySelect.innerHTML = '';
  home.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    countrySelect.appendChild(opt);
  });
  const og = document.createElement('optgroup');
  og.label = 'Other countries';
  others.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    og.appendChild(opt);
  });
  countrySelect.appendChild(og);

  // Default to England if available, else leave current selection as-is
  countrySelect.value = 'gb-eng';
}

loadCountries();

// Load saved defaults from localStorage (nice touch)
function loadSaved(){
  const saved = JSON.parse(localStorage.getItem('cardMakerState') || '{}');
  if(saved.name) nameInput.value = saved.name;
  if(saved.position) posSelect.value = saved.position;
  if(saved.country) countrySelect.value = saved.country;
  if(saved.house && houseSelect) houseSelect.value = saved.house;
  statIds.forEach(id=>{
    if(saved['stat'+id] != null) stats[id].value = saved['stat'+id];
  });
}
loadSaved();

function saveState(){
  const payload = {
    name: nameInput.value.trim(),
    position: posSelect.value,
    country: countrySelect.value,
    house: houseSelect ? houseSelect.value : ''
  };
  statIds.forEach(id=> payload['stat'+id] = clampInt(stats[id].value,1,99));
  localStorage.setItem('cardMakerState', JSON.stringify(payload));
}

// Helpers
function clampInt(v, min, max){
  const n = Math.round(Number(v)||0);
  return Math.min(max, Math.max(min, n));
}

// Cache images for flags
const flagImageCache = new Map();
function getFlagImageByCode(code){
  if (!code) return null;
  if (flagImageCache.has(code)) return flagImageCache.get(code);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  // NI fallback to local if CDN lacks it
  if (code.toLowerCase() === 'gb-nir') {
    img.src = '/assets/flags/northern-ireland.svg';
  } else {
    img.src = `${FLAG_CDN_BASE}/${code.toLowerCase()}.svg`;
  }
  img.onload = () => draw();
  flagImageCache.set(code, img);
  return img;
}

// Weighted overall by position (not a simple average)
function calcOverall(){
  const values = {
    PAC: clampInt(stats.PAC.value,1,99),
    SHO: clampInt(stats.SHO.value,1,99),
    PAS: clampInt(stats.PAS.value,1,99),
    DRI: clampInt(stats.DRI.value,1,99),
    DEF: clampInt(stats.DEF.value,1,99),
    PHY: clampInt(stats.PHY.value,1,99),
  };
  const pos = posSelect.value;

  let w; // weights must sum roughly to 1
  if(pos === 'DEF'){
    w = { PAC:.15, SHO:.05, PAS:.05, DRI:.05, DEF:.50, PHY:.20 };
  } else if(pos === 'MID'){
    w = { PAC:.15, SHO:.10, PAS:.30, DRI:.25, DEF:.10, PHY:.10 };
  } else if(pos === 'GK'){
    // Approximate GK: treat DEF as goalkeeping prowess here
    w = { PAC:.10, SHO:.05, PAS:.10, DRI:.05, DEF:.50, PHY:.20 };
  } else { // FWD
    w = { PAC:.20, SHO:.40, PAS:.10, DRI:.25, DEF:.00, PHY:.05 };
  }

  const score = values.PAC*w.PAC + values.SHO*w.SHO + values.PAS*w.PAS + values.DRI*w.DRI + values.DEF*w.DEF + values.PHY*w.PHY;
  const overall = Math.round(score);
  overallEl.textContent = String(overall);
  return overall;
}

// Background removal (client-side) state
let maskedImg = null; // holds a masked version of userImg when generated
let bodyPixNet = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Avoid double-loading
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

async function ensureBodyPixLoaded() {
  if (bodyPixNet) return bodyPixNet;
  try {
    if (bgStatus) bgStatus.textContent = 'Loading background removal model...';
    // Load TFJS (UMD) and BodyPix (UMD) via script tags to avoid ESM+CORS issues
    const tfUrls = [
      'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js',
      'https://unpkg.com/@tensorflow/tfjs@4.20.0/dist/tf.min.js'
    ];
    const bpUrls = [
      'https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.2.0/dist/body-pix.min.js',
      'https://unpkg.com/@tensorflow-models/body-pix@2.2.0/dist/body-pix.min.js'
    ];

    let ok = false;
    for (const url of tfUrls) {
      try { await loadScript(url); ok = true; break; } catch (_) {}
    }
    if (!ok || !window.tf) throw new Error('TFJS failed to load');
    if (window.tf && window.tf.ready) await window.tf.ready();

    ok = false;
    for (const url of bpUrls) {
      try { await loadScript(url); ok = true; break; } catch (_) {}
    }
    if (!ok || !window.bodyPix) throw new Error('BodyPix failed to load');

    bodyPixNet = await window.bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
    if (bgStatus) bgStatus.textContent = '';
    return bodyPixNet;
  } catch (err) {
    console.error('Error loading BodyPix:', err);
    if (bgStatus) bgStatus.textContent = 'Failed to load model (check network).';
    return null;
  }
}

async function generateMaskedImage() {
  if (!userImg) return null;
  const net = await ensureBodyPixLoaded();
  if (!net) return null;
  try {
    if (bgStatus) bgStatus.textContent = 'Removing background...';
    const threshold = removeBgThresholdEl ? Number(removeBgThresholdEl.value) : 0.6;
    const seg = await net.segmentPerson(userImg, {
      internalResolution: 'high',
      segmentationThreshold: threshold
    });
    const keepBackground = invertMaskToggle && invertMaskToggle.checked;
    const mask = keepBackground
      ? window.bodyPix.toMask(seg, { r:0,g:0,b:0,a:255 }, { r:0,g:0,b:0,a:0 }) // background opaque
      : window.bodyPix.toMask(seg, { r:0,g:0,b:0,a:0 },   { r:0,g:0,b:0,a:255 }); // person opaque
    const mc = document.createElement('canvas');
    mc.width = userImg.naturalWidth;
    mc.height = userImg.naturalHeight;
    const mctx = mc.getContext('2d');
    // Prepare mask canvas because putImageData ignores globalCompositeOperation
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = mc.width;
    maskCanvas.height = mc.height;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.putImageData(mask, 0, 0);
    // Draw original image, then intersect with mask using compositing
    mctx.drawImage(userImg, 0, 0);
    mctx.globalCompositeOperation = 'destination-in';
    mctx.drawImage(maskCanvas, 0, 0);
    mctx.globalCompositeOperation = 'source-over';
    const out = new Image();
    out.onload = () => {
      maskedImg = out;
      if (bgStatus) bgStatus.textContent = '';
      bgActive = true;
      if (bgSubControls) bgSubControls.style.display = '';
      if (removeBgBtn) removeBgBtn.style.display = 'none';
      if (bgSpinner) bgSpinner.style.display = 'none';
      logAnalytics('fc_remove_bg_success', { threshold: removeBgThresholdEl ? Number(removeBgThresholdEl.value) : undefined, invert: !!(invertMaskToggle && invertMaskToggle.checked) });
      draw();
    };
    out.src = mc.toDataURL('image/png');
    return out;
  } catch (err) {
    console.error('Background removal failed:', err);
    if (bgStatus) bgStatus.textContent = 'Background removal failed.';
    bgActive = false;
    if (removeBgBtn) removeBgBtn.style.display = '';
    if (bgSubControls) bgSubControls.style.display = 'none';
    if (bgSpinner) bgSpinner.style.display = 'none';
    logAnalytics('fc_remove_bg_error', { message: err?.message || String(err) });
    return null;
  }
}

// Drawing
function roundRectPath(x,y,w,h,r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

// -------- Layout draggable elements --------
const defaultLayout = () => ({
  // Updated defaults from your latest layout logs
  name: { x: 365.8, y: 628.5 },
  flag: { x: 100.2, y: 439.4 },
  overall: { x: 149.9, y: 284.0 },
  position: { x: 151.7, y: 511.1 },
  statsLeft: { x: 325.4, y: 716.8 },
  statsRight: { x: 396.1, y: 687.9 },
});

let layout = defaultLayout();

function drawRoundedBox(x,y,w,h,r,fill,stroke){
  ctx.save();
  roundRectPath(x,y,w,h,r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
}

function draw(){
  // Clear
  ctx.clearRect(0,0,canvas.width, canvas.height);
  // Background card (selected house variant)
  if(cardImg.complete) ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);

  // Photo clipped in frame
  const activeImg = (bgActive && maskedImg) ? maskedImg : userImg;
  if(activeImg){
    ctx.save();
    roundRectPath(frame.x, frame.y, frame.w, frame.h, frame.radius);
    ctx.clip();
    const iw = activeImg.naturalWidth * imgScale;
    const ih = activeImg.naturalHeight * imgScale;
    const cx = frame.x + frame.w/2 + imgX;
    const cy = frame.y + frame.h/2 + imgY;
    ctx.drawImage(activeImg, cx - iw/2, cy - ih/2, iw, ih);
    ctx.restore();
  }

  // Name + country/flag
  const name = (nameInput.value || '').toUpperCase();
  const countryCode = countrySelect.value; // ISO code or gb-eng, etc.
  ctx.font = `bold ${SIZES.name}px Arial`;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = SIZES.stroke;
  const nameX = layout.name.x;
  const nameY = layout.name.y;
  const displayName = name || 'PLAYER NAME';
  // Name container (gold bordered rounded box behind text)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const nm = ctx.measureText(displayName);
  const ascent = nm.actualBoundingBoxAscent || SIZES.name * 0.8;
  const descent = nm.actualBoundingBoxDescent || SIZES.name * 0.2;
  const padXn = 10, padYn = 10, radN = 10;
  const nameW = nm.width + padXn * 2;
  const nameH = ascent + descent + padYn * 2;
  const nameBoxX = nameX - nameW / 2;
  const nameBoxY = nameY - ascent - padYn;
  drawRoundedBox(nameBoxX, nameBoxY, nameW, nameH, radN, 'rgba(0,0,0,0)', '#d4af37');
  // stroke text for readability on top
  ctx.strokeText(displayName, nameX, nameY);
  ctx.fillText(displayName, nameX, nameY);
  // flag to the right (image for home nations, emoji for others)
  const flagOffsetX = layout.flag.x;
  const fImg = getFlagImageByCode(countryCode);
  if (fImg && fImg.complete) {
    const fh = SIZES.flagH * 1.5; // 50% larger
    const fw = Math.round(fh * 48/32);
    ctx.drawImage(fImg, flagOffsetX, layout.flag.y - fh + 8, fw, fh);
  }

  // Position text (top area)
  const pos = posSelect.value;
  ctx.font = `bold ${SIZES.position}px Arial`;
  ctx.strokeText(pos, layout.position.x, layout.position.y);
  ctx.fillText(pos, layout.position.x, layout.position.y);

  // Overall badge (circle) at original position
  (function drawOverallCircle(){
    const overall = calcOverall();
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${SIZES.overall}px Arial`;
    const ovText = String(overall);
    const metrics = ctx.measureText(ovText);
    const ovW = metrics.width;
    const centerX = layout.overall.x;
    const centerY = layout.overall.y; // circle visual center
    const circlePad = 10; // extra padding all around
    const radius = Math.max(SIZES.overall * 0.7, ovW/2 + 14) + circlePad;
    // Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI*2);
    ctx.closePath();
    // Grey semi-transparent fill for overall badge
    ctx.fillStyle = 'rgba(128,128,128,0.35)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();
    // Text with small vertical offset
    const vOffset = 10; // px
    ctx.strokeText(ovText, centerX, centerY + vOffset);
    ctx.fillText(ovText, centerX, centerY + vOffset);
    ctx.restore();
  })();

  // Stats bottom block layout (two columns like FIFA)
  // Build dynamic stat items (exclude blanks). SOX optional, editable.
  const statLabels = {
    PAC: 'PAC', SHO: 'SHO', PAS: 'PAS', DRI: 'DRI', DEF: 'DEF', PHY: 'PHY',
    AGI: 'AGI', GKDIV: 'DIV', GKHAN: 'HAN', GKKIC: 'KIC', GKREF: 'REF', GKSPD: 'SPD', GKPOS: 'POS',
    SOX: 'SOX'
  };
  const core = [];
  const activeIds = getActiveStatIds();
  for (const id of activeIds) {
    const el = stats[id];
    if (!el) continue;
    const raw = el.value?.toString().trim();
    if (!raw) continue;
    core.push({ label: statLabels[id], value: clampInt(raw,1,99) });
  }
  while (core.length > 6) core.pop();
  // Build final items: core plus optional SOX at the end
  const soxRaw = stats.SOX?.value?.toString().trim();
  const finalItems = [...core];
  if (soxRaw) finalItems.push({ label: 'SOX', value: clampInt(soxRaw,1,99) });

  const startY = layout.statsLeft.y;
  const baseStatsSize = SIZES.stats;
  const countForSize = finalItems.length;
  const sizeDrop = Math.max(0, Math.floor((countForSize - 5) / 2)) * 5; // shrink as more items
  const statsFontSize = Math.max(24, baseStatsSize - sizeDrop);
  const lineH = statsFontSize + 10;
  ctx.font = `500 ${statsFontSize}px 'Roboto Mono', monospace`;

  // Always render two columns; odd item centers on last row
  const midX = (layout.statsLeft.x + layout.statsRight.x) / 2;
  const pairCount = Math.floor(finalItems.length / 2);
  for (let i = 0; i < pairCount; i++) {
    const leftItem = finalItems[i];
    const rightItem = finalItems[i + pairCount];
    const y = startY + i * lineH;
    // left (right-aligned)
    ctx.textAlign = 'right';
    const ltxt = `${leftItem.label}  ${String(leftItem.value).padStart(2,' ')}`;
    ctx.strokeText(ltxt, layout.statsLeft.x, y);
    ctx.fillText(ltxt, layout.statsLeft.x, y);
    // right (left-aligned) if exists
    if (rightItem) {
      ctx.textAlign = 'left';
      const rtxt = `${rightItem.label}  ${String(rightItem.value).padStart(2,' ')}`;
      ctx.strokeText(rtxt, layout.statsRight.x, y);
      ctx.fillText(rtxt, layout.statsRight.x, y);
    }
  }
  if (finalItems.length % 2 === 1) {
    // Center last item on its own row
    const last = finalItems[finalItems.length - 1];
    const y = startY + pairCount * lineH;
    ctx.textAlign = 'center';
    const ctxt = `${last.label}  ${String(last.value).padStart(2,' ')}`;
    ctx.strokeText(ctxt, midX, y);
    ctx.fillText(ctxt, midX, y);
  }
}

// (House tint removed; using card image variants instead)

function clampImageOffset(){
  if(!userImg) return;
  const iw = userImg.naturalWidth * imgScale;
  const ih = userImg.naturalHeight * imgScale;
  // Allow movement whether the image is larger or smaller than the frame.
  const rangeHalfX = Math.abs(iw - frame.w) / 2;
  const rangeHalfY = Math.abs(ih - frame.h) / 2;
  // Give extra horizontal freedom so users can reveal only a section of the photo
  const extraX = frame.w * 0.6; // 60% of frame width on each side
  const minX = -rangeHalfX - extraX;
  const maxX = +rangeHalfX + extraX;
  let minY = -rangeHalfY;
  let maxY = +rangeHalfY;
  // Optional extra bottom cap so the image center cannot go too low
  if (typeof BOTTOM_CAP_RATIO === 'number') {
    const bottomCapImgY = frame.h * (BOTTOM_CAP_RATIO - 0.5); // relative to frame center
    maxY = Math.min(maxY, bottomCapImgY);
  }
  // For very small images, keep at least some part visible by limiting extreme offsets
  imgX = Math.max(minX, Math.min(maxX, imgX));
  imgY = Math.max(minY, Math.min(maxY, imgY));
}

// Input listeners
document.getElementById('photoInput').addEventListener('change', (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const img = new Image();
  img.onload = ()=>{
    userImg = img;
    maskedImg = null;
    // fit image so smallest dimension fits frame
    const scaleX = frame.w / img.naturalWidth;
    const scaleY = frame.h / img.naturalHeight;
    minScale = Math.max(scaleX, scaleY);
    imgScale = minScale;
    imgX = 0; imgY = 0;
    // set zoom range bounds relative to cover scale
    zoomRange.min = String(Math.max(0.05, Math.round(minScale*MIN_ZOOM_RATIO*100)/100));
    zoomRange.max = String(Math.round(minScale*MAX_ZOOM_RATIO*100)/100);
    zoomRange.value = String(Math.max(imgScale, Number(zoomRange.min)));
    clampImageOffset();
    draw();
    logAnalytics('fc_photo_upload', {});
    // Reveal controls once an image is present
    if (zoomControls) zoomControls.style.display = '';
    if (bgTools) bgTools.style.display = '';
    // Reset background-removal UI to initial state
    if (removeBgBtn) removeBgBtn.style.display = '';
    if (bgSubControls) bgSubControls.style.display = 'none';
    if (bgSpinner) bgSpinner.style.display = 'none';
    if (bgStatus) bgStatus.textContent = '';
    // Switch top button to Download Card
    if (typeof setUploadAsDownload === 'function') setUploadAsDownload(true);
  if (bgActive) {
      if (bgSpinner) bgSpinner.style.display = '';
      generateMaskedImage();
  }
  // init threshold display
  updateThresholdDisplay();
  updateZoomDisplay();
  };
  img.src = URL.createObjectURL(file);
});

zoomRange.addEventListener('input', ()=>{
  imgScale = Math.max(Number(zoomRange.min), Number(zoomRange.value));
  zoomRange.value = String(imgScale);
  clampImageOffset();
  draw();
  updateZoomDisplay();
});

resetBtn.addEventListener('click', ()=>{
  // Full reset: remove image and hide controls
  userImg = null;
  maskedImg = null;
  bgActive = false;
  if (bgSubControls) bgSubControls.style.display = 'none';
  if (bgSpinner) bgSpinner.style.display = 'none';
  if (bgTools) bgTools.style.display = 'none';
  if (zoomControls) zoomControls.style.display = 'none';
  setUploadAsDownload(false);
  if (removeBgBtn) removeBgBtn.style.display = '';
  if (bgStatus) bgStatus.textContent = '';
  imgScale = 1; imgX = 0; imgY = 0;
  draw();
});

// Drag to move image
function toCanvasPoint(clientX, clientY){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

// Dragging state
let draggingFlag = false;
let flagDragOffset = { dx: 0, dy: 0 };

canvas.addEventListener('mousedown', (e)=>{
  const p = toCanvasPoint(e.clientX, e.clientY);
  // If clicking on flag, enable flag dragging instead of photo
  if (isPointInFlag(p.x, p.y)) {
    draggingFlag = true; dragging = true;
    // compute offset from flag's top-left corner
    const fh = SIZES.flagH * 1.5; const fw = Math.round(fh * 48/32);
    const topLeftY = layout.flag.y - fh + 8;
    flagDragOffset.dx = p.x - layout.flag.x;
    flagDragOffset.dy = p.y - topLeftY;
    return;
  }
  dragging = true;
  dragStart = p;
  lastPos = { x: imgX, y: imgY };
});
canvas.addEventListener('mousemove', (e)=>{
  if(!dragging && !draggingFlag) return;
  const p = toCanvasPoint(e.clientX, e.clientY);
  const dx = p.x - dragStart.x;
  const dy = p.y - dragStart.y;
  if (draggingFlag) {
    const fh = SIZES.flagH * 1.5; const fw = Math.round(fh * 48/32);
    const newTopLeftX = p.x - flagDragOffset.dx;
    const newTopLeftY = p.y - flagDragOffset.dy;
    layout.flag.x = newTopLeftX;
    layout.flag.y = newTopLeftY + fh - 8;
    draw();
  } else {
    imgX = lastPos.x + dx;
    imgY = lastPos.y + dy;
    clampImageOffset();
    draw();
  }
});
window.addEventListener('mouseup', ()=>{
  if (draggingFlag) {
    console.log(`[layout] flag => (${layout.flag.x.toFixed(1)}, ${layout.flag.y.toFixed(1)})`);
  }
  dragging = false; draggingFlag = false;
});

// Touch support with pinch-to-zoom
let pinchZooming = false;
let pinchStartDist = 0;
let pinchStartScale = 1;

function touchDistance(t1, t2){
  const dx = t2.clientX - t1.clientX; const dy = t2.clientY - t1.clientY; return Math.hypot(dx, dy);
}

canvas.addEventListener('touchstart', (e)=>{
  if (e.touches.length === 2) {
    // Always prevent scrolling for pinch-to-zoom gestures
    e.preventDefault();
    pinchZooming = true;
    pinchStartDist = touchDistance(e.touches[0], e.touches[1]);
    pinchStartScale = imgScale;
    return;
  }
  if(e.touches.length!==1) return;
  
  const p = toCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
  
  // Only prevent scrolling if touching interactive areas
  if (isPointInFlag(p.x, p.y) || isPointInImageArea(p.x, p.y)) {
    e.preventDefault();
    if (isPointInFlag(p.x, p.y)) {
      draggingFlag = true; dragging = true;
      const fh = SIZES.flagH * 1.5; const fw = Math.round(fh * 48/32);
      const topLeftY = layout.flag.y - fh + 8;
      flagDragOffset.dx = p.x - layout.flag.x;
      flagDragOffset.dy = p.y - topLeftY;
    } else {
      dragging = true;
      dragStart = p;
      lastPos = { x: imgX, y: imgY };
    }
  }
}, { passive: false });
canvas.addEventListener('touchmove', (e)=>{
  if (e.touches.length === 2) {
    // Always prevent scrolling for pinch-to-zoom gestures
    e.preventDefault();
    const dist = touchDistance(e.touches[0], e.touches[1]);
    if (!pinchZooming) { pinchZooming = true; pinchStartDist = dist; pinchStartScale = imgScale; }
    const scaleFactor = dist / (pinchStartDist || 1);
    const maxScale = MAX_ZOOM_RATIO * minScale;
    imgScale = Math.max(Number(zoomRange.min), Math.min(maxScale, pinchStartScale * scaleFactor));
    zoomRange.value = String(imgScale);
    clampImageOffset();
    draw();
    return;
  }
  if((!dragging && !draggingFlag) || e.touches.length!==1) return;
  
  const p = toCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
  
  // Only prevent scrolling if we're actively dragging in interactive areas
  if (draggingFlag || (dragging && isPointInImageArea(p.x, p.y))) {
    e.preventDefault();
    if (draggingFlag) {
      const fh = SIZES.flagH * 1.5; const fw = Math.round(fh * 48/32);
      const newTopLeftX = p.x - flagDragOffset.dx;
      const newTopLeftY = p.y - flagDragOffset.dy;
      layout.flag.x = newTopLeftX;
      layout.flag.y = newTopLeftY + fh - 8;
      draw();
    } else {
      const dx = p.x - dragStart.x;
      const dy = p.y - dragStart.y;
      imgX = lastPos.x + dx;
      imgY = lastPos.y + dy;
      clampImageOffset();
      draw();
    }
  }
}, { passive: false });
window.addEventListener('touchend', ()=>{ 
  if (draggingFlag) {
    console.log(`[layout] flag => (${layout.flag.x.toFixed(1)}, ${layout.flag.y.toFixed(1)})`);
  }
  dragging = false; draggingFlag = false; pinchZooming = false; 
});

function isPointInFlag(px, py){
  const fh = SIZES.flagH * 1.5; const fw = Math.round(fh * 48/32);
  const x = layout.flag.x; const y = layout.flag.y - fh + 8;
  return px >= x && px <= x + fw && py >= y && py <= y + fh;
}

function isPointInImageArea(px, py){
  // Check if point is within the photo frame area
  return px >= frame.x && px <= frame.x + frame.w && 
         py >= frame.y && py <= frame.y + frame.h;
}

function getCurrentStatsCount() {
  const ids = getActiveStatIds();
  let count = 0;
  ids.forEach(id => { const v = stats[id]?.value?.toString().trim(); if (v) count++; });
  const sox = stats.SOX?.value?.toString().trim();
  if (sox) count += 1;
  return Math.min(7, count);
}

function textBounds(text, font, x, y, align='left'){
  ctx.save();
  ctx.font = font;
  const w = ctx.measureText(text).width;
  ctx.restore();
  const h = parseInt(font,10) || 24;
  let left = x, top = y-h;
  if (align === 'center') left = x - w/2;
  return { x: left, y: top, w, h };
}

function rectContains(r, px, py){
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function hitTest(px, py){
  // Name
  const nameRect = textBounds((nameInput.value||'PLAYER NAME').toUpperCase(), `bold ${SIZES.name}px Arial`, layout.name.x, layout.name.y, 'center');
  // Overall circle
  ctx.save();
  ctx.font = `bold ${SIZES.overall}px Arial`;
  const ovText = String(calcOverall());
  const ovW = ctx.measureText(ovText).width;
  const circlePad = 10;
  const radius = Math.max(SIZES.overall * 0.7, ovW/2 + 14) + circlePad;
  const dx = px - layout.overall.x;
  const dy = py - layout.overall.y;
  const inOverall = (dx*dx + dy*dy) <= radius*radius;
  ctx.restore();
  // Position
  const posRect = textBounds(posSelect.value||'GK', `bold ${SIZES.position}px Arial`, layout.position.x, layout.position.y, 'left');
  // Flag
  const flagRect = { x: layout.flag.x, y: layout.flag.y - SIZES.flagH, w: Math.round(SIZES.flagH * 48/32), h: SIZES.flagH };
  // Stats areas
  const colWidth = 320;
  const currentCount = getCurrentStatsCount();
  const sizeDrop = Math.max(0, Math.floor((currentCount - 5) / 2)) * 5;
  const statsFontSize = Math.max(28, SIZES.stats - sizeDrop);
  const lineH = statsFontSize + 10;
  const rows = Math.ceil(currentCount / 2);
  const statsLeftRect = { x: layout.statsLeft.x - colWidth, y: layout.statsLeft.y - lineH, w: colWidth, h: lineH * rows };
  const statsRightRect = { x: layout.statsRight.x, y: layout.statsRight.y - lineH, w: colWidth, h: lineH * rows };
  const order = [
    { id:'flag', rect: flagRect },
    { id:'name', rect: nameRect },
    { id:'position', rect: posRect },
    { id:'statsRight', rect: statsRightRect },
    { id:'statsLeft', rect: statsLeftRect }
  ];
  if (inOverall) return { id:'overall' };
  for (const item of order) {
    if (item.rect && rectContains(item.rect, px, py)) return item;
  }
  return null;
}


// Text/selection updates
[nameInput, posSelect, countrySelect, houseSelect, ...Object.values(stats)].forEach(el=>{
  el.addEventListener('input', ()=>{ saveState(); draw(); });
});

if (downloadBtn) downloadBtn.addEventListener('click', ()=>{
  // Ensure latest draw
  draw();
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  const name = (nameInput.value || 'player').replace(/\s+/g,'_');
  a.download = `player_card_${name}.png`;
  a.click();
  // analytics
  const house = houseSelect ? houseSelect.value || 'None' : 'None';
  const variant = resolveHouseVariant(house);
  const country = countrySelect ? countrySelect.value : '';
  const pos = posSelect.value;
  const overall = calcOverall();
  const statsCount = getCurrentStatsCount();
  logAnalytics('fc_card_download', { house, variant, country, pos, overall, statsCount, bgRemoved: !!bgActive });
});

async function doDownload(){
  draw();
  
  // Generate unique filename
  const name = (nameInput.value || 'player').replace(/\s+/g,'_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `player_card_${name}_${timestamp}.png`;
  
  // Create download link and trigger download
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
  
  // Also save to Firebase Storage (silently, don't block user experience)
  try {
    const storage = window.firebaseStorage;
    if (storage) {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // Generate unique card ID for storage
            const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageRef = storage.ref(storage.storage, `cards/${cardId}.png`);
            await storage.uploadBytes(imageRef, blob);
            
            // Log successful upload (silently)
            console.log(`Card saved to Firebase Storage: ${cardId}`);
          } catch (error) {
            // Log error but don't show to user
            console.warn('Failed to save card to Firebase Storage:', error);
          }
        }
      }, 'image/png');
    }
  } catch (error) {
    // Silently handle any errors
    console.warn('Firebase Storage not available:', error);
  }
  
  // Analytics
  const house = houseSelect ? houseSelect.value || 'None' : 'None';
  const variant = resolveHouseVariant(house);
  const country = countrySelect ? countrySelect.value : '';
  const pos = posSelect.value;
  const overall = calcOverall();
  const statsCount = getCurrentStatsCount();
  logAnalytics('fc_card_download', { house, variant, country, pos, overall, statsCount, bgRemoved: !!bgActive });
}

function setUploadAsDownload(on){
  if (!uploadBtnWrap) return;
  const uploadInput = document.getElementById('photoInput');
  const span = uploadBtnWrap.querySelector('span');
  if (on) {
    if (span) span.textContent = 'Download Card';
    if (uploadInput) uploadInput.style.display = 'none';
    uploadBtnWrap.dataset.mode = 'download';
  } else {
    if (span) span.textContent = 'Upload Photo';
    if (uploadInput) uploadInput.style.display = '';
    // Ensure selecting the same file again triggers change
    if (uploadInput) uploadInput.value = '';
    uploadBtnWrap.dataset.mode = 'upload';
  }
}

if (uploadBtnWrap) {
  uploadBtnWrap.addEventListener('click', (e) => {
    if (uploadBtnWrap.dataset.mode === 'download') {
      e.preventDefault();
      doDownload();
    }
  });
}

function updateZoomDisplay(){
  if (!zoomRange || !zoomValue) return;
  const min = Number(zoomRange.min||'1');
  const max = Number(zoomRange.max||'1');
  const cur = Number(zoomRange.value||'1');
  const pct = Math.round(((cur - min) / (max - min || 1)) * 100);
  zoomValue.textContent = `${pct}%`;
}

if (zoomPlus) {
  zoomPlus.addEventListener('click', ()=>{
    const min = Number(zoomRange.min||'1');
    const max = Number(zoomRange.max||'1');
    const step = (max - min) / 100;
    imgScale = Math.min(max, Number(zoomRange.value||'1') + step);
    zoomRange.value = String(imgScale);
    clampImageOffset();
    updateZoomDisplay();
    draw();
  });
}
if (zoomMinus) {
  zoomMinus.addEventListener('click', ()=>{
    const min = Number(zoomRange.min||'1');
    const max = Number(zoomRange.max||'1');
    const step = (max - min) / 100;
    imgScale = Math.max(min, Number(zoomRange.value||'1') - step);
    zoomRange.value = String(imgScale);
    clampImageOffset();
    updateZoomDisplay();
    draw();
  });
}

// Initial draw after assets loaded
cardImg.onload = draw;
// Re-draw when web fonts are ready (for proper canvas text metrics)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => draw()).catch(()=>{});
}
// Initial background
updateCardBackground();

// Initialize stat input visibility and update on position change
updateStatInputVisibility();
posSelect.addEventListener('change', () => {
  updateStatInputVisibility();
  draw();
});

// Background removal button behavior
async function runBackgroundRemoval() {
  if (!userImg) {
    if (bgStatus) bgStatus.textContent = 'Upload a photo first';
    return;
  }
  try {
    if (bgStatus) bgStatus.textContent = '';
    if (removeBgBtn) removeBgBtn.style.display = 'none';
    if (bgSpinner) bgSpinner.style.display = '';
    const net = await ensureBodyPixLoaded();
    if (!net) {
      if (removeBgBtn) removeBgBtn.style.display = '';
      if (bgSpinner) bgSpinner.style.display = 'none';
      return;
    }
    await generateMaskedImage();
  } catch (e) {
    if (removeBgBtn) removeBgBtn.style.display = '';
    if (bgSpinner) bgSpinner.style.display = 'none';
  }
}

if (removeBgBtn) {
  removeBgBtn.addEventListener('click', () => {
    logAnalytics('fc_remove_bg_click');
    runBackgroundRemoval();
  });
}

// Update background when house changes
if (houseSelect) {
  houseSelect.addEventListener('change', () => {
    updateCardBackground();
    const variant = resolveHouseVariant(houseSelect.value);
    logAnalytics('fc_house_select', { house: houseSelect.value || 'None', variant });
  });
}

function logAnalytics(name, params){
  if (typeof window !== 'undefined' && typeof window.analyticsLogEvent === 'function') {
    try { window.analyticsLogEvent(name, params || {}); } catch(_) {}
  }
}

// When controls change after activation, re-run masking
if (removeBgThresholdEl) {
  removeBgThresholdEl.addEventListener('input', async () => {
    if (!bgActive || !userImg) return;
    await generateMaskedImage();
  });
}
if (invertMaskToggle) {
  // Keep for hidden input syncing via button
}

// Invert control removed from UI; keep default via hidden checkbox

function updateThresholdDisplay(){
  if (!removeBgThresholdEl || !thrValue) return;
  const v = Number(removeBgThresholdEl.value || '0.5');
  thrValue.textContent = `${Math.round(v * 100)}%`;
}

function adjustThreshold(delta){
  if (!removeBgThresholdEl) return;
  const min = Number(removeBgThresholdEl.min || '0.05');
  const max = Number(removeBgThresholdEl.max || '0.99');
  const cur = Number(removeBgThresholdEl.value || '0.5');
  const step = 0.10; // 10%
  const next = Math.max(min, Math.min(max, cur + delta * step));
  removeBgThresholdEl.value = next.toFixed(2);
  updateThresholdDisplay();
}

if (thrPlus) {
  thrPlus.addEventListener('click', async (e) => {
    e.preventDefault(); e.stopPropagation();
    adjustThreshold(+1);
    if (bgActive && userImg) await generateMaskedImage();
  });
}
if (thrMinus) {
  thrMinus.addEventListener('click', async (e) => {
    e.preventDefault(); e.stopPropagation();
    adjustThreshold(-1);
    if (bgActive && userImg) await generateMaskedImage();
  });
}

// (Old checkbox-based background removal code removed)

// (Layout controls removed)
