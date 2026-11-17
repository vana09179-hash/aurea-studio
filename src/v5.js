/* Aurea Studio — v5 module: tables, more charts, Bezier easing editor, mesh backgrounds, components,
   auto layout, distance measuring, smooth zoom, layer search, font replace, version history, clean PDF.
   Loaded after app.js; it extends the editor by wrapping its functions. */
(function () {
  'use strict';
  TYPE_NAMES.table = 'Таблиця';

  // ================= TABLES =================
  function addTable() {
    finishEdit();
    const light = isLight(slideCur().bg.color);
    const [, fB] = fontsFor();
    const p = placeAt(1100, 420);
    insertEl({
      id: uid(), type: 'table', x: p.x, y: p.y, w: 1100, h: 420, rot: 0, opacity: 1, morph: uid(),
      rows: [['Показник', '2024', '2025', '2026'], ['Учні', '120', '148', '175'], ['Проєкти', '14', '22', '31'], ['Перемоги', '3', '5', '8']],
      style: { font: fB, size: 26, color: light ? '#1d1938' : '#ffffff', header: true, headBg: '#7b6cff', headColor: '#ffffff', zebra: true, radius: 20, padX: 22, padY: 12, align: 'left', border: 1, bodyBg: light ? '#1d1938' : '#ffffff', bodyOp: .04 },
      anim: { type: 'fadeUp', trigger: 'auto', delay: 0, dur: 900, loop: true, order: 0 }
    });
  }
  function tableSec(e) {
    const s = e.style, rows = e.rows || [['']];
    const cols = Math.max(...rows.map(r => r.length));
    const setRows = (fn, scope = 'canvas+props') => setEls(x => { fn(x.rows); }, null, scope);
    const grid = h('div', { class: 'tgrid5', style: `grid-template-columns:repeat(${cols},1fr) auto` });
    rows.forEach((r, ri) => {
      for (let ci = 0; ci < cols; ci++) {
        const inp = h('input', { class: 'inp tcell' + (ri === 0 && s.header !== false ? ' head' : ''), value: r[ci] ?? '', spellcheck: 'false' });
        inp.addEventListener('input', () => setEls(x => { x.rows[ri][ci] = inp.value; }, 'tc' + ri + ':' + ci + e.id, 'canvas'));
        grid.append(inp);
      }
      grid.append(h('div', { class: 'trowbtns' },
        h('button', { title: 'Рядок вище', disabled: ri === 0, onclick: () => setRows(R => { [R[ri - 1], R[ri]] = [R[ri], R[ri - 1]]; }) }, '↑'),
        h('button', { title: 'Рядок нижче', disabled: ri === rows.length - 1, onclick: () => setRows(R => { [R[ri + 1], R[ri]] = [R[ri], R[ri + 1]]; }) }, '↓'),
        h('button', { title: 'Видалити рядок', disabled: rows.length < 2, onclick: () => setRows(R => { R.splice(ri, 1); }) }, '×')));
    });
    return sec('Дані таблиці',
      h('div', { class: 'tgridwrap' }, grid),
      row(btn('Рядок', 'plus', () => setRows(R => { R.push(Array(cols).fill('')); })), btn('Стовпець', 'plus', () => setRows(R => { R.forEach(r => r.push('')); })),
        btn('− стовпець', null, () => setRows(R => { if (cols > 1) R.forEach(r => r.pop()); }))),
      tglIn('Рядок заголовка', s.header !== false, v => setStyle('header', v, 'canvas+props')),
      s.header !== false ? row(fld('Тло заголовка', colorIn(s.headBg || '#7b6cff', v => setStyle('headBg', v))), fld('Текст заголовка', colorIn(s.headColor || '#ffffff', v => setStyle('headColor', v)))) : null,
      tglIn('Смуги (зебра)', !!s.zebra, v => setStyle('zebra', v)),
      fld('Скруглення кутів', rangeIn(s.radius ?? 18, 0, 60, 1, v => setStyle('radius', v), v => v + ' px')),
      row(fld('Відступ по горизонталі', rangeIn(s.padX ?? 20, 0, 80, 1, v => setStyle('padX', v))), fld('по вертикалі', rangeIn(s.padY ?? 12, 0, 60, 1, v => setStyle('padY', v)))),
      fld('Вирівнювання', segIn([{ v: 'left', l: 'Ліворуч' }, { v: 'center', l: 'Центр' }, { v: 'right', l: 'Праворуч' }], s.align || 'left', v => setStyle('align', v, 'canvas+props'))),
      fld('Шрифт', selIn(FONTS.map(f => ({ v: f, l: f })), s.font || 'Inter', v => setStyle('font', v), v => `font-family:'${v}'`)),
      row(fld('Розмір', rangeIn(s.size || 24, 10, 60, 1, v => setStyle('size', v))), fld('Колір тексту', colorIn(s.color || '#ffffff', v => setStyle('color', v)))),
      fld('Колір ліній', colorIn(s.lineColor || s.color || '#ffffff', v => setStyle('lineColor', v)))
    );
  }

  // ================= CHARTS: waterfall, Gantt, Sankey =================
  const CHART_KINDS = [{ v: 'bar', l: 'Стовпці' }, { v: 'hbar', l: 'Смуги' }, { v: 'donut', l: 'Кільце' }, { v: 'waterfall', l: 'Каскад' }, { v: 'gantt', l: 'Гант' }, { v: 'sankey', l: 'Санкі' }];
  const SAMPLE = {
    waterfall: [{ l: 'Старт', v: 120 }, { l: 'Продажі', v: 60 }, { l: 'Витрати', v: -35 }, { l: 'Податки', v: -15 }, { l: 'Разом', v: 0, t: true }],
    gantt: [{ l: 'Ідея', s: 0, v: 2 }, { l: 'Дизайн', s: 2, v: 3 }, { l: 'Розробка', s: 4, v: 5 }, { l: 'Тести', s: 8, v: 2 }, { l: 'Запуск', s: 10, v: 1 }],
    sankey: [{ l: 'Сайт → Реєстрація', v: 60 }, { l: 'Сайт → Вихід', v: 40 }, { l: 'Соцмережі → Реєстрація', v: 35 }, { l: 'Соцмережі → Вихід', v: 25 }, { l: 'Друзі → Реєстрація', v: 30 }]
  };
  const _addChart = addChart;
  addChart = function (kind) {
    if (!SAMPLE[kind]) return _addChart(kind);
    finishEdit();
    const light = isLight(slideCur().bg.color), [, fB] = fontsFor();
    const w = 1100, hh = kind === 'gantt' ? 460 : 560, p = placeAt(w, hh);
    insertEl({ id: uid(), type: 'chart', chart: kind, data: structuredClone(SAMPLE[kind]), x: p.x, y: p.y, w, h: hh, rot: 0, opacity: 1, morph: uid(),
      style: { font: fB, size: 24, color: light ? '#16130f' : '#ffffff', suffix: '', colors: [], radius: 14, gap: 4 },
      anim: { type: 'grow', trigger: 'auto', delay: 0, dur: 1000, loop: true, order: 0 } });
  };
  const _chartSec = chartSec;
  chartSec = function (e) {
    const node = _chartSec(e);
    // replace the chart type switch with the extended one
    const first = node.querySelector('.field');
    if (first) first.replaceWith(fld('Тип', segIn(CHART_KINDS, e.chart, v => setEls(x => {
      const okSankey = (x.data || []).some(d => /→|->/.test(d.l));
      if (SAMPLE[v] && (v !== 'gantt' || !(x.data || []).every(d => 's' in d)) && (v !== 'sankey' || !okSankey) && (v !== 'waterfall' || x.chart === 'waterfall' ? false : true)) x.data = structuredClone(SAMPLE[v]);
      x.chart = v;
    }, null, 'canvas+props'))));
    if (e.chart === 'gantt' || e.chart === 'waterfall' || e.chart === 'sankey') {
      const extra = e.chart === 'gantt'
        ? (e.data || []).map((d, i) => row(h('span', { class: 'hint', style: 'flex:1;align-self:center' }, d.l), numIn('Початок', d.s || 0, v => setEls(x => { x.data[i].s = v; }, 'gs' + i + e.id), { min: 0 })))
        : e.chart === 'waterfall'
          ? (e.data || []).map((d, i) => tglIn(`«${d.l}» — підсумок`, !!d.t, v => setEls(x => { x.data[i].t = v; }, null, 'canvas+props')))
          : [h('p', { class: 'hint' }, 'Назва рядка — «Звідки → Куди», значення — розмір потоку. Наприклад: «Сайт → Реєстрація».')];
      node.append(h('div', { class: 'field' }, h('label', {}, e.chart === 'gantt' ? 'Початок кожної задачі (тривалість — у «Даних»)' : e.chart === 'waterfall' ? 'Стовпці-підсумки' : 'Як вводити дані'), ...extra));
      if (e.chart === 'waterfall') node.append(row(fld('Зростання', colorIn(e.style.upColor || '#4ade80', v => setStyle('upColor', v))), fld('Спад', colorIn(e.style.downColor || '#f87171', v => setStyle('downColor', v)))));
    }
    return node;
  };
  ACTIONS['menu-chart'] = (b) => menuAt(b, [
    { header: 'Діаграми' },
    { label: 'Стовпчикова', icon: 'chart', fn: () => addChart('bar') },
    { label: 'Смуги (горизонтальна)', icon: 'alL', fn: () => addChart('hbar') },
    { label: 'Кільцева', icon: 'restore', fn: () => addChart('donut') },
    { label: 'Каскадна (Waterfall)', icon: 'chart', fn: () => addChart('waterfall') },
    { label: 'Діаграма Ганта', icon: 'alL', fn: () => addChart('gantt') },
    { label: 'Потоки (Санкі)', icon: 'arrow', fn: () => addChart('sankey') },
    { header: 'Дані' },
    { label: 'Таблиця', icon: 'grid', fn: addTable }]);

  // ================= COMPONENTS (synced copies) =================
  const compCopies = (id) => { const out = []; P.slides.forEach((sl, si) => sl.elements.forEach(x => { if (x.comp === id) out.push({ x, si }); })); return out; };
  function syncComponents(els) {
    for (const e of els) {
      if (!e.comp) continue;
      for (const { x } of compCopies(e.comp)) {
        if (x === e) continue;
        x.style = structuredClone(e.style); x.fx = e.fx ? structuredClone(e.fx) : x.fx;
        x.w = e.w; x.h = e.h; if (e.shape) x.shape = e.shape; if (e.icon) x.icon = e.icon;
        if (e.type === 'text' && e.compText) x.content = e.content;
      }
    }
  }
  const _setEls = setEls;
  setEls = function (fn, key, scope = 'canvas') {
    ck(key); const els = selected(); els.forEach(fn); syncComponents(els);
    if (els.some(e => e.comp)) { renderStrip(); }
    changed(scope);
  };
  function compSec(e) {
    if (!e.comp) return sec('Компонент',
      h('p', { class: 'hint' }, 'Зробіть цей об’єкт компонентом — і зміни кольору, розміру чи стилю застосуються до всіх його копій на всіх слайдах.'),
      row(btn('Зробити компонентом', 'copy', () => setProp('comp', uid(), 'canvas+props'))));
    const n = compCopies(e.comp).length;
    return sec('Компонент · ' + n + (n === 1 ? ' копія' : ' копій'),
      tglIn('Синхронізувати й текст', !!e.compText, v => setProp('compText', v)),
      row(btn('Вставити копію на інші слайди', 'plus', () => {
        ck(); const src = selected()[0];
        P.slides.forEach((sl, i) => { if (i !== cur && !sl.elements.some(x => x.comp === src.comp)) sl.elements.push({ ...structuredClone(src), id: uid() }); });
        changed('all'); toast('Копії компонента додано на всі слайди');
      })),
      row(btn('Від’єднати цю копію', 'x', () => setProp('comp', null, 'canvas+props')), btn('Виділити всі на слайді', 'grid', () => { sel = slideCur().elements.filter(x => x.comp === e.comp).map(x => x.id); renderOverlay(); renderProps(); })));
  }

  // ================= AUTO LAYOUT (vertical stack with gap) =================
  let laying = false;
  function autoLayout(slide) {
    const groups = {};
    slide.elements.forEach(e => { if (e.auto && e.auto.g) (groups[e.auto.g] ||= []).push(e); });
    let moved = false;
    for (const g of Object.values(groups)) {
      g.sort((a, b) => a.auto.i - b.auto.i);
      const gap = g[0].auto.gap ?? 24, dir = g[0].auto.dir || 'v', al = g[0].auto.align || 'start';
      const cx0 = g[0].x + g[0].w / 2, cy0 = g[0].y + g[0].h / 2;
      let pos = dir === 'v' ? g[0].y : g[0].x;
      for (const e of g) {
        if (e.type === 'text' && dir === 'v') { // grow text boxes to fit their content
          const t = stageHost.querySelector(`[data-id="${e.id}"] .a-txt`);
          if (t) { const need = Math.ceil(t.scrollHeight); if (need > 0 && Math.abs(need - e.h) > 2) { e.h = Math.max(20, need); moved = true; } }
        }
        if (dir === 'v') { const nx = al === 'center' ? Math.round(cx0 - e.w / 2) : g[0].x; if (e.y !== pos) { e.y = pos; moved = true; } if (e.x !== nx) { e.x = nx; moved = true; } pos += e.h + gap; }
        else { const ny = al === 'center' ? Math.round(cy0 - e.h / 2) : g[0].y; if (e.x !== pos) { e.x = pos; moved = true; } if (e.y !== ny) { e.y = ny; moved = true; } pos += e.w + gap; }
      }
    }
    return moved;
  }
  const _renderCanvas = renderCanvas;
  renderCanvas = function () {
    _renderCanvas();
    if (!P || laying || editingId) return;
    if (slideCur().elements.some(e => e.auto)) { laying = true; try { if (autoLayout(slideCur())) _renderCanvas(); } finally { laying = false; } }
  };
  const dir0 = (e) => (e.auto && e.auto.dir) || 'v';
  function autoSec(els) {
    const e = els[0];
    if (e.auto) {
      const g = slideCur().elements.filter(x => x.auto && x.auto.g === e.auto.g);
      return sec('Авто-розкладка · ' + g.length,
        fld('Напрям', segIn([{ v: 'v', l: 'Стовпчиком' }, { v: 'h', l: 'Рядком' }], e.auto.dir || 'v', v => { ck(); g.forEach(x => { x.auto.dir = v; }); changed('canvas+props'); })),
        fld('Вирівнювання', segIn([{ v: 'start', l: dir0(e) === 'v' ? 'За лівим краєм' : 'За верхом' }, { v: 'center', l: 'По центру' }], e.auto.align || 'start', v => { ck(); g.forEach(x => { x.auto.align = v; }); changed('canvas+props'); })),
        fld('Відступ між елементами', rangeIn(e.auto.gap ?? 24, 0, 160, 1, v => { ck('autogap' + e.auto.g); g.forEach(x => { x.auto.gap = v; }); changed('canvas'); }, v => v + ' px')),
        h('p', { class: 'hint' }, 'Елементи самі розсуваються, коли текст стає довшим або коротшим.'),
        row(btn('Вимкнути', 'x', () => { ck(); g.forEach(x => { delete x.auto; }); changed('canvas+props'); })));
    }
    if (els.length < 2) return null;
    return sec('Авто-розкладка',
      h('p', { class: 'hint' }, 'Складіть виділені об’єкти в стовпчик або рядок із рівними відступами — як Auto Layout у Figma.'),
      row(btn('Стовпчиком', 'alL', () => makeAuto('v')), btn('Рядком', 'alC', () => makeAuto('h'))));
  }
  function makeAuto(dir) {
    ck(); const g = uid(), els = selected().sort((a, b) => dir === 'v' ? a.y - b.y : a.x - b.x);
    const cs = els.map(e => dir === 'v' ? e.x + e.w / 2 : e.y + e.h / 2), centered = Math.max(...cs) - Math.min(...cs) < 40;
    els.forEach((e, i) => { e.auto = { g, i, gap: 24, dir, align: centered ? 'center' : 'start' }; });
    changed('canvas+props'); toast('Авто-розкладку увімкнено');
  }

  // ================= designTab additions =================
  const _designTab = designTab;
  designTab = function () {
    const out = _designTab();
    const els = selected(), e = els[0];
    if (els.length === 1 && e.type === 'table') out.splice(1, 0, tableSec(e));
    const a = autoSec(els); if (a) out.push(a);
    if (els.length === 1) out.push(compSec(e));
    return out;
  };

  // ================= Bezier easing editor (animation tab) =================
  const BEZ_PRESETS = [['Плавно', [.2, .75, .2, 1]], ['Пружно', [.34, 1.56, .64, 1]], ['Різко', [.7, 0, .2, 1]], ['Повільний старт', [.6, 0, .9, .4]], ['Лінійно', [0, 0, 1, 1]]];
  function bezierEditor(a) {
    const bez = (a.ease === 'custom' && a.bez) ? a.bez.slice() : [.2, .75, .2, 1];
    const S = 220, pad = 22, Wd = S - pad * 2;
    const X = v => pad + v * Wd, Y = v => S - pad - v * Wd, inv = (px, py) => [Math.min(1, Math.max(0, (px - pad) / Wd)), Math.min(1.6, Math.max(-.6, (S - pad - py) / Wd))];
    const NS = 'http://www.w3.org/2000/svg', mk = (t, at) => { const n = document.createElementNS(NS, t); for (const k in at) n.setAttribute(k, at[k]); return n; };
    const svg = mk('svg', { viewBox: `0 ${-95} ${S} ${S + 190}`, width: S, height: S + 190, class: 'bez' });
    svg.append(mk('rect', { x: pad, y: pad, width: Wd, height: Wd, class: 'bez-box' }));
    const l1 = mk('line', { class: 'bez-arm' }), l2 = mk('line', { class: 'bez-arm' }), path = mk('path', { class: 'bez-curve' });
    const h1 = mk('circle', { r: 8, class: 'bez-h' }), h2 = mk('circle', { r: 8, class: 'bez-h h2' });
    svg.append(l1, l2, path, h1, h2);
    const lab = h('code', { class: 'bez-lab' });
    const draw = () => {
      const [x1, y1, x2, y2] = bez;
      path.setAttribute('d', `M${X(0)},${Y(0)} C${X(x1)},${Y(y1)} ${X(x2)},${Y(y2)} ${X(1)},${Y(1)}`);
      for (const [l, hx, hy, px, py] of [[l1, x1, y1, 0, 0], [l2, x2, y2, 1, 1]]) { l.setAttribute('x1', X(px)); l.setAttribute('y1', Y(py)); l.setAttribute('x2', X(hx)); l.setAttribute('y2', Y(hy)); }
      h1.setAttribute('cx', X(x1)); h1.setAttribute('cy', Y(y1)); h2.setAttribute('cx', X(x2)); h2.setAttribute('cy', Y(y2));
      lab.textContent = `cubic-bezier(${bez.map(v => +v.toFixed(2)).join(', ')})`;
    };
    const commit = () => { setEls(x => { x.anim.ease = 'custom'; x.anim.bez = bez.map(v => +v.toFixed(3)); }, 'bez' + sel.join(), 'canvas'); };
    const drag = (k) => (ev) => {
      ev.preventDefault(); svg.setPointerCapture(ev.pointerId);
      const mv = (m) => { const r = svg.getBoundingClientRect(), sx = (S) / r.width, sy = (S + 190) / r.height; const [vx, vy] = inv((m.clientX - r.left) * sx, (m.clientY - r.top) * sy - 95); bez[k] = vx; bez[k + 1] = vy; draw(); };
      const up = () => { svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); commit(); };
      svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up);
    };
    h1.addEventListener('pointerdown', drag(0)); h2.addEventListener('pointerdown', drag(2));
    draw();
    return sec('Крива швидкості (Безьє)',
      h('div', { class: 'bez-wrap' }, svg),
      lab,
      h('div', { class: 'aichips', style: 'margin-top:8px' }, ...BEZ_PRESETS.map(([n, v]) => h('button', { class: 'aichip', onclick: () => { bez.splice(0, 4, ...v); draw(); commit(); } }, n))),
      h('p', { class: 'hint' }, 'Тягніть дві точки, щоб намалювати власний графік прискорення.'),
      h('button', { class: 'btn block', style: 'margin-top:6px', onclick: () => previewAnims([...sel]) }, icon('play'), 'Переглянути з цією кривою'));
  }
  const _animTab = animTab;
  animTab = function () {
    const out = _animTab();
    const e = selected()[0];
    if (e && e.anim && e.anim.type && e.anim.type !== 'none' && sel.length >= 1) {
      const pi = out.findIndex(n => n && n.querySelector && /Параметри/.test((n.querySelector('h4') || {}).textContent || ''));
      out.splice(pi >= 0 ? pi + 1 : out.length, 0, bezierEditor(e.anim));
    }
    return out;
  };

  // ================= Mesh gradient background (slide tab) =================
  const MESH_PRESETS = [['Аврора', ['#7b6cff', '#e46fc4', '#22d3ee', '#ff9f8a'], '#0b0820'], ['Світанок', ['#ffd6a5', '#ffadad', '#cdb4db', '#bde0fe'], '#fff7f0'], ['Океан', ['#0ea5e9', '#22d3ee', '#6366f1', '#14b8a6'], '#04111f'], ['Лаванда', ['#c4b5fd', '#f9a8d4', '#a5f3fc', '#ddd6fe'], '#f7f5ff'], ['Неон', ['#f0abfc', '#22d3ee', '#a3e635', '#818cf8'], '#05050a']];
  const _slideTab = slideTab;
  slideTab = function () {
    const out = _slideTab();
    const s = slideCur(), bg = s.bg;
    const setBg = (fn, scope = 'canvas+props') => { ck('mesh' + s.id); fn(bg); changed(scope); };
    const on = bg.grad === 'mesh', m = bg.mesh || ['#7b6cff', '#e46fc4', '#22d3ee', '#ff9f8a'];
    out.splice(1, 0, sec('Сітковий градієнт (mesh)',
      h('div', { class: 'meshrow' }, ...MESH_PRESETS.map(([n, cols, base]) => h('button', { class: 'meshsw' + (on && m.join() === cols.join() ? ' on' : ''), title: n, style: `background:radial-gradient(65% 75% at 0% 0%,${cols[0]},transparent 62%),radial-gradient(60% 70% at 100% 0%,${cols[1]},transparent 60%),radial-gradient(70% 80% at 100% 100%,${cols[2]},transparent 62%),radial-gradient(65% 75% at 0% 100%,${cols[3]},transparent 60%),${base}`, onclick: () => setBg(b => { b.grad = 'mesh'; b.mesh = cols.slice(); b.color = base; }) }, h('span', {}, n)))),
      on ? [row(fld('Кут 1', colorIn(m[0], v => setBg(b => { b.mesh = [...m]; b.mesh[0] = v; }, 'canvas'))), fld('Кут 2', colorIn(m[1], v => setBg(b => { b.mesh = [...m]; b.mesh[1] = v; }, 'canvas')))),
        row(fld('Кут 3', colorIn(m[2], v => setBg(b => { b.mesh = [...m]; b.mesh[2] = v; }, 'canvas'))), fld('Кут 4', colorIn(m[3], v => setBg(b => { b.mesh = [...m]; b.mesh[3] = v; }, 'canvas')))),
        fld('База', colorIn(bg.color, v => setBg(b => { b.color = v; }, 'canvas'))),
        tglIn('Плівкова зернистість', !!bg.grain, v => setBg(b => { b.grain = v; }, 'canvas')),
        row(btn('Вимкнути mesh', 'x', () => setBg(b => { b.grad = 'radial'; })))] : h('p', { class: 'hint' }, 'Чотири кольорові плями в кутах слайда м’яко змішуються — сучасний «mesh»-фон. Додайте зернистість для фактури.')));
    return out;
  };

  // ================= Layers: search =================
  let layerQuery = '';
  const _layersTab = layersTab;
  layersTab = function () {
    const out = _layersTab();
    const box = out[0];
    if (box && box.querySelector) {
      const list = box.querySelector('.llist');
      const inp = h('input', { class: 'inp lsearch', placeholder: 'Пошук шару…', value: layerQuery, spellcheck: 'false' });
      const apply = () => { const q = layerQuery.trim().toLowerCase(); if (list) [...list.children].forEach(r => { r.style.display = !q || r.textContent.toLowerCase().includes(q) ? '' : 'none'; }); };
      inp.addEventListener('input', () => { layerQuery = inp.value; apply(); });
      if (list) { list.before(inp); apply(); }
    }
    return out;
  };

  // ================= Font replace across the whole presentation =================
  function fontReplaceDialog() {
    finishEdit();
    const used = new Map();
    P.slides.forEach(sl => sl.elements.forEach(e => { const f = e.style && e.style.font; if (f) used.set(f, (used.get(f) || 0) + 1); }));
    if (!used.size) { toast('У презентації немає текстів зі шрифтами'); return; }
    let from = [...used.keys()][0], to = FONTS.find(f => f !== from) || FONTS[0];
    const close = () => m.remove();
    const fromSel = selIn([...used.entries()].map(([f, n]) => ({ v: f, l: `${f} · ${n}` })), from, v => { from = v; }, v => `font-family:'${v.split(' · ')[0]}'`);
    const toSel = selIn(FONTS.map(f => ({ v: f, l: f })), to, v => { to = v; }, v => `font-family:'${v}'`);
    const m = h('div', { class: 'modal-bg', onclick: (ev) => { if (ev.target === m) close(); } },
      h('div', { class: 'modal glass', style: 'width:min(520px,92vw)' },
        h('h2', {}, 'Замінити шрифт у всій презентації'),
        h('p', { class: 'hint' }, 'Змінюються всі тексти, таблиці й діаграми на всіх слайдах — разом із вкладеними в групи.'),
        fld('Замінити', fromSel), fld('На', toSel),
        h('div', { class: 'row', style: 'margin-top:14px' }, h('div', { class: 'spacer' }), h('button', { class: 'btn', onclick: close }, 'Скасувати'),
          h('button', { class: 'btn-primary', onclick: () => {
            ck(); let n = 0;
            P.slides.forEach(sl => sl.elements.forEach(e => { if (e.style && e.style.font === from) { e.style.font = to; n++; } }));
            close(); changed('all'); toast(`Замінено шрифт у ${n} об’єктах`);
          } }, 'Замінити'))));
    document.body.append(m);
  }

  // ================= Distance measuring: hold Alt and hover another object =================
  let altDown = false, measureTarget = null;
  const drawMeasure = () => {
    overlay.querySelectorAll('.measure').forEach(n => n.remove());
    const a = selected()[0], b = measureTarget && slideCur().elements.find(x => x.id === measureTarget);
    if (!altDown || !a || !b || a === b || sel.length !== 1) return;
    const lines = [];
    const H = (x1, x2, y) => lines.push({ x: Math.min(x1, x2), y, w: Math.abs(x2 - x1), h: 0, v: Math.round(Math.abs(x2 - x1)) });
    const V = (y1, y2, x) => lines.push({ x, y: Math.min(y1, y2), w: 0, h: Math.abs(y2 - y1), v: Math.round(Math.abs(y2 - y1)) });
    const cyA = a.y + a.h / 2, cxA = a.x + a.w / 2;
    if (b.x >= a.x + a.w) H(a.x + a.w, b.x, cyA); else if (b.x + b.w <= a.x) H(b.x + b.w, a.x, cyA);
    if (b.y >= a.y + a.h) V(a.y + a.h, b.y, cxA); else if (b.y + b.h <= a.y) V(b.y + b.h, a.y, cxA);
    if (!lines.length) { H(a.x, b.x, cyA); V(a.y, b.y, cxA); }
    for (const l of lines) {
      overlay.append(h('div', { class: 'measure ml', style: `left:${l.x * scale}px;top:${l.y * scale}px;width:${Math.max(1, l.w * scale)}px;height:${Math.max(1, l.h * scale)}px` }),
        h('div', { class: 'measure mv', style: `left:${(l.x + l.w / 2) * scale}px;top:${(l.y + l.h / 2) * scale}px` }, l.v + ' px'));
    }
    overlay.append(h('div', { class: 'measure mb', style: `left:${b.x * scale}px;top:${b.y * scale}px;width:${b.w * scale}px;height:${b.h * scale}px` }));
  };
  window.addEventListener('keydown', (e) => { if (e.key === 'Alt' && !altDown) { altDown = true; drawMeasure(); } });
  window.addEventListener('keyup', (e) => { if (e.key === 'Alt') { altDown = false; drawMeasure(); } });
  window.addEventListener('blur', () => { altDown = false; drawMeasure(); });
  canvasWrap.addEventListener('pointermove', (e) => {
    if (!altDown) return;
    const n = document.elementsFromPoint(e.clientX, e.clientY).map(x => x.closest && x.closest('#stageHost [data-id]')).find(Boolean);
    const id = n ? n.dataset.id : null;
    if (id !== measureTarget) { measureTarget = id; drawMeasure(); }
  });

  // ================= Smooth zoom toward the cursor + pan with Space / middle mouse =================
  let zTarget = null, zRaf = 0, zAnchor = null;
  canvasWrap.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const r = viewport.getBoundingClientRect();
    zAnchor = { cx: e.clientX, cy: e.clientY, px: (e.clientX - r.left) / scale, py: (e.clientY - r.top) / scale };
    zTarget = clamp((zTarget ?? scale) * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0022)), 0.1, 4);
    if (!zRaf) zRaf = requestAnimationFrame(stepZoom);
  }, { passive: false, capture: true });
  function stepZoom() {
    zRaf = 0; if (zTarget == null) return;
    const next = scale + (zTarget - scale) * 0.28;
    zoomMode = 'manual'; zoomVal = Math.abs(next - zTarget) < 0.002 ? zTarget : next;
    fitScale();
    if (zAnchor) { const r = viewport.getBoundingClientRect(); canvasWrap.scrollLeft += (r.left + zAnchor.px * scale) - zAnchor.cx; canvasWrap.scrollTop += (r.top + zAnchor.py * scale) - zAnchor.cy; }
    if (zoomVal !== zTarget) zRaf = requestAnimationFrame(stepZoom); else zTarget = null;
  }
  let spaceDown = false, panning = null;
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && !editingId && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { if (!spaceDown) { spaceDown = true; canvasWrap.classList.add('pan-ready'); } e.preventDefault(); } }, true);
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') { spaceDown = false; canvasWrap.classList.remove('pan-ready'); } });
  canvasWrap.addEventListener('pointerdown', (e) => {
    if (!(spaceDown && e.button === 0) && e.button !== 1) return;
    e.preventDefault(); e.stopImmediatePropagation();
    panning = { x: e.clientX, y: e.clientY, sl: canvasWrap.scrollLeft, st: canvasWrap.scrollTop };
    canvasWrap.classList.add('panning'); canvasWrap.setPointerCapture(e.pointerId);
  }, true);
  canvasWrap.addEventListener('pointermove', (e) => { if (!panning) return; canvasWrap.scrollLeft = panning.sl - (e.clientX - panning.x); canvasWrap.scrollTop = panning.st - (e.clientY - panning.y); });
  canvasWrap.addEventListener('pointerup', () => { if (panning) { panning = null; canvasWrap.classList.remove('panning'); } });

  // ================= Version history =================
  const histKey = () => filePath || (P && P.title) || 'untitled';
  let lastHist = 0, lastHistData = '';
  async function saveVersion(label) {
    if (!P || !api.histSave) return;
    const data = serialize();
    if (!label && data === lastHistData) return;
    lastHistData = data; lastHist = Date.now();
    await api.histSave({ key: histKey(), data, label: label || '' });
  }
  setInterval(() => { if (P && dirty !== undefined && Date.now() - lastHist > 120000) saveVersion(); }, 30000);
  async function historyDialog() {
    if (!P) return;
    finishEdit();
    await saveVersion('Поточний стан');
    const list = await api.histList(histKey());
    const close = () => m.remove();
    const items = list.map(v => h('div', { class: 'hitem' },
      h('div', {}, h('b', {}, new Date(v.t).toLocaleString('uk-UA')), h('small', {}, (v.label ? v.label + ' · ' : '') + Math.round(v.size / 1024) + ' КБ')),
      h('button', { class: 'btn sm', onclick: async () => {
        const data = await api.histLoad({ key: histKey(), t: v.t });
        await saveVersion('Перед відновленням'); close();
        openData(data, filePath); toast('Версію від ' + new Date(v.t).toLocaleTimeString('uk-UA') + ' відновлено');
      } }, 'Відновити')));
    const m = h('div', { class: 'modal-bg', onclick: (ev) => { if (ev.target === m) close(); } },
      h('div', { class: 'modal glass', style: 'width:min(560px,92vw)' },
        h('h2', {}, 'Історія версій'),
        h('p', { class: 'hint' }, 'Програма сама зберігає версію кожні 2 хвилини роботи (останні 40) — локально, без хмари. Відновлення не стирає поточну: вона теж зберігається в історії.'),
        h('div', { class: 'hlist' }, items.length ? items : h('p', { class: 'hint' }, 'Поки що немає збережених версій.')),
        h('div', { class: 'row', style: 'margin-top:14px' }, btn('Зберегти версію зараз', 'plus', async () => { await saveVersion('Збережено вручну'); close(); historyDialog(); }), h('div', { class: 'spacer' }), h('button', { class: 'btn', onclick: close }, 'Закрити'))));
    document.body.append(m);
  }

  // ================= Clean PDF (rasterised) =================
  async function exportPdfClean() {
    finishEdit();
    busy('Створюю PDF «як на екрані»…');
    try {
      const html = await buildStandalone(true);
      const p = await api.exportPdfRaster({ html, name: P.title });
      busy(false);
      if (p) toast('PDF збережено — градієнти й тіні точно як на екрані.', { label: 'Показати файл', fn: () => api.showItem(p) });
    } catch (e) { busy(false); toast('Помилка експорту: ' + e.message); }
  }
  const _menuExport = ACTIONS['menu-export'];
  if (_menuExport) ACTIONS['menu-export'] = (b) => { const mn = _menuExport(b); const menu = (mn && mn.append) ? mn : document.querySelector('.menu'); if (menu) { const it = h('button', { class: 'mi', onclick: () => { closeMenu(); exportPdfClean(); } }, icon('file'), h('span', {}, 'PDF «як на екрані» (без смуг і артефактів)')); menu.append(it); } };

  // ================= commands & shortcuts =================
  window.EXTRA_CMDS = () => [
    ['Вставити таблицю', '', addTable], ['Каскадна діаграма (Waterfall)', '', () => addChart('waterfall')], ['Діаграма Ганта', '', () => addChart('gantt')], ['Діаграма потоків (Санкі)', '', () => addChart('sankey')],
    ['Замінити шрифт у всій презентації', '', fontReplaceDialog], ['Історія версій', 'Ctrl+Alt+H', historyDialog], ['Зберегти версію', '', () => saveVersion('Збережено вручну').then(() => toast('Версію збережено'))],
    ['Експорт у PDF «як на екрані»', '', exportPdfClean], ['Авто-розкладка стовпчиком', '', () => makeAuto('v')], ['Зробити компонентом', '', () => setProp('comp', uid(), 'canvas+props')]
  ];
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyH') { e.preventDefault(); historyDialog(); }
  }, true);
  window.__v5 = { addTable, fontReplaceDialog, historyDialog, exportPdfClean, makeAuto, saveVersion };
})();
