/* Control panel · agent setup S1–S7 + the shared agent model (agents, actions, test scenarios, test chat).
   State lives in S.su so 70-agents.js (A1–A4) reads and changes the same agents. Helpers for 70-agents.js are on S.su.lib. */
(function () {
'use strict';
const clone = o => JSON.parse(JSON.stringify(o));
const DAYS = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const BTYPES = [['car','Car dealer','car','blue'],['clinic','Clinic or lab','plus','teal'],['realestate','Real estate','store','amber'],['retail','Retail','store','purple'],['hotel','Hotel','cal','indigo'],['other','Other','more','grey']];
const PRESET = {
  car:{tone:'Friendly', never:['Exact stock numbers','Competitors','Discounts not in the price list','Politics and religion'], off:['status'], n:12, label:'car dealers'},
  clinic:{tone:'Formal', never:['Diagnosis or medical advice','Test results','Prices not in the price list'], off:['testdrive','status'], n:8, label:'clinics and labs'},
  realestate:{tone:'Friendly', never:['Prices before a viewing','Legal advice'], off:['testdrive'], n:8, label:'real estate'},
  retail:{tone:'Short and direct', never:['Discounts not in the price list','Competitors'], off:['testdrive'], n:8, label:'retail'},
  hotel:{tone:'Formal', never:['Group room prices','Other guests'], off:['testdrive'], n:8, label:'hotels'},
  other:{tone:'Friendly', never:[], off:['testdrive'], n:6, label:'any business'},
};
const STAGES = [['Your business','Name, type, hours'],['Who is the agent','Name and how it speaks'],['Rules','Limits and handover'],['What it knows','Files, links, products'],['What it can do','Actions'],['Where it lives','Channels'],['Test and go live','Try it, then launch']];
const HAND = [['person','Asks for a person'],['price','Asks about price or financing'],['complain','Complains'],['angry','Is angry'],['fail2','The agent fails to answer twice']];
const STEP_T = {check:['Check','blue'], ask:['Ask','amber'], update:['Update lead','navy'], assign:['Assign','teal'], send:['Send','green'], wait:['Wait','grey'], call:['Call another system','purple']};
const CHANS = [['web','Website','globe','blue','Chat window on your site','conn-website'],['wa','WhatsApp','wa','green','Your WhatsApp Business number','conn-whatsapp'],['ph','Phone line','phone','navy','The agent answers calls','conn-phone'],['fb','Messenger','fb','indigo','Facebook page messages','conn-meta']];
const ON_CH = v => v === 'Connected' || v === 'Live';

/* ---------- Actions (section 10) ---------- */
const F = (t, req, how) => ({t, req, how});
const ST = (t, k, d) => ({t, k, d});
const ACTIONS0 = [
  {id:'collect', g:'Leads', icon:'user', name:'Collect lead details', line:'Asks for what is missing', when:'Always, before handing over or booking.', uses:2104, fin:2088,
   says:['اسمي فهد ورقمي هذا','My name is Turki','أبغى أعرف السعر'], fields:[F('Name',true,'Asks: "باسم مين أسجل؟" Skips if known'),F('Mobile',true,'Taken from WhatsApp, asks on website'),F('Car model',true,'From the chat, or asks which car'),F('City',false,'Asks once'),F('Best time to call',false,'Asks when handing over')],
   steps:[ST('Check what is already known','check','Name and mobile from WhatsApp, car model from the chat'),ST('Ask for what is missing','ask','One question at a time'),ST('Save the details','update','On the lead, with the time')], msg:{ar:'شكراً {name}، سجلت طلبك على {car}.', en:'Thanks {name}, I saved your request for the {car}.'}, fails:[{k:'Customer will not give a mobile',v:'Continue the chat. Ask again before booking.'}], ask:false},
  {id:'qualify', g:'Leads', icon:'check', name:'Mark the lead as qualified', line:'Uses your lead rules', when:'When the details are there and the customer shows a buying signal.', uses:612, fin:612,
   says:['أبغى أشتري هالشهر','Can I visit the showroom?','كم القسط الشهري؟'], fields:[F('Name',true,'Collected first'),F('Mobile',true,'Collected first'),F('Car model',true,'Collected first')],
   steps:[ST('Check the lead rules','check','The rules in Lead assignment, "When is a lead qualified"'),ST('Mark as qualified','update','Status changes to Qualified'),ST('Give it to the team','assign','By the assignment rules')], msg:{ar:'تمام {name}، فريقنا بيتواصل معك قريب.', en:'Great {name}, our team will contact you soon.'}, fails:[{k:'Outside our area',v:'Never qualify. Tell the customer politely.'}], ask:false},
  {id:'status', g:'Leads', icon:'flag', name:'Update the lead status', line:'New, Qualified, Callback…', when:'Every time something changes in the chat.', uses:1430, fin:1430,
   says:['خلاص اشتريت من مكان ثاني','Call me tomorrow'], fields:[F('Lead',true,'Already known')], steps:[ST('Change the status','update','Uses the lead statuses in Settings')], msg:{ar:'',en:''}, fails:[], ask:false},
  {id:'handover', g:'Leads', icon:'give', name:'Hand over to the team', line:'With a short summary', when:'When the customer asks for a person, complains, or the agent fails to answer twice.', uses:536, fin:530,
   says:['أبغى أكلم موظف','Can I talk to a person?','صار لي شهر أنتظر!'], fields:[F('Name',true,'Asks if missing'),F('Mobile',true,'Taken from WhatsApp, asks on website')],
   steps:[ST('Write a summary for the team','update','What they want, budget, trade-in, timing'),ST('Give it to the team','assign','Call centre or sales, by the rules in Rules'),ST('Tell the customer','send','Who will reply and when'),ST('Pause in this chat','wait','Until the agent hands it back, or 24 hours')], msg:{ar:'أرسلت طلبك لزميلي في {team}، وبيتواصل معك خلال دقائق.', en:'I sent your request to my colleague in {team}. They will contact you in a few minutes.'}, fails:[{k:'Nobody is available',v:'Keep in Unassigned and alert the manager. Tell the customer when to expect a reply.'}], ask:false},
  {id:'testdrive', g:'Bookings', icon:'cal', name:'Book a test drive', line:'Finds a free time and books it', when:'When the customer wants to try a car, asks to drive it, or asks when they can come for a test drive.', uses:48, fin:46,
   says:['أبغى أجرب السيارة','Can I test drive the V27?','متى أقدر أجيكم أجربها؟','ممكن تجربة قيادة السبت؟'],
   fields:[F('Name',true,'Asks: "باسم مين أسجل الموعد؟" Skips if known'),F('Mobile',true,'Taken from WhatsApp, asks on website'),F('Car model',true,'From the chat, or asks which car'),F('Day and time',true,'Offers free times, the customer picks'),F('Showroom',true,'Asks only if more than one is open'),F('Driving licence',false,'Not asked')],
   steps:[ST('Check free times','check','Showroom calendar · 1-hour slots · 9 AM to 9 PM · closed Friday · at most 2 test drives at once'),ST('Offer up to 3 times','ask','Same day if possible, otherwise the next 2 days'),ST('Book it','update','Saves the booking and changes the status to Test drive booked'),ST('Give the lead to sales','assign','Uses the rule "Qualified to Sales". The salesperson gets an alert.'),ST('Send confirmation','send','WhatsApp message below, plus the showroom location pin'),ST('Remind the customer','wait','2 hours before. If the customer cancels, tell the salesperson.')],
   msg:{ar:'تم الحجز يا {name}. موعد تجربة {car} يوم {day} الساعة {time} في {showroom}.', en:'Booked, {name}. Your {car} test drive is on {day} at {time} at {showroom}.'},
   fails:[{k:'No free time that day',v:'Offer the next 2 days. If still nothing, book a callback.'},{k:'No answer for 30 minutes',v:'Ask once more. Then give it to the call centre.'},{k:'Customer wants another time',v:'Cancel, book again, tell the salesperson.'}], ask:true},
  {id:'callback', g:'Bookings', icon:'phone', name:'Book a callback', line:'Saves a time for the call centre', when:'When the customer asks to be called, or writes after hours.', uses:214, fin:211,
   says:['اتصلوا علي بكرة الصبح','Call me after 5','ممكن أحد يتصل علي؟'], fields:[F('Mobile',true,'Taken from WhatsApp'),F('Best time to call',true,'Asks, offers working hours')],
   steps:[ST('Ask for a time','ask','Inside working hours'),ST('Save the callback','update','Status changes to Callback'),ST('Give it to the call centre','assign','Rule "Callbacks to call centre"'),ST('Confirm','send','Message below')], msg:{ar:'تمام، بيتصل عليك فريقنا {day} الساعة {time}.', en:'Done. Our team will call you {day} at {time}.'}, fails:[{k:'Time is outside working hours',v:'Offer the first time the next morning.'}], ask:false},
  {id:'files', g:'Send and close', icon:'file', name:'Send files', line:'Brochure, price list, location pin', when:'When the customer asks for specs, details, or where the showroom is.', uses:561, fin:561,
   says:['أرسل لي الكتيب','Where is your showroom?','وين موقعكم؟'], fields:[F('Car model',false,'For the right brochure')], steps:[ST('Pick the file','check','From What it knows'),ST('Send it','send','With one line about it')], msg:{ar:'هذا {file}. تبغى شي ثاني؟', en:'Here is the {file}. Anything else?'}, fails:[{k:'No file for this model',v:'Say so and offer a callback.'}], ask:false},
  {id:'summary', g:'Send and close', icon:'note', name:'Write a summary for the team', line:'When it hands over', when:'Every time it hands a chat to a person.', uses:536, fin:536,
   says:[], fields:[], steps:[ST('Write the summary','update','What they want, budget, trade-in, timing, best time to call')], msg:{ar:'',en:''}, fails:[], ask:false},
  {id:'close', g:'Send and close', icon:'x', name:'Close the chat', line:'And ask for a rating', when:'When the customer says thanks or has nothing else to ask.', uses:1640, fin:1640,
   says:['شكراً','Thanks, that is all'], fields:[], steps:[ST('Ask for a rating','send','1 to 5 stars, if Rate the chat is on'),ST('Close the chat','update','The lead stays open')], msg:{ar:'العفو! كيف تقيّم المحادثة من ١ إلى ٥؟', en:'You are welcome! How would you rate this chat from 1 to 5?'}, fails:[], ask:false},
  {id:'crm', g:'Connected systems', icon:'plug', name:'Create the lead in your CRM', line:'Sends each qualified lead to your CRM', when:'Every time a lead is qualified.', uses:0, fin:0,
   needs:{missing:'The CRM address and an access key from iCaur Alghanim IT.', contact:'Ask the iCaur Alghanim IT team. VINA support (support@vina.sa) connects it.'},
   says:[], fields:[F('Name',true,'Collected first'),F('Mobile',true,'Collected first')], steps:[ST('Send the lead to the CRM','call','Name, mobile, car model, source'),ST('Save the CRM number on the lead','update','')], msg:{ar:'',en:''}, fails:[{k:'The CRM does not answer',v:'Try again in 5 minutes, 3 times. Then alert the VINA team.'}], ask:false},
  {id:'stock', g:'Connected systems', icon:'store', name:'Check stock', line:'Looks up a colour or trim in your stock list', when:'When the customer asks if a colour or trim is available.', uses:0, fin:0,
   needs:{missing:'A daily stock list (Excel, or a link to your stock system).', contact:'Ask the showroom manager to share the stock list. VINA support sets it up.'},
   says:['عندكم أبيض؟','Is the Premium in stock?'], fields:[F('Car model',true,'From the chat'),F('Colour or trim',true,'Asks')], steps:[ST('Look it up','call','Stock list'),ST('Answer','send','In stock, or when it arrives')], msg:{ar:'',en:''}, fails:[], ask:false},
];
ACTIONS0.forEach(a => { a.on = !a.needs && a.id !== 'status'; });
const S5_IDS = ['collect','qualify','status','handover','testdrive','files','summary','close'];

/* ---------- Agent config ---------- */
function cfg0(o) {
  const c = {
    biz:{name:'iCaur Alghanim', logo:'', type:'car', city:'Jeddah', branches:['Madinah Road, Jeddah','Prince Sultan Road, Jeddah'], hours:DAYS.map(d => ({d, on:d !== 'Friday', from:'09:00', to:'21:00'})), lang:'Arabic'},
    agent:{name:'Sara', av:'0', job:'Sales', firstAr:'هلا والله! معك سارة من آيكار الغانم. كيف أقدر أساعدك اليوم؟', firstEn:'Hi! This is Sara from iCaur Alghanim. How can I help you today?', tone:'Friendly', style:'Saudi, Hijazi', langs:{Arabic:true, English:true, Arabizi:false}, length:'Short', firstName:true, voice:true},
    rules:{never:['Exact stock numbers','Competitors','Discounts not in the price list','Politics and religion'], hand:{person:true, price:true, complain:true, angry:true, fail2:true}, who:'cc', after:'keep', rate:true},
    know:{
      files:[{n:'Price list Nov 2026.xlsx', ext:'XLS', meta:'3 models · 9 trims', st:'Ready', on:true},{n:'V27 2027 brochure.pdf', ext:'PDF', meta:'24 pages', st:'Ready', on:true},{n:'03T brochure.pdf', ext:'PDF', meta:'18 pages', st:'Ready', on:true},{n:'V27 offers Nov 2026.pdf', ext:'PDF', meta:'National Day offer · mentions financing rates', st:'Ready', on:true},{n:'Service menu.docx', ext:'DOC', meta:'', st:'Failed', why:'The file has a password. Remove it and upload again.', on:false}],
      links:[{u:'icaur-alghanim.sa', meta:'12 pages', st:'Ready', on:true}],
      faq:[{q:'Are you open on Friday?', a:'No. We are open Saturday to Thursday, 9 AM to 9 PM.', on:true},{q:'Do you take trade-ins?', a:'Yes. Bring the car to the showroom for a free valuation.', on:true},{q:'How long is delivery?', a:'Within one week after payment for cars in stock.', on:true}],
      products:[{m:'V27', y:'2027', tr:'Standard, Premium', c:'Pearl white, Grey, Black', sp:'1.5T hybrid · 7 seats', o:'National Day: free insurance', p:'129,900'},{m:'V27', y:'2026', tr:'Standard, Premium', c:'White, Silver', sp:'1.5T · 7 seats', o:'10% off', p:'114,900'},{m:'03T', y:'2026', tr:'One trim', c:'White, Grey, Black, Green', sp:'Electric · 400 km', o:'—', p:'89,900'}],
    },
    actions:clone(ACTIONS0),
    ch:{web:'Connected', wa:'Live', ph:'Not connected', fb:'Not connected'},
  };
  return Object.assign(c, o ? o(c) || {} : {});
}
const sara = cfg0();
const faris = cfg0(c => { Object.assign(c.agent, {name:'Faris', av:'1', job:'Bookings', tone:'Formal', firstAr:'أهلاً بك في خدمة آيكار الغانم، معك فارس. كيف أخدمك؟', firstEn:'Welcome to iCaur Alghanim service, this is Faris. How can I help?'}); c.ch = {web:'Not connected', wa:'Not connected', ph:'Paused', fb:'Not connected'}; c.actions.forEach(a => { a.on = ['collect','callback','handover','summary','close'].includes(a.id); }); });
const layan = cfg0(c => { Object.assign(c.agent, {name:'Layan', av:'2', job:'Product questions', firstAr:'هلا! معك ليان من آيكار الغانم. اسألني عن أي سيارة.', firstEn:'Hi! This is Layan from iCaur Alghanim. Ask me about any car.'}); c.ch = {web:'Not connected', wa:'Not connected', ph:'Not connected', fb:'Not connected'}; c.actions.forEach(a => { a.on = ['collect','files','handover'].includes(a.id); }); c.know.links = []; });
const saraDraft = clone(sara);
saraDraft.agent.length = 'Detailed';
saraDraft.actions.find(a => a.id === 'testdrive').ask = false;

S.su = {
  wiz:'layan', cur:'sara',
  agents:[
    {id:'sara', st:'live', chats:348, alone:'78%', since:'Mon 2 Nov', by:'Lina Haddad'},
    {id:'faris', st:'paused', chats:0, alone:'64%', pausedOn:'Thu 5 Nov', reason:'waiting for the service team price list', by:'Lina Haddad'},
    {id:'layan', st:'setup', started:'Fri 6 Nov', by:'Lina Haddad'},
  ],
  live:{sara, faris:clone(faris), layan:null},
  drafts:{sara:saraDraft, faris, layan},
  ver:{sara:12, faris:7, layan:0},
  step:{layan:5}, done:{layan:[1,2,3,4]},
  hist:{sara:[{v:12, who:'Lina Haddad', when:'Mon 2 Nov, 11:20 AM', what:'Added V27 offers Nov 2026.pdf · turned on reminders for test drives', snap:clone(sara)},{v:11, who:'Lina Haddad', when:'Thu 29 Oct, 4:05 PM', what:'Turned on Book a callback after hours', snap:(() => { const x = clone(sara); x.know.files = x.know.files.filter(f => f.n !== 'V27 offers Nov 2026.pdf'); return x; })()},{v:10, who:'Nawaf Al-Otaibi', when:'Sun 25 Oct, 9:40 AM', what:'Changed the tone to Friendly', snap:(() => { const x = clone(sara); x.know.files = x.know.files.filter(f => f.n !== 'V27 offers Nov 2026.pdf'); x.agent.tone = 'Formal'; return x; })()}], faris:[{v:7, who:'Lina Haddad', when:'Thu 5 Nov, 2:15 PM', what:'Paused the agent', snap:clone(faris)}], layan:[]},
  runs:{}, chats:{}, pend:{}, typing:{}, running:null,
  scen:null, a3:{}, a4:{filter:'all', sel:'fin', act:''}, lib:{},
};
const SU = S.su;
const cfgOf = id => SU.drafts[id];
const agentName = id => (cfgOf(id) && cfgOf(id).agent.name) || 'New agent';
const AVBG = ['linear-gradient(135deg,#5E97CE,#6EBEB9)','linear-gradient(135deg,#202253,#5E97CE)','linear-gradient(135deg,#6EBEB9,#A9B4E8)','#5B3FB5'];
const agAv = (id, size) => `<span class="av ${size || ''}" aria-hidden="true" style="background:${AVBG[Number((cfgOf(id) || {agent:{av:0}}).agent.av) % 4]};color:#FFFFFF">${esc((agentName(id) || '?')[0])}</span>`;
Object.defineProperty(window, 'VINA_AGENTS', {configurable:true, get: () => SU.agents.map(a => ({id:a.id, name:agentName(a.id), job:cfgOf(a.id).agent.job, status:a.st === 'live' ? 'Live' : a.st === 'paused' ? 'Paused' : 'Not live yet', channels:CHANS.filter(c => ON_CH(chOf(a.id, c[0]))).map(c => c[1])}))});

/* ---------- Diff (unsaved changes) ---------- */
function diffN(a, b) {
  if (a === b) return 0;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return 1;
  if (Array.isArray(a) !== Array.isArray(b)) return 1;
  let n = 0; const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
  ks.forEach(k => { n += diffN(a[k], b[k]); });
  return n;
}
const SECKEY = {1:'biz', 2:'agent', 3:'rules', 4:'know', 5:'actions', 6:'ch'};
const unsaved = id => SU.live[id] ? diffN(SU.drafts[id], SU.live[id]) : 0;
const secDirty = (id, n) => SU.live[id] && SECKEY[n] ? diffN(SU.drafts[id][SECKEY[n]], SU.live[id][SECKEY[n]]) > 0 : false;
const sig = id => JSON.stringify(SU.drafts[id]);
function chOf(id, k) { const v = cfgOf(id).ch[k]; const vc = window.VINA_CONNECTED; if (id === SU.wiz && vc && (Array.isArray(vc) ? vc.includes(k) : vc[k])) return 'Connected'; return v; }
const anyConnected = id => CHANS.some(c => ON_CH(chOf(id, c[0])));
const actOn = (c, id) => { const a = c.actions.find(x => x.id === id); return !!(a && a.on && !a.needs); };

/* ---------- Test scenarios (12 ready-made for car dealers) ---------- */
const fileOn = (c, n) => c.know.files.some(f => f.n === n && f.on && f.st === 'Ready');
const neverHas = (c, re) => c.rules.never.some(t => re.test(t));
const handOn = (c, k) => actOn(c, 'handover') && c.rules.hand[k];
const finBad = c => fileOn(c, 'V27 offers Nov 2026.pdf') && !neverHas(c, /financ/i);
SU.scen = [
  {id:'fin', name:'Asks for the financing rate', first:'كم نسبة التمويل على V27؟', lang:'Arabic · Hijazi', act:'handover',
   ev(c) { const bad = finBad(c); const h = handOn(c, 'price') && handOn(c, 'person');
     return {checks:[{type:'Must do', t:'Collect lead details', ok:actOn(c, 'collect'), got:'Did not happen. Collect lead details is off.'},{type:'Must not say', t:'Financing rates', ok:!bad, got:'Said "the rate starts from 3.5%"'},{type:'Must do', t:'Hand over to the team', ok:!bad && h, got: bad ? 'Did not happen. The customer asked for a person.' : 'Did not happen. Hand over is off for this.'},{type:'Must do', t:'Write a summary for the team', ok:actOn(c, 'summary'), got:'Did not happen. The summary action is off.'}],
       convo: bad ? [{w:'c', t:'كم نسبة التمويل على V27؟ وكم الدفعة الأولى؟'},{w:'v', t:'التمويل متوفر مع البنوك، و', bad:'النسبة تبدأ من ٣٫٥٪', t2:' والدفعة الأولى من ١٠٪.'},{w:'c', t:'طيب أبغى أكلم أحد يحسب لي القسط'},{w:'v', t:'القسط يعتمد على الراتب والبنك. تبغى أرسل لك جدول الأسعار؟', bad2:true}]
         : [{w:'c', t:'كم نسبة التمويل على V27؟ وكم الدفعة الأولى؟'},{w:'v', t:'سؤالك عن التمويل يجاوبك عليه زميلي في مركز الاتصال. أرسلت له ملخص طلبك، وبيتواصل معك خلال دقائق.'},{w:'a', t:'Hand over to the team · Done'}],
       why:'The file <b>V27 offers Nov 2026.pdf</b> says 3.5%, and "Financing rates" is not in Never talk about, so VINA answered from the file. The customer then asked for a person and the agent did not hand over.',
       fixes:[['Open the file','file'],['Open rules','rules']]}; }},
  {id:'arabizi', name:'Switches to Arabizi mid-chat', first:'Hi, kam si3r el 03T?', lang:'Arabizi',
   ev(c) { const ok = c.agent.langs.Arabizi; return {checks:[{type:'Must do', t:'Reply in the customer\'s language', ok, got:'Replied in English'},{type:'Must do', t:'Collect lead details', ok:actOn(c, 'collect'), got:'Did not happen.'}],
     convo:[{w:'c', t:'Hi, kam si3r el 03T?'},{w:'v', t: ok ? 'Hala! El 03T yebda min 89,900 riyal. Tebgha a7jezlak tajrobat qiyada?' : '', bad: ok ? '' : 'Hello! The 03T starts from SAR 89,900. Would you like to book a test drive?'}],
     why:'Arabizi is switched off in Who is the agent, so the agent answered in English.', fixes:[['Open who is the agent','agent']]}; }},
  {id:'compare', name:'Compares V27 with another brand', first:'Is the V27 better than its rivals?', lang:'English', check:true,
   ev(c) { return {checks:[{type:'Must not say', t:'Competitors', ok:true, got:''},{type:'To check', t:'New kind of answer', ok:null, got:'The agent compared features without naming another brand. A person must approve this once.'}],
     convo:[{w:'c', t:'Is the V27 better than its rivals?'},{w:'v', t:'I can\'t compare with other brands, but the V27 2027 has 7 seats, a 1.5T hybrid engine and a 7 year warranty. Would you like a test drive to see for yourself?', chk:true}],
     why:'This is a new kind of answer. Mark it as right or wrong once, and the agent remembers.', fixes:[['Open rules','rules']]}; }},
  {id:'price', name:'Price question, Hijazi dialect', first:'بكم الـ V27 الجديدة؟', lang:'Arabic · Hijazi', act:'collect', ev(c) { return simple(c, [['Must do','Collect lead details', actOn(c, 'collect')],['Must not say','Discounts not in the price list', true]], [{w:'c', t:'بكم الـ V27 الجديدة؟'},{w:'v', t:'هلا! V27 موديل 2027 يبدأ من ١٢٩,٩٠٠ ريال، وعليها عرض اليوم الوطني تأمين مجاني.'}]); }},
  {id:'td', name:'Books a test drive, all details', first:'أبغى أجرب V27 بكرة العصر', lang:'Arabic · Hijazi', act:'testdrive', ev(c) { const on = actOn(c, 'testdrive'); return simple(c, [['Must do','Book a test drive', on, 'Did not happen. Book a test drive is off.'],['Must do','Collect lead details', actOn(c, 'collect')],['Must do','Send confirmation', on]], [{w:'c', t:'أبغى أجرب V27 بكرة العصر'},{w:'v', t: on ? 'أكيد! بكرة الأحد عندنا ٤:٠٠ أو ٥:٠٠ أو ٦:٠٠ مساءً. أي وقت يناسبك؟' : 'بخلي فريقنا يتواصل معك.'}], 'Book a test drive is off in What it can do.', [['Open actions','actions']]); }},
  {id:'voice', name:'Voice note asking for the location', first:'Voice note · 0:07', lang:'Voice note', act:'files', ev(c) { const ok = c.agent.voice && actOn(c, 'files'); return simple(c, [['Must do','Understand the voice note', c.agent.voice, 'Asked the customer to type instead. Voice notes are off.'],['Must do','Send files', actOn(c, 'files'), 'Did not happen. Send files is off.']], [{w:'c', t:'Voice note · 0:07 · "وين موقع المعرض؟"'},{w:'v', t: ok ? 'هذا موقع معرض طريق المدينة. مفتوح من ٩ الصبح إلى ٩ المساء، ما عدا الجمعة.' : 'ما أقدر أسمع الرسائل الصوتية، ممكن تكتب سؤالك؟'}], 'Voice notes or Send files are off.', [['Open who is the agent','agent']]); }},
  {id:'angry', name:'Angry about a late delivery', first:'صار لي شهر أنتظر السيارة!', lang:'Arabic · Najdi', act:'handover', ev(c) { return simple(c, [['Must hand over','Complains', handOn(c, 'complain'), 'Did not hand over. Hand over on complaints is off.']], [{w:'c', t:'صار لي شهر أنتظر السيارة!'},{w:'v', t:'آسفين على التأخير. أرسلت طلبك لزميلي في مركز الاتصال وبيتصل عليك الحين.'}], 'Hand over on complaints is off in Rules.', [['Open rules','rules']]); }},
  {id:'brochure', name:'Asks for the brochure in English', first:'Can you send me the 03T brochure?', lang:'English', act:'files', ev(c) { return simple(c, [['Must do','Send files', actOn(c, 'files'), 'Did not happen. Send files is off.']], [{w:'c', t:'Can you send me the 03T brochure?'},{w:'v', t:'Here is the 03T brochure. Anything else?'}], 'Send files is off.', [['Open actions','actions']]); }},
  {id:'after', name:'Callback request after hours', first:'اتصلوا علي بكرة الصبح', lang:'Arabic · Hijazi', act:'callback', ev(c) { return simple(c, [['Must do','Book a callback', actOn(c, 'callback'), 'Did not happen. Book a callback is off.']], [{w:'c', t:'اتصلوا علي بكرة الصبح'},{w:'v', t:'تمام، بيتصل عليك فريقنا بكرة الساعة ١٠ الصبح.'}], 'Book a callback is off.', [['Open actions','actions']]); }},
  {id:'job', name:'Job seeker', first:'أبغى أقدم على وظيفة', lang:'Arabic · Najdi', act:'qualify', ev(c) { return simple(c, [['Must not qualify','Job seekers', true]], [{w:'c', t:'أبغى أقدم على وظيفة'},{w:'v', t:'الله يوفقك! التقديم على الوظائف من موقعنا في صفحة الوظائف.'}]); }},
  {id:'trade', name:'Trade-in question', first:'تاخذون سيارتي ٢٠١٨ بدل؟', lang:'Arabic · Hijazi', act:'collect', ev(c) { return simple(c, [['Must do','Collect lead details', actOn(c, 'collect'), 'Did not happen.']], [{w:'c', t:'تاخذون سيارتي ٢٠١٨ بدل؟'},{w:'v', t:'إيه نقبل البدل. جيب سيارتك المعرض ونقيمها لك مجاناً.'}], '', []); }},
  {id:'person', name:'Asks for a person', first:'أبغى أكلم موظف', lang:'Arabic · Hijazi', act:'handover', ev(c) { return simple(c, [['Must hand over','Asks for a person', handOn(c, 'person'), 'Did not hand over. Hand over is off.'],['Must do','Write a summary for the team', actOn(c, 'summary')]], [{w:'c', t:'أبغى أكلم موظف'},{w:'v', t:'أبشر، أرسلت طلبك لزميلي وبيتواصل معك خلال دقائق.'}], 'Hand over is off.', [['Open actions','actions']]); }},
];
function simple(c, checks, convo, why, fixes) {
  const cs = checks.map(([type, t, ok, got]) => ({type, t, ok, got: got || 'Did not happen.'}));
  if (cs.some(k => !k.ok)) convo = convo.map((m, i) => i === convo.length - 1 && m.w === 'v' ? {w:'v', t:'', bad:m.t} : m);
  return {checks:cs, convo, why: why || '', fixes: fixes || []};
}
function evalScen(s, id) {
  const c = cfgOf(id); const r = s.custom ? {checks:[{type:'Must do', t:s.mustDo ? (c.actions.find(a => a.id === s.mustDo) || {}).name || s.mustDo : 'Answer', ok: s.mustDo ? actOn(c, s.mustDo) : true, got:'Did not happen. The action is off.'}].concat(s.mustNot ? [{type:'Must not say', t:s.mustNot, ok:true}] : []).concat(s.mustHand ? [{type:'Must hand over', t:'Hand over to the team', ok:actOn(c, 'handover'), got:'Did not hand over.'}] : []), convo:s.msgs.map(t => ({w:'c', t})), why:'', fixes:[]} : s.ev(c);
  let res = r.checks.some(k => k.ok === false) ? 'fail' : 'pass';
  if (s.check) res = s.mark === 'right' ? 'pass' : s.mark === 'wrong' ? 'fail' : 'check';
  if (s.check && s.mark === 'wrong') r.checks[1] = {type:'To check', t:'New kind of answer', ok:false, got:'Marked as wrong by ' + meName() + '. Change the knowledge or rules, then run again.'};
  return Object.assign(r, {res});
}
function runNow(id, when) { const res = {}, det = {}; SU.scen.forEach(s => { const e = evalScen(s, id); res[s.id] = e.res; det[s.id] = e; }); SU.runs[id] = {when: when || nowStr(), res, det, sig:sig(id), ver: unsaved(id) ? 'draft' : 'live'}; }
runNow('sara', 'Today 3:10 PM'); runNow('faris', 'Thu 5 Nov, 2:10 PM');
const runOf = id => SU.runs[id];
const counts = id => { const r = runOf(id); const o = {pass:0, fail:0, check:0, total:SU.scen.length}; if (r) Object.values(r.res).forEach(v => { o[v] = (o[v] || 0) + 1; }); return o; };
const fresh = id => runOf(id) && runOf(id).sig === sig(id);
function runAll(id, ids, done) {
  if (SU.running) return;
  const list = ids || SU.scen.map(s => s.id);
  const prev = runOf(id) || {res:{}};
  SU.running = {id, list, i:0, res:Object.assign({}, prev.res), det:Object.assign({}, prev.det)};
  const tick = () => {
    const r = SU.running; if (!r) return;
    if (r.i >= r.list.length) { SU.runs[id] = {when:nowStr(), res:r.res, det:r.det, sig:sig(id), ver: unsaved(id) ? 'draft' : 'live'}; SU.running = null; const c = counts(id); toast(c.fail ? c.fail + ' test scenario' + (c.fail > 1 ? 's' : '') + ' failed' : 'All test scenarios passed' + (c.check ? ', ' + c.check + ' to check' : '')); if (done) done(); render(); return; }
    const s = SU.scen.find(x => x.id === r.list[r.i]); const e = evalScen(s, id); r.res[s.id] = e.res; r.det[s.id] = e; r.i++; (SU._resAt || (SU._resAt = {}))[s.id] = Date.now() + 700; render(); setTimeout(tick, 400);
  };
  render(); setTimeout(tick, 400);
}
// '' | 'now' (being run) | 'wait' (queued) for one scenario during a run
const runState = (run, sid) => { if (!run) return ''; const j = run.list.indexOf(sid); return j < 0 ? '' : j === run.i ? 'now' : j > run.i ? 'wait' : ''; };
const tickIn = sid => SU._resAt && SU._resAt[sid] > Date.now() ? 'su-tick' : '';
const spin = () => '<span class="su-spin" aria-hidden="true"></span>';
// A bar that grows from the width it last had, so re-renders never replay it
function gbar(key, p, colour) { const b = SU._bars || (SU._bars = {}); const p0 = b[key]; b[key] = p; const go = p0 != null && p0 !== p; return `<span class="su-bar"><i class="${go ? 'go' : ''}" style="width:${p}%;--p0:${go ? p0 : p}%;${colour ? 'background:' + colour : ''}"></i></span>`; }

/* ---------- Test chat engine (S7 and A2) ---------- */
const AZ = /\b(kam|si3r|3nd|3ndkom|abgha|ab8a|shlon|ahlan|wain|mawjood|tajrobat|bkam)\b/i;
const G = {Friendly:{ar:{'Saudi, Hijazi':'هلا! ','Saudi, Najdi':'هلا والله! ','Formal Arabic':'أهلاً! '}, en:'Hi! ', az:'Hala! '}, Formal:{ar:{'Saudi, Hijazi':'أهلاً بك. ','Saudi, Najdi':'أهلاً بك. ','Formal Arabic':'مرحباً بك. '}, en:'Hello. ', az:'Ahlan. '}, 'Short and direct':{ar:{}, en:'', az:''}};
const greet = (c, L) => { const g = G[c.agent.tone] || G.Friendly; return L === 'ar' ? (g.ar[c.agent.style] || '') : g[L]; };
const more = (c, L) => c.agent.length === 'Detailed' ? (L === 'ar' ? ' وإذا تحب أرسل لك الكتيب كامل.' : L === 'az' ? ' W law tebgha arsil lak el brochure.' : ' I can also send you the full brochure if you like.') : '';
const tr = (L, ar, en, az) => L === 'ar' ? ar : L === 'az' ? (az || en) : en;
function langFor(c, text) { if (isAr(text)) return c.agent.langs.Arabic ? 'ar' : 'en'; if (AZ.test(text) || /[a-z][2357][a-z]/i.test(text)) return c.agent.langs.Arabizi ? 'az' : 'en'; return c.agent.langs.English ? 'en' : 'ar'; }
const card = (name, st, lines) => ({k:'act', name, st, lines});
function reply(c, key, text) {
  const L = langFor(c, text); const t = text.toLowerCase(); const out = []; const later = [];
  const who = c.rules.who === 'cc' ? 'Given to Reem by rule "Callbacks to call centre"' : 'Given to Majed by rule "Qualified to Sales"';
  const handover = (why) => { if (actOn(c, 'handover')) { out.push({k:'vina', text: tr(L, 'أرسلت طلبك لزميلي في ' + (c.rules.who === 'cc' ? 'مركز الاتصال' : 'المبيعات') + '، وبيتواصل معك خلال دقائق.', 'I sent your request to my colleague in ' + (c.rules.who === 'cc' ? 'the call centre' : 'sales') + '. They will contact you in a few minutes.', 'Arsalt talabak l zamili, w byetwasal ma3ak khilal da2ayi2.')}); out.push(card('Hand over to the team', 'Done', [actOn(c, 'summary') ? 'Summary written for the team' : 'No summary, the summary action is off', who, 'Status changed to Callback', why])); } else out.push({k:'vina', text: tr(L, 'حالياً ما أقدر أحولك لموظف، بس أقدر أساعدك هنا.', 'I can\'t pass you to a person right now, but I can help here.')}); };
  if (SU.pend[key] === 'td') {
    SU.pend[key] = null;
    out.push({k:'vina', text: tr(L, 'تم الحجز. الأحد ٨ نوفمبر الساعة ٥:٠٠ مساءً في معرض طريق المدينة. أرسلت لك الموقع، ونذكرك قبل الموعد بساعتين.', 'Booked. Sunday 8 November at 5:00 PM at our Madinah Road showroom. I sent you the location and will remind you 2 hours before.', 'Tam el 7ajz. El a7ad 8 November sa3a 5 bil masa2.')});
    out.push(card('Book a test drive', 'Done', ['Booked Sun 8 Nov, 5:00 PM · Madinah Road','Status changed to Test drive booked','Given to Majed by rule "Qualified to Sales"','WhatsApp confirmation sent']));
    return {out, later};
  }
  if (/financ|تمويل|تقسيط|rate|نسبة|قسط|monthly/.test(t)) {
    if (finBad(c)) out.push({k:'vina', text: greet(c, L) + tr(L, 'التمويل متوفر مع البنوك، والنسبة تبدأ من ٣٫٥٪ والدفعة الأولى من ١٠٪.', 'Financing is available with our banks. The rate starts from 3.5% with 10% down.'), src:'V27 offers Nov 2026.pdf, page 3'});
    else if (c.rules.hand.price) handover('Reason: asked about financing');
    else out.push({k:'vina', text: tr(L, 'التمويل يوضحه لك فريقنا. متى يناسبك نتصل عليك؟', 'Our team will explain the financing. When is a good time to call you?'), src:'Rules: Never talk about financing rates'});
  } else if (/test ?drive|تجرب|أجرب|اجرب|تجربة|try/.test(t)) {
    if (actOn(c, 'testdrive')) { out.push({k:'vina', text: greet(c, L) + tr(L, 'أكيد. بكرة الأحد عندنا في معرض طريق المدينة ٤:٠٠ أو ٥:٠٠ أو ٦:٠٠ مساءً. أي وقت يناسبك؟', 'Sure. Tomorrow, Sunday, we have 4:00, 5:00 or 6:00 PM at our Madinah Road showroom. Which time suits you?', 'Akeed. Bokra el a7ad 3ndna 4, 5 aw 6 masa2. Ay wa2t yenasbak?')}); out.push(card('Book a test drive', 'Started', ['Found 3 free times on Sun 8 Nov','Asked the customer to choose'])); SU.pend[key] = 'td'; }
    else handover('Reason: wants a test drive, the booking action is off');
  } else if (/person|human|agent|someone|موظف|أكلم|اكلم|أحد/.test(t)) {
    handover('Reason: asked for a person');
  } else if (/price|cost|how much|سعر|بكم|كم|si3r|bkam/.test(t)) {
    const isT = /03t/.test(t); const priceOff = neverHas(c, /^prices?$|price list/i);
    if (priceOff) { out.push({k:'vina', text: tr(L, 'الأسعار يوضحها لك فريقنا مباشرة. متى يناسبك نتصل عليك؟', 'Our team will share the prices with you directly. When is a good time to call you?'), src:'Rules: Never talk about prices'}); if (actOn(c, 'callback')) out.push(card('Book a callback', 'Started', ['Asked the customer for a time'])); }
    else out.push({k:'vina', text: greet(c, L) + (isT ? tr(L, '03T يبدأ من ٨٩,٩٠٠ ريال.', 'The 03T starts from SAR 89,900.', 'El 03T yebda min 89,900 riyal.') : tr(L, 'V27 موديل 2027 يبدأ من ١٢٩,٩٠٠ ريال، وعليها عرض اليوم الوطني تأمين مجاني.', 'The V27 2027 starts from SAR 129,900, with free insurance in the National Day offer.', 'El V27 2027 yebda min 129,900 riyal, ma3 ta2meen majjani.')) + more(c, L), src: fileOn(c, 'Price list Nov 2026.xlsx') ? 'Price list Nov 2026.xlsx' : 'Products: ' + (isT ? '03T' : 'V27 2027')});
  } else if (/colou?r|stock|available|لون|ألوان|الوان|متوفر/.test(t)) {
    out.push({k:'vina', text: greet(c, L) + tr(L, 'ألوان 03T المتوفرة: أبيض، رمادي، أسود، وأخضر.', 'The 03T comes in White, Grey, Black and Green.', 'Alwan el 03T: abyad, ramadi, aswad w akhdar.'), src:'Products: 03T 2026'});
  } else if (/where|location|showroom|موقع|وين|المعرض/.test(t)) {
    if (actOn(c, 'files')) { out.push({k:'vina', text: tr(L, 'هذا موقع معرض طريق المدينة. مفتوح من ٩ الصبح إلى ٩ المساء، ما عدا الجمعة.', 'Here is our Madinah Road showroom. Open 9 AM to 9 PM, closed on Friday.'), src:'Working hours'}); out.push(card('Send files', 'Done', ['Sent location pin · Madinah Road showroom'])); }
    else out.push({k:'vina', text: tr(L, 'معرضنا في طريق المدينة، جدة.', 'Our showroom is on Madinah Road, Jeddah.')});
  } else if (/thank|شكر|مشكور/.test(t)) {
    out.push({k:'vina', text: tr(L, 'العفو! ' + (c.rules.rate ? 'كيف تقيّم المحادثة من ١ إلى ٥؟' : 'حياك الله.'), 'You are welcome! ' + (c.rules.rate ? 'How would you rate this chat from 1 to 5?' : ''))});
    if (actOn(c, 'close')) out.push(card('Close the chat', 'Done', [c.rules.rate ? 'Asked for a rating' : 'Rating is off', 'Chat closed']));
  } else {
    out.push({k:'vina', text: greet(c, L) + tr(L, 'تحت أمرك! أي سيارة تفكر فيها؟ عندنا V27 و 03T.', 'Happy to help! Which car are you looking at? We have the V27 and the 03T.', 'Ta7t amrak! Ay sayara tefakker feeha? 3ndna V27 w 03T.') + more(c, L)});
  }
  return {out, later};
}
function chatInit(key, id, seed) { if (!SU.chats[key]) { const c = cfgOf(id); SU.chats[key] = seed ? clone(seed) : [{k:'vina', text:c.agent.firstAr || c.agent.firstEn || 'Hi!'}]; } return SU.chats[key]; }
function chatSend(key, id, text, voice) {
  const c = cfgOf(id); const list = chatInit(key, id);
  if (voice) { list.push({k:'voice', text:'Voice note · 0:07', tr:text}); if (!c.agent.voice) { SU.typing[key] = true; stickBottom(); render(); setTimeout(() => { SU.typing[key] = false; list.push({k:'vina', text:'ما أقدر أسمع الرسائل الصوتية حالياً، ممكن تكتب سؤالك؟'}); stickBottom(); render(); }, 900); return; } }
  else list.push({k:'in', text});
  SU.typing[key] = true; stickBottom(); render();
  setTimeout(() => {
    const r = reply(c, key, text); SU.typing[key] = false;
    r.out.forEach(m => {
      // a finished action first shows as Started, then flips to Done with what happened
      if (m.k === 'act' && m.st === 'Done') { m.st = 'Started'; m.fin = 'Done'; setTimeout(() => { m.st = 'Done'; m.popAt = Date.now() + 700; render(); const e = document.getElementById('su-chat-' + key); if (e) e.scrollTop = e.scrollHeight; }, 1100); }
      list.push(m);
    }); stickBottom(); render();
  }, 900);
}
const actCard = (m) => { const work = m.fin && m.st !== m.fin; const col = m.st === 'Done' ? 'green' : m.st === 'Failed' ? 'red' : 'blue';
  return `<div class="actcard ${work ? 'su-ac-work' : ''} ${m.popAt > Date.now() ? 'su-ac-pop' : ''}"><div class="ah"><span class="chi c-teal su-ac-i">${ic('bolt', 13)}</span><span class="grow">Action: ${esc(m.name)}</span><span class="st"><span class="chip c-${col}">${work ? spin() : m.st === 'Done' ? ic('check', 12) : m.st === 'Failed' ? ic('x', 12) : ''}${esc(m.st)}</span></span></div><ul>${(work ? m.lines.slice(0, 1) : m.lines).map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`; };
const SUGG = ['كم سعر 03T؟','Do you have financing?','أبغى أجرب V27 بكرة العصر','أبغى أكلم موظف','What colours does the 03T come in?'];
function chatBox(key, id, o) {
  o = o || {}; const list = chatInit(key, id, o.seed); const c = cfgOf(id);
  const sug = SU.pend[key] === 'td' ? ['٥ تمام','6 PM please'] : SUGG;
  const fk = 'f.suc_' + key;
  const msgs = list.map(m => {
    if (m.k === 'in') return `<div class="msg in"><div class="bub" ${isAr(m.text) ? 'dir="rtl"' : ''}>${esc(m.text)}</div></div>`;
    if (m.k === 'voice') return `<div class="msg in"><div class="bub"><span class="row tight nowrap">${ic('mic', 14)}<b>${esc(m.text)}</b></span><div class="xs mute" style="margin-top:4px">Transcript: ${txt(m.tr)}</div></div></div>`;
    if (m.k === 'vina') return `<div class="msg vina"><div class="bub" ${isAr(m.text) ? 'dir="rtl"' : ''}>${esc(m.text)}</div><div class="meta">${esc(c.agent.name)}${m.src ? ` · <span class="src" title="Answer from ${esc(m.src)}">${ic('file', 11)}${esc(m.src)}</span>` : ''}</div></div>`;
    if (m.k === 'act') return actCard(m);
    return `<div class="evt">${esc(m.text)}</div>`;
  }).join('') + (SU.typing[key] ? `<div class="typing" aria-label="${esc(c.agent.name)} is writing"><i></i><i></i><i></i></div>` : '');
  return `<section class="card pad0 su-chat ${o.cls || ''}" aria-label="Test chat">
    <div class="row nowrap su-chath">${agAv(id)}<div class="grow" style="min-width:0"><div class="b ell">Test chat with ${esc(c.agent.name || 'your agent')}</div><div class="row tight nowrap" style="margin-top:3px">${chipC('Test, not live', 'amber', true)}<span class="xs mute ell su-chsub">${SU.typing[key] ? `<span class="teal">${esc(c.agent.name || 'The agent')} is writing…</span>` : esc(o.sub || 'Customers do not see this')}</span></div></div><button type="button" class="ibtn sm bare" data-a="su-chat-reset" data-x="${key}" aria-label="Start the test chat again">${ic('refresh', 16)}</button></div>
    <div class="chat su-chat-list" id="su-chat-${key}" data-keep data-stick aria-live="polite">${msgs}</div>
    <div class="col tight" style="padding:12px 14px;border-top:1px solid var(--line)">
      <div class="row tight" role="group" aria-label="Suggested messages">${sug.map(s => `<button type="button" class="fchip su-sugg" data-a="su-chat-say" data-x="${key}|${id}" data-t="${esc(s)}">${txt(s)}</button>`).join('')}</div>
      <form class="row tight nowrap" data-a="su-chat-send" data-x="${key}|${id}"><label class="sr" for="b-f-suc_${key}">Write as the customer</label><input class="inp grow" ${bind(fk)} placeholder="Write as the customer" autocomplete="off" dir="auto"><button type="button" class="ibtn" data-a="su-chat-voice" data-x="${key}|${id}" aria-label="Send a voice note">${ic('mic')}</button><button type="submit" class="btn pri">Send</button></form>
    </div></section>`;
}
A['su-chat-send'] = (fm) => { const [key, id] = fm.dataset.x.split('|'); const v = (S.f['suc_' + key] || '').trim(); if (!v || SU.typing[key]) return false; S.f['suc_' + key] = ''; chatSend(key, id, v); return false; };
A['su-chat-say'] = (el) => { const [key, id] = el.dataset.x.split('|'); if (SU.typing[key]) return false; chatSend(key, id, el.dataset.t); return false; };
A['su-chat-voice'] = (el) => { const [key, id] = el.dataset.x.split('|'); if (SU.typing[key]) return false; chatSend(key, id, 'وين موقع المعرض؟', true); return false; };
A['su-chat-reset'] = (el) => { const k = el.dataset.x; delete SU.chats[k]; SU.pend[k] = null; SU.typing[k] = false; };

/* ---------- Generic setters ---------- */
A['su-tog'] = (el) => { setP(el.dataset.x, !getP(el.dataset.x)); };
A['su-set'] = (el) => { setP(el.dataset.x, el.dataset.v); };
A['su-del'] = (el) => { const [p, i] = el.dataset.x.split('#'); getP(p).splice(Number(i), 1); };

/* ---------- Stage bodies (shared by S1–S6 and the A2 editor sections) ---------- */
const P = (id, p) => 'su.drafts.' + id + '.' + p;
const radio = (path, val, label, sub, extra) => `<button type="button" class="radio-card" role="radio" aria-checked="${String(getP(path)) === String(val)}" data-a="su-set" data-x="${path}" data-v="${esc(val)}">${extra || ''}<span class="grow"><b>${esc(label)}</b>${sub ? `<span class="xs mute" style="display:block;margin-top:3px">${sub}</span>` : ''}</span></button>`;
const swRow = (path, label, sub) => `<div class="sw-row">${sw(getP(path), 'su-tog', path, label)}<span class="grow"><b class="small">${esc(label)}</b>${sub ? `<span class="xs mute" style="display:block">${sub}</span>` : ''}</span></div>`;
const tick = (path, label) => `<label class="chk"><input ${bindChk(path)}><span>${esc(label)}</span></label>`;

function body1(id) {
  const c = cfgOf(id); const b = c.biz; const pr = PRESET[b.type] || PRESET.other;
  return `<div class="col loose"><section class="rx-sec"><h3>Name and type</h3>
    <div class="su-g2"><div class="field"><label for="b-${P(id, 'biz.name').replace(/\./g, '-')}">Business name</label><input class="inp" ${bind(P(id, 'biz.name'), true)}>${!b.name.trim() ? `<span class="err">${ic('alert', 14)}Write the business name. Customers see it in the chat.</span>` : ''}</div>
      <div class="field"><span class="lbl">Logo</span><div class="row tight nowrap">${b.logo ? `<img src="${b.logo}" alt="Business logo" style="width:42px;height:42px;border-radius:10px;object-fit:cover;border:1px solid var(--line)">` : `<span class="av lg c-navy" style="border-radius:10px" aria-hidden="true">${esc(initials(b.name))}</span>`}<label class="btn sm" style="min-height:40px">${ic('upload', 14)}${b.logo ? 'Change' : 'Upload logo'}<input type="file" accept="image/*" class="sr" data-ch="su-logo" data-x="${id}"></label>${b.logo ? `<button type="button" class="btn sm ghost" data-a="su-set" data-x="${P(id, 'biz.logo')}" data-v="">Remove</button>` : ''}</div></div></div>
    <div class="field"><span class="lbl" id="su-bt">What kind of business?</span><div class="su-types" role="radiogroup" aria-labelledby="su-bt">${BTYPES.map(([k, l, i, col]) => `<button type="button" class="radio-card su-type" role="radio" aria-checked="${b.type === k}" data-a="su-type" data-x="${id}" data-v="${k}"><span class="chi lg c-${col}">${ic(i, 20)}</span><b>${l}</b></button>`).join('')}</div>
      <div class="note vina">${ic('spark')}<div>We filled in a suggested tone, rules and actions for ${esc(pr.label)}, and ${pr.n} ready-made test scenarios. You can change all of it.</div></div></div></section>
    <section class="rx-sec"><h3>Where and when</h3>
    <div class="su-g2"><div class="field"><label for="b-${P(id, 'biz.city').replace(/\./g, '-')}">City</label><input class="inp" ${bind(P(id, 'biz.city'))}></div>
      <div class="field"><label for="b-${P(id, 'biz.lang').replace(/\./g, '-')}">Main language of your team</label>${bindSel(P(id, 'biz.lang'), ['Arabic','English','Arabic and English'])}</div></div>
    <div class="field"><span class="lbl">Showrooms or branches</span><div class="row tight">${b.branches.map((x, i) => `<span class="tokens" style="min-height:36px;padding:3px"><span class="tok">${ic('pin', 13)}${esc(x)}<button type="button" data-a="su-del" data-x="${P(id, 'biz.branches')}#${i}" aria-label="Remove ${esc(x)}">${ic('x', 13)}</button></span></span>`).join('')}</div>
      <form class="row tight nowrap" data-a="su-branch" data-x="${id}"><label class="sr" for="b-f-suBranch">New showroom or branch</label><input class="inp grow" ${bind('f.suBranch')} placeholder="e.g. Al Khobar, Dammam"><button type="submit" class="btn">${ic('plus', 14)}Add another</button></form></div>
    <div class="field"><span class="lbl">Working hours</span><div class="su-hours">${b.hours.map((h, i) => `<div class="su-hrow"><b>${h.d}</b>${sw(h.on, 'su-tog', P(id, 'biz.hours.' + i + '.on'), h.d + ' open')}${h.on ? `<label class="sr" for="b-${P(id, 'biz.hours.' + i + '.from').replace(/\./g, '-')}">${h.d} opens</label><input type="time" class="inp" ${bind(P(id, 'biz.hours.' + i + '.from'))}><span class="mute">to</span><label class="sr" for="b-${P(id, 'biz.hours.' + i + '.to').replace(/\./g, '-')}">${h.d} closes</label><input type="time" class="inp" ${bind(P(id, 'biz.hours.' + i + '.to'))}>` : `<span class="mute">Closed</span>`}</div>`).join('')}</div></div></section>
  </div>`;
}
const TONES = {Friendly:['هلا! أكيد، أرسل لك الأسعار الحين','Hi! Sure, I\'ll send you the prices now.'], Formal:['أهلاً بك. يسعدني تزويدك بالأسعار','Hello. I would be glad to share the prices with you.'], 'Short and direct':['سعر V27 يبدأ من ١٢٩,٩٠٠','The V27 starts from SAR 129,900.']};
function body2(id) {
  const c = cfgOf(id); const a = c.agent; const p = k => P(id, 'agent.' + k);
  return `<div class="col loose"><section class="rx-sec"><h3>Name and job</h3>
    <div class="su-g2"><div class="field"><label for="b-${p('name').replace(/\./g, '-')}">Agent name</label><input class="inp" ${bind(p('name'), true)} placeholder="e.g. Sara">${!a.name.trim() ? `<span class="err">${ic('alert', 14)}Give the agent a name. Customers see it.</span>` : ''}</div>
      <div class="field"><span class="lbl">Avatar</span><div class="row tight" role="radiogroup" aria-label="Avatar">${AVBG.map((bg, i) => `<button type="button" role="radio" aria-checked="${a.av === String(i)}" aria-label="Avatar colour ${i + 1}" class="su-avpick" data-a="su-set" data-x="${p('av')}" data-v="${i}" style="background:${bg}">${esc((a.name || '?')[0])}</button>`).join('')}</div></div></div>
    <div class="field"><span class="lbl" id="su-job">Job</span><div class="fchips" role="radiogroup" aria-labelledby="su-job">${['Sales','Product questions','Bookings','Customer service'].map(j => `<button type="button" class="fchip" role="radio" aria-pressed="${a.job === j}" aria-checked="${a.job === j}" data-a="su-set" data-x="${p('job')}" data-v="${j}">${j}</button>`).join('')}</div></div></section>
    <section class="rx-sec"><h3>First message</h3><div class="su-g2"><div class="field"><label for="b-${p('firstAr').replace(/\./g, '-')}">First message, Arabic</label><textarea class="inp" dir="rtl" ${bindTa(p('firstAr'), true)[0]}>${bindTa(p('firstAr'))[1]}</textarea></div>
      <div class="field"><label for="b-${p('firstEn').replace(/\./g, '-')}">First message, English</label><textarea class="inp" ${bindTa(p('firstEn'), true)[0]}>${bindTa(p('firstEn'))[1]}</textarea></div></div></section>
    <section class="rx-sec"><h3>How it speaks</h3>
    <div class="field"><span class="lbl" id="su-tone">Tone</span><div class="su-g3" role="radiogroup" aria-labelledby="su-tone">${Object.keys(TONES).map(k => radio(p('tone'), k, k, `<span dir="rtl" class="ar">${esc(TONES[k][0])}</span>`)).join('')}</div></div>
    <div class="field"><span class="lbl" id="su-sty">Arabic style</span><div class="fchips" role="radiogroup" aria-labelledby="su-sty">${['Saudi, Hijazi','Saudi, Najdi','Formal Arabic'].map(j => `<button type="button" class="fchip" role="radio" aria-checked="${a.style === j}" aria-pressed="${a.style === j}" data-a="su-set" data-x="${p('style')}" data-v="${j}">${j}</button>`).join('')}</div></div>
    <div class="field"><span class="lbl">Languages</span><div class="row">${['Arabic','English','Arabizi'].map(l => tick(p('langs.' + l), l)).join('')}</div><span class="hint">It replies in the customer's language.</span></div>
    <div class="field"><span class="lbl" id="su-len">Reply length</span><div class="seg" role="group" aria-labelledby="su-len">${['Short','Detailed'].map(l => `<button type="button" aria-pressed="${a.length === l}" data-a="su-set" data-x="${p('length')}" data-v="${l}">${l}</button>`).join('')}</div></div>
    ${swRow(p('firstName'), 'Call the customer by first name', '"Hala Noura"')}
    ${swRow(p('voice'), 'Answer WhatsApp voice notes', 'The agent listens and replies in text')}</section>
  </div>`;
}
function body3(id) {
  const c = cfgOf(id); const r = c.rules; const p = k => P(id, 'rules.' + k);
  return `<div class="col loose"><section class="rx-sec"><h3>Limits</h3>
    <div class="field"><span class="lbl">Never talk about</span><div class="tokens">${r.never.map((x, i) => `<span class="tok">${esc(x)}<button type="button" data-a="su-del" data-x="${p('never')}#${i}" aria-label="Remove ${esc(x)}">${ic('x', 13)}</button></span>`).join('')}</div>
      <form class="row tight nowrap" data-a="su-never" data-x="${id}"><label class="sr" for="b-f-suNever">Add a topic</label><input class="inp grow" ${bind('f.suNever')} placeholder="Add a topic, then press Enter, e.g. Financing rates"><button type="submit" class="btn">${ic('plus', 14)}Add</button></form>
      <div class="row tight"><span class="xs mute">Suggested:</span>${['Financing rates','Prices','Used cars'].filter(x => !r.never.includes(x)).map(x => `<button type="button" class="fchip" data-a="su-never-add" data-x="${id}" data-v="${x}">${ic('plus', 12)}${x}</button>`).join('')}</div></div>
    </section><section class="rx-sec"><h3>Handover</h3>
    <div class="field"><span class="lbl">Hand over to a person when the customer…</span><div class="col tight">${HAND.map(([k, l]) => tick(p('hand.' + k), l)).join('')}</div></div>
    <div class="field"><span class="lbl" id="su-who">Who gets the handover</span><div class="su-g2" role="radiogroup" aria-labelledby="su-who">${radio(p('who'), 'cc', 'Call centre', 'Uses the rule "Callbacks to call centre"')}${radio(p('who'), 'sales', 'Sales', 'Uses the rule "Qualified to Sales"')}</div><a class="small" href="#rules" data-keepdraft>See the assignment rules</a></div>
    </section><section class="rx-sec"><h3>After hours and ratings</h3>
    <div class="field"><span class="lbl" id="su-aft">After working hours</span><div class="su-g2" role="radiogroup" aria-labelledby="su-aft">${radio(p('after'), 'keep', 'Keep answering', 'And take a time for the call centre to call back')}${radio(p('after'), 'closed', 'Send a "we are closed" message', '"We are open from 9 AM"')}</div></div>
    ${swRow(p('rate'), 'Rate the chat', 'Ask for 1 to 5 stars when the chat closes')}</section>
  </div>`;
}
const EXT_OK = /\.(pdf|docx?|xlsx?|csv|txt)$/i;
function body4(id) {
  const c = cfgOf(id); const k = c.know; const p = x => P(id, 'know.' + x);
  let files = k.files.map((f, i) => ({f, i}));
  if (S.st === 'empty') files = [];
  if (S.st === 'toobig') files = files.concat([{f:{n:'Showroom video.pdf', ext:'PDF', st:'Failed', why:'File too big. The limit is 20 MB. Split it or save a smaller copy.', on:false}, i:-1}]);
  if (S.st === 'badtype') files = files.concat([{f:{n:'Offers.pages', ext:'PAGES', st:'Failed', why:'File type not supported. Use PDF, Word, Excel or text.', on:false}, i:-1}]);
  if (S.st === 'reading') files = files.concat([{f:{n:'Offers Dec 2026.pdf', ext:'PDF', st:'Reading', meta:'', on:true}, i:-1}]);
  const stc = s => s === 'Ready' ? 'green' : s === 'Reading' ? 'blue' : 'red';
  const isEmpty = !files.length && (S.st === 'empty' || (!k.links.length && !k.faq.length));
  const row = (title, ext, meta, st, why, path, on, delPath) => `<div class="su-src ${st === 'Failed' ? 'bad' : ''} ${flashCls('src-' + title)}"><span class="chi lg c-${ext === 'WEB' ? 'blue' : ext === 'XLS' ? 'green' : ext === 'PDF' ? 'red' : 'navy'}" style="font-size:10px;font-weight:700">${esc(ext.slice(0, 4))}</span><div class="grow"><div class="b ell">${esc(title)}</div>${st === 'Reading' ? `<div class="xs mute">Reading… the agent can use it in a moment</div><span class="su-read" aria-hidden="true"><i></i></span>` : `<div class="xs ${st === 'Failed' ? 'red' : 'mute'}">${esc(st === 'Failed' ? why : meta)}</div>`}</div>${st === 'Reading' ? `<span class="chip c-blue">${spin()}Reading</span>` : chipC(st, stc(st), true)}${path ? sw(on, 'su-tog', path, 'Use ' + title, st !== 'Ready') : ''}${delPath ? `<button type="button" class="ibtn sm bare" data-a="su-del" data-x="${delPath}" aria-label="Remove ${esc(title)}">${ic('trash', 15)}</button>` : ''}</div>`;
  return `<div class="col loose">
    ${isEmpty ? empty('book', 'Nothing added yet', 'Add what your team uses to answer customers: price lists, brochures, offers, your website and common questions. The agent answers only from what you add here.', `<div class="row tight" style="justify-content:center">${['Price list.xlsx','Brochure.pdf','Offers.pdf','Your website'].map(x => chipC(x, 'grey')).join('')}</div>`) : ''}
    <div class="field"><span class="lbl">Files</span><label class="su-drop" for="su-up-${id}">${ic('upload', 22)}<span><b>Upload files</b><span class="xs mute" style="display:block">PDF, Word or Excel, up to 20 MB each. For example price lists, brochures and offers.</span></span><input id="su-up-${id}" type="file" multiple class="sr" data-ch="su-upload" data-x="${id}"></label>
      <div class="col tight">${files.map(({f, i}) => row(f.n, f.ext, f.meta, f.st, f.why, i >= 0 ? p('files.' + i + '.on') : '', f.on, i >= 0 ? p('files') + '#' + i : '')).join('')}</div></div>
    <div class="field"><span class="lbl">Website links</span><form class="row tight nowrap" data-a="su-link" data-x="${id}"><label class="sr" for="b-f-suLink">Website link</label><input class="inp grow" ${bind('f.suLink')} placeholder="e.g. icaur-alghanim.sa/offers" inputmode="url"><button type="submit" class="btn">${ic('plus', 14)}Add link</button></form>
      ${S.f.suLinkErr ? `<span class="err">${ic('alert', 14)}${esc(S.f.suLinkErr)}</span>` : ''}
      <div class="col tight">${k.links.map((l, i) => row(l.u, 'WEB', l.meta, l.st, l.why, p('links.' + i + '.on'), l.on, p('links') + '#' + i)).join('')}</div></div>
    <div class="field"><span class="lbl">Questions and answers</span>
      <div class="col tight">${k.faq.map((q, i) => `<div class="su-src"><div class="grow"><div class="b">${esc(q.q)}</div><div class="xs mute">${esc(q.a)}</div></div>${sw(q.on, 'su-tog', p('faq.' + i + '.on'), 'Use this answer')}<button type="button" class="ibtn sm bare" data-a="su-del" data-x="${p('faq')}#${i}" aria-label="Remove question">${ic('trash', 15)}</button></div>`).join('')}</div>
      <form class="su-g2" data-a="su-faq" data-x="${id}"><div class="field"><label for="b-f-suQ" class="xs">Question</label><input class="inp" ${bind('f.suQ')} placeholder="Do you deliver to Makkah?"></div><div class="field"><label for="b-f-suA" class="xs">Answer</label><div class="row tight nowrap"><input class="inp grow" ${bind('f.suA')} placeholder="Yes, within 3 days."><button type="submit" class="btn">Add</button></div></div></form>
      <details class="su-paste"><summary class="small link">Paste many at once</summary><form class="col tight" data-a="su-faq-paste" data-x="${id}" style="margin-top:8px"><label for="b-f-suPaste" class="xs mute">One per line: question | answer</label><textarea class="inp" ${bindTa('f.suPaste')[0]} placeholder="Do you have a warranty? | Yes, 7 years or 150,000 km">${bindTa('f.suPaste')[1]}</textarea><button type="submit" class="btn" style="align-self:flex-start">Add all</button></form></details></div>
    ${c.biz.type === 'car' ? `<div class="field"><div class="row"><span class="lbl grow">Products</span><button type="button" class="btn sm" data-a="su-prod-import" data-x="${id}">${ic('upload', 14)}Import from Excel</button><button type="button" class="btn sm" data-a="su-prod-add" data-x="${id}">${ic('plus', 14)}Add a model</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Model</th><th>Year</th><th>Trims</th><th>Colours</th><th>Main specs</th><th>Price</th><th>Current offer</th><th><span class="sr">Edit</span></th></tr></thead><tbody>${k.products.map((r, i) => SU.pEdit === id + i ? `<tr class="sel">${['m','y','tr','c','sp','p','o'].map(f => `<td><label class="sr" for="b-${P(id, 'know.products.' + i + '.' + f).replace(/\./g, '-')}">${f}</label><input class="inp" style="min-width:${f === 'y' ? 64 : 110}px" ${bind(P(id, 'know.products.' + i + '.' + f))}></td>`).join('')}<td><button type="button" class="btn sm pri" data-a="su-prod-done">Done</button></td></tr>` : `<tr><td class="b">${esc(r.m)}</td><td class="num">${esc(r.y)}</td><td>${esc(r.tr)}</td><td>${esc(r.c)}</td><td class="mute">${esc(r.sp)}</td><td class="num">${r.p ? 'SAR ' + esc(r.p) : '—'}</td><td>${esc(r.o)}</td><td class="r"><button type="button" class="btn sm ghost" data-a="su-prod-edit" data-x="${id}${i}">Edit</button></td></tr>`).join('')}</tbody></table></div></div>` : ''}
  </div>`;
}
function body5(id, ed) {
  const c = cfgOf(id); const live = SU.live[id];
  const ids = ed ? c.actions.map(a => a.id) : S5_IDS;
  return `<div class="col">
    <div class="note vina">${ic('bolt')}<div><b>Actions are what the agent does in the chat, not only what it says.</b> Switch on only what this agent should do.</div></div>
    ${ids.map(aid => { const i = c.actions.findIndex(a => a.id === aid); const a = c.actions[i]; const chg = live && JSON.stringify(a) !== JSON.stringify(live.actions.find(x => x.id === aid)); const p = P(id, 'actions.' + i);
      return `<div class="su-act ${a.on && !a.needs ? 'on' : 'off'} ${chg ? 'chg' : ''}"><div class="row nowrap su-at">${a.needs ? chipC('Needs setup', 'amber') : sw(a.on, 'su-tog', p + '.on', a.name)}<div class="grow"><div class="row tight"><b class="su-act-t">${esc(a.name)}</b>${chg ? chipC('Changed', 'amber') : ''}</div><div class="xs mute">${esc(a.line)}</div></div>${ed ? `<span class="xs mute num" style="white-space:nowrap">${a.needs ? 'Needs setup' : num(a.uses) + ' this week'}</span>` : ''}<a class="btn sm ghost" href="#actions-${aid}" data-keepdraft>${ed ? 'Edit' : 'Steps'}</a></div>
        ${ed ? `<div class="small" style="padding-inline-start:54px"><b>When:</b> ${esc(a.when)}</div>` : `<div class="field" style="padding-inline-start:54px"><label class="xs mute" for="b-${(p + '.when').replace(/\./g, '-')}">When should it do this?</label><textarea class="inp" rows="2" style="min-height:58px" ${bindTa(p + '.when')[0]}>${bindTa(p + '.when')[1]}</textarea>
          ${aid === 'collect' ? `<div class="row tight"><span class="xs mute">Required:</span>${a.fields.map((f, j) => `<label class="chk small" style="min-height:24px"><input ${bindChk(p + '.fields.' + j + '.req')}><span>${esc(f.t)}</span></label>`).join('')}</div>` : ''}
          ${aid === 'qualify' ? `<a class="xs" href="#qualify" data-keepdraft>Lead rules: when is a lead qualified</a>` : ''}</div>`}
      </div>`; }).join('')}
    ${ed ? '' : `<a class="btn" href="#actions-new" style="align-self:flex-start">${ic('plus', 14)}Build an action this business needs, e.g. Check stock</a>`}
  </div>`;
}
function body6(id) {
  return `<div class="col loose"><div class="su-g2">${CHANS.map(([k, l, i, col, d, route]) => { const v = chOf(id, k); const on = ON_CH(v);
    const owner = !on && SU.agents.find(a => a.id !== id && SU.live[a.id] && ON_CH(SU.live[a.id].ch[k]));
    return `<div class="card flat su-chcard ${on ? 'on' : ''}"><div class="row nowrap"><span class="chi lg c-${col}">${ic(i, 20)}</span><div class="grow"><b>${l}</b><div class="xs mute">${d}</div></div>${chipC(v === 'Checking' ? 'Checking…' : v, on ? 'green' : v === 'Waiting for Meta' || v === 'Checking' ? 'amber' : v === 'Needs attention' ? 'red' : 'grey', true)}</div>
      ${owner ? `<div class="xs mute">${esc(agentName(owner.id))} answers ${l} now. Connecting it here moves it to ${esc(agentName(id) || 'this agent')}.</div>` : ''}
      <div class="row tight"><a class="btn sm ${on ? '' : 'pri'}" href="#${route}" data-keepdraft>${on ? 'Manage' : v === 'Waiting for Meta' ? 'See progress' : 'Connect'}</a>${k === 'web' && !on ? `<button type="button" class="btn sm" data-a="su-web-check" data-x="${id}" ${v === 'Checking' ? 'disabled' : ''}>${v === 'Checking' ? '<span class="spin" aria-hidden="true"></span>Checking' : 'Plugin already installed? Check now'}</button>` : ''}</div></div>`; }).join('')}</div></div>`;
}
const BODY = {1:body1, 2:body2, 3:body3, 4:body4, 5:body5, 6:body6};

/* ---------- Previews (built from the real chat parts: .msg and .actcard) ---------- */
const plabel = t => `<div class="eyebrow su-plabel">${ic('eye', 13)}${t}</div>`;
const bub = (k, text, meta, rtl) => `<div class="msg ${k}"><div class="bub" ${rtl || isAr(text) ? 'dir="rtl"' : ''}>${esc(text)}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div>`;
// sub and right are trusted HTML; messages play in one by one on page entry only
const pframe = (id, sub, inner, right) => `<div class="card pad0 su-prev"><div class="su-prevh">${agAv(id, 'sm')}<div class="grow" style="min-width:0"><div class="small b ell">${esc(agentName(id) || 'Your agent')}</div><div class="xs mute ell">${sub}</div></div>${right || ''}</div><div class="chat su-prevchat ${S._enter ? 'su-seq' : ''}">${inner}</div></div>`;
function preview(n, id) {
  const c = cfgOf(id); const a = c.agent; const nm = esc(a.name || 'Agent');
  if (n === 1) { const pr = PRESET[c.biz.type] || PRESET.other;
    return plabel('VINA suggests') + `<div class="card col">${[['conv', 'Tone', pr.tone + (c.biz.type === 'car' ? ', Saudi dialect' : '')], ['shield', 'Rules', pr.never.length ? 'Never talk about ' + pr.never.slice(0, 2).join(', ').toLowerCase() : 'No blocked topics yet'], ['bolt', 'Actions', c.actions.filter(x => x.on).map(x => x.name.toLowerCase()).slice(0, 4).join(' · ')], ['tests', 'Test scenarios', pr.n + ' ready-made for ' + pr.label]].map(([i, k, v]) => `<div class="row nowrap su-at"><span class="chi c-teal">${ic(i, 14)}</span><div class="grow"><div class="xs mute">${k}</div><div class="small b">${esc(v)}</div></div></div>`).join('')}<div class="xs mute">You can change all of it in the next stages.</div></div>`; }
  if (n === 2) { const L = SU.prevLang || 'ar'; const ar = L === 'ar'; const tone = TONES[a.tone] || TONES.Friendly; const gr = greet(c, ar ? 'ar' : 'en');
    const seg = `<div class="seg" role="group" aria-label="Preview language">${[['ar', 'Arabic'], ['en', 'English']].map(([k, t]) => `<button type="button" aria-pressed="${L === k}" data-a="su-set" data-x="su.prevLang" data-v="${k}">${t}</button>`).join('')}</div>`;
    const ans = (a.tone === 'Short and direct' ? tone[ar ? 0 : 1] : ar ? (a.tone === 'Friendly' ? gr + 'أكيد، أرسل لك الأسعار الحين' : tone[0]) : tone[1]) + more(c, ar ? 'ar' : 'en');
    const off = (ar && !a.langs.Arabic) || (!ar && !a.langs.English);
    return plabel('Live preview') + pframe(id, 'WhatsApp · ' + esc(a.tone) + (ar ? ' · ' + esc(a.style) : ''), off ? `<div class="note warn">${ic('alert')}<div>${ar ? 'Arabic' : 'English'} is off, so the agent will not reply in it.</div></div>`
      : bub('vina', ar ? a.firstAr : a.firstEn, nm, ar) + bub('in', ar ? 'كم سعر V27؟' : 'How much is the V27?', '', ar) + bub('vina', ans, nm + ' · ' + esc(a.tone), ar), seg); }
  if (n === 3) { const fin = c.rules.hand.price; const cc = c.rules.who === 'cc';
    return plabel('Live preview') + pframe(id, 'When a customer asks about financing', bub('in', 'عندكم تمويل؟ كم النسبة؟') + bub('vina', fin ? 'سؤالك عن التمويل يجاوبك عليه زميلي في ' + (cc ? 'مركز الاتصال' : 'المبيعات') + '. أرسلت له ملخص طلبك، وبيتواصل معك خلال دقائق.' : 'التمويل يوضحه لك فريقنا. متى يناسبك نتصل عليك؟', nm)
      + (fin ? actCard({name:'Hand over to the team', st:'Done', lines:['Summary written for the team', 'Given to ' + (cc ? 'the call centre' : 'sales')]}) : '')); }
  if (n === 4) { const ready = c.know.files.filter(f => f.on && f.st === 'Ready').length + c.know.links.filter(l => l.on && l.st === 'Ready').length;
    return plabel('What it knows') + `<div class="card col"><div class="su-k3">${[[ready, 'sources ready'], [c.know.faq.filter(q => q.on).length, 'answers'], [c.know.products.length, 'models']].map(([v, l]) => `<div><div class="su-kv" ${countAttr(v)}>${v}</div><div class="xs mute">${l}</div></div>`).join('')}</div>
      <div class="hr"></div><div class="small b">Example answer</div><div class="chat su-prevchat" style="border-radius:12px;padding:12px">${bub('vina', 'ألوان 03T المتوفرة: أبيض، رمادي، أسود، وأخضر.', `<span class="src">${ic('file', 11)}Products: 03T 2026</span>`)}</div><div class="xs mute">The agent answers only from approved sources and shows which one it used.</div></div>`; }
  if (n === 5) return plabel('Live preview') + pframe(id, 'What the team sees after ' + nm + ' books a test drive',
    bub('in', 'السلام عليكم، أبغى أجرب V27 بكرة العصر') + bub('vina', 'أكيد! بكرة الأحد عندنا ٤:٠٠ أو ٥:٠٠ أو ٦:٠٠ مساءً. أي وقت يناسبك؟', nm)
    + actCard({name:'Book a test drive', st:'Started', lines:['Found 3 free times on Sun 8 Nov', 'Asked the customer to choose']}) + bub('in', '٥ تمام. اسمي فهد')
    + actCard({name:'Book a test drive', st:'Done', lines:['Booked Sun 8 Nov, 5:00 PM · Madinah Road', 'Status changed to Test drive booked', 'Given to Majed by rule "Qualified to Sales"', 'WhatsApp confirmation and location sent']}));
  return '';
}

/* ---------- Wizard frame ---------- */
const STEP_NOTE = ['Next: who is the agent','Next: rules','Next: what it knows','Next: what it can do','Next: where it lives','Next: test and go live',''];
function goLiveBlock(id) {
  const why = [];
  if (!anyConnected(id)) why.push(['Connect at least one channel in stage 6.', 'setup-6']);
  if (!fresh(id)) why.push([runOf(id) ? 'You changed the agent after the last test run. Run the test scenarios again.' : 'Run the test scenarios.', '']);
  else if (counts(id).fail) why.push([counts(id).fail + ' test scenario' + (counts(id).fail > 1 ? 's' : '') + ' failed. Fix them and run again.', '']);
  return why;
}
// Stage list: a track fills down to the current stage; it grows from the stage you came from (route change only)
function stageNav(n, id) {
  const done = new Set(SU.done[id] || []); const last = SU._lastP;
  const reach = Math.min(7, Math.max(n, ...[...done].map(k => k + 1)));
  const p = (reach - 1) / 6, p0 = S._enter && last !== p ? last || 0 : null; SU._p = p;
  const st = k => k === n ? 'cur' : done.has(k) ? 'ok' : '';
  const items = STAGES.map(([t, d], i) => { const k = i + 1, s = st(k);
    return `<li><a href="#setup-${k}" class="su-stage ${s}" ${s === 'cur' ? 'aria-current="step"' : ''}><span class="su-num ${s === 'ok' ? 'ok' : s === 'cur' ? 'on' : ''} ${s === 'ok' && SU._justDone === k ? 'pop' : ''}">${s === 'ok' ? ic('check', 14) : k}</span><span class="grow" style="min-width:0"><span class="su-st-t">${t}</span><span class="xs mute">${d}</span></span>${s === 'ok' ? '<span class="sr">, finished</span>' : ''}</a></li>`; }).join('');
  return `<nav class="su-stages" aria-label="Setup stages"><div class="su-sthead"><span class="eyebrow">Stage ${n} of 7</span><span class="xs mute">${[...done].filter(k => k >= 1 && k <= 7).length} done</span></div>
    <div class="su-mini">${STAGES.map(([t], i) => { const s = st(i + 1); return `<a href="#setup-${i + 1}" class="${s}" ${s === 'cur' ? 'aria-current="step"' : ''} aria-label="Stage ${i + 1}, ${t}${s === 'ok' ? ', finished' : ''}"><i></i></a>`; }).join('')}</div>
    <ol class="su-ol ${p0 != null ? 'go' : ''}" style="--p:${p};--p0:${p0 == null ? p : p0}">${items}</ol></nav>`;
}
function wizard(n, id) {
  SU.done[id] = SU.done[id] || [];
  SU.step[id] = n; SU.cur = id;
  const title = STAGES[n - 1][0];
  let main, side = preview(n, id);
  if (n === 7) { main = stage7(id); side = ''; } else main = BODY[n](id);
  const back = n > 1 ? `<a class="btn" href="#setup-${n - 1}">${ic('arrowL', 14)}Back</a>` : '';
  const later = `<button type="button" class="btn ghost su-later" data-a="su-later">Save and finish later</button>`;
  let foot;
  if (n < 7) foot = `${back}${later}<span class="sp"></span>${n === 6 && !anyConnected(id) ? `<button type="button" class="btn" data-a="su-next" data-x="${id}" data-n="6">Skip for now</button>` : ''}<span class="xs mute su-note">${STEP_NOTE[n - 1]}</span><button type="button" class="btn pri" data-a="su-next" data-x="${id}" data-n="${n}">Continue${ic('arrowR', 14)}</button>`;
  else {
    const block = goLiveBlock(id); const k = counts(id); const chs = CHANS.filter(ch => ON_CH(chOf(id, ch[0]))).map(ch => ch[1]);
    const chB = block.find(b => b[1] === 'setup-6'), tB = block.find(b => b[1] !== 'setup-6');
    const gate = (ok, text, why, link) => `<li class="su-gate ${ok ? 'ok' : 'no'}">${ic(ok ? 'check' : 'x', 13)}<span>${esc(text)}</span>${why ? `<span class="sr">. ${esc(why)}</span>` : ''}${link || ''}</li>`;
    const tShort = !tB ? 'All ' + k.total + ' test scenarios passed' + (k.check ? ', ' + k.check + ' to check' : '') : !runOf(id) ? 'Test scenarios not run yet' : !fresh(id) ? 'Changed since the last test run' : k.fail + ' test scenario' + (k.fail > 1 ? 's' : '') + ' failed';
    foot = `<div class="su-gatebox"><span class="xs mute su-hide-sm">Before going live</span><ul class="su-gates" id="su-golive-why">${gate(!chB, chB ? 'No channel connected yet' : chs.join(', ') + ' connected', chB && chB[0], chB ? '<a href="#setup-6">Connect in stage 6</a>' : '')}${gate(!tB, tShort, tB && tB[0])}</ul></div>
      ${back}${later}<span class="sp"></span><button type="button" class="btn pri lg su-golive" data-a="su-golive" data-x="${id}" ${block.length ? 'aria-disabled="true" aria-describedby="su-golive-why"' : ''}>${ic('play', 16)}Go live</button>`;
  }
  return `<div class="full su-full">
    <header class="full-top">${LOGO()}<div class="grow" style="min-width:0"><div class="b ell">${id === 'layan' || !SU.live[id] ? 'Set up a new agent' : 'Set up ' + esc(agentName(id))}</div><div class="xs mute ell">${esc(client().name)} · progress is saved · <a href="#clients">Switch client</a></div></div>
      <span class="pill c-teal su-hide-sm">VINA team</span><button type="button" class="btn sm ghost su-show-sm" data-a="su-later">Save and finish later</button><button type="button" class="ibtn su-hide-sm" data-a="theme" aria-label="Light or dark">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}</button><a class="ibtn" href="#agents" aria-label="Close setup">${ic('x')}</a></header>
    <div class="su-wrap ${side ? '' : 'noside'}">
      ${stageNav(n, id)}
      <main id="main" tabindex="-1" class="su-main"><div class="su-mhead"><h1>${title}</h1></div>${main}
        <div class="su-foot ${n === 7 ? 'su-foot7' : ''}">${foot}</div></main>
      ${side ? `<aside class="su-side" aria-label="Live preview">${side}</aside>` : ''}
    </div></div>`;
}
function stage7(id) {
  const c = cfgOf(id); const r = runOf(id); const run = SU.running && SU.running.id === id ? SU.running : null; const k = counts(id);
  const sum = [[1, 'Your business', `${c.biz.name} · ${(BTYPES.find(b => b[0] === c.biz.type) || [])[1]} · ${c.biz.city}`],[2, 'Who is the agent', `${c.agent.name || 'No name yet'} · ${c.agent.job} · ${c.agent.tone} · ${Object.keys(c.agent.langs).filter(l => c.agent.langs[l]).join(', ')}`],[3, 'Rules', `${c.rules.never.length} topics blocked · hands over to ${c.rules.who === 'cc' ? 'the call centre' : 'sales'}`],[4, 'What it knows', `${c.know.files.filter(f => f.st === 'Ready' && f.on).length} files ready${c.know.files.some(f => f.st === 'Failed') ? ' · ' + c.know.files.filter(f => f.st === 'Failed').length + ' failed' : ''} · ${c.know.links.length} links · ${c.know.faq.length} answers`],[5, 'What it can do', `${c.actions.filter(a => a.on && !a.needs).length} of ${c.actions.length} actions on`],[6, 'Where it lives', CHANS.filter(ch => ON_CH(chOf(id, ch[0]))).map(ch => ch[1]).join(', ') || 'No channel connected yet']];
  if (!run) delete (SU._bars || {})['s7-' + id];
  const prog = run ? Math.round(run.i / run.list.length * 100) : 0;
  const status = run ? `<div class="row tight nowrap"><span class="small b grow">Running ${run.i} of ${run.list.length}</span><span class="xs mute num">${prog}%</span></div>${gbar('s7-' + id, prog)}`
    : r ? `<div class="row tight">${chipC(k.pass + ' passed', 'green')}${k.fail ? chipC(k.fail + ' failed', 'red') : ''}${k.check ? chipC(k.check + ' to check', 'amber') : ''}<span class="xs ${fresh(id) ? 'mute' : 'amber'}">${esc(r.when)}${fresh(id) ? '' : ' · before your last change'}</span></div>
      <div class="su-stack grow-x" role="img" aria-label="${k.pass} passed, ${k.fail} failed, ${k.check} to check">${[['g', k.pass], ['r', k.fail], ['a', k.check]].map(([cl, v]) => v ? `<i class="${cl}" style="flex:${v}"></i>` : '').join('')}</div>`
    : `<p class="small mute">Not run yet. Run them before going live.</p>`;
  const rows = SU.scen.map(s => { const now = runState(run, s.id); const res = now ? '' : run ? run.res[s.id] : r && r.res[s.id];
    const col = now === 'now' ? 'blue' : res === 'pass' ? 'green' : res === 'fail' ? 'red' : res === 'check' ? 'amber' : 'grey';
    const lab = now === 'now' ? 'Running…' : now === 'wait' ? 'Waiting' : res === 'pass' ? 'Passed' : res === 'fail' ? 'Failed' : res === 'check' ? 'To check' : 'Not run';
    return `<div class="li su-sc ${now}"><span class="chi c-${col} ${now ? '' : tickIn(s.id)}">${now === 'now' ? spin() : now === 'wait' ? ic('clock', 13) : ic(res === 'pass' ? 'check' : res === 'fail' ? 'x' : res === 'check' ? 'info' : 'minus', 14)}</span><div class="grow" style="min-width:0"><div class="small b ell">${esc(s.name)}</div><div class="xs ${res === 'fail' ? 'red' : res === 'check' ? 'amber' : 'mute'}">${lab} · ${esc(s.lang)}</div>${now === 'now' ? '<span class="su-read" aria-hidden="true"><i></i></span>' : ''}</div>${!now && (res === 'fail' || res === 'check') ? `<a class="btn sm ghost" href="#scenarios-${s.id}" data-a="su-see" data-x="${id}">See why${res === 'fail' ? ' it failed' : ''}</a>` : ''}<button type="button" class="ibtn sm bare" data-a="su-run1" data-x="${id}|${s.id}" aria-label="Run again: ${esc(s.name)}" title="Run again" ${run ? 'disabled' : ''}>${ic('refresh', 15)}</button></div>`; }).join('');
  return `<div class="su-s7">${chatBox('s7-' + id, id, {sub:'Type, tap a suggestion, or send a voice note'})}
    <div class="col">
      <section class="card rc su-scard"><header class="rc-h"><div class="grow"><h2>Test scenarios</h2><div class="sub">${SU.scen.length} ready-made for car dealers</div></div><button type="button" class="btn sm" data-a="su-runall" data-x="${id}" ${run ? 'disabled' : ''}>${run ? spin() + 'Running' : ic('play', 14) + (r ? 'Run all again' : 'Run all')}</button></header>
        <div class="rc-b"><div class="col tight su-runbox">${status}</div>
        <div class="list">${rows}</div></div></section>
      <section class="card rc"><header class="rc-h"><div class="grow"><h2>Summary</h2><div class="sub">Stages 1 to 6</div></div></header><div class="rc-b"><div class="list">${sum.map(([n, t, v]) => `<div class="li"><span class="su-num ok">${ic('check', 13)}</span><div class="grow"><div class="small b">${t}</div><div class="xs mute">${esc(v)}</div></div><a class="btn sm ghost" href="#setup-${n}">Edit<span class="sr"> ${t}</span></a></div>`).join('')}</div></div></section>
    </div></div>`;
}

/* ---------- Wizard actions ---------- */
A['su-type'] = (el) => { const id = el.dataset.x, k = el.dataset.v; const c = cfgOf(id); const pr = PRESET[k]; c.biz.type = k; c.agent.tone = pr.tone; c.rules.never = pr.never.slice(); c.actions.forEach(a => { a.on = !a.needs && !pr.off.includes(a.id); }); };
A['su-logo'] = (el) => { const f = el.files && el.files[0]; if (!f) return false; if (!/^image\//.test(f.type)) { toast('Use a PNG, JPG or SVG image for the logo.'); return false; } const rd = new FileReader(); rd.onload = () => { cfgOf(el.dataset.x).biz.logo = rd.result; render(); }; rd.readAsDataURL(f); return false; };
A['su-branch'] = (fm) => { const v = (S.f.suBranch || '').trim(); if (!v) return false; cfgOf(fm.dataset.x).biz.branches.push(v); S.f.suBranch = ''; };
A['su-never'] = (fm) => { const v = (S.f.suNever || '').trim(); if (!v) return false; const r = cfgOf(fm.dataset.x).rules; if (!r.never.some(x => x.toLowerCase() === v.toLowerCase())) r.never.push(v); S.f.suNever = ''; };
A['su-never-add'] = (el) => { cfgOf(el.dataset.x).rules.never.push(el.dataset.v); };
A['su-upload'] = (el) => {
  const id = el.dataset.x; const k = cfgOf(id).know; const fs = [...(el.files || [])];
  fs.forEach(f => {
    const ext = (f.name.split('.').pop() || '').toUpperCase().replace('XLSX', 'XLS').replace('DOCX', 'DOC');
    const row = {n:f.name, ext, meta:Math.max(1, Math.round(f.size / 1024)) + ' KB', st:'Reading', on:true};
    if (!EXT_OK.test(f.name)) Object.assign(row, {st:'Failed', on:false, why:'File type not supported. Use PDF, Word, Excel or text.'});
    else if (f.size > 20 * 1024 * 1024) Object.assign(row, {st:'Failed', on:false, why:'File too big. The limit is 20 MB. Split it or save a smaller copy.'});
    k.files.push(row);
    if (row.st === 'Reading') setTimeout(() => { row.st = 'Ready'; row.meta = ext === 'XLS' ? 'Sheets read' : 'Read and ready'; flash('src-' + row.n); render(); }, 2000);
  });
  el.value = '';
};
A['su-link'] = (fm) => { const v = (S.f.suLink || '').trim(); S.f.suLinkErr = ''; if (!v) return; if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v)) { S.f.suLinkErr = 'That does not look like a website address. Write it like icaur-alghanim.sa/offers'; return; } const row = {u:v.replace(/^https?:\/\//, ''), meta:'', st:'Reading', on:true}; cfgOf(fm.dataset.x).know.links.push(row); S.f.suLink = ''; setTimeout(() => { row.st = 'Ready'; row.meta = (3 + v.length % 9) + ' pages'; flash('src-' + row.u); render(); }, 2000); };
A['su-faq'] = (fm) => { const q = (S.f.suQ || '').trim(), a = (S.f.suA || '').trim(); if (!q || !a) { toast('Write both the question and the answer.'); return false; } cfgOf(fm.dataset.x).know.faq.push({q, a, on:true}); S.f.suQ = S.f.suA = ''; };
A['su-faq-paste'] = (fm) => { const rows = (S.f.suPaste || '').split('\n').map(l => l.split('|').map(x => x.trim())).filter(x => x[0] && x[1]); if (!rows.length) { toast('Write one per line, like: question | answer'); return false; } rows.forEach(([q, a]) => cfgOf(fm.dataset.x).know.faq.push({q, a, on:true})); S.f.suPaste = ''; toast('Added ' + rows.length + ' answers'); };
A['su-prod-add'] = (el) => { const id = el.dataset.x; const p = cfgOf(id).know.products; p.push({m:'', y:'2026', tr:'', c:'', sp:'', o:'', p:''}); SU.pEdit = id + (p.length - 1); };
A['su-prod-edit'] = (el) => { SU.pEdit = el.dataset.x; };
A['su-prod-done'] = () => { SU.pEdit = null; };
A['su-prod-import'] = (el) => { const p = cfgOf(el.dataset.x).know.products; if (!p.some(r => r.m === 'V23')) p.push({m:'V23', y:'2026', tr:'Standard', c:'White, Blue', sp:'1.5T · 5 seats', o:'Launch offer', p:'99,900'}); toast('Imported Products.xlsx · 1 new model, ' + (p.length - 1) + ' already in the list'); };
A['su-web-check'] = (el) => { const c = cfgOf(el.dataset.x); c.ch.web = 'Checking'; setTimeout(() => { c.ch.web = 'Connected'; toast('Found the VINA plugin on icaur-alghanim.sa'); render(); }, 1500); };
A['su-next'] = (el) => {
  const id = el.dataset.x, n = Number(el.dataset.n); const c = cfgOf(id);
  if (n === 1 && !c.biz.name.trim()) { toast('Write the business name first.'); return; }
  if (n === 2 && !c.agent.name.trim()) { toast('Give the agent a name first.'); return; }
  const d = SU.done[id] || (SU.done[id] = []); if (!d.includes(n)) { d.push(n); SU._justDone = n; }
  go('setup-' + (n + 1));
};
A['su-later'] = () => { toast('Saved. Continue any time from Agents.'); go('agents'); };
A['su-runall'] = (el) => { runAll(el.dataset.x); return false; };
A['su-run1'] = (el) => { const [id, sid] = el.dataset.x.split('|'); runAll(id, [sid]); return false; };
A['su-see'] = (el) => { SU.cur = el.dataset.x; return false; };
A['su-golive'] = (el) => {
  const id = el.dataset.x; if (goLiveBlock(id).length) return;
  const c = cfgOf(id); CHANS.forEach(([k]) => { if (c.ch[k] === 'Checking') c.ch[k] = 'Not connected'; if (window.VINA_CONNECTED && chOf(id, k) === 'Connected') c.ch[k] = 'Connected'; });
  CHANS.forEach(([k]) => { if (ON_CH(c.ch[k])) SU.agents.forEach(a => { if (a.id !== id) { [SU.live[a.id], SU.drafts[a.id]].forEach(x => { if (x && ON_CH(x.ch[k])) x.ch[k] = 'Not connected'; }); } }); });
  SU.ver[id] = (SU.ver[id] || 0) + 1; SU.live[id] = clone(c); SU.runs[id].ver = 'live'; SU.runs[id].sig = sig(id);
  (SU.hist[id] || (SU.hist[id] = [])).unshift({v:SU.ver[id], who:meName(), when:nowStr(), what:'Went live', snap:clone(c)});
  const a = SU.agents.find(x => x.id === id); Object.assign(a, {st:'live', chats:0, since:'Today', by:meName()});
  (SU.done[id] || []).push(7); SU.lastLive = id; go('setup-done');
};

R('setup', {id:'S1', title:'Set up your agent', roles:['vina'], states:[['empty','Nothing added yet (S4)'],['toobig','File too big (S4)'],['badtype','File type not supported (S4)'],['reading','Reading a file (S4)']], render(p) {
  const n = Math.min(7, Math.max(1, Number(p) || 1)); const id = SU.wiz && cfgOf(SU.wiz) ? SU.wiz : 'layan';
  return wizard(n, id);
}, after() { SU._lastP = SU._p; SU._justDone = 0; }});
R('setup-done', {id:'S7', title:'Live', roles:['vina'], render() {
  const id = SU.lastLive || SU.wiz; const c = cfgOf(id); const chs = CHANS.filter(ch => ON_CH(c.ch[ch[0]]));
  const next = [['conv', 'New chats are answered now', 'Customers get a reply in seconds, day and night.'], ['route', 'Ready leads go to the team', 'By your assignment rules, with an alert for the person who gets it.'], ['tests', 'Every change is tested first', 'Edits in Agents go live only after all test scenarios pass.']];
  return `<div class="full"><header class="full-top">${LOGO()}<span class="sp"></span><a class="ibtn" href="#agents" aria-label="Close">${ic('x')}</a></header>
    <div class="su-donewrap"><main id="main" tabindex="-1" class="card su-done ${S._enter ? 'go' : ''}">
      <div class="su-mark" aria-hidden="true"><span class="su-ring"></span><span class="su-ring r2"></span>${agAv(id, 'xl')}<span class="su-ok">${ic('check', 16)}</span></div>
      <span class="chip c-green su-d1">${pulse('green')}Live · version ${SU.ver[id] || 1}</span>
      <h1 class="su-d1">${esc(c.agent.name)} is live on ${esc(chs.map(ch => ch[1]).join(' and ') || 'your channels')}</h1>
      <p class="mute su-d2">Customers now get answers in seconds. Every chat, lead and action shows in the dashboard, and the team gets an alert when a lead is ready.</p>
      <ul class="su-donelist su-d2">${next.map(([i, t, d]) => `<li><span class="chi c-teal">${ic(i, 14)}</span><span><b class="small">${t}</b><span class="xs mute" style="display:block">${d}</span></span></li>`).join('')}</ul>
      <div class="row su-d3" style="justify-content:center"><a class="btn pri lg" href="#overview">Open dashboard</a><a class="btn lg" href="#agent-${id}">Open ${esc(c.agent.name)}</a></div></main></div></div>`;
}});

/* ---------- Shared with 70-agents.js ---------- */
Object.assign(SU.lib, {clone, cfgOf, agentName, agAv, unsaved, secDirty, sig, counts, fresh, runOf, runAll, evalScen, chatBox, BODY, STAGES, CHANS, ON_CH, chOf, STEP_T, AVBG, BTYPES, S5_IDS, goLiveBlock, anyConnected, runState, tickIn, spin, gbar, actCard, newCfg:() => cfg0(c => { Object.assign(c.agent, {name:'', av:'3', job:'Sales', firstAr:'هلا! كيف أقدر أساعدك؟', firstEn:'Hi! How can I help you?'}); c.ch = {web:'Not connected', wa:'Not connected', ph:'Not connected', fb:'Not connected'}; })});

/* ---------- Styles ---------- */
document.head.insertAdjacentHTML('beforeend', `<style>
.su-full .full-top .logo{height:26px}
.su-at{align-items:flex-start}
.su-spin{display:inline-block;width:11px;height:11px;flex:0 0 11px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:spin .7s linear infinite}
.su-wrap{display:grid;grid-template-columns:248px minmax(0,1fr) 380px;gap:28px;padding:28px 28px 40px;align-items:start;width:100%;max-width:1520px;margin:0 auto}
.su-wrap.noside{grid-template-columns:248px minmax(0,1fr)}
/* Stage list: rail + fill track, ticks pop when a stage completes */
.su-stages{position:sticky;top:92px}
.su-sthead{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:0 10px 12px}
.su-ol{position:relative;list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.su-ol::before,.su-ol::after{content:"";position:absolute;left:23px;top:26px;width:2px;border-radius:2px;pointer-events:none}
.su-ol::before{bottom:26px;background:var(--line2)}
.su-ol::after{height:calc((100% - 52px) * var(--p));background:linear-gradient(var(--aqua),var(--horizon) 50%,var(--pri))}
.su-ol.go::after{animation:suFill var(--d4) var(--ease) both}
@keyframes suFill{from{height:calc((100% - 52px) * var(--p0))}}
.su-stage{display:flex;align-items:center;gap:12px;min-height:52px;padding:6px 10px;border-radius:12px;text-decoration:none;color:var(--text);transition:background var(--d1) var(--ease),box-shadow var(--d2)}
.su-stage:hover{background:var(--sub)}
.su-stage.cur{background:var(--card);box-shadow:var(--e2),0 0 0 1px var(--card-bd)}
.su-st-t{display:block;font-size:13.5px;font-weight:600;line-height:18px}
.su-stage:not(.cur):not(.ok) .su-st-t{color:var(--mute)}
.su-stage.cur .su-st-t{font-weight:700}
.su-num{position:relative;z-index:1;width:28px;height:28px;flex:0 0 28px;border-radius:50%;border:1.5px solid var(--line2);background:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--mute);font-variant-numeric:tabular-nums}
.su-num.ok{background:var(--pri);border-color:var(--pri);color:var(--on-pri)}
.su-num.on{background:var(--card);border:2px solid var(--pri);color:var(--pri);box-shadow:0 0 0 4px var(--ring)}
.su-num.pop{animation:suPop var(--d4) var(--spring) 120ms both}
@keyframes suPop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.14);opacity:1}100%{transform:scale(1)}}
.su-mini{display:none}
.su-show-sm{display:none}
/* Content card with one title, lead line and a sticky footer */
.su-main{display:flex;flex-direction:column;gap:24px;min-width:0;background:var(--card);border:1px solid var(--card-bd);border-radius:var(--r-l);box-shadow:var(--e1);padding:32px 32px 0}
.su-main.enter>*:not(.su-foot){animation:rise var(--d4) var(--ease) both}
.su-main.enter>*:nth-child(2){animation-delay:60ms} .su-main.enter>*:nth-child(3){animation-delay:120ms}
.su-mhead{display:flex;flex-direction:column;gap:8px}
.su-mhead h1{font-size:26px;line-height:32px;font-weight:700;letter-spacing:-.02em}
.su-foot{position:sticky;bottom:0;z-index:6;display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;margin:0 -32px;padding:14px 32px;background:color-mix(in srgb,var(--card) 90%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid var(--line);border-radius:0 0 var(--r-l) var(--r-l)}
.su-gatebox{flex-basis:100%;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}
.su-gates{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.su-gate{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600}
.su-gate.ok{background:var(--green-b);color:var(--green-f)} .su-gate.no{background:var(--red-b);color:var(--red-f)}
.su-gate a{color:inherit;font-weight:700;margin-inline-start:2px}
.su-golive:not([aria-disabled="true"]){box-shadow:0 0 0 4px var(--ring),0 8px 20px -8px var(--pri)}
/* Live previews */
.su-side{position:sticky;top:92px;display:flex;flex-direction:column;gap:10px;min-width:0}
.su-plabel{display:flex;align-items:center;gap:6px;padding-inline-start:2px}
.su-prev{overflow:hidden}
.su-prevh{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line)}
.su-prevchat{min-height:240px;padding:16px;background:var(--bg)}
.su-prevchat .msg{max-width:88%}
.su-seq>*{animation:msgIn var(--d3) var(--spring) both}
.su-seq>*:nth-child(2){animation-delay:250ms} .su-seq>*:nth-child(3){animation-delay:500ms} .su-seq>*:nth-child(4){animation-delay:750ms} .su-seq>*:nth-child(5){animation-delay:1000ms} .su-seq>*:nth-child(6){animation-delay:1250ms}
.su-k3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.su-kv{font-family:var(--f-display);font-size:28px;line-height:34px;font-weight:700;font-variant-numeric:tabular-nums}
/* Action cards in chats: Started (working) flips to Done */
.su-ac-i{width:24px;height:24px;flex-basis:24px;border-radius:7px}
.actcard .st .chip{gap:5px}
.actcard.su-ac-work{border-style:dashed}
.actcard.su-ac-pop .st .chip{animation:suPop var(--d3) var(--spring) both}
.actcard.su-ac-pop li{animation:rise var(--d3) var(--ease) both}
.actcard.su-ac-pop li:nth-child(2){animation-delay:70ms} .actcard.su-ac-pop li:nth-child(3){animation-delay:140ms} .actcard.su-ac-pop li:nth-child(4){animation-delay:210ms} .actcard.su-ac-pop li:nth-child(n+5){animation-delay:280ms}
/* Stage bodies */
.su-g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px}
.su-g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px}
.su-types{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px}
.su-type{flex-direction:column;align-items:flex-start;gap:10px}
.su-hours{display:flex;flex-direction:column;gap:6px}
.su-hrow{display:grid;grid-template-columns:110px 42px minmax(0,130px) auto minmax(0,130px);align-items:center;gap:10px;min-height:44px}
.su-hrow .inp{min-height:38px}
.su-avpick{width:44px;height:44px;border-radius:50%;border:3px solid transparent;color:#FFFFFF;font-weight:700;font-size:16px;cursor:pointer;transition:transform var(--d1) var(--ease)}
.su-avpick:active{transform:scale(.94)}
.su-avpick[aria-checked="true"]{border-color:var(--pri);box-shadow:0 0 0 2px var(--card) inset}
.su-src{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;background:var(--sub)}
.su-src.bad{background:var(--red-b)}
.su-read{display:block;position:relative;height:4px;width:min(160px,100%);margin-top:6px;border-radius:99px;background:var(--sub2);overflow:hidden}
.su-read i{position:absolute;top:0;bottom:0;left:0;width:40%;border-radius:inherit;background:var(--horizon);animation:suRead 1.1s var(--ease) infinite}
@keyframes suRead{from{transform:translateX(-100%)}to{transform:translateX(260%)}}
.su-drop{display:flex;align-items:center;gap:14px;padding:18px;border:1.5px dashed var(--line2);border-radius:12px;cursor:pointer;color:var(--mute);transition:border-color var(--d1),background var(--d1)}
.su-drop:hover,.su-drop:focus-within{border-color:var(--horizon);background:var(--sel)}
.su-act{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-radius:12px;background:var(--sub);transition:background var(--d2),box-shadow var(--d2)}
.su-act.on{background:var(--card);box-shadow:var(--e1),0 0 0 1px var(--line),inset 3px 0 0 var(--aqua)}
.su-act.off .su-act-t{color:var(--mute)}
.su-act.chg{box-shadow:0 0 0 1px var(--amber-f),inset 3px 0 0 var(--amber)}
.su-chcard{display:flex;flex-direction:column;gap:12px}
.su-chcard.on{background:var(--card);box-shadow:var(--e1),0 0 0 1px var(--line),inset 3px 0 0 var(--green)}
/* S7 test and go live */
.su-s7{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:18px;align-items:start}
.su-chat{display:flex;flex-direction:column;min-height:560px;max-height:720px}
.su-chath{padding:14px 16px;border-bottom:1px solid var(--line)}
.su-chat-list{flex:1;min-height:300px;background:var(--bg)}
.su-sugg{min-height:32px;font-size:12px}
.su-scard .card-h{margin-bottom:12px}
.su-runbox{margin-bottom:6px}
.su-sc{gap:10px;padding:9px 0;min-height:52px}
.su-sc.wait{opacity:.6}
.su-sc .ibtn[disabled]{opacity:.35;cursor:not-allowed}
.su-tick{animation:suPop var(--d3) var(--spring) both}
.su-bar{display:block;height:6px;border-radius:999px;background:var(--sub2);overflow:hidden}
.su-bar>i{display:block;height:100%;border-radius:inherit;background:var(--horizon);transition:width var(--d3) var(--ease)}
.su-bar>i.go{animation:suW var(--d3) var(--ease) both}
@keyframes suW{from{width:var(--p0)}}
.su-stack{display:flex;gap:2px;height:8px;border-radius:999px;overflow:hidden;background:var(--sub2);margin-top:2px}
.su-stack i{display:block;height:100%} .su-stack .g{background:var(--green)} .su-stack .r{background:var(--red)} .su-stack .a{background:var(--amber)}
.su-paste summary{cursor:pointer;min-height:32px;display:inline-flex;align-items:center}
/* Success: one calm moment, the agent mark with a ring */
.su-donewrap{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 16px}
.su-done{width:min(560px,100%);display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:44px 36px 36px}
.su-done h1{font-size:26px;line-height:32px;font-weight:700;letter-spacing:-.02em}
.su-mark{position:relative;width:112px;height:112px;display:grid;place-items:center;margin-bottom:4px}
.su-mark::before{content:"";position:absolute;inset:6px;border-radius:50%;border:2px solid color-mix(in srgb,var(--aqua) 55%,transparent)}
.su-mark .av.xl{width:80px;height:80px;flex-basis:80px;font-size:30px;box-shadow:0 12px 28px -12px var(--horizon)}
.su-ring{position:absolute;inset:6px;border-radius:50%;border:2px solid var(--aqua);opacity:0}
.su-ok{position:absolute;right:10px;bottom:10px;width:28px;height:28px;border-radius:50%;background:var(--green);color:#FFFFFF;display:grid;place-items:center;box-shadow:0 0 0 3px var(--card)}
.su-done.go .su-ring{animation:suRing 1.6s var(--ease) 250ms both} .su-done.go .su-ring.r2{animation-delay:650ms}
.su-done.go .su-mark .av{animation:suPop var(--d4) var(--spring) both}
.su-done.go .su-ok{animation:suPop var(--d4) var(--spring) 450ms both}
.su-done.go .su-d1{animation:rise var(--d4) var(--ease) 300ms both} .su-done.go .su-d2{animation:rise var(--d4) var(--ease) 400ms both} .su-done.go .su-d3{animation:rise var(--d4) var(--ease) 500ms both}
@keyframes suRing{0%{transform:scale(.8);opacity:0}25%{opacity:.7}100%{transform:scale(1.45);opacity:0}}
.su-donelist{list-style:none;margin:0;padding:16px;display:flex;flex-direction:column;gap:12px;text-align:start;width:100%;background:var(--sub);border-radius:var(--r-m)}
.su-donelist li{display:flex;gap:12px;align-items:flex-start}
@media (min-width:1181px){.su-wrap.noside .su-foot{padding-inline-end:236px}}
@media (max-width:1180px){.su-wrap,.su-wrap.noside{grid-template-columns:220px minmax(0,1fr);padding:20px}.su-side{grid-column:2;position:static}.su-s7{grid-template-columns:1fr}}
@media (max-width:760px){
  .su-stages,.su-main,.su-side{min-width:0}
  .su-wrap,.su-wrap.noside{grid-template-columns:minmax(0,1fr);padding:12px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));gap:16px}
  .su-stages{position:static}.su-sthead{padding:0 2px 6px}
  .su-ol{display:none}
  .su-mini{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
  .su-mini a{display:flex;align-items:center;height:24px}
  .su-mini i{display:block;width:100%;height:6px;border-radius:999px;background:var(--line2);transition:background var(--d2)}
  .su-mini .ok i{background:var(--pri)} .su-mini .cur i{background:var(--horizon);box-shadow:0 0 0 3px var(--ring)}
  .su-side{grid-column:1}
  .su-main{padding:20px 18px 0;gap:20px}
  .su-mhead h1{font-size:22px;line-height:28px}
  .su-foot{margin:0 -18px;padding:12px 18px}
  .su-foot .su-later,.su-note,.su-hide-sm{display:none}
  .su-show-sm{display:inline-flex}
  /* keep the prototype pill (review aid) clear of the sticky footer buttons */
  body:has(.su-foot) .proto{bottom:86px} body:has(.su-foot7) .proto{bottom:150px}
  .su-full .full-top>.grow{visibility:hidden}
  .su-gate{font-size:11.5px;min-height:26px;padding:0 9px}
  .su-chsub{display:none}
  .su-chat{min-height:480px}
  .su-hrow{grid-template-columns:90px 42px 1fr}.su-hrow .mute:nth-of-type(1),.su-hrow input[type=time]:last-of-type{grid-column:3}
  .su-done{padding:32px 20px 24px}.su-done h1{font-size:22px;line-height:28px}
}
</style>`);
})();
