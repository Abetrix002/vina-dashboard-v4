/* Control panel · connections, users, settings, plan (C1–C6, U1, U2, ST1, B1). VINA team only for now. */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  /* C1 channel cards */
  .cp-cards{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))}
  .card.cp-ch{display:flex;flex-direction:column;gap:16px;padding:20px}
  .card.cp-ch.warn{background:linear-gradient(180deg,var(--red-b),var(--card) 46%);box-shadow:var(--e1),inset 0 0 0 1.5px color-mix(in srgb,var(--red-f) 50%,transparent)}
  .card.cp-ch.warn:hover{box-shadow:var(--e2),inset 0 0 0 1.5px color-mix(in srgb,var(--red-f) 50%,transparent)}
  .cp-ch .hd{display:flex;align-items:flex-start;gap:12px}
  .cp-ch .hd h2{font-size:16px}
  .cp-ch .kv{grid-template-columns:auto 1fr;padding:12px 14px;border-radius:12px;background:var(--sub);gap:7px 14px}
  .cp-ch .ft{display:flex;align-items:flex-end;gap:10px;margin-top:auto;padding-top:14px;border-top:1px solid var(--line)}
  .cp-ans{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}
  .cp-ans .l{font-size:12px;font-weight:600;color:var(--mute)}
  .cp-ans .w{display:flex;align-items:center;gap:8px}
  .cp-ans select.inp{min-height:36px;height:36px;font-size:13px}
  .cp-vav{width:26px;height:26px;flex:0 0 26px;font-size:11px}
  .cp-chip-wait{position:relative;overflow:hidden}
  .cp-chip-wait::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent) 0 0/50% 100% no-repeat;animation:cp-shim 2s ease-in-out infinite;animation-delay:var(--ph,0ms)}
  .cp-mgr{display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;background:var(--card);box-shadow:var(--e1)}

  /* C2–C5 vertical numbered progress */
  .cp-vs{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
  .cp-vs>li{position:relative;display:grid;grid-template-columns:32px minmax(0,1fr);gap:16px;padding-bottom:26px}
  .cp-vs>li:last-child{padding-bottom:0}
  .cp-vs>li::before{content:"";position:absolute;inset-inline-start:15px;top:38px;bottom:6px;width:2px;border-radius:2px;background:var(--line)}
  .cp-vs>li:last-child::before{display:none}
  .cp-vs>li.s-done::before{background:color-mix(in srgb,var(--green-f) 40%,transparent)}
  .cp-nd{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 13px var(--f-display);background:var(--sub);color:var(--mute);box-shadow:inset 0 0 0 1px var(--line2)}
  .s-num>.cp-nd{background:var(--sel);color:var(--link);box-shadow:none}
  .s-done>.cp-nd{background:var(--green-b);color:var(--green-f);box-shadow:none}
  .s-cur>.cp-nd{background:var(--pri);color:var(--on-pri);box-shadow:0 0 0 4px var(--ring)}
  .s-act>.cp-nd{background:var(--red-b);color:var(--red-f);box-shadow:0 0 0 4px color-mix(in srgb,var(--red-f) 18%,transparent)}
  .s-wait>.cp-nd{background:var(--amber-b);color:var(--amber-f);box-shadow:none}
  .enter .s-done>.cp-nd .ic{animation:cp-tick 460ms var(--spring) both}
  .enter .cp-vs>li:nth-child(2) .ic{animation-delay:80ms} .enter .cp-vs>li:nth-child(3) .ic{animation-delay:160ms} .enter .cp-vs>li:nth-child(n+4) .ic{animation-delay:240ms}
  @keyframes cp-tick{from{transform:scale(.3);opacity:0}}
  .cp-vs .st-h{display:flex;align-items:center;gap:8px 10px;min-height:32px;flex-wrap:wrap}
  .cp-vs .st-h b{font-size:14px;font-weight:600}
  .cp-vs .st-h .chip{margin-inline-start:auto}
  .cp-vs .st-b{margin-top:10px;display:flex;flex-direction:column;gap:12px;min-width:0}
  .cp-vs .s-todo .st-h b{color:var(--mute)}
  .cp-shim{height:4px;border-radius:999px;background:linear-gradient(90deg,transparent,var(--amber),transparent) 0 0/40% 100% no-repeat,var(--amber-b);animation:cp-shim 1.6s ease-in-out infinite;animation-delay:var(--ph,0ms)}
  @keyframes cp-shim{from{background-position:-70% 0}to{background-position:170% 0}}
  .cp-help{padding:12px 14px;border-radius:12px;font-size:13px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}

  /* C2 install pictures + live preview */
  .cp-shots{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))}
  .cp-shot{border-radius:12px;background:var(--sub);padding:8px;display:flex;flex-direction:column;gap:8px;margin:0}
  .cp-shot .win{height:72px;border-radius:8px;background:var(--card);box-shadow:var(--e1);display:grid;grid-template-columns:34% 1fr;overflow:hidden}
  .cp-shot .win .l{background:var(--sub2);padding:6px;display:flex;flex-direction:column;gap:5px}
  .cp-shot .win .l i{display:block;height:6px;border-radius:3px;background:var(--line2)}
  .cp-shot .win .l i.on{background:var(--horizon)}
  .cp-shot .win .r{padding:8px;display:flex;flex-direction:column;gap:6px}
  .cp-shot .win .r i{display:block;height:6px;border-radius:3px;background:var(--line)}
  .cp-shot .win .r b{display:block;width:46px;height:14px;border-radius:4px;background:var(--line2)}
  .cp-shot .win .r b.on{background:var(--horizon)}
  .cp-shot .cap{font-size:12px;line-height:1.35;padding:0 2px 2px}
  .cp-key{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em;background:var(--sub)}
  .cp-sw{width:36px;height:36px;border-radius:50%;border:0;cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);transition:transform var(--d1) var(--ease),box-shadow var(--d2) var(--ease)}
  .cp-sw:hover{transform:scale(1.08)}
  .cp-sw[aria-pressed="true"]{box-shadow:0 0 0 3px var(--card),0 0 0 5px var(--horizon)}
  .cp-site{position:relative;height:430px;border-radius:14px;background:var(--bg);overflow:hidden;box-shadow:inset 0 0 0 1px var(--line)}
  .cp-site .bar{height:44px;display:flex;align-items:center;gap:14px;padding:0 16px;background:var(--card);border-bottom:1px solid var(--line);font-size:13px;font-weight:700}
  .cp-site .bar i{display:block;width:44px;height:7px;border-radius:4px;background:var(--line)}
  .cp-site .hero{margin:16px;height:110px;border-radius:10px;background:linear-gradient(120deg,var(--sub2),var(--sub))}
  .cp-site .ln{margin:0 16px 10px;height:9px;border-radius:5px;background:var(--sub2)}
  .cp-win{position:absolute;bottom:80px;left:calc(100% - 16px - min(260px,80%));width:min(260px,80%);border-radius:16px;background:var(--card);box-shadow:var(--e3);overflow:hidden;transition:left var(--d4) var(--ease)}
  .cp-win .wh{display:flex;align-items:center;gap:8px;padding:10px 12px;font-size:13px;font-weight:700;background:var(--wc);color:var(--wf);transition:background var(--d3) var(--ease),color var(--d3)}
  .cp-win .wh .av{background:var(--wf);color:var(--wc);transition:background var(--d3),color var(--d3)}
  .cp-win .wb{padding:12px;display:flex;flex-direction:column;gap:8px;font-size:13px}
  .cp-win .wb .bub{align-self:flex-start;max-width:92%;padding:8px 11px;border-radius:12px 12px 12px 4px;background:var(--sub)}
  .cp-win .wb .in{display:flex;align-items:center;justify-content:space-between;height:34px;padding:0 10px;border-radius:10px;background:var(--sub);color:var(--faint);font-size:12px}
  .cp-fab{position:absolute;bottom:16px;left:calc(100% - 64px);width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--wc);color:var(--wf);box-shadow:var(--e2);transition:left var(--d4) var(--ease),background var(--d3) var(--ease),color var(--d3)}
  .cp-site.left .cp-win,.cp-site.left .cp-fab{left:16px}

  /* C4 test call */
  .cp-call{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:16px 0 8px}
  .cp-ring{position:relative;width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,var(--horizon),var(--aqua));color:#FFFFFF;display:flex;align-items:center;justify-content:center;margin:12px 0}
  .cp-ring::before,.cp-ring::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--aqua);animation:cp-ripple 1.8s var(--ease) infinite}
  .cp-ring::after{animation-delay:.9s}
  .cp-ring .ic{animation:ring 1.2s var(--ease) infinite;transform-origin:50% 50%}
  @keyframes cp-ripple{from{transform:scale(1);opacity:.7}to{transform:scale(1.9);opacity:0}}
  .cp-timer{font-family:var(--f-display);font-size:40px;line-height:46px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
  .cp-eq{display:flex;align-items:center;gap:4px;height:28px}
  .cp-eq i{width:4px;height:100%;border-radius:2px;background:var(--aqua);transform-origin:center;animation:cp-eq 900ms ease-in-out infinite alternate}
  .cp-eq i:nth-child(2){animation-delay:-.3s}.cp-eq i:nth-child(3){animation-delay:-.6s}.cp-eq i:nth-child(4){animation-delay:-.15s}.cp-eq i:nth-child(5){animation-delay:-.45s}
  @keyframes cp-eq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}

  /* U1 / U2 */
  .cp-seat{display:flex;flex-direction:column;gap:6px;min-width:180px}
  .cp-seat .bar-h{height:6px}
  .cp-rsel.inp{min-height:34px;height:34px;font-size:13px;min-width:170px;background-color:var(--sub);border-color:transparent}
  .cp-rsel.inp:hover{border-color:var(--line2)}
  .cp-search{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border:1px solid var(--line2);border-radius:10px;background:var(--inp);color:var(--mute);min-width:min(100%,260px);transition:border-color var(--d1),box-shadow var(--d2) var(--ease)}
  .cp-search:focus-within{border-color:var(--horizon);box-shadow:0 0 0 4px var(--ring)}
  .cp-search input{border:0;outline:0;background:transparent;flex:1;min-width:0;color:var(--text);height:38px}
  .cp-roles td,.cp-roles th{text-align:center}
  .cp-roles td:first-child,.cp-roles th:first-child{text-align:start}
  .cp-irow{display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:14px;background:var(--sub)}
  .cp-irow .g{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))}
  .cp-irow .inp{background-color:var(--inp)}

  /* ST1 unsaved-changes bar */
  .cp-save{position:sticky;bottom:20px;z-index:10;align-self:center;width:min(640px,100%);display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;padding:10px 10px 10px 18px;border-radius:14px;background:var(--text);color:var(--bg);box-shadow:var(--e3);font-size:13px}
  .cp-save.anim-in{animation:cp-up var(--d3) var(--spring) both}
  @keyframes cp-up{from{transform:translateY(28px);opacity:0}}
  .cp-save .btn{min-height:34px;background:transparent;color:inherit;border-color:color-mix(in srgb,var(--bg) 30%,transparent)}
  .cp-save .btn:hover{background:color-mix(in srgb,var(--bg) 12%,transparent)}
  .cp-save .btn.pri{background:var(--bg);color:var(--text);border-color:var(--bg)}
  .cp-save .dt{width:8px;height:8px;border-radius:50%;background:var(--amber)}
  .cp-save .m{opacity:.7}

  /* B1 */
  .cp-plan{background:radial-gradient(500px 200px at 100% 0%,var(--teal-b),transparent 70%),var(--card)}
  .cp-big{font-family:var(--f-display);font-size:30px;line-height:36px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .cp-meter .bar-h{height:10px}
  .cp-stack{display:flex;gap:3px;height:12px;border-radius:999px;overflow:hidden}
  .cp-stack i{display:block;height:100%}
  .cp-inv td{white-space:nowrap}
  .cp-paid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:8px 0}
  .cp-paid .ok{width:60px;height:60px;border-radius:50%;background:var(--green-b);color:var(--green-f);display:flex;align-items:center;justify-content:center;animation:cp-tick 520ms var(--spring) both}
  @media (max-width:760px){.cp-save{bottom:72px}.cp-seat{min-width:0;width:100%}.cp-search{width:100%}}
  .cp-utbl .who .nm,.cp-utbl .who .xs{white-space:nowrap}
  </style>`);

  /* ---------- Channel state (shared with the setup builder through window.VINA_CONNECTED) ---------- */
  const CS = {
    web:{st:'ok', agent:'Sara', check:'live', at:'4:52 PM', checks:0},
    wa:{st:'ok', agent:'Sara', step:5, rejected:false, when:['Thu 5 Nov','Thu 5 Nov','Fri 6 Nov','Fri 6 Nov','Fri 6 Nov']},
    ph:{st:'none', agent:'Sara'},
    fb:{st:'none', agent:'Sara'},
  };
  const PAGES = [
    {id:'fb', ch:'fb', t:'iCaur Alghanim', d:'Facebook page · Messenger', st:'none'},
    {id:'fb2', ch:'fb', t:'iCaur Alghanim Service', d:'Facebook page · Messenger', st:'none'},
  ];
  let metaSigned = true, connOverride = false;
  const waSt = () => S.whatsappDown ? 'warn' : (CS.wa.step > 0 && CS.wa.step < 5) ? 'wait' : CS.wa.st;
  const anyConnected = () => ['web','ph','fb'].some(k => CS[k].st === 'ok') || waSt() === 'ok';
  try { Object.defineProperty(window, 'VINA_CONNECTED', {configurable:true, get: () => connOverride || anyConnected(), set: v => { connOverride = !!v; }}); } catch (e) { window.VINA_CONNECTED = true; }
  const agentNames = () => { const a = (window.VINA_AGENTS || []).map(x => typeof x === 'string' ? x : x && x.name).filter(Boolean); return a.length ? a : ['Sara','Faris','Layan']; };
  const ST = {ok:['Connected','green'], none:['Not connected','grey'], wait:['Waiting for Meta','amber'], warn:['Needs attention','red']};
  const phase = ms => `--ph:-${Date.now() % ms}ms`; // keeps a looping shimmer in phase across re-renders
  const stChip = k => k === 'warn' ? `<span class="chip c-red">${pulse('red')}Needs attention</span>` : k === 'wait' ? `<span class="chip c-amber cp-chip-wait" style="${phase(2000)}"><span class="dot" aria-hidden="true"></span>Waiting for Meta</span>` : chipC(ST[k][0], ST[k][1], true);
  const waNum = '+966 12 ••• 4400';
  const vav = n => `<span class="av vina cp-vav" aria-hidden="true">${esc((n || 'V')[0])}</span>`;

  /* ---------- Shared page bits ---------- */
  const page = (nav, title, body, o) => shell(Object.assign({nav, title, body, cp:true, viewOnly:false}, o || {}));
  const sec = (title, sub, body, right) => `<section class="card"><div class="card-h"><div class="grow"><h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right || ''}</div>${body}</section>`;
  const kv = rows => `<dl class="kv">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
  const stateWrap = (body, retryText) => S.st === 'loading' ? loadingRows(6, 72) : S.st === 'error' ? errorBox(retryText || 'We could not load this page', 'Check your internet connection, then try again. Nothing you saved is lost.', 'cp-retry') : body;
  A['cp-retry'] = () => { S.st = ''; };
  const agentSel = (id, cur, a, x, dis) => `<select class="inp" id="${id}" data-ch="${a}" data-x="${x}" ${dis ? 'disabled' : ''} aria-label="Which agent answers">${agentNames().map(n => `<option ${n === cur ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
  A['cp-agent'] = (el) => { CS[el.dataset.x].agent = el.value; toast(el.value + ' now answers on ' + CH[el.dataset.x].label + '.'); };
  MODALS['cp-confirm'] = m => modalFrame(m.title, `<p>${m.body}</p>`, `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn danger" data-a="${m.ok}">${esc(m.okText)}</button>`, {size:'narrow'});
  // it: {t, s:'done'|'cur'|'act'|'wait'|'todo'|'num', chip, sub, body}
  const vsteps = items => `<ol class="cp-vs">${items.map((it, i) => `<li class="s-${it.s}"><span class="cp-nd" aria-hidden="true">${it.s === 'done' ? ic('check', 16) : it.s === 'act' ? ic('alert', 15) : it.s === 'wait' ? ic('clock', 15) : i + 1}</span><div style="min-width:0"><div class="st-h"><b>${it.t}</b>${it.chip || ''}<span class="sr">${{done:'Done', act:'Needs action', wait:'Waiting', cur:'Current step', todo:'Not started'}[it.s] || ''}</span></div>${it.sub ? `<div class="small mute">${it.sub}</div>` : ''}${it.body ? `<div class="st-b">${it.body}</div>` : ''}</div></li>`).join('')}</ol>`;

  /* ---------- C1 Connections (+ C6 problem) ---------- */
  R('connections', {id:'C1', title:'Connections', roles:['vina'], states:[['problem','Connection problem (C6)'],['loading','Loading'],['error','Could not load']], render() {
    if (S.st === 'problem') S.whatsappDown = true;
    const w = waSt();
    const chans = [
      {k:'web', t:'Website', what:'Chat window on icaur-alghanim.sa', st:CS.web.st, go:'conn-website', facts: CS.web.st === 'ok' ? [['Plugin','WordPress 2.3'],['Chats this week','482'],['Last checked', 'Today ' + CS.web.at]] : [['Plugin','Not installed yet']]},
      {k:'wa', t:'WhatsApp', what:'Business number through Meta', st:w, go:'conn-whatsapp', facts: w === 'warn' ? [['Problem', '<span class="red b">Meta disconnected the number</span>'],['Since','Today 4:12 PM'],['Waiting', '<span class="red b">6 messages</span>']] : w === 'ok' ? [['Number', waNum],['Quality from Meta', chipC('High', 'green')],['Chats this week','1,742']] : w === 'wait' ? [['Progress', 'Step ' + Math.min(CS.wa.step + 1, 5) + ' of 5'],['Next', CS.wa.step === 1 ? 'Enter the code from the SMS' : 'Meta is checking']] : [['Number','—']]},
      {k:'ph', t:'Phone line', what:'The agent answers phone calls', st:CS.ph.st, go:'conn-phone', facts: CS.ph.st === 'ok' ? [['Number', CS.ph.number || '+966 12 ••• 7300'],['Voice', esc(f('cpp.voice') || 'Arabic, female')],['Calls this week','0']] : [['Number','Not set up']]},
      {k:'fb', t:'Facebook Messenger', what:'Messages to the Facebook page', st:CS.fb.st, go:'conn-meta', facts: CS.fb.st === 'ok' ? [['Page','iCaur Alghanim'],['Chats this week','0']] : [['Page','Not linked']]},
    ];
    const live = chans.filter(c => c.st === 'ok').length;
    const card = c => {
      const btn = c.st === 'ok' ? `<a class="btn sm" href="#${c.go}">Manage</a>` : c.st === 'warn' ? `<a class="btn sm danger" href="#${c.go}">Reconnect</a>` : c.st === 'wait' ? `<a class="btn sm" href="#${c.go}">See progress</a>` : `<a class="btn sm pri" href="#${c.go}">Connect</a>`;
      return `<section class="card lift cp-ch ${c.st === 'warn' ? 'warn' : ''}" aria-labelledby="cp-c-${c.k}">
        <div class="hd">${chIc(c.k, true)}<div class="grow" style="min-width:0"><h2 class="h2" id="cp-c-${c.k}">${c.t}</h2><div class="small mute">${c.what}</div></div>${stChip(c.st)}</div>
        ${kv(c.facts)}
        <div class="ft"><label class="cp-ans" for="cp-ag-${c.k}"><span class="l">Which agent answers</span><span class="w">${vav(CS[c.k].agent)}${agentSel('cp-ag-' + c.k, CS[c.k].agent, 'cp-agent', c.k, c.st === 'none')}</span></label>${btn}</div>
      </section>`;
    };
    const problem = w === 'warn' ? `<div class="g2">
      <div class="note err" role="alert">${ic('alert')}<div><b>WhatsApp is disconnected.</b> Customers on WhatsApp are not getting replies since 4:12 PM. 6 messages are waiting. The red bar shows on every page for the VINA team until it is fixed, and the VINA support team got an email at 4:13 PM.<div style="margin-top:10px"><a class="btn sm danger" href="#conn-whatsapp">Reconnect WhatsApp</a></div></div></div>
      <div class="card flat col tight"><span class="eyebrow">What managers see</span><div class="small mute">On Channels in the Manager dashboard. No reconnect button.</div><div class="cp-mgr">${chIc('wa', true)}<div class="grow"><b>WhatsApp</b><div class="xs mute">The VINA team has been told.</div></div>${stChip('warn')}</div></div></div>` : '';
    return page('connections', 'Connections', stateWrap(`<div class="col tight"><p class="lead-in">Connect and check every channel. For the website, the client installs the VINA plugin. Each channel is answered by one agent.</p></div>${problem}<div class="cp-cards">${chans.map(card).join('')}</div>`));
  }});

  /* ---------- C2 Website · Get the plugin ---------- */
  const SITE_KEY = 'vina_live_7Kq2-icaur-9f3d';
  const INSTALL = {
    WordPress:['Plugins in the WordPress menu','Add new, then Upload plugin','Choose vina-chat.zip and Install','Activate, then paste the site key'],
    Shopify:['Online Store, then Themes','Customize, then App embeds','Turn on VINA chat','Paste the site key and Save'],
    Salla:['Apps in the Salla dashboard','Search for VINA and Install','Allow access to the store','Paste the site key and Save'],
    Other:['Copy the code snippet','Paste it before </body> on every page','Publish the website','Come back and press Check now'],
  };
  const SWATCH = [['#202253','Navy',1],['#5E97CE','Blue',0],['#6EBEB9','Teal',0],['#1C1E43','Ink',1],['#B42318','Red',1]];
  if (!S.f.cpw) S.f.cpw = {color:'#202253', pos:'right', name:'Sara', greet:'هلا! أنا سارة، اسألني عن أي سيارة', pages:'All pages except /careers', tab:'WordPress'};
  // The preview node is kept across re-renders so colour and position changes animate instead of snapping.
  let prevEl = null;
  const keepPreview = () => {
    const nu = $('#cp-prev'); if (!nu) return;
    if (!prevEl || prevEl === nu || prevEl.children.length !== nu.children.length) { prevEl = nu; return; }
    $$('[data-t]', nu).forEach(e => { const o = prevEl.querySelector(`[data-t="${e.dataset.t}"]`); if (o && o.textContent !== e.textContent) o.textContent = e.textContent; });
    const st = nu.getAttribute('style'), cl = nu.className;
    nu.replaceWith(prevEl); prevEl.getBoundingClientRect(); // style the old values first, then change them
    prevEl.setAttribute('style', st); prevEl.className = cl;
  };
  R('conn-website', {id:'C2', title:'Website', roles:['vina'], states:[['notfound','Plugin not found'],['badkey','Site key wrong'],['live','Live']], after: keepPreview, render() {
    const w = S.f.cpw;
    const check = S.st || CS.web.check;
    const res = CS.web.busy ? `<div class="note" role="status"><span class="spin" aria-hidden="true" style="width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:spin .8s linear infinite;display:inline-block"></span>Checking icaur-alghanim.sa…<span class="sr" data-until="${CS.web.busy}" data-done="cp-web-checked"></span></div>`
      : check === 'live' ? `<div class="note ok" role="status">${ic('check')}<div><b>Live on icaur-alghanim.sa</b> · checked ${esc(CS.web.at)}. Customers can chat with ${esc(w.name)} now.</div></div>`
      : check === 'notfound' ? `<div class="note warn" role="status">${ic('clock')}<div><b>Not found yet.</b> It can take 5 minutes after installing. Check the plugin is activated (step 2), then press Check now again.</div></div>`
      : check === 'badkey' ? `<div class="note err" role="alert">${ic('alert')}<div><b>Site key is wrong.</b> The plugin is installed but the key does not match. Copy the key in step 3 again and paste it in the plugin settings.</div></div>`
      : `<div class="note">${ic('info')}<div>Not checked yet. Install the plugin, then press Check now.</div></div>`;
    const S4 = {live:['done','done','done','done'], notfound:['done','cur','done','act'], badkey:['done','done','act','cur'], none:['cur','todo','todo','todo']}[check] || ['cur','todo','todo','todo'];
    if (CS.web.busy) S4[3] = 'wait';
    const light = (SWATCH.find(s => s[0] === w.color) || [0, 0, 1])[2];
    const fg = light ? '#FFFFFF' : '#0F2E2C';
    const left = w.pos === 'left';
    const steps = INSTALL[w.tab];
    const body = `
      <p class="lead-in">Put the VINA chat on ${esc(client().name)}'s website. It takes about 10 minutes. The chat is answered by ${esc(w.name)}.</p>
      <div class="g2" style="align-items:start">
      <div class="col loose">
        ${sec('Get the plugin', check === 'live' ? 'All four steps are done.' : 'Four steps. Each one ticks when it is done.', vsteps([
          {t:'Download the VINA plugin', s:S4[0], sub:'For WordPress, Shopify, Salla, or any website with a code snippet.', body:`<div class="row tight"><button type="button" class="btn sm pri" data-a="cp-dl">${ic('download', 15)}Download plugin</button><button type="button" class="btn sm" data-a="cp-snippet">Get code snippet</button></div>`},
          {t:'Install it on the website', s:S4[1], body:`<div class="tabs" role="tablist" aria-label="Website platform">${Object.keys(INSTALL).map(k => `<button type="button" class="tab" role="tab" aria-selected="${w.tab === k}" data-a="cp-tab" data-x="${k}">${k}</button>`).join('')}</div>
            <div class="cp-shots" role="tabpanel" aria-label="${esc(w.tab)} steps">${steps.map((s, i) => `<figure class="cp-shot"><div class="win" aria-hidden="true"><div class="l">${[0,1,2,3].map(j => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div><div class="r"><i></i><i style="width:70%"></i><b class="${i > 0 ? 'on' : ''}"></b></div></div><figcaption class="cap"><b>${i + 1}.</b> ${esc(s)}</figcaption></figure>`).join('')}</div>`},
          {t:'Paste the site key in the plugin', s:S4[2], chip: S4[2] === 'act' ? chipC('Key does not match', 'red', true) : '', body:`<div class="row tight nowrap"><label class="sr" for="cp-key">Site key</label><input class="inp cp-key grow" id="cp-key" readonly value="${SITE_KEY}"><button type="button" class="btn" data-a="cp-copy">${ic('copy', 16)}Copy</button></div>`},
          {t:'Check it is working', s:S4[3], chip: check === 'live' && !CS.web.busy ? chipC('Live', 'green', true) : '', body:`<div><button type="button" class="btn sm" data-a="cp-web-check" ${CS.web.busy ? 'disabled' : ''}>${ic('refresh', 15)}Check now</button></div>${res}`},
        ]))}
        ${sec('Chat window look', 'The preview updates as you change it. The website shows the change within a minute after you save.', `<div class="col">
          <div class="field"><span class="lbl">Colour</span><div class="row tight" role="group" aria-label="Colour">${SWATCH.map(([c, n, l]) => `<button type="button" class="cp-sw" style="background:${c}" aria-label="${n}" aria-pressed="${w.color === c}" data-a="cp-col" data-x="${c}">${w.color === c ? `<span style="color:${l ? '#fff' : '#0F2E2C'}">${ic('check', 16)}</span>` : ''}</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">Position</span><div class="seg" role="group" aria-label="Position"><button type="button" data-a="cp-pos" data-x="right" aria-pressed="${!left}">Bottom right</button><button type="button" data-a="cp-pos" data-x="left" aria-pressed="${left}">Bottom left</button></div></div>
          <div class="g2"><div class="field"><label for="b-f-cpw-name">Agent name</label><input class="inp" ${bind('f.cpw.name', true)}></div><div class="field"><label for="b-f-cpw-pages">Show on</label>${bindSel('f.cpw.pages', ['All pages','All pages except /careers','Only car model pages'])}</div></div>
          <div class="field"><label for="b-f-cpw-greet">Greeting</label><input class="inp" dir="auto" ${bind('f.cpw.greet', true)}><span class="hint">The first message customers see. VINA replies in the customer's language.</span></div>
          <div class="row"><span class="sp"></span><button type="button" class="btn" data-a="cp-look-reset">Cancel</button><button type="button" class="btn pri" data-a="cp-look-save">Save</button></div>
        </div>`)}
      </div>
      <section class="card col" aria-label="Preview on a sample page" style="position:sticky;top:84px"><div class="row tight"><span class="eyebrow grow">Live preview</span><span class="xs mute">Sample page</span></div>
        <div class="cp-site ${left ? 'left' : ''}" id="cp-prev" style="--wc:${w.color};--wf:${fg}" aria-hidden="true"><div class="bar">iCaur Alghanim<span class="sp"></span><i></i><i></i><i></i></div><div class="hero"></div><div class="ln" style="width:70%"></div><div class="ln" style="width:52%"></div><div class="ln" style="width:60%"></div>
          <div class="cp-win"><div class="wh"><span class="av sm" data-t="i">${esc((w.name || 'S')[0])}</span><span data-t="n">${esc(w.name || 'Sara')}</span><span class="sp"></span>${ic('x', 14)}</div><div class="wb"><span class="bub" dir="auto" data-t="g">${esc(w.greet)}</span><span class="in">Write a message…${ic('send', 14)}</span></div></div>
          <div class="cp-fab">${ic('conv', 22)}</div></div>
        <div class="xs mute">Shown on: ${esc(w.pages)}</div></section>
      </div>`;
    return page('conn-website', 'Website', body, {crumb:['Connections', 'connections']});
  }});
  A['cp-tab'] = el => { S.f.cpw.tab = el.dataset.x; };
  A['cp-col'] = el => { S.f.cpw.color = el.dataset.x; };
  A['cp-pos'] = el => { S.f.cpw.pos = el.dataset.x; };
  A['cp-dl'] = () => { toast('vina-chat.zip is ready. In this prototype, files are not downloaded.'); };
  A['cp-snippet'] = () => { S.f.cpw.tab = 'Other'; toast('Code snippet steps are under Other.'); };
  A['cp-copy'] = () => {
    const sel = () => { const e = $('#cp-key'); if (e) { e.focus(); e.select(); } toast('Press Ctrl+C or ⌘C to copy the selected key.'); paintLayers(); };
    try { navigator.clipboard.writeText(SITE_KEY).then(() => { toast('Site key copied.'); paintLayers(); }, sel); } catch (e) { sel(); }
    return false;
  };
  A['cp-web-check'] = () => { CS.web.busy = Date.now() + 1500; };
  A['cp-web-checked'] = () => {
    CS.web.busy = 0; CS.web.at = clock(now());
    const from = S.st || CS.web.check; S.st = '';
    CS.web.check = from === 'none' ? 'notfound' : 'live'; // ponytail: scripted result, not found → live
    CS.web.st = CS.web.check === 'live' ? 'ok' : CS.web.st;
  };
  let lookSaved = JSON.stringify(S.f.cpw);
  A['cp-look-save'] = () => { lookSaved = JSON.stringify(S.f.cpw); toast('Chat window saved. It shows on the website within a minute.'); };
  A['cp-look-reset'] = () => { S.f.cpw = Object.assign(JSON.parse(lookSaved), {tab:S.f.cpw.tab}); };

  /* ---------- C3 WhatsApp ---------- */
  const WA_STEPS = ['Meta account linked','Number verified by code','Business verified by Meta','Display name approved','Live'];
  if (!S.f.cpwa) S.f.cpwa = {b0:true, b1:true, b2:false, code:'', dn:'iCaur Alghanim Service', err:''};
  R('conn-whatsapp', {id:'C3', title:'WhatsApp', roles:['vina'], states:[['checking','Meta still checking'],['rejected','Rejected'],['disconnected','Disconnected']], render() {
    let st = waSt(), step = CS.wa.step, rej = CS.wa.rejected, down = S.whatsappDown, disc = false;
    if (S.st === 'checking') { step = 2; st = 'wait'; rej = false; down = false; }
    if (S.st === 'rejected') { step = 3; st = 'wait'; rej = true; down = false; }
    if (S.st === 'disconnected') { step = 0; st = 'none'; down = false; disc = true; }
    const fa = S.f.cpwa;
    const before = sec('Before you start', 'Have these ready. Meta checks them.', `<div class="col tight">
      ${[['b0','A Meta business account for ' + client().name],['b1','The number to use, not already on the WhatsApp app'],['b2','Commercial registration, for Meta\'s business check']].map(([k, t]) => `<label class="chk"><input ${bindChk('f.cpwa.' + k)}><span>${esc(t)}</span></label>`).join('')}
      <div class="row" style="margin-top:8px"><button type="button" class="btn pri" data-a="cp-meta-open" data-x="wa">Continue with Meta</button><span class="small mute">Opens Meta's window to pick the business and the number.</span></div></div>`);
    const stepState = i => i < step || step === 5 ? 'done' : i === step ? (i === 1 ? 'act' : i === 3 && rej ? 'act' : i === 4 ? 'todo' : 'wait') : 'todo';
    const P = {done:['green','Done'], wait:['amber','Waiting for Meta'], act:['red','Needs action'], todo:['grey','Next']};
    const help = i => {
      if (i === 1) return `<div class="cp-help" style="background:var(--red-b)"><span>Meta sent a 6-digit code by SMS to ${waNum}. Enter it here.</span><form class="row tight" data-a="cp-wa-code"><label class="sr" for="b-f-cpwa-code">6-digit code</label><input class="inp num" style="width:150px;letter-spacing:.3em;font-weight:700;background:var(--inp)" inputmode="numeric" maxlength="6" autocomplete="one-time-code" ${bind('f.cpwa.code')}><button class="btn pri" type="submit">Verify</button><button type="button" class="btn ghost" data-a="cp-wa-resend">Send a new code</button></form>${fa.err ? `<span class="field"><span class="err" role="alert">${ic('alert', 14)}${esc(fa.err)}</span></span>` : ''}<span class="xs mute">Prototype: any 6 digits work except 000000.</span></div>`;
      if (i === 2) return `<div class="cp-shim" style="${phase(1600)}" role="progressbar" aria-label="Meta is checking" aria-busy="true"></div><div class="cp-help" style="background:var(--amber-b)"><span>Meta is checking the commercial registration. This can take some time, often a few days. We will email you when it is done.</span><div class="row tight"><button type="button" class="btn sm" data-a="cp-wa-next">Check with Meta now</button><a class="btn sm ghost" href="https://www.facebook.com/business/help" target="_blank" rel="noopener">What Meta checks ${ic('ext', 12)}</a></div></div>`;
      if (i === 3 && rej) return `<div class="cp-help" style="background:var(--red-b)"><span><b>Meta rejected "iCaur Service Offers".</b> The display name must match the business name, for example "iCaur Alghanim Service".</span><div class="row tight"><label class="sr" for="b-f-cpwa-dn">New display name</label><input class="inp" style="width:240px;background:var(--inp)" ${bind('f.cpwa.dn')}><button type="button" class="btn sm pri" data-a="cp-wa-dn">Change the display name</button></div></div>`;
      if (i === 3) return `<div class="cp-shim" style="${phase(1600)}" role="progressbar" aria-label="Meta is checking" aria-busy="true"></div><div class="cp-help" style="background:var(--amber-b)"><span>Meta is checking the display name "${esc(fa.dn || 'iCaur Alghanim')}". Usually within a day.</span><button type="button" class="btn sm" data-a="cp-wa-next">Check with Meta now</button></div>`;
      return '';
    };
    const items = WA_STEPS.map((t, i) => { const s = stepState(i); return {t, s, chip: chipC(P[s][1], P[s][0], s !== 'todo'), sub: s === 'done' && CS.wa.when[i] ? esc(CS.wa.when[i]) : '', body: step > 0 && step < 5 && i === step ? help(i) : ''}; });
    const progress = sec('Progress', step === 0 ? 'Starts when you continue with Meta.' : 'Each step is checked by Meta. We will email you when something changes.', vsteps(items));
    const manage = sec(`WhatsApp ${down ? 'needs attention' : 'is live'}`, `${esc(CS.wa.agent)} answers customers on this number.`, `${kv([['Number', waNum],['Display name', esc(fa.dnDone || 'iCaur Alghanim')],['Quality from Meta', chipC('High', 'green')],['Messages limit','1,000 customers a day'],['Which agent answers', agentSel('cp-wa-agent', CS.wa.agent, 'cp-agent', 'wa')]])}<div class="row" style="margin-top:16px"><span class="sp"></span><button type="button" class="btn danger-o" data-a="cp-wa-disc">Disconnect</button></div>`, `${chIc('wa', true)}${stChip(down ? 'warn' : 'ok')}`);
    const setupDone = sec('How it was set up', 'All five steps checked by Meta.', vsteps(WA_STEPS.map((t, i) => ({t, s:'done', sub: esc(CS.wa.when[i] || '')}))));
    let top = '';
    if (down) top = `<div class="note err" role="alert">${ic('alert')}<div class="grow"><b>WhatsApp is disconnected.</b> Customers are not getting replies since 4:12 PM. Meta asked to sign in again after the business account password changed.</div><button type="button" class="btn sm danger" data-a="cp-wa-reconnect">Reconnect</button></div>`;
    else if (disc) top = `<div class="note err" role="alert">${ic('alert')}<div><b>WhatsApp was disconnected</b> on Today 4:12 PM. Customers are not getting replies. A red bar shows on every page for the VINA team. Continue with Meta to connect it again.</div></div>`;
    else if (S.st === 'checking') top = `<div class="note warn" role="status">${ic('clock')}<div><b>Meta is still checking.</b> This can take some time. You can leave this page; we will email you.</div></div>`;
    const side = sec('Good to know', '', `<ul class="small" style="margin:0;padding-inline-start:18px;display:flex;flex-direction:column;gap:8px"><li>The number cannot be used on the WhatsApp app at the same time.</li><li>Meta's checks usually take 1 to 3 days. You can leave this page.</li><li>If something is blocked, the step says what to do.</li></ul>`);
    const body = `<p class="lead-in">Connect ${esc(client().name)}'s WhatsApp Business number through Meta. VINA answers every WhatsApp chat on this number.</p>${top}
      ${st === 'ok' || down ? `<div class="g2" style="align-items:start">${manage}${setupDone}</div>` : `<div class="g2" style="align-items:start">${step === 0 ? before : ''}${progress}${step === 0 ? '' : side}</div>`}`;
    return page('conn-whatsapp', 'WhatsApp', body, {crumb:['Connections', 'connections']});
  }});
  A['cp-wa-reconnect'] = () => { S.whatsappDown = false; S.st = ''; CS.wa.st = 'ok'; CS.wa.step = 5; toast('WhatsApp is connected again. Sara is answering the 6 waiting messages.'); };
  A['cp-wa-code'] = () => {
    const c = (S.f.cpwa.code || '').trim();
    if (!/^\d{6}$/.test(c)) { S.f.cpwa.err = 'Enter the 6 digits from the SMS.'; return; }
    if (c === '000000') { S.f.cpwa.err = 'That code is not right. Check the SMS, or send a new code.'; return; }
    S.f.cpwa.err = ''; S.f.cpwa.code = ''; CS.wa.step = 2; CS.wa.when[1] = nowStr(); toast('Number verified. Meta is now checking the business.');
  };
  A['cp-wa-resend'] = () => { toast('New code sent by SMS to ' + waNum + '.'); };
  A['cp-wa-next'] = () => {
    if (S.st === 'checking') { S.st = ''; CS.wa.step = 2; }
    if (CS.wa.step === 2) { CS.wa.step = 3; CS.wa.when[2] = nowStr(); toast('Business verified by Meta. Next: the display name.'); }
    else if (CS.wa.step === 3) { CS.wa.step = 5; CS.wa.st = 'ok'; CS.wa.rejected = false; CS.wa.when[3] = CS.wa.when[4] = nowStr(); S.f.cpwa.dnDone = S.f.cpwa.dn; toast('WhatsApp is live. ' + CS.wa.agent + ' answers on ' + waNum + '.'); }
  };
  A['cp-wa-dn'] = () => { const v = (S.f.cpwa.dn || '').trim(); if (!v) { toast('Type a display name first.'); return; } S.st = ''; CS.wa.step = 3; CS.wa.rejected = false; toast('Sent "' + v + '" to Meta for approval.'); };
  A['cp-wa-disc'] = () => { openModal('cp-confirm', {title:'Disconnect WhatsApp?', body:'Customers who message ' + waNum + ' will not get replies until it is connected again. Chats and leads are kept.', ok:'cp-wa-disc-ok', okText:'Disconnect'}); };
  A['cp-wa-disc-ok'] = () => {
    const prev = JSON.stringify(CS.wa); S.modal = null; CS.wa.st = 'none'; CS.wa.step = 0; S.whatsappDown = false;
    toast('WhatsApp disconnected.', () => { Object.assign(CS.wa, JSON.parse(prev)); render(); });
  };

  /* Meta window (simulated) for WhatsApp and Messenger */
  A['cp-meta-open'] = el => { openModal('cp-meta', {for: el.dataset.x, step: 0, biz: 'iCaur Alghanim Business', num: '+966 12 ••• 4400'}); };
  MODALS['cp-meta'] = m => {
    const head = `<div class="note">${ic('lock', 16)}<span class="grow">Meta's own window opens here in the real product. Signed in as ${esc(meName())}.</span></div>`;
    if (m.for === 'meta') return modalFrame('Continue with Meta', `${head}<p>Allow VINA to read and answer Messenger messages for the Facebook pages of <b>iCaur Alghanim Business</b>.</p><ul class="small mute" style="margin:0;padding-inline-start:18px"><li>Read and send direct messages</li><li>See the pages and accounts you pick next</li></ul>`, `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="cp-meta-ok">Allow</button>`);
    const opts = (k, list) => list.map(([v, d]) => `<button type="button" class="radio-card" role="radio" aria-checked="${m[k] === v}" data-a="cp-meta-pick" data-x="${k}|${esc(v)}"><span class="grow"><b>${esc(v)}</b><span class="xs mute" style="display:block">${esc(d)}</span></span>${m[k] === v ? ic('check', 18) : ''}</button>`).join('');
    const steps = [
      ['Pick the business', `<div class="col tight" role="radiogroup" aria-label="Business">${opts('biz', [['iCaur Alghanim Business','Verified business portfolio'],['Alghanim Group','Parent company portfolio']])}</div>`],
      ['Pick the number', `<div class="col tight" role="radiogroup" aria-label="Number">${opts('num', [['+966 12 ••• 4400','iCaur Alghanim · showroom number'],['+966 12 ••• 4410','Service team · not on the WhatsApp app']])}</div>`],
      ['Allow VINA', `<p>VINA will be able to:</p><ul class="small" style="margin:0;padding-inline-start:18px"><li>Send and receive WhatsApp messages for ${esc(m.num)}</li><li>Use the message templates of this number</li><li>See the number's quality rating</li></ul>`],
    ];
    const [t, b] = steps[m.step];
    return modalFrame('Continue with Meta', `${head}<div class="row tight"><span class="eyebrow grow">Step ${m.step + 1} of 3 · ${t}</span><span class="row tight" aria-hidden="true">${[0,1,2].map(i => `<span style="width:${i === m.step ? 18 : 6}px;height:6px;border-radius:3px;background:${i <= m.step ? 'var(--horizon)' : 'var(--line2)'}"></span>`).join('')}</span></div>${b}`,
      `${m.step ? `<button type="button" class="btn" data-a="cp-meta-step" data-x="-1">Back</button>` : `<button type="button" class="btn" data-a="close-modal">Cancel</button>`}<button type="button" class="btn pri" data-a="${m.step === 2 ? 'cp-meta-ok' : 'cp-meta-step'}" data-x="1">${m.step === 2 ? 'Approve' : 'Next'}</button>`);
  };
  A['cp-meta-pick'] = el => { const [k, v] = el.dataset.x.split('|'); S.modal[k] = v; };
  A['cp-meta-step'] = el => { S.modal.step = Math.max(0, Math.min(2, S.modal.step + Number(el.dataset.x))); };
  A['cp-meta-ok'] = () => {
    const m = S.modal; S.modal = null;
    if (m.for === 'meta') { metaSigned = true; S.st = ''; toast('Signed in with Meta. Pick the pages and accounts.'); return; }
    S.st = ''; CS.wa.step = 1; CS.wa.st = 'none'; CS.wa.when[0] = nowStr(); toast('Meta account linked. Enter the code Meta sent to the number.');
  };

  /* ---------- C4 Phone line ---------- */
  if (!S.f.cpp) S.f.cpp = {num:'vina', own:'', agent:'Sara', voice:'Arabic, female', greet:'أهلاً بك في آيكار الغانم، معك سارة. كيف أقدر أخدمك؟', transfer:'+966 12 440 4401', ask:true, upset:true, fail:true, rec:true, test:'+966 50 418 1180'};
  R('conn-phone', {id:'C4', title:'Phone line', roles:['vina'], states:[['loading','Loading'],['error','Could not save']], render() {
    const p = S.f.cpp;
    const own = p.num === 'own', on = CS.ph.st === 'ok', s = on ? 'done' : 'num';
    const body = `<p class="lead-in">Let ${esc(p.agent)} answer phone calls for ${esc(client().name)}. Calls that need a person go to the call centre.</p>
    ${S.st === 'error' ? errorBox('We could not set up the phone line', 'The number provider did not answer. Try again in a minute. Your settings are kept.', 'cp-retry') : ''}
    ${on ? `<div class="note ok">${ic('check')}<div><b>The phone line is connected.</b> ${esc(p.agent)} answers on ${esc(CS.ph.number)}.</div></div>` : ''}
    <div class="g2" style="align-items:start">
    ${sec('Set up the phone line', on ? 'Connected. Change anything and save.' : 'Four steps, then save and connect.', `${vsteps([
      {t:'Choose a number', s, body:`<div class="g2" role="radiogroup" aria-label="Which number" style="gap:10px">
        <button type="button" class="radio-card" role="radio" aria-checked="${!own}" data-a="cp-ph-num" data-x="vina"><span><b>Use a VINA number</b><span class="xs mute" style="display:block">Ready in a minute. Saudi number, +966 12 ••• 7300, Jeddah.</span></span></button>
        <button type="button" class="radio-card" role="radio" aria-checked="${own}" data-a="cp-ph-num" data-x="own"><span><b>Forward your own number</b><span class="xs mute" style="display:block">Keep your number. Set call forwarding with your provider.</span></span></button></div>
        ${own ? `<div class="field"><label for="b-f-cpp-own">Your number</label><input class="inp" inputmode="tel" placeholder="+966 12 xxx xxxx" ${bind('f.cpp.own')}><span class="hint">Then ask your provider to forward calls to +966 12 ••• 7300.</span></div>` : ''}`},
      {t:'How it answers', s, body:`<div class="g2" style="gap:12px"><div class="field"><label for="b-f-cpp-agent">Answers as</label>${bindSel('f.cpp.agent', agentNames())}</div><div class="field"><label for="b-f-cpp-voice">Voice</label>${bindSel('f.cpp.voice', ['Arabic, female','Arabic, male','English'])}</div></div>
        <div class="field"><label for="b-f-cpp-greet">Greeting</label><input class="inp" dir="auto" ${bind('f.cpp.greet')}><span class="hint">What callers hear first.</span></div>`},
      {t:'When to transfer to a person', s, body:`<div class="field"><label for="b-f-cpp-transfer">Transfer calls to</label><input class="inp" inputmode="tel" ${bind('f.cpp.transfer')}><span class="hint">Call centre line.</span></div>
        <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="lbl" style="font-size:13px;font-weight:600;margin-bottom:4px">Transfer when</legend>
        <label class="chk"><input ${bindChk('f.cpp.ask')}><span>The caller asks for a person</span></label><label class="chk"><input ${bindChk('f.cpp.upset')}><span>The caller is upset</span></label><label class="chk"><input ${bindChk('f.cpp.fail')}><span>${esc(p.agent)} fails to answer twice</span></label></fieldset>`},
      {t:'Call recording', s, body:`<div class="sw-row">${sw(p.rec, 'cp-ph-rec', '', 'Record calls')}<div><b>Record calls</b><div class="xs mute">Callers hear "This call may be recorded". Recordings are kept 90 days.</div></div></div>`},
    ])}<div class="row" style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line)"><span class="sp"></span><a class="btn" href="#connections">Cancel</a><button type="button" class="btn pri" data-a="cp-ph-save">${on ? 'Save changes' : 'Save and connect'}</button></div>`)}
    ${sec('Try a test call', 'We call your mobile and ' + esc(p.agent) + ' answers, using these settings. The call is not counted.', `<div class="col"><div class="field"><label for="b-f-cpp-test">Your mobile</label><input class="inp" inputmode="tel" ${bind('f.cpp.test')}></div><div><button type="button" class="btn pri" data-a="cp-call">${ic('phone', 16)}Call me now</button></div></div>`)}
    </div>`;
    return page('conn-phone', 'Phone line', S.st === 'loading' ? loadingRows(6, 72) : body, {crumb:['Connections', 'connections']});
  }});
  A['cp-ph-num'] = el => { S.f.cpp.num = el.dataset.x; };
  A['cp-ph-rec'] = () => { S.f.cpp.rec = !S.f.cpp.rec; };
  A['cp-ph-save'] = () => {
    const p = S.f.cpp;
    if (p.num === 'own' && !/^\+?966\s?1\d[\d\s]{7,}$/.test(p.own.replace(/-/g, ''))) { toast('Type your own number, for example +966 12 440 4400.'); return; }
    if (!p.transfer.trim()) { toast('Add the number to transfer calls to.'); return; }
    S.st = ''; CS.ph.st = 'ok'; CS.ph.agent = p.agent; CS.ph.number = p.num === 'own' ? p.own : '+966 12 ••• 7300';
    toast('Phone line connected. ' + p.agent + ' answers on ' + CS.ph.number + '.');
  };
  A['cp-call'] = () => { const m = S.f.cpp.test.replace(/[\s-]/g, ''); if (!/^(\+966|0)5\d{8}$/.test(m)) { toast('Type a Saudi mobile, for example +966 50 418 1180.'); return; } openModal('cp-call', {phase:'ring', until: Date.now() + 3000}); };
  A['cp-call-up'] = () => { if (S.modal && S.modal.id === 'cp-call') { S.modal.phase = 'live'; S.modal.since = Date.now(); } };
  A['cp-call-end'] = () => { const m = S.modal; m.phase = 'ended'; const s = Math.floor((Date.now() - m.since) / 1000); m.len = Math.floor(s / 60) + ':' + pad(s % 60); };
  MODALS['cp-call'] = m => {
    const p = S.f.cpp;
    if (m.phase === 'ring') return modalFrame('Test call', `<div class="cp-call" role="status"><span class="cp-ring">${ic('phone', 30)}</span><b style="font-size:16px">Calling ${esc(p.test)}…</b><span class="small mute">Answer your phone. ${esc(p.agent)} will speak first.</span><span class="sr" data-until="${m.until}" data-done="cp-call-up"></span></div>`, `<button type="button" class="btn" data-a="close-modal">Cancel</button>`, {size:'narrow'});
    if (m.phase === 'live') return modalFrame('Test call', `<div class="cp-call"><span class="chip c-green">${pulse('green')}Connected</span><span class="cp-timer" data-since="${m.since}" aria-label="Call length">0:00</span><span class="cp-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="small mute">${esc(p.agent)} · ${esc(p.voice)}</span></div><div class="msg vina" style="align-self:stretch;max-width:100%"><div class="bub" dir="auto">${esc(p.greet)}</div><div class="meta">${esc(p.agent)} · test call</div></div>`, `<button type="button" class="btn danger" data-a="cp-call-end">${ic('phone', 16)}End call</button>`, {size:'narrow'});
    return modalFrame('Test call ended', `<div class="cp-paid"><span class="ok">${ic('check', 28)}</span><b>The call lasted ${esc(m.len)}</b><span class="small mute">It is not counted in your plan.${p.rec ? ' The recording is under Conversations for 90 days.' : ''}</span></div>`, `<button type="button" class="btn pri" data-a="close-modal">Done</button>`, {size:'narrow'});
  };

  /* ---------- C5 Facebook Messenger ---------- */
  if (!S.f.cpm) S.f.cpm = {fb:true, fb2:false, agent:'Sara'};
  R('conn-meta', {id:'C5', title:'Facebook Messenger', roles:['vina'], states:[['before','Before Meta sign-in'],['disconnected','Messenger disconnected']], render() {
    const signed = metaSigned && S.st !== 'before';
    const sel = PAGES.filter(pg => S.f.cpm[pg.id]).length;
    const pst = pg => S.st === 'disconnected' && pg.id === 'fb' ? 'warn' : pg.st;
    const anyOn = PAGES.some(pg => pg.st === 'ok');
    const body = `<p class="lead-in">Connect Messenger for your Facebook pages. It goes through Meta.</p>
    ${S.st === 'disconnected' ? `<div class="note err" role="alert">${ic('alert')}<div class="grow"><b>Messenger is disconnected.</b> The page password was changed, so Meta disconnected it. Customers on Messenger are not getting replies.</div><button type="button" class="btn sm danger" data-a="cp-meta-open" data-x="meta">Reconnect</button></div>` : ''}
    <div class="g2" style="align-items:start">
    ${sec('Connect through Meta', signed ? 'Signed in as iCaur Alghanim Business' : 'Sign in with the Meta business account that owns the pages.', `${vsteps([
      {t:'Continue with Meta', s: signed ? 'done' : 'cur', sub: signed ? 'Signed in as iCaur Alghanim Business' : '', body: signed ? '' : `<div><button type="button" class="btn pri" data-a="cp-meta-open" data-x="meta">Continue with Meta</button></div>`},
      {t:'Pick the pages and accounts', s: !signed ? 'todo' : sel ? 'done' : 'cur', chip: signed ? `<span class="small mute">${sel} picked</span>` : '', body: signed ? `<div class="col tight">${PAGES.map(pg => `<label class="radio-card ${S.f.cpm[pg.id] ? 'on' : ''}" style="align-items:center">${chIc(pg.ch, true)}<span class="grow" style="min-width:0"><b>${esc(pg.t)}</b><span class="xs mute" style="display:block">${esc(pg.d)}</span></span>${stChip(pst(pg))}<input ${bindChk('f.cpm.' + pg.id)} aria-label="Connect ${esc(pg.t)}" style="width:20px;height:20px;accent-color:var(--pri)"></label>`).join('')}</div>` : ''},
      {t:'Which agent answers', s: !signed ? 'todo' : anyOn ? 'done' : 'cur', body: signed ? `<div class="field"><label class="sr" for="b-f-cpm-agent">Which agent answers</label>${bindSel('f.cpm.agent', agentNames())}</div>` : ''},
    ])}${signed ? `<div class="row" style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line)"><span class="sp"></span><a class="btn" href="#connections">Cancel</a><button type="button" class="btn pri" data-a="cp-meta-save">Connect ${sel}</button></div>` : ''}`)}
    ${sec('Good to know', '', `<ul class="small" style="margin:0;padding-inline-start:18px;display:flex;flex-direction:column;gap:8px"><li>Comments on posts are not answered. Only messages to the page.</li><li>If the page password changes, Meta may disconnect it. We will show a red bar.</li></ul>`)}
    </div>`;
    return page('conn-meta', 'Facebook Messenger', body, {crumb:['Connections', 'connections']});
  }});
  A['cp-meta-save'] = () => {
    const a = S.f.cpm.agent; let on = 0;
    PAGES.forEach(pg => { pg.st = S.f.cpm[pg.id] ? 'ok' : 'none'; if (pg.st === 'ok') on++; });
    CS.fb.st = PAGES.some(pg => pg.st === 'ok') ? 'ok' : 'none';
    if (CS.fb.st === 'ok') CS.fb.agent = a; S.st = '';
    toast(on ? on + (on === 1 ? ' page or account is' : ' pages and accounts are') + ' connected. ' + a + ' answers.' : 'Nothing is connected to Meta now.');
  };

  /* ---------- U1 Users and roles ---------- */
  const ROLES = ['Account admin','Manager','Call centre agent','Sales agent'];
  const RK = {'Account admin':'manager','Manager':'manager','Call centre agent':'cc','Sales agent':'sales'};
  const LIMIT = 12;
  const LAST = {sami:'Today 9:12 AM', khalid:'Today 4:31 PM', reem:'Now', faisal:'Today 4:44 PM', huda:'Today 3:58 PM', majed:'Now', yousef:'Today 4:26 PM', abdullah:'Yesterday 8:40 PM'};
  const PEOPLE = Object.keys(LAST).map(id => ({id, name:U[id].name, role:U[id].label, email:U[id].email, showroom:U[id].showroom || 'Madinah Road', status:'Active', last:LAST[id]}));
  PEOPLE.push({id:'p-nouf', name:'Nouf Al-Ghamdi', role:'Sales agent', email:'nouf@icaur-alghanim.sa', showroom:'Prince Sultan Road', status:'Invite waiting', last:'Invited Thu 5 Nov'});
  PEOPLE.push({id:'p-ibrahim', name:'Ibrahim Al-Saeed', role:'Call centre agent', email:'ibrahim@icaur-alghanim.sa', showroom:'Madinah Road', status:'Off', last:'Sun 18 Oct'});
  const used = () => S.st === 'limit' ? LIMIT : PEOPLE.filter(p => p.status !== 'Off').length;
  const teamOf = p => RK[p.role] === 'sales' ? p.showroom : RK[p.role] === 'cc' ? 'Call centre' : 'Management';
  const PST = {'Active':'green','Invite waiting':'amber','Off':'grey'};
  const seatBar = (u, extra) => { const pct = Math.min(100, u / LIMIT * 100), tone = u > LIMIT ? 'red' : u >= LIMIT ? 'red' : u >= LIMIT - 2 ? 'amber' : 'green'; return `<div class="cp-seat"><div class="row tight small" style="justify-content:space-between"><span><b class="num">${u}</b> <span class="mute">of ${LIMIT} users on the plan</span></span>${extra || ''}</div><div class="bar-h" role="progressbar" aria-label="Users on the plan" aria-valuenow="${u}" aria-valuemin="0" aria-valuemax="${LIMIT}"><i style="width:${Math.max(2, pct)}%;background:var(--${tone})"></i></div></div>`; };
  if (!S.f.cpu) S.f.cpu = {q:'', role:''};
  R('users', {id:'U1', title:'Users', roles:['vina'], states:[['loading','Loading'],['error','Could not load'],['limit','User limit reached']], render() {
    const q = (S.f.cpu.q || '').toLowerCase().trim(), rf = S.f.cpu.role;
    const rows = PEOPLE.filter(p => (!rf || p.role === rf) && (!q || p.name.toLowerCase().includes(q) || p.email.includes(q)));
    const full = used() >= LIMIT;
    const can = (k) => ({'Open the Manager dashboard':['Yes','—','—'],'See all conversations and leads':['View only','—','—'],'Work their own chats and leads':['—','Yes','Yes'],'Send a lead to sales':['—','Yes','—'],'Book test drives':['—','—','Yes'],'Download CSV':['Yes','—','—'],'Use the control panel':['Later','—','—']})[k];
    const table = rows.length ? `<div class="tbl-wrap"><table class="tbl cp-utbl"><thead><tr><th>Name</th><th>Role</th><th>Team or showroom</th><th>Status</th><th>Last active</th><th><span class="sr">Actions</span></th></tr></thead><tbody>
      ${rows.map(p => `<tr class="${flashCls(p.id)}"><td><div class="who">${av(p.name)}<div style="min-width:0"><div class="nm">${esc(p.name)}</div><div class="xs mute">${esc(p.email)}</div></div></div></td>
        <td><label class="sr" for="cp-r-${p.id}">Role for ${esc(p.name)}</label><select class="inp cp-rsel" id="cp-r-${p.id}" data-ch="cp-role" data-x="${p.id}">${ROLES.map(r => `<option ${r === p.role ? 'selected' : ''}>${r}</option>`).join('')}</select></td>
        <td class="mute">${esc(teamOf(p))}</td><td>${chipC(p.status, PST[p.status], true)}</td><td class="mute num">${esc(p.last)}</td>
        <td class="r">${p.status === 'Invite waiting' ? `<button type="button" class="btn sm" data-a="cp-resend" data-x="${p.id}" aria-label="Resend invite to ${esc(p.name)}">${ic('send', 14)}Resend</button>` : p.status === 'Active' ? `<button type="button" class="btn sm ghost" data-a="cp-off" data-x="${p.id}" aria-label="Turn off ${esc(p.name)}">Turn off</button>` : `<button type="button" class="btn sm" data-a="cp-on" data-x="${p.id}" ${full ? 'disabled title="All users on the plan are used"' : ''} aria-label="Turn on ${esc(p.name)}">Turn on</button>`}</td></tr>`).join('')}
    </tbody></table></div>` : `<div class="card">${empty('search', 'No one matches', 'Nobody on the team has that name or role. Clear the search or add people.', `<button type="button" class="btn" data-a="cp-u-clear">Clear search</button>`)}</div>`;
    const waiting = PEOPLE.filter(p => p.status === 'Invite waiting').length;
    const body = stateWrap(`
      <div class="row" style="align-items:flex-end"><div class="col tight grow" style="min-width:min(100%,320px)"><p class="lead-in">People get an email invite to set their own password.</p></div>${seatBar(used())}<button type="button" class="btn pri" data-a="cp-add" ${full ? 'disabled title="All users on the plan are used"' : ''}>${ic('plus', 16)}Add people</button></div>
      ${full ? `<div class="note warn">${ic('info')}<div>All ${LIMIT} users on the plan are used, so Add people is off. Turn someone off, or <a href="#plan">change the plan</a> to add more people.</div></div>` : ''}
      <div class="row"><div class="fchips" role="group" aria-label="Filter by role">${[['', 'All']].concat(ROLES.map(r => [r, r])).map(([v, t]) => `<button type="button" class="fchip" aria-pressed="${rf === v}" data-a="cp-u-role" data-x="${v}">${t} <span class="n">${v ? PEOPLE.filter(p => p.role === v).length : PEOPLE.length}</span></button>`).join('')}</div><span class="sp"></span>
        <label class="cp-search">${ic('search', 16)}<span class="sr">Search by name</span><input type="search" placeholder="Search by name or email" ${bind('f.cpu.q', true)}></label></div>
      ${table}
      ${sec('Roles and what they can do', 'Roles are the same for every client.', `<div class="tbl-wrap" style="box-shadow:none;background:var(--sub)"><table class="tbl cp-roles"><thead><tr><th style="background:var(--sub)">Can…</th><th style="background:var(--sub)">Account admin, Manager</th><th style="background:var(--sub)">Call centre agent</th><th style="background:var(--sub)">Sales agent</th></tr></thead><tbody>${['Open the Manager dashboard','See all conversations and leads','Work their own chats and leads','Send a lead to sales','Book test drives','Download CSV','Use the control panel'].map(k => `<tr><td>${k}</td>${can(k).map(v => `<td>${v === 'Yes' ? `<span class="green">${ic('check', 16)}</span><span class="sr">Yes</span>` : v === '—' ? '<span class="faint" aria-label="No">—</span>' : `<span class="chip c-grey">${v}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)}`);
    return page('users', 'Users and roles', body);
  }});
  A['cp-u-role'] = el => { S.f.cpu.role = el.dataset.x; };
  A['cp-u-clear'] = () => { S.f.cpu.q = ''; S.f.cpu.role = ''; };
  A['cp-role'] = el => {
    const p = PEOPLE.find(x => x.id === el.dataset.x); const was = p.role; p.role = el.value;
    if (U[p.id]) { U[p.id].label = p.role; U[p.id].role = RK[p.role]; U[p.id].team = teamOf(p); }
    flash(p.id);
    toast(p.name + ' is now ' + (p.role === 'Account admin' ? 'an ' : 'a ') + p.role + '. It applies next time they log in.', () => { p.role = was; if (U[p.id]) { U[p.id].label = was; U[p.id].role = RK[was]; } flash(p.id); render(); });
  };
  A['cp-resend'] = el => { const p = PEOPLE.find(x => x.id === el.dataset.x); p.last = 'Invited ' + nowStr().replace('Today ', 'today '); flash(p.id); toast('Invite sent again to ' + p.email + '.'); };
  A['cp-off'] = el => { const p = PEOPLE.find(x => x.id === el.dataset.x); p.status = 'Off'; flash(p.id); toast(p.name + ' can no longer log in. Their leads stay with them until reassigned.', () => { p.status = 'Active'; flash(p.id); render(); }); };
  A['cp-on'] = el => { const p = PEOPLE.find(x => x.id === el.dataset.x); p.status = 'Active'; flash(p.id); toast(p.name + ' can log in again.'); };

  /* ---------- U2 Add people ---------- */
  const blank = () => ({name:'', email:'', mob:'', role:'Sales agent', team:'Sales', showroom:'Madinah Road'});
  A['cp-add'] = () => { S.f.cpi = {rows:[blank()], err:{}}; openModal('add-people'); };
  AFTER['add-people'] = () => { A['cp-add'](); };
  MODALS['add-people'] = () => {
    const I = S.f.cpi || (S.f.cpi = {rows:[blank()], err:{}});
    const n = I.rows.length, after = used() + n, over = after > LIMIT;
    const e = (i, k) => I.err[i + '.' + k] ? `<span class="err" role="alert" id="cp-e-${i}-${k}">${ic('alert', 14)}${esc(I.err[i + '.' + k])}</span>` : '';
    const fld = (i, k, label, type, ph) => `<div class="field"><label for="b-f-cpi-rows-${i}-${k}">${label}</label><input class="inp ${I.err[i + '.' + k] ? 'bad' : ''}" type="${type}" ${ph ? `placeholder="${ph}"` : ''} ${bind('f.cpi.rows.' + i + '.' + k)} ${I.err[i + '.' + k] ? `aria-invalid="true" aria-describedby="cp-e-${i}-${k}"` : ''}>${e(i, k)}</div>`;
    const body = `${I.rows.map((r, i) => `<div class="cp-irow" role="group" aria-label="Person ${i + 1}"><div class="row tight"><span class="eyebrow grow">Person ${i + 1}</span>${n > 1 ? `<button type="button" class="btn sm ghost" data-a="cp-i-rm" data-x="${i}" aria-label="Remove person ${i + 1}">${ic('x', 14)}Remove</button>` : ''}</div>
        <div class="g">${fld(i, 'name', 'Name', 'text', 'e.g. Nouf Al-Ghamdi')}${fld(i, 'email', 'Email', 'email', 'name@icaur-alghanim.sa')}${fld(i, 'mob', 'Mobile', 'tel', '+966 5x xxx xxxx')}</div>
        <div class="g"><div class="field"><label for="b-f-cpi-rows-${i}-role">Role</label>${bindSel('f.cpi.rows.' + i + '.role', ROLES)}</div>
        <div class="field"><label for="b-f-cpi-rows-${i}-team">Team</label>${bindSel('f.cpi.rows.' + i + '.team', ['Sales','Call centre','Management'])}</div>
        <div class="field"><label for="b-f-cpi-rows-${i}-showroom">Showroom</label>${bindSel('f.cpi.rows.' + i + '.showroom', SHOWROOMS.concat(['All showrooms']))}</div></div></div>`).join('')}
      <div class="row tight"><button type="button" class="btn ghost" data-a="cp-i-add" ${after >= LIMIT ? 'disabled title="The plan has no more users"' : ''}>${ic('plus', 16)}Add another person</button>${after >= LIMIT && !over ? '<span class="xs mute">The plan has no more users after these.</span>' : ''}</div>
      ${seatBar(after)}
      <div class="note ${over ? 'err' : 'info'}" ${over ? 'role="alert"' : ''}>${ic(over ? 'alert' : 'info')}<div>${over ? `These invites would make ${after} users. The plan allows ${LIMIT}. Remove someone here, or <a href="#plan">see Plan and usage</a>.` : `After these invites, ${after} of ${LIMIT} users on your plan are used. <a href="#plan">Plan and usage</a>`}</div></div>`;
    return modalFrame('Add people', body, `<span class="small mute grow">They get an email to set their own password.</span><button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="cp-i-send" ${over ? 'disabled' : ''}>${ic('send', 15)}Send ${n === 1 ? 'invite' : n + ' invites'}</button>`, {size:'wide', sub:'Add ' + esc(client().name) + '\'s managers and agents.'});
  };
  A['cp-i-add'] = () => { S.f.cpi.rows.push(blank()); };
  A['cp-i-rm'] = el => { S.f.cpi.rows.splice(Number(el.dataset.x), 1); S.f.cpi.err = {}; };
  A['cp-i-send'] = () => {
    const I = S.f.cpi, err = {};
    I.rows.forEach((r, i) => {
      if (!r.name.trim()) err[i + '.name'] = 'Add their name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())) err[i + '.email'] = 'Use an email like name@icaur-alghanim.sa.';
      else if (PEOPLE.some(p => p.email === r.email.trim().toLowerCase())) err[i + '.email'] = 'This person is already on the team.';
      if (!/^(\+966|0)5\d{8}$/.test(r.mob.replace(/[\s-]/g, ''))) err[i + '.mob'] = 'Use a Saudi mobile: +966 5x xxx xxxx.';
    });
    I.err = err; if (Object.keys(err).length) return;
    I.rows.forEach(r => { const id = uid('p-'); flash(id); PEOPLE.push({id, name:r.name.trim(), role:r.role, email:r.email.trim().toLowerCase(), showroom:r.showroom, status:'Invite waiting', last:'Invited ' + nowStr().replace('Today', 'today')}); });
    const n = I.rows.length; S.modal = null; S.f.cpi = null;
    toast(n + (n === 1 ? ' invite' : ' invites') + ' sent. They get an email to set their password.');
  };

  /* ---------- ST1 Client settings + B1 Plan and usage ---------- */
  const tabs = cur => `<div class="tabs" role="tablist" aria-label="Settings">${[['client-settings','Business'],['plan','Plan and usage']].map(([k, t]) => `<a class="tab" role="tab" href="#${k}" aria-selected="${cur === k}">${t}</a>`).join('')}</div>`;
  const ST_INIT = {name:'iCaur Alghanim', type:'Car dealer', cr:'4030 512 887', email:'billing@icaur-alghanim.sa', logo:'',
    rooms:[{name:'Madinah Road, Jeddah', hours:'Saturday to Thursday 9 AM to 9 PM · Friday closed', staff:'3 sales agents'},{name:'Prince Sultan Road, Jeddah', hours:'Saturday to Thursday 10 AM to 10 PM · Friday 4 PM to 10 PM', staff:'1 sales agent'}],
    lost: LOST_REASONS.slice()};
  let stSaved = JSON.stringify(ST_INIT), barUp = false;
  if (!S.f.cps) S.f.cps = JSON.parse(stSaved);
  const dirtyCount = () => { const a = S.f.cps, b = JSON.parse(stSaved); return Object.keys(b).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k])).length; };
  R('client-settings', {id:'ST1', title:'Settings', roles:['vina'], states:[['loading','Loading'],['error','Could not load']], render() {
    const s = S.f.cps, d = dirtyCount(), ed = S.f.cpsEdit;
    const slide = d && !barUp ? 'anim-in' : ''; barUp = !!d; // the bar slides up only when changes first appear
    const body = stateWrap(`${tabs('client-settings')}
      <div class="g2" style="align-items:start">
      <div class="col loose">
        ${sec('Business details', 'Used by the agent, in emails and on invoices.', `<div class="col">
          <div class="row">${s.logo ? `<img src="${s.logo}" alt="Business logo" style="width:56px;height:56px;border-radius:12px;object-fit:contain;background:var(--sub)">` : `<span class="av lg" style="border-radius:14px;width:56px;height:56px;flex-basis:56px;background:#FFFFFF;color:#202253;box-shadow:inset 0 0 0 1px var(--line)">iC</span>`}<div class="col tight" style="align-items:flex-start"><label class="btn sm" for="cp-logo" style="cursor:pointer">${ic('upload', 14)}Change logo</label><input type="file" id="cp-logo" class="sr" accept="image/png,image/svg+xml" data-ch="cp-logo"><span class="xs mute">PNG or SVG, square, at least 256 px</span></div></div>
          <div class="g2" style="gap:14px"><div class="field"><label for="b-f-cps-name">Business name</label><input class="inp" ${bind('f.cps.name', true)}></div><div class="field"><label for="b-f-cps-type">Business type</label>${bindSel('f.cps.type', ['Car dealer','Clinic or lab','Real estate','Retail','Hotel','Other'])}</div>
          <div class="field"><label for="b-f-cps-cr">Commercial registration</label><input class="inp num" ${bind('f.cps.cr', true)}></div><div class="field"><label for="b-f-cps-email">Billing email</label><input class="inp" type="email" ${bind('f.cps.email', true)}></div></div></div>`)}
        ${sec('Showrooms and working hours', 'VINA uses these hours for "after working hours" replies and test drive slots.', `<div class="list">${s.rooms.map((r, i) => ed === i ? `<div class="li col" style="align-items:stretch"><div class="field"><label for="b-f-cps-rooms-${i}-name">Showroom</label><input class="inp" ${bind('f.cps.rooms.' + i + '.name', true)}></div><div class="field"><label for="b-f-cps-rooms-${i}-hours">Working hours and closed days</label><input class="inp" ${bind('f.cps.rooms.' + i + '.hours', true)}></div><div class="row tight"><span class="sp"></span>${s.rooms.length > 1 ? `<button type="button" class="btn sm danger-o" data-a="cp-room-rm" data-x="${i}">Remove</button>` : ''}<button type="button" class="btn sm pri" data-a="cp-room-done">Done</button></div></div>`
          : `<div class="li"><span class="chi c-navy">${ic('store', 15)}</span><div class="grow" style="min-width:0"><b>${esc(r.name || 'New showroom')}</b><div class="xs mute">${esc(r.hours)}${r.staff ? ' · ' + esc(r.staff) : ''}</div></div><button type="button" class="btn sm" data-a="cp-room-edit" data-x="${i}" aria-label="Edit ${esc(r.name)}">Edit</button></div>`).join('')}</div><button type="button" class="btn ghost" data-a="cp-room-add" style="margin-top:8px">${ic('plus', 16)}Add showroom</button>`)}
        ${sec('Download all data', 'Conversations, leads and ratings as CSV files in one zip. We email a link when it is ready.', `<button type="button" class="btn" data-a="cp-export">${ic('download', 16)}Request download</button>`)}
      </div>
      <div class="col loose">
        ${sec('Lead statuses', 'One set for chips, board columns and charts. Colours stay the same everywhere.', `<div class="list">${ST_ORDER.map(k => `<div class="li">${chip(k)}<span class="small mute grow">${esc(STATUS[k].means)}</span></div>`).join('')}</div><div class="note" style="margin-top:12px">${ic('info')}<div>Statuses are being agreed with the sales team. Ask VINA support to rename one.</div></div>`)}
        ${sec('Lost reasons', 'Shown when an agent closes a lead as Lost. "Not interested" is its own result.', `<div class="col tight">${s.lost.map((x, i) => `<div class="row tight nowrap"><label class="sr" for="b-f-cps-lost-${i}">Lost reason ${i + 1}</label><input class="inp grow" ${bind('f.cps.lost.' + i, true)}><button type="button" class="ibtn bare" data-a="cp-lost-rm" data-x="${i}" aria-label="Remove ${esc(x)}" ${s.lost.length < 2 ? 'disabled' : ''}>${ic('trash', 16)}</button></div>`).join('')}<div><button type="button" class="btn ghost" data-a="cp-lost-add">${ic('plus', 16)}Add a reason</button></div></div>`)}
      </div></div>
      ${d ? `<div class="cp-save ${slide}" role="region" aria-label="Unsaved changes"><span class="dt" aria-hidden="true"></span><span class="grow"><b>${d} unsaved ${d === 1 ? 'change' : 'changes'}</b><span class="m"> · Agents see them after you save</span></span><button type="button" class="btn sm" data-a="cp-st-cancel">Discard</button><button type="button" class="btn sm pri" data-a="cp-st-save">Save changes</button></div>` : ''}`);
    return page('client-settings', 'Settings', body, {after: d ? `<span class="sr">Unsaved changes</span><span aria-hidden="true" style="width:8px;height:8px;border-radius:50%;background:var(--amber)"></span>` : ''});
  }});
  A['cp-logo'] = el => {
    const file = el.files && el.files[0]; if (!file) return false;
    if (!/image\/(png|svg\+xml)/.test(file.type)) { toast('Use a PNG or SVG file.'); return; }
    const r = new FileReader(); r.onload = () => { S.f.cps.logo = r.result; render(); }; r.readAsDataURL(file); return false;
  };
  A['cp-room-edit'] = el => { S.f.cpsEdit = Number(el.dataset.x); };
  A['cp-room-done'] = () => { S.f.cpsEdit = null; };
  A['cp-room-add'] = () => { S.f.cps.rooms.push({name:'', hours:'Saturday to Thursday 9 AM to 9 PM · Friday closed', staff:''}); S.f.cpsEdit = S.f.cps.rooms.length - 1; };
  A['cp-room-rm'] = el => { S.f.cps.rooms.splice(Number(el.dataset.x), 1); S.f.cpsEdit = null; };
  A['cp-lost-add'] = () => { S.f.cps.lost.push(''); };
  A['cp-lost-rm'] = el => { S.f.cps.lost.splice(Number(el.dataset.x), 1); };
  A['cp-export'] = () => { toast('Preparing the zip. We will email a link to ' + S.f.cps.email + ' when it is ready.'); };
  A['cp-st-cancel'] = () => { S.f.cps = JSON.parse(stSaved); S.f.cpsEdit = null; };
  A['cp-st-save'] = () => {
    const s = S.f.cps;
    if (!s.name.trim()) { toast('Add the business name before saving.'); return; }
    s.lost = s.lost.map(x => x.trim()).filter(Boolean); s.rooms = s.rooms.filter(r => r.name.trim());
    LOST_REASONS.splice(0, LOST_REASONS.length, ...s.lost);
    client().name = s.name.trim();
    stSaved = JSON.stringify(s); S.f.cpsEdit = null; toast('Settings saved. Agents see the new lost reasons when they close a lead.');
  };

  const VAT = 0.15;
  const sar = n => 'SAR ' + n.toLocaleString('en-US', {minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2});
  const INV = [{m:'October 2026', no:'INV-2026-1043', base:1862, paid:false},{m:'September 2026', no:'INV-2026-0921', base:1705, paid:true},{m:'August 2026', no:'INV-2026-0806', base:1540, paid:true},{m:'July 2026', no:'INV-2026-0712', base:1288, paid:true}];
  const withVat = b => Math.round(b * (1 + VAT) * 100) / 100;
  R('plan', {id:'B1', title:'Plan and usage', roles:['vina'], states:[['loading','Loading'],['error','Could not load'],['paid','All paid']], render() {
    const inv = INV.map(i => Object.assign({}, i, {paid: i.paid || S.st === 'paid'}));
    const conv = 2436, convMax = 10000, u = used();
    const lines = [['Pro plan','November 2026',750,'navy'],['Meta WhatsApp charges','Passed through at cost · 1,742 conversations',418,'green'],['AI usage','Passed through at cost',236,'teal'],['Phone minutes', CS.ph.st === 'ok' ? 'Passed through at cost · 0 minutes' : 'Not used',0,'grey']];
    const sub = lines.reduce((a, l) => a + l[2], 0);
    const meter = (k, v, of, pct, tone, n) => `<div class="card cp-meter col tight"><span class="eyebrow mk">${mic(k, 13)}${k}</span><div class="row tight" style="align-items:baseline"><span class="cp-big" ${countAttr(v)}>${v}</span><span class="mute">of ${of}</span></div><div class="bar-h" role="progressbar" aria-label="${k}" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.max(2, pct)}%;background:var(--${tone})"></i></div><span class="xs mute">${n}</span></div>`;
    const unpaid = inv.filter(i => !i.paid);
    const body = stateWrap(`${tabs('plan')}
      ${unpaid.length ? `<div class="note warn" role="status">${ic('info')}<div class="grow">The October invoice of <b>${sar(withVat(unpaid[0].base))}</b> is not paid yet. It was due on 5 November.</div><button type="button" class="btn sm pri" data-a="cp-pay" data-x="${unpaid[0].no}">Pay now</button></div>` : ''}
      <div class="g3">
        <div class="card cp-plan col tight"><span class="eyebrow mk">${mic('plan', 13)}Your plan</span><span class="cp-big">Pro</span><span>${sar(750)} a month, before VAT</span><span class="xs mute">3 agents and ${LIMIT} users included · renews 1 December 2026</span><div class="row tight" style="margin-top:auto;padding-top:10px"><button type="button" class="btn sm" data-a="cp-plan-change">Change plan</button><button type="button" class="btn sm ghost" data-a="cp-plan-talk">Talk to us</button></div></div>
        ${meter('Conversations this month', num(conv), num(convMax), conv / convMax * 100, 'horizon', '1 to 7 November · resets 1 December')}
        ${meter('Users', String(u), LIMIT, u / LIMIT * 100, u >= LIMIT ? 'red' : u >= LIMIT - 2 ? 'amber' : 'green', 'Agents: 3 of 3 · <a href="#users">Users and roles</a>')}
      </div>
      ${sec('This month so far', '1 to 7 November 2026 · Meta and AI charges are passed through at cost, with nothing added.', `<div class="grow-x" style="margin-bottom:12px"><div class="cp-stack" role="img" aria-label="Charges so far: ${lines.filter(l => l[2]).map(l => l[0] + ' ' + sar(l[2])).join(', ')}">${lines.filter(l => l[2]).map(l => `<i style="flex:${l[2]} 1 0;background:var(--${l[3]}-f)"></i>`).join('')}</div></div>
        <div class="legend" style="margin-bottom:12px">${lines.filter(l => l[2]).map(l => `<span><i style="background:var(--${l[3]}-f)"></i>${l[0]}</span>`).join('')}</div>
        <div class="tbl-wrap" style="box-shadow:none"><table class="tbl"><tbody>${lines.map(([k, n, v]) => `<tr><td><b>${k}</b><div class="xs mute">${n}</div></td><td class="r num b">${sar(v)}</td></tr>`).join('')}
        <tr><td><b>Total so far</b><div class="xs mute">Before VAT</div></td><td class="r num bb">${sar(sub)}</td></tr><tr><td class="mute">VAT 15%</td><td class="r num mute">${sar(Math.round(sub * VAT * 100) / 100)}</td></tr><tr><td><b>Total with VAT</b></td><td class="r num bb" style="font-size:15px">${sar(withVat(sub))}</td></tr></tbody></table></div>`)}
      ${sec('Invoices', 'Amounts include 15% VAT.', `<div class="tbl-wrap" style="box-shadow:none"><table class="tbl cp-inv"><thead><tr><th>Month</th><th>Invoice</th><th class="r">Amount</th><th>Status</th><th><span class="sr">Action</span></th></tr></thead><tbody>${inv.map(i => `<tr class="${flashCls(i.no)}"><td class="b">${i.m}</td><td class="mute num">${i.no}</td><td class="r num b">${sar(withVat(i.base))}</td><td>${i.paid ? chipC('Paid', 'green', true) : chipC('Not paid', 'red', true)}</td><td class="r">${i.paid ? `<button type="button" class="btn sm ghost" data-a="cp-inv-dl" data-x="${i.no}" aria-label="Download ${i.no}">${ic('download', 14)}Download</button>` : `<button type="button" class="btn sm pri" data-a="cp-pay" data-x="${i.no}">Pay now</button>`}</td></tr>`).join('')}</tbody></table></div>`)}`);
    return page('plan', 'Plan and usage', body);
  }});
  A['cp-plan-change'] = () => { toast('Plan changes are made with VINA support for now. We will call the account admin.'); };
  A['cp-plan-talk'] = () => { toast('Message sent to VINA support. We reply within one working day.'); };
  A['cp-inv-dl'] = el => { toast(el.dataset.x + '.pdf is ready. In this prototype, files are not downloaded.'); };
  A['cp-pay'] = el => { openModal('cp-pay', {no: el.dataset.x, phase:'pick'}); };
  A['cp-paying'] = () => { S.modal.phase = 'paying'; S.modal.until = Date.now() + 2000; };
  A['cp-paid'] = () => { const m = S.modal; if (!m || m.id !== 'cp-pay') return false; m.phase = 'done'; const i = INV.find(x => x.no === m.no); if (i) i.paid = true; };
  A['cp-pay-done'] = () => { const m = S.modal; S.modal = null; if (m) flash(m.no); };
  MODALS['cp-pay'] = m => {
    const i = INV.find(x => x.no === m.no), vat = Math.round(i.base * VAT * 100) / 100;
    if (m.phase === 'done') return modalFrame('Paid', `<div class="cp-paid" role="status"><span class="ok">${ic('check', 28)}</span><b style="font-size:16px">${sar(withVat(i.base))} paid</b><span class="small mute">For ${i.m}. The receipt is sent to ${esc(S.f.cps.email)}.</span></div>`, `<button type="button" class="btn pri" data-a="cp-pay-done">Done</button>`, {size:'narrow'});
    const busy = m.phase === 'paying';
    return modalFrame('Pay ' + i.m, `<div class="tbl-wrap" style="box-shadow:none;background:var(--sub)"><table class="tbl"><tbody><tr><td>Invoice ${i.no}</td><td class="r num">${sar(i.base)}</td></tr><tr><td>VAT 15%</td><td class="r num">${sar(vat)}</td></tr><tr><td><b>To pay</b></td><td class="r num bb">${sar(withVat(i.base))}</td></tr></tbody></table></div>
      <div class="radio-card on" role="radio" aria-checked="true">${ic('card', 20)}<span class="grow"><b>Saved card ending 4417</b><span class="xs mute" style="display:block">Added by Sami Al-Rashid, account admin</span></span>${ic('check', 18)}</div>
      ${busy ? `<div class="note" role="status">${ic('lock', 16)}<span>Paying securely. Do not close this window.</span><span class="sr" data-until="${m.until}" data-done="cp-paid"></span></div>` : ''}`,
      `<button type="button" class="btn" data-a="close-modal" ${busy ? 'disabled' : ''}>Cancel</button><button type="button" class="btn pri" data-a="cp-paying" ${busy ? 'aria-busy="true" disabled' : ''}>${busy ? '<span class="spin" aria-hidden="true"></span>Paying' : 'Pay ' + sar(withVat(i.base))}</button>`, {size:'narrow'});
  };
})();
