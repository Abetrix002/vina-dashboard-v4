/* VINA Dashboard prototype · core
   Views are functions that return HTML strings. One state object S, one render().
   Contract for view modules (src/views/*.js):
     R(name, {id, title, roles, full, states, render(param)})   register a route (#name or #name-param)
     A.actionName = (el, ev) => {...}       click on [data-a="actionName"] (data-x = argument). render() runs after, unless it returns false
     MODALS.id = (m) => modalFrame(...)    open with openModal('id', {...}); m is S.modal
     DRAWERS.id = (d) => drawerFrame(...)  open with openDrawer('id', {...})
     bind('path') / bindChk('path')         two-way bind an input to S at a dot path (S.f.* is free scratch space)
*/
'use strict';
const NOW0 = new Date(2026, 10, 7, 16, 50, 0); // Sat 7 Nov 2026, 4:50 PM, Jeddah
const T0 = Date.now();
const now = () => new Date(NOW0.getTime() + (Date.now() - T0));
const pad = n => String(n).padStart(2, '0');
const clock = d => { let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(m) + ' ' + ap; };
const nowStr = () => 'Today ' + clock(now());
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = n => Number(n).toLocaleString('en-US');
const mins = m => m == null ? '—' : m < 60 ? m + ' min' : m < 1440 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : Math.floor(m / 1440) + (m < 2880 ? ' day' : ' days');
const isAr = s => /[؀-ۿ]/.test(s || '');
const txt = s => isAr(s) ? `<span dir="rtl" class="ar">${esc(s)}</span>` : esc(s);
const uid = (() => { let i = 100; return p => (p || 'x') + (++i); })();
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

/* ---------- Icons (24 grid, stroke) ---------- */
const IP = {
  overview:'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  channels:'M2 8.8a15 15 0 0 1 20 0M5 12.6a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0M12 20h.01',
  conv:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  leads:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  team:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  star:'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z',
  inbox:'M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z',
  kbd:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10',
  phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  cal:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  bot:'M12 8V4H8M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM2 14h2M20 14h2M9 13v2M15 13v2',
  bolt:'M13 2 3 14h9l-1 8 10-12h-9z',
  tests:'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  plug:'M12 22v-5M9 8V2M15 8V2M18 8v5a6 6 0 0 1-12 0V8z',
  route:'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  user:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  sliders:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
  x:'M18 6 6 18M6 6l12 12',
  check:'M20 6 9 17l-5-5', ticks:'M1.5 12.5 6 17 16.5 6.5M11 16l1 1 10.5-10.5',
  chevD:'m6 9 6 6 6-6', chevU:'m18 15-6-6-6 6', chevR:'m9 18 6-6-6-6', chevL:'m15 18-6-6 6-6', updown:'m7 15 5 5 5-5M7 9l5-5 5 5',
  plus:'M12 5v14M5 12h14', minus:'M5 12h14',
  filter:'M22 3H2l8 9.5V19l4 2v-8.5z',
  cols:'M12 3v18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  link:'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  ext:'M7 17 17 7M7 7h10v10',
  pause:'M6 4h4v16H6zM14 4h4v16h-4z', play:'M6 3l14 9-14 9z',
  send:'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  note:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  more:'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon:'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  globe:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  wa:'M7.9 20A9 9 0 1 0 4 16.1L2 22z',
  fb:'M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.2S17.5 2 12 2zM7 13.5l3-3 2.5 2 3.5-3',
  lock:'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  eye:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff:'M17.9 17.9A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22',
  mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  copy:'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  trash:'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  grip:'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  alert:'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  arrowR:'M5 12h14M12 5l7 7-7 7', arrowL:'M19 12H5M12 19l-7-7 7-7',
  refresh:'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.7 4.4A9 9 0 0 0 20.5 15',
  mic:'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8',
  clip:'M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
  tpl:'M4 4h16v16H4zM4 9h16M9 20V9',
  spark:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z',
  store:'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6',
  car:'M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M3 17V12l2-5h14l2 5v5M3 12h18',
  give:'M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7',
  flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  volume:'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  mute:'M11 5 6 9H2v6h4l5 4zM23 9l-6 6M17 9l6 6',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu:'M3 12h18M3 6h18M3 18h18',
  wifiOff:'M1 1l22 22M16.7 11.1A11 11 0 0 1 19 12.6M5 12.6a11 11 0 0 1 5.2-2.5M10.7 5A16 16 0 0 1 22.6 9M1.4 9a16 16 0 0 1 4.4-2.7M8.5 16.1a5 5 0 0 1 7 0M12 20h.01',
  card:'M1 4h22v16H1zM1 10h22',
  history:'M3 3v5h5M3.1 13a9 9 0 1 0 2.1-9.4L3 8M12 7v5l4 2',
  undo:'M3 7v6h6M21 17a9 9 0 0 0-15-6.7L3 13',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  book:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM20 17v5H6.5A2.5 2.5 0 0 1 4 19.5',
  pin:'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
};
const ic = (n, s, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" width="${s || 18}" height="${s || 18}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IP[n] || IP.info}"/></svg>`;
const LOGO = cls => `<svg class="logo ${cls || ''}" viewBox="0 -755.47 813.18 317.74" role="img" aria-label="VINA"><path fill="url(#vina-g)" d="M692.37-755.47H120.81c-66.45,0-120.81,54.37-120.81,120.81h0c0,66.44,54.36,120.81,120.81,120.81h.48l43.95,76.12,43.95-76.12h483.18c66.45,0,120.81-54.37,120.81-120.81h0C813.18-701.1,758.82-755.47,692.37-755.47Z"/><g fill="#fff"><path d="M75.97-697.45h42.94l46.22,92.46,46.22-92.46h41.93l-71.48,132.22h-34.35L75.97-697.45Z"/><path d="M282.33-697.45h38.89v131.28h-38.89V-697.45Z"/><path d="M365.43-697.45h35.86l82.85,80.83v-80.83h38.39v131.28h-33.09l-85.62-83.46v83.46h-38.39V-697.45Z"/><path d="M625.58-698.39h35.87l75.77,132.22h-40.66l-16.17-29.45h-74.76l-16.17,29.45h-39.65L625.58-698.39ZM666.5-621.12l-23.49-42.58-23.49,42.58H666.5Z"/></g></svg>`;
const LOGO_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="vina-g" gradientUnits="userSpaceOnUse" x1="25.17" y1="-516.68" x2="771.7" y2="-747.6"><stop offset="0" stop-color="#3C9BE6"/><stop offset="1" stop-color="#30D0C3"/></linearGradient></defs></svg>`;

/* ---------- Shared vocabulary (LD5, LD6, channels) ---------- */
const STATUS = {
  new:{label:'New', c:'blue', means:'VINA is chatting. Not qualified yet.', colour:'Blue'},
  qualified:{label:'Qualified', c:'teal', means:'Ready for the team.', colour:'Teal'},
  callback:{label:'Callback', c:'amber', means:'The call centre must call back.', colour:'Amber'},
  contacted:{label:'Contacted', c:'navy', means:'The team has spoken to the customer.', colour:'Navy'},
  testdrive:{label:'Test drive booked', c:'purple', means:'Date and time set.', colour:'Violet'},
  offer:{label:'Offer sent', c:'rose', means:'Price or offer shared.', colour:'Rose'},
  sold:{label:'Sold', c:'green', means:'Car sold.', colour:'Green'},
  lost:{label:'Lost', c:'grey', means:'Not going ahead, with a reason.', colour:'Grey', bar:'--grey-m'},
};
const ST_ORDER = ['new','qualified','callback','contacted','testdrive','offer','sold','lost'];
const STEPS = ['new','qualified','contacted','testdrive','offer','sold']; // LD4 stepper
const LOST_REASONS = ['Bought elsewhere','No answer after 3 tries','Wrong number','Outside our area','Price too high','Other'];
const CH = {
  wa:{label:'WhatsApp', c:'green', i:'wa'}, web:{label:'Website chat', c:'blue', i:'globe'}, ph:{label:'Phone line', c:'navy', i:'phone'},
  fb:{label:'Messenger', c:'indigo', i:'fb'},
};
const SOURCES = ['Meta ad','Snapchat ad','Google','Website','Walk-in'];
const MODELS = ['V27 2027','V27 2026','03T 2026'];
const SHOWROOMS = ['Madinah Road','Prince Sultan Road'];
const chip = k => { const s = STATUS[k] || {label:k, c:'grey'}; return `<span class="chip c-${s.c}"><span class="dot" aria-hidden="true"></span>${esc(s.label)}</span>`; };
const stFill = k => { const s = STATUS[k] || {c:'grey'}; return `var(${s.bar || '--' + s.c + '-f'})`; }; // bar and swatch colour for a status
const chipC = (label, c, dot) => `<span class="chip c-${c || 'grey'}">${dot ? '<span class="dot" aria-hidden="true"></span>' : ''}${esc(label)}</span>`;
const vtag = () => `<span class="vtag" title="Qualified by VINA">${ic('spark', 11)}VINA</span>`;
const chIc = (k, lg) => { const c = CH[k] || CH.wa; return `<span class="chi c-${c.c} ${lg ? 'lg' : ''}" title="${c.label}">${ic(c.i, lg ? 20 : 14)}<span class="sr">${c.label}</span></span>`; };
const AVC = ['blue','teal','amber','purple','navy','indigo'];
const initials = n => String(n || '?').split(/\s+/).map(w => w.replace(/^(Al-|Bin|bin)/, '')).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
const av = (name, size, extra) => {
  if (name === 'VINA') return `<span class="av vina ${size || ''}" aria-hidden="true">V</span>`;
  let h = 0; for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return `<span class="av ${size || ''} c-${AVC[h % 6]}" aria-hidden="true" ${extra || ''}>${esc(initials(name))}</span>`;
};
const stars = (n, s) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${[1,2,3,4,5].map(i => `<span class="${i <= Math.round(n) ? '' : 'off'}">${ic('star', s || 14)}</span>`).join('')}</span>`.replace(/fill="none"/g, 'fill="currentColor"');
const sw = (on, a, x, label, dis) => `<button type="button" class="switch" role="switch" aria-checked="${on ? 'true' : 'false'}" aria-label="${esc(label || '')}" data-a="${a}" data-x="${esc(x == null ? '' : x)}" ${dis ? 'disabled' : ''}></button>`;

/* ---------- People ---------- */
const U = {
  khalid:{name:'Khalid Al-Shehri', role:'manager', label:'Manager', team:'Management', email:'khalid@icaur-alghanim.sa'},
  sami:{name:'Sami Al-Rashid', role:'manager', label:'Account admin', team:'Management', email:'sami@icaur-alghanim.sa'},
  reem:{name:'Reem Al-Harbi', role:'cc', label:'Call centre agent', team:'Call centre', email:'reem@icaur-alghanim.sa', status:'available'},
  faisal:{name:'Faisal Omar', role:'cc', label:'Call centre agent', team:'Call centre', email:'faisal@icaur-alghanim.sa', status:'busy'},
  huda:{name:'Huda Saleh', role:'cc', label:'Call centre agent', team:'Call centre', email:'huda@icaur-alghanim.sa', status:'available'},
  majed:{name:'Majed Al-Qahtani', role:'sales', label:'Sales agent', team:'Sales', showroom:'Madinah Road', email:'majed@icaur-alghanim.sa', status:'available'},
  yousef:{name:'Yousef Al-Ghamdi', role:'sales', label:'Sales agent', team:'Sales', showroom:'Madinah Road', email:'yousef@icaur-alghanim.sa', status:'busy'},
  abdullah:{name:'Abdullah Al-Zahrani', role:'sales', label:'Sales agent', team:'Sales', showroom:'Prince Sultan Road', email:'abdullah@icaur-alghanim.sa', status:'away'},
  lina:{name:'Lina Haddad', role:'vina', label:'VINA support team', team:'VINA', email:'lina@vina.sa'},
};
const ROLE_ME = {manager:'khalid', cc:'reem', sales:'majed', vina:'lina'};
const ROLE_LABEL = {manager:'Manager', cc:'Call centre agent', sales:'Sales agent', vina:'VINA team'};
const HOME = {manager:'overview', cc:'callbacks', sales:'leads', vina:'clients'};
const uname = id => id === 'vina' ? 'VINA' : id && U[id] ? U[id].name : 'Unassigned';
const first = id => uname(id).split(' ')[0];

/* ---------- Leads ---------- */
// m: conversation lines. k: in | vina | agent | note | evt | file | tpl | act. h: lead history, newest first.
const L = (o) => Object.assign({ unread:false, vq:false, late:false, wait:null, rating:null, city:'Jeddah', lang:'Arabic', created:'Thu 5 Nov 2026', ch:'wa', src:'Meta ad', campaign:'V27 2027 National Day offer', trim:'', colour:'', next:'—', summary:'', facts:null, why:'', m:[], h:[], cb:null, paused:false, lastIn:12, handled:'VINA alone', team:null }, o);
const LEADS = [
  L({id:'l01', name:'Abdulrahman Saleh', mob:'+966 50 418 7781', model:'V27 2027', trim:'Standard', colour:'Pearl white', status:'offer', owner:'majed', team:'sales', vq:true, unread:true, wait:25, late:true, src:'Snapchat ad', ch:'wa', lang:'English', created:'Wed 4 Nov 2026', next:'Follow up 6:00 PM', handled:'Sales',
    summary:'Wants financing under 2,500 a month, has a 2019 car to trade in',
    facts:[['Wants','V27 2027 Standard'],['Pays by','Financing, 5 years'],['Budget','Under 2,500 a month'],['Trade-in','2019 sedan, 85,000 km'],['Timing','This month'],['Best time to call','After 6 PM']],
    why:'Asked about financing and monthly payments, and gave his name, mobile and car model.',
    m:[{k:'evt', text:'Chat started from a Snapchat ad · V27 2027 National Day offer', at:'Wed 2:40 PM', i:'ext'},
       {k:'in', text:'Is the V27 2027 available in white? And what are the monthly payments?', at:'Wed 2:41 PM'},
       {k:'vina', text:'Yes, the V27 2027 comes in Pearl white. Our sales team will explain the payment plans. When is a good time to call you?', at:'Wed 2:41 PM', src:'V27 2027 brochure.pdf'},
       {k:'in', text:'After 6 please. I also have a 2019 sedan to trade in.', at:'Wed 2:50 PM'},
       {k:'evt', text:'VINA marked the lead qualified · asked about financing', at:'Wed 2:51 PM', tone:'teal', i:'spark'},
       {k:'evt', text:'Given to Reem by rule "Callbacks to call centre"', at:'Wed 2:58 PM', i:'user'},
       {k:'evt', text:'Reem called · reached · sent to Majed: "Has a 2019 car to trade in. Wants monthly payments under 2,500."', at:'Wed 3:20 PM', tone:'amber', i:'note'},
       {k:'agent', text:'Hi Abdulrahman, this is Majed from iCaur Alghanim. I have a payment plan for the white V27 2027. Would you like a test drive this week?', who:'majed', at:'Wed 5:04 PM'},
       {k:'in', text:'Sounds good, Thursday works for me', at:'Wed 5:12 PM'},
       {k:'agent', text:'Here is the financing offer: 2,890 a month over 5 years with 10% down.', who:'majed', at:'Today 1:12 PM'},
       {k:'in', text:'طيب لو أبدلت سيارتي ٢٠١٩، كم يصير القسط الشهري؟', at:'Today 4:25 PM'}],
    h:[{t:'chat', title:'Customer message', by:'WhatsApp · not answered yet', when:'Today 4:25 PM', body:'طيب لو أبدلت سيارتي ٢٠١٩، كم يصير القسط الشهري؟'},
       {t:'status', title:'Status changed to Offer sent', by:'by Majed Al-Qahtani', when:'Today 1:15 PM'},
       {t:'note', title:'Note', by:'by Majed Al-Qahtani', when:'Today 1:10 PM', body:'Sent the financing offer: 2,890 a month over 5 years with 10% down. He said it is above his budget.'},
       {t:'drive', title:'Test drive done', by:'V27 2027 Standard · Madinah Road · with Majed', when:'Thu 5 Nov, 6:00 PM'},
       {t:'call', title:'Call · 4 min', by:'by Reem Al-Harbi · reached, sent to sales', when:'Wed 4 Nov, 3:20 PM', body:'Has a 2019 car to trade in. Wants monthly payments under 2,500. Best time after 6 PM.'},
       {t:'give', title:'Given to Reem Al-Harbi', by:'by rule "Callbacks to call centre"', when:'Wed 4 Nov, 2:58 PM'},
       {t:'vina', title:'VINA marked it qualified', by:'asked about financing', when:'Wed 4 Nov, 2:51 PM'},
       {t:'ad', title:'Chat started from a Snapchat ad', by:'"V27 2027 National Day offer"', when:'Wed 4 Nov, 2:40 PM'}], lastIn:0.4}),
  L({id:'l02', name:'Mona Al-Shammari', mob:'+966 56 207 9045', model:'V27 2026', trim:'Premium', status:'testdrive', owner:'majed', team:'sales', vq:true, src:'Google', campaign:'V27 search', next:'Test drive Sun 8 Nov, 10 AM', handled:'Sales', summary:'Booked a test drive, coming with her husband, wants to compare both trims', td:{day:'Sun 8 Nov', time:'10:00 AM', showroom:'Madinah Road', car:'V27 2026 Premium'},
    m:[{k:'in', text:'أبغى أجرب السيارة يوم الأحد الصبح', at:'Fri 7:12 PM'},{k:'vina', text:'أبشري! حجزت لك تجربة قيادة يوم الأحد ٨ نوفمبر الساعة ١٠ الصبح في معرض طريق المدينة.', at:'Fri 7:12 PM', src:'Showroom hours'},{k:'act', name:'Book a test drive', st:'Done', lines:['Sun 8 Nov, 10:00 AM · Madinah Road','Status changed to Test drive booked','WhatsApp confirmation sent']}], lastIn:21}),
  L({id:'l03', name:'Ali Hakami', mob:'+966 55 630 2286', model:'V27 2027', status:'qualified', owner:'majed', team:'sales', vq:true, unread:true, wait:38, late:true, next:'Reply now', handled:'Sales', summary:'Ready to buy this month, asked about the National Day offer',
    m:[{k:'in', text:'I want to buy this month. Is the National Day offer still on?', at:'Today 4:08 PM'},{k:'vina', text:'Yes, the National Day offer is on until 30 November. Shall I ask a salesperson to call you now?', at:'Today 4:08 PM', src:'National Day offers.pdf'},{k:'in', text:'Yes please, I want to talk to a person', at:'Today 4:10 PM'},{k:'evt', text:'VINA marked the lead qualified · asked for a person', at:'Today 4:10 PM', tone:'teal', i:'spark'},{k:'evt', text:'Given to Yousef by rule "Qualified to Sales"', at:'Today 4:11 PM', i:'user'},{k:'evt', text:'Given to Majed because it waited 15 minutes', at:'Today 4:26 PM', i:'user'}],
    h:[{t:'give', title:'Given to Majed Al-Qahtani', by:'because Yousef did not open it in 15 minutes', when:'Today 4:26 PM'},{t:'give', title:'Given to Yousef Al-Ghamdi', by:'by rule "Qualified to Sales"', when:'Today 4:11 PM'},{t:'vina', title:'VINA marked it qualified', by:'asked for a person', when:'Today 4:10 PM'}], lang:'English', lastIn:0.7}),
  L({id:'l04', name:'Turki Al-Anazi', mob:'+966 50 955 1250', model:'V27 2027', trim:'Premium', status:'testdrive', owner:'majed', team:'sales', src:'Google', ch:'web', wait:120, next:'Test drive today 6:00 PM', handled:'Sales', lang:'English', summary:'Comparing with another brand, wants a side by side of the specs', td:{day:'Today', time:'6:00 PM', showroom:'Madinah Road', car:'V27 2027 Premium'},
    m:[{k:'in', text:'Can you send me a side by side of the V27 against the competition?', at:'Today 2:40 PM'},{k:'agent', text:'Sure Turki, I will bring the comparison to your test drive at 6.', who:'majed', at:'Today 2:50 PM'}], lastIn:2.2}),
  L({id:'l05', name:'Hamad Al-Subaie', mob:'+966 59 120 8812', model:'03T 2026', trim:'Standard', colour:'Black', status:'offer', owner:'majed', team:'sales', src:'Snapchat ad', wait:1440, next:'Follow up Sun 11 AM', handled:'Sales', summary:'Asked for the cash price and the trade-in value of his 2018 car', m:[{k:'in', text:'كم سعر الكاش؟ وكم تقيمون سيارتي ٢٠١٨؟', at:'Fri 3:10 PM'},{k:'agent', text:'Cash price is in the offer I sent. I will call you Sunday at 11 with the trade-in value.', who:'majed', at:'Fri 3:30 PM'}], lastIn:26}),
  L({id:'l06', name:'Lama Hassan', mob:'+966 56 774 0318', model:'V27 2027', status:'qualified', owner:'majed', team:'sales', vq:true, wait:5, next:'Book test drive', handled:'Call centre', summary:'Wants a test drive this weekend, sent from the call centre by Reem',
    m:[{k:'in', text:'أبغى أحجز تجربة قيادة', at:'Today 3:55 PM'},{k:'vina', text:'أكيد! أي يوم يناسبك؟', at:'Today 3:55 PM'},{k:'in', text:'السبت أو الأحد الصبح', at:'Today 3:57 PM'},{k:'evt', text:'Reem called · reached · sent to you: "Prefers Sunday morning. Has no trade-in."', at:'Today 4:45 PM', tone:'amber', i:'note'}],
    h:[{t:'give', title:'Sent to Majed Al-Qahtani', by:'by Reem Al-Harbi, call centre', when:'Today 4:45 PM', body:'Prefers Sunday morning. Has no trade-in.'},{t:'call', title:'Call · 3 min', by:'by Reem Al-Harbi · reached, sent to sales', when:'Today 4:41 PM'}], lastIn:0.9}),
  L({id:'l07', name:'Fahad Al-Shehri', mob:'+966 54 331 7720', model:'V27 2026', trim:'Standard', status:'sold', owner:'majed', team:'sales', next:'Delivery Mon 9 Nov', rating:5, ratingNote:'Majed was quick and clear. Thank you.', handled:'Sales', summary:'Bought the V27 2026, financing approved by the bank', m:[{k:'in', text:'Thank you Majed, see you Monday for delivery', at:'Thu 6:20 PM'}], lastIn:46}),
  L({id:'l08', name:'Khaled Bin Saeed', mob:'+966 53 802 3075', model:'03T 2026', status:'lost', lostReason:'Bought elsewhere', owner:'majed', team:'sales', src:'Website', ch:'web', handled:'Sales', summary:'Bought elsewhere, said the delivery time was too long', lastIn:70}),
  L({id:'l09', name:'Noura Al-Zahrani', mob:'+966 55 914 4120', model:'V27 2027', trim:'Premium', colour:'Pearl white', status:'callback', owner:'reem', team:'cc', vq:true, unread:true, wait:2, next:'Call 5:00 PM', handled:'Call centre', summary:'Asked about the price and monthly payments, prefers a call in Arabic at 5 PM',
    cb:{at:'5:00 PM', in:10, why:'Asked about price and monthly payments', tries:0},
    m:[{k:'evt', text:'Chat started from a Meta ad · V27 2027 National Day offer', at:'3:58 PM', i:'ext'},
       {k:'in', text:'السلام عليكم، عندكم عرض على V27 موديل 2027؟', at:'3:58 PM'},
       {k:'vina', text:'وعليكم السلام، حياك الله! إيه عندنا عرض اليوم الوطني على V27 موديل 2027. تبين أرسل لك أهم المواصفات؟', at:'3:58 PM', src:'National Day offers.pdf'},
       {k:'in', text:'إيه، وكم سعرها؟ وفيه تقسيط؟', at:'4:01 PM'},
       {k:'vina', text:'الأسعار والتقسيط يوضحها لك فريقنا مباشرة. متى يناسبك نتصل عليك؟', at:'4:01 PM', src:'Rules: never talk about prices'},
       {k:'in', text:'اتصلوا علي الساعة ٥ لو سمحتوا', at:'4:02 PM'},
       {k:'evt', text:'VINA moved the lead to Callback · asked about price and financing', at:'4:02 PM', tone:'teal', i:'arrowR'},
       {k:'evt', text:'Given to Reem by rule "Callbacks to call centre"', at:'4:07 PM', i:'user'}],
    h:[{t:'give', title:'Given to Reem Al-Harbi', by:'by rule "Callbacks to call centre"', when:'Today 4:07 PM'},{t:'status', title:'Status changed to Callback', by:'by VINA · asked about price and financing', when:'Today 4:02 PM'},{t:'ad', title:'Chat started from a Meta ad', by:'"V27 2027 National Day offer"', when:'Today 3:58 PM'}], lastIn:0.8}),
  L({id:'l10', name:'Faisal Al-Malki', mob:'+966 54 266 2093', model:'03T 2026', status:'callback', owner:'reem', team:'cc', vq:true, unread:true, wait:10, late:true, next:'Call 4:40 PM', handled:'Call centre', summary:'Wants to visit the showroom this week, asked for the location',
    cb:{at:'4:40 PM', in:-10, why:'Wants to visit the showroom this week', tries:1},
    m:[{k:'in', text:'متى أقدر أزور المعرض؟', at:'4:20 PM'},{k:'vina', text:'المعرض مفتوح من ٩ الصبح إلى ١٠ الليل، ما عدا الجمعة. هذا موقع معرض طريق المدينة.', at:'4:20 PM', src:'Showroom hours'},{k:'file', text:'Location pin · Madinah Road showroom', at:'4:20 PM'},{k:'in', text:'ممكن أحد يتصل علي؟', at:'4:22 PM'},{k:'evt', text:'VINA moved the lead to Callback · asked to be called', at:'4:22 PM', tone:'teal', i:'arrowR'}],
    h:[{t:'call', title:'Call · no answer', by:'by Reem Al-Harbi · try again in 1 hour', when:'Today 3:40 PM'}], lastIn:0.5}),
  L({id:'l11', name:'Hessa Al-Mutairi', mob:'+966 58 340 6617', model:'V27 2027', status:'callback', owner:'reem', team:'cc', vq:true, unread:true, wait:25, late:true, src:'Snapchat ad', next:'Call 4:25 PM', handled:'Call centre', lang:'English', summary:'Wants someone to call about financing',
    cb:{at:'4:25 PM', in:-25, why:'Asked about financing', tries:0},
    m:[{k:'in', text:'Can someone call me about financing?', at:'4:18 PM'},{k:'vina', text:'Of course. Our team will call you shortly. Is this number the best one to reach you?', at:'4:18 PM'},{k:'in', text:'Yes', at:'4:19 PM'}], lastIn:0.5}),
  L({id:'l12', name:'Sultan Al-Dossari', mob:'+966 59 471 6642', model:'03T 2026', status:'callback', owner:'reem', team:'cc', ch:'web', src:'Website', asked:true, wait:14, next:'Call 5:45 PM', handled:'Call centre', lang:'English', summary:'Asked about the warranty and service visits, asked for a person',
    cb:{at:'5:45 PM', in:55, why:'Asked for a person · warranty question', tries:0},
    m:[{k:'in', text:'What is the warranty on the 03T?', at:'4:31 PM'},{k:'vina', text:'The 03T has a 7 year or 150,000 km warranty, whichever comes first.', at:'4:31 PM', src:'03T brochure.pdf, page 12'},{k:'in', text:'I would like to talk to a person please', at:'4:33 PM'},{k:'evt', text:'Asked for a person · VINA handed the chat to the team', at:'4:33 PM', tone:'amber', i:'user'}], lastIn:0.3}),
  L({id:'l13', name:'Badr Al-Ghamdi', mob:'+966 50 662 4415', model:'V27 2026', status:'callback', owner:'reem', team:'cc', vq:true, src:'Google', next:'Call 7:00 PM', handled:'Call centre', summary:'Wants the trade-in value of his 2017 car',
    cb:{at:'7:00 PM', in:130, why:'Trade-in value for a 2017 car', tries:0}, m:[{k:'in', text:'بكم تاخذون سيارتي ٢٠١٧ بدل؟ اتصلوا علي بعد المغرب', at:'2:10 PM'}], lastIn:2.7}),
  L({id:'l14', name:'Waleed Al-Saadi', mob:'+966 53 118 2290', model:'03T 2026', status:'callback', owner:'reem', team:'cc', vq:true, next:'Call Sun 10:00 AM', handled:'Call centre', summary:'Wants a call tomorrow morning about colours in stock',
    cb:{at:'Sun 10:00 AM', in:1030, why:'Colours in stock', tries:0, day:'tomorrow'}, m:[{k:'in', text:'Please call me tomorrow morning about the colours you have', at:'1:05 PM'}], lang:'English', lastIn:3.8}),
  L({id:'l15', name:'Maha Al-Juhani', mob:'+966 55 703 9921', model:'V27 2027', status:'contacted', owner:'yousef', team:'sales', vq:true, next:'Follow up 7:30 PM', handled:'Call centre', summary:'Reached by Reem, sent to sales, wants a cash offer',
    cb:{at:'2:00 PM', in:-170, why:'Asked for a cash offer', tries:1, done:'Reached, sent to sales'}, h:[{t:'give', title:'Sent to Yousef Al-Ghamdi', by:'by Reem Al-Harbi, call centre', when:'Today 2:06 PM', body:'Wants a cash offer. Ready this week.'},{t:'call', title:'Call · 5 min', by:'by Reem Al-Harbi · reached, sent to sales', when:'Today 2:01 PM'}], cbBy:'reem', lastIn:3}),
  L({id:'l16', name:'Nasser Al-Shahri', mob:'+966 54 880 1047', model:'V27 2026', status:'callback', owner:'reem', team:'cc', next:'Call 5:20 PM', handled:'Call centre', summary:'Asked about the down payment',
    cb:{at:'5:20 PM', in:30, why:'Asked about the down payment', tries:2}, h:[{t:'call', title:'Call · no answer', by:'by Reem Al-Harbi · try again in 1 hour', when:'Today 3:20 PM'},{t:'call', title:'Call · no answer', by:'by Reem Al-Harbi · try again in 1 hour', when:'Today 12:10 PM'}], lastIn:4.6}),
  L({id:'l17', name:'Ziyad Al-Harbi', mob:'+966 54 219 3318', model:'03T 2026', colour:'White', status:'qualified', owner:null, vq:true, unread:true, wait:70, late:true, src:'Website', ch:'web', next:'Needs an agent', handled:'VINA alone', summary:'Wants the 03T in white, asked about stock in Jeddah and delivery time', unWhy:'Rule "Qualified to Sales": no salesperson available',
    m:[{k:'in', text:'Do you have the 03T in white in Jeddah? How long is delivery?', at:'3:38 PM'},{k:'vina', text:'The 03T in white is in stock at our Madinah Road showroom. Delivery is within one week after payment.', at:'3:38 PM', src:'Stock list 7 Nov.xlsx'},{k:'in', text:'What is your best cash price?', at:'3:40 PM'},{k:'evt', text:'VINA marked the lead qualified · asked for the price', at:'3:40 PM', tone:'teal', i:'spark'}], lang:'English', lastIn:1.2}),
  L({id:'l18', name:'Fatimah Al-Qarni', mob:'+966 50 455 6091', model:'V27 2026', status:'qualified', owner:null, vq:true, wait:31, late:true, next:'Needs an agent', handled:'VINA alone', summary:'Asked for a person, wants to know about insurance', unWhy:'Asked for a person outside working hours', asked:true, m:[{k:'in', text:'ابغى أكلم موظف عن التأمين', at:'4:19 PM'}], lastIn:0.5}),
  L({id:'l19', name:'Yazeed Al-Shammari', mob:'+966 56 930 7712', model:'V27 2026', status:'qualified', owner:null, vq:true, wait:14, ch:'ph', src:'Google', next:'Needs an agent', handled:'VINA alone', summary:'Asked which colours are in stock and the delivery time', unWhy:'No rule for Phone line leads', m:[{k:'in', text:'وش الألوان المتوفرة؟', at:'4:36 PM'}], lastIn:0.2}),
  L({id:'l20', name:'Talal Al-Juhani', mob:'+966 50 664 3381', model:'V27 2027', status:'qualified', owner:null, vq:true, wait:9, ch:'web', src:'Google', next:'Needs an agent', handled:'VINA alone', summary:'Comparing with another brand, wants a side by side', unWhy:'Rule "Qualified to Sales": no salesperson available', lang:'English', lastIn:0.2}),
  L({id:'l21', name:'Abeer Al-Sulami', mob:'+966 58 210 5530', model:'V27 2026', status:'qualified', owner:null, vq:true, wait:6, next:'Needs an agent', handled:'VINA alone', summary:'Asked about the National Day offer and the down payment', unWhy:'Most open leads reached for all agents', lastIn:0.1}),
  L({id:'l22', name:'Rana Fouad', mob:'+966 53 790 9907', model:'V27 2026', status:'new', owner:'vina', wait:3, ch:'wa', src:'Meta ad', next:'VINA is chatting', handled:'VINA alone', summary:'Messaged after hours, asked which colours are in stock', m:[{k:'in', text:'Hi, which colours do you have for the V27 2026?', at:'4:46 PM'},{k:'vina', text:'Hi Rana! The V27 2026 comes in Pearl white, Graphite grey, Midnight black and Desert sand. Which one do you like?', at:'4:46 PM', src:'Products: V27 2026'}], lang:'English', lastIn:0.05}),
  L({id:'l23', name:'Nada Kamal', mob:'+966 58 551 5530', model:'V27 2026', status:'new', owner:'vina', wait:1, next:'VINA is chatting', handled:'VINA alone', summary:'Asked about the National Day offer and the down payment', m:[{k:'in', text:'كم الدفعة الأولى في عرض اليوم الوطني؟', at:'4:49 PM'},{k:'vina', text:'الدفعة الأولى تبدأ من ١٠٪ حسب البنك. تبين فريقنا يتواصل معك؟', at:'4:49 PM', src:'National Day offers.pdf'}], lastIn:0.02}),
  L({id:'l24', name:'Omar Bakr', mob:'+966 55 384 6120', model:'03T 2026', colour:'Grey', status:'contacted', owner:'yousef', team:'sales', ch:'wa', src:'Meta ad', wait:60, next:'Send offer today', handled:'Sales', summary:'Comparing colours and delivery time, wants the price in writing', lastIn:1}),
  L({id:'l25', name:'Ghada Al-Harthi', mob:'+966 50 727 4402', model:'03T 2026', colour:'Grey', status:'sold', owner:'yousef', team:'sales', ch:'ph', src:'Walk-in', next:'Delivery Tue 10 Nov', rating:5, ratingNote:'Smooth from the first message to the showroom.', handled:'Sales', summary:'Bought the 03T in grey, paid in full', lastIn:30}),
  L({id:'l26', name:'Saad Al-Otaibi', mob:'+966 53 641 1187', model:'V27 2027', trim:'Standard', status:'lost', lostReason:'Price too high', owner:'abdullah', team:'sales', src:'Snapchat ad', next:'VINA checks in 7 Dec', rating:2, ratingNote:'Nobody called me back at the time they said.', handled:'Sales', summary:'Price too high, wanted monthly payments under 2,500', lastIn:48}),
  L({id:'l27', name:'Ahmed Al-Zahrani', mob:'+966 55 145 8803', model:'03T 2026', status:'testdrive', owner:'yousef', team:'sales', src:'Meta ad', next:'Test drive Mon 9 Nov, 7 PM', handled:'Sales', summary:'Wants to try the 03T with his family', td:{day:'Mon 9 Nov', time:'7:00 PM', showroom:'Madinah Road', car:'03T 2026'}, lastIn:20}),
  L({id:'l28', name:'Mansour Al-Qahtani', mob:'+966 59 302 4416', model:'V27 2027', status:'offer', owner:'abdullah', team:'sales', src:'Google', wait:180, next:'Follow up Sun 4:00 PM', handled:'Sales', summary:'Asked for a fleet price for three cars', lang:'English', lastIn:5}),
  L({id:'l29', name:'Layla Al-Otaibi', mob:'+966 56 448 2219', model:'V27 2026', status:'lost', lostReason:'No answer after 3 tries', owner:'huda', team:'cc', rating:1, ratingNote:'I asked three times for the price and got no clear answer.', handled:'Call centre', summary:'No answer after 3 calls', lastIn:52}),
  L({id:'l30', name:'Abdulaziz Al-Fahad', mob:'+966 54 904 6638', model:'V27 2027', trim:'Premium', status:'sold', owner:'abdullah', team:'sales', src:'Snapchat ad', rating:4, ratingNote:'Good offer, delivery took a bit long.', handled:'Sales', summary:'Bought the V27 2027 Premium with financing', lastIn:60}),
  L({id:'l31', name:'Rakan Al-Harbi', mob:'+966 50 337 1185', model:'03T 2026', status:'lost', lostReason:'Other', owner:'faisal', team:'cc', rating:2, ratingNote:'The chat kept asking the same question.', handled:'VINA alone', summary:'Stopped replying after asking about the price', lastIn:70}),
  L({id:'l32', name:'Hind Al-Mansour', mob:'+966 55 260 7734', model:'V27 2027', status:'contacted', owner:'faisal', team:'cc', vq:true, wait:22, next:'Call 6:15 PM', handled:'Call centre', summary:'Wants to compare the two V27 trims before deciding', cb:{at:'6:15 PM', in:85, why:'Trim comparison', tries:1}, lastIn:0.6}),
];
const lead = id => LEADS.find(l => l.id === id);
const mob = l => isMgr() ? l.mob.replace(/^(\+966 \d\d) \d{3} (\d{4})$/, '$1 ••• $2') : l.mob;

/* ---------- State ---------- */
const S = {
  role:null, me:null, client:'icaur', theme:'system', knownDevice:false,
  st:'', // demo state for the current screen: '', 'empty', 'loading', 'error', ... (see R().states)
  modal:null, drawer:null, menu:null, pops:[], toasts:[], proto:false, navOpen:false,
  alerts:[], sound:true, presence:'available', whatsappDown:false,
  f:{}, // free scratch space for forms (bind)
};
const isMgr = () => S.role === 'manager';
const isVina = () => S.role === 'vina';
const isCC = () => S.role === 'cc';
const isSales = () => S.role === 'sales';
const isAgent = () => isCC() || isSales();
const ro = () => isMgr() || isVina(); // reports pages are view only for managers and the VINA team
const meName = () => S.me ? U[S.me].name : '';
const mine = () => LEADS.filter(l => l.owner === S.me);
const unassigned = () => LEADS.filter(l => !l.owner);
const CLIENTS = [
  {id:'icaur', name:'iCaur Alghanim', short:'iC', city:'Jeddah · Madinah Road', agents:3, live:2, users:9, channels:[['WhatsApp','ok'],['Website','ok'],['Phone line','paused']]},
  {id:'nakhla', name:'Nakhla Diagnostics', short:'ND', city:'Riyadh · 4 branches', agents:2, live:2, users:14, channels:[['WhatsApp','ok'],['Website','ok'],['Phone line','ok']]},
  {id:'sahm', name:'Sahm Real Estate', short:'SR', city:'Riyadh', agents:1, live:1, users:6, channels:[['WhatsApp','warn'],['Website','ok']]},
  {id:'dana', name:'Dana Furniture', short:'DF', city:'Dammam · 2 showrooms', agents:1, live:0, users:4, channels:[['WhatsApp','wait']]},
];
const client = () => CLIENTS.find(c => c.id === S.client) || CLIENTS[0];

/* ---------- Lead actions (every change saved with name and time, and shown in history) ---------- */
function log(l, t, title, body, by) { l.h.unshift({t, title, by: by || ('by ' + meName()), when: nowStr(), body: body || ''}); }
function setStatus(l, k, extra) {
  if (l.status === k) return;
  l.status = k; log(l, 'status', 'Status changed to ' + STATUS[k].label, extra);
  if (k === 'sold' || k === 'lost') { l.wait = null; l.late = false; l.unread = false; }
}
function assignLead(l, to, how, reason) {
  const was = l.owner; l.owner = to; l.team = U[to] ? U[to].role : null; l.late = false;
  log(l, 'give', 'Given to ' + uname(to), reason ? 'Reason: ' + reason : '', how || ('by ' + meName()));
  if (l.m.length) l.m.push({k:'evt', text:'Given to ' + first(to) + (how ? ' ' + how : ''), at: clock(now()), i:'user'});
  return was;
}
function sendToSales(l, to, note) {
  const target = to === 'next' ? nextSales() : to;
  l.owner = target; l.team = 'sales'; l.cb = l.cb ? Object.assign({}, l.cb, {done:'Reached, sent to sales'}) : null; l.cbBy = S.me;
  if (['new','qualified','callback'].includes(l.status)) l.status = 'contacted';
  log(l, 'give', 'Sent to ' + uname(target), 'by ' + meName() + ', call centre' + (to === 'next' ? ' · next free salesperson' : ''), note);
  l.m.push({k:'evt', text: first(S.me) + ' sent the lead to ' + first(target) + (note ? ': "' + note + '"' : ''), at: clock(now()), tone:'amber', i:'note'});
  return target;
}
function closeLead(l, result, reason, note, checkin) {
  const k = result === 'sold' ? 'sold' : 'lost';
  l.status = k; l.wait = null; l.late = false; l.unread = false;
  if (result === 'notint') l.lostReason = 'Not interested'; else if (k === 'lost') l.lostReason = reason || 'Other';
  log(l, 'close', 'Lead closed · ' + (result === 'sold' ? 'Sold' : result === 'notint' ? 'Not interested' : 'Lost, ' + l.lostReason), note);
  l.next = checkin ? 'VINA checks in 7 Dec' : '—'; l.checkin = !!checkin; l.closedToday = true;
}
function nextSales() { const c = Object.keys(U).filter(k => U[k].role === 'sales' && U[k].status === 'available'); return c.sort((a, b) => mineCount(a) - mineCount(b))[0] || 'majed'; }
const mineCount = id => LEADS.filter(l => l.owner === id && !['sold','lost'].includes(l.status)).length;

/* ---------- Registry ---------- */
const R = (name, def) => { ROUTES[name] = Object.assign({name, roles:null, states:[]}, def); };
const ROUTES = {}, A = {}, MODALS = {}, DRAWERS = {};
function parseHash() {
  const h = (location.hash || '').slice(1);
  if (ROUTES[h]) return {name:h, param:'', def:ROUTES[h]};
  const keys = Object.keys(ROUTES).filter(k => h.startsWith(k + '-')).sort((a, b) => b.length - a.length);
  if (keys[0]) return {name:keys[0], param:h.slice(keys[0].length + 1), def:ROUTES[keys[0]]};
  return null;
}
const go = (r) => { if (location.hash.slice(1) === r) render(); else location.hash = r; };

/* ---------- Two-way binding ---------- */
const getP = p => p.split('.').reduce((o, k) => o == null ? undefined : o[k], S);
const setP = (p, v) => { const ks = p.split('.'); let o = S; ks.slice(0, -1).forEach(k => { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }); o[ks[ks.length - 1]] = v; };
const bind = (p, live) => `id="b-${p.replace(/\./g, '-')}" data-bind="${p}" ${live ? 'data-live' : ''} value="${esc(getP(p) == null ? '' : getP(p))}"`;
const bindTa = (p, live) => [`id="b-${p.replace(/\./g, '-')}" data-bind="${p}" ${live ? 'data-live' : ''}`, esc(getP(p) == null ? '' : getP(p))];
const bindChk = p => `id="b-${p.replace(/\./g, '-')}" type="checkbox" data-bind="${p}" ${getP(p) ? 'checked' : ''}`;
const bindSel = (p, opts) => `<select class="inp" id="b-${p.replace(/\./g, '-')}" data-bind="${p}">${opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(getP(p)) === String(v) ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select>`;
const f = (p, d) => { const v = getP('f.' + p); if (v === undefined && d !== undefined) { setP('f.' + p, d); return d; } return v; };

/* ---------- Frames ---------- */
const modalFrame = (title, body, foot, o) => `<div class="modal ${o && o.size || ''}" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="mh"><div class="grow"><h2 id="m-title">${esc(title)}</h2>${o && o.sub ? `<p>${o.sub}</p>` : ''}</div><button type="button" class="ibtn sm bare" data-a="close-modal" aria-label="Close">${ic('x')}</button></div><div class="mb">${body}</div>${foot ? `<div class="mf">${foot}</div>` : ''}</div>`;
const drawerFrame = (title, body, foot, sub) => `<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="d-title"><div class="dh"><div class="grow"><h2 id="d-title" class="h2">${title}</h2>${sub ? `<div class="h-sub" style="margin-top:4px">${sub}</div>` : ''}</div><button type="button" class="ibtn sm bare" data-a="close-drawer" aria-label="Close">${ic('x')}</button></div><div class="db">${body}</div>${foot ? `<div class="df">${foot}</div>` : ''}</aside>`;
// _k is the dialog's name; data may carry its own id (usually the lead id)
function openModal(k, data) { S.modal = Object.assign({id:k}, data || {}, {_k:k}); S._focusModal = true; S._modalNew = true; }
function openDrawer(k, data) { S.drawer = Object.assign({id:k}, data || {}, {_k:k}); S._focusModal = true; S._drawerNew = true; }
A['close-modal'] = () => { S.modal = null; };
A['close-drawer'] = () => { S.drawer = null; };
function toast(text, undo) { const ms = undo ? 7000 : 4200; const t = {id: uid('t'), text, undo, ms}; S.toasts.push(t); setTimeout(() => { S.toasts = S.toasts.filter(x => x !== t); paintLayers(); }, ms); }
A['toast-undo'] = (el) => { const t = S.toasts.find(x => x.id === el.dataset.x); if (t && t.undo) t.undo(); S.toasts = S.toasts.filter(x => x !== t); };
function pop(p) { const o = Object.assign({id: uid('p'), tone:'teal', icon:'bell'}, p); S.pops.push(o); S._ring = true; if (S.sound && isAgent()) beep(); setTimeout(() => { S.pops = S.pops.filter(x => x !== o); paintLayers(); }, p.stay || 9000); paintLayers(); return o; }
A['pop-close'] = (el) => { S.pops = S.pops.filter(x => x.id !== el.dataset.x); };
A['pop-go'] = (el) => { const p = S.pops.find(x => x.id === el.dataset.x); S.pops = S.pops.filter(x => x !== p); if (p && p.go) go(p.go); };
function beep() { try { const c = beep.c || (beep.c = new (window.AudioContext || window.webkitAudioContext)()); const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(.06, c.currentTime); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + .35); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .36); } catch (e) {} }
const empty = (icon, title, body, action) => `<div class="empty"><div class="art">${ic(icon, 28)}</div><h3>${esc(title)}</h3><p>${body}</p>${action || ''}</div>`;
const loadingRows = (n, h) => `<div class="col" aria-busy="true" aria-label="Loading">${Array.from({length: n || 6}, () => `<div class="skel" style="height:${h || 44}px"></div>`).join('')}</div>`;
const errorBox = (title, how, retry) => `<div class="note err" role="alert">${ic('alert')}<div class="grow"><b>${esc(title)}</b><div style="margin-top:2px">${how}</div></div>${retry ? `<button type="button" class="btn sm" data-a="${retry}">${ic('refresh', 14)}Try again</button>` : ''}</div>`;
const vo = () => `<span class="vo" title="You can see everything here. Changes are made by the agent handling the lead.">${ic('eye', 14)}View only</span>`;

/* ---------- Metric icons: every number carries an icon that says what it counts ---------- */
// [pattern, icon, tone]; first match wins. Tones reuse the chip colours so both themes hold contrast.
const METRIC_IC = [
  [/longest/i, 'clock', 'red'], [/wait/i, 'clock', 'amber'], [/overdue/i, 'alert', 'red'], [/still to call|to call/i, 'clock', 'amber'],
  [/vina alone|alone|no person/i, 'spark', 'teal'], [/qualified/i, 'tests', 'teal'], [/sold/i, 'car', 'green'],
  [/replied/i, 'inbox', 'blue'], [/conversation|chats/i, 'conv', 'blue'], [/test drive/i, 'cal', 'purple'],
  [/not interested/i, 'x', 'grey'], [/rating/i, 'star', 'amber'], [/calls made|call back/i, 'phone', 'blue'],
  [/reached|done|passed/i, 'check', 'green'], [/sent to sales/i, 'send', 'indigo'], [/no agent|available/i, 'user', 'grey'],
  [/no rule/i, 'route', 'grey'], [/scenario|test/i, 'tests', 'green'], [/action/i, 'bolt', 'teal'], [/agent/i, 'bot', 'teal'],
  [/user|people/i, 'user', 'blue'], [/plan|charge|invoice|bill/i, 'card', 'navy'], [/live/i, 'channels', 'green'],
  [/knowledge|file/i, 'book', 'blue'], [/set up|setup/i, 'sliders', 'grey'], [/lead/i, 'leads', 'blue'], [/look/i, 'alert', 'amber'],
];
const metricIc = label => { const m = METRIC_IC.find(([re]) => re.test(String(label))); return m ? [m[1], m[2]] : ['overview', 'grey']; };
// mic(label, size): the icon tile for a metric label. size is the glyph px (tile is glyph + 12).
const mic = (label, size) => { const [i, t] = metricIc(label), g = size || 15; return `<span class="mic c-${t}" style="--mic:${g + 12}px" aria-hidden="true">${ic(i, g)}</span>`; };

/* ---------- Analytics layout helpers ---------- */
// reportCard({title, sub, right, body, link:[label, route], id, cls}) : the one card pattern for report content
const reportCard = o => `<section class="card rc ${o.cls || ''}" ${o.id ? `id="${o.id}"` : ''} aria-label="${esc(o.title)}"><header class="rc-h"><div class="grow"><h2>${esc(o.title)}</h2>${o.sub ? `<div class="sub">${o.sub}</div>` : ''}</div>${o.right || ''}</header><div class="rc-b">${o.body}</div>${o.link ? `<footer class="rc-f"><a href="#${o.link[1]}">${esc(o.link[0])}${ic('arrowR', 14)}</a></footer>` : ''}</section>`;
// pageToolbar({left, date:{label, range, action}, right}) : filters left, date range + actions right
const pageToolbar = o => `<div class="ptb">${o.left || ''}<span class="sp"></span>${o.date ? `<button type="button" class="ptb-date" data-a="${o.date.action || 'noop'}" aria-haspopup="menu">${ic('cal', 16)}<b>${esc(o.date.label)}</b><span class="r">${esc(o.date.range)}</span>${ic('chevD', 14)}</button>` : ''}${o.right || ''}</div>`;

/* ---------- V2 helpers ---------- */
const countAttr = v => `data-count="${esc(v)}"`; // numbers count up on page entry
const pulse = (c) => `<span class="pulse ${c || ''}" aria-hidden="true"></span>`;
function flash(id) { S.flashes = S.flashes || {}; S.flashes[id] = Date.now() + 1100; }
const flashCls = id => S.flashes && S.flashes[id] > Date.now() ? 'flash' : '';
const sectionHead = (title, sub, right) => `<div class="sec-h"><div class="grow"><h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right || ''}</div>`;
const fresh = (label) => `<span class="fresh">${pulse('green')}<span>${esc(label || 'Updated just now')}</span><button type="button" data-a="refresh" aria-label="Refresh" title="Refresh">${ic('refresh', 15)}</button></span>`;
A.refresh = () => { S._enter = true; toast('Up to date'); };
// o: {k, v, d, dc ('green'|'red'|'amber'|'grey'), n, hot, hero, mini, spark:[numbers], icon, href}
function kpi(o) {
  const sp = o.spark && o.spark.length > 1 ? (() => { const mx = Math.max(...o.spark), mn = Math.min(...o.spark), W = 120, H = 30; const pts = o.spark.map((v, i) => [i / (o.spark.length - 1) * W, H - 3 - (mx === mn ? .5 : (v - mn) / (mx - mn)) * (H - 6)]); const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''); return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L${W} ${H} L0 ${H}Z" fill="var(--${o.hot ? 'amber' : 'horizon'})" opacity=".12"/><path class="draw" style="--len:260" d="${d}" fill="none" stroke="var(--${o.hot ? 'amber' : 'horizon'})" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></svg>`; })() : '';
  const tag = o.href ? 'a' : 'div';
  return `<${tag} class="kpi ${o.hot ? 'hot' : ''} ${o.hero ? 'hero' : ''} ${o.mini ? 'mini' : ''} ${o.href ? 'lift' : ''}" ${o.href ? `href="#${o.href}" style="text-decoration:none;color:inherit"` : ''}><span class="k row tight nowrap">${o.icon === false ? '' : mic(o.k, o.hero ? 17 : o.mini ? 13 : 15)}<span>${esc(o.k)}</span>${o.hot ? pulse() : ''}</span><span class="row tight" style="align-items:baseline"><span class="v" ${countAttr(o.v)} data-k="${esc(o.k)}">${esc(o.v)}</span>${o.d ? `<span class="d c-${o.dc || 'green'}">${esc(o.d)}</span>` : ''}</span>${o.n ? `<span class="n">${o.n}</span>` : ''}${sp}</${tag}>`;
}

/* ---------- Chat parts shared by AG1 Inbox and M3 Conversations (.cx-*) ----------
   cxRow(o) list row · cxHead(l, o) chat header · cxThread(l, o) the thread with "Jump to latest" · cxDetails(l, o) right panel.
   ] toggles the panel, J / K move through .cx-row lists (screens add their own keys with hotkey()). */
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// "Wed 2:41 PM" | "Today 4:25 PM" | "Yesterday 10:42 PM" | "3:58 PM" -> {day: days before today, min: minute of the day, time}
function msgWhen(at) {
  const m = String(at || '').match(/^(?:(Today|Yesterday|Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+)?(\d{1,2}):(\d\d)\s*([AP]M)$/i);
  if (!m) return {day:0, min:null, time:String(at || '')};
  const day = !m[1] || m[1] === 'Today' ? 0 : m[1] === 'Yesterday' ? 1 : (NOW0.getDay() - WD.indexOf(m[1]) + 7) % 7;
  return {day, min:(+m[2] % 12 + (m[4].toUpperCase() === 'PM' ? 12 : 0)) * 60 + +m[3], time:m[2] + ':' + m[3] + ' ' + m[4].toUpperCase()};
}
const dayLabel = n => { if (!n) return 'Today'; if (n === 1) return 'Yesterday'; const d = new Date(NOW0.getTime() - n * 864e5); return WD[d.getDay()] + ' ' + d.getDate() + ' ' + MON3[d.getMonth()]; };
const rowTime = at => { const w = msgWhen(at); return w.min == null ? w.time : !w.day ? w.time : w.day === 1 ? 'Yesterday' : WD[(NOW0.getDay() - w.day + 7) % 7]; };
// WhatsApp is the usual channel, so only other channels get a badge on the avatar (screen readers always hear the channel)
const avCh = (name, ch, size) => { const c = CH[ch] || CH.wa; return `<span class="cx-av">${av(name, size)}${ch && ch !== 'wa' ? `<span class="cx-chb c-${c.c}" title="${c.label}">${ic(c.i, 10)}</span>` : ''}<span class="sr">${c.label}</span></span>`; };
// quiet status for list rows: a coloured dot and the word, no filled chip
const stDot = (label, c) => `<span class="cx-st"><i style="background:var(--${c}-f)" aria-hidden="true"></i>${esc(label)}</span>`;
// o: {l, a (action), cur, time, late, unread, preview (html), meta (html), cls}
const cxRow = o => `<button type="button" class="cx-row ${o.unread ? 'unread' : ''} ${o.cls || ''}" data-a="${o.a}" data-x="${o.l.id}" aria-current="${!!o.cur}">${avCh(o.l.name, o.l.ch)}<span class="cx-rb"><span class="cx-r1"><span class="cx-rn ell">${esc(o.l.name)}</span>${o.unread ? '<span class="unread-dot" aria-hidden="true"></span><span class="sr">, unread</span>' : ''}<span class="cx-rt ${o.late ? 'late' : ''}">${esc(o.time)}</span></span><span class="cx-rp ell">${o.preview}</span><span class="cx-rm">${o.meta}</span></span></button>`;
const cxSearch = (path, label) => `<label class="cx-search">${ic('search', 15)}<span class="sr">${label}</span><input type="search" placeholder="Name or mobile" ${bind(path, true)}></label>`;
// o: {back (action), line (html), acts (html), more (html)}
const cxHead = (l, o) => `<div class="cx-head">${o.back ? `<button type="button" class="ibtn sm bare cx-back" data-a="${o.back}" aria-label="Back to chats">${ic('chevL')}</button>` : ''}${avCh(l.name, l.ch)}<div class="cx-hn"><div class="b ell" title="${esc(l.name)}">${esc(l.name)}</div><div class="xs mute ell">${o.line}</div></div><span class="cx-hchip">${chip(l.status)}</span>${o.acts || ''}<button type="button" class="ibtn sm cx-dpb" data-a="dp" aria-pressed="${dpOpen()}" aria-controls="cx-dp" aria-label="Customer details" title="Customer details (])">${ic('cols', 16)}</button>${o.more || ''}</div>`;

const THR = {seen:{}, open:new Set(), fresh:null};
const sideOf = m => m.k === 'in' ? 'in' : m.k === 'vina' || (m.k === 'file' && !m.who) ? 'vina' : m.k === 'note' ? 'note' : 'agent';
const senderOf = m => m.k === 'evt' || m.k === 'act' ? '' : sideOf(m) + ':' + (m.who || '');
function cxThreadHtml(l, o) {
  const ms = l.m, seen = THR.seen[l.id]; THR.seen[l.id] = ms.length;
  const anim = i => seen != null && i >= seen ? ' anim-in' : ''; // only lines that arrived since the last render rise in
  if (!ms.length) return `<div class="cx-ev">${ic('info', 13)}No messages yet. ${esc(l.summary)}.</div>`;
  let out = '', day = null, i = 0;
  while (i < ms.length) {
    const m = ms[i], w = msgWhen(m.at);
    if (w.day !== day) { day = w.day; out += `<div class="cx-day" role="separator"><span>${dayLabel(day)}</span></div>`; }
    if (m.k === 'evt') {
      let j = i; while (j < ms.length && ms[j].k === 'evt' && msgWhen(ms[j].at).day === day) j++;
      const run = ms.slice(i, j), key = l.id + ':' + i;
      if (run.length >= 3 && !THR.open.has(key)) out += `<button type="button" class="cx-more${anim(j - 1)}" data-a="cx-evts" data-x="${key}" aria-expanded="false" title="${esc(run.map(e => e.text).join(' · '))}">${ic('history', 13)}<span>${run.length} updates</span><span aria-hidden="true">·</span><u>Show</u></button>`;
      else out += `<div class="cx-evs ${THR.fresh === key ? 'anim-open' : ''}">${run.map((e, k) => `<div class="cx-ev ${e.tone || ''}${anim(i + k)}" style="--i:${k}">${ic(e.i || 'info', 13)}${txt(e.text)}<span class="tm"> · ${esc(msgWhen(e.at).time)}</span></div>`).join('')}</div>`;
      i = j; continue;
    }
    if (m.k === 'act') { out += `<div class="actcard ${m.st === 'Failed' ? 'fail' : ''}${anim(i)}"><div class="ah">${av('VINA', 'sm')}${esc(m.name)}<span class="st">${chipC(m.st, m.st === 'Done' ? 'green' : m.st === 'Failed' ? 'red' : 'blue')}</span></div><ul>${(m.lines || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; i++; continue; }
    // a group: same sender, same day, each line within 5 minutes of the one before
    const who = senderOf(m); let j = i + 1;
    while (j < ms.length && senderOf(ms[j]) === who) { const a = msgWhen(ms[j - 1].at), b = msgWhen(ms[j].at); if (b.day !== a.day || a.min == null || b.min == null || b.min - a.min > 5) break; j++; }
    const run = ms.slice(i, j), side = sideOf(m);
    const name = side === 'in' ? l.name.split(' ')[0] : side === 'vina' ? 'VINA' : m.who ? first(m.who) : 'Team';
    const avatar = side === 'in' ? av(l.name, 'sm') : side === 'vina' ? av('VINA', 'sm') : av(m.who ? uname(m.who) : 'Team', 'sm');
    const bubs = run.map((x, k) => {
      const body = x.k === 'file' ? `<span class="cx-file">${ic('clip', 15)}<span>${esc(x.text)}</span></span>` : x.k === 'tpl' ? `<span class="cx-tplh">${ic('tpl', 12)}WhatsApp template · ${esc(x.name)}</span>${txt(x.text)}` : txt(x.text);
      return `<div class="cx-m${anim(i + k)}"><div class="bub" ${k ? `title="${esc(msgWhen(x.at).time)}"` : ''}>${body}</div>${x.src ? `<span class="cx-src" tabindex="0" title="VINA answered from: ${esc(x.src)}">${ic('book', 11)}Source</span>` : ''}</div>`;
    }).join('');
    let tick = '';
    if (side === 'agent') { const st = ms.slice(j).some(y => y.k === 'in') ? 'Read' : anim(j - 1) ? 'Sent' : 'Delivered'; tick = `<span class="cx-tick ${st === 'Read' ? 'read' : ''}" title="${st}">${ic(st === 'Sent' ? 'check' : 'ticks', 14)}<span class="sr">${st}</span></span>`; }
    out += `<div class="cx-g ${side}"><span class="cx-gav">${avatar}</span><div class="cx-gb"><div class="cx-gh">${side === 'note' ? ic('lock', 12) + '<span>Note for the team</span>·' : ''}<b>${esc(name)}</b><span>${esc(w.time)}</span></div>${bubs}${tick}</div></div>`;
    i = j;
  }
  if (o && o.typing) out += `<div class="cx-g in"><span class="cx-gav">${av(l.name, 'sm')}</span><div class="cx-gb"><div class="typing cx-typing" aria-label="${esc(l.name.split(' ')[0])} is typing"><i></i><i></i><i></i></div></div></div>`;
  return out;
}
// o: {id, typing}
const cxThread = (l, o) => `<div class="cx-tw"><div class="chat cx-thr" id="${o.id}" data-keep data-stick aria-live="polite">${cxThreadHtml(l, o)}</div><button type="button" class="cx-jump" data-a="cx-jump" tabindex="-1" aria-hidden="true">${ic('chevD', 14)}Jump to latest</button></div>`;
A['cx-evts'] = el => { THR.open.add(el.dataset.x); THR.fresh = el.dataset.x; };
A['cx-jump'] = el => { const t = el.parentElement.querySelector('.cx-thr'); if (t) t.scrollTo({top:t.scrollHeight, behavior:motionOK() ? 'smooth' : 'auto'}); return false; };
const cxJump = t => { const b = t.parentElement && t.parentElement.querySelector('.cx-jump'); if (!b) return; const far = t.scrollHeight - t.scrollTop - t.clientHeight > 160; b.classList.toggle('on', far); b.tabIndex = far ? 0 : -1; b.setAttribute('aria-hidden', String(!far)); };
function cxSync() { THR.fresh = null; $$('.cx-thr').forEach(cxJump); }
document.addEventListener('scroll', ev => { const t = ev.target; if (t.classList && t.classList.contains('cx-thr')) cxJump(t); }, true);

// Details panel: open by default at 1280 px and wider (remembered), a closed overlay below.
const DP = {pref:null, narrow:false, anim:false, more:false, moreNew:false};
const dpWide = () => matchMedia('(min-width:1280px)').matches;
const dpPref = () => { if (DP.pref == null) { try { const v = localStorage.getItem('vina-dp'); DP.pref = v == null ? true : v === '1'; } catch (e) { DP.pref = true; } } return DP.pref; };
const dpOpen = () => dpWide() ? dpPref() : DP.narrow;
A.dp = () => { if (dpWide()) { DP.pref = !dpPref(); try { localStorage.setItem('vina-dp', DP.pref ? '1' : '0'); } catch (e) {} } else DP.narrow = !DP.narrow; DP.anim = dpOpen(); };
A['dp-more'] = () => { DP.more = !DP.more; DP.moreNew = DP.more; };
// o: {cb (html, callback time)}
function cxDetails(l, o) {
  const anim = DP.anim, moreNew = DP.moreNew; DP.anim = DP.moreNew = false;
  const kv = rows => `<dl class="kv">${rows.filter(r => r[1]).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  const car = esc(l.model) + (l.trim ? ' · ' + esc(l.trim) : '') + (l.colour ? ' · ' + esc(l.colour) : '');
  return `<aside class="cx-dp ${anim ? 'anim-in' : ''}" id="cx-dp" aria-label="Customer details">
    <div class="cx-dph"><div class="grow cx-dpt">Customer details</div><button type="button" class="ibtn sm bare cx-dpx" data-a="dp" aria-label="Close customer details" title="Close (])">${ic('x', 16)}</button></div>
    <section class="cx-sum" aria-label="VINA summary"><div class="hd">${ic('spark', 14)}VINA summary${l.vq ? '<span class="cx-vq"> · qualified by VINA</span>' : ''}</div><p>${esc(l.summary)}.</p>${l.facts ? `<dl class="kv">${l.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}</section>
    <section class="cx-sec" aria-label="Next step">${kv([['Mobile', '<span class="num">' + esc(mob(l)) + '</span>'], o && o.cb ? ['Callback', o.cb] : ['Next step', esc(l.next)], ['Car model', car], o && o.mine ? ['', ''] : ['Given to', l.owner ? esc(uname(l.owner)) : '<span class="red b">Not given to anyone yet</span>']])}</section>
    <section class="cx-sec"><button type="button" class="cx-dpmore" data-a="dp-more" aria-expanded="${DP.more}">Lead details${ic('chevD', 16)}</button>${DP.more ? `<div class="cx-dpg ${moreNew ? 'anim-in' : ''}">${kv([['Channel', CH[l.ch].label], ['Came from', esc(l.src)], ['Campaign', l.src === 'Walk-in' ? '' : esc(l.campaign)], ['Handled by', esc(l.handled)], ['City', esc(l.city)], ['Language', esc(l.lang)], ['Lead since', esc(l.created)]])}</div>` : ''}</section>
    ${l.rating ? `<section class="cx-sec"><h3>Customer rating</h3><div>${stars(l.rating)}${l.ratingNote ? `<p class="xs mute" style="margin-top:6px">“${esc(l.ratingNote)}”</p>` : ''}</div></section>` : ''}
  </aside>`;
}
// Single-key shortcuts: null while typing, with a modifier, or with a dialog or the palette open.
const hotkey = ev => { const t = ev.target; if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.isComposing || S.cmd || S.modal || S.drawer || (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))) return null; return ev.key; };
document.addEventListener('keydown', ev => {
  const k = hotkey(ev); if (!k || !document.querySelector('#app .cx-head, #app .cx-row')) return;
  if (k === ']') { ev.preventDefault(); A.dp(); render(); return; }
  if (k !== 'j' && k !== 'k' && k !== 'J' && k !== 'K') return;
  const rows = $$('#app .cx-row'), i = rows.findIndex(r => r.getAttribute('aria-current') === 'true');
  const n = rows[Math.max(0, Math.min(rows.length - 1, i + (k.toLowerCase() === 'j' ? 1 : -1)))];
  if (!n || n === rows[i]) return;
  ev.preventDefault(); n.click(); const c = $('#app .cx-row[aria-current="true"]'); if (c) c.scrollIntoView({block:'nearest'});
});

/* ---------- Side menus (section 2 table) ---------- */
const NAV = {
  manager:[['', [['overview','Overview','overview'],['channels','Channels','channels'],['conversations','Conversations','conv'],['leads','Leads','leads'],['team','Call centre and sales','team'],['ratings','Customer ratings','star']]]],
  cc:[['', [['inbox','Inbox','inbox'],['callbacks','Callbacks','phone'],['leads','My leads','leads']]]],
  sales:[['', [['inbox','Inbox','inbox'],['leads','My leads','leads'],['calendar','Test drives','cal']]]],
  vina:[['Reports', [['overview','Overview','overview'],['channels','Channels','channels'],['conversations','Conversations','conv'],['leads','Leads','leads'],['team','Call centre and sales','team'],['ratings','Customer ratings','star']]],
        ['Agent', [['agents','Agents','bot'],['actions','Actions','bolt'],['scenarios','Test scenarios','tests']]],
        ['Routing', [['rules','Lead routing','route']]],
        ['Workspace', [['connections','Connections','plug'],['users','Users','user'],['client-settings','Settings','sliders']]]],
};
const NAV_ALIAS = {pipeline:'leads', lead:'leads', unassigned: 'leads', qualify:'rules', rule:'rules', agent:'agents', 'conn-website':'connections', 'conn-whatsapp':'connections', 'conn-phone':'connections', 'conn-meta':'connections', plan:'client-settings', statuses:'leads'};
function badge(k) {
  if (k === 'inbox' && isAgent()) { const n = mine().filter(l => l.unread).length; return n || ''; }
  if (k === 'callbacks' && isCC()) { const n = mine().filter(l => l.cb && !l.cb.done && l.cb.in < 0).length; return n || ''; }
  if (k === 'leads' && (isMgr() || isVina())) { const n = unassigned().length; return n || ''; }
  return '';
}
function navHtml(active) {
  let a = NAV_ALIAS[active] || active;
  if (active === 'unassigned' && isVina()) a = 'rules';
  const groups = NAV[S.role] || [];
  const me = U[S.me] || {};
  const c = client();
  const sub = isVina() ? 'Switch client' : (me.showroom ? 'Jeddah · ' + me.showroom : c.city);
  const live = LEADS.filter(l => l.owner === 'vina').length;
  const clientInner = `<span class="lg" aria-hidden="true">${c.short}</span><span class="txt" style="flex:1;min-width:0"><span class="t1">${esc(c.name)}</span><span class="t2">${esc(sub)}</span></span>${isVina() ? ic('updown', 16) : ''}`;
  return `<nav class="nav ${S.navOpen ? 'open' : ''}" aria-label="Main" id="nav">
    <a class="brand" href="#${HOME[S.role] === 'clients' ? 'overview' : HOME[S.role]}" aria-label="VINA, home">${LOGO('on-nav')}</a>
    ${isVina() ? `<button type="button" class="client" data-go="clients" aria-label="${esc(c.name)}, switch client">${clientInner}</button>` : `<div class="client" title="${esc(c.name)}">${clientInner}</div>`}
    ${groups.map(([g, items]) => `${g ? `<div class="grp">${g}</div>` : ''}${items.map(([k, l, i]) => { const b = badge(k); return `<a class="item" href="#${k}" ${k === a ? 'aria-current="page"' : ''} title="${l}">${ic(i, 19)}<span class="lbl">${l}</span>${b ? `<span class="badge" aria-label="${b} need attention">${b > 99 ? '99+' : b}</span>` : ''}</a>`; }).join('')}`).join('')}
    <div class="foot">
      <div class="vina-live" title="VINA is answering ${live} chats now">${pulse('teal')}<span class="txt"><b>VINA is live</b> · ${live} chats now</span></div>
      <button type="button" class="collapse" data-a="rail" aria-pressed="${!!S.rail}">${ic(S.rail ? 'chevR' : 'chevL', 17)}<span class="lbl">${S.rail ? 'Expand menu' : 'Collapse menu'}</span></button>
    </div>
  </nav>`;
}
const PRES = {available:['Available','green'], busy:['Busy','amber'], away:['Away','grey']};
function shell(o) {
  // o: {nav, title, crumb:[label, route], tools:html, after:html, body:html, flush:bool, viewOnly:false, cp:bool}
  const unreadAlerts = S.alerts.filter(a => !a.read).length;
  const me = U[S.me] || {};
  const bar = (isVina() && S.whatsappDown) ? `<div class="banner" role="alert">${ic('alert')}<span class="grow"><b>WhatsApp is disconnected.</b> Customers are not getting replies. We also emailed the VINA team.</span><button type="button" class="btn sm" data-go="conn-whatsapp">Reconnect</button></div>` : '';
  const off = S.offline ? `<div class="offline" role="status">${ic('wifiOff', 16)}<span class="grow">You're offline. We'll send your changes when you're back online.</span></div>` : '';
  const ring = S._ring; S._ring = false;
  return `<a class="skip" href="#" data-a="skip">Skip to main content</a><div class="app ${S.rail ? 'rail' : ''}">${navHtml(o.nav)}${S.navOpen ? '<div class="drawer-scrim" data-a="nav-close" style="z-index:19"></div>' : ''}
  <div class="main">${bar}${off}
    <header class="top">
      <button type="button" class="ibtn menu-btn" data-a="nav-open" aria-label="Open menu" aria-controls="nav" aria-expanded="${S.navOpen}">${ic('menu')}</button>
      <div class="ttl">${o.crumb ? `<a class="crumb" href="#${o.crumb[1]}">${ic('chevL', 13)}${esc(o.crumb[0])}</a>` : ''}<div class="row tight nowrap" style="min-width:0"><h1>${esc(o.title)}</h1>${ro() && o.viewOnly !== false ? `<span class="vo hide-sm" title="You can see everything here. Changes are made by the agent handling the lead.">${ic('eye', 14)}<span class="t">View only</span></span>` : ''}${isVina() && o.cp ? `<span class="pill c-teal hide-sm">VINA team</span>` : ''}</div></div>
      ${o.after || ''}
      <span class="sp"></span>
      ${o.tools || ''}
      <button type="button" class="cmdk" data-a="cmd" aria-label="Search people, chats and pages" aria-keyshortcuts="Control+K Meta+K">${ic('search', 16)}<span class="t">Search people and pages</span><kbd>⌘K</kbd></button>
      ${isAgent() ? `<button type="button" class="btn sm hide-sm" data-a="presence-menu" aria-haspopup="menu" aria-expanded="${S.menu === 'presence'}" style="min-height:40px"><span class="pres ${S.presence}" style="width:9px;height:9px;border-radius:50%;display:inline-block"></span>${PRES[S.presence][0]}${ic('chevD', 14)}</button>` : ''}
      ${isAgent() ? `<button type="button" class="ibtn ${ring ? 'ring-once' : ''}" data-a="bell" aria-label="Alerts, ${unreadAlerts} new" aria-haspopup="dialog">${ic('bell')}${unreadAlerts ? `<span class="cnt">${unreadAlerts > 99 ? '99+' : unreadAlerts}</span>` : ''}</button>` : ''}
      <button type="button" class="profile" data-a="profile-menu" aria-haspopup="menu" aria-expanded="${S.menu === 'profile'}" aria-label="${esc(me.name || '')}, account menu">${isAgent() ? `<span class="avw">${av(me.name, 'sm')}<span class="pres ${S.presence}" aria-hidden="true"></span></span>` : av(me.name, 'sm')}<span class="pn">${esc(first(S.me))}</span>${ic('chevD', 14)}</button>
    </header>
    ${S.menu === 'presence' ? `<div class="menu" role="menu" style="top:64px;right:150px;position:fixed">${Object.entries(PRES).map(([k, [t]]) => `<button role="menuitemradio" aria-checked="${S.presence === k}" data-a="presence" data-x="${k}"><span class="pres ${k}" style="width:9px;height:9px;border-radius:50%;display:inline-block"></span><span class="grow">${t}</span>${S.presence === k ? ic('check', 16) : ''}</button>`).join('')}<div class="hr" style="margin:6px 0"></div><div class="xs mute" style="padding:4px 10px 6px;max-width:240px">Only available agents get new leads.</div></div>` : ''}
    ${S.menu === 'profile' ? `<div class="menu" role="menu" style="top:64px;right:24px;position:fixed;min-width:260px"><div class="row tight nowrap" style="padding:10px 10px 12px">${av(me.name)}<div class="grow"><div class="b ell">${esc(me.name || '')}</div><div class="xs mute ell">${esc(isMgr() ? me.label + ' · view only' : me.label || '')}</div></div></div><div class="hr"></div><div class="mh">Colours</div>${[['system','Match my device','sliders'],['light','Light','sun'],['dark','Dark','moon']].map(([k, t, i]) => `<button role="menuitemradio" aria-checked="${S.theme === k}" data-a="proto-theme" data-x="${k}">${ic(i, 16)}<span class="grow">${t}</span>${S.theme === k ? ic('check', 16) : ''}</button>`).join('')}${isAgent() ? `<div class="mh">Status</div>${Object.entries(PRES).map(([k, [t]]) => `<button role="menuitemradio" aria-checked="${S.presence === k}" data-a="presence" data-x="${k}"><span class="pres ${k}" style="width:9px;height:9px;border-radius:50%;display:inline-block;margin:0 4px"></span><span class="grow">${t}</span>${S.presence === k ? ic('check', 16) : ''}</button>`).join('')}` : ''}<div class="hr" style="margin:6px 0"></div><button role="menuitem" data-a="lang">${ic('globe', 16)}<span class="grow">العربية</span><span class="xs mute">In the build</span></button><button role="menuitem" data-a="logout">${ic('logout', 16)}<span class="grow">Log out</span></button></div>` : ''}
    <main id="main" tabindex="-1" class="page ${o.flush ? 'flush' : ''}">${o.body}</main>
  </div></div>`;
}
A.noop = () => false;
A.skip = () => { const m = document.getElementById('main'); if (m) m.focus(); return false; };
A['nav-open'] = () => { S.navOpen = true; };
A['nav-close'] = () => { S.navOpen = false; };
A.lang = () => { S.menu = null; toast('Arabic comes with the developer\'s right-to-left build of these screens.'); };
A['presence-menu'] = () => { S.menu = S.menu === 'presence' ? null : 'presence'; };
A['profile-menu'] = () => { S.menu = S.menu === 'profile' ? null : 'profile'; };
A.rail = () => { S.rail = !S.rail; try { localStorage.setItem('vina-rail', S.rail ? '1' : ''); } catch (e) {} };
A.presence = (el) => { S.presence = el.dataset.x; S.menu = null; if (U[S.me]) U[S.me].status = S.presence; toast(S.presence === 'available' ? 'You are available. New leads can come to you.' : 'You are ' + PRES[S.presence][0].toLowerCase() + '. New leads go to other agents.'); };
A.logout = () => { S.role = null; S.me = null; S.modal = S.drawer = null; go('login'); };
A['global-search'] = (el) => { S.f.gq = el.value; }; // re-render so list screens filter as you type (focus and caret are restored)
const curTheme = () => S.theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : S.theme;
A.theme = () => { setTheme(curTheme() === 'dark' ? 'light' : 'dark'); };
function setTheme(t) {
  const apply = () => setTheme0(t);
  if (document.startViewTransition && S.role !== undefined && document.documentElement.dataset.ready && !matchMedia('(prefers-reduced-motion: reduce)').matches) { try { const t = document.startViewTransition(apply); t.ready.catch(() => {}); t.finished.catch(() => {}); return; } catch (e) {} }
  apply();
}
function setTheme0(t) { S.theme = t; if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('vina-theme', t); } catch (e) {} }

/* ---------- Command palette (Ctrl/⌘ K): people, pages, quick actions for this role only ---------- */
function cmdItems(q) {
  q = (q || '').trim().toLowerCase(); const digits = q.replace(/\D/g, '');
  const out = [];
  const pages = (NAV[S.role] || []).flatMap(([g, items]) => items.map(([k, l, i]) => ({g:'Pages', t:l, s:g || 'Menu', i, go:k})));
  if (isVina()) pages.push({g:'Pages', t:'Choose a client', s:'Switch client', i:'updown', go:'clients'}, {g:'Pages', t:'Unassigned leads', s:'Lead routing', i:'route', go:'unassigned'}, {g:'Pages', t:'Qualifying', s:'Lead routing', i:'check', go:'qualify'}, {g:'Pages', t:'Plan and usage', s:'Workspace', i:'card', go:'plan'});
  if (isMgr()) pages.push({g:'Pages', t:'Unassigned leads', s:'Leads', i:'route', go:'unassigned'});
  pages.push({g:'Pages', t:'All 49 screens', s:'Prototype', i:'overview', go:'screens'});
  const pool = isAgent() ? mine() : LEADS;
  const people = pool.map(l => ({g:'People', t:l.name, s:`${l.model} · ${STATUS[l.status].label} · ${l.owner ? uname(l.owner) : 'Unassigned'}`, i:'user', go:'lead-' + l.id, l}));
  const acts = [{g:'Actions', t: curTheme() === 'dark' ? 'Switch to light colours' : 'Switch to dark colours', s:'Colours', i: curTheme() === 'dark' ? 'sun' : 'moon', a:'theme'}];
  if (isAgent()) Object.entries(PRES).forEach(([k, [t]]) => { if (k !== S.presence) acts.push({g:'Actions', t:'Set me as ' + t, s:'Status', i:'user', a:'presence', x:k}); });
  acts.push({g:'Actions', t:'Log out', s:'Account', i:'logout', a:'logout'});
  const hit = it => !q || it.t.toLowerCase().includes(q) || (it.s || '').toLowerCase().includes(q) || (digits.length >= 3 && it.l && it.l.mob.replace(/\D/g, '').includes(digits));
  return q ? [...people.filter(hit).slice(0, 6), ...pages.filter(hit).slice(0, 6), ...acts.filter(hit)] : [...pages.slice(0, 6), ...people.filter(p => p.l.unread || p.l.late).slice(0, 4), ...acts.slice(0, 2)];
}
function cmdHtml() {
  if (!S.cmd) return '';
  const items = cmdItems(S.cmd.q); S.cmd.n = items.length; if (S.cmd.i >= items.length) S.cmd.i = Math.max(0, items.length - 1);
  let last = '';
  const rows = items.map((it, i) => { const head = it.g !== last ? `<div class="cg" role="presentation">${it.g}</div>` : ''; last = it.g; return head + `<button type="button" class="co" role="option" id="co-${i}" aria-selected="${i === S.cmd.i}" data-a="cmd-go" data-x="${i}">${it.l ? av(it.l.name, 'sm') : `<span class="chi c-grey">${ic(it.i, 15)}</span>`}<span class="grow" style="min-width:0"><span class="ct ell" style="display:block">${esc(it.t)}</span><span class="cs ell" style="display:block">${esc(it.s || '')}</span></span>${it.l ? chip(it.l.status) : ic('arrowR', 14)}</button>`; }).join('');
  return `<div class="cmd-scrim ${S._cmdNew ? 'anim-in' : ''}" data-a="cmd-scrim"><div class="cmd" role="dialog" aria-modal="true" aria-label="Search"><div class="ci">${ic('search', 18)}<input id="cmd-q" type="text" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant="co-${S.cmd.i}" autocomplete="off" placeholder="Name, mobile number or page" value="${esc(S.cmd.q)}" data-in="cmd-q"><span class="kbd">Esc</span></div><div class="cl" id="cmd-list" role="listbox">${rows || `<div class="empty" style="padding:28px">${'<h3>No match for “' + esc(S.cmd.q) + '”</h3><p>Try a customer name, the last digits of a mobile number, or a page such as Leads.</p>'}</div>`}</div><div class="cf"><span><span class="kbd">↑</span> <span class="kbd">↓</span> to move</span><span><span class="kbd">Enter</span> to open</span><span class="sp"></span><span>${isAgent() ? 'Only your own leads' : 'All leads for ' + esc(client().name)}</span></div></div></div>`;
}
A.cmd = () => { S.cmd = {q:'', i:0}; S._cmdNew = true; S.menu = null; };
A['cmd-scrim'] = (el, ev) => { if (ev.target === el) S.cmd = null; else return false; };
A['cmd-q'] = (el) => { S.cmd.q = el.value; S.cmd.i = 0; };
A['cmd-go'] = (el) => { const it = cmdItems(S.cmd.q)[+el.dataset.x]; S.cmd = null; if (!it) return; if (it.go) go(it.go); else if (it.a && A[it.a]) A[it.a]({dataset:{x:it.x || ''}}); };

/* ---------- Sign in as a role ---------- */
function signIn(role, opts) {
  S.role = role; S.me = ROLE_ME[role]; S.modal = S.drawer = null; S.st = ''; S.navOpen = false;
  if (isAgent()) S.presence = U[S.me].status || 'available';
  if (!(opts && opts.stay)) go(HOME[role]);
  if (isAgent()) scheduleAlerts();
}

/* ---------- Screen index (section 13) ---------- */
// [id, name, area, priority, route, role, after]
const SCREENS = [
  ['L1','Website · Log in button','Login','P1','website',null],['L2','Dashboard log in','Login','P1','login',null],['L3','Verify it\'s you','Login','P1','verify',null],['L4','Forgot password','Login','P1','forgot',null],['L5','Join your team (invite)','Login','P1','join',null],['L6','Choose a client','Login','P1','clients','vina'],['L7','Session expired','Login','P3','expired',null],['L8','Sign up (later)','Login','P3','signup',null],
  ['M1','Overview','Manager dashboard','P1','overview','manager'],['M2','Channels','Manager dashboard','P1','channels','manager'],['M3','Conversations','Manager dashboard','P1','conversations','manager'],['M4','Call centre and sales','Manager dashboard','P1','team','manager'],['M5','Customer ratings','Manager dashboard','P1','ratings','manager'],
  ['AG1','Inbox','Agent dashboard','P1','inbox','cc'],['AG2','Callbacks','Agent dashboard','P1','callbacks','cc'],['AG3','Send to sales · Close lead','Agent dashboard','P1','inbox','cc','send-sales'],['AG4','Alerts and status','Agent dashboard','P2','alerts','sales'],
  ['LD1','Leads list (default view)','Leads','P1','leads','manager'],['LD2','Pipeline board','Leads','P2','pipeline','sales'],['LD3','Calendar','Leads','P3','calendar','sales'],['LD4','Lead page','Leads','P1','lead-l01','sales'],['LD5','Lead statuses','Leads','P1','statuses','manager'],['LD6','Lost reasons','Leads','P2','lead-l01','sales','close-lead'],
  ['AS1','Qualifying (when a lead is qualified)','Lead routing','P1','qualify','vina'],['AS2','Rules','Lead routing','P1','rules','vina'],['AS3','Rule editor','Lead routing','P1','rule-r2','vina'],['AS4','Unassigned leads','Lead routing','P2','unassigned','vina'],['AS5','Assign or reassign','Lead routing','P2','unassigned','vina','assign'],
  ['S1','Stage 1 · Your business','Control panel','P2','setup-1','vina'],['S2','Stage 2 · Who is the agent','Control panel','P2','setup-2','vina'],['S3','Stage 3 · Rules','Control panel','P2','setup-3','vina'],['S4','Stage 4 · What it knows','Control panel','P2','setup-4','vina'],['S5','Stage 5 · What it can do','Control panel','P1','setup-5','vina'],['S6','Stage 6 · Where it lives','Control panel','P2','setup-6','vina'],['S7','Stage 7 · Test and go live','Control panel','P1','setup-7','vina'],
  ['A1','Agents list','Control panel','P2','agents','vina'],['A2','Agent editor','Control panel','P2','agent-sara','vina'],['A3','Actions (action builder)','Control panel','P1','actions','vina'],['A4','Test scenarios','Control panel','P1','scenarios','vina'],
  ['C1','Connections','Control panel','P2','connections','vina'],['C2','Website · Get the plugin','Control panel','P2','conn-website','vina'],['C3','WhatsApp','Control panel','P2','conn-whatsapp','vina'],['C4','Phone line','Control panel','P3','conn-phone','vina'],['C5','Facebook Messenger','Control panel','P3','conn-meta','vina'],['C6','Connection problems','Control panel','P2','connections','vina','c6'],
  ['U1','Users and roles','Control panel','P2','users','vina'],['U2','Add people','Control panel','P2','users','vina','add-people'],['ST1','Client settings','Control panel','P2','client-settings','vina'],['B1','Plan and usage','Control panel','P3','plan','vina'],
];
const AFTER = {}; // AFTER[key] = () => {...} opens a dialog for the screen index; view modules add theirs
AFTER.c6 = () => { S.whatsappDown = true; };
A['open-screen'] = (el) => {
  const s = SCREENS.find(x => x[0] === el.dataset.x); if (!s) return;
  const [, , , , route, role, after] = s;
  S.st = ''; S.modal = S.drawer = null; S.proto = false;
  if (role && S.role !== role) signIn(role, {stay:true}); else if (!role) { S.role = null; S.me = null; }
  go(route);
  if (after) setTimeout(() => { if (AFTER[after]) AFTER[after](); render(); }, 30);
};

/* ---------- Prototype controls ---------- */
function protoHtml() {
  const r = parseHash(); const st = r && r.def.states || [];
  const sid = r ? (SCREENS.find(s => s[4] === location.hash.slice(1)) || SCREENS.find(s => s[4] === r.name) || [r.def.id || ''])[0] : '';
  const who = S.role ? first(S.me) + ', ' + ROLE_LABEL[S.role] : 'Signed out';
  return `<div class="proto">${S.proto ? `<div class="panel" role="dialog" aria-label="Prototype controls">
    <div class="row"><b class="grow">Prototype controls</b><button type="button" class="ibtn sm bare" data-a="proto" aria-label="Close prototype controls">${ic('x')}</button></div>
    <div class="xs mute">Sample data for iCaur Alghanim, Jeddah. "Now" is Sat 7 Nov 2026, 4:50 PM. Nothing here is sent anywhere.</div>
    <div class="col tight"><span class="eyebrow">Sign in as</span><div class="roles">${['manager','cc','sales','vina'].map(k => `<button type="button" data-a="proto-role" data-x="${k}" aria-pressed="${S.role === k}"><b>${first(ROLE_ME[k])}</b>${ROLE_LABEL[k]}</button>`).join('')}</div></div>
    <div class="col tight"><span class="eyebrow">Colours</span><div class="seg" role="group" aria-label="Theme">${[['system','System'],['light','Light'],['dark','Dark']].map(([k, t]) => `<button type="button" data-a="proto-theme" data-x="${k}" aria-pressed="${S.theme === k}">${t}</button>`).join('')}</div></div>
    ${st.length ? `<div class="col tight"><span class="eyebrow">Screen state${sid ? ' · ' + sid : ''}</span><div class="fchips">${[['', 'Normal']].concat(st).map(([k, t]) => `<button type="button" class="fchip" data-a="proto-st" data-x="${k}" aria-pressed="${S.st === k}">${t}</button>`).join('')}</div></div>` : ''}
    <div class="col tight"><span class="eyebrow">Try</span>
      <div class="sw-row">${sw(S.whatsappDown, 'proto-wa', '', 'WhatsApp disconnected')}<span class="small">WhatsApp disconnected (C6)</span></div>
      <div class="sw-row">${sw(S.offline, 'proto-off', '', 'Offline')}<span class="small">Offline</span></div>
      ${isAgent() ? `<button type="button" class="btn sm" data-a="proto-alert">Send me a test alert</button>` : ''}
      <button type="button" class="btn sm" data-a="proto-expire">Expire the session (L7)</button>
    </div>
    <a class="btn pri" href="#screens" data-a="proto">All 49 screens</a>
  </div>` : ''}<button type="button" class="pbtn" data-a="proto" aria-expanded="${S.proto}" aria-label="Prototype controls, ${esc(who)}">${ic('sliders', 16)}<span class="tag">Prototype</span><span class="who">${esc(who)}</span></button></div>`;
}
A.proto = () => { S.proto = !S.proto; };
A['proto-role'] = (el) => { signIn(el.dataset.x); S.proto = false; };
A['proto-theme'] = (el) => { setTheme(el.dataset.x); S.menu = null; };
A['proto-st'] = (el) => { S.st = el.dataset.x; };
A['proto-wa'] = () => { S.whatsappDown = !S.whatsappDown; };
A['proto-off'] = () => { S.offline = !S.offline; };
A['proto-expire'] = () => { S.back = location.hash.slice(1); S.proto = false; go('expired'); };
A['proto-alert'] = () => { fireAlert(0); S.proto = false; };

/* ---------- Alerts (AG4 data; the AG4 module may add more) ---------- */
const ALERT_SEED = {
  sales:[{type:'new', lead:'l03', title:'New lead for you', body:'Ali Hakami · V27 2027 · Ready to buy this month, asked about the National Day offer'},
         {type:'taken', lead:'l17', title:'Lead given to Yousef', body:'Ziyad Al-Harbi was given to Yousef because it waited 15 minutes'}],
  cc:[{type:'due', lead:'l09', title:'Callback due in 10 minutes', body:'Noura Al-Zahrani · V27 2027 · 5:00 PM · asked about price and monthly payments'},
      {type:'new', lead:'l12', title:'New lead for you', body:'Sultan Al-Dossari · 03T 2026 · Asked for a person about the warranty'}],
};
function fireAlert(i) {
  const list = ALERT_SEED[S.role]; if (!list) return; const a = list[i % list.length];
  const l = lead(a.lead);
  S.alerts.unshift({id: uid('a'), type:a.type, title:a.title, body:a.body, lead:a.lead, when: clock(now()), read:false});
  pop({title:a.title, body:a.body, tone: a.type === 'taken' ? 'amber' : a.type === 'due' ? 'amber' : 'teal', icon: a.type === 'due' ? 'clock' : a.type === 'taken' ? 'give' : 'bell', act: a.type === 'taken' ? null : 'Open', go: a.type === 'taken' ? null : (a.type === 'due' ? 'callbacks' : 'lead-' + l.id)});
}
let alertTimer = null;
function scheduleAlerts() { clearTimeout(alertTimer); const r = S.role; alertTimer = setTimeout(() => { if (S.role === r && S.presence === 'available') fireAlert(0); }, 9000); }

/* ---------- Render ---------- */
const app = () => document.getElementById('app');
function layersHtml() {
  let h = '';
  if (S.drawer && DRAWERS[S.drawer._k || S.drawer.id]) h += `<div class="drawer-scrim ${S._drawerNew ? 'anim-in' : ''}" data-a="close-drawer"></div>` + DRAWERS[S.drawer._k || S.drawer.id](S.drawer).replace('<aside class="drawer"', `<aside class="drawer ${S._drawerNew ? 'anim-in' : ''}"`);
  if (S.modal && MODALS[S.modal._k || S.modal.id]) h += `<div class="scrim ${S._modalNew ? 'anim-in' : ''}" data-a="scrim">${MODALS[S.modal._k || S.modal.id](S.modal)}</div>`;
  S._drawerNew = S._modalNew = false;
  return h + cmdHtml();
}
const SEEN = new Set();
function popsHtml() {
  const once = id => { if (SEEN.has(id)) return ''; SEEN.add(id); return 'anim-in'; };
  return `<div class="pops" aria-live="polite">${S.pops.map(p => `<div class="pop ${p.tone} ${once(p.id)}" role="status"><span class="chi c-${p.tone === 'amber' ? 'amber' : p.tone === 'red' ? 'red' : 'teal'}" style="width:36px;height:36px;flex-basis:36px;border-radius:10px">${ic(p.icon, 18)}</span><div class="grow"><div class="pt">${esc(p.title)}</div><div class="pb">${esc(p.body)}</div>${p.act ? `<div class="row tight" style="margin-top:10px"><button type="button" class="btn sm pri" data-a="pop-go" data-x="${p.id}">${esc(p.act)}</button><button type="button" class="btn sm" data-a="pop-close" data-x="${p.id}">Later</button></div>` : ''}</div><button type="button" class="ibtn sm bare" data-a="pop-close" data-x="${p.id}" aria-label="Dismiss">${ic('x', 16)}</button></div>`).join('')}</div>
  <div class="toasts" aria-live="polite">${S.toasts.map(t => { const a = once(t.id); return `<div class="toast ${a}" role="status">${ic('check', 16)}<span>${esc(t.text)}</span>${t.undo ? `<button type="button" data-a="toast-undo" data-x="${t.id}">Undo</button>` : ''}${a && t.undo ? `<i class="bar" style="animation-duration:${t.ms}ms"></i>` : ''}</div>`; }).join('')}</div>`;
}
function paintLayers() { const l = document.getElementById('pops'); if (l) l.innerHTML = popsHtml(); }
function tween(e, fromText, toText, D) {
  const m = String(toText).match(/^([^\d−-]*)([−-]?[\d,]*\.?\d+)(.*)$/), f = String(fromText).match(/[−-]?[\d,]*\.?\d+/); if (!m || !f) return;
  const a = parseFloat(f[0].replace(/,/g, '').replace('−', '-')), b = parseFloat(m[2].replace(/,/g, '').replace('−', '-')); if (!isFinite(a) || !isFinite(b) || a === b) return;
  const dec = (m[2].split('.')[1] || '').length, t0 = performance.now(); D = D || 450;
  const step = t => { const k = Math.min(1, (t - t0) / D), v = a + (b - a) * (1 - Math.pow(1 - k, 3)); if (!e.isConnected) return; e.textContent = m[1] + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + m[3]; if (k < 1) requestAnimationFrame(step); else e.textContent = toText; };
  requestAnimationFrame(step);
}
function countUp(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('[data-count]', root).forEach(e => {
    const raw = e.dataset.count; const m = raw.match(/^([^\d−-]*)([−-]?[\d,]*\.?\d+)(.*)$/); if (!m || reduce) return;
    const target = parseFloat(m[2].replace(/,/g, '').replace('−', '-')); if (!isFinite(target) || Math.abs(target) < 2 && !m[2].includes('.')) return;
    const dec = (m[2].split('.')[1] || '').length, t0 = performance.now(), D = 700;
    const fmt = v => m[1] + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + m[3];
    const step = t => { const k = Math.min(1, (t - t0) / D), v = target * (1 - Math.pow(1 - k, 3)); if (!e.isConnected) return; e.textContent = fmt(v); if (k < 1) requestAnimationFrame(step); else e.textContent = raw; };
    e.textContent = fmt(0); requestAnimationFrame(step);
  });
}
/* ---------- V3 micro-interactions: survive the full re-render by snapshotting, then animating from old to new ---------- */
const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
const selOf = c => c.querySelector(':scope > [aria-pressed="true"], :scope > [aria-selected="true"], :scope > [aria-current="page"]');
function snapUI(route) {
  const s = {route, ind:{}, vals:{}, counts:{}};
  $$('#app .seg, #app .tabs').forEach((c, i) => { const b = selOf(c); if (b) s.ind[i] = {x:b.offsetLeft, y:b.offsetTop, w:b.offsetWidth, h:b.offsetHeight}; });
  $$('#app [data-count][data-k]').forEach(e => { s.vals[e.dataset.k] = e.textContent; });
  $$('#app .nav .badge, #app .tabs .n, #app .ibtn .cnt, #app .seg .n').forEach(e => { s.counts[countKey(e)] = e.textContent; });
  return s;
}
function countKey(e) { const h = e.closest('[href],[data-x],[data-a]'); return (h ? (h.getAttribute('href') || h.dataset.x || h.dataset.a) : '') + '|' + (h ? h.textContent.replace(/[\d+,]/g, '').trim().slice(0, 24) : ''); }
function replayUI(s, enter, route) {
  const same = s.route === route;
  $$('#app .seg, #app .tabs').forEach((c, i) => {
    const b = selOf(c); if (!b) return;
    const ind = document.createElement('span'); ind.className = 'ind'; ind.setAttribute('aria-hidden', 'true');
    const isTab = c.classList.contains('tabs');
    const place = g => { ind.style.width = g.w + 'px'; ind.style.height = g.h + 'px'; ind.style.transform = `translate(${g.x}px, ${isTab ? g.y + g.h - 2 : g.y}px)`; };
    const now = {x:b.offsetLeft, y:b.offsetTop, w:b.offsetWidth, h:b.offsetHeight}, old = same && s.ind[i];
    ind.classList.add('no-anim'); place(old || now); c.prepend(ind); c.classList.add('has-ind');
    if (old && motionOK() && (old.x !== now.x || old.w !== now.w)) { ind.getBoundingClientRect(); ind.classList.remove('no-anim'); place(now); }
    else { place(now); requestAnimationFrame(() => ind.classList.remove('no-anim')); }
  });
  if (!same || enter || !motionOK()) return;
  $$('#app [data-count][data-k]').forEach(e => { const o = s.vals[e.dataset.k]; if (o != null && o !== e.textContent) { const to = e.textContent; e.textContent = o; tween(e, o, to); } });
  $$('#app .nav .badge, #app .tabs .n, #app .ibtn .cnt, #app .seg .n').forEach(e => { const o = s.counts[countKey(e)]; if (o !== undefined && o !== e.textContent) e.classList.add('bump'); });
}
/* Tooltips for [title] and [data-tip]: fast, styled, also on keyboard focus */
(function tips() {
  let tip = null, cur = null, timer = 0;
  const show = (el) => {
    if (el.hasAttribute('title')) { const t = el.getAttribute('title'); if (!t) return; el.dataset.tip = t; el.removeAttribute('title'); if (!el.getAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', t); }
    const text = el.dataset.tip; if (!text) return;
    if (el.closest('.nav') && !(document.querySelector('.app.rail') || (innerWidth <= 1180 && innerWidth > 760))) return; // labels are visible in the full menu
    if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    cur = el; tip.textContent = text; tip.classList.remove('on');
    const r = el.getBoundingClientRect(), tw = Math.min(280, tip.offsetWidth), th = tip.offsetHeight;
    let x = r.left + r.width / 2 - tw / 2, y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
    x = Math.max(8, Math.min(innerWidth - tw - 8, x));
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    requestAnimationFrame(() => tip && cur === el && tip.classList.add('on'));
  };
  const hide = () => { cur = null; clearTimeout(timer); if (tip) tip.classList.remove('on'); };
  document.addEventListener('pointerover', ev => { const el = ev.target.closest && ev.target.closest('[title],[data-tip]'); if (!el) { if (cur) hide(); return; } if (el === cur) return; clearTimeout(timer); timer = setTimeout(() => show(el), cur ? 0 : 220); });
  document.addEventListener('pointerdown', hide, true);
  document.addEventListener('focusin', ev => { const el = ev.target.closest && ev.target.closest('[title],[data-tip]'); if (el && ev.target.matches(':focus-visible')) show(el); else hide(); });
  document.addEventListener('focusout', hide);
  addEventListener('scroll', hide, true);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && cur) hide(); });
})();
function render() {
  const r = parseHash();
  if (!r) { go(S.role ? HOME[S.role] : 'login'); return; }
  if (!r.def.public && !S.role) { go('login'); return; }
  if (r.def.roles && S.role && !r.def.roles.includes(S.role)) {
    app().innerHTML = `<div class="full" style="align-items:center;justify-content:center">${empty('lock', 'This page is not part of your dashboard', 'You are signed in as ' + ROLE_LABEL[S.role] + '. Use the menu to get back to your work.', `<a class="btn pri" href="#${HOME[S.role]}">Go to my dashboard</a>`)}</div>`;
    document.getElementById('layers').innerHTML = ''; document.getElementById('proto').innerHTML = protoHtml(); return;
  }
  // keep focus, caret and inner scroll positions across re-render
  const ae = document.activeElement; const fid = ae && ae.id; let ss = null, se = null;
  // a control without an id (menu buttons, filters, date) gets focus back by its action, so focus never falls to the page
  const fsig = !fid && ae && ae !== document.body && ae.dataset && ae.dataset.a ? [ae.dataset.a, ae.dataset.x] : null;
  const sx = scrollX, sy = scrollY; // a redraw never moves the page; only route changes and explicit scrolls do
  try { ss = ae.selectionStart; se = ae.selectionEnd; } catch (e) {}
  const keep = {}; $$('[data-keep]').forEach(e => { if (e.id) keep[e.id] = e.scrollTop; });
  const snap = snapUI(r.name);
  const L0 = document.getElementById('layers'); const hadModal = L0.querySelector(':scope > .scrim'), hadDrawer = L0.querySelector(':scope > .drawer');
  const oldModal = hadModal && !S.modal ? hadModal.cloneNode(true) : null, oldDrawer = hadDrawer && !S.drawer ? [L0.querySelector(':scope > .drawer-scrim'), hadDrawer].filter(Boolean).map(n => n.cloneNode(true)) : null;
  let html;
  try { html = r.def.render(r.param); } catch (e) { console.error(e); html = `<div class="full" style="padding:40px">${errorBox('This screen could not be drawn', esc(e.message), '')}</div>`; }
  const enter = S._enter; S._enter = false;
  app().innerHTML = html;
  if (enter) { const m = document.getElementById('main') || app().firstElementChild; if (m) m.classList.add('enter'); }
  L0.innerHTML = layersHtml();
  [oldModal].concat(oldDrawer || []).filter(Boolean).forEach(g => { g.classList.add('ghost'); g.removeAttribute('data-a'); L0.appendChild(g); setTimeout(() => g.remove(), 220); });
  document.getElementById('proto').innerHTML = protoHtml();
  paintLayers();
  Object.keys(keep).forEach(id => { const e = document.getElementById(id); if (e) e.scrollTop = keep[id]; });
  $$('[data-stick]').forEach(e => { if (S._stick || !(e.id in keep)) e.scrollTop = e.scrollHeight; if (S._stick) { const items = e.querySelectorAll(':scope > .msg, :scope > .evt, :scope > .actcard'); const last = items[items.length - 1]; if (last) last.classList.add('anim-in'); } });
  S._stick = false; cxSync();
  if (S.menu && S.menu !== S._lastMenu) $$('.menu').forEach(m => m.classList.add('anim-in')); // menus animate only when they open
  S._lastMenu = S.menu;
  if (enter) countUp(app());
  replayUI(snap, enter, r.name);
  nameMovers(); originFromTrigger();
  if (S.cmd) { const q = document.getElementById('cmd-q'); if (q) { if (S._cmdNew || document.activeElement !== q) q.focus({preventScroll:true}); const opt = document.getElementById('co-' + S.cmd.i); if (opt) opt.scrollIntoView({block:'nearest'}); } S._cmdNew = false; }
  else if (S._focusModal) { S._focusModal = false; const m = $('#layers .modal:not(.ghost .modal), #layers .drawer:not(.ghost)'); const t = m && (m.querySelector('[autofocus]') || m.querySelector('input,select,textarea,button:not([data-a="close-modal"]):not([data-a="close-drawer"])')); if (t) t.focus({preventScroll:true}); }
  else if (fid) { const e = document.getElementById(fid); if (e) { e.focus({preventScroll:true}); try { if (ss != null) e.setSelectionRange(ss, se); } catch (er) {} } }
  else if (fsig && (!document.activeElement || document.activeElement === document.body)) { const e = $$('#app [data-a="' + fsig[0] + '"]').find(x => fsig[1] == null || x.dataset.x === fsig[1]); if (e) e.focus({preventScroll:true}); }
  if (!enter && (scrollX !== sx || scrollY !== sy)) window.scrollTo(sx, sy);
  if (r.def.after) try { r.def.after(r.param); } catch (e) { console.error(e); }
}
const stickBottom = () => { S._stick = true; };

/* ---------- Events ---------- */
/* ---------- Motion: view transitions (continuity between screens and states, moved items glide) ---------- */
// One snapshot crossfade per change, so nothing snaps; items with a stable name (chat rows, pipeline cards, rules) move to their new place.
const canVT = () => !!document.startViewTransition && motionOK() && document.documentElement.dataset.ready;
let VT_KIND = '';
function vtRender(kind, after) {
  const run = () => { render(); if (after) after(); };
  if (!canVT()) { run(); return; }
  VT_KIND = kind; document.documentElement.dataset.vt = kind; nameMovers(); // names for the old snapshot match what is in view now
  try { const t = document.startViewTransition(run); t.ready.catch(() => {}); t.finished.catch(() => {}).then(() => { if (VT_KIND === kind) delete document.documentElement.dataset.vt; }); } // a newer change skips the older one; that is expected
  catch (e) { run(); }
}
// clicks that change what a region shows (tabs, segments, chips, disclosures, list rows, move/sort) crossfade; menus keep their own motion
const vtFor = el => !!el && !el.closest('.menu, .modal, .drawer, .cmd') && el.getAttribute('aria-haspopup') == null && (
  el.matches('[role="tab"], .tab, .seg > *, .fchip, .cx-row, [data-vt], [aria-expanded]') || /(^|-)(move|mv|sort|page|folder|view|cal|tab|sel|drop|up|down)(-|$)/.test(el.dataset.a || ''));
// give items that can move a stable view-transition name so the browser animates them to their new place
// View-transition layers are drawn above the page and are not clipped by scrolling lists, so only items fully in view get one;
// a row half-hidden under a list header would otherwise flash on top of it (seen in Safari when switching chats).
const clipOf = e => { let r = {top:0, left:0, bottom:innerHeight, right:innerWidth}; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(cs.overflowX + cs.overflowY)) { const b = a.getBoundingClientRect(); r = {top:Math.max(r.top, b.top), left:Math.max(r.left, b.left), bottom:Math.min(r.bottom, b.bottom), right:Math.min(r.right, b.right)}; } } return r; };
function nameMovers() {
  if (!document.startViewTransition) return;
  const seen = new Set();
  $$('#app .cx-row[data-x], #app [data-drag][data-x]').forEach(e => {
    const n = 'vt-' + (e.dataset.drag || 'row') + '-' + String(e.dataset.x).replace(/[^a-zA-Z0-9_-]/g, ''), b = e.getBoundingClientRect(), c = clipOf(e);
    const inView = b.height > 0 && b.top >= c.top - 1 && b.bottom <= c.bottom + 1 && b.left >= c.left - 1 && b.right <= c.right + 1;
    if (!inView || seen.has(n)) { e.style.viewTransitionName = ''; return; } seen.add(n); e.style.viewTransitionName = n;
  });
}
// dialogs grow from the control that opened them
let PTR = null;
document.addEventListener('pointerdown', ev => { PTR = {x:ev.clientX, y:ev.clientY, t:Date.now()}; }, true);
function originFromTrigger() {
  if (!PTR || Date.now() - PTR.t > 900) return;
  $$('#layers .scrim.anim-in .modal, #layers .cmd-scrim.anim-in .cmd').forEach(m => { const r = m.getBoundingClientRect(); m.style.transformOrigin = Math.round(PTR.x - r.left) + 'px ' + Math.round(PTR.y - r.top) + 'px'; });
}

document.addEventListener('click', (ev) => {
  const g = ev.target.closest('[data-go]');
  if (g && !g.closest('[data-a]:not([data-go])')) { ev.preventDefault(); S.menu = null; S.navOpen = false; go(g.dataset.go); return; }
  const el = ev.target.closest('[data-a]');
  if (S.menu && !(el && el.closest('.menu,[aria-haspopup]'))) { S.menu = null; if (!el) { render(); return; } }
  if (!el) return;
  if (el.dataset.a === 'scrim') { if (ev.target === el) { S.modal = null; render(); } return; }
  if (el.getAttribute('aria-disabled') === 'true' || el.disabled) return;
  const fn = A[el.dataset.a]; if (!fn) { console.warn('No action', el.dataset.a); return; }
  if (el.tagName === 'A' && el.getAttribute('href') === '#') ev.preventDefault();
  const r = fn(el, ev); if (r !== false) { if (vtFor(el)) vtRender('state'); else render(); }
});
document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.dataset.bind && el.type !== 'checkbox' && el.type !== 'radio' && el.tagName !== 'SELECT') { setP(el.dataset.bind, el.value); if (el.dataset.live !== undefined) render(); }
  if (el.dataset.in && A[el.dataset.in]) { if (A[el.dataset.in](el, ev) !== false) render(); }
});
document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.dataset.bind && (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT')) { setP(el.dataset.bind, el.type === 'checkbox' ? el.checked : el.value); render(); }
  if (el.dataset.ch && A[el.dataset.ch]) { if (A[el.dataset.ch](el, ev) !== false) render(); }
});
document.addEventListener('submit', (ev) => { const fm = ev.target; ev.preventDefault(); if (fm.dataset.a && A[fm.dataset.a]) { if (A[fm.dataset.a](fm, ev) !== false) render(); } });
document.addEventListener('keydown', (ev) => {
  if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k' && S.role) { ev.preventDefault(); if (S.cmd) S.cmd = null; else A.cmd(); render(); return; }
  if (S.cmd && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) { ev.preventDefault(); S.cmd.i = (S.cmd.i + (ev.key === 'ArrowDown' ? 1 : -1) + Math.max(1, S.cmd.n)) % Math.max(1, S.cmd.n); render(); return; }
  if (S.cmd && ev.key === 'Enter') { ev.preventDefault(); A['cmd-go']({dataset:{x:S.cmd.i}}); render(); return; }
  if (ev.key === 'Escape' && S.cmd) { S.cmd = null; render(); return; }
  if (ev.key === 'Escape') { if (S.menu) S.menu = null; else if (S.modal) S.modal = null; else if (S.drawer) S.drawer = null; else if (S.proto) S.proto = false; else if (S.navOpen) S.navOpen = false; else return; render(); }
  if (ev.key === 'Tab' && (S.modal || S.drawer)) { // keep focus inside the open dialog
    const box = $('#layers .modal') || $('#layers .drawer'); if (!box) return;
    const fs = $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', box); if (!fs.length) return;
    if (ev.shiftKey && document.activeElement === fs[0]) { ev.preventDefault(); fs[fs.length - 1].focus({preventScroll:true}); }
    else if (!ev.shiftKey && document.activeElement === fs[fs.length - 1]) { ev.preventDefault(); fs[0].focus({preventScroll:true}); }
  }
});
// Drag and drop: [draggable=true][data-drag=kind][data-x=id] onto [data-drop=action][data-x=target]
let DRAG = null;
document.addEventListener('dragstart', (ev) => { const d = ev.target.closest && ev.target.closest('[data-drag]'); if (!d) return; DRAG = {kind:d.dataset.drag, id:d.dataset.x}; d.classList.add('dragging'); try { ev.dataTransfer.setData('text/plain', d.dataset.x); ev.dataTransfer.effectAllowed = 'move'; } catch (e) {} });
document.addEventListener('dragend', (ev) => { $$('.dragging,.drop-on').forEach(e => e.classList.remove('dragging', 'drop-on')); DRAG = null; });
document.addEventListener('dragover', (ev) => { const t = ev.target.closest && ev.target.closest('[data-drop]'); if (!t || !DRAG) return; ev.preventDefault(); $$('.drop-on').forEach(e => e !== t && e.classList.remove('drop-on')); t.classList.add('drop-on'); });
document.addEventListener('drop', (ev) => { const t = ev.target.closest && ev.target.closest('[data-drop]'); if (!t || !DRAG) return; ev.preventDefault(); const d = DRAG; DRAG = null; t.classList.remove('drop-on'); const fn = A[t.dataset.drop]; if (fn && fn(t, d) !== false) vtRender('move'); });
// One ticker for live timers: <span data-since="epochMs"> shows m:ss
setInterval(() => { $$('[data-since]').forEach(e => { const s = Math.max(0, Math.floor((Date.now() - Number(e.dataset.since)) / 1000)); e.textContent = Math.floor(s / 60) + ':' + pad(s % 60); }); $$('[data-until]').forEach(e => { const s = Math.max(0, Math.ceil((Number(e.dataset.until) - Date.now()) / 1000)); e.textContent = s ? '0:' + pad(s) : ''; if (!s && e.dataset.done && A[e.dataset.done]) { delete e.dataset.until; if (A[e.dataset.done](e) !== false) render(); } }); }, 1000);
window.addEventListener('hashchange', () => { S._enter = true; S.cmd = null; S.modal = null; S.drawer = null; S.menu = null; S.navOpen = false; S.st = ''; vtRender('route', () => { window.scrollTo(0, 0); const m = document.getElementById('main'); if (m) m.focus({preventScroll:true}); }); });

window.addEventListener('online', () => { S.offline = false; render(); toast('Back online. Your changes were sent.'); });
window.addEventListener('offline', () => { S.offline = true; render(); });
