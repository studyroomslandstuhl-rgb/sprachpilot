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
function T(id,label,h,m,formal,informal,extra={}){return Object.assign({id,label,h,m,formal,informal},extra)}
const TIMES_SEHEN=[
T('s0315','3:15',3,15,['drei Uhr fünfzehn'],['Viertel nach drei','fünfzehn nach drei']),
T('s1045','10:45',10,45,['zehn Uhr fünfundvierzig'],['Viertel vor elf','fünfzehn vor elf']),
T('s0830','8:30',8,30,['acht Uhr dreißig'],['halb neun']),
T('s0750','7:50',7,50,['sieben Uhr fünfzig'],['zehn vor acht']),
T('s1120','11:20',11,20,['elf Uhr zwanzig'],['zwanzig nach elf','zehn vor halb zwölf']),
T('s0835','8:35',8,35,['acht Uhr fünfunddreißig'],['fünf nach halb neun']),
T('s1520','15:20',15,20,['fünfzehn Uhr zwanzig'],['zwanzig nach drei','zehn vor halb vier']),
T('s2045','20:45',20,45,['zwanzig Uhr fünfundvierzig'],['Viertel vor neun','fünfzehn vor neun'])
];
const TIMES_HOEREN=[
T('h1715','17:15',17,15,['siebzehn Uhr fünfzehn','fünf Uhr fünfzehn'],['Viertel nach fünf'],{dialog:[{v:'f',t:'Entschuldigung, wie spät ist es?'},{v:'m',t:'Es ist Viertel nach fünf.'},{v:'f',t:'Ah, schon so spät, danke!'}]}),
T('h0830','8:30',8,30,['acht Uhr dreißig'],['halb neun'],{dialog:[{v:'m',t:'Wann beginnt der Kurs?'},{v:'f',t:'Um halb neun.'},{v:'m',t:'Dann haben wir noch Zeit.'}]}),
T('h0756','7:56',7,56,['sieben Uhr sechsundfünfzig'],['kurz vor acht','gleich acht'],{tolerance:[{h:7,m:56},{h:7,m:57},{h:7,m:58},{h:7,m:59}],dialog:[{v:'f',t:'Wie viel Uhr ist es?'},{v:'m',t:'Es ist kurz vor acht.'},{v:'f',t:'Oh nein, der Bus kommt gleich!'}]}),
T('h1120','11:20',11,20,['elf Uhr zwanzig'],['zwanzig nach elf','zehn vor halb zwölf'],{dialog:[{v:'m',t:'Wie spät ist es jetzt?'},{v:'f',t:'Es ist zehn vor halb zwölf.'},{v:'m',t:'Gut, ich habe noch Zeit.'}]}),
T('h0835','8:35',8,35,['acht Uhr fünfunddreißig'],['fünf nach halb neun'],{dialog:[{v:'f',t:'Wann fährt der Bus?'},{v:'m',t:'Um Viertel vor neun.'},{v:'f',t:'Dann ist es jetzt fünf nach halb neun.'}]}),
T('h1200','12:00',12,0,['zwölf Uhr'],['zwölf Uhr'],{dialog:[{v:'m',t:'Wie viel Uhr ist es?'},{v:'f',t:'Es ist zwölf Uhr.'},{v:'m',t:'Danke.'}]})
];
const TIMES_SPRECHEN=[
T('p1100','11:00',11,0,['elf Uhr'],['elf Uhr','elf']),
T('p1400','14:00',14,0,['vierzehn Uhr'],['zwei Uhr']),
T('p1225','12:25',12,25,['zwölf Uhr fünfundzwanzig'],['fünfundzwanzig nach zwölf','25 nach 12']),
T('p1805','18:05',18,5,['achtzehn Uhr fünf','sechs Uhr fünf'],['fünf nach sechs','5 nach 6']),
T('p0825','8:25',8,25,['acht Uhr fünfundzwanzig'],['fünfundzwanzig nach acht','25 nach 8','fünf vor halb neun']),
T('p1058','10:58',10,58,['zehn Uhr achtundfünfzig'],['kurz vor elf','gleich elf'],{tolerance:[{h:10,m:56},{h:10,m:57},{h:10,m:58},{h:10,m:59}]}),
T('p0835','8:35',8,35,['acht Uhr fünfunddreißig'],['fünf nach halb neun']),
T('p0300','3:00',3,0,['drei Uhr'],['drei Uhr','drei'])
];
const TIMES_FORMEN=[
T('f0630','6:30',6,30,['sechs Uhr dreißig'],['halb sieben']),
T('f1945','19:45',19,45,['neunzehn Uhr fünfundvierzig','sieben Uhr fünfundvierzig'],['Viertel vor acht','fünfzehn vor acht']),
T('f1120','11:20',11,20,['elf Uhr zwanzig'],['zwanzig nach elf','zehn vor halb zwölf']),
T('f0835','8:35',8,35,['acht Uhr fünfunddreißig'],['fünf nach halb neun']),
T('f1100','11:00',11,0,['elf Uhr'],['elf Uhr','elf']),
T('f1300','13:00',13,0,['dreizehn Uhr'],['ein Uhr','eins'])
];
const TIMES_FRAGE=[
T('q0830','8:30',8,30,['acht Uhr dreißig'],['halb neun']),
T('q1515','15:15',15,15,['fünfzehn Uhr fünfzehn','drei Uhr fünfzehn'],['Viertel nach drei','fünfzehn nach drei']),
T('q1045','10:45',10,45,['zehn Uhr fünfundvierzig'],['Viertel vor elf','fünfzehn vor elf']),
T('q1120','11:20',11,20,['elf Uhr zwanzig'],['zwanzig nach elf','zehn vor halb zwölf']),
T('q0835','8:35',8,35,['acht Uhr fünfunddreißig'],['fünf nach halb neun']),
T('q1200','12:00',12,0,['zwölf Uhr'],['zwölf Uhr','zwölf'])
];
const TIMES=TIMES_SPRECHEN;
const SCHON_ERST=[
{word:'erst',situation:'Kursbeginn',dialog:['A: Der Kurs beginnt um neun Uhr.','B: Wir haben noch Zeit. Es ist ___ zehn vor neun.']},
{word:'schon',situation:'Kursbeginn',dialog:['A: Der Kurs beginnt um neun Uhr.','B: Schnell! Es ist ___ fünf nach neun.']},
{word:'erst',situation:'Bushaltestelle',dialog:['A: Der Bus kommt um acht Uhr.','B: Keine Sorge. Es ist ___ fünf vor acht.']},
{word:'schon',situation:'Bushaltestelle',dialog:['A: Der Bus kommt um acht Uhr.','B: Schnell! Es ist ___ fünf nach acht.']},
{word:'erst',situation:'Termin',dialog:['A: Der Termin ist um vier Uhr.','B: Wir sind früh. Es ist ___ kurz vor vier.']},
{word:'schon',situation:'Pause',dialog:['A: Ist es zwölf Uhr?','B: Nein, es ist ___ zehn nach zwölf.']}
];
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')}catch(e){return null}}
function langKey(){const m=String(profile()?.muttersprache||profile()?.motherLanguage||'').toLowerCase();if(m.includes('russ'))return'ru';if(m.includes('türk')||m.includes('turk'))return'tr';if(m.includes('ukrain'))return'uk';if(m.includes('arab'))return'ar';if(m.includes('japan'))return'ja';if(m.includes('rumän')||m.includes('ruman')||m.includes('roman'))return'ro';return'en'}
function tr(w){const t=w.tr||{};return t[langKey()]||t.en||'—'}
function full(w){return w.full||((w.article?`${w.article} `:'')+w.word)}
function simple(x){return String(x||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:]/g,'').replace(/\s+/g,' ')}
function variants(x){return String(x||'').split(/\s*(?:\|\||\|)\s*/).map(simple).filter(Boolean)}
function ok(v,arr){const vs=variants(v);return arr.some(x=>vs.includes(simple(x)))}
function withSentence(a){return [...a,...a.map(x=>/^es ist/i.test(x)?x:'Es ist '+x)]}
function sentenceOnly(a){return a.map(x=>/^es ist/i.test(x)?x:'Es ist '+x)}
function formalAnswers(t){return withSentence(t.formal||[])}
function informalAnswers(t){return withSentence(t.informal||[])}
function informalSentenceAnswers(t){return sentenceOnly(t.informal||[])}
function pointsFor(t){return t.tolerance||[{h:t.h,m:t.m}]}
function digitalForPoint(h,m,mode='both'){const mm=String(m).padStart(2,'0'),hours=[h];if(m>0&&(mode==='both'||mode==='formal')){if(h>12)hours.push(h-12);else if(h>0&&h<12)hours.push(h+12)}if(mode==='informal'&&h>12)hours.push(h-12);let forms=[];[...new Set(hours)].forEach(x=>{const hs=String(x),hh=String(x).padStart(2,'0');forms.push(`${hs}:${mm}`,`${hh}:${mm}`,`${hs}.${mm}`,`${hh}.${mm}`,`${hs}:${mm} Uhr`,`${hh}:${mm} Uhr`,`${hs}.${mm} Uhr`,`${hh}.${mm} Uhr`);if(m===0)forms.push(hs,`${hs} Uhr`,hh,`${hh} Uhr`)});return forms}
function digitalAnswers(t,mode='both'){let forms=[];pointsFor(t).forEach(p=>forms=forms.concat(digitalForPoint(p.h,p.m,mode)));return withSentence([...new Set(forms)])}
function hourWordAnswers(t,mode='both'){if(t.m!==0)return[];const names={1:['ein','eins'],2:['zwei'],3:['drei'],4:['vier'],5:['fünf'],6:['sechs'],7:['sieben'],8:['acht'],9:['neun'],10:['zehn'],11:['elf'],12:['zwölf'],13:['dreizehn'],14:['vierzehn'],15:['fünfzehn'],16:['sechzehn'],17:['siebzehn'],18:['achtzehn'],19:['neunzehn'],20:['zwanzig'],21:['einundzwanzig'],22:['zweiundzwanzig'],23:['dreiundzwanzig']};let forms=[];if(mode==='formal'){(names[t.h]||[]).forEach(n=>forms.push(n+' Uhr'));return withSentence(forms)}let hs=[t.h];if(mode==='informal'&&t.h>12)hs=[t.h-12];if(mode==='both'){if(t.h>12)hs.push(t.h-12);else if(t.h>0&&t.h<12)hs.push(t.h+12)}hs.forEach(h=>forms=forms.concat(names[h]||[],(names[h]||[]).map(n=>n+' Uhr')));return withSentence([...new Set(forms)])}
function allAnswers(t){return withSentence([...(t.formal||[]),...(t.informal||[])])}
function looseAnswers(t){return allAnswers(t).concat(digitalAnswers(t,'both')).concat(hourWordAnswers(t,'both'))}
function formalLooseAnswers(t){return formalAnswers(t).concat(digitalAnswers(t,'formal')).concat(hourWordAnswers(t,'formal'))}
function informalLooseAnswers(t){return informalAnswers(t).concat(digitalAnswers(t,'informal')).concat(hourWordAnswers(t,'informal'))}
function informalSpeechAnswers(t){return informalAnswers(t).concat(digitalAnswers(t,'both')).concat(hourWordAnswers(t,'both'))}
function help3(n,a,b,c){if(n===1)return `<div class="no">${a}</div>`;if(n===2)return `<div class="hint">${b}</div>`;return `<div class="no">Lösung: ${c}</div>`}
function imgHtml(w){return w.image?`<img src="${w.image}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`}
function bigImgHtml(w){return w.image?`<img class="task-img" src="${w.image}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`}
function fixImg(img){const ph=document.createElement('div');ph.className='word-placeholder';ph.textContent='kein Bild';img.replaceWith(ph)}
function clock(t){let h=t.h%12,m=t.m,hr=((h+m/60)*30),mn=m*6;return `<div class="clock-card"><div class="clock"><div class="hand hour" style="transform:rotate(${hr}deg)"></div><div class="hand minute" style="transform:rotate(${mn}deg)"></div><div class="dot"></div><span class="n n12">12</span><span class="n n3">3</span><span class="n n6">6</span><span class="n n9">9</span></div><div class="digital">${t.label||t.time||''}</div></div>`}
function analogClock(t){return clock(t).replace(/<div class="digital">[^<]*<\/div>/,'')}
function timeQuestion(i=0){return i%2?'Wie viel Uhr ist es?':'Wie spät ist es?'}
let SP_DE_VOICES=[];
function loadVoices(){try{SP_DE_VOICES=speechSynthesis.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));return SP_DE_VOICES}catch(e){return[]}}
if('speechSynthesis' in window){loadVoices();if(typeof speechSynthesis.onvoiceschanged!=='undefined')speechSynthesis.onvoiceschanged=loadVoices;setTimeout(loadVoices,250);setTimeout(loadVoices,1000)}
function voice(kind){const vs=loadVoices();if(!vs.length)return null;const male=/markus|michael|hans|stefan|daniel|thomas|klaus|ralf|florian|martin|wolfgang|bernd|conrad|yannick|kilian|german male|male/i;const female=/anna|katja|helena|petra|marlene|sabine|claudia|google|female|frau|woman/i;if(kind==='m'){return vs.find(v=>male.test(v.name))||vs.find(v=>!female.test(v.name))||vs[1]||vs[0]}return vs.find(v=>female.test(v.name))||vs.find(v=>!male.test(v.name))||vs[0]}
function utter(txt,kind='f'){const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';u.rate=kind==='m'?.88:.94;u.pitch=kind==='m'?.62:1.18;u.volume=1;const v=voice(kind);if(v)u.voice=v;return u}
function sayGerman(txt,kind='f'){loadVoices();speechSynthesis.cancel();setTimeout(()=>speechSynthesis.speak(utter(txt,kind)),60)}
function speakDialog(lines,i=0){loadVoices();if(i===0)speechSynthesis.cancel();if(i>=lines.length)return;const line=typeof lines[i]==='string'?{v:i%2?'m':'f',t:lines[i]}:lines[i];const kind=line.v||'f';const u=utter(line.t,kind);u.onend=()=>setTimeout(()=>speakDialog(lines,i+1),220);speechSynthesis.speak(u)}
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
function startMic(btn,cb){const SR=window.SpeechRecognition||window.webkitSpeechRecognition,status=document.getElementById('micStatus');if(!SR){if(status)status.textContent='Mikrofon wird hier nicht unterstützt. Bitte schreibe.';return}const r=new SR();r.lang='de-DE';r.interimResults=true;r.maxAlternatives=5;let heard=[],done=false,timer=null;function finish(){if(done)return;done=true;btn.disabled=false;btn.textContent=btn.dataset.label||btn.textContent;clearTimeout(timer);const text=[...new Set(heard.filter(Boolean))].join(' || ');if(text){if(status)status.textContent='Erkannt: '+text.split(' || ')[0];cb(text)}else if(status)status.textContent='Nichts erkannt. Bitte noch einmal sprechen.'}btn.dataset.label=btn.textContent;btn.disabled=true;btn.textContent='Ich höre …';r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){for(let j=0;j<e.results[i].length;j++)heard.push(e.results[i][j].transcript)}clearTimeout(timer);timer=setTimeout(finish,1000)};r.onspeechend=()=>{timer=setTimeout(finish,900)};r.onerror=()=>{btn.disabled=false;btn.textContent=btn.dataset.label;if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe oder noch einmal sprechen.'};r.onend=()=>setTimeout(finish,250);try{r.start();if(status)status.textContent='Ich höre zu …'}catch(e){btn.disabled=false;if(status)status.textContent='Mikrofon startet nicht. Bitte nochmal versuchen.'}}
function nextBtn(next){return `<div class="actions"><a class="btn" href="${next}">Weiter →</a><a class="btn secondary" href="index.html">Zum Menü</a></div>`}
function cardPrompt(w){return w.article?'Schreibe das deutsche Wort mit Artikel.':'Schreibe das deutsche Wort.'}
function cardTip(w){return w.article?'Artikel und Wort':'Wort'}