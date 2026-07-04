(function(){
  if(window.__SP_L5_POINTS_READY)return;
  window.__SP_L5_POINTS_READY=true;
  const cfg=window.SP_L5_THEME||{};
  const theme=String((cfg.id||'Thema-1').match(/\d+/)?.[0]||'1');
  const themeKey=cfg.key||`SP_L5_T${theme}_V1`;
  const topicTitle=cfg.sub||cfg.title||`A1 Lektion 5 · Thema ${theme}`;
  const TASK_TITLES={
    'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung',
    'hoeren.html':'Hören','sehen-schreiben.html':'Sehen → Schreiben','sprechen.html':'Sprechen','formell-informell.html':'formell ↔ informell','frage-antwort.html':'Frage / Antwort','schon-erst.html':'schon / erst','artikel.html':'Artikel der Zeitwörter','plural.html':'Plural der Zeitwörter'
  };
  function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
  function topicId(){return cleanId(['wortschatz','A1','lektion','5','thema',theme].join('_'))}
  function loadProgress(){if(window.__spL5ProgressLoading)return;window.__spL5ProgressLoading=true;const s=document.createElement('script');s.type='module';s.src='/js/progress.js?v=6';document.head.appendChild(s)}
  function queue(method,payload){if(window.SPProgress&&typeof window.SPProgress[method]==='function'){try{window.SPProgress[method](payload)}catch(e){console.warn('SPProgress',e)}return;}window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method,payload});loadProgress()}
  function payload(file,percent,total,done){return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme,topicId:topicId(),title:topicTitle,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace('.html',''),percent:Math.max(0,Math.min(100,Math.round(Number(percent)||0))),completed:Number(percent)>=100,total:Number(total||0),done:Number(done||0),countAttempt:false}}
  function stateKey(file){return themeKey+'_'+file}
  function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
  function stateFor(file){return parse(localStorage.getItem(stateKey(file)))}
  function doneCount(st){return Array.isArray(st&&st.done)?st.done.length:0}
  function totalCount(st){return Number(st&&st.total||0)}
  function percent(st){const total=totalCount(st);return total?Math.round(doneCount(st)/total*100):0}
  function marker(kind,file,pct){return `SP_L5_POINTS_SYNC_${topicId()}_${kind}_${file}_${pct}`}
  function syncTask(file,st){const pct=percent(st),total=totalCount(st),done=doneCount(st);if(!total||pct<=0)return;queue('recordTaskProgress',payload(file,pct,total,done))}
  function syncExam(file,st){const total=totalCount(st),done=doneCount(st);if(!total||done<=0)return;const pct=percent(st);const p=payload(file,pct,total,done);p.scorePercent=pct;p.score=pct;p.stars=pct>=100?3:pct>=70?2:pct>=50?1:0;queue('recordExamResult',p);queue('recordTaskProgress',p)}
  function syncFile(file,st){if(!st)return;if(file==='pruefung.html')syncExam(file,st);else syncTask(file,st)}
  function scan(){try{const prefix=themeKey+'_';Object.keys(localStorage).forEach(k=>{if(!k.startsWith(prefix)||!k.endsWith('.html'))return;const file=k.slice(prefix.length);syncFile(file,parse(localStorage.getItem(k)))})}catch(e){}}
  const oldSave=window.saveTask;
  if(typeof oldSave==='function'){window.saveTask=function(file,st){oldSave(file,st);try{syncFile(file,st)}catch(e){}}}
  const oldMark=window.markTaskDone;
  window.markTaskDone=function(file,total){if(typeof oldMark==='function'&&oldMark!==window.markTaskDone){oldMark(file,total)}else{const st={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false};if(typeof window.saveTask==='function')window.saveTask(file,st);else localStorage.setItem(stateKey(file),JSON.stringify(st))}syncFile(file,stateFor(file))};
  window.syncExam=function(result){const pct=Math.max(0,Math.min(100,Math.round(Number(result&&result.percent)||0)));const total=Number(result&&result.maxScore||result&&result.total||100);const done=Math.round(total*pct/100);const p=payload('pruefung.html',pct,total,done);p.score=Number(result&&result.score||done);p.maxScore=total;p.scorePercent=pct;p.stars=Number(result&&result.stars||(pct>=100?3:pct>=70?2:pct>=50?1:0));queue('recordExamResult',p);queue('recordTaskProgress',p)};
  loadProgress();scan();setTimeout(scan,400);setTimeout(scan,1500);setTimeout(scan,4000);setInterval(scan,5000);
})();