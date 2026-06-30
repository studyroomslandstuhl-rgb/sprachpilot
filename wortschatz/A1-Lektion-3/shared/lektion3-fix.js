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
})();
