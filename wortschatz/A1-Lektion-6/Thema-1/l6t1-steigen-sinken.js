(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  const ADDED=[
    {id:'steigen',group:'Im Buch',type:'verb',article:'',word:'steigen',full:'steigen',sentence:'Die Temperatur steigt.',symbol:'📈',image:CDN+'steigen.webp',tr:{en:'to rise',ru:'повышаться',tr:'yükselmek',uk:'підвищуватися',ar:'يرتفع',ja:'上がる',ro:'a crește',pl:'rosnąć',ku:'bilind bûn'}},
    {id:'sinken',group:'Im Buch',type:'verb',article:'',word:'sinken',full:'sinken',sentence:'Die Temperatur sinkt.',symbol:'📉',image:CDN+'sinken.webp',tr:{en:'to fall',ru:'понижаться',tr:'düşmek',uk:'знижуватися',ar:'ينخفض',ja:'下がる',ro:'a scădea',pl:'spadać',ku:'daketin'}}
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
  ensureAdded();
  const oldWords=window.words;
  window.words=words=function(){
    ensureAdded();
    const list=typeof oldWords==='function'?oldWords():(BASE_WORDS||[]).concat((typeof extraOn==='function'&&extraOn())?EXTRA_WORDS:[]);
    const seen=new Set();
    return list.filter(w=>w&&w.id&&!seen.has(w.id)&&seen.add(w.id));
  };
  const oldNouns=window.nouns;
  window.nouns=nouns=function(){return words().filter(w=>w.type==='noun')};
  window.wordItems=wordItems=function(){return words()};
  window.cardItems=cardItems=function(){
    return words().flatMap(w=>[{mode:w.type==='verb'?'verb':'noun',w},{mode:'sentence',w}]);
  };
  const oldTaskTotals=window.taskTotals;
  window.taskTotals=taskTotals=function(){
    const base=typeof oldTaskTotals==='function'?oldTaskTotals():[];
    return base.map(t=>t[0]==='karteikarten.html'?[t[0],cardItems().length,t[2]]:t);
  };
  function rerender(){
    try{const wordList=document.getElementById('wordList');if(wordList&&typeof renderOverview==='function')renderOverview(wordList)}catch(e){}
    try{if(document.getElementById('taskGrid')&&typeof renderMenu==='function')renderMenu()}catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rerender);else setTimeout(rerender,0);
})();