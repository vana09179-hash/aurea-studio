// ---- Download links (GitHub Releases) ----
const REL = 'https://github.com/vana09179-hash/aurea-studio/releases/download/v1.2.1/';
const DOWNLOADS = {
  win: { url: REL + 'AureaStudio-1.2.1-portable.exe', size: '≈ 85 МБ · портативна версія' },
  linux: { url: REL + 'AureaStudio-1.2.1-linux-x64.tar.gz', size: '≈ 118 МБ · x86-64' },
  mac: { url: REL + 'AureaStudio-1.2.1-mac-arm64.dmg', size: '≈ 108 МБ · Apple Silicon / ≈ 112 МБ · Intel' },
  macIntel: { url: REL + 'AureaStudio-1.2.1-mac-x64.dmg', size: '' }
};

// OS detection → highlight the right download
const ua = navigator.userAgent;
const os = /Mac|iPhone|iPad/.test(ua) ? 'mac' : /Linux|CrOS|X11/.test(ua) && !/Android/.test(ua) ? 'linux' : 'win';
const OS_NAME = { win: 'для Windows', mac: 'для macOS', linux: 'для Linux' };
document.querySelectorAll('[data-dl]').forEach(a => {
  const d = DOWNLOADS[a.dataset.dl];
  if (d && d.url) { a.href = d.url; a.setAttribute('download', ''); } else { a.classList.add('disabled'); a.textContent = 'Незабаром'; }
});
document.querySelectorAll('[data-size]').forEach(s => { s.textContent = DOWNLOADS[s.dataset.size]?.size || ''; });
document.querySelector(`.dl[data-os="${os}"]`)?.classList.add('mine');
const hero = document.getElementById('heroDl');
if (hero && DOWNLOADS[os].url) hero.href = DOWNLOADS[os].url;
const heroT = document.getElementById('heroDlText'); if (heroT) heroT.textContent = 'Завантажити ' + OS_NAME[os];

// scroll reveal
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
// SaaS headline: split h1/h2 into words that rise out of a blur one by one
document.querySelectorAll('.hero h1, main h2').forEach(h => {
  const walk = (node) => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) { const frag = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { frag.append(w); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.append(s); }); n.replaceWith(frag); }
    else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
  });
  walk(h); h.classList.add('words'); [...h.querySelectorAll('.w')].forEach((w, i) => w.style.setProperty('--i', i));
  if (!h.classList.contains('reveal') && !h.closest('.reveal')) h.classList.add('reveal');
});
// stagger within each group of sibling reveals
const groups = new Map();
document.querySelectorAll('.reveal').forEach(el => { const k = el.parentElement; groups.set(k, (groups.get(k) || 0) + 1); el.style.transitionDelay = ((groups.get(k) - 1) % 8) * 90 + 'ms'; });
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// hero demo: letters + typewriter loop
const title = document.getElementById('demoTitle'), type = document.getElementById('demoType');
function playDemo() {
  if (!title || !type) return;
  title.innerHTML = [...'КОСМОС'].map((c, i) => `<span style="animation-delay:${i * 70}ms">${c}</span>`).join('');
  const text = 'Подорож від Землі до зірок'; let i = 0; type.textContent = '';
  const step = () => { type.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 55 + Math.random() * 40); };
  setTimeout(step, 700);
  document.querySelectorAll('.d-bars i').forEach(b => { b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; });
}
playDemo(); setInterval(playDemo, 7000);

// animation chips: letters & counter
document.querySelectorAll('.achip').forEach(c => c.addEventListener('mouseenter', () => {
  const s = c.querySelector('span');
  if (c.dataset.a === 'letters') s.innerHTML = [...'По буквах'].map((ch, i) => `<span class="ch" style="animation-delay:${i * 45}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  if (c.dataset.a === 'count') { const n = +s.dataset.n, t0 = performance.now(); const tick = (t) => { const k = Math.min(1, (t - t0) / 1600); s.textContent = Math.round(n * (1 - Math.pow(2, -10 * k))); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
}));

// templates marquee (images rendered from the real templates)
const TPL = [['nightgallery-0','Нічна галерея',1],['redpitch-0','Червоний пітч',1],['dusk-0','Сутінки',1],['editorial-0','Редакція',1],['academy-0','Академія',1],['museum-0','Музейна класика'],['cosmos-0','Космос'],['journal-0','Бордовий журнал']];
const TPL2 = [['redpitch-2','Червоний пітч',1],['saas-0','SaaS Мінімал'],['dusk-1','Сутінки',1],['nightgallery-2','Нічна галерея',1],['aurora-0','Аврора'],['editorial-2','Редакція',1],['academy-1','Академія',1],['paper-0','Чистий аркуш']];
function fillTrack(id, list) {
  const t = document.getElementById(id); if (!t) return;
  const html = list.map(([f, n, isNew]) => `<div class="tpl"><img src="img/tpl/${f}.jpg" alt="Шаблон «${n}»" decoding="async"><span>${n}</span>${isNew ? '<span class="new">Новий</span>' : ''}</div>`).join('');
  t.innerHTML = html + html;
}
fillTrack('tplTrack', TPL); fillTrack('tplTrack2', TPL2);

// gallery
const SHOTS = ['start-light', 'editor-light', 'anim-dark', 'layers', 'search', 'show-chart', 'palette', 'pptx'];
const img = document.getElementById('galImg');
document.getElementById('galTabs').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('#galTabs button').forEach(x => x.classList.toggle('on', x === b));
  const src = `img/${SHOTS[+b.dataset.i]}.jpg`; if (img.getAttribute('src') === src) return;
  img.classList.add('swap');
  setTimeout(() => { const pre = new Image(); pre.onload = pre.onerror = () => { img.src = src; setTimeout(() => img.classList.remove('swap'), 30); }; pre.src = src; }, 220);
});

// dotted hands from Michelangelo's «Creation of Adam» (public domain): appear from the edges, twinkle, reach toward each other
(function () {
  const cv = document.getElementById('handsCanvas'); if (!cv) return;
  const COLS = 137, ROWS = 24, GAP = 70;
  const D = '121,0,4;122,0,6;123,0,7;124,0,7;125,0,7;126,0,7;127,0,7;120,1,6;121,1,7;122,1,7;123,1,7;124,1,7;125,1,7;126,1,7;127,1,7;128,1,7;118,2,7;119,2,7;120,2,7;121,2,7;122,2,7;123,2,7;124,2,7;125,2,7;126,2,7;127,2,7;128,2,6;117,3,7;118,3,7;119,3,7;120,3,7;121,3,7;122,3,7;123,3,7;124,3,7;125,3,6;126,3,6;127,3,6;128,3,5;129,3,5;117,4,7;118,4,7;119,4,7;120,4,7;121,4,7;122,4,7;123,4,6;124,4,6;125,4,6;126,4,5;127,4,5;117,5,7;118,5,7;119,5,7;120,5,6;121,5,6;122,5,6;123,5,6;124,5,5;125,5,5;126,5,4;127,5,4;105,6,6;106,6,6;107,6,6;108,6,6;110,6,5;111,6,6;112,6,7;113,6,7;114,6,7;115,6,8;116,6,8;117,6,7;118,6,7;119,6,6;120,6,6;121,6,5;122,6,5;123,6,4;124,6,4;125,6,4;104,7,8;105,7,8;106,7,7;107,7,7;108,7,7;109,7,6;110,7,6;111,7,7;112,7,7;113,7,7;114,7,7;115,7,8;116,7,7;117,7,6;118,7,6;119,7,5;120,7,5;121,7,4;122,7,4;123,7,4;126,7,4;127,7,4;51,8,6;52,8,6;53,8,6;54,8,6;55,8,6;56,8,6;101,8,7;102,8,7;103,8,7;104,8,8;105,8,7;106,8,7;107,8,6;108,8,6;109,8,6;110,8,6;111,8,6;112,8,6;113,8,7;114,8,7;115,8,6;116,8,6;117,8,5;49,9,7;50,9,8;51,9,8;52,9,7;53,9,6;54,9,6;55,9,6;56,9,6;57,9,6;58,9,6;59,9,6;60,9,6;61,9,6;62,9,6;98,9,7;99,9,7;100,9,8;101,9,8;102,9,8;103,9,7;104,9,8;105,9,7;106,9,7;107,9,7;108,9,7;110,9,7;111,9,7;112,9,7;113,9,7;114,9,6;115,9,5;116,9,4;117,9,4;46,10,7;47,10,7;48,10,7;49,10,6;50,10,7;51,10,7;52,10,6;53,10,7;54,10,7;55,10,7;56,10,7;57,10,8;58,10,7;59,10,7;60,10,7;61,10,6;62,10,6;63,10,5;93,10,8;94,10,8;95,10,7;96,10,7;97,10,7;98,10,7;99,10,7;100,10,8;101,10,7;102,10,7;103,10,7;104,10,7;105,10,7;106,10,7;107,10,7;108,10,7;109,10,7;110,10,7;111,10,7;112,10,7;113,10,7;114,10,6;115,10,4;116,10,4;44,11,7;45,11,7;46,11,7;47,11,6;48,11,6;49,11,5;50,11,4;51,11,4;52,11,4;53,11,6;54,11,8;55,11,8;56,11,7;57,11,7;58,11,8;59,11,7;60,11,6;61,11,7;62,11,7;63,11,6;64,11,5;65,11,5;89,11,7;90,11,8;91,11,8;92,11,8;93,11,8;94,11,7;95,11,7;96,11,7;97,11,7;98,11,7;99,11,7;100,11,7;101,11,7;102,11,8;103,11,7;104,11,7;105,11,8;106,11,8;107,11,8;108,11,7;109,11,7;110,11,7;111,11,7;112,11,7;113,11,6;114,11,5;115,11,4;116,11,4;42,12,6;43,12,7;44,12,7;45,12,6;46,12,6;47,12,5;48,12,4;49,12,4;50,12,4;51,12,4;52,12,4;53,12,4;54,12,7;55,12,8;56,12,8;57,12,6;58,12,6;59,12,5;60,12,5;61,12,6;62,12,7;63,12,7;64,12,6;65,12,6;66,12,5;67,12,5;86,12,8;87,12,7;88,12,7;89,12,7;90,12,6;91,12,6;92,12,6;93,12,6;94,12,6;95,12,7;96,12,7;97,12,7;98,12,7;99,12,7;100,12,8;101,12,8;102,12,8;103,12,8;104,12,8;105,12,8;106,12,8;107,12,8;108,12,7;109,12,7;110,12,6;111,12,6;112,12,6;113,12,6;114,12,4;115,12,4;116,12,4;117,12,4;35,13,7;36,13,6;37,13,7;38,13,7;39,13,7;40,13,7;41,13,7;42,13,7;43,13,7;44,13,6;45,13,6;46,13,6;47,13,4;48,13,4;49,13,4;50,13,4;51,13,4;52,13,4;54,13,6;55,13,6;56,13,7;57,13,7;58,13,7;59,13,5;60,13,4;61,13,4;62,13,4;63,13,4;64,13,4;65,13,5;66,13,6;67,13,6;82,13,8;83,13,7;84,13,8;85,13,8;86,13,7;87,13,7;88,13,6;89,13,5;90,13,6;91,13,5;92,13,5;93,13,5;94,13,6;95,13,7;96,13,7;97,13,7;98,13,7;99,13,7;100,13,7;101,13,7;102,13,8;103,13,8;104,13,8;105,13,8;106,13,8;107,13,7;108,13,7;109,13,6;110,13,5;111,13,5;112,13,5;113,13,4;114,13,4;116,13,4;117,13,4;31,14,7;32,14,7;33,14,7;34,14,7;35,14,7;36,14,7;37,14,7;38,14,7;39,14,7;40,14,7;41,14,7;42,14,7;43,14,6;44,14,6;45,14,6;46,14,5;47,14,4;48,14,4;49,14,4;50,14,4;51,14,4;55,14,6;56,14,6;57,14,7;58,14,8;59,14,6;60,14,4;61,14,4;65,14,3;66,14,3;67,14,5;68,14,6;75,14,7;76,14,7;77,14,7;78,14,7;80,14,7;81,14,6;82,14,6;83,14,7;84,14,7;85,14,7;86,14,7;87,14,6;88,14,4;89,14,4;90,14,5;91,14,5;92,14,6;93,14,5;94,14,6;95,14,6;96,14,6;97,14,7;98,14,6;99,14,6;100,14,6;101,14,6;102,14,7;103,14,7;104,14,7;105,14,7;106,14,7;107,14,6;108,14,6;109,14,5;110,14,4;111,14,4;112,14,4;113,14,4;114,14,3;115,14,3;116,14,4;29,15,7;30,15,7;31,15,7;32,15,7;33,15,6;34,15,6;35,15,7;36,15,7;37,15,6;38,15,7;39,15,7;40,15,7;41,15,7;42,15,6;43,15,6;44,15,6;45,15,5;46,15,4;47,15,4;48,15,4;49,15,3;56,15,5;57,15,5;58,15,7;59,15,6;60,15,6;61,15,4;62,15,4;63,15,3;64,15,4;66,15,3;68,15,5;69,15,5;72,15,7;73,15,6;74,15,5;75,15,4;76,15,5;77,15,4;78,15,5;79,15,8;80,15,7;81,15,5;83,15,8;84,15,6;85,15,7;86,15,7;87,15,5;88,15,4;89,15,4;90,15,4;91,15,4;92,15,4;93,15,5;94,15,5;95,15,5;96,15,5;97,15,5;98,15,5;99,15,5;0,16,5;1,16,6;2,16,6;3,16,6;4,16,6;5,16,6;6,16,5;28,16,7;29,16,7;30,16,6;31,16,6;32,16,6;33,16,6;34,16,6;35,16,7;36,16,6;37,16,6;38,16,6;39,16,6;40,16,6;41,16,6;42,16,6;43,16,5;44,16,5;45,16,4;46,16,4;47,16,4;49,16,3;60,16,6;61,16,6;62,16,5;66,16,4;69,16,5;80,16,4;81,16,5;82,16,8;83,16,7;84,16,5;85,16,6;86,16,5;87,16,4;88,16,4;89,16,4;92,16,4;93,16,4;94,16,5;95,16,5;96,16,5;97,16,5;98,16,4;99,16,4;0,17,6;1,17,6;2,17,6;3,17,6;4,17,6;5,17,6;6,17,6;7,17,6;16,17,6;17,17,6;18,17,6;19,17,6;20,17,6;21,17,6;22,17,5;23,17,5;25,17,6;26,17,6;27,17,7;28,17,6;29,17,6;30,17,6;31,17,6;32,17,6;33,17,6;34,17,6;35,17,6;36,17,6;37,17,6;38,17,6;39,17,6;40,17,6;41,17,5;42,17,5;43,17,4;44,17,4;45,17,4;46,17,3;61,17,6;62,17,5;63,17,4;80,17,6;81,17,7;82,17,5;83,17,4;84,17,4;85,17,4;86,17,4;87,17,4;88,17,4;89,17,4;95,17,5;96,17,4;0,18,6;1,18,6;2,18,6;3,18,6;4,18,6;5,18,6;6,18,6;7,18,6;8,18,6;9,18,5;10,18,5;12,18,7;13,18,6;14,18,6;15,18,6;16,18,6;17,18,6;18,18,6;19,18,6;20,18,6;21,18,6;22,18,6;23,18,5;24,18,5;25,18,5;26,18,6;27,18,6;28,18,6;29,18,5;30,18,5;31,18,6;32,18,6;33,18,6;34,18,6;35,18,6;36,18,6;37,18,6;38,18,6;39,18,6;40,18,5;41,18,4;42,18,4;43,18,4;44,18,4;45,18,3;47,18,4;62,18,4;63,18,5;67,18,4;79,18,6;80,18,6;81,18,4;82,18,5;83,18,6;84,18,4;85,18,4;86,18,3;87,18,3;0,19,6;1,19,6;2,19,6;3,19,6;4,19,6;5,19,5;6,19,6;7,19,6;8,19,6;9,19,6;10,19,7;11,19,7;12,19,6;13,19,6;14,19,6;15,19,6;16,19,6;17,19,6;18,19,6;19,19,6;20,19,6;21,19,6;22,19,6;23,19,6;24,19,5;25,19,5;26,19,4;27,19,5;28,19,5;29,19,5;30,19,5;31,19,6;32,19,6;33,19,6;34,19,6;35,19,6;36,19,7;37,19,6;38,19,6;39,19,5;40,19,5;41,19,4;42,19,4;43,19,4;44,19,3;45,19,3;78,19,7;79,19,6;80,19,4;81,19,5;82,19,4;83,19,6;84,19,6;85,19,5;86,19,6;0,20,6;1,20,6;2,20,6;3,20,5;4,20,5;5,20,6;6,20,7;7,20,6;8,20,6;9,20,6;10,20,7;11,20,6;12,20,6;13,20,6;14,20,6;15,20,6;16,20,6;17,20,6;18,20,6;19,20,6;20,20,6;21,20,6;22,20,6;23,20,6;24,20,5;25,20,5;26,20,4;27,20,4;28,20,5;29,20,6;30,20,6;31,20,6;32,20,6;33,20,6;34,20,7;35,20,7;36,20,6;37,20,6;38,20,6;39,20,5;40,20,4;41,20,4;42,20,3;43,20,3;78,20,6;79,20,4;80,20,5;81,20,5;83,20,6;40,21,4;41,21,4;42,21,3;78,21,6;79,21,4;80,21,6;83,21,4;40,22,4;41,22,4;79,22,4;80,22,5;83,22,5;79,23,5;80,23,6;83,23,6'.split(';').map(t => { const [c, r, l] = t.split(',').map(Number); return { c, r, l: l / 9, left: c < GAP, ph: Math.random() * 6.283, d: Math.abs(c - GAP) }; });
  const maxD = Math.max(...D.map(p => p.d));
  const ctx = cv.getContext('2d'); let w, h, cell, start = null, visible = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() { const r = cv.getBoundingClientRect(), k = devicePixelRatio || 1; cv.width = r.width * k; cv.height = r.height * k; w = cv.width; h = cv.height; cell = w / COLS; }
  function draw(t) {
    if (start === null) start = t;
    const el = (t - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    const reach = reduce ? 0 : Math.sin(el * .9) * cell * .9;
    for (const p of D) {
      const appear = reduce ? 1 : Math.min(1, Math.max(0, (el * 1.6) - (maxD - p.d) / maxD * 1.4));
      if (appear <= 0) continue;
      const tw = reduce ? 1 : .72 + .28 * Math.sin(el * 2.2 + p.ph);
      const a = appear * tw * (.35 + .65 * p.l);
      const x = (p.c + .5) * cell + (p.left ? reach : -reach), y = (p.r + .5) * cell;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(x, y, cell * (.18 + .2 * p.l) * (.6 + .4 * appear), 0, 6.283); ctx.fill();
    }
    if (visible && !reduce) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', () => { size(); if (!visible || reduce) draw(performance.now()); });
  new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !visible) { visible = true; requestAnimationFrame(t => { if (start === null) start = t; draw(t); }); } else if (!v) visible = false; }).observe(cv);
  if (reduce) { start = 0; draw(0); }
})();


// ===== SaaS motion layer =====
(function () {
  // count-up numbers (stats + the "2026" chip)
  const countUp = (el, to, suffix = '', dur = 1600) => {
    if (REDUCE) { el.textContent = to + suffix; return; }
    const t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(2, -10 * k); el.textContent = Math.round(to * e) + suffix; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const statIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; statIO.unobserve(e.target);
    const m = e.target.textContent.trim().match(/^(\d+)(.*)$/); if (m) countUp(e.target, +m[1], m[2]);
  }), { threshold: .6 });
  document.querySelectorAll('.stats b').forEach(b => statIO.observe(b));
  const chip = document.querySelector('.achip[data-a=count] span');
  if (chip) { chip.textContent = chip.dataset.n; }

  // scroll progress bar + nav state + active section
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.prepend(bar);
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav nav a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const heroPhoto = document.querySelector('.hero-photo');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 10);
    let cur = null; for (const s of secs) if (s.getBoundingClientRect().top < innerHeight * .4) cur = s;
    links.forEach(a => a.classList.toggle('on', cur && a.getAttribute('href') === '#' + cur.id));
    if (heroPhoto && !REDUCE && y < innerHeight * 1.2) heroPhoto.style.translate = `0 ${y * .18}px`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // cursor spotlight on cards
  document.querySelectorAll('.c, .dl, .achip, .req, details, .tpl, .feat > div').forEach(el => {
    el.classList.add('spot');
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  // smooth FAQ open/close
  document.querySelectorAll('details').forEach(d => {
    const sum = d.querySelector('summary'), body = d.querySelector('p');
    sum.addEventListener('click', (e) => {
      if (REDUCE) return; e.preventDefault();
      if (d.open) {
        const h = body.offsetHeight; body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        clearTimeout(d._t); d._t = setTimeout(() => { d.open = false; body.getAnimations().forEach(a => a.cancel()); }, 270);
      } else {
        clearTimeout(d._t); body.getAnimations().forEach(a => a.cancel()); d.open = true; const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0, transform: 'translateY(-6px)' }, { height: h + 'px', opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    });
  });
})();
