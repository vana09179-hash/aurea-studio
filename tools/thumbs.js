// Renders template slides to JPG for the website: npx electron tools/thumbs.js
const { app, BrowserWindow } = require('electron');
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, '..', 'site', 'img', 'tpl');
const JOBS = [['museum',0],['nightgallery',0],['nightgallery',2],['redpitch',0],['redpitch',2],['dusk',0],['dusk',1],['editorial',0],['editorial',2],['academy',0],['academy',1],['cosmos',0],['journal',0],['saas',0],['aurora',0],['paper',0]];
const PREVIEW = path.join(__dirname, '..', 'src', '_preview.html');
const HTML = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="player.css">
<style>body{margin:0;background:#888;display:flex;flex-wrap:wrap;gap:8px}</style>
<script src="player.js"></script><script src="templates.js"></script>
<script>
const q=new URLSearchParams(location.search),ids=(q.get('t')||'nightgallery').split(','),W=+(q.get('w')||460),N=q.get('n');
if(N!==null)document.documentElement.style.cssText='';
addEventListener('DOMContentLoaded',()=>{if(N!==null)document.body.style.gap='0';for(const id of ids){const p=AureaTemplates.list.find(t=>t.id===id).make();p.slides.forEach((s,i)=>{if(N===null||+N===i)document.body.appendChild(Aurea.thumb(s,p,W));});}});
</script>
`;
app.whenReady().then(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(PREVIEW, HTML);
  const w = new BrowserWindow({ show: false, width: 960, height: 540, useContentSize: true, webPreferences: { offscreen: true } });
  for (const [id, n] of JOBS) {
    await w.loadFile(path.join(__dirname, '..', 'src', '_preview.html'), { query: { t: id, w: '960', n: String(n) } });
    await new Promise(r => setTimeout(r, 1800));
    const img = await w.webContents.capturePage({ x: 0, y: 0, width: 960, height: 540 });
    fs.writeFileSync(path.join(OUT, `${id}-${n}.jpg`), img.toJPEG(82));
    console.log('ok', id, n);
  }
  fs.unlinkSync(PREVIEW);
  app.exit(0);
});
