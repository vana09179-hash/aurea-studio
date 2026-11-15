// ---- Download links (GitHub Releases) ----
const REL = 'https://github.com/vana09179-hash/aurea-studio/releases/download/v1.0.0/';
const DOWNLOADS = {
  win: { url: REL + 'AureaStudio-1.0.0-portable.exe', size: '≈ 85 МБ · портативна версія' },
  linux: { url: REL + 'AureaStudio-1.0.0-linux-x64.tar.gz', size: '≈ 118 МБ · x86-64' },
  mac: { url: '', size: 'Версія для macOS з’явиться пізніше' }
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
if (DOWNLOADS[os].url) { hero.href = DOWNLOADS[os].url; hero.setAttribute('download', ''); }
document.getElementById('heroDlText').textContent = 'Завантажити ' + OS_NAME[os];

// scroll reveal
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 6) * 60 + 'ms'; io.observe(el); });

// hero demo: letters + typewriter loop
const title = document.getElementById('demoTitle'), type = document.getElementById('demoType');
function playDemo() {
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
  const html = list.map(([f, n, isNew]) => `<div class="tpl"><img src="img/tpl/${f}.jpg" alt="Шаблон «${n}»" loading="lazy"><span>${n}</span>${isNew ? '<span class="new">Новий</span>' : ''}</div>`).join('');
  t.innerHTML = html + html;
}
fillTrack('tplTrack', TPL); fillTrack('tplTrack2', TPL2);

// gallery
const SHOTS = ['start-light', 'editor-light', 'anim-dark', 'layers', 'search', 'show-chart', 'palette', 'pptx'];
const img = document.getElementById('galImg');
document.getElementById('galTabs').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('#galTabs button').forEach(x => x.classList.toggle('on', x === b));
  img.style.opacity = 0; setTimeout(() => { img.src = `img/${SHOTS[+b.dataset.i]}.jpg`; img.onload = () => { img.style.opacity = 1; }; }, 200);
});
