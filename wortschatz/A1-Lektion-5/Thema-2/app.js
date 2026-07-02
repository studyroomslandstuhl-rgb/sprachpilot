const CFG=window.SP_L5_THEME||{id:'Thema-2',title:'Uhrzeit',sub:'A1 Lektion 5 · Thema 2',key:'SP_L5_T2_V1'};
const VOCAB=[
{id:'spaet',word:'spät',type:'adverb',image:'/assets/img/spaet.png',sentence:'Wie spät ist es?',tr:{en:'late',ru:'поздно',tr:'geç',uk:'пізно',ar:'متأخر',ja:'遅い',ro:'târziu'}},
{id:'schon',word:'schon',type:'adverb',image:'/assets/img/schon.png',sentence:'Es ist schon zehn Uhr.',tr:{en:'already',ru:'уже',tr:'zaten',uk:'вже',ar:'بالفعل',ja:'もう',ro:'deja'}},
{id:'erst',word:'erst',type:'adverb',image:'/assets/img/erst.png',sentence:'Es ist erst acht Uhr.',tr:{en:'only / not until',ru:'только',tr:'daha / sadece',uk:'лише / тільки',ar:'فقط',ja:'まだ / たった',ro:'abia / doar'}},
{id:'viertel',article:'das',word:'Viertel',full:'das Viertel',plural:'die Viertel',type:'noun',image:'/assets/img/viertel.png',sentence:'Es ist Viertel nach fünf.',tr:{en:'quarter',ru:'четверть',tr:'çeyrek',uk:'чверть',ar:'ربع',ja:'4分の1',ro:'sfert'}},
{id:'halb',word:'halb',type:'time',image:'/assets/img/halb.png',sentence:'Es ist halb neun.',tr:{en:'half',ru:'половина',tr:'yarım',uk:'половина',ar:'نصف',ja:'半',ro:'jumătate'}},
{id:'uhr',article:'die',word:'Uhr',full:'die Uhr',plural:'die Uhren',type:'noun',image:'/assets/img/uhr.png',sentence:'Es ist ein Uhr.',tr:{en:'clock / o’clock',ru:'часы / час',tr:'saat',uk:'годинник / година',ar:'ساعة',ja:'時計 / 時',ro:'ceas / ora'}},
{id:'kurz',word:'kurz',type:'adverb',image:'/assets/img/kurz.png',sentence:'Es ist kurz vor elf.',tr:{en:'shortly / just',ru:'незадолго',tr:'az kala',uk:'незадовго',ar:'قبل قليل',ja:'少し前',ro:'cu puțin înainte'}},
{id:'gleich',word:'gleich',type:'adverb',image:'/assets/img/gleich.png',sentence:'Es ist gleich elf.',tr:{en:'soon / almost',ru:'скоро / почти',tr:'hemen / neredeyse',uk:'скоро / майже',ar:'قريبًا / تقريبًا',ja:'もうすぐ / ほぼ',ro:'imediat / aproape'}}
];
const WORDS=VOCAB;
const TIMES=[
{id:'t0515',label:'5:15',h:5,m:15,formal:['fünf Uhr fünfzehn'],informal:['Viertel nach fünf','fünfzehn nach fünf']},
{id:'t1015',label:'10:15',h:10,m:15,formal:['zehn Uhr fünfzehn'],informal:['Viertel nach zehn','fünfzehn nach zehn']},
{id:'t1045',label:'10:45',h:10,m:45,formal:['zehn Uhr fünfundvierzig'],informal:['Viertel vor elf','fünfzehn vor elf']},
{id:'t1030',label:'10:30',h:10,m:30,formal:['zehn Uhr dreißig'],informal:['halb elf']},
{id:'t0830',label:'8:30',h:8,m:30,formal:['acht Uhr dreißig'],informal:['halb neun']},
{id:'t1057',label:'10:57',h:10,m:57,formal:['zehn Uhr siebenundfünfzig'],informal:['kurz vor elf','gleich elf','drei vor elf']},
{id:'t0750',label:'7:50',h:7,m:50,formal:['sieben Uhr fünfzig'],informal:['zehn vor acht','kurz vor acht']},
{id:'t0905',label:'9:05',h:9,m:5,formal:['neun Uhr fünf'],informal:['fünf nach neun','kurz nach neun']},
{id:'t1200',label:'12:00',h:12,m:0,formal:['zwölf Uhr'],informal:['zwölf Uhr']},
{id:'t1300',label:'13:00',h:13,m:0,formal:['dreizehn Uhr'],informal:['ein Uhr']},
{id:'t1705',label:'17:05',h:17,m:5,formal:['siebzehn Uhr fünf'],informal:['fünf nach fünf']},
{id:'t1815',label:'18:15',h:18,m:15,formal:['achtzehn Uhr fünfzehn'],informal:['Viertel nach sechs','fünfzehn nach sechs']},
{id:'t2145',label:'21:45',h:21,m:45,formal:['einundzwanzig Uhr fünfundvierzig'],informal:['Viertel vor zehn','fünfzehn vor zehn']}
];
const SCHON_ERST=[
{word:'erst',dialog:['A: Der Kurs beginnt um neun Uhr.','B: Nein, wir haben noch Zeit. Es ist ___ zehn vor neun.']},
{word:'schon',dialog:['A: Der Kurs beginnt um zehn Uhr.','B: Beeil dich! Es ist ___ fünf nach zehn.']},
{word:'erst',dialog:['A: Der Bus kommt um acht Uhr.','B: Keine Sorge. Es ist ___ fünf vor acht.']},
{word:'schon',dialog:['A: Ist es zwölf Uhr?','B: Nein, es ist ___ zehn nach zwölf.']},
{word:'erst',dialog:['A: Der Termin ist um vier Uhr.','B: Wir sind früh. Es ist ___ kurz vor vier.']},
{word:'schon',dialog:['A: Ich dachte, es ist sechs Uhr.','B: Es ist ___ kurz nach sechs.']}
];
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')}catch(e){return null}}
function langKey(){const m=String(profile()?.muttersprache||profile()?.motherLanguage||'').toLowerCase();if(m.includes('russ'))return'ru';if(m.includes('türk')||m.includes('turk'))return'tr';if(m.includes('ukrain'))return'uk';if(m.includes('arab'))return'ar';if(m.includes('japan'))return'ja';if(m.includes('rumän')||m.includes('ruman')||m.includes('roman'))return'ro';return'en'}
function tr(w){const t=w.tr||{};return t[langKey()]||t.en||'—'}
function full(w){return w.full||((w.article?`${w.article} `:'')+w.word)}
function simple(x){return String(x||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:]/g,'').replace(/\s+/g,' ')}
function withSentence(a){return a.concat(a.map(x=>'Es ist '+x))}
function ok(v,arr){const s=simple(v);return arr.some(x=>simple(x)===s)}
function allAnswers(t){return withSentence([...(t.formal||[]),...(t.informal||[])])}
function formalAnswers(t){return withSentence(t.formal||[])}
function informalAnswers(t){return withSentence(t.informal||[])}
function digitalAnswers(t){const m=String(t.m||0).padStart(2,'0');const hours=[t.h];if(t.h>12)hours.push(t.h-12);else if(t.h>0&&t.h<12)hours.push(t.h+12);const forms=[];hours.forEach(h=>{const hs=String(h),hh=String(h).padStart(2,'0');forms.push(`${hs}:${m}`,`${hh}:${m}`,`${hs}.${m}`,`${hh}.${m}`,`${hs}:${m} Uhr`,`${hh}:${m} Uhr`,`${hs}.${m} Uhr`,`${hh}.${m} Uhr`);if(t.m===0)forms.push(hs,hh,`${hs} Uhr`,`${hh} Uhr`)});return withSentence([...new Set(forms)])}
function hourWordAnswers(t){if(t.m!==0)return[];const names={1:['ein','eins'],2:['zwei'],3:['drei'],4:['vier'],5:['fünf'],6:['sechs'],7:['sieben'],8:['acht'],9:['neun'],10:['zehn'],11:['elf'],12:['zwölf'],13:['dreizehn'],14:['vierzehn'],15:['fünfzehn'],16:['sechzehn'],17:['siebzehn'],18:['achtzehn'],19:['neunzehn'],20:['zwanzig'],21:['einundzwanzig'],22:['zweiundzwanzig'],23:['dreiundzwanzig']};const hs=[t.h];if(t.h>12)hs.push(t.h-12);else if(t.h>0&&t.h<12)hs.push(t.h+12);let forms=[];hs.forEach(h=>{forms=forms.concat(names[h]||[])});return withSentence([...new Set(forms)])}
function looseAnswers(t){return allAnswers(t).concat(digitalAnswers(t)).concat(hourWordAnswers(t))}
function formalLooseAnswers(t){return formalAnswers(t).concat(digitalAnswers(t)).concat(hourWordAnswers(t))}
function informalLooseAnswers(t){return informalAnswers(t).concat(hourWordAnswers(t))}
function help3(n,a,b,c){if(n===1)return `<div class="no">${a}</div>`;if(n===2)return `<div class="hint">${b}</div>`;return `<div class="no">Lösung: ${c}</div>`}
function imgHtml(w){return w.image?`<img src="${w.image}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`}
function bigImgHtml(w){return w.image?`<img class="task-img" src="${w.image}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`}
function fixImg(img){const ph=document.createElement('div');ph.className='word-placeholder';ph.textContent='kein Bild';img.replaceWith(ph)}
function clock(t){let h=t.h%12,m=t.m,hr=((h+m/60)*30),mn=m*6;return `<div class="clock-card"><div class="clock"><div class="hand hour" style="transform:rotate(${hr}deg)"></div><div class="hand minute" style="transform:rotate(${mn}deg)"></div><div class="dot"></div><span class="n n12">12</span><span class="n n3">3</span><span class="n n6">6</span><span class="n n9">9</span></div><div class="digital">${t.label||t.time||''}</div></div>`}
function analogClock(t){return clock(t).replace(/<div class="digital">[^<]*<\/div>/,'')}
function sayGerman(txt){const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';speechSynthesis.cancel();speechSynthesis.speak(u)}
function header(title,showReset=false){const h=document.querySelector('.topbar');if(!h)return;const p=profile();const name=[p?.vorname||p?.firstName||'',p?.nachname||p?.lastName||''].join(' ').trim()||'Schüler/in';const dash=localStorage.getItem('SP_LOGIN_ROLE')==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · ${CFG.sub}</div></div></a><div class="account-tools"><span class="account-pill">${name}</span><a class="account-link" href="${dash}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${location.pathname.endsWith('index.html')||/\/Thema-2\/?$/.test(location.pathname)?'../index.html':'index.html'}">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a>${showReset?'<button class="btn danger" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`}
function taskKey(file){return CFG.key+'_'+file}
function loadTask(file,total){try{const st=JSON.parse(localStorage.getItem(taskKey(file))||'null');if(st&&st.total===total&&Array.isArray(st.done)&&Array.isArray(st.queue))return st}catch(e){}return{total,done:[],queue:[...Array(total).keys()].sort(()=>Math.random()-.5),current:null,tries:0,hadWrong:false}}
function saveTask(file,st){localStorage.setItem(taskKey(file),JSON.stringify(st))}
function spNextIndex(file,total){let st=loadTask(file,total);if(st.current===null||st.current===undefined){if(!st.queue.length&&st.done.length<total)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i)).sort(()=>Math.random()-.5);st.current=st.queue.shift();st.tries=0;st.hadWrong=false;saveTask(file,st)}return st.current}
function spMarkRight(file,total){let st=loadTask(file,total),c=st.current;if(c!==null&&c!==undefined){if(st.hadWrong||st.tries>0){if(!st.done.includes(c)&&!st.queue.includes(c))st.queue.push(c)}else if(!st.done.includes(c))st.done.push(c)}st.current=null;st.tries=0;st.hadWrong=false;saveTask(file,st)}
function spMarkWrong(file,total){let st=loadTask(file,total);st.tries=(st.tries||0)+1;st.hadWrong=true;saveTask(file,st);return st.tries}
function pctFor(file,total){if(!total)return 0;return Math.round(loadTask(file,total).done.length/total*100)||0}
function spProgressHtml(file,total){const st=loadTask(file,total),p=pctFor(file,total);return `<div class="small">${st.done.length} richtig · ${total-st.done.length} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function complete(area,file,next='index.html'){area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Geschafft!</div><div class="hint">Diese Aufgabe ist abgeschlossen.</div><div class="actions"><a class="btn" href="${next}">Weiter →</a><a class="btn secondary" href="index.html">Zum Menü</a></div></div>`}
function resetThemeProgress(){if(!confirm('Fortschritte in diesem Thema löschen?'))return;Object.keys(localStorage).filter(k=>k.startsWith(CFG.key)).forEach(k=>localStorage.removeItem(k));location.reload()}
function renderOverview(el){el.innerHTML=WORDS.map(w=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="native-trans"><b>Muttersprache:</b> ${tr(w)}</div><span class="tag">${w.type}</span><div class="small">${w.sentence}</div></div></div>`).join('')}
function renderStats(el){const st=loadTask('karteikarten.html',WORDS.length);el.innerHTML=WORDS.map((w,i)=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="native-trans"><b>Muttersprache:</b> ${tr(w)}</div><span class="small ${st.done.includes(i)?'ok':'todo'}">${st.done.includes(i)?'gelernt':'noch offen'}</span></div></div>`).join('')}
function startMic(btn,cb){const SR=window.SpeechRecognition||window.webkitSpeechRecognition,status=document.getElementById('micStatus');if(!SR){if(status)status.textContent='Mikrofon wird hier nicht unterstützt. Bitte schreibe.';return}const r=new SR();r.lang='de-DE';r.onresult=e=>cb(e.results[0][0].transcript);r.onerror=()=>{if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe.'};r.start();if(status)status.textContent='Ich höre zu …'}
function nextBtn(next){return `<div class="actions"><a class="btn" href="${next}">Weiter →</a><a class="btn secondary" href="index.html">Zum Menü</a></div>`}
function cardPrompt(w){return w.article?'Sage das deutsche Wort mit Artikel.':'Sage das deutsche Wort.'}
function cardTip(w){return w.article?'Artikel und Wort':'Wort'}