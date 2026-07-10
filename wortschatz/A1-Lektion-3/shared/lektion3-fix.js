(function(){
  function profile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"{}")}catch(e){return {}}}
  function preferredLang(){try{const p=profile();const visible=p.muttersprache||p.motherLanguage||localStorage.getItem("muttersprache")||"Russisch";const code=localStorage.getItem("SP_MOTHER_LANGUAGE_CODE")||localStorage.getItem("motherLanguage")||"";const map={sq:"Albanisch",am:"Amharisch",ar:"Arabisch",hy:"Armenisch",az:"Aserbaidschanisch",bn:"Bengalisch",bs:"Bosnisch",bg:"Bulgarisch",zh:"Chinesisch",fa:"Farsi/Persisch",prs:"Dari",de:"Deutsch",en:"Englisch",fr:"Französisch",ka:"Georgisch",el:"Griechisch",hi:"Hindi",it:"Italienisch",ja:"Japanisch",kk:"Kasachisch",hr:"Kroatisch",ku:"Kurdisch",ps:"Paschtu",pl:"Polnisch",pt:"Portugiesisch",ro:"Rumänisch",ru:"Russisch",sr:"Serbisch",so:"Somali",es:"Spanisch",ta:"Tamil",th:"Thai",ti:"Tigrinya",cs:"Tschechisch",tr:"Türkisch",uk:"Ukrainisch",hu:"Ungarisch",ur:"Urdu",uz:"Usbekisch",vi:"Vietnamesisch"};return map[String(code).toLowerCase()]||visible||"Russisch"}catch(e){return "Russisch"}}
  window.spL3PreferredLang=preferredLang;window.lang=preferredLang;
  function currentTheme(){const m=location.pathname.match(/A1-Lektion-3\/Thema-(\d+)/);return m?m[1]:""}
  function rel(file,theme){return !window.SprachPilotRelease||SprachPilotRelease.taskReleased(file,{module:'wortschatz',lesson:'A1-Lektion-3',theme:'Thema-'+theme})}
  function localState(){try{return typeof load==='function'?load():{}}catch(e){return {}}}
  function saveLocalState(s){try{if(typeof save==='function')save(s)}catch(e){}}
  function activeList(){try{return typeof activeWords==='function'?activeWords():typeof singularWords==='function'?singularWords():typeof WORDS!=='undefined'?WORDS:[]}catch(e){return []}}
  function ids(list){return (list||[]).map((w,i)=>w&&w.id?w.id:String(i)).filter(Boolean)}
  function markThemeDone(file,total){
    if(!file)return;
    const list=activeList();
    const allIds=ids(list);
    const count=Number(total||allIds.length||1);
    try{
      const s=localState();
      s.tasks=s.tasks||{};
      s.doneTasks=s.doneTasks||{};
      s.tasks[file]={done:allIds.length?allIds:[...Array(count).keys()].map(String),bad:[]};
      s.doneTasks[file]=true;
      saveLocalState(s);
    }catch(e){}
    try{if(typeof spTaskStateKey==='function')localStorage.setItem(spTaskStateKey(file),JSON.stringify({total:count,queue:[],done:[...Array(count).keys()],current:null,tries:0}))}catch(e){}
    try{window.SP_L3_TASK_DONE_QUEUE=[];if(typeof window.spL3RecordTaskDone==='function')window.spL3RecordTaskDone(file)}catch(e){}
  }
  window.done=function(file,total){markThemeDone(file,total)};
  const oldFinish=window.finishTask;
  if(typeof oldFinish==='function')window.finishTask=function(file){markThemeDone(file);try{oldFinish(file)}catch(e){}};
  function taskIsDone(file){try{return typeof taskPercent==='function'&&taskPercent(file)>=100}catch(e){return false}}
  function t1Done(){try{const tasks=TASKS.filter(t=>rel(t.file,'1'));return tasks.length===0||tasks.every(t=>taskIsDone(t.file))}catch(e){return false}}
  function t2Done(){try{if(typeof pctFor!=="function")return false;const defs=[['karteikarten.html',WORDS.length],['bild-wort.html',WORDS.length],['wort-bild.html',WORDS.length],['hoeren.html',WORDS.length],['artikel.html',WORDS.length],['drag-drop-artikel.html',WORDS.length],['plural.html',WORDS.length],['plural-drag-drop.html',WORDS.length],['memory.html',WORDS.length],['verpackungen.html',COMBOS.length],['preis-hoeren.html',PRICE_TASKS.length],['preis-schreiben.html',PRICE_TASKS.length],['preis-sprechen.html',PRICE_TASKS.length],['frage-und-antwort.html',COMBOS.length]].filter(d=>rel(d[0],'2'));return defs.every(d=>pctFor(d[0],d[1])>=100)}catch(e){return false}}
  window.spL3ExamUnlocked=function(){const t=currentTheme();if(t==='1')return t1Done();if(t==='2')return t2Done();return true};
  function lockExamPageIfNeeded(){
    if(!/pruefung\.html$/i.test(location.pathname))return;
    if(window.spL3ExamUnlocked())return;
    const target=document.getElementById('area')||document.querySelector('.card')||document.body;
    target.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><div class="question">Prüfung gesperrt</div><p class="small">Die Prüfung wird erst freigeschaltet, wenn alle freigegebenen Aufgaben in diesem Thema 100% erreicht haben.</p><div class="actions finish-actions"><a class="btn secondary" href="index.html">← Zurück zum Thema</a></div></div>';
  }
  function patchT1BatchProgression(){if(currentTheme()!=="1")return;if(typeof window.autoNextBatchIfReady!=="function"||window.autoNextBatchIfReady.__spL3ExamGate)return;window.autoNextBatchIfReady=function(){try{let s=load();const releasedTasks=TASKS.filter(t=>rel(t.file,'1'));const vocabFiles=releasedTasks.filter(t=>t.type==='vocab').map(t=>t.file);const allTasksDone=releasedTasks.every(t=>s.doneTasks&&s.doneTasks[t.file]);const examDone=!!(s.doneTasks&&s.doneTasks['pruefung.html']);let b=batchInfo();if(allTasksDone&&examDone&&b.end<b.total){s.batchIndex=(s.batchIndex||0)+1;[...vocabFiles,'pruefung.html'].forEach(f=>{if(s.tasks)delete s.tasks[f];if(s.doneTasks)delete s.doneTasks[f];});save(s);}}catch(e){console.warn('T1 Wortgruppe konnte nicht geprüft werden',e)}};window.autoNextBatchIfReady.__spL3ExamGate=true}
  function simplifyNav(){try{document.querySelectorAll('.nav a,.nav button').forEach(el=>{const t=String(el.textContent||'').trim();if(t.includes('Zurück')||t==='Übersicht')return;el.remove()})}catch(e){}}
  function normalizePrice(s){return String(s||"").toLowerCase().trim().replace(/€/g," euro ").replace(/[.]/g,",").replace(/\s+/g," ").replace(/[!?]/g,"").trim()}
  window.spL3AcceptPrice=function(ans,price){const a=normalizePrice(ans);const p=String(price||"").replace("€","").trim();const parts=p.split(",");const e=parseInt(parts[0]||"0",10);const c=parseInt((parts[1]||"00").padEnd(2,"0"),10);const list=[p,`${p} euro`,`${e},${String(c).padStart(2,"0")}`,`${e} euro ${c}`,`${e} euro ${c} cent`,`${e} ${c}`];if(e===0){list.push(`${c} cent`,`null euro ${c}`)}return list.map(normalizePrice).some(x=>a===x||a.includes(x))};
  window.priceVariants=function(price){return [String(price||"")]};
  window.acceptablePriceSentence=function(ans,price){const a=String(ans||"").toLowerCase();return (a.includes("kostet")||a.includes("macht")||a.includes("preis"))&&window.spL3AcceptPrice(ans,price)};
  window.startMic=function(btn,callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const status=document.getElementById("micStatus");if(!SR){if(status)status.textContent="Mikrofon wird auf diesem Gerät/Browser nicht unterstützt. Bitte schreibe oder nutze den Ersatz-Button.";return;}try{const rec=new SR();rec.lang="de-DE";rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=1;if(btn)btn.classList.add("active");if(status)status.textContent="Ich höre zu …";rec.onresult=e=>{const txt=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:"";if(status)status.textContent="Gehört: "+txt;if(callback)callback(txt,"result")};rec.onerror=e=>{if(status)status.textContent="Mikrofon hat nicht funktioniert. Bitte schreibe oder nutze den Ersatz-Button."};rec.onend=()=>{if(btn)btn.classList.remove("active")};rec.start();}catch(e){if(status)status.textContent="Mikrofon konnte nicht gestartet werden. Bitte schreibe oder nutze den Ersatz-Button.";}};
  patchT1BatchProgression();lockExamPageIfNeeded();simplifyNav();document.addEventListener('DOMContentLoaded',()=>{patchT1BatchProgression();lockExamPageIfNeeded();simplifyNav()});setTimeout(()=>{patchT1BatchProgression();lockExamPageIfNeeded();simplifyNav()},250);setTimeout(()=>{if(window.SprachPilotRelease)SprachPilotRelease.refresh().then(lockExamPageIfNeeded)},750);
})();