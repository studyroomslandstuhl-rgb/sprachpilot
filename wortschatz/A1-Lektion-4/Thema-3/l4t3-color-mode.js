(function(){
  const MODE_KEY='SP_L4_T3_COLOR_MODE_V1';
  const BASE_IDS=['rot','blau','gruen','gelb','orange','weiss','schwarz','grau','braun','rosa','lila','tuerkis'];
  const COLOR_TASKS=new Set(['karteikarten.html','hoeren.html','farben.html','saetze-bauen.html','schreiben.html']);
  const originalTaskKey=window.taskKey;
  const originalGetTotal=window.getTotal;

  function mode(){
    const value=localStorage.getItem(MODE_KEY);
    return value==='advanced'?'advanced':'basis';
  }
  function label(){return mode()==='advanced'?'Farben Fortgeschritten':'Farben Basis'}
  function setMode(value){
    localStorage.setItem(MODE_KEY,value==='advanced'?'advanced':'basis');
    location.reload();
  }
  function activeColors(){
    return mode()==='advanced'?COLORS.slice():COLORS.filter(c=>BASE_IDS.includes(c.id));
  }
  function activeColorIds(){return new Set(activeColors().map(c=>c.id))}
  function activeCards(){
    const ids=activeColorIds();
    return CARDS.filter(card=>card.type!=='color'||ids.has(card.id));
  }
  function activeHearingTasks(){
    const ids=activeColorIds();
    return HEARING_TASKS.filter(task=>ids.has(task.color));
  }
  function normalized(value){
    return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
  }
  function advancedWords(){
    return COLORS.filter(c=>!BASE_IDS.includes(c.id)).map(c=>normalized(c.word));
  }
  function usesAdvancedColor(value){
    const text=' '+normalized(value).replace(/[^a-z0-9]+/g,' ')+' ';
    return advancedWords().some(word=>text.includes(' '+word+' '));
  }
  function activeWritingTasks(){return mode()==='advanced'?WRITING.slice():WRITING.filter(t=>!usesAdvancedColor(t.text))}
  function activeSentenceTasks(){return mode()==='advanced'?SENTENCES.slice():SENTENCES.filter(t=>!usesAdvancedColor(t.text))}
  function visual(c,cls='task-img'){
    if(!c)return '';
    const border=c.id==='weiss'?'border-color:#94a3b8;':'';
    return `<div class="color-visual ${cls}" style="background:${c.hex};${border}" role="img" aria-label="${safe(c.word)}"></div>`;
  }

  if(typeof originalTaskKey==='function'){
    window.taskKey=function(file){
      const base=originalTaskKey(file);
      return COLOR_TASKS.has(file)?base+'_'+mode():base;
    };
    COLOR_TASKS.forEach(file=>{
      try{
        const oldKey=originalTaskKey(file),newKey=window.taskKey(file);
        if(!localStorage.getItem(newKey)&&localStorage.getItem(oldKey))localStorage.setItem(newKey,localStorage.getItem(oldKey));
      }catch(e){}
    });
  }

  window.getTotal=function(file){
    if(file==='karteikarten.html')return activeCards().length;
    if(file==='hoeren.html')return activeHearingTasks().length;
    if(file==='farben.html')return activeColors().length;
    if(file==='saetze-bauen.html')return activeSentenceTasks().length;
    if(file==='schreiben.html')return activeWritingTasks().length;
    return typeof originalGetTotal==='function'?originalGetTotal(file):1;
  };

  window.examUnlockKey=function(){return THEME.key+'_EXAM_UNLOCKED_'+mode()};
  window.examUnlocked=function(){
    if(allPrereqComplete())localStorage.setItem(examUnlockKey(),'1');
    return localStorage.getItem(examUnlockKey())==='1';
  };
  window.examHistory=function(){
    try{return JSON.parse(localStorage.getItem('SP_L4_T3_EXAM_HISTORY_V2_'+mode())||'[]')}catch(e){return[]}
  };
  window.bestExamResult=function(){
    const history=examHistory();
    if(!history.length)return null;
    return history.reduce((best,item)=>Number(item.percent||0)>Number(best.percent||0)?item:best,history[0]);
  };

  function selectorHtml(){
    const current=mode();
    return `<section class="card color-mode-card"><div><h2>Farben-Wortschatz</h2><p class="small">Basis = Farben aus dem Buch. Fortgeschritten = Basis plus hell- und dunkel-Farben.</p></div><div class="color-mode-buttons"><button type="button" class="btn color-mode-btn ${current==='basis'?'active':''}" onclick="L4T3ColorMode.setMode('basis')">Farben Basis</button><button type="button" class="btn secondary color-mode-btn ${current==='advanced'?'active':''}" onclick="L4T3ColorMode.setMode('advanced')">Farben Fortgeschritten</button></div><div class="color-mode-count">Aktiv: <b>${label()}</b> · ${activeColors().length} Farben</div></section>`;
  }

  window.L4T3ColorMode={mode,label,setMode,activeColors,activeCards,activeHearingTasks,activeWritingTasks,activeSentenceTasks,usesAdvancedColor,visual,selectorHtml,baseIds:BASE_IDS.slice()};
})();