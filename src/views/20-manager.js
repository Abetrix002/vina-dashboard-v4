/* M1–M5 · Manager dashboard (view only): overview, channels, conversations, call centre and sales, customer ratings
   Report pages (M1, M2, M4, M5) follow an analytics layout: one toolbar row (Add filter · date range · refresh · CSV),
   then report cards (reportCard) with a footer link to the fuller page. M3 is the chat reader and keeps its own layout. */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  /* toolbar menus */
  .mg-tb{position:relative}
  .menu.mg-menu{top:calc(100% + 6px);min-width:240px}
  .menu.mg-ml{left:0;transform-origin:top left}
  .menu.mg-mr{right:0}
  .mg-cus{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 10px 6px;margin-top:6px;border-top:1px solid var(--line)}
  .mg-cus label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--mute);font-weight:600;min-width:0}
  .mg-cus .inp{min-height:36px;font-size:13px;padding:0 8px}
  .mg-cus .btn{grid-column:1/-1;justify-content:center}
  .mg-af .mute{font-weight:500}
  /* page grids: at most 3 cards per row (1440), 2 (834), 1 (390) */
  .mg-r21{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:20px;align-items:stretch}
  .mg-r3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:stretch}
  .mg-stack{display:flex;flex-direction:column;gap:20px;min-width:0}
  .mg-stack>.rc{flex:1}
  .mg-tot{font-family:var(--f-display);font-size:20px;line-height:24px;font-weight:700;font-variant-numeric:tabular-nums}
  .mg-d{display:inline-flex;align-items:center;height:22px;padding:0 7px;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap}
  .mg-empty{padding:28px 16px}
  /* M1 summary card: metric tabs, one chart, a quiet strip */
  .mg-sum{padding:0;display:flex;flex-direction:column;min-width:0;overflow:hidden}
  .mg-mt{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--line)}
  .mg-tab{display:flex;flex-direction:column;justify-content:space-between;gap:8px;min-width:0;padding:16px 20px 13px;border:0;border-bottom:3px solid transparent;margin-bottom:-1px;background:transparent;color:var(--text);font:inherit;text-align:start;cursor:pointer;transition:background var(--d1),border-color var(--d2) var(--ease)}
  .mg-tab+.mg-tab{border-inline-start:1px solid var(--line)}
  .mg-tab:hover{background:var(--sub)}
  .mg-tab:focus-visible{outline:none;box-shadow:inset 0 0 0 2px var(--horizon)}
  .mg-tab[aria-selected="true"]{border-bottom-color:var(--horizon)}
  .mg-tab .k{display:flex;align-items:center;gap:8px;font-size:13px;line-height:18px;color:var(--mute);font-weight:500;min-width:0}
  .mg-tab[aria-selected="true"] .k{color:var(--text);font-weight:600}
  .mg-tab .v{font-family:var(--f-display);font-size:28px;line-height:34px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .mg-cp{flex:1;padding:18px 20px 14px;min-width:0}
  .mg-cph{display:flex;align-items:center;flex-wrap:wrap;gap:10px 16px;margin-bottom:14px}
  .mg-cph .legend{flex:1}
  .mg-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--line)}
  .mg-si{display:flex;align-items:flex-start;gap:10px;padding:14px 20px;min-width:0}
  .mg-si+.mg-si{border-inline-start:1px solid var(--line)}
  .mg-si .k{display:block;font-size:12.5px;line-height:17px;color:var(--mute)}
  .mg-si .v{font-family:var(--f-display);font-size:18px;line-height:24px;font-weight:700;font-variant-numeric:tabular-nums}
  /* M1 waiting now: a live card */
  .mg-rtn{display:flex;align-items:center;gap:12px}
  .mg-rtn .v{font-family:var(--f-display);font-size:44px;line-height:48px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .mg-long{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:5px 10px;border-radius:8px;background:var(--red-b);color:var(--red-f);font-size:13px}
  .mg-mini{display:flex;align-items:flex-end;gap:3px;height:34px;margin:18px 0 6px}
  .mg-mini i{flex:1;min-height:2px;border-radius:2px 2px 0 0;background:color-mix(in srgb,var(--amber) 55%,transparent)}
  .mg-mini i:last-child{background:var(--amber)}
  .mg-cap{display:flex;justify-content:space-between;font-size:11.5px;color:var(--faint)}
  .mg-rtl{margin-top:14px;padding-top:6px;border-top:1px solid var(--line)}
  .mg-rtl .hd{display:flex;justify-content:space-between;padding:6px 0 4px;font-size:12px;color:var(--mute)}
  .mg-wl{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:7px 10px;margin:0 -10px;border-radius:10px;text-decoration:none;color:var(--text);min-height:54px;transition:background var(--d1) var(--ease)}
  .mg-wl:hover{background:var(--sub)}
  .mg-wl .nm{font-weight:600;display:block;font-size:14px}
  .mg-wl .meta{display:flex;align-items:center;gap:8px;margin-top:3px;font-size:12px;color:var(--mute);min-width:0}
  .mg-wl .meta .chip{height:20px;font-size:11.5px;padding:0 7px}
  .mg-wl .w{display:inline-flex;align-items:center;gap:5px;font-weight:700;font-variant-numeric:tabular-nums;font-size:13px;white-space:nowrap}
  /* bars and splits */
  .mg-hrow{display:grid;grid-template-columns:minmax(100px,150px) 1fr minmax(48px,auto);gap:14px;align-items:center;font-size:14px;min-height:36px}
  .mg-hrow .n{text-align:end;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
  .mg-split{display:flex;height:12px;border-radius:999px;overflow:hidden;gap:3px}
  .mg-split i{display:block;height:100%}
  .mg-sw{display:inline-block;width:10px;height:10px;border-radius:3px;margin-inline-end:6px}
  .mg-br{display:grid;grid-template-columns:62px minmax(0,1fr) 44px 40px;gap:12px;align-items:center;min-height:32px;font-size:13.5px}
  .mg-br .bar-h{height:10px}
  /* charts: HTML bars and an SVG line layer, so labels stay readable at any width */
  .mg-plot{margin:0;display:flex;flex-direction:column;gap:8px}
  .mg-area{position:relative;height:var(--ph,200px);margin-inline-start:38px}
  .mg-area.ln,.mg-xl.abs{margin-inline-end:14px}
  .mg-gl{position:absolute;left:0;right:0;height:0;border-top:1px solid color-mix(in srgb,var(--line) 70%,transparent)}
  .mg-gl.z{border-top-color:var(--line2)}
  .mg-gl span{position:absolute;right:calc(100% + 8px);top:-8px;font-size:12px;line-height:16px;color:var(--faint);font-variant-numeric:tabular-nums;white-space:nowrap}
  .mg-cols{position:absolute;inset:0;display:flex}
  .mg-c{position:relative;flex:1;display:flex;align-items:flex-end;justify-content:center;min-width:0}
  .mg-c.sh{background:color-mix(in srgb,var(--sel) 80%,transparent)}
  .mg-st{width:58%;max-width:40px;display:flex;flex-direction:column-reverse;gap:2px;border-radius:4px 4px 1px 1px;overflow:hidden}
  .mg-st>i{display:block;min-height:1px}
  .mg-xl{display:flex;margin-inline-start:38px;height:18px;font-size:12px;line-height:18px;color:var(--faint)}
  .mg-xl span{flex:1;min-width:0;display:flex;justify-content:center;white-space:nowrap}
  .mg-xl.abs{position:relative}
  .mg-xl.abs span{position:absolute;top:0;transform:translateX(-50%)}
  .mg-ln{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .mg-dot{position:absolute;width:8px;height:8px;border-radius:50%;background:var(--c);box-shadow:0 0 0 2px var(--card);transform:translate(-50%,50%)}
  .mg-hit{position:absolute;top:0;bottom:0;transform:translateX(-50%)}
  .mg-hit:hover::after{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1px solid var(--line2)}
  /* GA-style hover guide: the guide line plus a dot on every line at that point */
  .mg-hit::after{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1px solid var(--line2);opacity:0;transition:opacity var(--d1)}
  .mg-hit:hover::after{opacity:1}
  .mg-hit>i{position:absolute;left:50%;width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 0 2px var(--card);transform:translate(-50%,50%) scale(0);transition:transform var(--d2) var(--spring);z-index:1;pointer-events:none}
  .mg-hit>i.o{background:var(--card);box-shadow:inset 0 0 0 2px var(--c)}
  .mg-hit:hover>i{transform:translate(-50%,50%) scale(1)}
  @media (prefers-reduced-motion:reduce){.mg-hit>i,.mg-hit::after{transition:none}}
  .mg-lg .dash{display:inline-block;width:16px;height:0;border-top:2px dashed var(--faint);margin-inline-end:6px;vertical-align:3px}
  .mg-lg b{color:var(--text);font-weight:600;margin-inline-start:4px;font-variant-numeric:tabular-nums}
  /* M2 */
  .mg-chc.warn{border-color:color-mix(in srgb,var(--amber-f) 45%,var(--line))}
  .mg-chc .rc-h .chi{margin-top:-2px}
  .mg-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 16px;align-items:start}
  .mg-stats>div{display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:2px}
  .mg-stats .k{font-size:13px;line-height:18px;color:var(--mute)}
  .mg-stats .v{font-family:var(--f-display);font-size:22px;line-height:28px;font-weight:700;font-variant-numeric:tabular-nums}
  .mg-live{display:inline-flex;align-items:center;gap:8px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
  .mg-chc .note{margin-top:16px}
  /* M3 (unchanged) */
  /* M3 */
  .mg-m3{position:relative;display:grid;grid-template-columns:340px minmax(0,1fr);height:calc(100vh - 69px);min-height:560px;background:var(--card)}
  @media (min-width:1280px){.mg-m3.dp-on{grid-template-columns:340px minmax(0,1fr) 300px}}
  .mg-m3>section{min-height:0;min-width:0;display:flex;flex-direction:column}
  .mg-m3>.mg-list{border-inline-end:1px solid var(--line)}
  .mg-tabs{flex:0 0 auto;padding:4px 6px 0}
  .mg-tabs .tab{flex:1 0 auto;justify-content:center;padding:0 7px;gap:5px}
  .mg-tabs .tab .n{min-width:18px;height:18px;padding:0 5px}
  .mg-lh{position:relative;display:flex;flex-direction:column;gap:8px;padding:12px 12px 0}
  .mg-lh .mg-fbtn{min-height:38px}
  .mg-fbtn[aria-expanded="true"]{background:var(--sel);border-color:var(--horizon)}
  .mg-fn{min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--pri);color:var(--on-pri);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
  .mg-act .fchip{min-height:30px;font-size:12px;padding:0 6px 0 10px;gap:2px}
  .mg-act .fchip .x{display:inline-flex}
  .mg-act .clr{border:0;background:transparent;color:var(--link);font-size:12px;font-weight:600;cursor:pointer;min-height:30px;padding:0 6px;border-radius:8px}
  .mg-act .clr:hover{background:var(--sel)}
  .menu.mg-pop{animation:none;top:58px;right:14px;width:min(330px,calc(100vw - 32px));padding:14px;gap:12px;cursor:default}
  .menu.mg-pop.anim-in{animation:menuIn var(--d2) var(--ease)}
  .mg-pop .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .mg-pop .field>label{font-size:12px;color:var(--mute);font-weight:600}
  .mg-pop .inp{min-height:40px;font-size:13px}
  .mg-pop .ft{display:flex;gap:8px;justify-content:flex-end;padding-top:12px;border-top:1px solid var(--line)}
  .mg-pop .btn{min-height:34px;padding:0 14px;border:1px solid var(--line2);background:var(--card);border-radius:8px;font-weight:600;justify-content:center}
  .mg-pop .btn.pri{background:var(--pri);border-color:var(--pri);color:var(--on-pri)}
  .mg-pop .btn.ghost{border-color:transparent;background:transparent;color:var(--link)}
  .mg-chat{background:var(--bg)}
  /* M4 */
  .mg-avs{display:flex;flex-wrap:wrap;gap:14px 6px}
  .mg-og{display:flex;flex-direction:column;gap:12px;min-width:0}
  .mg-ppl{display:flex;flex-wrap:wrap;gap:20px 40px}
  .mg-person{display:flex;flex-direction:column;align-items:center;gap:4px;width:76px;text-align:center;min-width:0}
  .mg-person .avw{margin-bottom:5px}
  .mg-person .avw .pres{width:14px;height:14px;border-width:3px}
  .mg-person.off .av{opacity:.45}
  .mg-person b{max-width:100%}
  .mg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .mg-three>div{background:var(--sub);border-radius:var(--r-m);padding:14px 14px;display:flex;flex-direction:column;gap:4px;min-width:0}
  .mg-three .v{font-family:var(--f-display);font-size:28px;line-height:34px;font-weight:700;font-variant-numeric:tabular-nums}
  .mg-three .k{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mute);font-weight:500}
  .mg-three .hot{background:var(--red-b)} .mg-three .hot .v,.mg-three .hot .k{color:var(--red-f)}
  .mg-fun{display:grid;grid-template-columns:minmax(150px,220px) minmax(0,1fr) 64px 110px;grid-template-areas:"l t c p";gap:6px 20px;align-items:center;min-height:50px}
  .mg-fl{grid-area:l;display:flex;flex-direction:column;min-width:0} .mg-ft{grid-area:t} .mg-fc{grid-area:c} .mg-fp{grid-area:p}
  .mg-ft{display:flex;justify-content:center;height:26px}
  .mg-ft i{display:block;height:100%;border-radius:6px;transform-origin:center!important}
  .mg-fc{text-align:end;font-family:var(--f-display);font-weight:700;font-size:16px;font-variant-numeric:tabular-nums}
  .mg-fp{text-align:end;font-size:14px;color:var(--mute);font-weight:600;font-variant-numeric:tabular-nums}
  .mg-fun.hd{min-height:26px;white-space:nowrap;font-size:13px;font-weight:600;color:var(--mute)}
  .mg-fun.hd .mg-ft{height:0}
  .mg-fun.hd .nr{display:none}
  .mg-fun+.mg-fun:not(.hd){border-top:1px solid color-mix(in srgb,var(--line) 70%,transparent)}
  .mg-tblc .rc-b{padding:0}
  .mg-tw{overflow-x:auto;border-top:1px solid var(--line)}
  .mg-tw .tbl td,.mg-tw .tbl th{white-space:nowrap}
  .mg-tw .tbl th:first-child,.mg-tw .tbl td:first-child{padding-inline-start:20px}
  .mg-tw .tbl th:last-child,.mg-tw .tbl td:last-child{padding-inline-end:20px}
  .mg-tw tr.tot td{background:var(--sub);font-weight:700;border-top:1px solid var(--line2)}
  .mg-tw .pc{display:inline-block;min-width:38px;color:var(--mute);font-weight:500}
  /* M5 */
  .mg-avg{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-bottom:18px}
  .mg-big{font-family:var(--f-display);font-size:44px;line-height:48px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .mg-cmp{display:grid;grid-template-columns:minmax(96px,120px) minmax(0,1fr) 30px;gap:14px;align-items:center;min-height:46px}
  .mg-lol{height:14px;display:flex;align-items:center;background:linear-gradient(var(--line),var(--line)) center/100% 2px no-repeat}
  .mg-lol i{position:relative;display:block;height:4px;border-radius:2px}
  .mg-lol i::after{content:"";position:absolute;right:-6px;top:-4px;width:12px;height:12px;border-radius:50%;background:inherit;box-shadow:0 0 0 3px var(--card)}
  .mg-axis{min-height:18px;font-size:12px;color:var(--faint)}
  .mg-axis div{display:flex;justify-content:space-between}
  .mg-lr{display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:calc(100% + 20px);margin:0 -10px;padding:10px;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;transition:background var(--d1)}
  .mg-lr:hover{background:var(--sub)}
  .mg-lr+.mg-lr{margin-top:2px}
  .mg-qt{font-size:14px;line-height:20px;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  @media (max-width:1180px){
    .mg-r21{grid-template-columns:minmax(0,1fr)}
    .mg-r3{grid-template-columns:repeat(2,minmax(0,1fr))}
    .mg-r3>:last-child:nth-child(odd){grid-column:1/-1}
    .mg-m3{grid-template-columns:300px minmax(0,1fr)}
  }
  @media (max-width:760px){
    .mg-r3{grid-template-columns:minmax(0,1fr)}
    .mg-mt,.mg-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
    .mg-tab:nth-child(odd),.mg-si:nth-child(odd){border-inline-start:0}
    .mg-tab:nth-child(n+3),.mg-si:nth-child(n+3){border-top:1px solid var(--line)}
    .mg-tab{padding:12px 14px 10px}
    .mg-tab .v{font-size:22px;line-height:28px}
    .mg-si{padding:12px 14px}
    .mg-cp{padding:14px 16px 12px}
    .mg-area{height:min(var(--ph),220px)}
    .mg-wl .meta{flex-wrap:wrap;row-gap:2px}
    .mg-m3{grid-template-columns:minmax(0,1fr);height:calc(100vh - 118px);min-height:480px}
    .mg-m3>.mg-list{border-inline-end:0}
    .mg-m3[data-open="1"] .mg-list,.mg-m3:not([data-open="1"]) .mg-chatp,.mg-m3:not([data-open="1"]) .cx-dp{display:none}
    .mg-hrow{grid-template-columns:136px 1fr minmax(40px,auto);gap:10px}
    .mg-xl .o{visibility:hidden}
    .mg-fun{grid-template-columns:minmax(0,1fr) 60px 52px;grid-template-areas:"l c p" "t t t"}
    .mg-fun.hd .mg-ft{display:none}
    .mg-fun.hd .wd{display:none} .mg-fun.hd .nr{display:inline}
    .mg-ft{height:20px}
    .mg-fun:not(.hd){padding:8px 0}
    .mg-three .v{font-size:24px;line-height:30px}
    .mg-three>div{padding:12px}
    .mg-person{width:70px}
    .ptb-date .r{display:none}
  }
  </style>`);

  /* ---------- filters, date range and scale (shared by every report page) ---------- */
  const F = () => S.f.mg || (S.f.mg = {date:'7', ch:'all', model:'all', src:'all', from:'2026-11-01', to:'2026-11-07'});
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtD = d => d.getDate() + ' ' + MON[d.getMonth()];
  const dOk = s => { const d = new Date(String(s || '') + 'T00:00'); return isNaN(d) ? null : d; };
  // [first day, last day] of the chosen range; a broken custom range falls back to the last 7 days
  const span = () => { const f = F(); if (f.date === 'c') { const a = dOk(f.from), b = dOk(f.to); if (a && b && a <= b && b - a < 90 * 864e5) return [a, b]; return [new Date(2026, 10, 1), new Date(2026, 10, 7)]; } const n = f.date === '1' ? 1 : f.date === '30' ? 30 : 7; return [new Date(2026, 10, 8 - n), new Date(2026, 10, 7)]; };
  const days = () => { const [a, b] = span(); return Math.round((b - a) / 864e5) + 1; };
  const DK = () => F().date === '1' ? 0.148 : days() / 7;
  const CHK = {all:1, wa:.73, web:.2, ph:.07};
  const MK = {all:1, 'V27 2027':.52, '03T 2026':.27, 'V27 2026':.21};
  const SK = {all:1, 'Meta ad':.54, 'Snapchat ad':.21, 'Google':.06, 'Website':.15, 'Walk-in':.04};
  const FK = () => CHK[F().ch] * MK[F().model] * SK[F().src];
  const K = () => DK() * FK(); // ponytail: flat multipliers stand in for real filtered queries
  const sc = (n, k) => Math.round(n * (k == null ? K() : k));
  const DATES = [['1','Today'],['7','Last 7 days'],['30','Last 30 days'],['c','Custom']];
  const rangeShort = () => { const [a, b] = span(), y = ' ' + b.getFullYear(); if (+a === +b) return fmtD(b) + y; return (a.getMonth() === b.getMonth() ? a.getDate() : fmtD(a)) + '–' + fmtD(b) + y; };
  const FD = {
    ch:['Channel', [['wa','WhatsApp'],['web','Website chat'],['ph','Phone line']]],
    model:['Car model', MODELS.map(m => [m, m])],
    src:['Ad source', [['Meta ad','Meta ads'],['Snapchat ad','Snapchat ads'],['Google','Google'],['Website','Website, no ad'],['Walk-in','Walk-in']]],
  };
  const fLabel = k => (FD[k][1].find(o => o[0] === F()[k]) || ['', F()[k]])[1];
  // One toolbar row: active filters + "Add filter" on the left; date range, refresh and CSV on the right.
  function toolbar(dims, page) {
    const f = F(), dim = S.f.mgDim, act = dims.filter(k => f[k] !== 'all'), free = dims.filter(k => f[k] === 'all');
    const left = act.map(k => `<button type="button" class="fchip mg-af" data-a="mg-unf" data-x="${k}" aria-label="Remove filter ${FD[k][0]}: ${esc(fLabel(k))}"><span class="mute">${FD[k][0]}:</span>${esc(fLabel(k))}<span class="x">${ic('x', 13)}</span></button>`).join('')
      + (free.length ? `<button type="button" class="addf" data-a="mg-fmenu" aria-haspopup="menu" aria-expanded="${S.menu === 'mg-f'}">${ic('plus', 14)}Add filter</button>` : '');
    const fmenu = S.menu !== 'mg-f' ? '' : `<div class="menu mg-menu mg-ml" role="menu" aria-label="Add filter" data-a="noop">${dim && FD[dim]
      ? `<button type="button" role="menuitem" data-a="mg-fdim" data-x="">${ic('chevL', 15)}<span class="grow b">${FD[dim][0]}</span></button><div class="hr" style="margin:4px 0"></div>${FD[dim][1].map(([v, t]) => `<button type="button" role="menuitem" data-a="mg-fset" data-x="${esc(v)}">${esc(t)}</button>`).join('')}`
      : `<div class="mh">Filter by</div>${free.map(k => `<button type="button" role="menuitem" data-a="mg-fdim" data-x="${k}"><span class="grow">${FD[k][0]}</span>${ic('chevR', 15)}</button>`).join('')}`}</div>`;
    const dmenu = S.menu !== 'mg-d' ? '' : `<div class="menu mg-menu mg-mr" role="menu" aria-label="Date range" data-a="noop">${DATES.map(([k, t]) => `<button type="button" role="menuitemradio" aria-checked="${f.date === k}" data-a="mg-date" data-x="${k}"><span class="grow">${t}</span>${f.date === k ? ic('check', 16) : ''}</button>`).join('')}
      ${f.date === 'c' ? `<div class="mg-cus"><label>From<input type="date" class="inp" min="2026-08-01" max="2026-11-07" ${bind('f.mg.from', true)}></label><label>To<input type="date" class="inp" min="2026-08-01" max="2026-11-07" ${bind('f.mg.to', true)}></label><button type="button" class="btn sm pri" data-a="mg-dclose">Apply</button></div>` : ''}</div>`;
    const right = fresh('Updated 2 min ago') + `<button type="button" class="ibtn" data-a="mg-csv" data-x="${esc(page)}" aria-label="Download CSV" title="Download CSV">${ic('download', 18)}</button>`;
    return `<div class="mg-tb">${pageToolbar({left, date:{label:(DATES.find(d => d[0] === f.date) || DATES[1])[1], range:rangeShort(), action:'mg-dmenu'}, right})}${fmenu}${dmenu}</div>`;
  }
  A['mg-fmenu'] = () => { S.menu = S.menu === 'mg-f' ? null : 'mg-f'; S.f.mgDim = null; };
  A['mg-dmenu'] = () => { S.menu = S.menu === 'mg-d' ? null : 'mg-d'; };
  A['mg-fdim'] = el => { S.f.mgDim = el.dataset.x || null; };
  A['mg-fset'] = el => { if (S.f.mgDim) F()[S.f.mgDim] = el.dataset.x; S.f.mgDim = null; S.menu = null; };
  A['mg-unf'] = el => { F()[el.dataset.x] = 'all'; };
  A['mg-date'] = el => { F().date = el.dataset.x; if (el.dataset.x !== 'c') S.menu = null; };
  A['mg-dclose'] = () => { S.menu = null; };
  A['mg-retry'] = () => { S.st = ''; S._enter = true; };
  A['mg-csv'] = el => { toast(el.dataset.x === 'Overview' ? 'Leads CSV for ' + rangeShort() + ' is ready, ' + num(sc(612)) + ' rows. Downloads are switched off in this prototype.' : el.dataset.x + ' CSV for ' + rangeShort() + ' is ready. Downloads are switched off in this prototype.'); };
  const skel = h => `<div class="skel" style="height:${h}px"></div>`;
  const stateBody = (kind) => S.st === 'loading' ? `<div class="col" aria-busy="true" aria-label="Loading" style="gap:20px"><div class="mg-r21">${skel(420)}${skel(420)}</div><div class="mg-r3">${skel(260).repeat(3)}</div></div>`
    : S.st === 'error' ? errorBox('We could not load the ' + kind, 'The numbers did not arrive. Check your connection and try again. Your data is safe.', 'mg-retry') : '';
  const emptyBox = t => `<div class="empty mg-empty">${ic('overview', 28)}<p>${t}</p></div>`;
  const delta = (d, c) => `<span class="mg-d c-${c || 'green'}">${esc(d)}</span>`;

  /* ---------- charts: one scale, token colours, light grid, thin lines ---------- */
  const top4 = v => Math.max(4, nice(v / 4) * 4); // axis top whose quarters are round numbers
  const nice = v => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => m <= x) * p; };
  const grid = (min, max, fmt) => [0, 1, 2, 3, 4].map(i => `<div class="mg-gl ${i ? '' : 'z'}" style="bottom:${i * 25}%"><span>${fmt(min + (max - min) * i / 4)}</span></div>`).join('');
  const colour = (c, i) => typeof c === 'function' ? c(i) : c;
  // o: {h, max, fmt, shade:[from,to], every, label}
  function vbars(labels, series, o) {
    o = o || {}; const n = labels.length, fmt = o.fmt || (v => num(Math.round(v)));
    const tot = labels.map((_, i) => series.reduce((s, se) => s + se.vals[i], 0));
    const max = o.max || top4(Math.max(1, ...tot)), every = o.every || Math.ceil(n / 7);
    const pc = v => Math.max(0, Math.min(100, v / max * 100));
    const cols = labels.map((lb, i) => `<div class="mg-c ${o.shade && i >= o.shade[0] && i < o.shade[1] ? 'sh' : ''}"><div class="mg-st grow-y" style="height:${pc(tot[i]).toFixed(1)}%">${series.map(se => se.vals[i] > 0 ? `<i style="flex:${se.vals[i]} 0 0;background:var(${colour(se.c, i)})" title="${esc(lb)} · ${esc(se.name)}: ${fmt(se.vals[i])}"></i>` : '').join('')}</div></div>`).join('');
    const xl = labels.map((lb, i) => `<span class="${(i / every) % 2 ? 'o' : ''}">${i % every === 0 ? esc(lb) : ''}</span>`).join('');
    return `<figure class="mg-plot" role="img" aria-label="${esc(o.label || '')}"><div class="mg-area" style="--ph:${o.h || 200}px">${grid(0, max, fmt)}<div class="mg-cols">${cols}</div></div><div class="mg-xl">${xl}</div></figure>`;
  }
  // series: [{name, c, vals, dash}] (dash = previous period); o: {h, min, max, fmt, label}. Each column has a hover target with every value.
  function lines(labels, series, o) {
    o = o || {}; const n = labels.length, W = 600, H = 200, fmt = o.fmt || (v => num(Math.round(v)));
    const min = o.min || 0, max = o.max || top4(Math.max(1, ...series.flatMap(s => s.vals)));
    const X = i => n === 1 ? W / 2 : i / (n - 1) * W, Y = v => H - (v - min) / (max - min) * H, xp = i => n === 1 ? 50 : i / (n - 1) * 100, pc = v => (v - min) / (max - min) * 100;
    const paths = series.map(s => {
      const pts = s.vals.map((v, i) => [X(i).toFixed(1), Y(v).toFixed(1)]), d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join('');
      return s.dash ? `<path class="fade-in" d="${d}" fill="none" style="stroke:var(${s.c})" stroke-width="1.5" stroke-dasharray="5 5" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`
        : `<path class="draw" data-p="${pts.map(p => p.join(',')).join(' ')}" d="${d}" fill="none" style="stroke:var(${s.c})" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join('');
    const ends = series.filter(s => !s.dash).map(s => { const i = s.vals.length - 1; return `<span class="mg-dot fade-in" style="left:${xp(i).toFixed(2)}%;bottom:${pc(s.vals[i]).toFixed(1)}%;--c:var(${s.c})"></span>`; }).join('');
    const hits = labels.map((lb, i) => `<span class="mg-hit" style="left:${xp(i).toFixed(2)}%;width:${n === 1 ? 100 : (100 / (n - 1)).toFixed(2)}%" title="${esc(lb + ' · ' + series.map(s => s.name + ': ' + fmt(s.vals[i])).join(' · '))}">${series.map(s => s.vals[i] == null ? '' : `<i style="bottom:${pc(s.vals[i]).toFixed(1)}%;--c:var(${s.c})"${s.dash ? ' class="o"' : ''}></i>`).join('')}</span>`).join('');
    const every = Math.ceil(n / 7);
    const xl = labels.map((lb, i) => i % every === 0 || i === n - 1 ? `<span class="${i < n - 1 && (i / every) % 2 ? 'o' : ''}" style="left:${xp(i).toFixed(2)}%;${i === 0 && n > 1 ? 'transform:none' : i === n - 1 && n > 1 ? 'transform:translateX(-100%)' : ''}">${esc(lb)}</span>` : '').join('');
    return `<figure class="mg-plot" role="img" aria-label="${esc(o.label || '')}"><div class="mg-area ln" style="--ph:${o.h || 200}px">${grid(min, max, fmt)}<svg class="mg-ln" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>${ends}${hits}</div><div class="mg-xl abs">${xl}</div></figure>`;
  }
  // The line SVG stretches to its box, so the draw length is measured on screen after layout (never shorter than the real line).
  const fitDraw = () => $$('svg.mg-ln').forEach(s => { const r = s.getBoundingClientRect(), vb = s.viewBox.baseVal, sx = r.width / vb.width, sy = r.height / vb.height; s.querySelectorAll('path[data-p]').forEach(p => { const P = p.dataset.p.split(' ').map(q => q.split(',').map(Number)); let a = 0, b = 0; for (let i = 1; i < P.length; i++) { const dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1]; a += Math.hypot(dx * sx, dy * sy); b += Math.hypot(dx, dy); } p.style.setProperty('--len', Math.ceil(Math.max(a, b)) + 4); }); });
  const legend = items => `<div class="legend mg-lg">${items.map(([t, c, v, dash]) => `<span>${dash ? '<i class="dash"></i>' : `<i style="background:var(${c})"></i>`}${esc(t)}${v != null ? `<b>${esc(v)}</b>` : ''}</span>`).join('')}</div>`;
  const hrow = (label, n, max, c, extra) => `<div class="mg-hrow"><span class="ell">${label}</span><div class="bar-h" aria-hidden="true"><i style="width:${Math.max(2, Math.round(n / Math.max(1, max) * 100))}%;background:var(${c})"></i></div><span class="n">${extra || num(n)}</span></div>`;

  /* ---------- time axis for the chosen range ---------- */
  const HRS = [30,18,10,6,4,5,8,14,22,34,42,46,44,48,52,50,54,58,62,66,72,76,64,46]; // messages by hour, sums to 931
  const HL = h => (h % 12 || 12) + (h < 12 ? ' AM' : ' PM');
  const D7 = ['Sun 1','Mon 2','Tue 3','Wed 4','Thu 5','Fri 6','Sat 7'];
  const NOWH = 17; // it is 4:50 PM: today has 17 hours so far
  const AX = () => { const f = F(); if (f.date === '1') return HRS.slice(0, NOWH).map((_, i) => HL(i)); if (f.date === '7') return D7; const a = span()[0]; return Array.from({length:days()}, (_, i) => fmtD(new Date(a.getFullYear(), a.getMonth(), a.getDate() + i))); };
  const wob = (i, w) => 1 - w + ((i * 37) % 23) / 22 * 2 * w; // deterministic wiggle in [1-w, 1+w]
  // base: the canvas's 7 daily values, stretched to the chosen range. rate: averages (%, stars) rather than counts.
  function trend(base, rate) {
    const f = F(), ax = AX(), avg = base.reduce((a, b) => a + b, 0) / base.length;
    if (f.date === '7') return base.slice();
    if (f.date === '1') return ax.map((_, i) => rate ? avg * wob(i, .02) : avg * HRS[i] / 931);
    return ax.map((_, i) => base[(i + 7 - ax.length % 7) % 7] * wob(i, rate ? .02 : .12));
  }
  const prevOf = (vals, r, rate) => vals.map((v, i) => rate ? v - r * wob(i + 5, .4) : Math.round(v / r * wob(i + 3, .07)));

  /* ---------- who is waiting ---------- */
  const waiting = () => LEADS.filter(l => l.owner !== 'vina' && !['sold','lost'].includes(l.status) && l.wait != null && l.wait < 1440 && (l.unread || !l.owner || l.late)).sort((a, b) => b.wait - a.wait);
  const STARS = [[5, 198], [4, 80], [3, 18], [2, 9], [1, 7]];
  const starRows = (ST, tot) => { const smax = Math.max(1, ...ST.map(x => x[1])); return `<div class="col" style="gap:2px" role="img" aria-label="${ST.map(([st, n]) => st + ' stars: ' + n).join(', ')}">${ST.map(([st, n]) => `<div class="mg-br"><span class="b">${st} star${st === 1 ? '' : 's'}</span><div class="bar-h"><i style="width:${Math.max(1, n / smax * 100).toFixed(1)}%;background:var(--amber)"></i></div><span class="num b" style="text-align:end">${num(n)}</span><span class="num xs mute" style="text-align:end">${Math.round(n / Math.max(1, tot) * 100)}%</span></div>`).join('')}</div>`; };

  /* ---------- M1 Overview ---------- */
  R('overview', {id:'M1', title:'Overview', roles:['manager','vina'], states:[['first','First day, no data yet'],['loading','Loading'],['error','Could not load']], after: fitDraw, render() {
    const f = F(), fd = S.st === 'first', tb = toolbar(['ch','model','src'], 'Overview');
    const sb = stateBody('overview'); if (sb) return shell({nav:'overview', title:'Overview', body: tb + sb});
    const w = waiting(), fk = FK(), ax = AX();
    const alonePct = ({all:78, wa:79, web:81, ph:64})[f.ch];
    const cnt = b => trend(b).map(v => Math.round(v * fk));
    const MET = {
      conv:{k:'Conversations', v:num(sc(2436)), d:'+12%', vals:cnt([298,312,342,356,372,389,367]), r:1.12},
      alone:{k:'Answered by VINA alone', v:alonePct + '%', d:'+3 pts', vals:trend([74,75,77,76,78,79,78].map(x => x + alonePct - 78), true), r:3, rate:true},
      qual:{k:'Qualified leads', v:num(sc(612)), d:'+8%', vals:cnt([78,84,88,90,92,95,85]), r:1.08},
      sold:{k:'Sold', v:num(sc(9)), d:'+2', vals:cnt([0,1,2,1,2,1,2]), r:1.29},
    };
    const mk = MET[S.f.mgMet] ? S.f.mgMet : 'conv', m = MET[mk], prev = prevOf(m.vals, m.r, m.rate);
    // Summary card: metric tabs switch the one chart; previous period is the dashed line
    const tabs = `<div class="mg-mt" role="tablist" aria-label="Metric to chart">${Object.entries(MET).map(([key, o]) => `<button type="button" role="tab" class="mg-tab" id="mg-t-${key}" aria-selected="${mk === key}" aria-controls="mg-panel" data-a="mg-met" data-x="${key}"><span class="k">${mic(o.k, 13)}<span>${o.k}</span></span><span class="row tight nowrap" style="align-items:baseline"><span class="v" ${fd ? '' : countAttr(o.v)} data-k="${o.k}">${fd ? '—' : o.v}</span>${fd ? '' : delta(o.d)}</span></button>`).join('')}</div>`;
    let chart = '', lg = '';
    if (!fd) {
      let series, opt = {h:300, label:m.k + ' for ' + rangeShort() + ', with the previous period'};
      if (mk === 'conv') {
        const handed = m.vals.map((v, i) => Math.round(v * (0.2 + ((i * 7) % 5) / 100))), alone = m.vals.map((v, i) => v - handed[i]);
        series = [{name:'VINA alone', c:'--ch-b', vals:alone}, {name:'Handed to the team', c:'--ch-a', vals:handed}, {name:'All, previous period', c:'--faint', vals:prev, dash:true}];
        lg = legend([['VINA alone', '--ch-b', num(alone.reduce((a, b) => a + b, 0))], ['Handed to the team', '--ch-a', num(handed.reduce((a, b) => a + b, 0))], ['Previous period', '', null, true]]);
      } else {
        series = [{name:m.k, c:'--ch-a', vals:m.vals}, {name:'Previous period', c:'--faint', vals:prev, dash:true}];
        lg = legend([[m.k, '--ch-a'], ['Previous period', '', null, true]]);
        if (m.rate) { const all = m.vals.concat(prev), lo = Math.floor(Math.min(...all) / 5) * 5 - 5, st = Math.max(5, Math.ceil((Math.ceil(Math.max(...all) / 5) * 5 - lo) / 20) * 5); Object.assign(opt, {min:lo, max:lo + st * 4, fmt:v => Math.round(v) + '%'}); }
      }
      chart = lines(ax, series, opt);
    }
    const STRIP = [['Customers who replied', num(sc(1987)), '+9%'], ['Test drive requests', num(sc(48)), '+6'], ['Not interested', num(sc(131)), '−4%'], ['Customer rating', '4.6', '+0.1']];
    const strip = `<div class="mg-strip" aria-label="More numbers">${STRIP.map(([k, v, d]) => `<div class="mg-si">${mic(k, 13)}<div style="min-width:0"><span class="k">${k}</span><div class="row tight nowrap" style="align-items:baseline"><span class="v">${fd ? '—' : v}</span>${fd ? '' : delta(d)}</div></div></div>`).join('')}</div>`;
    const summary = `<section class="card mg-sum" aria-label="Summary">${tabs}<div class="mg-cp" id="mg-panel" role="tabpanel" aria-labelledby="mg-t-${mk}">
      ${fd ? emptyBox('Conversations, answers by VINA alone, qualified leads and cars sold will show here day by day, next to the previous period.') : `<div class="mg-cph">${lg}</div>${chart}`}</div>${strip}</section>`;
    // Waiting for the team now: a live card
    const LH = [4, 5, 5, 6, 6, 7, 8, 7, 8, 9, 9, w.length];
    const mini = `<div class="mg-mini" role="img" aria-label="Customers waiting over the last hour">${LH.map((v, i) => `<i style="height:${Math.max(6, v / Math.max(1, ...LH) * 100).toFixed(0)}%" title="${clock(new Date(NOW0.getTime() - (11 - i) * 3e5))}: ${v} waiting"></i>`).join('')}</div><div class="mg-cap"><span>60 min ago</span><span>Now</span></div>`;
    const wlist = `<div class="mg-rtl"><div class="hd"><span>Waiting the longest</span><span>Minutes</span></div>${w.slice(0, 5).map(l => `<a class="mg-wl" href="#lead-${l.id}">${av(l.name, 'sm')}<span style="min-width:0"><span class="nm ell">${esc(l.name)}</span><span class="meta">${chip(l.status)}<span class="ell">${l.owner ? esc(uname(l.owner)) : '<span class="red b">Not given to anyone</span>'}</span></span></span><span class="w ${l.late ? 'red' : 'amber'}">${mins(l.wait)}</span></a>`).join('')}</div>`;
    const live = reportCard({title:'Waiting for the team now', cls:'mg-live-c', right: fd ? '' : `<span class="mg-live c-amber">${pulse()}Live</span>`, link:['View unassigned leads', 'unassigned'],
      body: fd || !w.length ? emptyBox('Nobody is waiting. Customers waiting for a person show here, longest first.') : `<div class="mg-rtn">${mic('Waiting for the team now', 17)}<span class="v amber" ${countAttr(String(w.length))} data-k="Waiting now">${w.length}</span></div>
        <div class="mg-long">${ic('clock', 14)}Longest wait <b>${mins(w[0].wait)}</b></div>${mini}${wlist}`});
    // Row 2: report cards
    const SB = [['new',186],['qualified',74],['callback',41],['contacted',132],['testdrive',48],['offer',22],['sold',9],['lost',100]].map(([s, n]) => [s, sc(n)]);
    const smax = Math.max(1, ...SB.map(x => x[1]));
    const status = reportCard({title:'Leads by status', right: fd ? '' : `<span class="mg-tot">${num(SB.reduce((a, x) => a + x[1], 0))}</span>`, link:['View leads', 'leads'],
      body: fd ? emptyBox('Each lead status will show here with its count.') : `<div class="col" style="gap:0">${SB.map(([s, n]) => `<div class="mg-hrow"><span>${chip(s)}</span><div class="bar-h" aria-hidden="true"><i style="width:${Math.max(2, Math.round(n / smax * 100))}%;background:var(--${STATUS[s].c}-f)"></i></div><span class="n">${num(n)}</span></div>`).join('')}</div>`});
    const MD = [['V27 2027',318],['03T 2026',165],['V27 2026',129]].filter(([x]) => f.model === 'all' || f.model === x).map(([x, n]) => [x, Math.round(n * DK() * CHK[f.ch] * SK[f.src])]);
    const mt = MD.reduce((a, x) => a + x[1], 0) || 1;
    const models = reportCard({title:'Car model interest', link:['View leads by car model', 'leads'],
      body: fd ? emptyBox('The car models customers ask about will show here.') : `<div class="col">${MD.map(([x, n], i) => `<div class="col tight"><div class="row"><span class="grow b">${x}</span><span class="num"><b>${num(n)}</b> <span class="mute">${Math.round(n / mt * 100)}%</span></span></div><div class="bar-h"><i style="width:${Math.round(n / mt * 100)}%;background:var(${i ? '--ch-d' : '--ch-a'})"></i></div></div>`).join('')}</div>`});
    const lang = reportCard({title:'Arabic vs English', link:['View conversations', 'conversations'],
      body: fd ? emptyBox('The split between Arabic and English chats will show here.') : `<div class="mg-split grow-x" role="img" aria-label="71% Arabic, 29% English"><i style="width:71%;background:var(--ch-c)"></i><i style="width:29%;background:var(--ch-b)"></i></div>
      <div class="g2" style="grid-template-columns:1fr 1fr;gap:12px;margin-top:18px"><div><div class="small mute"><i class="mg-sw" style="background:var(--ch-c)"></i>Arabic</div><div class="mg-tot">71%</div><div class="xs mute">${num(sc(1730))} chats</div></div><div><div class="small mute"><i class="mg-sw" style="background:var(--ch-b)"></i>English</div><div class="mg-tot">29%</div><div class="xs mute">${num(sc(706))} chats</div></div></div>`});
    // Row 3: messages by hour + customer rating
    const hv = HRS.map(v => Math.round(v * 3.9 * K()));
    const out = HRS.reduce((a, v, i) => a + (i < 9 || i >= 22 ? v : 0), 0) / 931;
    const hours = reportCard({title:'Messages by hour', right: fd ? '' : `<span class="row tight nowrap small mute">${mic('VINA alone', 12)}<b class="mg-tot" style="font-size:16px">${Math.round(out * 100)}%</b>while closed</span>`,
      body: fd ? emptyBox('Messages by hour will show here, with showroom hours shaded.') : vbars(HRS.map((_, i) => HL(i)), [{name:'Messages', c: i => i >= 9 && i < 22 ? '--ch-a' : '--ch-b', vals:hv}], {h:200, shade:[9, 22], every:3, label:'Messages by hour. Low overnight, rising through the day, peaking at 9 PM.'}) + `<div style="margin-top:14px">${legend([['Showroom open, 9 AM to 10 PM', '--ch-a'], ['Closed, VINA answers', '--ch-b']])}</div>`});
    const ST = STARS.map(([s, n]) => [s, sc(n)]), stot = ST.reduce((a, x) => a + x[1], 0);
    const rating = reportCard({title:'Customer rating', link:['View customer ratings', 'ratings'],
      body: fd ? emptyBox('Ratings out of 5 will show here after the first chats close.') : `<div class="mg-rtn">${mic('Customer rating', 17)}<span class="v" ${countAttr('4.6')} data-k="Rating card">4.6</span><span class="mute">out of 5</span></div><div class="row tight" style="margin:4px 0 14px">${stars(4.6, 15)}<span class="small mute">${num(stot)} ratings</span></div>${starRows(ST, stot)}`});
    return shell({nav:'overview', title:'Overview', body:`${tb}<div class="mg-r21">${summary}${live}</div><div class="mg-r3">${status}${models}${lang}</div><div class="mg-r21">${hours}${rating}</div>`});
  }});
  A['mg-met'] = el => { S.f.mgMet = el.dataset.x; };

  /* ---------- M2 Channels ---------- */
  const CHN = [
    {k:'wa', name:'WhatsApp', d:'+966 92 003 5976', conv:1790, leads:476, alone:'79%', r:'4.6', c:'--ch-b', v:[218,231,252,263,274,285,267]},
    {k:'web', name:'Website chat', d:'icaur-alghanim.sa', conv:482, leads:98, alone:'81%', r:'4.5', c:'--ch-a', v:[60,64,68,70,72,76,72]},
    {k:'ph', name:'Phone line', d:'012 600 0101', conv:164, leads:38, alone:'64%', r:'4.4', c:'--ch-c', v:[20,18,22,24,26,28,26]},
  ];
  const chProb = c => c.k === 'wa' && S.whatsappDown ? 'WhatsApp is disconnected. Customers are not getting replies.' : c.problem;
  R('channels', {id:'M2', title:'Channels', roles:['manager','vina'], states:[['loading','Loading'],['error','Could not load']], after: fitDraw, render() {
    const tb = toolbar(['model','src'], 'Channels');
    const sb = stateBody('channel numbers'); if (sb) return shell({nav:'channels', title:'Channels', body: tb + sb});
    const fk = MK[F().model] * SK[F().src], k = DK() * fk;
    const stat = (label, v, count) => `<div><div class="k mk">${mic(label, 13)}${label}</div><div class="v" ${count ? countAttr(v) : ''}>${v}</div></div>`;
    const cards = CHN.map(c => {
      const prob = chProb(c);
      return reportCard({title:c.name, sub:esc(c.d), cls:'mg-chc' + (prob ? ' warn' : ''), link:['View conversations', 'conversations'],
        right: prob ? `<span class="mg-live c-amber">${pulse()}Needs attention</span>` : `<span class="mg-live c-green">${pulse('green')}Live</span>`,
        body:`<div class="mg-stats">${stat('Conversations', num(sc(c.conv, k)), true)}${stat('Leads', num(sc(c.leads, k)))}${stat('Answered by VINA alone', c.alone)}${stat('Customer rating', c.r)}</div>${prob ? `<div class="note warn">${ic('alert')}<span>${prob} <b>The VINA team has been told.</b></span></div>` : ''}`})
        .replace('<header class="rc-h">', `<header class="rc-h">${chIc(c.k, true)}`).replace('<a href="#conversations">', `<a href="#conversations" data-a="m2-open" data-x="${c.k}">`);
    }).join('');
    const ds = CHN.map(c => ({name:c.name, c:c.c, vals: trend(c.v).map(v => Math.round(v * fk))}));
    const SR = [['Meta ads',330],['Snapchat ads',129],['Website, no ad',92],['Google ads',38],['Walk-in and other',23]].map(([n, v]) => [n, sc(v, k)]);
    const tot = SR.reduce((a, x) => a + x[1], 0);
    const perDay = reportCard({title:'Conversations by channel', link:['View conversations', 'conversations'], right: legend(ds.map(s => [s.name, s.c])),
      body: lines(AX(), ds, {h:230, label:'Conversations for each channel, ' + rangeShort() + '. WhatsApp is highest.'})});
    const src = reportCard({title:'Leads by source', right:`<span class="mg-tot">${num(tot)}</span>`, link:['View leads', 'leads'],
      body:`<div class="col tight">${SR.map(([n, v], i) => hrow(esc(n), v, SR[0][1], i ? '--ch-d' : '--ch-a', `${num(v)} <span class="mute" style="font-weight:400">${Math.round(v / Math.max(1, tot) * 100)}%</span>`)).join('')}</div>`});
    return shell({nav:'channels', title:'Channels', body:`${tb}<div class="mg-r3">${cards}</div><div class="mg-r21">${perDay}${src}</div>`});
  }});
  A['m2-open'] = el => { Object.assign(M3(), {folder:'open', ch:el.dataset.x, st:'all', hb:'all', date:'all', rated:false, low:false, q:'', open:false}); S.f.m3sel = null; };

  /* ---------- M3 Conversations (read only) ---------- */
  // Rated leads without saved lines get a short chat so their ratings link somewhere real.
  const addChat = (id, at, lines) => { const l = lead(id); if (l && !l.m.length) { l.m = lines; l.ratedAt = at; } else if (l) l.ratedAt = at; };
  addChat('l26', 'Today, 11:20 AM', [{k:'in', text:'What is the monthly payment for the V27 2027 Standard?', at:'Thu 1:10 PM'}, {k:'vina', text:'Our sales team will explain the payment plans. When is a good time to call you?', at:'Thu 1:10 PM', src:'Rules: never talk about prices'}, {k:'in', text:'Tomorrow morning', at:'Thu 1:12 PM'}, {k:'evt', text:'Given to Abdullah by rule "Qualified to Sales"', at:'Thu 1:13 PM', i:'user'}, {k:'agent', text:'Hi Saad, the best plan I have is 2,890 a month over 5 years.', who:'abdullah', at:'Fri 6:40 PM'}, {k:'in', text:'That is above my budget. And nobody called me in the morning.', at:'Fri 6:45 PM'}, {k:'evt', text:'Abdullah closed the lead · Lost, price too high', at:'Today 10:58 AM', i:'x'}, {k:'evt', text:'Customer rated the chat 2 of 5', at:'Today 11:20 AM', tone:'amber', i:'star'}]);
  addChat('l29', 'Yesterday, 10:42 PM', [{k:'in', text:'كم سعر V27 2026؟', at:'Wed 9:02 PM'}, {k:'vina', text:'الأسعار يوضحها لك فريقنا مباشرة. متى يناسبك نتصل عليك؟', at:'Wed 9:02 PM', src:'Rules: never talk about prices'}, {k:'in', text:'أبغى السعر بس', at:'Wed 9:05 PM'}, {k:'evt', text:'Given to Huda by rule "Callbacks to call centre"', at:'Wed 9:06 PM', i:'user'}, {k:'evt', text:'Huda called 3 times · no answer', at:'Thu 1:30 PM', tone:'amber', i:'phone'}, {k:'evt', text:'Customer rated the chat 1 of 5', at:'Yesterday 10:42 PM', tone:'amber', i:'star'}]);
  addChat('l31', 'Fri 6 Nov, 4:05 PM', [{k:'in', text:'Price of the 03T?', at:'Fri 3:40 PM'}, {k:'vina', text:'Happy to help! Which trim would you like, Standard or Premium?', at:'Fri 3:40 PM', src:'Products: 03T 2026'}, {k:'in', text:'Just the price please', at:'Fri 3:42 PM'}, {k:'vina', text:'Our team will share the price with you. Which trim would you like?', at:'Fri 3:42 PM', src:'Rules: never talk about prices'}, {k:'evt', text:'Customer rated the chat 2 of 5', at:'Fri 4:05 PM', tone:'amber', i:'star'}]);
  addChat('l25', 'Thu 5 Nov, 7:30 PM', [{k:'in', text:'I am at the showroom now, who do I ask for?', at:'Thu 6:10 PM'}, {k:'vina', text:'Welcome! Ask for Yousef at the front desk. He is expecting you.', at:'Thu 6:10 PM', src:'Showroom team list'}, {k:'evt', text:'Customer rated the chat 5 of 5', at:'Thu 7:30 PM', tone:'teal', i:'star'}]);
  addChat('l30', 'Wed 4 Nov, 2:15 PM', [{k:'in', text:'When will my V27 be delivered?', at:'Wed 1:50 PM'}, {k:'agent', text:'Your car arrives on Monday, I will call you to book the delivery time.', who:'abdullah', at:'Wed 2:02 PM'}, {k:'evt', text:'Customer rated the chat 4 of 5', at:'Wed 2:15 PM', tone:'teal', i:'star'}]);
  addChat('l07', 'Thu 5 Nov, 6:30 PM', []);

  const M3 = () => S.f.m3 || (S.f.m3 = {folder:'open', ch:'all', st:'all', hb:'all', date:'all', rated:false, low:false, q:''});
  // [key, tab label, full name, test]
  const FOLDERS = [['open','Open','All open conversations', l => !['sold','lost'].includes(l.status)], ['waiting','Waiting','Waiting for a person', l => !['sold','lost'].includes(l.status) && l.owner !== 'vina' && (!l.owner || l.asked || l.unread)], ['closed','Closed','Closed', l => ['sold','lost'].includes(l.status)], ['low','Low rating','Low rating, 1 or 2 stars', l => l.rating && l.rating <= 2]];
  const FL = {ch: v => CH[v].label, st: v => STATUS[v].label, hb: v => 'Handled by ' + (v === 'VINA alone' ? 'VINA alone' : v.toLowerCase()), date: v => v === 'today' ? 'Today' : 'Last 7 days'};
  const activeF = s => ['ch','st','hb','date'].filter(k => s[k] !== 'all').map(k => [k, FL[k](s[k])]).concat(s.rated ? [['rated','Has a rating']] : [], s.low ? [['low','Low rating']] : []);
  const lastLine = l => [...l.m].reverse().find(x => ['in','vina','agent','file','tpl'].includes(x.k)) || {text:'', at:''};
  const convs = () => LEADS.filter(l => l.m.length);
  function m3list() {
    const s = M3(), fd = FOLDERS.find(x => x[0] === s.folder)[3], q = String(s.q || '').toLowerCase();
    return convs().filter(l => fd(l) && (s.ch === 'all' || l.ch === s.ch) && (s.st === 'all' || l.status === s.st) && (s.hb === 'all' || l.handled === s.hb)
      && (s.date === 'all' || (s.date === 'today' ? l.lastIn <= 16.8 : l.lastIn <= 168)) && (!s.rated || l.rating) && (!s.low || (l.rating && l.rating <= 2))
      && (!q || l.name.toLowerCase().includes(q) || l.mob.replace(/\s/g, '').includes(q.replace(/\s/g, '')))).sort((a, b) => a.lastIn - b.lastIn);
  }
  R('conversations', {id:'M3', title:'Conversations', roles:['manager','vina'], states:[['empty','No conversations yet'],['loading','Loading'],['error','Could not load']], render() {
    const s = M3(), popNew = S._m3fNew; S._m3fNew = false;
    if (S.st === 'loading') return shell({nav:'conversations', title:'Conversations', body: `<div class="g2" style="grid-template-columns:minmax(0,360px) minmax(0,1fr)">${loadingRows(8, 64)}${skel(520)}</div>`});
    if (S.st === 'error') return shell({nav:'conversations', title:'Conversations', body: stateBody('conversations')});
    if (S.st === 'empty') return shell({nav:'conversations', title:'Conversations', body: `<div class="card">${empty('conv', 'No conversations yet', 'When customers start chatting with VINA on WhatsApp, the website or the phone, every conversation shows here to read.')}</div>`});
    const list = m3list(), act = activeF(s), popOpen = S.menu === 'm3f';
    let sel = lead(S.f.m3sel); if (!sel || !list.includes(sel)) sel = list[0] || null;
    const tabs = `<div class="tabs mg-tabs" role="tablist" aria-label="Folders">${FOLDERS.map(([k, t, full, fn]) => `<button type="button" role="tab" class="tab" data-a="m3-folder" data-x="${k}" aria-selected="${s.folder === k}" title="${full}">${t}<span class="n">${convs().filter(fn).length}</span></button>`).join('')}</div>`;
    const pop = popOpen ? `<div class="menu mg-pop ${popNew ? 'anim-in' : ''}" role="dialog" aria-label="Filters" data-a="noop">
        <div class="g">
          <div class="field"><label for="b-f-m3-ch">Channel</label>${bindSel('f.m3.ch', [['all','All channels']].concat(Object.entries(CH).map(([k, c]) => [k, c.label])))}</div>
          <div class="field"><label for="b-f-m3-st">Status</label>${bindSel('f.m3.st', [['all','All statuses']].concat(ST_ORDER.map(k => [k, STATUS[k].label])))}</div>
          <div class="field"><label for="b-f-m3-hb">Handled by</label>${bindSel('f.m3.hb', [['all','Anyone'],['VINA alone','VINA alone'],['Call centre','Call centre'],['Sales','Sales']])}</div>
          <div class="field"><label for="b-f-m3-date">Date</label>${bindSel('f.m3.date', [['all','Any date'],['today','Today'],['7','Last 7 days']])}</div>
        </div>
        <div class="row" style="gap:4px 18px"><label class="chk small"><input ${bindChk('f.m3.rated')}>Has a rating</label><label class="chk small"><input ${bindChk('f.m3.low')}>Low rating</label></div>
        <div class="ft"><button type="button" class="btn ghost" data-a="m3-clear">Clear all</button><button type="button" class="btn pri" data-a="m3-filt">Show ${list.length} chat${list.length === 1 ? '' : 's'}</button></div></div>` : '';
    const head = `<div class="mg-lh"><div class="row tight nowrap">${cxSearch('f.m3.q', 'Search conversations')}
        <button type="button" class="btn mg-fbtn" data-a="m3-filt" aria-haspopup="dialog" aria-expanded="${popOpen}">${ic('filter', 15)}Filters${act.length ? `<span class="mg-fn">${act.length}</span>` : ''}</button></div>
      ${act.length ? `<div class="fchips mg-act">${act.map(([k, t]) => `<button type="button" class="fchip" data-a="m3-unf" data-x="${k}" aria-label="Remove filter: ${esc(t)}">${esc(t)}<span class="x">${ic('x', 13)}</span></button>`).join('')}<button type="button" class="clr" data-a="m3-clear">Clear all</button></div>` : ''}${pop}</div>`;
    const rows = list.length ? list.map(l => { const ll = lastLine(l); return cxRow({l, a:'m3-sel', cur:sel === l, time:rowTime(ll.at), unread:l.unread, preview:txt(ll.text),
        meta:stDot((STATUS[l.status] || {label:l.status}).label, (STATUS[l.status] || {c:'grey'}).c) + `<span class="ell">${esc(l.handled)}</span>` + (l.rating ? stars(l.rating, 11) : '')}); }).join('')
      : empty('search', 'No conversations match', 'Try another folder or clear the filters.', act.length || s.q ? `<button type="button" class="btn sm" data-a="m3-clear">Clear filters</button>` : '');
    const listPane = `<section class="mg-list" aria-label="Conversation list">${head}${tabs}<div class="cx-list" id="m3-list" data-keep aria-keyshortcuts="J K">${rows}</div></section>`;
    const line = [CH[sel ? sel.ch : 'wa'].label, sel && sel.model, sel && (sel.owner ? 'given to ' + uname(sel.owner) : 'not given to anyone yet')].map(esc).join(' · ');
    const chatPane = sel ? `<section class="mg-chatp mg-chat" aria-label="Conversation with ${esc(sel.name)}">
        ${cxHead(sel, {back:'m3-back', line, acts:`<a class="ibtn sm" href="#lead-${sel.id}" aria-label="Open lead page" title="Open lead page">${ic('ext', 16)}</a>`})}
        ${cxThread(sel, {id:'m3-chat'})}
        <div class="cx-ro" role="note">${ic('eye', 15)}<span>View only. The agent handling this lead replies.</span></div></section>`
      : `<section class="mg-chatp mg-chat">${empty('conv', 'Pick a conversation', 'Choose one from the list to read the full chat.')}</section>`;
    const dp = sel && dpOpen();
    return shell({nav:'conversations', title:'Conversations', flush:true, body:`<div class="mg-m3 ${dp ? 'dp-on' : ''}" data-open="${s.open ? 1 : 0}">${listPane}${chatPane}${dp ? cxDetails(sel) : ''}</div>`});
  }});
  A['m3-folder'] = el => { M3().folder = el.dataset.x; M3().open = false; };
  A['m3-sel'] = el => { S.f.m3sel = el.dataset.x; M3().open = true; DP.narrow = false; stickBottom(); };
  A['m3-back'] = () => { M3().open = false; DP.narrow = false; };
  A['m3-clear'] = () => { Object.assign(M3(), {ch:'all', st:'all', hb:'all', date:'all', rated:false, low:false, q:''}); };
  A['m3-filt'] = () => { S.menu = S.menu === 'm3f' ? null : 'm3f'; S._m3fNew = S.menu === 'm3f'; };
  A['m3-unf'] = el => { const k = el.dataset.x; M3()[k] = k === 'rated' || k === 'low' ? false : 'all'; };


  /* ---------- M4 Call centre and sales ---------- */
  const STATE = id => { const st = U[id].status; return st === 'available' ? ['Online', 'green'] : st === 'busy' ? [U[id].role === 'cc' ? 'On a call' : 'Busy', 'amber'] : ['Off today', 'grey']; };
  R('team', {id:'M4', title:'Call centre and sales', roles:['manager','vina'], states:[['loading','Loading'],['error','Could not load']], render() {
    const tb = toolbar(['ch','model','src'], 'Call centre and sales');
    const sb = stateBody('team numbers'); if (sb) return shell({nav:'team', title:'Call centre and sales', body: tb + sb});
    const k = K();
    const people = Object.keys(U).filter(x => ['cc','sales'].includes(U[x].role));
    const on = people.filter(x => U[x].status !== 'away');
    const grp = (title, role) => `<div class="mg-og"><span class="eyebrow">${title}</span><div class="mg-avs">${people.filter(x => U[x].role === role).map(x => { const [t, c] = STATE(x); return `<div class="mg-person ${c === 'grey' ? 'off' : ''}" title="${esc(U[x].name)} · ${t}"><span class="avw">${av(U[x].name, 'lg')}<span class="pres ${U[x].status}" aria-hidden="true"></span></span><b class="small ell">${esc(first(x))}</b><span class="xs ${c === 'grey' ? 'mute' : c}">${t}</span></div>`; }).join('')}</div></div>`;
    const online = reportCard({title:'Online now', right:`<span class="mg-live c-green">${pulse('green')}${on.length} of ${people.length}</span>`, body:`<div class="mg-ppl">${grp('Call centre', 'cc')}${grp('Sales', 'sales')}</div>`});
    const cbs = LEADS.filter(l => l.cb && l.cb.day !== 'tomorrow');
    // ponytail: sample leads cover only part of today's callbacks; fixed offsets keep the totals realistic and still move with agent actions
    const done = 13 + cbs.filter(l => l.cb.done).length, over = cbs.filter(l => !l.cb.done && l.cb.in < 0).length, todo = 5 + cbs.filter(l => !l.cb.done && l.cb.in >= 0).length;
    const nextCb = cbs.filter(l => !l.cb.done && l.cb.in >= 0 && U[l.owner]).sort((a, b) => a.cb.in - b.cb.in)[0];
    const cbCard = reportCard({title:'Callbacks today', body:`<div class="mg-three">
      <div><span class="v" ${countAttr(done)}>${done}</span><span class="k">${ic('check', 14)}Done</span></div>
      <div class="${over ? 'hot' : ''}"><span class="v">${over}</span><span class="k">${over ? pulse('red') : ic('alert', 14)}Overdue</span></div>
      <div><span class="v">${todo}</span><span class="k">${ic('clock', 14)}To call</span></div></div>${nextCb ? `<p class="small" style="margin-top:14px"><span class="mute">Next:</span> <b>${esc(nextCb.name)}</b> at ${esc(nextCb.cb.at)}, ${esc(first(nextCb.owner))} calls</p>` : ''}`});
    const FN = [['Conversations', 2436, 'Every chat VINA had', '--ch-b'], ['Qualified by VINA', 612, 'Ready for the team', '--ch-b'], ['Sent to call centre', 221, 'Callbacks VINA handed over', '--ch-a'], ['Reached', 181, 'The call centre spoke to them', '--ch-a'], ['Sent to sales', 94, 'From the call centre · 235 more went straight from VINA', '--ch-a'], ['Test drive', 48, 'Madinah Road and Prince Sultan Road', '--ch-a'], ['Sold', 9, '4 V27 2027 · 3 03T · 2 V27 2026', '--green']].map(([l, n, t, c]) => [l, sc(n, k), t, c]);
    const funnel = reportCard({title:'From conversation to sale', right: legend([['VINA', '--ch-b'], ['Your team', '--ch-a'], ['Sold', '--green']]), link:['View pipeline', 'pipeline'],
      body:`<div class="mg-fun hd"><span class="mg-fl">Step</span><span class="mg-ft"></span><span class="mg-fc" style="font:inherit">Count</span><span class="mg-fp"><span class="wd">Conversion</span><span class="nr">%</span></span></div>
      ${FN.map(([l, n, t, c], i) => `<div class="mg-fun"><span class="mg-fl"><b title="${esc(t)}">${l}</b></span><div class="mg-ft" role="img" aria-label="${l}: ${num(n)}"><i class="grow-x" style="width:${Math.max(2, Math.sqrt(n / Math.max(1, FN[0][1])) * 100).toFixed(1)}%;background:var(${c})"></i></div><span class="mg-fc">${num(n)}</span><span class="mg-fp">${i ? Math.round(n / Math.max(1, FN[i - 1][1]) * 100) + '%' : '—'}</span></div>`).join('')}`});
    const CC = [['reem', 86, 71, '14 min', 38, '4.7', false], ['faisal', 74, 58, '22 min', 29, '4.5', true], ['huda', 61, 52, '11 min', 27, '4.8', false]];
    const SA = [['majed', 131, 118, '18 min', 20, 4, '4.6', false], ['yousef', 112, 96, '26 min', 16, 3, '4.4', false], ['abdullah', 86, 70, '31 min', 12, 2, '4.5', true]];
    const pcell = id => { const [t, c] = STATE(id); return `<div class="who"><span class="avw">${av(U[id].name, 'sm')}<span class="pres ${U[id].status}" aria-hidden="true"></span></span><span><span class="nm" style="display:block">${esc(U[id].name)}</span><span class="xs ${c === 'grey' ? 'mute' : c}">${t}</span></span></div>`; };
    const slow = (v, s) => s ? `<span class="chip c-amber" title="Slower than the team">${v}</span>` : v;
    const pct = (a, b) => `<span class="pc">${Math.round(a / Math.max(1, b) * 100)}%</span>`;
    const ccT = CC.map(r => [r[0], sc(r[1], k), sc(r[2], k), r[3], sc(r[4], k), r[5], r[6]]);
    const ccSum = ccT.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[4]], [0, 0, 0]);
    const saT = SA.map(r => [r[0], sc(r[1], k), sc(r[2], k), r[3], sc(r[4], k), sc(r[5], k), r[6], r[7]]);
    const saSum = saT.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[4], a[3] + r[5]], [0, 0, 0, 0]);
    const ccTable = reportCard({title:'Call centre', cls:'mg-tblc', body:`<div class="mg-tw"><table class="tbl"><thead><tr><th>Person</th><th class="r">Callbacks done</th><th class="r">Reached</th><th class="r">Time before calling</th><th class="r">Sent to sales</th><th class="r">Customer rating</th></tr></thead><tbody>
      ${ccT.map(r => `<tr><td>${pcell(r[0])}</td><td class="r num">${num(r[1])}</td><td class="r num">${num(r[2])} ${pct(r[2], r[1])}</td><td class="r num">${slow(r[3], r[6])}</td><td class="r num">${num(r[4])}</td><td class="r num">${r[5]}</td></tr>`).join('')}
      <tr class="tot"><td>Call centre total</td><td class="r num">${num(ccSum[0])}</td><td class="r num">${num(ccSum[1])} ${pct(ccSum[1], ccSum[0])}</td><td class="r num">16 min</td><td class="r num">${num(ccSum[2])}</td><td class="r num">4.7</td></tr></tbody></table></div>`});
    const saTable = reportCard({title:'Sales', cls:'mg-tblc', body:`<div class="mg-tw"><table class="tbl"><thead><tr><th>Person</th><th class="r">Leads given</th><th class="r">Contacted</th><th class="r">First reply</th><th class="r">Test drives</th><th class="r">Sold</th><th class="r">Customer rating</th></tr></thead><tbody>
      ${saT.map(r => `<tr><td>${pcell(r[0])}</td><td class="r num">${num(r[1])}</td><td class="r num">${num(r[2])} ${pct(r[2], r[1])}</td><td class="r num">${slow(r[3], r[7])}</td><td class="r num">${num(r[4])}</td><td class="r num green b">${num(r[5])}</td><td class="r num">${r[6]}</td></tr>`).join('')}
      <tr class="tot"><td>Sales total</td><td class="r num">${num(saSum[0])}</td><td class="r num">${num(saSum[1])} ${pct(saSum[1], saSum[0])}</td><td class="r num">24 min</td><td class="r num">${num(saSum[2])}</td><td class="r num green">${num(saSum[3])}</td><td class="r num">4.5</td></tr></tbody></table></div>`});
    return shell({nav:'team', title:'Call centre and sales', body:`${tb}<div class="mg-r21">${funnel}<div class="mg-stack">${cbCard}${online}</div></div>${ccTable}${saTable}`});
  }});

  /* ---------- M5 Customer ratings ---------- */
  R('ratings', {id:'M5', title:'Customer ratings', roles:['manager','vina'], states:[['empty','No ratings yet'],['loading','Loading'],['error','Could not load']], after: fitDraw, render() {
    const tb = toolbar(['ch','model','src'], 'Customer ratings');
    const sb = stateBody('ratings'); if (sb) return shell({nav:'ratings', title:'Customer ratings', body: tb + sb});
    if (S.st === 'empty') return shell({nav:'ratings', title:'Customer ratings', body: tb + `<div class="card">${empty('star', 'No ratings yet', 'When a chat closes, VINA asks the customer for 1 to 5 stars. Their ratings and comments show here.')}</div>`});
    const k = K(), ST = STARS.map(([st, n]) => [st, sc(n, k)]), tot = ST.reduce((a, x) => a + x[1], 0);
    const vals = trend([4.5, 4.6, 4.5, 4.7, 4.6, 4.6, 4.6], true), prev = prevOf(vals, .1, true);
    const over = reportCard({title:'Rating over time', right: legend([['Average rating', '--ch-a'], ['Previous period', '', null, true]]),
      body:`<div class="mg-avg">${mic('Customer rating', 17)}<span class="mg-big" ${countAttr('4.6')}>4.6</span><div class="col" style="gap:4px"><span class="row tight">${stars(4.6, 16)}${delta('+0.1')}</span><span class="small mute">out of 5 · <b style="color:var(--text)">${num(tot)}</b> customers rated · <span class="green b">${Math.round((ST[0][1] + ST[1][1]) / Math.max(1, tot) * 100)}%</span> gave 4 or 5</span></div></div>
      ${lines(AX(), [{name:'Average rating', c:'--ch-a', vals}, {name:'Previous period', c:'--faint', vals:prev, dash:true}], {h:220, min:3.8, max:5, fmt: v => v.toFixed(1), label:'Average rating for ' + rangeShort() + ', steady around 4.6.'})}`});
    const brk = reportCard({title:'Stars given', right:`<span class="mg-tot">${num(tot)}</span>`, body: starRows(ST, tot)});
    const axis = `<div class="mg-cmp mg-axis" aria-hidden="true"><span></span><div><span>4.0</span><span>4.5</span><span>5.0</span></div><span></span></div>`;
    const cmp = rows => `<div class="col" style="gap:0">${rows.map(([n, v, col]) => `<div class="mg-cmp"><b>${n}</b><div class="mg-lol" aria-hidden="true"><i class="grow-x" style="width:${((v - 4) * 100).toFixed(0)}%;background:var(${col || '--ch-a'})"></i></div><b class="num" style="text-align:end">${v.toFixed(1)}</b></div>`).join('')}${axis}</div>`;
    const byWho = reportCard({title:'By who handled the chat', link:['View conversations', 'conversations'], body: cmp([['VINA alone', 4.6, '--ch-b'], ['Call centre', 4.7, '--ch-a'], ['Sales', 4.5, '--ch-c']])});
    const byCh = reportCard({title:'By channel', link:['View channels', 'channels'], body: cmp([['WhatsApp', 4.6], ['Website chat', 4.5], ['Phone line', 4.4]])});
    const low = LEADS.filter(l => l.rating && l.rating <= 2 && l.ratingNote);
    const lowCard = reportCard({title:'Latest low ratings', sub:'1 or 2 stars, with the customer\'s comment', right:`<span class="pill c-red">${sc(16, k)}</span>`, link:['View all low ratings', 'conversations'],
      body: low.map(l => `<button type="button" class="mg-lr" data-a="m5-open" data-x="${l.id}">${stars(l.rating, 13)}<span class="mg-qt">“${esc(l.ratingNote)}”</span><span class="xs mute">${esc(l.name)} · ${esc(l.handled)}${l.owner && U[l.owner] ? ' · ' + esc(first(l.owner)) : ''} · ${esc(l.ratedAt || '')}</span></button>`).join('')}).replace('<a href="#conversations">', '<a href="#conversations" data-a="m5-low">');
    return shell({nav:'ratings', title:'Customer ratings', body:`${tb}<div class="mg-r21">${over}${brk}</div><div class="mg-r3">${byWho}${byCh}${lowCard}</div>`});
  }});
  A['m5-open'] = el => { S.f.m3sel = el.dataset.x; Object.assign(M3(), {folder:'low', ch:'all', st:'all', hb:'all', date:'all', rated:false, low:false, q:'', open:true}); go('conversations'); return false; };
  A['m5-low'] = () => { S.f.m3sel = null; Object.assign(M3(), {folder:'low', ch:'all', st:'all', hb:'all', date:'all', rated:false, low:false, q:'', open:false}); };
})();
