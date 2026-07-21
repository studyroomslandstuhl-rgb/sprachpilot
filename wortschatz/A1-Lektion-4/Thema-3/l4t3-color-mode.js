(function(){
  const MODE_KEY='SP_L4_T3_COLOR_MODE_V1';
  const BASE_IDS=['rot','blau','gruen','gelb','orange','weiss','schwarz','grau','braun','rosa','lila','tuerkis'];
  const EXTRA_IDS=COLORS.filter(c=>!BASE_IDS.includes(c.id)).map(c=>c.id);
  const ALL_IDS=COLORS.map(c=>c.id);
  const HEARING_EXTRAS=[{color:'weiss',item:'sofa'},{color:'schwarz',item:'fernseher'}];
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
  function label(){return mode()==='advanced'?'Alle Farben':'Basisfarben'}
  function setMode(value){
    const next=value==='advanced'?'advanced':'basis';
    localStorage.setItem(MODE_KEY,next);
    const url=new URL(location.href);
    url.searchParams.set('colors',next);
    url.searchParams.set('v','l4t3-hearing-bunny1');
    location.href=url.pathname+url.search;
  }
  function activeIds(){return mode()==='advanced'?ALL_IDS:BASE_IDS}
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
    const tasks=HEARING_TASKS.filter(task=>ids.has(task.color));
    const existing=new Set(tasks.map(task=>task.color+'|'+task.item));
    HEARING_EXTRAS.forEach(task=>{
      const key=task.color+'|'+task.item;
      if(ids.has(task.color)&&!existing.has(key)){tasks.push({...task});existing.add(key)}
    });
    return tasks;
  }
  function normalized(value){
    return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
  }
  function containsWord(value,words){
    const text=' '+normalized(value).replace(/[^a-z0-9]+/g,' ')+' ';
    return words.some(word=>text.includes(' '+normalized(word)+' '));
  }
  function extraWords(){return COLORS.filter(c=>EXTRA_IDS.includes(c.id)).map(c=>c.word)}
  function usesAdvancedColor(value){return containsWord(value,extraWords())}
  function activeWritingTasks(){return mode()==='advanced'?WRITING.slice():WRITING.filter(task=>!usesAdvancedColor(task.text))}
  function activeSentenceTasks(){return mode()==='advanced'?SENTENCES.slice():SENTENCES.filter(task=>!usesAdvancedColor(task.text))}
  function activeGefallenTasks(){
    if(mode()==='advanced')return GEFAELLEN_TASKS.slice();
    const extra=new Set(EXTRA_IDS);
    return GEFAELLEN_TASKS.filter(task=>!extra.has(task.adj));
  }
  function combinationTasks(){
    return COLORS.filter(color=>EXTRA_IDS.includes(color.id)).map(color=>{
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
    return `<section class="card color-mode-card"><div><h2>Welche Farben möchtest du üben?</h2><p class="small"><b>Basisfarben:</b> nur 12 Grundfarben. <b>Alle Farben:</b> die 12 Grundfarben plus 20 Hell-/Dunkelfarben. Adjektive und Reaktionen bleiben in beiden Stufen.</p></div><div class="color-mode-buttons"><button type="button" class="btn color-mode-btn ${current==='basis'?'active':''}" onclick="L4T3ColorMode.setMode('basis')">Basisfarben · 12</button><button type="button" class="btn secondary color-mode-btn ${current==='advanced'?'active':''}" onclick="L4T3ColorMode.setMode('advanced')">Alle Farben · 32</button></div><div class="color-mode-count">Aktiv: <b>${label()}</b> · ${activeColors().length} Farben</div><div class="small" style="margin-top:8px">${safe(names)}</div></section>`;
  }

  window.L4T3ColorMode={mode,label,setMode,activeColors,activeCards,activeHearingTasks,activeWritingTasks,activeSentenceTasks,activeGefallenTasks,activeCombinationTasks,activeTaskFiles,usesAdvancedColor,visual,selectorHtml,baseIds:BASE_IDS.slice(),extraIds:EXTRA_IDS.slice(),combinationFile:COMBINATION_FILE};
})();