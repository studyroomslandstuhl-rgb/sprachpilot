(function(){
  const MODE_KEY='SP_L4_T3_COLOR_MODE_V1';
  const BASE_IDS=['rot','blau','gruen','gelb','orange','weiss','schwarz','grau','braun','rosa','lila','tuerkis'];
  const ADVANCED_IDS=COLORS.filter(c=>!BASE_IDS.includes(c.id)).map(c=>c.id);
  const COMBINATION_FILE='farben-kombinieren.html';
  const COLOR_TASKS=new Set(['karteikarten.html','hoeren.html','farben.html','gefallen.html',COMBINATION_FILE,'saetze-bauen.html','schreiben.html']);
  const originalTaskKey=window.taskKey;
  const originalGetTotal=window.getTotal;

  function queryMode(){
    try{
      const value=new URLSearchParams(location.search).get('colors');
      return value==='basis'||value==='advanced'?value:null;
    }catch(e){return null}
  }
  function mode(){
    const fromUrl=queryMode();
    if(fromUrl){
      try{localStorage.setItem(MODE_KEY,fromUrl)}catch(e){}
      return fromUrl;
    }
    const value=localStorage.getItem(MODE_KEY);
    return value==='advanced'?'advanced':'basis';
  }
  function label(){return mode()==='advanced'?'Hell- und Dunkelfarben':'Basisfarben'}
  function setMode(value){
    const next=value==='advanced'?'advanced':'basis';
    localStorage.setItem(MODE_KEY,next);
    const url=new URL(location.href);
    url.searchParams.set('colors',next);
    url.searchParams.set('v','l4t3-color-split2');
    location.href=url.pathname+url.search;
  }
  function activeIds(){return mode()==='advanced'?ADVANCED_IDS:BASE_IDS}
  function activeColors(){
    const ids=new Set(activeIds());
    return COLORS.filter(c=>ids.has(c.id));
  }
  function activeColorIds(){return new Set(activeIds())}
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
  function containsWord(value,words){
    const text=' '+normalized(value).replace(/[^a-z0-9]+/g,' ')+' ';
    return words.some(word=>text.includes(' '+normalized(word)+' '));
  }
  function advancedWords(){return COLORS.filter(c=>ADVANCED_IDS.includes(c.id)).map(c=>c.word)}
  function baseWords(){return COLORS.filter(c=>BASE_IDS.includes(c.id)).map(c=>c.word)}
  function usesAdvancedColor(value){return containsWord(value,advancedWords())}
  function usesBaseColor(value){return containsWord(value,baseWords())}
  function filterMixedTasks(tasks){
    return tasks.filter(task=>{
      const text=task.text||task.sentence||task.answer||'';
      if(mode()==='basis')return !usesAdvancedColor(text);
      return usesAdvancedColor(text)||!usesBaseColor(text);
    });
  }
  function activeWritingTasks(){return filterMixedTasks(WRITING)}
  function activeSentenceTasks(){return filterMixedTasks(SENTENCES)}
  function activeGefallenTasks(){
    const ids=activeColorIds();
    const allColorIds=new Set(COLORS.map(c=>c.id));
    return GEFAELLEN_TASKS.filter(task=>!allColorIds.has(task.adj)||ids.has(task.adj));
  }
  function combinationTasks(){
    return COLORS.filter(color=>ADVANCED_IDS.includes(color.id)).map(color=>{
      const modifier=color.id.startsWith('hell')?'hell':'dunkel';
      const baseId=color.id.slice(modifier.length);
      const base=COLORS.find(item=>item.id===baseId&&BASE_IDS.includes(item.id));
      const modifierItem=ADJECTIVES.find(item=>item.id===modifier);
      return base&&modifierItem?{id:color.id,answer:color.word,result:color,base,modifier,modifierItem}:null;
    }).filter(Boolean);
  }
  function activeCombinationTasks(){return mode()==='basis'?combinationTasks():[]}
  function visual(c,cls='task-img'){
    if(!c)return '';
    const border=c.id==='weiss'?'border-color:#94a3b8;':'';
    return `<div class="color-visual ${cls}" style="background:${c.hex};${border}" role="img" aria-label="Farbbild"></div>`;
  }
  function activeTaskFiles(){
    const files=(typeof TASK_FILES!=='undefined'&&Array.isArray(TASK_FILES))?TASK_FILES.filter(file=>file!==COMBINATION_FILE):[];
    if(mode()==='basis'){
      const index=files.indexOf('gefallen.html');
      files.splice(index>=0?index+1:files.length,0,COMBINATION_FILE);
    }
    return files;
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
    if(file==='gefallen.html')return activeGefallenTasks().length;
    if(file===COMBINATION_FILE)return activeCombinationTasks().length;
    if(file==='saetze-bauen.html')return activeSentenceTasks().length;
    if(file==='schreiben.html')return activeWritingTasks().length;
    return typeof originalGetTotal==='function'?originalGetTotal(file):1;
  };
  window.taskDoneCount=function(){return activeTaskFiles().filter(file=>pct(file,getTotal(file))>=100).length};
  window.allPrereqComplete=function(){return activeTaskFiles().every(file=>pct(file,getTotal(file))>=100)};

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
    const names=activeColors().map(c=>c.word).join(' · ');
    return `<section class="card color-mode-card"><div><h2>Welche Farben möchtest du üben?</h2><p class="small"><b>Basisfarben:</b> nur 12 Grundfarben. <b>Hell-/Dunkelfarben:</b> nur 20 zusammengesetzte Farben. Adjektive und Reaktionen bleiben in beiden Stufen.</p></div><div class="color-mode-buttons"><button type="button" class="btn color-mode-btn ${current==='basis'?'active':''}" onclick="L4T3ColorMode.setMode('basis')">Basisfarben · 12</button><button type="button" class="btn secondary color-mode-btn ${current==='advanced'?'active':''}" onclick="L4T3ColorMode.setMode('advanced')">Hell-/Dunkelfarben · 20</button></div><div class="color-mode-count">Aktiv: <b>${label()}</b> · ${activeColors().length} Farben</div><div class="small" style="margin-top:8px">${safe(names)}</div></section>`;
  }

  window.L4T3ColorMode={mode,label,setMode,activeColors,activeCards,activeHearingTasks,activeWritingTasks,activeSentenceTasks,activeGefallenTasks,activeCombinationTasks,activeTaskFiles,usesAdvancedColor,usesBaseColor,visual,selectorHtml,baseIds:BASE_IDS.slice(),advancedIds:ADVANCED_IDS.slice(),combinationFile:COMBINATION_FILE};
})();
