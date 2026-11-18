/* AS1–AS5 · Lead routing: Qualifying, Rules, rule editor, Unassigned, assign or reassign. */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  .as-2{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);gap:20px;align-items:start}
  /* AS1 hero sentence */
  .as-hero{position:relative;border-radius:var(--r-l);padding:26px 28px 22px;background:radial-gradient(640px 220px at 0% 0%,color-mix(in srgb,var(--aqua) 26%,transparent),transparent 70%),linear-gradient(135deg,var(--teal-b),color-mix(in srgb,var(--teal-b) 25%,var(--card)));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--teal-f) 18%,transparent)}
  .as-hero .eyebrow{color:var(--teal-f);display:flex;align-items:center;gap:6px}
  .as-hero .verdict{margin:8px -8px 0;padding:2px 8px;border-radius:10px;max-width:68ch;color:var(--text)}
  .as-hero .verdict em{font-weight:700}
  .as-hero .meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
  .as-hero .meta span{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;background:color-mix(in srgb,var(--card) 70%,transparent);font-size:12px;font-weight:600;color:var(--mute)}
  .as-hero .meta b{color:var(--text);font-family:var(--f-display)}
  /* sticky Save / Cancel bar (leaves room for the prototype pill on the right) */
  .as-foot{position:sticky;bottom:16px;z-index:12;display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-inline-end:calc(max(280px,(100% - 20px) / 2.7) + 20px);padding:10px 12px 10px 18px;border-radius:var(--r-l);background:color-mix(in srgb,var(--card) 90%,transparent);backdrop-filter:saturate(1.4) blur(12px);-webkit-backdrop-filter:saturate(1.4) blur(12px);box-shadow:var(--e3);border:1px solid var(--line)}
  .as-foot .st{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--mute);min-width:0}
  .as-hero .verdict{font-size:20px;line-height:30px}
  .rc .as-rule{border:0;border-top:1px solid var(--line);border-radius:0;box-shadow:none;padding:14px 20px 14px 14px}
  .rc .as-rule:hover{box-shadow:none;background:var(--sub)}
  .rc .as-fixed{background:transparent;border-top:1px dashed var(--line2)}
  /* AS2 rule cards */
  .as-rule{position:relative;display:grid;grid-template-columns:18px 34px minmax(0,1fr) auto;gap:14px;align-items:center;padding:16px 14px 16px 12px;background:var(--card);border:1px solid var(--card-bd);border-radius:var(--r-l);box-shadow:var(--e1);transition:box-shadow var(--d2) var(--ease),opacity var(--d2)}
  .as-rule:hover{box-shadow:var(--e2)}
  .as-rule .grip{color:var(--faint);display:flex;justify-content:center;cursor:grab}
  .as-rule:hover .grip{color:var(--mute)}
  .as-rule .n{width:34px;height:34px;border-radius:10px;background:var(--navy-b);color:var(--navy-f);font-family:var(--f-display);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px}
  .as-rule.off .n{background:var(--sub);color:var(--faint)}
  .as-rule.off .main{opacity:.62}
  .as-nm{font-family:var(--f-display);font-size:14px;font-weight:700;color:var(--text);text-decoration:none}
  a.as-nm:hover{color:var(--link);text-decoration:underline}
  .as-flow{display:grid;grid-template-columns:auto minmax(0,1fr);gap:3px 12px;margin:8px 0 0;font-size:13px;align-items:baseline}
  .as-flow dt{font-size:12px;font-weight:600;letter-spacing:0;text-transform:none;color:var(--mute);display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
  .as-flow dd{margin:0;min-width:0}
  .as-flow dd .m{color:var(--mute)}
  .as-flow .k{font-size:12px;font-weight:600;letter-spacing:0;text-transform:none;color:var(--mute)}
  .as-flow .arr{color:var(--faint)}
  .as-flow .pr{display:inline-flex;align-items:baseline;gap:6px;white-space:nowrap}
  .as-sub{display:flex;flex-wrap:wrap;gap:2px 14px;margin-top:4px;font-size:12px;color:var(--mute);min-width:0}
  .as-sub b{color:var(--text);font-weight:600}
  .as-rule .act{display:flex;align-items:center;gap:16px}
  .as-wk{display:flex;flex-direction:column;align-items:flex-end;line-height:1.15;min-width:88px}
  .as-wk b{font-family:var(--f-display);font-size:20px;font-weight:700}
  .as-wk span{font-size:12px;color:var(--mute)}
  .as-mw{position:relative}
  .as-menu{top:40px;right:0;min-width:200px}
  .as-menu.again{animation:none}
  .as-menu button[disabled]{opacity:.42;cursor:not-allowed;background:transparent}
  .as-menu .dg{color:var(--red-f)}
  .as-menu .dg:hover{background:var(--red-b)}
  .as-fixed{grid-template-columns:18px 34px minmax(0,1fr) auto;background:var(--sub);box-shadow:none;border:1.5px dashed var(--line2)}
  .as-fixed:hover{box-shadow:none}
  .as-fixed .grip{cursor:default;color:var(--mute)}
  .as-fixed .n{background:var(--card);color:var(--mute)}
  .as-rule.flash{animation:asflash 1.2s var(--ease) 1}
  @keyframes asflash{from{background:var(--teal-b);box-shadow:0 0 0 2px var(--aqua),var(--e2)}}
  /* AS3 editor */
  .as-grp .card-h{align-items:flex-start;gap:14px}
  .as-step{width:28px;height:28px;flex:0 0 28px;border-radius:9px;background:var(--navy-b);color:var(--navy-f);font-family:var(--f-display);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
  .as-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:10px}
  .as-rd{width:18px;height:18px;flex:0 0 18px;border-radius:50%;border:2px solid var(--line2);margin-top:1px;transition:border-width var(--d2) var(--spring),border-color var(--d1)}
  [aria-checked="true"]>.as-rd{border:5px solid var(--pri)}
  .as-cond{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 10px;border-radius:10px;background:var(--sub)}
  .as-cond .j{font-size:12px;font-weight:600;color:var(--mute);text-transform:none;min-width:28px}
  .as-num{width:84px!important;text-align:center}
  .as-addc .inp{width:auto;flex:1 1 150px}
  /* AS4 */
  .as-av .li .grow{min-width:0}
  .as-av .li b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .as-ul .rc-h{flex-wrap:wrap;row-gap:8px}
  .as-ul .rc-h .grow{flex:1 1 220px}
  .as-avl{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--mute);text-decoration:none;white-space:nowrap}
  .as-avl b{color:var(--text);font-weight:600}
  .as-avl:hover{color:var(--link)}
  .as-late{display:inline-flex;align-items:center;gap:8px;color:var(--red-f);font-weight:700}
  /* AS5 dialog */
  .as5-lead{display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:var(--r-m);background:linear-gradient(135deg,var(--teal-b),color-mix(in srgb,var(--teal-b) 30%,var(--card)))}
  .as5-lead .sum{margin-top:6px;font-size:13px;display:flex;gap:6px;color:var(--teal-f)}
  .as5-list{display:flex;flex-direction:column;gap:6px;max-height:320px;overflow:auto;padding:2px;margin:-2px}
  .as5-list .eyebrow{padding:8px 2px 2px}
  .as-ag{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--card);cursor:pointer;text-align:start;color:var(--text);transition:border-color var(--d1),box-shadow var(--d2) var(--ease),background var(--d1)}
  .as-ag:hover{border-color:var(--line2);background:var(--sub)}
  .as-ag[aria-checked="true"]{border-color:var(--pri);box-shadow:0 0 0 1px var(--pri),0 6px 16px -10px var(--pri);background:var(--sel)}
  .as-ag .ld{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px;color:var(--mute)}
  .as-ag .ld b{font-family:var(--f-display);font-size:14px;color:var(--text)}
  .as-ag .ck{width:22px;height:22px;flex:0 0 22px;border-radius:50%;border:2px solid var(--line2);display:flex;align-items:center;justify-content:center;color:var(--on-pri);transition:background var(--d2),border-color var(--d2)}
  .as-ag[aria-checked="true"] .ck{background:var(--pri);border-color:var(--pri)}
  .as-sug{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:6px;font-size:12px;font-weight:700;background:var(--green-b);color:var(--green-f)}
  .as-q{display:flex;align-items:center;gap:8px;min-height:42px;padding:0 12px;border-radius:10px;border:1px solid var(--line2);background:var(--inp);color:var(--mute)}
  .as-q:focus-within{border-color:var(--horizon);box-shadow:0 0 0 4px var(--ring)}
  .as-q input{flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:14px;color:var(--text)}
  @media (max-width:1000px){.as-2{grid-template-columns:minmax(0,1fr)}.as-foot{margin-inline-end:64px}}
  @media (max-width:760px){
    .as-foot{margin-inline-end:124px;padding:8px 8px 8px 14px}
    .as-foot .st{display:none}
    .as-foot .btn{flex:1}
    .as-hero{padding:20px 18px 18px}
    .as-rule,.as-fixed{grid-template-columns:30px minmax(0,1fr);gap:10px 12px;padding:14px}
    .as-rule .grip{display:none}
    .as-rule .n{width:30px;height:30px}
    .as-rule>.act{grid-column:1/-1;justify-content:space-between;padding-top:10px;border-top:1px solid var(--line)}
    .as-wk{flex-direction:row;align-items:baseline;gap:6px}
    .as-k{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .as-k .kpi{padding:14px}
    .as-k .kpi .v{font-size:20px;line-height:28px}
  }
  </style>`);

  const G = {}; // UI-only flags: popNew (menu first paint), ret (trigger to refocus on Escape), focusIn, focusId
  const toggleMenu = (key, el) => { const was = S.menu === key; S.menu = was ? null : key; G.popNew = !was; G.focusIn = !was; G.ret = el && el.id; };
  const afterUi = () => {
    G.popNew = false;
    if (G.focusIn) { G.focusIn = false; const m = $('#app .menu'); const t = m && m.querySelector('button:not([disabled]),a[href]'); if (t) t.focus({preventScroll:true}); }
    if (G.focusId) { const e = document.getElementById(G.focusId); G.focusId = null; if (e && !S.modal) e.focus({preventScroll:true}); }
  };
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && G.ret && (document.activeElement === document.body || !document.activeElement)) { const e = document.getElementById(G.ret); G.ret = null; if (e) e.focus({preventScroll:true}); } });

  const WHEN = {qualified:'Lead becomes Qualified', callback:'Customer asks for a call', person:'Customer asks for a person'};
  const BY = {turns:['Take turns','Each agent in order'], least:['Least busy','Fewest open leads'], same:['Same agent as last time','For returning customers']};
  const toLabel = r => r.to === 'cc' ? 'Call centre team' : r.to === 'sales' ? 'Sales team · Madinah Road' : uname(r.agent);
  const onlyLabel = r => r.only.length ? r.only.map(([a, v]) => a + ': ' + v).join(' · ') : 'Any lead';
  const RULES = [
    {id:'r1', name:'Callbacks to call centre', when:'callback', only:[['Working hours','Inside']], to:'cc', by:'least', avail:true, max:20, mins:15, on:true, week:214},
    {id:'r2', name:'Qualified to Sales', when:'qualified', only:[['Car model','V27 2027'],['Car model','V27 2026'],['Car model','03T 2026'],['Channel','WhatsApp'],['Channel','Website chat']], to:'sales', by:'turns', avail:true, max:15, mins:15, on:true, week:318},
    {id:'r3', name:'Returning customers', when:'qualified', only:[['Customer','Talked to us before']], to:'sales', by:'same', avail:true, max:15, mins:15, on:true, week:41},
    {id:'r4', name:'After hours', when:'person', only:[['Working hours','Outside']], to:'cc', by:'least', avail:false, max:20, mins:15, on:true, week:37},
    {id:'r5', name:'Phone line leads', when:'qualified', only:[['Channel','Phone line']], to:'sales', by:'turns', avail:true, max:15, mins:15, on:false, week:0},
  ];
  // One row: the three views on the left, the page action (if any) on the right
  const tabs = (cur, act) => isVina() ? `<div class="rx-tbar"><nav class="tabs" aria-label="Lead routing">${[['qualify','Qualifying'],['rules','Rules'],['unassigned','Unassigned']].map(([k, t]) => `<a class="tab" href="#${k}" ${cur === k ? 'aria-selected="true" aria-current="page"' : ''}>${t}${k === 'unassigned' ? `<span class="n">${unassigned().length}</span>` : ''}</a>`).join('')}</nav><span class="sp"></span>${act ? `<span class="act">${act}</span>` : ''}</div>` : '';
  const agents = () => Object.keys(U).filter(k => ['cc','sales'].includes(U[k].role));
  const PRES_C = {available:['Available','green'], busy:['Busy','amber'], away:['Away','grey']};
  const presChip = k => { const s = U[k].status || 'available'; const m = PRES_C[s]; return `<span class="chip c-${m[1]}"><span class="pres ${s}" style="width:7px;height:7px;border-radius:50%;display:inline-block"></span>${m[0]}</span>`; };
  const availCard = () => reportCard({title:'Who is available now', sub:'Only available agents get new leads.', cls:'rx-tbl as-av', id:'as-avail', body:`<div class="list">${agents().map(k => `<div class="li"><span class="avw">${av(U[k].name)}<span class="pres ${U[k].status || 'available'}" aria-hidden="true"></span></span><span class="grow"><b class="small" title="${esc(U[k].name)}">${esc(U[k].name)}</b><div class="xs mute">${U[k].team}${U[k].showroom ? ' · ' + U[k].showroom : ''}</div></span><span class="xs mute num">${mineCount(k)} open</span>${presChip(k)}</div>`).join('')}</div>`});
  const availLine = () => { const n = {available:0, busy:0, away:0}; agents().forEach(k => n[U[k].status || 'available']++); return `<a class="as-avl" href="#rules" title="See who is available on Rules"><span class="pres available" aria-hidden="true" style="width:7px;height:7px;border-radius:50%;display:inline-block"></span><b>${n.available} available</b> · ${n.busy} busy · ${n.away} away${ic('arrowR', 14)}</a>`; };
  const foot = (status, btns) => `<div class="as-foot" role="region" aria-label="Save changes"><span class="st grow">${status}</span>${btns}</div>`;

  /* ---- AS1 ---- */
  const Q = () => S.f.as1 || (S.f.as1 = {
    req:{'Name':true, 'Mobile':true, 'Car model':true, 'City':false, 'Best time to call':false, 'Budget':false},
    sig:{'Asks for price or financing':true, 'Wants a test drive':true, 'Wants to visit the showroom':true, 'Asks to be called':true, 'Asks for a person':true, 'Asks about trade-in':false},
    never:['Outside our area','Wrong number','Job seekers','Spam'], add:'', saved:'Lina Haddad on Mon 2 Nov', dirty:false});
  const SIG_EX = {'Asks for price or financing':'كم سعرها؟ فيه تقسيط؟', 'Wants a test drive':'أبغى أجربها', 'Wants to visit the showroom':'وين موقعكم؟', 'Asks to be called':'اتصلوا علي الساعة ٥', 'Asks for a person':'أبغى أكلم موظف', 'Asks about trade-in':'تاخذون سيارتي القديمة؟'};
  const SIG_SAY = {'Asks for price or financing':'asks for price or financing', 'Wants a test drive':'asks for a test drive', 'Wants to visit the showroom':'wants to visit the showroom', 'Asks to be called':'asks to be called', 'Asks for a person':'asks for a person', 'Asks about trade-in':'asks about a trade-in'};
  const andList = (a, w) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' ' + w + ' ' + a[a.length - 1];
  const qLine = q => {
    const req = Object.keys(q.req).filter(k => q.req[k]).map(k => k.toLowerCase());
    const sig = Object.keys(q.sig).filter(k => q.sig[k]).map(k => SIG_SAY[k]);
    if (!req.length) return 'Tick at least one detail VINA must have before a lead can be qualified.';
    return `A lead is qualified when we have <em>${esc(andList(req, 'and'))}</em>${sig.length ? `, and the customer <em>${esc(andList(sig, 'or'))}</em>` : `, but <strong>no buying signal is ticked, so VINA will never qualify a lead</strong>`}.`;
  };
  R('qualify', {id:'AS1', title:'Qualifying', roles:['vina'], render() {
    const q = Q(); const reqN = Object.values(q.req).filter(Boolean).length; const sigN = Object.values(q.sig).filter(Boolean).length;
    const body = `${tabs('qualify')}
      <section class="as-hero" aria-label="When a lead is qualified, in one line"><p class="verdict ${flashCls('as1-line')}" aria-live="polite" style="margin-top:0">${qLine(q)}</p></section>
      <div class="as-2"><div class="col loose">
        ${reportCard({title:'Details VINA must have', sub:'VINA asks for these in the chat before the lead can be qualified.', body:`<div class="g3" style="gap:4px 16px">${Object.keys(q.req).map(k => `<label class="chk"><input type="checkbox" data-ch="as1-req" data-x="${esc(k)}" ${q.req[k] ? 'checked' : ''}>${esc(k)}</label>`).join('')}</div>${!reqN ? `<div class="note err" style="margin-top:10px">${ic('alert')}<span>Tick at least one detail.</span></div>` : ''}`})}
        ${reportCard({title:'Buying signals', sub:'Any one of these is enough.', body:`<div class="col tight">${Object.keys(q.sig).map(k => `<label class="chk"><input type="checkbox" data-ch="as1-sig" data-x="${esc(k)}" ${q.sig[k] ? 'checked' : ''}><span class="grow"><b class="small">${esc(k)}</b><div class="xs mute">For example: <span dir="rtl" class="ar">${esc(SIG_EX[k])}</span></div></span></label>`).join('')}</div>${!sigN ? `<div class="note warn" style="margin-top:10px">${ic('alert')}<span>Without a buying signal, VINA will never qualify a lead.</span></div>` : ''}`})}
        ${reportCard({title:'Never qualify', sub:'VINA closes these politely or sends them elsewhere.', body:`
          <div class="tokens">${q.never.map((n, i) => `<span class="tok">${esc(n)}<button type="button" data-a="as1-rm" data-x="${i}" aria-label="Remove ${esc(n)}">${ic('x', 13)}</button></span>`).join('')}<form data-a="as1-add" style="flex:1;display:flex;min-width:160px"><label class="sr" for="b-f-as1-add">Add a topic VINA should never qualify</label><input ${bind('f.as1.add')} placeholder="Add, e.g. Service and repairs"></form></div>`})}
      </div><div class="col loose">
        ${reportCard({title:'Last 7 days with these settings', body:`<div class="row tight" style="align-items:baseline">${mic('qualified')}<span class="num" style="font-family:var(--f-display);font-size:28px;font-weight:700" ${countAttr(612)}>612</span><span class="small mute">qualified of 2,436 chats</span></div><div class="bar-h" style="margin:10px 0 14px"><i style="width:25%;background:var(--aqua)"></i></div>
          <div class="list">${[['Asked for price or financing',268],['Wanted a test drive',151],['Asked to be called',119],['Asked for a person',74]].map(([k, v]) => `<div class="li small"><span class="grow">${k}</span><b class="num">${v}</b></div>`).join('')}</div>`})}
      </div></div>
      ${foot(q.dirty ? `${pulse()}<span>Unsaved changes</span>` : `<span class="ell">Last changed by ${esc(q.saved)}</span>`, `<button type="button" class="btn" data-a="as1-reset" ${q.dirty ? '' : 'disabled title="Nothing to undo"'}>Cancel</button><button type="button" class="btn pri" data-a="as1-save" ${q.dirty && reqN ? '' : `disabled title="${reqN ? 'No changes to save' : 'Tick at least one detail first'}"`}>Save</button>`)}`;
    return shell({nav:'qualify', title:'Lead routing', cp:true, viewOnly:false, body});
  }});
  A['as1-req'] = el => { Q().req[el.dataset.x] = el.checked; Q().dirty = true; flash('as1-line'); };
  A['as1-sig'] = el => { Q().sig[el.dataset.x] = el.checked; Q().dirty = true; flash('as1-line'); };
  A['as1-rm'] = el => { Q().never.splice(Number(el.dataset.x), 1); Q().dirty = true; };
  A['as1-add'] = () => { const q = Q(), v = (q.add || '').trim(); if (!v) return false; q.never.push(v); q.add = ''; q.dirty = true; };
  A['as1-reset'] = () => { S.f.as1 = null; flash('as1-line'); };
  A['as1-save'] = () => { const q = Q(); q.dirty = false; q.saved = meName() + ', ' + nowStr().toLowerCase(); toast('Saved. New chats use these settings from now on.'); };

  /* ---- AS2 ---- */
  function ruleRow(r, i) {
    const open = S.menu === 'as:' + r.id;
    return `<article class="as-rule ${r.on ? '' : 'off'} ${flashCls(r.id)}" draggable="true" data-drag="rule" data-x="${r.id}" data-drop="as-drop" aria-label="Rule ${i + 1}, ${esc(r.name)}${r.on ? '' : ', off'}">
      <span class="grip" title="Drag to change the order" aria-hidden="true">${ic('grip', 16)}</span>
      <span class="n num" aria-hidden="true">${i + 1}</span>
      <div class="main" style="min-width:0"><div class="row tight"><a class="as-nm" href="#rule-${r.id}">${esc(r.name)}</a>${r.on ? '' : chipC('Off', 'grey', true)}</div>
        <dl class="as-flow"><dt>When</dt><dd>${WHEN[r.when]}</dd><dt>${ic('arrowR', 11)}Send to</dt><dd>${esc(toLabel(r))}<span class="m"> · choose agent by </span>${BY[r.by][0]}</dd><dt>Only if</dt><dd class="ell mute" title="${esc(onlyLabel(r))}">${esc(onlyLabel(r))}</dd></dl></div>
      <div class="act">
        <div class="as-wk"><b class="num">${r.week ? num(r.week) : '—'}</b><span>${r.week ? 'leads this week' : 'Not used yet'}</span></div>
        ${sw(r.on, 'as-on', r.id, (r.on ? 'Turn off ' : 'Turn on ') + r.name)}
        <span class="as-mw"><button type="button" class="ibtn sm bare" id="asm-${r.id}" data-a="as-menu" data-x="${r.id}" aria-haspopup="menu" aria-expanded="${open}" aria-label="More for ${esc(r.name)}" title="Edit, move or delete">${ic('more', 18)}</button>
        ${open ? `<div class="menu as-menu ${G.popNew ? '' : 'again'}" role="menu" aria-label="${esc(r.name)}">
          <a role="menuitem" href="#rule-${r.id}">${ic('edit', 15)}Edit</a>
          <button type="button" role="menuitem" data-a="as-mv" data-x="${r.id}:-1" ${i === 0 ? 'disabled' : ''}>${ic('chevU', 15)}Move up</button>
          <button type="button" role="menuitem" data-a="as-mv" data-x="${r.id}:1" ${i === RULES.length - 1 ? 'disabled' : ''}>${ic('chevD', 15)}Move down</button>
          <div class="hr" style="margin:4px 0"></div>
          <button type="button" role="menuitem" class="dg" data-a="as-del" data-x="${r.id}">${ic('trash', 15)}Delete rule</button></div>` : ''}</span>
      </div>
    </article>`;
  }
  R('rules', {id:'AS2', title:'Rules', roles:['vina'], render() {
    const un = unassigned().length;
    const body = `${tabs('rules', `<a class="btn pri" href="#rule-new">${ic('plus', 15)}New rule</a>`)}
      <div class="as-2"><section class="card rc rx-tbl" aria-label="Rules in order"><header class="rc-h"><div class="grow"><h2>Rules in order</h2><div class="sub">The top rule is checked first. Drag to change the order.</div></div></header><div class="rc-b">${RULES.map(ruleRow).join('')}
        <article class="as-rule as-fixed" aria-label="Last rule, Everything else goes to Unassigned. Always last."><span class="grip" aria-hidden="true">${ic('lock', 15)}</span><span class="n num" aria-hidden="true">${RULES.length + 1}</span>
          <div class="main" style="min-width:0"><div class="row tight"><b class="as-nm">Everything else goes to Unassigned</b><span class="chip c-grey">${ic('lock', 11)}Always last</span></div><div class="xs mute" style="margin-top:6px">It cannot be moved, turned off or deleted. The manager sees these leads and the VINA team assigns them by hand.</div></div>
          <div class="act"><a class="btn sm" href="#unassigned">${un ? pulse() : ''}${un} waiting${ic('arrowR', 14)}</a></div></article>
      </div></section><div class="col loose">${availCard()}
        ${reportCard({title:'For every rule', body:`<div class="col tight small"><div class="sw-row">${ic('check', 16, 'green')}<span>Only give leads to agents who are <b>Available</b></span></div><div class="sw-row">${ic('check', 16, 'green')}<span>Not opened within <b>15 minutes</b>: give it to the next agent and alert the manager</span></div><div class="sw-row">${ic('check', 16, 'green')}<span>Outside working hours: keep until 9 AM, then assign</span></div></div>`})}
      </div></div>`;
    return shell({nav:'rules', title:'Lead routing', cp:true, viewOnly:false, body});
  }, after: afterUi});
  A['as-menu'] = el => { toggleMenu('as:' + el.dataset.x, el); };
  A['as-on'] = el => { const r = RULES.find(x => x.id === el.dataset.x); r.on = !r.on; toast(`"${r.name}" is ${r.on ? 'on' : 'off'}`); };
  const moveRule = (id, to) => { const i = RULES.findIndex(r => r.id === id); if (i < 0 || to < 0 || to >= RULES.length) return false; const [r] = RULES.splice(i, 1); RULES.splice(to, 0, r); flash(r.id); toast(`"${r.name}" is now rule ${to + 1}`, () => { const j = RULES.indexOf(r); RULES.splice(j, 1); RULES.splice(i, 0, r); flash(r.id); }); };
  A['as-mv'] = el => { const [id, d] = el.dataset.x.split(':'); S.menu = null; G.ret = null; if (moveRule(id, RULES.findIndex(r => r.id === id) + Number(d)) !== false) G.focusId = 'asm-' + id; };
  A['as-drop'] = (t, d) => d.kind === 'rule' && d.id !== t.dataset.x ? moveRule(d.id, RULES.findIndex(r => r.id === t.dataset.x)) : false;
  A['as-del'] = el => { S.menu = null; G.ret = null; const i = RULES.findIndex(r => r.id === el.dataset.x); const [r] = RULES.splice(i, 1); toast(`Rule "${r.name}" deleted`, () => { RULES.splice(i, 0, r); flash(r.id); }); };

  /* ---- AS3 ---- */
  const COND = {'Car model':MODELS, 'Source':SOURCES, 'Channel':Object.values(CH).map(c => c.label), 'City':['Jeddah','Makkah','Taif'], 'Language':['Arabic','English'], 'Working hours':['Inside','Outside']};
  const blank = () => ({id:'', name:'', when:'qualified', only:[], to:'sales', agent:'majed', by:'turns', avail:true, max:15, mins:15, on:true, week:0});
  function E(param) {
    if (!S.f.as3 || S.f.as3.key !== param) { const r = param === 'new' ? blank() : RULES.find(x => x.id === param); if (!r) return null; const d = JSON.parse(JSON.stringify(r)); if (!d.agent) d.agent = 'majed'; S.f.as3 = {key:param, d, orig:JSON.stringify(d), ca:'Car model', cv:MODELS[0], err:''}; }
    return S.f.as3;
  }
  const radio = (grp, k, t, d, cur) => `<button type="button" class="radio-card" role="radio" aria-checked="${cur === k}" data-a="as3-set" data-x="${grp}:${k}"><span class="as-rd" aria-hidden="true"></span><span class="grow"><b class="small">${t}</b>${d ? `<div class="xs mute">${d}</div>` : ''}</span></button>`;
  const grp = (n, t, sub, inner) => reportCard({title:t, sub, body:`<div class="col loose">${inner}</div>`});
  R('rule', {id:'AS3', title:'Rule editor', roles:['vina'], render(param) {
    const e = E(param);
    if (!e) return shell({nav:'rules', title:'Rule', crumb:['Lead routing','rules'], cp:true, viewOnly:false, body:`<div class="card">${empty('route', 'We could not find this rule', 'It may have been deleted.', `<a class="btn pri" href="#rules">Back to rules</a>`)}</div>`});
    const d = e.d; const team = agents().filter(k => d.to === 'one' ? k === d.agent : U[k].role === d.to);
    const pool = team.filter(k => !d.avail || U[k].status !== 'away'); const wts = pool.map((k, i) => d.by === 'least' ? 1 / (1 + mineCount(k)) : 1 + (i === 0 ? .2 : 0)); const tot = wts.reduce((a, b) => a + b, 0) || 1;
    const sim = team.map(k => { const i = pool.indexOf(k); const share = i < 0 ? 0 : wts[i] / tot; return [k, Math.round(share * (d.week || 318)), Math.round(share * 100)]; });
    const dirty = JSON.stringify(d) !== e.orig;
    const body = `<div class="as-2"><div class="col loose">
      ${grp(1, 'Name', 'So the team knows why a lead came to them.', `<div class="field"><label for="b-f-as3-d-name">Rule name</label><input class="inp ${e.err ? 'bad' : ''}" ${bind('f.as3.d.name')} placeholder="e.g. Qualified to Sales" aria-describedby="as3-err" aria-invalid="${!!e.err}">${e.err ? `<span class="err" id="as3-err">${ic('alert', 14)}${esc(e.err)}</span>` : ''}</div>`)}
      ${grp(2, 'Which leads', 'When the rule starts, and the leads it applies to.', `
        <div class="field"><span class="lbl" id="as3-when">When</span><div class="as-opts" role="radiogroup" aria-labelledby="as3-when">${Object.keys(WHEN).map(k => radio('when', k, WHEN[k], '', d.when)).join('')}</div></div>
        <details class="rx-more" ${S.f.as3open ? 'open' : ''}><summary data-a="as3-more">${ic('chevD', 14)}Only if (optional)<span class="m">${d.only.length ? '· ' + d.only.length + (d.only.length === 1 ? ' condition' : ' conditions') : '· any lead'}</span></summary><div class="in"><div class="field">
          ${d.only.length ? `<div class="col tight">${d.only.map(([a, v], i) => `<div class="as-cond"><span class="j">${i ? 'And' : 'If'}</span><b class="small">${esc(a)}</b><span class="small mute">is</span>${chipC(v, 'blue')}<span class="sp"></span><button type="button" class="ibtn sm bare" data-a="as3-rm" data-x="${i}" aria-label="Remove condition ${esc(a)} is ${esc(v)}">${ic('x', 15)}</button></div>`).join('')}</div>` : `<p class="small mute">No conditions. The rule applies to every lead.</p>`}
          <div class="row tight as-addc"><label class="sr" for="b-f-as3-ca">Condition</label>${bindSel('f.as3.ca', Object.keys(COND))}<label class="sr" for="b-f-as3-cv">Value</label>${bindSel('f.as3.cv', COND[e.ca] || [])}<button type="button" class="btn sm" data-a="as3-add" style="min-height:42px">${ic('plus', 14)}Add condition</button></div></div></div></details>`)}
      ${grp(3, 'Who gets them', 'The team or person, and how the agent is chosen.', `
        <div class="field"><span class="lbl" id="as3-to">Send to</span><div class="as-opts" role="radiogroup" aria-labelledby="as3-to">${radio('to', 'cc', 'Call centre team', agents().filter(k => U[k].role === 'cc').length + ' agents', d.to)}${radio('to', 'sales', 'Sales team', 'Madinah Road · ' + agents().filter(k => U[k].role === 'sales').length + ' agents', d.to)}${radio('to', 'one', 'One agent', 'Pick a name', d.to)}</div>
          ${d.to === 'one' ? `<label class="sr" for="b-f-as3-d-agent">Agent</label>${bindSel('f.as3.d.agent', agents().map(k => [k, U[k].name + ' · ' + U[k].team]))}` : ''}</div>
        ${d.to !== 'one' ? `<div class="field"><span class="lbl" id="as3-by">Choose the agent by</span><div class="as-opts" role="radiogroup" aria-labelledby="as3-by">${Object.keys(BY).map(k => radio('by', k, BY[k][0], BY[k][1], d.by)).join('')}</div></div>` : ''}
        <div class="sw-row">${sw(d.avail, 'as3-avail', '', 'Only agents who are available')}<span class="small b">Only agents who are available</span></div>
        <div class="row"><label class="small b" for="b-f-as3-d-max">Most open leads per agent</label><input class="inp as-num num" type="number" min="1" max="99" ${bind('f.as3.d.max')}></div>`)}
      ${grp(4, 'If nobody picks it up', 'So no customer is left waiting.', `
        <div class="note">${ic('info')}<span><b>If nobody is available:</b> keep the lead in Unassigned and alert the manager.</span></div>
        <div class="row"><label class="small b" for="b-f-as3-d-mins">Not opened within</label><input class="inp as-num num" type="number" min="1" max="240" ${bind('f.as3.d.mins')}><span class="small">minutes: give it to the next agent and alert the manager</span></div>`)}
      </div>
      <div class="col loose">
        ${reportCard({title:'If this rule ran last week', sub:`Based on the ${num(d.week || 318)} leads it would have matched.`, body:`<div class="col">${sim.map(([k, v, w]) => `<div><div class="row small"><span class="grow b">${esc(U[k].name)}</span><span class="num">${num(v)} leads</span></div><div class="bar-h" style="margin-top:6px"><i style="width:${w}%;background:var(--ch-a)"></i></div>${U[k].status === 'away' && d.avail ? '<div class="xs mute" style="margin-top:4px">Away today, so gets no leads</div>' : ''}</div>`).join('') || '<p class="small mute">Nobody in this team yet.</p>'}</div>`})}
        ${reportCard({title:'History', body:`<p class="small mute">${param === 'new' ? 'New rule. Saved with your name and the time.' : 'Changed by Lina Haddad on Mon 2 Nov: most open leads from 20 to 15.'}</p>${param !== 'new' ? `<div class="hr" style="margin:14px 0"></div><button type="button" class="btn sm danger-o" data-a="as3-del">${ic('trash', 14)}Delete rule</button>` : ''}`})}
      </div></div>
      ${foot(dirty ? `${pulse()}<span>Unsaved changes</span>` : `<span>${param === 'new' ? 'New rule' : 'No changes yet'}</span>`, `<button type="button" class="btn" data-a="as3-cancel">Cancel</button><button type="button" class="btn pri" data-a="as3-save">${ic('check', 15)}Save rule</button>`)}`;
    return shell({nav:'rules', title: param === 'new' ? 'New rule' : 'Edit rule', crumb:['Lead routing','rules'], cp:true, viewOnly:false, body});
  }});
  A['as3-more'] = (el, ev) => { if (ev) ev.preventDefault(); S.f.as3open = !S.f.as3open; };
  A['as3-set'] = el => { const [g, k] = el.dataset.x.split(':'); S.f.as3.d[g] = k; };
  A['as3-avail'] = () => { S.f.as3.d.avail = !S.f.as3.d.avail; };
  A['as3-rm'] = el => { S.f.as3.d.only.splice(Number(el.dataset.x), 1); };
  A['as3-add'] = () => { const e = S.f.as3; const v = (COND[e.ca] || []).includes(e.cv) ? e.cv : COND[e.ca][0]; if (e.d.only.some(([a, b]) => a === e.ca && b === v)) return false; e.d.only.push([e.ca, v]); };
  A['as3-save'] = () => {
    const e = S.f.as3, d = e.d; d.name = (d.name || '').trim();
    if (!d.name) { e.err = 'Give the rule a name, so the team knows why a lead came to them.'; window.scrollTo({top:0, behavior:'smooth'}); return; }
    if (RULES.some(r => r.name.toLowerCase() === d.name.toLowerCase() && r.id !== d.id)) { e.err = 'Another rule already has this name.'; window.scrollTo({top:0, behavior:'smooth'}); return; }
    d.max = Math.max(1, Number(d.max) || 15); d.mins = Math.max(1, Number(d.mins) || 15);
    if (e.key === 'new') { d.id = uid('r'); RULES.push(d); } else { const i = RULES.findIndex(r => r.id === e.key); RULES[i] = d; }
    flash(d.id); S.f.as3 = null; go('rules'); setTimeout(() => toast(`Rule "${d.name}" saved by ${meName()}`), 0); return false;
  };
  A['as3-cancel'] = () => { const e = S.f.as3; if (e && JSON.stringify(e.d) !== e.orig) { openModal('as-discard'); return; } S.f.as3 = null; go('rules'); return false; };
  A['as3-del'] = () => { const e = S.f.as3; const i = RULES.findIndex(r => r.id === e.key); const [r] = RULES.splice(i, 1); S.f.as3 = null; go('rules'); setTimeout(() => toast(`Rule "${r.name}" deleted`, () => { RULES.splice(i, 0, r); flash(r.id); }), 0); return false; };
  MODALS['as-discard'] = () => modalFrame('Throw away your changes?', `<p class="small">You changed this rule but did not save it. If you leave now, your changes are lost.</p>`, `<button type="button" class="btn" data-a="close-modal">Keep editing</button><button type="button" class="btn danger" data-a="as-discard-ok">Throw away changes</button>`, {size:'narrow'});
  A['as-discard-ok'] = () => { S.modal = null; S.f.as3 = null; go('rules'); return false; };

  /* ---- AS4 ---- */
  R('unassigned', {id:'AS4', title:'Unassigned leads', roles:['manager','vina'], states:[['empty','No unassigned leads'],['loading','Loading']], render() {
    const rs = S.st === 'empty' ? [] : unassigned().slice().sort((a, b) => (b.wait || 0) - (a.wait || 0));
    const longest = rs[0]; const late = rs.filter(l => l.late).length;
    const stats = [
      kpi({mini:true, k:'Waiting now', v:String(rs.length), n: late ? `${late} overdue, waiting over 15 minutes` : 'Leads not given to anyone', hot: late > 0}),
      kpi({mini:true, k:'Longest wait', v: longest ? mins(longest.wait) : '—', n: longest ? esc(longest.name) : 'Nobody waiting'}),
      kpi({k:'No agent available', v:String(rs.filter(l => /no salesperson|Most open|outside working/i.test(l.unWhy || '')).length), n:'All agents busy, off or full', mini:true}),
      kpi({k:'No rule matched', v:String(rs.filter(l => /No rule/i.test(l.unWhy || '')).length), n:'For example Phone line leads', mini:true})];
    const table = S.st === 'loading' ? `<div style="padding:16px">${loadingRows(6, 56)}</div>` : !rs.length ? empty('check', 'Every lead has an agent', 'When no rule can place a lead, it waits here and the manager gets an alert.')
      : `<div class="tbl-wrap"><table class="tbl"><caption class="sr">Unassigned leads, longest wait first</caption><thead><tr><th>Customer</th><th>Car model</th><th>${ic('spark', 12, 'teal')} VINA summary</th><th>Why it is here</th><th>Waiting</th>${isVina() ? '<th><span class="sr">Assign</span></th>' : ''}</tr></thead><tbody>${rs.map(l => `<tr class="${flashCls(l.id)}">
        <td><a href="#lead-${l.id}" class="who" style="text-decoration:none;color:inherit">${av(l.name, 'sm')}<span style="min-width:0"><span class="nm ell" style="display:block">${esc(l.name)}</span><span class="xs mute num" style="display:block">${esc(mob(l))}</span></span></a></td>
        <td><div class="row tight nowrap" style="white-space:nowrap">${chIc(l.ch)}<b>${esc(l.model)}</b></div></td><td><div class="small ell2" style="min-width:220px;max-width:380px" title="${esc(l.summary)}">${esc(l.summary)}</div></td><td class="small mute" style="min-width:180px;max-width:280px">${esc(l.unWhy || 'No rule matched')}</td>
        <td class="num" style="white-space:nowrap">${l.late ? `<span class="as-late">${pulse('red')}${mins(l.wait)}</span><div class="xs red">Overdue</div>` : `<span class="mute">${mins(l.wait)}</span>`}</td>${isVina() ? `<td class="r"><button type="button" class="btn sm" data-a="as-assign" data-x="${l.id}" aria-label="Assign ${esc(l.name)}">${ic('user', 14)}Assign</button></td>` : ''}</tr>`).join('')}</tbody></table></div>`;
    const body = `${tabs('unassigned')}${reportCard({title:'Waiting for an agent', body:`<div class="g4 as-k">${stats.join('')}</div>`})}
      ${reportCard({title:'Unassigned leads', sub: isMgr() ? 'The VINA team has been told and gives these leads to an agent by hand.' : 'Longest wait first.', cls:'rx-tbl as-ul', right: isVina() && rs.length ? availLine() : '', body: table})}`;
    return shell({nav:'unassigned', title: isVina() ? 'Lead routing' : 'Unassigned leads', crumb: isMgr() ? ['Leads','leads'] : null, cp:true, viewOnly: isMgr(), body});
  }});
  A['as-assign'] = el => { openAssign(el.dataset.x); };

  /* ---- AS5 ---- */
  function openAssign(id) { const l = lead(id); S.f.asg = {q:'', to:'', note:'', reason:'', err:''}; openModal('assign', {lead:id, re: !!(l.owner && l.owner !== 'vina')}); }
  AFTER.assign = () => { const l = unassigned()[0] || LEADS[0]; openAssign(l.id); };
  const REASONS = ['Agent is off today','Agent is busy with other leads','Customer asked for someone else','Wrong team','Other'];
  MODALS.assign = m => {
    const l = lead(m.lead), a = S.f.asg; const q = (a.q || '').toLowerCase();
    const list = agents().filter(k => k !== l.owner && (!q || U[k].name.toLowerCase().includes(q) || U[k].team.toLowerCase().includes(q)));
    const best = list.filter(k => (U[k].status || 'available') === 'available').sort((x, y) => mineCount(x) - mineCount(y))[0];
    const [ta, tv] = bindTa('f.asg.note');
    const row = k => `<button type="button" class="as-ag" role="radio" aria-checked="${a.to === k}" data-a="as-pick" data-x="${k}"><span class="avw">${av(U[k].name)}<span class="pres ${U[k].status || 'available'}" aria-hidden="true"></span></span><span class="grow" style="min-width:0"><span class="row tight nowrap"><b class="small ell">${esc(U[k].name)}</b>${k === best ? '<span class="as-sug">Least busy</span>' : ''}</span><span class="xs mute" style="display:block">${U[k].team}${U[k].showroom ? ' · ' + U[k].showroom : ''} · ${PRES_C[U[k].status || 'available'][0]}</span></span><span class="ld"><b class="num">${mineCount(k)}</b>open now</span><span class="ck" aria-hidden="true">${a.to === k ? ic('check', 13) : ''}</span></button>`;
    const groups = [['cc','Call centre'],['sales','Sales']].map(([r, t]) => { const g = list.filter(k => U[k].role === r); return g.length ? `<div class="eyebrow" role="presentation">${t}</div>${g.map(row).join('')}` : ''; }).join('');
    return modalFrame(m.re ? 'Reassign lead' : 'Assign lead', `
      <div class="as5-lead">${av(l.name, 'lg')}<div class="grow" style="min-width:0"><div class="row tight"><b>${esc(l.name)}</b>${chip(l.status)}</div><div class="xs mute" style="margin-top:2px">${esc(l.model)} · ${esc(CH[l.ch].label)}${l.wait != null ? ' · waiting ' + mins(l.wait) : ''}</div><div class="sum">${ic('spark', 14)}<span>${esc(l.summary)}</span></div></div></div>
      ${m.re ? `<p class="small">Now with <b>${esc(uname(l.owner))}</b>.</p>` : ''}
      <label class="as-q">${ic('search', 16)}<span class="sr">Search agents</span><input type="search" placeholder="Search agents by name or team" ${bind('f.asg.q', true)}></label>
      <div class="as5-list" role="radiogroup" aria-label="Agent">${groups || `<p class="small mute" style="padding:8px 2px">No agent matches "${esc(a.q)}".</p>`}</div>
      ${a.to && U[a.to].status !== 'available' ? `<div class="note warn">${ic('alert')}<span>${esc(first(a.to))} is ${U[a.to].status}. They get the alert when they are back.</span></div>` : ''}
      ${m.re ? `<div class="field"><label for="b-f-asg-reason">Why are you reassigning it?</label>${bindSel('f.asg.reason', [['', 'Pick a reason']].concat(REASONS))}</div>` : ''}
      <div class="field"><label for="b-f-asg-note">Note for the agent (optional)</label><textarea class="inp" placeholder="e.g. Wants a call after 6 PM" ${ta} style="min-height:64px">${tv}</textarea></div>
      ${a.err ? `<div class="note err" role="alert">${ic('alert')}<span>${esc(a.err)}</span></div>` : ''}`,
      `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="as-assign-ok">${a.to ? (m.re ? 'Reassign to ' : 'Assign to ') + esc(first(a.to)) : (m.re ? 'Reassign' : 'Assign')}</button>`, {sub: 'The agent gets an alert, and the lead history says who gave it to them.'});
  };
  A['as-pick'] = el => { S.f.asg.to = el.dataset.x; S.f.asg.err = ''; };
  A['as-assign-ok'] = () => {
    const m = S.modal, a = S.f.asg, l = lead(m.lead);
    if (!a.to) { a.err = 'Pick the agent who should get this lead.'; return; }
    if (m.re && !a.reason) { a.err = 'Pick a reason. It is saved in the lead history.'; return; }
    assignLead(l, a.to, 'by VINA support', m.re ? a.reason : '');
    // core log() takes (l, t, title, body, by): set the entry's fields explicitly
    const e = l.h[0]; e.by = 'by VINA support'; e.body = [m.re ? 'Reason: ' + a.reason : '', a.note.trim() ? 'Note: ' + a.note.trim() : ''].filter(Boolean).join(' · ');
    delete l.unWhy; S.modal = null; flash(l.id);
    toast(`${l.name} given to ${uname(a.to)}`);
  };
  window.openAssign = openAssign;
})();
