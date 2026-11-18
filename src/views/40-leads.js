/* LD1–LD5 · Leads list, pipeline, calendar, lead page, statuses. Used by both dashboards. */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  /* toolbar: search + Filters popover + active filter chips */
  .ld-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .ld-bar>.btn,.ld-bar .ld-rel>.btn{min-height:40px}
  .ld-q{display:flex;align-items:center;gap:8px;min-height:40px;width:300px;max-width:100%;padding:0 12px;border-radius:10px;border:1px solid var(--line2);background:var(--inp);color:var(--mute);transition:border-color var(--d1),box-shadow var(--d2) var(--ease)}
  .ld-q:focus-within{border-color:var(--horizon);box-shadow:0 0 0 4px var(--ring)}
  .ld-q input{flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:13px;color:var(--text)}
  .ld-rel{position:relative}
  .ld-bar .btn .n{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--pri);color:var(--on-pri);font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
  .menu.ld-pop{top:48px;left:0;width:min(560px,calc(100vw - 32px));padding:16px;gap:14px;transform-origin:top left;cursor:default}
  .menu.ld-pop.r{left:auto;right:0;width:250px;padding:8px 12px 10px;gap:0;transform-origin:top right}
  .menu.ld-pop .g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px}
  .menu.ld-pop .field>label{font-size:12px;color:var(--mute);font-weight:600}
  .menu.ld-pop .inp{min-height:38px;font-size:13px}
  .menu.ld-pop .ft{display:flex;align-items:center;gap:8px;padding-top:14px;border-top:1px solid var(--line)}
  .menu.ld-pop .btn{min-height:34px;padding:0 14px;border:1px solid transparent;justify-content:center;font-weight:600;font-size:12px}
  .menu.ld-pop .btn.pri{background:var(--pri);border-color:var(--pri);color:var(--on-pri)}
  .menu.ld-pop .btn.pri:hover{background:var(--pri-h)}
  .menu.ld-pop .btn.ghost{color:var(--link)}
  .menu.ld-pop .chk{font-size:13px}
  .menu.again{animation:none}
  .ld-bar .fchip{min-height:32px;font-size:12px;padding:0 8px 0 12px;background:var(--sel);border-color:transparent}
  .ld-bar .fchip:hover{background:var(--sub2)}
  .ld-bar .fchip .k{color:var(--mute)}
  .rx-tbl .ld-pager{padding:10px 16px;border-top:1px solid var(--line)}
  .rx-tbl .ld-bulk{margin:12px 16px 0}
  .rx-tbl>.rc-b>.col[aria-busy]{padding:16px}
  .rx-tbl .empty{padding:40px 16px}
  /* LD1 table */
  .ld-bulk{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 14px;border-radius:12px;background:var(--sel);box-shadow:inset 0 0 0 1px var(--horizon)}
  .ld-bulk .inp{min-height:36px;width:auto}
  .ld-pager{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:13px;color:var(--mute)}
  .ld-pager .pg{min-width:36px;min-height:36px;border-radius:8px;border:1px solid var(--line2);background:var(--card);cursor:pointer;font-weight:600;color:var(--text);transition:background var(--d1),transform var(--d1)}
  .ld-pager .pg:hover:not([disabled]){background:var(--sub)} .ld-pager .pg:active{transform:scale(.95)} .ld-pager .pg[disabled]{opacity:.4;cursor:not-allowed}
  .ld-pager .pg[aria-current="page"]{background:var(--pri);border-color:var(--pri);color:var(--on-pri)}
  .ld-sum{min-width:220px;max-width:420px}
  .ld-nw{white-space:nowrap}
  .ld-chm{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:0 0 18px;border-radius:5px}
  .ld-next{display:inline-flex;align-items:flex-start;gap:8px;min-width:132px}
  .ld-next .chi{width:22px;height:22px;flex-basis:22px;border-radius:7px;margin-top:-1px}
  .ld-late{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
  /* LD2 board */
  .ld-board{display:grid;gap:12px;overflow-x:auto;padding-bottom:10px;align-items:start;scrollbar-width:thin}
  .ld-colm{background:var(--sub);border-radius:var(--r-l);padding:12px;display:flex;flex-direction:column;gap:10px;min-height:260px;transition:background var(--d2),outline-color var(--d2)}
  .ld-colm h2{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;min-height:28px;padding:0 2px}
  .ld-colm .ld-cnt{min-width:24px;height:22px;padding:0 7px;border-radius:999px;background:var(--card);font-family:var(--f-display);font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;color:var(--mute)}
  .ld-colm.none{min-height:120px}
  .ld-colm.none .ld-cnt{background:transparent}
  .ld-none{font-size:12px;color:var(--faint);padding:10px 4px;border-top:1px dashed var(--line2)}
  .ld-board:has(.dragging) .ld-colm{outline:1.5px dashed var(--line2);outline-offset:-1.5px}
  .ld-card{position:relative;background:var(--card);border:1px solid var(--card-bd);border-radius:12px;padding:12px 12px 10px 14px;display:flex;flex-direction:column;gap:6px;box-shadow:var(--e1)}
  .ld-card a.nm{font-weight:600;color:var(--text);text-decoration:none;font-size:14px}
  .ld-card a.nm:hover{color:var(--link);text-decoration:underline}
  .ld-card .ld-mvb{margin:-6px -6px -6px 0;color:var(--mute)}
  .ld-card .ld-cf{display:flex;align-items:center;gap:8px;font-size:12px;margin-top:4px;padding-top:8px;border-top:1px solid var(--line);min-width:0}
  .ld-card.dragging{transform:rotate(-1.5deg) scale(.98);box-shadow:var(--e3)}
  .ld-card.flash,.ld-hist-new{animation:ldflash 1.2s var(--ease) 1}
  @keyframes ldflash{from{background:var(--teal-b);box-shadow:0 0 0 2px var(--aqua),var(--e2)}}
  .ld-mvmenu{width:232px}
  .ld-mvmenu .sw{width:8px;height:8px;border-radius:50%;flex:0 0 8px}
  /* LD3 calendar */
  .ld-cal{overflow-x:auto;border-radius:var(--r-l);background:var(--card);box-shadow:var(--e1);border:1px solid var(--card-bd)}
  .ld-cal-in{display:grid;min-width:860px}
  .ld-cal-h{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;height:68px;border-bottom:1px solid var(--line);font-size:12px;color:var(--mute);font-weight:500}
  .ld-cal-h b{font-family:var(--f-display);font-size:16px;color:var(--text);width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .ld-cal-h.today span{color:var(--link);font-weight:700}
  .ld-cal-h.today b{background:var(--pri);color:var(--on-pri)}
  .ld-cal-g{position:relative}
  .ld-cal-t{font-size:12px;color:var(--faint);text-align:end;padding:0 10px;height:48px;transform:translateY(-7px)}
  .ld-cal-t:first-child{visibility:hidden}
  .ld-cal-d{position:relative;border-inline-start:1px solid var(--line);background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 23px,var(--sub) 23px,var(--sub) 24px,transparent 24px,transparent 47px,var(--line) 47px,var(--line) 48px)}
  .ld-cal-d.today{background-color:color-mix(in srgb,var(--sel) 45%,transparent)}
  .ld-cal-d.closed{background-image:repeating-linear-gradient(135deg,var(--sub) 0 6px,transparent 6px 14px)}
  .ld-cal-d .shut{position:sticky;top:80px;padding:12px;text-align:center;font-size:12px;color:var(--mute)}
  .ld-ev{position:absolute;border-radius:8px;padding:4px 8px 4px 10px;font-size:12px;line-height:1.3;text-align:start;border:0;cursor:pointer;overflow:hidden;box-shadow:inset 3px 0 0 currentColor;transition:box-shadow var(--d2) var(--ease),transform var(--d2) var(--ease);z-index:1}
  .ld-ev b{display:block;font-size:12px;color:var(--text);font-weight:600}
  .ld-ev .s{display:block;color:var(--mute)}
  .ld-ev:hover{box-shadow:inset 3px 0 0 currentColor,var(--e2);transform:translateY(-1px);z-index:3}
  .ld-ev.td{background:var(--purple-b);color:var(--purple-f)} .ld-ev.cb{background:var(--amber-b);color:var(--amber-f)}
  .ld-now{position:absolute;left:0;right:0;height:2px;background:var(--horizon);z-index:2;pointer-events:none}
  .ld-now::before{content:"";position:absolute;left:-5px;top:-4px;width:10px;height:10px;border-radius:50%;background:var(--horizon);box-shadow:0 0 0 3px var(--card)}
  .ld-now-t{position:absolute;right:6px;transform:translateY(-50%);font-size:12px;font-weight:700;color:var(--on-pri);background:var(--horizon);padding:1px 6px;border-radius:6px;z-index:2}
  .ld-legend{display:flex;flex-wrap:wrap;gap:8px}
  .ld-legend span{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;font-size:12px;font-weight:600}
  .ld-legend i{width:8px;height:8px;border-radius:50%;background:currentColor}
  /* LD4 lead page */
  .ld-hero{padding:24px 24px 20px;background:radial-gradient(900px 220px at 0% 0%,color-mix(in srgb,var(--horizon) 12%,transparent),transparent 70%),var(--card)}
  .ld-hd{display:flex;flex-wrap:wrap;gap:16px 20px;align-items:center}
  .ld-nm{font-size:28px;line-height:32px;font-weight:700;letter-spacing:-.02em}
  .ld-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin-top:8px;font-size:13px;color:var(--mute)}
  .ld-meta>span{display:inline-flex;align-items:center;gap:7px}
  .ld-meta b{color:var(--text);font-weight:600}
  .ld-acts{display:flex;flex-wrap:wrap;gap:8px;margin-inline-start:auto}
  .ld-stp{margin-top:22px;padding-top:18px;border-top:1px solid var(--line)}
  .ld-steps{list-style:none;margin:0;padding:0}
  .ld-steps .st .bar{height:6px;border-radius:999px;background:var(--sub2);overflow:hidden}
  .ld-steps .st .bar i{display:block;height:100%;border-radius:inherit;background:var(--indigo-f)}
  .ld-steps .ld-cur .bar i{background:linear-gradient(90deg,var(--indigo-f),var(--horizon))}
  .ld-steps .ld-cur .lb{font-weight:700}
  .ld-steps .st .d{font-size:12px}
  .ld-steps .ld-cur .d{color:var(--link);font-weight:600}
  .ld-2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:20px;align-items:start}
  .ld-vina{border-radius:var(--r-l);padding:22px;background:linear-gradient(155deg,var(--teal-b),color-mix(in srgb,var(--teal-b) 30%,var(--card)) 75%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--teal-f) 18%,transparent)}
  .ld-vina .vh{display:flex;align-items:center;gap:10px;margin-bottom:16px}
  .ld-vina .vh h2{font-size:14px;font-weight:700}
  .ld-vina .vh .xs{color:var(--teal-f);font-weight:600}
  .ld-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:10px;margin:0}
  .ld-facts div{padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--card) 70%,transparent)}
  .ld-facts dt{font-size:12px;color:var(--teal-f);font-weight:600}
  .ld-facts dd{margin:2px 0 0;font-weight:600}
  .ld-why{margin-top:16px;padding-top:14px;border-top:1px solid color-mix(in srgb,var(--teal-f) 18%,transparent);font-size:13px}
  .ld-why .btn{padding:0 6px;margin-inline-start:-6px;margin-top:4px;color:var(--teal-f)}
  .ld-compose{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:var(--r-m);background:var(--sub);margin-bottom:18px}
  .ld-compose .inp{min-height:64px;background:var(--card)}
  .ld-tl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
  .ld-tl .it{position:relative;display:flex;gap:14px;padding:8px 8px 14px;margin:0 -8px;border-radius:12px}
  .ld-tl .it::before{content:"";position:absolute;left:23px;top:42px;bottom:-6px;width:2px;border-radius:2px;background:var(--line)}
  .ld-tl .it:last-child::before{display:none}
  .ld-tl .it .chi{width:32px;height:32px;flex-basis:32px;border-radius:50%;box-shadow:0 0 0 4px var(--card)}
  .ld-tl .bx{margin-top:8px;padding:10px 12px;border-radius:10px;background:var(--sub);font-size:13px}
  .ld-tl .it.flash{animation:ldrise var(--d3) var(--spring),flash 1.1s var(--ease)}
  @keyframes ldrise{from{opacity:0;transform:translateY(10px)}}
  .ld-nx{display:flex;gap:14px;align-items:flex-start}
  .ld-nx b{font-family:var(--f-display);font-size:16px}
  /* LD5 reference sheet */
  .ld5-st{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:12px}
  .ld5-t{position:relative;background:var(--card);border:1px solid var(--card-bd);border-radius:var(--r-l);padding:16px 16px 14px;box-shadow:var(--e1);display:flex;flex-direction:column;gap:8px;overflow:hidden}
  .ld5-t::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--c)}
  .ld5-t .n{font-family:var(--f-display);font-size:20px;font-weight:700;line-height:1}
  .ld5-sw{width:12px;height:12px;border-radius:4px;background:var(--c)}
  .ld-sw{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .ld-part{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
  @media (max-width:1000px){.ld-2{grid-template-columns:minmax(0,1fr)}}
  @media (max-width:760px){
    .ld-q{width:100%}
    .menu.ld-pop .g{grid-template-columns:1fr}
    .ld-nm{font-size:20px;line-height:27px}
    .ld-hero{padding:18px 16px 16px}
    .ld-acts{margin-inline-start:0;width:100%}
    .ld-acts .btn{flex:1 1 auto}
    .ld-steps .st .d{display:none}
    .ld-steps .st{font-size:12px;line-height:1.3}
    .ld-hd>.av.xl{width:48px;height:48px;flex-basis:48px;font-size:16px}
    .ld-facts{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
  </style>`);

  const G = {}; // UI-only flags: popNew (menu first paint), ret (trigger to refocus on Escape), focusIn, focusId, bx (board scroll), mv (move menu spot)
  const DEF = () => ({view:'all', q:'', fStatus:'', fModel:'', fSrc:'', fCh:'', fTo:'', fDate:'', fCity:'', fLang:'', sort:'wait', dir:'desc', page:1, cols:{src:false, ch:false, city:false, lang:false, created:false, rating:false}, sel:{}, bulkSt:'contacted', cal:'week', calDay:0, h:'all'});
  const F = () => S.f.ld || (S.f.ld = DEF());
  const open = l => !['sold','lost'].includes(l.status);
  const base = () => isAgent() ? mine() : LEADS;
  const SV_M = [['all','All',() => true],['un','Unassigned',l => !l.owner],['qualified','Qualified',l => l.status === 'qualified'],['cb','Callbacks due',l => l.status === 'callback'],['td','Test drives',l => l.status === 'testdrive'],['sold','Sold',l => l.status === 'sold'],['lost','Lost',l => l.status === 'lost']];
  const SV_A = [['all','My leads',() => true],['fu','Follow-ups today',l => open(l) && /today|now|^call \d|^follow up \d|^book/i.test(l.next)],['td','Test drives',l => l.status === 'testdrive'],['sold','Sold',l => l.status === 'sold'],['lost','Lost',l => l.status === 'lost']];
  const SV = () => isAgent() ? SV_A : SV_M;
  const dayNo = v => -parseInt((/(\d+) Nov/.exec(v) || [0, 0])[1], 10);
  const FIELDS = [
    {k:'fStatus', t:'Status', all:'All statuses', get:l => l.status, lab:k => STATUS[k].label, ord:k => ST_ORDER.indexOf(k)},
    {k:'fModel', t:'Car model', all:'All car models', get:l => l.model},
    {k:'fSrc', t:'Source', all:'All sources', get:l => l.src},
    {k:'fCh', t:'Channel', all:'All channels', get:l => l.ch, lab:k => CH[k].label},
    {k:'fTo', t:'Assigned to', all:'Anyone', get:l => l.owner || 'none', lab:k => k === 'none' ? 'Unassigned' : uname(k), mgr:true},
    {k:'fDate', t:'Created', all:'Any date', get:l => l.created, ord:dayNo},
    {k:'fCity', t:'City', all:'All cities', get:l => l.city},
    {k:'fLang', t:'Language', all:'All languages', get:l => l.lang},
  ];
  const FL = () => FIELDS.filter(f => !(f.mgr && isAgent()));
  const OPT_COLS = [['src','Source'],['ch','Channel'],['city','City'],['lang','Language'],['created','Created date'],['rating','Customer rating']];
  const VAL = {name:l => l.name, model:l => l.model, status:l => ST_ORDER.indexOf(l.status), summary:l => l.summary, src:l => l.src, ch:l => CH[l.ch].label, owner:l => uname(l.owner), wait:l => l.wait == null ? -1 : l.wait, next:l => l.next, city:l => l.city, lang:l => l.lang, created:l => dayNo(l.created), rating:l => l.rating || 0};

  function rows() {
    const s = F(); const sv = (SV().find(v => v[0] === s.view) || SV()[0])[2];
    const q = (s.q || S.f.gq || '').trim().toLowerCase(); const qd = q.replace(/\D/g, '');
    let r = base().filter(sv).filter(l => !q || l.name.toLowerCase().includes(q) || (qd && l.mob.replace(/\D/g, '').includes(qd)));
    FL().forEach(f => { if (s[f.k]) r = r.filter(l => String(f.get(l)) === s[f.k]); });
    const v = VAL[s.sort] || VAL.wait, d = s.dir === 'asc' ? 1 : -1;
    return r.slice().sort((a, b) => { const x = v(a), y = v(b); return (x > y ? 1 : x < y ? -1 : 0) * d; });
  }

  /* menus: first paint animates, later re-renders do not; Escape returns focus to the button that opened it */
  function toggleMenu(key, el) { const was = S.menu === key; S.menu = was ? null : key; G.popNew = !was; G.focusIn = !was; G.ret = el && el.id; }
  function afterUi() {
    G.popNew = false;
    if (G.focusIn) { G.focusIn = false; const m = $('#app .menu'); const t = m && m.querySelector('select,button:not([disabled]),a[href],input'); if (t) t.focus(); }
    if (G.focusId) { const e = document.getElementById(G.focusId); G.focusId = null; if (e && !S.modal) e.focus({preventScroll:true}); }
  }
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && G.ret && (document.activeElement === document.body || !document.activeElement)) { const e = document.getElementById(G.ret); G.ret = null; if (e) e.focus(); } });

  /* ---- shared toolbar (LD1, LD2, LD3) ---- */
  function viewSwitch(cur) {
    return `<div class="seg" role="group" aria-label="Show leads as">${[['leads','List','leads'],['pipeline','Pipeline','overview'],['calendar','Calendar','cal']].map(([r, t, i]) => `<a href="#${r}" ${cur === r ? 'aria-current="page"' : ''}>${ic(i, 15)}${t}</a>`).join('')}</div>`;
  }
  function savedTabs() {
    const s = F(); const b = base();
    return `<div class="tabs" role="tablist" aria-label="Saved views">${SV().map(([k, t, fn]) => `<button type="button" class="tab" role="tab" aria-selected="${s.view === k}" data-a="ld-view" data-x="${k}">${t}<span class="n">${b.filter(fn).length}</span></button>`).join('')}</div>`;
  }
  const fLabel = (f, v) => f.lab ? f.lab(v) : v;
  function filterBar(withCols, cur) {
    const s = F(); const b = base(); const act = FL().filter(f => s[f.k]); const again = G.popNew ? '' : 'again';
    const fsel = f => {
      const ord = f.ord || (v => v); const vals = [...new Set(b.map(f.get))].sort((x, y) => { const a = ord(x), c = ord(y); return a > c ? 1 : a < c ? -1 : 0; });
      return `<div class="field"><label for="ld-f-${f.k}">${f.t}</label><select class="inp" id="ld-f-${f.k}" data-ch="ld-fset" data-x="${f.k}">${[['', f.all]].concat(vals.map(v => [v, fLabel(f, v)])).map(([v, t]) => `<option value="${esc(v)}" ${String(s[f.k]) === String(v) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
    };
    const n = S.menu === 'ld-filters' ? rows().length : 0;
    const pop = S.menu === 'ld-filters' ? `<div class="menu ld-pop ${again}" role="dialog" aria-label="Filters" data-a="noop">
        <div class="g">${FL().map(fsel).join('')}</div>
        <div class="ft"><button type="button" class="btn ghost" data-a="ld-clear" ${act.length ? '' : 'disabled'}>Clear all</button><span class="sp"></span><button type="button" class="btn pri" data-a="ld-filters" data-x="done">Show ${num(n)} ${n === 1 ? 'lead' : 'leads'}</button></div></div>` : '';
    const colPop = S.menu === 'ld-cols' ? `<div class="menu ld-pop r ${again}" role="group" aria-label="Extra columns" data-a="noop"><div class="mh">Extra columns</div>${OPT_COLS.map(([k, t]) => `<label class="chk"><input ${bindChk('f.ld.cols.' + k)}>${t}</label>`).join('')}</div>` : '';
    return `<div class="ld-bar ptb">${viewSwitch(cur)}
      <label class="ld-q">${ic('search', 16)}<span class="sr">Search by name or mobile</span><input type="search" placeholder="Search name or mobile" ${bind('f.ld.q', true)}></label>
      <span class="ld-rel"><button type="button" class="btn sm" id="ld-fbtn" data-a="ld-filters" aria-haspopup="dialog" aria-expanded="${S.menu === 'ld-filters'}">${ic('filter', 15)}Filters${act.length ? `<span class="n" aria-label="${act.length} on">${act.length}</span>` : ''}</button>${pop}</span>
      ${act.map(f => `<button type="button" class="fchip" data-a="ld-unf" data-x="${f.k}" aria-label="Remove filter ${esc(f.t)}: ${esc(fLabel(f, s[f.k]))}"><span class="k">${esc(f.t)}:</span>${esc(fLabel(f, s[f.k]))}${ic('x', 13, 'x')}</button>`).join('')}
      ${act.length || s.q ? `<button type="button" class="btn ghost sm" data-a="ld-clear">Clear all</button>` : ''}
      <span class="sp"></span>
      ${withCols ? `<span class="ld-rel"><button type="button" class="btn sm" id="ld-cbtn" data-a="ld-cols" aria-haspopup="dialog" aria-expanded="${S.menu === 'ld-cols'}">${ic('cols', 15)}Columns</button>${colPop}</span>` : ''}
      ${!isAgent() ? `<button type="button" class="btn sm" data-a="ld-csv">${ic('download', 15)}Download CSV</button>` : ''}
    </div>`;
  }
  A['ld-view'] = el => { F().view = el.dataset.x; F().page = 1; F().sel = {}; };
  A['ld-clear'] = () => { const s = F(); s.q = ''; S.f.gq = ''; FIELDS.forEach(f => s[f.k] = ''); s.page = 1; };
  A['ld-filters'] = el => { toggleMenu('ld-filters', $('#ld-fbtn')); if (el.dataset.x === 'done') G.focusId = 'ld-fbtn'; };
  A['ld-cols'] = el => { toggleMenu('ld-cols', el); };
  A['ld-fset'] = el => { const s = F(); s[el.dataset.x] = el.value; s.page = 1; s.sel = {}; };
  A['ld-unf'] = el => { F()[el.dataset.x] = ''; F().page = 1; };
  A['ld-csv'] = () => { toast(`CSV of ${rows().length} leads prepared for 1 to 7 Nov. Downloads are turned off in this prototype.`); };
  A['ld-retry'] = () => { S.st = ''; };

  /* ---- LD1 list ---- */
  const NEXT_IC = s => /test drive/i.test(s) ? ['cal','purple'] : /^call/i.test(s) ? ['phone','navy'] : /^(follow up|reply)/i.test(s) ? ['wa','green'] : /offer/i.test(s) ? ['send','indigo'] : /delivery/i.test(s) ? ['car','green'] : /needs an agent/i.test(s) ? ['user','amber'] : /VINA/.test(s) ? ['spark','teal'] : null;
  const nextCell = (l, size) => { const n = NEXT_IC(l.next); return `<span class="ld-next">${n ? `<span class="chi c-${n[1]}" aria-hidden="true">${ic(n[0], size || 13)}</span>` : ''}<span class="small">${esc(l.next)}</span></span>`; };
  const chMini = k => { const c = CH[k] || CH.wa; return `<span class="ld-chm c-${c.c}" title="${c.label}">${ic(c.i, 11)}<span class="sr">${c.label}</span></span>`; };
  function cell(k, l) {
    const s = F();
    switch (k) {
      case 'name': return `<div class="who">${l.unread ? '<span class="unread-dot" aria-label="Unread message"></span>' : ''}<div class="grow"><div class="nm ell" style="font-weight:${l.unread ? 700 : 600}">${esc(l.name)}</div><div class="xs mute num row tight nowrap ld-nw" style="gap:6px">${s.cols.ch ? '' : chMini(l.ch)}${esc(mob(l))}</div></div></div>`;
      case 'model': return `<div class="b ld-nw">${esc(l.model)}</div>${l.trim || l.colour ? `<div class="xs mute">${esc([l.trim, l.colour].filter(Boolean).join(' · '))}</div>` : ''}`;
      case 'status': return `<div class="col" style="gap:4px;align-items:flex-start">${chip(l.status)}${l.vq ? vtag() : ''}</div>`;
      case 'summary': return `<div class="ell2 small ld-sum" title="${esc(l.summary)}">${esc(l.summary)}</div>`;
      case 'src': return `<span title="${esc(l.campaign)}">${esc(l.src)}</span>`;
      case 'ch': return chIc(l.ch);
      case 'owner': return l.owner ? `<div class="who ld-nw" title="${esc(uname(l.owner))}">${av(uname(l.owner), 'sm')}<span>${esc(l.owner === 'vina' ? 'VINA' : first(l.owner))}</span></div>` : `<span class="red b">Unassigned</span>`;
      case 'wait': return l.late ? `<span class="num red b ld-late">${ic('clock', 13)}${mins(l.wait)}</span>` : `<span class="num mute ld-nw">${mins(l.wait)}</span>`;
      case 'next': return nextCell(l);
      case 'city': return esc(l.city);
      case 'lang': return esc(l.lang);
      case 'created': return `<span class="small mute">${esc(l.created)}</span>`;
      case 'rating': return l.rating ? stars(l.rating, 12) : '<span class="mute">—</span>';
    }
    return '';
  }
  function listBody(rs) {
    const s = F(); const agent = isAgent();
    const cols = [['name','Customer'],['model','Car model'],['status','Status'],['summary', ic('spark', 12, 'teal') + ' VINA summary']]
      .concat(agent ? [] : [['owner','Assigned to']]).concat([['wait','Waiting'],['next','Next step']])
      .concat(OPT_COLS.filter(([k]) => s.cols[k]));
    const many = S.st === 'many'; const total = many ? 1248 : rs.length; const pages = Math.max(1, Math.ceil(total / 10));
    s.page = Math.min(s.page, pages); const from = (s.page - 1) * 10;
    const pageRows = many ? Array.from({length:10}, (_, i) => rs[(from + i) % rs.length]) : rs.slice(from, from + 10);
    const selIds = Object.keys(s.sel).filter(k => s.sel[k]);
    const th = ([k, t]) => { const on = s.sort === k; return `<th aria-sort="${on ? (s.dir === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" data-a="ld-sort" data-x="${k}">${t}${on ? ic(s.dir === 'asc' ? 'chevU' : 'chevD', 13) : ''}</button></th>`; };
    const allOn = pageRows.length && pageRows.every(l => s.sel[l.id]);
    const pgNums = [...new Set([1, s.page - 1, s.page, s.page + 1, pages])].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
    return `${agent && selIds.length ? `<div class="ld-bulk" role="region" aria-label="Selected leads"><b>${selIds.length} selected</b>
        <label class="sr" for="b-f-ld-bulkSt">New status</label>${bindSel('f.ld.bulkSt', ST_ORDER.filter(k => !['sold','lost'].includes(k)).map(k => [k, STATUS[k].label]))}
        <button type="button" class="btn sm pri" data-a="ld-bulk-status">Change status</button>
        <button type="button" class="btn sm" data-a="ld-bulk-close">Close lead</button>
        <span class="sp"></span><button type="button" class="btn sm ghost" data-a="ld-sel-clear">Clear</button></div>` : ''}
      <div class="tbl-wrap"><table class="tbl"><caption class="sr">${agent ? 'My leads' : 'Leads'}</caption><thead><tr>${agent ? `<th style="width:44px"><input type="checkbox" aria-label="Select all on this page" data-ch="ld-tick-all" ${allOn ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--pri)"></th>` : ''}${cols.map(th).join('')}</tr></thead>
      <tbody>${pageRows.map(l => `<tr class="click ${s.sel[l.id] || (S.drawer && S.drawer._k === 'lead-preview' && S.drawer.lead === l.id) ? 'sel' : ''} ${flashCls(l.id)}" data-a="ld-row" data-x="${l.id}">${agent ? `<td data-a="noop"><input type="checkbox" aria-label="Select ${esc(l.name)}" data-ch="ld-tick" data-x="${l.id}" ${s.sel[l.id] ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--pri)"></td>` : ''}${cols.map(([k]) => `<td>${cell(k, l)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="ld-pager"><span class="num">Showing ${num(from + 1)} to ${num(Math.min(from + 10, total))} of ${num(total)}</span><span class="sp"></span>
        <button type="button" class="pg" data-a="ld-page" data-x="${s.page - 1}" ${s.page <= 1 ? 'disabled' : ''} aria-label="Previous page">${ic('chevL', 15)}</button>
        ${pgNums.map((n, i) => `${i && n - pgNums[i - 1] > 1 ? '<span aria-hidden="true">…</span>' : ''}<button type="button" class="pg num" data-a="ld-page" data-x="${n}" ${n === s.page ? 'aria-current="page"' : ''} aria-label="Page ${n}">${n}</button>`).join('')}
        <button type="button" class="pg" data-a="ld-page" data-x="${s.page + 1}" ${s.page >= pages ? 'disabled' : ''} aria-label="Next page">${ic('chevR', 15)}</button></div>`;
  }
  R('leads', {id:'LD1', title:'Leads', states:[['empty','No leads yet'],['nores','No results'],['loading','Loading rows'],['many','1,000+ leads']], render() {
    const rs = rows(); let body;
    if (S.st === 'loading') body = loadingRows(8, 52);
    else if (S.st === 'empty' || !base().length) body = `${empty('leads', isAgent() ? 'No leads given to you yet' : 'No leads yet', isAgent() ? 'When VINA qualifies a customer and the rules give them to you, they show here and you get an alert. Make sure you are set to Available.' : 'Leads appear here as soon as VINA starts chatting with customers on your connected channels.', isAgent() ? `<button type="button" class="btn" data-a="presence-menu">Check my status</button>` : '')}`;
    else if (S.st === 'nores' || !rs.length) body = `${empty('search', 'No leads match these filters', 'Try another name or mobile, or clear the filters to see every lead.', `<button type="button" class="btn" data-a="ld-clear">Clear filters</button>`)}`;
    else body = listBody(rs);
    // Saved views are the card's tabs (Unassigned is one of them), so no count in the header and no separate link.
    return shell({nav:'leads', title: isAgent() ? 'My leads' : 'Leads',
      body:`${filterBar(true, 'leads')}<section class="card rc rx-tbl" aria-label="${isAgent() ? 'My leads' : 'Leads'}"><div class="rc-tabs">${savedTabs()}</div><div class="rc-b">${body}</div></section>`});
  }, after: afterUi});
  A['ld-sort'] = el => { const s = F(), k = el.dataset.x; if (s.sort === k) s.dir = s.dir === 'asc' ? 'desc' : 'asc'; else { s.sort = k; s.dir = k === 'wait' || k === 'rating' || k === 'created' ? 'desc' : 'asc'; } };
  A['ld-page'] = el => { F().page = Math.max(1, Number(el.dataset.x)); window.scrollTo(0, 0); };
  A['ld-row'] = el => { openDrawer('lead-preview', {lead: el.dataset.x}); };
  A['ld-tick'] = el => { F().sel[el.dataset.x] = el.checked; };
  A['ld-tick-all'] = el => { const s = F(); const from = (s.page - 1) * 10; rows().slice(from, from + 10).forEach(l => s.sel[l.id] = el.checked); };
  A['ld-sel-clear'] = () => { F().sel = {}; };
  A['ld-bulk-status'] = () => {
    const s = F(); const ids = Object.keys(s.sel).filter(k => s.sel[k]); const k = s.bulkSt; const prev = {};
    ids.forEach(id => { const l = lead(id); prev[id] = [l.status, l.status === k ? null : true]; setStatus(l, k); flash(id); });
    s.sel = {};
    toast(`${ids.length} ${ids.length === 1 ? 'lead' : 'leads'} moved to ${STATUS[k].label}`, () => ids.forEach(id => { const l = lead(id); if (prev[id][1]) { l.status = prev[id][0]; l.h.shift(); flash(id); } }));
  };
  A['ld-bulk-close'] = () => { openModal('ld-close', {ids: Object.keys(F().sel).filter(k => F().sel[k])}); S.f.ldc = {result:'notint', reason:LOST_REASONS[0], note:'', checkin:true}; };

  /* close (bulk, and fallback when the agent module's dialog is missing) */
  MODALS['ld-close'] = m => {
    const c = S.f.ldc || (S.f.ldc = {result: m.result || 'notint', reason:LOST_REASONS[0], note:'', checkin:true});
    const n = m.ids.length; const [ta, tv] = bindTa('f.ldc.note');
    return modalFrame(n === 1 ? 'Close lead' : `Close ${n} leads`, `
      <p class="small mute">${n === 1 ? esc(lead(m.ids[0]).name) : m.ids.map(id => esc(lead(id).name)).join(', ')}</p>
      <div class="field"><span class="lbl">Result</span><div class="col tight" role="radiogroup" aria-label="Result">${[['sold','Sold','The customer bought the car'],['notint','Not interested','The customer does not want to go ahead'],['lost','Lost','With a reason']].map(([k, t, d]) => `<button type="button" class="radio-card" role="radio" aria-checked="${c.result === k}" data-a="ld-close-res" data-x="${k}"><span class="grow"><b>${t}</b><div class="xs mute">${d}</div></span></button>`).join('')}</div></div>
      ${c.result === 'lost' ? `<div class="field"><label for="b-f-ldc-reason">Reason</label>${bindSel('f.ldc.reason', LOST_REASONS)}</div>` : ''}
      <div class="field"><label for="b-f-ldc-note">Note (optional)</label><textarea class="inp" ${ta}>${tv}</textarea></div>
      ${c.result !== 'sold' ? `<div class="sw-row">${sw(c.checkin, 'ld-close-chk', '', 'Ask VINA to check in after 30 days')}<span class="small"><b>Ask VINA to check in after 30 days.</b> VINA sends one WhatsApp message about new offers.</span></div>` : ''}`,
      `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ld-close-ok">${n === 1 ? 'Close lead' : 'Close ' + n + ' leads'}</button>`, {size:'narrow'});
  };
  A['ld-close-res'] = el => { S.f.ldc.result = el.dataset.x; };
  A['ld-close-chk'] = () => { S.f.ldc.checkin = !S.f.ldc.checkin; };
  A['ld-close-ok'] = () => { const c = S.f.ldc, ids = S.modal.ids; ids.forEach(id => { closeLead(lead(id), c.result, c.reason, c.note, c.result !== 'sold' && c.checkin); flash(id); }); S.modal = null; S.f.ldc = null; F().sel = {}; toast(ids.length === 1 ? 'Lead closed' : ids.length + ' leads closed'); };
  const openClose = (id, result) => { if (MODALS['close-lead']) openModal('close-lead', {id, result}); else { S.f.ldc = {result: result || 'notint', reason:LOST_REASONS[0], note:'', checkin:true}; openModal('ld-close', {ids:[id], result}); } };

  /* ---- preview drawer ---- */
  DRAWERS['lead-preview'] = d => {
    const l = lead(d.lead); if (!l) return '';
    return drawerFrame(esc(l.name), `
      <div class="row tight">${chip(l.status)}${l.vq ? vtag() : ''}${chIc(l.ch)}<span class="small mute num">${esc(mob(l))}</span></div>
      <div class="ld-vina" style="padding:16px"><div class="vh" style="margin-bottom:8px">${av('VINA', 'sm')}<h2>VINA summary</h2></div><p class="small">${esc(l.summary)}</p></div>
      <dl class="kv"><dt>Car model</dt><dd>${esc([l.model, l.trim, l.colour].filter(Boolean).join(' · '))}</dd><dt>Next step</dt><dd>${nextCell(l)}</dd><dt>Waiting</dt><dd class="${l.late ? 'red' : ''}">${mins(l.wait)}</dd>${isAgent() ? '' : `<dt>Assigned to</dt><dd>${esc(uname(l.owner))}</dd>`}<dt>Source</dt><dd>${esc(l.src)} · ${esc(l.campaign)}</dd></dl>`,
      `<a class="btn pri" href="#lead-${l.id}" data-go="lead-${l.id}">Open lead${ic('arrowR', 15)}</a>${isAgent() ? `${isCC() ? `<button type="button" class="btn" data-a="ld-call" data-x="${l.id}">${ic('phone', 15)}Call</button>` : ''}<button type="button" class="btn" data-a="ld-wa" data-x="${l.id}">${ic('wa', 15)}WhatsApp</button>` : ''}`,
      `${esc(l.model)} · ${esc(CH[l.ch].label)}`);
  };
  A['ld-call'] = el => { S.drawer = null; if (window.startCall) return window.startCall(el.dataset.x); toast('Calling ' + lead(el.dataset.x).mob); };
  A['ld-wa'] = el => { S.f.agSel = el.dataset.x; S.drawer = null; go('inbox'); return false; };

  /* ---- LD2 pipeline ---- */
  function moveLead(l, k) {
    if (!l || l.status === k) return false;
    if (k === 'testdrive') { openTD(l.id); return; }
    if (k === 'lost' || k === 'sold') { openClose(l.id, k); return; }
    const prev = l.status; setStatus(l, k); const e = l.h[0]; flash(l.id);
    toast(`${l.name} moved to ${STATUS[k].label}`, () => { l.status = prev; const i = l.h.indexOf(e); if (i >= 0) l.h.splice(i, 1); flash(l.id); });
    return true;
  }
  A['ld-drop'] = (t, d) => d.kind === 'lead' ? moveLead(lead(d.id), t.dataset.x) : false;
  A['ld-mv-menu'] = el => {
    const key = 'ld-mv:' + el.dataset.x; const was = S.menu === key;
    if (!was) { const r = el.getBoundingClientRect(), vh = document.documentElement.clientHeight, up = r.bottom + 340 > vh && r.top > 340;
      G.mv = {left: Math.max(16, Math.min(r.right - 232, document.documentElement.clientWidth - 248)) + scrollX, top: up ? null : r.bottom + scrollY + 4, bottom: up ? vh - (r.top + scrollY) + 4 : null}; }
    toggleMenu(key, el);
  };
  A['ld-mv'] = el => { const [id, k] = el.dataset.x.split(':'); S.menu = null; G.ret = null; if (moveLead(lead(id), k) === true) G.focusId = 'mv-' + id; };
  function card(l, drag) {
    return `<article class="ld-card lift ${flashCls(l.id)}" ${drag ? `draggable="true" data-drag="lead" data-x="${l.id}"` : ''}>
      <div class="row tight nowrap"><a class="nm grow ell" href="#lead-${l.id}" style="font-weight:${l.unread ? 700 : 600}">${l.unread ? '<span class="unread-dot" style="display:inline-block;margin-inline-end:7px;vertical-align:1px" aria-label="Unread"></span>' : ''}${esc(l.name)}</a>${l.vq ? vtag() : ''}${drag ? `<button type="button" class="ibtn sm bare ld-mvb" id="mv-${l.id}" data-a="ld-mv-menu" data-x="${l.id}" aria-haspopup="menu" aria-expanded="${S.menu === 'ld-mv:' + l.id}" aria-label="Move ${esc(l.name)} to another status" title="Move to">${ic('more', 18)}</button>` : ''}</div>
      <div class="xs b">${esc(l.model)}${l.trim ? ` <span class="mute" style="font-weight:400">· ${esc(l.trim)}</span>` : ''}</div>
      <div class="small mute ell2" title="${esc(l.summary)}">${esc(l.summary)}</div>
      <div class="ld-cf">${l.owner ? `<span title="${esc(uname(l.owner))}" style="display:inline-flex">${av(uname(l.owner), 'sm')}</span>` : '<span class="red b">Unassigned</span>'}${l.wait != null ? `<span class="num ${l.late ? 'red b' : 'mute'} ld-late">${ic('clock', 12)}${mins(l.wait)}</span>` : ''}<span class="sp"></span><span class="ell mute" style="max-width:150px" title="${esc(l.next)}">${esc(l.next)}</span></div>
    </article>`;
  }
  R('pipeline', {id:'LD2', title:'Pipeline', states:[['empty','No leads yet'],['loading','Loading']], render() {
    const rs = rows(); const drag = isAgent();
    const cols = ST_ORDER.map(k => [k, rs.filter(l => l.status === k)]);
    const board = S.st === 'loading' ? `<div class="ld-board" style="grid-template-columns:repeat(8,minmax(240px,1fr))">${ST_ORDER.map(() => `<div class="ld-colm">${loadingRows(3, 110)}</div>`).join('')}</div>`
      : (S.st === 'empty' || !base().length) ? `<div class="card">${empty('overview', 'No leads yet', 'Leads show here as cards, one column per status, as soon as VINA qualifies customers.')}</div>`
      : `<div class="ld-board" id="ld-board" role="list" aria-label="Pipeline by status" style="grid-template-columns:${cols.map(([, c]) => c.length ? 'minmax(268px,1fr)' : '176px').join(' ')}">${cols.map(([k, c]) => `<section class="ld-colm ${c.length ? '' : 'none'}" role="listitem" aria-label="${STATUS[k].label}, ${c.length} leads" ${drag ? `data-drop="ld-drop" data-x="${k}"` : ''}>
        <h2>${chip(k)}<span class="sp"></span><span class="ld-cnt">${c.length}</span></h2>
        ${c.length ? c.map(l => card(l, drag)).join('') : `<p class="ld-none">${drag ? 'No leads. Drop one here.' : 'No leads'}</p>`}
      </section>`).join('')}</div>`;
    const mid = S.menu && S.menu.indexOf('ld-mv:') === 0 ? S.menu.slice(6) : null; const ml = mid && lead(mid);
    const mvMenu = ml && G.mv ? `<div class="menu ld-mvmenu ${G.popNew ? '' : 'again'}" role="menu" aria-label="Move ${esc(ml.name)} to" style="position:absolute;left:${G.mv.left}px;${G.mv.top != null ? 'top:' + G.mv.top + 'px' : 'bottom:' + G.mv.bottom + 'px;transform-origin:bottom right'}"><div class="mh">Move ${esc(ml.name.split(' ')[0])} to</div>${ST_ORDER.filter(k => k !== ml.status).map(k => `<button type="button" role="menuitem" data-a="ld-mv" data-x="${ml.id}:${k}"><span class="sw" style="background:var(--${STATUS[k].c}-f)" aria-hidden="true"></span><span class="grow">${STATUS[k].label}</span>${k === 'testdrive' ? '<span class="xs mute">Pick a time</span>' : k === 'lost' ? '<span class="xs mute">Pick a reason</span>' : ''}</button>`).join('')}</div>` : '';
    return shell({nav:'leads', title: isAgent() ? 'My leads' : 'Leads',
      body:`${filterBar(false, 'pipeline')}${savedTabs()}${board}${mvMenu}`});
  }, after() {
    const b = $('#ld-board'); if (b) { b.scrollLeft = G.bx || 0; b.onscroll = () => { if (b.scrollLeft === G.bx) return; G.bx = b.scrollLeft; if (S.menu && S.menu.indexOf('ld-mv:') === 0) { S.menu = null; render(); } }; }
    afterUi();
  }});

  /* ---- LD3 calendar ---- */
  const WEEK = [['Sat','7'],['Sun','8'],['Mon','9'],['Tue','10'],['Wed','11'],['Thu','12'],['Fri','13']];
  const H0 = 9, H1 = 22, PX = 48;
  const dayIdx = s => { if (!s || /today/i.test(s)) return 0; const i = WEEK.findIndex(([d]) => new RegExp('\\b' + d + '\\b').test(s)); return i < 0 ? -1 : i; };
  const hrs = s => { const m = /(\d{1,2})(?::(\d\d))?\s*(AM|PM)/i.exec(s || ''); if (!m) return null; let h = Number(m[1]) % 12; if (/pm/i.test(m[3])) h += 12; return h + (Number(m[2] || 0) / 60); };
  const hLabel = h => { const hh = Math.floor(h), m = Math.round((h - hh) * 60); return ((hh % 12) || 12) + ':' + pad(m) + ' ' + (hh >= 12 ? 'PM' : 'AM'); };
  function calItems() {
    const out = [];
    base().forEach(l => {
      if (l.status === 'testdrive' && l.td) { const d = dayIdx(l.td.day), h = hrs(l.td.time); if (d >= 0 && h != null) out.push({l, kind:'td', d, h, dur:1, sub: l.td.car + ' · test drive'}); }
      if (open(l)) { const m = /^(?:Call|Follow up)\s+(?:(Sun|Mon|Tue|Wed|Thu|Sat)\s+)?(\d{1,2}(?::\d\d)?\s*(?:AM|PM))/i.exec(l.next || ''); if (m) { const d = m[1] ? dayIdx(m[1]) : (l.cb && l.cb.day === 'tomorrow' ? 1 : 0); const h = hrs(m[2]); if (d >= 0 && h != null) out.push({l, kind:'cb', d, h, dur:.75, sub: l.cb ? l.cb.why : /^call/i.test(l.next) ? 'Call back' : 'Follow up on WhatsApp'}); } }
    });
    return out.filter(e => e.h >= H0 && e.h < H1).sort((a, b) => a.h - b.h);
  }
  const nowH = () => now().getHours() + now().getMinutes() / 60;
  function dayCol(items, d, closed) {
    const it = items.filter(e => e.d === d); const lanes = [];
    const ev = it.map(e => { let ln = lanes.findIndex(end => end <= e.h); if (ln < 0) { ln = lanes.length; lanes.push(0); } lanes[ln] = e.h + e.dur; return Object.assign({ln}, e); });
    const n = Math.max(1, lanes.length); const nh = nowH();
    return `<div class="ld-cal-d ${closed ? 'closed' : ''} ${d === 0 ? 'today' : ''}" style="height:${(H1 - H0) * PX}px">${closed ? `<div class="shut">Showroom closed</div>` : ''}
      ${d === 0 && nh >= H0 && nh < H1 ? `<div class="ld-now" style="top:${(nh - H0) * PX}px" aria-hidden="true"></div>` : ''}
      ${ev.map(e => `<button type="button" class="ld-ev ${e.kind}" data-go="lead-${e.l.id}" style="top:${(e.h - H0) * PX + 2}px;height:${e.dur * PX - 4}px;left:calc(${(e.ln / n) * 100}% + 4px);width:calc(${100 / n}% - 8px)" aria-label="${e.kind === 'td' ? 'Test drive' : 'Callback'}, ${esc(e.l.name)}, ${WEEK[e.d].join(' ')} Nov ${hLabel(e.h)}"><span class="num">${hLabel(e.h)}</span><b class="ell">${esc(e.l.name)}</b><span class="s ell">${esc(e.sub)}</span></button>`).join('')}</div>`;
  }
  R('calendar', {id:'LD3', title:'Calendar', states:[['empty','Nothing booked']], render() {
    const s = F(); const items = S.st === 'empty' ? [] : calItems();
    const day = s.cal === 'day' || (!s.calPick && innerWidth < 760); // phones open on one day
    const days = day ? [s.calDay] : WEEK.map((_, i) => i);
    const hours = Array.from({length: H1 - H0}, (_, i) => H0 + i); const nh = nowH();
    const showNow = days.includes(0) && nh >= H0 && nh < H1;
    const cal = `<div class="ld-cal"><div class="ld-cal-in" style="grid-template-columns:64px repeat(${days.length},minmax(${day ? 260 : 110}px,1fr));${day ? 'min-width:0' : ''}">
      <div style="border-bottom:1px solid var(--line)"></div>${days.map(i => `<div class="ld-cal-h ${i === 0 ? 'today' : ''}" style="border-inline-start:1px solid var(--line)"><span>${WEEK[i][0]}${i === 0 ? ' · Today' : ''}</span><b class="num">${WEEK[i][1]}</b></div>`).join('')}
      <div class="ld-cal-g">${hours.map(h => `<div class="ld-cal-t">${showNow && Math.abs(h - nh) < .3 ? '' : hLabel(h).replace(':00', '')}</div>`).join('')}${showNow ? `<span class="ld-now-t num" style="top:${(nh - H0) * PX}px">${clock(now()).replace(' PM', '').replace(' AM', '')}</span>` : ''}</div>
      ${days.map(i => dayCol(items, i, WEEK[i][0] === 'Fri')).join('')}</div></div>`;
    const dayList = day ? items.filter(e => e.d === s.calDay) : [];
    const nTd = items.filter(e => e.kind === 'td').length, nCb = items.length - nTd;
    return shell({nav: isSales() ? 'calendar' : 'leads', title: isSales() ? 'Test drives' : (isAgent() ? 'My leads' : 'Leads'),
      body:`<div class="ptb">${viewSwitch('calendar')}<div class="seg" role="group" aria-label="Calendar range">${[['day','Day'],['week','Week']].map(([k, t]) => `<button type="button" data-a="ld-cal" data-x="${k}" aria-pressed="${(k === 'day') === day}">${t}</button>`).join('')}</div>
        ${day ? `<div class="row tight nowrap"><button type="button" class="ibtn sm" data-a="ld-cal-day" data-x="-1" ${s.calDay <= 0 ? 'disabled' : ''} aria-label="Previous day">${ic('chevL', 15)}</button><b class="num" style="min-width:86px;text-align:center">${WEEK[s.calDay][0]} ${WEEK[s.calDay][1]} Nov</b><button type="button" class="ibtn sm" data-a="ld-cal-day" data-x="1" ${s.calDay >= 6 ? 'disabled' : ''} aria-label="Next day">${ic('chevR', 15)}</button></div>` : `<b>Sat 7 to Fri 13 Nov 2026</b>`}
        <span class="sp"></span><div class="ld-legend" aria-label="Colours"><span class="c-purple"><i></i>Test drive · ${nTd}</span><span class="c-amber"><i></i>Callback · ${nCb}</span></div></div>
      ${!items.length ? `<div class="note info">${ic('info')}<span>Nothing booked this week yet. Test drives you book and callbacks with a time show here.</span></div>` : ''}
      ${day ? `<div class="ld-2">${cal}${reportCard({title:`${WEEK[s.calDay][0]} ${WEEK[s.calDay][1]} Nov`, sub:`${dayList.length} booked`, cls:'rx-tbl', body: dayList.length ? `<div class="list">${dayList.map(e => `<a class="li" href="#lead-${e.l.id}" style="text-decoration:none;color:inherit">${chipC(e.kind === 'td' ? 'Test drive' : 'Callback', e.kind === 'td' ? 'purple' : 'amber', true)}<span class="grow"><b>${esc(e.l.name)}</b><div class="xs mute">${esc(e.sub)}</div></span><span class="num small">${hLabel(e.h)}</span></a>`).join('')}</div>` : `<p class="small mute" style="padding:0 20px 18px">Nothing booked on this day.</p>`})}</div>` : cal}`});
  }});
  A['ld-cal'] = el => { F().cal = el.dataset.x; F().calPick = true; };
  A['ld-cal-day'] = el => { const s = F(); s.calDay = Math.min(6, Math.max(0, s.calDay + Number(el.dataset.x))); };

  /* ---- book a test drive (opened with {lead} here, or {id} by the agent module) ---- */
  const TD_DAYS = ['Today, Sat 7 Nov','Sun 8 Nov','Mon 9 Nov','Tue 10 Nov','Wed 11 Nov','Thu 12 Nov','Sat 14 Nov'];
  const TD_TIMES = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM'];
  const tdInit = id => { const l = lead(id); S.f.td = {lead:id, day:'Sun 8 Nov', time:'5:00 PM', room: (U[S.me] && U[S.me].showroom) || SHOWROOMS[0], car: [l.model, l.trim].filter(Boolean).join(' '), wa:true}; };
  function openTD(id) { tdInit(id); openModal('book-td', {lead:id}); }
  MODALS['book-td'] = m => {
    const id = m.lead || m.id, l = lead(id); if (!l) return '';
    if (!S.f.td || S.f.td.lead !== id) tdInit(id);
    const t = S.f.td;
    const cars = [...new Set([t.car].concat(MODELS.flatMap(x => [x, x + ' Standard', x + ' Premium'])))];
    return modalFrame('Book a test drive', `
      <div class="g2" style="gap:12px"><div class="field"><label for="b-f-td-day">Day</label>${bindSel('f.td.day', TD_DAYS)}<span class="hint">Showroom closed on Fridays.</span></div><div class="field"><label for="b-f-td-time">Time</label>${bindSel('f.td.time', TD_TIMES)}</div></div>
      <div class="field"><label for="b-f-td-room">Showroom</label>${bindSel('f.td.room', SHOWROOMS)}</div>
      <div class="field"><label for="b-f-td-car">Car</label>${bindSel('f.td.car', cars)}</div>
      <label class="chk"><input ${bindChk('f.td.wa')}><span><b>Send the customer a WhatsApp confirmation</b><div class="xs mute">"Your test drive is booked for ${esc(t.day.replace('Today, ', ''))} at ${esc(t.time)}, ${esc(t.room)} showroom."</div></span></label>`,
      `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ld-td-ok">Book test drive</button>`, {size:'narrow', sub: esc(l.name) + ' · ' + esc(l.model)});
  };
  A['ld-td-ok'] = () => {
    const l = lead(S.modal.lead || S.modal.id), t = S.f.td; const day = t.day.replace('Today, Sat 7 Nov', 'Today');
    l.td = {day, time:t.time, showroom:t.room, car:t.car};
    const was = l.status; l.status = 'testdrive';
    log(l, 'drive', 'Test drive booked', `${day}, ${t.time} · ${t.room} · ${t.car}${t.wa ? ' · WhatsApp confirmation sent' : ''}`);
    l.h[0].fid = uid('h'); flash(l.h[0].fid);
    if (was !== 'testdrive') log(l, 'status', 'Status changed to Test drive booked');
    l.next = 'Test drive ' + (day === 'Today' ? 'today' : day) + ', ' + t.time; l.wait = null; l.late = false;
    if (t.wa) { l.m.push({k:'agent', text:`Your test drive is booked for ${day === 'Today' ? 'today' : day} at ${t.time}, ${t.room} showroom. Car: ${t.car}. See you there!`, who:S.me, at:clock(now())}); l.m.push({k:'evt', text:'WhatsApp confirmation sent', at:clock(now()), tone:'blue', i:'check'}); }
    flash(l.id); S.modal = null; S.f.td = null; toast(`Test drive booked for ${l.name}, ${day} ${t.time}`);
  };

  /* ---- LD4 lead page ---- */
  const HI = {chat:['wa','green'], status:['arrowR','indigo'], note:['note','amber'], drive:['cal','purple'], call:['phone','navy'], give:['give','grey'], vina:['spark','teal'], ad:['flag','blue'], close:['check','grey']};
  const HF = {all:() => true, chats:e => e.t === 'chat' || e.t === 'ad' || e.t === 'vina', calls:e => e.t === 'call', notes:e => e.t === 'note'};
  function hist(l) {
    const h = l.h.slice();
    if (!h.some(e => e.t === 'chat')) { const last = [...l.m].reverse().find(x => x.k === 'in'); if (last) h.push({t:'chat', title:'Customer message', by: CH[l.ch].label, when: last.at, body: last.text}); }
    if (!h.some(e => e.t === 'ad')) h.push({t:'ad', title:'Chat started from ' + (/^[AEIOU]/i.test(l.src) ? 'an ' : 'a ') + l.src, by: '"' + l.campaign + '"', when: l.created});
    return h;
  }
  R('lead', {id:'LD4', title:'Lead page', states:[['loading','Loading'],['error','Could not load']], render(id) {
    const l = lead(id); const back = [isAgent() ? 'My leads' : 'Leads', 'leads'];
    if (!l) return shell({nav:'leads', title:'Lead', crumb:back, body:`<div class="card">${empty('search', 'We could not find this lead', 'It may have been removed. Go back to the list and pick another lead.', `<a class="btn pri" href="#leads">Back to leads</a>`)}</div>`});
    if (isAgent() && l.owner !== S.me) return shell({nav:'leads', title:l.name, crumb:back, body:`<div class="card">${empty('lock', 'This lead is not in your list', `${esc(l.name)} is ${l.owner ? 'with ' + esc(uname(l.owner)) : 'waiting for an agent'}. You only see the leads given to you.`, `<a class="btn pri" href="#leads">Back to my leads</a>`)}</div>`});
    if (S.st === 'loading') return shell({nav:'leads', title:l.name, crumb:back, body:`<div class="skel" style="height:190px;border-radius:16px"></div><div class="ld-2"><div class="col">${loadingRows(5, 60)}</div><div class="col">${loadingRows(3, 90)}</div></div>`});
    if (S.st === 'error') return shell({nav:'leads', title:l.name, crumb:back, body: errorBox('This lead did not load', 'Check your internet connection, then try again. Nothing you saved is lost.', 'ld-retry')});
    l.unread = isAgent() ? false : l.unread;
    const agent = isAgent(); const s = F();
    const si = l.status === 'callback' ? 1 : STEPS.indexOf(l.status); const lost = l.status === 'lost';
    const steps = `<ol class="steps ld-steps" aria-label="Lead status steps">${STEPS.map((k, i) => { const done = !lost && i < si, cur = !lost && i === si; return `<li class="st ${done ? 'ld-done' : ''} ${cur ? 'ld-cur' : ''}" ${cur ? 'aria-current="step"' : ''}><span class="bar" aria-hidden="true">${done || cur ? `<i class="grow-x" style="animation-delay:${120 + i * 90}ms"></i>` : ''}</span><span class="lb">${STATUS[k].label}</span><span class="d">${lost ? '' : done ? 'Done' : cur ? (l.status === 'callback' ? 'Callback' : 'Now') : 'Next'}</span></li>`; }).join('')}</ol>${lost ? `<div class="note" style="margin-top:12px">${ic('info')}<span>Lost · ${esc(l.lostReason || 'Other')}${l.checkin ? ' · VINA checks in after 30 days' : ''}</span></div>` : ''}`;
    const facts = (l.facts || [['Wants', [l.model, l.trim, l.colour].filter(Boolean).join(' ')], ['What they said', l.summary], ['Language', l.lang], ['Best time to call', l.cb ? l.cb.at : 'Not given yet']]).map(([k, v]) => [k === 'Best time to call' && !isCC() ? 'Best time to reach' : k, v]);
    const why = l.why || (l.vq ? `VINA has the name, mobile and car model, and the customer ${l.summary.charAt(0).toLowerCase() + l.summary.slice(1)}.` : '');
    const hs = hist(l).filter(HF[s.h] || HF.all);
    const [nta, ntv] = bindTa('f.ld4note');
    const acts = agent ? `<div class="ld-acts">
        ${isCC() ? `<button type="button" class="btn pri" data-a="ld-call" data-x="${l.id}">${ic('phone', 15)}Call</button>` : ''}
        <button type="button" class="btn ${isCC() ? '' : 'pri'}" data-a="ld-wa" data-x="${l.id}">${ic('wa', 15)}WhatsApp</button>
        ${isSales() && open(l) ? `<button type="button" class="btn" data-a="ld-book" data-x="${l.id}">${ic('cal', 15)}Book test drive</button>` : ''}
        ${isCC() && open(l) ? `<button type="button" class="btn" data-a="ld-send" data-x="${l.id}">${ic('give', 15)}Send to sales</button>` : ''}
        ${open(l) ? `<button type="button" class="btn danger-o" data-a="ld-close1" data-x="${l.id}">Close lead</button>` : ''}</div>` : '';
    const owner = l.owner ? `<span>${av(uname(l.owner), 'sm')}<span>Assigned to <b>${esc(l.owner === S.me ? 'You' : uname(l.owner))}</b></span></span>` : `<span><span class="chi c-red" style="width:22px;height:22px;flex-basis:22px">${ic('user', 13)}</span><b class="red">Unassigned</b></span>`;
    const ni = NEXT_IC(l.next) || ['clock', 'blue'];
    const body = `
      <section class="card ld-hero"><div class="ld-hd">${av(l.name, 'xl')}<div class="grow">
          <div class="row tight"><h2 class="ld-nm">${esc(l.name)}</h2>${chip(l.status)}${l.vq ? vtag() : ''}</div>
          <div class="ld-meta"><span class="num">${ic('phone', 14)}${esc(mob(l))}</span><span>${chIc(l.ch)}${esc(CH[l.ch].label)}</span>${owner}</div></div>${acts}</div>
        <div class="ld-stp">${steps}</div></section>
      <div class="ld-2"><div class="col loose">
        <section class="ld-vina" aria-labelledby="ld-vh"><div class="vh">${av('VINA', 'sm')}<h2 id="ld-vh">VINA summary</h2></div>
          <dl class="ld-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${txt(v)}</dd></div>`).join('')}</dl>
          <div class="ld-why"><b>Why VINA marked it qualified</b>${why ? `<p style="margin-top:4px">${esc(why)}</p><button type="button" class="btn ghost sm" data-a="ld-see-chat" data-x="${l.id}">${ic('conv', 14)}See those messages</button>` : `<p class="mute" style="margin-top:4px">VINA has not qualified this lead. ${l.status === 'new' ? 'VINA is still chatting with the customer.' : 'It was qualified by a person.'}</p>`}</div></section>
        ${reportCard({title:'History', right:`<div class="seg" role="group" aria-label="Show in history">${[['all','All'],['chats','Chats'],['calls','Calls'],['notes','Notes']].map(([k, t]) => `<button type="button" data-a="ld-h" data-x="${k}" aria-pressed="${s.h === k}">${t}</button>`).join('')}</div>`, body:`
          ${agent ? `<div class="ld-compose"><label class="sr" for="b-f-ld4note">Add a note for the team</label><textarea class="inp" placeholder="Add a note for the team, e.g. trade-in value agreed" ${nta}>${ntv}</textarea><div class="row"><span class="sp"></span><button type="button" class="btn sm" data-a="ld-note" data-x="${l.id}" ${(S.f.ld4note || '').trim() ? '' : 'disabled'}>${ic('note', 14)}Add note</button></div></div>` : ''}
          ${hs.length ? `<ol class="ld-tl">${hs.map(e => { const [i, c] = HI[e.t] || ['info','grey']; return `<li class="it ${e.fid ? flashCls(e.fid) : ''}"><span class="chi c-${c}">${ic(i, 15)}</span><div class="grow"><div class="row tight"><b class="small">${esc(e.title)}</b><span class="sp"></span><span class="xs mute">${esc(e.when)}</span></div><div class="xs mute">${esc(e.by)}</div>${e.body ? `<div class="bx">${txt(e.body)}</div>` : ''}</div></li>`; }).join('')}</ol>` : `<p class="small mute" style="padding:12px 0">Nothing of this kind yet.</p>`}`})}
      </div><div class="col loose">
        ${reportCard({title:'Next step', body:`<div class="ld-nx"><span class="chi c-${l.late ? 'red' : ni[1]} lg">${ic(ni[0], 18)}</span><div class="grow"><b>${esc(l.next)}</b>${l.td && l.status === 'testdrive' ? `<div class="xs mute" style="margin-top:2px">${esc(l.td.showroom)} showroom · ${esc(l.td.car)}</div>` : ''}${l.late ? `<div class="xs red b row tight" style="margin-top:4px;gap:6px">${pulse('red')}Waiting ${mins(l.wait)}, overdue</div>` : l.wait != null ? `<div class="xs mute" style="margin-top:2px">Customer waiting ${mins(l.wait)}</div>` : ''}</div></div>`})}
        ${reportCard({title:'Lead details', body:`<dl class="kv" style="margin:0">${[['Car model', l.model],['Trim', l.trim || '—'],['Colour', l.colour || '—'],['City', l.city],['Source', l.src],['Campaign', l.campaign],['Channel', CH[l.ch].label],['Language', l.lang],['Created', l.created]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`})}
        ${reportCard({title:'Customer rating', body:`${l.rating ? `<div class="row tight">${stars(l.rating, 18)}<b class="num">${l.rating} of 5</b></div>${l.ratingNote ? `<p class="small" style="margin-top:8px">"${esc(l.ratingNote)}"</p>` : ''}` : `<p class="small mute">No rating yet. VINA asks for 1 to 5 stars when the chat closes.</p>`}`})}
      </div></div>`;
    return shell({nav:'leads', title:l.name, crumb:back, body});
  }});
  A['ld-h'] = el => { F().h = el.dataset.x; };
  A['ld-note'] = el => { const l = lead(el.dataset.x), t = (S.f.ld4note || '').trim(); if (!t) return false; log(l, 'note', 'Note', t); l.h[0].fid = uid('h'); flash(l.h[0].fid); S.f.ld4note = ''; F().h = 'all'; toast('Note added to the history'); };
  A['ld-book'] = el => { openTD(el.dataset.x); };
  A['ld-send'] = el => { if (MODALS['send-sales']) openModal('send-sales', {id: el.dataset.x}); else { const to = sendToSales(lead(el.dataset.x), 'next', ''); toast('Sent to ' + uname(to)); } };
  A['ld-close1'] = el => { openClose(el.dataset.x); };
  A['ld-see-chat'] = el => { if (isAgent()) { S.f.agSel = el.dataset.x; go('inbox'); } else { S.f.m3sel = el.dataset.x; go('conversations'); } return false; };

  /* ---- LD5 statuses and shared parts (reference sheet) ---- */
  R('statuses', {id:'LD5', title:'Lead statuses', render() {
    const part = (title, sub, inner) => reportCard({title, sub, body: inner});
    const body = `${reportCard({title:'Statuses', sub:'In the order a lead moves. Chips always carry the word, so colour never carries the meaning alone.', cls:'rx-tbl', body:`<div class="tbl-wrap"><table class="tbl"><caption class="sr">Lead statuses</caption><thead><tr><th>Status</th><th>Means</th><th>Colour</th><th class="r">Leads now</th></tr></thead><tbody>${ST_ORDER.map(k => { const n = LEADS.filter(l => l.status === k).length; return `<tr><td>${chip(k)}</td><td class="small">${esc(STATUS[k].means)}</td><td><span class="row tight nowrap small" style="--c:var(--${STATUS[k].c}-f)"><span class="ld5-sw" aria-hidden="true"></span>${STATUS[k].colour}</span></td><td class="r num b" ${countAttr(n)}>${n}</td></tr>`; }).join('')}</tbody></table></div>`})}
      <div class="rx-g3">
        ${part('Buttons', 'One main action per area. Disabled buttons say why.', `<div class="ld-sw"><button type="button" class="btn pri" data-a="noop">Main action</button><button type="button" class="btn" data-a="noop">Other action</button><button type="button" class="btn ghost" data-a="noop">Link action</button><button type="button" class="btn danger-o" data-a="noop">Close lead</button><button type="button" class="btn" disabled title="Example of a button that cannot be used yet">Not yet</button></div>`)}
        ${part('Tags', 'View only marks pages a manager can see but not change.', `<div class="ld-sw">${vo()}${vtag()}<span class="pill c-teal">VINA team</span><span class="row tight nowrap small">${pulse()}Needs you now</span><span class="row tight nowrap small"><span class="unread-dot" aria-hidden="true"></span>Unread</span></div>`)}
        ${part('Who did it', 'Teal means VINA did it. Navy or blue means a person did it.', `<div class="ld-sw"><span class="row tight nowrap">${av('VINA')}<span class="small">VINA</span></span><span class="row tight nowrap">${av('Reem Al-Harbi')}<span class="small">A person</span></span><span class="evt teal">${ic('spark', 13)}VINA marked it qualified</span></div>`)}
        ${part('Channels', 'Icon plus name, the same on every screen.', `<div class="ld-sw">${Object.keys(CH).map(k => `<span class="row tight nowrap">${chIc(k, true)}<span class="small b">${CH[k].label}</span></span>`).join('')}</div>`)}
        ${part('Availability', 'Only available agents get new leads.', `<div class="ld-sw">${[['available','Available','green'],['busy','Busy','amber'],['away','Away','grey']].map(([k, t, c]) => `<span class="chip c-${c}"><span class="pres ${k}" style="width:8px;height:8px;border-radius:50%;display:inline-block"></span>${t}</span>`).join('')}</div>`)}
        ${part('Lost reasons', 'Asked for when a lead is closed as Lost. Not interested is its own result.', `<div class="fchips">${LOST_REASONS.map(r => chipC(r, 'grey')).join('')}</div>`)}
        ${part('Switches and ratings', '', `<div class="ld-sw">${sw(true, 'noop', '', 'Example switch on')}${sw(false, 'noop', '', 'Example switch off')}${stars(4, 16)}<span class="small mute">4 of 5</span></div>`)}
      </div>`;
    return shell({nav:'leads', title:'Lead statuses', crumb:[isAgent() ? 'My leads' : 'Leads', 'leads'], viewOnly:false, body});
  }});
})();
