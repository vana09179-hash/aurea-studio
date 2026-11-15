/* Aurea Studio — editor */
'use strict';
window.__errors = [];
addEventListener('error', e => window.__errors.push(String(e.message) + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno));
addEventListener('unhandledrejection', e => window.__errors.push('rej: ' + String(e.reason && (e.reason.stack || e.reason))));

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const api = window.aurea || {};
const { W, H } = Aurea;
const TPL = AureaTemplates;
const uid = TPL.uid;
const clone = (o) => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;

// ---------------- icons ----------------
const IC = {
  text: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  shapes: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><circle cx="17" cy="17" r="4"/><path d="M17 3l4 7h-8z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  line: '<path d="M4 20 20 4"/>',
  hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  export: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  magnet: '<path d="M5 4h4v7a3 3 0 0 0 6 0V4h4v7a7 7 0 0 1-14 0z"/><path d="M5 8h4M15 8h4"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
  presenter: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c5.5 0 9 6 9 6a17 17 0 0 1-3 3.5M6.6 6.6C4.2 8.2 3 12 3 12s3.5 6 9 6a9 9 0 0 0 4-.9"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  alL: '<path d="M4 3v18"/><rect x="7" y="6" width="12" height="4" rx="1"/><rect x="7" y="14" width="7" height="4" rx="1"/>',
  alC: '<path d="M12 3v18"/><rect x="5" y="6" width="14" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/>',
  alR: '<path d="M20 3v18"/><rect x="5" y="6" width="12" height="4" rx="1"/><rect x="10" y="14" width="7" height="4" rx="1"/>',
  alT: '<path d="M3 4h18"/><rect x="6" y="7" width="4" height="12" rx="1"/><rect x="14" y="7" width="4" height="7" rx="1"/>',
  alM: '<path d="M3 12h18"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/>',
  alB: '<path d="M3 20h18"/><rect x="6" y="5" width="4" height="12" rx="1"/><rect x="14" y="10" width="4" height="7" rx="1"/>',
  disH: '<path d="M3 3v18M21 3v18"/><rect x="9" y="7" width="6" height="10" rx="1"/>',
  disV: '<path d="M3 3h18M3 21h18"/><rect x="7" y="9" width="10" height="6" rx="1"/>',
  tL: '<path d="M4 6h16M4 12h10M4 18h14"/>', tC: '<path d="M4 6h16M7 12h10M5 18h14"/>', tR: '<path d="M4 6h16M10 12h10M6 18h14"/>',
  front: '<rect x="8" y="8" width="12" height="12" rx="2" fill="currentColor" fill-opacity=".35"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
  back: '<rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" fill-opacity=".35"/><path d="M20 8v10a2 2 0 0 1-2 2H8"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  save: '<path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8M7 21v-7h10v7"/>',
  home: '<path d="M3 11 12 3l9 8M5 9v11h14V9"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 3"/>',
  wand: '<path d="m15 4 5 5L9 20l-5-5z"/><path d="M14 9l1 1M4 4l2 2M3 9h2M9 3v2"/>',
  bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
  italic: '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  caps: '<path d="M3 18 7.5 6 12 18M4.5 14h6M14 18l3-8 3 8M15 15.5h4"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8"/>'
};
const svgI = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${IC[n] || ''}</svg>`;
const icon = (n) => { const t = document.createElement('template'); t.innerHTML = svgI(n); return t.content.firstChild; };
function hydrateIcons(root = document) { $$('svg[data-i]', root).forEach(s => { s.outerHTML = svgI(s.dataset.i); }); }

const SHAPES = {
  rect: '<rect x="3" y="5" width="18" height="14" rx="1"/>', rounded: '<rect x="3" y="5" width="18" height="14" rx="5"/>',
  ellipse: '<ellipse cx="12" cy="12" rx="9" ry="8"/>', arch: '<path d="M5 21V11a7 7 0 0 1 14 0v10z"/>',
  triangle: '<path d="M12 4l9 16H3z"/>', diamond: '<path d="M12 3l9 9-9 9-9-9z"/>', hexagon: '<path d="M7 4h10l5 8-5 8H7l-5-8z"/>',
  star: '<path d="m12 3 2.7 6 6.3.6-4.8 4.2 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.6 9.3 9z"/>', arrow: '<path d="M3 9h11V5l7 7-7 7v-4H3z"/>',
  frame: '<rect x="3" y="4" width="18" height="16"/><rect x="6" y="7" width="12" height="10" stroke-width="1"/>',
  glass: '<rect x="3" y="5" width="18" height="14" rx="4" fill="currentColor" fill-opacity=".18"/>',
  glow: '<circle cx="12" cy="12" r="8" fill="currentColor" fill-opacity=".35" stroke="none"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  blob: '<path d="M12 3c5 0 9 3 8.5 8.5S16 21 11 20.5 3 16 3.5 11 7 3 12 3z"/>', ring: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>'
};
const SHAPE_NAMES = { rect: 'Прямокутник', rounded: 'Заокруглений', ellipse: 'Еліпс', arch: 'Арка', triangle: 'Трикутник', diamond: 'Ромб', hexagon: 'Шестикутник', star: 'Зірка', arrow: 'Стрілка', frame: 'Орнаментна рамка', glass: 'Скляна картка', glow: 'Сяйво', blob: 'Пляма', ring: 'Кільце' };
const shapeIcon = (k) => { const t = document.createElement('template'); t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${SHAPES[k]}</svg>`; return t.content.firstChild; };

const FONTS = ['Inter', 'Manrope', 'Onest', 'Montserrat', 'Raleway', 'Unbounded', 'Oswald', 'Comfortaa', 'Playfair Display', 'Cormorant Garamond', 'Lora', 'JetBrains Mono', 'Georgia', 'Times New Roman', 'Segoe UI', 'Arial', 'Impact'];
const THEME_FONTS = {
  museum: ['Playfair Display', 'Cormorant Garamond', 'Montserrat'], saas: ['Inter', 'Inter', 'Inter'], journal: ['Playfair Display', 'Lora', 'Raleway'],
  aurora: ['Unbounded', 'Onest', 'Onest'], paper: ['Manrope', 'Manrope', 'Manrope'], blank: ['Inter', 'Inter', 'Inter']
};

// ---------------- DOM helper ----------------
function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const k in props) {
    const v = props[k];
    if (v === false || v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'value') e.value = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c instanceof Node ? c : document.createTextNode(c));
  return e;
}

// ---------------- state ----------------
let P = null, cur = 0, sel = [], filePath = null, dirty = false;
let undoStack = [], redoStack = [], lastCk = { key: null, t: 0 };
let scale = 0.5, zoomMode = 'fit', zoomVal = 1, snapOn = true;
let tab = 'design', editingId = null, clipboard = null, pasteN = 0;
const stageHost = $('#stageHost'), overlay = $('#overlay'), viewport = $('#viewport'), canvasWrap = $('#canvasWrap');

const slideCur = () => P.slides[cur];
const elById = (id) => slideCur().elements.find(e => e.id === id);
const selected = () => sel.map(elById).filter(Boolean);
const nodeOf = (id) => stageHost.querySelector(`.a-el[data-id="${id}"]`);
const themeName = () => (P.theme && P.theme.name) || 'blank';
const fontsFor = () => THEME_FONTS[themeName()] || THEME_FONTS.blank;
function palette() {
  const base = (P && P.theme && P.theme.colors) || [];
  return [...new Set([...base, '#ffffff', '#000000', '#9d8bff', '#e8c27a'])].slice(0, 12);
}
function isLight(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  let x = hex.slice(1); if (x.length === 3) x = [...x].map(c => c + c).join('');
  const n = parseInt(x.slice(0, 6), 16);
  return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) > 150;
}
const toHex6 = (c) => /^#[0-9a-f]{6}$/i.test(c || '') ? c : /^#[0-9a-f]{3}$/i.test(c || '') ? '#' + [...c.slice(1)].map(x => x + x).join('') : '#ffffff';

// ---------------- history ----------------
const snapState = () => JSON.stringify({ slides: P.slides, title: P.title, theme: P.theme });
function ck(key) {
  const now = Date.now();
  if (key && key === lastCk.key && now - lastCk.t < 1000) { lastCk.t = now; return; }
  undoStack.push({ s: snapState(), cur, sel: [...sel] });
  if (undoStack.length > 200) undoStack.shift();
  redoStack.length = 0;
  lastCk = { key, t: now };
  updateUndoBtns();
}
function restore(st) {
  const o = JSON.parse(st.s);
  P.slides = o.slides; P.title = o.title; P.theme = o.theme;
  cur = clamp(st.cur, 0, P.slides.length - 1);
  sel = st.sel.filter(id => elById(id));
  lastCk = { key: null, t: 0 };
  $('#docTitle').value = P.title;
  changed('all');
}
function undo() { finishEdit(); if (!undoStack.length) return toast('Нічого скасовувати'); redoStack.push({ s: snapState(), cur, sel: [...sel] }); restore(undoStack.pop()); }
function redo() { finishEdit(); if (!redoStack.length) return; undoStack.push({ s: snapState(), cur, sel: [...sel] }); restore(redoStack.pop()); }
function updateUndoBtns() { $('#undoBtn').disabled = !undoStack.length; $('#redoBtn').disabled = !redoStack.length; }

// ---------------- change propagation ----------------
let thumbTimer = null;
function changed(scope = 'all') {
  dirty = true;
  if (scope === 'all') { renderStrip(); renderCanvas(); renderProps(); }
  else if (scope === 'canvas') { renderCanvas(); queueThumb(); }
  else if (scope === 'canvas+props') { renderCanvas(); renderProps(); queueThumb(); }
  else if (scope === 'strip') { renderStrip(); }
  updateUndoBtns();
  scheduleSave();
}
function queueThumb() { clearTimeout(thumbTimer); thumbTimer = setTimeout(() => renderThumb(cur), 160); }

// ---------------- autosave ----------------
let saveTimer = null;
function setSaveState(s) {
  const c = $('#saveChip');
  c.classList.toggle('busy', s === 'busy'); c.classList.toggle('dirty', s === 'dirty');
  c.querySelector('span').textContent = { busy: 'Збереження…', dirty: 'Є зміни', saved: 'Збережено', local: 'Автозбережено' }[s] || '';
  c.title = s === 'local' ? 'Збережено в резервну копію. Натисніть Ctrl+S, щоб зберегти у файл.' : (filePath || '');
}
function scheduleSave() { setSaveState('dirty'); clearTimeout(saveTimer); saveTimer = setTimeout(doAutosave, 1200); }
const serialize = () => JSON.stringify({ ...P, format: 'aurea', version: 1, savedAt: Date.now() });
async function doAutosave() {
  if (!P || !api.autosave) return;
  setSaveState('busy');
  const data = serialize();
  await api.autosave(data);
  if (filePath) { await api.writeQuiet({ path: filePath, data }); dirty = false; }
  setTimeout(() => setSaveState(filePath ? 'saved' : 'local'), 250);
}

// ---------------- toast / busy ----------------
function toast(msg, action) {
  const t = h('div', { class: 'toast' }, msg);
  if (action) t.append(' ', h('a', { onclick: action.fn }, action.label));
  $('#toast').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, action ? 5000 : 2400);
}
function busy(msg) {
  $('.busy-ov')?.remove();
  if (msg) document.body.append(h('div', { class: 'busy-ov' }, h('div', { style: 'display:grid;justify-items:center;gap:14px' }, h('div', { class: 'spinner' }), h('div', { style: 'color:#ddd' }, msg))));
}

// ---------------- menus ----------------
let menuEl = null;
function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; if (viewerOpen) api.htmlHide?.(false); } }
function menu(x, y, items) {
  closeMenu();
  const m = h('div', { class: 'menu glass' });
  for (const it of items) {
    if (!it) continue;
    if (it === '-') m.append(h('div', { class: 'msep' }));
    else if (it.header) m.append(h('div', { class: 'mlabel' }, it.header));
    else if (it.node) m.append(it.node);
    else m.append(h('button', { class: 'mi', onclick: () => { closeMenu(); it.fn(); } }, it.icon ? icon(it.icon) : h('span', { style: 'width:16px' }), it.label, it.kbd ? h('kbd', {}, it.kbd) : null));
  }
  document.body.append(m);
  const r = m.getBoundingClientRect();
  m.style.left = clamp(x, 8, innerWidth - r.width - 8) + 'px';
  m.style.top = clamp(y, 8, innerHeight - r.height - 8) + 'px';
  menuEl = m;
  if (viewerOpen) api.htmlHide?.(true);
  setTimeout(() => {
    const off = (e) => { if (menuEl && !menuEl.contains(e.target)) { closeMenu(); removeEventListener('pointerdown', off, true); } };
    addEventListener('pointerdown', off, true);
  });
  return m;
}
const menuAt = (btn, items) => { const r = btn.getBoundingClientRect(); return menu(r.left, r.bottom + 6, items); };

// ================= START SCREEN =================
const THUMB_W = 354;
function animateThumb(tw, slide, proj) {
  if (tw.dataset.busy) return;
  tw.dataset.busy = '1';
  const th = Aurea.thumb(slide, proj, THUMB_W, { mode: 'play' });
  th.classList.add('a-play');
  tw.replaceChildren(th);
  for (const el of slide.elements) {
    if (!el.anim || el.anim.type === 'none') continue;
    const n = th.querySelector(`[data-id="${el.id}"]`);
    if (n) { n.classList.add('a-pre'); Aurea.playIn(n, el, { offset: el.anim.trigger === 'click' ? 1200 : 0 }); }
  }
  setTimeout(() => { delete tw.dataset.busy; }, 1500);
}

async function renderStart() {
  const st = $('#start');
  const rec = api.recovery ? await api.recovery() : null;
  const recent = api.recent ? await api.recent() : [];
  const grid = h('div', { class: 'tgrid' });
  TPL.list.forEach((t, i) => {
    const proj = t.make();
    const tw = h('div', { class: 'tw' }, Aurea.thumb(proj.slides[0], proj, THUMB_W));
    const card = h('div', { class: 'tcard2 glass', style: `animation-delay:${.08 * i}s`, onclick: () => createFromTemplate(t), onmouseenter: () => animateThumb(tw, proj.slides[0], proj) },
      tw, h('div', { class: 'meta' }, h('div', {}, h('b', {}, t.name), h('small', {}, `${t.desc} · ${proj.slides.length} сл.`)), h('span', { class: 'go' }, icon('right'))));
    grid.append(card);
  });
  let recBlock = null;
  if (rec && rec.data) {
    let title = 'Остання робота';
    try { title = JSON.parse(rec.data).title || title; } catch { }
    recBlock = h('div', { class: 'ritem glass', onclick: () => openData(rec.data, null) }, h('span', { class: 'ic', style: 'background:rgba(232,194,122,.15);color:#e8c27a' }, icon('restore')),
      h('div', {}, h('b', {}, 'Продовжити: ' + title), h('small', { style: 'direction:ltr' }, 'Автозбереження · ' + new Date(rec.time).toLocaleString('uk-UA'))));
  }
  const recentList = recent.map(r => h('div', { class: 'ritem glass', onclick: () => openPath(r.path), title: r.path },
    h('span', { class: 'ic' + (isHtml(r.path) ? ' html' : '') }, icon(isHtml(r.path) ? 'code' : 'file')), h('div', {}, h('b', {}, r.title || r.path.split(/[\\/]/).pop()), h('small', {}, r.path))));
  st.replaceChildren(h('div', { class: 'start-inner' },
    h('div', { class: 'hero' },
      h('div', {}, h('h1', {}, 'Aurea Studio'), h('p', {}, 'Створюйте анімовані презентації з ефектом «вау»: morph-переходи, лічильники, shine і поява по черзі — у кілька кліків.')),
      h('div', { class: 'acts' },
        h('button', { class: 'btn', onclick: () => openFile() }, icon('folder'), 'Відкрити…'),
        h('button', { class: 'btn', onclick: () => openHtmlFile(), title: 'Переглянути й показати готову HTML-презентацію' }, icon('code'), 'Відкрити HTML-презентацію'),
        h('button', { class: 'btn', onclick: () => openPptxFile(), title: 'Імпорт файлу .pptx' }, icon('slides'), 'Імпорт .pptx'),
        h('button', { class: 'btn-primary', onclick: () => createFromTemplate(TPL.list.find(t => t.id === 'blank')) }, icon('plus'), 'Нова презентація'))),
    (recBlock || recent.length) ? h('div', {}, h('div', { class: 'shead' }, h('h3', {}, 'Продовжити роботу')), h('div', { class: 'recent' }, recBlock, ...recentList)) : null,
    h('div', { class: 'shead' }, h('h3', {}, 'Галерея шаблонів'), h('span', { style: 'color:var(--mu);font-size:12px' }, 'Наведіть курсор — побачите анімацію')),
    grid,
    h('div', { class: 'foot-note' }, 'Зображення в шаблонах — картини з Wikimedia Commons у суспільному надбанні. Для власних слайдів беріть фото з вільною ліцензією (Wikimedia Commons, Unsplash, Pexels) і вказуйте автора.')
  ));
}

async function toDataURL(url) {
  const b = await (await fetch(url)).blob();
  return new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });
}
async function createFromTemplate(t) {
  busy('Готую шаблон…');
  try {
    const proj = t.make();
    for (const k in proj.assets) if (!String(proj.assets[k]).startsWith('data:')) proj.assets[k] = await toDataURL(proj.assets[k]);
    loadProject(proj, null);
    toast(`Шаблон «${t.name}» відкрито`);
  } finally { busy(false); }
}

function normalize(p) {
  p.assets = p.assets || {};
  p.theme = p.theme || { name: 'blank', colors: [] };
  p.title = p.title || 'Презентація';
  for (const s of p.slides) {
    s.id = s.id || uid(); s.bg = s.bg || { color: '#0a0a0c' }; s.elements = s.elements || []; s.notes = s.notes || ''; s.transition = s.transition || 'fade';
    for (const e of s.elements) { e.id = e.id || uid(); e.morph = e.morph || uid(); e.style = e.style || {}; e.anim = { type: 'none', trigger: 'auto', delay: 0, dur: 900, loop: true, order: 0, ...(e.anim || {}) }; e.rot = e.rot || 0; e.opacity = e.opacity ?? 1; }
  }
  return p;
}
function loadProject(proj, path) {
  P = normalize(proj); filePath = path || null; cur = 0; sel = []; undoStack = []; redoStack = []; dirty = false;
  showEditor();
  doAutosave();
}
function openData(data, path) {
  try {
    const o = JSON.parse(data);
    if (!o || !Array.isArray(o.slides)) throw new Error('bad');
    loadProject(o, path);
  } catch { toast('Не вдалося відкрити файл: невідомий формат'); }
}
async function openFile() { const r = await api.open?.(); if (r) openData(r.data, r.path); }
const isHtml = (p) => /\.html?$/i.test(p || '');
async function openHtmlFile() { closeMenu(); await api.openHtml?.(); }
async function openHtmlPath(p) { const r = await api.openHtmlPath(p); if (r && r.error) { toast('Файл недоступний: ' + p); api.removeRecent(p); renderStart(); } }
async function openPath(p) { if (isHtml(p)) return openHtmlPath(p); const r = await api.openPath(p); if (r.error) { toast('Файл недоступний'); api.removeRecent(p); renderStart(); } else openData(r.data, r.path); }

function showEditor() {
  $('#start').classList.add('hidden');
  $('#editor').classList.remove('hidden');
  ['#docTitle', '#tools', '#rightTools', '#saveChip'].forEach(s => $(s).classList.remove('hidden'));
  $('#docTitle').value = P.title;
  renderStrip(); renderCanvas(); renderProps(); updateUndoBtns();
  setSaveState(filePath ? 'saved' : 'local');
  requestAnimationFrame(() => fitScale());
}
async function goHome() {
  if (viewerOpen) await api.closeHtml();
  finishEdit();
  if (P) await doAutosave();
  $('#editor').classList.add('hidden');
  ['#docTitle', '#tools', '#rightTools', '#saveChip'].forEach(s => $(s).classList.add('hidden'));
  $('#start').classList.remove('hidden');
  renderStart();
}

// ================= STRIP =================
const TR_NAMES = { none: 'Без переходу', fade: 'Fade', morph: 'Morph', slide: 'Зсув', push: 'Вгору', zoom: 'Zoom', blur: 'Розмиття', circle: 'Коло', curtain: 'Завіса', flip: '3D-поворот', doors: 'Двері', dip: 'Крізь темряву', swirl: 'Вихор' };
function stripItem(s, i) {
  const animN = s.elements.filter(e => e.anim && e.anim.type !== 'none').length;
  const tw = h('div', { class: 'tw' }, Aurea.thumb(s, P, 184),
    h('div', { class: 'badge' }, s.transition === 'morph' ? h('span', {}, '⟿ Morph') : null, animN ? h('span', {}, '✦ ' + animN) : null));
  const it = h('div', { class: 'sitem' + (i === cur ? ' cur' : '') + (s.skip ? ' skip' : ''), draggable: 'true', 'data-i': i }, h('div', { class: 'num' }, i + 1), tw);
  it.addEventListener('click', () => gotoSlide(i));
  it.addEventListener('dblclick', () => startShow(i));
  it.addEventListener('contextmenu', (e) => { e.preventDefault(); gotoSlide(i); slideMenu(e.clientX, e.clientY, i); });
  it.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/x-slide', String(i)); e.dataTransfer.effectAllowed = 'move'; it.classList.add('dragging'); });
  it.addEventListener('dragend', () => { it.classList.remove('dragging'); $$('.sitem').forEach(x => x.classList.remove('drop-before', 'drop-after')); });
  it.addEventListener('dragover', (e) => {
    if (!e.dataTransfer.types.includes('text/x-slide')) return;
    e.preventDefault();
    const r = it.getBoundingClientRect(), after = e.clientY > r.top + r.height / 2;
    $$('.sitem').forEach(x => x.classList.remove('drop-before', 'drop-after'));
    it.classList.add(after ? 'drop-after' : 'drop-before');
  });
  it.addEventListener('drop', (e) => {
    const from = +e.dataTransfer.getData('text/x-slide');
    if (isNaN(from)) return;
    e.preventDefault();
    const r = it.getBoundingClientRect(), after = e.clientY > r.top + r.height / 2;
    let to = i + (after ? 1 : 0);
    if (from < to) to--;
    if (to === from) return;
    ck();
    const [s2] = P.slides.splice(from, 1);
    P.slides.splice(to, 0, s2);
    cur = to; sel = [];
    changed('all');
  });
  return it;
}
function renderStrip() {
  $('#slideList').replaceChildren(...P.slides.map(stripItem));
  $('#slideCount').textContent = P.slides.length;
  $('#slideInfo').textContent = `Слайд ${cur + 1} з ${P.slides.length}`;
}
function renderThumb(i) {
  const it = $(`.sitem[data-i="${i}"]`);
  if (!it || !P.slides[i]) return;
  it.replaceWith(stripItem(P.slides[i], i));
}
function gotoSlide(i) {
  finishEdit();
  if (i < 0 || i >= P.slides.length) return;
  cur = i; sel = [];
  $$('.sitem').forEach(x => x.classList.toggle('cur', +x.dataset.i === i));
  $(`.sitem[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  $('#slideInfo').textContent = `Слайд ${cur + 1} з ${P.slides.length}`;
  renderCanvas(); renderProps();
  if (typeof renderNotesPane === 'function') renderNotesPane();
  stageHost.classList.remove('swap'); void stageHost.offsetWidth; stageHost.classList.add('swap');
  clearTimeout(gotoSlide.t); gotoSlide.t = setTimeout(() => stageHost.classList.remove('swap'), 500);
}
function slideMenu(x, y, i) {
  const s = P.slides[i];
  menu(x, y, [
    { label: 'Новий слайд', icon: 'plus', kbd: 'Ctrl+M', fn: () => newSlide('title') },
    { label: 'Дублювати (для morph)', icon: 'copy', kbd: 'Ctrl+Shift+D', fn: dupSlide },
    { label: s.skip ? 'Показувати слайд' : 'Пропускати при показі', icon: s.skip ? 'eye' : 'eyeoff', fn: () => { ck(); s.skip = !s.skip; changed('all'); } },
    { label: 'Показ з цього слайда', icon: 'play', kbd: 'Shift+F5', fn: () => startShow(i) },
    '-',
    { label: 'Видалити слайд', icon: 'trash', fn: () => delSlide(i) }
  ]);
}
function newSlide(layout = 'title') {
  finishEdit();
  const base = slideCur();
  const [fH, fB] = fontsFor();
  const light = isLight(base.bg.color);
  const tx = light ? '#16130f' : '#ffffff', mu = light ? '#6b655c' : '#b8b6c2';
  const els = [];
  if (layout !== 'blank') els.push(TPL.T('Заголовок слайда', 160, layout === 'title' ? 400 : 140, 1600, 150, { font: fH, size: layout === 'title' ? 110 : 84, weight: SERIF(fH) ? 500 : 700, color: tx, align: layout === 'title' ? 'center' : 'left', ls: -.01 }, { a: 'fadeUp', d: 100, m: 'title' }));
  if (layout === 'title') els.push(TPL.T('Підзаголовок', 360, 590, 1200, 70, { font: fB, size: 40, color: mu, align: 'center' }, { a: 'fadeUp', d: 400 }));
  if (layout === 'content') els.push(TPL.T('Основний текст слайда. Двічі клацніть, щоб редагувати.\nДругий рядок тексту.', 160, 340, 1400, 400, { font: fB, size: 38, color: mu, lh: 1.55 }, { a: 'stagger', d: 400 }));
  if (layout === 'image') {
    els[0].w = 760; els[0].y = 380; els[0].h = 260; els[0].style.size = 84;
    els.push(TPL.I('', 1000, 140, 760, 800, { mask: 'rounded', radius: 24, shadow: true }, { a: 'blurIn', d: 300 }));
  }
  const s = { id: uid(), bg: clone(base.bg), transition: base.transition === 'none' ? 'fade' : base.transition, notes: '', elements: els };
  ck();
  P.slides.splice(cur + 1, 0, s);
  cur++; sel = [];
  changed('all');
}
const SERIF = (f) => /Playfair|Cormorant|Lora|Georgia|Times/.test(f);
function dupSlide() {
  finishEdit();
  ck();
  const s = clone(slideCur());
  s.id = uid(); s.transition = 'morph';
  s.elements.forEach(e => { e.id = uid(); });
  P.slides.splice(cur + 1, 0, s);
  cur++; sel = [];
  changed('all');
  toast('Слайд продубльовано з morph-переходом — пересуньте або змініть елементи, і вони плавно перетечуть');
}
function delSlide(i = cur) {
  if (P.slides.length <= 1) return toast('Має залишитися хоча б один слайд');
  ck();
  P.slides.splice(i, 1);
  cur = clamp(cur >= i ? cur - 1 : cur, 0, P.slides.length - 1);
  if (cur < 0) cur = 0;
  sel = [];
  changed('all');
}

// ================= CANVAS =================
function fitScale() {
  if (!P) return;
  const r = canvasWrap.getBoundingClientRect();
  const fit = Math.max(0.05, Math.min((r.width - 90) / W, (r.height - 90) / H));
  scale = zoomMode === 'fit' ? fit : zoomVal;
  viewport.style.width = W * scale + 'px';
  viewport.style.height = H * scale + 'px';
  stageHost.style.transform = `scale(${scale})`;
  stageHost.style.setProperty('--s', scale);
  $('#zoomVal').textContent = Math.round(scale * 100) + '%';
  renderOverlay();
  if (typeof updateMinimap === 'function') setTimeout(updateMinimap, 0);
}
new ResizeObserver(() => fitScale()).observe(canvasWrap);
function renderCanvas() {
  if (!P || editingId) return;
  stageHost.classList.remove('a-play');
  stageHost.replaceChildren(Aurea.renderSlide(slideCur(), P, { mode: 'edit' }));
  fitScale();
}

function bbox(els) {
  if (!els.length) return { x: 0, y: 0, w: 0, h: 0 };
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const e of els) {
    const a = (e.rot || 0) * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
    const bw = e.w * c + e.h * s, bh = e.w * s + e.h * c, cx = e.x + e.w / 2, cy = e.y + e.h / 2;
    x1 = Math.min(x1, cx - bw / 2); y1 = Math.min(y1, cy - bh / 2); x2 = Math.max(x2, cx + bw / 2); y2 = Math.max(y2, cy + bh / 2);
  }
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

function renderOverlay(guides = [], tip = null, marquee = null) {
  if (!P) return;
  const parts = [];
  const els = selected();
  const one = els.length === 1;
  for (const e of els) {
    const box = h('div', { class: 'sbox' + (one ? '' : ' multi'), style: `left:${e.x * scale}px;top:${e.y * scale}px;width:${e.w * scale}px;height:${e.h * scale}px;transform:rotate(${e.rot || 0}deg)` });
    if (one && !e.locked) {
      const hs = { nw: [0, 0], n: [.5, 0], ne: [1, 0], e: [1, .5], se: [1, 1], s: [.5, 1], sw: [0, 1], w: [0, .5] };
      const cursors = { nw: 'nwse', se: 'nwse', ne: 'nesw', sw: 'nesw', n: 'ns', s: 'ns', e: 'ew', w: 'ew' };
      for (const k in hs) {
        if (e.type === 'line' && ['n', 's', 'nw', 'ne', 'sw', 'se'].includes(k)) continue;
        box.append(h('div', { class: 'hnd', 'data-h': k, style: `left:${hs[k][0] * 100}%;top:${hs[k][1] * 100}%;cursor:${cursors[k]}-resize` }));
      }
      box.append(h('div', { class: 'rotline' }), h('div', { class: 'hnd', 'data-h': 'rot', style: 'left:50%;top:-26px' }));
    }
    parts.push(box);
  }
  for (const g of guides) parts.push(h('div', { class: 'guide ' + g.axis, style: g.axis === 'x' ? `left:${g.pos * scale}px` : `top:${g.pos * scale}px` }));
  if (tip) parts.push(h('div', { class: 'dimtip', style: `left:${tip.x * scale}px;top:${tip.y * scale}px` }, tip.text));
  if (marquee) parts.push(h('div', { class: 'marquee', style: `left:${marquee.x * scale}px;top:${marquee.y * scale}px;width:${marquee.w * scale}px;height:${marquee.h * scale}px` }));
  if (!guides.length && !tip && !marquee) { const q = quickBar(); if (q) parts.push(q); }
  overlay.replaceChildren(...parts);
}

const toStage = (e) => { const r = viewport.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };

function snapMove(b, others) {
  const th = 7 / scale;
  const xs = [0, W / 2, W], ys = [0, H / 2, H];
  for (const o of others) { const ob = bbox([o]); xs.push(ob.x, ob.x + ob.w / 2, ob.x + ob.w); ys.push(ob.y, ob.y + ob.h / 2, ob.y + ob.h); }
  const best = (cands, lines) => {
    let bd = th + 1, adj = 0, pos = null;
    for (const c of cands) for (const l of lines) { const d = l - c; if (Math.abs(d) < Math.abs(bd)) { bd = d; adj = d; pos = l; } }
    return Math.abs(bd) <= th ? { adj, pos } : { adj: 0, pos: null };
  };
  const bx = best([b.x, b.x + b.w / 2, b.x + b.w], xs), by = best([b.y, b.y + b.h / 2, b.y + b.h], ys);
  const guides = [];
  if (bx.pos != null) guides.push({ axis: 'x', pos: bx.pos });
  if (by.pos != null) guides.push({ axis: 'y', pos: by.pos });
  return { dx: bx.adj, dy: by.adj, guides };
}

function drag(onMove, onUp) {
  const mv = (e) => onMove(e);
  const up = (e) => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); onUp && onUp(e); };
  addEventListener('pointermove', mv);
  addEventListener('pointerup', up);
}

function startMove(e0) {
  const els = selected().filter(e => !e.locked);
  if (!els.length) return;
  const p0 = { x: e0.clientX, y: e0.clientY };
  const orig = els.map(e => ({ e, x: e.x, y: e.y }));
  const others = slideCur().elements.filter(e => !sel.includes(e.id) && !e.hidden && !(e.w >= W * .95 && e.h >= H * .95));
  const b0 = bbox(els);
  let moved = false;
  drag((ev) => {
    let dx = (ev.clientX - p0.x) / scale, dy = (ev.clientY - p0.y) / scale;
    if (!moved && Math.hypot(ev.clientX - p0.x, ev.clientY - p0.y) < 3) return;
    if (!moved) { ck(); moved = true; }
    if (ev.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
    let guides = [];
    if (snapOn && !ev.ctrlKey) { const s = snapMove({ x: b0.x + dx, y: b0.y + dy, w: b0.w, h: b0.h }, others); dx += s.dx; dy += s.dy; guides = s.guides; }
    for (const o of orig) {
      o.e.x = Math.round(o.x + dx); o.e.y = Math.round(o.y + dy);
      const n = nodeOf(o.e.id); if (n) { n.style.left = o.e.x + 'px'; n.style.top = o.e.y + 'px'; }
    }
    renderOverlay(guides, { x: b0.x + dx + b0.w / 2, y: b0.y + dy + b0.h, text: `${Math.round(b0.x + dx)}, ${Math.round(b0.y + dy)}` });
    syncGeomFields();
  }, () => { if (moved) { renderOverlay(); changed('canvas'); syncGeomFields(); } });
}

function startResize(e0, hk) {
  const el = selected()[0];
  if (!el) return;
  const o = { x: el.x, y: el.y, w: el.w, h: el.h, rot: el.rot || 0 };
  const p0 = toStage(e0);
  const cx0 = o.x + o.w / 2, cy0 = o.y + o.h / 2;
  let moved = false;
  if (hk === 'rot') {
    drag((ev) => {
      if (!moved) { ck(); moved = true; }
      const p = toStage(ev);
      let a = Math.atan2(p.y - cy0, p.x - cx0) * 180 / Math.PI + 90;
      if (ev.shiftKey || Math.abs(((a % 45) + 45) % 45) < 3 || Math.abs(((a % 45) + 45) % 45) > 42) a = Math.round(a / (ev.shiftKey ? 15 : 45)) * (ev.shiftKey ? 15 : 45);
      a = ((Math.round(a) % 360) + 360) % 360; if (a > 180) a -= 360;
      el.rot = a;
      const n = nodeOf(el.id); if (n) n.style.transform = a ? `rotate(${a}deg)` : '';
      renderOverlay([], { x: cx0, y: o.y + o.h, text: a + '°' });
      syncGeomFields();
    }, () => { if (moved) changed('canvas'); });
    return;
  }
  const sx = hk.includes('e') ? 1 : hk.includes('w') ? -1 : 0;
  const sy = hk.includes('s') ? 1 : hk.includes('n') ? -1 : 0;
  const rad = o.rot * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  const keepAR = el.type === 'image' && sx && sy;
  drag((ev) => {
    if (!moved) { ck(); moved = true; }
    const p = toStage(ev);
    const dx = p.x - p0.x, dy = p.y - p0.y;
    const lx = dx * cos + dy * sin, ly = -dx * sin + dy * cos;
    let nw = Math.max(8, o.w + sx * lx), nh = Math.max(8, o.h + sy * ly);
    if ((keepAR !== ev.shiftKey) && sx && sy) {
      const k = Math.max(nw / o.w, nh / o.h); nw = o.w * k; nh = o.h * k;
    }
    if (ev.altKey) { // from center
      el.w = Math.round(sx ? o.w + 2 * (nw - o.w) : o.w); el.h = Math.round(sy ? o.h + 2 * (nh - o.h) : o.h);
      el.x = Math.round(cx0 - el.w / 2); el.y = Math.round(cy0 - el.h / 2);
    } else {
      const shx = (nw - o.w) / 2 * sx, shy = (nh - o.h) / 2 * sy;
      const cx = cx0 + shx * cos - shy * sin, cy = cy0 + shx * sin + shy * cos;
      el.w = Math.round(nw); el.h = Math.round(nh);
      el.x = Math.round(cx - nw / 2); el.y = Math.round(cy - nh / 2);
    }
    if (el.type === 'shape' || el.type === 'line' || (el.type === 'image' && el.style.mask === 'arch')) {
      const n = nodeOf(el.id);
      if (n) { const nn = Aurea.renderElement(el, P, { mode: 'edit' }); nn.style.zIndex = n.style.zIndex; n.replaceWith(nn); }
    } else {
      const n = nodeOf(el.id);
      if (n) Object.assign(n.style, { left: el.x + 'px', top: el.y + 'px', width: el.w + 'px', height: el.h + 'px' });
    }
    renderOverlay([], { x: el.x + el.w / 2, y: el.y + el.h, text: `${el.w} × ${el.h}` });
    syncGeomFields();
  }, () => { if (moved) changed('canvas'); });
}

function startMarquee(e0, additive) {
  const p0 = toStage(e0);
  const base = additive ? [...sel] : [];
  let moved = false;
  drag((ev) => {
    const p = toStage(ev);
    const m = { x: Math.min(p0.x, p.x), y: Math.min(p0.y, p.y), w: Math.abs(p.x - p0.x), h: Math.abs(p.y - p0.y) };
    if (m.w + m.h > 4) moved = true;
    if (!moved) return;
    const hit = slideCur().elements.filter(e => !e.locked && !e.hidden).filter(e => { const b = bbox([e]); return b.x < m.x + m.w && b.x + b.w > m.x && b.y < m.y + m.h && b.y + b.h > m.y; }).map(e => e.id);
    sel = [...new Set([...base, ...hit])];
    renderOverlay([], null, m);
  }, () => { renderOverlay(); renderProps(); });
}

viewport.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  closeMenu();
  if (editingId) {
    if (e.target.closest('.a-txt[contenteditable]')) return;
    finishEdit();
  }
  const hnd = e.target.closest('[data-h]');
  if (hnd) { e.preventDefault(); startResize(e, hnd.dataset.h); return; }
  const n = e.target.closest('.a-el');
  const el = n && elById(n.dataset.id);
  if (el && !el.locked) {
    e.preventDefault();
    if (painterArmed) { applyFormatTo(groupIds(el).map(elById)); return; }
    const gids = groupIds(el);
    if (e.shiftKey || e.ctrlKey) { sel = sel.includes(el.id) ? sel.filter(x => !gids.includes(x)) : [...new Set([...sel, ...gids])]; renderOverlay(); renderProps(); return; }
    if (!sel.includes(el.id)) { sel = gids; renderOverlay(); renderProps(); }
    if (e.altKey) altCopy();
    startMove(e);
    return;
  }
  if (!e.shiftKey && sel.length) { sel = []; renderOverlay(); renderProps(); }
  startMarquee(e, e.shiftKey);
});
canvasWrap.addEventListener('pointerdown', (e) => {
  if (e.target === canvasWrap && sel.length) { finishEdit(); sel = []; renderOverlay(); renderProps(); }
});
viewport.addEventListener('dblclick', (e) => {
  const n = e.target.closest('.a-el');
  const el = n && elById(n.dataset.id);
  if (!el || el.locked) return;
  if (el.type === 'text') startEdit(el.id);
  else if (el.type === 'image') replaceImage(el);
});
viewport.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const n = e.target.closest('.a-el');
  const el = n && elById(n.dataset.id);
  if (el && !sel.includes(el.id)) { sel = [el.id]; renderOverlay(); renderProps(); }
  if (!sel.length) {
    const pt = toStage(e);
    return menu(e.clientX, e.clientY, [
      { label: 'Вставити', icon: 'copy', kbd: 'Ctrl+V', fn: paste },
      { label: 'Текст тут', icon: 'text', fn: () => addText('body', pt) },
      { label: 'Зображення…', icon: 'image', fn: () => pickImage(pt) },
      '-', { label: 'Переглянути анімації', icon: 'sparkles', fn: () => previewAnims() }
    ]);
  }
  menu(e.clientX, e.clientY, [
    { label: 'Копіювати', icon: 'copy', kbd: 'Ctrl+C', fn: copySel },
    { label: 'Дублювати', icon: 'copy', kbd: 'Ctrl+D', fn: duplicateSel },
    { label: 'На передній план', icon: 'front', kbd: 'Ctrl+]', fn: () => layer('top') },
    { label: 'На задній план', icon: 'back', kbd: 'Ctrl+[', fn: () => layer('bottom') },
    { label: 'Анімація…', icon: 'sparkles', fn: () => { tab = 'anim'; renderProps(); } },
    { label: selected()[0]?.locked ? 'Розблокувати' : 'Заблокувати', icon: 'lock', fn: toggleLock },
    '-', { label: 'Видалити', icon: 'trash', kbd: 'Del', fn: deleteSel }
  ]);
});
canvasWrap.addEventListener('wheel', (e) => {
  if (!e.ctrlKey) return;
  e.preventDefault();
  zoomMode = 'manual'; zoomVal = clamp(scale * (e.deltaY < 0 ? 1.1 : 0.9), 0.1, 3); fitScale();
}, { passive: false });

// text editing
let editOrig = '';
function startEdit(id) {
  const n = nodeOf(id); const el = elById(id);
  if (!n || !el) return;
  sel = [id]; renderOverlay(); renderProps();
  const t = n.querySelector('.a-txt');
  editingId = id; editOrig = el.content;
  t.textContent = el.content;
  t.contentEditable = 'plaintext-only';
  t.focus();
  const r = document.createRange(); r.selectNodeContents(t);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  overlay.style.opacity = '.35';
  t.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); finishEdit(); } });
  t.addEventListener('blur', () => finishEdit(), { once: true });
}
function finishEdit() {
  if (!editingId) return;
  const id = editingId; editingId = null;
  overlay.style.opacity = '';
  const n = nodeOf(id); const el = elById(id);
  if (n && el) {
    const t = n.querySelector('.a-txt');
    const val = t.innerText.replace(/\n$/, '');
    if (val !== editOrig) { ck(); el.content = val; }
  }
  getSelection().removeAllRanges();
  changed('canvas+props');
}

// ================= INSERT =================
let insertN = 0;
function placeAt(w, h, pt) {
  const off = (insertN++ % 6) * 30;
  if (pt) return { x: Math.round(pt.x - w / 2), y: Math.round(pt.y - h / 2) };
  return { x: Math.round((W - w) / 2 + off), y: Math.round((H - h) / 2 + off) };
}
function insertEl(el) {
  ck();
  slideCur().elements.push(el);
  sel = [el.id];
  changed('canvas+props');
}
function addText(kind = 'body', pt) {
  finishEdit();
  const [fH, fB, fL] = fontsFor();
  const light = isLight(slideCur().bg.color);
  const tx = light ? '#16130f' : '#ffffff', mu = light ? '#4b463f' : '#d6d4de';
  const ac = (P.theme.colors || [])[themeName() === 'museum' ? 2 : 1] || '#e8c27a';
  const presets = {
    title: ['Новий заголовок', 1400, 140, { font: fH, size: 96, weight: SERIF(fH) ? 500 : 700, color: tx, align: 'center', ls: -.01, lh: 1.1 }, 'fadeUp'],
    subtitle: ['Підзаголовок', 1100, 70, { font: fB, size: 44, color: mu, align: 'center', italic: SERIF(fB) }, 'fadeUp'],
    body: ['Двічі клацніть, щоб змінити текст', 900, 120, { font: fB, size: 34, color: mu, lh: 1.5 }, 'fadeUp'],
    label: ['МІТКА РОЗДІЛУ', 600, 40, { font: fL, size: 22, weight: 600, color: ac, ls: .35, upper: true }, 'fadeUp'],
    counter: ['1 500+', 600, 190, { font: fH, size: 160, weight: SERIF(fH) ? 600 : 800, color: ac, align: 'center', lh: 1, ls: -.02 }, 'counter']
  };
  const [c, w, hh, st, a] = presets[kind];
  const p = placeAt(w, hh, pt);
  insertEl(TPL.T(c, p.x, p.y, w, hh, st, { a, d: 0 }));
  if (kind !== 'counter') setTimeout(() => startEdit(sel[0]), 30);
}
function addShape(kind, pt) {
  finishEdit();
  const ac = (P.theme.colors || [])[1] || '#9d8bff';
  const light = isLight(slideCur().bg.color);
  let w = 420, hh = 300, st = { fill: ac, radius: 0 };
  if (kind === 'rounded') { kind = 'rect'; st.radius = 32; }
  if (kind === 'ellipse' || kind === 'ring' || kind === 'star' || kind === 'hexagon' || kind === 'diamond' || kind === 'glow') { w = hh = 320; }
  if (kind === 'arch') { w = 380; hh = 520; st = { fill: 'none', stroke: ac, strokeWidth: 3 }; }
  if (kind === 'ring') { kind = 'ellipse'; st = { fill: 'none', stroke: ac, strokeWidth: 6 }; }
  if (kind === 'frame') { w = 1700; hh = 900; st = { fill: 'none', stroke: ac, strokeWidth: 2, gap: 18 }; }
  if (kind === 'glass') { w = 560; hh = 380; st = { fill: light ? '#000000' : '#ffffff', fillOpacity: .06, stroke: light ? '#000000' : '#ffffff', strokeOpacity: .16, strokeWidth: 1, radius: 32, blur: 26 }; }
  if (kind === 'glow') { w = hh = 700; st = { fill: ac, fillOpacity: .6, blur: 60 }; }
  if (kind === 'arrow') { w = 420; hh = 180; }
  const p = placeAt(w, hh, pt);
  insertEl(TPL.S(kind, p.x, p.y, w, hh, st, { a: kind === 'frame' || kind === 'arch' ? 'draw' : 'scaleIn' }));
}
function addLine() {
  finishEdit();
  const ac = (P.theme.colors || [])[1] || '#e8c27a';
  const p = placeAt(600, 40);
  insertEl(TPL.L(p.x, p.y + 20, 600, { stroke: ac, strokeWidth: 3, ends: 'diamond', fade: true }, { a: 'draw' }));
}
function addAsset(url) { const id = 'img_' + uid(); P.assets[id] = url; return id; }
function imgSize(url) { return new Promise(r => { const i = new Image(); i.onload = () => r({ w: i.naturalWidth, h: i.naturalHeight }); i.onerror = () => r({ w: 800, h: 600 }); i.src = url; }); }
async function addImageUrl(url, pt) {
  url = await shrinkImage(url);
  const { w: iw, h: ih } = await imgSize(url);
  const k = Math.min(900 / iw, 700 / ih, 1.5);
  const w = Math.round(iw * k), hh = Math.round(ih * k);
  const p = placeAt(w, hh, pt);
  insertEl(TPL.I(addAsset(url), p.x, p.y, w, hh, { mask: 'rounded', radius: 20, shadow: true, pos: '50% 50%' }, { a: 'blurIn' }));
}
async function pickImage(pt) {
  finishEdit();
  if (api.pickImages) { const files = await api.pickImages(true); for (const f of files) await addImageUrl(f.url, pt); }
  else $('#fileImg').click();
}
async function replaceImage(el) {
  if (!api.pickImages) return;
  const [f] = await api.pickImages(false);
  if (!f) return;
  ck(); el.src = addAsset(f.url); changed('canvas+props');
}
const readFile = (f) => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); });

// drag & drop images
viewport.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('text/uri-list') || e.dataTransfer.types.includes('text/html')) { e.preventDefault(); stageHost.classList.add('dragover'); } });
viewport.addEventListener('dragleave', () => stageHost.classList.remove('dragover'));
viewport.addEventListener('drop', async (e) => {
  stageHost.classList.remove('dragover');
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
  if (!files.length) {
    const html = e.dataTransfer.getData('text/html') || '';
    const src = (html.match(/<img[^>]+src="([^"]+)"/i) || [])[1];
    const uri = (e.dataTransfer.getData('text/uri-list') || '').split('\n').find(x => /^https?:/i.test(x.trim()));
    const imgUrl = src && /^https?:/i.test(src) ? src : (uri && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(uri) ? uri.trim() : null);
    if (!imgUrl) return;
    e.preventDefault(); e._handled = true;
    return insertRemoteImage(imgUrl.replace('&amp;', '&'), toStage(e), uri && uri !== imgUrl ? uri.trim() : null);
  }
  e.preventDefault();
  const pt = toStage(e);
  const n = e.target.closest('.a-el');
  const target = n && elById(n.dataset.id);
  if (target && target.type === 'image' && files.length === 1) { ck(); target.src = addAsset(await readFile(files[0])); sel = [target.id]; changed('canvas+props'); return; }
  for (const [i, f] of files.entries()) await addImageUrl(await readFile(f), { x: pt.x + i * 40, y: pt.y + i * 40 });
});
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', async (e) => {
  e.preventDefault();
  $('#dropHint').classList.add('hidden');
  if (e.defaultPrevented && e._handled) return;
  const f = [...(e.dataTransfer?.files || [])].find(x => /\.(html?|aurea)$/i.test(x.name));
  if (!f) return;
  const p = api.pathForFile ? api.pathForFile(f) : '';
  if (!p) return toast('Не вдалося отримати шлях до файлу');
  if (isHtml(p)) openHtmlPath(p); else openPath(p);
});
let dragDepth = 0;
document.addEventListener('dragenter', (e) => { if ([...(e.dataTransfer?.items || [])].some(i => i.kind === 'file') && !(e.target.closest && e.target.closest('#viewport'))) $('#dropHint').classList.remove('hidden'); dragDepth++; });
document.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; $('#dropHint').classList.add('hidden'); } });
document.addEventListener('dragover', (e) => { if (e.target.closest && e.target.closest('#viewport')) $('#dropHint').classList.add('hidden'); });

// ================= SELECTION OPS =================
function copySel() { const els = selected(); if (!els.length) return; clipboard = { els: clone(els), from: slideCur().id }; pasteN = 0; toast(`Скопійовано: ${els.length}`); }
function cutSel() { copySel(); deleteSel(); }
function paste() {
  if (!clipboard) return;
  ck();
  const s = slideCur();
  const sameSlide = clipboard.from === s.id;
  pasteN++;
  const keys = new Set(s.elements.map(e => e.morph));
  const out = clone(clipboard.els).map(e => {
    e.id = uid();
    if (keys.has(e.morph)) e.morph = uid();
    if (sameSlide) { e.x += 30 * pasteN; e.y += 30 * pasteN; }
    return e;
  });
  s.elements.push(...out);
  sel = out.map(e => e.id);
  changed('canvas+props');
}
function duplicateSel() {
  const els = selected(); if (!els.length) return;
  ck();
  const out = clone(els).map(e => ({ ...e, id: uid(), morph: uid(), x: e.x + 30, y: e.y + 30 }));
  slideCur().elements.push(...out);
  sel = out.map(e => e.id);
  changed('canvas+props');
}
function deleteSel() {
  if (!sel.length) return;
  ck();
  slideCur().elements = slideCur().elements.filter(e => !sel.includes(e.id));
  sel = [];
  changed('canvas+props');
}
function toggleLock() { const els = selected(); if (!els.length) return; ck(); const v = !els[0].locked; els.forEach(e => e.locked = v); if (v) sel = []; changed('canvas+props'); }
function layer(dir) {
  const els = slideCur().elements;
  if (!sel.length) return;
  ck();
  const picked = els.filter(e => sel.includes(e.id)), rest = els.filter(e => !sel.includes(e.id));
  if (dir === 'top') slideCur().elements = [...rest, ...picked];
  else if (dir === 'bottom') slideCur().elements = [...picked, ...rest];
  else {
    const arr = [...els];
    const idxs = arr.map((e, i) => sel.includes(e.id) ? i : -1).filter(i => i >= 0);
    if (dir === 'up') for (let k = idxs.length - 1; k >= 0; k--) { const i = idxs[k]; if (i < arr.length - 1 && !sel.includes(arr[i + 1].id)) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; }
    else for (const i of idxs) if (i > 0 && !sel.includes(arr[i - 1].id)) [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
    slideCur().elements = arr;
  }
  changed('canvas+props');
}
function align(how) {
  const els = selected(); if (!els.length) return;
  ck();
  const ref = els.length === 1 ? { x: 0, y: 0, w: W, h: H } : bbox(els);
  for (const e of els) {
    const b = bbox([e]), ox = e.x - b.x, oy = e.y - b.y;
    if (how === 'l') e.x = Math.round(ref.x + ox);
    if (how === 'c') e.x = Math.round(ref.x + (ref.w - b.w) / 2 + ox);
    if (how === 'r') e.x = Math.round(ref.x + ref.w - b.w + ox);
    if (how === 't') e.y = Math.round(ref.y + oy);
    if (how === 'm') e.y = Math.round(ref.y + (ref.h - b.h) / 2 + oy);
    if (how === 'b') e.y = Math.round(ref.y + ref.h - b.h + oy);
  }
  changed('canvas+props');
}
function distribute(axis) {
  const els = selected(); if (els.length < 3) return toast('Виділіть щонайменше 3 елементи');
  ck();
  const k = axis === 'h' ? 'x' : 'y', d = axis === 'h' ? 'w' : 'h';
  els.sort((a, b) => a[k] - b[k]);
  const first = els[0], last = els[els.length - 1];
  const total = els.reduce((s, e) => s + e[d], 0);
  const gap = (last[k] + last[d] - first[k] - total) / (els.length - 1);
  let pos = first[k];
  for (const e of els) { e[k] = Math.round(pos); pos += e[d] + gap; }
  changed('canvas+props');
}
function nudge(dx, dy) {
  const els = selected().filter(e => !e.locked); if (!els.length) return;
  ck('nudge');
  els.forEach(e => { e.x += dx; e.y += dy; });
  changed('canvas');
  syncGeomFields();
}

// ================= ANIMATION PREVIEW =================
let previewTimer = null;
function previewAnims(ids) {
  finishEdit();
  clearTimeout(previewTimer);
  renderCanvas();
  stageHost.classList.add('a-play');
  $('#work').classList.add('previewing');
  const s = slideCur();
  let clickT = 0, maxT = 0;
  const list = s.elements.filter(e => e.anim && e.anim.type !== 'none' && (!ids || ids.includes(e.id)));
  const clicks = list.filter(e => e.anim.trigger === 'click' && !ids).sort((a, b) => (a.anim.order || 0) - (b.anim.order || 0));
  for (const el of list) {
    const n = nodeOf(el.id); if (!n) continue;
    n.classList.add('a-pre');
    let off = 0;
    if (!ids && el.anim.trigger === 'click') off = 1400 + clicks.indexOf(el) * 1100;
    else if (ids) off = -(el.anim.delay || 0) + 50;
    Aurea.playIn(n, el, { offset: off });
    maxT = Math.max(maxT, off + (el.anim.delay || 0) + (el.anim.dur || 900) * 1.6);
    clickT = Math.max(clickT, off);
  }
  if (!list.length) toast('На цьому слайді немає анімацій — оберіть елемент і вкладку «Анімація»');
  previewTimer = setTimeout(() => { $('#work').classList.remove('previewing'); }, Math.min(6000, maxT + 400));
}

// ================= PROPERTIES =================
const sec = (title, ...kids) => h('div', { class: 'sec' }, h('h4', {}, title), ...kids);
const fld = (label, ctrl) => h('div', { class: 'field' }, h('label', {}, label), ctrl);
const row = (...kids) => h('div', { class: 'row' }, ...kids);
const geomRefs = {};
function numIn(label, val, onSet, o = {}) {
  const inp = h('input', { class: 'inp', type: 'number', value: r1(val ?? 0), step: o.step || 1 });
  if (o.min != null) inp.min = o.min; if (o.max != null) inp.max = o.max;
  inp.addEventListener('input', () => { const v = parseFloat(inp.value); if (!isNaN(v)) onSet(v); });
  const lab = h('span', { style: 'pointer-events:auto' }, label);
  lab.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const sx = e.clientX, sv = parseFloat(inp.value) || 0;
    drag((ev) => { let v = sv + (ev.clientX - sx) * (o.step || 1); if (o.min != null) v = Math.max(o.min, v); if (o.max != null) v = Math.min(o.max, v); v = Math.round(v * 100) / 100; inp.value = v; onSet(v); });
  });
  if (o.ref) geomRefs[o.ref] = inp;
  return h('div', { class: 'numf' }, lab, inp);
}
function colorIn(val, onSet) {
  const sw = h('i', { style: `background:${val && val !== 'none' ? val : 'transparent'}` });
  const ci = h('input', { type: 'color', value: toHex6(val) });
  const tx = h('input', { class: 'inp', value: val || '', spellcheck: 'false' });
  const apply = (v) => { sw.style.background = v; tx.value = v; onSet(v); };
  ci.addEventListener('input', () => apply(ci.value));
  tx.addEventListener('change', () => { let v = tx.value.trim(); if (/^[0-9a-f]{3,8}$/i.test(v)) v = '#' + v; apply(v); });
  return h('div', {}, h('div', { class: 'colr' }, h('label', { class: 'sw' }, sw, ci), tx),
    h('div', { class: 'chips' }, palette().map(c => h('span', { class: 'chip', style: `background:${c}`, title: c, onclick: () => { ci.value = toHex6(c); apply(c); } }))));
}
function rangeIn(val, min, max, step, onSet, fmt = (v) => v) {
  const r = h('input', { type: 'range', min, max, step, value: val });
  const out = h('output', {}, fmt(+val));
  const upd = () => r.style.setProperty('--p', ((r.value - min) / (max - min) * 100) + '%');
  upd();
  r.addEventListener('input', () => { upd(); out.textContent = fmt(+r.value); onSet(+r.value); });
  return h('div', { class: 'rng' }, r, out);
}
function segIn(opts, val, onSet) {
  const s = h('div', { class: 'seg' });
  for (const o of opts) {
    const b = h('button', { class: o.v === val ? 'on' : '', title: o.t || '' }, o.i ? icon(o.i) : o.l);
    b.addEventListener('click', () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); onSet(o.v); });
    s.append(b);
  }
  return s;
}
function selIn(opts, val, onSet, styleFn) {
  const s = h('select', { class: 'inp' }, opts.map(o => h('option', { value: o.v, style: styleFn ? styleFn(o.v) : '' }, o.l)));
  s.value = val;
  s.addEventListener('change', () => onSet(s.value));
  return s;
}
function tglIn(label, val, onSet) {
  const c = h('input', { type: 'checkbox' }); c.checked = !!val;
  c.addEventListener('change', () => onSet(c.checked));
  return h('label', { class: 'tgl' }, h('span', {}, label), c, h('i'));
}
const btn = (label, ic, fn, cls = 'btn sm') => h('button', { class: cls, onclick: fn }, ic ? icon(ic) : null, label);

function setEls(fn, key, scope = 'canvas') { ck(key); selected().forEach(fn); changed(scope); }
const setStyle = (k, v, scope) => setEls(e => { e.style[k] = v; }, 'st:' + k + sel.join(), scope);
const setProp = (k, v, scope) => setEls(e => { e[k] = v; }, 'p:' + k + sel.join(), scope);
const setAnim = (k, v, scope) => setEls(e => { e.anim[k] = v; }, 'a:' + k + sel.join(), scope);
function syncGeomFields() {
  const e = selected()[0];
  if (!e || sel.length !== 1) return;
  for (const k of ['x', 'y', 'w', 'h', 'rot']) if (geomRefs[k] && document.activeElement !== geomRefs[k]) geomRefs[k].value = r1(e[k] || 0);
}

function renderProps() {
  if (!P) return;
  for (const k in geomRefs) delete geomRefs[k];
  const has = sel.length > 0;
  if (has && !prevHas && (tab === 'slide' || tab === 'layers') && tab !== 'layers') tab = lastTab;
  prevHas = has;
  if (!has && tab !== 'slide' && tab !== 'layers') tab = 'slide';
  $$('.tab').forEach(t => { t.classList.toggle('on', t.dataset.tab === tab); t.disabled = !has && t.dataset.tab !== 'slide' && t.dataset.tab !== 'layers'; });
  requestAnimationFrame(moveTabInd);
  const body = $('#pbody');
  const st = body.scrollTop;
  let content;
  if (tab === 'slide') content = slideTab();
  else if (tab === 'layers') content = layersTab();
  else if (tab === 'anim') content = animTab();
  else content = designTab();
  body.replaceChildren(...content);
  body.scrollTop = st;
}
$('#tabs').addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) { tab = t.dataset.tab; lastTab = (tab === 'slide' || tab === 'layers') ? lastTab : tab; renderProps(); } });
let lastTab = 'design', prevHas = false;

const TYPE_NAMES = { text: 'Текст', shape: 'Фігура', image: 'Зображення', line: 'Лінія', chart: 'Діаграма', icon: 'Іконка' };
function designTab() {
  const els = selected(), e = els[0], one = els.length === 1;
  const types = new Set(els.map(x => x.type));
  const out = [];
  out.push(sec(one ? (TYPE_NAMES[e.type] + (e.type === 'shape' ? ' · ' + (SHAPE_NAMES[e.shape] || '') : '')) : `Виділено: ${els.length}`,
    one ? [row(numIn('X', e.x, v => setProp('x', Math.round(v)), { ref: 'x' }), numIn('Y', e.y, v => setProp('y', Math.round(v)), { ref: 'y' })),
      row(numIn('Ш', e.w, v => setProp('w', Math.max(4, Math.round(v))), { ref: 'w', min: 4 }), numIn('В', e.h, v => setProp('h', Math.max(4, Math.round(v))), { ref: 'h', min: 4 })),
      row(numIn('°', e.rot || 0, v => setProp('rot', v), { ref: 'rot', min: -360, max: 360 }), h('div', {}))] : null,
    fld('Прозорість', rangeIn(e.opacity ?? 1, 0, 1, .01, v => setProp('opacity', v), v => Math.round(v * 100) + '%')),
    fld(one ? 'Вирівняти на слайді' : 'Вирівняти виділене', h('div', { class: 'igrid' }, [['l', 'alL', 'Ліворуч'], ['c', 'alC', 'По центру'], ['r', 'alR', 'Праворуч'], ['t', 'alT', 'Вгору'], ['m', 'alM', 'По середині'], ['b', 'alB', 'Донизу']].map(([k, i, t]) => h('button', { title: t, onclick: () => align(k) }, icon(i))))),
    !one ? fld('Розподілити', h('div', { class: 'igrid', style: 'grid-template-columns:repeat(2,1fr)' }, h('button', { title: 'По горизонталі', onclick: () => distribute('h') }, icon('disH')), h('button', { title: 'По вертикалі', onclick: () => distribute('v') }, icon('disV')))) : null,
    fld('Шар', h('div', { class: 'igrid', style: 'grid-template-columns:repeat(4,1fr)' },
      h('button', { title: 'На передній план', onclick: () => layer('top') }, icon('front')), h('button', { title: 'Вище', onclick: () => layer('up') }, icon('chev')),
      h('button', { title: 'Нижче', onclick: () => layer('down'), style: 'transform:scaleY(-1)' }, icon('chev')), h('button', { title: 'На задній план', onclick: () => layer('bottom') }, icon('back')))),
    row(btn('Дубль', 'copy', duplicateSel), btn(e.locked ? 'Розблок.' : 'Блок.', 'lock', toggleLock), btn('Видалити', 'trash', deleteSel))
  ));
  if (types.size === 1) {
    if (e.type === 'text') out.push(textSec(e));
    if (e.type === 'shape') out.push(shapeSec(e));
    if (e.type === 'image') out.push(imageSec(e));
    if (e.type === 'line') out.push(lineSec(e));
    if (e.type === 'icon') out.push(iconSec(e));
    if (e.type === 'chart') out.push(chartSec(e));
  }
  out.push(fxSec(e));
  if (one) out.push(sec('Morph',
    fld('Morph-ID', (() => { const i = h('input', { class: 'inp', value: e.morph, spellcheck: 'false' }); i.addEventListener('change', () => setProp('morph', i.value.trim() || uid())); return i; })()),
    h('p', { class: 'hint' }, 'Елементи з однаковим Morph-ID на сусідніх слайдах плавно перетікають (позиція, розмір, колір). Дублікат слайда зберігає ID автоматично.')));
  return out;
}
function textSec(e) {
  const s = e.style;
  const ta = h('textarea', { class: 'inp', spellcheck: 'false' }); ta.value = e.content;
  ta.addEventListener('input', () => setEls(x => { x.content = ta.value; }, 'content' + e.id));
  return sec('Текст',
    fld('Вміст', ta),
    fld('Шрифт', selIn(FONTS.map(f => ({ v: f, l: f })), s.font, v => setStyle('font', v), v => `font-family:'${v}'`)),
    row(numIn('pt', s.size, v => setStyle('size', Math.max(6, v)), { min: 6 }),
      selIn([[200, 'Тонкий'], [300, 'Легкий'], [400, 'Звичайний'], [500, 'Середній'], [600, 'Напівжирний'], [700, 'Жирний'], [800, 'Дуже жирний'], [900, 'Чорний']].map(([v, l]) => ({ v: String(v), l })), String(s.weight || 400), v => setStyle('weight', +v))),
    row(segIn([{ v: 'left', i: 'tL' }, { v: 'center', i: 'tC' }, { v: 'right', i: 'tR' }], s.align, v => setStyle('align', v)),
      segIn([{ v: 'top', l: 'Верх' }, { v: 'middle', l: 'Центр' }, { v: 'bottom', l: 'Низ' }], s.valign || 'top', v => setStyle('valign', v))),
    h('div', { class: 'row', style: 'grid-template-columns:auto 1fr' },
      h('div', { class: 'seg', style: 'flex:0 0 76px' },
        h('button', { class: s.italic ? 'on' : '', title: 'Курсив', onclick: () => setStyle('italic', !s.italic, 'canvas+props') }, icon('italic')),
        h('button', { class: s.upper ? 'on' : '', title: 'ВЕЛИКІ ЛІТЕРИ', onclick: () => setStyle('upper', !s.upper, 'canvas+props') }, icon('caps'))),
      segIn([{ v: 'none', l: 'Без тіні' }, { v: 'soft', l: 'Тінь' }, { v: 'glow', l: 'Сяйво' }], s.shadow || 'none', v => setStyle('shadow', v))),
    fld('Ефект тексту', segIn([{ v: 'none', l: 'Немає' }, { v: 'neon', l: 'Неон' }, { v: 'outline', l: 'Контур' }, { v: 'long', l: '3D' }, { v: 'emboss', l: 'Рельєф' }], s.effect || 'none', v => setStyle('effect', v))),
    fld('Колір', colorIn(s.color, v => setStyle('color', v))),
    tglIn('Градієнт тексту', !!s.color2, v => setStyle('color2', v ? (palette()[2] || '#9d8bff') : '', 'canvas+props')),
    s.color2 ? [fld('Другий колір', colorIn(s.color2, v => setStyle('color2', v))), fld('Кут градієнта', rangeIn(s.gradAngle ?? 90, 0, 360, 5, v => setStyle('gradAngle', v), v => v + '°'))] : null,
    fld('Міжрядковий інтервал', rangeIn(s.lh ?? 1.2, .7, 2.4, .05, v => setStyle('lh', v), v => v.toFixed(2))),
    fld('Трекінг', rangeIn(s.ls || 0, -.1, .6, .005, v => setStyle('ls', v), v => v.toFixed(3)))
  );
}
function shapeSec(e) {
  const s = e.style, k = e.shape;
  const svgShape = !['glass', 'glow'].includes(k);
  return sec('Фігура',
    fld('Форма', h('div', { class: 'igrid' }, Object.keys(SHAPES).filter(x => x !== 'rounded' && x !== 'ring').map(x => h('button', { title: SHAPE_NAMES[x], class: x === k ? 'on' : '', style: x === k ? 'border-color:var(--sel);color:#fff' : '', onclick: () => setProp('shape', x, 'canvas+props') }, shapeIcon(x))))),
    fld('Заливка', colorIn(s.fill === 'none' ? '' : s.fill, v => setStyle('fill', v || 'none'))),
    row(btn('Без заливки', null, () => setStyle('fill', 'none', 'canvas+props')), h('div')),
    fld('Непрозорість заливки', rangeIn(s.fillOpacity ?? 1, 0, 1, .01, v => setStyle('fillOpacity', v), v => Math.round(v * 100) + '%')),
    k !== 'glow' ? tglIn('Градієнт', !!s.color2, v => setStyle('color2', v ? (palette()[2] || '#22d3ee') : '', 'canvas+props')) : null,
    s.color2 && k !== 'glow' ? [fld('Другий колір', colorIn(s.color2, v => setStyle('color2', v))), fld('Кут', rangeIn(s.gradAngle ?? 90, 0, 360, 5, v => setStyle('gradAngle', v), v => v + '°'))] : null,
    k !== 'glow' ? [fld('Контур', colorIn(s.stroke, v => setStyle('stroke', v))),
      row(fld('Товщина', rangeIn(s.strokeWidth || 0, 0, 30, .5, v => setStyle('strokeWidth', v))), fld('Видимість', rangeIn(s.strokeOpacity ?? 1, 0, 1, .01, v => setStyle('strokeOpacity', v), v => Math.round(v * 100) + '%')))] : null,
    svgShape ? tglIn('Пунктир', !!s.dash, v => setStyle('dash', v)) : null,
    (k === 'rect' || k === 'glass') ? fld('Радіус кутів', rangeIn(s.radius || 0, 0, 300, 1, v => setStyle('radius', v))) : null,
    (k === 'glass' || k === 'glow') ? fld('Розмиття', rangeIn(s.blur ?? 26, 0, 120, 1, v => setStyle('blur', v))) : null,
    k === 'frame' ? fld('Відступ внутрішньої рамки', rangeIn(s.gap ?? 16, 4, 80, 1, v => setStyle('gap', v))) : null
  );
}
function imageSec(e) {
  const s = e.style;
  return sec('Зображення',
    row(btn('Замінити…', 'image', () => replaceImage(e)), h('div')),
    fld('Маска', segIn([{ v: 'none', l: 'Немає' }, { v: 'rounded', l: 'Кути' }, { v: 'circle', l: 'Коло' }, { v: 'arch', l: 'Арка' }], s.mask || 'none', v => setStyle('mask', v, 'canvas+props'))),
    s.mask === 'rounded' ? fld('Радіус', rangeIn(s.radius ?? 24, 0, 300, 1, v => setStyle('radius', v))) : null,
    fld('Заповнення', segIn([{ v: 'cover', l: 'Заповнити' }, { v: 'contain', l: 'Вмістити' }], s.fit || 'cover', v => setStyle('fit', v))),
    fld('Фокус', segIn([{ v: '50% 15%', l: 'Верх' }, { v: '50% 50%', l: 'Центр' }, { v: '50% 85%', l: 'Низ' }], s.pos || '50% 50%', v => setStyle('pos', v))),
    fld('Фільтр', selIn([['none', 'Без фільтра'], ['warm', 'Теплий'], ['sepia', 'Сепія'], ['mono', 'Чорно-білий'], ['noir', 'Нуар'], ['vintage', 'Вінтаж'], ['cool', 'Холодний'], ['dream', 'Мрійливий'], ['dim', 'Притемнений'], ['vivid', 'Яскравий']].map(([v, l]) => ({ v, l })), s.filter || 'none', v => setStyle('filter', v))),
    row(fld('Рамка', rangeIn(s.borderWidth || 0, 0, 30, 1, v => setStyle('borderWidth', v))), h('div')),
    fld('Колір рамки', colorIn(s.borderColor || '#c9a45c', v => setStyle('borderColor', v))),
    tglIn('Внутрішня лінія (музейна рамка)', !!s.innerLine, v => setStyle('innerLine', v)),
    tglIn('Тінь', !!s.shadow, v => setStyle('shadow', v)),
    tglIn('Прибрати чорний фон (змішування «екран»)', s.blend === 'screen', v => setStyle('blend', v ? 'screen' : ''))
  );
}
function lineSec(e) {
  const s = e.style;
  return sec('Лінія',
    fld('Колір', colorIn(s.stroke, v => setStyle('stroke', v))),
    fld('Товщина', rangeIn(s.strokeWidth || 2, .5, 30, .5, v => setStyle('strokeWidth', v))),
    fld('Видимість', rangeIn(s.strokeOpacity ?? 1, 0, 1, .01, v => setStyle('strokeOpacity', v), v => Math.round(v * 100) + '%')),
    fld('Кінці', segIn([{ v: 'none', l: '—' }, { v: 'dot', l: '•' }, { v: 'diamond', l: '◆' }, { v: 'arrow', l: '→' }], s.ends || 'none', v => setStyle('ends', v))),
    tglIn('Згасання до країв', !!s.fade, v => setStyle('fade', v)),
    tglIn('Пунктир', !!s.dash, v => setStyle('dash', v)),
    h('p', { class: 'hint' }, 'Поверніть лінію ручкою обертання, щоб зробити її діагональною.')
  );
}
function animTab() {
  const els = selected(), e = els[0];
  const a = e.anim;
  const demo = (k) => ['stagger', 'grow', 'scatter'].includes(k) ? [h('i'), h('i'), h('i'), h('i')] : ['letters', 'wave'].includes(k) ? [h('i'), h('i'), h('i'), h('i'), h('i')] : k === 'counter' ? '1 2 3…' : [h('i')];
  const card = (k) => h('button', {
    class: 'acard' + (a.type === k ? ' on' : ''), title: Aurea.ANIMS[k],
    onclick: () => { setAnim('type', k, 'canvas+props'); if (k !== 'none') setTimeout(() => previewAnims([...sel]), 30); }
  }, h('div', { class: 'demo d-' + k }, demo(k)), h('b', {}, Aurea.ANIMS[k]));
  const grid = h('div', {}, Aurea.ANIM_GROUPS.map(([g, ks]) => [h('div', { class: 'agroup' }, g), h('div', { class: 'agrid' }, ks.map(card))]));
  const out = [sec(els.length > 1 ? `Анімація · ${els.length} елем.` : 'Анімація появи', grid)];
  if (a.type !== 'none') {
    const clickEls = slideCur().elements.filter(x => x.anim && x.anim.type !== 'none' && x.anim.trigger === 'click');
    out.push(sec('Параметри',
      fld('Запуск', segIn([{ v: 'auto', l: 'Автоматично' }, { v: 'click', l: 'За кліком' }], a.trigger || 'auto', v => { setEls(x => { x.anim.trigger = v; if (v === 'click') x.anim.order = clickEls.length; }, null, 'canvas+props'); })),
      fld('Затримка', rangeIn(a.delay || 0, 0, 5000, 50, v => setAnim('delay', v), v => (v / 1000).toFixed(2) + ' с')),
      fld('Тривалість', rangeIn(a.dur || 900, 200, 4000, 50, v => setAnim('dur', v), v => (v / 1000).toFixed(2) + ' с')),
      fld('Характер руху', segIn([{ v: 'smooth', l: 'Плавно' }, { v: 'spring', l: 'Пружно' }, { v: 'bounce', l: 'Відскок' }, { v: 'sharp', l: 'Різко' }], a.ease || 'smooth', v => setAnim('ease', v))),
      a.type === 'slideLeft' ? fld('Звідки виїжджає', segIn([{ v: 'left', l: 'Зліва' }, { v: 'right', l: 'Справа' }, { v: 'up', l: 'Знизу' }, { v: 'down', l: 'Згори' }], a.dir || 'left', v => setAnim('dir', v))) : null,
      ['highlight', 'glow'].includes(a.type) ? fld('Колір ефекту', colorIn(a.color || '#e8c27a', v => setAnim('color', v))) : null,
      a.type === 'shine' ? tglIn('Повторювати відблиск', a.loop !== false, v => setAnim('loop', v)) : null,
      a.trigger === 'click' ? fld('Порядок кліку', numIn('#', a.order || 0, v => setAnim('order', Math.round(v)), { min: 0 })) : null,
      h('button', { class: 'btn block', style: 'margin-top:6px', onclick: () => previewAnims([...sel]) }, icon('play'), 'Переглянути'),
      h('p', { class: 'hint' }, {
        counter: 'Лічильник рахує від 0 до числа в тексті й зберігає формат: «1 500+», «37%», «99,9».',
        stagger: 'Слова з\'являються одне за одним з розмиттям — ідеально для заголовків і цитат.',
        draw: 'Лінії та контури «малюються», а текст і фото відкриваються шторкою.',
        shine: 'По тексту пробігає світловий відблиск. Найкраще — на великих заголовках.',
        kenburns: 'Повільний кінематографічний наїзд камери на фото.',
        float: 'Елемент м\'яко ширяє — гарно для фонових форм і сяйва.',
        letters: 'Кожна буква вистрибує окремо з легким поворотом.',
        maskUp: 'Слова піднімаються з-під невидимої лінії, як у кінотитрах.',
        typewriter: 'Текст друкується посимвольно з курсором. Тривалість задає швидкість.',
        highlight: 'Під текстом «проводиться» кольоровий маркер.',
        grow: 'Стовпці діаграми виростають, а числа рахуються від нуля.',
        pulse: 'Елемент м\'яко пульсує, привертаючи увагу.', glow: 'Навколо елемента дихає світло.',
        wiggle: 'Періодичне похитування — для кнопок і акцентів.', spin: 'Безперервне повільне обертання.',
        flipIn: 'Перевертається з глибини, як картка.', bounceIn: 'Вистрибує з пружним відскоком.',
        glitch: 'Цифровий глітч з RGB-зсувом — для технологічних тем.', flicker: 'Мерехтить, як неонова вивіска, і загоряється.',
        swing: 'Розгойдується на завісі зверху.', scatter: 'Букви злітаються з різних боків і складаються в слово.',
        wave: 'Букви безперервно біжать хвилею.', elastic: 'Пружно розтягується, як гумка.', spotlight: 'Проявляється з кола світла, як у прожекторі.',
        heartbeat: 'Б’ється, як серце.', hue: 'Кольори плавно переливаються веселкою.'
      }[a.type] || 'Елементи з анімацією з\'являються після переходу на слайд.')
    ));
  }
  out.push(animPaneSec());
  out.push(sec('Весь слайд', row(btn('Весь слайд', 'sparkles', () => previewAnims()), btn('Авто-черга', 'wand', autoSequence))));
  return out;
}
function autoSequence() {
  ck();
  const s = slideCur();
  const els = s.elements.filter(e => !(e.w >= W * .9 && e.h >= H * .9) && !e.hidden && !(e.type === 'shape' && e.shape === 'glow'));
  els.sort((a, b) => (Math.round(a.y / 60) - Math.round(b.y / 60)) || (a.x - b.x));
  els.forEach((e, i) => {
    if (e.anim.type === 'none') e.anim.type = e.type === 'line' ? 'draw' : e.type === 'image' ? 'blurIn' : (e.type === 'text' && /\d/.test(e.content) && e.content.length < 12) ? 'counter' : 'fadeUp';
    e.anim.trigger = 'auto';
    e.anim.delay = 150 + i * 180;
  });
  changed('canvas+props');
  previewAnims();
  toast('Анімації вишикувано по черзі: зверху вниз, зліва направо');
}
function slideTab() {
  const s = slideCur(), bg = s.bg;
  const setBg = (k, v, scope = 'canvas') => { ck('bg:' + k + s.id); bg[k] = v; changed(scope); };
  const trs = ['none', 'fade', 'morph', 'slide', 'push', 'zoom', 'blur', 'circle', 'curtain', 'flip', 'doors', 'dip', 'swirl'];
  const nt = h('textarea', { class: 'inp', placeholder: 'Нотатки доповідача — їх видно лише в панелі доповідача' }); nt.value = s.notes || '';
  nt.addEventListener('input', () => { ck('notes' + s.id); s.notes = nt.value; dirty = true; scheduleSave(); });
  return [
    sec('Тло слайда',
      fld('Тип', segIn([{ v: '', l: 'Колір' }, { v: 'linear', l: 'Лінійний' }, { v: 'radial', l: 'Радіальний' }], bg.grad || '', v => setBg('grad', v, 'all'))),
      fld(bg.grad ? 'Основний колір' : 'Колір', colorIn(bg.color, v => setBg('color', v))),
      bg.grad ? [fld('Колір сяйва', colorIn(bg.color2 || bg.color, v => setBg('color2', v))),
        bg.grad === 'linear' ? fld('Кут', rangeIn(bg.angle ?? 135, 0, 360, 5, v => setBg('angle', v), v => v + '°')) : row(fld('Центр X', rangeIn(bg.cx ?? 50, 0, 100, 1, v => setBg('cx', v), v => v + '%')), fld('Центр Y', rangeIn(bg.cy ?? 35, 0, 100, 1, v => setBg('cy', v), v => v + '%')))] : null,
      row(btn(bg.image ? 'Змінити фото' : 'Фото на тло…', 'image', async () => { const [f] = await (api.pickImages ? api.pickImages(false) : []); if (f) setBg('image', addAsset(f.url), 'all'); }),
        bg.image ? btn('Прибрати', 'x', () => setBg('image', '', 'all')) : h('div')),
      bg.image ? [fld('Видимість фото', rangeIn(bg.imageOpacity ?? 1, 0, 1, .01, v => setBg('imageOpacity', v), v => Math.round(v * 100) + '%')), fld('Розмиття фото', rangeIn(bg.imageBlur || 0, 0, 40, 1, v => setBg('imageBlur', v)))] : null,
      tglIn('Плівкова зернистість', !!bg.grain, v => setBg('grain', v)),
      tglIn('Віньєтка', !!bg.vignette, v => setBg('vignette', v)),
      row(btn('Тло для всіх слайдів', null, () => { ck(); P.slides.forEach(x => { x.bg = clone(bg); }); changed('all'); toast('Тло застосовано до всіх слайдів'); }))
    ),
    sec('Перехід на цей слайд',
      h('div', { class: 'agrid', style: 'grid-template-columns:repeat(3,1fr)' }, trs.map(t => h('button', { class: 'acard tcard' + (s.transition === t ? ' on' : ''), style: 'height:62px', onclick: () => { ck(); s.transition = t; changed('all'); } },
        h('div', { class: 'demo d-t-' + t }, h('i')), h('b', {}, TR_NAMES[t])))),
      s.transition === 'morph' ? h('p', { class: 'hint' }, 'Morph: елементи з однаковим Morph-ID плавно перетікають з попереднього слайда. Порада: дублюйте слайд і змініть розташування.') : null,
      row(btn('Для всіх слайдів', null, () => { ck(); P.slides.forEach((x, i) => { if (i) x.transition = s.transition; }); changed('all'); toast(`Перехід «${TR_NAMES[s.transition]}» для всіх слайдів`); }))
    ),
    sec('Живий фон',
      h('div', { class: 'agrid', style: 'grid-template-columns:repeat(4,1fr)' }, FXS.map(([k, l]) => h('button', { class: 'acard' + ((bg.fx || 'none') === k ? ' on' : ''), style: 'height:44px;justify-content:center', onclick: () => setBg('fx', k, 'all') }, h('b', {}, l)))),
      bg.fx && bg.fx !== 'none' ? [fld('Колір ефекту', colorIn(bg.fxColor || '#e8c27a', v => setBg('fxColor', v))), fld('Другий колір', colorIn(bg.fxColor2 || '#9d8bff', v => setBg('fxColor2', v)))] : null,
      tglIn('Конфеті при появі слайда 🎉', !!s.confetti, v => { ck(); s.confetti = v; dirty = true; scheduleSave(); }),
      fld('Автоматично далі через', rangeIn(s.auto || 0, 0, 30, 1, v => { ck('auto' + s.id); s.auto = v; dirty = true; scheduleSave(); }, v => v ? v + ' с' : 'вимк.'))
    ),
    sec('Шрифти всієї презентації',
      h('div', { class: 'agrid', style: 'grid-template-columns:repeat(2,1fr)' }, FONT_PAIRS.map(([hf, bf, n]) => h('button', { class: 'acard', style: 'height:62px', onclick: () => applyFontPair(hf, bf), title: `${hf} + ${bf}` },
        h('div', { style: `position:absolute;top:8px;left:10px;font:600 19px '${hf}';color:var(--tx-strong)` }, 'Аа'), h('div', { style: `position:absolute;top:12px;left:44px;font:400 12px '${bf}';color:var(--mu)` }, n), h('b', { style: 'font-weight:500;color:var(--mu)' }, `${hf.split(' ')[0]} + ${bf.split(' ')[0]}`))))),
    sec('Анімації', row(btn('Переглянути', 'sparkles', () => previewAnims()), btn('Авто-черга', 'wand', autoSequence)),
      row(btn('Прибрати всі', 'x', () => { ck(); s.elements.forEach(e => { e.anim.type = 'none'; }); changed('all'); }))),
    sec('Показ', tglIn('Пропускати цей слайд', !!s.skip, v => { ck(); s.skip = v; changed('strip'); })),
    sec('Нотатки доповідача', nt)
  ];
}

// ================= FILE OPS =================
async function save(as = false) {
  finishEdit();
  if (!api.save) return;
  const p = await api.save({ path: filePath, data: serialize(), saveAs: as, name: P.title });
  if (p) { filePath = p; dirty = false; setSaveState('saved'); toast('Збережено: ' + p.split(/[\\/]/).pop()); }
}
const FONT_FILES = {};
async function fontFaceCss(families) {
  const css = await (await fetch('fonts/fonts.css')).text();
  const blocks = css.split('@font-face').slice(1);
  const out = [];
  for (const b of blocks) {
    const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    if (!families.has(fam)) continue;
    const file = (b.match(/url\(\.\/([^)]+)\)/) || [])[1];
    if (!file) continue;
    if (!FONT_FILES[file]) FONT_FILES[file] = await toDataURL('fonts/' + file);
    out.push('@font-face' + b.replace(/url\(\.\/[^)]+\)/, `url(${FONT_FILES[file]})`));
  }
  return out.join('\n');
}
function standaloneBoot() {
  const P = JSON.parse(document.getElementById('aurea-data').textContent);
  const root = document.getElementById('host');
  if (document.documentElement.hasAttribute('data-print')) {
    root.className = 'a-print';
    P.slides.filter(s => !s.skip).forEach(s => {
      const pg = document.createElement('div'); pg.className = 'page';
      const st = document.createElement('div'); st.className = 'a-stage';
      st.appendChild(Aurea.renderSlide(s, P, { mode: 'static' })); pg.appendChild(st); root.appendChild(pg);
    });
    const imgs = [...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }));
    Promise.all([document.fonts.ready, ...imgs]).then(() => setTimeout(() => { window.__aureaReady = true; }, 400));
    return;
  }
  const cnt = document.getElementById('cnt'), prog = document.getElementById('prog'), hud = document.getElementById('hud');
  const pl = new Aurea.Player(root, P, {
    onChange: (i, p) => { cnt.textContent = (i + 1) + ' / ' + p.count; prog.style.width = ((i + 1) / p.count * 100) + '%'; try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { } }
  });
  const start = Math.max(0, Math.min(pl.count - 1, (parseInt(location.hash.slice(1)) || 1) - 1));
  document.fonts.ready.then(() => pl.goto(start, 'fwd', { instant: true }));
  const fs = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => { }); };
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); pl.next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); pl.prev(); }
    else if (e.key === 'Home') pl.goto(0, 'back', { revealAll: false });
    else if (e.key === 'End') pl.goto(pl.count - 1);
    else if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') fs();
  });
  root.addEventListener('click', () => pl.next());
  root.addEventListener('contextmenu', (e) => { e.preventDefault(); pl.prev(); });
  document.getElementById('fsb').addEventListener('click', fs);
  document.getElementById('pv').addEventListener('click', () => pl.prev());
  document.getElementById('nx').addEventListener('click', () => pl.next());
  let tx = null;
  root.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) { d < 0 ? pl.next() : pl.prev(); } tx = null; });
  let idle;
  addEventListener('mousemove', () => { document.body.classList.add('cur'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.remove('cur'), 2200); });
}
async function buildStandalone(print) {
  const fams = new Set(['Inter']);
  P.slides.forEach(s => s.elements.forEach(e => { if (e.type === 'text' && e.style.font) fams.add(e.style.font); }));
  const [pcss, pjs, fcss] = await Promise.all([fetch('player.css').then(r => r.text()), fetch('player.js').then(r => r.text()), fontFaceCss(fams)]);
  const data = JSON.stringify({ ...P, savedAt: undefined }).replace(/</g, '\\u003c');
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ui = print
    ? `@page{size:1920px 1080px;margin:0}html,body{margin:0;background:#000}.page{position:relative;width:1920px;height:1080px;overflow:hidden;break-after:page;page-break-after:always}.page .a-stage{transform:none}`
    : `html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:Inter,system-ui,sans-serif}#host{position:fixed;inset:0;cursor:none}body.cur #host{cursor:default}
#prog{position:fixed;left:0;top:0;height:3px;width:0;background:linear-gradient(90deg,#f6dc9c,#d9ad5f,#9c8cff);box-shadow:0 0 14px rgba(232,194,122,.6);transition:width .6s cubic-bezier(.2,.8,.2,1);z-index:10}
#hud{position:fixed;right:16px;bottom:14px;display:flex;gap:6px;opacity:0;transition:opacity .4s;z-index:10}body.cur #hud{opacity:1}
#hud button,#hud span{height:34px;min-width:34px;padding:0 11px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(20,20,26,.7);backdrop-filter:blur(14px);color:#ddd;display:grid;place-items:center;font:500 13px Inter,sans-serif;cursor:pointer}
#hud span{cursor:default;font-variant-numeric:tabular-nums}`;
  return `<!doctype html>
<html lang="uk"${print ? ' data-print' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(P.title)}</title>
<meta name="generator" content="Aurea Studio">
<style>${fcss}
${pcss}
${ui}</style></head>
<body><div id="host"></div>${print ? '' : '<div id="prog"></div><div id="hud"><button id="pv" title="Назад">‹</button><span id="cnt"></span><button id="nx" title="Далі">›</button><button id="fsb" title="Повний екран (F)">⛶</button></div>'}
<script type="application/json" id="aurea-data">${data}</script>
<script>${pjs}</script>
<script>(${standaloneBoot.toString()})();</script>
</body></html>`;
}
async function exportHtml() {
  finishEdit();
  busy('Готую автономний HTML…');
  try {
    const html = await buildStandalone(false);
    busy(false);
    const p = await api.exportHtml({ html, name: P.title });
    if (p) toast('HTML збережено з анімаціями.', { label: 'Показати файл', fn: () => api.showItem(p) });
  } catch (e) { busy(false); toast('Помилка експорту: ' + e.message); }
}
async function exportPdf() {
  finishEdit();
  busy('Створюю PDF…');
  try {
    const html = await buildStandalone(true);
    const p = await api.exportPdf({ html, name: P.title });
    busy(false);
    if (p) toast('PDF збережено.', { label: 'Показати файл', fn: () => api.showItem(p) });
  } catch (e) { busy(false); toast('Помилка експорту: ' + e.message); }
}

// ================= SHOW =================
let showPlayer = null, showTimer = null, showT0 = 0, bc = null, audienceOn = false;
const showEl = $('#show');
function startShow(from = 0, presenter = false, noFs = false) {
  if (!P) return;
  finishEdit(); closeMenu();
  const visible = P.slides.filter(s => !s.skip);
  let idx = visible.indexOf(P.slides[from]);
  if (idx < 0) idx = 0;
  $('#showStage').replaceChildren();
  showEl.classList.add('on');
  showEl.classList.toggle('presenter', presenter);
  showEl.classList.remove('blackout');
  showPlayer = new Aurea.Player($('#showStage'), P, { onChange: updateShowHud });
  if (!presenter && !noFs) api.fullscreen?.(true);
  showT0 = Date.now();
  clearInterval(showTimer);
  showTimer = setInterval(updateTimer, 500);
  setTimeout(() => { showPlayer.fit(); showPlayer.goto(idx, 'fwd', { instant: true }); }, presenter ? 50 : 350);
}
function endShow() {
  if (!showPlayer) return;
  showPlayer.destroy(); showPlayer = null;
  if (laserOn) toggleLaser(); if (penOn) togglePen(); clearPen(); $('.stip', showEl)?.remove();
  clearInterval(showTimer);
  showEl.classList.remove('on', 'presenter', 'cursor');
  api.fullscreen?.(false);
  if (audienceOn) { bc?.postMessage({ t: 'end' }); api.closeAudience?.(); audienceOn = false; }
  const i = P.slides.indexOf(lastShown);
  if (i >= 0) gotoSlide(i);
}
let lastShown = null;
function updateShowHud(i, pl) {
  clearPen();
  lastShown = pl.slides[i];
  $('#showCnt').textContent = `${i + 1} / ${pl.count}`;
  $('#showProg').style.width = ((i + 1) / pl.count * 100) + '%';
  if (showEl.classList.contains('presenter')) renderPresenter();
}
function updateTimer() {
  const t = Math.floor((Date.now() - showT0) / 1000);
  const el = $('#ppTimer');
  if (el) el.textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
function renderPresenter() {
  if (!showPlayer) return;
  const pl = showPlayer, slides = pl.slides, s = slides[pl.i], nx = slides[pl.i + 1];
  const steps = pl.queue.length;
  $('#pp').replaceChildren(
    h('div', { class: 'card glass' }, h('div', { class: 'timer' }, h('div', {}, h('span', { id: 'ppTimer' }, '00:00'), h('small', {}, 'Час виступу')), h('div', { style: 'text-align:right' }, h('span', {}, `${pl.i + 1}/${pl.count}`), h('small', {}, steps ? `ще кліків: ${steps}` : 'слайд')))),
    h('div', { class: 'card glass' }, h('div', { class: 'lbl' }, nx ? 'Наступний слайд' : 'Це останній слайд'), nx ? h('div', { class: 'nextw' }, Aurea.thumb(nx, P, 358)) : null),
    h('div', { class: 'card glass', style: 'flex:1;display:flex;flex-direction:column;min-height:0' }, h('div', { class: 'lbl', style: 'margin-bottom:8px' }, 'Нотатки'), h('div', { class: 'notes' }, s.notes || '— немає нотаток —')),
    h('div', { class: 'ctrls' }, h('button', { class: 'btn', onclick: () => showCmd('prev') }, icon('left'), 'Назад'), h('button', { class: 'btn-primary', style: 'flex:1;justify-content:center;height:40px', onclick: () => showCmd('next') }, 'Далі', icon('right')))
  );
  updateTimer();
}
function showCmd(c) {
  if (!showPlayer) return;
  if (c === 'next') { showPlayer.next(); bc?.postMessage({ t: 'next' }); }
  if (c === 'prev') { showPlayer.prev(); bc?.postMessage({ t: 'prev' }); }
  if (c === 'first') { showPlayer.goto(0, 'back'); bc?.postMessage({ t: 'goto', i: 0 }); }
  if (c === 'last') { showPlayer.goto(showPlayer.count - 1); bc?.postMessage({ t: 'goto', i: showPlayer.count - 1 }); }
  if (c === 'presenter') { showEl.classList.toggle('presenter'); renderPresenter(); setTimeout(() => showPlayer.fit(), 30); }
  if (c === 'black') showEl.classList.toggle('blackout');
  if (c === 'exit') endShow();
  if (showEl.classList.contains('presenter')) renderPresenter();
}
async function startPresenterMode() {
  if (!api.openAudience) return startShow(cur, true);
  bc = bc || new BroadcastChannel('aurea-show');
  bc.onmessage = (m) => {
    const d = m.data;
    if (d.t === 'hello' && showPlayer) bc.postMessage({ t: 'load', project: P, i: showPlayer.i });
    if (d.t === 'key') showCmd(d.k);
  };
  startShow(cur, true);
  const r = await api.openAudience();
  audienceOn = true;
  toast(r.external ? 'Показ відкрито на другому екрані' : 'Вікно показу відкрито. Перетягніть його на проєктор і натисніть F11');
}
showEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sact]');
  if (b) { e.stopPropagation(); showCmd(b.dataset.sact); return; }
  if (e.target.closest('.pp')) return;
  if (e.target.closest('#showStage')) showCmd('next');
});
showEl.addEventListener('contextmenu', (e) => { e.preventDefault(); showCmd('prev'); });
let curIdle = null;
showEl.addEventListener('mousemove', () => { showEl.classList.add('cursor'); clearTimeout(curIdle); curIdle = setTimeout(() => showEl.classList.remove('cursor'), 2200); });
api.on?.('audience-closed', () => { audienceOn = false; });

// audience window (second screen)
function bootAudience() {
  document.body.classList.add('audience');
  $('#start').classList.add('hidden');
  $('#topbar').classList.add('hidden');
  showEl.classList.add('on');
  showEl.querySelector('.hud').remove();
  bc = new BroadcastChannel('aurea-show');
  let pl = null;
  bc.onmessage = (m) => {
    const d = m.data;
    if (d.t === 'load') { P = normalize(d.project); $('#showStage').replaceChildren(); pl = new Aurea.Player($('#showStage'), P, { onChange: (i, p) => { $('#showProg').style.width = ((i + 1) / p.count * 100) + '%'; } }); pl.goto(d.i || 0, 'fwd', { instant: true }); }
    if (!pl) return;
    if (d.t === 'next') pl.next();
    if (d.t === 'prev') pl.prev();
    if (d.t === 'goto') pl.goto(d.i, d.i < pl.i ? 'back' : 'fwd');
    if (d.t === 'end') window.close();
  };
  bc.postMessage({ t: 'hello' });
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) bc.postMessage({ t: 'key', k: 'next' });
    if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) bc.postMessage({ t: 'key', k: 'prev' });
    if (e.key === 'Escape') bc.postMessage({ t: 'key', k: 'exit' });
  });
  showEl.addEventListener('click', () => bc.postMessage({ t: 'key', k: 'next' }));
}

// ================= TOP BAR ACTIONS =================
function shapeMenu(btnEl) {
  const grid = h('div', { class: 'mgrid' }, Object.keys(SHAPES).map(k => h('button', { title: SHAPE_NAMES[k], onclick: () => { closeMenu(); addShape(k); } }, shapeIcon(k))));
  menuAt(btnEl, [{ header: 'Фігури' }, { node: grid }]);
}
const ACTIONS = {
  'menu-text': (b) => menuAt(b, [
    { label: 'Заголовок', icon: 'text', fn: () => addText('title') }, { label: 'Підзаголовок', icon: 'text', fn: () => addText('subtitle') },
    { label: 'Основний текст', icon: 'text', kbd: 'T', fn: () => addText('body') }, { label: 'Мітка розділу', icon: 'text', fn: () => addText('label') },
    { label: 'Число з лічильником', icon: 'hash', fn: () => addText('counter') }]),
  'menu-shape': (b) => shapeMenu(b),
  image: () => pickImage(), line: () => addLine(), counter: () => addText('counter'),
  undo, redo,
  preview: () => previewAnims(),
  show: () => startShow(0),
  'menu-show': (b) => menuAt(b, [
    { label: 'З початку', icon: 'play', kbd: 'F5', fn: () => startShow(0) },
    { label: 'З поточного слайда', icon: 'play', kbd: 'Shift+F5', fn: () => startShow(cur) },
    { label: 'З панеллю доповідача', icon: 'presenter', kbd: 'Alt+F5', fn: () => startPresenterMode() },
    { label: 'Репетиція (доповідач у вікні)', icon: 'monitor', fn: () => startShow(cur, true) }]),
  'menu-export': (b) => menuAt(b, [
    { label: 'PDF-документ', icon: 'file', fn: exportPdf },
    { label: 'Автономний HTML з анімаціями', icon: 'code', fn: exportHtml },
    { label: 'Формат .pptx (інші редактори)…', icon: 'slides', kbd: 'Ctrl+Shift+E', fn: exportPptxDialog },
    { label: 'Імпорт .pptx…', icon: 'folder', fn: openPptxFile },
    '-', { label: 'Зберегти', icon: 'save', kbd: 'Ctrl+S', fn: () => save() }, { label: 'Зберегти як…', icon: 'save', kbd: 'Ctrl+Shift+S', fn: () => save(true) }]),
  'menu-newslide': (b) => { const r = b.getBoundingClientRect(); menu(r.left, r.top - 190, [
    { label: 'Титульний', icon: 'text', fn: () => newSlide('title') }, { label: 'Заголовок і текст', icon: 'text', fn: () => newSlide('content') },
    { label: 'Текст і зображення', icon: 'image', fn: () => newSlide('image') }, { label: 'Порожній', icon: 'plus', fn: () => newSlide('blank') },
    '-', { label: 'Дублювати поточний (morph)', icon: 'copy', fn: dupSlide }]); },
  dupslide: dupSlide,
  snap: (b) => { snapOn = !snapOn; b.classList.toggle('on', snapOn); toast(snapOn ? 'Напрямні увімкнено' : 'Напрямні вимкнено (або тримайте Alt)'); },
  zoomin: () => { zoomMode = 'manual'; zoomVal = clamp(scale * 1.2, .1, 3); fitScale(); },
  zoomout: () => { zoomMode = 'manual'; zoomVal = clamp(scale / 1.2, .1, 3); fitScale(); },
  zoomfit: () => { zoomMode = 'fit'; fitScale(); },
  help: () => showKeys()
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b && ACTIONS[b.dataset.act]) { e.stopPropagation(); ACTIONS[b.dataset.act](b); }
});
$('#logoBtn').addEventListener('click', (e) => menuAt(e.currentTarget, [
  { label: 'Головний екран', icon: 'home', fn: goHome },
  { header: 'Файл' },
  { label: 'Відкрити проєкт…', icon: 'folder', kbd: 'Ctrl+O', fn: openFile },
  { label: 'Відкрити HTML-презентацію…', icon: 'code', kbd: 'Ctrl+Shift+O', fn: openHtmlFile },
  { label: 'Імпорт .pptx…', icon: 'slides', fn: openPptxFile },
  P ? { label: 'Експорт у формат .pptx…', icon: 'slides', kbd: 'Ctrl+Shift+E', fn: exportPptxDialog } : null,
  { label: 'Палітра команд', icon: 'command', kbd: 'Ctrl+K', fn: commandPalette },
  P ? { label: 'Зберегти', icon: 'save', kbd: 'Ctrl+S', fn: () => save() } : null,
  P ? { label: 'Зберегти як…', icon: 'save', fn: () => save(true) } : null,
  P ? '-' : null,
  P ? { label: 'Експорт у PDF', icon: 'file', fn: exportPdf } : null,
  P ? { label: 'Експорт у HTML', icon: 'code', fn: exportHtml } : null,
  '-', { label: getTheme() === 'light' ? 'Темна тема' : 'Світла тема', icon: getTheme() === 'light' ? 'moon' : 'sun', fn: () => applyTheme(getTheme() === 'light' ? 'dark' : 'light', true) },
  ...(api.platform === 'win32' ? ['-', { label: 'Асоціювати файли з Aurea Studio…', icon: 'file', fn: () => setAssoc(true) }, { label: 'Прибрати асоціації файлів', icon: 'x', fn: () => setAssoc(false) }] : []),
  '-', { label: 'Гарячі клавіші', icon: 'keyboard', kbd: 'F1', fn: showKeys }
]));
async function setAssoc(on) {
  if (!api.setAssoc) return;
  const r = await api.setAssoc(on);
  if (r && r.canceled) return;
  toast(r && r.ok ? (on ? 'Готово: .aurea відкриваються в Aurea Studio, а для .html вона є в «Відкрити за допомогою»' : 'Асоціації прибрано') : 'Не вдалося змінити асоціації');
}
$('#docTitle').addEventListener('input', (e) => { ck('title'); P.title = e.target.value; dirty = true; scheduleSave(); });

function showKeys() {
  const K = [['Скасувати / Повторити', 'Ctrl+Z / Ctrl+Y'], ['Зберегти / Зберегти як', 'Ctrl+S / Ctrl+Shift+S'], ['Відкрити', 'Ctrl+O'], ['Новий слайд', 'Ctrl+M'], ['Дублювати слайд (morph)', 'Ctrl+Shift+D'],
    ['Показ з початку / з поточного', 'F5 / Shift+F5'], ['Панель доповідача', 'Alt+F5, у показі — P'], ['Копіювати / Вставити / Вирізати', 'Ctrl+C / V / X'], ['Дублювати елемент', 'Ctrl+D'], ['Видалити', 'Delete'],
    ['Зсув на 1 / 10 px', '← → ↑ ↓ / + Shift'], ['Виділити все', 'Ctrl+A'], ['Шар вище / нижче', 'Ctrl+] / Ctrl+['], ['Редагувати текст', 'Enter / подвійний клік'], ['Текст / Лінія / Зображення', 'T / L / I'],
    ['Прямокутник / Еліпс', 'R / O'], ['Слайд вгору / вниз', 'PageUp / PageDown'], ['Без прилипання', 'тримайте Alt'], ['Пропорційно', 'тримайте Shift'], ['Масштаб', 'Ctrl + коліщатко'],
    ['У показі: далі / назад', '→ Space / ←'], ['У показі: чорний екран', 'B'], ['У показі: лазер / перо / стерти', 'L / D / E'], ['Огляд слайдів', 'G'], ['Пошук фото', 'Shift+I'], ['Вийти з показу', 'Esc']];
  const m = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === m) m.remove(); } },
    h('div', { class: 'modal glass' }, h('h2', {}, 'Гарячі клавіші'), h('div', { class: 'keys' }, K.map(([a, b]) => h('div', {}, h('span', {}, a), h('kbd', {}, b))))));
  document.body.append(m);
}

// ================= KEYBOARD =================
const isTyping = (e) => { const t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); };
addEventListener('keydown', (e) => {
  if (document.body.classList.contains('audience')) return;
  const k = e.key, ctrl = e.ctrlKey || e.metaKey, code = e.code;
  if (showPlayer) {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k) || code === 'KeyN') { e.preventDefault(); showCmd('next'); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); showCmd('prev'); }
    else if (k === 'Home') showCmd('first');
    else if (k === 'End') showCmd('last');
    else if (k === 'Escape') showCmd('exit');
    else if (code === 'KeyP') showCmd('presenter');
    else if (code === 'KeyB' || k === '.') showCmd('black');
    else if (code === 'KeyL') toggleLaser();
    else if (code === 'KeyD') togglePen();
    else if (code === 'KeyE') clearPen();
    return;
  }
  if ($('.modal-bg')) { if (k === 'Escape') $('.modal-bg').remove(); return; }
  if (k === 'F1') { e.preventDefault(); return showKeys(); }
  if (!P || $('#editor').classList.contains('hidden')) { if (ctrl && code === 'KeyO') { e.preventDefault(); openFile(); } return; }
  if ($('#overview') && k === 'Escape') return toggleOverview(false);
  if (k === 'F5') { e.preventDefault(); if (e.altKey) startPresenterMode(); else startShow(e.shiftKey ? cur : 0); return; }
  if (ctrl && code === 'KeyS') { e.preventDefault(); save(e.shiftKey); return; }
  if (ctrl && code === 'KeyO') { e.preventDefault(); openFile(); return; }
  if (isTyping(e)) return;
  if (ctrl && code === 'KeyZ') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if (ctrl && code === 'KeyY') { e.preventDefault(); redo(); return; }
  if (ctrl && code === 'KeyM') { e.preventDefault(); newSlide('title'); return; }
  if (ctrl && e.shiftKey && code === 'KeyD') { e.preventDefault(); dupSlide(); return; }
  if (ctrl && code === 'KeyD') { e.preventDefault(); duplicateSel(); return; }
  if (ctrl && code === 'KeyC') { copySel(); return; }
  if (ctrl && code === 'KeyX') { cutSel(); return; }
  if (ctrl && code === 'KeyA') { e.preventDefault(); sel = slideCur().elements.filter(x => !x.locked && !x.hidden).map(x => x.id); renderOverlay(); renderProps(); return; }
  if (ctrl && code === 'BracketRight') { layer(e.shiftKey ? 'top' : 'up'); return; }
  if (ctrl && code === 'BracketLeft') { layer(e.shiftKey ? 'bottom' : 'down'); return; }
  if (k === 'Delete' || k === 'Backspace') { if (sel.length) { e.preventDefault(); deleteSel(); } else if (k === 'Delete' && document.activeElement?.closest?.('#strip')) delSlide(); return; }
  if (k.startsWith('Arrow')) {
    if (!sel.length) { if (k === 'ArrowUp' || k === 'ArrowLeft') gotoSlide(cur - 1); else gotoSlide(cur + 1); e.preventDefault(); return; }
    e.preventDefault();
    const d = e.shiftKey ? 10 : 1;
    nudge(k === 'ArrowLeft' ? -d : k === 'ArrowRight' ? d : 0, k === 'ArrowUp' ? -d : k === 'ArrowDown' ? d : 0);
    return;
  }
  if (k === 'PageDown') { e.preventDefault(); gotoSlide(cur + 1); return; }
  if (k === 'PageUp') { e.preventDefault(); gotoSlide(cur - 1); return; }
  if (k === 'Escape') { closeMenu(); if (sel.length) { sel = []; renderOverlay(); renderProps(); } return; }
  if (k === 'Enter' && sel.length === 1 && selected()[0].type === 'text') { e.preventDefault(); startEdit(sel[0]); return; }
  if (ctrl || e.altKey) return;
  if (code === 'KeyG') return toggleOverview();
  if (e.shiftKey && code === 'KeyI') return imageSearch();
  if (code === 'KeyT') addText('body');
  else if (code === 'KeyL') addLine();
  else if (code === 'KeyI') pickImage();
  else if (code === 'KeyR') addShape('rect');
  else if (code === 'KeyO') addShape('ellipse');
});
document.addEventListener('paste', async (e) => {
  if (!P || isTyping(e) || showPlayer) return;
  const f = [...(e.clipboardData?.files || [])].find(x => x.type.startsWith('image/'));
  if (f) { e.preventDefault(); await addImageUrl(await readFile(f)); return; }
  if (clipboard) { e.preventDefault(); paste(); }
});
addEventListener('beforeunload', () => { if (P && api.autosave) api.autosave(serialize()); });

// ================= DEMO (automated screenshots) =================
window.__demo = {
  steps: () => ['02-editor-museum', '03-animation-tab', '04-icon-menu', '05-show-title', '06-show-morph-mid', '07-show-slide2', '08-presenter', '09-cosmos-editor', '10-show-cosmos-chart', '11-slide-tab', '12-export', '19-image-library', '20-image-search', '21-overview', '22-quickbar-chart', '23-dark-editor', '24-dark-anim', '25-dark-start', '26-light-start', '27-layers', '28-format', '29-palette', '30-pptx-dialog', '31-find', '32-notes', '33-pptx-roundtrip', '34-keys', '35-start-gallery', '36-redpitch', '37-dusk-show', '38-editorial', '39-nightgallery-show'],
  async run(step) {
    const T = (id) => TPL.list.find(t => t.id === id);
    const pick = (fn) => { const e = slideCur().elements.find(fn); sel = e ? [e.id] : []; renderOverlay(); renderProps(); };
    closeMenu();
    switch (step) {
      case '02-editor-museum': await createFromTemplate(T('museum')); gotoSlide(1); pick(e => e.type === 'image'); tab = 'design'; renderProps(); return 1800;
      case '03-animation-tab': gotoSlide(0); pick(e => e.type === 'text' && e.style.size >= 140); tab = 'anim'; renderProps(); previewAnims(); return 1300;
      case '04-icon-menu': iconMenu($('[data-act="menu-icon"]')); return 700;
      case '05-show-title': closeMenu(); startShow(0); return 3200;
      case '06-show-morph-mid': showCmd('next'); return 450;
      case '07-show-slide2': return 2600;
      case '08-presenter': showCmd('next'); showCmd('presenter'); return 2200;
      case '09-cosmos-editor': endShow(); await createFromTemplate(T('cosmos')); gotoSlide(0); pick(e => e.type === 'text' && e.style.size >= 120); tab = 'design'; renderProps(); return 1800;
      case '10-show-cosmos-chart': startShow(2); return 2200;
      case '11-slide-tab': endShow(); gotoSlide(1); sel = []; tab = 'slide'; renderOverlay(); renderProps(); $('#pbody').scrollTop = 520; return 900;
      case '19-image-library': imSource = 'lib'; imageSearch(); return 1500;
      case '20-image-search': { $('.modal-bg')?.remove(); imSource = 'commons'; imLastQ = 'квіти'; imageSearch(); return 7000; }
      case '21-overview': $('.modal-bg')?.remove(); toggleOverview(); return 1400;
      case '22-quickbar-chart': toggleOverview(false); gotoSlide(2); pick(e => e.type === 'chart'); tab = 'design'; renderProps(); return 1200;
      case '23-dark-editor': applyTheme('dark'); await createFromTemplate(T('museum')); gotoSlide(1); pick(e => e.type === 'image'); tab = 'design'; renderProps(); return 1600;
      case '24-dark-anim': gotoSlide(0); pick(e => e.type === 'text' && e.style.size >= 140); tab = 'anim'; renderProps(); $('#pbody').scrollTop = 380; return 1200;
      case '25-dark-start': await goHome(); return 1500;
      case '26-light-start': applyTheme('light'); return 1200;
      case '27-layers': await createFromTemplate(T('cosmos')); gotoSlide(1); tab = 'layers'; sel = [slideCur().elements.find(x => x.type === 'icon').id]; renderOverlay(); renderProps(); return 1300;
      case '28-format': { const e = slideCur().elements.find(x => x.type === 'icon'); e.fx = { shadow: 'soft', sColor: '#000000', glow: 24, gColor: '#7dd3fc' }; changed('canvas'); sel = slideCur().elements.filter(x => x.type === 'icon').map(x => x.id); groupSel(); tab = 'design'; renderProps(); $('#pbody').scrollTop = 99999; return 1300; }
      case '29-palette': commandPalette(); const ci = $('.cpinp'); ci.value = 'груп'; ci.dispatchEvent(new Event('input')); return 900;
      case '30-pptx-dialog': $('.modal-bg')?.remove(); exportPptxDialog(); return 900;
      case '31-find': $('.modal-bg')?.remove(); findReplace(true); const fi = $('.frmodal .inp'); fi.value = 'Земл'; fi.dispatchEvent(new Event('input')); return 900;
      case '32-notes': $('.modal-bg')?.remove(); gotoSlide(2); toggleNotes(true); return 1300;
      case '33-pptx-roundtrip': {
        toggleNotes(false);
        const buf = await buildPptx({ transitions: true, anims: true }); busy(false);
        await api.debugWriteB64?.({ name: 'export-test.pptx', b64: ab2b64(buf) });
        await importPptx(buf, 'Космос-повернення.pptx'); gotoSlide(2); return 1800;
      }
      case '34-keys': showKeysV4(); return 900;
      case '35-start-gallery': $('.modal-bg')?.remove(); await goHome(); { const g = [...document.querySelectorAll('.shead h3')].find(x => x.textContent.includes('Галерея')); g?.scrollIntoView({ block: 'start' }); } return 1600;
      case '36-redpitch': await createFromTemplate(T('redpitch')); gotoSlide(1); sel = []; renderOverlay(); tab = 'anim'; renderProps(); return 1800;
      case '37-dusk-show': await createFromTemplate(T('dusk')); startShow(0, false, true); return 3200;
      case '38-editorial': endShow(); await createFromTemplate(T('editorial')); gotoSlide(0); sel = []; renderOverlay(); tab = 'design'; renderProps(); return 1800;
      case '39-nightgallery-show': await createFromTemplate(T('nightgallery')); startShow(2, false, true); return 3200;
      case 'home': if (showPlayer) endShow(); await goHome(); return 800;
      case '12-export': {
        const html = await buildStandalone(false);
        const phtml = await buildStandalone(true);
        await api.debugWrite?.({ name: 'export-test.html', data: html });
        const ok = await api.debugPdf?.({ name: 'export-test.pdf', html: phtml });
        await api.debugWrite?.({ name: 'project-test.aurea', data: serialize() });
        toast(`Тест експорту: HTML ${Math.round(html.length / 1024)} КБ, PDF ${ok ? 'OK' : '—'}`);
        return 800;
      }
    }
    return 500;
  }
};

// ================= V2: motion, quick bar, icons, charts, image search, overview, show tools =================
Object.assign(IC, {
  sparkle2: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  hashgrid: '<path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  library: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z"/>',
  laser: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  pen: '<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.3" fill="currentColor"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor"/><circle cx="16" cy="10" r="1.3" fill="currentColor"/><path d="M12 21a2 2 0 0 1 0-4h2a3 3 0 0 0 3-3"/>'
});
const iconSvg = (name, sw = 1.6) => { const t = document.createElement('template'); t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${Aurea.ICONS[name]}"/></svg>`; return t.content.firstChild; };
const ICON_NAMES = { crown: 'Корона', star: 'Зірка', heart: 'Серце', check: 'Галочка', cross: 'Хрестик', arrow: 'Стрілка', quote: 'Цитата', book: 'Книга', globe: 'Глобус', calendar: 'Календар', user: 'Людина', users: 'Люди', bulb: 'Ідея', trophy: 'Кубок', flag: 'Прапор', pin: 'Мітка', clock: 'Годинник', camera: 'Камера', music: 'Музика', rocket: 'Ракета', shield: 'Щит', castle: 'Замок', rose: 'Троянда', sparkle: 'Іскра', chart: 'Графік', target: 'Ціль', leaf: 'Листок', mail: 'Лист', chat: 'Чат', gift: 'Подарунок', mountain: 'Гори', sun: 'Сонце', moon: 'Місяць', play: 'Відтворення', pen: 'Перо', scroll: 'Сувій', gem: 'Діамант' };

// ---- ripple on buttons
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.btn, .btn-primary, .tbtn, .vbtn, .acard, .tcard2, .qbar button');
  if (!b || b.disabled) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const s = h('span', { class: 'rip', style: `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px` });
  if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
  b.style.overflow = 'hidden';
  b.append(s); setTimeout(() => s.remove(), 650);
}, true);

// ---- sliding tab indicator
function moveTabInd() {
  const tabs = $('#tabs'); let ind = $('.tab-ind', tabs);
  if (!ind) { ind = h('div', { class: 'tab-ind' }); tabs.prepend(ind); }
  const on = $('.tab.on', tabs); if (!on) return;
  ind.style.left = on.offsetLeft + 'px'; ind.style.width = on.offsetWidth + 'px';
}

// ---- 3D tilt for template cards
document.addEventListener('pointermove', (e) => {
  const c = e.target.closest && e.target.closest('.tcard2');
  $$('.tcard2.tilt').forEach(x => { if (x !== c) { x.classList.remove('tilt'); x.style.transform = ''; } });
  if (!c) return;
  const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  c.classList.add('tilt');
  c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 7}deg) rotateY(${(x - .5) * 9}deg) translateY(-4px)`;
  const tw = $('.tw', c); if (tw) { tw.style.setProperty('--mx', x * 100 + '%'); tw.style.setProperty('--my', y * 100 + '%'); }
});

// ---- image compression for inserted images
async function shrinkImage(url, max = 1920) {
  try {
    if (!/^data:image\/(png|jpe?g|webp)/i.test(url)) return url;
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    if (k >= 1 && url.length < 2.5e6) return url;
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const png = /^data:image\/png/i.test(url);
    return c.toDataURL(png ? 'image/png' : 'image/jpeg', .88);
  } catch { return url; }
}

// ---- icons & charts insertion
function addIcon(name, pt) {
  finishEdit();
  const ac = (P.theme.colors || [])[themeName() === 'museum' ? 2 : 1] || '#e8c27a';
  const p = placeAt(180, 180, pt);
  insertEl({ id: uid(), type: 'icon', icon: name, x: p.x, y: p.y, w: 180, h: 180, rot: 0, opacity: 1, morph: uid(),
    style: { color: ac, strokeWidth: 1.6, shape: 'circle', bg: ac, bgOpacity: .1, glow: true, filled: false },
    anim: { type: 'bounceIn', trigger: 'auto', delay: 0, dur: 900, loop: true, order: 0 } });
}
function addChart(kind) {
  finishEdit();
  const light = isLight(slideCur().bg.color);
  const [fH, fB] = fontsFor();
  const cols = [];
  const data = kind === 'donut' ? [{ l: 'Так', v: 68 }, { l: 'Ні', v: 22 }, { l: 'Не знаю', v: 10 }]
    : [{ l: '2022', v: 35 }, { l: '2023', v: 52 }, { l: '2024', v: 71 }, { l: '2025', v: 88 }];
  const w = kind === 'donut' ? 520 : 900, hh = kind === 'donut' ? 520 : kind === 'hbar' ? 420 : 560;
  const p = placeAt(w, hh);
  insertEl({ id: uid(), type: 'chart', chart: kind, data, x: p.x, y: p.y, w, h: hh, rot: 0, opacity: 1, morph: uid(),
    style: { font: fB, size: 26, color: light ? '#16130f' : '#ffffff', suffix: kind === 'donut' ? '%' : '', colors: cols.length >= 2 ? cols : [], radius: 14, gap: 4 },
    anim: { type: 'grow', trigger: 'auto', delay: 0, dur: 1000, loop: true, order: 0 } });
}
function iconMenu(btnEl, onPick = (n) => addIcon(n)) {
  const grid = h('div', { class: 'icgrid' }, Object.keys(Aurea.ICONS).map(n => h('button', { title: ICON_NAMES[n] || n, onclick: () => { closeMenu(); onPick(n); } }, iconSvg(n))));
  menuAt(btnEl, [{ header: 'Іконки' }, { node: grid }]);
}

// ---- props sections for new types
function iconSec(e) {
  const s = e.style;
  return sec('Іконка',
    h('div', { class: 'icgrid', style: 'margin-bottom:10px' }, Object.keys(Aurea.ICONS).map(n => h('button', { class: n === e.icon ? 'on' : '', title: ICON_NAMES[n] || n, onclick: () => setProp('icon', n, 'canvas+props') }, iconSvg(n)))),
    fld('Колір', colorIn(s.color, v => setStyle('color', v))),
    fld('Товщина ліній', rangeIn(s.strokeWidth || 1.6, .6, 4, .1, v => setStyle('strokeWidth', v), v => v.toFixed(1))),
    fld('Підкладка', segIn([{ v: 'none', l: 'Немає' }, { v: 'circle', l: 'Коло' }, { v: 'rounded', l: 'Квадрат' }], s.shape || 'none', v => setStyle('shape', v, 'canvas+props'))),
    s.shape && s.shape !== 'none' ? [fld('Колір підкладки', colorIn(s.bg || s.color, v => setStyle('bg', v))), fld('Прозорість підкладки', rangeIn(s.bgOpacity ?? .1, 0, 1, .01, v => setStyle('bgOpacity', v), v => Math.round(v * 100) + '%'))] : null,
    tglIn('Сяйво', !!s.glow, v => setStyle('glow', v)),
    tglIn('Заливка', !!s.filled, v => setStyle('filled', v))
  );
}
function chartSec(e) {
  const s = e.style;
  const rows = (e.data || []).map((d, i) => {
    const lab = h('input', { class: 'inp', value: d.l, spellcheck: 'false' });
    const val = h('input', { class: 'inp', type: 'number', value: d.v });
    const ci = h('input', { type: 'color', value: toHex6(d.c || (s.colors && s.colors[i % (s.colors.length || 1)]) || '#e8c27a') });
    lab.addEventListener('input', () => setEls(x => { x.data[i].l = lab.value; }, 'cl' + i + e.id));
    val.addEventListener('input', () => { const v = parseFloat(val.value); if (!isNaN(v)) setEls(x => { x.data[i].v = v; }, 'cv' + i + e.id); });
    ci.addEventListener('input', () => setEls(x => { x.data[i].c = ci.value; }, 'cc' + i + e.id));
    return h('div', { class: 'drow' }, h('label', { class: 'sw' }, h('i', { style: `background:${ci.value}` }), ci), lab, val,
      h('button', { class: 'x', title: 'Видалити', onclick: () => setEls(x => { x.data.splice(i, 1); }, null, 'canvas+props') }, icon('x')));
  });
  return sec('Діаграма',
    fld('Тип', segIn([{ v: 'bar', l: 'Стовпці' }, { v: 'hbar', l: 'Смуги' }, { v: 'donut', l: 'Кільце' }], e.chart, v => setProp('chart', v, 'canvas+props'))),
    fld('Дані (назва · значення)', h('div', {}, rows)),
    row(btn('Додати рядок', 'plus', () => setEls(x => { x.data.push({ l: 'Нове', v: 50 }); }, null, 'canvas+props'))),
    row(fld('Префікс', (() => { const i = h('input', { class: 'inp', value: s.prefix || '' }); i.addEventListener('input', () => setStyle('prefix', i.value)); return i; })()),
      fld('Суфікс', (() => { const i = h('input', { class: 'inp', value: s.suffix || '' }); i.addEventListener('input', () => setStyle('suffix', i.value)); return i; })())),
    e.chart === 'donut' ? row(fld('Текст у центрі', (() => { const i = h('input', { class: 'inp', value: s.center || '', placeholder: 'авто' }); i.addEventListener('input', () => setStyle('center', i.value)); return i; })()),
      fld('Підпис', (() => { const i = h('input', { class: 'inp', value: s.centerLabel ?? '', placeholder: 'авто' }); i.addEventListener('input', () => setStyle('centerLabel', i.value)); return i; })())) : null,
    fld('Шрифт', selIn(FONTS.map(f => ({ v: f, l: f })), s.font || 'Inter', v => setStyle('font', v), v => `font-family:'${v}'`)),
    row(fld('Розмір підписів', rangeIn(s.size || 26, 12, 60, 1, v => setStyle('size', v))), h('div')),
    fld('Колір тексту', colorIn(s.color || '#ffffff', v => setStyle('color', v))),
    h('p', { class: 'hint' }, 'Анімація «Ріст» вирощує стовпці й рахує значення. Колір кожного рядка — квадратик зліва.')
  );
}

// ---- quick floating toolbar
let qbarHidden = false;
function quickBar() {
  const els = selected();
  if (!els.length || editingId || qbarHidden || $('#work').classList.contains('previewing')) return null;
  const b = bbox(els);
  const one = els.length === 1 ? els[0] : null;
  const x = (b.x + b.w / 2) * scale;
  let y = b.y * scale - 34;
  const below = y < 56;
  if (below) y = (b.y + b.h) * scale + 22;
  const bar = h('div', { class: 'qbar', style: `left:${clamp(x, 160, W * scale - 160)}px;top:${y}px;${below ? 'transform:translate(-50%,0)' : ''}` });
  bar.addEventListener('pointerdown', (e) => e.stopPropagation());
  const B = (content, title, fn, on) => { const bt = h('button', { title, class: on ? 'on' : '' }, typeof content === 'string' && IC[content] ? icon(content) : content); bt.addEventListener('click', (ev) => { ev.stopPropagation(); fn(bt); }); return bt; };
  const sep = () => h('span', { class: 'qsep' });
  const colorKey = one && ({ text: 'color', shape: (one.style.fill && one.style.fill !== 'none') ? 'fill' : 'stroke', line: 'stroke', icon: 'color', chart: 'color' })[one.type];
  if (one && one.type === 'text') {
    const s = one.style;
    bar.append(B('minus', 'Менший шрифт', () => setStyle('size', Math.max(8, Math.round(s.size / 1.1)), 'canvas+props')),
      h('span', { class: 'qnum' }, Math.round(s.size)),
      B('plus', 'Більший шрифт', () => setStyle('size', Math.round(s.size * 1.1), 'canvas+props')), sep(),
      B('bold', 'Жирний', () => setStyle('weight', (s.weight || 400) >= 600 ? 400 : 700, 'canvas+props'), (s.weight || 400) >= 600),
      B('italic', 'Курсив', () => setStyle('italic', !s.italic, 'canvas+props'), s.italic),
      B({ left: 'tL', center: 'tC', right: 'tR' }[s.align || 'left'], 'Вирівнювання', () => setStyle('align', { left: 'center', center: 'right', right: 'left' }[s.align || 'left'], 'canvas+props')), sep());
  }
  if (one && one.type === 'image') {
    bar.append(B('image', 'Замінити', () => replaceImage(one)),
      B('Маска', 'Змінити маску', () => setStyle('mask', { none: 'rounded', rounded: 'circle', circle: 'arch', arch: 'none' }[one.style.mask || 'none'], 'canvas+props')), sep());
  }
  if (one && one.type === 'icon') bar.append(B('sparkle2', 'Інша іконка', (bt) => iconMenu(bt, (n) => setProp('icon', n, 'canvas+props'))), sep());
  if (colorKey) {
    const ci = h('input', { type: 'color', value: toHex6(one.style[colorKey]) });
    ci.addEventListener('input', () => setStyle(colorKey, ci.value));
    bar.append(h('label', { class: 'qsw', title: 'Колір', style: `background:${one.style[colorKey]}` }, ci), sep());
  }
  bar.append(B('sparkles', 'Анімація', () => { tab = 'anim'; lastTab = 'anim'; renderProps(); }),
    B('play', 'Переглянути анімацію', () => previewAnims([...sel])),
    B('copy', 'Дублювати (Ctrl+D)', duplicateSel),
    B('trash', 'Видалити (Del)', deleteSel));
  return bar;
}

// ---- image search: Wikimedia Commons, Openverse, built-in library
const LIB = [
  ['venus', 'С. Боттічеллі, «Народження Венери»'], ['monalisa', 'Леонардо да Вінчі, «Мона Ліза»'], ['milkmaid', 'Я. Вермеєр, «Молочниця»'],
  ['pearl', 'Я. Вермеєр, «Дівчина з перловою сережкою»'], ['rembrandt', 'Рембрандт, «Автопортрет»'], ['shalott', 'Дж. В. Вотергаус, «Леді з Шалотт»'],
  ['kiss', 'Г. Клімт, «Поцілунок»'], ['wave', 'К. Хокусай, «Велика хвиля в Канаґаві»'], ['starry', 'В. ван Гог, «Зоряна ніч»'],
  ['lilies', 'К. Моне, «Водяні лілії»'], ['pillars', 'NASA/Hubble, «Стовпи творення»'], ['earth', 'NASA, Земля з «Аполлона-17»'],
  ['aldrin', 'NASA, Базз Олдрін на Місяці'], ['portrait1', 'Портрет XVI ст.'], ['portrait2', 'Г. Гольбейн, портрет'], ['portrait3', 'Портрет Єлизавети I'], ['portrait4', 'Портрет XVI ст.']
];
const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
// translate a Ukrainian/Russian query to English via Wikidata labels (better Commons/Openverse results)
const transCache = {};
async function toEnglish(q) {
  if (!/[а-яіїєґё]/i.test(q)) return q;
  if (transCache[q]) return transCache[q];
  try {
    const words = q.trim();
    const j = await api.netJson('https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&limit=1&language=uk&uselang=en&type=item&search=' + encodeURIComponent(words));
    const hit = j && j.search && j.search[0];
    const en = hit && (hit.label || (hit.display && hit.display.label && hit.display.label.value));
    if (en && !/[а-яіїєґё]/i.test(en)) return (transCache[q] = en);
  } catch { }
  return (transCache[q] = q);
}
async function searchCommons(q, page = 0, best = true) {
  const filt = best ? ' (incategory:Featured_pictures_on_Wikimedia_Commons OR incategory:Quality_images)' : '';
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=40'
    + '&gsroffset=' + page * 40 + '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap' + filt) + '&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=480&iiextmetadatafilter=LicenseShortName|Artist|ObjectName';
  const j = await api.netJson(u);
  const pages = Object.values((j && j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  return pages.map(p => {
    const ii = (p.imageinfo || [])[0] || {}, m = ii.extmetadata || {};
    const title = p.title.replace(/^File:/, '');
    return { thumb: ii.thumburl, w: ii.thumbwidth, h: ii.thumbheight, full: 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title) + '?width=1920',
      title: stripTags(m.ObjectName && m.ObjectName.value) || title.replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
      author: stripTags(m.Artist && m.Artist.value) || 'невідомий автор', license: stripTags(m.LicenseShortName && m.LicenseShortName.value) || 'див. Commons', source: 'Wikimedia Commons' };
  }).filter(r => r.thumb);
}
async function searchOpenverse(q, page = 0, best = true) {
  const j = await api.netJson('https://api.openverse.org/v1/images/?page_size=40&mature=false&page=' + (page + 1) + (best ? '&size=large' : '') + '&q=' + encodeURIComponent(q));
  return ((j && j.results) || []).map(r => ({ thumb: r.thumbnail, w: r.width, h: r.height, full: r.url, title: r.title || 'Без назви', author: r.creator || 'невідомий автор',
    license: `CC ${String(r.license || '').toUpperCase()} ${r.license_version || ''}`.replace('CC CC0', 'CC0').replace('CC PDM', 'Суспільне надбання').trim(), source: r.source ? `Openverse / ${r.source}` : 'Openverse' }));
}
const TOPICS = ['Ренесанс', 'Космос', 'Природа', 'Океан', 'Гори', 'Квіти', 'Архітектура', 'Замок', 'Тюдори', 'Мінімалізм', 'Місто вночі', 'Осінь', 'Тварини', 'Абстракція', 'Україна', 'Наука'];
let imSource = 'commons', imLastQ = '', imAddCredit = true, imBest = true;
let pinNoticeShown = false;
async function insertRemoteImage(url, pt, sourcePage) {
  busy('Завантажую зображення…');
  try {
    const data = await api.netImage(url);
    await addImageUrl(await shrinkImage(data), pt);
    const img = selected()[0];
    const src = sourcePage || url;
    let host = ''; try { host = new URL(src).hostname.replace(/^www\./, ''); } catch { }
    if (img) {
      const light = isLight(slideCur().bg.color);
      const cap = TPL.T('Джерело: ' + host, img.x, img.y + img.h + 10, Math.max(260, img.w), 26, { font: 'Inter', size: 14, color: light ? '#5b564e' : '#bdbac6' }, { a: 'fadeUp', d: 300 });
      ck(); slideCur().elements.push(cap); changed('canvas+props');
    }
    if (/pinterest|pinimg/.test(host + url) && !pinNoticeShown) { pinNoticeShown = true; toast('Картинки з Pinterest часто чужі. Для публічного показу краще замінити на схожу з вільною ліцензією.', { label: 'Знайти схожу', fn: () => imageSearch() }); }
    else toast('Зображення додано');
  } catch (e) { toast('Не вдалося завантажити: ' + e.message); } finally { busy(false); }
}
function imageSearch(pt) {
  finishEdit(); closeMenu();
  const grid = h('div', { class: 'imgrid' });
  const q = h('input', { class: 'inp', placeholder: 'Тема: космос, Ренесанс, квіти, океан… (можна українською)', value: imLastQ, spellcheck: 'false' });
  const tabsEl = h('div', { class: 'imtabs' });
  const trans = h('div', { class: 'imtrans' });
  const credit = tglIn('Підпис з автором і ліцензією', imAddCredit, v => { imAddCredit = v; });
  const best = tglIn('✦ Лише найкращі', imBest, v => { imBest = v; run(); });
  credit.style.margin = '0';
  let page = 0, results = [], loading = false;
  const close = () => { m.remove(); if (viewerOpen) api.htmlHide?.(false); };
  const pick = async (r) => {
    busy('Завантажую зображення…');
    try {
      const url = r.lib ? await toDataURL(`assets/lib/${r.lib}.jpg`) : await api.netImage(r.full);
      if (!url) throw new Error('не вдалося завантажити');
      close();
      await addImageUrl(await shrinkImage(url), pt);
      const img = selected()[0];
      if (imAddCredit && img && !r.lib) {
        const light = isLight(slideCur().bg.color);
        const cap = TPL.T(`${r.title} · ${r.author} · ${r.license} · ${r.source}`, img.x, img.y + img.h + 12, Math.max(320, img.w), 28,
          { font: 'Inter', size: 15, color: light ? '#5b564e' : '#bdbac6', lh: 1.3 }, { a: 'fadeUp', d: 300 });
        ck(); slideCur().elements.push(cap); changed('canvas+props');
      }
      toast(r.lib ? 'Додано з бібліотеки' : 'Фото додано · ' + r.license);
    } catch (e) { toast('Помилка: ' + e.message); } finally { busy(false); }
  };
  const card = (r, i) => h('div', { class: 'icard', style: `animation-delay:${Math.min(i % 40, 20) * 25}ms`, onclick: () => pick(r), title: `${r.title}\n${r.author}\n${r.license}` },
    h('img', { src: r.thumb, loading: 'lazy', alt: '', style: r.w && r.h ? `aspect-ratio:${r.w}/${r.h}` : '' }),
    h('span', { class: 'badge2' }, r.license.length > 22 ? r.license.slice(0, 22) + '…' : r.license),
    h('button', { class: 'add' }, '+ Додати'),
    h('div', { class: 'lic' }, h('b', {}, String(r.title).slice(0, 80)), r.author ? [h('br'), String(r.author).slice(0, 80)] : null));
  const render = (msg) => {
    if (!results.length) { grid.replaceChildren(h('div', { class: 'imempty' }, msg || 'Нічого не знайдено. Спробуйте іншу тему або вимкніть «Лише найкращі».')); return; }
    const more = imSource !== 'lib' ? h('div', { class: 'immore' }, h('button', { class: 'btn', onclick: loadMore }, icon('plus'), 'Показати ще')) : null;
    grid.replaceChildren(...results.map(card), more);
  };
  const showLib = () => { results = LIB.map(([id, t]) => ({ lib: id, thumb: `assets/lib/${id}.jpg`, title: t, author: '', license: 'Суспільне надбання', source: 'Бібліотека Aurea' })); trans.textContent = ''; render(); };
  const fetchPage = async (query) => {
    let list = imSource === 'commons' ? await searchCommons(query, page, imBest) : await searchOpenverse(query, page, imBest);
    if (imBest && page === 0 && list.length < 8) { const extra = imSource === 'commons' ? await searchCommons(query, 0, false) : await searchOpenverse(query, 0, false); list = list.concat(extra.filter(x => !list.some(y => y.full === x.full))); }
    return list;
  };
  let curQuery = '';
  async function run() {
    if (imSource === 'lib') return showLib();
    const raw = q.value.trim(); imLastQ = raw;
    if (!raw) { results = []; return render('Введіть тему або оберіть її нижче'); }
    page = 0; results = []; grid.replaceChildren(h('div', { class: 'imempty' }, h('div', { class: 'spinner', style: 'margin:0 auto 14px' }), 'Шукаю красиві зображення…'));
    try {
      curQuery = await toEnglish(raw);
      trans.textContent = curQuery !== raw ? `Шукаю як «${curQuery}» — так знаходиться значно більше` : '';
      results = await fetchPage(curQuery); render();
    } catch (e) { results = []; render('Немає з’єднання з інтернетом або сервіс недоступний. Бібліотека шедеврів працює офлайн.'); }
  }
  async function loadMore() {
    if (loading) return; loading = true; page++;
    try { const more = await fetchPage(curQuery); results = results.concat(more.filter(x => !results.some(y => y.full === x.full))); render(); }
    catch { toast('Не вдалося завантажити ще'); } finally { loading = false; }
  }
  const setTab = (s) => { imSource = s; $$('button', tabsEl).forEach(b => b.classList.toggle('on', b.dataset.s === s)); run(); };
  [['commons', 'Wikimedia Commons'], ['openverse', 'Openverse (CC)'], ['lib', 'Бібліотека шедеврів']].forEach(([s, l]) => tabsEl.append(h('button', { 'data-s': s, onclick: () => setTab(s) }, l)));
  q.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { if (imSource === 'lib') setTab('commons'); else run(); } if (e.key === 'Escape') close(); });
  const chips = h('div', { class: 'imchips' }, TOPICS.map(t => h('button', { onclick: () => { q.value = t; if (imSource === 'lib') setTab('commons'); else run(); } }, t)));
  const pinBtn = h('button', { class: 'pin-btn', title: 'Відкрити Pinterest з цією темою в окремому вікні — для натхнення', onclick: () => api.openPinterest?.(q.value.trim() || 'aesthetic presentation') },
    h('span', { html: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2z"/></svg>' }), 'Pinterest — натхнення');
  const m = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === m) close(); } },
    h('div', { class: 'modal glass imodal' },
      h('div', { class: 'imhead' }, h('h2', {}, 'Красиві зображення для слайдів'),
        h('p', {}, 'Wikimedia Commons і Openverse — тут лише зображення, які дозволено використовувати; автор і ліцензія підставляються в підпис. Pinterest відкривається окремо — для натхнення: побачили ідею → шукайте схожу тут.'),
        h('div', { class: 'imsearch' }, q, h('button', { class: 'btn-primary', onclick: () => { if (imSource === 'lib') setTab('commons'); else run(); } }, icon('globe'), 'Шукати')),
        chips, trans,
        h('div', { class: 'imtools' }, tabsEl, h('div', { class: 'spacer' }), best, pinBtn)),
      grid,
      h('div', { class: 'imfoot' }, credit, h('span', {}, 'Порада: картинку можна перетягнути на слайд просто з браузера.'), h('div', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: close }, 'Закрити'))));
  tabsEl.style.marginTop = '0';
  document.body.append(m);
  if (viewerOpen) api.htmlHide?.(true);
  setTab(imLastQ || imSource === 'lib' ? imSource : 'lib');
  setTimeout(() => q.focus(), 50);
}

// ---- overview (all slides grid)
function toggleOverview(force) {
  const ex = $('#overview');
  if (ex || force === false) { ex && ex.remove(); return; }
  if (!P) return;
  const ov = h('div', { id: 'overview' },
    h('h2', {}, h('span', {}, `Огляд · ${P.slides.length} слайдів`), h('button', { class: 'btn', onclick: () => toggleOverview(false) }, icon('x'), 'Закрити (G)')),
    h('div', { class: 'ogrid' }, P.slides.map((s, i) => h('div', { class: 'oitem' + (i === cur ? ' cur' : ''), style: `animation-delay:${Math.min(i, 24) * 35}ms`, onclick: () => { toggleOverview(false); gotoSlide(i); }, ondblclick: () => { toggleOverview(false); startShow(i); } },
      h('div', { class: 'tw' }, Aurea.thumb(s, P, 340)), h('div', { class: 'olab' }, h('span', {}, `${i + 1}`), h('span', {}, TR_NAMES[s.transition] || ''))))));
  document.body.append(ov);
  requestAnimationFrame(() => $$('.oitem .tw', ov).forEach(tw => { const w = tw.clientWidth, th = $('.a-thumb', tw); if (th && w) { th.style.width = w + 'px'; th.style.height = Math.round(w * 9 / 16) + 'px'; $('.a-stage', th).style.transform = `scale(${w / 1920})`; } }));
}

// ---- show tools: laser pointer and pen
let laserOn = false, penOn = false, penCanvas = null;
function showTip(text) { $('.stip', showEl)?.remove(); const t = h('div', { class: 'stip' }, text); showEl.append(t); setTimeout(() => t.remove(), 1800); }
function toggleLaser() {
  laserOn = !laserOn; if (laserOn && penOn) togglePen();
  showEl.classList.toggle('laseron', laserOn);
  if (!$('.laser', showEl)) showEl.append(h('div', { class: 'laser' }));
  showTip(laserOn ? 'Лазерна указка увімкнена (L)' : 'Лазерну указку вимкнено');
}
function togglePen() {
  penOn = !penOn; if (penOn && laserOn) toggleLaser();
  showEl.classList.toggle('penon', penOn);
  if (!penCanvas) {
    penCanvas = h('canvas', { class: 'pen' }); showEl.append(penCanvas);
    let drawing = false, last = null;
    const ctx = penCanvas.getContext('2d');
    const pos = (e) => [e.clientX * devicePixelRatio, e.clientY * devicePixelRatio];
    penCanvas.addEventListener('pointerdown', (e) => { e.stopPropagation(); drawing = true; last = pos(e); });
    penCanvas.addEventListener('pointermove', (e) => {
      if (!drawing) return; const p = pos(e);
      ctx.strokeStyle = '#ffd36e'; ctx.lineWidth = 5 * devicePixelRatio; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,200,90,.8)'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p;
    });
    addEventListener('pointerup', () => { drawing = false; });
    penCanvas.addEventListener('click', (e) => e.stopPropagation());
  }
  penCanvas.width = innerWidth * devicePixelRatio; penCanvas.height = innerHeight * devicePixelRatio;
  penCanvas.style.width = '100%'; penCanvas.style.height = '100%';
  showTip(penOn ? 'Перо: малюйте мишею · E — стерти · D — вимкнути' : 'Перо вимкнено');
}
function clearPen() { if (penCanvas) penCanvas.getContext('2d').clearRect(0, 0, penCanvas.width, penCanvas.height); }
showEl.addEventListener('mousemove', (e) => { const l = $('.laser', showEl); if (l && laserOn) { l.style.left = e.clientX + 'px'; l.style.top = e.clientY + 'px'; } });

// ---- font pairs (apply to whole presentation)
const FONT_PAIRS = [
  ['Playfair Display', 'Cormorant Garamond', 'Музейна'], ['Inter', 'Inter', 'SaaS'], ['Unbounded', 'Onest', 'Сміливо'],
  ['Manrope', 'Manrope', 'Мінімал'], ['Playfair Display', 'Lora', 'Журнал'], ['Oswald', 'Raleway', 'Плакат'], ['Montserrat', 'Lora', 'Класика'], ['Comfortaa', 'Onest', 'Дружньо']
];
function applyFontPair(hf, bf) {
  ck();
  P.slides.forEach(s => s.elements.forEach(e => {
    if (e.type === 'text') e.style.font = (e.style.size || 0) >= 64 ? hf : bf;
    if (e.type === 'chart') e.style.font = bf;
  }));
  changed('all');
  toast(`Шрифти: ${hf} + ${bf}`);
}


const FXS = [['none', 'Немає'], ['particles', 'Частинки'], ['stars', 'Зорі'], ['aurora', 'Аврора'], ['bokeh', 'Боке'], ['snow', 'Сніг'], ['rays', 'Промені'], ['grid', 'Сітка']];
Object.assign(ACTIONS, {
  'menu-image': (b) => menuAt(b, [
    { label: 'З комп’ютера…', icon: 'folder', kbd: 'I', fn: () => pickImage() },
    { label: 'Пошук фото з вільною ліцензією…', icon: 'globe', kbd: 'Shift+I', fn: () => imageSearch() },
    { label: 'Бібліотека шедеврів', icon: 'library', fn: () => { imSource = 'lib'; imageSearch(); } }]),
  'menu-icon': (b) => iconMenu(b),
  'menu-chart': (b) => menuAt(b, [
    { label: 'Стовпчикова діаграма', icon: 'chart', fn: () => addChart('bar') },
    { label: 'Смуги (горизонтальна)', icon: 'alL', fn: () => addChart('hbar') },
    { label: 'Кільцева діаграма', icon: 'restore', fn: () => addChart('donut') }]),
  overview: () => toggleOverview(),
  gridlines: (b) => { canvasWrap.classList.toggle('gridon'); b.classList.toggle('on', canvasWrap.classList.contains('gridon')); }
});

// ================= THEMES =================
Object.assign(IC, {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>'
});
document.documentElement.classList.add('os-' + (api.platform || 'win32'));
api.on?.('open-path', (p) => { if (/\.html?$/i.test(p)) openHtmlPath(p); else openPath(p); });
function getTheme() { try { return localStorage.getItem('aurea-theme') || 'light'; } catch { return 'light'; } }
function applyTheme(t, animate) {
  if (animate) { document.body.classList.add('theme-anim'); setTimeout(() => document.body.classList.remove('theme-anim'), 600); }
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('aurea-theme', t); } catch { }
  api.setTheme?.(t);
}
applyTheme(getTheme());
document.addEventListener('click', (e) => { if (e.target.closest('#themeBtn')) { applyTheme(getTheme() === 'light' ? 'dark' : 'light', true); } });

// ================= V4: pro features (layers, groups, format painter, find, notes, minimap, pptx, shortcuts, palette) =================
Object.assign(IC, {
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  brush: '<path d="M18 3l3 3-9 9-3-3z"/><path d="M9 12c-3 0-5 2-5 5 0 1.5-1 3-2 3h5c3 0 5-2 5-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  group: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M11 7h4a2 2 0 0 1 2 2v4"/>',
  ungroup: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  notes: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6M9 7h3"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
  command: '<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>',
  slides: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  underline: '<path d="M6 4v7a6 6 0 0 0 12 0V4M5 21h14"/>',
  drag: '<circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>'
});

// ---------- fonts (40 families with Cyrillic, bundled offline) ----------
FONTS.splice(0, FONTS.length,
  'Inter', 'Manrope', 'Onest', 'Golos Text', 'Montserrat', 'Raleway', 'Roboto', 'Open Sans', 'Noto Sans', 'PT Sans', 'Fira Sans', 'Ubuntu', 'Rubik', 'Nunito', 'Jost', 'Exo 2', 'Play', 'Comfortaa',
  'Playfair Display', 'Cormorant Garamond', 'EB Garamond', 'Lora', 'Noto Serif', 'PT Serif', 'Roboto Slab', 'Alegreya', 'Prata', 'Yeseva One', 'Philosopher',
  'Unbounded', 'Oswald', 'Russo One', 'Poiret One', 'Amatic SC', 'Lobster', 'Pacifico', 'Caveat', 'Marck Script',
  'JetBrains Mono', 'Roboto Mono', 'Georgia', 'Times New Roman', 'Segoe UI', 'Arial');

// ---------- helpers ----------
const elName = (e) => e.name || (e.type === 'text' ? '«' + String(e.content || '').replace(/\s+/g, ' ').slice(0, 26) + '»' : (TYPE_NAMES[e.type] || e.type) + (e.type === 'shape' ? ' · ' + (SHAPE_NAMES[e.shape] || '') : e.type === 'icon' ? ' · ' + (ICON_NAMES[e.icon] || e.icon) : ''));
const groupIds = (el) => el.group ? slideCur().elements.filter(x => x.group === el.group).map(x => x.id) : [el.id];

// ---------- groups ----------
function groupSel() {
  const els = selected(); if (els.length < 2) return toast('Виділіть щонайменше два об’єкти (Shift+клік)');
  ck(); const g = 'g' + uid(); els.forEach(e => { e.group = g; }); changed('canvas+props'); toast(`Згруповано: ${els.length}`);
}
function ungroupSel() {
  const els = selected().filter(e => e.group); if (!els.length) return toast('У виділенні немає груп');
  ck(); els.forEach(e => { delete e.group; }); changed('canvas+props'); toast('Розгруповано');
}
function altCopy() {
  ck();
  const out = clone(selected()).map(e => ({ ...e, id: uid(), morph: uid() }));
  const gmap = {}; out.forEach(e => { if (e.group) e.group = gmap[e.group] || (gmap[e.group] = 'g' + uid()); });
  slideCur().elements.push(...out);
  sel = out.map(e => e.id);
  renderCanvas();
}

// ---------- format painter ----------
let fmtClip = null, painterArmed = false;
function copyFormat() {
  const e = selected()[0]; if (!e) return;
  fmtClip = { type: e.type, style: clone(e.style || {}), fx: clone(e.fx || {}), opacity: e.opacity, anim: clone(e.anim || {}) };
  toast('Формат скопійовано — Ctrl+Shift+V, щоб застосувати');
}
function applyFormatTo(els) {
  if (!fmtClip || !els.length) return false;
  ck();
  for (const e of els) {
    const keep = e.type === 'image' ? {} : {};
    if (e.type === fmtClip.type) e.style = { ...e.style, ...clone(fmtClip.style), ...keep };
    else if (e.type === 'text' || fmtClip.type === 'text') { const s = fmtClip.style; ['color', 'font', 'weight', 'italic', 'underline', 'upper', 'shadow', 'effect'].forEach(k => { if (s[k] !== undefined && e.type === 'text') e.style[k] = s[k]; }); }
    e.fx = clone(fmtClip.fx); if (fmtClip.opacity != null) e.opacity = fmtClip.opacity;
  }
  painterArmed = false; document.body.classList.remove('painting');
  changed('canvas+props'); toast('Формат застосовано');
  return true;
}
function pasteFormat() { if (!fmtClip) return toast('Спершу скопіюйте формат: Ctrl+Shift+C'); applyFormatTo(selected()); }
function armPainter() {
  if (!selected().length) return toast('Виділіть об’єкт-зразок, потім натисніть пензлик');
  copyFormat(); painterArmed = true; document.body.classList.add('painting');
  toast('Пензлик формату: клацніть по об’єкту, щоб застосувати. Esc — скасувати');
}

// ---------- shape format (shadow / glow / blur) ----------
function fxSec(e) {
  const fx = e.fx || {};
  const setFx = (k, v, scope = 'canvas') => setEls(x => { x.fx = { ...(x.fx || {}), [k]: v }; }, 'fx:' + k + sel.join(), scope);
  return sec('Формат фігури',
    fld('Тінь', segIn([{ v: 'none', l: 'Немає' }, { v: 'soft', l: 'М’яка' }, { v: 'hard', l: 'Чітка' }, { v: 'custom', l: 'Своя' }], fx.shadow || 'none', v => setFx('shadow', v, 'canvas+props'))),
    fx.shadow && fx.shadow !== 'none' ? [
      fld('Колір тіні', colorIn(fx.sColor || '#000000', v => setFx('sColor', v))),
      row(fld('Розмиття', rangeIn(fx.sBlur ?? 30, 0, 120, 1, v => setFx('sBlur', v))), fld('Відстань', rangeIn(fx.sDist ?? 14, 0, 80, 1, v => setFx('sDist', v)))),
      row(fld('Кут', rangeIn(fx.sAngle ?? 90, 0, 360, 5, v => setFx('sAngle', v), v => v + '°')), fld('Щільність', rangeIn(fx.sOpacity ?? .45, 0, 1, .01, v => setFx('sOpacity', v), v => Math.round(v * 100) + '%')))] : null,
    fld('Світіння', rangeIn(fx.glow || 0, 0, 80, 1, v => setFx('glow', v), v => v ? v + ' px' : 'вимк.')),
    fx.glow ? fld('Колір світіння', colorIn(fx.gColor || '#e8c27a', v => setFx('gColor', v))) : null,
    fld('Розмиття об’єкта', rangeIn(fx.blur || 0, 0, 40, .5, v => setFx('blur', v), v => v ? v + ' px' : 'вимк.')),
    row(btn('Копіювати формат', 'brush', copyFormat), btn('Пензлик', 'brush', armPainter))
  );
}

// ---------- layers («Вибір і видимість») ----------
function layersTab() {
  const els = slideCur().elements;
  const list = h('div', { class: 'llist' });
  let dragFrom = null;
  [...els].reverse().forEach((e, ri) => {
    const i = els.length - 1 - ri;
    const nameEl = h('span', { class: 'lname', title: 'Подвійний клік — перейменувати' }, elName(e));
    const rowEl = h('div', { class: 'lrow' + (sel.includes(e.id) ? ' on' : '') + (e.hidden ? ' off' : ''), draggable: 'true' },
      h('span', { class: 'lgrip' }, icon('drag')),
      h('span', { class: 'ltype' }, icon({ text: 'text', shape: 'shapes', image: 'image', line: 'line', icon: 'sparkle2', chart: 'chart' }[e.type] || 'shapes')),
      nameEl,
      e.group ? h('span', { class: 'lgrp', title: 'У групі' }, icon('group')) : null,
      h('button', { class: 'lbtn', title: e.hidden ? 'Показати' : 'Приховати', onclick: (ev) => { ev.stopPropagation(); ck(); e.hidden = !e.hidden; changed('canvas+props'); } }, icon(e.hidden ? 'eyeoff' : 'eye')),
      h('button', { class: 'lbtn' + (e.locked ? ' act' : ''), title: e.locked ? 'Розблокувати' : 'Заблокувати', onclick: (ev) => { ev.stopPropagation(); ck(); e.locked = !e.locked; if (e.locked) sel = sel.filter(x => x !== e.id); changed('canvas+props'); } }, icon(e.locked ? 'lock' : 'unlock')));
    rowEl.addEventListener('click', (ev) => {
      if (e.locked) return toast('Об’єкт заблоковано — розблокуйте замком');
      sel = ev.shiftKey || ev.ctrlKey ? (sel.includes(e.id) ? sel.filter(x => x !== e.id) : [...sel, e.id]) : [e.id];
      renderOverlay(); renderProps();
    });
    nameEl.addEventListener('dblclick', (ev) => {
      ev.stopPropagation();
      const inp = h('input', { class: 'inp lren', value: e.name || '' , placeholder: elName(e) });
      nameEl.replaceWith(inp); inp.focus(); inp.select();
      const done = () => { const v = inp.value.trim(); if (v !== (e.name || '')) { ck(); e.name = v || undefined; changed('props'); } renderProps(); };
      inp.addEventListener('keydown', (k) => { k.stopPropagation(); if (k.key === 'Enter') inp.blur(); if (k.key === 'Escape') { inp.value = e.name || ''; inp.blur(); } });
      inp.addEventListener('blur', done, { once: true });
    });
    rowEl.addEventListener('dragstart', () => { dragFrom = i; rowEl.classList.add('dragging'); });
    rowEl.addEventListener('dragend', () => rowEl.classList.remove('dragging'));
    rowEl.addEventListener('dragover', (ev) => { ev.preventDefault(); $$('.lrow', list).forEach(r => r.classList.remove('dropto')); rowEl.classList.add('dropto'); });
    rowEl.addEventListener('drop', (ev) => {
      ev.preventDefault(); if (dragFrom == null || dragFrom === i) return;
      ck(); const [m] = els.splice(dragFrom, 1); els.splice(i, 0, m); dragFrom = null; changed('canvas+props');
    });
    list.append(rowEl);
  });
  const allHidden = els.length && els.every(e => e.hidden);
  return [sec(`Вибір і видимість · ${els.length}`,
    row(btn(allHidden ? 'Показати' : 'Сховати', allHidden ? 'eye' : 'eyeoff', () => { ck(); els.forEach(e => { e.hidden = !allHidden; }); changed('canvas+props'); }),
      btn('Група', 'group', groupSel), btn('Розгруп.', 'ungroup', ungroupSel)),
    els.length ? list : h('div', { class: 'empty-sel' }, 'На слайді ще немає об’єктів'),
    h('p', { class: 'hint' }, 'Верхній рядок — передній план. Перетягуйте рядки, щоб змінити порядок шарів. Подвійний клік по назві — перейменувати.'))];
}

// ---------- animation pane ----------
function animPaneSec() {
  const s = slideCur();
  const items = s.elements.filter(e => e.anim && e.anim.type !== 'none');
  const ordered = [...items.filter(e => e.anim.trigger !== 'click').sort((a, b) => (a.anim.delay || 0) - (b.anim.delay || 0)),
    ...items.filter(e => e.anim.trigger === 'click').sort((a, b) => (a.anim.order || 0) - (b.anim.order || 0))];
  if (!ordered.length) return sec('Панель анімацій', h('div', { class: 'empty-sel' }, 'На слайді немає анімацій'));
  let from = null;
  const list = h('div', { class: 'llist' }, ordered.map((e, i) => {
    const r = h('div', { class: 'lrow' + (sel.includes(e.id) ? ' on' : ''), draggable: 'true' },
      h('span', { class: 'anum' }, e.anim.trigger === 'click' ? '🖱' : String(i + 1)),
      h('span', { class: 'lname' }, elName(e)),
      h('span', { class: 'atype' }, Aurea.ANIMS[e.anim.type] || e.anim.type),
      h('span', { class: 'atime' }, ((e.anim.delay || 0) / 1000).toFixed(1) + 'с'),
      h('button', { class: 'lbtn', title: 'Переглянути', onclick: (ev) => { ev.stopPropagation(); previewAnims([e.id]); } }, icon('play')));
    r.addEventListener('click', () => { sel = [e.id]; renderOverlay(); renderProps(); });
    r.addEventListener('dragstart', () => { from = i; });
    r.addEventListener('dragover', (ev) => { ev.preventDefault(); $$('.lrow', list).forEach(x => x.classList.remove('dropto')); r.classList.add('dropto'); });
    r.addEventListener('drop', (ev) => {
      ev.preventDefault(); if (from == null || from === i) return;
      ck(); const arr = [...ordered]; const [m] = arr.splice(from, 1); arr.splice(i, 0, m);
      let t = 0, k = 0;
      arr.forEach(x => { if (x.anim.trigger === 'click') x.anim.order = k++; else { x.anim.delay = t; t += 220; } });
      changed('canvas+props'); previewAnims();
    });
    return r;
  }));
  return sec('Панель анімацій · порядок', list,
    row(btn('Відтворити все', 'play', () => previewAnims()), btn('По черзі', 'wand', autoSequence)),
    h('p', { class: 'hint' }, 'Перетягніть рядок, щоб змінити порядок — затримки перерахуються автоматично. 🖱 — запуск за кліком.'));
}

// ---------- find & replace ----------
function findReplace(withReplace) {
  finishEdit(); $('.modal-bg')?.remove();
  const fi = h('input', { class: 'inp', placeholder: 'Знайти…', spellcheck: 'false' });
  const ri = h('input', { class: 'inp', placeholder: 'Замінити на…', spellcheck: 'false' });
  let caseS = false;
  const res = h('div', { class: 'frlist' });
  const matches = () => {
    const q = fi.value; if (!q) return [];
    const out = [];
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseS ? 'g' : 'gi');
    P.slides.forEach((s, si) => s.elements.forEach(e => { if (e.type === 'text' && re.test(e.content)) out.push({ si, e }); re.lastIndex = 0; }));
    return out;
  };
  const render = () => {
    const ms = matches();
    res.replaceChildren(...(ms.length ? ms.map(({ si, e }) => h('div', { class: 'lrow', onclick: () => { close(); gotoSlide(si); sel = [e.id]; renderOverlay(); renderProps(); } },
      h('span', { class: 'anum' }, String(si + 1)), h('span', { class: 'lname' }, String(e.content).replace(/\s+/g, ' ').slice(0, 70)))) : [h('div', { class: 'empty-sel' }, fi.value ? 'Нічого не знайдено' : 'Введіть текст для пошуку')]));
    cnt.textContent = fi.value ? `Знайдено: ${ms.length}` : '';
  };
  const replaceAll = () => {
    const q = fi.value; if (!q) return;
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseS ? 'g' : 'gi');
    let n = 0; ck();
    P.slides.forEach(s => s.elements.forEach(e => { if (e.type === 'text' && re.test(e.content)) { re.lastIndex = 0; e.content = e.content.replace(re, () => { n++; return ri.value; }); } re.lastIndex = 0; }));
    changed('all'); render(); toast(`Замінено: ${n}`);
  };
  const cnt = h('span', { class: 'hint', style: 'margin:0' });
  [fi, ri].forEach(i => i.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') close(); if (e.key === 'Enter' && i === ri) replaceAll(); }));
  fi.addEventListener('input', render);
  const close = () => m.remove();
  const m = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === m) close(); } },
    h('div', { class: 'modal glass frmodal' }, h('h2', {}, withReplace ? 'Знайти й замінити' : 'Пошук у презентації'),
      h('div', { class: 'field' }, fi), withReplace ? h('div', { class: 'field' }, ri) : null,
      h('div', { class: 'row' }, tglIn('Враховувати регістр', false, v => { caseS = v; render(); }), cnt),
      res,
      h('div', { class: 'row', style: 'margin-top:12px' }, withReplace ? h('button', { class: 'btn-primary', onclick: replaceAll }, 'Замінити все') : h('button', { class: 'btn', onclick: () => findReplace(true) }, 'Замінити…'), h('div', { class: 'spacer' }), h('button', { class: 'btn', onclick: close }, 'Закрити'))));
  document.body.append(m); render(); setTimeout(() => fi.focus(), 30);
}

// ---------- notes pane & view modes ----------
function toggleNotes(force) {
  const on = force ?? !$('#work').classList.contains('notes-on');
  $('#work').classList.toggle('notes-on', on);
  $('[data-act="notes"]')?.classList.toggle('on', on);
  renderNotesPane();
  setTimeout(fitScale, 260);
}
function renderNotesPane() {
  const pane = $('#notesPane'); if (!pane || !P) return;
  const s = slideCur();
  let ta = $('textarea', pane);
  if (!ta) {
    ta = h('textarea', { class: 'inp', placeholder: 'Нотатки доповідача для цього слайда — видно лише вам у панелі доповідача' });
    ta.addEventListener('input', () => { const sl = slideCur(); ck('notes' + sl.id); sl.notes = ta.value; dirty = true; scheduleSave(); });
    ta.addEventListener('keydown', (e) => e.stopPropagation());
    pane.replaceChildren(h('div', { class: 'nphead' }, icon('notes'), 'Нотатки доповідача'), ta);
  }
  if (document.activeElement !== ta) ta.value = s.notes || '';
}
function readingView() { startShow(cur, false, true); }

// ---------- minimap (shows when zoomed in) ----------
function updateMinimap() {
  let mm = $('#minimap');
  if (!P || zoomMode === 'fit' || canvasWrap.scrollWidth <= canvasWrap.clientWidth + 4 && canvasWrap.scrollHeight <= canvasWrap.clientHeight + 4) { mm && mm.remove(); return; }
  if (!mm) {
    mm = h('div', { id: 'minimap', class: 'glass' });
    mm.addEventListener('pointerdown', (e) => {
      const go = (ev) => { const r = mm.getBoundingClientRect(); const fx = (ev.clientX - r.left) / r.width, fy = (ev.clientY - r.top) / r.height;
        canvasWrap.scrollLeft = fx * canvasWrap.scrollWidth - canvasWrap.clientWidth / 2; canvasWrap.scrollTop = fy * canvasWrap.scrollHeight - canvasWrap.clientHeight / 2; };
      go(e); drag(go);
    });
    $('#work').append(mm);
  }
  if (mm.dataset.sid !== slideCur().id || mm.dataset.ver !== String(undoStack.length)) {
    mm.replaceChildren(Aurea.thumb(slideCur(), P, 200), h('div', { class: 'mmrect' }));
    mm.dataset.sid = slideCur().id; mm.dataset.ver = String(undoStack.length);
  }
  const r = $('.mmrect', mm);
  const sw = canvasWrap.scrollWidth, sh = canvasWrap.scrollHeight;
  r.style.left = (canvasWrap.scrollLeft / sw * 100) + '%'; r.style.top = (canvasWrap.scrollTop / sh * 100) + '%';
  r.style.width = Math.min(100, canvasWrap.clientWidth / sw * 100) + '%'; r.style.height = Math.min(100, canvasWrap.clientHeight / sh * 100) + '%';
}
canvasWrap.addEventListener('scroll', () => updateMinimap());

// ---------- text helpers ----------
function fontStep(dir, big) {
  const steps = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 110, 120, 140, 160, 180, 200, 240, 280, 320];
  const els = selected().filter(e => e.type === 'text'); if (!els.length) return;
  ck('fsize' + sel.join());
  els.forEach(e => {
    const s = e.style.size || 40;
    if (big) e.style.size = dir > 0 ? (steps.find(v => v > s) || s + 40) : ([...steps].reverse().find(v => v < s) || Math.max(6, s - 4));
    else e.style.size = Math.max(6, s + dir * 2);
  });
  changed('canvas+props');
}
function toggleTextStyle(k) {
  const els = selected().filter(e => e.type === 'text'); if (!els.length) return;
  ck();
  const v = k === 'weight' ? ((els[0].style.weight || 400) >= 600 ? 400 : 700) : !els[0].style[k];
  els.forEach(e => { e.style[k] = v; });
  changed('canvas+props');
}
function setAlign(a) { const els = selected().filter(e => e.type === 'text'); if (!els.length) return; ck(); els.forEach(e => { e.style.align = a; }); changed('canvas+props'); }
function changeCase() {
  const els = selected().filter(e => e.type === 'text'); if (!els.length) return;
  ck();
  els.forEach(e => {
    const t = String(e.content);
    e.content = t === t.toLowerCase() ? t.replace(/(^|[\s«"(—-])(\S)/g, (m, a, b) => a + b.toUpperCase()) : t === t.toUpperCase() ? t.toLowerCase() : t.toUpperCase();
  });
  changed('canvas+props');
}
async function pastePlain() {
  let txt = '';
  try { txt = await navigator.clipboard.readText(); } catch { }
  if (!txt) return toast('У буфері немає тексту');
  addText('body'); const e = selected()[0];
  if (e) { finishEdit(); e.content = txt.trim(); changed('canvas+props'); }
}
function cycleSelection(back) {
  const els = slideCur().elements.filter(e => !e.locked && !e.hidden); if (!els.length) return;
  const i = els.findIndex(e => e.id === sel[sel.length - 1]);
  const n = (i + (back ? -1 : 1) + els.length) % els.length;
  sel = [els[i < 0 ? 0 : n].id]; renderOverlay(); renderProps();
}

// ================= PPTX EXPORT / IMPORT =================
const PX2IN = 13.333 / 1920;
const hexNo = (c) => toHex6(c || '#000000').slice(1).toUpperCase();
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function canvasGrad(ctx, bg, w, h) {
  const c1 = bg.color || '#000000', c2 = bg.color2 || c1;
  if (bg.grad === 'linear') {
    const a = ((bg.angle ?? 135) - 90) * Math.PI / 180, len = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a));
    const cx = w / 2, cy = h / 2, dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
    const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy); g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
  }
  if (bg.grad === 'radial') {
    const cx = (bg.cx ?? 50) / 100 * w, cy = (bg.cy ?? 35) / 100 * h, r = Math.hypot(w, h) * .6 * 1.2 * .62;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, c2); g.addColorStop(1, c1); return g;
  }
  return c1;
}
async function slideBgImage(s) {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
  const ctx = c.getContext('2d'), bg = s.bg || {};
  ctx.fillStyle = canvasGrad(ctx, bg, 1920, 1080); ctx.fillRect(0, 0, 1920, 1080);
  if (bg.image) {
    try {
      const im = await loadImg(P.assets[bg.image] || bg.image);
      const k = Math.max(1920 / im.naturalWidth, 1080 / im.naturalHeight);
      ctx.globalAlpha = bg.imageOpacity ?? 1; if (bg.imageBlur) ctx.filter = `blur(${bg.imageBlur}px)`;
      ctx.drawImage(im, (1920 - im.naturalWidth * k) / 2, (1080 - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
      ctx.globalAlpha = 1; ctx.filter = 'none';
    } catch { }
  }
  if (bg.vignette) { const g = ctx.createRadialGradient(960, 540, 400, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
  return c.toDataURL('image/jpeg', .9);
}
const IMG_FILTERS = { sepia: 'sepia(.55) contrast(1.05) brightness(.95)', mono: 'grayscale(1) contrast(1.12)', warm: 'saturate(1.15) sepia(.22) contrast(1.04)', dim: 'brightness(.62) saturate(.9)', vivid: 'saturate(1.35) contrast(1.08)', noir: 'grayscale(1) contrast(1.45) brightness(.85)', vintage: 'sepia(.35) saturate(.8) contrast(.92) brightness(1.05) hue-rotate(-8deg)', cool: 'saturate(1.1) hue-rotate(12deg) brightness(.98) contrast(1.05)', dream: 'saturate(1.2) brightness(1.08) contrast(.9) blur(.6px)' };
async function bakeImage(e) {
  const src = P.assets[e.src] || e.src; if (!src) return null;
  const im = await loadImg(src);
  const s = e.style || {}, w = Math.round(e.w), hh = Math.round(e.h), k = Math.min(2, 2400 / Math.max(w, hh));
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(hh * k);
  const ctx = c.getContext('2d'); ctx.scale(k, k);
  const path = new Path2D();
  if (s.mask === 'circle') path.ellipse(w / 2, hh / 2, w / 2, hh / 2, 0, 0, Math.PI * 2);
  else if (s.mask === 'arch') { const r = Math.min(w / 2, hh); path.moveTo(0, hh); path.lineTo(0, r); path.arc(w / 2, r, w / 2, Math.PI, 0); path.lineTo(w, hh); path.closePath(); }
  else if (s.mask === 'rounded') path.roundRect(0, 0, w, hh, s.radius ?? 24);
  else path.rect(0, 0, w, hh);
  ctx.save(); ctx.clip(path);
  const [px, py] = String(s.pos || '50% 30%').split(' ').map(v => parseFloat(v) / 100);
  const fit = s.fit === 'contain' ? Math.min : Math.max;
  const sc = fit(w / im.naturalWidth, hh / im.naturalHeight);
  const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
  if (IMG_FILTERS[s.filter]) ctx.filter = IMG_FILTERS[s.filter];
  ctx.drawImage(im, (w - dw) * (isNaN(px) ? .5 : px), (hh - dh) * (isNaN(py) ? .5 : py), dw, dh);
  ctx.filter = 'none'; ctx.restore();
  if (s.borderWidth) { ctx.save(); ctx.clip(path); ctx.lineWidth = s.borderWidth * 2; ctx.strokeStyle = s.borderColor || '#c9a45c'; ctx.stroke(path); ctx.restore(); }
  const needAlpha = s.mask && s.mask !== 'none';
  return c.toDataURL(needAlpha ? 'image/png' : 'image/jpeg', .9);
}
async function bakeIcon(e) {
  const s = e.style || {}, w = e.w, hh = e.h, k = 2;
  const pad = (s.shape || 'none') === 'none' ? 0 : .22;
  let bgShape = '';
  if (s.shape === 'circle') bgShape = `<ellipse cx="${w / 2}" cy="${hh / 2}" rx="${w / 2}" ry="${hh / 2}" fill="${s.bg || '#ffffff'}" fill-opacity="${s.bgOpacity ?? .1}"/>`;
  else if (s.shape === 'rounded') bgShape = `<rect width="${w}" height="${hh}" rx="${Math.min(w, hh) * .26}" fill="${s.bg || '#ffffff'}" fill-opacity="${s.bgOpacity ?? .1}"/>`;
  const iw = w * (1 - 2 * pad), ih = hh * (1 - 2 * pad);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * k}" height="${hh * k}" viewBox="0 0 ${w} ${hh}">${bgShape}<svg x="${w * pad}" y="${hh * pad}" width="${iw}" height="${ih}" viewBox="0 0 24 24" overflow="visible"><path d="${Aurea.ICONS[e.icon] || Aurea.ICONS.star}" fill="${s.filled ? s.color : 'none'}" fill-opacity=".22" stroke="${s.color || '#fff'}" stroke-width="${s.strokeWidth || 1.6}" stroke-linecap="round" stroke-linejoin="round"/></svg></svg>`;
  const im = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  const c = document.createElement('canvas'); c.width = w * k; c.height = hh * k;
  c.getContext('2d').drawImage(im, 0, 0);
  return c.toDataURL('image/png');
}
const PPTX_SHAPES = { rect: 'rect', ellipse: 'ellipse', ring: 'ellipse', blob: 'ellipse', triangle: 'triangle', diamond: 'diamond', hexagon: 'hexagon', star: 'star5', arrow: 'rightArrow', arch: 'round2SameRect', frame: 'rect', glass: 'roundRect', glow: 'ellipse' };
function shadowOpt(e) {
  const fx = e.fx || {};
  if (!fx.shadow || fx.shadow === 'none') return undefined;
  return { type: 'outer', color: hexNo(fx.sColor || '#000000'), blur: (fx.shadow === 'hard' ? 0 : (fx.sBlur ?? 30)) * .5, offset: (fx.sDist ?? 14) * .5, angle: fx.sAngle ?? 90, opacity: fx.sOpacity ?? .45 };
}
async function buildPptx(opts) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = P.title || 'Презентація';
  const anims = [];
  const slides = P.slides.filter(s => !s.skip);
  for (const [si, s] of slides.entries()) {
    busy(`Створюю .pptx… слайд ${si + 1} з ${slides.length}`);
    const sl = pptx.addSlide();
    sl.background = { data: await slideBgImage(s) };
    const list = [];
    for (const [ei, e] of s.elements.entries()) {
      if (e.hidden) continue;
      const name = `aurea_${si}_${ei}`;
      const pos = { x: e.x * PX2IN, y: e.y * PX2IN, w: e.w * PX2IN, h: e.h * PX2IN, rotate: e.rot || 0, objectName: name };
      const st = e.style || {};
      const transp = e.opacity != null && e.opacity < 1 ? Math.round((1 - e.opacity) * 100) : 0;
      try {
        if (e.type === 'text') {
          const txt = st.upper ? String(e.content).toUpperCase() : String(e.content);
          sl.addText(txt, { ...pos, fontFace: st.font || 'Inter', fontSize: Math.max(4, (st.size || 40) * .5), color: hexNo(st.effect === 'outline' ? st.color : st.color), bold: (st.weight || 400) >= 600, italic: !!st.italic, underline: st.underline ? { style: 'sng' } : undefined,
            align: st.align === 'justify' ? 'justify' : (st.align || 'left'), valign: st.valign === 'middle' ? 'middle' : st.valign === 'bottom' ? 'bottom' : 'top', charSpacing: (st.ls || 0) * (st.size || 40) * .5, lineSpacingMultiple: st.lh || 1.2,
            margin: 0, isTextBox: true, fit: 'none', transparency: transp || undefined, shadow: shadowOpt(e),
            glow: (st.shadow === 'glow' || st.effect === 'neon' || (e.fx && e.fx.glow)) ? { size: Math.max(4, (e.fx && e.fx.glow) || 12) * .5, opacity: .55, color: hexNo((e.fx && e.fx.gColor) || st.color2 || st.color) } : undefined });
        } else if (e.type === 'image') {
          const data = await bakeImage(e); if (data) sl.addImage({ ...pos, data, transparency: transp || undefined, shadow: shadowOpt(e) });
        } else if (e.type === 'icon') {
          sl.addImage({ ...pos, data: await bakeIcon(e), transparency: transp || undefined });
        } else if (e.type === 'shape') {
          const shp = PPTX_SHAPES[e.shape] || 'rect';
          const noFill = !st.fill || st.fill === 'none' || e.shape === 'frame' || e.shape === 'ring';
          const fo = e.shape === 'glass' ? .08 : e.shape === 'glow' ? (st.fillOpacity ?? .8) * .5 : (st.fillOpacity ?? 1);
          const o = { ...pos, shadow: shadowOpt(e) };
          if (!noFill) o.fill = { color: hexNo(st.fill), transparency: Math.min(100, Math.round((1 - fo * (e.opacity ?? 1)) * 100)) };
          if ((st.strokeWidth || 0) > 0 || e.shape === 'glass') o.line = { color: hexNo(st.stroke || '#ffffff'), width: Math.max(.25, (st.strokeWidth || 1) * .5), transparency: Math.round((1 - (st.strokeOpacity ?? 1)) * 100), dashType: st.dash ? 'dash' : 'solid' };
          if (shp === 'roundRect' || shp === 'round2SameRect') o.rectRadius = Math.min(e.w, e.h) * PX2IN * (shp === 'round2SameRect' ? .5 : Math.min(.5, (st.radius ?? 28) / Math.min(e.w, e.h)));
          if (e.shape === 'rect' && st.radius) { sl.addShape('roundRect', { ...o, rectRadius: Math.min(st.radius, Math.min(e.w, e.h) / 2) * PX2IN }); }
          else sl.addShape(shp, o);
        } else if (e.type === 'line') {
          sl.addShape('line', { x: e.x * PX2IN, y: (e.y + e.h / 2) * PX2IN, w: e.w * PX2IN, h: 0, rotate: e.rot || 0, objectName: name,
            line: { color: hexNo(st.stroke), width: Math.max(.25, (st.strokeWidth || 2) * .5), dashType: st.dash ? 'dash' : 'solid', endArrowType: st.ends === 'arrow' ? 'triangle' : undefined, transparency: transp || undefined } });
        } else if (e.type === 'chart') {
          const data = e.data || [];
          const pal = (st.colors && st.colors.length ? st.colors : ['#e8c27a', '#9d8bff', '#6ee7f9', '#f472b6', '#4ade80', '#fb923c']);
          const cols = data.map((d, i) => hexNo(d.c || pal[i % pal.length]));
          const type = e.chart === 'donut' ? pptx.ChartType.doughnut : pptx.ChartType.bar;
          const series = e.chart === 'donut' ? [{ name: 'Дані', labels: data.map(d => d.l), values: data.map(d => +d.v || 0) }] : data.map((d, i) => ({ name: d.l, labels: [''], values: [+d.v || 0] }));
          sl.addChart(type, series, { ...pos, barDir: e.chart === 'hbar' ? 'bar' : 'col', chartColors: cols, showValue: true, dataLabelColor: hexNo(st.color || '#ffffff'), dataLabelFontSize: (st.size || 26) * .5,
            showLegend: e.chart === 'donut' || data.length > 1, legendPos: 'b', legendColor: hexNo(st.color || '#ffffff'), legendFontFace: st.font || 'Inter', legendFontSize: (st.size || 26) * .45,
            catAxisHidden: true, valAxisHidden: true, valGridLine: { style: 'none' }, holeSize: 62, barGapWidthPct: 40, dataLabelFormatCode: (st.prefix ? `"${st.prefix}"` : '') + '#,##0.#' + (st.suffix ? `"${st.suffix}"` : '') });
        }
        if (e.anim && e.anim.type && e.anim.type !== 'none' && opts.anims) list.push({ name, e });
      } catch (err) { console.warn('pptx element', err); }
    }
    if (s.notes) sl.addNotes(s.notes);
    anims.push({ s, list });
  }
  busy('Пакую файл…');
  let buf = await pptx.write({ outputType: 'arraybuffer' });
  buf = await patchPptxXml(buf, anims, opts);
  return buf;
}
const PPTX_TRANS = { fade: '<p:fade/>', morph: '<p:fade/>', slide: '<p:push dir="l"/>', push: '<p:push dir="u"/>', zoom: '<p:zoom/>', blur: '<p:fade thruBlk="1"/>', dip: '<p:fade thruBlk="1"/>', circle: '<p:circle/>', curtain: '<p:split orient="vert" dir="out"/>', doors: '<p:split orient="vert" dir="out"/>', flip: '<p:cover dir="l"/>', swirl: '<p:zoom/>' };
function timingXml(list) {
  if (!list.length) return '';
  let id = 3;
  const eff = (spid, delay, dur, nodeType) => {
    const a = id++, b = id++, c = id++;
    return `<p:par><p:cTn id="${a}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="${nodeType}"><p:stCondLst><p:cond delay="${Math.round(delay)}"/></p:stCondLst><p:childTnLst>`
      + `<p:set><p:cBhvr><p:cTn id="${b}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`
      + `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${c}" dur="${Math.round(dur)}"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`;
  };
  const group = (items, auto) => {
    const o = id++, inner = id++;
    const effs = items.map((it, i) => eff(it.spid, auto ? (it.e.anim.delay || 0) : 0, Math.min(2000, Math.max(300, it.e.anim.dur || 700)), i === 0 ? (auto ? 'afterEffect' : 'clickEffect') : 'withEffect')).join('');
    return `<p:par><p:cTn id="${o}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/>${auto ? '<p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>' : ''}</p:stCondLst><p:childTnLst><p:par><p:cTn id="${inner}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effs}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
  };
  const autos = list.filter(x => x.e.anim.trigger !== 'click');
  const clicks = list.filter(x => x.e.anim.trigger === 'click').sort((a, b) => (a.e.anim.order || 0) - (b.e.anim.order || 0));
  const body = (autos.length ? group(autos, true) : '') + clicks.map(c => group([c], false)).join('');
  const bld = list.map(x => `<p:bldP spid="${x.spid}" grpId="0" animBg="1"/>`).join('');
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${body}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst><p:bldLst>${bld}</p:bldLst></p:timing>`;
}
async function patchPptxXml(buf, anims, opts) {
  const zip = await JSZip.loadAsync(buf);
  for (const [i, { s, list }] of anims.entries()) {
    const f = `ppt/slides/slide${i + 1}.xml`;
    let xml = await zip.file(f)?.async('string'); if (!xml) continue;
    let extra = '';
    if (opts.transitions && i > 0 && s.transition && s.transition !== 'none') extra += `<p:transition spd="med"${s.auto > 0 ? ` advTm="${s.auto * 1000}"` : ''}>${PPTX_TRANS[s.transition] || '<p:fade/>'}</p:transition>`;
    else if (s.auto > 0) extra += `<p:transition advTm="${s.auto * 1000}"/>`;
    if (opts.anims && list.length) {
      const withIds = list.map(x => { const m = xml.match(new RegExp(`<p:cNvPr id="(\\d+)" name="${x.name}"`)); return m ? { ...x, spid: m[1] } : null; }).filter(Boolean);
      extra += timingXml(withIds);
    }
    if (extra) { xml = xml.replace('</p:sld>', extra + '</p:sld>'); zip.file(f, xml); }
  }
  return zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });
}
const ab2b64 = (buf) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
function exportPptxDialog() {
  finishEdit();
  const o = { transitions: true, anims: true };
  const close = () => m.remove();
  const m = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === m) close(); } },
    h('div', { class: 'modal glass', style: 'width:min(620px,92vw)' },
      h('h2', {}, 'Експорт у формат .pptx'),
      h('p', { class: 'hint', style: 'font-size:13px;margin:-6px 0 14px' }, 'Файл .pptx можна відкрити в інших редакторах презентацій. Ось що переноситься:'),
      h('div', { class: 'pplist' },
        h('div', {}, h('b', { class: 'ok' }, '✓'), 'Текст, шрифти, кольори, розміри й розташування'),
        h('div', {}, h('b', { class: 'ok' }, '✓'), 'Фігури, лінії, тіні, картинки (з масками й фільтрами), іконки'),
        h('div', {}, h('b', { class: 'ok' }, '✓'), 'Діаграми — як справжні редаговані діаграми'),
        h('div', {}, h('b', { class: 'ok' }, '✓'), 'Тло слайдів (колір, градієнт, фото) і нотатки доповідача'),
        h('div', {}, h('b', { class: 'part' }, '≈'), 'Переходи — найближчі стандартні (fade, push, zoom, circle…). Morph стає fade'),
        h('div', {}, h('b', { class: 'part' }, '≈'), 'Анімації появи — стають простим затуханням з тими ж затримками й кліками'),
        h('div', {}, h('b', { class: 'no' }, '✕'), 'Не переносяться: morph, лічильники, shine, друкарська машинка, ріст діаграм, живі фони, конфеті, градієнт тексту'),
        h('div', {}, h('b', { class: 'part' }, '!'), 'Шрифти мають бути встановлені на комп’ютері, де відкривають файл')),
      tglIn('Переносити переходи між слайдами', true, v => { o.transitions = v; }),
      tglIn('Переносити анімації як просте затухання', true, v => { o.anims = v; }),
      h('p', { class: 'hint' }, 'Якщо інша програма скаже, що файл треба «відновити», — експортуйте ще раз без анімацій.'),
      h('div', { class: 'row', style: 'margin-top:14px' }, h('div', { class: 'spacer' }), h('button', { class: 'btn', onclick: close }, 'Скасувати'),
        h('button', { class: 'btn-primary', onclick: async () => { close(); await exportPptx(o); } }, icon('export'), 'Експортувати .pptx'))));
  document.body.append(m);
}
async function exportPptx(o = { transitions: true, anims: true }) {
  try {
    const buf = await buildPptx(o);
    busy(false);
    const p = await api.savePptx({ b64: ab2b64(buf), name: P.title });
    if (p) toast('Файл .pptx збережено.', { label: 'Показати файл', fn: () => api.showItem(p) });
    return buf;
  } catch (e) { busy(false); toast('Помилка експорту .pptx: ' + e.message); console.error(e); }
}

// ---- import .pptx (text, pictures, basic shapes, solid backgrounds, notes) ----
const EMU = 914400;
async function importPptx(arrayBuf, fileName) {
  busy('Імпортую .pptx…');
  try {
    const zip = await JSZip.loadAsync(arrayBuf);
    const parse = (s) => new DOMParser().parseFromString(s, 'application/xml');
    const pres = parse(await zip.file('ppt/presentation.xml').async('string'));
    const sz = pres.getElementsByTagName('p:sldSz')[0];
    const sw = +(sz?.getAttribute('cx') || 12192000), sh = +(sz?.getAttribute('cy') || 6858000);
    const k = 1920 / sw;
    const ptToPx = 1920 / (sw / 12700);
    const presRels = parse(await zip.file('ppt/_rels/presentation.xml.rels').async('string'));
    const relMap = {}; for (const r of presRels.getElementsByTagName('Relationship')) relMap[r.getAttribute('Id')] = r.getAttribute('Target');
    const ids = [...pres.getElementsByTagName('p:sldId')].map(x => x.getAttribute('r:id'));
    const proj = { format: 'aurea', version: 1, title: (fileName || 'Імпорт').replace(/\.pptx$/i, ''), theme: { name: 'blank', colors: ['#ffffff', '#16130f', '#6d5cf5', '#e8c27a'] }, slides: [], assets: {} };
    const color = (node) => { const c = node && node.getElementsByTagName('a:srgbClr')[0]; return c ? '#' + c.getAttribute('val') : null; };
    const rp = (t) => t.startsWith('/') ? t.slice(1) : 'ppt/' + t.replace(/^\.\.\//, '');
    const alpha = (node) => { const c = node && node.getElementsByTagName('a:srgbClr')[0]; const a = c && c.getElementsByTagName('a:alpha')[0]; return a ? +a.getAttribute('val') / 100000 : 1; };
    const xfrm = (node) => { const off = node.getElementsByTagName('a:off')[0], ext = node.getElementsByTagName('a:ext')[0], xf = node.getElementsByTagName('a:xfrm')[0];
      return off && ext ? { x: Math.round(+off.getAttribute('x') * k), y: Math.round(+off.getAttribute('y') * k), w: Math.max(4, Math.round(+ext.getAttribute('cx') * k)), h: Math.max(4, Math.round(+ext.getAttribute('cy') * k)), rot: xf && xf.getAttribute('rot') ? +xf.getAttribute('rot') / 60000 : 0 } : null; };
    for (const [si, rid] of ids.entries()) {
      busy(`Імпортую .pptx… слайд ${si + 1} з ${ids.length}`);
      const path = 'ppt/' + relMap[rid].replace(/^\/?ppt\//, '');
      const doc = parse(await zip.file(path).async('string'));
      const relsPath = path.replace(/slides\/(slide\d+\.xml)$/, 'slides/_rels/$1.rels');
      const rels = {}; if (zip.file(relsPath)) for (const r of parse(await zip.file(relsPath).async('string')).getElementsByTagName('Relationship')) rels[r.getAttribute('Id')] = r.getAttribute('Target');
      const slide = { id: uid(), bg: { color: '#ffffff' }, transition: 'fade', notes: '', elements: [] };
      const bgPr = doc.getElementsByTagName('p:bgPr')[0];
      if (bgPr) {
        const c = color(bgPr); if (c) slide.bg.color = c;
        const blip = bgPr.getElementsByTagName('a:blip')[0];
        if (blip) { const t = rels[blip.getAttribute('r:embed')]; const f = t && zip.file(rp(t)); if (f) { const id = 'img_' + uid(); proj.assets[id] = 'data:image/' + (t.split('.').pop().replace('jpg', 'jpeg')) + ';base64,' + await f.async('base64'); slide.bg.image = id; } }
      }
      const tree = doc.getElementsByTagName('p:spTree')[0];
      for (const node of tree ? [...tree.children] : []) {
        const tag = node.tagName;
        const g = xfrm(node); if (!g) continue;
        const base = { id: uid(), morph: uid(), ...g, opacity: 1, anim: { type: 'none', trigger: 'auto', delay: 0, dur: 900, loop: true, order: 0 } };
        if (tag === 'p:pic') {
          const blip = node.getElementsByTagName('a:blip')[0]; const t = blip && rels[blip.getAttribute('r:embed')];
          const f = t && zip.file(rp(t));
          if (f) { const ext = t.split('.').pop().toLowerCase(); if (!/png|jpe?g|gif|webp|bmp|svg/.test(ext)) continue; const id = 'img_' + uid(); proj.assets[id] = `data:image/${ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext};base64,` + await f.async('base64');
            slide.elements.push({ ...base, type: 'image', src: id, style: { fit: 'cover', pos: '50% 50%', mask: 'none', radius: 0, borderWidth: 0, filter: 'none' } }); }
        } else if (tag === 'p:graphicFrame') {
          const ch = node.getElementsByTagName('c:chart')[0]; const t = ch && rels[ch.getAttribute('r:id')];
          const cf = t && zip.file(rp(t));
          if (!cf) continue;
          const cd = parse(await cf.async('string'));
          const kind = cd.getElementsByTagName('c:doughnutChart')[0] || cd.getElementsByTagName('c:pieChart')[0] ? 'donut' : (cd.getElementsByTagName('c:barDir')[0]?.getAttribute('val') === 'bar' ? 'hbar' : 'bar');
          const sers = [...cd.getElementsByTagName('c:ser')];
          const vals = (n) => [...(n?.getElementsByTagName('c:pt') || [])].map(pt => pt.getElementsByTagName('c:v')[0]?.textContent);
          let data = [];
          if (sers.length === 1) { const s0 = sers[0]; const cats = vals(s0.getElementsByTagName('c:cat')[0]), vs = vals(s0.getElementsByTagName('c:val')[0]); data = vs.map((v, i) => ({ l: cats[i] || String(i + 1), v: +v || 0 })); }
          else data = sers.map(se => ({ l: se.getElementsByTagName('c:tx')[0]?.getElementsByTagName('c:v')[0]?.textContent || '', v: +(vals(se.getElementsByTagName('c:val')[0])[0] || 0), c: color(se.getElementsByTagName('c:spPr')[0]) || undefined }));
          if (data.length) slide.elements.push({ ...base, type: 'chart', chart: kind, data, style: { font: 'Inter', size: 26, color: '#ffffff', suffix: '', colors: [], radius: 14, gap: 4 } });
        } else if (tag === 'p:sp') {
          const spPr = node.getElementsByTagName('p:spPr')[0];
          const geom = spPr?.getElementsByTagName('a:prstGeom')[0]?.getAttribute('prst') || 'rect';
          const fillEl = spPr && [...spPr.children].find(c => c.tagName === 'a:solidFill');
          const lnEl = spPr?.getElementsByTagName('a:ln')[0];
          const fill = fillEl ? color(fillEl) : null, line = lnEl && !lnEl.getElementsByTagName('a:noFill')[0] ? color(lnEl) : null;
          const paras = [...node.getElementsByTagName('a:p')];
          const text = paras.map(p => [...p.getElementsByTagName('a:t')].map(t => t.textContent).join('')).join('\n').trim();
          if (fill || line) {
            const shape = { ellipse: 'ellipse', triangle: 'triangle', diamond: 'diamond', hexagon: 'hexagon', star5: 'star', rightArrow: 'arrow', roundRect: 'rect' }[geom] || 'rect';
            slide.elements.push({ ...base, id: uid(), type: 'shape', shape, style: { fill: fill || 'none', fillOpacity: fillEl ? alpha(fillEl) : 1, stroke: line || '#000000', strokeWidth: line ? Math.max(1, (+(lnEl.getAttribute('w') || 12700)) / 12700 * ptToPx / 1.33) : 0, radius: geom === 'roundRect' ? Math.min(g.w, g.h) * .15 : 0 } });
          }
          if (text) {
            const rPr = node.getElementsByTagName('a:rPr')[0] || node.getElementsByTagName('a:endParaRPr')[0];
            const sz = rPr && rPr.getAttribute('sz') ? +rPr.getAttribute('sz') / 100 : 18;
            const latin = rPr?.getElementsByTagName('a:latin')[0]?.getAttribute('typeface');
            const algn = paras[0]?.getElementsByTagName('a:pPr')[0]?.getAttribute('algn');
            const bodyPr = node.getElementsByTagName('a:bodyPr')[0];
            slide.elements.push({ ...base, id: uid(), type: 'text', content: text, style: { font: latin && !latin.startsWith('+') ? latin : 'Inter', size: Math.round(sz * ptToPx * .75 * 1.333), weight: rPr?.getAttribute('b') === '1' ? 700 : 400, italic: rPr?.getAttribute('i') === '1', underline: rPr?.getAttribute('u') && rPr.getAttribute('u') !== 'none',
              color: color(rPr) || '#16130f', align: { ctr: 'center', r: 'right', just: 'justify' }[algn] || 'left', valign: { ctr: 'middle', b: 'bottom' }[bodyPr?.getAttribute('anchor')] || 'top', lh: 1.2, ls: 0, upper: false, shadow: 'none' } });
          }
        }
      }
      // notes
      const notesRel = Object.values(rels).find(t => /notesSlide/.test(t));
      const nf = notesRel && zip.file(rp(notesRel));
      if (nf) { const nd = parse(await nf.async('string')); slide.notes = [...nd.getElementsByTagName('p:sp')].filter(sp => /body/.test(sp.getElementsByTagName('p:ph')[0]?.getAttribute('type') || '')).map(sp => [...sp.getElementsByTagName('a:t')].map(t => t.textContent).join(' ')).join('\n').trim(); }
      proj.slides.push(slide);
    }
    if (!proj.slides.length) throw new Error('у файлі немає слайдів');
    busy(false);
    loadProject(proj, null);
    toast(`Імпортовано слайдів: ${proj.slides.length}. Анімації з .pptx не переносяться.`);
  } catch (e) { busy(false); toast('Не вдалося імпортувати .pptx: ' + e.message); console.error(e); }
}
async function openPptxFile() { const r = await api.openPptx?.(); if (r) { const bin = Uint8Array.from(atob(r.b64), c => c.charCodeAt(0)); await importPptx(bin.buffer, r.name); } }
document.addEventListener('drop', async (e) => {
  const f = [...(e.dataTransfer?.files || [])].find(x => /\.pptx$/i.test(x.name));
  if (!f) return;
  e.preventDefault(); e.stopPropagation();
  importPptx(await f.arrayBuffer(), f.name);
}, true);

// ================= COMMAND PALETTE & SHORTCUTS =================
const COMMANDS = () => [
  ['Новий слайд', 'Ctrl+M', () => newSlide('title')], ['Дублювати слайд', 'Ctrl+Shift+D', dupSlide], ['Нова презентація', 'Ctrl+N', () => createFromTemplate(TPL.list.find(t => t.id === 'blank'))],
  ['Зберегти', 'Ctrl+S', () => save()], ['Зберегти як…', 'Ctrl+Shift+S', () => save(true)], ['Відкрити проєкт…', 'Ctrl+O', openFile], ['Імпорт .pptx…', '', openPptxFile],
  ['Експорт у формат .pptx…', 'Ctrl+Shift+E', exportPptxDialog], ['Експорт у PDF', 'Ctrl+P', exportPdf], ['Експорт у HTML', '', exportHtml],
  ['Показ з початку', 'F5', () => startShow(0)], ['Показ з поточного слайда', 'Shift+F5', () => startShow(cur)], ['Панель доповідача', 'Alt+F5', () => startPresenterMode()], ['Режим читання', '', readingView],
  ['Текст', 'T', () => addText('body')], ['Заголовок', '', () => addText('title')], ['Прямокутник', 'R', () => addShape('rect')], ['Еліпс', 'O', () => addShape('ellipse')], ['Лінія', 'L', addLine], ['Зображення з комп’ютера', 'I', () => pickImage()],
  ['Пошук фото з вільною ліцензією', 'Shift+I', () => imageSearch()], ['Іконка', '', () => iconMenu($('[data-act="menu-icon"]'))], ['Діаграма-стовпці', '', () => addChart('bar')], ['Кільцева діаграма', '', () => addChart('donut')],
  ['Копіювати', 'Ctrl+C', copySel], ['Вирізати', 'Ctrl+X', cutSel], ['Вставити', 'Ctrl+V', paste], ['Вставити як простий текст', 'Ctrl+Alt+V', pastePlain], ['Дублювати', 'Ctrl+D', duplicateSel], ['Видалити', 'Delete', deleteSel],
  ['Скасувати', 'Ctrl+Z', undo], ['Повторити', 'Ctrl+Y', redo], ['Виділити все', 'Ctrl+A', () => { sel = slideCur().elements.filter(x => !x.locked && !x.hidden).map(x => x.id); renderOverlay(); renderProps(); }],
  ['Групувати', 'Ctrl+G', groupSel], ['Розгрупувати', 'Ctrl+Shift+G', ungroupSel], ['На передній план', 'Ctrl+Shift+]', () => layer('top')], ['На задній план', 'Ctrl+Shift+[', () => layer('bottom')],
  ['Вище на шар', 'Ctrl+Alt+]', () => layer('up')], ['Нижче на шар', 'Ctrl+Alt+[', () => layer('down')],
  ['Копіювати формат', 'Ctrl+Shift+C', copyFormat], ['Вставити формат', 'Ctrl+Shift+V', pasteFormat], ['Пензлик формату', '', armPainter],
  ['Жирний', 'Ctrl+B', () => toggleTextStyle('weight')], ['Курсив', 'Ctrl+I', () => toggleTextStyle('italic')], ['Підкреслений', 'Ctrl+U', () => toggleTextStyle('underline')],
  ['Збільшити шрифт', 'Ctrl+Shift+>', () => fontStep(1, true)], ['Зменшити шрифт', 'Ctrl+Shift+<', () => fontStep(-1, true)], ['Шрифт +1', 'Ctrl+]', () => fontStep(1)], ['Шрифт −1', 'Ctrl+[', () => fontStep(-1)],
  ['Вирівняти текст ліворуч', 'Ctrl+L', () => setAlign('left')], ['Текст по центру', 'Ctrl+E', () => setAlign('center')], ['Вирівняти текст праворуч', 'Ctrl+R', () => setAlign('right')], ['Текст по ширині', 'Ctrl+J', () => setAlign('justify')],
  ['Змінити регістр', 'Shift+F3', changeCase], ['Редагувати текст', 'F2', () => { const e = selected()[0]; if (e && e.type === 'text') startEdit(e.id); }],
  ['Вирівняти ліворуч', '', () => align('l')], ['Вирівняти по центру', '', () => align('c')], ['Вирівняти праворуч', '', () => align('r')], ['Вирівняти вгору', '', () => align('t')], ['Вирівняти посередині', '', () => align('m')], ['Вирівняти донизу', '', () => align('b')],
  ['Розподілити по горизонталі', '', () => distribute('h')], ['Розподілити по вертикалі', '', () => distribute('v')],
  ['Знайти', 'Ctrl+F', () => findReplace(false)], ['Знайти й замінити', 'Ctrl+H', () => findReplace(true)],
  ['Шари (вибір і видимість)', 'Alt+F10', () => { tab = 'layers'; renderProps(); }], ['Панель анімацій', '', () => { if (sel.length) { tab = 'anim'; renderProps(); } else toast('Виділіть об’єкт'); }],
  ['Нотатки доповідача', 'Ctrl+Shift+N', () => toggleNotes()], ['Огляд слайдів (сортувальник)', 'G', () => toggleOverview()], ['Сітка', 'Shift+F9', () => ACTIONS.gridlines($('#gridBtn'))], ['Прилипання та напрямні', 'Alt+F9', () => ACTIONS.snap($('#snapBtn'))],
  ['Масштаб: вмістити', 'Ctrl+0', () => ACTIONS.zoomfit()], ['Збільшити', 'Ctrl+=', () => ACTIONS.zoomin()], ['Зменшити', 'Ctrl+-', () => ACTIONS.zoomout()],
  ['Переглянути анімації слайда', 'Ctrl+Shift+Enter', () => previewAnims()], ['Світла / темна тема', 'Ctrl+Shift+T', () => applyTheme(getTheme() === 'light' ? 'dark' : 'light', true)],
  ['Наступний об’єкт', 'Tab', () => cycleSelection(false)], ['Попередній об’єкт', 'Shift+Tab', () => cycleSelection(true)],
  ['Гарячі клавіші', 'Ctrl+/', () => showKeys()], ['Головний екран', '', goHome]
];
function commandPalette() {
  if (!P || $('#editor').classList.contains('hidden')) return;
  finishEdit(); $('.modal-bg')?.remove(); closeMenu();
  const cmds = COMMANDS();
  const inp = h('input', { class: 'inp cpinp', placeholder: 'Що зробити? Наприклад: експорт, групувати, жирний…', spellcheck: 'false' });
  const list = h('div', { class: 'cplist' });
  let idx = 0, shown = cmds;
  const close = () => m.remove();
  const run = (c) => { close(); setTimeout(() => c[2](), 10); };
  const render = () => {
    const q = inp.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    shown = cmds.filter(c => q.every(w => (c[0] + ' ' + c[1]).toLowerCase().includes(w)));
    idx = Math.min(idx, Math.max(0, shown.length - 1));
    list.replaceChildren(...shown.slice(0, 60).map((c, i) => h('div', { class: 'cprow' + (i === idx ? ' on' : ''), onclick: () => run(c), onmousemove: () => { if (idx !== i) { idx = i; render(); } } }, h('span', {}, c[0]), c[1] ? h('kbd', {}, c[1]) : null)));
    list.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
  };
  inp.addEventListener('input', () => { idx = 0; render(); });
  inp.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(shown.length - 1, idx + 1); render(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(0, idx - 1); render(); }
    if (e.key === 'Enter' && shown[idx]) run(shown[idx]);
    if (e.key === 'Escape') close();
  });
  const m = h('div', { class: 'modal-bg cpbg', onclick: (e) => { if (e.target === m) close(); } },
    h('div', { class: 'modal glass cpmodal' }, h('div', { class: 'cphead' }, icon('command'), inp), list, h('div', { class: 'cpfoot' }, '↑↓ — вибір · Enter — виконати · Esc — закрити')));
  document.body.append(m); render(); setTimeout(() => inp.focus(), 20);
}
function showKeysV4() {
  $('.modal-bg')?.remove();
  const groups = [
    ['Файл і показ', ['Ctrl+N', 'Ctrl+O', 'Ctrl+S', 'Ctrl+Shift+S', 'Ctrl+P', 'Ctrl+Shift+E', 'F5', 'Shift+F5', 'Alt+F5']],
    ['Редагування', ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+C', 'Ctrl+X', 'Ctrl+V', 'Ctrl+Alt+V', 'Ctrl+D', 'Delete', 'Ctrl+A', 'Tab', 'Shift+Tab', 'Esc', 'F2']],
    ['Об’єкти', ['Ctrl+G', 'Ctrl+Shift+G', 'Ctrl+Shift+]', 'Ctrl+Shift+[', 'Ctrl+Alt+]', 'Ctrl+Alt+[', 'Ctrl+Shift+C', 'Ctrl+Shift+V']],
    ['Текст', ['Ctrl+B', 'Ctrl+I', 'Ctrl+U', 'Ctrl+]', 'Ctrl+[', 'Ctrl+Shift+>', 'Ctrl+Shift+<', 'Ctrl+L', 'Ctrl+E', 'Ctrl+R', 'Ctrl+J', 'Shift+F3']],
    ['Вигляд і пошук', ['Ctrl+K', 'Ctrl+F', 'Ctrl+H', 'Ctrl+0', 'Ctrl+=', 'Ctrl+-', 'G', 'Ctrl+Shift+N', 'Alt+F10', 'Shift+F9', 'Ctrl+Shift+T', 'Ctrl+/']],
    ['Створення', ['Ctrl+M', 'Ctrl+Shift+D', 'T', 'R', 'O', 'L', 'I', 'Shift+I']]
  ];
  const all = COMMANDS(); const byKey = {}; all.forEach(c => { if (c[1]) byKey[c[1]] = c[0]; });
  const extra = [['Зсув на 1 / 10 px', '← → ↑ ↓ / Shift'], ['Копія перетягуванням', 'Alt + тягнути'], ['Без прилипання', 'Ctrl + тягнути'], ['Пропорційно', 'Shift + тягнути'], ['Масштаб', 'Ctrl + коліщатко'], ['У показі: лазер / перо / стерти', 'L / D / E'], ['У показі: чорний екран', 'B']];
  const m = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === m) m.remove(); } },
    h('div', { class: 'modal glass', style: 'width:min(980px,94vw)' }, h('h2', {}, 'Гарячі клавіші'),
      h('p', { class: 'hint', style: 'margin:-8px 0 14px' }, 'Ctrl+K — палітра команд: просто почніть писати, що зробити.'),
      h('div', { class: 'kgrid' }, groups.map(([g, keys]) => h('div', { class: 'kcol' }, h('div', { class: 'agroup' }, g), keys.map(k => h('div', { class: 'krow' }, h('span', {}, byKey[k] || k), h('kbd', {}, k))))),
        h('div', { class: 'kcol' }, h('div', { class: 'agroup' }, 'Миша та показ'), extra.map(([a, b]) => h('div', { class: 'krow' }, h('span', {}, a), h('kbd', {}, b)))))));
  document.body.append(m);
}
showKeys = showKeysV4;

addEventListener('keydown', (e) => {
  if (document.body.classList.contains('audience') || showPlayer) return;
  const ctrl = e.ctrlKey || e.metaKey, code = e.code, k = e.key;
  const inEditor = P && !$('#editor').classList.contains('hidden');
  const typing = isTyping(e);
  let fn = null;
  if (ctrl && code === 'KeyK') fn = commandPalette;
  else if (ctrl && (code === 'Slash' || k === '/')) fn = showKeysV4;
  else if (!inEditor) return;
  else if (typing) return;
  else if (ctrl && !e.shiftKey && !e.altKey && code === 'KeyG') fn = groupSel;
  else if (ctrl && e.shiftKey && code === 'KeyG') fn = ungroupSel;
  else if (ctrl && e.shiftKey && code === 'KeyC') fn = copyFormat;
  else if (ctrl && e.shiftKey && code === 'KeyV') fn = pasteFormat;
  else if (ctrl && e.altKey && code === 'KeyV') fn = pastePlain;
  else if (ctrl && !e.shiftKey && code === 'KeyB') fn = () => toggleTextStyle('weight');
  else if (ctrl && !e.shiftKey && code === 'KeyI') fn = () => toggleTextStyle('italic');
  else if (ctrl && !e.shiftKey && code === 'KeyU') fn = () => toggleTextStyle('underline');
  else if (ctrl && e.shiftKey && code === 'BracketRight') fn = () => layer('top');
  else if (ctrl && e.shiftKey && code === 'BracketLeft') fn = () => layer('bottom');
  else if (ctrl && e.altKey && code === 'BracketRight') fn = () => layer('up');
  else if (ctrl && e.altKey && code === 'BracketLeft') fn = () => layer('down');
  else if (ctrl && code === 'BracketRight') fn = () => fontStep(1);
  else if (ctrl && code === 'BracketLeft') fn = () => fontStep(-1);
  else if (ctrl && e.shiftKey && (code === 'Period' || k === '>')) fn = () => fontStep(1, true);
  else if (ctrl && e.shiftKey && (code === 'Comma' || k === '<')) fn = () => fontStep(-1, true);
  else if (ctrl && !e.shiftKey && code === 'KeyL') fn = () => setAlign('left');
  else if (ctrl && !e.shiftKey && code === 'KeyE') fn = () => setAlign('center');
  else if (ctrl && !e.shiftKey && code === 'KeyR') fn = () => setAlign('right');
  else if (ctrl && !e.shiftKey && code === 'KeyJ') fn = () => setAlign('justify');
  else if (ctrl && e.shiftKey && code === 'KeyE') fn = exportPptxDialog;
  else if (ctrl && !e.shiftKey && code === 'KeyF') fn = () => findReplace(false);
  else if (ctrl && !e.shiftKey && code === 'KeyH') fn = () => findReplace(true);
  else if (ctrl && !e.shiftKey && code === 'KeyN') fn = () => createFromTemplate(TPL.list.find(t => t.id === 'blank'));
  else if (ctrl && !e.shiftKey && code === 'KeyP') fn = exportPdf;
  else if (ctrl && e.shiftKey && code === 'KeyN') fn = () => toggleNotes();
  else if (ctrl && e.shiftKey && code === 'KeyT') fn = () => applyTheme(getTheme() === 'light' ? 'dark' : 'light', true);
  else if (ctrl && e.shiftKey && k === 'Enter') fn = () => previewAnims();
  else if (ctrl && (code === 'Digit0' || code === 'Numpad0')) fn = () => ACTIONS.zoomfit();
  else if (ctrl && (code === 'Equal' || code === 'NumpadAdd')) fn = () => ACTIONS.zoomin();
  else if (ctrl && (code === 'Minus' || code === 'NumpadSubtract')) fn = () => ACTIONS.zoomout();
  else if (k === 'Tab' && !ctrl) fn = () => cycleSelection(e.shiftKey);
  else if (k === 'F2') fn = () => { const el = selected()[0]; if (el && el.type === 'text') startEdit(el.id); };
  else if (k === 'F3' && e.shiftKey) fn = changeCase;
  else if (k === 'F10' && e.altKey) fn = () => { tab = 'layers'; renderProps(); };
  else if (k === 'F9' && e.shiftKey) fn = () => ACTIONS.gridlines($('#gridBtn'));
  else if (k === 'F9' && e.altKey) fn = () => ACTIONS.snap($('#snapBtn'));
  else if (k === 'Escape' && painterArmed) fn = () => { painterArmed = false; document.body.classList.remove('painting'); toast('Пензлик вимкнено'); };
  if (!fn) return;
  e.preventDefault(); e.stopImmediatePropagation();
  fn();
}, true);

Object.assign(ACTIONS, {
  notes: () => toggleNotes(), reading: () => readingView(), palette: () => commandPalette(), painter: () => armPainter(), layers: () => { tab = 'layers'; renderProps(); }
});


// ================= HTML VIEWER (UI) =================
let viewerOpen = false, viewerPrev = 'start', viewerPathCur = '';
function applyViewerState(st) {
  const was = viewerOpen;
  viewerOpen = !!st.open;
  if (viewerOpen && !was) {
    finishEdit?.(); closeMenu();
    viewerPrev = $('#editor').classList.contains('hidden') ? 'start' : 'editor';
    $('#start').classList.add('hidden'); $('#editor').classList.add('hidden');
    ['#docTitle', '#tools', '#rightTools', '#saveChip'].forEach(s => $(s).classList.add('hidden'));
  }
  $('#viewerTools').classList.toggle('hidden', !viewerOpen);
  $('#viewerRight').classList.toggle('hidden', !viewerOpen);
  $('#viewerFrame').classList.toggle('hidden', !viewerOpen);
  if (viewerOpen) {
    viewerPathCur = st.path || '';
    const name = viewerPathCur.split(/[\\/]/).pop();
    $('#viewerName').textContent = st.title ? `${st.title} · ${name}` : name;
    $('#viewerName').title = viewerPathCur;
    document.title = (st.title || name) + ' — Aurea Studio';
  } else if (was) {
    document.title = 'Aurea Studio';
    if (viewerPrev === 'editor' && P) showEditor(); else { $('#start').classList.remove('hidden'); renderStart(); }
  }
}
api.on?.('viewer-state', applyViewerState);
Object.assign(ACTIONS, {
  'viewer-close': () => api.closeHtml(),
  'viewer-full': () => api.htmlFullscreen(true),
  'viewer-reload': () => { api.htmlReload(); api.htmlFocus(); },
  'viewer-folder': () => api.showItem(viewerPathCur)
});
addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyO') { e.preventDefault(); openHtmlFile(); }
  if (viewerOpen && e.key === 'F11') { e.preventDefault(); api.htmlFullscreen(true); }
}, true);

// ================= BOOT =================
(async function boot() {
  hydrateIcons();
  setTimeout(() => $('#splash')?.remove(), 2300);
  if (location.hash === '#audience') return bootAudience();
  const af = api.argFile ? await api.argFile() : null;
  if (af && isHtml(af)) { renderStart(); return openHtmlPath(af); }
  if (af) { const r = await api.openPath(af); if (!r.error) return openData(r.data, r.path); }
  renderStart();
})();
