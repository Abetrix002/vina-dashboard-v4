// Behaviour check: python3 -I build.py && node check.mjs. Headless Chrome over CDP, no dependencies.
// Sweeps all 49 screens (and every declared state) as the person who uses them, at 1440 / 834 / 390, light and dark,
// then runs the main flows end to end.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path'; import os from 'node:os'; import fs from 'node:fs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = +(process.env.PORT || 9347);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'vina-x-'))}`, 'about:blank'], { stdio: 'ignore' });
setTimeout(() => { console.log('TIMEOUT'); chrome.kill(); process.exit(2); }, 420000).unref();
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0, failed = 0; const pending = new Map(), errors = [];
for (let i = 0; i < 60 && !ws; i++) { try { const g = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(x => x.type === 'page'); if (g) ws = new WebSocket(g.webSocketDebuggerUrl); } catch {} await sleep(200); }
if (ws.readyState !== 1) await new Promise(r => ws.addEventListener('open', r));
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error: ' + d.params.args.map(a => a.value || a.description).join(' ')); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) errors.push('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result?.value; };
const ok = (name, c, got) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${name}${c ? '' : `  -> ${JSON.stringify(got).slice(0, 1500)}`}`); if (!c) failed++; };

await send('Runtime.enable'); await send('Page.enable');
if (!process.env.MOTION) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); // flows assume synchronous renders; MOTION=1 runs with transitions on
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file://' + path.join(ROOT, 'dist/index.html') }); await sleep(1500);
ok('boots without errors', !errors.length, errors);

await ev(`window.tick = (ms) => new Promise(r => setTimeout(r, ms || 60)); window.open1 = async (sid) => { A['open-screen']({dataset:{x:sid}}); await tick(120); }; window.clickA = async (a, x) => { const e = [...document.querySelectorAll('[data-a="' + a + '"]')].find(e => x == null || e.dataset.x == x); if (!e) return false; e.click(); await tick(); return true; }; 0`);

if (process.env.EVAL) { if (process.env.W) await send('Emulation.setDeviceMetricsOverride', { width: +process.env.W, height: 844, deviceScaleFactor: 1, mobile: false }); console.log(JSON.stringify(await ev(`(async () => { try { ${process.env.EVAL} } catch (e) { return 'threw: ' + e.stack; } })()`), null, 1)); console.log(errors); chrome.kill(); process.exit(0); }
if (process.env.SHOT) { const dir = process.env.SHOTDIR; for (const spec of process.env.SHOT.split(',')) { const [sid, w, th] = spec.split(':'); await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +w < 600 ? 844 : 900, deviceScaleFactor: 1, mobile: false }); await ev(`(async () => { setTheme('${th}'); await open1('${sid}'); await tick(1500); window.scrollTo(0,0); })()`); const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(dir, `${sid}-${w}-${th}.png`), Buffer.from(r.data, 'base64')); } console.log(errors); chrome.kill(); process.exit(0); }
const SWEEP = `(async (W, theme) => {
  setTheme(theme); const out = [];
  for (const s of SCREENS) {
    await open1(s[0]);
    const r = parseHash(); const states = [''].concat((r && r.def.states || []).map(x => x[0]));
    for (const st of states) {
      S.st = st; render(); await tick(20);
      const tag = s[0] + (st ? '/' + st : '') + ' @' + W + ' ' + theme;
      if (document.getElementById('app').innerText.includes('could not be drawn')) out.push('draw error ' + tag + ': ' + (document.querySelector('.note.err') || {}).textContent);
      if (document.getElementById('app').innerText.includes('not part of your dashboard')) out.push('role blocked ' + tag);
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push('page overflow ' + tag + ' ' + document.documentElement.scrollWidth);
      if (/undefined|NaN|\\[object Object\\]/.test(document.getElementById('app').innerText + document.getElementById('layers').innerText)) out.push('bad text ' + tag + ': ' + (document.getElementById('app').innerText + document.getElementById('layers').innerText).match(/.{0,40}(undefined|NaN|\\[object Object\\]).{0,20}/)[0]);
      if (s[6] && !st && !document.querySelector('#layers .modal, #layers .drawer') && s[6] !== 'c6') out.push('dialog did not open ' + tag);
      if (W === 1440 && !st) for (const b of document.querySelectorAll('#app button, #app a.btn, #layers button')) { const q = b.getBoundingClientRect(); if (q.height && q.height < 23) { out.push('tiny target ' + tag + ': ' + (b.getAttribute('aria-label') || b.textContent).trim().slice(0, 30) + ' ' + Math.round(q.height)); break; } }
      if (W === 1440 && !st) for (const b of document.querySelectorAll('#app button, #layers button')) { if (!(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('title'))) { out.push('unnamed button ' + tag); break; } }
    }
    S.st = ''; S.modal = null; S.drawer = null;
  }
  return out;
})`;
let issues = [];
for (const [width, theme] of [[1440, 'light'], [1440, 'dark'], [834, 'light'], [390, 'dark']]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 844 : 900, deviceScaleFactor: 1, mobile: false }); await sleep(100);
  const t0 = Date.now(); const got = await ev(`${SWEEP}(${width}, '${theme}')`); issues.push(...(got || ['sweep threw at ' + width + ' ' + theme]));
  console.log(`  swept ${width} ${theme} in ${Date.now() - t0} ms`);
}
ok(`sweep: 49 screens and their states at 1440 light/dark, 834, 390 (${issues.length} issues)`, !issues.length, [...new Set(issues)].slice(0, 60));
ok('no runtime errors during sweep', !errors.length, [...new Set(errors)].slice(0, 20));
errors.length = 0;

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await ev(`setTheme('light')`);
const FLOWS = fs.existsSync(path.join(ROOT, 'flows.mjs')) ? (await import(path.join(ROOT, 'flows.mjs'))).default : [];
for (const [name, code] of FLOWS) { const r = await ev(`(async () => { try { ${code} } catch (e) { return 'threw: ' + e.message; } })()`); ok(name, r === true, r); }
ok('no runtime errors during flows', !errors.length, [...new Set(errors)].slice(0, 20));

console.log(failed ? `\n${failed} FAILED` : '\nALL PASS');
chrome.kill(); process.exit(failed ? 1 : 0);
