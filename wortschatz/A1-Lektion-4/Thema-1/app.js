
const WORDS=[{"id": "haus", "article": "das", "word": "Haus", "full": "das Haus", "plural": "die Häuser", "pluralGroup": "-er/Umlaut", "image": "../bilder/haus.png", "tr": {"ru": "дом", "en": "house", "uk": "будинок", "ar": "البيت", "ku": "mal", "tr": "ev", "ro": "casă", "ja": "家", "pl": "dom"}}, {"id": "wohnung", "article": "die", "word": "Wohnung", "full": "die Wohnung", "plural": "die Wohnungen", "pluralGroup": "-en", "image": "../bilder/wohnung.png", "tr": {"ru": "квартира", "en": "apartment", "uk": "квартира", "ar": "الشقة", "ku": "apartman", "tr": "daire", "ro": "apartament", "ja": "アパート", "pl": "mieszkanie"}}, {"id": "zimmer", "article": "das", "word": "Zimmer", "full": "das Zimmer", "plural": "die Zimmer", "pluralGroup": "-", "image": "../bilder/zimmer.png", "tr": {"ru": "комната", "en": "room", "uk": "кімната", "ar": "الغرفة", "ku": "ode", "tr": "oda", "ro": "cameră", "ja": "部屋", "pl": "pokój"}}, {"id": "wohnzimmer", "article": "das", "word": "Wohnzimmer", "full": "das Wohnzimmer", "plural": "die Wohnzimmer", "pluralGroup": "-", "image": "../bilder/wohnzimmer.png", "tr": {"ru": "гостиная", "en": "living room", "uk": "вітальня", "ar": "غرفة المعيشة", "ku": "odeya rûniştinê", "tr": "oturma odası", "ro": "living", "ja": "リビング", "pl": "salon"}}, {"id": "schlafzimmer", "article": "das", "word": "Schlafzimmer", "full": "das Schlafzimmer", "plural": "die Schlafzimmer", "pluralGroup": "-", "image": "../bilder/schlafzimmer.png", "tr": {"ru": "спальня", "en": "bedroom", "uk": "спальня", "ar": "غرفة النوم", "ku": "odeya razanê", "tr": "yatak odası", "ro": "dormitor", "ja": "寝室", "pl": "sypialnia"}}, {"id": "kinderzimmer", "article": "das", "word": "Kinderzimmer", "full": "das Kinderzimmer", "plural": "die Kinderzimmer", "pluralGroup": "-", "image": "../bilder/kinderzimmer.png", "tr": {"ru": "детская комната", "en": "children's room", "uk": "дитяча кімната", "ar": "غرفة الأطفال", "ku": "odeya zarokan", "tr": "çocuk odası", "ro": "camera copiilor", "ja": "子ども部屋", "pl": "pokój dziecięcy"}}, {"id": "arbeitszimmer", "article": "das", "word": "Arbeitszimmer", "full": "das Arbeitszimmer", "plural": "die Arbeitszimmer", "pluralGroup": "-", "image": "../bilder/arbeitszimmer.png", "tr": {"ru": "кабинет", "en": "study", "uk": "кабінет", "ar": "غرفة العمل", "ku": "odeya xebatê", "tr": "çalışma odası", "ro": "birou", "ja": "書斎", "pl": "gabinet"}}, {"id": "kueche", "article": "die", "word": "Küche", "full": "die Küche", "plural": "die Küchen", "pluralGroup": "-n", "image": "../bilder/kueche.png", "tr": {"ru": "кухня", "en": "kitchen", "uk": "кухня", "ar": "المطبخ", "ku": "metbex", "tr": "mutfak", "ro": "bucătărie", "ja": "キッチン", "pl": "kuchnia"}}, {"id": "bad", "article": "das", "word": "Bad", "full": "das Bad", "plural": "die Bäder", "pluralGroup": "-er/Umlaut", "image": "../bilder/bad.png", "tr": {"ru": "ванная", "en": "bathroom", "uk": "ванна кімната", "ar": "الحمام", "ku": "serşok", "tr": "banyo", "ro": "baie", "ja": "浴室", "pl": "łazienka"}}, {"id": "toilette", "article": "die", "word": "Toilette", "full": "die Toilette", "plural": "die Toiletten", "pluralGroup": "-n", "image": "../bilder/toilette.png", "tr": {"ru": "туалет", "en": "toilet", "uk": "туалет", "ar": "المرحاض", "ku": "tûwalet", "tr": "tuvalet", "ro": "toaletă", "ja": "トイレ", "pl": "toaleta"}}, {"id": "flur", "article": "der", "word": "Flur", "full": "der Flur", "plural": "die Flure", "pluralGroup": "-e", "image": "../bilder/flur.png", "tr": {"ru": "коридор", "en": "hallway", "uk": "коридор", "ar": "الممر", "ku": "korîdor", "tr": "koridor", "ro": "hol", "ja": "廊下", "pl": "korytarz"}}, {"id": "balkon", "article": "der", "word": "Balkon", "full": "der Balkon", "plural": "die Balkone", "pluralGroup": "-e", "image": "../bilder/balkon.png", "tr": {"ru": "балкон", "en": "balcony", "uk": "балкон", "ar": "الشرفة", "ku": "balkon", "tr": "balkon", "ro": "balcon", "ja": "バルコニー", "pl": "balkon"}}, {"id": "hier", "article": "", "word": "hier", "full": "hier", "plural": "", "pluralGroup": "", "image": "../bilder/hier.png", "tr": {"ru": "здесь", "en": "here", "uk": "тут", "ar": "هنا", "ku": "li vir", "tr": "burada", "ro": "aici", "ja": "ここ", "pl": "tutaj"}}, {"id": "da", "article": "", "word": "da", "full": "da", "plural": "", "pluralGroup": "", "image": "../bilder/da.png", "tr": {"ru": "тут / там", "en": "there / here", "uk": "тут / там", "ar": "هناك / هنا", "ku": "li wir", "tr": "orada / burada", "ro": "acolo / aici", "ja": "そこ", "pl": "tam / tu"}}, {"id": "dort", "article": "", "word": "dort", "full": "dort", "plural": "", "pluralGroup": "", "image": "../bilder/dort.png", "tr": {"ru": "там", "en": "there", "uk": "там", "ar": "هناك", "ku": "li wirê", "tr": "orada", "ro": "acolo", "ja": "あそこ", "pl": "tam"}}];
const WO_TASKS=[{"room": "kueche", "place": "hier", "question": "Wo ist die Küche?", "answer": "Die Küche ist hier."}, {"room": "bad", "place": "dort", "question": "Wo ist das Bad?", "answer": "Das Bad ist dort."}, {"room": "flur", "place": "da", "question": "Wo ist der Flur?", "answer": "Der Flur ist da."}, {"room": "balkon", "place": "hier", "question": "Wo ist der Balkon?", "answer": "Der Balkon ist hier."}, {"room": "wohnzimmer", "place": "dort", "question": "Wo ist das Wohnzimmer?", "answer": "Das Wohnzimmer ist dort."}, {"room": "schlafzimmer", "place": "da", "question": "Wo ist das Schlafzimmer?", "answer": "Das Schlafzimmer ist da."}, {"room": "kinderzimmer", "place": "hier", "question": "Wo ist das Kinderzimmer?", "answer": "Das Kinderzimmer ist hier."}, {"room": "arbeitszimmer", "place": "dort", "question": "Wo ist das Arbeitszimmer?", "answer": "Das Arbeitszimmer ist dort."}, {"room": "toilette", "place": "hier", "question": "Wo ist die Toilette?", "answer": "Die Toilette ist hier."}, {"room": "wohnung", "place": "da", "question": "Wo ist die Wohnung?", "answer": "Die Wohnung ist da."}];
const IST_TASKS=[{"room": "kueche", "place": "hier", "positive": true, "question": "Ist hier eine Küche?", "answer": "Ja, die Küche ist hier."}, {"room": "bad", "place": "dort", "positive": true, "question": "Ist dort ein Bad?", "answer": "Ja, das Bad ist dort."}, {"room": "balkon", "place": "hier", "positive": false, "actual": "flur", "question": "Ist hier ein Balkon?", "answer": "Nein, hier ist kein Balkon. Hier ist der Flur."}, {"room": "flur", "place": "da", "positive": true, "question": "Ist da ein Flur?", "answer": "Ja, der Flur ist da."}, {"room": "wohnzimmer", "place": "dort", "positive": false, "actual": "schlafzimmer", "question": "Ist dort ein Wohnzimmer?", "answer": "Nein, dort ist kein Wohnzimmer. Dort ist das Schlafzimmer."}, {"room": "schlafzimmer", "place": "hier", "positive": true, "question": "Ist hier ein Schlafzimmer?", "answer": "Ja, das Schlafzimmer ist hier."}, {"room": "kinderzimmer", "place": "da", "positive": false, "actual": "bad", "question": "Ist da ein Kinderzimmer?", "answer": "Nein, da ist kein Kinderzimmer. Da ist das Bad."}, {"room": "arbeitszimmer", "place": "dort", "positive": true, "question": "Ist dort ein Arbeitszimmer?", "answer": "Ja, das Arbeitszimmer ist dort."}, {"room": "toilette", "place": "hier", "positive": false, "actual": "kueche", "question": "Ist hier eine Toilette?", "answer": "Nein, hier ist keine Toilette. Hier ist die Küche."}, {"room": "wohnung", "place": "da", "positive": true, "question": "Ist da eine Wohnung?", "answer": "Ja, die Wohnung ist da."}];
const KEY="SP_L4_T1_V2";

function simple(x){
 return String(x||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[.,!?]/g,"").replace(/\s+/g," ");
}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function full(w){return w.full}
function wordById(id){return WORDS.find(w=>w.id===id)||{}}
function fixImg(img){img.classList.add("missing");img.alt="Bild fehlt"}

function header(title,isThemeOverview=false){
 const h=document.querySelector(".topbar");
 if(!h)return;
 const backHref=isThemeOverview ? "../index.html" : "index.html";
 h.innerHTML=`<a class="brand" href="/index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${title} · A1 Lektion 4 · Thema 1</div></div></a>
 <nav class="nav">
   <a class="btn secondary" href="${backHref}">← Zurück</a>
   <a class="btn secondary" href="uebersicht.html">Übersicht</a>
   <a class="btn secondary" href="statistik.html">Statistik</a>
   <button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>
 </nav>`;
}

function resetThemeProgress(){
 if(!confirm("Möchten Sie wirklich alle Fortschritte in diesem Thema löschen?")) return;
 Object.keys(localStorage).forEach(k=>{
   if(k.startsWith(KEY) || k.startsWith("SP_L4_T1_EXAM_")){
     localStorage.removeItem(k);
   }
 });
 location.href="index.html";
}

function taskKey(file){return KEY+"_"+file}
function loadTask(file,total){
 try{
  let st=JSON.parse(localStorage.getItem(taskKey(file))||"null");
  if(st&&st.total===total&&Array.isArray(st.queue)&&Array.isArray(st.done))return st;
 }catch(e){}
 let queue=[...Array(total).keys()].sort(()=>Math.random()-.5);
 return {total,queue,done:[],current:null,tries:0,hadWrong:false};
}
function saveTask(file,st){
 localStorage.setItem(taskKey(file),JSON.stringify(st));
 try{window.dispatchEvent(new CustomEvent("sprachpilot-progress",{detail:{file,st}}))}catch(e){}
}
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
 const current=st.current;

 if(current!==null && current!==undefined){
   if(st.hadWrong || (st.tries||0)>0){
     // Nach Fehlern wird die Aufgabe zwar nach richtiger Korrektur verlassen,
     // aber nicht als gelernt gezählt. Sie kommt später nochmal.
     if(!st.done.includes(current) && !st.queue.includes(current)){
       st.queue.push(current);
     }
   }else{
     // Nur fehlerfrei beim ersten Versuch zählt als Fortschritt.
     if(!st.done.includes(current)) st.done.push(current);
   }
 }

 st.current=null;
 st.tries=0;
 st.hadWrong=false;
 saveTask(file,st);
 return st.done.length>=total;
}
function markWrong(file,total){
 let st=loadTask(file,total);
 st.tries=(st.tries||0)+1;
 st.hadWrong=true;
 // Nicht automatisch weitergehen: Die aktuelle Aufgabe bleibt stehen.
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

 function pickGermanVoice(){
   const voices=speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
   return (
     voices.find(v=>v.lang==="de-DE" && /google|microsoft|anna|katja|deutsch|german/i.test(v.name||"")) ||
     voices.find(v=>v.lang==="de-DE") ||
     voices.find(v=>String(v.lang||"").toLowerCase().startsWith("de")) ||
     null
   );
 }

 function run(){
   speechSynthesis.cancel();
   const u=new SpeechSynthesisUtterance(msg);
   u.lang="de-DE";
   u.rate=slow?0.68:0.86;
   u.pitch=1;
   u.volume=1;
   const voice=pickGermanVoice();
   if(voice) u.voice=voice;
   speechSynthesis.speak(u);
 }

 const voices=speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
 if(!voices.length && "onvoiceschanged" in speechSynthesis){
   speechSynthesis.onvoiceschanged=run;
   setTimeout(run,300);
 }else{
   run();
 }
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

function negComboPlaceRoom(place,wrongRoomId,actualRoomId){
 const wrong=wordById(wrongRoomId);
 const actual=wordById(actualRoomId);
 return `<div class="imgrow">
  <div class="imgbox neg-target"><img src="${wrong.image}" onerror="fixImg(this)" alt=""><div class="cross">✕</div></div>
  <div class="plus">→</div>
  ${placeImg(place,place)}
  <div class="plus">+</div>
  <div class="imgbox"><img src="${actual.image}" onerror="fixImg(this)" alt=""></div>
 </div>`;
}


function okWoQuestion(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 // Muss sein: "Wo ist die Küche?" / "Wo ist das Bad?" / "Wo ist der Flur?"
 return a.startsWith("wo ist") && a.includes(simple(w.full));
}
function okWoAnswer(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 // Antwort muss bestimmten Artikel enthalten: "Die Küche ist hier."
 return a.includes(simple(w.full)) && a.includes(simple(t.place));
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
 // Muss sein: "Ist hier eine Küche?" / "Ist da ein Flur?"
 return a.startsWith("ist "+simple(t.place)) && a.includes(simple(indefinite(w)));
}
function okIstAnswer(ans,t){
 const w=wordById(t.room);
 let a=simple(ans);
 const place=simple(t.place);

 if(t.positive){
  // Positive Antwort: "Ja, hier ist die Küche."
  return a.startsWith("ja") && a.includes(place) && a.includes(simple(w.full));
 }

 const actual=wordById(t.actual);
 const targetNeg=simple(negIndef(w));       // keine Toilette / kein Balkon
 const actualFull=simple(actual.full);      // die Küche / der Flur / das Schlafzimmer

 // Negative Antwort:
 // "Nein, hier ist keine Toilette. Hier ist die Küche."
 // Wichtig: Das tatsächliche Objekt wird mit bestimmtem Artikel erwartet.
 return a.startsWith("nein") &&
        a.includes(place) &&
        a.includes(targetNeg) &&
        actual && actual.id &&
        a.includes(actualFull);
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
function topicCompleted(){
 const best=bestExamResult();
 return !!best && Number(best.percent||0)>=50;
}
function bestExamSummaryHtml(){
 const best=bestExamResult();
 if(!best){
   return `<div class="exam-done-box muted"><b>Prüfung noch nicht abgeschlossen</b><br>Noch keine Sterne gesammelt.</div>`;
 }
 const stars=starsForPercent(best.percent);
 return `<div class="exam-done-box">
   <b>Thema abgeschlossen!</b><br>
   Prüfung: <b>${best.percent}%</b> · ${starsHtml(stars)}<br>
   Punkte: ${best.score}/${best.maxScore} · Versuche: ${examHistory().length}
 </div>`;
}


/* ===== SprachPilot Standard-Fix Thema 1: Header, Abschluss, Wiederholen, Dashboard, Progress ===== */
var SP_T1_THEME_ID="wortschatz-a1-lektion-4-thema-1";
var SP_T1_MODULE="wortschatz";
var SP_T1_LEVEL="A1";
var SP_T1_LESSON="4";
var SP_T1_THEME="1";
var SP_T1_TITLE="Wohnung & Zimmer";
var EXAM_UNLOCK_KEY="SP_L4_T1_EXAM_UNLOCKED";
var DASHBOARD_URL="/student-dashboard/index.html";
var PROFILE_URL="/profile/index.html";
var HOME_URL="/index.html";
var DASHBOARD_ALL_KEY="SP_DASHBOARD_PROGRESS_ALL";
var DASHBOARD_TOPIC_KEY="SP_DASHBOARD_PROGRESS_L4_T1";
var DASHBOARD_LEGACY_KEY="SP_L4_T1_DASHBOARD_PROGRESS";

function esc(s){return String(s||"").replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[m]))}
function currentDirPath(){return String(location.pathname||"").replace(/[^/]*$/,"")}
function currentProfile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("sprachpilotUser")||"null")||{}}catch(e){return {}}}
function currentUserLabel(){const p=currentProfile();const name=[p.firstName||p.vorname||p.name,p.lastName||p.nachname].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in";const course=p.courseCode||p.kurs||p.course||p.kursCode||localStorage.getItem("SP_COURSE_CODE")||"Kurs";return `${name} · ${course}`}
function currentCourseCode(){const p=currentProfile();return String(p.courseCode||p.kurs||p.course||p.kursCode||localStorage.getItem("SP_COURSE_CODE")||"")}
function currentStudentName(){const p=currentProfile();return [p.firstName||p.vorname||p.name,p.lastName||p.nachname].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function currentStudentId(){const p=currentProfile();return String(p.studentId||p.uid||p.docId||p.email||p.id||currentStudentName())}
function goHome(e){if(e)e.preventDefault();location.href=HOME_URL}
function goDashboard(e){if(e)e.preventDefault();syncDashboardProgress();location.href=DASHBOARD_URL}
function goProfile(e){if(e)e.preventDefault();location.href=PROFILE_URL}
function logoutUser(){if(!confirm("Möchten Sie sich abmelden?"))return;["SP_USER_PROFILE","SP_KEEP_LOGGED_IN","SP_STUDENT_ID","motherLanguage","muttersprache","SP_MOTHER_LANGUAGE_CODE","sprachpilotUser","SP_CURRENT_USER","SP_LOGIN"].forEach(k=>localStorage.removeItem(k));location.href=HOME_URL}
function header(title,isThemeOverview=false){
 const h=document.querySelector(".topbar"); if(!h)return;
 const backHref=isThemeOverview?"../index.html":"index.html";
 h.innerHTML=`<div class="topbar-main"><a class="brand" href="${HOME_URL}" onclick="goHome(event)"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · A1 Lektion 4 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(currentUserLabel())}</span><a class="account-link" href="${DASHBOARD_URL}" onclick="goDashboard(event)">📊 Dashboard</a><a class="account-link" href="${PROFILE_URL}" onclick="goProfile(event)">👤 Profil</a><button class="account-link account-btn" type="button" onclick="logoutUser()">🚪 Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="${backHref}">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><button class="btn danger-btn" type="button" onclick="resetThemeProgress()">Fortschritte löschen</button></nav>`;
}
function queueProgress(method,payload){try{payload={module:SP_T1_MODULE,level:SP_T1_LEVEL,lesson:SP_T1_LESSON,theme:SP_T1_THEME,topicId:SP_T1_THEME_ID,title:"A1 Lektion 4 · Thema 1",moduleTitle:"Wortschatz",...(payload||{})};if(window.SPProgress&&typeof window.SPProgress[method]==="function"){window.SPProgress[method](payload);return}window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method,payload});import("/js/progress.js").catch(()=>{});}catch(e){}}
function practiceFlag(file){return "SP_L4_T1_PRACTICE_"+file}
function isPracticeMode(file){return sessionStorage.getItem(practiceFlag(file))==="1"}
function taskKey(file){return KEY+"_"+file+(isPracticeMode(file)?"_PRACTICE":"")}
function resetPractice(file){localStorage.removeItem(KEY+"_"+file+"_PRACTICE")}
function startPractice(file){sessionStorage.setItem(practiceFlag(file),"1");resetPractice(file);location.reload()}
function stopPractice(file){sessionStorage.removeItem(practiceFlag(file))}
function resetThemeProgress(){if(!confirm("Möchten Sie wirklich alle Fortschritte in diesem Thema löschen?"))return;queueProgress("recordThemeReset",{});Object.keys(localStorage).forEach(k=>{if(k.startsWith(KEY)||k.startsWith("SP_L4_T1_EXAM_")||k===EXAM_UNLOCK_KEY||k===DASHBOARD_TOPIC_KEY||k===DASHBOARD_LEGACY_KEY)localStorage.removeItem(k)});Object.keys(sessionStorage).forEach(k=>{if(k.startsWith("SP_L4_T1_PRACTICE_"))sessionStorage.removeItem(k)});try{const all=JSON.parse(localStorage.getItem(DASHBOARD_ALL_KEY)||"{}");delete all[SP_T1_THEME_ID];localStorage.setItem(DASHBOARD_ALL_KEY,JSON.stringify(all))}catch(e){}setTimeout(()=>{location.href="index.html"},250)}
function loadTask(file,total){try{let st=JSON.parse(localStorage.getItem(taskKey(file))||"null");if(st&&Array.isArray(st.queue)&&Array.isArray(st.done)){if(st.total!==total){st.total=total;st.done=[...new Set(st.done.filter(i=>Number.isInteger(i)&&i>=0&&i<total))];st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i)).sort(()=>Math.random()-.5);st.current=null;st.tries=0;st.hadWrong=false;st.repeatQueued=false;saveTask(file,st)}return st}}catch(e){}let queue=[...Array(total).keys()].sort(()=>Math.random()-.5);return{total,queue,done:[],current:null,tries:0,hadWrong:false,repeatQueued:false,wrongItems:[]}}
function realLoadTask(file,total){const saved=sessionStorage.getItem(practiceFlag(file));sessionStorage.removeItem(practiceFlag(file));let st=loadTask(file,total);if(saved!==null)sessionStorage.setItem(practiceFlag(file),saved);return st}
function itemNameFor(file,index){try{let list=wordsForFile(file);if(file==="wo-ist.html")return WO_TASKS[index]?.question||String(index);if(file==="ist-hier.html")return IST_TASKS[index]?.question||String(index);const w=list[index]||WORDS[index];return w?.full||w?.word||w?.id||String(index)}catch(e){return String(index)}}
function saveTask(file,st){localStorage.setItem(taskKey(file),JSON.stringify(st));try{window.dispatchEvent(new CustomEvent("sprachpilot-progress",{detail:{file,st}}))}catch(e){}syncDashboardProgress();try{queueProgress("recordTaskProgress",{file,taskKey:file,taskTitle:file.replace(".html",""),total:st.total||0,done:(st.done||[]).length,percent:pct(file,st.total||1),completed:(st.done||[]).length>=(st.total||1),tries:st.tries||0,wrongItems:st.wrongItems||[],lastWrongItem:st.lastWrongItem||""})}catch(e){}}
function nextIndex(file,total){let st=loadTask(file,total);if(st.current===null||st.current===undefined){if(!st.queue.length&&st.done.length<total)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i)).sort(()=>Math.random()-.5);st.current=st.queue.shift();st.tries=0;st.hadWrong=false;st.repeatQueued=false;saveTask(file,st)}return st.current}
function markRight(file,total){let st=loadTask(file,total);const current=st.current;if(current!==null&&current!==undefined){if(st.hadWrong||(st.tries||0)>0){if(!st.done.includes(current)&&!st.queue.includes(current))st.queue.push(current)}else{if(!st.done.includes(current))st.done.push(current)}}st.current=null;st.tries=0;st.hadWrong=false;st.repeatQueued=false;saveTask(file,st);return st.done.length>=total}
function markWrong(file,total){let st=loadTask(file,total);st.tries=(st.tries||0)+1;st.hadWrong=true;const wrongName=itemNameFor(file,st.current);st.wrongItems=[...new Set([...(st.wrongItems||[]),wrongName].filter(Boolean))];st.lastWrongItem=wrongName;if(st.current!==null&&st.current!==undefined&&!st.repeatQueued){st.queue.push(st.current);st.repeatQueued=true}saveTask(file,st);return st.tries}
function progressHtml(file,total){let st=loadTask(file,total),d=Math.min(st.done.length,total),left=Math.max(0,total-d),p=Math.min(100,Math.round(d/(total||1)*100)||0);const practice=isPracticeMode(file)?" · Wiederholung":"";return `<div class="small">${d} richtig · ${left} übrig · ${p}%${practice}</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function pct(file,total){let st=realLoadTask(file,total);const doneCount=Math.min((st.done||[]).length,total||0);return Math.min(100,Math.round(doneCount/(total||1)*100)||0)}
function feedbackForTry(tries,solution,type){if(tries===1)return `<div class="no">Da ist noch ein Fehler.</div>`;if(tries===2)return `<div class="no">Tipp: Prüfe ${esc(type||"die Antwort")}.</div>`;return `<div class="no">Lösung: ${esc(solution)}</div>`}
function complete(target,file,nextHref="index.html"){if(isPracticeMode(file))stopPractice(file);target.innerHTML=`<div class="small">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="finish-box"><div class="finish-icon">✓</div><div class="question">Aufgabe geschafft!</div><div class="big">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="actions"><button class="btn" onclick="startPractice('${file}')">Nochmal üben</button><a class="btn green" href="${nextHref}" onclick="stopPractice('${file}')">Weiter</a><a class="btn secondary" href="index.html" onclick="stopPractice('${file}')">Zurück zum Thema</a></div></div>`}
function prerequisiteTasks(){return [["karteikarten.html",WORDS.length],["hoeren.html",WORDS.length],["artikel-klick.html",WORDS.filter(w=>w.article).length],["artikel.html",WORDS.filter(w=>w.article).length],["plural.html",WORDS.filter(w=>w.plural).length],["bild-wort.html",WORDS.length],["wort-bild.html",WORDS.length],["wo-ist.html",WO_TASKS.length],["ist-hier.html",IST_TASKS.length]]}
function prereqPercent(){const t=prerequisiteTasks();return Math.round(t.reduce((s,x)=>s+pct(x[0],x[1]),0)/(t.length||1))||0}
function allPrereqComplete(){return prerequisiteTasks().every(t=>pct(t[0],t[1])>=100)}
function setExamUnlocked(){localStorage.setItem(EXAM_UNLOCK_KEY,"1");syncDashboardProgress()}
function isExamUnlocked(){if(localStorage.getItem(EXAM_UNLOCK_KEY)==="1"){syncDashboardProgress();return true}if(allPrereqComplete()){setExamUnlocked();return true}syncDashboardProgress();return false}
function saveExamResult(result){setExamUnlocked();let h=[];try{h=JSON.parse(localStorage.getItem("SP_L4_T1_EXAM_HISTORY_V1")||"[]")}catch(e){}h.push({...result,date:new Date().toISOString()});localStorage.setItem("SP_L4_T1_EXAM_HISTORY_V1",JSON.stringify(h));queueProgress("recordExamResult",{score:Number(result?.score||0)||0,maxScore:Number(result?.maxScore||200)||200,percent:result?.percent||0,stars:result?.stars||0});syncDashboardProgress();return h}
function bestExamResultFrom(h){if(!h||!h.length)return null;return h.reduce((best,x)=>(!best||Number(x.percent||0)>Number(best.percent||0)?x:best),null)}
function examHistory(){try{return JSON.parse(localStorage.getItem("SP_L4_T1_EXAM_HISTORY_V1")||"[]")}catch(e){return[]}}
function bestExamResult(){return bestExamResultFrom(examHistory())}
function starsForPercent(p){p=Number(p||0);if(p>=100)return 3;if(p>=70)return 2;if(p>=50)return 1;return 0}
function starsHtml(n){n=Number(n||0);return `<span class="stars">${"★".repeat(n)}${"☆".repeat(3-n)}</span>`}
function bestExamSummaryHtml(){const best=bestExamResult();if(!best)return "";const stars=starsForPercent(best.percent);return `<div class="exam-done-box exam-summary-wide"><div class="exam-summary-title"><span class="exam-check">✓</span><span>Thema abgeschlossen!</span></div><div class="exam-summary-grid"><div class="exam-summary-item"><span>Prüfung</span><strong>${best.percent}% ${starsHtml(stars)}</strong></div><div class="exam-summary-item"><span>Punkte</span><strong>${best.score}/${best.maxScore}</strong></div><div class="exam-summary-item"><span>Versuche</span><strong>${examHistory().length}</strong></div></div></div>`}
function safeTaskPercent(file,total){try{const st=JSON.parse(localStorage.getItem(KEY+"_"+file)||"null");if(!st||!Array.isArray(st.done))return 0;return Math.min(100,Math.round(st.done.length/(total||1)*100)||0)}catch(e){return 0}}
function dashboardProgressData(){const tasks=prerequisiteTasks().map(([file,total])=>({file,total,percent:safeTaskPercent(file,total),done:safeTaskPercent(file,total)>=100,updatedAt:new Date().toISOString()}));const best=bestExamResult();const unlocked=isExamUnlocked();const examPercent=best?Math.min(100,Number(best.percent||0)):0;const examStars=best?starsForPercent(examPercent):0;const taskAverage=tasks.length?Math.round(tasks.reduce((s,t)=>s+t.percent,0)/tasks.length):0;return{id:SP_T1_THEME_ID,module:"wortschatz",level:"A1",lesson:4,theme:1,topic:1,title:"Wohnung & Zimmer",subtitle:"A1 Lektion 4 · Thema 1",url:currentDirPath()+"index.html",user:currentUserLabel(),percent:Math.min(100,Math.round((taskAverage+examPercent)/2)||0),taskPercent:taskAverage,tasks,completedTasks:tasks.filter(t=>t.percent>=100).length,totalTasks:tasks.length,exam:{unlocked,attempted:!!best,percent:examPercent,stars:examStars,attempts:examHistory().length,best},words:WORDS.map(w=>({id:w.id,full:w.full,percent:wordProgress(w.id),status:wordStatus(wordProgress(w.id))})),updatedAt:new Date().toISOString()}}
var __spDashboardSyncing=false;
function syncDashboardProgress(){if(__spDashboardSyncing)return;__spDashboardSyncing=true;try{const data=dashboardProgressData();localStorage.setItem(DASHBOARD_TOPIC_KEY,JSON.stringify(data));localStorage.setItem(DASHBOARD_LEGACY_KEY,JSON.stringify(data));let all={};try{all=JSON.parse(localStorage.getItem(DASHBOARD_ALL_KEY)||"{}")}catch(e){all={}}all[data.id]=data;localStorage.setItem(DASHBOARD_ALL_KEY,JSON.stringify(all));try{window.dispatchEvent(new CustomEvent("sprachpilot-dashboard-progress",{detail:data}))}catch(e){}}catch(e){}__spDashboardSyncing=false}
try{window.addEventListener("load",()=>{syncDashboardProgress();queueProgress("touch",{action:"page-open"})})}catch(e){}

/* ===== SprachPilot Standard-Header FINAL v232: einheitlich für alle Themen ===== */
function header(title,isThemeOverview=false){
 const h=document.querySelector(".topbar");
 if(!h)return;
 const backHref=isThemeOverview?"../index.html":"index.html";
 const home=(typeof HOME_URL!=="undefined"?HOME_URL:"/index.html");
 const dashboard=(typeof DASHBOARD_URL!=="undefined"?DASHBOARD_URL:"/student-dashboard/index.html");
 const profile=(typeof PROFILE_URL!=="undefined"?PROFILE_URL:"/profile/index.html");
 const label=(typeof currentUserLabel==="function"?currentUserLabel():"Schüler/in");
 const safe=(typeof esc==="function"?esc:function(s){return String(s||"").replace(/[&<>'"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[m]||m})});
 h.innerHTML=`<div class="topbar-main"><a class="brand" href="${home}" onclick="goHome(event)"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${safe(title)} · A1 Lektion 4 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${safe(label)}</span><a class="account-link" href="${dashboard}" onclick="goDashboard(event)">📊 Dashboard</a><a class="account-link" href="${profile}" onclick="goProfile(event)">👤 Profil</a><button class="account-link account-btn" type="button" onclick="logoutUser()">🚪 Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="${backHref}">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><button class="btn danger-btn" type="button" onclick="resetThemeProgress()">Fortschritte löschen</button></nav>`;
}
