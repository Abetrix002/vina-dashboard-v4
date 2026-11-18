/* Control panel · A1 Agents list, A2 Agent editor, A3 Actions (action builder), A4 Test scenarios. Model and helpers come from 60-setup.js (S.su). */
(function () {
'use strict';
const SU = S.su; const X = SU.lib;
const {clone, cfgOf, agentName, agAv, unsaved, secDirty, sig, counts, fresh, runOf, runAll, evalScen, chatBox, BODY, STAGES, CHANS, ON_CH, chOf, STEP_T, runState, tickIn, spin, gbar} = X;
const pick = (label) => `<label class="row tight nowrap ag2-pick"><span class="small mute">${label || 'Agent'}</span>${bindSel('su.cur', SU.agents.map(a => [a.id, agentName(a.id) || 'New agent']))}</label>`;
// phones: the header has no room, so the same picker sits at the top of the page (own id, same binding)
const pickM = () => `<div class="ag2-pickm field"><label for="ag2-cur-m" class="small mute">Agent</label><select class="inp" id="ag2-cur-m" data-bind="su.cur">${SU.agents.map(a => `<option value="${a.id}" ${a.id === cur() ? 'selected' : ''}>${esc(agentName(a.id) || 'New agent')}</option>`).join('')}</select></div>`;
const stChip = a => a.st === 'live' ? `<span class="chip c-green">${pulse('green')}Live</span>` : a.st === 'paused' ? chipC('Paused', 'amber', true) : chipC('Not live yet', 'grey', true);
const cur = () => SU.cur && cfgOf(SU.cur) ? SU.cur : 'sara';
const blocked = id => { const c = counts(id); return !fresh(id) ? 'stale' : c.fail ? 'fail' : ''; };

/* ---------- A1 Agents list ---------- */
R('agents', {id:'A1', title:'Agents', roles:['vina'], states:[['empty','No agents yet']], render() {
  const list = S.st === 'empty' ? [] : SU.agents;
  const cards = list.map(a => {
    const c = cfgOf(a.id); const k = counts(a.id); const r = runOf(a.id); const chs = CHANS.filter(ch => ON_CH(chOf(a.id, ch[0])) || chOf(a.id, ch[0]) === 'Paused' || chOf(a.id, ch[0]) === 'Needs attention');
    const onN = c.actions.filter(x => x.on && !x.needs).length; const tbar = r ? Math.round(k.pass / k.total * 100) : null;
    // [label, value, colour, bar %]
    const stats = a.st === 'setup' ? [['Setup stage', (SU.step[a.id] || 1) + ' of 7', '', Math.round((SU.step[a.id] || 1) / 7 * 100)], ['Knowledge', c.know.files.length + ' files'], ['Actions on', onN], ['Test scenarios', r ? k.pass + ' of ' + k.total : 'Not run', r ? (k.fail ? 'amber' : '') : 'mute', tbar]]
      : [['Chats today', num(a.chats)], ['Alone, no person', a.alone || '—'], ['Actions on', onN], ['Test scenarios', r ? k.pass + ' of ' + k.total : 'Not run', k.fail ? 'amber' : '', tbar]];
    const n = unsaved(a.id);
    const foot = a.st === 'live' ? ['Version ' + SU.ver[a.id] + ', live since ' + a.since, n ? 'Draft with ' + n + ' unsaved change' + (n > 1 ? 's' : '') : 'No unsaved changes', 'Last change by ' + a.by]
      : a.st === 'paused' ? ['Paused by ' + a.by + ' on ' + a.pausedOn, a.reason ? 'Reason: ' + a.reason : ''] : ['Started by ' + a.by + ' on ' + a.started];
    return `<section class="card lift ag2-agent ${a.st}">${agAv(a.id, 'lg')}
      <div class="grow" style="flex:1 1 240px;min-width:0"><div class="row tight"><b class="ag2-aname">${esc(agentName(a.id) || 'New agent')}</b>${stChip(a)}</div><div class="small mute" style="margin-top:4px">${esc(c.agent.job)} · ${esc(Object.keys(c.agent.langs).filter(l => c.agent.langs[l]).join(', '))} · speaks ${esc(c.agent.tone)}</div>
        <div class="row tight" style="margin-top:10px">${chs.length ? chs.map(([kk, l, i, col]) => { const v = chOf(a.id, kk); return `<span class="chip c-${v === 'Paused' ? 'grey' : v === 'Needs attention' ? 'red' : col}" title="${l}: ${v}">${ic(v === 'Needs attention' ? 'alert' : i, 12)}${l}${v === 'Needs attention' ? '<span class="sr">, needs attention</span>' : ''}</span>`; }).join('') : chipC('No channel yet', 'grey')}</div></div>
      <dl class="ag2-stats">${stats.map(([kk, v, col, bar]) => `<div><dt class="xs mute mk" style="gap:6px">${mic(kk, 11)}${kk}</dt><dd class="num ${col || ''}" ${countAttr(v)}>${esc(v)}</dd>${bar != null ? `<div class="bar-h ag2-mbar"><i style="width:${bar}%;background:var(--${col === 'amber' ? 'amber' : kk === 'Setup stage' ? 'horizon' : 'green'})"></i></div>` : ''}</div>`).join('')}</dl>
      <div class="row tight">${a.st === 'setup' ? `<button type="button" class="btn danger-o" data-a="ag2-del" data-x="${a.id}">Delete</button><button type="button" class="btn" data-a="ag2-continue" data-x="${a.id}">Continue setup</button>`
        : `<button type="button" class="btn" data-a="${a.st === 'live' ? 'ag2-pause' : 'ag2-resume'}" data-x="${a.id}">${a.st === 'live' ? ic('pause', 14) + 'Pause' : ic('play', 14) + 'Resume'}</button><a class="btn" href="#agent-${a.id}">Open</a>`}</div>
      <div class="ag2-foot">${foot.filter(Boolean).map(f => `<span>${esc(f)}</span>`).join('')}</div></section>`;
  }).join('');
  return shell({nav:'agents', title:'Agents', cp:true, viewOnly:false, body:`${pageToolbar({left: list.length ? `<span class="small mute">${list.length} agents · ${list.filter(a => a.st === 'live').length} live</span>` : '', right:`<button type="button" class="btn pri" data-a="ag2-new">${ic('plus', 14)}New agent</button>`})}
    ${list.length ? `<div class="col">${cards}</div>` : `<div class="card">${empty('bot', 'No agents yet', 'Set up the first agent for ' + esc(client().name) + '. It takes 7 short stages, and you can test it before customers see it.', `<button type="button" class="btn pri" data-a="ag2-new">${ic('plus', 14)}New agent</button>`)}</div>`}`});
}});
A['ag2-new'] = () => { let n = 1; while (cfgOf('agent' + n)) n++; const id = 'agent' + n; SU.drafts[id] = X.newCfg(); SU.live[id] = null; SU.ver[id] = 0; SU.hist[id] = []; SU.done[id] = []; SU.agents.push({id, st:'setup', started:'Today', by:meName()}); SU.wiz = id; go('setup-1'); };
A['ag2-continue'] = (el) => { SU.wiz = el.dataset.x; go('setup-' + (SU.step[el.dataset.x] || 1)); };
A['ag2-pause'] = (el) => { S.f.agPause = ''; openModal('ag2-pause', {id:el.dataset.x}); };
A['ag2-resume'] = (el) => { const a = SU.agents.find(x => x.id === el.dataset.x); a.st = 'live'; a.since = 'Today'; const c = cfgOf(a.id); ['live', 'drafts'].forEach(k => { const x = SU[k][a.id]; if (x) CHANS.forEach(([ch]) => { if (x.ch[ch] === 'Paused') x.ch[ch] = 'Live'; }); }); toast(agentName(a.id) + ' is answering again'); };
A['ag2-del'] = (el) => { openModal('ag2-del', {id:el.dataset.x}); };
MODALS['ag2-pause'] = (m) => { const chs = CHANS.filter(ch => ON_CH(chOf(m.id, ch[0]))).map(ch => ch[1]); return modalFrame('Pause ' + agentName(m.id) + '?', `<p class="small">${esc(agentName(m.id))} stops answering${chs.length ? ' on ' + esc(chs.join(', ')) : ''}. Customers who write will get no reply until you resume, so tell the team first.</p><div class="field"><label for="b-f-agPause">Reason (optional)</label><input class="inp" ${bind('f.agPause')} placeholder="e.g. waiting for the new price list"></div>`, `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn danger" data-a="ag2-pause-ok" data-x="${m.id}">${ic('pause', 14)}Pause ${esc(agentName(m.id))}</button>`, {size:'narrow'}); };
A['ag2-pause-ok'] = (el) => {
  const a = SU.agents.find(x => x.id === el.dataset.x); const prev = clone(a); const saved = {};
  Object.assign(a, {st:'paused', pausedOn:'Today', reason:(S.f.agPause || '').trim(), by:meName()});
  ['live', 'drafts'].forEach(k => { const x = SU[k][a.id]; if (x) { saved[k] = clone(x.ch); CHANS.forEach(([ch]) => { if (ON_CH(x.ch[ch])) x.ch[ch] = 'Paused'; }); } });
  S.modal = null; toast(agentName(a.id) + ' is paused', () => { Object.assign(a, prev); Object.keys(saved).forEach(k => { SU[k][a.id].ch = saved[k]; }); render(); });
};
MODALS['ag2-del'] = (m) => modalFrame('Delete ' + (agentName(m.id) || 'this agent') + '?', `<p class="small">The setup progress and test results for this agent are removed. Nothing changes for customers, because it is not live yet.</p>`, `<button type="button" class="btn" data-a="close-modal">Keep it</button><button type="button" class="btn danger" data-a="ag2-del-ok" data-x="${m.id}">Delete</button>`, {size:'narrow'});
A['ag2-del-ok'] = (el) => { const id = el.dataset.x; const nm = agentName(id) || 'The agent'; SU.agents = SU.agents.filter(a => a.id !== id); if (SU.wiz === id) SU.wiz = (SU.agents.find(a => a.st === 'setup') || {}).id || 'layan'; S.modal = null; toast(nm + ' was deleted'); };

/* ---------- A2 Agent editor ---------- */
const SARA_SEED = [{k:'in', text:'السلام عليكم، أبغى أجرب V27 بكرة العصر'},{k:'vina', text:'وعليكم السلام! أكيد. بكرة الأحد عندنا في معرض طريق المدينة ٤:٠٠ أو ٥:٠٠ أو ٦:٠٠ مساءً. أي وقت يناسبك؟'},{k:'act', name:'Book a test drive', st:'Started', lines:['Found 3 free times on Sun 8 Nov','Asked the customer to choose']},{k:'in', text:'٥ تمام. اسمي فهد'},{k:'vina', text:'تم الحجز يا فهد. الأحد ٨ نوفمبر الساعة ٥:٠٠ مساءً في معرض طريق المدينة. أرسلت لك الموقع، ونذكرك قبل الموعد بساعتين.'},{k:'act', name:'Book a test drive', st:'Done', lines:['Booked Sun 8 Nov, 5:00 PM · Madinah Road','Status changed to Test drive booked','Given to Majed by rule "Qualified to Sales"','WhatsApp confirmation and location sent','Reminder set for 3:00 PM']}];
R('agent', {id:'A2', title:'Agent editor', roles:['vina'], states:[['leaving','Unsaved changes warning']], render(p) {
  const id = cfgOf(p) ? p : 'sara'; SU.cur = id; const c = cfgOf(id); const a = SU.agents.find(x => x.id === id) || {st:'setup'}; const n = unsaved(id); const b = n ? blocked(id) : '';
  if (S.st === 'leaving' && SU._stShown !== 'leaving' && !S.modal) { SU._stShown = 'leaving'; S.modal = {id:'ag2-leave', aid:id, to:'agents'}; }
  if (S.st !== 'leaving') SU._stShown = '';
  if (!SU.live[id]) return shell({nav:'agents', title:'Agent editor', cp:true, viewOnly:false, body:`<div class="card">${empty('bot', esc(agentName(id) || 'This agent') + ' is not live yet', 'Finish the setup first. After it goes live, you change it here.', `<button type="button" class="btn pri" data-a="ag2-continue" data-x="${id}">Continue setup</button>`)}</div>`});
  const secs = STAGES.map(([t], i) => ({n:i + 1, t, dot:secDirty(id, i + 1)}));
  const k = counts(id); const r = runOf(id);
  const sum7 = `<div class="col tight">${r ? `<div class="row tight">${chipC(k.pass + ' passed', 'green')}${k.fail ? chipC(k.fail + ' failed', 'red') : ''}${k.check ? chipC(k.check + ' to check', 'amber') : ''}<span class="xs mute">${esc(r.when)} · ${r.ver === 'draft' ? 'draft' : 'live version'}${fresh(id) ? '' : ' · before your last change'}</span></div>` : '<p class="small mute">Not run yet.</p>'}<a class="btn" href="#scenarios" data-keepdraft style="align-self:flex-start">${ic('tests', 14)}Open test scenarios</a></div>`;
  const nd = secs.filter(x => x.dot).length;
  const stat = `${a.st === 'paused' ? pulse('amber') + 'Paused' : pulse('green') + 'Live'} · version ${SU.ver[id]} · ${n ? `<b class="amber">${n} unsaved change${n > 1 ? 's' : ''}</b>` : 'no unsaved changes'}`;
  const body = `<div class="card ag2-bar" id="ag2-bar" role="region" aria-label="${esc(c.agent.name)} status">
      <a class="ibtn sm bare ag2-back" href="#agents" aria-label="Back to agents" title="Agents">${ic('chevL', 16)}</a>${agAv(id)}
      <div class="grow" style="min-width:0"><div class="row tight"><b class="ag2-aname">${esc(c.agent.name)}</b><span class="ag2-stat">${stat}</span></div><div class="xs mute">Changes go live only after all test scenarios pass.</div></div>
      <div class="row tight ag2-btns"><button type="button" class="ibtn" data-a="ag2-hist" data-x="${id}" aria-label="Change history" title="Change history">${ic('history', 16)}</button><button type="button" class="btn ghost" data-a="ag2-discard" data-x="${id}" ${n ? '' : 'disabled'}>Discard</button><a class="btn" href="#scenarios" data-keepdraft>${ic('play', 14)}Run tests</a><button type="button" class="btn pri" data-a="ag2-save" data-x="${id}" ${!n ? 'disabled' : b ? 'aria-disabled="true" aria-describedby="ag2-why"' : ''}>Save changes</button></div>
      ${n && b ? `<div class="ag2-block" id="ag2-why" role="status">${ic('lock', 15)}<div class="grow">${b === 'fail' ? `<b>Saving is blocked.</b> ${k.fail} test scenario${k.fail > 1 ? 's' : ''} failed on these changes.` : `<b>Saving is blocked</b> until the test scenarios run on these changes.`}</div><a class="btn sm" href="#scenarios" data-keepdraft>${b === 'fail' ? 'See what failed' : 'Run the tests'}</a></div>` : ''}</div>
    <div class="ag2-ed">
      <nav class="ag2-secnav" aria-label="Sections"><div class="eyebrow ag2-navh">Sections${nd ? ` · <span class="amber">${nd} changed</span>` : ''}</div>${secs.map(s => `<button type="button" data-a="ag2-jump" data-x="${s.n}" class="${s.dot ? 'dirty' : ''}"><span class="su-num">${s.n}</span><span class="grow">${s.t}</span>${s.dot ? '<span class="ag2-dot" title="Unsaved change"><span class="sr">Unsaved change</span></span>' : ''}</button>`).join('')}</nav>
      <div class="col loose" style="min-width:0">${secs.map(s => `<section class="card ag2-sec ${s.dot ? 'dirty' : ''}" id="ag2-s${s.n}" aria-labelledby="ag2-h${s.n}"><div class="card-h"><span class="ag2-n">${s.n}</span><h2 id="ag2-h${s.n}">${s.t}</h2>${s.dot ? chipC('Unsaved', 'amber', true) : ''}${s.n === 5 ? `<span class="sp"></span><a class="btn sm ghost" href="#actions" data-keepdraft>Open all actions</a>` : ''}</div>${s.n === 7 ? sum7 : s.n === 5 ? BODY[5](id, true) : BODY[s.n](id)}</section>`).join('')}</div>
      <div class="ag2-chatcol">${chatBox('a2-' + id, id, {sub:'Uses your unsaved changes', seed: id === 'sara' ? SARA_SEED : null})}</div>
    </div>`;
  return shell({nav:'agents', title:'Agent editor', cp:true, viewOnly:false, crumb:null, body});
}, after() { const bar = document.getElementById('ag2-bar'), ed = document.querySelector('.ag2-ed'); if (bar && ed) ed.style.setProperty('--stk', (getComputedStyle(bar).position === 'sticky' ? 77 + bar.offsetHeight + 14 : 88) + 'px'); if (SU.a2jump) { const e = document.getElementById('ag2-s' + SU.a2jump); SU.a2jump = 0; if (e) e.scrollIntoView({block:'start'}); } }});
A['ag2-jump'] = (el) => { const e = document.getElementById('ag2-s' + el.dataset.x); if (e) { e.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'}); const h = e.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({preventScroll:true}); } } return false; };
A['ag2-discard'] = (el) => { const id = el.dataset.x; const prev = clone(SU.drafts[id]); SU.drafts[id] = clone(SU.live[id]); toast('Changes discarded', () => { SU.drafts[id] = prev; render(); }); };
A['ag2-save'] = (el) => {
  const id = el.dataset.x; if (!unsaved(id) || blocked(id)) return;
  const what = STAGES.map(([t], i) => secDirty(id, i + 1) ? t : '').filter(Boolean).join(', ');
  SU.ver[id]++; SU.live[id] = clone(SU.drafts[id]); SU.runs[id].ver = 'live'; SU.runs[id].sig = sig(id);
  SU.hist[id].unshift({v:SU.ver[id], who:meName(), when:nowStr(), what:'Changed ' + what.toLowerCase(), snap:clone(SU.live[id])});
  const a = SU.agents.find(x => x.id === id); a.by = meName();
  toast('Saved. ' + agentName(id) + ' is live with version ' + SU.ver[id]);
};
A['ag2-hist'] = (el) => { openModal('ag2-hist', {id:el.dataset.x}); };
MODALS['ag2-hist'] = (m) => modalFrame('Change history', `<div class="list">${(SU.hist[m.id] || []).map((h, i) => `<div class="li su-at"><span class="su-num ${i === 0 ? 'on' : ''}">${h.v}</span><div class="grow"><div class="small b">${esc(h.what)}</div><div class="xs mute">${esc(h.who)} · ${esc(h.when)}</div></div>${i === 0 ? chipC('Live now', 'green') : `<button type="button" class="btn sm" data-a="ag2-restore" data-x="${m.id}|${i}">${ic('undo', 14)}Restore</button>`}</div>`).join('') || '<p class="small mute">No changes yet.</p>'}</div><p class="xs mute">Restoring loads an older version as a draft. It goes live only after the test scenarios pass and you save.</p>`, `<button type="button" class="btn" data-a="close-modal">Close</button>`, {sub:'Who changed what and when'});
A['ag2-restore'] = (el) => { const [id, i] = el.dataset.x.split('|'); const h = SU.hist[id][Number(i)]; SU.drafts[id] = clone(h.snap); S.modal = null; toast('Version ' + h.v + ' loaded as a draft. Run the tests, then save to make it live.'); };
MODALS['ag2-leave'] = (m) => { const n = unsaved(m.aid); return modalFrame('Leave without saving?', `<p class="small">You have ${n} unsaved change${n > 1 ? 's' : ''} to ${esc(agentName(m.aid))}. If you leave now, they are lost and customers keep getting the live version ${SU.ver[m.aid]}.</p>`, `<button type="button" class="btn danger-o" data-a="ag2-leave-ok" data-x="${m.aid}|${esc(m.to)}">Leave without saving</button><button type="button" class="btn pri" data-a="close-modal" autofocus>Stay</button>`, {size:'narrow'}); };
A['ag2-leave-ok'] = (el) => { const [id, to] = el.dataset.x.split('|'); SU.drafts[id] = clone(SU.live[id]); S.modal = null; S.st = ''; go(to || 'agents'); };
document.addEventListener('click', (ev) => {
  const h = location.hash.slice(1); if (!h.startsWith('agent-')) return;
  const id = h.slice(6); if (!SU.live[id] || !unsaved(id)) return;
  const a = ev.target.closest('.nav a[href^="#"], .nav [data-go], .ag2-back');
  if (!a || a.hasAttribute('data-keepdraft')) return;
  ev.preventDefault(); ev.stopPropagation();
  openModal('ag2-leave', {aid:id, to:(a.getAttribute('href') || '#' + a.dataset.go).slice(1)}); render();
}, true);

/* ---------- A3 Actions (action builder) ---------- */
const GROUPS = ['Leads', 'Bookings', 'Send and close', 'Connected systems'];
const wkey = (id, aid) => id + '_' + aid;
function work(id, aid) { const k = wkey(id, aid); const d = cfgOf(id).actions.find(a => a.id === aid); if (!SU.a3[k]) SU.a3[k] = clone(d); return SU.a3[k]; }
const dirtyA = (id, aid) => { const k = wkey(id, aid); const d = cfgOf(id).actions.find(a => a.id === aid); return !!SU.a3[k] && JSON.stringify(SU.a3[k]) !== JSON.stringify(d); };
const blanks = s => esc(s).replace(/\{([^}]+)\}/g, '<span class="blank">{$1}</span>');
R('actions', {id:'A3', title:'Actions', roles:['vina'], states:[['needs','Needs setup'],['off','Action off'],['unsaved','Unsaved changes']], render(p) {
  const id = cur(); const c = cfgOf(id);
  let aid = p && p !== 'new' && c.actions.some(a => a.id === p) ? p : (SU.a3sel && c.actions.some(a => a.id === SU.a3sel) ? SU.a3sel : 'testdrive');
  if (S.st === 'needs') aid = 'crm'; if (S.st === 'off') aid = 'status';
  SU.a3sel = aid;
  if (p === 'new' && !S.modal && !SU._newShown) { SU._newShown = true; S.f.naName = ''; S.f.naGroup = 'Connected systems'; S.f.naLine = ''; S.modal = {id:'ag2-newact'}; }
  if (p !== 'new') SU._newShown = false;
  const w = work(id, aid); const k = wkey(id, aid); const base = 'su.a3.' + k;
  if (S.st === 'unsaved' && !dirtyA(id, aid)) w.when = w.when + ' Also when they ask about the weekend.';
  const dirty = dirtyA(id, aid); const off = !w.on || w.needs;
  const list = GROUPS.map(g => { const items = c.actions.map((a, i) => ({a, i})).filter(x => x.a.g === g); if (!items.length) return ''; return `<div class="eyebrow ag2-grp">${g}</div>${items.map(({a}) => `<div class="ag2-ai ${a.id === aid ? 'sel' : ''} ${a.needs ? 'needs' : a.on ? '' : 'off'}"><span class="chi c-${a.needs ? 'amber' : a.on ? 'teal' : 'grey'}">${ic(a.icon || 'bolt', 14)}</span><a href="#actions-${a.id}" class="grow" ${a.id === aid ? 'aria-current="page"' : ''}><span class="small b" style="display:block">${esc(a.name)}${dirtyA(id, a.id) ? ' <span class="ag2-dot" title="Unsaved changes"><span class="sr">Unsaved changes</span></span>' : ''}</span><span class="xs ${a.needs ? 'amber' : 'mute'}">${a.needs ? 'Needs setup' : (a.on ? 'On' : 'Off') + ' · ' + num(a.uses) + ' this week'}</span></a>${a.needs ? '' : sw(a.on, 'ag2-a-tog', id + '|' + a.id, a.name)}</div>`).join('')}`; }).join('');
  const T = SU.a3tab || 'ar';
  const TI = {check:'search', ask:'conv', update:'edit', assign:'user', send:'send', wait:'clock', call:'plug'};
  const steps = w.steps.map((s, i) => { const t = STEP_T[s.k] || STEP_T.check; const ed = SU.a3step === k + i;
    return `<li class="ag2-step ${ed ? 'editing' : ''}" draggable="${ed ? 'false' : 'true'}" data-drag="ag2step" data-x="${i}" data-drop="ag2-step-drop"><span class="ag2-grip" aria-hidden="true" title="Drag to reorder">${ic('grip', 16)}</span><span class="ag2-node" aria-hidden="true">${i + 1}</span>
      <div style="min-width:0"><span class="sr">Step ${i + 1}: </span>${ed ? `<div class="col tight"><label class="sr" for="b-${(base + '.steps.' + i + '.t').replace(/\./g, '-')}">Step name</label><input class="inp" ${bind(base + '.steps.' + i + '.t')}><label class="sr" for="b-${(base + '.steps.' + i + '.d').replace(/\./g, '-')}">What happens</label><input class="inp" ${bind(base + '.steps.' + i + '.d')} placeholder="What happens in this step"><div class="row tight"><label class="sr" for="b-${(base + '.steps.' + i + '.k').replace(/\./g, '-')}">Step type</label>${bindSel(base + '.steps.' + i + '.k', Object.keys(STEP_T).map(x => [x, STEP_T[x][0]]))}<button type="button" class="btn sm pri" data-a="ag2-step-done">Done</button><button type="button" class="btn sm danger-o" data-a="ag2-step-del" data-x="${i}">Remove</button></div></div>`
        : `<div class="row tight"><span class="chip c-${t[1]} ag2-tt">${ic(TI[s.k] || 'bolt', 12)}${t[0]}</span><b class="small">${esc(s.t)}</b></div><div class="xs mute" style="margin-top:4px">${esc(s.d) || 'No details yet'}</div>`}</div>
      ${ed ? '<span></span>' : `<div class="row tight nowrap"><button type="button" class="ibtn sm bare" data-a="ag2-step-mv" data-x="${i}|-1" aria-label="Move step ${i + 1} up" ${i === 0 ? 'disabled' : ''}>${ic('chevU', 15)}</button><button type="button" class="ibtn sm bare" data-a="ag2-step-mv" data-x="${i}|1" aria-label="Move step ${i + 1} down" ${i === w.steps.length - 1 ? 'disabled' : ''}>${ic('chevD', 15)}</button><button type="button" class="btn sm ghost" data-a="ag2-step-ed" data-x="${k + i}">Edit</button></div>`}</li>`; }).join('');
  const sec = (n, title, sub) => `<div class="row tight nowrap"><span class="ag2-n">${n}</span><h2 class="h2">${title}</h2></div>${sub ? `<p class="small mute">${sub}</p>` : ''}`;
  const finP = w.uses ? Math.round(w.fin / w.uses * 100) : 0;
  const right = `<div class="col loose ag2-right ${off ? 'ag2-off' : ''}">
    ${dirty ? `<div class="note warn ag2-sticky">${ic('edit')}<div class="grow"><b>Unsaved changes</b> to ${esc(w.name)}.</div><button type="button" class="btn sm" data-a="ag2-a-reset" data-x="${aid}">Discard</button><button type="button" class="btn sm pri" data-a="ag2-a-save" data-x="${aid}">Save</button></div>` : ''}
    <section class="card ag2-ahead"><span class="chi lg c-${w.needs ? 'amber' : w.on ? 'teal' : 'grey'}">${ic(w.icon || 'bolt', 20)}</span><div class="grow" style="min-width:0"><div class="row tight"><b class="ag2-aname">${esc(w.name)}</b>${w.needs ? chipC('Needs setup', 'amber', true) : `${sw(w.on, 'su-tog', base + '.on', w.name + ' on or off')}<span class="small b">${w.on ? 'On' : 'Off'}</span>`}</div>
        <div class="small mute" style="margin-top:4px">${w.needs ? 'Not used yet' : `Used <span ${countAttr(w.uses)}>${num(w.uses)}</span> times this week · ${num(w.fin)} finished${w.uses - w.fin ? ' · ' + (w.uses - w.fin) + ' handed to the call centre' : ''}`}</div>
        ${!w.needs && w.uses ? `<div class="bar-h ag2-fin" title="${finP}% finished by VINA"><i style="width:${finP}%;background:var(--aqua)"></i></div>` : ''}</div>
      <div class="row tight"><a class="btn" href="#scenarios-a-${aid}">${ic('tests', 14)}Test this action</a><button type="button" class="btn pri" data-a="ag2-a-save" data-x="${aid}">Save</button></div></section>
    ${w.needs ? `<section class="card ag2-needs" role="status"><span class="chi lg c-amber">${ic('plug', 20)}</span><div class="grow" style="min-width:0"><h2 class="h2">Needs setup before ${esc(agentName(id))} can use it</h2><dl class="kv" style="margin-top:10px"><dt>Missing</dt><dd>${esc(w.needs.missing)}</dd><dt>Who to contact</dt><dd>${esc(w.needs.contact)}</dd></dl></div></section>` : ''}
    ${off && !w.needs ? `<div class="note ag2-offnote">${ic('pause')}<div class="grow"><b>This action is off.</b> ${esc(agentName(id))} will not do it. You can still change it and switch it on later.</div><button type="button" class="btn sm" data-a="su-tog" data-x="${base}.on">Switch on</button></div>` : ''}
    <section class="card col">${sec(1, 'When should VINA do this?', 'Write it the way you would explain it to a new salesperson.')}
      <label class="sr" for="b-${(base + '.when').replace(/\./g, '-')}">When should VINA do this?</label><textarea class="inp" rows="2" ${bindTa(base + '.when')[0]}>${bindTa(base + '.when')[1]}</textarea>
      <div class="row tight"><span class="xs mute">Customers say:</span>${w.says.map((x, i) => `<span class="tokens" style="min-height:32px;padding:2px"><span class="tok">${txt(x)}<button type="button" data-a="su-del" data-x="${base}.says#${i}" aria-label="Remove example">${ic('x', 12)}</button></span></span>`).join('')}</div>
      <form class="row tight nowrap" data-a="ag2-say" data-x="${aid}"><label class="sr" for="b-f-agSay">Add an example of what customers say</label><input class="inp grow" ${bind('f.agSay')} dir="auto" placeholder="Add an example in Arabic or English"><button type="submit" class="btn">Add</button></form></section>
    <section class="card col">${sec(2, 'What VINA must know first', 'VINA asks for anything missing, one question at a time.')}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Detail</th><th>Required</th><th>How VINA gets it</th><th><span class="sr">Remove</span></th></tr></thead><tbody>${w.fields.map((f, i) => `<tr><td><label class="sr" for="b-${(base + '.fields.' + i + '.t').replace(/\./g, '-')}">Detail</label><input class="inp" style="min-width:120px" ${bind(base + '.fields.' + i + '.t')}></td><td>${sw(f.req, 'su-tog', base + '.fields.' + i + '.req', f.t + ' required')}</td><td><label class="sr" for="b-${(base + '.fields.' + i + '.how').replace(/\./g, '-')}">How VINA gets it</label>${bindSel(base + '.fields.' + i + '.how', [...new Set([f.how, 'Asks', 'Takes it from WhatsApp', 'Already known'])])}</td><td class="r"><button type="button" class="ibtn sm bare" data-a="su-del" data-x="${base}.fields#${i}" aria-label="Remove ${esc(f.t)}">${ic('trash', 15)}</button></td></tr>`).join('') || `<tr><td colspan="4" class="mute">No details needed.</td></tr>`}</tbody></table></div>
      <button type="button" class="btn sm" data-a="ag2-field-add" data-x="${aid}" style="align-self:flex-start">${ic('plus', 14)}Add a detail</button></section>
    <section class="card col">${sec(3, 'What happens', 'The steps run in this order, top to bottom. Drag to reorder, or use the arrows.')}
      ${steps ? `<ol class="ag2-flow">${steps}</ol>` : '<p class="small mute">No steps yet. Add the first one below.</p>'}
      <div class="row tight"><span class="xs mute">Add a step:</span>${Object.keys(STEP_T).map(x => `<button type="button" class="fchip" data-a="ag2-step-add" data-x="${x}">${ic('plus', 12)}${STEP_T[x][0]}</button>`).join('')}</div></section>
    <div class="su-g2">
      <section class="card col">${sec(4, 'Message VINA sends')}
        <div class="seg" role="tablist" aria-label="Message language" style="align-self:flex-start">${[['ar','Arabic'],['en','English']].map(([kk, t]) => `<button type="button" role="tab" aria-selected="${T === kk}" data-a="su-set" data-x="su.a3tab" data-v="${kk}">${t}</button>`).join('')}</div>
        <label class="sr" for="b-${(base + '.msg.' + T).replace(/\./g, '-')}">Message in ${T === 'ar' ? 'Arabic' : 'English'}</label><textarea class="inp" rows="3" ${T === 'ar' ? 'dir="rtl"' : ''} ${bindTa(base + '.msg.' + T, true)[0]}>${bindTa(base + '.msg.' + T)[1]}</textarea>
        <div class="msg vina ag2-msgprev" ${T === 'ar' ? 'dir="rtl"' : ''}><div class="bub ${T === 'ar' ? 'ar' : ''}">${w.msg[T] ? blanks(w.msg[T]) : '<span class="mute">No message for this action.</span>'}</div></div>
        <div class="xs mute">Blue words are filled in by VINA, for example <span class="blank">{name}</span> <span class="blank">{day}</span> <span class="blank">{time}</span>.</div></section>
      <section class="card col">${sec(5, 'If something goes wrong')}
        ${w.fails.map((f, i) => `<div class="col tight ag2-fail"><label class="sr" for="b-${(base + '.fails.' + i + '.k').replace(/\./g, '-')}">What goes wrong</label><input class="inp b" ${bind(base + '.fails.' + i + '.k')}><label class="sr" for="b-${(base + '.fails.' + i + '.v').replace(/\./g, '-')}">What VINA does</label><div class="row tight nowrap"><span class="mute" aria-hidden="true">${ic('arrowR', 14)}</span><input class="inp grow" ${bind(base + '.fails.' + i + '.v')}><button type="button" class="ibtn sm bare" data-a="su-del" data-x="${base}.fails#${i}" aria-label="Remove">${ic('trash', 15)}</button></div></div>`).join('')}
        <button type="button" class="btn sm" data-a="ag2-fail-add" data-x="${aid}" style="align-self:flex-start">${ic('plus', 14)}Add a case</button></section></div>
    <section class="card">${`<div class="sw-row">${sw(w.ask, 'su-tog', base + '.ask', 'Ask the customer before acting')}<span class="grow"><b class="small">Ask the customer before acting</b><span class="xs mute" style="display:block">VINA repeats what it will do and waits for "yes".</span></span></div>`}</section>
  </div>`;
  return shell({nav:'actions', title:'Actions', cp:true, viewOnly:false, tools:pick('Agent:'), search:false, body:`${pickM()}<div class="ag2-a3"><aside class="card ag2-alist" aria-label="Actions"><div class="row nowrap">${agAv(id, 'sm')}<b class="grow">${esc(agentName(id))} can</b><button type="button" class="btn sm" data-a="ag2-new-act">${ic('plus', 14)}New action</button></div>${list}</aside>${right}</div>`});
}});
A['ag2-a-tog'] = (el) => { const [id, aid] = el.dataset.x.split('|'); const a = cfgOf(id).actions.find(x => x.id === aid); a.on = !a.on; const w = SU.a3[wkey(id, aid)]; if (w) w.on = a.on; toast(a.name + (a.on ? ' is on' : ' is off') + ' in the draft'); };
A['ag2-a-save'] = (el) => { const id = cur(); const aid = el.dataset.x; const acts = cfgOf(id).actions; const i = acts.findIndex(a => a.id === aid); if (!dirtyA(id, aid)) { toast('No changes to save'); return; } acts[i] = clone(SU.a3[wkey(id, aid)]); toast('Saved to ' + agentName(id) + '\'s draft. It goes live after all test scenarios pass.'); };
A['ag2-a-reset'] = (el) => { delete SU.a3[wkey(cur(), el.dataset.x)]; if (S.st === 'unsaved') S.st = ''; };
A['ag2-say'] = (fm) => { const v = (S.f.agSay || '').trim(); if (!v) return false; work(cur(), fm.dataset.x).says.push(v); S.f.agSay = ''; };
A['ag2-field-add'] = (el) => { work(cur(), el.dataset.x).fields.push({t:'New detail', req:false, how:'Asks'}); };
A['ag2-fail-add'] = (el) => { work(cur(), el.dataset.x).fails.push({k:'', v:''}); };
const curW = () => work(cur(), SU.a3sel);
A['ag2-step-add'] = (el) => { const w = curW(); w.steps.push({t:'New step', k:el.dataset.x, d:''}); SU.a3step = wkey(cur(), SU.a3sel) + (w.steps.length - 1); };
A['ag2-step-ed'] = (el) => { SU.a3step = el.dataset.x; };
A['ag2-step-done'] = () => { SU.a3step = null; };
A['ag2-step-del'] = (el) => { curW().steps.splice(Number(el.dataset.x), 1); SU.a3step = null; };
A['ag2-step-mv'] = (el) => { const [i, d] = el.dataset.x.split('|').map(Number); const s = curW().steps; const j = i + d; if (j < 0 || j >= s.length) return; [s[i], s[j]] = [s[j], s[i]]; };
A['ag2-step-drop'] = (t, d) => { if (d.kind !== 'ag2step') return false; const s = curW().steps; const from = Number(d.id), to = Number(t.dataset.x); if (from === to) return false; const [m] = s.splice(from, 1); s.splice(to, 0, m); };
A['ag2-new-act'] = () => { S.f.naName = ''; S.f.naGroup = 'Connected systems'; S.f.naLine = ''; openModal('ag2-newact'); };
MODALS['ag2-newact'] = () => modalFrame('New action', `<div class="field"><label for="b-f-naName">Name</label><input class="inp" ${bind('f.naName')} placeholder="e.g. Check stock in Dammam"></div><div class="field"><label for="b-f-naLine">What it does, in one line</label><input class="inp" ${bind('f.naLine')} placeholder="e.g. Looks up a car in the Dammam stock list"></div><div class="field"><label for="b-f-naGroup">Group</label>${bindSel('f.naGroup', GROUPS)}</div><p class="xs mute">The new action starts off. Fill in when it runs and its steps, then test it.</p>`, `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ag2-newact-ok">Create action</button>`, {size:'narrow'});
A['ag2-newact-ok'] = () => { const n = (S.f.naName || '').trim(); if (!n) { toast('Give the action a name.'); return; } const id = cur(); const aid = 'x' + Date.now().toString(36); cfgOf(id).actions.push({id:aid, g:S.f.naGroup || 'Connected systems', icon:'bolt', name:n, line:(S.f.naLine || '').trim() || 'New action', when:'', uses:0, fin:0, says:[], fields:[], steps:[], msg:{ar:'', en:''}, fails:[], ask:true, on:false}); S.modal = null; go('actions-' + aid); };

/* ---------- A4 Test scenarios ---------- */
R('scenarios', {id:'A4', title:'Test scenarios', roles:['vina'], states:[['running','Running'],['allpass','All passed']], render(p) {
  const id = cur(); const c = cfgOf(id); const r = runOf(id); const run = SU.running && SU.running.id === id ? SU.running : null; const a4 = SU.a4;
  if (p && p !== SU._a4p) { if (p.startsWith('a-')) { a4.act = p.slice(2); a4.filter = 'all'; } else if (SU.scen.some(s => s.id === p)) { a4.sel = p; a4.act = ''; } } SU._a4p = p || '';
  const demoRun = S.st === 'running' && !run; const allp = S.st === 'allpass';
  const resOf = s => allp ? 'pass' : demoRun ? (SU.scen.indexOf(s) < 5 ? (r && r.res[s.id]) || 'pass' : 'run') : run && run.list.includes(s.id) && run.list.indexOf(s.id) >= run.i ? 'run' : run ? run.res[s.id] : r ? r.res[s.id] : '';
  const detOf = s => (r && r.det && r.det[s.id] && !run) ? r.det[s.id] : evalScen(s, id);
  const k = {pass:0, fail:0, check:0}; SU.scen.forEach(s => { const x = resOf(s); if (k[x] != null) k[x]++; });
  const scen = SU.scen.filter(s => (!a4.act || s.act === a4.act) && (a4.filter === 'all' || resOf(s) === a4.filter));
  const sel = SU.scen.find(s => s.id === a4.sel) || SU.scen[0]; const sres = resOf(sel); const det = allp ? Object.assign({}, detOf(sel), {checks:detOf(sel).checks.map(x => Object.assign({}, x, {ok:true}))}) : detOf(sel);
  const RI = {pass:['check','green','Passed'], fail:['x','red','Failed'], check:['info','amber','To check'], run:['clock','blue','Running'], '':['minus','grey','Not run']};
  const rs = s => allp ? '' : demoRun ? (SU.scen.indexOf(s) === 5 ? 'now' : SU.scen.indexOf(s) > 5 ? 'wait' : '') : runState(run, s.id);
  const time = r ? r.when.replace(/^Today /, '') : '—';
  const sumTxt = s => { const x = resOf(s); if (x === 'run') return rs(s) === 'now' ? 'Running…' : 'Waiting'; if (!x) return 'Not run'; const d = detOf(s); const n = d.checks.length, bad = d.checks.filter(q => q.ok === false).length; return x === 'check' ? 'New answer to check' : x === 'fail' ? (s.id === 'arabizi' ? 'Replied in English' : bad + ' of ' + n + ' failed') : (s.id === 'job' ? 'Not qualified' : n + ' of ' + n); };
  const actName = aid => (c.actions.find(x => x.id === aid) || {}).name || aid;
  const progress = run ? run.i : demoRun ? 5 : 0; const total = run ? run.list.length : SU.scen.length;
  const nUns = unsaved(id);
  if (!run) delete (SU._bars || {})['a4-' + id];
  const pct = Math.round(progress / total * 100);
  const head = `<div class="card ag2-run"><div class="grow" style="min-width:0"><div class="small b">${run || demoRun ? `Running ${progress} of ${total}…` : r ? `Last run ${esc(r.when.replace(/^Today/, 'today'))} · ${esc(agentName(id))}, ${r.ver === 'draft' ? 'draft' + (nUns ? ' with ' + nUns + ' unsaved change' + (nUns > 1 ? 's' : '') : '') : 'live version ' + SU.ver[id]}` : 'Not run yet for ' + esc(agentName(id))}</div>
      ${run || demoRun ? `<div class="row nowrap tight" style="margin-top:10px"><div class="grow" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${progress}" aria-label="Test progress">${run ? gbar('a4-' + id, pct) : `<span class="su-bar"><i style="width:${pct}%"></i></span>`}</div><span class="xs mute num">${pct}%</span></div>`
        : `<div class="row tight" style="margin-top:6px;align-items:baseline">${mic('Test scenarios', 15)}<b class="num ag2-big" ${countAttr(SU.scen.length)}>${SU.scen.length}</b><span class="small mute">scenarios</span>${chipC(k.pass + ' passed', 'green')}${k.fail ? chipC(k.fail + ' failed', 'red') : ''}${k.check ? chipC(k.check + ' to check', 'amber') : ''}</div>`}
      ${r && !fresh(id) && !run && !allp ? `<div class="xs amber" style="margin-top:6px">${esc(agentName(id))} changed after this run. Run all to test the changes.</div>` : ''}</div>
    ${k.fail && !run && !demoRun ? `<div class="note err ag2-blocked" role="alert">${ic('lock')}<div><b>Saving is blocked until the failed scenarios pass</b></div></div>` : allp ? `<div class="note ok">${ic('check')}<div><b>All passed.</b> You can save the changes.</div></div>` : ''}
    </div>`;
  const filters = [['all', 'All', SU.scen.length], ['fail', 'Failed', k.fail], ['check', 'To check', k.check], ['pass', 'Passed', k.pass]];
  const toolbar = pageToolbar({left:`<div class="fchips" role="group" aria-label="Filter">${filters.map(([f, l, n]) => `<button type="button" class="fchip" data-a="su-set" data-x="su.a4.filter" data-v="${f}" aria-pressed="${a4.filter === f}">${l} <span class="n">${n}</span></button>`).join('')}</div>${a4.act ? `<span class="tokens" style="min-height:34px;padding:2px"><span class="tok">Action: ${esc(actName(a4.act))}<button type="button" data-a="su-set" data-x="su.a4.act" data-v="" aria-label="Show all actions">${ic('x', 12)}</button></span></span>` : ''}`,
    right:`<button type="button" class="btn" data-a="ag2-sc-new">${ic('plus', 14)}New scenario</button><button type="button" class="btn pri" data-a="ag2-sc-run" ${run || demoRun ? 'disabled' : ''}>${run || demoRun ? spin() + 'Running' : ic('play', 14) + 'Run all'}</button>`});
  const rows = scen.map(s => { const x = resOf(s); const ri = RI[x || '']; const st = rs(s); return `<button type="button" class="ag2-srow ${s.id === sel.id ? 'sel' : ''} ${st}" data-a="ag2-sc-sel" data-x="${s.id}" aria-pressed="${s.id === sel.id}">${st === 'now' ? '<span class="su-read ag2-rowbar" aria-hidden="true"><i></i></span>' : ''}<span class="chi c-${st === 'wait' ? 'grey' : ri[1]} ${st ? '' : tickIn(s.id)}" title="${st === 'wait' ? 'Waiting' : ri[2]}">${st === 'now' ? spin() : ic(ri[0], 14)}<span class="sr">${st === 'wait' ? 'Waiting' : ri[2]}</span></span><span class="grow" style="min-width:0"><span class="small b" style="display:block">${esc(s.name)}</span><span class="xs mute ell" style="display:block" ${isAr(s.first) ? 'dir="rtl"' : ''}>${esc(s.first)}</span></span><span class="xs mute ag2-c">${esc(s.lang)}</span><span class="xs ag2-c ${x === 'fail' ? 'red' : x === 'check' ? 'amber' : 'mute'}">${esc(sumTxt(s))}</span><span class="xs mute num ag2-c">${x && x !== 'run' ? esc(time) : ''}</span></button>`; }).join('');
  const ri = RI[sres || ''];
  const convo = det.convo.map(m => m.w === 'c' ? `<div class="msg in"><div class="bub" ${isAr(m.t) ? 'dir="rtl"' : ''}>${esc(m.t)}</div></div>`
    : m.w === 'a' ? `<div class="evt teal">${ic('bolt', 13)}${esc(m.t)}</div>`
    : (() => { const wrong = (m.bad && !allp) || (m.bad2 && sres === 'fail'); return `<div class="msg vina ${wrong ? 'ag2-wrong' : ''}"><div class="bub ${m.chk && sres === 'check' ? 'ag2-chkbub' : ''}" ${isAr((m.t || '') + (m.bad || '')) ? 'dir="rtl"' : ''}>${esc(m.t || '')}${m.bad && !allp ? `<mark class="ag2-bad">${esc(m.bad)}</mark>` : esc(m.bad || '')}${esc(m.t2 || '')}</div><div class="meta">${esc(agentName(id))}${m.bad && !allp ? ` · <span class="ag2-flag">${ic('alert', 12)}Wrong part</span>` : m.bad2 && sres === 'fail' ? ` · <span class="ag2-flag">${ic('alert', 12)}Did not hand over</span>` : m.chk && sres === 'check' ? ' · <b class="amber">New kind of answer</b>' : ''}</div></div>`; })()).join('');
  const panel = `<section class="card col ag2-open" aria-label="Open scenario"><div class="row nowrap su-at"><div class="grow"><div class="row tight">${chipC(ri[2], ri[1], true)}<span class="xs mute">${esc(sel.lang)}${sres && sres !== 'run' ? ' · ' + esc(time) : ''}</span>${sel.act ? chipC('Action: ' + actName(sel.act), 'grey') : ''}</div><h2 style="font-size:18px;font-weight:600;margin-top:8px">${esc(sel.name)}</h2></div><button type="button" class="btn sm" data-a="ag2-sc-edit" data-x="${sel.id}">${ic('edit', 14)}Edit</button></div>
    <div class="col tight"><div class="eyebrow">Checks</div>${det.checks.map(q => `<div class="row nowrap su-at ag2-chk"><span class="chi c-${q.ok === true ? 'green' : q.ok === false ? 'red' : 'amber'}">${ic(q.ok === true ? 'check' : q.ok === false ? 'x' : 'info', 14)}<span class="sr">${q.ok === true ? 'Passed' : q.ok === false ? 'Failed' : 'To check'}</span></span><div class="grow small"><span class="mute">${esc(q.type)}:</span> <b>${esc(q.t)}</b>${q.ok === false && q.got ? `<div class="red xs" style="margin-top:2px">${esc(q.got)}</div>` : q.ok == null && q.got ? `<div class="amber xs" style="margin-top:2px">${esc(q.got)}</div>` : ''}</div></div>`).join('')}</div>
    <div class="col tight"><div class="eyebrow">What happened</div><div class="chat ag2-replay ${SU._a4seq > Date.now() ? 'su-seq' : ''}">${convo}</div></div>
    ${(sres === 'fail' || sres === 'check') && det.why && !allp ? `<div class="note ${sres === 'fail' ? 'err' : 'warn'}">${ic('info')}<div><b>Why</b><div style="margin-top:2px">${det.why}</div></div></div>` : ''}
    ${sres === 'check' && !allp ? `<div class="row tight"><span class="small grow">Is this answer right?</span><button type="button" class="btn" data-a="ag2-sc-mark" data-x="${sel.id}|wrong">${ic('x', 14)}Mark as wrong</button><button type="button" class="btn" data-a="ag2-sc-mark" data-x="${sel.id}|right">${ic('check', 14)}Mark as right</button></div>` : ''}
    <div class="row tight">${(det.fixes || []).map(([l, kind]) => `<button type="button" class="btn" data-a="ag2-fix" data-x="${id}|${kind}">${esc(l)}</button>`).join('')}<span class="sp"></span><button type="button" class="btn" data-a="ag2-sc-one" data-x="${sel.id}" ${run ? 'disabled' : ''}>${ic('refresh', 14)}Run again</button></div></section>`;
  return shell({nav:'scenarios', title:'Test scenarios', cp:true, viewOnly:false, tools:pick('Agent:'), search:false, body:`${pickM()}${toolbar}${head}
    <div class="ag2-a4"><section class="card pad0 col" style="gap:0;min-width:0">
      <div class="ag2-shead xs mute"><span></span><span>Scenario</span><span class="ag2-c">Language</span><span class="ag2-c">Checks</span><span class="ag2-c">Time</span></div>
      <div class="col" style="gap:0">${rows || `<div style="padding:16px">${empty('tests', 'Nothing here', a4.filter === 'fail' ? 'No failed scenarios. Good.' : 'No scenarios match this filter.')}</div>`}</div></section>${panel}</div>`});
}});
A['ag2-sc-sel'] = (el) => { if (SU.a4.sel !== el.dataset.x) SU._a4seq = Date.now() + 300; SU.a4.sel = el.dataset.x; };
A['ag2-sc-run'] = () => { runAll(cur()); return false; };
A['ag2-sc-one'] = (el) => { runAll(cur(), [el.dataset.x]); return false; };
A['ag2-sc-mark'] = (el) => { const [sid, m] = el.dataset.x.split('|'); const s = SU.scen.find(x => x.id === sid); s.mark = m; const id = cur(); const r = runOf(id); if (r) { const e = evalScen(s, id); r.res[sid] = e.res; r.det[sid] = e; } toast(m === 'right' ? 'Marked as right. The agent will answer like this again.' : 'Marked as wrong. Fix the knowledge or rules, then run again.'); };
A['ag2-fix'] = (el) => { const [id, kind] = el.dataset.x.split('|'); const sec = {file:4, rules:3, agent:2, actions:5}[kind] || 4; if (kind === 'actions') { go('actions'); return; } if (SU.live[id]) { SU.a2jump = sec; go('agent-' + id); } else { SU.wiz = id; go('setup-' + sec); } };
A['ag2-sc-new'] = () => { Object.assign(S.f, {nsEdit:'', nsName:'', nsLang:'Arabic · Hijazi', nsMsgs:'', nsDo:'', nsNot:'', nsHand:false}); openModal('ag2-sc'); };
A['ag2-sc-edit'] = (el) => { const s = SU.scen.find(x => x.id === el.dataset.x); Object.assign(S.f, {nsEdit:s.id, nsName:s.name, nsLang:s.lang, nsMsgs:(s.msgs || [s.first]).join('\n'), nsDo:s.mustDo || s.act || '', nsNot:s.mustNot || '', nsHand:!!s.mustHand}); openModal('ag2-sc'); };
MODALS['ag2-sc'] = () => { const c = cfgOf(cur()); const ta = bindTa('f.nsMsgs');
  return modalFrame(S.f.nsEdit ? 'Edit scenario' : 'New scenario', `<div class="field"><label for="b-f-nsName">Name</label><input class="inp" ${bind('f.nsName')} placeholder="e.g. Asks for a Friday test drive"></div>
    <div class="field"><label for="b-f-nsLang">Language or dialect</label>${bindSel('f.nsLang', ['Arabic · Hijazi','Arabic · Najdi','English','Arabizi','Voice note'])}</div>
    <div class="field"><label for="b-f-nsMsgs">What the customer says, one message per line</label><textarea class="inp" dir="auto" ${ta[0]} placeholder="أبغى أجرب السيارة يوم الجمعة">${ta[1]}</textarea></div>
    <div class="field"><span class="lbl">Checks</span><div class="su-g2"><div class="field"><label for="b-f-nsDo" class="xs">Action that must happen</label>${bindSel('f.nsDo', [['', 'None']].concat(c.actions.map(a => [a.id, a.name])))}</div><div class="field"><label for="b-f-nsNot" class="xs">Topic it must not say</label><input class="inp" ${bind('f.nsNot')} placeholder="e.g. Financing rates"></div></div><label class="chk"><input ${bindChk('f.nsHand')}><span>It must hand over to a person</span></label></div>`,
    `<button type="button" class="btn" data-a="close-modal">Cancel</button><button type="button" class="btn pri" data-a="ag2-sc-save">${S.f.nsEdit ? 'Save scenario' : 'Add scenario'}</button>`); };
A['ag2-sc-save'] = () => {
  const name = (S.f.nsName || '').trim(); const msgs = (S.f.nsMsgs || '').split('\n').map(x => x.trim()).filter(Boolean);
  if (!name || !msgs.length) { toast('Write a name and at least one customer message.'); return; }
  if (S.f.nsEdit) { const s = SU.scen.find(x => x.id === S.f.nsEdit); Object.assign(s, {name, lang:S.f.nsLang, first:msgs[0], msgs}); if (s.custom) Object.assign(s, {mustDo:S.f.nsDo, mustNot:(S.f.nsNot || '').trim(), mustHand:!!S.f.nsHand, act:S.f.nsDo}); toast('Scenario saved. Run it again to see the result.'); }
  else { const id = 'c' + Date.now().toString(36); SU.scen.push({id, custom:true, name, lang:S.f.nsLang, first:msgs[0], msgs, mustDo:S.f.nsDo, mustNot:(S.f.nsNot || '').trim(), mustHand:!!S.f.nsHand, act:S.f.nsDo}); SU.a4.sel = id; SU.a4.filter = 'all'; toast('Scenario added. Run it to see the result.'); }
  S.modal = null;
};

/* ---------- Styles ---------- */
document.head.insertAdjacentHTML('beforeend', `<style>
.ag2-pick select.inp{min-height:40px;width:auto;min-width:140px}
.ag2-aname{font-family:var(--f-display);font-size:17px;font-weight:700;letter-spacing:-.01em}
.ag2-n{width:26px;height:26px;flex:0 0 26px;border-radius:8px;background:var(--navy-b);color:var(--navy-f);display:inline-grid;place-items:center;font:700 12px var(--f-display)}
.ag2-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 3px var(--amber-b);vertical-align:middle}
/* A1 */
.ag2-agent{display:flex;flex-wrap:wrap;align-items:center;gap:18px 22px}
.ag2-agent.paused{background:linear-gradient(180deg,var(--amber-b),var(--card) 60%)}
.ag2-stats{display:grid;grid-template-columns:repeat(4,minmax(92px,112px));gap:12px;margin:0}
.ag2-stats dd{margin:2px 0 0;font-family:var(--f-display);font-size:20px;line-height:26px;font-weight:700;letter-spacing:-.01em;white-space:nowrap}
.ag2-mbar{height:4px;margin-top:6px}
.ag2-foot{flex-basis:100%;display:flex;flex-wrap:wrap;gap:8px 20px;padding-top:12px;border-top:1px solid var(--line);font-size:12px;color:var(--mute)}
.ag2-foot span+span::before{content:"·";margin-inline-end:20px;margin-inline-start:-12px;color:var(--faint)}
/* A2 */
.ag2-bar{position:sticky;top:77px;z-index:12;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:14px 18px;box-shadow:var(--e2)}
.ag2-stat{font-size:13px;font-weight:600;color:var(--text)} .ag2-stat .pulse{margin-inline-end:6px;vertical-align:1px}
.ag2-pickm{display:none}
.ag2-block{flex-basis:100%;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 12px;border-radius:var(--r-m);background:var(--red-b);color:var(--red-f);font-size:13px}
.ag2-ed{--stk:180px;display:grid;grid-template-columns:200px minmax(0,1fr) 380px;gap:20px;align-items:start}
.ag2-ed section{scroll-margin-top:var(--stk)}
.ag2-secnav{position:sticky;top:var(--stk);display:flex;flex-direction:column;gap:2px}
.ag2-navh{padding:0 10px 8px}
.ag2-secnav button{display:flex;align-items:center;gap:10px;min-height:42px;padding:0 10px;border:0;border-radius:10px;background:transparent;color:var(--text);font-size:13px;font-weight:500;text-align:start;cursor:pointer;transition:background var(--d1)}
.ag2-secnav button:hover{background:var(--sub)}
.ag2-secnav button.dirty{font-weight:600}
.ag2-sec.dirty{box-shadow:var(--e1),inset 3px 0 0 var(--amber)}
.ag2-sec .card-h h2{flex:0 1 auto}
.ag2-chatcol{position:sticky;top:var(--stk)}
.ag2-chatcol .su-chat{min-height:0;max-height:calc(100vh - var(--stk) - 20px)}
/* A3 */
.ag2-a3{display:grid;grid-template-columns:300px minmax(0,1fr);gap:20px;align-items:start}
.ag2-alist{position:sticky;top:88px;max-height:calc(100vh - 110px);overflow:auto;padding:14px}
.ag2-grp{padding:16px 6px 6px}
.ag2-ai{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;min-height:52px;transition:background var(--d1)}
.ag2-ai a{text-decoration:none;color:var(--text);min-width:0}
.ag2-ai:hover{background:var(--sub)} .ag2-ai.sel{background:var(--sel);box-shadow:inset 3px 0 0 var(--pri)}
.ag2-ai.off a .b{color:var(--mute)}
.ag2-ahead{display:flex;flex-wrap:wrap;align-items:center;gap:14px 16px}
.ag2-fin{height:4px;margin-top:8px;max-width:280px}
.ag2-needs{display:flex;gap:14px;align-items:flex-start;background:var(--amber-b);box-shadow:none;border-color:transparent}
.ag2-needs .h2{color:var(--amber-f)}
.ag2-needs .kv{grid-template-columns:minmax(90px,130px) 1fr}
.ag2-off>section:not(.ag2-ahead):not(.ag2-needs),.ag2-off>.su-g2{opacity:.6;filter:saturate(.25);transition:opacity var(--d2)}
.ag2-off>section:not(.ag2-ahead):not(.ag2-needs):focus-within,.ag2-off>.su-g2:focus-within{opacity:1;filter:none}
.ag2-sticky{position:sticky;top:77px;z-index:5;box-shadow:var(--e2)}
.ag2-flow{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.ag2-step{position:relative;display:grid;grid-template-columns:18px 30px minmax(0,1fr) auto;align-items:start;gap:10px;padding:12px 12px 12px 10px;border-radius:12px;background:var(--sub);transition:background var(--d1),box-shadow var(--d2)}
.ag2-step:hover{background:var(--sub2)}
.ag2-step.editing{background:var(--card);box-shadow:0 0 0 1px var(--horizon),var(--e2)}
.ag2-step:not(:last-child)::after{content:"";position:absolute;z-index:2;left:52px;top:42px;bottom:-22px;width:2px;background:var(--line2)}
.ag2-grip{color:var(--faint);padding-top:6px}
.ag2-node{position:relative;z-index:3;width:30px;height:30px;border-radius:50%;background:var(--pri);color:var(--on-pri);display:grid;place-items:center;font:700 12px var(--f-display);box-shadow:0 0 0 3px var(--sub)}
.ag2-tt{height:22px;gap:5px;padding:0 8px}
.ag2-msgprev{max-width:100%;align-self:stretch;align-items:flex-start}
.ag2-msgprev .bub{width:100%}
.ag2-fail{padding:10px;border-radius:10px;background:var(--sub)}
/* A4 */
.ag2-run{display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.ag2-big{font-family:var(--f-display);font-size:26px;line-height:30px;font-weight:700}
.ag2-a4{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:20px;align-items:start}
.ag2-shead,.ag2-srow{display:grid;grid-template-columns:28px minmax(0,1fr) 110px 140px 64px;gap:12px;align-items:center;padding:0 16px}
.ag2-shead{min-height:36px;background:var(--sub);border-bottom:1px solid var(--line);font-weight:600}
.ag2-srow{position:relative;min-height:60px;border:0;border-bottom:1px solid var(--line);background:transparent;text-align:start;cursor:pointer;color:var(--text);width:100%;transition:background var(--d1)}
.ag2-srow:hover{background:var(--sub)} .ag2-srow.sel{background:var(--sel);box-shadow:inset 3px 0 0 var(--pri)}
.ag2-srow.wait{opacity:.6} .ag2-srow.now{background:var(--blue-b)}
.ag2-rowbar{position:absolute;left:56px;right:16px;bottom:6px;width:auto;margin:0;height:3px}
.ag2-open{position:sticky;top:88px}
.ag2-chk{padding:6px 0}
.ag2-replay{padding:12px;border-radius:12px;background:var(--bg);max-height:340px}
.ag2-bad{background:var(--red-b);color:var(--red-f);border-radius:4px;padding:0 3px;font-weight:600;text-decoration:underline wavy var(--red-f) 1px;text-underline-offset:4px}
.msg.vina.ag2-wrong .bub{box-shadow:0 0 0 2px var(--red-f)}
.ag2-flag{display:inline-flex;align-items:center;gap:4px;font-weight:700;color:var(--red-f)}
.ag2-chkbub{outline:2px dashed var(--amber-f);outline-offset:1px}
@media (max-width:1180px){.ag2-ed{grid-template-columns:minmax(0,1fr)}.ag2-ed>*{min-width:0}.ag2-navh{display:none}.ag2-secnav{position:static;flex-direction:row;overflow-x:auto}.ag2-secnav button{white-space:nowrap}.ag2-chatcol{position:static}.ag2-chatcol .su-chat{max-height:640px}.ag2-a3{grid-template-columns:240px minmax(0,1fr)}.ag2-a4{grid-template-columns:1fr}.ag2-open{position:static}.ag2-stats{grid-template-columns:repeat(2,minmax(90px,1fr))}}
@media (max-width:760px){.ag2-bar{position:static;padding:14px;align-items:flex-start}.ag2-back{display:none}.ag2-btns{flex-basis:100%}.ag2-btns>.btn{flex:1 1 40%}.top .ag2-pick{display:none}.ag2-pickm{display:flex}.ag2-a3{grid-template-columns:1fr}.ag2-alist{position:static;max-height:none}.ag2-sticky{top:68px}.ag2-shead,.ag2-srow{grid-template-columns:28px minmax(0,1fr) 96px}.ag2-c:nth-of-type(n){display:none}.ag2-srow .ag2-c:nth-last-child(2){display:block}.ag2-shead .ag2-c:nth-last-child(2){display:block}.ag2-stats{grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.ag2-foot span+span::before{display:none}.ag2-step{grid-template-columns:30px minmax(0,1fr)}.ag2-grip{display:none}.ag2-step>.row:last-child{grid-column:2}.ag2-step:not(:last-child)::after{left:24px}}
</style>`);
})();
