(function(){
  function safeArr(x){return Array.isArray(x)?x:[]}
  function saveLocal(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){}}
  function fixExamHistory(){
    if(typeof EXAM_HISTORY_KEY==='undefined')return;
    let h=[];try{h=JSON.parse(localStorage.getItem(EXAM_HISTORY_KEY)||'[]')}catch(e){h=[]}
    h=safeArr(h).map(r=>{const score=Number(r.score||r.points||0),max=Number(r.maxScore||r.max||0);let p=Number(r.percent||0);if(max>0&&score>=max)p=100;return {...r,percent:Math.min(100,Math.round(p)),score,maxScore:max||r.maxScore||r.max||100,stars:typeof starsForPercent==='function'?starsForPercent(Math.min(100,Math.round(p))):r.stars}});
    saveLocal(EXAM_HISTORY_KEY,h);
  }
  function fallbackAds(task){
    if(task&&task.ads&&Object.keys(task.ads).length)return task.ads;
    if(typeof ADS!=='undefined'&&Array.isArray(ADS)&&ADS.length){
      const out={};ADS.slice(0,6).forEach((a,i)=>out[String.fromCharCode(65+i)]=a.text||a.title||('Anzeige '+(i+1)));return out;
    }
    return {A:'1 Zimmer, 450 Euro, zentral.',B:'2 Zimmer, 650 Euro, Balkon.',C:'WG-Zimmer, 320 Euro, möbliert.',D:'3 Zimmer, 850 Euro, Familie willkommen.'};
  }
  const run=()=>{
    fixExamHistory();
    if(typeof MATCH_TASKS!=='undefined'&&Array.isArray(MATCH_TASKS)){
      MATCH_TASKS.forEach((t,i)=>{if(!t.ads||!Object.keys(t.ads).length)t.ads=fallbackAds(t);if(!t.answer)t.answer=Object.keys(t.ads)[0]||'A';if(!t.situation)t.situation=(typeof MATCH_SITUATIONS!=='undefined'&&MATCH_SITUATIONS[i])||'Welche Anzeige passt?'});
    }
    if(typeof MATCH_SITUATIONS!=='undefined'&&typeof MATCH_TASKS!=='undefined'&&Array.isArray(MATCH_TASKS)&&MATCH_SITUATIONS.length!==MATCH_TASKS.length){try{window.MATCH_SITUATIONS=MATCH_TASKS.map(t=>t.situation)}catch(e){}}
  };
  run();setTimeout(run,100);setTimeout(run,600);
})();