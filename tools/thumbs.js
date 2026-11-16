// Renders template slides to JPG for the website: npx electron tools/thumbs.js
const { app, BrowserWindow } = require('electron');
if (process.env.THUMB_OUT) app.commandLine.appendSwitch('force-device-scale-factor', '1');
const path = require('path'), fs = require('fs');
const OUT = process.env.THUMB_OUT ? path.resolve(process.env.THUMB_OUT) : path.join(__dirname, '..', 'site', 'img', 'tpl');
const SZ = +(process.env.THUMB_W || 960), SH = Math.round(SZ * 9 / 16);
const ONLY = process.env.THUMB_ONLY ? process.env.THUMB_ONLY.split(',').map(x => { const [a, b] = x.split(':'); return [a, +b]; }) : null;
const JOBS0 = [['museum',0],['nightgallery',0],['nightgallery',2],['redpitch',0],['redpitch',2],['dusk',0],['dusk',1],['editorial',0],['editorial',2],['academy',0],['academy',1],['cosmos',0],['journal',0],['saas',0],['aurora',0],['paper',0]];
const PREVIEW = path.join(__dirname, '..', 'src', '_preview.html');
const HTML = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="player.css">
<style>html,body{overflow:hidden}body{margin:0;background:#888;display:flex;flex-wrap:wrap;gap:8px}</style>
<script src="player.js"></script><script src="templates.js"></script>
<script>
const q=new URLSearchParams(location.search),ids=(q.get('t')||'nightgallery').split(','),W=+(q.get('w')||460),N=q.get('n');
if(N!==null)document.documentElement.style.cssText='';
addEventListener('DOMContentLoaded',()=>{if(N!==null)document.body.style.gap='0';for(const id of ids){const p=AureaTemplates.list.find(t=>t.id===id).make();p.slides.forEach((s,i)=>{if(N===null||+N===i)document.body.appendChild(Aurea.thumb(s,p,W));});}});
</script>
`;
const JOBS = ONLY || JOBS0;
app.whenReady().then(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(PREVIEW, HTML);
  const w = new BrowserWindow({ show: false, width: SZ, height: SH, useContentSize: true, webPreferences: { offscreen: true } });
  for (const [id, n] of JOBS) {
    await w.loadFile(path.join(__dirname, '..', 'src', '_preview.html'), { query: { t: id, w: String(SZ), n: String(n) } });
    await new Promise(r => setTimeout(r, 1800));
    const img = await w.webContents.capturePage({ x: 0, y: 0, width: SZ, height: SH });
    fs.writeFileSync(path.join(OUT, process.env.THUMB_OUT ? `${id}.jpg` : `${id}-${n}${ONLY ? '-' + SZ : ''}.jpg`), img.toJPEG(process.env.THUMB_OUT ? 80 : (ONLY ? 88 : 82)));
    console.log('ok', id, n);
  }
  fs.unlinkSync(PREVIEW);
  app.exit(0);
});
