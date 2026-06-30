(function(){
  function profile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"{}")}catch(e){return {}}}
  function queueTaskDone(file){
    if(!file)return;
    if(typeof window.spL3RecordTaskDone==="function")window.spL3RecordTaskDone(file);
    else{window.SP_L3_TASK_DONE_QUEUE=window.SP_L3_TASK_DONE_QUEUE||[];window.SP_L3_TASK_DONE_QUEUE.push(file);}
  }
  function preferredLang(){
    try{
      const p=profile();
      const visible=p.muttersprache||p.motherLanguage||localStorage.getItem("muttersprache")||"Russisch";
      const code=localStorage.getItem("SP_MOTHER_LANGUAGE_CODE")||localStorage.getItem("motherLanguage")||"";
      const map={sq:"Albanisch",am:"Amharisch",ar:"Arabisch",hy:"Armenisch",az:"Aserbaidschanisch",bn:"Bengalisch",bs:"Bosnisch",bg:"Bulgarisch",zh:"Chinesisch",fa:"Farsi/Persisch",prs:"Dari",de:"Deutsch",en:"Englisch",fr:"Französisch",ka:"Georgisch",el:"Griechisch",hi:"Hindi",it:"Italienisch",ja:"Japanisch",kk:"Kasachisch",hr:"Kroatisch",ku:"Kurdisch",ps:"Paschtu",pl:"Polnisch",pt:"Portugiesisch",ro:"Rumänisch",ru:"Russisch",sr:"Serbisch",so:"Somali",es:"Spanisch",ta:"Tamil",th:"Thai",ti:"Tigrinya",cs:"Tschechisch",tr:"Türkisch",uk:"Ukrainisch",hu:"Ungarisch",ur:"Urdu",uz:"Usbekisch",vi:"Vietnamesisch"};
      return map[String(code).toLowerCase()]||visible||"Russisch";
    }catch(e){return "Russisch"}
  }
  window.spL3PreferredLang=preferredLang;
  window.lang=preferredLang;

  window.done=function(file,total){
    try{
      total=total||((typeof WORDS!=="undefined"&&WORDS.length)||1);
      const st={total,queue:[],done:[...Array(total).keys()],current:null,tries:0};
      if(typeof spTaskStateKey==="function")localStorage.setItem(spTaskStateKey(file),JSON.stringify(st));
      else localStorage.setItem("SP_TASK_STATE_"+file,JSON.stringify(st));
      queueTaskDone(file);
    }catch(e){}
  };

  function normalizePrice(s){return String(s||"").toLowerCase().trim().replace(/€/g," euro ").replace(/[.]/g,",").replace(/\s+/g," ").replace(/[!?]/g,"").trim()}
  window.spL3AcceptPrice=function(ans,price){
    const a=normalizePrice(ans);
    const p=String(price||"").replace("€","").trim();
    const parts=p.split(",");
    const e=parseInt(parts[0]||"0",10);
    const c=parseInt((parts[1]||"00").padEnd(2,"0"),10);
    const list=[p,`${p} euro`,`${e},${String(c).padStart(2,"0")}`,`${e} euro ${c}`,`${e} euro ${c} cent`,`${e} ${c}`];
    if(e===0){list.push(`${c} cent`,`null euro ${c}`)}
    return list.map(normalizePrice).some(x=>a===x||a.includes(x));
  };
  window.priceVariants=function(price){return [String(price||"")];};
  window.acceptablePriceSentence=function(ans,price){
    const a=String(ans||"").toLowerCase();
    return (a.includes("kostet")||a.includes("macht")||a.includes("preis"))&&window.spL3AcceptPrice(ans,price);
  };

  window.startMic=function(btn,callback){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const status=document.getElementById("micStatus");
    if(!SR){
      if(status)status.textContent="Mikrofon wird auf diesem Gerät/Browser nicht unterstützt. Bitte schreibe oder nutze den Ersatz-Button.";
      return;
    }
    try{
      const rec=new SR();
      rec.lang="de-DE";
      rec.interimResults=false;
      rec.continuous=false;
      rec.maxAlternatives=1;
      if(btn)btn.classList.add("active");
      if(status)status.textContent="Ich höre zu …";
      rec.onresult=e=>{
        const txt=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:"";
        if(status)status.textContent="Gehört: "+txt;
        if(callback)callback(txt,"result");
      };
      rec.onerror=e=>{if(status)status.textContent="Mikrofon hat nicht funktioniert. Bitte schreibe oder nutze den Ersatz-Button."};
      rec.onend=()=>{if(btn)btn.classList.remove("active")};
      rec.start();
    }catch(e){
      if(status)status.textContent="Mikrofon konnte nicht gestartet werden. Bitte schreibe oder nutze den Ersatz-Button.";
    }
  };

  function currentTheme(){const m=location.pathname.match(/A1-Lektion-3\/Thema-(\d+)/);return m?m[1]:""}
  function t1NonExamDone(){try{return Array.isArray(TASKS)&&TASKS.every(t=>typeof taskPercent==="function"&&taskPercent(t.file)>=100)}catch(e){return false}}
  function t2NonExamDone(){
    try{
      if(typeof pctFor!=="function")return false;
      const defs=[
        ['karteikarten.html',WORDS.length],['bild-wort.html',WORDS.length],['wort-bild.html',WORDS.length],['hoeren.html',WORDS.length],['artikel.html',WORDS.length],['drag-drop-artikel.html',WORDS.length],['plural.html',WORDS.length],['plural-drag-drop.html',WORDS.length],['memory.html',WORDS.length],['verpackungen.html',COMBOS.length],['preis-hoeren.html',PRICE_TASKS.length],['preis-schreiben.html',PRICE_TASKS.length],['preis-sprechen.html',PRICE_TASKS.length],['frage-und-antwort.html',COMBOS.length]
      ];
      return defs.every(d=>pctFor(d[0],d[1])>=100);
    }catch(e){return false}
  }
  window.spL3ExamUnlocked=function(){const t=currentTheme();if(t==="1")return t1NonExamDone();if(t==="2")return t2NonExamDone();return true};
  function lockExamPageIfNeeded(){
    if(!/pruefung\.html$/i.test(location.pathname))return;
    if(window.spL3ExamUnlocked())return;
    const target=document.getElementById("area")||document.querySelector(".card")||document.body;
    target.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><div class="question">Prüfung gesperrt</div><p class="small">Die Prüfung wird erst freigeschaltet, wenn alle Aufgaben in diesem Thema 100% erreicht haben.</p><div class="actions finish-actions"><a class="btn secondary" href="index.html">← Zurück zum Thema</a></div></div>';
  }
  function patchT1BatchProgression(){
    if(currentTheme()!=="1")return;
    if(typeof window.autoNextBatchIfReady!=="function"||window.autoNextBatchIfReady.__spL3ExamGate)return;
    window.autoNextBatchIfReady=function(){
      try{
        let s=load();
        const vocabFiles=TASKS.filter(t=>t.type==='vocab').map(t=>t.file);
        const allTasksDone=TASKS.every(t=>s.doneTasks&&s.doneTasks[t.file]);
        const examDone=!!(s.doneTasks&&s.doneTasks['pruefung.html']);
        let b=batchInfo();
        if(allTasksDone&&examDone&&b.end<b.total){
          s.batchIndex=(s.batchIndex||0)+1;
          [...vocabFiles,'pruefung.html'].forEach(f=>{if(s.tasks)delete s.tasks[f];if(s.doneTasks)delete s.doneTasks[f];});
          save(s);
        }
      }catch(e){console.warn('T1 Wortgruppe konnte nicht geprüft werden',e)}
    };
    window.autoNextBatchIfReady.__spL3ExamGate=true;
  }
  patchT1BatchProgression();
  lockExamPageIfNeeded();
  document.addEventListener('DOMContentLoaded',()=>{patchT1BatchProgression();lockExamPageIfNeeded();});
  setTimeout(()=>{patchT1BatchProgression();lockExamPageIfNeeded();},250);
})();
