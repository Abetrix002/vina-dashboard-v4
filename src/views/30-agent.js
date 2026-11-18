/* AG1 Inbox · AG2 Callbacks · AG3 Send to sales + Close lead (with LD6 lost reasons) · AG4 Alerts and status.
   Exposes: R inbox/callbacks/alerts, MODALS send-sales/close-lead/call, DRAWERS.alerts, A.bell, window.startCall, AFTER send-sales/close-lead. */
(function () {
  document.body.insertAdjacentHTML('beforeend', `<style>
/* AG1 inbox: list · chat · details. The list rows, thread, header and details panel are the shared .cx-* parts in core. */
.ag-inbox{position:relative;display:grid;grid-template-columns:320px minmax(0,1fr);height:calc(100vh - 69px);min-height:540px}
@media (min-width:1280px){.ag-inbox.dp-on{grid-template-columns:320px minmax(0,1fr) 320px}}
.ag-col{display:flex;flex-direction:column;min-height:0;min-width:0;background:var(--card)}
.ag-listcol{border-inline-end:1px solid var(--line)}
.ag-lh{display:flex;flex-direction:column;gap:4px;padding:12px 12px 0;border-bottom:1px solid var(--line)}
.ag-ftabs{border-bottom:0;margin:0 -6px}
.ag-ftabs .tab{min-height:40px;padding:0 8px;gap:6px}
.ag-ftabs .tab .n{min-width:20px;height:18px;padding:0 5px}
.ag-chatcol{background:var(--bg)}
@container (max-width:480px){.ag-hl2{display:none}}
@container (max-width:400px){.ag-hl{display:none}}
@container (max-width:640px){.ag-pl{display:none}}
@container (max-width:470px){.ag-wl{display:none}}
.ag-morew{position:relative;display:inline-flex}
.ag-morew .menu{top:calc(100% + 6px);right:0;min-width:248px}
.ag-keys{padding:6px 10px 4px;font-size:12px;line-height:1.6;color:var(--mute);max-width:248px}
.ag-keys kbd{font:600 12px var(--f);padding:1px 5px;border-radius:5px;border:1px solid var(--line2);background:var(--sub);color:var(--text)}
.ag-paused{container-type:inline-size;display:flex;align-items:center;gap:10px;min-height:44px;padding:6px 10px 6px 16px;background:var(--amber-b);color:var(--amber-f);border-top:1px solid color-mix(in srgb,var(--amber-f) 22%,transparent);font-size:13px}
.ag-paused b{font-weight:700}
.ag-paused .btn{min-height:30px;background:var(--card)}
.ag-paused.flash{animation:agDrop var(--d3) var(--spring) 1}
@keyframes agDrop{from{opacity:0;transform:translateY(8px)}}
.ag-closedbar{display:flex;align-items:center;gap:10px;padding:14px 16px;border-top:1px solid var(--line);background:var(--grey-b);color:var(--grey-f);font-size:13px;font-weight:500}
/* composer: one box, Reply / Note tabs on top, icon tools below */
.ag-comp{position:relative;padding:10px 16px 14px}
.ag-box{display:flex;flex-direction:column;border:1px solid var(--line2);border-radius:14px;background:var(--card);box-shadow:var(--e1);transition:border-color var(--d1),box-shadow var(--d2) var(--ease),background var(--d2)}
.ag-box:focus-within{border-color:var(--horizon);box-shadow:0 0 0 4px var(--ring)}
.ag-comp.note .ag-box{background:var(--amber-b);border-color:color-mix(in srgb,var(--amber-f) 45%,transparent)}
.ag-comp.note .ag-box:focus-within{box-shadow:0 0 0 4px color-mix(in srgb,var(--amber) 30%,transparent)}
.ag-ctop{container-type:inline-size;display:flex;align-items:center;gap:8px;padding:6px 8px 0 6px;min-width:0}
.ag-ctabs{display:flex;gap:2px}
.ag-ctabs button{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 10px;border:0;border-radius:7px;background:transparent;color:var(--mute);font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;transition:background var(--d1),color var(--d1)}
.ag-ctabs button:hover{color:var(--text)}
.ag-ctabs button[aria-selected="true"]{background:var(--sub);color:var(--text)}
.ag-comp.note .ag-ctabs button[aria-selected="true"]{background:color-mix(in srgb,var(--amber) 22%,transparent);color:var(--amber-f)}
.ag-win{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 9px;border-radius:999px;background:var(--green-b);color:var(--green-f);font-size:12px;font-weight:600;white-space:nowrap;cursor:help}
.ag-win.low{background:var(--amber-b);color:var(--amber-f)}
.ag-nhint{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--amber-f);white-space:nowrap}
.ag-ta{display:block;width:100%;field-sizing:content;min-height:calc(1.5em + 18px);max-height:calc(9em + 18px);padding:9px 14px;border:0;outline:0;resize:none;overflow-y:auto;background:transparent;color:var(--text);font:inherit;font-size:14px;line-height:1.5}
.ag-ta::placeholder{color:var(--faint)}
.ag-tools{display:flex;align-items:center;gap:2px;padding:0 8px 8px 6px}
.ag-tools .ibtn{color:var(--mute)}
.ag-tools .ibtn:hover,.ag-tools .ibtn[aria-expanded="true"]{color:var(--text);background:var(--sub)}
.ag-hint{margin-inline-end:10px;font-size:12px;color:var(--faint);white-space:nowrap}
.ag-file:focus-visible+label{outline:2px solid var(--horizon);outline-offset:2px}
.ag-comp .menu{bottom:calc(100% - 8px);left:16px;width:min(420px,calc(100% - 32px))}
.ag-comp .menu button{white-space:normal;padding:8px 10px;min-height:44px;align-items:flex-start;flex-direction:column;gap:2px}
.ag-comp .menu button.hit{background:var(--sel)}
.ag-why{display:flex;gap:8px;align-items:flex-start;padding:8px 14px 4px;font-size:13px;line-height:1.5;color:var(--amber-f)}
.ag-why .ic{flex:0 0 auto;margin-top:2px}
.ag-tpls{display:flex;gap:8px;padding:6px 8px 8px;overflow-x:auto;scrollbar-width:thin}
.ag-tplc{flex:0 0 min(240px,78%);display:flex;flex-direction:column;gap:3px;padding:10px 12px;border:1px solid var(--line2);border-radius:10px;background:var(--card);color:var(--text);text-align:start;font:inherit;cursor:pointer;transition:border-color var(--d1),background var(--d1)}
.ag-tplc:hover{border-color:var(--horizon);background:var(--sel)}
.ag-tplc b{font-size:13px}
.ag-tplc span{font-size:12px;line-height:1.45;color:var(--mute)}
.ag-sum{background:var(--teal-b);border-radius:var(--r-m);padding:12px 14px;font-size:13px;color:var(--text)}
.ag-sum .hd{display:flex;align-items:center;gap:6px;color:var(--teal-f);font-weight:700;font-size:12px;letter-spacing:.02em;margin-bottom:6px}
/* AG2 callbacks */
.ag-day .kpi.mini{background:transparent;padding:4px 0}
.ag-day{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ag-dayline{display:none}
.ag-grp{overflow:hidden}
.ag-grp-h{display:flex;align-items:center;gap:8px;padding:16px 20px 10px}
.ag-grp-h h2{font-family:var(--f-display);font-size:14px;font-weight:700}
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
  .ag-inbox{grid-template-columns:288px minmax(0,1fr)}
  .ag-hint{display:none}
  .ag-cbrow{grid-template-columns:104px minmax(0,1fr) auto;grid-template-areas:"tm who act" "tm why act"}
  .ag-alpage{grid-template-columns:1fr}
}
@media (max-width:760px){
  .ag-inbox{grid-template-columns:1fr;height:calc(100vh - 118px)}
  .ag-inbox[data-mob="list"] .ag-chatcol{display:none}
  .ag-inbox[data-mob="chat"] .ag-listcol{display:none}
  .ag-inbox[data-mob="list"] .cx-dp{display:none}
  .ag-comp{padding:8px 10px 10px}
  .ag-ta{font-size:16px}
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

  const G = S.ag = {folder:{cc:'callbacks', sales:'sent'}, sel:null, tab:'reply', mob:'list', sq:null, typing:null, replied:new Set(), duePopped:new Set(['l09']), cbTab:'today', alF:'all'};
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
    // Status lives in the header (and the profile menu on phones); this page keeps one toolbar and one report card.
    return shell({nav:'inbox', title:'Alerts', body:`
      ${pageToolbar({left:`<div class="fchips" role="group" aria-label="Show">${F.map(([k, t]) => `<button type="button" class="fchip" data-a="ag-alf" data-x="${k}" aria-pressed="${G.alF === k}">${t} <span class="n">${S.alerts.filter(a => k === 'all' || a.type === k).length}</span></button>`).join('')}</div>`,
        right:`<label class="row tight nowrap small" title="A short sound with each pop-up">${sw(S.sound, 'ag-sound', '', 'Alert sound')}Sound</label>${readAll(n)}`})}
      ${reportCard({title:'Alerts', sub: n ? '' : 'Nothing new', body: list.length ? alertGroups(list) : empty('bell', 'No alerts yet', 'When a lead is given to you or a callback is due, it shows here.')})}`});
  }});

  /* ---------- AG1 Inbox ---------- */
  const FOLDERS = {
    cc:[['callbacks','Callbacks', l => isOpen(l) && l.cb && !l.cb.done && !l.asked], ['asked','Asked for a person', l => isOpen(l) && l.asked], ['mine','My chats', isOpen], ['closed','Closed today', l => !isOpen(l) && l.closedToday]],
    sales:[['sent','Sent to me', l => isOpen(l) && (l.status === 'qualified' || l.unread)], ['mine','My chats', isOpen], ['closed','Closed today', l => !isOpen(l) && l.closedToday]],
  };
  // status on a list row, left out when the folder already says it (every chat in Callbacks is a callback)
  const rowStatus = (x, fk) => {
    if (x.asked && isOpen(x)) return fk === 'asked' ? '' : stDot('Asked for a person', 'amber');
    if (fk === 'callbacks' && x.status === 'callback') return '';
    const s = STATUS[x.status] || {label:x.status, c:'grey'}; return stDot(s.label, s.c);
  };
  const folderList = k => { const f = FOLDERS[S.role].find(x => x[0] === k) || FOLDERS[S.role][0]; return mine().filter(f[2]).sort((a, b) => (b.unread - a.unread) || ((b.late ? 1 : 0) - (a.late ? 1 : 0)) || (a.lastIn - b.lastIn)); };
  const lastLine = l => { const m = [...l.m].reverse().find(x => x.k !== 'evt' && x.k !== 'act' && x.text); return m ? m : null; };
  const listTime = l => { const r = rem(l); if (isCC() && l.cb && !l.cb.done && r < 0) return [`${mins(-r)} late`, true]; const m = lastLine(l); return [m ? rowTime(m.at) : '—', l.late]; };
  const SAVED = ['Hi {first}, this is {me} from iCaur Alghanim. Is now a good time to talk?', 'Our Madinah Road showroom is open 9 AM to 10 PM, Saturday to Thursday.', 'I will send you the full offer in writing in a few minutes.', 'Would you like to book a test drive? Tell me the day and time that suits you.'];
  const TPL = [['Follow up', 'Hello {first}, this is iCaur Alghanim. Are you still interested in the {model}? Reply to this message and we will help you.'], ['New offer', 'Hello {first}, there is a new offer on the {model} this month. Reply YES to hear more.'], ['Test drive reminder', 'Hello {first}, a reminder of your test drive at our Madinah Road showroom. Reply to change the time.']];
  const REPLY = {Arabic:['تمام، شكراً لك', 'طيب، أنتظر اتصالك', 'ممتاز، يناسبني'], English:['Great, thank you.', 'Okay, that works for me.', 'Perfect, talk soon.']};
  const savedFor = l => SAVED.map((s, i) => [i, fill(s, l)]).filter(([, t]) => !G.sq || t.toLowerCase().includes(G.sq.toLowerCase()));
  const focusTa = () => setTimeout(() => { const t = $('#b-f-agText'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }, 0);
  const cbTxt = l => { if (!l.cb || l.cb.done) return ''; const r = rem(l); return `${esc(l.cb.at)} · ${r < 0 ? `<span class="red b">${mins(-r)} late</span>` : 'in ' + mins(r)}`; };
  const winChip = l => {
    if (l.ch !== 'wa') return ''; const h = 24 - l.lastIn;
    return `<span class="ag-win ${h < 2 ? 'low' : ''}" tabindex="0" title="WhatsApp lets you write freely for 24 hours after ${esc(firstName(l))}'s last message. After that, only approved templates.">${ic('clock', 12)}<span class="ag-wl">Reply window · </span>${h >= 1 ? Math.floor(h) + ' h' : Math.max(1, Math.round(h * 60)) + ' min'} left</span>`;
  };

  function composerHtml(l) {
    const note = G.tab === 'note', fn = esc(firstName(l));
    const tabs = `<div class="ag-ctabs" role="tablist" aria-label="Write"><button type="button" role="tab" aria-selected="${!note}" data-a="ag-tab" data-x="reply" title="Reply to ${fn} (R)" aria-keyshortcuts="R">Reply</button><button type="button" role="tab" aria-selected="${note}" data-a="ag-tab" data-x="note" title="Note for the team (N)" aria-keyshortcuts="N">${ic('lock', 12)}Note for the team</button></div>`;
    // WhatsApp 24-hour window closed: the composer becomes the template picker
    if (!note && windowClosed(l)) return `<div class="ag-comp"><div class="ag-box"><div class="ag-ctop">${tabs}</div>
      <p class="ag-why" role="status">${ic('clock', 14)}<span>WhatsApp only allows approved templates now, because ${fn}'s last message was more than 24 hours ago.</span></p>
      <div class="ag-tpls" role="group" aria-label="WhatsApp templates">${TPL.map(([n, s], i) => `<button type="button" class="ag-tplc" data-a="ag-tpl" data-x="${i}"><b>${esc(n)}</b><span>${esc(fill(s, l))}</span></button>`).join('')}</div></div></div>`;
    const ta = bindTa('f.agText');
    const matches = savedFor(l);
    return `<div class="ag-comp ${note ? 'note' : ''}"><div class="ag-box">
      <div class="ag-ctop">${tabs}<span class="sp"></span>${note ? `<span class="ag-nhint">${ic('eyeOff', 13)}Only your team sees notes</span>` : winChip(l)}</div>
      <label class="sr" for="b-f-agText">${note ? 'Note for the team' : 'Message to ' + esc(l.name)}</label>
      <textarea class="ag-ta" rows="1" ${ta[0]} data-in="ag-type" aria-describedby="ag-hint" placeholder="${note ? 'Write a note for the team…' : 'Reply to ' + fn + '… Type / for saved replies'}">${ta[1]}</textarea>
      <div class="ag-tools">
        ${note ? '' : `<input type="file" id="ag-file" class="sr ag-file" data-ch="ag-file"><label class="ibtn sm bare" for="ag-file" title="Attach a file" aria-label="Attach a file">${ic('clip', 17)}</label>
        <button type="button" class="ibtn sm bare" data-a="ag-menu" data-x="ag-saved" aria-haspopup="menu" aria-expanded="${S.menu === 'ag-saved'}" aria-label="Saved replies" title="Saved replies (/)" aria-keyshortcuts="/">${ic('book', 17)}</button>
        ${l.ch === 'wa' ? `<button type="button" class="ibtn sm bare" data-a="ag-menu" data-x="ag-tpl" aria-haspopup="menu" aria-expanded="${S.menu === 'ag-tpl'}" aria-label="WhatsApp templates" title="WhatsApp templates">${ic('tpl', 17)}</button>` : ''}`}
        <span class="sp"></span><span class="ag-hint" id="ag-hint">Enter to send · Shift+Enter for a new line</span>
        <button type="button" class="btn pri sm" data-a="ag-send" title="${note ? 'Save note' : 'Send'} (Enter)" aria-keyshortcuts="Enter Control+Enter Meta+Enter">${ic(note ? 'note' : 'send', 14)}${note ? 'Save note' : 'Send'}</button>
      </div></div>
      ${S.menu === 'ag-saved' && !note ? `<div class="menu" role="menu" aria-label="Saved replies"><div class="mh">Saved replies${G.sq ? ' · “' + esc(G.sq) + '”' : ''}</div>${matches.length ? matches.map(([i, t], n) => `<button type="button" role="menuitem" class="${n === 0 && G.sq != null ? 'hit' : ''}" data-a="ag-saved" data-x="${i}"><span class="small">${esc(t)}</span></button>`).join('') : `<p class="xs mute" style="padding:6px 10px 8px">No saved reply has “${esc(G.sq)}” in it.</p>`}${G.sq != null && matches.length ? '<div class="ag-keys"><kbd>Enter</kbd> picks the first one · <kbd>Esc</kbd> closes</div>' : ''}</div>` : ''}
      ${S.menu === 'ag-tpl' && !note ? `<div class="menu" role="menu" aria-label="WhatsApp templates"><div class="mh">WhatsApp templates</div>${TPL.map(([n, s], i) => `<button type="button" role="menuitem" data-a="ag-tpl" data-x="${i}"><b class="small">${esc(n)}</b><span class="xs mute">${esc(fill(s, l))}</span></button>`).join('')}</div>` : ''}
    </div>`;
  }

  function moreMenu(l, closed) {
    const open = S.menu === 'ag-more';
    const items = (closed ? '' : (isCC() ? `<button type="button" role="menuitem" data-a="ag-sendsales" data-x="${l.id}">${ic('send', 16)}<span class="grow">Send to sales</span></button>` : `<button type="button" role="menuitem" data-a="ag-booktd" data-x="${l.id}">${ic('cal', 16)}<span class="grow">Book test drive</span></button>`)
      + `<button type="button" role="menuitem" data-a="ag-close" data-x="${l.id}">${ic('check', 16)}<span class="grow">Close lead</span></button><div class="hr" style="margin:6px 0"></div>`)
      + `<a role="menuitem" href="#lead-${l.id}">${ic('arrowR', 16)}<span class="grow">Open lead page</span></a><button type="button" role="menuitem" data-a="ag-copy" data-x="${l.id}">${ic('copy', 16)}<span class="grow">Copy mobile</span><span class="xs mute num">${esc(l.mob.slice(-4))}</span></button>`;
    return `<span class="ag-morew"><button type="button" class="ibtn sm" data-a="ag-menu" data-x="ag-more" aria-haspopup="menu" aria-expanded="${open}" aria-label="More actions" title="More actions">${ic('more', 18)}</button>${open ? `<div class="menu" role="menu" aria-label="More actions">${items}<div class="hr" style="margin:6px 0"></div><div class="ag-keys"><kbd>J</kbd> <kbd>K</kbd> next, previous chat · <kbd>R</kbd> reply · <kbd>N</kbd> note · <kbd>]</kbd> details · <kbd>/</kbd> saved replies</div></div>` : ''}</span>`;
  }

  R('inbox', {id:'AG1', title:'Inbox', roles:['cc','sales'], states:[['empty','No chats'],['closed','Chat closed'],['loading','Loading'],['error','Could not load']], render() {
    // hand-off from other screens (lead page "See chat", WhatsApp button)
    if (S.f.agSel) { const x = lead(S.f.agSel); S.f.agSel = null; if (x && x.owner === S.me) { G.sel = G.keep = x.id; G.mob = 'chat'; x.unread = false; stickBottom(); } }
    const fk = G.folder[S.role], q = (S.f.agQ || '').trim().toLowerCase(), dq = q.replace(/\D/g, '');
    let list = S.st === 'empty' ? [] : folderList(fk);
    if (q) list = list.filter(x => x.name.toLowerCase().includes(q) || (dq.length >= 3 && x.mob.replace(/\D/g, '').includes(dq)));
    // the open chat stays open after the agent acts on it, even if it no longer matches this folder
    if (!list.find(l => l.id === G.sel)) { const cur = G.sel && lead(G.sel); if (cur && G.keep === G.sel && cur.owner === S.me) list.unshift(cur); else G.sel = list[0] ? list[0].id : null; }
    const l = G.sel && lead(G.sel);
    const folders = `<div class="tabs ag-ftabs" role="tablist" aria-label="Folders">${FOLDERS[S.role].map(([k, t]) => `<button type="button" role="tab" class="tab ${flashCls('ag-f-' + k)}" data-a="ag-folder" data-x="${k}" aria-selected="${fk === k}">${t}<span class="n">${S.st === 'empty' ? 0 : folderList(k).length}</span></button>`).join('')}</div>`;
    const items = S.st === 'loading' ? `<div style="padding:8px">${loadingRows(6, 62)}</div>` : list.length ? list.map(x => { const [t, late] = listTime(x); const m = lastLine(x);
        return cxRow({l:x, a:'ag-sel', cur:x.id === G.sel, time:t, late, unread:x.unread, cls:flashCls(x.id), preview: m ? txt(m.text) : esc(x.summary), meta:rowStatus(x, fk) + `<span class="ell">${esc(x.model)}</span>`}); }).join('')
      : q ? empty('search', 'No chats match', 'Nothing in this folder has “' + esc(S.f.agQ.trim()) + '” in the name or mobile number.')
      : empty('inbox', fk === 'closed' ? 'Nothing closed today yet' : 'No chats here', fk === 'closed' ? 'Leads you close today show here.' : 'When VINA hands a chat to you, it shows here and you get an alert. You can keep working your leads in My leads.', `<a class="btn" href="#leads">Open my leads</a>`);
    let chat;
    if (S.st === 'loading') chat = `<div style="padding:20px">${loadingRows(5, 54)}</div>`;
    else if (S.st === 'error') chat = `<div style="padding:20px">${errorBox('The chat did not load', 'Check your internet connection, then try again. Nothing you wrote was lost.', 'ag-retry')}</div>`;
    else if (!l) chat = empty('conv', 'Pick a chat', 'Choose a chat on the left to read it and reply.');
    else {
      const closed = !isOpen(l) || S.st === 'closed';
      const line = [CH[l.ch].label, l.model, l.owner === S.me ? 'given to you' : 'given to ' + uname(l.owner)].map(esc).join(' · ');
      // one primary action for the state: Take over here, or Hand back in the paused bar above the composer
      const acts = closed ? '' : (l.paused ? '' : `<button type="button" class="btn sm pri" data-a="ag-take" data-x="${l.id}" aria-label="Take over" title="VINA stops replying in this chat only">${ic('pause', 14)}<span class="ag-hl">Take over</span></button>`)
        + (isCC() ? `<button type="button" class="btn sm" data-a="ag-call" data-x="${l.id}" aria-label="Call ${esc(l.name)}" title="Call ${esc(l.mob)}">${ic('phone', 14)}<span class="ag-hl ag-hl2">Call</span></button>` : '');
      chat = cxHead(l, {back:'ag-back', line, acts, more:moreMenu(l, closed)})
        + cxThread(l, {id:'ag-chat', typing:G.typing === l.id})
        + (closed ? `<div class="ag-closedbar" role="status">${ic('lock', 16)}<span class="grow">This lead is closed · ${esc(l.status === 'sold' ? 'Sold' : l.lostReason || 'Lost')}${l.checkin ? ' · VINA checks in on 7 Dec' : ''}. You cannot reply here.</span></div>`
          : (l.paused ? `<div class="ag-paused ${flashCls('ag-pause-' + l.id)}" role="status">${pulse()}<span class="grow" title="VINA carries on by itself after 24 hours without a reply from you"><b>VINA is paused in this chat</b><span class="ag-pl"> · back on its own after 24 h without your reply</span></span><button type="button" class="btn sm" data-a="ag-handback" data-x="${l.id}" title="VINA replies in this chat again">${ic('play', 14)}Hand back</button></div>` : '') + composerHtml(l));
    }
    const dp = l && S.st !== 'loading' && S.st !== 'error' && dpOpen();
    return shell({nav:'inbox', title:'Inbox', flush:true, search:true, body:`<div class="ag-inbox ${dp ? 'dp-on' : ''}" data-mob="${G.mob}">
      <section class="ag-col ag-listcol" aria-label="Chats"><div class="ag-lh">${cxSearch('f.agQ', 'Search my chats')}${folders}</div><div class="cx-list" id="ag-list" data-keep aria-keyshortcuts="J K">${items}</div></section>
      <section class="ag-col ag-chatcol" aria-label="Chat">${chat}</section>
      ${dp ? cxDetails(l, {cb:cbTxt(l)}) : ''}
    </div>`});
  }, after() { if (!CSS.supports('field-sizing', 'content')) { const t = $('#b-f-agText'); if (t) autoGrow(t); } }});
  // ponytail: JS height only where CSS field-sizing is missing (Safari, Firefox)
  const autoGrow = t => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, 9 * 21 + 18) + 'px'; };
  A['ag-retry'] = () => { S.st = ''; };
  A['ag-folder'] = (el) => { G.folder[S.role] = el.dataset.x; G.sel = null; };
  A['ag-sel'] = (el) => { const l = lead(el.dataset.x); G.sel = G.keep = l.id; l.unread = false; G.mob = 'chat'; DP.narrow = false; S.f.agText = ''; G.sq = null; S.menu = null; stickBottom(); };
  A['ag-back'] = () => { G.mob = 'list'; DP.narrow = false; };
  A['ag-tab'] = (el) => { G.tab = el.dataset.x; G.sq = null; S.menu = null; focusTa(); };
  A['ag-menu'] = (el) => { S.menu = S.menu === el.dataset.x ? null : el.dataset.x; G.sq = null; };
  A['ag-type'] = (el) => {
    if (!CSS.supports('field-sizing', 'content')) autoGrow(el);
    if (el.value.startsWith('/') && G.tab !== 'note') { G.sq = el.value.slice(1); S.menu = 'ag-saved'; return; }
    if (G.sq != null) { G.sq = null; if (S.menu === 'ag-saved') S.menu = null; return; }
    return false;
  };
  A['ag-saved'] = (el) => { const l = lead(G.sel); const t = fill(SAVED[+el.dataset.x], l), cur = S.f.agText || ''; S.f.agText = cur.startsWith('/') ? t : cur + (cur ? ' ' : '') + t; G.sq = null; S.menu = null; focusTa(); };
  A['ag-copy'] = (el) => { const l = lead(el.dataset.x); S.menu = null; try { navigator.clipboard.writeText(l.mob).catch(() => {}); } catch (e) {} toast('Mobile number copied · ' + l.mob); };
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
    S.f.agText = ''; G.sq = null; S.menu = null; G.keep = l.id; flash(l.id); stickBottom();
  };
  A['ag-tpl'] = (el) => { const l = lead(G.sel); G.keep = l.id; const [n, s] = TPL[+el.dataset.x]; const t = fill(s, l); S.menu = null; l.m.push({k:'tpl', name:n, text:t, who:S.me, at:clock(now())}); log(l, 'chat', 'WhatsApp template sent · ' + n, t); if (!l.paused) l.paused = true; flash(l.id); customerReplies(l); stickBottom(); toast('Template sent. You can write freely once ' + firstName(l) + ' replies.'); };
  A['ag-file'] = (el) => { const l = lead(G.sel); if (l) G.keep = l.id; const fl = el.files && el.files[0]; if (!fl || !l) return false; if (fl.size > 16 * 1024 * 1024) { toast('That file is over 16 MB. WhatsApp cannot send it.'); return; } if (!l.paused) take(l, true); l.m.push({k:'file', text:fl.name, who:S.me, at:clock(now())}); log(l, 'chat', 'File sent', fl.name); flash(l.id); stickBottom(); };
  A['ag-call'] = (el) => { S.menu = null; window.startCall(el.dataset.x); };
  A['ag-sendsales'] = (el) => { S.menu = null; openModal('send-sales', {id:el.dataset.x}); };
  A['ag-close'] = (el) => { S.menu = null; openModal('close-lead', {id:el.dataset.x}); };
  A['ag-booktd'] = (el) => { S.menu = null; if (A['ld-book']) { G.keep = el.dataset.x; A['ld-book'](el); } else go('lead-' + el.dataset.x); };
  document.addEventListener('keydown', (ev) => {
    const t = ev.target;
    if (t && t.id === 'b-f-agText') { // Enter sends, Shift+Enter adds a line, Ctrl/⌘+Enter also sends; Enter picks the first "/" match
      if (ev.key !== 'Enter' || ev.isComposing || (ev.shiftKey && !ev.ctrlKey && !ev.metaKey)) return;
      ev.preventDefault(); S.f.agText = t.value;
      if (S.menu === 'ag-saved' && G.sq != null) { const m = savedFor(lead(G.sel))[0]; if (m) A['ag-saved']({dataset:{x:m[0]}}); render(); return; }
      A['ag-send'](); render(); return;
    }
    if (location.hash !== '#inbox' || !isAgent() || !$('#b-f-agText, .ag-tpls')) return;
    const k = hotkey(ev); if (!k) return;
    const lk = k.toLowerCase();
    if (lk === 'r' || lk === 'n') { ev.preventDefault(); G.tab = lk === 'r' ? 'reply' : 'note'; S.menu = null; G.sq = null; render(); focusTa(); }
    else if (k === '/' && G.tab !== 'note' && $('#b-f-agText')) { ev.preventDefault(); if (!(S.f.agText || '').trim()) { S.f.agText = '/'; G.sq = ''; } else G.sq = null; S.menu = 'ag-saved'; render(); focusTa(); }
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
    return modalFrame('Calling ' + l.name, `<div class="ag-callcard"><div class="row nowrap">${av(l.name, 'lg')}<div class="grow"><div class="b ell" style="font-size:16px">${esc(l.name)}</div><div class="mu num">${esc(l.mob)}</div></div><span class="pill" style="background:rgba(110,190,185,.2);color:#BFE6E3">${pulse('green')}On the call</span></div>
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
  let cbFirst = null; // the next callback to make: the only primary Call on the page
  function cbRow(l) {
    const r = rem(l); const done = l.cb.done; const tom = l.cb.day === 'tomorrow'; const over = !done && !tom && r < 0;
    const rel = done ? esc(done) : tom ? 'Tomorrow' : over ? `${pulse('red')}${mins(-r)} late` : 'in ' + mins(r);
    const why = l.cb.why + (l.asked && !/person/i.test(l.cb.why) ? ' · asked for a person' : '');
    return `<div class="ag-cbrow ${over ? 'over' : ''} ${flashCls(l.id)}">
      <div class="ag-tm"><div class="tm ${over ? 'red' : ''}">${esc(l.cb.at.replace(/^Sun /, ''))}</div><div class="row tight nowrap xs ${over ? 'red b' : 'mute'}">${rel}</div></div>
      <div class="who ag-who">${av(l.name)}<div style="min-width:0"><div class="nm ell" title="${esc(l.name)}">${esc(l.name)}</div><div class="row tight nowrap" style="margin-top:4px">${chipC(l.model, 'navy')}<span class="xs mute num ell">${esc(l.mob)}</span></div></div></div>
      <div class="ag-why"><div class="small b ell2">${esc(why)}</div><div class="xs mute" style="margin-top:2px">${tries(l.cb.tries)}</div></div>
      <div class="ag-act row tight nowrap"><button type="button" class="btn sm" data-a="ag-open-chat" data-x="${l.id}">${ic('conv', 14)}Open chat</button>${done ? `<a class="btn sm" href="#lead-${l.id}">${ic('arrowR', 14)}Lead</a>` : `<button type="button" class="btn sm ${l.id === cbFirst ? 'pri' : ''}" data-a="ag-call" data-x="${l.id}">${ic('phone', 14)}Call</button>`}</div></div>`;
  }
  R('callbacks', {id:'AG2', title:'Callbacks', roles:['cc'], states:[['empty','Nothing to call'],['loading','Loading']], render() {
    const pend = S.st === 'empty' ? [] : mine().filter(l => isOpen(l) && l.cb && !l.cb.done);
    const tom = pend.filter(l => l.cb.day === 'tomorrow'), tday = pend.filter(l => l.cb.day !== 'tomorrow');
    const by = (a, b) => rem(a) - rem(b);
    const over = tday.filter(l => rem(l) < 0).sort(by), hour = tday.filter(l => rem(l) >= 0 && rem(l) <= 60).sort(by), later = tday.filter(l => rem(l) > 60).sort(by);
    const done = S.st === 'empty' ? [] : LEADS.filter(l => l.cb && l.cb.done && (l.cbBy === S.me || l.owner === S.me));
    const d = S.st === 'empty' ? {calls:0, reached:0, sent:0} : myDay();
    const tabs = [['today', 'Today', tday.length], ['tomorrow', 'Tomorrow', tom.length], ['done', 'Done today', done.length]];
    cbFirst = G.cbTab === 'today' ? (over[0] || hour[0] || later[0] || {}).id : null;
    const grp = (title, rows, c, sub) => rows.length ? `<section class="card rc rx-tbl ag-grp" aria-label="${title}"><header class="rc-h"><div class="grow row tight nowrap">${c === 'red' ? pulse('red') : ''}<h2${c === 'red' ? ' class="red"' : ''}>${title}</h2><span class="ag-cnt c-${c}">${rows.length}</span></div>${sub ? `<span class="xs mute">${sub}</span>` : ''}</header><div class="rc-b">${rows.map(cbRow).join('')}</div></section>` : '';
    const list = (rows, icon, t, b) => rows.length ? `<section class="card rc rx-tbl ag-grp"><div class="rc-b">${rows.map(cbRow).join('')}</div></section>` : `<div class="card">${empty(icon, t, b)}</div>`;
    let body;
    if (S.st === 'loading') body = loadingRows(5, 64);
    else if (G.cbTab === 'today') body = tday.length ? grp('Overdue', over, 'red', '') + grp('In the next hour', hour, 'amber', 'Due by ' + clock(new Date(now().getTime() + 3600000))) + grp('Later today', later, 'grey', '') : `<div class="card">${empty('phone', 'Nothing to call right now', 'New callbacks show here when VINA books one or a customer asks to be called. You get an alert 10 minutes before each one.', `<a class="btn" href="#inbox">Open my inbox</a>`)}</div>`;
    else if (G.cbTab === 'tomorrow') body = list(tom, 'cal', 'Nothing booked for tomorrow', 'Callbacks for tomorrow show here.');
    else body = list(done, 'check', 'No calls done yet today', 'Calls you finish today show here with their result.');
    const rate = d.calls ? Math.round(d.reached / d.calls * 100) + '% of calls' : 'no calls yet';
    return shell({nav:'callbacks', title:'Callbacks', body:`
      <div class="rx-tbar"><div class="tabs" role="tablist" aria-label="Lists">${tabs.map(([k, t, n]) => `<button type="button" role="tab" class="tab ${k === 'done' ? flashCls('ag-done') : ''}" aria-selected="${G.cbTab === k}" data-a="ag-cbtab" data-x="${k}">${t}<span class="n">${n}</span></button>`).join('')}</div><span class="sp"></span><span class="act xs mute hide-sm">${esc(nowStr())}</span></div>
      ${reportCard({title:'My day', cls:'ag-daycard', body:`<div class="ag-day">${kpi({k:'Calls made', v:d.calls, n:'today', mini:true})}${kpi({k:'Reached', v:d.reached, n:rate, mini:true})}${kpi({k:'Sent to sales', v:d.sent, n:'today', mini:true})}${kpi({k:'Still to call today', v:tday.length, n: over.length ? `<span class="red b">${over.length} overdue</span>` : 'none overdue', hot: over.length > 0, mini:true})}</div>`})}
      <div class="col">${body}</div>
      <p class="ag-dayline" aria-label="My day"><span class="b" style="color:var(--text)">My day</span><span><b>${d.calls}</b> calls</span><span><b>${d.reached}</b> reached</span><span><b>${d.sent}</b> sent to sales</span></p>`});
  }});
  A['ag-cbtab'] = (el) => { G.cbTab = el.dataset.x; };
  A['ag-open-chat'] = (el) => { const l = lead(el.dataset.x); G.sel = l.id; l.unread = false; G.folder[S.role] = 'mine'; G.mob = 'chat'; stickBottom(); go('inbox'); };
})();
