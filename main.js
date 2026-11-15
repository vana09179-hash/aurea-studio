// Aurea Studio — main process
const { app, BrowserWindow, ipcMain, dialog, protocol, net, screen, shell, Menu, WebContentsView } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);

const SRC = path.join(__dirname, 'src');
const IS_WIN = process.platform === 'win32', IS_MAC = process.platform === 'darwin';
const overlayFor = (t) => ({ color: IS_WIN ? '#00000000' : (t === 'light' ? '#f6f3ee' : '#101016'), symbolColor: t === 'light' ? '#3b3650' : '#d9d4ca', height: 56 });
let win = null;
let audience = null;
const userDir = () => app.getPath('userData');
const recentFile = () => path.join(userDir(), 'recent.json');
const autosaveFile = () => path.join(userDir(), 'autosave.aurea');

const argv = process.argv.slice(1);
const shotsArg = argv.find(a => a.startsWith('--shots='));
const SHOTS_DIR = shotsArg ? shotsArg.slice(8) : null;
const LOG = (...a) => { if (SHOTS_DIR) try { fs.mkdirSync(SHOTS_DIR, { recursive: true }); fs.appendFileSync(path.join(SHOTS_DIR, 'main.log'), a.map(String).join(' ') + '\n'); } catch {} };
LOG('start', process.argv.join(' '));
const argFile = argv.find(a => /\.(aurea|html?)$/i.test(a) && fs.existsSync(a));
const testHtmlArg = argv.find(a => a.startsWith('--test-html='));
const TEST_HTML = testHtmlArg ? testHtmlArg.slice(12) : null;

function readRecent() {
  try { return JSON.parse(fs.readFileSync(recentFile(), 'utf8')); } catch { return []; }
}
function addRecent(p, title) {
  let list = readRecent().filter(r => r.path !== p);
  list.unshift({ path: p, title: title || path.basename(p).replace(/\.(aurea|html?)$/i, ''), kind: /\.html?$/i.test(p) ? 'html' : 'aurea', time: Date.now() });
  list = list.slice(0, 12);
  try { fs.writeFileSync(recentFile(), JSON.stringify(list)); } catch {}
}

function createWindow() {
  win = new BrowserWindow({
    width: 1480, height: 920, minWidth: 1100, minHeight: 680,
    title: 'Aurea Studio',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: IS_WIN ? '#00000000' : '#f6f3ee',
    ...(IS_WIN ? { backgroundMaterial: 'acrylic' } : {}),
    titleBarStyle: 'hidden',
    ...(IS_MAC ? { trafficLightPosition: { x: 16, y: 20 } } : { titleBarOverlay: overlayFor('light') }),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      backgroundThrottling: !SHOTS_DIR
    }
  });
  if (IS_MAC) {
    // macOS needs an app menu, otherwise Cmd+C / Cmd+V / Cmd+Q stop working
    Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'windowMenu' }]));
  } else Menu.setApplicationMenu(null);
  win.webContents.on('did-fail-load', (...a) => LOG('fail', a.slice(1, 4)));
  win.webContents.on('did-finish-load', () => LOG('loaded'));
  win.webContents.on('console-message', (_e, l, m) => LOG('console', m));
  win.webContents.on('render-process-gone', (_e, d) => LOG('gone', JSON.stringify(d)));
  win.loadURL('app://local/index.html');
  let shown = false;
  const reveal = () => { if (shown || !win) return; shown = true; LOG('show'); win.show(); if (SHOTS_DIR) runShots(); };
  win.once('ready-to-show', reveal);
  win.webContents.once('did-finish-load', () => setTimeout(reveal, 300));
  setTimeout(reveal, 4000);
  win.on('enter-full-screen', () => { win.webContents.send('fullscreen', true); layoutViewer(); });
  win.on('leave-full-screen', () => { win.webContents.send('fullscreen', false); if (viewerFull) setViewerFull(false); layoutViewer(); });
  win.on('resize', layoutViewer);
  win.on('closed', () => { win = null; if (audience && !audience.isDestroyed()) audience.close(); });
}

app.whenReady().then(() => {
  LOG('ready');
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let p = decodeURIComponent(u.pathname);
    const file = path.normalize(path.join(SRC, p));
    if (!file.startsWith(SRC)) return new Response('forbidden', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
});
app.on('window-all-closed', () => app.quit());
// macOS: double-click on a .aurea / .html file in Finder
let pendingOpen = null;
app.on('open-file', (e, p) => {
  e.preventDefault();
  if (win && win.webContents && !win.webContents.isLoading()) win.webContents.send('open-path', p);
  else pendingOpen = p;
});

// ---------- HTML presentation viewer ----------
// The page is loaded from its own folder (file://), so relative paths (img/...) work,
// and it runs in a sandboxed WebContentsView: no Node, no access to the app.
let viewer = null, viewerFull = false, viewerPath = null;
function viewerBounds() {
  const [w, h] = win.getContentSize();
  return viewerFull ? { x: 0, y: 0, width: w, height: h } : { x: 12, y: 68, width: Math.max(100, w - 24), height: Math.max(100, h - 80) };
}
function layoutViewer() { if (viewer && win) viewer.setBounds(viewerBounds()); }
function viewerState(extra = {}) {
  if (!win) return;
  win.webContents.send('viewer-state', { open: !!viewer, path: viewerPath, full: viewerFull, title: viewer ? viewer.webContents.getTitle() : '', ...extra });
}
function setViewerFull(on) {
  if (!viewer) return;
  viewerFull = !!on;
  if (win.isFullScreen() !== viewerFull) win.setFullScreen(viewerFull);
  if (!viewerFull) viewer.webContents.executeJavaScript('document.fullscreenElement && document.exitFullscreen()').catch(() => {});
  try { viewer.setBorderRadius && viewer.setBorderRadius(viewerFull ? 0 : 14); } catch {}
  layoutViewer();
  setTimeout(layoutViewer, 350);
  viewerState();
  viewer.webContents.focus();
}
function closeViewer() {
  if (!viewer) return;
  if (viewerFull) { viewerFull = false; win.setFullScreen(false); }
  try { win.contentView.removeChildView(viewer); } catch {}
  try { viewer.webContents.close(); } catch {}
  viewer = null; viewerPath = null;
  viewerState();
}
async function openHtml(p) {
  if (!p || !fs.existsSync(p)) return { error: 'Файл не знайдено' };
  closeViewer();
  viewer = new WebContentsView({ webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, spellcheck: false } });
  viewer.setBackgroundColor('#000000');
  try { viewer.setBorderRadius && viewer.setBorderRadius(14); } catch {}
  win.contentView.addChildView(viewer);
  viewerPath = p;
  layoutViewer();
  const wc = viewer.webContents;
  wc.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  wc.on('will-navigate', (e, url) => { if (!/^file:/i.test(url)) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });
  wc.on('enter-html-full-screen', () => setViewerFull(true));
  wc.on('leave-html-full-screen', () => { if (viewerFull) setViewerFull(false); });
  wc.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { e.preventDefault(); setViewerFull(!viewerFull); }
    else if (input.key === 'Escape' && viewerFull) setViewerFull(false);
  });
  wc.on('page-title-updated', () => viewerState());
  viewerState({ loading: true });
  try { await wc.loadFile(p); } catch (err) { LOG('viewer load', err.message); }
  wc.focus();
  addRecent(p, wc.getTitle() || undefined);
  viewerState();
  return { path: p, title: wc.getTitle() };
}
ipcMain.handle('html:open', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: 'Відкрити HTML-презентацію', properties: ['openFile'],
    filters: [{ name: 'HTML-презентація', extensions: ['html', 'htm'] }]
  });
  if (r.canceled || !r.filePaths[0]) return null;
  return openHtml(r.filePaths[0]);
});
ipcMain.handle('html:openPath', async (_e, p) => openHtml(p));
ipcMain.handle('html:close', async () => { closeViewer(); return true; });
ipcMain.handle('html:fullscreen', async (_e, on) => { setViewerFull(on == null ? !viewerFull : on); return viewerFull; });
ipcMain.handle('html:reload', async () => { if (viewer) viewer.webContents.reload(); return true; });
ipcMain.handle('html:focus', async () => { if (viewer) viewer.webContents.focus(); return true; });
ipcMain.handle('html:hide', async (_e, hide) => { if (viewer) viewer.setVisible(!hide); return true; });

// ---------- optional file association (per-user HKCU; only when the user asks) ----------
function regRun(args) {
  return new Promise((res) => require('child_process').execFile('reg', args, { windowsHide: true }, (err) => res(!err)));
}
ipcMain.handle('assoc:set', async (_e, on) => {
  if (!IS_WIN) return { unsupported: true };
  const exe = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;
  const cmd = `"${exe}" "%1"`;
  const C = 'HKCU\\Software\\Classes';
  if (on) {
    const r = await dialog.showMessageBox(win, {
      type: 'question', buttons: ['Асоціювати', 'Скасувати'], defaultId: 0, cancelId: 1,
      title: 'Асоціація файлів',
      message: 'Відкривати файли .aurea в Aurea Studio і додати Aurea Studio до «Відкрити за допомогою» для .html?',
      detail: `Записується лише для вашого користувача. Шлях до програми:\n${exe}\nЯкщо перемістите .exe — повторіть цю дію.`
    });
    if (r.response !== 0) return { canceled: true };
    const ok = [
      await regRun(['add', `${C}\\AureaStudio.Presentation`, '/ve', '/d', 'Aurea Presentation', '/f']),
      await regRun(['add', `${C}\\AureaStudio.Presentation\\shell\\open\\command`, '/ve', '/d', cmd, '/f']),
      await regRun(['add', `${C}\\.aurea`, '/ve', '/d', 'AureaStudio.Presentation', '/f']),
      await regRun(['add', `${C}\\AureaStudio.Html`, '/ve', '/d', 'HTML-презентація (Aurea Studio)', '/f']),
      await regRun(['add', `${C}\\AureaStudio.Html\\shell\\open\\command`, '/ve', '/d', cmd, '/f']),
      await regRun(['add', `${C}\\.html\\OpenWithProgids`, '/v', 'AureaStudio.Html', '/d', '', '/f']),
      await regRun(['add', `${C}\\.htm\\OpenWithProgids`, '/v', 'AureaStudio.Html', '/d', '', '/f'])
    ].every(Boolean);
    return { ok };
  }
  const ok = [
    await regRun(['delete', `${C}\\AureaStudio.Presentation`, '/f']),
    await regRun(['delete', `${C}\\AureaStudio.Html`, '/f']),
    await regRun(['delete', `${C}\\.html\\OpenWithProgids`, '/v', 'AureaStudio.Html', '/f']),
    await regRun(['delete', `${C}\\.htm\\OpenWithProgids`, '/v', 'AureaStudio.Html', '/f'])
  ];
  return { ok: ok[0] || ok[1] };
});

async function runHtmlTest(shot, wait) {
  const res = {};
  const vshot = async (name) => { try { const img = await viewer.webContents.capturePage(); fs.writeFileSync(path.join(SHOTS_DIR, name + '-page.png'), img.toPNG()); await shot(name); } catch (e) { res.captureErrors = (res.captureErrors || 0) + 1; } };
  const key = (k) => { const wc = viewer.webContents; wc.sendInputEvent({ type: 'keyDown', keyCode: k }); if (k.length === 1) wc.sendInputEvent({ type: 'char', keyCode: k }); wc.sendInputEvent({ type: 'keyUp', keyCode: k }); };
  const ev = (s) => viewer.webContents.executeJavaScript(s);
  const r = await openHtml(TEST_HTML);
  res.open = r; await wait(2500);
  res.imagesLoaded = await ev(`[...document.images].filter(i => i.complete && i.naturalWidth > 0).length + '/' + document.images.length`);
  res.vtSupported = await ev('typeof document.startViewTransition');
  res.slide0 = await ev('typeof cur !== "undefined" ? cur : null');
  await vshot('13-html-viewer');
  viewer.webContents.focus();
  key('Right'); await wait(380);
  await vshot('14-html-transition-mid');
  await wait(1800);
  res.afterRight = await ev('typeof cur !== "undefined" ? cur : null');
  key('Space'); await wait(2200);
  res.afterSpace = await ev('typeof cur !== "undefined" ? cur : null');
  await vshot('15-html-slide3');
  key('Left'); await wait(1800);
  res.afterLeft = await ev('typeof cur !== "undefined" ? cur : null');
  key('F'); await wait(1800);
  res.fullscreenAfterF = { window: win.isFullScreen(), viewerFull, doc: await ev('!!document.fullscreenElement') };
  await vshot('16-html-fullscreen');
  key('Escape'); await wait(1500);
  res.afterEsc = { window: win.isFullScreen(), viewerFull };
  setViewerFull(true); await wait(1200);
  res.afterF11 = { window: win.isFullScreen(), viewerFull };
  setViewerFull(false); await wait(1000);
  res.recent = readRecent().slice(0, 2).map(x => x.kind + ':' + path.basename(x.path));
  fs.writeFileSync(path.join(SHOTS_DIR, 'html-test.json'), JSON.stringify(res, null, 2));
  closeViewer(); await wait(600);
  await win.webContents.executeJavaScript('window.__demo && window.__demo.run("home")').catch(() => {});
  await wait(1500);
  await shot('17-start-recent');
}

// ---------- free-licensed image search (Wikimedia Commons, Openverse) ----------
const UA = { 'User-Agent': 'AureaStudio/1.0 (desktop presentation editor)' };
ipcMain.handle('net:json', async (_e, url) => {
  const u = new URL(url);
  if (!['commons.wikimedia.org', 'api.openverse.org', 'www.wikidata.org'].includes(u.hostname)) throw new Error('host not allowed');
  const r = await net.fetch(url, { headers: UA });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
});
ipcMain.handle('net:image', async (_e, url) => {
  const u = new URL(url);
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('bad url');
  const r = await net.fetch(url, { headers: UA });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const type = (r.headers.get('content-type') || '').split(';')[0];
  if (!type.startsWith('image/')) throw new Error('не зображення');
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 30 * 1024 * 1024) throw new Error('завеликий файл');
  return `data:${type};base64,${buf.toString('base64')}`;
});

ipcMain.handle('win:theme', async (_e, t) => {
  if (!IS_MAC) { try { win.setTitleBarOverlay(overlayFor(t)); } catch {} }
  if (!IS_WIN) { try { win.setBackgroundColor(t === 'light' ? '#f6f3ee' : '#0b0b10'); } catch {} }
  return true;
});
// Pinterest opens as a normal browser window for inspiration (no scraping, no automation).
let pinWin = null;
ipcMain.handle('pin:open', async (_e, q) => {
  const url = 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(String(q || '').slice(0, 120));
  if (pinWin && !pinWin.isDestroyed()) { pinWin.loadURL(url); pinWin.focus(); return true; }
  pinWin = new BrowserWindow({ width: 1280, height: 880, title: 'Pinterest — натхнення', autoHideMenuBar: true, icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, partition: 'persist:inspiration' } });
  pinWin.webContents.setWindowOpenHandler(({ url: u }) => { if (/^https:\/\/([a-z]+\.)?pinterest\./i.test(u)) { pinWin.loadURL(u); } else if (/^https?:/i.test(u)) shell.openExternal(u); return { action: 'deny' }; });
  pinWin.on('closed', () => { pinWin = null; });
  pinWin.loadURL(url);
  return true;
});

ipcMain.handle('pptx:save', async (_e, { b64, name }) => {
  const r = await dialog.showSaveDialog(win, { title: 'Експорт у формат .pptx', defaultPath: path.join(app.getPath('documents'), (name || 'Презентація') + '.pptx'), filters: [{ name: 'Презентація .pptx', extensions: ['pptx'] }] });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, Buffer.from(b64, 'base64'));
  return r.filePath;
});
ipcMain.handle('pptx:open', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Імпорт .pptx', properties: ['openFile'], filters: [{ name: 'Презентація .pptx', extensions: ['pptx'] }] });
  if (r.canceled || !r.filePaths[0]) return null;
  return { name: path.basename(r.filePaths[0]), b64: fs.readFileSync(r.filePaths[0]).toString('base64') };
});
ipcMain.handle('debug:writeB64', async (_e, { name, b64 }) => {
  if (!SHOTS_DIR) return false;
  fs.writeFileSync(path.join(SHOTS_DIR, path.basename(name)), Buffer.from(b64, 'base64')); return true;
});

// ---------- IPC ----------
ipcMain.handle('file:open', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: 'Відкрити презентацію', properties: ['openFile'],
    filters: [{ name: 'Aurea Presentation', extensions: ['aurea'] }]
  });
  if (r.canceled || !r.filePaths[0]) return null;
  const p = r.filePaths[0];
  const data = fs.readFileSync(p, 'utf8');
  addRecent(p);
  return { path: p, data };
});

ipcMain.handle('file:openPath', async (_e, p) => {
  try { const data = fs.readFileSync(p, 'utf8'); addRecent(p); return { path: p, data }; }
  catch (e) { return { error: String(e.message || e) }; }
});

ipcMain.handle('file:save', async (_e, { path: p, data, saveAs, name }) => {
  if (!p || saveAs) {
    const r = await dialog.showSaveDialog(win, {
      title: 'Зберегти презентацію',
      defaultPath: path.join(app.getPath('documents'), (name || 'Презентація') + '.aurea'),
      filters: [{ name: 'Aurea Presentation', extensions: ['aurea'] }]
    });
    if (r.canceled || !r.filePath) return null;
    p = r.filePath;
  }
  fs.writeFileSync(p, data, 'utf8');
  let title; try { title = JSON.parse(data).title; } catch {}
  addRecent(p, title);
  return p;
});

ipcMain.handle('file:writeQuiet', async (_e, { path: p, data }) => {
  try { fs.writeFileSync(p, data, 'utf8'); return true; } catch { return false; }
});

ipcMain.handle('file:autosave', async (_e, data) => {
  try { fs.writeFileSync(autosaveFile(), data, 'utf8'); return true; } catch { return false; }
});
ipcMain.handle('file:recovery', async () => {
  try {
    const st = fs.statSync(autosaveFile());
    return { data: fs.readFileSync(autosaveFile(), 'utf8'), time: st.mtimeMs };
  } catch { return null; }
});
ipcMain.handle('file:clearRecovery', async () => { try { fs.unlinkSync(autosaveFile()); } catch {} return true; });

ipcMain.handle('recent:list', async () => readRecent().filter(r => fs.existsSync(r.path)));
ipcMain.handle('recent:remove', async (_e, p) => {
  const list = readRecent().filter(r => r.path !== p);
  try { fs.writeFileSync(recentFile(), JSON.stringify(list)); } catch {}
  return true;
});

ipcMain.handle('image:pick', async (_e, multi) => {
  const r = await dialog.showOpenDialog(win, {
    title: 'Вставити зображення', properties: multi ? ['openFile', 'multiSelections'] : ['openFile'],
    filters: [{ name: 'Зображення', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'bmp'] }]
  });
  if (r.canceled) return [];
  return r.filePaths.map(fp => {
    const ext = path.extname(fp).slice(1).toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : 'image/' + ext;
    return { name: path.basename(fp), url: `data:${mime};base64,${fs.readFileSync(fp).toString('base64')}` };
  });
});

ipcMain.handle('export:html', async (_e, { html, name }) => {
  const r = await dialog.showSaveDialog(win, {
    title: 'Експорт у HTML',
    defaultPath: path.join(app.getPath('documents'), (name || 'Презентація') + '.html'),
    filters: [{ name: 'HTML', extensions: ['html'] }]
  });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, html, 'utf8');
  return r.filePath;
});

async function renderPdf(html, out) {
  const tmp = path.join(os.tmpdir(), `aurea-print-${Date.now()}.html`);
  fs.writeFileSync(tmp, html, 'utf8');
  const pw = new BrowserWindow({ show: false, width: 1920, height: 1080, webPreferences: { offscreen: false } });
  try {
    await pw.loadFile(tmp);
    for (let i = 0; i < 100; i++) {
      const ok = await pw.webContents.executeJavaScript('window.__aureaReady === true').catch(() => false);
      if (ok) break;
      await new Promise(r => setTimeout(r, 100));
    }
    const pdf = await pw.webContents.printToPDF({
      printBackground: true, preferCSSPageSize: true,
      pageSize: { width: 20, height: 11.25 }, margins: { marginType: 'none' }
    });
    fs.writeFileSync(out, pdf);
  } finally {
    pw.destroy();
    try { fs.unlinkSync(tmp); } catch {}
  }
}

ipcMain.handle('export:pdf', async (_e, { html, name }) => {
  const r = await dialog.showSaveDialog(win, {
    title: 'Експорт у PDF',
    defaultPath: path.join(app.getPath('documents'), (name || 'Презентація') + '.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (r.canceled || !r.filePath) return null;
  await renderPdf(html, r.filePath);
  return r.filePath;
});

ipcMain.handle('win:fullscreen', async (_e, on) => { if (win) win.setFullScreen(!!on); return true; });
ipcMain.handle('shell:show', async (_e, p) => { shell.showItemInFolder(p); return true; });
ipcMain.handle('app:argFile', async () => pendingOpen || argFile || null);
ipcMain.handle('app:displays', async () => screen.getAllDisplays().length);

ipcMain.handle('show:audience', async () => {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const ext = displays.find(d => d.id !== primary.id);
  if (audience && !audience.isDestroyed()) audience.close();
  const b = (ext || primary).bounds;
  audience = new BrowserWindow({
    x: b.x + 40, y: b.y + 40, width: 1280, height: 720,
    backgroundColor: '#000000', autoHideMenuBar: true, title: 'Aurea Studio — показ',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  audience.loadURL('app://local/index.html#audience');
  audience.once('ready-to-show', () => { if (ext) audience.setFullScreen(true); });
  audience.on('closed', () => { audience = null; if (win) win.webContents.send('audience-closed'); });
  return { external: !!ext };
});
ipcMain.handle('show:closeAudience', async () => { if (audience && !audience.isDestroyed()) audience.close(); return true; });

ipcMain.handle('debug:write', async (_e, { name, data }) => {
  if (!SHOTS_DIR) return false;
  fs.writeFileSync(path.join(SHOTS_DIR, path.basename(name)), data, 'utf8'); return true;
});
ipcMain.handle('debug:pdf', async (_e, { name, html }) => {
  if (!SHOTS_DIR) return false;
  await renderPdf(html, path.join(SHOTS_DIR, path.basename(name))); return true;
});

// ---------- automated screenshots (--shots=<dir>) ----------
async function runShots() {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const js = s => win.webContents.executeJavaScript(s);
  try { win.setAlwaysOnTop(true, 'screen-saver'); win.focus(); } catch {}
  const shot = async (name) => { try { await shot0(name); } catch (e) { LOG('capture failed', name, e.message); } };
  const shot0 = async (name) => {
    try { win.webContents.invalidate(); } catch {}
    await wait(250);
    await win.webContents.capturePage();
    await wait(450);
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(SHOTS_DIR, name + '.png'), img.toPNG());
  };
  try {
    await wait(2500);
    await shot('01-start');
    const steps = await js('window.__demo ? window.__demo.steps() : []');
    for (const s of steps) {
      const delay = await js(`window.__demo.run(${JSON.stringify(s)})`);
      await wait(delay || 1200);
      await shot(s);
    }
    if (TEST_HTML) await runHtmlTest(shot, wait);
    const errs = await js('JSON.stringify(window.__errors||[])');
    fs.writeFileSync(path.join(SHOTS_DIR, 'errors.json'), errs);
  } catch (e) {
    fs.writeFileSync(path.join(SHOTS_DIR, 'errors.json'), JSON.stringify([String(e.stack || e)]));
  }
  try { win.setAlwaysOnTop(false); } catch {}
  setTimeout(() => app.exit(0), 3000);
  app.quit();
}
