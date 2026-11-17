/* M1–M5 · Manager dashboard (view only): overview, channels, conversations, call centre and sales, customer ratings */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  .mg-filters{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px}
  .mg-filters select.inp{width:auto;min-width:0;font-size:13px;padding-inline-start:12px}
  .mg-filters input[type=date]{width:auto;font-size:13px}
  .mg-filters .btn{min-height:40px}
  .mg-top{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:24px;align-items:stretch}
  .mg-hero{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
  .mg-hero .kpi .spark{margin-top:auto;height:38px}
  .mg-minis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}
  .mg-g2{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:24px}
  .mg-g21{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:24px}
  .mg-wl{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:9px 12px;margin:0 -12px;border-radius:12px;text-decoration:none;color:var(--text);min-height:64px;transition:background var(--d1) var(--ease)}
  .mg-wl:hover{background:var(--sub)}
  .mg-wl .nm{font-weight:600;display:block}
  .mg-wl .meta{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:13px;color:var(--mute);min-width:0}
  .mg-wl .meta .chip{height:22px;font-size:12px;padding:0 8px}
  .mg-wl .w{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-variant-numeric:tabular-nums;font-size:14px;white-space:nowrap}
  .mg-hrow{display:grid;grid-template-columns:minmax(120px,160px) 1fr 64px;gap:16px;align-items:center;font-size:14px;min-height:38px}
  .mg-hrow .n{text-align:end;font-weight:600;font-variant-numeric:tabular-nums}
  .mg-split{display:flex;height:14px;border-radius:999px;overflow:hidden;gap:3px}
  .mg-split i{display:block;height:100%}
  .mg-bigstat{font-family:var(--f-display);font-size:26px;line-height:32px;font-weight:700;font-variant-numeric:tabular-nums}
  /* charts: HTML bars and an SVG line layer, so labels stay readable at any width */
  .mg-plot{margin:0;display:flex;flex-direction:column;gap:8px}
  .mg-area{position:relative;height:var(--ph,200px);margin-inline-start:38px}
  .mg-area.ln,.mg-xl.abs{margin-inline-end:18px}
  .mg-gl{position:absolute;left:0;right:0;height:0;border-top:1px solid color-mix(in srgb,var(--line) 75%,transparent)}
  .mg-gl.z{border-top-color:var(--line2)}
  .mg-gl span{position:absolute;right:calc(100% + 8px);top:-8px;font-size:12px;line-height:16px;color:var(--faint);font-variant-numeric:tabular-nums;white-space:nowrap}
  .mg-cols{position:absolute;inset:0;display:flex}
  .mg-c{position:relative;flex:1;display:flex;align-items:flex-end;justify-content:center;min-width:0}
  .mg-c.sh{background:color-mix(in srgb,var(--sel) 80%,transparent)}
  .mg-st{width:62%;max-width:44px;display:flex;flex-direction:column-reverse;gap:2px;border-radius:5px 5px 2px 2px;overflow:hidden}
  .mg-st>i{display:block;min-height:1px}
  .mg-tt{position:absolute;left:-6px;right:-6px;text-align:center;margin-bottom:5px;font-size:12px;font-weight:600;color:var(--mute);font-variant-numeric:tabular-nums}
  .mg-tt.on{color:var(--text);font-weight:700}
  .mg-xl{display:flex;margin-inline-start:38px;height:18px;font-size:12px;line-height:18px;color:var(--faint)}
  .mg-xl span{flex:1;min-width:0;display:flex;justify-content:center;white-space:nowrap}
  .mg-xl span.on{color:var(--text);font-weight:700}
  .mg-xl.abs{position:relative}
  .mg-xl.abs span{position:absolute;top:0;transform:translateX(-50%)}
  .mg-ln{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .mg-dot{position:absolute;width:10px;height:10px;border-radius:50%;background:var(--c);box-shadow:0 0 0 3px var(--card);transform:translate(-50%,50%)}
  .mg-endv{position:absolute;right:0;transform:translate(50%,-12px);font-family:var(--f-display);font-size:13px;font-weight:700;color:var(--text);white-space:nowrap}
  .mg-lg b{color:var(--text);font-weight:600;margin-inline-start:4px;font-variant-numeric:tabular-nums}
  /* M2 */
  .mg-ch{display:flex;flex-direction:column;gap:18px;text-decoration:none;color:inherit}
  .mg-ch.warn{background:linear-gradient(180deg,var(--amber-b),var(--card) 160%);box-shadow:var(--e1),inset 0 0 0 1px color-mix(in srgb,var(--amber-f) 30%,transparent)}
  .mg-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 16px;align-items:start}
  .mg-chg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
  .mg-stats>div{display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:2px}
  .mg-stats .k{font-size:13px;line-height:18px;color:var(--mute)}
  .mg-stats .v{font-family:var(--f-display);font-size:24px;line-height:30px;font-weight:700;font-variant-numeric:tabular-nums}
  .mg-live{display:inline-flex;align-items:center;gap:8px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
  .mg-go{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:var(--link)}
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
  .mg-ppl{display:flex;flex-wrap:wrap;gap:24px 48px}
  .mg-hl>.kpi{flex:1;justify-content:center}
  .mg-person{display:flex;flex-direction:column;align-items:center;gap:4px;width:80px;text-align:center;min-width:0}
  .mg-person .avw{margin-bottom:5px}
  .mg-person .avw .pres{width:14px;height:14px;border-width:3px}
  .mg-person.off .av{opacity:.45}
  .mg-person b{max-width:100%}
  .mg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .mg-three>div{background:var(--sub);border-radius:var(--r-m);padding:18px 20px;display:flex;flex-direction:column;gap:4px;min-width:0}
  .mg-three .v{font-family:var(--f-display);font-size:30px;line-height:36px;font-weight:700;font-variant-numeric:tabular-nums}
  .mg-three .k{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--mute);font-weight:500}
  .mg-three .hot{background:var(--red-b)} .mg-three .hot .v,.mg-three .hot .k{color:var(--red-f)}
  .mg-fun{display:grid;grid-template-columns:minmax(160px,250px) minmax(0,1fr) 64px 124px;grid-template-areas:"l t c p";gap:6px 20px;align-items:center;min-height:54px}
  .mg-fl{grid-area:l;display:flex;flex-direction:column;min-width:0} .mg-ft{grid-area:t} .mg-fc{grid-area:c} .mg-fp{grid-area:p}
  .mg-ft{display:flex;justify-content:center;height:30px}
  .mg-ft i{display:block;height:100%;border-radius:7px;transform-origin:center!important}
  .mg-fc{text-align:end;font-family:var(--f-display);font-weight:700;font-size:16px;font-variant-numeric:tabular-nums}
  .mg-fp{text-align:end;font-size:14px;color:var(--mute);font-weight:600;font-variant-numeric:tabular-nums}
  .mg-fun.hd{min-height:28px;white-space:nowrap;font-size:13px;font-weight:600;color:var(--mute)}
  .mg-fun.hd .mg-ft{height:0}
  .mg-fun.hd .nr{display:none}
  .mg-fun+.mg-fun:not(.hd){border-top:1px solid color-mix(in srgb,var(--line) 70%,transparent)}
  .mg-vname{font-family:var(--f-display);font-size:19px;line-height:26px;font-weight:700}
  .mg-tbl .tbl td,.mg-tbl .tbl th{white-space:nowrap}
  .mg-tbl .tbl th:first-child,.mg-tbl .tbl td:first-child{padding-inline-start:20px}
  .mg-tbl .tbl th:last-child,.mg-tbl .tbl td:last-child{padding-inline-end:20px}
  .mg-tbl tr.tot td{background:var(--sub);font-weight:700;border-top:1px solid var(--line2)}
  .mg-tbl .pc{display:inline-block;min-width:38px;color:var(--mute);font-weight:500}
  /* M5 */
  .mg-r5{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:20px 40px;align-items:center}
  .mg-avg{display:flex;flex-direction:column;gap:8px}
  .mg-big{font-family:var(--f-display);font-size:60px;line-height:62px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
  .mg-br{display:grid;grid-template-columns:70px minmax(0,1fr) 48px 44px;gap:14px;align-items:center;min-height:36px;font-size:14px}
  .mg-br .bar-h{height:12px}
  .mg-cmp{display:grid;grid-template-columns:minmax(120px,190px) minmax(0,1fr) 34px;gap:16px;align-items:center;min-height:48px}
  .mg-lol{height:14px;display:flex;align-items:center;background:linear-gradient(var(--line),var(--line)) center/100% 2px no-repeat}
  .mg-lol i{position:relative;display:block;height:4px;border-radius:2px}
  .mg-lol i::after{content:"";position:absolute;right:-6px;top:-4px;width:12px;height:12px;border-radius:50%;background:inherit;box-shadow:0 0 0 3px var(--card)}
  .mg-axis{min-height:18px;font-size:12px;color:var(--faint)}
  .mg-axis div{display:flex;justify-content:space-between}
  .mg-q{display:flex;flex-direction:column;align-items:flex-start;gap:12px;text-align:start;font:inherit;color:inherit;cursor:pointer;width:100%}
  .mg-qt{font-family:var(--f-display);font-size:17px;line-height:25px;font-weight:600;letter-spacing:-.01em;text-wrap:pretty}
  .mg-qa{margin-top:auto;display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:var(--link)}
  @media (max-width:1180px){
    .mg-top,.mg-g2,.mg-g21{grid-template-columns:minmax(0,1fr)}
    .mg-hero{grid-template-columns:repeat(4,minmax(0,1fr))}
    .mg-m3{grid-template-columns:300px minmax(0,1fr)}
  }
  @media (max-width:1180px){.mg-chg{grid-template-columns:minmax(0,1fr)}.mg-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
  @media (max-width:760px){
    .mg-hero{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .mg-hero .kpi.hero{padding:16px}
    .mg-hero .kpi .spark{margin-top:auto;height:38px}
  .mg-minis{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .mg-minis>:last-child:nth-child(odd){grid-column:1/-1}
    .mg-filters{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-inline:calc(-1 * max(16px,env(safe-area-inset-left,0px)));padding:2px max(16px,env(safe-area-inset-left,0px)) 6px;scroll-snap-type:x proximity}
    .mg-filters::-webkit-scrollbar{display:none}
    .mg-filters>*{flex:0 0 auto;scroll-snap-align:start}
    .mg-filters .sp{display:none}
    .mg-filters .seg button{justify-content:center;padding:0 10px;white-space:nowrap}
    .mg-area{height:min(var(--ph),230px)}
    .mg-wl .meta{flex-wrap:wrap;row-gap:2px} .mg-wl .meta .ell{white-space:normal}
    .mg-filters select.inp{flex:0 0 auto;width:auto}
    .mg-m3{grid-template-columns:minmax(0,1fr);height:calc(100vh - 118px);min-height:480px}
    .mg-m3>.mg-list{border-inline-end:0}
    .mg-m3[data-open="1"] .mg-list,.mg-m3:not([data-open="1"]) .mg-chatp,.mg-m3:not([data-open="1"]) .cx-dp{display:none}
    .mg-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
    .mg-hrow{grid-template-columns:100px 1fr 50px}
    .mg-fun{grid-template-columns:minmax(0,1fr) 60px 52px;grid-template-areas:"l c p" "t t t"}
    .mg-fun.hd .mg-ft{display:none}
    .mg-fun.hd .wd{display:none} .mg-fun.hd .nr{display:inline}
    .mg-ft{height:22px}
    .mg-fun:not(.hd){padding:8px 0}
    .mg-three .v{font-size:24px;line-height:30px}
    .mg-three>div{padding:12px}
    .mg-r5{grid-template-columns:minmax(0,1fr)}
    .mg-big{font-size:48px;line-height:52px}
    .mg-cmp{grid-template-columns:minmax(0,1fr) 34px;grid-template-areas:"n v" "b b";gap:6px 12px}
    .mg-cmp>:first-child{grid-area:n} .mg-cmp>.mg-lol,.mg-cmp.mg-axis>div{grid-area:b} .mg-cmp>:last-child{grid-area:v}
    .mg-cmp.mg-axis>:first-child,.mg-cmp.mg-axis>:last-child{display:none}
    .mg-person{width:72px}
  }
  </style>`);

  /* ---------- filters and scale ---------- */
  const F = () => S.f.mg || (S.f.mg = {date:'7', ch:'all', model:'all', src:'all', from:'2026-11-01', to:'2026-11-07'});
  const days = () => { const d = F().date; if (d === '1') return 1; if (d === '30') return 30; if (d === 'c') { const n = Math.round((new Date(F().to) - new Date(F().from)) / 864e5) + 1; return Math.min(90, Math.max(1, n || 7)); } return 7; };
  const DK = () => days() === 1 ? 0.148 : days() / 7;
  const CHK = {all:1, wa:.73, web:.2, ph:.07};
  const MK = {all:1, 'V27 2027':.52, '03T 2026':.27, 'V27 2026':.21};
  const SK = {all:1, 'Meta ad':.54, 'Snapchat ad':.21, 'Google':.06, 'Website':.15, 'Walk-in':.04};
  const K = () => DK() * CHK[F().ch] * MK[F().model] * SK[F().src]; // ponytail: flat multipliers stand in for real filtered queries
  const sc = (n, k) => Math.round(n * (k == null ? K() : k));
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtD = d => d.getDate() + ' ' + MON[d.getMonth()];
  const rangeLabel = () => { const d = F().date; if (d === '1') return 'Today, Sat 7 Nov 2026'; if (d === 'c') return fmtD(new Date(F().from)) + ' to ' + fmtD(new Date(F().to)) + ' 2026'; const s = new Date(2026, 10, 7 - days() + 1); return fmtD(s) + ' to 7 Nov 2026'; };
  const dateSeg = (opts) => `<div class="seg" role="group" aria-label="Date range">${(opts || [['1','Today'],['7','Last 7 days'],['30','Last 30 days'],['c','Custom']]).map(([k, t]) => `<button type="button" data-a="mg-date" data-x="${k}" aria-pressed="${F().date === k}">${t}</button>`).join('')}</div>
    ${F().date === 'c' ? `<label class="sr" for="b-f-mg-from">From</label><input type="date" class="inp" min="2026-08-01" max="2026-11-07" ${bind('f.mg.from', true)}><span class="mute small">to</span><label class="sr" for="b-f-mg-to">To</label><input type="date" class="inp" min="2026-08-01" max="2026-11-07" ${bind('f.mg.to', true)}>` : ''}`;
  A['mg-date'] = (el) => { F().date = el.dataset.x; };
  A['mg-retry'] = () => { S.st = ''; S._enter = true; };
  A['mg-csv'] = () => { toast('Leads CSV for ' + rangeLabel() + ' is ready, ' + num(sc(612)) + ' rows. Downloads are switched off in this prototype.'); };
  const skel = h => `<div class="skel" style="height:${h}px"></div>`;
  const stateBody = (kind) => S.st === 'loading' ? `<div class="col" aria-busy="true" aria-label="Loading" style="gap:16px">${skel(30).replace('style="', 'style="max-width:560px;')}<div class="g4">${skel(150).repeat(4)}</div><div class="g2">${skel(300).repeat(2)}</div></div>`
    : S.st === 'error' ? errorBox('We could not load the ' + kind, 'The numbers did not arrive. Check your connection and try again. Your data is safe.', 'mg-retry') : '';
  const cardH = (t, sub, right) => `<div class="card-h"><div class="grow" style="flex:1 1 230px"><h2>${t}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right || ''}</div>`;

  /* ---------- charts: one scale, token colours, faint grid ---------- */
  const nice = v => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => m <= x) * p; };
  const grid = (min, max, fmt) => [0, 1, 2, 3, 4].map(i => `<div class="mg-gl ${i ? '' : 'z'}" style="bottom:${i * 25}%"><span>${fmt(min + (max - min) * i / 4)}</span></div>`).join('');
  const colour = (c, i) => typeof c === 'function' ? c(i) : c;
  // o: {h, max, fmt, totals, shade:[from,to], every, hi (index to emphasise), label}
  function vbars(labels, series, o) {
    o = o || {}; const n = labels.length, fmt = o.fmt || (v => num(Math.round(v)));
    const tot = labels.map((_, i) => series.reduce((s, se) => s + se.vals[i], 0));
    const max = o.max || nice(Math.max(1, ...tot)), every = o.every || Math.ceil(n / 7), hi = o.hi == null ? -1 : o.hi;
    const pc = v => Math.max(0, Math.min(100, v / max * 100));
    const cols = labels.map((lb, i) => `<div class="mg-c ${o.shade && i >= o.shade[0] && i < o.shade[1] ? 'sh' : ''}"><div class="mg-st grow-y" style="height:${pc(tot[i]).toFixed(1)}%">${series.map(se => se.vals[i] > 0 ? `<i style="flex:${se.vals[i]} 0 0;background:var(${colour(se.c, i)})" title="${esc(lb)} · ${esc(se.name)}: ${fmt(se.vals[i])}"></i>` : '').join('')}</div>${o.totals ? `<b class="mg-tt ${i === hi ? 'on' : ''}" style="bottom:${pc(tot[i]).toFixed(1)}%">${fmt(tot[i])}</b>` : ''}</div>`).join('');
    const xl = labels.map((lb, i) => `<span class="${i === hi ? 'on' : ''}">${i % every === 0 || (i === n - 1 && n <= 8) ? esc(lb) : ''}</span>`).join('');
    return `<figure class="mg-plot" role="img" aria-label="${esc(o.label || '')}"><div class="mg-area" style="--ph:${o.h || 200}px">${grid(0, max, fmt)}<div class="mg-cols">${cols}</div></div><div class="mg-xl">${xl}</div></figure>`;
  }
  // o: {h, min, max, fmt, area, endLabel, label}
  function lines(labels, series, o) {
    o = o || {}; const n = labels.length, W = 600, H = 200, fmt = o.fmt || (v => num(Math.round(v)));
    const min = o.min || 0, max = o.max || nice(Math.max(1, ...series.flatMap(s => s.vals)));
    const X = i => n === 1 ? W / 2 : i / (n - 1) * W, Y = v => H - (v - min) / (max - min) * H, pc = v => (v - min) / (max - min) * 100;
    const paths = series.map(s => {
      const pts = s.vals.map((v, i) => [X(i).toFixed(1), Y(v).toFixed(1)]), d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join('');
      return (o.area ? `<path class="fade-in" d="${d}L${W} ${H}L0 ${H}Z" style="fill:var(${s.c});opacity:.1"/>` : '') + `<path class="draw" data-p="${pts.map(p => p.join(',')).join(' ')}" d="${d}" fill="none" style="stroke:var(${s.c})" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join('');
    const ends = series.map(s => { const v = s.vals[s.vals.length - 1]; return `<span class="mg-dot fade-in" style="left:100%;bottom:${pc(v).toFixed(1)}%;--c:var(${s.c})" title="${esc(s.name)}: ${fmt(v)}"></span>${o.endLabel ? `<b class="mg-endv fade-in" style="bottom:${pc(v).toFixed(1)}%">${fmt(v)}</b>` : ''}`; }).join('');
    const every = Math.ceil(n / 7);
    const xl = labels.map((lb, i) => i % every === 0 || i === n - 1 ? `<span style="left:${(n === 1 ? 50 : i / (n - 1) * 100).toFixed(2)}%;${i === 0 && n > 1 ? 'transform:none' : i === n - 1 && n > 1 ? 'transform:translateX(-100%)' : ''}" class="${i === n - 1 ? 'on' : ''}">${esc(lb)}</span>` : '').join('');
    return `<figure class="mg-plot" role="img" aria-label="${esc(o.label || '')}"><div class="mg-area ln" style="--ph:${o.h || 200}px">${grid(min, max, fmt)}<svg class="mg-ln" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>${ends}</div><div class="mg-xl abs">${xl}</div></figure>`;
  }
  // The line SVG stretches to its box, so the draw length is measured on screen after layout (never shorter than the real line).
  const fitDraw = () => $$('svg.mg-ln').forEach(s => { const r = s.getBoundingClientRect(), vb = s.viewBox.baseVal, sx = r.width / vb.width, sy = r.height / vb.height; s.querySelectorAll('path[data-p]').forEach(p => { const P = p.dataset.p.split(' ').map(q => q.split(',').map(Number)); let a = 0, b = 0; for (let i = 1; i < P.length; i++) { const dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1]; a += Math.hypot(dx * sx, dy * sy); b += Math.hypot(dx, dy); } p.style.setProperty('--len', Math.ceil(Math.max(a, b)) + 4); }); });
  const legend = items => `<div class="legend mg-lg">${items.map(([t, c, v]) => `<span><i style="background:var(${c})"></i>${esc(t)}${v != null ? `<b>${esc(v)}</b>` : ''}</span>`).join('')}</div>`;
  const hrow = (label, n, max, c, extra) => `<div class="mg-hrow"><span class="ell">${label}</span><div class="bar-h" aria-hidden="true"><i style="width:${Math.max(2, Math.round(n / Math.max(1, max) * 100))}%;background:var(${c})"></i></div><span class="n">${extra || num(n)}</span></div>`;
  // daily series: the canvas's 7 days, stretched deterministically for longer ranges
  function daySeries(base) {
    const n = days(); if (n === 7) return {labels:['Sun 1','Mon 2','Tue 3','Wed 4','Thu 5','Fri 6','Sat 7'], vals: base.slice()};
    return {labels: Array.from({length:n}, (_, i) => fmtD(new Date(2026, 10, 7 - n + 1 + i))), vals: Array.from({length:n}, (_, i) => Math.round(base[(i + 7 - n % 7) % 7] * (0.86 + ((i * 37) % 23) / 100)))};
  }

  /* ---------- who is waiting ---------- */
  const waiting = () => LEADS.filter(l => l.owner !== 'vina' && !['sold','lost'].includes(l.status) && l.wait != null && l.wait < 1440 && (l.unread || !l.owner || l.late)).sort((a, b) => b.wait - a.wait);

  /* ---------- M1 Overview ---------- */
  const HRS = [30,18,10,6,4,5,8,14,22,34,42,46,44,48,52,50,54,58,62,66,72,76,64,46];
  const HL = h => (h % 12 || 12) + (h < 12 ? ' AM' : ' PM');
  R('overview', {id:'M1', title:'Overview', roles:['manager','vina'], states:[['first','First day, no data yet'],['loading','Loading'],['error','Could not load']], render() {
    const f = F(), fd = S.st === 'first';
    const w = waiting(), un = unassigned().length;
    const filters = `<div class="mg-filters">${dateSeg()}
      <label class="sr" for="b-f-mg-ch">Channel</label>${bindSel('f.mg.ch', [['all','All channels'],['wa','WhatsApp'],['web','Website chat'],['ph','Phone line']])}
      <label class="sr" for="b-f-mg-model">Car model</label>${bindSel('f.mg.model', [['all','All car models']].concat(MODELS.map(m => [m, m])))}
      <label class="sr" for="b-f-mg-src">Ad source</label>${bindSel('f.mg.src', [['all','All ad sources'],['Meta ad','Meta ads'],['Snapchat ad','Snapchat ads'],['Google','Google'],['Website','Website, no ad'],['Walk-in','Walk-in']])}
      <span class="sp"></span><span class="xs mute">${esc(rangeLabel())}</span>${fresh('Updated 2 min ago')}
      <button type="button" class="ibtn" data-a="mg-csv" aria-label="Download CSV" title="Download CSV">${ic('download', 18)}</button></div>`;
    const alonePct = ({all:78, wa:79, web:81, ph:64})[f.ch];
    const sb = stateBody('overview'); if (sb) return shell({nav:'overview', title:'Overview', body: filters + sb});
    const emptyBox = (t) => `<div class="empty" style="padding:28px 16px">${ic('overview', 28)}<p>${t}</p></div>`;
    const later = 'Appears after the first chats';
    const H = (o) => kpi(Object.assign({hero:true}, o, fd ? {v:'—', d:'', n:later, spark:null} : {}));
    const hero = `<section class="mg-hero" aria-label="Key numbers">
      ${H({k:'Waiting for the team now', v:String(w.length), hot:w.length > 0, n: w[0] ? `Longest <b>${mins(w[0].wait)}</b>` : 'Nobody waiting', spark:[6, 8, 5, 9, 7, 12, w.length]})}
      ${H({k:'Answered by VINA alone', v:alonePct + '%', d:'+3 pts', spark:[74, 75, 77, 76, 78, 79, alonePct]})}
      ${H({k:'Qualified leads', v:num(sc(612)), d:'+8%', spark:[78, 84, 88, 90, 92, 95, 85]})}
      ${H({k:'Sold', v:num(sc(9)), d:'+2', spark:[0, 1, 2, 1, 2, 1, 2]})}</section>`;
    const M = (k, v, d, dc) => kpi(fd ? {k, v:'—', mini:true} : {k, v, d, dc, mini:true});
    const minis = `<section class="mg-minis" aria-label="More numbers">${M('Conversations', num(sc(2436)), '+12%', 'green')}${M('Customers who replied', num(sc(1987)), '+9%', 'green')}${M('Test drive requests', num(sc(48)), '+6', 'green')}${M('Not interested', num(sc(131)), '−4%', 'green')}${M('Customer rating', '4.6', '+0.1', 'green')}</section>`;
    const wl = `<section class="card" aria-label="Waiting the longest">${cardH('Waiting the longest', '', un ? `<a class="btn sm ghost" href="#unassigned">${un} not given to anyone${ic('arrowR', 14)}</a>` : '')}
      ${fd || !w.length ? emptyBox('Nobody is waiting. Customers waiting for a person show here, longest first.') : `<div class="col" style="gap:2px">${w.slice(0, 5).map(l => `<a class="mg-wl" href="#lead-${l.id}">${av(l.name)}<span style="min-width:0"><span class="nm ell">${esc(l.name)}</span><span class="meta">${chip(l.status)}<span class="ell">${l.owner ? 'Assigned to ' + esc(uname(l.owner)) : '<span class="red b">Not given to anyone</span>'}</span></span></span><span class="w ${l.late ? 'red' : 'amber'}">${ic('clock', 15)}${mins(l.wait)}</span></a>`).join('')}</div>`}</section>`;
    // conversations per day (or hour for Today)
    const isToday = f.date === '1';
    const dv = isToday ? {labels: HRS.map((_, i) => HL(i)), vals: HRS.map(v => Math.round(v * 3.9))} : daySeries([298, 312, 342, 356, 372, 389, 367]);
    const handed = dv.vals.map((v, i) => Math.round(v * (0.2 + ((i * 7) % 5) / 100) * CHK[f.ch] * MK[f.model] * SK[f.src]));
    const alone = dv.vals.map((v, i) => Math.round(v * CHK[f.ch] * MK[f.model] * SK[f.src]) - handed[i]);
    const busiest = dv.vals.indexOf(Math.max(...dv.vals));
    const perDay = `<section class="card" aria-label="Conversations per ${isToday ? 'hour' : 'day'}">${cardH('Conversations per ' + (isToday ? 'hour, today' : 'day'), '', legend([['VINA alone','--ch-b'],['Handed to the team','--ch-a']]))}
      ${fd ? emptyBox('Conversations per day will show here, split into VINA alone and handed to the team.') : vbars(dv.labels, [{name:'VINA alone', c:'--ch-b', vals:alone}, {name:'Handed to the team', c:'--ch-a', vals:handed}], {totals: dv.vals.length <= 8, hi: busiest, h:210, label:'Conversations per ' + (isToday ? 'hour' : 'day') + '. Busiest: ' + dv.labels[busiest] + '.'})}
      ${fd || isToday ? '' : `<div class="note vina" style="margin-top:14px">${ic('spark')}<span><b>${esc(dv.labels[busiest])} was the busiest day.</b> VINA answered ${num(alone[busiest])} of ${num(alone[busiest] + handed[busiest])} chats on its own.</span></div>`}</section>`;
    const SB = [['new',186],['qualified',74],['callback',41],['contacted',132],['testdrive',48],['offer',22],['sold',9],['lost',100]].map(([s, n]) => [s, sc(n)]);
    const smax = Math.max(1, ...SB.map(x => x[1]));
    const status = `<section class="card" aria-label="Leads by status">${cardH('Leads by status', '', `<span class="mg-bigstat">${num(SB.reduce((a, x) => a + x[1], 0))}</span>`)}
      ${fd ? emptyBox('Each lead status will show here with its count.') : `<div class="col tight">${SB.map(([s, n]) => `<div class="mg-hrow"><span>${chip(s)}</span><div class="bar-h" aria-hidden="true"><i style="width:${Math.max(2, Math.round(n / smax * 100))}%;background:var(--${STATUS[s].c}-f)"></i></div><span class="n">${num(n)}</span></div>`).join('')}</div>`}</section>`;
    const MD = [['V27 2027',318],['03T 2026',165],['V27 2026',129]].filter(([m]) => f.model === 'all' || f.model === m).map(([m, n]) => [m, Math.round(n * DK() * CHK[f.ch] * SK[f.src])]);
    const mt = MD.reduce((a, x) => a + x[1], 0) || 1;
    const models = `<section class="card" aria-label="Car model interest">${cardH('Car model interest')}${fd ? emptyBox('The car models customers ask about will show here.') : `<div class="col">${MD.map(([m, n], i) => `<div class="col tight"><div class="row"><span class="grow b">${m}</span><span class="num"><b>${num(n)}</b> <span class="mute">${Math.round(n / mt * 100)}%</span></span></div><div class="bar-h"><i style="width:${Math.round(n / mt * 100)}%;background:var(${i ? '--ch-d' : '--ch-a'})"></i></div></div>`).join('')}</div>`}</section>`;
        const lang = `<section class="card" aria-label="Arabic vs English">${cardH('Arabic vs English')}${fd ? emptyBox('The split between Arabic and English chats will show here.') : `<div class="mg-split grow-x" role="img" aria-label="71% Arabic, 29% English"><i style="width:71%;background:var(--ch-c)"></i><i style="width:29%;background:var(--ch-b)"></i></div>
      <div class="g2" style="grid-template-columns:1fr 1fr;gap:12px;margin-top:16px"><div><div class="small mute"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--ch-c);margin-inline-end:6px"></i>Arabic</div><div class="mg-bigstat">71%</div></div><div><div class="small mute"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--ch-b);margin-inline-end:6px"></i>English</div><div class="mg-bigstat">29%</div></div></div>`}</section>`;
    const hv = HRS.map(v => Math.round(v * 3.9 * DK() * CHK[f.ch] * MK[f.model] * SK[f.src]));
    const out = HRS.reduce((a, v, i) => a + (i < 9 || i >= 22 ? v : 0), 0) / HRS.reduce((a, v) => a + v, 0);
    const hours = `<section class="card" aria-label="When customers message">${cardH('When customers message', '', fd ? '' : `<div style="text-align:end"><div class="mg-bigstat teal">${Math.round(out * 100)}%</div><div class="small mute">while closed</div></div>`)}
      ${fd ? emptyBox('Messages by hour will show here, with showroom hours shaded.') : vbars(HRS.map((_, i) => HL(i)), [{name:'Messages', c: i => i >= 9 && i < 22 ? '--ch-a' : '--ch-b', vals:hv}], {h:190, shade:[9, 22], every:4, label:'Messages by hour. Low overnight, rising through the day, peaking at 9 PM.'})}
      ${fd ? '' : `<div style="margin-top:12px">${legend([['Showroom open, 9 AM to 10 PM','--ch-a'],['Closed, VINA answers','--ch-b']])}</div>`}</section>`;
    return shell({nav:'overview', title:'Overview', body:`${filters}<div class="mg-top">${hero}${wl}</div>${minis}<div class="mg-g2">${perDay}${status}</div><div class="mg-g21">${hours}<div class="col" style="gap:24px">${models}${lang}</div></div>`});
  }});

  /* ---------- M2 Channels ---------- */
  const CHN = [
    {k:'wa', name:'WhatsApp', d:'+966 92 003 5976', conv:1790, leads:476, alone:'79%', r:'4.6', c:'--ch-b', v:[218,231,252,263,274,285,267]},
    {k:'web', name:'Website chat', d:'icaur-alghanim.sa', conv:482, leads:98, alone:'81%', r:'4.5', c:'--ch-a', v:[60,64,68,70,72,76,72]},
    {k:'ph', name:'Phone line', d:'012 600 0101', conv:164, leads:38, alone:'64%', r:'4.4', c:'--ch-c', v:[20,18,22,24,26,28,26]},
  ];
  const chProb = c => c.k === 'wa' && S.whatsappDown ? 'WhatsApp is disconnected. Customers are not getting replies.' : c.problem;
  R('channels', {id:'M2', title:'Channels', roles:['manager','vina'], states:[['loading','Loading'],['error','Could not load']], after: fitDraw, render() {
    const filters = `<div class="mg-filters">${dateSeg()}<span class="sp"></span><span class="xs mute">${rangeLabel()}</span>${fresh('Updated 2 min ago')}</div>`;
    const sb = stateBody('channel numbers'); if (sb) return shell({nav:'channels', title:'Channels', body: filters + sb});
    const k = DK();
    const cards = CHN.map(c => {
      const prob = chProb(c);
      return `<a class="card lift mg-ch ${prob ? 'warn' : ''}" href="#conversations" data-a="m2-open" data-x="${c.k}" aria-label="${c.name}, ${prob ? 'needs attention' : 'live'}. See its conversations"><div class="row nowrap">${chIc(c.k, true)}<div class="grow"><h2 class="h2">${c.name}</h2><div class="xs mute ell">${esc(c.d)}</div></div>${prob ? `<span class="mg-live c-amber">${pulse()}Needs attention</span>` : `<span class="mg-live c-green">${pulse('green')}Live</span>`}</div>
        <div class="mg-stats"><div><div class="k mk">${mic('Conversations', 13)}Conversations</div><div class="v" ${countAttr(num(sc(c.conv, k)))}>${num(sc(c.conv, k))}</div></div><div><div class="k mk">${mic('Leads', 13)}Leads</div><div class="v">${num(sc(c.leads, k))}</div></div><div><div class="k mk">${mic('Answered by VINA alone', 13)}Answered by VINA alone</div><div class="v">${c.alone}</div></div><div><div class="k mk">${mic('Customer rating', 13)}Customer rating</div><div class="v">${c.r}</div></div></div>
        ${prob ? `<div class="note warn">${ic('alert')}<span>${prob} <b>The VINA team has been told.</b></span></div>` : ''}<span class="mg-go">See conversations${ic('arrowR', 14)}</span></a>`;
    }).join('');
    const today = F().date === '1', D7 = ['Sun 1','Mon 2','Tue 3','Wed 4','Thu 5','Fri 6','Sat 7'];
    const ds = CHN.map(c => ({name:c.name, c:c.c, vals: today ? c.v : daySeries(c.v).vals}));
    const labels = today ? D7 : daySeries(CHN[0].v).labels;
    const SR = [['Meta ads',330],['Snapchat ads',129],['Website, no ad',92],['Google ads',38],['Walk-in and other',23]].map(([n, v]) => [n, sc(v, k)]);
    const tot = SR.reduce((a, x) => a + x[1], 0);
    return shell({nav:'channels', title:'Channels', body:`${filters}<div class="mg-chg">${cards}</div>
      <div class="mg-g2"><section class="card" aria-label="Conversations per day, by channel">${cardH('Conversations per day, by channel')}${lines(labels, ds, {h:220, label:'Conversations per day for each channel. WhatsApp is highest.'})}<div style="margin-top:14px">${legend(ds.map(s => [s.name, s.c, num(s.vals[s.vals.length - 1])]))}</div></section>
      <section class="card" aria-label="Leads by source">${cardH('Leads by source', '', `<span class="mg-bigstat">${num(tot)}</span>`)}<div class="col tight">${SR.map(([n, v], i) => hrow(esc(n), v, SR[0][1], i ? '--ch-d' : '--ch-a', `${num(v)} <span class="mute" style="font-weight:400">${Math.round(v / Math.max(1, tot) * 100)}%</span>`)).join('')}</div></section></div>`});
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
        meta:chip(l.status) + `<span class="ell">${esc(l.handled)}</span>` + (l.rating ? stars(l.rating, 11) : '')}); }).join('')
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
    const filters = `<div class="mg-filters">${dateSeg()}<span class="sp"></span><span class="xs mute">${rangeLabel()}</span>${fresh('Updated 2 min ago')}</div>`;
    const sb = stateBody('team numbers'); if (sb) return shell({nav:'team', title:'Call centre and sales', body: filters + sb});
    const k = DK();
    const people = Object.keys(U).filter(x => ['cc','sales'].includes(U[x].role));
    const on = people.filter(x => U[x].status !== 'away');
    const grp = (title, role) => `<div class="mg-og"><span class="eyebrow">${title}</span><div class="mg-avs">${people.filter(x => U[x].role === role).map(x => { const [t, c] = STATE(x); return `<div class="mg-person ${c === 'grey' ? 'off' : ''}" title="${esc(U[x].name)} · ${t}"><span class="avw">${av(U[x].name, 'lg')}<span class="pres ${U[x].status}" aria-hidden="true"></span></span><b class="small ell">${esc(first(x))}</b><span class="xs ${c === 'grey' ? 'mute' : c}">${t}</span></div>`; }).join('')}</div></div>`;
    const online = `<section class="card" aria-label="Online now">${cardH(`Online now <span class="mute" style="font-weight:600">${on.length} of ${people.length}</span>`, '', `<span class="mg-live c-green">${pulse('green')}Live</span>`)}<div class="mg-ppl">${grp('Call centre', 'cc')}${grp('Sales', 'sales')}</div></section>`;
    const cbs = LEADS.filter(l => l.cb && l.cb.day !== 'tomorrow');
    // ponytail: sample leads cover only part of today's callbacks; fixed offsets keep the totals realistic and still move with agent actions
    const done = 13 + cbs.filter(l => l.cb.done).length, over = cbs.filter(l => !l.cb.done && l.cb.in < 0).length, todo = 5 + cbs.filter(l => !l.cb.done && l.cb.in >= 0).length;
    const nextCb = cbs.filter(l => !l.cb.done && l.cb.in >= 0 && U[l.owner]).sort((a, b) => a.cb.in - b.cb.in)[0];
    const cbCard = `<section class="card" aria-label="Callbacks today">${cardH('Callbacks today')}<div class="mg-three">
      <div><span class="v" ${countAttr(done)}>${done}</span><span class="k">${ic('check', 14)}Done</span></div>
      <div class="${over ? 'hot' : ''}"><span class="v">${over}</span><span class="k">${over ? pulse('red') : ''}Overdue</span></div>
      <div><span class="v">${todo}</span><span class="k">${ic('clock', 14)}Still to call</span></div></div>${nextCb ? `<p style="margin-top:18px"><span class="mute">Next:</span> <b>${esc(nextCb.name)}</b> at ${esc(nextCb.cb.at)}, ${esc(first(nextCb.owner))} calls</p>` : ''}</section>`;
    const FN = [['Conversations', 2436, 'Every chat VINA had', '--ch-b'], ['Qualified by VINA', 612, 'Ready for the team', '--ch-b'], ['Sent to call centre', 221, 'Callbacks VINA handed over', '--ch-a'], ['Reached', 181, 'The call centre spoke to them', '--ch-a'], ['Sent to sales', 94, 'From the call centre · 235 more went straight from VINA', '--ch-a'], ['Test drive', 48, 'Madinah Road and Prince Sultan Road', '--ch-a'], ['Sold', 9, '4 V27 2027 · 3 03T · 2 V27 2026', '--green']].map(([l, n, t, c]) => [l, sc(n, k), t, c]);
    const funnel = `<section class="card" aria-label="From conversation to sale">${cardH('From conversation to sale', '', legend([['VINA','--ch-b'],['Your team','--ch-a'],['Sold','--green']]))}
      <div class="mg-fun hd"><span class="mg-fl">Step</span><span class="mg-ft"></span><span class="mg-fc" style="font:inherit">Count</span><span class="mg-fp"><span class="wd">Conversion</span><span class="nr">%</span></span></div>
      ${FN.map(([l, n, t, c], i) => `<div class="mg-fun"><span class="mg-fl"><b title="${esc(t)}">${l}</b></span><div class="mg-ft" role="img" aria-label="${l}: ${num(n)}"><i class="grow-x" style="width:${Math.max(2, Math.sqrt(n / Math.max(1, FN[0][1])) * 100).toFixed(1)}%;background:var(${c})"></i></div><span class="mg-fc">${num(n)}</span><span class="mg-fp">${i ? Math.round(n / Math.max(1, FN[i - 1][1]) * 100) + '%' : '—'}</span></div>`).join('')}</section>`;
    const away = U.abdullah.status === 'away';
    const hl = `<div class="col mg-hl" style="gap:24px"><div class="kpi"><div class="k mk">${mic('Quickest to call back', 13)}Quickest to call back</div><div class="mg-vname">Huda Saleh</div><div class="n">11 min on average</div></div><div class="kpi"><div class="k mk">${mic('Most test drives booked', 13)}Most test drives booked</div><div class="mg-vname">Majed Al-Qahtani</div><div class="n">${sc(20, k)} test drives, ${sc(4, k)} cars sold</div></div><div class="kpi ${away ? 'hot' : ''}"><div class="k mk">${mic('Needs a look', 13)}Needs a look${away ? pulse() : ''}</div><div class="mg-vname">${away ? 'Abdullah is off today' : 'Nothing right now'}</div><div class="n">${away ? '6 of his leads have waited more than a day' : 'Everyone is on time'}</div></div></div>`;
    const CC = [['reem', 86, 71, '14 min', 38, '4.7', false], ['faisal', 74, 58, '22 min', 29, '4.5', true], ['huda', 61, 52, '11 min', 27, '4.8', false]];
    const SA = [['majed', 131, 118, '18 min', 20, 4, '4.6', false], ['yousef', 112, 96, '26 min', 16, 3, '4.4', false], ['abdullah', 86, 70, '31 min', 12, 2, '4.5', true]];
    const pcell = id => { const [t, c] = STATE(id); return `<div class="who"><span class="avw">${av(U[id].name, 'sm')}<span class="pres ${U[id].status}" aria-hidden="true"></span></span><span><span class="nm" style="display:block">${esc(U[id].name)}</span><span class="xs ${c === 'grey' ? 'mute' : c}">${t}</span></span></div>`; };
    const slow = (v, s) => s ? `<span class="chip c-amber" title="Slower than the team">${v}</span>` : v;
    const pct = (a, b) => `<span class="pc">${Math.round(a / Math.max(1, b) * 100)}%</span>`;
    const ccT = CC.map(r => [r[0], sc(r[1], k), sc(r[2], k), r[3], sc(r[4], k), r[5], r[6]]);
    const ccSum = ccT.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[4]], [0, 0, 0]);
    const saT = SA.map(r => [r[0], sc(r[1], k), sc(r[2], k), r[3], sc(r[4], k), sc(r[5], k), r[6], r[7]]);
    const saSum = saT.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[4], a[3] + r[5]], [0, 0, 0, 0]);
    const ccTable = `<section class="col mg-tbl" aria-label="Call centre">${sectionHead('Call centre')}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Person</th><th class="r">Callbacks done</th><th class="r">Reached</th><th class="r">Time before calling</th><th class="r">Sent to sales</th><th class="r">Customer rating</th></tr></thead><tbody>
      ${ccT.map(r => `<tr><td>${pcell(r[0])}</td><td class="r num">${num(r[1])}</td><td class="r num">${num(r[2])} ${pct(r[2], r[1])}</td><td class="r num">${slow(r[3], r[6])}</td><td class="r num">${num(r[4])}</td><td class="r num">${r[5]}</td></tr>`).join('')}
      <tr class="tot"><td>Call centre total</td><td class="r num">${num(ccSum[0])}</td><td class="r num">${num(ccSum[1])} ${pct(ccSum[1], ccSum[0])}</td><td class="r num">16 min</td><td class="r num">${num(ccSum[2])}</td><td class="r num">4.7</td></tr></tbody></table></div></section>`;
    const saTable = `<section class="col mg-tbl" aria-label="Sales">${sectionHead('Sales')}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Person</th><th class="r">Leads given</th><th class="r">Contacted</th><th class="r">First reply</th><th class="r">Test drives</th><th class="r">Sold</th><th class="r">Customer rating</th></tr></thead><tbody>
      ${saT.map(r => `<tr><td>${pcell(r[0])}</td><td class="r num">${num(r[1])}</td><td class="r num">${num(r[2])} ${pct(r[2], r[1])}</td><td class="r num">${slow(r[3], r[7])}</td><td class="r num">${num(r[4])}</td><td class="r num green b">${num(r[5])}</td><td class="r num">${r[6]}</td></tr>`).join('')}
      <tr class="tot"><td>Sales total</td><td class="r num">${num(saSum[0])}</td><td class="r num">${num(saSum[1])} ${pct(saSum[1], saSum[0])}</td><td class="r num">24 min</td><td class="r num">${num(saSum[2])}</td><td class="r num green">${num(saSum[3])}</td><td class="r num">4.5</td></tr></tbody></table></div></section>`;
    return shell({nav:'team', title:'Call centre and sales', body:`${filters}<div class="mg-g2">${online}${cbCard}</div><div class="mg-g21">${funnel}${hl}</div>${ccTable}${saTable}`});
  }});

  /* ---------- M5 Customer ratings ---------- */
  R('ratings', {id:'M5', title:'Customer ratings', roles:['manager','vina'], states:[['empty','No ratings yet'],['loading','Loading'],['error','Could not load']], after: fitDraw, render() {
    const s5 = S.f.m5 || (S.f.m5 = {date:'7'});
    const k = s5.date === '42' ? 6 : 1;
    const filters = `<div class="mg-filters"><div class="seg" role="group" aria-label="Date range">${[['7','Last 7 days'],['42','Last 6 weeks']].map(([x, t]) => `<button type="button" data-a="m5-date" data-x="${x}" aria-pressed="${s5.date === x}">${t}</button>`).join('')}</div><span class="sp"></span>${fresh('Updated 2 min ago')}</div>`;
    const sb = stateBody('ratings'); if (sb) return shell({nav:'ratings', title:'Customer ratings', body: filters + sb});
    if (S.st === 'empty') return shell({nav:'ratings', title:'Customer ratings', body: filters + `<div class="card">${empty('star', 'No ratings yet', 'When a chat closes, VINA asks the customer for 1 to 5 stars. Their ratings and comments show here.')}</div>`});
    const ST = [[5, 198], [4, 80], [3, 18], [2, 9], [1, 7]].map(([st, n]) => [st, sc(n, k)]);
    const tot = ST.reduce((a, x) => a + x[1], 0), smax = Math.max(1, ...ST.map(x => x[1]));
    const hero = `<section class="card mg-r5" aria-label="Average rating"><div class="mg-avg"><span class="eyebrow">Average rating</span><div class="row tight" style="align-items:baseline"><span class="mg-big" ${countAttr('4.6')}>4.6</span><span class="mute">out of 5</span></div>${stars(4.6, 20)}<span class="small mute">From <b style="color:var(--text)">${num(tot)}</b> customers · <span class="green b">${Math.round((ST[0][1] + ST[1][1]) / tot * 100)}%</span> gave 4 or 5 stars</span></div>
      <div class="col" style="gap:6px" role="img" aria-label="${ST.map(([st, n]) => st + ' stars: ' + n).join(', ')}">${ST.map(([st, n]) => `<div class="mg-br"><span class="b">${st} star${st === 1 ? '' : 's'}</span><div class="bar-h"><i style="width:${Math.max(1, n / smax * 100).toFixed(1)}%;background:var(--amber)"></i></div><span class="num b" style="text-align:end">${num(n)}</span><span class="num xs mute" style="text-align:end">${Math.round(n / tot * 100)}%</span></div>`).join('')}</div></section>`;
    const WK = [['5 Oct', 4.3], ['12 Oct', 4.4], ['19 Oct', 4.4], ['26 Oct', 4.5], ['2 Nov', 4.5], ['9 Nov', 4.6]];
    const wk = `<section class="card" aria-label="Rating each week">${cardH('Rating each week', '', `<span class="chip c-green">+0.3 in 6 weeks</span>`)}${lines(WK.map(w => w[0]), [{name:'Average rating', c:'--ch-a', vals: WK.map(w => w[1])}], {h:330, min:4, max:4.8, fmt: v => v.toFixed(1), area:true, endLabel:true, label:'Average rating each week, rising from 4.3 to 4.6.'})}</section>`;
    const cmp = (title, rows) => `<div class="col" style="gap:4px"><span class="eyebrow" style="margin-bottom:4px">${title}</span>${rows.map(([n, c, v, col]) => `<div class="mg-cmp"><b>${n}</b><div class="mg-lol" aria-hidden="true"><i class="grow-x" style="width:${((v - 4) * 100).toFixed(0)}%;background:var(${col || '--ch-a'})"></i></div><b class="num" style="text-align:end">${v.toFixed(1)}</b></div>`).join('')}</div>`;
    const compare = `<section class="card" aria-label="Compare ratings">${cardH('Who gets the best ratings')}<div class="col loose">${cmp('By who handled the chat', [['VINA alone', 205, 4.6, '--ch-b'], ['Call centre', 61, 4.7, '--ch-a'], ['Sales', 46, 4.5, '--ch-c']])}${cmp('By channel', [['WhatsApp', 246, 4.6], ['Website chat', 51, 4.5], ['Phone line', 15, 4.4]])}
      <div class="mg-cmp mg-axis" aria-hidden="true"><span></span><div><span>4.0</span><span>4.5</span><span>5.0</span></div><span></span></div></div></section>`;
    const low = LEADS.filter(l => l.rating && l.rating <= 2 && l.ratingNote);
    const lowHtml = `<section class="col" aria-label="Latest low ratings">${sectionHead('Latest low ratings', '', `<span class="pill c-red">${sc(16, k)} this period</span>`)}
      <div class="g3">${low.map(l => `<button type="button" class="card lift mg-q" data-a="m5-open" data-x="${l.id}">${stars(l.rating, 16)}<span class="mg-qt">“${esc(l.ratingNote)}”</span><span class="small mute">${esc(l.name)} · ${esc(l.handled)}${l.owner && U[l.owner] ? ' · ' + esc(first(l.owner)) : ''} · ${esc(l.ratedAt || '')}</span><span class="mg-qa">Open conversation${ic('arrowR', 14)}</span></button>`).join('')}</div></section>`;
    return shell({nav:'ratings', title:'Customer ratings', body:`${filters}${hero}<div class="mg-g2">${wk}${compare}</div>${lowHtml}`});
  }});
  A['m5-date'] = el => { S.f.m5.date = el.dataset.x; };
  A['m5-open'] = el => { S.f.m3sel = el.dataset.x; Object.assign(M3(), {folder:'low', ch:'all', st:'all', hb:'all', date:'all', rated:false, low:false, q:'', open:true}); go('conversations'); return false; };
})();
