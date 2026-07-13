(function(){
  if(window.__L3T2_TASK_FIX_V2)return;
  window.__L3T2_TASK_FIX_V2=true;

  function stateKey(file){return typeof window.spTaskStateKey==='function'?window.spTaskStateKey(file):'SP_TASK_STATE_'+file}
  function loadState(file,total){
    try{
      const st=JSON.parse(localStorage.getItem(stateKey(file))||'null');
      if(st&&Array.isArray(st.queue)&&Array.isArray(st.done)&&st.total===total)return st;
    }catch(e){}
    const queue=[...Array(total).keys()].sort(()=>Math.random()-.5);
    return {total,queue,done:[],current:null,tries:0};
  }
  function saveState(file,state){try{localStorage.setItem(stateKey(file),JSON.stringify(state))}catch(e){}}
  function patch(){
    window.spMarkWrong=function(file,total){
      const st=loadState(file,total);
      st.tries=(Number(st.tries)||0)+1;
      saveState(file,st);
      return st.tries;
    };
    window.spFeedbackForTry=function(tries,solution,type){
      if(tries===1)return 'Da ist noch ein Fehler.';
      if(tries===2)return 'Tipp: Prüfe '+(type||'Form und Schreibweise')+'.';
      return 'Lösung: '+solution;
    };
    if(typeof window.spSpeakPriceSentence==='function'&&!window.spSpeakPriceSentence.__l3t2Fixed){
      const old=window.spSpeakPriceSentence;
      const fixed=function(t){
        return old(t).replace('300 Gramm Fleisch kostet','300 Gramm Fleisch kosten').replace('500 Gramm Fisch kostet','500 Gramm Fisch kosten');
      };
      fixed.__l3t2Fixed=true;
      window.spSpeakPriceSentence=fixed;
    }
    window.startMic=function(btn,callback){
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      const status=document.getElementById('micStatus');
      if(!SR){if(status)status.textContent='Mikrofon wird hier nicht unterstützt. Bitte schreibe.';return null}
      let rec;
      try{rec=new SR()}catch(e){if(status)status.textContent='Mikrofon konnte nicht gestartet werden. Bitte schreibe.';return null}
      rec.lang='de-DE';
      rec.interimResults=false;
      rec.continuous=false;
      rec.maxAlternatives=3;
      if(btn)btn.classList.add('active');
      if(status)status.textContent='Ich höre zu ...';
      rec.onresult=function(e){
        const txt=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:'';
        if(status)status.textContent=txt?'Gehört: '+txt:'Ich konnte nichts erkennen.';
        if(txt&&typeof callback==='function')callback(txt);
      };
      rec.onerror=function(){if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe.'};
      rec.onend=function(){if(btn)btn.classList.remove('active')};
      try{rec.start()}catch(e){if(status)status.textContent='Mikrofon konnte nicht gestartet werden. Bitte schreibe.'}
      return rec;
    };
  }
  patch();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);
  setTimeout(patch,100);
  setTimeout(patch,600);
})();