// Ad-hoc code signature for macOS builds.
// Without any signature Apple Silicon reports the app as "damaged"; with an ad-hoc one
// Gatekeeper shows the usual "unidentified developer" prompt that right-click → Open gets past.
const { execFileSync } = require('child_process');
const path = require('path');

exports.default = async function afterPack(ctx) {
  if (ctx.electronPlatformName !== 'darwin') return;
  const app = path.join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' });
};
