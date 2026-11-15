/* Aurea — built-in templates */
(function (G) {
  'use strict';
  const uid = () => Math.random().toString(36).slice(2, 10);
  const A = (type = 'none', delay = 0, x = {}) => ({ type, trigger: 'auto', delay, dur: 900, loop: true, order: 0, ...x });
  const base = (type, x, y, w, h, o) => ({ id: uid(), type, x, y, w, h, rot: o.rot || 0, opacity: o.op ?? 1, anim: A(o.a, o.d, o.ax), morph: o.m || uid() });
  const T = (content, x, y, w, h, style, o = {}) => ({
    ...base('text', x, y, w, h, o), content,
    style: { font: 'Inter', size: 40, weight: 400, italic: false, color: '#ffffff', color2: '', gradAngle: 90, align: 'left', valign: 'top', lh: 1.2, ls: 0, upper: false, shadow: 'none', ...style }
  });
  const S = (shape, x, y, w, h, style, o = {}) => ({
    ...base('shape', x, y, w, h, o), shape,
    style: { fill: '#ffffff', fillOpacity: 1, color2: '', gradAngle: 90, stroke: '#ffffff', strokeOpacity: 1, strokeWidth: 0, radius: 0, blur: 26, dash: false, ...style }
  });
  const L = (x, y, w, style, o = {}) => ({
    ...base('line', x, y - 20, w, 40, o),
    style: { stroke: '#ffffff', strokeOpacity: 1, color2: '', strokeWidth: 2, fade: false, ends: 'none', dash: false, ...style }
  });
  const I = (src, x, y, w, h, style, o = {}) => ({
    ...base('image', x, y, w, h, o), src,
    style: { fit: 'cover', pos: '50% 25%', mask: 'none', radius: 24, borderWidth: 0, borderColor: '#c9a45c', filter: 'none', shadow: false, innerLine: false, ...style }
  });
  const slide = (elements, bg, transition = 'fade', notes = '', extra = {}) => ({ id: uid(), bg, transition, notes, elements, ...extra });
  const LIBP = (n) => `assets/lib/${n}.jpg`;
  const Ic = (icon, x, y, size, style, o = {}) => ({
    ...base('icon', x, y, size, size, o), icon,
    style: { color: '#ffffff', strokeWidth: 1.6, shape: 'circle', bg: '#ffffff', bgOpacity: .1, glow: true, filled: false, ...style }
  });
  const C = (chart, data, x, y, w, h, style, o = {}) => ({
    ...base('chart', x, y, w, h, { a: 'grow', ...o }), chart, data,
    style: { font: 'Inter', size: 26, color: '#ffffff', suffix: '', colors: [], radius: 14, gap: 4, ...style }
  });
  const project = (title, theme, slides, assets = {}) => ({ format: 'aurea', version: 1, title, theme, slides, assets });

  // ================= 1. Музейна класика =================
  function museum() {
    const G1 = '#c9a45c', G2 = '#e7cf93', BR = '#7d1f2b', IV = '#efe6d2', BG = '#0b0907';
    const bg = (c2 = '#24180f') => ({ color: BG, grad: 'radial', color2: c2, cx: 50, cy: 20, grain: true, vignette: true });
    const label = (t, x, y, w, o = {}) => T(t, x, y, w, 40, { font: 'Montserrat', size: 22, weight: 600, color: G1, ls: .42, upper: true, align: o.align || 'left' }, o);
    const frame = (o = {}) => S('frame', 56, 56, 1808, 968, { fill: 'none', stroke: G1, strokeWidth: 2, strokeOpacity: .85, gap: 18 }, { a: 'draw', d: 0, ax: { dur: 1500 }, m: 'frame', ...o });
    const cap = (t, x, y, w) => T(t, x, y, w, 30, { font: 'Montserrat', size: 15, color: IV, ls: .12, align: 'center' }, { op: .45, a: 'fadeUp', d: 1600 });
    return project('Музейна класика', { name: 'museum', colors: [BG, G1, G2, BR, IV, '#1a120c'] }, [
      slide([
        frame(),
        S('arch', 760, 150, 400, 520, { fill: 'none', stroke: G1, strokeWidth: 1.5, strokeOpacity: .35 }, { a: 'draw', d: 300, ax: { dur: 1800 }, m: 'archline' }),
        label('Віртуальна експозиція', 360, 268, 1200, { align: 'center', a: 'fadeUp', d: 400, m: 'label' }),
        T('Назва експозиції', 160, 330, 1600, 200, { font: 'Playfair Display', size: 150, weight: 500, color: IV, color2: G2, gradAngle: 180, align: 'center', lh: 1.1 }, { a: 'shine', d: 700, m: 'title' }),
        L(700, 580, 520, { stroke: G1, strokeWidth: 2, fade: true, ends: 'diamond' }, { a: 'draw', d: 1100, m: 'rule' }),
        T('Епоха Ренесансу · 1485 — 1603', 260, 630, 1400, 70, { font: 'Cormorant Garamond', size: 50, italic: true, color: G2, align: 'center' }, { a: 'stagger', d: 1400, m: 'sub' }),
        T('Автор · Клас · Школа', 460, 900, 1000, 40, { font: 'Montserrat', size: 20, weight: 500, color: IV, ls: .3, upper: true, align: 'center' }, { op: .6, a: 'fadeUp', d: 1900, m: 'author' })
      ], { ...bg(), fx: 'particles', fxColor: G2, fxColor2: G1 }, 'fade', 'Привітайтеся та коротко назвіть тему.'),
      slide([
        frame(),
        S('arch', 150, 120, 600, 840, { fill: 'none', stroke: G1, strokeWidth: 1.5, strokeOpacity: .6 }, { a: 'draw', d: 200, ax: { dur: 1600 }, m: 'archline' }),
        I('monalisa', 180, 150, 540, 780, { mask: 'arch', borderWidth: 3, borderColor: G1, innerLine: true, innerInset: 12, shadow: true, filter: 'warm', pos: '50% 20%' }, { a: 'kenburns', d: 300, m: 'p1' }),
        cap('Леонардо да Вінчі, «Мона Ліза» · Wikimedia Commons, суспільне надбання', 150, 975, 600),
        label('Розділ I', 880, 240, 800, { a: 'fadeUp', d: 400, m: 'label' }),
        T('Портрет епохи', 880, 290, 900, 130, { font: 'Playfair Display', size: 96, weight: 500, color: IV, color2: G2, gradAngle: 180 }, { a: 'fadeUp', d: 550, m: 'title' }),
        L(880, 450, 360, { stroke: G1, strokeWidth: 2, ends: 'diamond' }, { a: 'draw', d: 800, m: 'rule' }),
        T('Розкажіть історію твору: хто автор, коли його створено і чому він змінив мистецтво. Тримайте абзац коротким — два-три речення.', 880, 500, 860, 300, { font: 'Cormorant Garamond', size: 40, color: IV, lh: 1.45 }, { op: .9, a: 'stagger', d: 1000, m: 'sub' }),
        T('1503 — 1519', 880, 830, 600, 60, { font: 'Montserrat', size: 26, weight: 600, color: G1, ls: .3 }, { a: 'fadeUp', d: 1500, m: 'author' })
      ], bg('#2a1a10'), 'morph', 'Дублюйте слайд (Ctrl+Shift+D), щоб morph плавно перетікав між однаковими елементами.'),
      slide([
        frame(),
        label('Галерея', 360, 120, 1200, { align: 'center', a: 'fadeUp', d: 100, m: 'label' }),
        T('Три шедеври', 260, 160, 1400, 120, { font: 'Playfair Display', size: 84, weight: 500, color: IV, color2: G2, gradAngle: 180, align: 'center' }, { a: 'fadeUp', d: 200, m: 'title' }),
        ...[['venus', 'Народження Венери', 'Боттічеллі · 1485'], ['milkmaid', 'Молочниця', 'Вермеєр · 1658'], ['rembrandt', 'Автопортрет', 'Рембрандт · 1659']].flatMap(([p, n, d], i) => {
          const x = 300 + i * 470;
          return [
            I(p, x, 320, 380, 520, { mask: 'arch', borderWidth: 3, borderColor: G1, innerLine: true, innerInset: 10, shadow: true, filter: 'warm', pos: '50% 15%' }, { a: 'fadeUp', d: 450 + i * 220, ax: { dur: 1100 }, m: i === 1 ? 'p1' : undefined }),
            T(n, x - 40, 870, 460, 50, { font: 'Playfair Display', size: 38, italic: true, color: G2, align: 'center' }, { a: 'fadeUp', d: 800 + i * 220 }),
            T(d, x - 40, 925, 460, 40, { font: 'Montserrat', size: 18, weight: 600, color: G1, ls: .3, align: 'center' }, { op: .8, a: 'fadeUp', d: 950 + i * 220 })
          ];
        })
      ], bg(), 'morph', 'Коротко про кожен портрет.'),
      slide([
        frame(),
        label('У цифрах', 360, 170, 1200, { align: 'center', a: 'fadeUp', d: 100, m: 'label' }),
        T('Епоха в числах', 260, 210, 1400, 120, { font: 'Playfair Display', size: 84, weight: 500, color: IV, color2: G2, gradAngle: 180, align: 'center' }, { a: 'fadeUp', d: 200, m: 'title' }),
        ...[['600', 'років історії живопису'], ['3', 'великі майстри'], ['1 500+', 'полотен у музеях світу']].flatMap(([v, l], i) => {
          const x = 200 + i * 520;
          return [
            T(v, x - 20, 430, 520, 190, { font: 'Playfair Display', size: 150, weight: 600, color: G2, color2: G1, gradAngle: 180, align: 'center', lh: 1 }, { a: 'counter', d: 500 + i * 250, ax: { dur: 2200 } }),
            L(x + 140, 660, 160, { stroke: BR, strokeWidth: 3, ends: 'dot' }, { a: 'draw', d: 900 + i * 250 }),
            T(l, x, 700, 440, 80, { font: 'Montserrat', size: 22, weight: 500, color: IV, ls: .2, upper: true, align: 'center', lh: 1.5 }, { op: .75, a: 'fadeUp', d: 1100 + i * 250 })
          ];
        })
      ], bg('#1f140c'), 'morph', 'Числа анімуються лічильником — достатньо написати число в тексті.'),
      slide([
        frame(),
        T('“', 860, 120, 200, 260, { font: 'Playfair Display', size: 320, color: BR, align: 'center', lh: 1 }, { a: 'scaleIn', d: 200, m: 'label' }),
        T('Мистецтво — це брехня, яка допомагає нам зрозуміти правду.', 260, 380, 1400, 280, { font: 'Cormorant Garamond', size: 76, italic: true, weight: 500, color: IV, align: 'center', lh: 1.3 }, { a: 'stagger', d: 600, m: 'title' }),
        L(810, 720, 300, { stroke: G1, strokeWidth: 2, fade: true, ends: 'diamond' }, { a: 'draw', d: 1500, m: 'rule' }),
        T('Пабло Пікассо', 460, 760, 1000, 50, { font: 'Montserrat', size: 22, weight: 600, color: G1, ls: .35, upper: true, align: 'center' }, { a: 'fadeUp', d: 1800, m: 'author' })
      ], { color: BG, grad: 'radial', color2: '#3a0f17', cx: 50, cy: 45, grain: true, vignette: true }, 'morph', 'Пауза після цитати.'),
      slide([
        frame(),
        S('arch', 760, 150, 400, 520, { fill: 'none', stroke: G1, strokeWidth: 1.5, strokeOpacity: .35 }, { a: 'draw', d: 200, ax: { dur: 1800 }, m: 'archline' }),
        T('Дякую за увагу', 160, 380, 1600, 200, { font: 'Playfair Display', size: 140, weight: 500, color: IV, color2: G2, gradAngle: 180, align: 'center' }, { a: 'shine', d: 300, m: 'title' }),
        L(700, 610, 520, { stroke: G1, strokeWidth: 2, fade: true, ends: 'diamond' }, { a: 'draw', d: 700, m: 'rule' }),
        T('Запитання?', 460, 650, 1000, 80, { font: 'Cormorant Garamond', size: 54, italic: true, color: G2, align: 'center' }, { a: 'fadeUp', d: 1000, m: 'sub' })
      ], { ...bg(), fx: 'particles', fxColor: G2, fxColor2: G1 }, 'morph', 'Подякуйте та запросіть до запитань.', { confetti: true, confettiColors: [G1, G2, IV, BR] })
    ], { monalisa: LIBP('monalisa'), venus: LIBP('venus'), milkmaid: LIBP('milkmaid'), rembrandt: LIBP('rembrandt') });
  }

  // ================= 2. SaaS Мінімал =================
  function saas() {
    const BG = '#050507', V = '#7c5cff', C = '#22d3ee', P = '#f472b6', TX = '#f4f4f5', MU = '#a1a1aa';
    const bg = { color: BG, grad: 'radial', color2: '#0d0b1f', cx: 50, cy: 0, grain: false, vignette: false };
    const glows = (o = {}) => [
      S('glow', -200 + (o.dx || 0), -260, 1000, 900, { fill: V, fillOpacity: .55, blur: 70 }, { a: 'float', d: 0, m: 'glowA' }),
      S('glow', 1200 - (o.dx || 0), 420, 900, 800, { fill: C, fillOpacity: .32, blur: 80 }, { a: 'float', d: 400, m: 'glowB' })
    ];
    const pill = (t, x, y, w, o = {}) => [
      S('glass', x, y, w, 56, { fill: '#ffffff', fillOpacity: .06, stroke: '#ffffff', strokeOpacity: .16, strokeWidth: 1, radius: 28 }, { a: 'scaleIn', d: o.d || 0, m: o.m ? o.m + 'b' : undefined }),
      T(t, x, y, w, 56, { font: 'Inter', size: 22, weight: 500, color: '#d4d4f8', align: 'center', valign: 'middle', ls: .02 }, { a: 'fadeUp', d: (o.d || 0) + 100, m: o.m })
    ];
    const H = (t, y, o = {}) => T(t, 160, y, 1600, o.h || 130, { font: 'Inter', size: o.size || 88, weight: 700, color: '#ffffff', color2: '#a5b4fc', gradAngle: 180, align: 'center', ls: -.03, lh: 1.05 }, { a: o.a || 'fadeUp', d: o.d ?? 200, m: o.m || 'hero' });
    return project('SaaS Мінімал', { name: 'saas', colors: [BG, V, C, P, TX, MU] }, [
      slide([
        ...glows(),
        ...pill('✦  Новий реліз · 2026', 760, 250, 400, { d: 200, m: 'pill' }),
        H('Презентуйте ідеї\nбез зусиль.', 340, { size: 128, h: 290, d: 400 }),
        T('Анімації, переходи та шаблони — щоб кожен слайд виглядав як продукт світового рівня.', 460, 660, 1000, 110, { font: 'Inter', size: 32, color: MU, align: 'center', lh: 1.45 }, { a: 'stagger', d: 900, m: 'subtitle' }),
        S('rect', 700, 830, 240, 72, { fill: '#ffffff', radius: 36 }, { a: 'scaleIn', d: 1400, m: 'btn1' }),
        T('Почати  →', 700, 830, 240, 72, { font: 'Inter', size: 24, weight: 600, color: '#09090b', align: 'center', valign: 'middle' }, { a: 'fadeUp', d: 1450, m: 'btn1t' }),
        S('glass', 970, 830, 250, 72, { fill: '#ffffff', fillOpacity: .05, strokeOpacity: .2, strokeWidth: 1, radius: 36 }, { a: 'scaleIn', d: 1550, m: 'btn2' }),
        T('Демо', 970, 830, 250, 72, { font: 'Inter', size: 24, weight: 600, color: TX, align: 'center', valign: 'middle' }, { a: 'fadeUp', d: 1600, m: 'btn2t' })
      ], { ...bg, fx: 'grid', fxColor: V }, 'fade', 'Головна ідея за 10 секунд.'),
      slide([
        ...glows({ dx: 300 }),
        ...pill('Можливості', 810, 130, 300, { d: 0, m: 'pill' }),
        H('Усе, що потрібно', 210, { size: 84, d: 100 }),
        ...[['Швидко', 'Створюйте слайди із шаблонів за хвилини, а не години.', V], ['Живо', 'SaaS-анімації: fade-up, лічильники, shine та morph.', C], ['Скрізь', 'Експорт у PDF та автономний HTML з анімаціями.', P]].flatMap(([t, d, c], i) => {
          const x = 180 + i * 540;
          return [
            S('glass', x, 420, 500, 440, { fill: '#ffffff', fillOpacity: .045, strokeOpacity: .12, strokeWidth: 1, radius: 32 }, { a: 'scaleIn', d: 400 + i * 180 }),
            Ic(['rocket', 'sparkle', 'globe'][i], x + 50, 462, 96, { color: c, shape: 'rounded', bg: c, bgOpacity: .14, glow: true }, { a: 'bounceIn', d: 600 + i * 180 }),
            T(t, x + 50, 600, 400, 60, { font: 'Inter', size: 40, weight: 700, color: TX, ls: -.02 }, { a: 'fadeUp', d: 700 + i * 180 }),
            T(d, x + 50, 670, 400, 150, { font: 'Inter', size: 26, color: MU, lh: 1.5 }, { a: 'fadeUp', d: 800 + i * 180 })
          ];
        })
      ], bg, 'morph', 'Три головні переваги.'),
      slide([
        ...glows({ dx: -150 }),
        ...pill('Результати', 810, 150, 300, { d: 0, m: 'pill' }),
        H('Цифри говорять самі', 230, { size: 84, d: 100 }),
        ...[['99,9%', 'аптайм'], ['2 400 000', 'переглядів слайдів'], ['120+', 'країн']].flatMap(([v, l], i) => {
          const x = 160 + i * 540;
          return [
            T(v, x, 470, 520, 170, { font: 'Inter', size: i === 1 ? 104 : 140, weight: 800, color: '#ffffff', color2: [V, C, P][i], gradAngle: 180, align: 'center', ls: -.04, valign: 'middle', lh: 1 }, { a: 'counter', d: 400 + i * 200, ax: { dur: 2400 } }),
            T(l, x, 660, 520, 50, { font: 'Inter', size: 26, weight: 500, color: MU, align: 'center', upper: true, ls: .16 }, { a: 'fadeUp', d: 700 + i * 200 })
          ];
        }),
        L(380, 820, 1160, { stroke: '#ffffff', strokeOpacity: .25, strokeWidth: 1.5, fade: true }, { a: 'draw', d: 1300 })
      ], bg, 'morph', 'Лічильники рахують від нуля.'),
      slide([
        ...glows({ dx: 200 }),
        ...pill('Дорожня карта', 785, 150, 350, { d: 0, m: 'pill' }),
        H('Що далі', 230, { size: 84, d: 100 }),
        L(240, 600, 1440, { stroke: V, color2: C, strokeWidth: 4, fade: true, ends: 'none' }, { a: 'draw', d: 400, ax: { dur: 1400 } }),
        ...[['Q1', 'Ідея'], ['Q2', 'Прототип'], ['Q3', 'Запуск'], ['Q4', 'Масштаб']].flatMap(([q, t], i) => {
          const x = 300 + i * 440;
          return [
            S('ellipse', x - 18, 582, 36, 36, { fill: '#ffffff', stroke: [V, '#9b8cff', '#5fb6f0', C][i], strokeWidth: 6 }, { a: 'scaleIn', d: 900 + i * 220 }),
            T(q, x - 150, 470, 300, 60, { font: 'Inter', size: 30, weight: 700, color: [V, '#9b8cff', '#5fb6f0', C][i], align: 'center' }, { a: 'fadeUp', d: 1000 + i * 220 }),
            T(t, x - 150, 650, 300, 60, { font: 'Inter', size: 34, weight: 600, color: TX, align: 'center' }, { a: 'fadeUp', d: 1100 + i * 220 })
          ];
        })
      ], bg, 'morph', 'Етапи та терміни.'),
      slide([
        ...glows(),
        H('Дякуємо!', 380, { size: 180, h: 220, d: 200, a: 'shine' }),
        T('hello@yourproduct.app', 460, 640, 1000, 60, { font: 'Inter', size: 34, color: MU, align: 'center' }, { a: 'fadeUp', d: 700, m: 'subtitle' })
      ], { ...bg, fx: 'particles', fxColor: V, fxColor2: C }, 'morph', 'Контакти та заклик до дії.', { confetti: true })
    ]);
  }

  // ================= 3. Бордовий журнал =================
  function journal() {
    const BG = '#3d0b14', BR2 = '#6e1726', CR = '#f3e9dc', GD = '#d9b26f';
    const bg = { color: BG, grad: 'radial', color2: BR2, cx: 30, cy: 30, grain: true, vignette: false };
    const kicker = (t, x, y, w, o = {}) => T(t, x, y, w, 36, { font: 'Raleway', size: 20, weight: 700, color: GD, ls: .4, upper: true, align: o.align || 'left' }, o);
    return project('Бордовий журнал', { name: 'journal', colors: [BG, BR2, CR, GD, '#1a0508', '#b23a48'] }, [
      slide([
        kicker('Випуск №01 · Осінь 2026', 120, 90, 800, { a: 'fadeUp', d: 200, m: 'kick' }),
        T('Aurea · Magazine', 1200, 90, 600, 36, { font: 'Raleway', size: 20, weight: 600, color: CR, ls: .3, upper: true, align: 'right' }, { op: .6, a: 'fadeUp', d: 300, m: 'mast' }),
        L(120, 150, 1680, { stroke: CR, strokeOpacity: .35, strokeWidth: 1.5 }, { a: 'draw', d: 300, m: 'rule' }),
        T('Мистецтво\nдеталей', 110, 230, 1000, 520, { font: 'Playfair Display', size: 190, weight: 500, italic: true, color: CR, lh: .98, ls: -.02 }, { a: 'stagger', d: 600, m: 'title' }),
        T('Велика розмова про світло, колір і тишу на полотнах старих майстрів.', 120, 790, 760, 140, { font: 'Lora', size: 34, color: CR, lh: 1.45 }, { op: .85, a: 'fadeUp', d: 1300, m: 'lead' }),
        S('rect', 1150, 220, 640, 760, { fill: GD, fillOpacity: .9, radius: 4 }, { a: 'slideLeft', d: 300, m: 'imgbg', rot: 3 }),
        I('kiss', 1130, 200, 640, 760, { radius: 4, mask: 'rounded', shadow: true, pos: '50% 18%' }, { a: 'blurIn', d: 500, m: 'img' }),
        T('Г. Клімт, «Поцілунок», 1908 · Wikimedia Commons, суспільне надбання', 1130, 985, 640, 30, { font: 'Raleway', size: 14, color: CR, ls: .1 }, { op: .5, a: 'fadeUp', d: 1500, m: 'cap' })
      ], bg, 'fade', 'Обкладинка номера.'),
      slide([
        kicker('Розділ 01', 120, 90, 800, { a: 'fadeUp', d: 100, m: 'kick' }),
        L(120, 150, 1680, { stroke: CR, strokeOpacity: .35, strokeWidth: 1.5 }, { a: 'none', m: 'rule' }),
        T('01', 100, 170, 600, 340, { font: 'Playfair Display', size: 330, weight: 700, italic: true, color: GD, color2: '#8a5a2b', gradAngle: 180, lh: 1 }, { a: 'scaleIn', d: 200 }),
        T('Світло як\nголовний герой', 120, 520, 800, 240, { font: 'Playfair Display', size: 88, weight: 500, italic: true, color: CR, lh: 1.05 }, { a: 'fadeUp', d: 400, m: 'title' }),
        T('Перший абзац статті: опишіть головну думку розділу. Журнальна верстка любить короткі речення, великі відступи та виразний заголовок.', 120, 800, 760, 200, { font: 'Lora', size: 28, color: CR, lh: 1.6 }, { op: .85, a: 'fadeUp', d: 700, m: 'lead' }),
        I('shalott', 1050, 200, 760, 800, { radius: 4, mask: 'rounded', filter: 'warm', pos: '62% 50%', shadow: true }, { a: 'kenburns', d: 200, m: 'img' }),
        S('rect', 1050, 200, 760, 800, { fill: BG, fillOpacity: .25, radius: 4 }, { a: 'none' })
      ], bg, 'morph', ''),
      slide([
        T('«', 120, 140, 300, 300, { font: 'Playfair Display', size: 360, color: GD, lh: 1 }, { a: 'scaleIn', d: 100, m: 'kick' }),
        T('Деталь — це не дрібниця. Це місце, де живе задум.', 320, 300, 1300, 420, { font: 'Playfair Display', size: 104, weight: 500, italic: true, color: CR, lh: 1.15 }, { a: 'stagger', d: 400, m: 'title' }),
        L(330, 780, 220, { stroke: GD, strokeWidth: 3 }, { a: 'draw', d: 1300, m: 'rule' }),
        T('Редакція Aurea', 330, 810, 800, 50, { font: 'Raleway', size: 24, weight: 700, color: GD, ls: .3, upper: true }, { a: 'fadeUp', d: 1500, m: 'lead' })
      ], { color: '#1a0508', grad: 'radial', color2: BG, cx: 70, cy: 60, grain: true }, 'morph', ''),
      slide([
        kicker('У номері', 120, 90, 800, { a: 'fadeUp', d: 100, m: 'kick' }),
        L(120, 150, 1680, { stroke: CR, strokeOpacity: .35, strokeWidth: 1.5 }, { a: 'draw', d: 100, m: 'rule' }),
        ...[['24', 'сторінки ілюстрацій'], ['7', 'інтерв\'ю з митцями'], ['350', 'років історії']].flatMap(([v, l], i) => {
          const x = 120 + i * 580;
          return [
            T(v, x, 280, 520, 280, { font: 'Playfair Display', size: 260, weight: 600, italic: true, color: GD, lh: 1 }, { a: 'counter', d: 300 + i * 250, ax: { dur: 2000 } }),
            L(x, 600, 480, { stroke: CR, strokeOpacity: .4, strokeWidth: 1.5 }, { a: 'draw', d: 600 + i * 250 }),
            T(l, x, 630, 480, 110, { font: 'Lora', size: 36, italic: true, color: CR, lh: 1.3 }, { a: 'fadeUp', d: 800 + i * 250 })
          ];
        }),
        T('Дякуємо за прочитання', 120, 880, 1200, 80, { font: 'Playfair Display', size: 56, italic: true, color: CR }, { a: 'shine', d: 1600, m: 'title' })
      ], bg, 'morph', '')
    ], { kiss: LIBP('kiss'), shalott: LIBP('shalott') });
  }

  // ================= 4. Аврора =================
  function aurora() {
    const BG = '#04060d', TX = '#eef2ff';
    const bg = { color: BG, grad: 'linear', color2: '#0b1020', angle: 160, grain: true };
    const blobs = (k = 0) => [
      S('blob', 900 - k * 200, -240 + k * 60, 1100, 900, { fill: '#22d3ee', color2: '#6366f1', gradAngle: 135, fillOpacity: .55 }, { a: 'float', d: 0, m: 'b1', rot: 12 + k * 30 }),
      S('blob', -260 + k * 300, 520 - k * 80, 1000, 800, { fill: '#a855f7', color2: '#ec4899', gradAngle: 45, fillOpacity: .45 }, { a: 'float', d: 600, m: 'b2', rot: -20 + k * 25 }),
      S('glass', 0, 0, 1920, 1080, { fill: '#04060d', fillOpacity: .25, strokeWidth: 0, radius: 0, blur: 90 }, { m: 'veil' })
    ];
    return project('Аврора', { name: 'aurora', colors: [BG, '#22d3ee', '#6366f1', '#a855f7', '#ec4899', TX] }, [
      slide([
        ...blobs(0),
        T('AURORA', 160, 300, 1600, 280, { font: 'Unbounded', size: 230, weight: 800, color: TX, align: 'center', ls: .04, lh: 1 }, { a: 'blurIn', d: 300, m: 'title' }),
        T('Назва вашого проєкту · 2026', 360, 620, 1200, 60, { font: 'Onest', size: 36, weight: 500, color: TX, align: 'center', ls: .1 }, { op: .8, a: 'stagger', d: 1000, m: 'sub' })
      ], { ...bg, fx: 'stars' }, 'fade'),
      slide([
        ...blobs(1),
        T('Ідея', 160, 200, 900, 180, { font: 'Unbounded', size: 140, weight: 800, color: TX, lh: 1 }, { a: 'fadeUp', d: 200, m: 'title' }),
        T('Опишіть головну думку. Великі кольорові форми плавно перетікають між слайдами завдяки morph-переходу.', 160, 430, 900, 260, { font: 'Onest', size: 40, color: TX, lh: 1.45 }, { op: .85, a: 'stagger', d: 500, m: 'sub' }),
        S('glass', 1180, 260, 560, 560, { fill: '#ffffff', fillOpacity: .06, strokeOpacity: .2, strokeWidth: 1, radius: 48 }, { a: 'scaleIn', d: 600 }),
        T('87%', 1180, 380, 560, 200, { font: 'Unbounded', size: 150, weight: 800, color: '#ffffff', color2: '#67e8f9', gradAngle: 180, align: 'center', lh: 1 }, { a: 'counter', d: 800 }),
        T('учасників у захваті', 1180, 600, 560, 60, { font: 'Onest', size: 30, color: TX, align: 'center' }, { op: .75, a: 'fadeUp', d: 1000 })
      ], bg, 'morph'),
      slide([
        ...blobs(2),
        T('Дякую', 160, 380, 1600, 240, { font: 'Unbounded', size: 200, weight: 800, color: '#ffffff', color2: '#c4b5fd', gradAngle: 180, align: 'center', lh: 1 }, { a: 'shine', d: 200, m: 'title' }),
        T('Запитання вітаються', 360, 660, 1200, 60, { font: 'Onest', size: 36, color: TX, align: 'center' }, { op: .8, a: 'fadeUp', d: 700, m: 'sub' })
      ], bg, 'morph')
    ]);
  }

  // ================= 5. Чистий аркуш =================
  function paper() {
    const BG = '#f6f4ef', TX = '#16130f', AC = '#e2552c', MU = '#6b655c';
    const bg = { color: BG, grain: true };
    return project('Чистий аркуш', { name: 'paper', colors: [BG, TX, AC, MU, '#ffffff', '#2b59c3'] }, [
      slide([
        S('ellipse', 1380, 140, 360, 360, { fill: AC }, { a: 'scaleIn', d: 200, m: 'dot' }),
        T('Проста ідея,\nсильна подача', 140, 330, 1300, 420, { font: 'Manrope', size: 150, weight: 800, color: TX, lh: 1, ls: -.035 }, { a: 'stagger', d: 400, m: 'title' }),
        L(150, 820, 260, { stroke: TX, strokeWidth: 4 }, { a: 'draw', d: 1200, m: 'rule' }),
        T('Ім\'я доповідача · Дата', 150, 860, 900, 50, { font: 'Manrope', size: 30, weight: 500, color: MU }, { a: 'fadeUp', d: 1400, m: 'sub' })
      ], bg, 'fade'),
      slide([
        S('ellipse', 1500, 760, 160, 160, { fill: AC }, { a: 'none', m: 'dot' }),
        T('Три кроки', 140, 120, 1300, 160, { font: 'Manrope', size: 110, weight: 800, color: TX, ls: -.03 }, { a: 'fadeUp', d: 100, m: 'title' }),
        L(150, 300, 260, { stroke: TX, strokeWidth: 4 }, { a: 'none', m: 'rule' }),
        ...['Зрозумійте аудиторію', 'Розкажіть історію', 'Залиште один висновок'].flatMap((t, i) => [
          T('0' + (i + 1), 150, 380 + i * 170, 140, 120, { font: 'Manrope', size: 80, weight: 800, color: AC }, { a: 'scaleIn', d: 400 + i * 250 }),
          T(t, 330, 395 + i * 170, 1100, 100, { font: 'Manrope', size: 56, weight: 600, color: TX, ls: -.02 }, { a: 'fadeUp', d: 500 + i * 250 })
        ])
      ], bg, 'morph'),
      slide([
        S('ellipse', 760, 240, 400, 400, { fill: AC }, { a: 'none', m: 'dot' }),
        T('Дякую!', 160, 700, 1600, 180, { font: 'Manrope', size: 150, weight: 800, color: TX, align: 'center', ls: -.035 }, { a: 'fadeUp', d: 300, m: 'title' })
      ], bg, 'morph')
    ]);
  }

  // ================= 6. Космос =================
  function cosmos() {
    const BG = '#02030a', TX = '#eef2ff', MU = '#9aa3c7', A1 = '#7dd3fc', A2 = '#a78bfa', A3 = '#f0abfc';
    const bg = { color: BG, grad: 'radial', color2: '#0b1030', cx: 70, cy: 30, fx: 'stars' };
    const label = (t, y, o = {}) => T(t, 160, y, 900, 40, { font: 'Onest', size: 22, weight: 600, color: A1, ls: .4, upper: true }, { a: 'fadeUp', d: 100, m: 'label', ...o });
    return project('Космос', { name: 'cosmos', colors: [BG, A1, A2, A3, TX, MU] }, [
      slide([
        S('glow', 980, 40, 1100, 1100, { fill: A1, fillOpacity: .35, blur: 90 }, { a: 'pulse', d: 0, m: 'glow' }),
        I('earth', 1000, 80, 920, 920, { blend: 'screen', mask: 'circle', fit: 'contain', pos: '50% 50%' }, { a: 'kenburns', d: 200, m: 'planet' }),
        label('Проєкт з астрономії', 300),
        T('КОСМОС', 150, 350, 1200, 200, { font: 'Unbounded', size: 168, weight: 800, color: '#ffffff', color2: A2, gradAngle: 180, ls: .02, lh: 1 }, { a: 'letters', d: 400, m: 'title' }),
        T('Подорож від Землі до зірок', 160, 600, 900, 70, { font: 'Onest', size: 44, color: TX }, { op: .9, a: 'typewriter', d: 1300, ax: { dur: 1400 }, m: 'sub' }),
        T('Ім\'я · Клас · Школа', 160, 900, 800, 40, { font: 'Onest', size: 22, weight: 500, color: MU, ls: .2, upper: true }, { a: 'fadeUp', d: 2400, m: 'author' })
      ], bg, 'fade', 'Привітання й тема.'),
      slide([
        S('glow', 1200, -200, 900, 900, { fill: A2, fillOpacity: .3, blur: 90 }, { a: 'pulse', m: 'glow' }),
        I('earth', 1480, 600, 420, 420, { blend: 'screen', mask: 'circle', fit: 'contain', pos: '50% 50%' }, { a: 'none', m: 'planet' }),
        label('Розділ 1', 170),
        T('Стовпи творення', 160, 220, 1100, 140, { font: 'Unbounded', size: 92, weight: 700, color: '#ffffff' }, { a: 'maskUp', d: 200, m: 'title' }),
        T('Газові хмари в туманності Орла, де народжуються нові зорі. Висота найбільшого стовпа — близько чотирьох світлових років.', 160, 400, 980, 220, { font: 'Onest', size: 36, color: TX, lh: 1.5 }, { op: .88, a: 'stagger', d: 600, m: 'sub' }),
        ...[['rocket', 'Запуск', A1], ['globe', 'Орбіта', A2], ['star', 'Зорі', A3]].flatMap(([ic, t, c], i) => [
          Ic(ic, 160 + i * 230, 700, 120, { color: c, shape: 'circle', bg: c, bgOpacity: .12, glow: true }, { a: 'bounceIn', d: 1100 + i * 200 }),
          T(t, 130 + i * 230, 836, 180, 40, { font: 'Onest', size: 24, weight: 600, color: TX, align: 'center' }, { a: 'fadeUp', d: 1250 + i * 200 })
        ]),
        T('NASA/ESA/Hubble · суспільне надбання', 1300, 1010, 560, 30, { font: 'Onest', size: 15, color: MU, align: 'right' }, { op: .6, a: 'fadeUp', d: 1500 })
      ], { ...bg, image: 'pillars', imageOpacity: .45, fx: 'stars' }, 'morph', 'Фон — справжнє фото телескопа «Габбл».'),
      slide([
        label('У цифрах', 120),
        T('Планети земної групи', 160, 170, 1300, 120, { font: 'Unbounded', size: 72, weight: 700, color: '#ffffff' }, { a: 'fadeUp', d: 150, m: 'title' }),
        C('bar', [{ l: 'Меркурій', v: 4.9, c: '#94a3b8' }, { l: 'Венера', v: 12.1, c: '#fbbf24' }, { l: 'Земля', v: 12.7, c: A1 }, { l: 'Марс', v: 6.8, c: '#f87171' }], 160, 340, 1000, 600,
          { font: 'Onest', size: 26, color: TX, suffix: '' }, { d: 400 }),
        T('Діаметр, тис. км', 160, 960, 600, 40, { font: 'Onest', size: 22, color: MU }, { a: 'fadeUp', d: 900 }),
        C('donut', [{ l: 'Азот', v: 78, c: A1 }, { l: 'Кисень', v: 21, c: A2 }, { l: 'Інше', v: 1, c: A3 }], 1290, 380, 480, 480,
          { font: 'Onest', size: 24, color: TX, suffix: '%', centerLabel: 'азоту в повітрі' }, { d: 700 }),
        T('Склад атмосфери Землі', 1240, 900, 580, 40, { font: 'Onest', size: 22, color: MU, align: 'center' }, { a: 'fadeUp', d: 1100 })
      ], bg, 'morph', 'Діаграми ростуть і рахують значення.'),
      slide([
        S('glow', -200, 200, 900, 900, { fill: A3, fillOpacity: .25, blur: 90 }, { a: 'pulse', m: 'glow' }),
        I('aldrin', 160, 140, 620, 800, { mask: 'arch', borderWidth: 2, borderColor: A1, shadow: true, pos: '50% 35%' }, { a: 'blurIn', d: 100, m: 'planet' }),
        T('NASA, «Аполлон-11», 1969 · суспільне надбання', 160, 960, 620, 30, { font: 'Onest', size: 15, color: MU }, { op: .6, a: 'fadeUp', d: 1200 }),
        T('Цитата', 900, 300, 900, 40, { font: 'Onest', size: 22, weight: 600, color: A1, ls: .4, upper: true }, { a: 'fadeUp', d: 100, m: 'label' }),
        T('Це один маленький крок для людини, але гігантський стрибок для людства.', 900, 360, 900, 360, { font: 'Onest', size: 58, weight: 600, color: '#ffffff', lh: 1.25 }, { a: 'highlight', d: 400, ax: { color: A2 }, m: 'title' }),
        T('Ніл Армстронг', 900, 760, 600, 50, { font: 'Onest', size: 28, weight: 600, color: A1, ls: .2, upper: true }, { a: 'fadeUp', d: 1400, m: 'author' })
      ], bg, 'morph', ''),
      slide([
        S('glow', 460, 140, 1000, 800, { fill: A2, fillOpacity: .35, blur: 100 }, { a: 'pulse', m: 'glow' }),
        T('Дякую!', 160, 360, 1600, 240, { font: 'Unbounded', size: 200, weight: 800, color: '#ffffff', color2: A1, gradAngle: 180, align: 'center', lh: 1 }, { a: 'shine', d: 200, m: 'title' }),
        T('Запитання?', 460, 640, 1000, 70, { font: 'Onest', size: 44, color: TX, align: 'center' }, { op: .85, a: 'typewriter', d: 900, ax: { dur: 900 }, m: 'sub' })
      ], { ...bg, fx: 'particles', fxColor: A1, fxColor2: A3 }, 'circle', '', { confetti: true, confettiColors: [A1, A2, A3, '#ffffff'] })
    ], { earth: LIBP('earth'), pillars: LIBP('pillars'), aldrin: LIBP('aldrin') });
  }


  // ================= 8. Нічна галерея (темне мистецтво) =================
  function nightgallery() {
    const BG = '#070707', TX = '#f4efe6', MU = '#8f8a80', GD = '#d8b878', LN = '#3a3631';
    const bg = { color: BG, grad: 'radial', color2: '#1c1813', cx: 80, cy: 10, grain: true, vignette: true };
    const num = (n, t, x, y, d) => [
      T(n, x, y, 90, 50, { font: 'Prata', size: 34, color: GD }, { a: 'fadeUp', d }),
      T(t, x + 90, y + 4, 520, 50, { font: 'Cormorant Garamond', size: 36, italic: true, color: TX }, { a: 'fadeUp', d: d + 80 }),
      L(x, y + 64, 600, { stroke: LN, strokeWidth: 1.5 }, { a: 'draw', d: d + 120 })
    ];
    const card = (img, t, s, x, y, w, h, d, pos = '50% 30%') => [
      S('rect', x, y, w, h, { fill: '#141210', stroke: LN, strokeWidth: 1.5, radius: 18 }, { a: 'fadeUp', d }),
      I(img, x + 16, y + 16, w - 32, h - 120, { radius: 12, mask: 'rounded', pos, filter: 'warm' }, { a: 'kenburns', d: d + 100 }),
      T(t, x + 24, y + h - 96, w - 48, 44, { font: 'Prata', size: 28, color: TX }, { a: 'fadeUp', d: d + 200 }),
      T(s, x + 24, y + h - 50, w - 48, 30, { font: 'Montserrat', size: 15, weight: 600, color: GD, ls: .25, upper: true }, { a: 'fadeUp', d: d + 260 })
    ];
    return project('Нічна галерея', { name: 'nightgallery', colors: [BG, GD, TX, MU, '#141210', '#7d1f2b'] }, [
      slide([
        I('lilies', 0, 0, 1020, 1080, { radius: 0, mask: 'none', filter: 'dim', pos: '30% 50%' }, { a: 'kenburns', d: 0, m: 'hero' }),
        S('rect', 1020, 0, 900, 1080, { fill: BG, radius: 0 }, { a: 'none', m: 'panel' }),
        T('ВІЛЬНА ЕКСПОЗИЦІЯ', 1120, 200, 700, 40, { font: 'Montserrat', size: 18, weight: 600, color: GD, ls: .5 }, { a: 'fadeUp', d: 300, m: 'label' }),
        T('Мистецтво\nночі', 1100, 270, 800, 400, { font: 'Prata', size: 124, color: TX, lh: 1, ls: -.02 }, { a: 'maskUp', d: 500, m: 'title' }),
        L(1120, 720, 260, { stroke: GD, strokeWidth: 2, ends: 'diamond' }, { a: 'draw', d: 1100, m: 'rule' }),
        T('Колір, світло й тиша на полотнах великих майстрів', 1120, 760, 640, 120, { font: 'Cormorant Garamond', size: 38, italic: true, color: MU, lh: 1.3 }, { a: 'fadeUp', d: 1300, m: 'sub' }),
        T('К. Моне, «Водяні лілії» · суспільне надбання', 40, 1030, 700, 30, { font: 'Montserrat', size: 14, color: TX }, { op: .5, a: 'fadeUp', d: 1600 })
      ], bg, 'fade', 'Обкладинка: велике полотно ліворуч, заголовок праворуч.'),
      slide([
        T('Зміст', 140, 130, 600, 120, { font: 'Prata', size: 96, color: TX }, { a: 'fadeUp', d: 100, m: 'title' }),
        T('ПРОГРАМА ВЕЧОРА', 145, 260, 600, 36, { font: 'Montserrat', size: 17, weight: 600, color: GD, ls: .5 }, { a: 'fadeUp', d: 200, m: 'label' }),
        ...num('01', 'Вступ і контекст епохи', 145, 380, 400),
        ...num('02', 'Імпресіонізм і світло', 145, 480, 520),
        ...num('03', 'Портрет як історія', 145, 580, 640),
        ...num('04', 'Нічне небо Ван Гога', 145, 680, 760),
        ...num('05', 'Висновки та запитання', 145, 780, 880),
        I('starry', 900, 130, 880, 820, { radius: 22, mask: 'rounded', pos: '50% 40%', shadow: true }, { a: 'blurIn', d: 300, m: 'hero' }),
        T('В. ван Гог, «Зоряна ніч», 1889 · суспільне надбання', 900, 970, 880, 30, { font: 'Montserrat', size: 14, color: TX, align: 'right' }, { op: .5, a: 'fadeUp', d: 1200 })
      ], bg, 'morph', 'Нумерований зміст із тонкими лініями.'),
      slide([
        T('Три настрої', 140, 110, 1200, 110, { font: 'Prata', size: 80, color: TX }, { a: 'fadeUp', d: 100, m: 'title' }),
        T('КОЛЕКЦІЯ', 145, 225, 600, 36, { font: 'Montserrat', size: 17, weight: 600, color: GD, ls: .5 }, { a: 'fadeUp', d: 200, m: 'label' }),
        ...card('pearl', 'Перлина', 'Вермеєр · 1665', 140, 310, 520, 680, 300, '50% 25%'),
        ...card('wave', 'Хвиля', 'Хокусай · 1831', 700, 310, 520, 680, 500, '65% 50%'),
        ...card('rembrandt', 'Автопортрет', 'Рембрандт · 1659', 1260, 310, 520, 680, 700, '50% 25%')
      ], bg, 'morph', 'Картки-«вітрини» з’являються по черзі.'),
      slide([
        I('pearl', 1000, 0, 920, 1080, { radius: 0, mask: 'none', pos: '50% 30%', filter: 'warm' }, { a: 'kenburns', d: 0, m: 'hero' }),
        S('rect', 0, 0, 1000, 1080, { fill: BG, radius: 0 }, { a: 'none', m: 'panel' }),
        T('«', 120, 160, 200, 200, { font: 'Prata', size: 240, color: GD, lh: 1 }, { a: 'scaleIn', d: 200 }),
        T('Мистецтво — це не те, що ти бачиш, а те, що ти змушуєш побачити інших.', 140, 380, 780, 360, { font: 'Cormorant Garamond', size: 58, italic: true, color: TX, lh: 1.25 }, { a: 'stagger', d: 400, m: 'title' }),
        T('ЕДГАР ДЕГА', 145, 800, 600, 40, { font: 'Montserrat', size: 20, weight: 600, color: GD, ls: .4 }, { a: 'fadeUp', d: 1400, m: 'label' })
      ], bg, 'morph', 'Цитата поруч із портретом.'),
      slide([
        S('glow', 560, 240, 800, 600, { fill: GD, fillOpacity: .18, blur: 110 }, { a: 'pulse', m: 'glow' }),
        T('Дякую', 160, 330, 1600, 260, { font: 'Prata', size: 210, color: TX, color2: GD, gradAngle: 180, align: 'center', lh: 1 }, { a: 'shine', d: 200, m: 'title' }),
        T('за увагу та цікавість до мистецтва', 360, 640, 1200, 60, { font: 'Cormorant Garamond', size: 42, italic: true, color: MU, align: 'center' }, { a: 'fadeUp', d: 900, m: 'sub' })
      ], { ...bg, fx: 'particles', fxColor: GD, fxColor2: '#ffffff' }, 'fade', '')
    ], { lilies: LIBP('lilies'), starry: LIBP('starry'), pearl: LIBP('pearl'), wave: LIBP('wave'), rembrandt: LIBP('rembrandt') });
  }

  // ================= 9. Червоний пітч (бізнес) =================
  function redpitch() {
    const BG = '#0a0a0a', RD = '#e11d2e', RD2 = '#ff5a4f', TX = '#f5f5f5', MU = '#8b8b8b', CD = '#151515';
    const bg = { color: BG, grad: 'radial', color2: '#2a0508', cx: 90, cy: 0 };
    const tag = (t, x, y, o = {}) => [
      S('rect', x, y, 18, 18, { fill: RD, radius: 3 }, { a: 'scaleIn', d: o.d || 0 }),
      T(t, x + 34, y - 8, 800, 34, { font: 'Montserrat', size: 20, weight: 700, color: TX, ls: .3, upper: true }, { a: 'fadeUp', d: (o.d || 0) + 80, m: o.m })
    ];
    const stat = (v, suf, l, x, d, accent) => [
      S('rect', x, 420, 500, 420, { fill: accent ? RD : CD, color2: accent ? '#7a0a14' : '', gradAngle: 160, stroke: '#ffffff', strokeOpacity: .08, strokeWidth: accent ? 0 : 1.5, radius: 28 }, { a: 'fadeUp', d }),
      T(v, x + 40, 470, 440, 170, { font: 'Montserrat', size: 140, weight: 800, color: '#ffffff', ls: -.04, lh: 1 }, { a: 'counter', d: d + 200, ax: { dur: 2000 } }),
      T(suf, x + 250, 500, 200, 100, { font: 'Montserrat', size: 80, weight: 700, color: accent ? '#ffffff' : RD2 }, { a: 'fadeUp', d: d + 400 }),
      T(l, x + 40, 720, 420, 90, { font: 'Inter', size: 24, color: accent ? '#ffe4e4' : MU, lh: 1.35 }, { a: 'fadeUp', d: d + 500 })
    ];
    return project('Червоний пітч', { name: 'redpitch', colors: [BG, RD, RD2, TX, MU, CD] }, [
      slide([
        S('ellipse', 1180, 120, 840, 840, { fill: RD, color2: '#5b0710', gradAngle: 200 }, { a: 'scaleIn', d: 100, ax: { dur: 1400 }, m: 'disc' }),
        S('glow', 1100, 60, 1000, 1000, { fill: RD, fillOpacity: .35, blur: 120 }, { a: 'pulse', m: 'glow' }),
        ...tag('Інвестиційна презентація · 2026', 140, 150, { d: 200, m: 'label' }),
        T('Прискорюємо\nстале\nзростання', 130, 260, 1100, 560, { font: 'Montserrat', size: 128, weight: 800, color: '#ffffff', lh: 1, ls: -.03 }, { a: 'maskUp', d: 400, m: 'title' }),
        T('Стратегія, цифри й наступні кроки — коротко та по суті.', 140, 860, 900, 60, { font: 'Inter', size: 32, color: MU }, { a: 'fadeUp', d: 1300, m: 'sub' }),
        T('2026', 1310, 430, 600, 220, { font: 'Montserrat', size: 220, weight: 800, color: '#ffffff', effect: 'outline', lh: 1 }, { op: .55, a: 'blurIn', d: 900, m: 'year' })
      ], bg, 'fade', 'Обкладинка: великий червоний диск і жирний заголовок.'),
      slide([
        ...tag('Ключові показники', 140, 160, { d: 0, m: 'label' }),
        T('Цифри, що говорять', 130, 210, 1400, 130, { font: 'Montserrat', size: 84, weight: 800, color: '#ffffff', ls: -.03 }, { a: 'fadeUp', d: 100, m: 'title' }),
        ...stat('51', '%', 'зростання виручки за рік', 140, 300, true),
        ...stat('48', '%', 'нових клієнтів з рекомендацій', 710, 500, false),
        ...stat('74', '%', 'утримання користувачів', 1280, 700, false)
      ], bg, 'morph', 'Лічильники рахують від нуля.'),
      slide([
        ...tag('Ринок і динаміка', 140, 160, { d: 0, m: 'label' }),
        T('Ринкова можливість', 130, 210, 1400, 130, { font: 'Montserrat', size: 84, weight: 800, color: '#ffffff', ls: -.03 }, { a: 'fadeUp', d: 100, m: 'title' }),
        S('rect', 140, 380, 1040, 600, { fill: CD, stroke: '#ffffff', strokeOpacity: .08, strokeWidth: 1.5, radius: 28 }, { a: 'fadeUp', d: 200 }),
        C('bar', [{ l: '2022', v: 12, c: '#3a3a3a' }, { l: '2023', v: 19, c: '#5a1a1f' }, { l: '2024', v: 28, c: '#a3141f' }, { l: '2025', v: 41, c: RD }, { l: '2026', v: 63, c: RD2 }], 190, 430, 940, 500,
          { font: 'Inter', size: 24, color: TX, suffix: ' млн' }, { d: 500 }),
        S('rect', 1230, 380, 550, 600, { fill: RD, color2: '#6d0912', gradAngle: 160, radius: 28 }, { a: 'slideLeft', d: 400 }),
        T('TAM', 1280, 430, 400, 40, { font: 'Montserrat', size: 22, weight: 700, color: '#ffe4e4', ls: .3 }, { a: 'fadeUp', d: 700 }),
        T('4,2 млрд', 1280, 480, 480, 110, { font: 'Montserrat', size: 84, weight: 800, color: '#ffffff', ls: -.03 }, { a: 'fadeUp', d: 800 }),
        T('Загальний обсяг ринку. Ми цілимося в 3 % за п’ять років — це реалістично з нашою моделлю продажів.', 1280, 620, 460, 300, { font: 'Inter', size: 26, color: '#ffe4e4', lh: 1.45 }, { a: 'stagger', d: 1000 })
      ], bg, 'morph', 'Графік зростання та обсяг ринку.'),
      slide([
        ...tag('Дорожня карта', 140, 160, { d: 0, m: 'label' }),
        T('Наступні кроки', 130, 210, 1400, 130, { font: 'Montserrat', size: 84, weight: 800, color: '#ffffff', ls: -.03 }, { a: 'fadeUp', d: 100, m: 'title' }),
        L(160, 560, 1600, { stroke: RD, color2: RD2, strokeWidth: 4, fade: true }, { a: 'draw', d: 300, ax: { dur: 1400 } }),
        ...[['Q1', 'Запуск продукту'], ['Q2', 'Нові ринки'], ['Q3', 'Партнерства'], ['Q4', 'Раунд A']].flatMap(([q, t], i) => {
          const x = 220 + i * 450;
          return [
            S('ellipse', x - 22, 538, 44, 44, { fill: i === 3 ? RD : BG, stroke: RD, strokeWidth: 6 }, { a: 'bounceIn', d: 700 + i * 200 }),
            T(q, x - 160, 440, 320, 70, { font: 'Montserrat', size: 52, weight: 800, color: '#ffffff', align: 'center' }, { a: 'fadeUp', d: 800 + i * 200 }),
            T(t, x - 180, 620, 360, 60, { font: 'Inter', size: 28, color: MU, align: 'center' }, { a: 'fadeUp', d: 900 + i * 200 })
          ];
        })
      ], bg, 'morph', 'Етапи на рік.'),
      slide([
        S('ellipse', 560, 140, 800, 800, { fill: RD, color2: '#5b0710', gradAngle: 200 }, { a: 'scaleIn', d: 0, ax: { dur: 1200 }, m: 'disc' }),
        T('Дякуємо!', 160, 400, 1600, 220, { font: 'Montserrat', size: 170, weight: 800, color: '#ffffff', align: 'center', ls: -.03, lh: 1 }, { a: 'letters', d: 300, m: 'title' }),
        T('hello@company.com', 460, 660, 1000, 60, { font: 'Inter', size: 34, color: '#ffe4e4', align: 'center' }, { a: 'fadeUp', d: 1200, m: 'sub' })
      ], bg, 'circle', '', { confetti: true, confettiColors: [RD, RD2, '#ffffff'] })
    ]);
  }

  // ================= 10. Сутінки (японські мотиви) =================
  function dusk() {
    const P1 = '#2b1638', P2 = '#a8506b', CR = '#f6eadb', RD = '#d7263d', INK = '#2a1a2e', MU = '#8a6f7f';
    const bgDark = { color: P1, grad: 'linear', angle: 180, color2: P2 };
    const bgCream = { color: CR, grad: 'radial', color2: '#fff8ef', cx: 20, cy: 10, grain: true };
    const spaced = (t, x, y, w, size, color, o = {}) => T(t, x, y, w, size * 1.3, { font: 'Philosopher', size, weight: 700, color, ls: .45, upper: true, align: o.align || 'left' }, o);
    return project('Сутінки', { name: 'dusk', colors: [P1, P2, CR, RD, INK, MU] }, [
      slide([
        S('ellipse', 1180, 150, 520, 520, { fill: RD, color2: '#ff7a59', gradAngle: 180 }, { a: 'drop', d: 200, m: 'sun' }),
        S('glow', 1080, 60, 720, 720, { fill: '#ff7a59', fillOpacity: .35, blur: 100 }, { a: 'pulse', m: 'glow' }),
        I('wave', 0, 720, 1920, 360, { radius: 0, mask: 'none', pos: '50% 62%', blend: 'luminosity', filter: 'dim' }, { op: .55, a: 'fadeUp', d: 400, m: 'wave' }),
        spaced('Сутінки', 140, 340, 1000, 112, CR, { a: 'letters', d: 500, m: 'title' }),
        T('Подорож країною світанку: традиції, природа і мистецтво', 150, 560, 900, 120, { font: 'Prata', size: 36, color: CR, lh: 1.4 }, { op: .9, a: 'fadeUp', d: 1200, m: 'sub' }),
        T('Анімований шаблон · 2026', 150, 180, 700, 40, { font: 'Montserrat', size: 18, weight: 600, color: CR, ls: .3, upper: true }, { op: .7, a: 'fadeUp', d: 300, m: 'label' })
      ], { ...bgDark, fx: 'particles', fxColor: '#ffd6c2', fxColor2: '#ffffff' }, 'fade', 'Обкладинка: сонце, хвиля Хокусая, розріджені літери.'),
      slide([
        S('ellipse', 1460, 120, 300, 300, { fill: RD }, { a: 'scaleIn', d: 100, m: 'sun' }),
        spaced('Традиції', 140, 140, 1100, 96, INK, { a: 'fadeUp', d: 100, m: 'title' }),
        L(145, 290, 220, { stroke: RD, strokeWidth: 4 }, { a: 'draw', d: 300, m: 'rule' }),
        T('Опишіть тему розділу двома-трьома реченнями. Світлий кремовий фон, червоний акцент і багато повітря — головні правила цього стилю.', 140, 340, 820, 260, { font: 'Prata', size: 32, color: INK, lh: 1.55 }, { op: .85, a: 'stagger', d: 500, m: 'sub' }),
        ...[['Чайна церемонія', 'Повільність і увага'], ['Каліграфія', 'Лінія як характер'], ['Сад каменів', 'Порожнеча як форма']].flatMap(([t, s], i) => [
          S('rect', 140 + i * 375, 680, 345, 280, { fill: '#ffffff', stroke: INK, strokeOpacity: .08, strokeWidth: 1.5, radius: 22 }, { a: 'fadeUp', d: 800 + i * 180 }),
          S('ellipse', 175 + i * 375, 715, 40, 40, { fill: RD }, { a: 'scaleIn', d: 950 + i * 180 }),
          T(t, 175 + i * 375, 790, 300, 50, { font: 'Prata', size: 32, color: INK }, { a: 'fadeUp', d: 1000 + i * 180 }),
          T(s, 175 + i * 375, 850, 300, 40, { font: 'Montserrat', size: 20, color: MU }, { a: 'fadeUp', d: 1080 + i * 180 })
        ]),
        I('wave', 1300, 470, 480, 490, { radius: 22, mask: 'rounded', pos: '65% 50%', shadow: true }, { a: 'kenburns', d: 600, m: 'wave' }),
        T('К. Хокусай, «Велика хвиля», 1831 · суспільне надбання', 1080, 975, 700, 30, { font: 'Montserrat', size: 14, color: INK, align: 'right' }, { op: .5, a: 'fadeUp', d: 1400 })
      ], bgCream, 'morph', 'Світлий слайд з картками.'),
      slide([
        S('ellipse', 760, 140, 400, 400, { fill: RD, color2: '#ff7a59', gradAngle: 180 }, { a: 'none', m: 'sun' }),
        S('glow', 660, 40, 600, 600, { fill: '#ff7a59', fillOpacity: .3, blur: 100 }, { a: 'pulse', m: 'glow' }),
        spaced('У цифрах', 360, 600, 1200, 64, CR, { align: 'center', a: 'fadeUp', d: 100, m: 'title' }),
        ...[['125', 'млн жителів'], ['6 852', 'острови'], ['3 776', 'м — висота Фудзі']].flatMap(([v, l], i) => [
          T(v, 200 + i * 520, 720, 480, 130, { font: 'Philosopher', size: 110, weight: 700, color: CR, align: 'center', lh: 1 }, { a: 'counter', d: 400 + i * 200, ax: { dur: 2000 } }),
          T(l, 200 + i * 520, 860, 480, 40, { font: 'Montserrat', size: 22, weight: 600, color: '#ffd6c2', ls: .25, upper: true, align: 'center' }, { a: 'fadeUp', d: 700 + i * 200 })
        ])
      ], bgDark, 'morph', 'Сонце «перетікає» між слайдами через morph.'),
      slide([
        S('ellipse', 760, 200, 400, 400, { fill: RD }, { a: 'none', m: 'sun' }),
        spaced('Дякую', 360, 660, 1200, 120, INK, { align: 'center', a: 'letters', d: 300, m: 'title' }),
        T('ありがとう · за увагу', 460, 850, 1000, 50, { font: 'Prata', size: 32, color: MU, align: 'center' }, { a: 'fadeUp', d: 1100, m: 'sub' })
      ], bgCream, 'morph', '', { confetti: true, confettiColors: [RD, '#ff7a59', '#f6c1c9', '#ffffff'] })
    ], { wave: LIBP('wave') });
  }

  // ================= 11. Редакція (жирний editorial) =================
  function editorial() {
    const BG = '#e9e7e2', INK = '#0d0d0d', GR = '#b9b6ae', DK = '#1c1c1c', AC = '#ff4d00';
    const bg = { color: BG, grad: 'radial', color2: '#f6f5f2', cx: 20, cy: 0, grain: true };
    const bgDark = { color: DK, grad: 'radial', color2: '#2a2a2a', cx: 80, cy: 0, grain: true };
    const meta = (l, r, dark) => [
      T(l, 80, 50, 900, 30, { font: 'Inter', size: 16, weight: 600, color: dark ? '#ffffff' : INK, ls: .2, upper: true }, { op: .7, a: 'fadeUp', d: 100, m: 'metaL' }),
      T(r, 940, 50, 900, 30, { font: 'Inter', size: 16, weight: 600, color: dark ? '#ffffff' : INK, ls: .2, upper: true, align: 'right' }, { op: .7, a: 'fadeUp', d: 150, m: 'metaR' }),
      L(80, 100, 1760, { stroke: dark ? '#ffffff' : INK, strokeOpacity: .25, strokeWidth: 1.5 }, { a: 'draw', d: 200, m: 'metaLine' })
    ];
    return project('Редакція', { name: 'editorial', colors: [BG, INK, GR, DK, AC, '#ffffff'] }, [
      slide([
        ...meta('Спецвипуск · Наука', 'Випуск 07 / 2026'),
        I('aldrin', 80, 330, 1760, 690, { radius: 0, mask: 'none', filter: 'mono', pos: '50% 30%' }, { a: 'wipeDown', d: 300, m: 'hero' }),
        T('ЛЮДИНА І МІСЯЦЬ', 60, 120, 1800, 220, { font: 'Oswald', size: 190, weight: 700, color: INK, lh: 1, ls: -.01 }, { a: 'maskUp', d: 500, m: 'title' }),
        S('rect', 1420, 840, 380, 140, { fill: AC, radius: 0 }, { a: 'slideLeft', d: 1100, m: 'chip' }),
        T('Як 1969 рік змінив уявлення про можливе', 1440, 855, 350, 120, { font: 'Inter', size: 22, weight: 700, color: '#ffffff', lh: 1.3 }, { a: 'fadeUp', d: 1300, m: 'chipT' }),
        T('Фото: NASA · суспільне надбання', 80, 1030, 600, 30, { font: 'Inter', size: 14, color: INK }, { op: .55, a: 'fadeUp', d: 1500 })
      ], bg, 'fade', 'Обкладинка: величезний заголовок над чорно-білим фото.'),
      slide([
        ...meta('Розділ 01', 'Контекст'),
        T('01', 70, 120, 600, 340, { font: 'Oswald', size: 330, weight: 700, color: INK, lh: 1 }, { a: 'scaleIn', d: 200 }),
        T('КОСМІЧНА\nГОНИТВА', 80, 480, 860, 300, { font: 'Oswald', size: 130, weight: 700, color: INK, lh: 1 }, { a: 'maskUp', d: 400, m: 'title' }),
        T('Перший абзац розділу. Тримайте текст коротким і контрастним: жирний гротеск, сірі блоки та чорно-білі фото роблять сторінку схожою на журнальний розворот.', 80, 820, 820, 200, { font: 'Inter', size: 26, color: INK, lh: 1.55 }, { op: .8, a: 'fadeUp', d: 800 }),
        S('rect', 1000, 140, 840, 880, { fill: GR, radius: 0 }, { a: 'wipeDown', d: 200, m: 'block' }),
        I('earth', 1060, 200, 720, 520, { radius: 0, mask: 'none', filter: 'mono', pos: '50% 50%' }, { a: 'fadeUp', d: 500, m: 'hero' }),
        T('«Земля з Місяця виглядала крихкою і самотньою»', 1060, 760, 720, 200, { font: 'Oswald', size: 52, weight: 500, color: INK, lh: 1.15 }, { a: 'stagger', d: 900 })
      ], bg, 'morph', 'Розворот: номер розділу, текст, сірий блок.'),
      slide([
        ...meta('Розділ 02', 'Факти', true),
        T('У ЦИФРАХ', 80, 140, 1700, 200, { font: 'Oswald', size: 180, weight: 700, color: '#ffffff', lh: 1 }, { a: 'maskUp', d: 200, m: 'title' }),
        ...[['8', 'днів тривала місія'], ['384', 'тис. км до Місяця'], ['21', 'година на поверхні'], ['600', 'млн глядачів']].flatMap(([v, l], i) => [
          L(80 + i * 445, 480, 400, { stroke: i === 0 ? AC : '#ffffff', strokeOpacity: i === 0 ? 1 : .35, strokeWidth: 3 }, { a: 'draw', d: 500 + i * 150 }),
          T(v, 80 + i * 445, 520, 400, 220, { font: 'Oswald', size: 190, weight: 700, color: i === 0 ? AC : '#ffffff', lh: 1 }, { a: 'counter', d: 600 + i * 150, ax: { dur: 1800 } }),
          T(l, 80 + i * 445, 770, 380, 80, { font: 'Inter', size: 24, weight: 600, color: '#ffffff', ls: .1, upper: true, lh: 1.3 }, { op: .7, a: 'fadeUp', d: 800 + i * 150 })
        ])
      ], bgDark, 'morph', 'Темний розворот із великими цифрами.'),
      slide([
        ...meta('Кінець номера', 'Дякуємо'),
        T('ДЯКУЄМО', 40, 300, 1840, 380, { font: 'Oswald', size: 360, weight: 700, color: INK, align: 'center', lh: 1 }, { a: 'letters', d: 200, m: 'title' }),
        S('rect', 760, 720, 400, 80, { fill: AC, radius: 0 }, { a: 'elastic', d: 1100, m: 'chip' }),
        T('Запитання?', 760, 735, 400, 60, { font: 'Inter', size: 30, weight: 700, color: '#ffffff', align: 'center' }, { a: 'fadeUp', d: 1300, m: 'chipT' })
      ], bg, 'morph', '')
    ], { aldrin: LIBP('aldrin'), earth: LIBP('earth') });
  }

  // ================= 12. Академія (тепла коричнева) =================
  function academy() {
    const BG = '#2a1d14', BG2 = '#3b2a1d', CR = '#efe3cf', TN = '#c79a62', MU = '#a8917a', CD = '#36261a';
    const bg = { color: BG, grad: 'radial', color2: BG2, cx: 15, cy: 15, grain: true, vignette: true };
    const part = (t, y = 120) => T(t, 140, y, 600, 40, { font: 'Montserrat', size: 18, weight: 600, color: TN, ls: .45, upper: true }, { a: 'fadeUp', d: 100, m: 'label' });
    return project('Академія', { name: 'academy', colors: [BG, TN, CR, MU, CD, '#7a4b2a'] }, [
      slide([
        I('rembrandt', 1060, 90, 720, 900, { mask: 'arch', pos: '50% 22%', filter: 'sepia', shadow: true }, { a: 'kenburns', d: 200, m: 'hero' }),
        S('arch', 1030, 60, 780, 960, { fill: 'none', stroke: TN, strokeWidth: 1.5, strokeOpacity: .6 }, { a: 'draw', d: 400, ax: { dur: 1600 }, m: 'arch' }),
        part('Курсова робота · 2026', 260),
        T('Спокійна\nакадемія', 130, 310, 900, 400, { font: 'Cormorant Garamond', size: 160, weight: 500, italic: true, color: CR, lh: .95 }, { a: 'stagger', d: 400, m: 'title' }),
        L(140, 740, 300, { stroke: TN, strokeWidth: 2, ends: 'dot' }, { a: 'draw', d: 1000, m: 'rule' }),
        T('Дослідження, методи та висновки — у теплій, зосередженій атмосфері.', 140, 780, 760, 120, { font: 'Lora', size: 30, color: MU, lh: 1.5 }, { a: 'fadeUp', d: 1200, m: 'sub' })
      ], bg, 'fade', 'Обкладинка в арці.'),
      slide([
        part('Сьогоднішній план'),
        T('Що ми розглянемо', 130, 170, 1400, 120, { font: 'Cormorant Garamond', size: 92, weight: 500, italic: true, color: CR }, { a: 'fadeUp', d: 150, m: 'title' }),
        ...[['Частина 1', 'Де ми зупинилися', 'portrait1'], ['Частина 2', 'Джерела й методи', 'portrait2'], ['Частина 3', 'Аналіз даних', 'portrait3'], ['Частина 4', 'Висновки', 'portrait4']].flatMap(([p, t, img], i) => {
          const x = 140 + i * 420;
          return [
            S('rect', x, 360, 390, 620, { fill: CD, stroke: TN, strokeOpacity: .25, strokeWidth: 1.5, radius: 26 }, { a: 'fadeUp', d: 300 + i * 160 }),
            I(img, x + 18, 378, 354, 360, { radius: 18, mask: 'rounded', filter: 'sepia', pos: '50% 25%' }, { a: 'fadeUp', d: 400 + i * 160 }),
            T(p, x + 30, 770, 330, 40, { font: 'Montserrat', size: 16, weight: 600, color: TN, ls: .35, upper: true }, { a: 'fadeUp', d: 500 + i * 160 }),
            T(t, x + 30, 815, 330, 120, { font: 'Cormorant Garamond', size: 40, italic: true, color: CR, lh: 1.1 }, { a: 'fadeUp', d: 560 + i * 160 })
          ];
        })
      ], bg, 'morph', 'План із чотирьох частин.'),
      slide([
        part('Частина 3 · Аналіз'),
        T('Результати опитування', 130, 170, 1400, 120, { font: 'Cormorant Garamond', size: 88, weight: 500, italic: true, color: CR }, { a: 'fadeUp', d: 150, m: 'title' }),
        S('rect', 140, 340, 1000, 640, { fill: CD, stroke: TN, strokeOpacity: .25, strokeWidth: 1.5, radius: 26 }, { a: 'fadeUp', d: 250 }),
        C('bar', [{ l: 'Так', v: 64, c: TN }, { l: 'Частково', v: 22, c: '#8a6440' }, { l: 'Ні', v: 14, c: '#5a4230' }], 200, 400, 880, 520, { font: 'Montserrat', size: 24, color: CR, suffix: '%' }, { d: 500 }),
        T('64 %', 1220, 380, 560, 180, { font: 'Cormorant Garamond', size: 170, weight: 600, color: TN, lh: 1 }, { a: 'counter', d: 700, ax: { dur: 1800 } }),
        T('респондентів підтвердили гіпотезу. Додайте кілька речень про те, що це означає для вашого дослідження.', 1220, 590, 560, 300, { font: 'Lora', size: 28, color: CR, lh: 1.55 }, { op: .85, a: 'stagger', d: 1000 })
      ], bg, 'morph', 'Діаграма і головна цифра.'),
      slide([
        I('shalott', 0, 0, 1920, 1080, { radius: 0, mask: 'none', filter: 'dim', pos: '60% 50%' }, { op: .35, a: 'kenburns', d: 0, m: 'hero' }),
        T('Дякую за увагу', 160, 380, 1600, 200, { font: 'Cormorant Garamond', size: 150, weight: 500, italic: true, color: CR, align: 'center' }, { a: 'shine', d: 300, m: 'title' }),
        L(810, 620, 300, { stroke: TN, strokeWidth: 2, ends: 'dot', fade: true }, { a: 'draw', d: 900, m: 'rule' }),
        T('Готовий відповісти на запитання', 460, 660, 1000, 60, { font: 'Lora', size: 32, color: MU, align: 'center' }, { a: 'fadeUp', d: 1200, m: 'sub' })
      ], bg, 'morph', '')
    ], { rembrandt: LIBP('rembrandt'), portrait1: LIBP('portrait1'), portrait2: LIBP('portrait2'), portrait3: LIBP('portrait3'), portrait4: LIBP('portrait4'), shalott: LIBP('shalott') });
  }

  function blank() {
    return project('Нова презентація', { name: 'blank', colors: ['#0a0a0c', '#ffffff', '#8f8cff', '#e8c27a', '#22d3ee', '#f472b6'] }, [
      slide([
        T('Заголовок презентації', 160, 400, 1600, 160, { font: 'Inter', size: 110, weight: 700, color: '#ffffff', align: 'center', ls: -.02 }, { a: 'fadeUp', d: 200, m: 'title' }),
        T('Підзаголовок', 360, 600, 1200, 60, { font: 'Inter', size: 38, color: '#a1a1aa', align: 'center' }, { a: 'fadeUp', d: 500, m: 'sub' })
      ], { color: '#0a0a0c', grad: 'radial', color2: '#17172a', cy: 0 }, 'fade')
    ]);
  }

  G.AureaTemplates = {
    uid, T, S, L, I, slide,
    list: [
      { id: 'museum', name: 'Музейна класика', desc: 'Шедеври живопису, золото й арки', make: museum },
      { id: 'saas', name: 'SaaS Мінімал', desc: 'Глибокий чорний, скло та неонове сяйво', make: saas },
      { id: 'journal', name: 'Бордовий журнал', desc: 'Клімт, Вотергаус і журнальна верстка', make: journal },
      { id: 'aurora', name: 'Аврора', desc: 'Кольорові форми, що перетікають morph-ом', make: aurora },
      { id: 'cosmos', name: 'Космос', desc: 'Фото NASA, зорі, діаграми та конфеті', make: cosmos },
      { id: 'nightgallery', name: 'Нічна галерея', desc: 'Чорне тло, серіфи, полотна-вітрини', make: nightgallery },
      { id: 'redpitch', name: 'Червоний пітч', desc: 'Чорно-червоний бізнес: цифри та графіки', make: redpitch },
      { id: 'dusk', name: 'Сутінки', desc: 'Пурпурові сутінки, червоне сонце, Хокусай', make: dusk },
      { id: 'editorial', name: 'Редакція', desc: 'Журнальний розворот: величезні заголовки', make: editorial },
      { id: 'academy', name: 'Академія', desc: 'Тепла коричнева гама для навчання', make: academy },
      { id: 'paper', name: 'Чистий аркуш', desc: 'Світлий мінімалізм і чітка типографіка', make: paper },
      { id: 'blank', name: 'Порожня', desc: 'Почати з нуля', make: blank }
    ]
  };
})(window);
