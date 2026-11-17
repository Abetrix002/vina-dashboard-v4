/* AG1 Inbox · AG2 Callbacks · AG3 Send to sales + Close lead (with LD6 lost reasons) · AG4 Alerts and status.
   Exposes: R inbox/callbacks/alerts, MODALS send-sales/close-lead/call, DRAWERS.alerts, A.bell, window.startCall, AFTER send-sales/close-lead. */
(function () {
  document.body.insertAdjacentHTML('beforeend', `<style>
/* AG1 inbox: list · chat · customer panel */
.ag-inbox{display:grid;grid-template-columns:304px minmax(0,1fr) 336px;height:calc(100vh - 69px);min-height:540px;position:relative}
.ag-col{display:flex;flex-direction:column;min-height:0;min-width:0;border-right:1px solid var(--line);background:var(--card)}
.ag-folders{padding:12px;display:flex;flex-wrap:wrap;gap:6px;border-bottom:1px solid var(--line)}
.ag-folders .fchip{min-height:32px;font-size:12px;padding:0 11px}
.ag-list{flex:1;overflow-y:auto}
.ag-item{position:relative;display:flex;gap:10px;width:100%;padding:12px 14px 12px 16px;border:0;border-bottom:1px solid var(--line);background:transparent;text-align:start;cursor:pointer;color:var(--text);font:inherit;transition:background var(--d1)}
.ag-item:hover{background:var(--sub)}
.ag-item[aria-current="true"]{background:var(--sel);box-shadow:inset 3px 0 0 var(--horizon)}
.ag-item .l1{display:flex;align-items:center;gap:6px;min-width:0}
.ag-item .nm{font-weight:600}
.ag-item.unread .nm{font-weight:700}
.ag-item .tm{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;font-size:12px;font-variant-numeric:tabular-nums}
.ag-item .l2{font-size:13px;color:var(--mute);margin-top:3px}
.ag-item.unread .l2{color:var(--text)}
.ag-item .l3{display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap}
.ag-chatcol{background:var(--bg)}
.ag-chead{display:flex;align-items:center;gap:10px;flex-wrap:nowrap;min-height:64px;padding:10px 16px;background:var(--card);border-bottom:1px solid var(--line)}
.ag-chead .btn{flex:0 0 auto}
.ag-chatcol .chat{flex:1;min-height:0}
.ag-paused{display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--amber-b);color:var(--amber-f);border-bottom:1px solid color-mix(in srgb,var(--amber-f) 22%,transparent);font-size:12px;line-height:1.4}
.ag-paused b{display:block;font-size:13px}
.ag-paused.flash{animation:agDrop var(--d3) var(--spring) 1}
@keyframes agDrop{from{opacity:0;transform:translateY(-8px)}}
.ag-closedbar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:var(--grey-b);color:var(--grey-f);font-size:13px;font-weight:500}
.msg.agent:not(.note) .bub a{color:inherit;text-decoration:underline}
.ag-tplh{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:.02em;opacity:.78;margin-bottom:4px}
.ag-comp{position:relative;background:var(--card);border-top:1px solid var(--line);padding:0 16px 12px;display:flex;flex-direction:column;gap:8px}
.ag-comp-top{display:flex;align-items:center;gap:10px}
.ag-comp .tabs{border-bottom:0}
.ag-win{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:var(--r-m);background:var(--amber-b);color:var(--amber-f);font-size:12.5px;line-height:1.45}
.ag-win b{color:inherit}
.ag-ta{border:1px solid var(--line2);min-height:72px!important;resize:none}
.ag-ta.note{background:var(--amber-b)}
.ag-ta:disabled{opacity:.6;cursor:not-allowed}
.ag-tools{display:flex;align-items:center;gap:8px;flex-wrap:nowrap}
.ag-comp .menu{bottom:52px;left:16px;max-width:min(420px,calc(100% - 32px))}
.ag-comp .menu button{white-space:normal;padding:8px 10px;min-height:44px;align-items:flex-start;flex-direction:column;gap:2px}
.ag-file:focus-visible+label{outline:2px solid var(--horizon);outline-offset:2px}
.ag-panel{background:var(--card);overflow-y:auto;padding:18px;gap:16px;border-right:0}
.ag-sum{background:var(--teal-b);border-radius:var(--r-m);padding:12px 14px;font-size:13px;color:var(--text)}
.ag-sum .hd{display:flex;align-items:center;gap:6px;color:var(--teal-f);font-weight:700;font-size:12px;letter-spacing:.02em;margin-bottom:6px}
.ag-sum .kv{margin-top:10px;padding-top:10px;border-top:1px solid color-mix(in srgb,var(--teal-f) 22%,transparent);grid-template-columns:auto 1fr;gap:6px 12px;font-size:12.5px}
.ag-pact{display:flex;flex-direction:column;gap:8px}
.ag-panel>.kv{padding-top:14px;border-top:1px solid var(--line);padding-bottom:72px}
.ag-back,.ag-pbtn{display:none}
/* AG2 callbacks */
.ag-daycard{padding:18px 20px}
.ag-day{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ag-dayline{display:none}
.ag-grp{overflow:hidden}
.ag-grp-h{display:flex;align-items:center;gap:8px;padding:16px 20px 10px}
.ag-grp-h h2{font-family:var(--f-display);font-size:15px;font-weight:700}
.ag-cnt{min-width:22px;height:22px;padding:0 7px;border-radius:999px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}
.ag-cbrow{display:grid;grid-template-columns:120px minmax(220px,1.2fr) minmax(200px,2fr) auto;grid-template-areas:"tm who why act";gap:8px 18px;align-items:center;padding:14px 20px;border-top:1px solid var(--line)}
.ag-cbrow.over{box-shadow:inset 3px 0 0 var(--red)}
.ag-cbrow .ag-tm{grid-area:tm} .ag-cbrow .ag-who{grid-area:who} .ag-cbrow .ag-why{grid-area:why;min-width:0} .ag-cbrow .ag-act{grid-area:act;justify-content:flex-end}
.ag-cbrow .tm{font-family:var(--f-display);font-size:20px;line-height:26px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.ag-cbrow .tm.red{color:var(--red-f)}
/* AG2 call dialog */
.ag-callcard{background:linear-gradient(135deg,#202253,#2D317A);color:#FFFFFF;border-radius:var(--r-l);padding:20px 22px;display:flex;flex-direction:column;gap:10px}
.ag-callcard .tm{font-family:var(--f-display);font-size:44px;line-height:48px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.ag-callcard .mu{color:rgba(255,255,255,.74);font-size:13px}
.ag-res{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ag-res .radio-card{min-height:78px;align-items:center;gap:14px}
.ag-res .radio-card .chi{width:42px;height:42px;flex-basis:42px;border-radius:12px}
.ag-res .radio-card b{display:block;font-size:14px}
.ag-res .radio-card .s{display:block;font-size:12px;color:var(--mute);margin-top:2px}
.ag-res .k-green:hover{border-color:var(--green-f);background:var(--green-b)} .ag-res .k-grey:hover{border-color:var(--grey-f);background:var(--grey-b)}
.ag-res .k-amber:hover{border-color:var(--amber-f);background:var(--amber-b)} .ag-res .k-red:hover{border-color:var(--red-f);background:var(--red-b)}
/* AG3 close lead */
.ag-r3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ag-r2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
/* AG4 alerts */
.ag-alpage{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;align-items:start}
.ag-al{position:relative;display:flex;align-items:flex-start;gap:12px;width:100%;padding:12px 14px;border:0;border-radius:var(--r-m);background:transparent;text-align:start;cursor:pointer;color:var(--text);font:inherit;transition:background var(--d1)}
.ag-al:hover{background:var(--sub)}
.ag-al.unread{background:var(--sel)}
.ag-al.unread::before{content:"";position:absolute;inset-inline-start:0;top:12px;bottom:12px;width:3px;border-radius:0 3px 3px 0;background:var(--horizon)}
.ag-al .chi{width:36px;height:36px;flex-basis:36px;border-radius:10px}
.ag-al .t{font-size:13px;font-weight:600}
.ag-al.unread .t{font-weight:700}
.ag-al .bd{display:block;font-size:13px;color:var(--mute);margin-top:2px}
.ag-al .unread-dot{margin-top:6px}
.ag-alhead{display:flex;align-items:center;gap:12px;min-height:40px}
@media (max-width:1180px){
  .ag-inbox{grid-template-columns:280px minmax(0,1fr)}
  .ag-panel{display:none}
  .ag-panel.open{display:flex;position:absolute;top:0;right:0;bottom:0;width:min(340px,100%);box-shadow:var(--e3);z-index:5}
  .ag-pbtn{display:inline-flex}
  .ag-tools .ag-tl,.ag-chead .ag-hl2,.ag-comp-top .ag-hint{display:none}
  .ag-cbrow{grid-template-columns:104px minmax(0,1fr) auto;grid-template-areas:"tm who act" "tm why act"}
  .ag-alpage{grid-template-columns:1fr}
}
@media (max-width:760px){
  .ag-inbox{grid-template-columns:1fr;height:calc(100vh - 118px)}
  .ag-inbox[data-mob="list"] .ag-chatcol{display:none}
  .ag-inbox[data-mob="chat"] .ag-listcol{display:none}
  .ag-back{display:inline-flex}
  .ag-chead{padding:8px 12px;gap:8px}
  .ag-chead .ag-hl{display:none}
  .ag-comp-top .ag-hint{display:none}
  .ag-daycard{display:none}
  .ag-dayline{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:12px 14px;border-radius:var(--r-m);background:var(--sub);font-size:13px;color:var(--mute)}
  .ag-dayline b{color:var(--text);font-family:var(--f-display)}
  .ag-grp-h{padding:14px 16px 8px}
  .ag-cbrow{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"who tm" "why why" "act act";padding:14px 16px}
  .ag-cbrow .ag-tm{text-align:end}
  .ag-cbrow .ag-tm .row{justify-content:flex-end}
  .ag-cbrow .ag-act{justify-content:stretch}
  .ag-cbrow .ag-act .btn{flex:1}
  .ag-res,.ag-r3{grid-template-columns:1fr}
  .ag-r3 .radio-card{flex-direction:row!important;align-items:center}
  .ag-res .radio-card{min-height:64px}
  .ag-callcard .tm{font-size:36px;line-height:40px}
}
</style>`);

  const G = S.ag = {folder:{cc:'callbacks', sales:'sent'}, sel:null, tab:'reply', mob:'list', panel:false, typing:null, replied:new Set(), duePopped:new Set(['l09']), cbTab:'today', alF:'all'};
  const isOpen = l => !['sold','lost'].includes(l.status);
  const elapsed = () => (Date.now() - T0) / 60000;
  const rem = l => l.cb ? Math.round(l.cb.in - elapsed()) : null;
  const firstName = l => l.name.split(' ')[0];
  const fill = (s, l) => s.replace(/\{first\}/g, firstName(l)).replace(/\{model\}/g, l.model).replace(/\{me\}/g, first(S.me));
  const windowClosed = l => l.ch === 'wa' && l.lastIn > 24;

  /* ---------- Alerts: kept per person ---------- */
  const AL = {
    cc:[{id:uid('a'), type:'wait', title:'Customer waiting', body:'Hessa Al-Mutairi has waited 25 minutes for a call about financing.', lead:'l11', when:'4:45 PM', read:false},
        {id:uid('a'), type:'hand', title:'VINA handed over a chat', body:'Sultan Al-Dossari asked to talk to a person about the warranty.', lead:'l12', when:'4:33 PM', read:false},
        {id:uid('a'), type:'taken', title:'Lead given to someone else', body:'Rakan Al-Harbi was given to Faisal because it waited 15 minutes.', lead:'l31', when:'3:42 PM', read:true},
        {id:uid('a'), type:'sales', title:'Lead accepted by sales', body:'Yousef Al-Ghamdi took Maha Al-Juhani. He will call her at 7:30 PM.', lead:'l15', when:'2:25 PM', read:true}],
    sales:[{id:uid('a'), type:'new', title:'New lead for you', body:'Lama Hassan · V27 2027 · Wants a test drive this weekend. Sent by Reem from the call centre.', lead:'l06', when:'4:45 PM', read:false},
        {id:uid('a'), type:'wait', title:'Customer waiting', body:'Abdulrahman Saleh has waited 25 minutes for your reply on WhatsApp.', lead:'l01', when:'4:50 PM', read:false},
        {id:uid('a'), type:'taken', title:'Lead given to Yousef', body:'Omar Bakr was given to Yousef because it waited 15 minutes.', lead:'l24', when:'3:50 PM', read:true},
        {id:uid('a'), type:'rating', title:'New rating', body:'Fahad Al-Shehri rated your chat 5 stars.', lead:'l07', when:'1:05 PM', read:true}],
  };
  const _signIn = signIn;
  signIn = function (role, opts) { if (S.role && AL[S.role]) AL[S.role] = S.alerts; S.alerts = AL[role] || []; return _signIn(role, opts); };
  // type: [icon, colour, label, filter label]
  const AT = {new:['user','teal','New lead','New leads'], due:['clock','amber','Callback','Callbacks'], wait:['conv','red','Waiting','Waiting'], hand:['user','blue','Handed over','Handed over'], taken:['give','grey','Taken away','Taken away'], sales:['send','navy','Sales','Sales'], rating:['star','green','Rating','Ratings']};
  const alertRow = a => { const [i, c, lbl] = AT[a.type] || AT.new; return `<button type="button" class="ag-al ${a.read ? '' : 'unread'} ${flashCls(a.id)}" data-a="ag-alert-open" data-x="${a.id}"><span class="chi c-${c}" title="${esc(lbl)}">${ic(i, 17)}</span><span class="grow"><span class="row tight nowrap"><span class="t grow ell">${esc(a.title)}</span><span class="xs mute num" style="white-space:nowrap">${esc(a.when)}</span></span><span class="bd">${esc(a.body)}</span></span>${a.read ? '' : '<span class="unread-dot" aria-hidden="true"></span><span class="sr">New</span>'}</button>`; };
  const alertGroups = list => { const fresh = list.filter(a => !a.read), old = list.filter(a => a.read); return `${fresh.length ? `<div class="eyebrow" style="margin:14px 0 6px">New · ${fresh.length}</div><div class="col tight">${fresh.map(alertRow).join('')}</div>` : ''}${old.length ? `<div class="eyebrow" style="margin:14px 0 6px">Earlier today</div><div class="col tight">${old.map(alertRow).join('')}</div>` : ''}`; };
  const readAll = n => n ? `<button type="button" class="btn sm ghost" data-a="ag-read-all">${ic('check', 14)}Mark all as read</button>` : `<span class="row tight xs mute nowrap">${ic('check', 14)}All caught up</span>`;
  A.bell = () => { openDrawer('alerts'); };
  DRAWERS.alerts = () => {
    const n = S.alerts.filter(a => !a.read).length;
    return drawerFrame('Alerts', `<div class="ag-alhead">${readAll(n)}<span class="sp"></span><span class="small">Sound</span>${sw(S.sound, 'ag-sound', '', 'Alert sound')}</div>
      <div style="margin-top:-14px">${S.alerts.length ? alertGroups(S.alerts) : empty('bell', 'No alerts yet', 'When a lead is given to you or a callback is due, it shows here.')}</div>`,
      `<a class="btn wide" href="#alerts">See all alerts${ic('arrowR', 14)}</a>`, n ? n + ' new' : 'All read');
  };
  A['ag-read-all'] = () => { S.alerts.forEach(a => { a.read = true; }); toast('All alerts marked as read.'); };
  A['ag-sound'] = () => { S.sound = !S.sound; toast(S.sound ? 'Alert sound is on.' : 'Alert sound is off.'); };
  A['ag-alert-open'] = (el) => {
    const a = S.alerts.find(x => x.id === el.dataset.x); if (!a) return; a.read = true; S.drawer = null;
    const l = lead(a.lead);
    if (a.type === 'due') go('callbacks');
    else if (l && l.owner === S.me) { G.sel = l.id; G.mob = 'chat'; G.folder[S.role] = 'mine'; stickBottom(); go('inbox'); }
  };
  A['ag-alf'] = (el) => { G.alF = el.dataset.x; };
  // Callback due in 10 minutes: once per lead
  setInterval(() => {
    if (!isCC()) return;
    mine().forEach(l => {
      const r = rem(l);
      if (!l.cb || l.cb.done || !isOpen(l) || G.duePopped.has(l.id) || r == null || r > 10 || r < 0) return;
      G.duePopped.add(l.id);
      S.alerts.unshift({id:uid('a'), type:'due', title:'Callback in 10 minutes', body:`${l.name} · ${l.model} · ${l.cb.at} · ${l.cb.why}`, lead:l.id, when:clock(now()), read:false});
      pop({title:'Callback in 10 minutes', body:`${l.name} at ${l.cb.at}. ${l.cb.why}.`, tone:'amber', icon:'clock', act:'Open callbacks', go:'callbacks'});
      render();
    });
  }, 20000);

  R('alerts', {id:'AG4', title:'Alerts', roles:['cc','sales'], render() {
    const types = Object.keys(AT).filter(k => S.alerts.some(a => a.type === k));
    if (G.alF !== 'all' && !types.includes(G.alF)) G.alF = 'all';
    const F = [['all', 'All']].concat(types.map(k => [k, AT[k][3]]));
    const list = S.alerts.filter(a => G.alF === 'all' || a.type === G.alF);
    const n = S.alerts.filter(a => !a.read).length;
    return shell({nav:'inbox', title:'Alerts', body:`
      <div class="ag-alpage">
        <section class="card"><div class="card-h"><h2>All alerts</h2><span class="sub">${n ? n + ' new' : 'Nothing new'}</span><span class="sp"></span>${readAll(n)}</div>
          <div class="fchips" role="group" aria-label="Show">${F.map(([k, t]) => `<button type="button" class="fchip" data-a="ag-alf" data-x="${k}" aria-pressed="${G.alF === k}">${t} <span class="n">${S.alerts.filter(a => k === 'all' || a.type === k).length}</span></button>`).join('')}</div>
          ${list.length ? alertGroups(list) : empty('bell', 'No alerts yet', 'When a lead is given to you or a callback is due, it shows here.')}
        </section>
        <div class="col loose">
          <section class="card"><div class="card-h" style="margin-bottom:12px"><h2>Your status</h2></div>
            <div class="seg" role="group" aria-label="Your status">${Object.entries(PRES).map(([k, [t]]) => `<button type="button" data-a="presence" data-x="${k}" aria-pressed="${S.presence === k}"><span class="pres ${k}" style="width:9px;height:9px;border-radius:50%;display:inline-block"></span>${t}</button>`).join('')}</div>
            <p class="small mute" style="margin-top:12px">${S.presence === 'available' ? 'You are getting new leads and pop-ups. Only available agents get new leads.' : 'New leads go to the next available agent. Callbacks you already have still remind you.'}</p></section>
          <section class="card"><div class="card-h" style="margin-bottom:8px"><h2>Pop-ups and sound</h2></div>
            <div class="sw-row">${sw(S.sound, 'ag-sound', '', 'Alert sound')}<span class="grow"><b class="small">Sound</b><span class="xs mute" style="display:block">A short sound with each pop-up.</span></span></div>
            <p class="xs mute" style="margin-top:6px">Pop-ups show at the top right when a lead is given to you, when a callback is due in 10 minutes, and when a lead is given to someone else.</p></section>
        </div>
      </div>`});
  }});

  /* ---------- AG1 Inbox ---------- */
  const FOLDERS = {
    cc:[['callbacks','Callbacks', l => isOpen(l) && l.cb && !l.cb.done && !l.asked], ['asked','Asked for a person', l => isOpen(l) && l.asked], ['mine','My chats', isOpen], ['closed','Closed today', l => !isOpen(l) && l.closedToday]],
    sales:[['sent','Sent to me', l => isOpen(l) && (l.status === 'qualified' || l.unread)], ['mine','My chats', isOpen], ['closed','Closed today', l => !isOpen(l) && l.closedToday]],
  };
  const folderList = k => { const f = FOLDERS[S.role].find(x => x[0] === k) || FOLDERS[S.role][0]; return mine().filter(f[2]).sort((a, b) => (b.unread - a.unread) || ((b.late ? 1 : 0) - (a.late ? 1 : 0)) || (a.lastIn - b.lastIn)); };
  const lastLine = l => { const m = [...l.m].reverse().find(x => x.k !== 'evt' && x.k !== 'act' && x.text); return m ? m : null; };
  const listTime = l => { const r = rem(l); if (isCC() && l.cb && !l.cb.done && r < 0) return [`${mins(-r)} late`, true]; const m = lastLine(l); return [m ? m.at.replace(/^Today /, '') : '—', l.late]; };
  const SAVED = ['Hi {first}, this is {me} from iCaur Alghanim. Is now a good time to talk?', 'Our Madinah Road showroom is open 9 AM to 10 PM, Saturday to Thursday.', 'I will send you the full offer in writing in a few minutes.', 'Would you like to book a test drive? Tell me the day and time that suits you.'];
  const TPL = [['Follow up', 'Hello {first}, this is iCaur Alghanim. Are you still interested in the {model}? Reply to this message and we will help you.'], ['New offer', 'Hello {first}, there is a new offer on the {model} this month. Reply YES to hear more.'], ['Test drive reminder', 'Hello {first}, a reminder of your test drive at our Madinah Road showroom. Reply to change the time.']];
  const REPLY = {Arabic:['تمام، شكراً لك', 'طيب، أنتظر اتصالك', 'ممتاز، يناسبني'], English:['Great, thank you.', 'Okay, that works for me.', 'Perfect, talk soon.']};

  function msgHtml(m, l) {
    const meta = (who, at) => `${esc(who)} · ${esc(String(at || '').replace(/^Today /, ''))}`;
    if (m.k === 'evt') return `<div class="evt ${m.tone || ''}">${ic(m.i || 'info', 14)}<span>${txt(m.text)} · ${esc(m.at)}</span></div>`;
    if (m.k === 'act') return `<div class="actcard ${m.st === 'Failed' ? 'fail' : ''}"><div class="ah">${av('VINA', 'sm')}${esc(m.name)}<span class="st">${chipC(m.st, m.st === 'Done' ? 'green' : m.st === 'Failed' ? 'red' : 'blue')}</span></div><ul>${(m.lines || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    if (m.k === 'in') return `<div class="msg in"><div class="bub">${txt(m.text)}</div><div class="meta">${meta(firstName(l), m.at)}</div></div>`;
    if (m.k === 'vina') return `<div class="msg vina"><div class="bub">${txt(m.text)}</div><div class="meta">${av('VINA', 'sm')}${meta('VINA', m.at)}${m.src ? `<span class="src" tabindex="0" title="VINA answered from: ${esc(m.src)}">${ic('book', 12)}${esc(m.src)}</span>` : ''}</div></div>`;
    if (m.k === 'note') return `<div class="msg note agent"><div class="bub">${esc(m.text)}</div><div class="meta">${ic('lock', 12)}Note for the team · ${meta(first(m.who), m.at)}</div></div>`;
    if (m.k === 'file') return `<div class="msg ${m.who ? 'agent' : 'vina'}"><div class="bub row tight nowrap">${ic('clip', 16)}<span>${esc(m.text)}</span></div><div class="meta">${m.who ? '' : av('VINA', 'sm')}${meta(m.who ? first(m.who) : 'VINA', m.at)}</div></div>`;
    if (m.k === 'tpl') return `<div class="msg agent"><div class="bub"><div class="ag-tplh">${ic('tpl', 12)}WhatsApp template · ${esc(m.name)}</div>${esc(m.text)}</div><div class="meta">${meta(first(m.who), m.at)}</div></div>`;
    return `<div class="msg agent"><div class="bub">${txt(m.text)}</div><div class="meta">${meta(first(m.who), m.at)}</div></div>`;
  }

  function panelHtml(l) {
    const r = rem(l);
    const cbTxt = l.cb && !l.cb.done ? `${esc(l.cb.at)} · ${r < 0 ? `<span class="red b">${mins(-r)} late</span>` : 'in ' + mins(r)}` : '—';
    const acts = isOpen(l) ? (isCC() ? `<button type="button" class="btn pri" data-a="ag-sendsales" data-x="${l.id}">${ic('send', 16)}Send to sales</button>` : `<button type="button" class="btn pri" data-a="ag-booktd" data-x="${l.id}">${ic('cal', 16)}Book test drive</button>`) + `<button type="button" class="btn" data-a="ag-close" data-x="${l.id}">${ic('check', 16)}Close lead</button>` : '';
    return `<div class="row nowrap">${av(l.name, 'lg')}<div class="grow"><div class="b ell" style="font-size:16px;font-family:var(--f-display)" title="${esc(l.name)}">${esc(l.name)}</div><div class="small mute num">${esc(l.mob)}</div></div><button type="button" class="ibtn sm bare ag-pbtn" data-a="ag-panel" aria-label="Close customer details">${ic('x', 16)}</button></div>
      <div class="row tight">${chip(l.status)}${chIc(l.ch)}<span class="small mute">${esc(CH[l.ch].label)}</span>${l.vq ? vtag() : ''}</div>
      <div class="ag-sum"><div class="hd">${ic('spark', 14)}VINA summary</div><p>${esc(l.summary)}.</p>${l.facts ? `<dl class="kv">${l.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}</div>
      <div class="ag-pact">${acts}<a class="btn ghost" href="#lead-${l.id}">Open lead page${ic('arrowR', 14)}</a></div>
      <dl class="kv"><dt>Callback time</dt><dd>${cbTxt}</dd><dt>Car model</dt><dd>${esc(l.model)}${l.trim ? ' · ' + esc(l.trim) : ''}${l.colour ? ' · ' + esc(l.colour) : ''}</dd><dt>Status</dt><dd>${esc(STATUS[l.status].label)}</dd><dt>Came from</dt><dd>${esc(l.src)}</dd><dt>Next step</dt><dd>${esc(l.next)}</dd><dt>City</dt><dd>${esc(l.city)}</dd><dt>Language</dt><dd>${esc(l.lang)}</dd>
      <dt>Customer rating</dt><dd>${l.rating ? `${stars(l.rating)}<div class="xs mute" style="margin-top:4px">“${esc(l.ratingNote || '')}”</div>` : '<span class="mute">Not rated yet</span>'}</dd></dl>`;
  }

  function composerHtml(l) {
    const closedWin = windowClosed(l) && G.tab === 'reply';
    const ta = bindTa('f.agText');
    const note = G.tab === 'note';
    const fn = esc(firstName(l));
    return `<div class="ag-comp">
      <div class="ag-comp-top"><div class="tabs" role="tablist" aria-label="Write"><button type="button" role="tab" class="tab" aria-selected="${!note}" data-a="ag-tab" data-x="reply">Reply</button><button type="button" role="tab" class="tab" aria-selected="${note}" data-a="ag-tab" data-x="note">${ic('lock', 13)}Note for the team</button></div><span class="sp"></span><span class="xs mute ag-hint" id="ag-hint">Enter to send · Shift+Enter for a new line</span></div>
      ${closedWin ? `<div class="ag-win" role="status">${ic('clock', 16)}<span><b>The WhatsApp 24-hour window has closed.</b> ${fn}'s last message was over 24 hours ago, so WhatsApp only lets you send an approved template. When ${fn} replies, you can write freely again.</span></div>` : ''}
      <label class="sr" for="b-f-agText">${note ? 'Note for the team' : 'Message to ' + esc(l.name)}</label>
      <textarea class="inp ag-ta ${note ? 'note' : ''}" rows="3" ${ta[0]} aria-describedby="ag-hint" ${closedWin ? 'disabled' : ''} placeholder="${note ? 'Only your team sees this note. The customer does not.' : closedWin ? 'Pick a WhatsApp template below' : 'Write to ' + fn + '…'}">${closedWin ? '' : ta[1]}</textarea>
      <div class="ag-tools">
        ${note ? '' : `<button type="button" class="btn sm" data-a="ag-menu" data-x="ag-saved" aria-haspopup="menu" aria-expanded="${S.menu === 'ag-saved'}" aria-label="Saved replies" title="Saved replies" ${closedWin ? 'disabled' : ''}>${ic('book', 14)}<span class="ag-tl">Replies</span></button>${l.ch === 'wa' ? `<button type="button" class="btn sm ${closedWin ? 'pri' : ''}" data-a="ag-menu" data-x="ag-tpl" aria-haspopup="menu" aria-expanded="${S.menu === 'ag-tpl'}" aria-label="WhatsApp templates" title="WhatsApp templates">${ic('tpl', 14)}<span class="ag-tl">Templates</span></button>` : ''}<input type="file" id="ag-file" class="sr ag-file" data-ch="ag-file" ${closedWin ? 'disabled' : ''}><label class="btn sm" for="ag-file" title="Attach a file" ${closedWin ? 'aria-disabled="true" style="opacity:.5;pointer-events:none"' : ''}>${ic('clip', 14)}<span class="ag-tl">Attach</span></label>`}
        <span class="sp"></span>
        <button type="button" class="btn pri sm" data-a="ag-send" ${closedWin ? 'disabled title="Free text is blocked after 24 hours. Pick a template."' : ''}>${ic(note ? 'note' : 'send', 14)}${note ? 'Save note' : 'Send'}</button>
      </div>
      ${S.menu === 'ag-saved' ? `<div class="menu" role="menu" aria-label="Saved replies">${SAVED.map((s, i) => `<button type="button" role="menuitem" data-a="ag-saved" data-x="${i}"><span class="small">${esc(fill(s, l))}</span></button>`).join('')}</div>` : ''}
      ${S.menu === 'ag-tpl' ? `<div class="menu" role="menu" aria-label="WhatsApp templates">${TPL.map(([n, s], i) => `<button type="button" role="menuitem" data-a="ag-tpl" data-x="${i}"><b class="small">${esc(n)}</b><span class="xs mute">${esc(fill(s, l))}</span></button>`).join('')}</div>` : ''}
    </div>`;
  }

  R('inbox', {id:'AG1', title:'Inbox', roles:['cc','sales'], states:[['empty','No chats'],['closed','Chat closed'],['loading','Loading'],['error','Could not load']], render() {
    const fk = G.folder[S.role];
    const list = S.st === 'empty' ? [] : folderList(fk);
    // the open chat stays open after the agent acts on it, even if it no longer matches this folder
    if (!list.find(l => l.id === G.sel)) { const cur = G.sel && lead(G.sel); if (cur && G.keep === G.sel && cur.owner === S.me) list.unshift(cur); else G.sel = list[0] ? list[0].id : null; }
    const l = G.sel && lead(G.sel);
    const folders = FOLDERS[S.role].map(([k, t]) => `<button type="button" class="fchip ${flashCls('ag-f-' + k)}" data-a="ag-folder" data-x="${k}" aria-pressed="${fk === k}">${t} <span class="n">${S.st === 'empty' ? 0 : folderList(k).length}</span></button>`).join('');
    const items = S.st === 'loading' ? `<div style="padding:14px">${loadingRows(6, 62)}</div>` : list.length ? list.map(x => { const [t, late] = listTime(x); const m = lastLine(x); return `<button type="button" class="ag-item ${x.unread ? 'unread' : ''} ${flashCls(x.id)}" data-a="ag-sel" data-x="${x.id}" aria-current="${x.id === G.sel}"${x.unread ? ' aria-label="' + esc(x.name) + ', unread"' : ''}>${av(x.name)}<span class="grow"><span class="l1"><span class="nm ell">${esc(x.name)}</span><span class="sp"></span><span class="tm ${late ? 'red b' : 'mute'}">${late ? pulse('red') : ''}${esc(t)}</span></span><span class="l2 ell" style="display:block">${m ? txt(m.text) : esc(x.summary)}</span><span class="l3">${chIc(x.ch)}${x.asked && isOpen(x) ? chipC('Asked for a person', 'amber', true) : chip(x.status)}<span class="xs mute">${esc(x.model)}</span><span class="sp"></span>${x.unread ? '<span class="unread-dot" aria-hidden="true"></span>' : ''}</span></span></button>`; }).join('')
      : empty('inbox', fk === 'closed' ? 'Nothing closed today yet' : 'No chats here', fk === 'closed' ? 'Leads you close today show here.' : 'When VINA hands a chat to you, it shows here and you get an alert. You can keep working your leads in My leads.', `<a class="btn" href="#leads">Open my leads</a>`);
    let chat;
    if (S.st === 'loading') chat = `<div style="padding:20px">${loadingRows(5, 54)}</div>`;
    else if (S.st === 'error') chat = `<div style="padding:20px">${errorBox('The chat did not load', 'Check your internet connection, then try again. Nothing you wrote was lost.', 'ag-retry')}</div>`;
    else if (!l) chat = empty('conv', 'Pick a chat', 'Choose a chat on the left to read it and reply.');
    else {
      const closed = !isOpen(l) || S.st === 'closed';
      const line = [CH[l.ch].label, l.model, l.owner === S.me ? 'given to you' : ''].filter(Boolean).map(esc).join(' · ');
      chat = `<div class="ag-chead"><button type="button" class="ibtn sm bare ag-back" data-a="ag-back" aria-label="Back to chats">${ic('chevL')}</button>${av(l.name)}<div class="grow" style="min-width:0"><div class="b ell" title="${esc(l.name)}">${esc(l.name)}</div><div class="xs mute ell">${line}</div></div>
        ${closed ? '' : `${l.paused ? `<button type="button" class="btn sm" data-a="ag-handback" data-x="${l.id}" aria-label="Hand back to VINA">${ic('play', 14)}<span class="ag-hl">Hand back</span></button>` : `<button type="button" class="btn sm" data-a="ag-take" data-x="${l.id}" aria-label="Take over">${ic('pause', 14)}<span class="ag-hl">Take over</span></button>`}
        ${isCC() ? `<button type="button" class="btn sm" data-a="ag-call" data-x="${l.id}" aria-label="Call ${esc(l.name)}">${ic('phone', 14)}<span class="ag-hl ag-hl2">Call</span></button>` : ''}`}
        <button type="button" class="btn sm ag-pbtn" data-a="ag-panel" aria-expanded="${G.panel}" aria-label="Customer details">${ic('user', 14)}<span class="ag-hl ag-hl2">Customer</span></button></div>
        ${closed ? `<div class="ag-closedbar">${ic('lock', 16)}<span class="grow">This lead is closed · ${esc(l.status === 'sold' ? 'Sold' : l.lostReason || 'Lost')}${l.checkin ? ' · VINA checks in on 7 Dec' : ''}. You cannot reply here.</span><a class="btn sm" href="#lead-${l.id}">Open lead page</a></div>`
          : l.paused ? `<div class="ag-paused ${flashCls('ag-pause-' + l.id)}" role="status">${pulse()}<span class="grow"><b>VINA is paused in this chat</b>You are replying. VINA carries on by itself after 24 hours without a reply from you.</span><button type="button" class="btn sm" data-a="ag-handback" data-x="${l.id}">${ic('play', 14)}Hand back to VINA</button></div>` : ''}
        <div class="chat" id="ag-chat" data-keep data-stick aria-live="polite">${l.m.length ? l.m.map(m => msgHtml(m, l)).join('') : `<div class="evt">${ic('info', 14)}No messages yet. ${esc(l.summary)}.</div>`}${G.typing === l.id ? `<div class="typing" style="align-self:flex-start;background:var(--card);border:1px solid var(--line)" aria-label="${esc(firstName(l))} is typing"><i style="background:var(--mute)"></i><i style="background:var(--mute)"></i><i style="background:var(--mute)"></i></div>` : ''}</div>
        ${closed ? '' : composerHtml(l)}`;
    }
    return shell({nav:'inbox', title:'Inbox', flush:true, search:true, body:`<div class="ag-inbox" data-mob="${G.mob}">
      <section class="ag-col ag-listcol" aria-label="Chats"><div class="ag-folders" role="group" aria-label="Folders">${folders}</div><div class="ag-list" id="ag-list" data-keep>${items}</div></section>
      <section class="ag-col ag-chatcol" aria-label="Chat">${chat}</section>
      ${l && S.st !== 'loading' && S.st !== 'error' ? `<aside class="ag-col ag-panel col ${G.panel ? 'open' : ''}" aria-label="Customer details">${panelHtml(l)}</aside>` : '<aside class="ag-col ag-panel col" aria-hidden="true"></aside>'}
    </div>`});
  }});
  A['ag-retry'] = () => { S.st = ''; };
  A['ag-folder'] = (el) => { G.folder[S.role] = el.dataset.x; G.sel = null; };
  A['ag-sel'] = (el) => { const l = lead(el.dataset.x); G.sel = l.id; l.unread = false; G.mob = 'chat'; G.panel = false; S.f.agText = ''; stickBottom(); };
  A['ag-back'] = () => { G.mob = 'list'; };
  A['ag-panel'] = () => { G.panel = !G.panel; };
  A['ag-tab'] = (el) => { G.tab = el.dataset.x; };
  A['ag-menu'] = (el) => { S.menu = S.menu === el.dataset.x ? null : el.dataset.x; };
  A['ag-saved'] = (el) => { const l = lead(G.sel); S.f.agText = ((S.f.agText || '') + (S.f.agText ? ' ' : '') + fill(SAVED[+el.dataset.x], l)); S.menu = null; setTimeout(() => { const t = $('#b-f-agText'); if (t) t.focus(); }, 0); };
  const take = (l, auto) => { l.paused = true; G.keep = l.id; flash(l.id); flash('ag-pause-' + l.id); l.m.push({k:'evt', text: first(S.me) + ' took over · VINA is paused in this chat', at:clock(now()), tone:'amber', i:'pause'}); log(l, 'chat', 'Took over the chat', 'VINA paused in this chat only'); if (auto) toast('You took over. VINA is paused in this chat.'); };
  A['ag-take'] = (el) => { take(lead(el.dataset.x)); stickBottom(); toast('You took over. VINA is paused in this chat.'); };
  A['ag-handback'] = (el) => { const l = lead(el.dataset.x); l.paused = false; G.keep = l.id; flash(l.id); l.m.push({k:'evt', text:'Handed back to VINA · VINA carries on in this chat', at:clock(now()), tone:'teal', i:'play'}); log(l, 'chat', 'Handed back to VINA', ''); stickBottom(); toast('VINA is replying in this chat again.'); };
  function customerReplies(l) {
    if (G.replied.has(l.id)) return; G.replied.add(l.id);
    setTimeout(() => { G.typing = l.id; render(); }, 900);
    setTimeout(() => { G.typing = null; const r = REPLY[l.lang] || REPLY.English; const t = r[l.id.charCodeAt(2) % r.length]; l.m.push({k:'in', text:t, at:clock(now())}); l.lastIn = 0; l.wait = 0; if (G.sel !== l.id || location.hash !== '#inbox') l.unread = true; log(l, 'chat', 'Customer message', t, CH[l.ch].label); stickBottom(); render(); }, 3200);
  }
  A['ag-send'] = () => {
    const l = lead(G.sel); const t = (S.f.agText || '').trim(); if (!l) return;
    if (!t) { toast(G.tab === 'note' ? 'Write the note first.' : 'Write a message first.'); return; }
    if (G.tab === 'note') { l.m.push({k:'note', text:t, who:S.me, at:clock(now())}); log(l, 'note', 'Note', t); toast('Note saved. Only your team can see it.'); }
    else {
      if (windowClosed(l)) { toast('Pick a WhatsApp template. Free text is blocked after 24 hours.'); return; }
      if (!l.paused) take(l, true);
      l.m.push({k:'agent', text:t, who:S.me, at:clock(now())}); log(l, 'chat', 'Message sent', t, 'by ' + meName() + ' · ' + CH[l.ch].label);
      l.unread = false; l.wait = null; l.late = false; customerReplies(l);
    }
    S.f.agText = ''; G.keep = l.id; flash(l.id); stickBottom();
  };
  A['ag-tpl'] = (el) => { const l = lead(G.sel); G.keep = l.id; const [n, s] = TPL[+el.dataset.x]; const t = fill(s, l); S.menu = null; l.m.push({k:'tpl', name:n, text:t, who:S.me, at:clock(now())}); log(l, 'chat', 'WhatsApp template sent · ' + n, t); if (!l.paused) l.paused = true; flash(l.id); customerReplies(l); stickBottom(); toast('Template sent. You can write freely once ' + firstName(l) + ' replies.'); };
  A['ag-file'] = (el) => { const l = lead(G.sel); if (l) G.keep = l.id; const fl = el.files && el.files[0]; if (!fl || !l) return false; if (fl.size > 16 * 1024 * 1024) { toast('That file is over 16 MB. WhatsApp cannot send it.'); return; } if (!l.paused) take(l, true); l.m.push({k:'file', text:fl.name, who:S.me, at:clock(now())}); log(l, 'chat', 'File sent', fl.name); flash(l.id); stickBottom(); };
  A['ag-call'] = (el) => { window.startCall(el.dataset.x); };
  A['ag-sendsales'] = (el) => { openModal('send-sales', {id:el.dataset.x}); };
  A['ag-close'] = (el) => { openModal('close-lead', {id:el.dataset.x}); };
  A['ag-booktd'] = (el) => { if (A['ld-book']) { G.keep = el.dataset.x; A['ld-book'](el); } else go('lead-' + el.dataset.x); };
  document.addEventListener('keydown', (ev) => {
    if (ev.target && ev.target.id === 'b-f-agText' && ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); S.f.agText = ev.target.value; A['ag-send'](); render(); }
  });

  /* ---------- AG3 Send to sales ---------- */
  const factsBox = l => `<div class="card soft" style="padding:14px"><dl class="kv"><dt>Customer</dt><dd>${esc(l.name)} · <span class="num">${esc(l.mob)}</span></dd><dt>Car</dt><dd>${esc(l.model)}${l.trim ? ' · ' + esc(l.trim) : ''}</dd><dt>City</dt><dd>${esc(l.city)}</dd><dt>VINA summary</dt><dd>${esc(l.summary)}</dd></dl></div>`;
  MODALS['send-sales'] = (m) => {
    const l = lead(m.id); if (!l) return modalFrame('Send to sales', 'This lead is no longer available.', '');
    if (m.who == null) { m.who = 'next'; m.note = m.note || S.f.agCallNote || ''; S.f.agCallNote = ''; }
    const nx = nextSales();
    const sales = Object.keys(U).filter(k => U[k].role === 'sales');
    const ok = m.who === 'next' || (m.who === 'pick' && m.pick);
    const ta = bindTa('modal.note');
    return modalFrame('Send to sales', `${factsBox(l)}
      <fieldset class="col tight" style="border:0;padding:0;margin:0"><legend class="h3" style="margin-bottom:8px">Who gets it</legend><div class="col tight" role="radiogroup" aria-label="Who gets it">
        <button type="button" class="radio-card" role="radio" aria-checked="${m.who === 'next'}" data-a="ag-mset" data-x="who:next"><span class="chi c-teal" style="width:36px;height:36px;flex-basis:36px;border-radius:10px">${ic('route', 17)}</span><span class="grow"><b>Next free salesperson</b><span class="small mute" style="display:block">${esc(uname(nx))} is next · ${mineCount(nx)} open leads · uses the assignment rules</span></span></button>
        <button type="button" class="radio-card" role="radio" aria-checked="${m.who === 'pick'}" data-a="ag-mset" data-x="who:pick"><span class="chi c-navy" style="width:36px;height:36px;flex-basis:36px;border-radius:10px">${ic('user', 17)}</span><span class="grow"><b>Pick a name</b><span class="small mute" style="display:block">Choose a salesperson yourself</span></span></button></div>
        ${m.who === 'pick' ? `<div class="col tight" role="radiogroup" aria-label="Salesperson" style="padding-inline-start:16px;border-inline-start:2px solid var(--line)">${sales.map(k => { const u = U[k]; const off = u.status === 'away'; return `<button type="button" class="radio-card" role="radio" aria-checked="${m.pick === k}" data-a="ag-mset" data-x="pick:${k}" ${off ? 'disabled title="' + esc(first(k)) + ' is away and cannot take new leads" style="opacity:.55;cursor:not-allowed"' : ''}><span class="avw">${av(u.name)}<span class="pres ${u.status}"></span></span><span class="grow"><b>${esc(u.name)}</b><span class="small mute" style="display:block">Sales · ${esc(u.showroom)} · ${mineCount(k)} open leads</span></span>${chipC(off ? 'Away' : PRES[u.status][0], PRES[u.status][1], true)}</button>`; }).join('')}</div>` : ''}
      </fieldset>
      <div class="field"><label for="b-modal-note">Note for sales</label><textarea class="inp" rows="3" ${ta[0]} placeholder="For example: trade-in, budget, best time to call">${ta[1]}</textarea><span class="hint">Sales sees this note at the top of the lead.</span></div>`,
      `<span class="small mute grow">The lead leaves your list. You can still see it in history.</span><button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ag-send-go" ${ok ? '' : 'disabled title="Pick a salesperson first"'}>${ic('send', 16)}Send to sales</button>`,
      {sub: esc(l.name) + ' · ' + esc(l.model) + ' · ' + esc(CH[l.ch].label)});
  };
  A['ag-mset'] = (el) => { const [k, v] = el.dataset.x.split(':'); S.modal[k] = v === 'true' ? true : v === 'false' ? false : v; };
  A['ag-send-go'] = () => {
    const m = S.modal; const l = lead(m.id);
    const snap = {owner:l.owner, team:l.team, status:l.status, cb:l.cb && Object.assign({}, l.cb), cbBy:l.cbBy, hLen:l.h.length, mLen:l.m.length};
    const to = sendToSales(l, m.who === 'next' ? 'next' : m.pick, (m.note || '').trim());
    S.modal = null; if (G.sel === l.id) G.sel = null; if (l.cb) flash('ag-done'); flash(l.id);
    toast('Sent to ' + uname(to) + '. It shows in the lead history.', () => { Object.assign(l, {owner:snap.owner, team:snap.team, status:snap.status, cb:snap.cb, cbBy:snap.cbBy}); l.h = l.h.slice(l.h.length - snap.hLen); l.m.length = snap.mLen; G.sel = l.id; });
  };
  AFTER['send-sales'] = () => { const id = G.sel || (mine().find(l => isOpen(l) && l.cb && !l.cb.done) || {}).id; if (id) openModal('send-sales', {id}); };

  /* ---------- AG3 Close lead + LD6 Lost reasons ---------- */
  MODALS['close-lead'] = (m) => {
    const l = lead(m.id); if (!l) return modalFrame('Close lead', 'This lead is no longer available.', '');
    if (m.res == null) { m.res = m.result || ''; m.checkin = false; m.reason = ''; m.note = ''; }
    const R3 = [['sold', 'Sold', 'Bought a car', 'green', 'check'], ['notint', 'Not interested', 'Does not want to buy now', 'grey', 'minus'], ['lost', 'Lost', 'Did not buy · pick a reason', 'red', 'x']];
    const ok = m.res && (m.res !== 'lost' || m.reason);
    const ta = bindTa('modal.note');
    return modalFrame('Close lead', `
      <fieldset class="col tight" style="border:0;padding:0;margin:0"><legend class="h3" style="margin-bottom:8px">Result</legend><div class="ag-r3" role="radiogroup" aria-label="Result">${R3.map(([k, t, d, c, i]) => `<button type="button" class="radio-card" role="radio" aria-checked="${m.res === k}" data-a="ag-mset" data-x="res:${k}" style="flex-direction:column;gap:8px"><span class="chi c-${c}" style="width:32px;height:32px;flex-basis:32px;border-radius:9px">${ic(i, 16)}</span><span><b style="display:block">${t}</b><span class="xs mute">${d}</span></span></button>`).join('')}</div></fieldset>
      ${m.res === 'lost' ? `<fieldset class="col tight" style="border:0;padding:0;margin:0"><legend class="h3" style="margin-bottom:8px">Why was it lost? <span class="red">*</span></legend><div class="ag-r2" role="radiogroup" aria-label="Lost reason">${LOST_REASONS.map(r => `<button type="button" class="radio-card" role="radio" aria-checked="${m.reason === r}" data-a="ag-mset" data-x="reason:${r}" style="padding:10px 14px;min-height:44px;align-items:center"><span class="small b">${esc(r)}</span></button>`).join('')}</div>${m.tried && !m.reason ? `<span class="err">${ic('alert', 14)}Pick a reason so the team can see why leads are lost.</span>` : '<span class="xs mute">Not interested is its own result above.</span>'}</fieldset>` : ''}
      <div class="field"><label for="b-modal-note">Note <span class="mute" style="font-weight:400">(optional)</span></label><textarea class="inp" rows="2" ${ta[0]} placeholder="Anything the team should know">${ta[1]}</textarea></div>
      ${m.res && m.res !== 'sold' ? `<div class="sw-row">${sw(m.checkin, 'ag-mset', 'checkin:' + (!m.checkin), 'Ask VINA to check in after 30 days')}<span class="grow"><b class="small">Ask VINA to check in after 30 days</b><span class="xs mute" style="display:block">VINA sends ${esc(firstName(l))} one WhatsApp message about new offers on Mon 7 Dec.</span></span></div>` : ''}`,
      `<span class="small mute grow">VINA stops following up unless the check-in is on.</span><button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ag-close-go" ${m.res ? '' : 'disabled title="Pick a result first"'}>${ic('check', 16)}Close lead</button>`,
      {sub: esc(l.name) + ' · ' + esc(l.model) + ' · ' + esc(CH[l.ch].label)});
  };
  A['ag-close-go'] = () => {
    const m = S.modal; const l = lead(m.id);
    if (m.res === 'lost' && !m.reason) { m.tried = true; return; }
    const snap = {status:l.status, lostReason:l.lostReason, next:l.next, checkin:l.checkin, closedToday:l.closedToday, wait:l.wait, late:l.late, unread:l.unread, cb:l.cb && Object.assign({}, l.cb), hLen:l.h.length};
    closeLead(l, m.res, m.reason, (m.note || '').trim(), m.res !== 'sold' && m.checkin);
    if (m.call && l.cb) { l.cb.done = m.res === 'notint' ? 'Reached, not interested' : 'Closed'; l.cbBy = S.me; }
    S.modal = null; if (G.sel === l.id) G.keep = l.id; flash(l.id); flash('ag-f-closed'); if (l.cb && l.cb.done) flash('ag-done');
    toast(`${l.name} closed · ${m.res === 'sold' ? 'Sold' : m.res === 'notint' ? 'Not interested' : 'Lost, ' + m.reason}.`, () => { Object.assign(l, snap); delete l.hLen; l.h = l.h.slice(l.h.length - snap.hLen); });
  };
  AFTER['close-lead'] = () => { openModal('close-lead', {id:'l01', result:'lost'}); };

  /* ---------- Call (AG2) ---------- */
  window.startCall = (id) => { const l = lead(id); if (!l) return; l.unread = false; S.f.agCallNote = ''; openModal('call', {id, t0:Date.now()}); };
  MODALS.call = (m) => {
    const l = lead(m.id);
    const ta = bindTa('f.agCallNote');
    const later = clock(new Date(now().getTime() + 3600000));
    const res = [['sales', isCC() ? 'Reached, send to sales' : 'Reached', isCC() ? 'Opens Send to sales with your note' : 'Saves the call in the history', 'green', 'check'],
      ['notint', 'Reached, not interested', 'Asks how to close the lead', 'grey', 'minus'],
      ['noanswer', 'No answer, try again in 1 hour', l.cb ? 'Moves the callback to ' + later : 'Saves the try in the history', 'amber', 'clock'],
      ['wrong', 'Wrong number', 'Closes the lead as lost', 'red', 'x']];
    const why = l.cb ? l.cb.why : l.summary;
    return modalFrame('Calling ' + l.name, `<div class="ag-callcard"><div class="row nowrap">${av(l.name, 'lg')}<div class="grow"><div class="b ell" style="font-size:17px">${esc(l.name)}</div><div class="mu num">${esc(l.mob)}</div></div><span class="pill" style="background:rgba(110,190,185,.2);color:#BFE6E3">${pulse('green')}On the call</span></div>
        <div class="tm" role="timer" aria-label="Call time"><span data-since="${m.t0}">0:00</span></div>
        <div class="mu">${esc(l.model)} · ${esc(why)}${l.cb ? ` · ${l.cb.tries ? l.cb.tries + (l.cb.tries === 1 ? ' try' : ' tries') + ' so far' : 'first try'}` : ''}</div></div>
      <div class="ag-sum"><div class="hd">${ic('spark', 14)}VINA summary</div><p>${esc(l.summary)}.</p></div>
      <div class="field"><label for="b-f-agCallNote">${isCC() ? 'A note for sales' : 'Call note'} <span class="mute" style="font-weight:400">(optional)</span></label><textarea class="inp" rows="2" ${ta[0]} placeholder="${isCC() ? 'Trade-in, budget, best time to call' : 'What did ' + esc(firstName(l)) + ' say?'}">${ta[1]}</textarea></div>
      <fieldset class="col tight" style="border:0;padding:0;margin:0"><legend class="h3" style="margin-bottom:8px">How did the call go?</legend><div class="ag-res">${res.map(([k, t, d, c, i]) => `<button type="button" class="radio-card k-${c}" data-a="ag-call-res" data-x="${k}"><span class="chi c-${c}">${ic(i, 20)}</span><span class="grow"><b>${t}</b><span class="s">${esc(d)}</span></span></button>`).join('')}</div></fieldset>`,
      `<span class="small mute grow">The call and its result are saved in the lead history.</span><button type="button" class="btn" data-a="close-modal">Close without a result</button>`, {size:'wide'});
  };
  A['ag-call-res'] = (el) => {
    const m = S.modal; const l = lead(m.id); const k = el.dataset.x;
    const dur = Math.max(1, Math.round((Date.now() - m.t0) / 60000)); const note = (S.f.agCallNote || '').trim();
    const by = r => 'by ' + meName() + ' · ' + r;
    if (k === 'noanswer') {
      log(l, 'call', 'Call · no answer', by('try again in 1 hour'));
      if (l.cb) { l.cb.tries = (l.cb.tries || 0) + 1; l.cb.in = Math.round(elapsed()) + 60; l.cb.at = clock(new Date(now().getTime() + 3600000)); l.next = 'Call ' + l.cb.at; G.duePopped.delete(l.id); }
      l.late = false; S.modal = null; flash(l.id);
      toast(l.cb && l.cb.tries >= 3 ? `3 tries with no answer. You can close it as "No answer after 3 tries".` : `No answer. ${l.name} moved to ${l.cb ? l.cb.at : 'in 1 hour'}.`);
      return;
    }
    if (k === 'wrong') { log(l, 'call', 'Call · wrong number', by('closed as lost'), note); if (l.cb) { l.cb.done = 'Wrong number'; l.cbBy = S.me; } closeLead(l, 'lost', 'Wrong number', note, false); S.modal = null; flash(l.id); flash('ag-done'); flash('ag-f-closed'); toast(l.name + ' closed · Lost, Wrong number.'); return; }
    log(l, 'call', 'Call · ' + dur + ' min', by(k === 'sales' ? (isCC() ? 'reached, sent to sales' : 'reached') : 'reached, not interested'), note);
    if (l.status === 'new' || l.status === 'qualified' || (l.status === 'callback' && !isCC())) setStatus(l, 'contacted', 'by ' + meName());
    if (k === 'sales' && isCC()) { S.f.agCallNote = note; openModal('send-sales', {id:l.id}); return; }
    if (k === 'sales') { if (l.cb) l.cb.done = 'Reached'; S.modal = null; flash(l.id); toast('Call saved in the lead history.'); return; }
    openModal('close-lead', {id:l.id, result:'notint', note, call:true});
    S.modal.res = 'notint'; S.modal.checkin = false; S.modal.reason = ''; S.modal.note = note;
  };

  /* ---------- AG2 Callbacks ---------- */
  const today = h => /^Today/.test(h.when) && h.by && h.by.indexOf(meName()) >= 0;
  function myDay() {
    let calls = 0, reached = 0, sent = 0;
    LEADS.forEach(l => l.h.forEach(h => { if (!today(h)) return; if (h.t === 'call') { calls++; if (/reached/.test(h.by)) reached++; } if (h.t === 'give' && /^Sent to/.test(h.title)) sent++; }));
    return {calls, reached, sent};
  }
  const tries = n => !n ? 'No tries yet' : n === 1 ? '1 try so far' : n + ' tries so far';
  function cbRow(l) {
    const r = rem(l); const done = l.cb.done; const tom = l.cb.day === 'tomorrow'; const over = !done && !tom && r < 0;
    const rel = done ? esc(done) : tom ? 'Tomorrow' : over ? `${pulse('red')}${mins(-r)} late` : 'in ' + mins(r);
    const why = l.cb.why + (l.asked && !/person/i.test(l.cb.why) ? ' · asked for a person' : '');
    return `<div class="ag-cbrow ${over ? 'over' : ''} ${flashCls(l.id)}">
      <div class="ag-tm"><div class="tm ${over ? 'red' : ''}">${esc(l.cb.at.replace(/^Sun /, ''))}</div><div class="row tight nowrap xs ${over ? 'red b' : 'mute'}">${rel}</div></div>
      <div class="who ag-who">${av(l.name)}<div style="min-width:0"><div class="nm ell" title="${esc(l.name)}">${esc(l.name)}</div><div class="row tight nowrap" style="margin-top:4px">${chipC(l.model, 'navy')}<span class="xs mute num ell">${esc(l.mob)}</span></div></div></div>
      <div class="ag-why"><div class="small b ell2">${esc(why)}</div><div class="xs mute" style="margin-top:2px">${tries(l.cb.tries)}</div></div>
      <div class="ag-act row tight nowrap"><button type="button" class="btn sm" data-a="ag-open-chat" data-x="${l.id}">${ic('conv', 14)}Open chat</button>${done ? `<a class="btn sm" href="#lead-${l.id}">${ic('arrowR', 14)}Lead</a>` : `<button type="button" class="btn sm pri" data-a="ag-call" data-x="${l.id}">${ic('phone', 14)}Call</button>`}</div></div>`;
  }
  R('callbacks', {id:'AG2', title:'Callbacks', roles:['cc'], states:[['empty','Nothing to call'],['loading','Loading']], render() {
    const pend = S.st === 'empty' ? [] : mine().filter(l => isOpen(l) && l.cb && !l.cb.done);
    const tom = pend.filter(l => l.cb.day === 'tomorrow'), tday = pend.filter(l => l.cb.day !== 'tomorrow');
    const by = (a, b) => rem(a) - rem(b);
    const over = tday.filter(l => rem(l) < 0).sort(by), hour = tday.filter(l => rem(l) >= 0 && rem(l) <= 60).sort(by), later = tday.filter(l => rem(l) > 60).sort(by);
    const done = S.st === 'empty' ? [] : LEADS.filter(l => l.cb && l.cb.done && (l.cbBy === S.me || l.owner === S.me));
    const d = S.st === 'empty' ? {calls:0, reached:0, sent:0} : myDay();
    const tabs = [['today', 'Today', tday.length], ['tomorrow', 'Tomorrow', tom.length], ['done', 'Done today', done.length]];
    const grp = (title, rows, c, sub) => rows.length ? `<section class="card pad0 ag-grp" aria-label="${title}"><div class="ag-grp-h">${c === 'red' ? pulse('red') : ''}<h2${c === 'red' ? ' class="red"' : ''}>${title}</h2><span class="ag-cnt c-${c}">${rows.length}</span><span class="sp"></span><span class="xs mute">${sub}</span></div>${rows.map(cbRow).join('')}</section>` : '';
    const list = (rows, icon, t, b) => rows.length ? `<section class="card pad0 ag-grp">${rows.map(cbRow).join('')}</section>` : `<div class="card">${empty(icon, t, b)}</div>`;
    let body;
    if (S.st === 'loading') body = loadingRows(5, 64);
    else if (G.cbTab === 'today') body = tday.length ? grp('Overdue', over, 'red', 'Call these first') + grp('In the next hour', hour, 'amber', 'Due by ' + clock(new Date(now().getTime() + 3600000))) + grp('Later today', later, 'grey', '') : `<div class="card">${empty('phone', 'Nothing to call right now', 'New callbacks show here when VINA books one or a customer asks to be called. You get an alert 10 minutes before each one.', `<a class="btn" href="#inbox">Open my inbox</a>`)}</div>`;
    else if (G.cbTab === 'tomorrow') body = list(tom, 'cal', 'Nothing booked for tomorrow', 'Callbacks for tomorrow show here.');
    else body = list(done, 'check', 'No calls done yet today', 'Calls you finish today show here with their result.');
    const rate = d.calls ? Math.round(d.reached / d.calls * 100) + '% of calls' : 'no calls yet';
    return shell({nav:'callbacks', title:'Callbacks', body:`
      <section class="card ag-daycard" aria-label="My day"><div class="card-h" style="margin-bottom:12px"><h2>My day</h2><span class="sub">${esc(nowStr())}</span></div><div class="ag-day">
        ${kpi({k:'Calls made', v:d.calls, n:'today', mini:true})}${kpi({k:'Reached', v:d.reached, n:rate, mini:true})}${kpi({k:'Sent to sales', v:d.sent, n:'today', mini:true})}${kpi({k:'Still to call today', v:tday.length, n: over.length ? `<span class="red b">${over.length} overdue</span>` : 'none overdue', hot: over.length > 0, mini:true})}</div></section>
      <div class="tabs" role="tablist" aria-label="Lists">${tabs.map(([k, t, n]) => `<button type="button" role="tab" class="tab ${k === 'done' ? flashCls('ag-done') : ''}" aria-selected="${G.cbTab === k}" data-a="ag-cbtab" data-x="${k}">${t}<span class="n">${n}</span></button>`).join('')}</div>
      <div class="col">${body}</div>
      <p class="ag-dayline" aria-label="My day"><span class="b" style="color:var(--text)">My day</span><span><b>${d.calls}</b> calls</span><span><b>${d.reached}</b> reached</span><span><b>${d.sent}</b> sent to sales</span></p>`});
  }});
  A['ag-cbtab'] = (el) => { G.cbTab = el.dataset.x; };
  A['ag-open-chat'] = (el) => { const l = lead(el.dataset.x); G.sel = l.id; l.unread = false; G.folder[S.role] = 'mine'; G.mob = 'chat'; stickBottom(); go('inbox'); };
})();
