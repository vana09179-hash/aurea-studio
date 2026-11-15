// Collects Cyrillic + Latin subsets of bundled fonts into src/fonts (works offline).
const fs = require('fs'), path = require('path');
const out = 'src/fonts';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const keep = /-(latin|latin-ext|cyrillic|cyrillic-ext)-(wght|\d{3})-(normal|italic)\.woff2/;
let css = '';
const families = {};
for (const base of ['node_modules/@fontsource-variable', 'node_modules/@fontsource']) {
  if (!fs.existsSync(base)) continue;
  for (const d of fs.readdirSync(base)) {
    const dir = path.join(base, d);
    const cssFiles = fs.readdirSync(dir).filter(f => /^(index|wght-italic|400|500|700|400-italic|700-italic)\.css$/.test(f));
    let hasCyr = false;
    const seen = new Set();
    for (const f of cssFiles) {
      for (const b of fs.readFileSync(path.join(dir, f), 'utf8').split('@font-face').slice(1)) {
        const m = b.match(/url\(\.\/files\/([^)]+)\)/);
        if (!m || !keep.test(m[1]) || seen.has(m[1])) continue;
        seen.add(m[1]);
        if (/-cyrillic-/.test(m[1])) hasCyr = true;
        fs.copyFileSync(path.join(dir, 'files', m[1]), path.join(out, m[1]));
        const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1].replace(/ Variable$/, '');
        families[fam] = true;
        css += '@font-face' + b.replace(/\/\*[^*]*\*\//g, '').replace(/ Variable'/, "'").replace(/url\(\.\/files\//, 'url(./').trim() + '\n';
      }
    }
    if (!hasCyr) console.log('no cyrillic:', d);
  }
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);
console.log(Object.keys(families).length, 'families:', Object.keys(families).join(', '));
console.log(fs.readdirSync(out).length, 'files');
