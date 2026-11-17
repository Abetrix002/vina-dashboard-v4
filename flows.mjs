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
  ['V3: date pill slides to the new choice and the numbers roll', `${G}
    signIn('manager'); await tick(150); await go2('overview'); await tick(900);
    const seg = document.querySelector('#app .seg'); if (!seg) return 'no seg'; const ind = seg.querySelector(':scope > .ind'); if (!ind) return 'no indicator';
    const x0 = ind.style.transform; const v0 = document.querySelector('[data-k="Answered by VINA alone"]')?.textContent;
    const b = [...seg.querySelectorAll('button')].find(b => /30 days/.test(b.textContent)); if (!b) return 'no 30 days'; b.click(); await tick(30);
    const ind2 = document.querySelector('#app .seg > .ind'); const moving = ind2 && ind2.style.transform !== x0;
    const kp = document.querySelector('[data-count][data-k]'); const mid = kp && kp.textContent; await tick(700); const end = kp && document.querySelector('[data-count][data-k]').textContent;
    return (moving || 'indicator did not move') === true ? true : 'indicator did not move';`],
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
];
