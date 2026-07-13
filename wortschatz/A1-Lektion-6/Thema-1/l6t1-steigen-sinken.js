(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  const ADDED=[
    {id:'steigen',group:'Im Buch',type:'verb',article:'',word:'steigen',full:'steigen',sentence:'Die Temperatur steigt.',symbol:'📈',image:CDN+'steigen.webp',tr:{en:'to rise',ru:'повышаться',tr:'yükselmek',uk:'підвищуватися',ar:'يرتفع',ja:'上がる',ro:'a crește',pl:'rosnąć',ku:'bilind bûn'}},
    {id:'sinken',group:'Im Buch',type:'verb',article:'',word:'sinken',full:'sinken',sentence:'Die Temperatur sinkt.',symbol:'📉',image:CDN+'sinken.webp',tr:{en:'to fall',ru:'понижаться',tr:'düşmek',uk:'знижуватися',ar:'ينخفض',ja:'下がる',ro:'a scădea',pl:'spadać',ku:'daketin'}},
    {id:'bleiben',group:'Im Buch',type:'verb',article:'',word:'bleiben',full:'bleiben',sentence:'Auch morgen bleibt es warm.',symbol:'⏸️',tr:{en:'to remain',ru:'оставаться',tr:'kalmak',uk:'залишатися',ar:'يبقى',ja:'とどまる',ro:'a rămâne',pl:'zostać',ku:'mayîn'}}
  ];
  function ensureAdded(){
    try{
      if(!Array.isArray(window.BASE_WORDS))return;
      ADDED.forEach(w=>{
        const existing=BASE_WORDS.find(x=>x&&x.id===w.id);
        if(existing)Object.assign(existing,w);
        else BASE_WORDS.push({...w});
      });
    }catch(e){}
  }
  function unique(list){const seen=new Set();return (list||[]).filter(w=>w&&w.id&&!seen.has(w.id)&&seen.add(w.id))}
  ensureAdded();
  const oldWords=window.words;
  window.words=words=function(){
    ensureAdded();
    const list=typeof oldWords==='function'?oldWords():(BASE_WORDS||[]).concat((typeof extraOn==='function'&&extraOn())?EXTRA_WORDS:[]);
    return unique(list);
  };
  window.wordItems=wordItems=function(){return words()};
  window.nouns=nouns=function(){return words().filter(w=>w.type==='noun')};
  window.sentenceItems=sentenceItems=function(){return words().filter(w=>w.sentence&&!['wetter','grad'].includes(w.id)).map(w=>({w,sol:sentenceSolutions(w)}))};
  window.cardItems=cardItems=function(){return words().flatMap(w=>[{mode:w.type==='verb'?'verb':(w.type==='phrase'?'phrase':'noun'),w},{mode:'sentence',w}])};
  const oldTaskTotals=window.taskTotals;
  window.taskTotals=taskTotals=function(){
    const base=typeof oldTaskTotals==='function'?oldTaskTotals():[];
    return base.map(t=>{
      if(t[0]==='karteikarten.html')return [t[0],cardItems().length,t[2]];
      if(t[0]==='hoeren-schreiben.html')return [t[0],wordItems().length,t[2]];
      if(t[0]==='hoeren-bild.html')return [t[0],words().length,t[2]];
      if(t[0]==='nomen-satz-a.html'||t[0]==='nomen-satz-b.html')return [t[0],sentenceItems().length,t[2]];
      return t;
    });
  };
  const oldRenderOverview=window.renderOverview;
  window.renderOverview=renderOverview=function(target){
    ensureAdded();
    if(typeof oldRenderOverview==='function')return oldRenderOverview(target);
    if(!target)return;
    target.innerHTML=unique(BASE_WORDS).map(w=>`<div class="word-row"><div class="word-placeholder"><img class="weather-img" src="${w.image||CDN+w.id+'.webp'}" alt=""></div><div><b>${w.full||w.word}</b><br><span class="small">${w.sentence||''}</span><span class="tag">${w.type||''}</span></div></div>`).join('');
  };

  function repairTaskState(file,total){
    const max=Math.max(0,Math.floor(Number(total)||0));
    if(!max||typeof taskKey!=='function')return;
    try{
      const key=taskKey(file);
      const state=JSON.parse(localStorage.getItem(key)||'null');
      if(!state||Number(state.total)!==max||!Array.isArray(state.done))return;
      const done=[...new Set(state.done.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<max))];
      const doneSet=new Set(done);
      const queue=[...new Set((Array.isArray(state.queue)?state.queue:[]).map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<max&&!doneSet.has(n)))];
      let current=Number(state.current);
      if(!Number.isInteger(current)||current<0||current>=max||doneSet.has(current))current=null;
      const changed=done.length!==state.done.length||queue.length!==(Array.isArray(state.queue)?state.queue.length:0)||current!==state.current;
      if(changed)localStorage.setItem(key,JSON.stringify({...state,total:max,done,queue,current}));
    }catch(e){}
  }
  const previousPctFor=window.pctFor;
  if(typeof previousPctFor==='function'){
    window.pctFor=pctFor=function(file,total){
      repairTaskState(file,total);
      const value=Number(previousPctFor(file,total));
      return Math.max(0,Math.min(100,Number.isFinite(value)?Math.round(value):0));
    };
  }
})();