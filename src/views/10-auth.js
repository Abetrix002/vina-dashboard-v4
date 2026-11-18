/* L1–L8 · Website log in button, dashboard log in, verify, forgot password, invite, choose a client, session expired, sign up */
(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
  /* Shared layout utilities for every screen outside the Manager reports (GA-style pass). They belong in core.css;
     they live here because 10-auth loads first. rx-g3: at most 3 cards a row (2 at tablet, 1 on phones).
     rx-tbl: a report card whose body is a table or list edge to edge. rx-more: "More options" disclosure. */
  .rx-g3{display:grid;gap:20px;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}
  .rx-g2{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}
  .rx-g3>*,.rx-g2>*{min-width:0}
  @media (max-width:1100px){.rx-g3{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:700px){.rx-g3,.rx-g2{grid-template-columns:minmax(0,1fr)}}
  .rc.rx-tbl>.rc-b{padding:0}
  .rc.rx-tbl .tbl-wrap{border:0;border-radius:0;box-shadow:none;background:transparent}
  .rc.rx-tbl>.rc-b>.list>.li{padding-left:20px;padding-right:20px}
  .rc .rc-h .tabs{border-bottom:0}
  .rc-tabs{padding:4px 12px 0;border-bottom:1px solid var(--line)}
  .rc-tabs .tabs{border-bottom:0}
  .rx-more{border-top:1px solid var(--line);padding-top:12px}
  .rx-more>summary{display:inline-flex;align-items:center;gap:6px;min-height:32px;cursor:pointer;font-size:13px;font-weight:600;color:var(--link);list-style:none}
  .rx-more>summary::-webkit-details-marker{display:none}
  .rx-more>summary .ic{transition:transform var(--d2) var(--ease)}
  .rx-more[open]>summary .ic{transform:rotate(180deg)}
  .rx-more>summary .m{color:var(--mute);font-weight:500}
  .rx-more>.in{display:flex;flex-direction:column;gap:16px;margin-top:12px}
  .rx-sec{display:flex;flex-direction:column;gap:16px;padding-top:20px;border-top:1px solid var(--line)}
  .rx-sec:first-child{padding-top:0;border-top:0}
  .rx-sec>h3{font-size:14px;font-weight:600;line-height:20px}
  .rx-tbar{display:flex;flex-wrap:wrap;align-items:flex-end;gap:8px 12px;border-bottom:1px solid var(--line)}
  .rx-tbar>.tabs{border-bottom:0;flex:0 1 auto;min-width:0}
  .rx-tbar>.sp{flex:1}
  .rx-tbar>.act{display:flex;gap:8px;align-items:center;padding-bottom:6px}
  @media (max-width:760px){.rx-tbar>.act.hide-sm{display:none}}
  /* Brand side: navy with teal glow (core .auth .side) + one quiet product moment */
  .auth .side{justify-content:space-between}
  .au-hero{display:flex;flex-direction:column;gap:14px;max-width:460px}
  .au-hero h2{font-size:36px;line-height:42px;font-weight:700;letter-spacing:-.02em;color:#FFFFFF}
  .au-hero p{font-size:14px;line-height:24px;color:rgba(255,255,255,.7);max-width:42ch}
  .au-proof{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;color:rgba(255,255,255,.68);margin-top:4px}
  .au-proof span{display:inline-flex;align-items:center;gap:8px}
  .au-proof i{width:5px;height:5px;border-radius:50%;background:var(--aqua)}
  .au-live{width:min(440px,100%);border-radius:20px;padding:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 60px -24px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;flex-direction:column;gap:10px;color:#FFFFFF}
  .au-live .hd{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.1)}
  .au-live .hd .av{background:rgba(242,169,59,.22);color:#F7C77A}
  .au-live .wa{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:6px;background:rgba(18,183,106,.22);color:#6FE0A6}
  .au-live .nm{font-size:14px;font-weight:600;line-height:20px}
  .au-live .sb{font-size:12px;color:rgba(255,255,255,.58);display:flex;align-items:center;gap:6px}
  .au-st{display:grid;margin-inline-start:auto}
  .au-st>span{grid-area:1/1;justify-self:end;display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:7px;font-size:12px;font-weight:600;white-space:nowrap}
  .au-st i{width:6px;height:6px;border-radius:50%;background:currentColor}
  .au-st .s1{background:rgba(94,151,206,.22);color:#B5D3F2}
  .au-st .s2{background:rgba(110,190,185,.24);color:#A6E8E2}
  .au-b{max-width:86%;padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.6}
  .au-b.in{align-self:flex-start;background:rgba(255,255,255,.1);border-bottom-left-radius:4px}
  .au-slot{display:grid;justify-items:end}
  .au-slot>*{grid-area:1/1}
  .au-b.vn{background:linear-gradient(135deg,rgba(94,151,206,.34),rgba(110,190,185,.34));border-bottom-right-radius:4px}
  .au-typ{align-self:start;display:inline-flex;gap:4px;padding:12px 14px;border-radius:14px;border-bottom-right-radius:4px;background:rgba(110,190,185,.2)}
  .au-typ i{width:6px;height:6px;border-radius:50%;background:#A6E8E2;animation:ty 1s infinite}
  .au-typ i:nth-child(2){animation-delay:.15s}.au-typ i:nth-child(3){animation-delay:.3s}
  .au-meta{font-size:12px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:6px;margin-top:4px;justify-content:flex-end}
  .au-evt{align-self:center;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:500;background:rgba(110,190,185,.16);color:#A6E8E2}
  /* Plays once per page load: each re-render resumes the timeline at --el (time since first shown) instead of restarting it */
  .au-live .a1{animation:rise 420ms var(--ease) both;animation-delay:calc(300ms - var(--el,0ms))}
  .au-live .a2{animation:au-blink 1300ms var(--ease) both;animation-delay:calc(900ms - var(--el,0ms))}
  .au-live .a3{animation:msgIn 420ms var(--spring) both;animation-delay:calc(2200ms - var(--el,0ms))}
  .au-live .a4{animation:rise 420ms var(--ease) both;animation-delay:calc(3100ms - var(--el,0ms))}
  .au-live .s1{animation:au-out 240ms var(--ease) both;animation-delay:calc(3300ms - var(--el,0ms))}
  .au-live .s2{animation:au-pop 460ms var(--spring) both;animation-delay:calc(3380ms - var(--el,0ms))}
  @keyframes au-blink{0%{opacity:0;transform:translateY(6px)}15%,85%{opacity:1;transform:none}100%{opacity:0}}
  @keyframes au-out{to{opacity:0;transform:scale(.85)}}
  @keyframes au-pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}

  /* Form side. Core rises .auth .box on every render; only rise on route entry */
  .auth:not(.enter) .box{animation:none}
  .auth .side>.logo{align-self:flex-start}
  @media (min-width:761px){.au-top>.grow>.logo{display:none}}
  .au-top{display:flex;align-items:center;gap:10px;min-height:40px}
  .au-h{display:flex;flex-direction:column;gap:8px}
  .au-h p{color:var(--mute);font-size:14px;line-height:23px}
  .au-h p b{color:var(--text)}
  .au-art{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center}
  .auth.enter .au-art{animation:au-pop 520ms var(--spring) 120ms both}
  .au-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .au-foot{font-size:12px;color:var(--faint);display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:20px}
  .au-foot a{color:var(--mute)}
  .au-rule{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mute);transition:color var(--d2)}
  .au-rule .ic{border-radius:50%;padding:2px;background:var(--sub);width:18px;height:18px}
  .au-rule.ok{color:var(--green-f)}
  .au-rule.ok .ic{background:var(--green-b)}
  .au-rule.pop .ic{animation:au-pop 360ms var(--spring)}
  .au-rules{list-style:none;margin:0;padding:12px 14px;border-radius:12px;background:var(--sub);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:8px 14px}
  .au-demo{border-radius:14px;background:var(--sub);padding:14px 16px 10px;display:flex;flex-direction:column;gap:2px;font-size:12px;color:var(--mute)}
  .au-demo .acc{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:10px;min-height:40px;padding:4px 8px;margin:0 -8px;border-radius:10px;cursor:pointer;color:var(--text);font-size:13px;font-weight:500;transition:background var(--d1)}
  .au-demo .acc:hover{background:var(--card)}
  .au-demo .acc:focus-visible{outline:2px solid var(--horizon)}
  .au-demo .acc .r{margin-inline-start:auto;color:var(--mute);font-size:12px;font-weight:400;white-space:nowrap}
  .au-demo .acc .ell{min-width:0}
  .au-team{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;background:var(--card);box-shadow:var(--e1);border:1px solid var(--card-bd)}
  .au-lg{width:44px;height:44px;flex:0 0 44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;font-family:var(--f-display)}
  .au-lg.white{background:#FFFFFF;color:#202253;box-shadow:inset 0 0 0 1px var(--line)}
  @media (max-width:600px){.hide-xs{display:none}}

  /* L3 code boxes */
  .au-otp{gap:8px}
  .auth>.form{min-width:0}
  .au-otp input{padding:0;transition:border-color var(--d1),box-shadow var(--d2) var(--ease),background var(--d1)}
  .au-otp input.has{border-color:var(--pri);background:var(--sel)}
  .au-otp input.pop{animation:au-pop2 280ms var(--spring)}
  .au-otp.shake{animation:shake .36s var(--ease) 1}
  @keyframes au-pop2{45%{transform:scale(1.12)}}
  .au-count{display:inline-flex;align-items:center;gap:6px;color:var(--mute);font-size:13px;min-height:32px}

  /* L6 Choose a client */
  .au-wrap{width:min(920px,100%);margin:0 auto;padding:36px max(16px,env(safe-area-inset-right,0px)) 96px max(16px,env(safe-area-inset-left,0px));display:flex;flex-direction:column;gap:20px}
  .au-search{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border-radius:12px;border:1px solid var(--line2);background:var(--inp);color:var(--mute);transition:border-color var(--d1),box-shadow var(--d2) var(--ease)}
  .au-search:focus-within{border-color:var(--horizon);box-shadow:0 0 0 4px var(--ring)}
  .au-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--text);font-size:14px;height:42px}
  .au-clients{list-style:none;margin:0;padding:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr))}
  .card.au-client{width:100%;height:100%;text-align:start;cursor:pointer;color:var(--text);display:flex;flex-direction:column;gap:16px;padding:20px}
  .au-client:focus-visible{outline:2px solid var(--horizon);outline-offset:2px}
  .au-client .hd{display:flex;align-items:center;gap:14px;min-width:0}
  .au-client .nm{font-family:var(--f-display);font-size:16px;font-weight:700;display:block}
  .au-client .go{color:var(--faint);transition:transform var(--d2) var(--ease),color var(--d1)}
  .au-client:hover .go{transform:translateX(3px);color:var(--text)}
  .au-stats{display:flex;gap:18px;font-size:12px;color:var(--mute)}
  .au-stats b{display:block;font-family:var(--f-display);font-size:16px;line-height:24px;color:var(--text);font-variant-numeric:tabular-nums}
  .au-chs{display:flex;flex-wrap:wrap;gap:6px 14px;padding-top:14px;border-top:1px solid var(--line);font-size:12px;font-weight:500}
  .au-chs span{display:inline-flex;align-items:center;gap:7px}
  .au-dot{width:8px;height:8px;border-radius:50%;flex:0 0 8px}
  .au-chs .warn{color:var(--red-f)} .au-chs .wait{color:var(--amber-f)} .au-chs .paused{color:var(--mute)}

  /* L1 website header mock */
  .au-l1{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;padding:28px max(16px,env(safe-area-inset-right,0px)) 96px max(16px,env(safe-area-inset-left,0px));width:min(1400px,100%);margin:0 auto;align-items:start}
  .au-site{border-radius:16px;overflow:hidden;background:var(--card);box-shadow:var(--e2);border:1px solid var(--card-bd)}
  .au-site header{display:flex;align-items:center;flex-wrap:wrap;gap:12px 24px;min-height:72px;padding:12px 24px;border-bottom:1px solid var(--line)}
  .au-site header .logo{height:24px}
  .au-site nav{display:flex;gap:22px;font-size:14px;font-weight:500;color:var(--mute)}
  .au-site .lang{font-size:13px;font-weight:600;color:var(--mute)}
  .au-login{box-shadow:0 0 0 3px var(--card),0 0 0 5px var(--horizon)}
  .au-hero-w{display:flex;flex-wrap:wrap;align-items:center;gap:32px;padding:44px;background:radial-gradient(600px 300px at 90% 10%,var(--teal-b),transparent 70%),var(--sub)}
  .au-hero-w h3{font-size:36px;line-height:46px;font-weight:700;letter-spacing:-.02em}
  .au-hero-w p{font-size:16px;line-height:26px;color:var(--mute);margin-top:12px;max-width:520px}
  .au-bubbles{position:relative;width:240px;height:170px;flex:0 0 240px;border-radius:26px;background:linear-gradient(135deg,#5E97CE,#6EBEB9)}
  .au-bubbles span{position:absolute;padding:11px 15px;font-size:14px;border-radius:16px;box-shadow:0 8px 20px -8px rgba(0,0,0,.3)}
  .au-cap{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mute);padding:10px 24px;background:var(--card)}
  .au-phone{height:560px;border-radius:38px;border:8px solid #161A3D;background:var(--card);overflow:hidden;display:flex;flex-direction:column;width:300px;max-width:100%;box-shadow:var(--e3)}
  .au-phone .bar{display:flex;align-items:center;min-height:60px;padding:0 18px;border-bottom:1px solid var(--line)}
  .au-phone .bar .logo{height:22px}
  .au-phone .it{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);font-size:16px;font-weight:500}
  @media (max-width:1000px){.au-l1{grid-template-columns:1fr}.au-site nav{display:none}}
  @media (max-width:600px){.au-l1{padding-top:16px}.au-site header{padding:12px 16px;gap:10px}.au-site .lang{display:none}.au-hero-w{padding:24px 18px}.au-hero-w h3{font-size:28px;line-height:34px}.au-bubbles{display:none}.au-cap{padding:10px 16px}}
  @media (max-width:760px){.au-hero h2{font-size:28px;line-height:36px}}
  </style>`);

  const PH = '+966 5• ••• ••12';
  let liveT0 = 0; // when the brand side's chat first played (once per page load)
  const brand = () => {
    if (!liveT0) liveT0 = Date.now();
    const el = Math.min(Date.now() - liveT0, 6000);
    return `<aside class="side" aria-label="About VINA">
    ${LOGO('on-nav')}
    <div class="au-hero"><h2>Every chat answered. Every ready buyer sent to your team.</h2><p>VINA replies on WhatsApp, your website and the phone, in Arabic and English, and tells your team who is ready to buy.</p>
      <div class="au-proof"><span><i></i>Answers 24/7</span><span><i></i>Replies in 6 seconds</span><span><i></i>Arabic and English</span></div></div>
    <div class="au-live" style="--el:${el}ms" role="img" aria-label="Example: a customer asks on WhatsApp in Arabic, VINA answers in seconds and marks the lead Qualified.">
      <div class="hd"><span class="av sm">NZ</span><div class="grow" style="min-width:0"><div class="nm">Noura Al-Zahrani</div><div class="sb"><span class="wa">${ic('wa', 11)}</span>WhatsApp · V27 2027</div></div>
        <span class="au-st"><span class="s1"><i></i>New</span><span class="s2"><i></i>Qualified</span></span></div>
      <div class="au-b in ar a1" dir="rtl">السلام عليكم، عندكم عرض على V27 موديل 2027؟</div>
      <div class="au-slot"><span class="au-typ a2"><i></i><i></i><i></i></span><div class="a3" style="max-width:86%"><div class="au-b vn ar" dir="rtl" style="max-width:none">وعليكم السلام! إيه، عرض اليوم الوطني ساري. متى يناسبك نتصل عليك؟</div><div class="au-meta">${ic('spark', 11)}VINA · answered in 6 sec</div></div></div>
      <span class="au-evt a4">${ic('spark', 12)}VINA marked the lead Qualified · sent to Reem</span>
    </div>
  </aside>`;
  };
  const langSw = () => `<div class="seg" role="group" aria-label="Language"><button type="button" aria-pressed="true">English</button><button type="button" data-a="lang" aria-pressed="false" lang="ar">العربية</button></div>`;
  const foot = () => `<div class="au-foot">© 2026 VINA · <a href="#login" data-a="au-link">Privacy</a> · <a href="#login" data-a="au-link">Terms</a> · <a href="#login" data-a="au-link">Help</a></div>`;
  const page = (inner, o) => `<div class="auth">${brand()}<div class="form"><div class="box">
    <div class="au-top"><span class="grow">${o && o.back ? `<a class="crumb small mute" href="#${o.back}" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;min-height:32px">${ic('chevL', 14)}Back to log in</a>` : LOGO()}</span>${langSw()}<button type="button" class="ibtn" data-a="theme" aria-label="Light or dark">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}</button></div>
    ${inner}${foot()}</div></div></div>`;
  const head = (title, sub) => `<div class="au-h"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>`;
  const art = (icon, tone) => `<span class="au-art c-${tone || 'blue'}">${ic(icon, 26)}</span>`;
  A['au-link'] = () => { toast('Privacy, terms and help open on the VINA website.'); };
  const errLine = (id, msg) => `<div class="err" id="${id}-e" role="alert">${ic('alert', 14)}<span>${msg}</span></div>`;
  const fld = (id, label, inner, err, hint) => `<div class="field"><label for="${id}">${label}</label>${inner}${err ? errLine(id, err) : hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
  const pwInput = (path, showPath, label, err, auto, extra) => { const id = 'b-' + path.replace(/\./g, '-'); const on = !!getP(showPath); return fld(id, label, `<div class="inp-g"><input class="inp ${err ? 'bad' : ''}" type="${on ? 'text' : 'password'}" autocomplete="${auto || 'current-password'}" ${bind(path, extra && extra.live)} ${err ? `aria-invalid="true" aria-describedby="${id}-e"` : extra && extra.desc ? `aria-describedby="${extra.desc}"` : ''} ${extra && extra.dis ? 'disabled' : ''}><button type="button" class="ibtn" data-a="au-show" data-x="${showPath}" aria-label="${on ? 'Hide' : 'Show'} password" aria-pressed="${on}" ${extra && extra.dis ? 'disabled' : ''}>${ic(on ? 'eyeOff' : 'eye', 18)}</button></div>`, err); };
  A['au-show'] = (el) => { setP(el.dataset.x, !getP(el.dataset.x)); };
  const spinBtn = (busy, label, busyLabel) => `<button type="submit" class="btn pri lg wide" ${busy ? 'aria-busy="true" aria-disabled="true"' : ''}>${busy ? `<span class="spin" aria-hidden="true"></span>${busyLabel}` : label}</button>`;

  /* where a person lands after log in */
  function finish(uid) {
    const k = uid || S.pending || 'khalid';
    const role = U[k].role;
    S.pending = null; S.knownDevice = true; S.f.au = {}; S.f.au3 = null;
    const back = S.back; S.back = null;
    signIn(role, {stay: true}); S.me = k;
    go(back || HOME[role]);
  }

  /* ---------- L1 Website · Log in button ---------- */
  R('website', {id:'L1', title:'Website', public:true, render() {
    const nav = ['Home','Product','Solutions','Pricing','About','Contact'];
    const navAr = ['الرئيسية','المنتج','الحلول','الأسعار','من نحن','تواصل معنا'];
    return `<div class="full"><div class="full-top"><b>L1 · VINA website header</b><span class="mute small grow">Log in sits next to Book a demo and opens the dashboard log in in the same tab.</span><a class="btn" href="#screens">All screens</a></div>
    <div class="au-l1">
      <div class="col" style="gap:14px;min-width:0">
        <div class="eyebrow">Desktop · English</div>
        <div class="au-site"><header>${LOGO()}<nav aria-label="Website">${nav.map(n => `<span>${n}</span>`).join('')}</nav><span class="sp"></span><span class="lang ar" lang="ar">العربية</span><a class="btn au-login" href="#login">Log in</a><a class="btn pri" href="#website" data-a="au-demo-cta">Book a demo</a></header>
          <div class="au-hero-w"><div class="grow" style="min-width:min(100%,260px)"><h3>Never leave a customer on read.</h3><p>VINA answers on WhatsApp, your website and the phone, in Arabic and English, and hands ready buyers to your team.</p></div>
            <div class="au-bubbles" aria-hidden="true"><span class="ar" dir="rtl" style="left:20px;top:28px;background:#FFFFFF;color:#1C1E43;border-bottom-left-radius:4px">هلا! كيف أقدر أساعدك؟</span><span style="right:18px;bottom:28px;background:#202253;color:#FFFFFF;border-bottom-right-radius:4px">Price of the V27?</span></div></div>
          <div class="au-cap">${ic('info', 14)}<span>Log in opens <b>app.vina.sa/login</b> (L2) in the same tab.</span></div></div>
        <div class="eyebrow" style="margin-top:14px">Desktop · Arabic</div>
        <div class="au-site" dir="rtl"><header class="ar">${LOGO()}<nav aria-label="Website, Arabic">${navAr.map(n => `<span>${n}</span>`).join('')}</nav><span class="sp"></span><span class="lang" style="font-family:var(--f)">English</span><a class="btn au-login ar" href="#login">تسجيل الدخول</a><a class="btn pri ar" href="#website" data-a="au-demo-cta">احجز عرضًا</a></header></div>
      </div>
      <div class="col" style="gap:14px;align-items:flex-start"><div class="eyebrow">Phone · menu open</div>
        <div class="au-phone"><div class="bar">${LOGO()}<span class="sp"></span>${ic('x', 22)}</div>
          <div class="col" style="padding:6px 18px;gap:0">${nav.slice(0, 5).map(n => `<span class="it">${n}${ic('chevR', 16, 'faint')}</span>`).join('')}<span class="it ar" lang="ar" dir="rtl">العربية</span></div>
          <span class="sp"></span><div class="col tight" style="padding:18px"><a class="btn lg wide au-login" href="#login">Log in</a><a class="btn pri lg wide" href="#website" data-a="au-demo-cta">Book a demo</a></div></div>
      </div></div></div>`;
  }});
  A['au-demo-cta'] = () => { toast('Book a demo is part of the website, not the dashboard.'); };

  /* ---------- L2 Dashboard log in ---------- */
  R('login', {id:'L2', title:'Log in', public:true, states:[['wrong','Wrong email or password'],['locked','Account locked'],['offline','No internet'],['loading','Loading']], render() {
    const s = S.f.au || (S.f.au = {email:'', pw:'', remember:true, tries:0});
    if (S.lastEmail && !s.email) s.email = S.lastEmail;
    const lockedUntil = S.st === 'locked' ? new Date(now().getTime() + 15 * 60000) : s.lockedUntil;
    const err = S.st === 'wrong' ? 'wrong' : S.st === 'offline' ? 'offline' : lockedUntil ? 'locked' : s.err;
    const busy = S.st === 'loading' || s.busy;
    const left = 5 - (s.tries || 0);
    const top = err === 'locked' ? `<div class="note err" role="alert">${ic('lock')}<div><b>Your account is locked for now.</b><div style="margin-top:2px">There were 5 wrong tries. You can try again at <b>${clock(lockedUntil)}</b>, or reset your password now.</div></div></div>`
      : err === 'offline' ? `<div class="note warn" role="alert">${ic('wifiOff')}<div><b>No internet connection.</b><div style="margin-top:2px">Check your Wi-Fi or mobile data, then press Log in again. What you typed is kept.</div></div></div>` : '';
    const wrongMsg = `Wrong email or password. Check both and try again, or <a href="#forgot">reset your password</a>.${s.tries >= 3 && left > 0 ? ` ${left} ${left === 1 ? 'try' : 'tries'} left before a 15-minute lock.` : ''}`;
    const emailErr = err === 'email' ? 'Enter your work email, for example name@company.sa.' : '';
    return page(`${head('Welcome back', 'Log in to see your conversations and leads.')}
      ${top}
      <form class="col" data-a="au-login" novalidate>
        ${fld('b-f-au-email', 'Work email', `<input class="inp ${err === 'wrong' || emailErr ? 'bad' : ''}" type="email" autocomplete="username" inputmode="email" placeholder="name@company.sa" ${bind('f.au.email')} ${emailErr ? 'aria-invalid="true" aria-describedby="b-f-au-email-e"' : ''} ${lockedUntil ? 'disabled' : ''} ${busy ? 'readonly' : ''}>`, emailErr)}
        ${pwInput('f.au.pw', 'f.au.show', 'Password', err === 'wrong' ? wrongMsg : '', 'current-password', {dis: !!lockedUntil})}
        <div class="au-row"><label class="chk grow" style="font-size:13px"><input ${bindChk('f.au.remember')}>Remember me on this computer</label><a href="#forgot" class="small b">Forgot password?</a></div>
        ${lockedUntil ? `<a class="btn pri lg wide" href="#forgot">${ic('lock', 16)}Reset my password</a>` : spinBtn(busy, err === 'offline' ? `${ic('refresh', 16)}Try again` : 'Log in', 'Logging in…')}
      </form>
      <p class="small mute" style="text-align:center">No account? Your manager or VINA support can add you.</p>
      <div class="au-demo"><b style="color:var(--text);font-size:13px">Prototype accounts</b><span style="margin-bottom:6px">Pick one to fill the form. Any password of 8 or more characters works.</span>
        ${['khalid','reem','majed','lina'].map(k => `<button type="button" class="acc" data-a="au-fill" data-x="${k}">${av(U[k].name, 'sm')}<span class="ell">${U[k].email}</span><span class="r">${ROLE_LABEL[U[k].role]}</span></button>`).join('')}</div>`);
  }});
  A['au-fill'] = (el) => { S.f.au = Object.assign(S.f.au || {}, {email: U[el.dataset.x].email, pw:'vina-2026', err:null}); };
  A['au-login'] = () => {
    const s = S.f.au; if (s.busy) return false;
    if (S.st === 'offline' || !navigator.onLine) { s.err = 'offline'; return; }
    if (!String(s.email || '').trim()) { s.err = 'email'; return; }
    s.busy = true; s.err = null; render();
    setTimeout(() => {
      s.busy = false;
      const k = Object.keys(U).find(x => U[x].email === String(s.email || '').trim().toLowerCase());
      if (!k || String(s.pw || '').length < 8) {
        s.tries = (s.tries || 0) + 1; s.err = 'wrong';
        if (s.tries >= 5) s.lockedUntil = new Date(now().getTime() + 15 * 60000);
        render(); return;
      }
      s.tries = 0; S.lastEmail = s.email;
      if (!S.knownDevice) { S.pending = k; S.f.au3 = null; go('verify'); } else finish(k);
    }, 700);
    return false;
  };

  /* ---------- L3 Verify it's you ---------- */
  R('verify', {id:'L3', title:'Verify it\'s you', public:true, states:[['wrong','Wrong code'],['expired','Code expired']], render() {
    const v = S.f.au3 || (S.f.au3 = {d:['','','','','',''], until: Date.now() + 42000, email:false, err:null});
    const err = S.st || v.err;
    const to = v.email ? (U[S.pending || 'khalid'].email.replace(/^(.).*(@.*)$/, '$1•••$2')) : PH;
    const shake = err === 'wrong' && (S.st === 'wrong' || Date.now() - (v.shakeAt || 0) < 400);
    return page(`${art(v.email ? 'mail' : 'shield', 'teal')}${head('Check it\'s you', `This is a new device. We sent a 6-digit code to <b>${to}</b> ${v.email ? 'by email' : 'on WhatsApp'}.`)}
      ${err === 'expired' ? `<div class="note warn" role="alert">${ic('clock')}<div class="grow"><b>This code has expired.</b> Codes work for 10 minutes. Send a new one and use it straight away.</div><button type="button" class="btn sm" data-a="au-resend">Send a new code</button></div>` : ''}
      <form class="col" data-a="au-verify" novalidate>
        <fieldset style="border:0;padding:0;margin:0;min-width:0"><legend class="b small" style="margin-bottom:8px">6-digit code</legend>
        <div class="otp au-otp ${shake ? 'shake' : ''}">${v.d.map((x, i) => `<input class="inp ${err === 'wrong' ? 'bad' : x ? 'has' : ''}" id="au-d${i}" inputmode="numeric" autocomplete="${i ? 'off' : 'one-time-code'}" maxlength="1" value="${esc(x)}" data-in="au-digit" data-i="${i}" aria-label="Digit ${i + 1} of 6" ${err === 'wrong' ? 'aria-invalid="true" aria-describedby="au-otp-e"' : ''}>`).join('')}</div></fieldset>
        ${err === 'wrong' ? errLine('au-otp', 'That code is not right. Check the latest message from VINA and type the 6 digits again.') : ''}
        <div class="au-row small">${v.until > Date.now() ? `<span class="au-count">${ic('clock', 14)}Resend code in <b class="num" data-until="${v.until}" data-done="au-resend-ready">0:${pad(Math.ceil((v.until - Date.now()) / 1000))}</b></span>` : `<button type="button" class="btn ghost sm" data-a="au-resend">${ic('refresh', 14)}Resend code</button>`}<span class="sp"></span><button type="button" class="btn ghost sm" data-a="au-use-email">${v.email ? 'Send to WhatsApp instead' : 'Use email instead'}</button></div>
        ${spinBtn(v.busy, 'Verify and log in', 'Checking the code…')}
      </form>`, {back:'login'});
  }});
  A['au-digit'] = (el) => {
    const v = S.f.au3, i = +el.dataset.i, d = el.value.replace(/\D/g, '');
    const land = e => { e.classList.toggle('has', !!e.value); e.classList.remove('bad', 'pop'); if (e.value) { void e.offsetWidth; e.classList.add('pop'); } };
    if (d.length > 1) { d.slice(0, 6 - i).split('').forEach((c, j) => { v.d[i + j] = c; const e = $('#au-d' + (i + j)); if (e) { e.value = c; land(e); } }); const n = Math.min(5, i + d.length); $('#au-d' + n).focus({preventScroll:true}); }
    else { v.d[i] = d; el.value = d; land(el); if (d && i < 5) $('#au-d' + (i + 1)).focus({preventScroll:true}); }
    if (v.d.join('').length === 6) $('#au-d5').form.requestSubmit();
    return false;
  };
  document.addEventListener('keydown', (ev) => { const el = ev.target; if (el.dataset && el.dataset.in === 'au-digit' && ev.key === 'Backspace' && !el.value) { const p = $('#au-d' + (+el.dataset.i - 1)); if (p) { p.focus({preventScroll:true}); p.value = ''; p.classList.remove('has'); S.f.au3.d[+el.dataset.i - 1] = ''; ev.preventDefault(); } } });
  document.addEventListener('paste', (ev) => { const el = ev.target; if (!(el.dataset && el.dataset.in === 'au-digit')) return; const d = (ev.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (!d) return; ev.preventDefault(); const v = S.f.au3; d.split('').forEach((c, j) => { v.d[j] = c; }); render(); const e = $('#au-d' + Math.min(5, d.length - 1)); if (e) e.focus({preventScroll:true}); if (d.length === 6) setTimeout(() => { const fm = $('.au-otp'); if (fm) fm.closest('form').requestSubmit(); }, 50); });
  A['au-resend-ready'] = () => {};
  A['au-resend'] = () => { const v = S.f.au3; v.until = Date.now() + 42000; v.err = null; v.d = ['','','','','','']; S.st = ''; toast('We sent a new code.'); };
  A['au-use-email'] = () => { S.f.au3.email = !S.f.au3.email; S.f.au3.until = Date.now() + 42000; toast(S.f.au3.email ? 'We sent the code to your email.' : 'We sent the code on WhatsApp.'); };
  A['au-verify'] = () => {
    const v = S.f.au3, code = v.d.join('');
    if (v.busy) return false;
    if (S.st === 'expired') { v.err = 'expired'; return; }
    v.busy = true; v.err = null; render();
    setTimeout(() => {
      v.busy = false;
      if (code.length < 6 || code === '000000' || S.st === 'wrong') { v.err = 'wrong'; v.shakeAt = Date.now(); v.d = ['','','','','','']; S.st = ''; render(); const e = $('#au-d0'); if (e) e.focus({preventScroll:true}); return; }
      finish();
    }, 500);
    return false;
  };

  /* ---------- L4 Forgot password ---------- */
  const RULES = [['At least 8 characters', p => p.length >= 8], ['A capital letter', p => /[A-Z]/.test(p)], ['A number', p => /\d/.test(p)], ['A symbol, e.g. ! or #', p => /[^A-Za-z0-9]/.test(p)]];
  const rulesWas = {}; // which rules were already ticked, so only a newly ticked rule pops
  const rulesHtml = (p, key) => { const was = rulesWas[key] || []; const now1 = RULES.map(([, fn]) => fn(p || '')); rulesWas[key] = now1;
    return `<ul class="au-rules" id="au-rules-${key}" aria-label="Password rules">${RULES.map(([t], i) => { const ok = now1[i]; return `<li class="au-rule ${ok ? 'ok' : ''} ${ok && !was[i] ? 'pop' : ''}">${ic(ok ? 'check' : 'minus', 14)}<span>${t}</span><span class="sr">${ok ? 'done' : 'not yet'}</span></li>`; }).join('')}</ul>`; };
  const enterAgain = () => { S._enter = true; };
  R('forgot', {id:'L4', title:'Forgot password', public:true, states:[['expired','Link expired']], render() {
    const s = S.f.au4 || (S.f.au4 = {step:'email', email: (S.f.au && S.f.au.email) || ''});
    if (S.st === 'expired') return page(`${art('clock', 'amber')}${head('This link has expired', 'Reset links work for 1 hour. Ask for a new one and use it straight away.')}<button type="button" class="btn pri lg wide" data-a="au-reset-again">Send a new link</button>`, {back:'login'});
    if (s.step === 'email') return page(`${art('lock', 'blue')}${head('Forgot your password?', 'Enter your work email. We will send you a link to set a new one.')}
      <form class="col" data-a="au-reset-send" novalidate>${fld('b-f-au4-email', 'Work email', `<input class="inp ${s.err ? 'bad' : ''}" type="email" autocomplete="username" placeholder="name@company.sa" ${bind('f.au4.email')} ${s.err ? 'aria-invalid="true" aria-describedby="b-f-au4-email-e"' : ''}>`, s.err)}<button type="submit" class="btn pri lg wide">Send the link</button></form>`, {back:'login'});
    if (s.step === 'sent') return page(`${art('mail', 'teal')}${head('Check your email', `If <b>${esc(s.email)}</b> has a VINA account, a link is on its way. It works for 1 hour.`)}
      <button type="button" class="btn pri lg wide" data-a="au-open-link">Open the link <span class="xs" style="opacity:.75">(prototype)</span></button><button type="button" class="btn ghost" data-a="au-reset-again">Send it again</button>`, {back:'login'});
    if (s.step === 'set') { const ok = RULES.every(([, fn]) => fn(s.p1 || '')), match = s.p2 && s.p1 === s.p2;
      return page(`${head('Set a new password', `For ${esc(s.email || 'khalid@icaur-alghanim.sa')}`)}
      <form class="col" data-a="au-reset-save" novalidate>
        ${pwInput('f.au4.p1', 'f.au4.show', 'New password', '', 'new-password', {live:true, desc:'au-rules-l4'})}
        ${rulesHtml(s.p1, 'l4')}
        ${fld('b-f-au4-p2', 'Type it again', `<input class="inp ${s.p2 && !match ? 'bad' : ''}" type="${s.show ? 'text' : 'password'}" autocomplete="new-password" ${bind('f.au4.p2', true)}>`, s.p2 && !match ? 'The two passwords are not the same yet. Check the last characters.' : '')}
        <button type="submit" class="btn pri lg wide" ${ok && match ? '' : 'aria-disabled="true"'}>Save new password</button>${ok && match ? '' : `<p class="xs mute" style="text-align:center;margin-top:-4px">Save turns on when all four rules are ticked and both passwords match.</p>`}</form>`, {back:'login'}); }
    return page(`${art('check', 'green')}${head('Password changed', 'Use your new password the next time you log in.')}<a class="btn pri lg wide" href="#login" data-a="au-reset-done">Log in</a>`);
  }});
  A['au-reset-send'] = () => { const s = S.f.au4; if (!/^\S+@\S+\.\S+$/.test(s.email || '')) { s.err = 'Enter your work email, for example name@company.sa.'; return; } s.err = null; s.step = 'sent'; enterAgain(); };
  A['au-open-link'] = () => { S.f.au4.step = 'set'; enterAgain(); };
  A['au-reset-again'] = () => { S.st = ''; S.f.au4.step = 'sent'; toast('We sent a new link.'); };
  A['au-reset-save'] = () => { const s = S.f.au4; if (!(RULES.every(([, fn]) => fn(s.p1 || '')) && s.p1 === s.p2)) return false; s.step = 'done'; enterAgain(); };
  A['au-reset-done'] = () => { S.f.au4 = null; S.f.au = {email: S.lastEmail || ''}; go('login'); return false; };

  /* ---------- L5 Join your team ---------- */
  R('join', {id:'L5', title:'Join your team', public:true, states:[['expired','Invite expired']], render() {
    const s = S.f.au5 || (S.f.au5 = {name:'', mob:'', pw:''});
    const team = `<div class="au-team"><span class="au-lg white" aria-hidden="true">iC</span><div class="grow" style="min-width:0"><b style="font-size:14px">iCaur Alghanim</b><div class="small mute">Madinah Road showroom, Jeddah</div></div>${S.st === 'expired' ? '' : chipC('Sales agent', 'teal')}</div>`;
    if (S.st === 'expired') return page(`${team}${art('clock', 'amber')}${head('This invite has expired', 'Invites work for 7 days. Ask VINA support to send a new invite.')}<a class="btn pri lg wide" href="mailto:support@vina.sa">${ic('mail', 16)}Email support@vina.sa</a>`);
    const e = s.err || {};
    return page(`${team}${head('Join your team', 'You have been added to iCaur Alghanim as <b>Sales agent</b> by VINA support. Set up your account to start.')}
      <form class="col" data-a="au-join" novalidate>
        ${fld('b-f-au5-name', 'Your name', `<input class="inp ${e.name ? 'bad' : ''}" autocomplete="name" ${bind('f.au5.name')} ${e.name ? 'aria-invalid="true" aria-describedby="b-f-au5-name-e"' : ''}>`, e.name)}
        ${fld('b-f-au5-mob', 'Mobile', `<div class="row nowrap tight"><span class="inp" style="width:auto;display:inline-flex;align-items:center;flex:0 0 auto;background:var(--sub)">+966</span><input class="inp ${e.mob ? 'bad' : ''}" inputmode="tel" autocomplete="tel-national" placeholder="5X XXX XXXX" ${bind('f.au5.mob')} ${e.mob ? 'aria-invalid="true" aria-describedby="b-f-au5-mob-e"' : ''}></div>`, e.mob, 'We send codes to this number on WhatsApp.')}
        ${pwInput('f.au5.pw', 'f.au5.show', 'Create a password', e.pw, 'new-password', {live:true, desc:'au-rules-l5'})}
        ${rulesHtml(s.pw, 'l5')}
        <button type="submit" class="btn pri lg wide">Join iCaur Alghanim</button></form>
      <p class="xs mute" style="text-align:center">Invite for sara.g@icaur-alghanim.sa · expires 14 Nov</p>`);
  }});
  A['au-join'] = () => {
    const s = S.f.au5, e = {};
    if (!String(s.name || '').trim()) e.name = 'Enter your name as your team knows it.';
    if (!/^5\d{8}$/.test(String(s.mob || '').replace(/\s/g, ''))) e.mob = 'Enter a Saudi mobile of 9 digits that starts with 5.';
    if (!RULES.every(([, fn]) => fn(s.pw || ''))) e.pw = 'Tick all four password rules below.';
    s.err = e; if (Object.keys(e).length) return;
    S.f.au5 = null; S.knownDevice = true; signIn('sales'); toast('Welcome to iCaur Alghanim.');
  };

  /* ---------- L6 Choose a client ---------- */
  const CHS = {ok:['var(--green)', ''], warn:['', 'needs attention'], wait:['var(--amber)', 'waiting for Meta'], paused:['var(--faint)', 'paused']};
  R('clients', {id:'L6', title:'Choose a client', roles:['vina'], states:[['loading','Loading'],['empty','No clients yet'],['error','Could not load']], render() {
    const q = String(S.f.au6q || '').toLowerCase();
    const list = S.st === 'empty' ? [] : CLIENTS.filter(c => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    const attn = CLIENTS.filter(c => c.channels.some(([, s]) => s === 'warn')).length;
    const card = (c, i) => {
      const warn = c.channels.some(([, s]) => s === 'warn'), wait = c.channels.some(([, s]) => s === 'wait');
      return `<li><button type="button" class="card lift au-client" data-a="au-pick" data-x="${c.id}" aria-label="${esc(c.name)}, ${esc(c.city)}${warn ? ', a channel needs attention' : ''}">
        <span class="hd"><span class="au-lg ${c.id === 'icaur' ? 'white' : 'c-' + ['purple','teal','blue'][i % 3]}" aria-hidden="true">${c.short}</span>
          <span class="grow" style="min-width:0"><span class="nm ell">${esc(c.name)}</span><span class="small mute ell" style="display:block">${esc(c.city)}</span></span>
          ${c.id === S.client ? chipC('Current', 'navy') : warn ? chipC('Needs attention', 'red') : wait ? chipC('Setting up', 'amber') : ''}${ic('chevR', 18, 'go')}</span>
        <span class="au-stats"><span class="mk" style="gap:6px">${mic('agents', 11)}<b>${c.agents}</b>${c.agents === 1 ? 'agent' : 'agents'}</span><span class="mk" style="gap:6px">${mic('live', 11)}<b>${c.live}</b>live</span><span class="mk" style="gap:6px">${mic('users', 11)}<b>${c.users}</b>users</span></span>
        <span class="au-chs">${c.channels.map(([n, s]) => `<span class="${s}">${s === 'warn' ? pulse('red') : `<span class="au-dot" style="background:${CHS[s][0]}" aria-hidden="true"></span>`}${esc(n)}${CHS[s][1] ? ' ' + CHS[s][1] : ''}</span>`).join('')}</span>
      </button></li>`;
    };
    const body = S.st === 'loading' ? `<div class="au-clients" aria-busy="true" aria-label="Loading">${[1,2,3,4].map(() => `<div class="skel" style="height:178px;border-radius:16px"></div>`).join('')}</div>` : S.st === 'error' ? errorBox('We could not load your clients', 'Check your connection and try again. If it keeps happening, tell the VINA tech team.', 'au-retry')
      : !list.length ? `<div class="card">${q ? empty('search', 'No client matches "' + esc(S.f.au6q) + '"', 'Check the spelling, or search by city.', `<button type="button" class="btn" data-a="au-clear">Clear search</button>`) : empty('store', 'No clients yet', 'Clients appear here once a business is set up. Start with agent setup.', `<a class="btn pri" href="#setup-1">Set up a new client</a>`)}</div>`
      : `<ul class="au-clients">${list.map(c => card(c, CLIENTS.indexOf(c))).join('')}</ul>`;
    return `<div class="full"><div class="full-top">${LOGO()}<span class="sp"></span><span class="row tight nowrap">${av(U.lina.name)}<span class="small hide-xs"><b>Lina Haddad</b><span class="mute" style="display:block">VINA support team</span></span></span><button type="button" class="ibtn" data-a="theme" aria-label="Light or dark">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}</button><button type="button" class="ibtn" data-a="logout" aria-label="Log out">${ic('logout')}</button></div>
      <div class="au-wrap">
        <h1 style="font-size:28px;font-weight:700">Choose a client</h1>
        ${pageToolbar({left:`<label class="au-search" style="flex:1 1 320px;max-width:480px">${ic('search', 16)}<span class="sr">Search clients</span><input type="search" placeholder="Search by client name or city" ${bind('f.au6q', true)}></label>`, right: S.st === 'empty' ? '' : `<span class="small mute">${CLIENTS.length} clients${attn ? ` · <span class="red b">${attn} need${attn === 1 ? 's' : ''} attention</span>` : ''}</span>`})}
        ${body}</div></div>`;
  }});
  A['au-retry'] = () => { S.st = ''; };
  A['au-clear'] = () => { S.f.au6q = ''; };
  A['au-pick'] = (el) => { S.client = el.dataset.x; if (el.dataset.x !== 'icaur') toast('Prototype: every client shows the iCaur Alghanim sample data.'); go('overview'); };

  /* ---------- L7 Session expired ---------- */
  const PAGE_NAME = r => { const s = SCREENS.find(x => x[4] === r); if (/^lead-/.test(r || '')) { const l = lead(r.slice(5)); return 'Leads · ' + (l ? l.name : 'Lead page'); } return s ? s[1] : 'Overview'; };
  R('expired', {id:'L7', title:'Session expired', public:true, render() {
    if (S.role) { S.lastEmail = U[S.me].email; S.role = null; S.me = null; S.f.au = {}; }
    return page(`${art('lock', 'navy')}${head('You were logged out', 'For your safety, we log you out after 2 hours without activity. Log in again to go back to the page you were on.')}
      ${S.back ? `<div class="note">${ic('history')}<span>You were on <b>${esc(PAGE_NAME(S.back))}</b>. We take you back there.</span></div>` : ''}
      <a class="btn pri lg wide" href="#login">Log in again</a>`);
  }});

  /* ---------- L8 Sign up (later) ---------- */
  R('signup', {id:'L8', title:'Sign up', public:true, render() {
    const s = S.f.au8 || (S.f.au8 = {terms:false});
    const later = `<span class="pill c-grey" style="align-self:flex-start">Later · not in the first release</span>`;
    if (s.sent) return page(`${later}${art('mail', 'teal')}${head('Check your email', `We sent a link to <b>${esc(s.email)}</b>. Open it to confirm your email, then set up your first agent.`)}<button type="button" class="btn pri lg wide" data-a="au-signup-confirm">I confirmed my email <span class="xs" style="opacity:.75">(prototype)</span></button>`);
    const e = s.err || {};
    const t = (k, label, type, auto, hint) => fld('b-f-au8-' + k, label, `<input class="inp ${e[k] ? 'bad' : ''}" type="${type || 'text'}" autocomplete="${auto || 'off'}" ${bind('f.au8.' + k)} ${e[k] ? `aria-invalid="true" aria-describedby="b-f-au8-${k}-e"` : ''}>`, e[k], hint);
    return page(`${later}${head('Create your VINA account', 'Set up your first agent in a few minutes.')}
      <form class="col" data-a="au-signup" novalidate>
        <div class="g2" style="gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))">${t('name', 'Your name', 'text', 'name')}${t('mob', 'Mobile', 'tel', 'tel', '')}</div>
        ${t('email', 'Work email', 'email', 'email')}${t('biz', 'Business name', 'text', 'organization')}
        ${pwInput('f.au8.pw', 'f.au8.show', 'Password', e.pw, 'new-password', {live:true, desc:'au-rules-l8'})}${rulesHtml(s.pw, 'l8')}
        <label class="chk small"><input ${bindChk('f.au8.terms')}><span>I agree to the <a href="#signup" data-a="au-link">terms</a> and the <a href="#signup" data-a="au-link">privacy policy</a>.</span></label>${e.terms ? errLine('au8-terms', e.terms) : ''}
        <button type="submit" class="btn pri lg wide">Create account</button></form>
      <p class="small mute" style="text-align:center">Already have an account? <a href="#login" class="b">Log in</a></p>`);
  }});
  A['au-signup'] = () => {
    const s = S.f.au8, e = {};
    if (!String(s.name || '').trim()) e.name = 'Enter your name.';
    if (!/^(\+?966)?\s?0?5\d{8}$/.test(String(s.mob || '').replace(/\s/g, ''))) e.mob = 'Enter a Saudi mobile, e.g. 05X XXX XXXX.';
    if (!/^\S+@\S+\.\S+$/.test(s.email || '')) e.email = 'Enter your work email, for example name@company.sa.';
    if (!String(s.biz || '').trim()) e.biz = 'Enter the business name customers know.';
    if (!RULES.every(([, fn]) => fn(s.pw || ''))) e.pw = 'Tick all four password rules below.';
    if (!s.terms) e.terms = 'Tick the box to accept the terms and privacy policy.';
    s.err = e; if (!Object.keys(e).length) { s.sent = true; enterAgain(); }
  };
  A['au-signup-confirm'] = () => { S.f.au8 = null; S.knownDevice = true; signIn('vina', {stay:true}); go('setup-1'); toast('Email confirmed. Set up your agent.'); return false; };
})();
