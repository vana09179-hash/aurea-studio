// Rasterizes build/icon.svg to PNGs: npx electron tools/raster-icon.js
const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path'), fs = require('fs');
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.whenReady().then(async () => {
  const svg = fs.readFileSync(path.join(__dirname, '..', 'build', 'icon.svg'), 'utf8');
  const w = new BrowserWindow({ show: false, width: 1024, height: 1024, useContentSize: true, transparent: true, frame: false, webPreferences: { offscreen: true, zoomFactor: 1 } });
  w.webContents.setZoomFactor(1);
  await w.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`<html><body style="margin:0;background:transparent;overflow:hidden">${svg.replace('<svg ', '<svg style="display:block;width:1024px;height:1024px" ')}</body></html>`));
  await new Promise(r => setTimeout(r, 800));
  let img = await w.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 });
  img = nativeImage.createFromBuffer(img.resize({ width: 1024, height: 1024, quality: 'best' }).toPNG());
  const out = (p, s) => { fs.writeFileSync(path.join(__dirname, '..', p), img.resize({ width: s, height: s, quality: 'best' }).toPNG()); console.log('wrote', p, s); };
  out('build/icon.png', 1024); out('site/img/icon.png', 256); out('site/img/apple-touch-icon.png', 180); out('site/img/icon-512.png', 512);
  app.exit(0);
});
