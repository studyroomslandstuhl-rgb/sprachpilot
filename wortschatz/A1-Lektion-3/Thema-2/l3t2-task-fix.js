(function(){
  if(window.__L3T2_TASK_FIX_V3)return;
  window.__L3T2_TASK_FIX_V3=true;

  function stateKey(file){return typeof window.spTaskStateKey==='function'?window.spTaskStateKey(file):'SP_TASK_STATE_'+file}
  function loadState(file,total){
    try{
      const st=JSON.parse(localStorage.getItem(stateKey(file))||'null');
      if(st&&Array.isArray(st.queue)&&Array.isArray(st.done)&&st.total===total){
        if(st.hadWrong===undefined)st.hadWrong=false;
        return st;
      }
    }catch(e){}
    const queue=[...Array(total).keys()].sort(()=>Math.random()-.5);
    return {total,queue,done:[],current:null,tries:0,hadWrong:false};
  }
  function saveState(file,state){try{localStorage.setItem(stateKey(file),JSON.stringify(state))}catch(e){}}
  function requeueCurrent(st){
    if(st.current===null||st.current===undefined)return;
    if(st.done.includes(st.current))return;
    if(!st.queue.includes(st.current))st.queue.push(st.current);
  }
  function patch(){
    window.spMarkWrong=function(file,total){
      const st=loadState(file,total);
      st.tries=(Number(st.tries)||0)+1;
      st.hadWrong=true;
      saveState(file,st);
      return st.tries;
    };
    window.spMarkRight=function(file,total){
      const st=loadState(file,total);
      if(st.current!==null&&st.current!==undefined){
        if(st.hadWrong||Number(st.tries)>0){
          requeueCurrent(st);
        }else if(!st.done.includes(st.current)){
          st.done.push(st.current);
        }
      }
      st.current=null;
      st.tries=0;
      st.hadWrong=false;
      saveState(file,st);
      return st.done.length>=total;
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
      const openWrite=function(){try{if(typeof window.writeBox==='function')window.writeBox()}catch(e){}};
      if(!SR){if(status)status.textContent='Mikrofon wird hier nicht unterstützt. Bitte schreibe.';openWrite();return null}
      let rec;
      try{rec=new SR()}catch(e){if(status)status.textContent='Mikrofon konnte nicht gestartet werden. Bitte schreibe.';openWrite();return null}
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
        if(!txt)openWrite();
      };
      rec.onerror=function(e){
        const msg=e&&e.error==='not-allowed'?'Mikrofon ist im Browser blockiert. Bitte erlaube das Mikrofon oder schreibe.':'Mikrofon hat nicht funktioniert. Bitte schreibe.';
        if(status)status.textContent=msg;
        openWrite();
      };
      rec.onend=function(){if(btn)btn.classList.remove('active')};
      try{rec.start()}catch(e){if(status)status.textContent='Mikrofon konnte nicht gestartet werden. Bitte schreibe.';openWrite()}
      return rec;
    };
  }
  patch();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);
  setTimeout(patch,100);
  setTimeout(patch,600);
})();