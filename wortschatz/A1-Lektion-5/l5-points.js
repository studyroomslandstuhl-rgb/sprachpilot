(function(){
  if(window.__SP_L5_POINTS_READY_V5)return;
  window.__SP_L5_POINTS_READY_V5=true;
  window.__SP_L5_POINTS_READY=true;
  if(!window.__SP_L5_BUNNY_AUDIO_ALL3&&!document.querySelector('script[data-sp-l5-bunny]')){const audioScript=document.createElement('script');audioScript.src='/wortschatz/A1-Lektion-5/l5-bunny-words.js?v=l5-bunny-all3';audioScript.dataset.spL5Bunny='1';document.head.appendChild(audioScript)}
  const cfg=window.SP_L5_THEME||{};
  const theme=String((cfg.id||'Thema-1').match(/\d+/)?.[0]||'1');
  const themeKey=cfg.key||`SP_L5_T${theme}_V1`;
  const topicTitle=cfg.sub||cfg.title||`A1 Lektion 5 · Thema ${theme}`;
  const TASK_TITLES={
    'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung',
    'hoeren.html':'Hören','sehen-schreiben.html':'Sehen → Schreiben','sprechen.html':'Sprechen','formell-informell.html':'formell ↔ informell','frage-antwort.html':'Frage / Antwort','schon-erst.html':'schon / erst','artikel.html':'Artikel der Zeitwörter','plural.html':'Plural der Zeitwörter',
    'sortieren.html':'Gruppen','um-am.html':'Präpositionen','hoeren-waehlen.html':'Hören','saetze-bauen.html':'Sätze bauen','plan-lesen.html':'Plan lesen','dialoge.html':'Dialoge','schreiben.html':'Schreiben'
  };
  let progressLoading=false;
  let syncTimer=null;
  let flushPromise=null;
  const pending=new Map();
  const queuedSignatures=new Map();
  function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
  function topicId(){return cleanId(['wortschatz','A1','lektion','5','thema',theme].join('_'))}
  function loadProgress(){
    if(window.SPProgress||progressLoading)return;
    progressLoading=true;
    import('/js/progress.js?v=point-audit1').catch(error=>console.warn('SPProgress konnte nicht geladen werden',error)).finally(()=>{progressLoading=false});
  }
  function payload(file,percent,total,done){return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme,topicId:topicId(),title:topicTitle,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace('.html',''),percent:Math.max(0,Math.min(100,Math.round(Number(percent)||0))),completed:Number(percent)>=100,total:Number(total||0),done:Number(done||0),countAttempt:false}}
  function stateKey(file){return themeKey+'_'+file}
  function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
  function stateFor(file){return parse(localStorage.getItem(stateKey(file)))}
  function doneCount(st){return Array.isArray(st&&st.done)?st.done.length:0}
  function totalCount(st){return Number(st&&st.total||0)}
  function percent(st){const total=totalCount(st);return total?Math.round(doneCount(st)/total*100):0}
  function sig(file,st){return [file,percent(st),doneCount(st),totalCount(st)].join(':')}
  function sigKey(file){return `SP_L5_POINTS_SIG_V2_${topicId()}_${file}`}
  function committedSig(file){return localStorage.getItem(sigKey(file))||sessionStorage.getItem(sigKey(file))||''}
  function shouldQueue(file,st){
    const pct=percent(st),total=totalCount(st);if(!total||pct<=0)return false;
    const s=sig(file,st),key=file==='pruefung.html'?'recordExamResult:'+file:'recordTaskProgress:'+file;
    if(committedSig(file)===s)return false;
    if(queuedSignatures.get(key)===s)return false;
    queuedSignatures.set(key,s);return true;
  }
  function commit(item){try{localStorage.setItem(item.sigKey,item.sig);sessionStorage.setItem(item.sigKey,item.sig)}catch(e){}queuedSignatures.delete(item.key)}
  function queue(method,p,st){
    const file=p.file,key=method+':'+file,item={key,method,payload:p,sig:sig(file,st),sigKey:sigKey(file)};
    pending.set(key,item);
    clearTimeout(syncTimer);
    syncTimer=setTimeout(()=>flush(),p.completed?80:650);
  }
  async function waitForProgress(){
    if(window.SPProgress)return window.SPProgress;loadProgress();
    for(let i=0;i<50;i++){if(window.SPProgress)return window.SPProgress;await new Promise(resolve=>setTimeout(resolve,120))}
    return null;
  }
  async function flush(){
    if(flushPromise)return flushPromise;
    if(!pending.size)return null;
    const items=[...pending.values()];pending.clear();
    flushPromise=(async()=>{
      const api=await waitForProgress();
      if(!api){items.forEach(item=>pending.set(item.key,item));return null}
      let failed=0;
      for(const item of items){
        try{
          const fn=api[item.method];
          if(typeof fn!=='function')throw new Error(item.method+' fehlt');
          const result=await fn(item.payload);
          if(result===null||result===undefined)throw new Error('Fortschritt wurde nicht bestätigt');
          commit(item);
        }catch(error){
          failed++;pending.set(item.key,item);console.warn('L5-Fortschritt konnte noch nicht synchronisiert werden',item.payload.file,error);
        }
      }
      if(failed){clearTimeout(syncTimer);syncTimer=setTimeout(()=>flush(),1800)}
      return {ok:failed===0,failed};
    })().finally(()=>{flushPromise=null});
    return flushPromise;
  }
  function syncTask(file,st){if(!shouldQueue(file,st))return;const pct=percent(st),total=totalCount(st),done=doneCount(st);queue('recordTaskProgress',payload(file,pct,total,done),st)}
  function syncExam(file,st){if(!shouldQueue(file,st))return;const total=totalCount(st),done=doneCount(st),pct=percent(st),p=payload(file,pct,total,done);p.scorePercent=pct;p.score=pct;p.stars=pct>=100?3:pct>=70?2:pct>=50?1:0;queue('recordExamResult',p,st)}
  function syncFile(file,st){if(!st)return;if(file==='pruefung.html')syncExam(file,st);else syncTask(file,st)}
  function resyncStoredStates(){
    try{
      const prefix=themeKey+'_';
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);if(!key||!key.startsWith(prefix))continue;
        const file=key.slice(prefix.length);if(!/\.html$/i.test(file))continue;
        const st=parse(localStorage.getItem(key));if(!st||!Array.isArray(st.done)||!Number(st.total))continue;
        syncFile(file,st);
      }
      if(pending.size)flush();
    }catch(error){console.warn('L5-Nachsynchronisierung fehlgeschlagen',error)}
  }
  const oldSave=window.saveTask;
  if(typeof oldSave==='function')window.saveTask=function(file,st){oldSave(file,st);try{syncFile(file,st)}catch(e){console.warn('L5 save sync',e)}};
  const oldMark=window.markTaskDone;
  window.markTaskDone=function(file,total){
    if(typeof oldMark==='function'&&oldMark!==window.markTaskDone){oldMark(file,total)}else{const st={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false};if(typeof window.saveTask==='function')window.saveTask(file,st);else localStorage.setItem(stateKey(file),JSON.stringify(st))}
    syncFile(file,stateFor(file));
  };
  window.syncExam=function(result){
    const pct=Math.max(0,Math.min(100,Math.round(Number(result&&result.percent)||0))),total=Number(result&&result.maxScore||result&&result.total||100),done=Math.round(total*pct/100),p=payload('pruefung.html',pct,total,done),st={total,done:[...Array(done).keys()]};
    p.score=Number(result&&result.score||done);p.maxScore=total;p.scorePercent=pct;p.stars=Number(result&&result.stars||(pct>=100?3:pct>=70?2:pct>=50?1:0));
    if(shouldQueue('pruefung.html',st))queue('recordExamResult',p,st);
  };
  window.SP_L5_POINTS_FLUSH=flush;
  window.SP_L5_POINTS_RESYNC=resyncStoredStates;
  window.addEventListener('pageshow',()=>setTimeout(resyncStoredStates,250));
  window.addEventListener('online',()=>setTimeout(resyncStoredStates,150));
  window.addEventListener('SP_ACCOUNT_PROGRESS_READY',()=>setTimeout(resyncStoredStates,100));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&pending.size)flush()});
  window.addEventListener('pagehide',()=>{if(pending.size)flush()});
  setTimeout(resyncStoredStates,500);
})();