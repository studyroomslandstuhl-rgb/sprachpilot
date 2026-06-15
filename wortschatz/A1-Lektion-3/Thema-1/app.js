
const WORDS=[{"id": "brot", "article": "das", "word": "Brot", "plural": "die Brote", "pluralGroup": "-e", "source": "book", "countable": true, "active": true, "image": "../bilder/brot.png", "translations": {"Russisch": "хлеб", "Englisch": "bread", "Deutsch": "Brot"}}, {"id": "banane", "article": "die", "word": "Banane", "plural": "die Bananen", "pluralGroup": "-en/-n", "source": "book", "countable": true, "active": true, "image": "../bilder/banane.png", "translations": {"Russisch": "банан", "Englisch": "banana", "Deutsch": "Banane"}}];
const TASKS=[{"file": "karteikarten.html", "name": "Karteikarten"}, {"file": "bild-wort.html", "name": "Bild → Wort"}, {"file": "wort-bild.html", "name": "Wort → Bild"}, {"file": "hoeren.html", "name": "Hören"}, {"file": "sprechen.html", "name": "Sprechen"}, {"file": "schreiben.html", "name": "Schreiben"}, {"file": "artikel.html", "name": "Artikel"}, {"file": "drag-drop-artikel.html", "name": "Artikel zuordnen"}, {"file": "plural.html", "name": "Plural schreiben"}, {"file": "plural-drag-drop.html", "name": "Pluralgruppen"}, {"file": "ein-eine.html", "name": "Das ist ..."}, {"file": "kein-keine.html", "name": "Nein, das ist ..."}, {"file": "fragen-ohne-fragewort.html", "name": "Fragen ohne Fragewort"}, {"file": "fragen-mit-fragewort.html", "name": "Fragen mit Fragewort"}, {"file": "memory.html", "name": "Memory"}, {"file": "pruefung.html", "name": "Prüfung"}];
const KEY='SP_A1_L3_T1_ENGINE_V2';
const PROFILE_KEY='SP_USER_PROFILE';
const TEACHER_KEY='SP_TEACHER_A1_L3_T1';

function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}catch(e){return {}}}
function lang(){return getProfile().muttersprache||getProfile().motherLanguage||localStorage.getItem('SP_NATIVE_LANG')||'Russisch'}
function trans(w){let tr=w.translations||{};return tr[lang()]||tr['Russisch']||tr['Englisch']||tr['Deutsch']||w.word}
function teacher(){try{return JSON.parse(localStorage.getItem(TEACHER_KEY)||'{}')}catch(e){return {}}}
function allActiveWords(){let t=teacher(),ids=t.activeWords;let base=WORDS.filter(w=>w.active!==false);return Array.isArray(ids)&&ids.length?base.filter(w=>ids.includes(w.id)):base}
function batchInfo(){let s=load(),size=20,all=allActiveWords(),batch=s.batchIndex||0,start=batch*size;return {batch,start,end:Math.min(start+size,all.length),size,total:all.length}}
function activeWords(){let b=batchInfo(),all=allActiveWords();let part=all.slice(b.start,b.end);return part.length?part:all.slice(0,20)}
function singularWords(){return activeWords().filter(w=>w.plural!=='Nur Plural')}
function norm(x){return String(x||'').trim().replace(/\s+/g,' ')}
function simple(x){return norm(x).toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss')}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function full(w){return w.article+' '+w.word}
function articleOk(a,w){a=String(a||'').toLowerCase();return w.article==='der/das'?(a==='der'||a==='das'):a===w.article}
function diagnose(ans,w){let a=norm(ans);if(!a)return {ok:false,msg:'Du hast noch nichts geschrieben.',tip:'Schreibe Artikel + Nomen.',sol:full(w)};let parts=a.split(' ');let art=(parts[0]||'').toLowerCase();if(!['der','die','das'].includes(art))return {ok:false,msg:'Der Artikel fehlt oder ist falsch.',tip:'Achte auf der / die / das.',sol:full(w)};if(!articleOk(art,w))return {ok:false,msg:'Der Artikel ist falsch.',tip:'Lerne Artikel immer mit dem Nomen.',sol:full(w)};let word=a.replace(/^(der|die|das)\s+/i,'');if(simple(word)!==simple(w.word))return {ok:false,msg:'Falsches Wort.',tip:'Vergleiche Wort und Bild/Übersetzung.',sol:full(w)};return {ok:true,msg:'Richtig!'}}
function speak(text,slow=false){try{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=slow?0.55:0.82;speechSynthesis.speak(u)}catch(e){}}
function speech(cb){let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){cb('','no-support');return}let r=new SR();r.lang='de-DE';r.interimResults=false;r.maxAlternatives=1;r.onresult=e=>cb(e.results[0][0].transcript,'result');r.onerror=e=>cb('',e.error||'error');r.start()}

function taskState(file){let s=load();s.tasks=s.tasks||{};s.tasks[file]=s.tasks[file]||{done:[],bad:[],tries:{}};save(s);return s.tasks[file]}
function setTaskState(file,ts){let s=load();s.tasks=s.tasks||{};s.tasks[file]=ts;save(s)}
function queueFor(file,list){let ts=taskState(file);let done=new Set(ts.done||[]);let bad=ts.bad||[];let q=list.filter(w=>!done.has(w.id));return {file,q:shuffle(q),bad:bad.map(id=>list.find(w=>w.id===id)).filter(Boolean),done:[...done],cur:null,tries:0,had:false}}
function nextItem(Q){if(Q.q.length)return Q.q.shift();if(Q.bad.length){Q.q=shuffle(Q.bad);Q.bad=[];return Q.q.shift()}return null}
function persist(Q){setTaskState(Q.file,{done:Q.done,bad:[...new Set(Q.bad.map(w=>w.id))],tries:{}})}
function wrong(Q){Q.tries++;Q.had=true}
function right(Q,w){if(Q.had){Q.bad.push(w)}else if(!Q.done.includes(w.id)){Q.done.push(w.id)}persist(Q);updateWordProgress(w.id)}
function fail(Q,d){if(Q.tries===1)return d.msg;if(Q.tries===2)return d.msg+`<div class="hint">Tipp: ${d.tip}</div>`;return d.msg+`<div class="hint">Lösung: ${d.sol}</div>`}
function prog(Q){let left=Q.q.length+Q.bad.length+(Q.cur?1:0),done=Q.done.length,p=Math.round(done/(done+left)*100)||0;return`<div class="small">${done} richtig · ${left} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function finishTask(file){let s=load();s.doneTasks=s.doneTasks||{};s.doneTasks[file]=true;save(s)}
function complete(area,file,next){finishTask(file);area.innerHTML=`<div class="big">Gut gemacht! Aufgabe erledigt.</div><p class="feedback">Fortschritt gespeichert.</p><div class="actions"><a class="btn" href="${next}">Nächste Aufgabe →</a><a class="btn secondary" href="index.html">Übersicht</a></div>`}
function updateWordProgress(id){let s=load();s.wordProgress=s.wordProgress||{};s.wordProgress[id]=Math.min(100,(s.wordProgress[id]||0)+20);save(s)}
function wordPct(id){let s=load();return (s.wordProgress&&s.wordProgress[id])||0}
function unlockNextBatch(){let s=load();s.batchIndex=(s.batchIndex||0)+1;s.tasks={};s.doneTasks={};save(s)}
function taskPercent(file){let s=load();let ts=s.tasks&&s.tasks[file];if(s.doneTasks&&s.doneTasks[file])return 100;if(!ts)return 0;let total=activeWords().length;return total?Math.round((ts.done||[]).length/total*100):0}
function checkPlural(ans,w){return norm(ans)===w.plural}
function fixImg(img){img.classList.add('missing');img.title='Bild fehlt oder Dateiname stimmt nicht';}
function header(title){document.querySelector('.hero').innerHTML=`<div class="topbar"><a class="brand" href="index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><p class="sub">${title} · A1 Lektion 3 · Thema 1</p></div></a><div class="nav"><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><a class="btn secondary" href="index.html">Thema 1</a></div></div>`}
