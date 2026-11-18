// End-to-end flows, run inside the page by check.mjs. Each returns true, or a string saying what went wrong.
const G = `const go2 = async h => { location.hash = h; await tick(150); };
const txt = () => document.getElementById('app').innerText + ' ' + document.getElementById('layers').innerText;
const fire = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); };`;
export default [
  ['V4: no summary sentence above any page, for any role', `${G}
    const bad = [];
    for (const [role, routes] of [['manager', ['overview','channels','conversations','team','ratings','leads']], ['cc', ['inbox','callbacks','leads']], ['sales', ['inbox','leads','calendar']], ['vina', ['overview','channels','connections','users','agents','scenarios','plan','unassigned']]]) {
      signIn(role); await tick(150);
      for (const r of routes) { await go2(r); const v = [...document.querySelectorAll('#app .verdict')].filter(e => !e.closest('.as-hero')); if (v.length) bad.push(role + '/' + r + ': ' + v[0].textContent.slice(0, 50)); if (/customers? (is|are) waiting for the team|of chats alone|channels are live|can log in to/i.test(document.getElementById('app').innerText)) bad.push(role + '/' + r + ': sentence text'); }
    }
    return !bad.length || bad.join('; ');`],
  ['V4: every metric card carries an icon', `${G}
    const miss = [];
    for (const [role, r] of [['manager','overview'], ['manager','channels'], ['manager','team'], ['cc','callbacks'], ['vina','unassigned'], ['vina','agents'], ['vina','plan']]) {
      signIn(role); await tick(150); await go2(r);
      document.querySelectorAll('#app .kpi, #app .mg-stats > div, #app .cp-meter, #app .ag2-stats > div').forEach(k => { if (!k.querySelector('.mic, svg.ic')) miss.push(role + '/' + r + ': ' + k.textContent.trim().slice(0, 30)); });
    }
    return !miss.length || miss.slice(0, 6).join('; ');`],
  ['V3: the tab underline slides to the new choice (saved views on Leads)', `${G}
    signIn('manager'); await tick(150); await go2('leads'); await tick(900);
    const tabs = [...document.querySelectorAll('#app .tabs')].find(t => t.querySelector(':scope > .ind')); if (!tabs) return 'no tabs with an indicator';
    const x0 = tabs.querySelector(':scope > .ind').style.transform;
    const b = [...tabs.querySelectorAll('[aria-selected="false"]')].find(b => /Qualified/.test(b.textContent)) || tabs.querySelector('[aria-selected="false"]'); if (!b) return 'no other tab'; b.click(); await tick(30);
    const t2 = [...document.querySelectorAll('#app .tabs')].find(t => t.querySelector(':scope > .ind'));
    return (t2 && t2.querySelector(':scope > .ind').style.transform !== x0) || 'indicator did not move';`],
  ['GA layout: one date button, no second date switch on Overview', `${G}
    signIn('manager'); await tick(150); await go2('overview');
    const dateBtns = document.querySelectorAll('#app .ptb-date').length; const segs = [...document.querySelectorAll('#app .seg')].filter(s => /days/i.test(s.textContent)).length;
    return (dateBtns === 1 && segs === 0) || 'date buttons ' + dateBtns + ', date switches ' + segs;`],
  ['V3: tooltips show the exact value on chart bars and icon buttons', `${G}
    signIn('manager'); await tick(150); await go2('overview'); await tick(900);
    const bar = document.querySelector('.mg-st i[title], .mg-st i[data-tip]'); if (!bar) return 'no chart bar with a value';
    bar.dispatchEvent(new PointerEvent('pointerover', {bubbles:true})); await tick(400);
    const tip = document.querySelector('.tip.on'); return (!!tip && /:/.test(tip.textContent)) || 'tooltip ' + (tip ? tip.textContent : 'missing');`],
  ['V3: skip link moves focus to the page', `${G}
    signIn('sales'); await tick(150); await go2('leads'); const s = document.querySelector('.skip'); if (!s) return 'no skip link'; s.click(); await tick();
    return document.activeElement && document.activeElement.id === 'main' || 'focus on ' + (document.activeElement && document.activeElement.tagName);`],
  ['L2 → L3 → call centre lands on Callbacks', `${G}
    A.logout(); render(); await go2('login'); S.knownDevice = false;
    S.f.au = Object.assign(S.f.au || {}, {email:'reem@icaur-alghanim.sa', pw:'password12'}); render();
    if (!await clickA('au-login')) return 'no Log in button'; await tick(1100);
    if (location.hash !== '#verify') return 'expected #verify, got ' + location.hash;
    const ins = [...document.querySelectorAll('.otp input, input[inputmode="numeric"]')]; if (ins.length < 6) return 'code boxes: ' + ins.length;
    ins.slice(0, 6).forEach((e, i) => fire(e, String(i + 1))); await tick(100);
    if (location.hash !== '#callbacks') { await clickA('au-verify'); await tick(1100); }
    return location.hash === '#callbacks' && S.role === 'cc' || 'landed on ' + location.hash + ' as ' + S.role;`],
  ['L2 wrong password shows an error', `${G}
    A.logout(); render(); await go2('login'); S.f.au = Object.assign(S.f.au || {}, {email:'reem@icaur-alghanim.sa', pw:'short', tries:0, lockedUntil:null}); render();
    await clickA('au-login'); await tick(1000);
    return /wrong email or password/i.test(txt()) || 'no error text';`],
  ['Manager pages are view only (no reply box, no drag, View only tag)', `${G}
    signIn('manager'); await tick(150); const bad = [];
    for (const r of ['overview','channels','conversations','team','ratings','leads','pipeline','lead-l01','unassigned']) {
      await go2(r);
      if (!document.querySelector('.vo')) bad.push(r + ': no View only tag');
      if (document.querySelector('#app textarea')) bad.push(r + ': textarea');
      if (document.querySelector('#app [draggable="true"]')) bad.push(r + ': draggable');
      const ab = [...document.querySelectorAll('#app button, #app a.btn')].map(b => b.textContent.trim()).filter(t => /^(Send to sales|Close lead|Book test drive|Add note|Save note|Take over|Change status)/.test(t)); if (ab.length) bad.push(r + ': ' + ab.join(','));
    }
    return !bad.length || bad.join('; ');`],
  ['Agents see only their own leads and no CSV', `${G}
    signIn('sales'); await tick(150); await go2('leads');
    const t = document.getElementById('app').innerText;
    if (/Noura Al-Zahrani|Ziyad Al-Harbi/.test(t)) return 'other people\\'s leads visible';
    if (/Download CSV/i.test(t)) return 'CSV visible to agent';
    return /Abdulrahman Saleh/.test(t) || 'own lead missing';`],
  ['Call centre sends a lead to sales from the inbox (AG3)', `${G}
    signIn('cc'); await tick(150); await go2('inbox'); AFTER['send-sales'](); render(); await tick();
    if (!document.querySelector('#layers .modal')) return 'send to sales did not open';
    const id = S.modal._k === 'send-sales' && S.modal.id;
    if (!id) return 'no lead in modal ' + JSON.stringify(S.modal);
    const btn = [...document.querySelectorAll('#layers .mf button')].find(b => /^Send/.test(b.textContent.trim())); if (!btn) return 'no Send button';
    btn.click(); await tick(150); const l = lead(id);
    return (U[l.owner] && U[l.owner].role === 'sales' && l.h[0].t === 'give') || 'owner ' + l.owner + ' history ' + l.h[0].title;`],
  ['Close lead offers every LD6 reason', `${G}
    signIn('sales'); await tick(150); await go2('lead-l05'); openModal('close-lead', {id:'l05', result:'lost'}); render(); await tick();
    const t = document.getElementById('layers').innerText; const miss = LOST_REASONS.filter(r => !t.includes(r));
    return !miss.length || 'missing ' + miss.join(', ');`],
  ['Sales drags a pipeline card to Contacted (LD2)', `${G}
    signIn('sales'); await tick(150); await go2('pipeline');
    const card = document.querySelector('[data-drag][data-x="l06"]'); const col = document.querySelector('[data-drop][data-x="contacted"]');
    if (!card || !col) return 'card ' + !!card + ' column ' + !!col;
    const dt = new DataTransfer(); card.dispatchEvent(new DragEvent('dragstart', {bubbles:true, dataTransfer:dt})); col.dispatchEvent(new DragEvent('dragover', {bubbles:true, cancelable:true, dataTransfer:dt})); col.dispatchEvent(new DragEvent('drop', {bubbles:true, cancelable:true, dataTransfer:dt})); await tick(150);
    return lead('l06').status === 'contacted' || 'status ' + lead('l06').status;`],
  ['VINA team assigns an unassigned lead (AS5) and history says so', `${G}
    signIn('vina'); await tick(150); await go2('unassigned'); const before = unassigned().length; AFTER.assign(); render(); await tick();
    if (!document.querySelector('#layers .modal')) return 'assign did not open';
    const pick = document.querySelector('#layers [data-a="as-pick"]'); if (pick) { pick.click(); await tick(); }
    const ok = document.querySelector('#layers [data-a="as-assign-ok"]'); if (!ok) return 'no Assign button'; ok.click(); await tick(150);
    const l = LEADS.find(l => l.h[0] && l.h[0].by === 'by VINA support');
    return (unassigned().length === before - 1 && !!l) || 'unassigned ' + unassigned().length + '/' + before + ' history ' + (l ? 'ok' : 'missing');`],
  ['C6: WhatsApp down shows the red bar to VINA and a notice to managers', `${G}
    S.whatsappDown = true; signIn('vina'); await tick(150); await go2('overview');
    if (!document.querySelector('.banner')) return 'no red bar';
    signIn('manager'); await tick(150); await go2('channels'); const t = txt(); S.whatsappDown = false;
    if (document.querySelector('.banner')) return 'manager sees the red bar';
    return /The VINA team has been told/.test(t) || 'no manager notice';`],
  ['Agent replies in a chat and it shows in the conversation', `${G}
    signIn('sales'); await tick(150); await go2('inbox'); const ta = document.querySelector('#app textarea'); if (!ta) return 'no reply box';
    fire(ta, 'Checking the trade-in value now.'); await tick();
    const b = document.querySelector('[data-a="ag-send"]'); if (!b) return 'no send'; b.click(); await tick(200);
    return document.getElementById('app').innerText.includes('Checking the trade-in value now.') || 'message not shown';`],
  ['Theme switch from the profile menu', `${G}
    signIn('manager'); await tick(150); setTheme('light'); render(); await clickA('profile-menu'); await clickA('proto-theme', 'dark'); const d = document.documentElement.dataset.theme; setTheme('light'); render();
    return d === 'dark' || 'theme ' + d;`],
  ['Command palette finds a lead by mobile digits and opens it', `${G}
    signIn('manager'); await tick(150); await go2('overview');
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'k', ctrlKey:true, bubbles:true})); await tick();
    const q = document.getElementById('cmd-q'); if (!q) return 'palette did not open'; if (document.activeElement !== q) return 'input not focused';
    fire(q, '4120'); await tick(); const first = document.querySelector('#layers .co .ct'); if (!first || !/Noura/.test(first.textContent)) return 'first result ' + (first && first.textContent);
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true})); await tick(200);
    return location.hash === '#lead-l09' || 'went to ' + location.hash;`],
  ['Agents only find their own people in the palette', `${G}
    signIn('sales'); await tick(150); A.cmd(); render(); await tick(); const q = document.getElementById('cmd-q'); fire(q, 'Noura'); await tick();
    const t = document.getElementById('layers').innerText; S.cmd = null; render();
    return !/Noura Al-Zahrani/.test(t) || 'call centre lead visible to sales';`],
  ['Closing a dialog plays an exit and leaves no scrim behind', `${G}
    signIn('sales'); await tick(150); await go2('lead-l05'); openModal('close-lead', {id:'l05'}); render(); await tick();
    await clickA('close-modal'); const ghost = !!document.querySelector('#layers .ghost'); await tick(300);
    return (ghost && !document.querySelector('#layers .scrim')) || 'ghost ' + ghost + ' scrim left ' + !!document.querySelector('#layers .scrim');`],
  ['Setup: Go live waits for a channel and passing tests (S7)', `${G}
    signIn('vina'); await tick(150); await go2('setup-7');
    const t = document.getElementById('app').innerText; const btn = [...document.querySelectorAll('#app button')].find(b => /Go live/.test(b.textContent));
    if (!btn) return 'no Go live button';
    return (btn.disabled || btn.getAttribute('aria-disabled') === 'true') ? true : (/live/i.test(t) || 'enabled with no reason');`],
  ['V4: Sales has no call option anywhere (web chat and WhatsApp only)', `${G}
    signIn('sales'); await tick(150);
    for (const h of ['inbox', 'leads', 'lead-l01', 'lead-l03', 'lead-l05', 'pipeline', 'calendar', 'testdrives']) { await go2(h); await tick(120);
      if (document.querySelector('[data-a="ag-call"],[data-a="ld-call"]')) return 'call button on ' + h; }
    signIn('cc'); await tick(150); await go2('inbox'); await tick(150);
    return document.querySelector('[data-a="ag-call"]') ? true : 'call centre lost its Call button';`],
  ['V4: Instagram is gone from every screen', `${G}
    if (CH.ig) return 'CH.ig still defined';
    for (const s of SCREENS) { await open1(s[0]); const t = txt(); if (/instagram/i.test(t)) return 'Instagram on ' + s[0]; }
    return true;`],
  ['Chat: same-sender messages group, days split, 3+ events collapse (AG1 and M3 share it); J and ] work', `${G}
    signIn('manager'); await tick(150); S.f.m3sel = 'l10'; await go2('conversations'); await tick();
    const vg = document.querySelector('#m3-chat .cx-g.vina'); if (!vg) return 'no VINA group';
    if (vg.querySelectorAll('.cx-m').length !== 2 || vg.querySelectorAll('.cx-gh').length !== 1 || vg.querySelectorAll('.cx-gav .av.vina').length !== 1) return 'VINA answer + location pin not grouped under one avatar';
    if (!vg.querySelector('.cx-src[data-tip*="Showroom hours"], .cx-src[title*="Showroom hours"]')) return 'no Source chip with the full source';
    if (document.querySelector('#app textarea') || !/View only. The agent handling this lead replies./.test(txt())) return 'M3 not view only';
    signIn('sales'); await tick(150); await go2('inbox'); A['ag-sel']({dataset:{x:'l01'}}); render(); await tick();
    const days = [...document.querySelectorAll('#ag-chat .cx-day')].map(d => d.textContent).join('|'); if (days !== 'Wed 4 Nov|Today') return 'day lines ' + days;
    const more = document.querySelector('#ag-chat .cx-more'); if (!more || !/3 updates/.test(more.textContent)) return 'no "3 updates · Show"';
    if (!document.querySelector('#ag-chat .cx-g.agent .cx-tick')) return 'no delivery tick';
    more.click(); await tick(); if (document.querySelectorAll('#ag-chat .cx-ev').length !== 4) return 'events did not expand';
    const was = S.ag.sel; document.dispatchEvent(new KeyboardEvent('keydown', {key:'j', bubbles:true})); await tick(); if (S.ag.sel === was) return 'J did not move to the next chat';
    const open = !!document.querySelector('#app .cx-dp'); document.dispatchEvent(new KeyboardEvent('keydown', {key:']', bubbles:true})); await tick(); if (!!document.querySelector('#app .cx-dp') === open) return '] did not toggle details';
    document.dispatchEvent(new KeyboardEvent('keydown', {key:']', bubbles:true})); await tick();
    return true;`],
  ['Chat header: one primary action, the rest in the ⋯ menu, nothing shown twice', `${G}
    const twice = () => { const k = [...document.querySelectorAll('#app [data-a]')].map(e => e.dataset.a + ':' + (e.dataset.x || '')).filter(x => /^(ag-(take|handback|call|sendsales|close|booktd|copy)|dp):/.test(x)); return k.find((x, i) => k.indexOf(x) !== i && !/^dp:/.test(x)); };
    signIn('cc'); await tick(150); await go2('inbox'); A['ag-sel']({dataset:{x:'l11'}}); render(); await tick();
    const head = document.querySelector('#app .cx-head');
    if (head.querySelector('[data-a="ag-sendsales"],[data-a="ag-close"]')) return 'lead actions in the header';
    if (!head.querySelector('[data-a="ag-take"]') || !head.querySelector('[data-a="ag-call"]')) return 'Take over or Call missing';
    head.querySelector('[data-x="ag-more"]').click(); await tick();
    const m = document.querySelector('#app .ag-morew .menu'); if (!m) return 'menu did not open';
    for (const w of ['Send to sales', 'Close lead', 'Open lead page', 'Copy mobile']) if (!m.innerText.includes(w)) return 'menu lacks ' + w;
    if (twice()) return 'shown twice: ' + twice();
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true})); await tick(); if (S.menu) return 'Esc did not close the menu';
    head.ownerDocument.querySelector('[data-x="ag-more"]').click(); await tick(); document.querySelector('.ag-morew .menu [data-a="ag-sendsales"]').click(); await tick();
    if (S.menu || !S.modal || S.modal._k !== 'send-sales') return 'Send to sales did not open from the menu'; S.modal = null; render();
    document.querySelector('[data-a="ag-take"]').click(); await tick();
    if (document.querySelector('#app .cx-head [data-a="ag-take"], #app .cx-head [data-a="ag-handback"]')) return 'header still has Take over / Hand back';
    if (document.querySelectorAll('#app .ag-paused [data-a="ag-handback"]').length !== 1) return 'no Hand back in the paused bar';
    if (lead('l11').h[0].title !== 'Took over the chat') return 'take over not in history';
    if (twice()) return 'shown twice after take over: ' + twice();
    signIn('sales'); await tick(150); await go2('inbox'); document.querySelector('[data-x="ag-more"]').click(); await tick();
    const t = document.querySelector('.ag-morew .menu').innerText; S.menu = null; render();
    return (/Book test drive/.test(t) && !/Send to sales|\\bCall\\b/.test(t)) || 'sales menu: ' + t;`],
  ['Composer: N switches to a tinted team-only note, R back to reply', `${G}
    signIn('sales'); await tick(150); await go2('inbox'); A['ag-sel']({dataset:{x:'l06'}}); render(); await tick(); const l = lead('l06');
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'n', bubbles:true})); await tick();
    const c = document.querySelector('#app .ag-comp'); if (!c.classList.contains('note')) return 'N did not switch to Note';
    if (!/Only your team sees notes/.test(c.innerText)) return 'no team-only line';
    const ta = document.querySelector('#app textarea'); if (document.activeElement !== ta) return 'note box not focused';
    fire(ta, 'Trade-in photos are in the lead.'); ta.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true})); await tick(150);
    if (l.m[l.m.length - 1].k !== 'note' || l.h[0].t !== 'note') return 'note not saved or not in history';
    const g = [...document.querySelectorAll('#ag-chat .cx-g.note')].pop(); if (!g || !/Trade-in photos/.test(g.innerText)) return 'note not in the thread';
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'r', bubbles:true})); await tick();
    return !document.querySelector('#app .ag-comp.note') || 'R did not switch back to Reply';`],
  ['Composer: "/" opens saved replies filtered as you type, Enter picks, Shift+Enter is a new line, Ctrl+Enter sends', `${G}
    signIn('sales'); await tick(150); await go2('inbox'); A['ag-sel']({dataset:{x:'l03'}}); render(); await tick();
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'/', bubbles:true})); await tick(50);
    let ta = document.querySelector('#app textarea'); if (S.menu !== 'ag-saved' || ta.value !== '/') return 'slash: menu ' + S.menu + ' text ' + ta.value;
    fire(ta, '/showroom'); await tick();
    const items = [...document.querySelectorAll('#app .ag-comp .menu [data-a="ag-saved"]')]; if (items.length !== 1 || !/Madinah Road showroom/.test(items[0].textContent)) return 'filter gave ' + items.length;
    ta = document.querySelector('#app textarea'); ta.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true})); await tick(50);
    ta = document.querySelector('#app textarea'); if (S.menu || !/^Our Madinah Road showroom is open/.test(ta.value)) return 'pick gave ' + ta.value;
    const n = lead('l03').m.length; ta.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', shiftKey:true, bubbles:true})); await tick(); if (lead('l03').m.length !== n) return 'Shift+Enter sent';
    ta.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', ctrlKey:true, bubbles:true})); await tick(100);
    return (lead('l03').m.some(x => x.k === 'agent' && /Madinah Road showroom/.test(x.text)) && lead('l03').h[0].title === 'Message sent') || 'Ctrl+Enter did not send';`],
  ['Lead routing: one name for menu, page and tabs; AS3 goes back to it', `${G}
    signIn('vina'); await tick(150); await go2('rules');
    const nav = document.querySelector('.nav [aria-current="page"]'); const h = document.querySelector('#app h1');
    const tabs = [...document.querySelectorAll('#app .rx-tbar .tab')].map(t => t.textContent.replace(/\\d+/g, '').trim()).join('|');
    if (!nav || !/Lead routing/.test(nav.textContent) || !h || h.textContent.trim().indexOf('Lead routing') !== 0) return 'menu ' + (nav && nav.textContent.trim()) + ' title ' + (h && h.textContent);
    if (tabs !== 'Qualifying|Rules|Unassigned') return 'tabs ' + tabs;
    await go2('rule-r2'); if (!/Lead routing/.test(txt())) return 'rule editor has no Lead routing breadcrumb';
    return !/Assignment rules|Lead assignment/.test(txt()) || 'old name still shown';`],
  ['Unassigned: row actions are secondary, availability is one line that links to Rules', `${G}
    signIn('vina'); await tick(150); await go2('unassigned');
    if (document.querySelector('#app [data-a="as-assign"].pri')) return 'Assign is still a main button';
    if (/Who is available now/.test(txt())) return 'full availability list repeated';
    const l = document.querySelector('#app .as-avl'); return (!!l && l.getAttribute('href') === '#rules' && /available/.test(l.textContent)) || 'no availability line';`],
  ['Agent editor shows one section at a time; the Sections list switches it', `${G}
    signIn('vina'); await tick(150); S.su.a2sec = 1; await go2('agent-sara');
    if (document.querySelectorAll('#app .ag2-sec').length !== 1) return 'sections shown ' + document.querySelectorAll('#app .ag2-sec').length;
    if (!/changed/.test(document.querySelector('.ag2-navh').textContent)) return 'changed count gone';
    const b = document.getElementById('ag2-nb3'); b.focus(); b.click(); await tick();
    const cur = document.querySelector('.ag2-secnav [aria-current="true"]');
    if (!cur || cur.id !== 'ag2-nb3' || !/Rules/.test(document.querySelector('#ag2-panel h2').textContent)) return 'did not switch to Rules';
    return document.activeElement && document.activeElement.id === 'ag2-nb3' || 'focus lost to ' + (document.activeElement && document.activeElement.tagName);`],
  ['Actions: lower sections start closed with a summary line and open on click', `${G}
    signIn('vina'); await tick(150); S.su.a3open = null; S.su.a3sel = 'testdrive'; await go2('actions');
    const d = [...document.querySelectorAll('#app details.ag2-cs')]; if (d.length !== 3 || d.some(x => x.open)) return 'collapsibles ' + d.length + ' open ' + d.filter(x => x.open).length;
    if (!/3 cases:/.test(d[2].querySelector('summary').textContent)) return 'no summary line';
    d[2].querySelector('summary').click(); await tick();
    const f = document.querySelector('#app details.ag2-cs[open] .ag2-failv'); return (!!f && f.tagName === 'TEXTAREA') || 'did not open, or the answer box does not wrap';`],
  ['Users: the last account admin cannot be demoted or turned off', `${G}
    signIn('vina'); await tick(150); await go2('users');
    const sel = document.getElementById('cp-r-sami'); if (!sel) return 'no role menu for Sami';
    sel.value = 'Manager'; sel.dispatchEvent(new Event('change', {bubbles:true})); await tick();
    if (U.sami.label !== 'Account admin' || document.getElementById('cp-r-sami').value !== 'Account admin') return 'Sami was demoted';
    if (!/only account admin/.test(txt())) return 'no reason given';
    const off = document.querySelector('[data-a="cp-off"][data-x="sami"]'); off.click(); await tick();
    return !/Sami Al-Rashid can no longer log in/.test(txt()) || 'Sami was turned off';`],
  ['Audit 2 (M1, M3, M5): strip is not tabs, calm Unassigned, plain bars, no duplicate Next step, all folders visible', `${G}
    signIn('manager'); await tick(150); await go2('overview'); await tick(300);
    const strip = document.querySelector('#app .mg-strip'); if (!strip) return 'no strip';
    if (strip.querySelector('button, [role="tab"]')) return 'strip items are interactive';
    if ([...strip.children].some(li => !li.querySelector('.mic'))) return 'strip item without an icon';
    if (document.querySelector('#app .mg-wl .meta .red')) return 'red text in the waiting list meta';
    const ab = r => document.querySelector('#app [aria-label="' + r + '"]').getBoundingClientRect();
    if (Math.abs(ab('Car model interest').left - ab('Arabic vs English').left) > 1) return 'Car model and language cards are not stacked';
    await go2('ratings'); await tick(200);
    if (document.querySelector('#app .mg-lol')) return 'slider-like dots still on M5';
    if (document.querySelectorAll('#app [aria-label="By channel"] .bar-h').length !== 3) return 'By channel is not three bars';
    S.f.m3sel = null; await go2('conversations'); await tick(200);
    const dp = document.querySelector('#app .cx-dp'); if (dp && [...dp.querySelectorAll('h3')].some(h => /next step/i.test(h.textContent))) return 'Next step heading over a Next step row';
    const tl = document.querySelector('#app .mg-tabs'), tb = tl.getBoundingClientRect();
    const cut = [...tl.querySelectorAll('.tab')].filter(t => t.getBoundingClientRect().right > tb.right + 1); return !cut.length || 'folder cut off: ' + cut[0].textContent;`],
  ['Audit 2 (LD1 to LD5): one-line rows, no Unassigned twice, stage index, readable overlaps, name once, no style guide, distinct status colours', `${G}
    signIn('manager'); await tick(150); S.f.ld = null; await go2('leads'); await tick(200);
    const trs = [...document.querySelectorAll('#app .ld-tbl tbody tr')]; if (trs.length !== 10) return 'rows ' + trs.length;
    const tall = trs.filter(r => r.getBoundingClientRect().height > 60); if (tall.length) return 'row taller than 60px: ' + Math.round(tall[0].getBoundingClientRect().height);
    if (trs.some(r => /Unassigned/.test(r.innerText) && /Needs an agent/.test(r.innerText))) return 'Unassigned and Needs an agent on one row';
    const xs = new Set(trs.map(r => Math.round(r.querySelector('.ld-c-name .nm').getBoundingClientRect().left))); if (xs.size !== 1) return 'customer names not aligned';
    await go2('pipeline'); await tick(200);
    const stg = document.querySelectorAll('#app .ld-stg [data-a="ld-jump"]'); if (stg.length !== 8) return 'stage index has ' + stg.length;
    const b = document.getElementById('ld-board'); stg[7].click(); await tick(100);
    const lost = b.querySelector('[data-k="lost"]').getBoundingClientRect(), bb = b.getBoundingClientRect(); if (lost.left < bb.left - 1 || lost.left > bb.right - 100) return 'Lost stage not brought into view';
    signIn('sales'); await tick(150); S.f.ld = null; await go2('calendar'); await tick(200);
    const evs = [...document.querySelectorAll('#app .ld-ev')]; if (!evs.length) return 'no events';
    for (const e of evs) { const r = e.getBoundingClientRect(); if (r.width < 100) return 'event squeezed to ' + Math.round(r.width) + 'px'; const l1 = e.querySelector('.l1'); if (l1.getBoundingClientRect().bottom > r.bottom + 1) return 'event text clipped: ' + e.textContent; if (!e.title) return 'event without full details on hover'; }
    await go2('lead-l05'); await tick(100);
    const hero = document.querySelector('#app .ld-hero'); if (!hero || hero.innerText.includes(lead('l05').name)) return 'customer name repeated in the header card';
    signIn('manager'); await tick(150); await go2('statuses'); await tick(100);
    const heads = [...document.querySelectorAll('#app .rc-h h2')].map(h => h.textContent).join('|'); if (heads !== 'Statuses|Lost reasons') return 'LD5 panels ' + heads;
    if (new Set(ST_ORDER.map(k => STATUS[k].c)).size !== 8) return 'two statuses share a colour';
    if (/blue/i.test(STATUS.offer.colour)) return 'Offer sent is still a blue';
    return true;`],
];
