const THEME={module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"3",title:"A1 Lektion 4 · Thema 3",key:"SP_L4_T3_V1"};
const TASK_FILES=["karteikarten.html","hoeren.html","farben.html","memory.html","gegenteile.html","kein.html","reaktionen.html","gefallen.html","saetze-bauen.html","schreiben.html"];
const TASK_TITLES={"karteikarten.html":"Karteikarten","hoeren.html":"Hören","farben.html":"Farben","memory.html":"Memory","gegenteile.html":"Gegenteile","kein.html":"nicht / kein / keine","reaktionen.html":"Reaktionen","gefallen.html":"Gefallen","saetze-bauen.html":"Sätze bauen","schreiben.html":"Schreiben"};
const COLORS=[
{id:"rot",word:"rot",hex:"#ef4444",tr:{en:"red",ru:"красный",uk:"червоний",ar:"أحمر",tr:"kırmızı",ro:"roșu",ja:"赤",pl:"czerwony",ku:"sor"}},
{id:"blau",word:"blau",hex:"#3b82f6",tr:{en:"blue",ru:"синий",uk:"синій",ar:"أزرق",tr:"mavi",ro:"albastru",ja:"青",pl:"niebieski",ku:"şîn"}},
{id:"gruen",word:"grün",hex:"#22c55e",tr:{en:"green",ru:"зелёный",uk:"зелений",ar:"أخضر",tr:"yeşil",ro:"verde",ja:"緑",pl:"zielony",ku:"kesk"}},
{id:"gelb",word:"gelb",hex:"#facc15",tr:{en:"yellow",ru:"жёлтый",uk:"жовтий",ar:"أصفر",tr:"sarı",ro:"galben",ja:"黄色",pl:"żółty",ku:"zer"}},
{id:"orange",word:"orange",hex:"#fb923c",tr:{en:"orange",ru:"оранжевый",uk:"помаранчевий",ar:"برتقالي",tr:"turuncu",ro:"portocaliu",ja:"オレンジ",pl:"pomarańczowy",ku:"porteqalî"}},
{id:"weiss",word:"weiß",hex:"#ffffff",tr:{en:"white",ru:"белый",uk:"білий",ar:"أبيض",tr:"beyaz",ro:"alb",ja:"白",pl:"biały",ku:"spî"}},
{id:"schwarz",word:"schwarz",hex:"#111827",tr:{en:"black",ru:"чёрный",uk:"чорний",ar:"أسود",tr:"siyah",ro:"negru",ja:"黒",pl:"czarny",ku:"reş"}},
{id:"grau",word:"grau",hex:"#9ca3af",tr:{en:"gray",ru:"серый",uk:"сірий",ar:"رمادي",tr:"gri",ro:"gri",ja:"灰色",pl:"szary",ku:"gewir"}},
{id:"braun",word:"braun",hex:"#92400e",tr:{en:"brown",ru:"коричневый",uk:"коричневий",ar:"بني",tr:"kahverengi",ro:"maro",ja:"茶色",pl:"brązowy",ku:"qehweyî"}}
];
const ADJECTIVES=[
{id:"schoen",word:"schön",img:"schoen.png",tr:{en:"beautiful",ru:"красивый",uk:"гарний",ar:"جميل",tr:"güzel",ro:"frumos",ja:"きれい",pl:"ładny",ku:"xweşik"}},
{id:"haesslich",word:"hässlich",img:"haesslich.png",tr:{en:"ugly",ru:"некрасивый",uk:"некрасивий",ar:"قبيح",tr:"çirkin",ro:"urât",ja:"醜い",pl:"brzydki",ku:"ne xweşik"}},
{id:"hell",word:"hell",img:"hell.png",tr:{en:"bright",ru:"светлый",uk:"світлий",ar:"مضيء",tr:"aydınlık",ro:"luminos",ja:"明るい",pl:"jasny",ku:"ronahî"}},
{id:"dunkel",word:"dunkel",img:"dunkel.png",tr:{en:"dark",ru:"тёмный",uk:"темний",ar:"مظلم",tr:"karanlık",ro:"întunecat",ja:"暗い",pl:"ciemny",ku:"tarî"}},
{id:"gross",word:"groß",img:"gross.png",tr:{en:"big",ru:"большой",uk:"великий",ar:"كبير",tr:"büyük",ro:"mare",ja:"大きい",pl:"duży",ku:"mezin"}},
{id:"klein",word:"klein",img:"klein.png",tr:{en:"small",ru:"маленький",uk:"малий",ar:"صغير",tr:"küçük",ro:"mic",ja:"小さい",pl:"mały",ku:"biçûk"}},
{id:"breit",word:"breit",img:"breit.png",tr:{en:"wide",ru:"широкий",uk:"широкий",ar:"واسع",tr:"geniş",ro:"lat",ja:"広い",pl:"szeroki",ku:"fireh"}},
{id:"schmal",word:"schmal",img:"schmal.png",tr:{en:"narrow",ru:"узкий",uk:"вузький",ar:"ضيق",tr:"dar",ro:"îngust",ja:"狭い",pl:"wąski",ku:"tenik"}},
{id:"teuer",word:"teuer",img:"teuer.png",tr:{en:"expensive",ru:"дорогой",uk:"дорогий",ar:"غالي",tr:"pahalı",ro:"scump",ja:"高い",pl:"drogi",ku:"biha"}},
{id:"billig",word:"billig",img:"billig.png",tr:{en:"cheap",ru:"дешёвый",uk:"дешевий",ar:"رخيص",tr:"ucuz",ro:"ieftin",ja:"安い",pl:"tani",ku:"erzan"}},
{id:"neu",word:"neu",img:"neu.png",tr:{en:"new",ru:"новый",uk:"новий",ar:"جديد",tr:"yeni",ro:"nou",ja:"新しい",pl:"nowy",ku:"nû"}},
{id:"alt",word:"alt",img:"alt.png",tr:{en:"old",ru:"старый",uk:"старий",ar:"قديم",tr:"eski",ro:"vechi",ja:"古い",pl:"stary",ku:"kevn"}},
{id:"modern",word:"modern",img:"modern.png",tr:{en:"modern",ru:"современный",uk:"сучасний",ar:"حديث",tr:"modern",ro:"modern",ja:"モダン",pl:"nowoczesny",ku:"modern"}},
{id:"sauber",word:"sauber",img:"sauber.png",tr:{en:"clean",ru:"чистый",uk:"чистий",ar:"نظيف",tr:"temiz",ro:"curat",ja:"清潔",pl:"czysty",ku:"paqij"}},
{id:"schmutzig",word:"schmutzig",img:"schmutzig.png",tr:{en:"dirty",ru:"грязный",uk:"брудний",ar:"متسخ",tr:"kirli",ro:"murdar",ja:"汚い",pl:"brudny",ku:"qirêj"}},
{id:"bequem",word:"bequem",img:"bequem.png",tr:{en:"comfortable",ru:"удобный",uk:"зручний",ar:"مريح",tr:"rahat",ro:"comod",ja:"快適",pl:"wygodny",ku:"rihet"}},
{id:"unbequem",word:"unbequem",img:"unbequem.png",tr:{en:"uncomfortable",ru:"неудобный",uk:"незручний",ar:"غير مريح",tr:"rahatsız",ro:"incomod",ja:"不快",pl:"niewygodny",ku:"ne rehet"}}
];
const FURNITURE=[
{id:"stuhl",article:"der",word:"Stuhl",full:"der Stuhl",pron:"er",img:"stuhl.png",plural:"die Stühle",pluralWord:"Stühle"},
{id:"sessel",article:"der",word:"Sessel",full:"der Sessel",pron:"er",img:"sessel.png",plural:"die Sessel",pluralWord:"Sessel"},
{id:"sofa",article:"das",word:"Sofa",full:"das Sofa",pron:"es",img:"sofa.png",plural:"die Sofas",pluralWord:"Sofas"},
{id:"tisch",article:"der",word:"Tisch",full:"der Tisch",pron:"er",img:"tisch.png",plural:"die Tische",pluralWord:"Tische"},
{id:"bett",article:"das",word:"Bett",full:"das Bett",pron:"es",img:"bett.png",plural:"die Betten",pluralWord:"Betten"},
{id:"schrank",article:"der",word:"Schrank",full:"der Schrank",pron:"er",img:"schrank.png",plural:"die Schränke",pluralWord:"Schränke"},
{id:"lampe",article:"die",word:"Lampe",full:"die Lampe",pron:"sie",img:"lampe.png",plural:"die Lampen",pluralWord:"Lampen"},
{id:"waschbecken",article:"das",word:"Waschbecken",full:"das Waschbecken",pron:"es",img:"waschbecken.png",plural:"die Waschbecken",pluralWord:"Waschbecken"}
];
const REACTIONS=[{id:"sehr-gut",word:"Sehr gut."},{id:"gut",word:"Gut."},{id:"es-geht",word:"Es geht."},{id:"nicht-so-gut",word:"Nicht so gut."}];
const PAIRS=[ ["schoen","haesslich"],["hell","dunkel"],["gross","klein"],["breit","schmal"],["teuer","billig"],["neu","alt"],["sauber","schmutzig"],["bequem","unbequem"] ];
const CARDS=[...COLORS.map(x=>({...x,type:"color"})),...ADJECTIVES.map(x=>({...x,type:"adj"}))];
const CONTRAST_TASKS=[
{item:"sessel",wrong:"unbequem",right:"bequem",img:"bequem.png",sentence:"Der Sessel ist nicht unbequem, er ist sehr bequem."},
{item:"stuhl",wrong:"bequem",right:"unbequem",img:"unbequem.png",sentence:"Der Stuhl ist nicht bequem, er ist sehr unbequem."},
{item:"waschbecken",wrong:"schmutzig",right:"sauber",img:"sauber.png",sentence:"Das Waschbecken ist nicht schmutzig, es ist sehr sauber."},
{item:"waschbecken",wrong:"sauber",right:"schmutzig",img:"schmutzig.png",sentence:"Das Waschbecken ist nicht sauber, es ist sehr schmutzig."},
{item:"sofa",wrong:"alt",right:"modern",img:"modern.png",sentence:"Das Sofa ist nicht alt, es ist sehr modern."},
{item:"tisch",wrong:"klein",right:"groß",img:"gross.png",sentence:"Der Tisch ist nicht klein, er ist sehr groß."},
{item:"teppich",wrong:"hell",right:"dunkel",img:"dunkel.png",sentence:"Der Teppich ist nicht hell, er ist sehr dunkel."},
{item:"lampe",wrong:"dunkel",right:"hell",img:"hell.png",sentence:"Die Lampe ist nicht dunkel, sie ist sehr hell."},
{item:"schrank",wrong:"schmal",right:"breit",img:"breit.png",sentence:"Der Schrank ist nicht schmal, er ist sehr breit."},
{item:"stuhl",wrong:"teuer",right:"billig",img:"billig.png",sentence:"Der Stuhl ist nicht teuer, er ist sehr billig."},
{item:"bett",wrong:"alt",right:"neu",img:"neu.png",sentence:"Das Bett ist nicht alt, es ist sehr neu."},
{item:"sessel",wrong:"hässlich",right:"schön",img:"schoen.png",sentence:"Der Sessel ist nicht hässlich, er ist sehr schön."}
].slice(0,15);
const GEFAELLEN_TASKS=[
{item:"sessel",reaction:"Sehr gut.",adj:"bequem",answer:"Sehr gut. Er ist bequem."},
{item:"stuhl",reaction:"Nicht so gut.",adj:"unbequem",answer:"Nicht so gut. Er ist unbequem."},
{item:"waschbecken",reaction:"Nicht so gut.",adj:"schmutzig",answer:"Nicht so gut. Es ist schmutzig."},
{item:"waschbecken",reaction:"Sehr gut.",adj:"sauber",answer:"Sehr gut. Es ist sauber."},
{item:"sofa",reaction:"Gut.",adj:"modern",answer:"Gut. Es ist modern."},
{item:"lampe",reaction:"Sehr gut.",adj:"hell",answer:"Sehr gut. Sie ist hell."},
{item:"tisch",reaction:"Es geht.",adj:"klein",answer:"Es geht. Er ist klein."},
{item:"bett",reaction:"Gut.",adj:"neu",answer:"Gut. Es ist neu."}
];
const SENTENCES=[
{item:"sessel",text:"Der Sessel ist bequem.",words:["Der","Sessel","ist","bequem."]},
{item:"stuhl",text:"Der Stuhl ist unbequem.",words:["Der","Stuhl","ist","unbequem."]},
{item:"waschbecken",text:"Das Waschbecken ist sauber.",words:["Das","Waschbecken","ist","sauber."]},
{item:"waschbecken",text:"Das Waschbecken ist schmutzig.",words:["Das","Waschbecken","ist","schmutzig."]},
{item:"sofa",text:"Das Sofa ist modern.",words:["Das","Sofa","ist","modern."]},
{item:"moebel",plural:true,text:"Die Möbel sind modern.",words:["Die","Möbel","sind","modern."]},
{item:"lampe",text:"Die Lampe ist hell.",words:["Die","Lampe","ist","hell."]},
{item:"zimmer",plural:true,text:"Die Zimmer sind groß.",words:["Die","Zimmer","sind","groß."]}
].slice(0,15);
const WRITING=[
{item:"sessel",adj:"bequem",text:"Der Sessel ist bequem."},
{item:"stuhl",adj:"unbequem",text:"Der Stuhl ist unbequem."},
{item:"waschbecken",adj:"sauber",text:"Das Waschbecken ist sauber."},
{item:"waschbecken",adj:"schmutzig",text:"Das Waschbecken ist schmutzig."},
{item:"sofa",adj:"modern",text:"Das Sofa ist modern."},
{item:"lampe",adj:"hell",text:"Die Lampe ist hell."},
{item:"tisch",adj:"klein",text:"Der Tisch ist klein."},
{item:"bett",adj:"neu",text:"Das Bett ist neu."}
].slice(0,15);
function $(id){return document.getElementById(id)}
function simple(s){return String(s||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[.,!?]/g,"").replace(/\s+/g," ")}
function safe(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function currentMotherLang(){try{let p=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null");let raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||localStorage.getItem("motherLanguage")||"en";let n=String(raw).trim().toLowerCase();let map={"russisch":"ru","englisch":"en","ukrainisch":"uk","arabisch":"ar","türkisch":"tr","tuerkisch":"tr","rumänisch":"ro","rumaenisch":"ro","japanisch":"ja","polnisch":"pl","kurdisch":"ku","deutsch":"de"};return map[n]||n||"en"}catch(e){return"en"}}
function translate(x){let l=currentMotherLang();return x.tr?.[l]||x.tr?.en||x.word}
function articleCap(a){return a==="der"?"Der":a==="die"?"Die":"Das"}
function pronFor(a){return a==="der"?"er":a==="die"?"sie":"es"}
function img(name,cls="task-img"){return `<img class="${cls}" src="../bilder/${name}" onerror="fixImg(this)" alt="">`}
function fixImg(el){el.classList.add("missing");el.alt="Bild fehlt"}
function swatch(c,small=false){return `<div class="swatch ${small?'small':''}" style="background:${c.hex};${c.id==='weiss'?'border-color:#cbd5e1':''}"></div>`}
function furnitureById(id){return FURNITURE.find(x=>x.id===id)||FURNITURE[0]}
function adjById(id){return ADJECTIVES.find(x=>x.id===id)||ADJECTIVES[0]}
function colorById(id){return COLORS.find(x=>x.id===id)||COLORS[0]}
function header(title){const h=document.querySelector('.topbar');if(!h)return;let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'{}')}catch(e){};const who=`${safe(p.vorname||p.firstName||'')} ${safe(p.nachname||p.lastName||'')}`.trim()||'Schüler/in';const kurs=safe(p.kurs||p.kursnummer||p.courseCode||'');h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${safe(title)} · A1 Lektion 4 · Thema 3</div></div></a><div class="account-tools"><span class="account-pill">${who}${kurs?' · '+kurs:''}</span><a class="account-link" href="/student-dashboard/index.html">📊 Dashboard</a><a class="account-link" href="/profile/index.html">👤 Profil</a><button class="account-link account-btn" onclick="logoutSP()">🚪 Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="index.html">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button></nav>`}
function logoutSP(){localStorage.removeItem('SP_USER_PROFILE');localStorage.removeItem('SP_KEEP_LOGGED_IN');location.href='/index.html'}
function taskKey(file){return THEME.key+"_"+file}
function loadTask(file,total){try{let st=JSON.parse(localStorage.getItem(taskKey(file))||"null");if(st&&st.total===total&&Array.isArray(st.queue)&&Array.isArray(st.done))return st}catch(e){}return{total,queue:shuffle([...Array(total).keys()]),done:[],current:null,tries:0,hadWrong:false,wrongItems:[]}}
function saveTask(file,st){localStorage.setItem(taskKey(file),JSON.stringify(st));syncTask(file,st)}
function nextIndex(file,total){let st=loadTask(file,total);if(st.done.length>=total)return null;if(st.current===null||st.current===undefined){if(!st.queue.length)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i));st.current=st.queue.shift();st.tries=0;st.hadWrong=false;saveTask(file,st)}return st.current}
function markWrong(file,total,item){let st=loadTask(file,total);st.tries=(st.tries||0)+1;st.hadWrong=true;if(item)st.wrongItems=[...(st.wrongItems||[]),item].slice(-50);saveTask(file,st);return st.tries}
function markRight(file,total){let st=loadTask(file,total),cur=st.current;if(cur!==null&&cur!==undefined){if(st.hadWrong||st.tries>0){if(!st.done.includes(cur)&&!st.queue.includes(cur))st.queue.push(cur)}else{if(!st.done.includes(cur))st.done.push(cur)}}st.current=null;st.tries=0;st.hadWrong=false;saveTask(file,st);return st.done.length>=total}
function pct(file,total){let st=loadTask(file,total);return Math.round((st.done.length||0)/total*100)||0}
function progressHtml(file,total){let st=loadTask(file,total),p=pct(file,total);return `<div class="small">${st.done.length} richtig · ${total-st.done.length} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function feedbackForTry(tries,solution,type){if(tries===1)return"Da ist noch ein Fehler.";if(tries===2)return"Tipp: Prüfe "+(type||"Form und Schreibweise")+".";return"Lösung: "+solution}
function complete(area,file,next="index.html"){syncTask(file,loadTask(file,getTotal(file)));area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Aufgabe geschafft!</div><div class="big">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="actions"><button class="btn" onclick="resetOneTask('${file}')">Nochmal üben</button><a class="btn green" href="${next}">Weiter</a><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>`}
function resetOneTask(file){localStorage.removeItem(taskKey(file));location.reload()}
function getTotal(file){return {"karteikarten.html":CARDS.length,"hoeren.html":12,"farben.html":COLORS.length,"memory.html":16,"gegenteile.html":CONTRAST_TASKS.length,"kein.html":12,"reaktionen.html":REACTIONS.length,"gefallen.html":GEFAELLEN_TASKS.length,"saetze-bauen.html":SENTENCES.length,"schreiben.html":WRITING.length}[file]||1}
function taskDoneCount(){return TASK_FILES.filter(f=>pct(f,getTotal(f))>=100).length}
function allPrereqComplete(){return TASK_FILES.every(f=>pct(f,getTotal(f))>=100)}
function examUnlockKey(){return THEME.key+"_EXAM_UNLOCKED"}
function examUnlocked(){if(allPrereqComplete())localStorage.setItem(examUnlockKey(),"1");return localStorage.getItem(examUnlockKey())==="1"}
function examHistory(){try{return JSON.parse(localStorage.getItem("SP_L4_T3_EXAM_HISTORY_V1")||"[]")}catch(e){return[]}}
function starsForPercent(p){p=Number(p||0);return p>=100?3:p>=70?2:p>=50?1:0}
function starsHtml(n){return `<span class="stars">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>`}
function bestExamResult(){let h=examHistory();if(!h.length)return null;return h.reduce((b,x)=>Number(x.percent||0)>Number(b.percent||0)?x:b,h[0])}
function resetThemeProgress(){if(!confirm("Möchten Sie wirklich alle Fortschritte in diesem Thema löschen?"))return;Object.keys(localStorage).forEach(k=>{if(k.startsWith(THEME.key)||k.startsWith("SP_L4_T3_EXAM"))localStorage.removeItem(k)});syncReset();location.href="index.html"}
function syncTask(file,st){try{const total=Number(st.total||getTotal(file));const done=Array.isArray(st.done)?st.done.length:0;const percent=Math.round(done/total*100)||0;const payload={...THEME,file,taskKey:file,taskTitle:TASK_TITLES[file]||file,total,done,percent,completed:percent>=100,wrongItems:st.wrongItems||[]};if(window.SPProgress?.recordTaskProgress)window.SPProgress.recordTaskProgress(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordTaskProgress",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function syncExam(result){try{const payload={...THEME,score:result.score,maxScore:result.maxScore,percent:result.percent,stars:result.stars};if(window.SPProgress?.recordExamResult)window.SPProgress.recordExamResult(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordExamResult",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function syncReset(){try{const payload={...THEME};if(window.SPProgress?.recordThemeReset)window.SPProgress.recordThemeReset(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordThemeReset",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function speak(text,slow=false){if(!('speechSynthesis'in window))return;const run=()=>{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(String(text||''));u.lang='de-DE';u.rate=slow?.72:.88;let v=speechSynthesis.getVoices().find(v=>v.lang==='de-DE')||speechSynthesis.getVoices().find(v=>String(v.lang).startsWith('de'));if(v)u.voice=v;speechSynthesis.speak(u)};if(!speechSynthesis.getVoices().length){speechSynthesis.onvoiceschanged=run;setTimeout(run,250)}else run()}
function startMic(btn,callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const status=$('micStatus');if(!SR){if(status)status.textContent='Mikrofon geht hier nicht. Bitte schreibe.';return}let rec=new SR();rec.lang='de-DE';rec.interimResults=false;if(btn)btn.classList.add('active');if(status)status.textContent='Ich höre zu …';rec.onresult=e=>{let txt=e.results[0][0].transcript;if(status)status.textContent='Gehört: '+txt;callback(txt)};rec.onerror=()=>{if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe.'};rec.onend=()=>{if(btn)btn.classList.remove('active')};rec.start()}
function normalizeSentence(s){return simple(s).replace(/ sehr /g,' sehr ')}
function isExactSentence(ans,sol){return normalizeSentence(ans)===normalizeSentence(sol)}
function withPeriod(s){s=String(s||'').trim();return /[.!?]$/.test(s)?s:s+'.'}
