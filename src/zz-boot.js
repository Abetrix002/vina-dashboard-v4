/* Screen index (section 13 checklist) and start-up. Loaded last. */
R('screens', {id:'—', title:'All screens', public:true, render() {
  const areas = [...new Set(SCREENS.map(s => s[2]))];
  const roleOf = r => r ? ROLE_LABEL[r] : 'Signed out';
  return `<div class="full"><div class="full-top">${LOGO()}<b style="font-size:15px">Dashboard · all screens</b><span class="sp"></span><button type="button" class="ibtn" data-a="theme" aria-label="Light or dark">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}</button>${S.role ? `<a class="btn pri" href="#${HOME[S.role]}">Back to my dashboard</a>` : `<a class="btn pri" href="#login">Log in</a>`}</div>
  <div style="width:min(1180px,100%);margin:0 auto;padding:28px max(16px,env(safe-area-inset-right,0px)) 96px max(16px,env(safe-area-inset-left,0px));display:flex;flex-direction:column;gap:22px">
    <div class="col tight"><h1 style="font-size:26px;font-weight:700">Every screen in the brief, working</h1><p class="lead-in">49 screens, 24 of them needed for launch. Open one and the prototype signs you in as the person who uses it. Use the Prototype button (bottom left) to switch person, colours, or the empty, loading and error versions of a screen.</p></div>
    ${areas.map(a => `<section class="col tight"><h2 class="h2">${esc(a)}</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:70px">ID</th><th>Screen</th><th style="width:150px">Opens as</th><th style="width:110px">Priority</th><th style="width:90px"><span class="sr">Open</span></th></tr></thead><tbody>
      ${SCREENS.filter(s => s[2] === a).map(s => `<tr class="click" data-a="open-screen" data-x="${s[0]}"><td class="b num">${s[0]}</td><td>${esc(s[1])}</td><td class="mute">${roleOf(s[5])}</td><td>${s[3] === 'P1' ? chipC('P1 · Launch', 'teal') : s[3] === 'P2' ? chipC('P2 · Next', 'blue') : chipC('P3 · Later', 'grey')}</td><td class="r"><button type="button" class="btn sm" data-a="open-screen" data-x="${s[0]}">Open${ic('arrowR', 14)}</button></td></tr>`).join('')}
    </tbody></table></div></section>`).join('')}
  </div></div>`;
}});

(function boot() {
  try { const t = localStorage.getItem('vina-theme'); if (t) setTheme(t); S.rail = !!localStorage.getItem('vina-rail'); } catch (e) {}
  S._enter = true; S.offline = !navigator.onLine;
  document.body.insertAdjacentHTML('afterbegin', LOGO_DEFS);
  if (!location.hash) location.hash = 'screens';
  render();
  document.documentElement.dataset.ready = '1'; // later theme changes crossfade
})();
