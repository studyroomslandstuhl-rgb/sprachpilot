
const WORDS=[{"id": "haus", "article": "das", "word": "Haus", "full": "das Haus", "plural": "die Häuser", "pluralGroup": "-er/Umlaut", "image": "../bilder/haus.png", "tr": {"ru": "дом", "en": "house", "uk": "будинок", "ar": "البيت", "ku": "mal", "tr": "ev", "ro": "casă", "ja": "家", "pl": "dom"}}, {"id": "wohnung", "article": "die", "word": "Wohnung", "full": "die Wohnung", "plural": "die Wohnungen", "pluralGroup": "-en", "image": "../bilder/wohnung.png", "tr": {"ru": "квартира", "en": "apartment", "uk": "квартира", "ar": "الشقة", "ku": "apartman", "tr": "daire", "ro": "apartament", "ja": "アパート", "pl": "mieszkanie"}}, {"id": "zimmer", "article": "das", "word": "Zimmer", "full": "das Zimmer", "plural": "die Zimmer", "pluralGroup": "-", "image": "../bilder/zimmer.png", "tr": {"ru": "комната", "en": "room", "uk": "кімната", "ar": "الغرفة", "ku": "ode", "tr": "oda", "ro": "cameră", "ja": "部屋", "pl": "pokój"}}, {"id": "wohnzimmer", "article": "das", "word": "Wohnzimmer", "full": "das Wohnzimmer", "plural": "die Wohnzimmer", "pluralGroup": "-", "image": "../bilder/wohnzimmer.png", "tr": {"ru": "гостиная", "en": "living room", "uk": "вітальня", "ar": "غرفة المعيشة", "ku": "odeya rûniştinê", "tr": "oturma odası", "ro": "living", "ja": "リビング", "pl": "salon"}}, {"id": "schlafzimmer", "article": "das", "word": "Schlafzimmer", "full": "das Schlafzimmer", "plural": "die Schlafzimmer", "pluralGroup": "-", "image": "../bilder/schlafzimmer.png", "tr": {"ru": "спальня", "en": "bedroom", "uk": "спальня", "ar": "غرفة النوم", "ku": "odeya razanê", "tr": "yatak odası", "ro": "dormitor", "ja": "寝室", "pl": "sypialnia"}}, {"id": "kinderzimmer", "article": "das", "word": "Kinderzimmer", "full": "das Kinderzimmer", "plural": "die Kinderzimmer", "pluralGroup": "-", "image": "../bilder/kinderzimmer.png", "tr": {"ru": "детская комната", "en": "children's room", "uk": "дитяча кімната", "ar": "غرفة الأطفال", "ku": "odeya zarokan", "tr": "çocuk odası", "ro": "camera copiilor", "ja": "子ども部屋", "pl": "pokój dziecięcy"}}, {"id": "arbeitszimmer", "article": "das", "word": "Arbeitszimmer", "full": "das Arbeitszimmer", "plural": "die Arbeitszimmer", "pluralGroup": "-", "image": "../bilder/arbeitszimmer.png", "tr": {"ru": "кабинет", "en": "study", "uk": "кабінет", "ar": "غرفة العمل", "ku": "odeya xebatê", "tr": "çalışma odası", "ro": "birou", "ja": "書斎", "pl": "gabinet"}}, {"id": "kueche", "article": "die", "word": "Küche", "full": "die Küche", "plural": "die Küchen", "pluralGroup": "-n", "image": "../bilder/kueche.png", "tr": {"ru": "кухня", "en": "kitchen", "uk": "кухня", "ar": "المطبخ", "ku": "metbex", "tr": "mutfak", "ro": "bucătărie", "ja": "キッチン", "pl": "kuchnia"}}, {"id": "bad", "article": "das", "word": "Bad", "full": "das Bad", "plural": "die Bäder", "pluralGroup": "-er/Umlaut", "image": "../bilder/bad.png", "tr": {"ru": "ванная", "en": "bathroom", "uk": "ванна кімната", "ar": "الحمام", "ku": "serşok", "tr": "banyo", "ro": "baie", "ja": "浴室", "pl": "łazienka"}}, {"id": "toilette", "article": "die", "word": "Toilette", "full": "die Toilette", "plural": "die Toiletten", "pluralGroup": "-n", "image": "../bilder/toilette.png", "tr": {"ru": "туалет", "en": "toilet", "uk": "туалет", "ar": "المرحاض", "ku": "tûwalet", "tr": "tuvalet", "ro": "toaletă", "ja": "トイレ", "pl": "toaleta"}}, {"id": "flur", "article": "der", "word": "Flur", "full": "der Flur", "plural": "die Flure", "pluralGroup": "-e", "image": "../bilder/flur.png", "tr": {"ru": "коридор", "en": "hallway", "uk": "коридор", "ar": "الممر", "ku": "korîdor", "tr": "koridor", "ro": "hol", "ja": "廊下", "pl": "korytarz"}}, {"id": "balkon", "article": "der", "word": "Balkon", "full": "der Balkon", "plural": "die Balkone", "pluralGroup": "-e", "image": "../bilder/balkon.png", "tr": {"ru": "балкон", "en": "balcony", "uk": "балкон", "ar": "الشرفة", "ku": "balkon", "tr": "balkon", "ro": "balcon", "ja": "バルコニー", "pl": "balkon"}}, {"id": "hier", "article": "", "word": "hier", "full": "hier", "plural": "", "pluralGroup": "", "image": "../bilder/hier.png", "tr": {"ru": "здесь", "en": "here", "uk": "тут", "ar": "هنا", "ku": "li vir", "tr": "burada", "ro": "aici", "ja": "ここ", "pl": "tutaj"}}, {"id": "da", "article": "", "word": "da", "full": "da", "plural": "", "pluralGroup": "", "image": "../bilder/da.png", "tr": {"ru": "тут / там", "en": "there / here", "uk": "тут / там", "ar": "هناك / هنا", "ku": "li wir", "tr": "orada / burada", "ro": "acolo / aici", "ja": "そこ", "pl": "tam / tu"}}, {"id": "dort", "article": "", "word": "dort", "full": "dort", "plural": "", "pluralGroup": "", "image": "../bilder/dort.png", "tr": {"ru": "там", "en": "there", "uk": "там", "ar": "هناك", "ku": "li wirê", "tr": "orada", "ro": "acolo", "ja": "あそこ", "pl": "tam"}}];
const WO_TASKS=[{"room": "kueche", "place": "hier", "question": "Wo ist die Küche?", "answer": "Die Küche ist hier."}, {"room": "bad", "place": "dort", "question": "Wo ist das Bad?", "answer": "Das Bad ist dort."}, {"room": "flur", "place": "da", "question": "Wo ist der Flur?", "answer": "Der Flur ist da."}, {"room": "balkon", "place": "hier", "question": "Wo ist der Balkon?", "answer": "Der Balkon ist hier."}, {"room": "wohnzimmer", "place": "dort", "question": "Wo ist das Wohnzimmer?", "answer": "Das Wohnzimmer ist dort."}, {"room": "schlafzimmer", "place": "da", "question": "Wo ist das Schlafzimmer?", "answer": "Das Schlafzimmer ist da."}, {"room": "kinderzimmer", "place": "hier", "question": "Wo ist das Kinderzimmer?", "answer": "Das Kinderzimmer ist hier."}, {"room": "arbeitszimmer", "place": "dort", "question": "Wo ist das Arbeitszimmer?", "answer": "Das Arbeitszimmer ist dort."}, {"room": "toilette", "place": "hier", "question": "Wo ist die Toilette?", "answer": "Die Toilette ist hier."}, {"room": "wohnung", "place": "da", "question": "Wo ist die Wohnung?", "answer": "Die Wohnung ist da."}];
const IST_TASKS=[{"room": "kueche", "place": "hier", "positive": true, "question": "Ist hier eine Küche?", "answer": "Ja, hier ist die Küche."}, {"room": "bad", "place": "dort", "positive": true, "question": "Ist dort ein Bad?", "answer": "Ja, dort ist das Bad."}, {"room": "balkon", "place": "hier", "positive": false, "actual": "flur", "question": "Ist hier ein Balkon?", "answer": "Nein, hier ist kein Balkon. Hier ist der Flur."}, {"room": "flur", "place": "da", "positive": true, "question": "Ist da ein Flur?", "answer": "Ja, da ist der Flur."}, {"room": "wohnzimmer", "place": "dort", "positive": false, "actual": "schlafzimmer", "question": "Ist dort ein Wohnzimmer?", "answer": "Nein, dort ist kein Wohnzimmer. Dort ist das Schlafzimmer."}, {"room": "schlafzimmer", "place": "hier", "positive": true, "question": "Ist hier ein Schlafzimmer?", "answer": "Ja, hier ist das Schlafzimmer."}, {"room": "kinderzimmer", "place": "da", "positive": false, "actual": "bad", "question": "Ist da ein Kinderzimmer?", "answer": "Nein, da ist kein Kinderzimmer. Da ist das Bad."}, {"room": "arbeitszimmer", "place": "dort", "positive": true, "question": "Ist dort ein Arbeitszimmer?", "answer": "Ja, dort ist das Arbeitszimmer."}, {"room": "toilette", "place": "hier", "positive": false, "actual": "kueche", "question": "Ist hier eine Toilette?", "answer": "Nein, hier ist keine Toilette. Hier ist die Küche."}, {"room": "wohnung", "place": "da", "positive": true, "question": "Ist da eine Wohnung?", "answer": "Ja, da ist die Wohnung."}];
const KEY="SP_L4_T1_V2";

function simple(x){
 return String(x||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[.,!?]/g,"").replace(/\s+/g," ");
}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function full(w){return w.full}
function wordById(id){return WORDS.find(w=>w.id===id)||{}}
function fixImg(img){img.classList.add("missing");img.alt="Bild fehlt"}

function header(title){
 const h=document.querySelector(".topbar");
 if(!h)return;
 h.innerHTML=`<a class="brand" href="../../index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${title} · A1 Lektion 4 · Thema 1</div></div></a>
 <nav class="nav">
   <a class="btn secondary" href="../index.html">← Zurück</a>
   <a class="btn secondary" href="uebersicht.html">Übersicht</a>
   <a class="btn secondary" href="statistik.html">Statistik</a>
 </nav>`;
}

function taskKey(file){return KEY+"_"+file}
function loadTask(file,total){
 try{
  let st=JSON.parse(localStorage.getItem(taskKey(file))||"null");
  if(st&&st.total===total&&Array.isArray(st.queue)&&Array.isArray(st.done))return st;
 }catch(e){}
 let queue=[...Array(total).keys()].sort(()=>Math.random()-.5);
 return {total,queue,done:[],current:null,tries:0};
}
function saveTask(file,st){localStorage.setItem(taskKey(file),JSON.stringify(st))}
function nextIndex(file,total){
 let st=loadTask(file,total);
 if(st.current===null||st.current===undefined){
  if(!st.queue.length&&st.done.length<total)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i)).sort(()=>Math.random()-.5);
  st.current=st.queue.shift();st.tries=0;saveTask(file,st);
 }
 return st.current;
}
function markRight(file,total){
 let st=loadTask(file,total);
 if(st.current!==null&&!st.done.includes(st.current))st.done.push(st.current);
 st.current=null;st.tries=0;saveTask(file,st);
 return st.done.length>=total;
}
function markWrong(file,total){
 let st=loadTask(file,total);
 st.tries=(st.tries||0)+1;
 // Niemals automatisch weitergehen: Die Aufgabe bleibt, bis die richtige Antwort gegeben wurde.
 saveTask(file,st);
 return st.tries;
}
function progressHtml(file,total){
 let st=loadTask(file,total), d=st.done.length, left=total-d, p=Math.round(d/total*100)||0;
 return `<div class="small">${d} richtig · ${left} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`;
}
function pct(file,total){
 let st=loadTask(file,total);
 return Math.round((st.done.length||0)/total*100)||0;
}
function complete(area,file,next){
 area.innerHTML=`<div class="question">Geschafft!</div><div class="hint">Diese Aufgabe ist abgeschlossen.</div><div class="actions"><a class="btn" href="${next}">Weiter →</a><a class="btn secondary" href="index.html">Zum Menü</a></div>`;
}
function feedbackForTry(tries,solution,type){
 if(tries===1)return"Da ist noch ein Fehler.";
 if(tries===2)return"Tipp: Prüfe "+(type||"Form und Schreibweise")+".";
 return"Lösung: "+solution;
}

function speak(text,slow=false){
 const msg=String(text||"").trim();
 if(!msg)return;
 if(!("speechSynthesis" in window)){alert("Dein Browser unterstützt Vorlesen nicht.");return}
 function run(){
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(msg);
  u.lang="de-DE";
  u.rate=slow?0.65:0.9;
  const voices=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
  const de=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith("de"));
  if(de)u.voice=de;
  speechSynthesis.speak(u);
 }
 const voices=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
 if(voices.length===0&&"onvoiceschanged" in speechSynthesis){speechSynthesis.onvoiceschanged=run;setTimeout(run,250)}else run();
}

function startMic(btn,callback){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const status=document.getElementById("micStatus");
 if(!SR){if(status)status.textContent="Mikrofon wird hier nicht unterstützt. Bitte schreibe.";return}
 const rec=new SR();
 rec.lang="de-DE";
 rec.interimResults=false;
 rec.continuous=false;
 if(btn)btn.classList.add("active");
 if(status)status.textContent="Ich höre zu …";
 rec.onresult=e=>{let txt=e.results[0][0].transcript;if(status)status.textContent="Gehört: "+txt;callback(txt)};
 rec.onerror=()=>{if(status)status.textContent="Mikrofon hat nicht funktioniert. Bitte schreibe."};
 rec.onend=()=>{if(btn)btn.classList.remove("active")};
 rec.start();
}

function placeImg(id,label){
 return `<div class="imgbox"><img src="../bilder/${id}.png" onerror="fixImg(this)" alt=""></div>`;
}
function roomImg(roomId,withLabel=true){
 const w=wordById(roomId);
 return `<div class="imgbox"><img src="${w.image}" onerror="fixImg(this)" alt="">${withLabel?`<div class="label">${w.full}</div>`:""}</div>`;
}
function comboPlaceRoom(place,roomId){
 return `<div class="imgrow">${placeImg(place,place)}<div class="plus">+</div>${roomImg(roomId,false)}</div>`;
}

function okWoQuestion(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 return a.startsWith("wo ist") && (a.includes(simple(w.full)) || a.includes(simple(w.word)));
}
function okWoAnswer(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 return (a.includes(simple(w.full))||a.includes(simple(w.word))) && a.includes(simple(t.place));
}
function indefinite(w){
 if(w.article==="die")return"eine "+w.word;
 if(w.article==="der")return"ein "+w.word;
 return"ein "+w.word;
}
function negIndef(w){
 if(w.article==="die")return"keine "+w.word;
 return"kein "+w.word;
}
function okIstQuestion(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 return a.startsWith("ist "+t.place) && (a.includes(simple(indefinite(w)))||a.includes(simple(w.word)));
}
function okIstAnswer(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 const place=simple(t.place);
 const full=simple(w.full);
 const word=simple(w.word);
 const indef=simple(indefinite(w));
 const neg=simple(negIndef(w));

 if(t.positive){
  return a.startsWith("ja") && a.includes(place) &&
    (a.includes(full) || a.includes(word) || a.includes(indef));
 }

 // Akzeptiert:
 // Nein, hier ist keine Küche.
 // Nein, hier ist kein Balkon.
 // Die Küche ist nicht hier.
 // Hier ist nicht die Küche.
 const startsNein=a.startsWith("nein");
 const hasNegEin=a.includes(neg) || a.includes("kein") || a.includes("keine");
 const hasWord=a.includes(full) || a.includes(word);
 const notHere=hasWord && a.includes("nicht") && a.includes(place);

 return (startsNein && a.includes(place) && (hasNegEin || notHere || hasWord)) || notHere;
}


function prerequisiteTasks(){
 return [
  ["karteikarten.html",WORDS.length],
  ["hoeren.html",WORDS.length],
  ["artikel-klick.html",WORDS.filter(w=>w.article).length],
  ["artikel.html",WORDS.filter(w=>w.article).length],
  ["plural.html",WORDS.filter(w=>w.plural).length],
  ["bild-wort.html",WORDS.length],
  ["wort-bild.html",WORDS.length],
  ["wo-ist.html",WO_TASKS.length],
  ["ist-hier.html",IST_TASKS.length]
 ];
}
function prereqPercent(){
 const tasks=prerequisiteTasks();
 if(!tasks.length)return 0;
 return Math.round(tasks.reduce((sum,t)=>sum+pct(t[0],t[1]),0)/tasks.length)||0;
}
function allPrereqComplete(){
 return prerequisiteTasks().every(t=>pct(t[0],t[1])>=100);
}
function examHistory(){
 try{return JSON.parse(localStorage.getItem("SP_L4_T1_EXAM_HISTORY_V1")||"[]")}catch(e){return[]}
}
function bestExamResult(){
 const h=examHistory();
 if(!h.length)return null;
 return h.reduce((best,x)=>(!best||Number(x.percent||0)>Number(best.percent||0)?x:best),null);
}
function starsForPercent(p){
 p=Number(p||0);
 if(p>=100)return 3;
 if(p>=70)return 2;
 if(p>=50)return 1;
 return 0;
}
function starsHtml(n){
 n=Number(n||0);
 return `<span class="stars">${"★".repeat(n)}${"☆".repeat(3-n)}</span>`;
}

function currentMotherLang(){
 let fromProfile="";
 try{
   const p=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null");
   if(p){
     fromProfile=p.motherLanguageCode||p.muttersprache||p.motherLanguage||"";
   }
 }catch(e){}
 const raw=fromProfile||localStorage.getItem("SP_MOTHER_LANGUAGE_CODE")||localStorage.getItem("motherLanguage")||localStorage.getItem("muttersprache")||localStorage.getItem("lang")||"ru";
 const n=String(raw).trim().toLowerCase();
 const map={
  "arabisch":"ar","russisch":"ru","englisch":"en","ukrainisch":"uk","kurdisch":"ku","türkisch":"tr","tuerkisch":"tr",
  "rumänisch":"ro","rumaenisch":"ro","japanisch":"ja","polnisch":"pl","deutsch":"de","französisch":"fr","franzoesisch":"fr",
  "spanisch":"es","italienisch":"it","portugiesisch":"pt","chinesisch":"zh","dari":"fa","farsi/persisch":"fa","persisch":"fa"
 };
 return map[n]||n||"ru";
}
function translateWord(w){
 const l=currentMotherLang();
 if(w.tr && w.tr[l]) return w.tr[l];
 if(w.tr && w.tr.ru) return w.tr.ru;
 if(w.tr && w.tr.en) return w.tr.en;
 return w.word;
}
function wordsForFile(file){
 if(file==="artikel-klick.html" || file==="artikel.html") return WORDS.filter(w=>w.article);
 if(file==="plural.html") return WORDS.filter(w=>w.plural);
 return WORDS;
}
function wordProgress(wordId){
 const wordTasks=[
  ["karteikarten.html", WORDS],
  ["hoeren.html", WORDS],
  ["artikel-klick.html", WORDS.filter(w=>w.article)],
  ["artikel.html", WORDS.filter(w=>w.article)],
  ["plural.html", WORDS.filter(w=>w.plural)],
  ["bild-wort.html", WORDS],
  ["wort-bild.html", WORDS]
 ];
 let possible=0, doneCount=0;
 wordTasks.forEach(([file,list])=>{
   const index=list.findIndex(w=>w.id===wordId);
   if(index<0) return;
   possible++;
   const st=loadTask(file,list.length);
   if(st.done && st.done.includes(index)) doneCount++;
 });
 if(possible===0) return 0;
 return Math.round(doneCount/possible*100);
}
function wordStatus(p){
 if(p>=100) return "gelernt";
 if(p>=50) return "in Arbeit";
 if(p>0) return "angefangen";
 return "neu";
}
