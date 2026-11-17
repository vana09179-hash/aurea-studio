/* Aurea — slide renderer, animation engine and player.
   Shared by the editor and by exported standalone HTML files. */
(function (G) {
  'use strict';
  const W = 1920, H = 1080, NS = 'http://www.w3.org/2000/svg';
  let UID = 0;

  const div = (cls) => { const d = document.createElement('div'); if (cls) d.className = cls; return d; };
  const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const SERIF = /Playfair|Cormorant|Lora|Georgia|Times|Garamond/i;
  const fontCss = (f) => f ? `'${f}', ${SERIF.test(f) ? 'Georgia, serif' : "'Inter', 'Segoe UI', system-ui, sans-serif"}` : "'Inter', system-ui, sans-serif";

  function hexA(hex, a) {
    if (!hex || hex === 'none') return 'transparent';
    if (!hex.startsWith('#')) return hex;
    let h = hex.slice(1);
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a == null ? 1 : a})`;
  }
  const asset = (p, id) => (id && p.assets && p.assets[id]) || id || '';

  function bgCss(bg) {
    bg = bg || {};
    const c = bg.color || '#0b0907';
    if (bg.grad === 'linear') return `linear-gradient(${bg.angle ?? 135}deg, ${c}, ${bg.color2 || c})`;
    if (bg.grad === 'mesh') {
      const m = bg.mesh && bg.mesh.length >= 4 ? bg.mesh : ['#7b6cff', '#e46fc4', '#22d3ee', '#ff9f8a'];
      return `radial-gradient(65% 75% at 0% 0%, ${m[0]} 0%, transparent 62%), radial-gradient(60% 70% at 100% 0%, ${m[1]} 0%, transparent 60%), radial-gradient(70% 80% at 100% 100%, ${m[2]} 0%, transparent 62%), radial-gradient(65% 75% at 0% 100%, ${m[3]} 0%, transparent 60%), ${c}`;
    }
    if (bg.grad === 'radial') return `radial-gradient(120% 120% at ${bg.cx ?? 50}% ${bg.cy ?? 35}%, ${bg.color2 || c} 0%, ${c} 62%)`;
    return c;
  }

  // ---------------- element rendering ----------------
  function gradientDef(svg, s, horizontalFade, width) {
    const id = 'ag' + (++UID);
    const defs = svgEl('defs');
    const lg = svgEl('linearGradient', horizontalFade ? { id, gradientUnits: 'userSpaceOnUse', x1: '0', y1: '0', x2: String(width || 100), y2: '0' } : { id, gradientTransform: `rotate(${(s.gradAngle ?? 90) - 90} .5 .5)` });
    const stops = horizontalFade
      ? [[0, s.stroke, 0], [.18, s.stroke, 1], [.82, s.color2 || s.stroke, 1], [1, s.color2 || s.stroke, 0]]
      : [[0, s.fill, s.fillOpacity ?? 1], [1, s.color2, s.fillOpacity ?? 1]];
    for (const [o, c, a] of stops) lg.appendChild(svgEl('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }));
    defs.appendChild(lg); svg.appendChild(defs);
    return `url(#${id})`;
  }

  function shapeSvg(el) {
    const s = el.style, w = el.w, h = el.h, sw = +s.strokeWidth || 0, o = sw / 2;
    const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'none' });
    let fill = (!s.fill || s.fill === 'none') ? 'none' : hexA(s.fill, s.fillOpacity ?? 1);
    if (fill !== 'none' && s.color2) fill = gradientDef(svg, s);
    const base = { fill, stroke: sw ? hexA(s.stroke, s.strokeOpacity ?? 1) : 'none', 'stroke-width': sw, 'stroke-linejoin': 'round', class: 'a-shp' };
    if (s.dash && sw) base['stroke-dasharray'] = `${sw * 3} ${sw * 2}`;
    const W2 = Math.max(0, w - sw), H2 = Math.max(0, h - sw);
    const poly = (pts) => svgEl('polygon', { ...base, points: pts.map(p => p.join(',')).join(' ') });
    let nodes = [];
    switch (el.shape) {
      case 'ellipse': case 'ring':
        nodes.push(svgEl('ellipse', { ...base, cx: w / 2, cy: h / 2, rx: Math.max(0, w / 2 - o), ry: Math.max(0, h / 2 - o) })); break;
      case 'arch': {
        const r = Math.min(W2 / 2, H2);
        nodes.push(svgEl('path', { ...base, d: `M${o},${h - o} L${o},${o + r} A${r},${r} 0 0 1 ${w - o},${o + r} L${w - o},${h - o} Z` })); break;
      }
      case 'triangle': nodes.push(poly([[w / 2, o], [w - o, h - o], [o, h - o]])); break;
      case 'diamond': nodes.push(poly([[w / 2, o], [w - o, h / 2], [w / 2, h - o], [o, h / 2]])); break;
      case 'hexagon': nodes.push(poly([[w * .25, o], [w * .75, o], [w - o, h / 2], [w * .75, h - o], [w * .25, h - o], [o, h / 2]])); break;
      case 'star': {
        const pts = [], cx = w / 2, cy = h / 2, rx = w / 2 - o, ry = h / 2 - o;
        for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? .45 : 1; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
        nodes.push(poly(pts)); break;
      }
      case 'arrow': {
        const hw = Math.min(h * .9, w * .5);
        nodes.push(poly([[o, h * .32], [w - hw, h * .32], [w - hw, o], [w - o, h / 2], [w - hw, h - o], [w - hw, h * .68], [o, h * .68]])); break;
      }
      case 'frame': {
        const g = s.gap ?? 16, c = Math.max(10, sw * 5);
        nodes.push(svgEl('rect', { ...base, fill: 'none', x: o, y: o, width: W2, height: H2 }));
        nodes.push(svgEl('rect', { ...base, fill: 'none', 'stroke-width': Math.max(1, sw / 2), x: g, y: g, width: Math.max(0, w - 2 * g), height: Math.max(0, h - 2 * g) }));
        for (const [x, y] of [[g, g], [w - g, g], [w - g, h - g], [g, h - g]])
          nodes.push(svgEl('polygon', { ...base, class: 'a-deco', fill: hexA(s.stroke, 1), points: `${x},${y - c} ${x + c},${y} ${x},${y + c} ${x - c},${y}` }));
        if (fill !== 'none') nodes.unshift(svgEl('rect', { fill, x: g, y: g, width: Math.max(0, w - 2 * g), height: Math.max(0, h - 2 * g), class: 'a-deco' }));
        break;
      }
      case 'blob': {
        const k = (x, y) => `${x * w},${y * h}`;
        nodes.push(svgEl('path', { ...base, d: `M${k(.5, .02)} C${k(.78, .0)} ${k(1, .25)} ${k(.97, .5)} C${k(.95, .78)} ${k(.75, 1)} ${k(.48, .98)} C${k(.2, .97)} ${k(.0, .75)} ${k(.03, .47)} C${k(.06, .2)} ${k(.25, .03)} ${k(.5, .02)} Z` })); break;
      }
      default:
        nodes.push(svgEl('rect', { ...base, x: o, y: o, width: W2, height: H2, rx: Math.min(s.radius || 0, W2 / 2, H2 / 2) }));
    }
    nodes.forEach(n => svg.appendChild(n));
    return svg;
  }

  function lineSvg(el) {
    const s = el.style, w = el.w, h = el.h, sw = +s.strokeWidth || 3, y = h / 2;
    const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'none' });
    const ends = s.ends || 'none';
    const pad = ends === 'none' ? sw / 2 : sw * 3;
    const stroke = s.fade ? gradientDef(svg, s, true, w) : hexA(s.stroke, s.strokeOpacity ?? 1);
    const p = svgEl('path', { d: `M${pad},${y} L${Math.max(pad, w - pad)},${y}`, stroke, 'stroke-width': sw, 'stroke-linecap': 'round', fill: 'none', class: 'a-shp' });
    if (s.dash) p.setAttribute('stroke-dasharray', `${sw * 3} ${sw * 2.5}`);
    svg.appendChild(p);
    const col = hexA(s.stroke, 1), r = sw * 1.8;
    const deco = (x, right) => {
      if (ends === 'dot') svg.appendChild(svgEl('circle', { cx: x, cy: y, r, fill: col, class: 'a-deco' }));
      if (ends === 'diamond') svg.appendChild(svgEl('polygon', { points: `${x},${y - r * 1.5} ${x + r * 1.5},${y} ${x},${y + r * 1.5} ${x - r * 1.5},${y}`, fill: col, class: 'a-deco' }));
      if (ends === 'arrow' && right) svg.appendChild(svgEl('polygon', { points: `${x - r * 2.6},${y - r * 1.6} ${x + r},${y} ${x - r * 2.6},${y + r * 1.6}`, fill: col, class: 'a-deco' }));
    };
    deco(pad, false); deco(w - pad, true);
    return svg;
  }

  function textNode(el) {
    const s = el.style, t = div('a-txt');
    t.textContent = el.content ?? '';
    const st = t.style;
    st.fontFamily = fontCss(s.font);
    st.fontSize = (s.size || 40) + 'px';
    st.fontWeight = s.weight || 400;
    st.fontStyle = s.italic ? 'italic' : 'normal';
    st.lineHeight = s.lh ?? 1.2;
    st.letterSpacing = (s.ls || 0) + 'em';
    st.textAlign = s.align || 'left';
    st.textTransform = s.upper ? 'uppercase' : 'none';
    if (s.underline) { st.textDecoration = 'underline'; st.textDecorationThickness = Math.max(2, (s.size || 40) / 18) + 'px'; st.textUnderlineOffset = '.12em'; }
    st.color = s.color || '#fff';
    if (s.effect === 'neon') { const c = s.color2 || s.color || '#fff'; st.color = s.color2 ? s.color : '#fff'; st.textShadow = `0 0 4px #fff, 0 0 12px ${hexA(c, .9)}, 0 0 28px ${hexA(c, .8)}, 0 0 60px ${hexA(c, .6)}`; return t; }
    if (s.effect === 'outline') { st.color = 'transparent'; st.webkitTextStroke = `${Math.max(1.5, (s.size || 40) / 40)}px ${s.color || '#fff'}`; return t; }
    if (s.effect === 'long') { const c = hexA(s.color2 || '#000000', .35); st.textShadow = Array.from({ length: 14 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${c}`).join(','); return t; }
    if (s.effect === 'emboss') { st.textShadow = '0 1px 0 rgba(255,255,255,.35), 0 -1px 0 rgba(0,0,0,.45), 0 8px 18px rgba(0,0,0,.35)'; return t; }
    if (s.color2) {
      t.classList.add('grad');
      st.backgroundImage = `linear-gradient(${s.gradAngle ?? 90}deg, ${s.color}, ${s.color2})`;
      if (s.shadow === 'glow') st.filter = `drop-shadow(0 0 22px ${hexA(s.color2, .45)})`;
      else if (s.shadow === 'soft') st.filter = 'drop-shadow(0 10px 24px rgba(0,0,0,.5))';
    } else {
      if (s.shadow === 'soft') st.textShadow = '0 8px 30px rgba(0,0,0,.55)';
      else if (s.shadow === 'glow') st.textShadow = `0 0 28px ${hexA(s.color, .55)}, 0 0 2px ${hexA(s.color, .4)}`;
    }
    return t;
  }

  function imageNode(el, project, opts) {
    const s = el.style, box = div('a-img');
    const bw = +s.borderWidth || 0;
    switch (s.mask) {
      case 'circle': box.style.borderRadius = '50%'; break;
      case 'arch': box.style.borderRadius = `${el.w / 2}px ${el.w / 2}px 0 0 / ${Math.min(el.w / 2, el.h)}px ${Math.min(el.w / 2, el.h)}px 0 0`; break;
      case 'rounded': box.style.borderRadius = (s.radius ?? 24) + 'px'; break;
    }
    if (bw) { box.style.border = `${bw}px solid ${s.borderColor || '#c9a45c'}`; box.style.boxSizing = 'border-box'; }
    if (s.shadow) box.style.boxShadow = '0 40px 90px rgba(0,0,0,.6)';
    const src = asset(project, el.src);
    if (src) {
      const img = document.createElement('img');
      img.src = src; img.draggable = false; img.alt = '';
      img.style.objectFit = s.fit || 'cover';
      img.style.objectPosition = s.pos || '50% 30%';
      const f = { sepia: 'sepia(.55) contrast(1.05) brightness(.95)', mono: 'grayscale(1) contrast(1.12)', warm: 'saturate(1.15) sepia(.22) contrast(1.04)', dim: 'brightness(.62) saturate(.9)', vivid: 'saturate(1.35) contrast(1.08)', noir: 'grayscale(1) contrast(1.45) brightness(.85)', vintage: 'sepia(.35) saturate(.8) contrast(.92) brightness(1.05) hue-rotate(-8deg)', cool: 'saturate(1.1) hue-rotate(12deg) brightness(.98) contrast(1.05)', dream: 'saturate(1.2) brightness(1.08) contrast(.9) blur(.6px)' }[s.filter];
      if (f) img.style.filter = f;
      box.appendChild(img);
    } else {
      const ph = div('a-imgph');
      ph.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg><div>Перетягніть зображення сюди<br><small style="opacity:.6">або двічі клацніть</small></div>';
      if (opts.mode !== 'edit') ph.style.opacity = '.35';
      box.appendChild(ph);
    }
    if (s.innerLine) {
      const il = div(); il.style.cssText = `position:absolute;inset:${(s.innerInset ?? 14) + bw}px;border:1px solid ${hexA(s.borderColor || '#e7cf93', .7)};border-radius:inherit;pointer-events:none`;
      box.appendChild(il);
    }
    return box;
  }

  // ---------------- icons ----------------
  const ICONS = {
    crown: 'M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z',
    star: 'M12 3l2.7 6 6.3.6-4.8 4.2 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.6 9.3 9z',
    heart: 'M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.4 12 20 12 20z',
    check: 'M4 12.5l5 5L20 6.5',
    cross: 'M6 6l12 12M18 6L6 18',
    arrow: 'M4 12h15M13 6l6 6-6 6',
    quote: 'M9 7H5v6h4v-1.5c0 2-1 3.5-3 4.5M19 7h-4v6h4v-1.5c0 2-1 3.5-3 4.5',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
    calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 13.5a6.5 6.5 0 0 1 3.5 6.5',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6',
    flag: 'M5 21V4M5 4h12l-2 4 2 4H5',
    pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2',
    camera: 'M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 4.5-8.5 11-9 0 6.5-5 10-9 11zM14.5 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM6 12H3l3-4h4M12 18v3l4-3v-4',
    shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z',
    castle: 'M3 21V9h3V6h3v3h2V6h2v3h2V6h3v3h3v12zM10 21v-5h4v5M3 9V5M21 9V5',
    rose: 'M12 21v-7M12 14c-3.5 0-6-2.4-6-6 2 0 3.5.7 4.3 2C10.6 6.7 11 4.6 12 3c1 1.6 1.4 3.7 1.7 7 .8-1.3 2.3-2 4.3-2 0 3.6-2.5 6-6 6zM12 18c-2 0-3.5-1-4-2.5M12 18c2 0 3.5-1 4-2.5',
    sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    leaf: 'M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l8-8',
    mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
    chat: 'M4 5h16v11H9l-5 4z',
    gift: 'M3 9h18v4H3zM5 13h14v8H5zM12 9v12M12 9C9 9 7 4 9.5 4S12 9 12 9zM12 9c3 0 5-5 2.5-5S12 9 12 9z',
    mountain: 'M2 20l7-12 4 6 3-4 6 10z',
    sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
    moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
    play: 'M7 4.5v15l12-7.5z',
    pen: 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
    scroll: 'M7 4h11a2 2 0 0 1 2 2v1h-3M7 4a2 2 0 0 0-2 2v12a2 2 0 0 1-2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M9 9h6M9 13h6',
    gem: 'M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z',
    home: 'M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5',
    cap: 'M2 9l10-5 10 5-10 5zM6 11.2V16c3 2.6 9 2.6 12 0v-4.8M22 9v6',
    flask: 'M9 3h6M10 3v6L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9V3M7.5 15h9',
    cloud: 'M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 9 4.5 4.5 0 0 0 7 18z',
    bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2',
    key: 'M14.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM13.2 12.7L21 20.5M17.5 17l2-2M15 14.5l2-2',
    search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L21 21',
    settings: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 2.5v3M12 18.5v3M4.2 7l2.6 1.5M17.2 15.5l2.6 1.5M4.2 17l2.6-1.5M17.2 8.5l2.6-1.5',
    code: 'M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15',
    database: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    phone: 'M7 2.5h10a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1zM10.5 18.5h3',
    laptop: 'M4.5 5h15v10h-15zM2.5 18.5h19M9.5 18.5l.5-1.5h4l.5 1.5',
    cart: 'M2.5 3.5h3l2.2 11h10.5l2-8H7M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM14.8 9.2c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.1 0 2.8 5.6 1.4 5.6 4.3 0 1.2-1.2 2.2-2.8 2.2-1.3 0-2.4-.6-2.9-1.6M12 5.8v1.8M12 16.2V18',
    growth: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    pie: 'M12 3a9 9 0 1 0 9 9h-9zM14.5 2.8A8.6 8.6 0 0 1 21.2 9.5H14.5z',
    puzzle: 'M9 3.5h3.5v2a1.8 1.8 0 1 0 3.5 0v-2H20V8h-2a1.8 1.8 0 1 0 0 3.5h2V20H4v-4.5h2A1.8 1.8 0 1 0 6 12H4V3.5z',
    compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.8 8.2l-2 5.6-5.6 2 2-5.6z',
    map: 'M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5zM9 4v13.5M15 6.5V20',
    tree: 'M12 21v-5M12 3l6 8h-3.5l4.5 5H5l4.5-5H6z',
    drop: 'M12 3c3.5 4.4 6.5 8 6.5 11.3A6.5 6.5 0 0 1 5.5 14.3C5.5 11 8.5 7.4 12 3z',
    fire: 'M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.6-5.3 3.9-8.4.9 2 2.2 3 3.4 3.4C13.9 7 13.1 4.6 12.4 3c4.2 2.4 6.1 6.5 6.1 10.4 0 4.6-2.7 7.6-6.5 7.6z',
    planet: 'M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM6.4 13.8C3.3 15.6 1.7 17.3 2.3 18.3c.9 1.6 6.4-.3 12.3-4s9.7-8.3 8.8-9.9c-.6-1-2.9-.8-6 .5',
    microscope: 'M8 17h8M6.5 21h11M12 17a5 5 0 0 0 5-5M9.5 3.5l3 1.5-3.5 7-3-1.5zM9.5 11.5l1.3 2.5',
    palette: 'M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1.5-2.2-.5-1.3.4-2.3 1.7-2.3H17a4 4 0 0 0 4-4C21 7 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01',
    idea: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z',
    handshake: 'M2.5 12l4-4.5 4 1.5 3-2 3 .5 5 4.5M2.5 12l4 4.5 2 1.5c.8.6 1.8.5 2.4-.2M21.5 12.5l-4 4-2.5 1.5c-.8.5-1.8.3-2.4-.4l-3.6-4.1',
    medal: 'M8 2.5h8l-2 6h-4zM12 21.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 13l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z',
    video: 'M3 6.5h12v11H3zM15 10.5l6-3.5v10l-6-3.5'
  };
  function iconNode(el) {
    const s = el.style || {};
    const box = div('a-icon');
    const shape = s.shape || 'none';
    if (shape !== 'none') {
      box.style.background = s.color2 ? `linear-gradient(135deg, ${hexA(s.bg || '#ffffff', s.bgOpacity ?? .12)}, ${hexA(s.color2, s.bgOpacity ?? .12)})` : hexA(s.bg || '#ffffff', s.bgOpacity ?? .1);
      box.style.borderRadius = shape === 'circle' ? '50%' : Math.min(el.w, el.h) * .26 + 'px';
      box.style.border = `${Math.max(1, Math.min(el.w, el.h) * .012)}px solid ${hexA(s.color || '#ffffff', .25)}`;
    }
    const pad = shape === 'none' ? 0 : .22;
    const svg = svgEl('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: s.color || '#ffffff', 'stroke-width': s.strokeWidth || 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    svg.style.cssText = `position:absolute;left:${pad * 100}%;top:${pad * 100}%;width:${(1 - 2 * pad) * 100}%;height:${(1 - 2 * pad) * 100}%;overflow:visible`;
    if (s.filled) { svg.setAttribute('fill', hexA(s.color || '#ffffff', .22)); }
    if (s.glow) svg.style.filter = `drop-shadow(0 0 ${Math.max(4, el.w * .06)}px ${hexA(s.color || '#ffffff', .6)})`;
    svg.appendChild(svgEl('path', { d: ICONS[el.icon] || ICONS.star, class: 'a-shp', 'vector-effect': 'non-scaling-stroke' }));
    box.appendChild(svg);
    return box;
  }

  // ---------------- charts ----------------
  function tableNode(el) {
    const s = el.style || {}, rows = (el.rows && el.rows.length) ? el.rows : [['']];
    const line = s.lineColor || s.color || '#ffffff', head = s.header !== false;
    const box = div('a-table');
    box.style.cssText = `position:absolute;inset:0;display:flex;flex-direction:column;border-radius:${s.radius ?? 18}px;overflow:hidden;font-family:${fontCss(s.font || 'Inter')};font-size:${s.size || 24}px;color:${s.color || '#ffffff'};background:${hexA(s.bodyBg || '#ffffff', s.bodyOp ?? .05)};box-shadow:inset 0 0 0 ${s.border ?? 1}px ${hexA(line, .2)}`;
    const cols = Math.max(...rows.map(r => r.length));
    rows.forEach((r, ri) => {
      const tr = div('a-tr');
      const isHead = head && ri === 0;
      tr.style.cssText = `flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);min-height:0;${ri ? `border-top:1px solid ${hexA(line, .12)};` : ''}${isHead ? `background:${s.headBg || '#7b6cff'};color:${s.headColor || '#ffffff'};font-weight:700;` : (s.zebra && ri % 2 === 0 ? `background:${hexA(line, .045)};` : '')}`;
      for (let ci = 0; ci < cols; ci++) {
        const td = div('a-td');
        const al = (s.align || 'left');
        td.style.cssText = `padding:${s.padY ?? 12}px ${s.padX ?? 20}px;display:flex;align-items:center;justify-content:${al === 'center' ? 'center' : al === 'right' ? 'flex-end' : 'flex-start'};text-align:${al};min-width:0;overflow:hidden;line-height:1.25;${ci ? `border-left:1px solid ${hexA(line, .08)};` : ''}`;
        td.textContent = r[ci] ?? '';
        tr.appendChild(td);
      }
      box.appendChild(tr);
    });
    return box;
  }

  // Waterfall: running total of positive/negative steps; items with d.t === true are totals
  function waterfallNode(el, box, s, data, fmt, col, fs) {
    const W = el.w, H = el.h, padB = fs * 2.4, padT = fs * 1.6, n = Math.max(1, data.length);
    let run = 0; const bars = data.map(d => { const v = +d.v || 0; if (d.t) { const b = { a: 0, b: run, v: run, t: true }; return b; } const b = { a: run, b: run + v, v }; run += v; return b; });
    const lo = Math.min(0, ...bars.map(b => Math.min(b.a, b.b))), hi = Math.max(1, ...bars.map(b => Math.max(b.a, b.b)));
    const y = v => padT + (hi - v) / (hi - lo) * (H - padT - padB), cw = W / n;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }); svg.style.cssText = 'position:absolute;inset:0;overflow:visible';
    bars.forEach((b, i) => {
      const top = y(Math.max(b.a, b.b)), bot = y(Math.min(b.a, b.b)), x = i * cw + cw * .18, w = cw * .64;
      const c = data[i].c || (b.t ? (s.totalColor || '#9d8bff') : b.v >= 0 ? (s.upColor || '#4ade80') : (s.downColor || '#f87171'));
      const r = svgEl('rect', { x, y: top, width: w, height: Math.max(2, bot - top), rx: Math.min(10, w / 6), fill: c, class: 'a-bar' }); r.style.transformOrigin = `${x + w / 2}px ${bot}px`; svg.appendChild(r);
      if (i < bars.length - 1 && !bars[i + 1].t) svg.appendChild(svgEl('line', { x1: x + w, x2: (i + 1) * cw + cw * .18, y1: y(b.t ? b.b : b.b), y2: y(b.t ? b.b : b.b), stroke: hexA(col, .35), 'stroke-dasharray': '4 4' }));
      const v = svgEl('text', { x: x + w / 2, y: top - fs * .35, 'text-anchor': 'middle', fill: col, 'font-size': fs * .9, 'font-weight': 700, class: 'a-cv' }); v.textContent = (b.v > 0 && !b.t ? '+' : '') + fmt(b.v); svg.appendChild(v);
      const l = svgEl('text', { x: x + w / 2, y: H - fs * .7, 'text-anchor': 'middle', fill: col, 'font-size': fs * .85, opacity: .75 }); l.textContent = data[i].l; svg.appendChild(l);
    });
    box.appendChild(svg); return box;
  }
  // Gantt: d.s = start, d.v = duration (same units)
  function ganttNode(el, box, s, data, col, fs, cOf) {
    const W = el.w, H = el.h, labW = Math.min(W * .3, fs * 9), top = fs * 1.8;
    const end = Math.max(1, ...data.map(d => (+d.s || 0) + (+d.v || 0)));
    const rowH = (H - top) / Math.max(1, data.length);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }); svg.style.cssText = 'position:absolute;inset:0;overflow:visible';
    const ticks = Math.min(12, Math.ceil(end));
    for (let k = 0; k <= ticks; k++) {
      const x = labW + (W - labW) * k / ticks;
      svg.appendChild(svgEl('line', { x1: x, x2: x, y1: top - fs * .2, y2: H, stroke: hexA(col, .1) }));
      const t = svgEl('text', { x, y: top - fs * .5, 'text-anchor': 'middle', fill: col, 'font-size': fs * .7, opacity: .6 }); t.textContent = (s.unitPrefix || '') + Math.round(end * k / ticks); svg.appendChild(t);
    }
    data.forEach((d, i) => {
      const yy = top + i * rowH, x = labW + (W - labW) * (+d.s || 0) / end, w = Math.max(6, (W - labW) * (+d.v || 0) / end);
      const l = svgEl('text', { x: labW - fs * .5, y: yy + rowH / 2 + fs * .32, 'text-anchor': 'end', fill: col, 'font-size': fs * .85 }); l.textContent = d.l; svg.appendChild(l);
      const r = svgEl('rect', { x, y: yy + rowH * .2, width: w, height: rowH * .6, rx: Math.min(rowH * .3, 14), fill: cOf(d, i), class: 'a-bar' }); r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'left center'; svg.appendChild(r);
    });
    box.appendChild(svg); return box;
  }
  // Sankey (two columns): d.l = 'Source → Target', d.v = flow
  function sankeyNode(el, box, s, data, col, fs, palette) {
    const W = el.w, H = el.h, nodeW = Math.max(14, fs * .6), labPad = fs * 6, gap = fs * .6;
    const links = data.map(d => { const [a, b] = String(d.l).split(/\s*(?:→|->|>)\s*/); return { a: (a || '').trim(), b: (b || '').trim() || '—', v: Math.max(0, +d.v || 0), c: d.c }; }).filter(l => l.v > 0);
    const srcs = [...new Set(links.map(l => l.a))], dsts = [...new Set(links.map(l => l.b))];
    const total = links.reduce((x, l) => x + l.v, 0) || 1;
    const lay = (names, side) => { const avail = H - gap * (names.length - 1); let yy = 0; const m = {}; names.forEach(n => { const v = links.filter(l => (side ? l.b : l.a) === n).reduce((x, l) => x + l.v, 0); const h = avail * v / total; m[n] = { y: yy, h, used: 0 }; yy += h + gap; }); return m; };
    const L = lay(srcs, 0), R = lay(dsts, 1), x0 = labPad, x1 = W - labPad - nodeW;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }); svg.style.cssText = 'position:absolute;inset:0;overflow:visible';
    links.forEach((l, i) => {
      const a = L[l.a], b = R[l.b], hgt = (H - gap * (srcs.length - 1)) * l.v / total;
      const ya = a.y + a.used, yb = b.y + b.used; a.used += hgt; b.used += hgt * ((H - gap * (dsts.length - 1)) / (H - gap * (srcs.length - 1)));
      const c = l.c || palette[srcs.indexOf(l.a) % palette.length], mx = (x0 + nodeW + x1) / 2;
      const hb = hgt * ((H - gap * (dsts.length - 1)) / (H - gap * (srcs.length - 1)));
      svg.appendChild(svgEl('path', { d: `M${x0 + nodeW},${ya} C${mx},${ya} ${mx},${yb} ${x1},${yb} L${x1},${yb + hb} C${mx},${yb + hb} ${mx},${ya + hgt} ${x0 + nodeW},${ya + hgt} Z`, fill: hexA(c, .38), class: 'a-bar', style: 'transform-box:fill-box;transform-origin:left center' }));
    });
    const node = (m, x, names, anchor, dx) => names.forEach((n, i) => { const k = m[n]; svg.appendChild(svgEl('rect', { x, y: k.y, width: nodeW, height: Math.max(2, k.h), rx: 4, fill: palette[i % palette.length] })); const t = svgEl('text', { x: x + dx, y: k.y + k.h / 2 + fs * .32, 'text-anchor': anchor, fill: col, 'font-size': fs * .85 }); t.textContent = n; svg.appendChild(t); });
    node(L, x0, srcs, 'end', -fs * .5); node(R, x1, dsts, 'start', nodeW + fs * .5);
    box.appendChild(svg); return box;
  }

  function chartNode(el) {
    const s = el.style || {}, data = el.data || [], kind = el.chart || 'bar';
    const box = div('a-chart a-chart-' + kind);
    const fs = s.size || 26, col = s.color || '#ffffff', font = fontCss(s.font || 'Inter');
    const max = Math.max(1, ...data.map(d => +d.v || 0));
    const fmt = (v) => (s.prefix || '') + String(v).replace('.', s.dec || ',') + (s.suffix || '');
    box.style.cssText = `position:absolute;inset:0;font-family:${font};color:${col};font-size:${fs}px`;
    const palette = s.colors && s.colors.length ? s.colors : ['#e8c27a', '#9d8bff', '#6ee7f9', '#f472b6', '#4ade80', '#fb923c'];
    const cOf = (d, i) => d.c || palette[i % palette.length];
    if (kind === 'donut') {
      const size = Math.min(el.w, el.h), r = size / 2 - (s.thick || size * .09) / 2 - 4, th = s.thick || size * .09;
      const cx = size / 2, C = 2 * Math.PI * r;
      const total = data.reduce((a, d) => a + (+d.v || 0), 0) || 1;
      const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size });
      svg.style.cssText = `position:absolute;left:${(el.w - size) / 2}px;top:${(el.h - size) / 2}px;overflow:visible`;
      svg.appendChild(svgEl('circle', { cx, cy: cx, r, fill: 'none', stroke: hexA(col, .08), 'stroke-width': th }));
      let acc = 0;
      data.forEach((d, i) => {
        const len = (+d.v || 0) / total * C;
        const c = svgEl('circle', { cx, cy: cx, r, fill: 'none', stroke: cOf(d, i), 'stroke-width': th, 'stroke-dasharray': `${Math.max(0, len - (data.length > 1 ? 3 : 0))} ${C}`, 'stroke-dashoffset': -acc, transform: `rotate(-90 ${cx} ${cx})`, 'stroke-linecap': data.length > 1 ? 'butt' : 'round', class: 'a-seg' });
        c.dataset.len = len; c.dataset.off = -acc;
        svg.appendChild(c); acc += len;
      });
      box.appendChild(svg);
      const mid = div('a-chart-mid');
      mid.style.cssText = `position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center`;
      const big = div(); big.className = 'a-cv';
      big.style.cssText = `font-size:${size * .2}px;font-weight:700;line-height:1`;
      big.textContent = s.center != null && s.center !== '' ? s.center : fmt(data[0] ? data[0].v : 0);
      const small = div(); small.style.cssText = `font-size:${fs}px;opacity:.65;margin-top:${size * .02}px`;
      small.textContent = s.centerLabel != null ? s.centerLabel : (data[0] ? data[0].l : '');
      mid.append(big, small);
      box.appendChild(mid);
      return box;
    }
    if (kind === 'waterfall') return waterfallNode(el, box, s, data, fmt, col, fs);
    if (kind === 'gantt') return ganttNode(el, box, s, data, col, fs, cOf);
    if (kind === 'sankey') return sankeyNode(el, box, s, data, col, fs, palette);
    if (kind === 'hbar') {
      box.style.display = 'flex'; box.style.flexDirection = 'column'; box.style.justifyContent = 'space-around';
      data.forEach((d, i) => {
        const row = div(); row.style.cssText = `display:flex;align-items:center;gap:${fs * .6}px`;
        const lab = div(); lab.style.cssText = `flex:0 0 28%;text-align:right;opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`; lab.textContent = d.l;
        const track = div(); track.style.cssText = `flex:1;height:${Math.max(10, fs * .9)}px;border-radius:${fs}px;background:${hexA(col, .07)};position:relative;overflow:hidden`;
        const bar = div('a-bar'); bar.style.cssText = `position:absolute;left:0;top:0;bottom:0;width:${(+d.v || 0) / max * 100}%;border-radius:inherit;background:linear-gradient(90deg, ${hexA(cOf(d, i), .55)}, ${cOf(d, i)});transform-origin:left center`;
        track.appendChild(bar);
        const val = div('a-cv'); val.style.cssText = `flex:0 0 auto;min-width:3.2em;font-weight:700`; val.textContent = fmt(d.v);
        row.append(lab, track, val); box.appendChild(row);
      });
      return box;
    }
    // vertical bars
    box.style.display = 'flex'; box.style.alignItems = 'flex-end'; box.style.gap = (s.gap ?? 4) + '%';
    box.style.padding = `0 ${fs * .4}px`;
    const colW = (el.w - fs * .8) / Math.max(1, data.length);
    const longest = Math.max(1, ...data.map(d => String(d.l).length));
    const tilt = longest * fs * .55 > colW * 1.05;            // labels would collide -> tilt them
    const every = Math.max(1, Math.ceil((fs * 1.3) / Math.max(1, colW)));  // very dense -> show every n-th
    const plotH = el.h - fs * (tilt ? 4.6 : 3.4);
    data.forEach((d, i) => {
      const colm = div(); colm.style.cssText = `flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-width:0`;
      const val = div('a-cv'); val.style.cssText = `font-weight:700;margin-bottom:${fs * .3}px`; val.textContent = fmt(d.v);
      const bar = div('a-bar');
      bar.style.cssText = `width:100%;height:${Math.max(2, (+d.v || 0) / max * plotH)}px;border-radius:${s.radius ?? 14}px ${s.radius ?? 14}px 4px 4px;background:linear-gradient(180deg, ${cOf(d, i)}, ${hexA(cOf(d, i), .35)});transform-origin:bottom center;box-shadow:0 0 30px ${hexA(cOf(d, i), .25)}`;
      const lab = div(); lab.style.cssText = tilt ? `margin-top:${fs * .5}px;opacity:.75;white-space:nowrap;transform:rotate(-35deg);transform-origin:100% 0;height:${fs * 1.6}px;align-self:flex-end;font-size:${fs * .85}px` : `margin-top:${fs * .45}px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%`; lab.textContent = i % every === 0 ? d.l : '';
      colm.append(val, bar, lab); box.appendChild(colm);
    });
    return box;
  }

  // ---------------- living backgrounds ----------------
  function seeded(seed) { let h = 2166136261; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function fxLayer(bg, seed) {
    const fx = bg.fx; if (!fx || fx === 'none') return null;
    const L = div('a-fx a-fx-' + fx), R = seeded(seed + fx);
    const c1 = bg.fxColor || '#e8c27a', c2 = bg.fxColor2 || '#9d8bff';
    const add = (css) => { const d = div(); d.style.cssText = css; L.appendChild(d); return d; };
    if (fx === 'aurora') {
      [[c1, 20, 30], [c2, 70, 20], [bg.fxColor3 || '#22d3ee', 50, 80]].forEach(([c, x, y], i) =>
        add(`left:${x - 30}%;top:${y - 35}%;width:60%;height:70%;background:radial-gradient(closest-side,${hexA(c, .55)},transparent);filter:blur(60px);animation:a-drift ${22 + i * 6}s ease-in-out ${-i * 5}s infinite alternate;mix-blend-mode:screen`));
    } else if (fx === 'particles' || fx === 'snow') {
      const n = fx === 'snow' ? 70 : 46;
      for (let i = 0; i < n; i++) {
        const sz = (fx === 'snow' ? 3 : 2) + R() * (fx === 'snow' ? 7 : 5), dur = 14 + R() * 18;
        add(`left:${R() * 100}%;top:${fx === 'snow' ? -5 : 100 + R() * 10}%;width:${sz}px;height:${sz}px;border-radius:50%;background:${fx === 'snow' ? '#ffffff' : (R() > .5 ? c1 : c2)};box-shadow:0 0 ${sz * 3}px ${hexA(fx === 'snow' ? '#ffffff' : c1, .7)};opacity:${.35 + R() * .6};--dx:${(R() - .5) * 240}px;animation:${fx === 'snow' ? 'a-fall' : 'a-rise'} ${dur}s linear ${-R() * dur}s infinite`);
      }
    } else if (fx === 'stars') {
      for (let i = 0; i < 120; i++) {
        const sz = .8 + R() * 2.6;
        add(`left:${R() * 100}%;top:${R() * 100}%;width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;box-shadow:0 0 ${sz * 4}px rgba(255,255,255,.8);animation:a-twinkle ${2 + R() * 4}s ease-in-out ${-R() * 5}s infinite alternate`);
      }
    } else if (fx === 'bokeh') {
      for (let i = 0; i < 18; i++) {
        const sz = 60 + R() * 220;
        add(`left:${R() * 100 - 8}%;top:${R() * 100 - 8}%;width:${sz}px;height:${sz}px;border-radius:50%;background:radial-gradient(circle,${hexA(R() > .5 ? c1 : c2, .35)},transparent 70%);filter:blur(${2 + R() * 8}px);--dx:${(R() - .5) * 160}px;animation:a-bokeh ${16 + R() * 18}s ease-in-out ${-R() * 20}s infinite alternate`);
      }
    } else if (fx === 'rays') {
      add(`left:50%;top:-60%;width:200%;height:200%;margin-left:-100%;background:repeating-conic-gradient(from 0deg at 50% 50%, ${hexA(c1, .10)} 0deg 6deg, transparent 6deg 18deg);animation:a-spin 120s linear infinite;mask:radial-gradient(closest-side,#000,transparent);-webkit-mask:radial-gradient(closest-side,#000,transparent)`);
    } else if (fx === 'grid') {
      add(`inset:-10%;background-image:linear-gradient(${hexA(c1, .12)} 1px,transparent 1px),linear-gradient(90deg,${hexA(c1, .12)} 1px,transparent 1px);background-size:80px 80px;transform:perspective(900px) rotateX(58deg) translateY(30%);transform-origin:50% 100%;animation:a-gridmove 6s linear infinite;-webkit-mask:linear-gradient(transparent,#000 60%)`);
    }
    return L;
  }

  function renderElement(el, project, opts) {
    const n = div('a-el a-' + el.type);
    n.dataset.id = el.id;
    const st = n.style;
    st.left = el.x + 'px'; st.top = el.y + 'px'; st.width = el.w + 'px'; st.height = el.h + 'px';
    if (el.rot) st.transform = `rotate(${el.rot}deg)`;
    if (el.opacity != null && el.opacity < 1) st.opacity = el.opacity;
    if (el.style && el.style.blend) st.mixBlendMode = el.style.blend;
    const fx = el.fx || {};
    const filters = [];
    if (fx.shadow && fx.shadow !== 'none') {
      const ang = (fx.sAngle ?? 90) * Math.PI / 180, d = fx.shadow === 'soft' ? (fx.sDist ?? 14) : fx.shadow === 'hard' ? (fx.sDist ?? 10) : (fx.sDist ?? 12);
      const blur = fx.shadow === 'hard' ? 0 : (fx.sBlur ?? 30);
      filters.push(`drop-shadow(${(Math.cos(ang) * d).toFixed(1)}px ${(Math.sin(ang) * d).toFixed(1)}px ${blur}px ${hexA(fx.sColor || '#000000', fx.sOpacity ?? .45)})`);
    }
    if (fx.glow > 0) filters.push(`drop-shadow(0 0 ${fx.glow}px ${hexA(fx.gColor || '#e8c27a', .85)})`, `drop-shadow(0 0 ${fx.glow / 2}px ${hexA(fx.gColor || '#e8c27a', .6)})`);
    if (fx.blur > 0) filters.push(`blur(${fx.blur}px)`);
    if (filters.length) st.filter = filters.join(' ');
    const inn = div('a-in'); n.appendChild(inn);
    const s = el.style || {};
    if (el.type === 'text') {
      inn.style.justifyContent = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[s.valign || 'top'];
      inn.appendChild(textNode(el));
    } else if (el.type === 'shape') {
      if (el.shape === 'glass') {
        const g = div('a-glass');
        g.style.borderRadius = (s.radius ?? 28) + 'px';
        g.style.background = s.color2
          ? `linear-gradient(${s.gradAngle ?? 135}deg, ${hexA(s.fill, s.fillOpacity ?? .1)}, ${hexA(s.color2, s.fillOpacity ?? .1)})`
          : hexA(s.fill || '#ffffff', s.fillOpacity ?? .07);
        g.style.border = `${s.strokeWidth ?? 1}px solid ${hexA(s.stroke || '#ffffff', s.strokeOpacity ?? .16)}`;
        if (!opts || opts.mode !== 'static') g.style.backdropFilter = `blur(${s.blur ?? 26}px) saturate(150%)`; // thumbnails: no live backdrop blur (RAM)
        g.style.boxShadow = '0 30px 80px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.14)';
        inn.appendChild(g);
      } else if (el.shape === 'glow') {
        const g = div('a-glass');
        g.style.borderRadius = '50%';
        g.style.background = `radial-gradient(closest-side, ${hexA(s.fill, s.fillOpacity ?? .85)}, ${hexA(s.color2 || s.fill, 0)})`;
        if (!opts || opts.mode !== 'static') g.style.filter = `blur(${s.blur ?? 30}px)`; // thumbnails: gradient only, no GPU blur layer
        inn.appendChild(g);
      } else inn.appendChild(shapeSvg(el));
    } else if (el.type === 'line') {
      inn.appendChild(lineSvg(el));
    } else if (el.type === 'image') {
      inn.appendChild(imageNode(el, project, opts));
    } else if (el.type === 'table') {
      inn.appendChild(tableNode(el));
    } else if (el.type === 'chart') {
      inn.appendChild(chartNode(el));
    } else if (el.type === 'icon') {
      inn.appendChild(iconNode(el));
    }
    return n;
  }

  function renderSlide(slide, project, opts = {}) {
    const root = div('a-slide');
    root.dataset.sid = slide.id;
    const bg = slide.bg || {};
    root.style.background = bgCss(bg);
    if (bg.image) {
      const im = div('a-bgimg');
      im.style.backgroundImage = `url("${asset(project, bg.image)}")`;
      im.style.opacity = bg.imageOpacity ?? 1;
      if (bg.imageBlur) { im.style.filter = `blur(${bg.imageBlur}px)`; im.style.inset = '-40px'; }
      root.appendChild(im);
    }
    if (opts.mode === 'static') root.classList.add('a-static');
    const fxl = opts.mode === 'static' ? null : fxLayer(bg, slide.id); // thumbnails skip living backgrounds (RAM)
    if (fxl) root.appendChild(fxl);
    slide.elements.forEach((el, i) => {
      if (el.hidden && opts.mode !== 'edit') return;
      const n = renderElement(el, project, opts);
      n.style.zIndex = i + 1;
      if (el.hidden) n.style.opacity = .25;
      root.appendChild(n);
    });
    if (bg.vignette) root.appendChild(div('a-vignette'));
    if (bg.grain && opts.mode !== 'static') root.appendChild(div('a-grain'));
    return root;
  }

  // Scaled, non-interactive preview of a slide
  function thumb(slide, project, width, opts = {}) {
    const wrap = div('a-thumb');
    const h = Math.round(width * H / W);
    wrap.style.cssText = `position:relative;width:${width}px;height:${h}px;overflow:hidden`;
    const stage = div('a-stage');
    stage.style.transform = `scale(${width / W})`;
    stage.appendChild(renderSlide(slide, project, { mode: opts.mode || 'static' }));
    wrap.appendChild(stage);
    return wrap;
  }

  // ---------------- animation engine ----------------
  // custom curve from the Bezier editor: a.ease === 'custom', a.bez = [x1, y1, x2, y2]
  const easeOf = (a, d) => (a && a.ease === 'custom' && Array.isArray(a.bez) && a.bez.length === 4) ? `cubic-bezier(${a.bez.map(v => +(+v).toFixed(3)).join(',')})` : ((a && EASES[a.ease]) || d);
  const EASES = {
    smooth: 'cubic-bezier(.2,.75,.2,1)',
    spring: 'cubic-bezier(.34,1.5,.5,1)',
    bounce: 'linear(0, .36 9%, .66 18%, .9 27%, 1 33%, .94 40%, .92 43%, .94 47%, 1 55%, .985 63%, 1 72%, .997 85%, 1)',
    sharp: 'cubic-bezier(.7,0,.2,1)',
    linear: 'linear'
  };
  const EASE = EASES.smooth;
  const ANIMS = {
    none: 'Без анімації',
    fadeUp: 'Fade-up + blur', scaleIn: 'Scale-in', blurIn: 'Розмиття', slideLeft: 'Виїзд', flipIn: '3D-переворот',
    bounceIn: 'Пружина', rotateIn: 'Поворот', zoomOut: 'Наближення', wipeDown: 'Шторка',
    stagger: 'По черзі (слова)', lines: 'По рядках', letters: 'По буквах', maskUp: 'Підйом з маски', typewriter: 'Друкарська машинка',
    shine: 'Shine', highlight: 'Маркер', counter: 'Лічильник',
    draw: 'Малювання', grow: 'Ріст (діаграми)', kenburns: 'Ken Burns',
    float: 'Ширяння', pulse: 'Пульс', glow: 'Сяйво', wiggle: 'Похитування', spin: 'Обертання',
    rollIn: 'Перекат', unfold: 'Розгортання', drop: 'Падіння', tilt3D: '3D-нахил',
    glitch: 'Глітч', flicker: 'Неон', swing: 'Завіса', elastic: 'Гумка', spotlight: 'Прожектор',
    scatter: 'Збір букв', wave: 'Хвиля букв', heartbeat: 'Серцебиття', hue: 'Веселка'
  };
  const ANIM_GROUPS = [
    ['Поява', ['none', 'fadeUp', 'scaleIn', 'blurIn', 'slideLeft', 'flipIn', 'bounceIn', 'rotateIn', 'zoomOut', 'wipeDown', 'swing', 'elastic', 'spotlight', 'glitch', 'flicker', 'rollIn', 'unfold', 'drop', 'tilt3D']],
    ['Текст', ['stagger', 'lines', 'letters', 'scatter', 'maskUp', 'typewriter', 'shine', 'highlight', 'counter']],
    ['Графіка', ['draw', 'grow', 'kenburns']],
    ['Постійні', ['float', 'pulse', 'glow', 'wiggle', 'spin', 'wave', 'heartbeat', 'hue']]
  ];

  function splitWords(t, text, mask) {
    t.textContent = '';
    const out = [];
    for (const part of String(text).split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { t.appendChild(document.createTextNode(part)); continue; }
      const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = part;
      if (mask) { const m = document.createElement('span'); m.className = 'wm'; m.appendChild(sp); t.appendChild(m); }
      else t.appendChild(sp);
      out.push(sp);
    }
    return out;
  }
  function splitChars(t, text) {
    t.textContent = '';
    const out = [];
    for (const part of String(text).split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { t.appendChild(document.createTextNode(part)); continue; }
      const w = document.createElement('span'); w.className = 'w';
      for (const ch of part) { const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; w.appendChild(c); out.push(c); }
      t.appendChild(w);
    }
    return out;
  }

  function parseNumber(content) {
    const m = String(content).match(/\d(?:[\d  ,.]*\d)?/);
    if (!m) return null;
    const raw = m[0];
    const dm = raw.match(/[.,](\d{1,2})$/);
    const dec = dm ? dm[1].length : 0;
    const intPart = dec ? raw.slice(0, -(dec + 1)) : raw;
    const ts = intPart.match(/[  ,.]/);
    return {
      pre: content.slice(0, m.index), post: content.slice(m.index + raw.length),
      dec, decSep: dec ? raw[raw.length - dec - 1] : '.', sep: ts ? ts[0] : '',
      value: parseFloat(intPart.replace(/\D/g, '') + (dec ? '.' + dm[1] : ''))
    };
  }
  function fmtNumber(v, p) {
    const [i, d] = v.toFixed(p.dec).split('.');
    return i.replace(/\B(?=(\d{3})+(?!\d))/g, p.sep) + (p.dec ? p.decSep + d : '');
  }
  function countUp(node, text, delay, total) {
    const p = parseNumber(text); if (!p) return;
    node.textContent = p.pre + fmtNumber(0, p) + p.post;
    const t0 = performance.now() + delay;
    const tick = (now) => {
      if (!node.isConnected && now - t0 > 50) return;
      const k = Math.min(1, Math.max(0, (now - t0) / total));
      const e = k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
      node.textContent = p.pre + fmtNumber(p.value * e, p) + p.post;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function playIn(n, el, o = {}) {
    const a = el.anim || {};
    const type = a.type || 'none';
    n.classList.remove('a-pre');
    if (type === 'none') return;
    const inn = n.querySelector(':scope > .a-in');
    const dur = a.dur || 900;
    const delay = (o.ignoreDelay ? 0 : (a.delay || 0)) + (o.offset || 0);
    const ease = easeOf(a, EASE);
    const K = (frames, x = {}) => inn.animate(frames, { duration: dur, delay, easing: ease, fill: 'backwards', ...x });
    const fade = (d = 500) => inn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d, delay, fill: 'backwards' });
    const fadeUp = () => K([{ opacity: 0, transform: 'translateY(60px)', filter: 'blur(16px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }]);
    const t = n.querySelector('.a-txt');
    const plainText = t && !t.classList.contains('grad');
    const loop = (frames, opts) => inn.animate(frames, { delay: delay + 500, iterations: Infinity, ...opts });
    switch (type) {
      case 'fadeUp': fadeUp(); break;
      case 'scaleIn': K([{ opacity: 0, transform: 'scale(.78)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { easing: easeOf(a, EASES.spring) }); break;
      case 'blurIn': K([{ opacity: 0, transform: 'scale(1.08)', filter: 'blur(36px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: dur * 1.2 }); break;
      case 'slideLeft': {
        const d = { left: 'translateX(-160px)', right: 'translateX(160px)', up: 'translateY(140px)', down: 'translateY(-140px)' }[a.dir || 'left'];
        K([{ opacity: 0, transform: d, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }]); break;
      }
      case 'flipIn': inn.style.transformOrigin = '50% 0%'; K([{ opacity: 0, transform: 'perspective(1400px) rotateX(-75deg) translateY(-20px)' }, { opacity: 1, transform: 'perspective(1400px) rotateX(0deg)' }], { duration: dur * 1.15 }); break;
      case 'bounceIn': K([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)', offset: .35 }, { transform: 'scale(1)' }], { easing: easeOf(a, EASES.bounce), duration: dur * 1.4 }); break;
      case 'rotateIn': K([{ opacity: 0, transform: 'rotate(-14deg) scale(.82) translateY(50px)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { easing: easeOf(a, EASES.spring) }); break;
      case 'zoomOut': K([{ opacity: 0, transform: 'scale(1.7)', filter: 'blur(24px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: dur * 1.2 }); break;
      case 'wipeDown': K([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: dur * 1.2, easing: easeOf(a, EASES.sharp) }); break;
      case 'lines': {
        if (!plainText) { fadeUp(); break; }
        const words = splitWords(t, el.content, true);
        // group words into visual lines by their vertical position, then reveal line after line
        const tops = [...new Set(words.map(w => Math.round(w.offsetTop)))].sort((x, y) => x - y);
        const step = a.step || 160;
        words.forEach((w) => {
          const li = tops.indexOf(Math.round(w.offsetTop));
          w.animate([{ transform: 'translateY(105%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: dur * .9, delay: delay + li * step, easing: ease, fill: 'backwards' });
        });
        break;
      }
      case 'stagger': case 'maskUp': {
        if (!plainText) { fadeUp(); break; }
        const words = splitWords(t, el.content, type === 'maskUp');
        const step = a.step || Math.max(30, Math.min(110, 1400 / Math.max(1, words.length)));
        words.forEach((w, i) => w.animate(type === 'maskUp'
          ? [{ transform: 'translateY(110%)' }, { transform: 'none' }]
          : [{ opacity: 0, transform: 'translateY(.55em)', filter: 'blur(12px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
          { duration: dur * .85, delay: delay + i * step, easing: type === 'maskUp' ? EASES.sharp : ease, fill: 'backwards' }));
        break;
      }
      case 'letters': {
        if (!plainText) { fadeUp(); break; }
        const chars = splitChars(t, el.content);
        const step = Math.max(12, Math.min(45, 1300 / Math.max(1, chars.length)));
        chars.forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(.5em) rotate(10deg)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
          { duration: dur * .7, delay: delay + i * step, easing: easeOf(a, EASES.spring), fill: 'backwards' }));
        break;
      }
      case 'typewriter': {
        if (!t) { fadeUp(); break; }
        const full = String(el.content), speed = Math.max(18, Math.min(70, (a.dur || 1500) / Math.max(1, full.length)));
        const caret = document.createElement('span'); caret.className = 'a-caret';
        const txt = document.createTextNode('');
        t.textContent = ''; t.append(txt, caret);
        caret.style.background = el.style.color2 || el.style.color || '#fff';
        let i = 0;
        const step = () => { if (!n.isConnected && i) return; i++; txt.data = full.slice(0, i); if (i < full.length) setTimeout(step, full[i - 1] === ' ' ? speed * .6 : speed * (0.7 + Math.random() * .6)); else setTimeout(() => caret.remove(), 1600); };
        setTimeout(step, delay + 150);
        break;
      }
      case 'highlight': {
        fade(400);
        if (!plainText) break;
        const hl = document.createElement('span'); hl.className = 'a-hl';
        hl.textContent = el.content; t.textContent = ''; t.appendChild(hl);
        const c = hexA(a.color || el.style.color2 || '#e8c27a', .42);
        hl.style.backgroundImage = `linear-gradient(transparent 58%, ${c} 58%, ${c} 94%, transparent 94%)`;
        hl.animate([{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: dur * 1.3, delay: delay + 350, easing: EASES.sharp, fill: 'both' });
        break;
      }
      case 'counter': {
        K([{ opacity: 0, transform: 'translateY(30px)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: 600 });
        if (t) countUp(t, el.content, delay, a.dur && a.dur > 900 ? a.dur : 2200);
        break;
      }
      case 'grow': {
        fade(350);
        const bars = n.querySelectorAll('.a-bar');
        bars.forEach((b, i) => b.animate([{ transform: b.style.transformOrigin.startsWith('left') ? 'scaleX(0)' : 'scaleY(0)' }, { transform: 'none' }], { duration: dur * 1.2, delay: delay + 150 + i * 110, easing: easeOf(a, EASES.spring), fill: 'backwards' }));
        n.querySelectorAll('.a-seg').forEach((c, i) => { const L = +c.dataset.len; c.animate([{ strokeDasharray: `0 9999` }, { strokeDasharray: `${Math.max(0, L - 3)} 9999` }], { duration: dur * 1.3, delay: delay + 200 + i * 220, easing: EASES.sharp, fill: 'backwards' }); });
        n.querySelectorAll('.a-cv').forEach((v, i) => countUp(v, v.textContent, delay + 150 + i * 110, dur * 1.6));
        if (!bars.length && !n.querySelector('.a-seg')) { inn.style.transformOrigin = '50% 100%'; K([{ transform: 'scaleY(0)' }, { transform: 'none' }], { easing: EASES.spring }); }
        break;
      }
      case 'draw': {
        const shp = [...n.querySelectorAll('.a-shp')].filter(p => p.getAttribute('stroke') !== 'none' && !p.getAttribute('stroke-dasharray'));
        if (shp.length) {
          inn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, delay, fill: 'backwards' });
          shp.forEach(p => {
            const L = Math.ceil(p.getTotalLength ? p.getTotalLength() : 2000) + 2;
            p.style.strokeDasharray = L;
            const an = p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: dur * 1.5, delay, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
            an.finished.then(() => { p.style.strokeDasharray = ''; }).catch(() => {});
            const f = p.getAttribute('fill');
            if (f && f !== 'none') p.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 700, delay: delay + dur * 1.1, fill: 'backwards' });
          });
          n.querySelectorAll('.a-deco').forEach(d => { d.style.transformBox = 'fill-box'; d.style.transformOrigin = 'center'; d.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: delay + dur * 1.2, fill: 'backwards', easing: EASE }); });
        } else {
          K([{ clipPath: 'inset(0 100% 0 0)', opacity: .2 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }], { duration: dur * 1.4, easing: 'cubic-bezier(.65,0,.35,1)' });
        }
        break;
      }
      case 'shine': {
        K([{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }], { duration: 700 });
        const lp = a.loop !== false;
        const frames = (from, to) => lp
          ? [{ backgroundPosition: from, offset: 0 }, { backgroundPosition: to, offset: .42 }, { backgroundPosition: to, offset: 1 }]
          : [{ backgroundPosition: from }, { backgroundPosition: to }];
        const timing = { duration: lp ? 3600 : 1500, delay: delay + 450, iterations: lp ? Infinity : 1, easing: 'cubic-bezier(.45,0,.25,1)' };
        if (t) {
          const s = el.style;
          const base = s.color2 ? `linear-gradient(${s.gradAngle ?? 90}deg, ${s.color}, ${s.color2})` : `linear-gradient(${s.color}, ${s.color})`;
          t.classList.add('grad');
          t.style.textShadow = 'none';
          t.style.backgroundImage = `linear-gradient(100deg, transparent 0%, transparent 42%, ${hexA(s.shine || '#ffffff', .95)} 50%, transparent 58%, transparent 100%), ${base}`;
          t.style.backgroundSize = '250% 100%, 100% 100%';
          t.style.backgroundRepeat = 'no-repeat';
          t.style.backgroundPosition = '100% 0, 0 0';
          t.animate(frames('100% 0, 0 0', '0% 0, 0 0'), timing);
        } else {
          const host = n.querySelector('.a-img, .a-glass, .a-icon') || inn;
          const band = div();
          band.style.cssText = 'position:absolute;top:-25%;bottom:-25%;left:0;width:34%;pointer-events:none;mix-blend-mode:overlay;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:translateX(-150%) skewX(-18deg);z-index:5';
          host.style.overflow = 'hidden';
          host.appendChild(band);
          band.animate(lp
            ? [{ transform: 'translateX(-150%) skewX(-18deg)', offset: 0 }, { transform: 'translateX(330%) skewX(-18deg)', offset: .42 }, { transform: 'translateX(330%) skewX(-18deg)', offset: 1 }]
            : [{ transform: 'translateX(-150%) skewX(-18deg)' }, { transform: 'translateX(330%) skewX(-18deg)' }], timing);
        }
        break;
      }
      case 'kenburns': {
        K([{ opacity: 0, filter: 'blur(12px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: dur * 1.3 });
        const img = n.querySelector('img');
        if (img) img.animate([{ transform: 'scale(1.0) translate(0,0)' }, { transform: 'scale(1.14) translate(-1.5%,-1.2%)' }], { duration: 16000, delay, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        break;
      }
      case 'float': fadeUp(); loop([{ translate: '0 0' }, { translate: '0 -16px' }], { duration: 3400, direction: 'alternate', easing: 'ease-in-out', delay: delay + dur }); break;
      case 'pulse': fade(); loop([{ scale: '1' }, { scale: '1.06' }], { duration: 1300, direction: 'alternate', easing: 'ease-in-out' }); break;
      case 'glow': {
        fade();
        const c = hexA(a.color || el.style.color2 || el.style.color || el.style.fill || '#e8c27a', .75);
        loop([{ filter: `drop-shadow(0 0 0px ${c})` }, { filter: `drop-shadow(0 0 28px ${c})` }], { duration: 1800, direction: 'alternate', easing: 'ease-in-out' });
        break;
      }
      case 'wiggle': fade(); loop([{ rotate: '0deg' }, { rotate: '-4deg', offset: .1 }, { rotate: '4deg', offset: .2 }, { rotate: '-3deg', offset: .3 }, { rotate: '2deg', offset: .4 }, { rotate: '0deg', offset: .5 }, { rotate: '0deg' }], { duration: 2400, easing: 'ease-in-out' }); break;
      case 'spin': fade(); loop([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: Math.max(2000, dur * 10), easing: 'linear' }); break;
      case 'swing': inn.style.transformOrigin = '50% 0%'; K([{ opacity: 0, transform: 'perspective(1200px) rotateX(-95deg)' }, { opacity: 1, transform: 'perspective(1200px) rotateX(22deg)', offset: .45 }, { transform: 'perspective(1200px) rotateX(-9deg)', offset: .7 }, { transform: 'perspective(1200px) rotateX(0deg)' }], { duration: dur * 1.5, easing: 'ease-out' }); break;
      case 'elastic': K([{ opacity: 0, transform: 'scale(0,1)' }, { opacity: 1, transform: 'scale(1.18,.78)', offset: .35 }, { transform: 'scale(.9,1.12)', offset: .55 }, { transform: 'scale(1.04,.97)', offset: .75 }, { transform: 'none' }], { duration: dur * 1.3, easing: 'ease-out' }); break;
      case 'spotlight': K([{ clipPath: 'circle(0% at 50% 50%)', filter: 'brightness(2.2)' }, { clipPath: 'circle(75% at 50% 50%)', filter: 'brightness(1)' }], { duration: dur * 1.3, easing: EASES.sharp }); break;
      case 'glitch': {
        const f = []; for (let k = 0; k <= 10; k++) { const on = k < 9; f.push({ offset: k / 10, opacity: k === 0 ? 0 : 1, transform: on ? `translate(${(Math.random() - .5) * 26}px,${(Math.random() - .5) * 8}px) skewX(${(Math.random() - .5) * 18}deg)` : 'none', filter: on ? `drop-shadow(${(Math.random() * 6 + 3) | 0}px 0 0 rgba(255,0,80,.8)) drop-shadow(-${(Math.random() * 6 + 3) | 0}px 0 0 rgba(0,220,255,.8))` : 'none', clipPath: on ? `inset(${Math.random() * 40 | 0}% 0 ${Math.random() * 40 | 0}% 0)` : 'inset(0)' }); }
        K(f, { duration: Math.max(500, dur * .8), easing: 'steps(1)' }); break;
      }
      case 'flicker': {
        const c = hexA(el.style.color2 || el.style.color || el.style.fill || el.style.stroke || '#ffffff', .85);
        K([{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: .15, offset: .16 }, { opacity: 1, offset: .24 }, { opacity: .35, offset: .3 }, { opacity: 1, offset: .42 }, { opacity: .6, offset: .5 }, { opacity: 1, filter: `drop-shadow(0 0 18px ${c})`, offset: .75 }, { opacity: 1, filter: 'drop-shadow(0 0 0 transparent)' }], { duration: dur * 1.6, easing: 'linear' }); break;
      }
      case 'scatter': {
        if (!plainText) { fadeUp(); break; }
        const chars = splitChars(t, el.content);
        chars.forEach((c, i) => c.animate([{ opacity: 0, transform: `translate(${(Math.random() - .5) * 600}px,${(Math.random() - .5) * 400}px) rotate(${(Math.random() - .5) * 360}deg) scale(${.4 + Math.random()})`, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
          { duration: dur * 1.3, delay: delay + Math.random() * 350, easing: EASES.spring, fill: 'backwards' }));
        break;
      }
      case 'wave': {
        if (!plainText) { fade(); loop([{ translate: '0 0' }, { translate: '0 -12px' }], { duration: 1200, direction: 'alternate', easing: 'ease-in-out' }); break; }
        fade(400);
        const chars = splitChars(t, el.content);
        chars.forEach((c, i) => c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-.18em)' }, { transform: 'translateY(0)' }], { duration: 1400, delay: delay + 400 + i * 70, iterations: Infinity, easing: 'ease-in-out' }));
        break;
      }
      case 'rollIn': K([{ opacity: 0, transform: 'translateX(-240px) rotate(-120deg)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { easing: easeOf(a, EASES.spring), duration: dur * 1.2 }); break;
      case 'unfold': K([{ opacity: 0, transform: 'scaleY(.02) scaleX(.6)', filter: 'blur(10px) brightness(2)' }, { opacity: 1, transform: 'scaleY(.06) scaleX(1)', filter: 'blur(4px) brightness(1.6)', offset: .35 }, { opacity: 1, transform: 'none', filter: 'blur(0px) brightness(1)' }], { duration: dur * 1.3, easing: EASES.sharp }); break;
      case 'drop': K([{ opacity: 0, transform: 'translateY(-420px)' }, { opacity: 1, transform: 'translateY(0)', offset: .55 }, { transform: 'translateY(-38px)', offset: .72 }, { transform: 'translateY(0)', offset: .86 }, { transform: 'translateY(-10px)', offset: .93 }, { transform: 'none' }], { duration: dur * 1.5, easing: 'ease-in' }); break;
      case 'tilt3D': inn.style.transformOrigin = '0% 50%'; K([{ opacity: 0, transform: 'perspective(1600px) rotateY(70deg) translateX(-60px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'perspective(1600px) rotateY(0deg)', filter: 'blur(0px)' }], { duration: dur * 1.2, easing: easeOf(a, EASES.smooth) }); break;
      case 'heartbeat': fade(); loop([{ scale: '1' }, { scale: '1.14', offset: .14 }, { scale: '1.03', offset: .28 }, { scale: '1.12', offset: .42 }, { scale: '1', offset: .7 }, { scale: '1' }], { duration: 1500, easing: 'ease-in-out' }); break;
      case 'hue': fade(); loop([{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }], { duration: 6000, easing: 'linear' }); break;
      default: fadeUp();
    }
  }

  // confetti burst over the stage
  function confetti(stage, colors) {
    const cols = colors && colors.length ? colors : ['#e8c27a', '#9d8bff', '#6ee7f9', '#f472b6', '#4ade80', '#ffffff'];
    const layer = div('a-confetti');
    layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:9500';
    stage.appendChild(layer);
    for (let i = 0; i < 160; i++) {
      const p = div(), w = 10 + Math.random() * 14, hh = 6 + Math.random() * 10;
      const fromLeft = i % 2 === 0;
      p.style.cssText = `position:absolute;left:${fromLeft ? -2 : 102}%;top:${55 + Math.random() * 30}%;width:${w}px;height:${hh}px;background:${cols[i % cols.length]};border-radius:${Math.random() > .6 ? '50%' : '2px'}`;
      layer.appendChild(p);
      const vx = (fromLeft ? 1 : -1) * (500 + Math.random() * 900), vy = -(700 + Math.random() * 600), rot = (Math.random() - .5) * 1440;
      p.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx * .6}px,${vy * .8}px) rotate(${rot * .5}deg)`, opacity: 1, offset: .35 },
        { transform: `translate(${vx}px,${vy * .2 + 900}px) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: 2600 + Math.random() * 1600, delay: Math.random() * 250, easing: 'cubic-bezier(.15,.6,.4,1)', fill: 'both' });
    }
    setTimeout(() => layer.remove(), 5000);
  }

  // ---------------- player ----------------
  const vtName = (k) => 'am-' + String(k).replace(/[^a-zA-Z0-9_-]/g, '_');

  class Player {
    constructor(host, project, o = {}) {
      this.host = host; this.project = project; this.o = o;
      this.i = -1; this.cur = null; this.queue = [];
      host.classList.add('a-viewport', 'a-play');
      this.stage = div('a-stage');
      host.appendChild(this.stage);
      this.fit = this.fit.bind(this);
      this.ro = new ResizeObserver(this.fit); this.ro.observe(host);
      this.fit();
    }
    fit() {
      const r = this.host.getBoundingClientRect();
      const s = Math.min(r.width / W, r.height / H) || 0.1;
      this.scale = s;
      this.stage.style.transform = `translate(${(r.width - W * s) / 2}px,${(r.height - H * s) / 2}px) scale(${s})`;
    }
    get slides() { return this.project.slides.filter(s => !s.skip); }
    get count() { return this.slides.length; }
    goto(i, dir = 'fwd', o = {}) {
      const slides = this.slides;
      if (i < 0 || i >= slides.length) return false;
      const prev = this.i >= 0 && this.cur ? slides[this.i] : null;
      const next = slides[i];
      let t = o.instant || !prev ? 'none' : ((dir === 'back' ? prev.transition : next.transition) || 'fade');
      if (prev && (prev.transition === 'morph' || next.transition === 'morph') && dir === 'back') t = 'morph';
      const morph = t === 'morph';
      this.i = i;
      clearTimeout(this.autoT);
      const matched = new Set();
      if (morph) {
        const nextKeys = new Set(next.elements.filter(e => e.morph && !e.hidden).map(e => e.morph));
        const used = new Set();
        for (const el of prev.elements) {
          if (!el.morph || !nextKeys.has(el.morph) || used.has(el.morph)) continue;
          const node = this.cur.querySelector(`[data-id="${el.id}"]`);
          if (!node) continue;
          used.add(el.morph); matched.add(el.morph);
          node.style.viewTransitionName = vtName(el.morph);
        }
      }
      const reveal = !!o.revealAll;
      const swap = () => {
        const node = renderSlide(next, this.project, { mode: 'play' });
        const used = new Set();
        for (const el of next.elements) {
          const n = node.querySelector(`[data-id="${el.id}"]`);
          if (!n) continue;
          if (morph && matched.has(el.morph) && !used.has(el.morph)) {
            used.add(el.morph); n.style.viewTransitionName = vtName(el.morph); n.dataset.matched = '1';
          } else if (!reveal && el.anim && el.anim.type && el.anim.type !== 'none') n.classList.add('a-pre');
        }
        this.stage.replaceChildren(node);
        this.cur = node;
      };
      const run = () => this.entrances(next, reveal);
      if (t !== 'none' && document.startViewTransition && !this.o.noTransitions) {
        const de = document.documentElement;
        de.dataset.vt = t; de.dataset.dir = dir;
        const vt = document.startViewTransition(swap);
        vt.updateCallbackDone.then(() => setTimeout(run, morph ? 260 : 120)).catch(() => {});
        vt.finished.catch(() => {}).finally(() => {
          if (de.dataset.vt === t) { delete de.dataset.vt; delete de.dataset.dir; }
          this.stage.querySelectorAll('.a-el').forEach(n => { n.style.viewTransitionName = ''; });
        });
      } else { swap(); run(); }
      this.o.onChange && this.o.onChange(this.i, this);
      return true;
    }
    entrances(slide, reveal) {
      this.queue = [];
      const auto = [];
      const animated = slide.elements.filter(e => e.anim && e.anim.type && e.anim.type !== 'none');
      for (const el of animated) {
        const n = this.cur.querySelector(`[data-id="${el.id}"]`);
        if (!n) continue;
        if (n.dataset.matched || reveal) { n.classList.remove('a-pre'); if (reveal && ['kenburns', 'float', 'shine'].includes(el.anim.type)) playIn(n, el, { ignoreDelay: true }); continue; }
        if (el.anim.trigger === 'click') this.queue.push([n, el]); else auto.push([n, el]);
      }
      this.queue.sort((a, b) => (a[1].anim.order ?? 0) - (b[1].anim.order ?? 0));
      auto.forEach(([n, el]) => playIn(n, el));
      if (slide.confetti && !reveal) setTimeout(() => this.cur && confetti(this.cur, slide.confettiColors), 350);
      if (slide.auto > 0 && !this.o.noAuto) {
        const wait = () => { this.autoT = setTimeout(() => { if (this.queue.length) { this.next(); wait(); } else this.next(); }, slide.auto * 1000); };
        wait();
      }
    }
    next() {
      if (this.queue.length) { const [n, el] = this.queue.shift(); playIn(n, el); this.o.onChange && this.o.onChange(this.i, this); return 'step'; }
      return this.goto(this.i + 1, 'fwd') ? 'slide' : false;
    }
    prev() { return this.goto(this.i - 1, 'back', { revealAll: true }); }
    replay() { const i = this.i; this.i = -1; this.cur = null; this.goto(i, 'fwd', { instant: true }); }
    destroy() { clearTimeout(this.autoT); this.ro.disconnect(); this.stage.remove(); this.host.classList.remove('a-play'); }
  }

  G.Aurea = { W, H, renderSlide, renderElement, thumb, playIn, Player, ANIMS, ANIM_GROUPS, EASES, ICONS, confetti, hexA, bgCss, fontCss, parseNumber };
})(window);
