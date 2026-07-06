(function(){
  function uniq(list){const seen=new Set();return (list||[]).filter(v=>{v=String(v||'').trim();if(!v||seen.has(v))return false;seen.add(v);return true})}
  function patch(){
    try{
      if(typeof window.verbsByStatus==='function'&&!window.verbsByStatus.__dedupe){
        window.verbsByStatus=function(){
          if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists();
          const learnedSet=new Set(uniq([...(state.learned||[]),...(state.known||[])]));
          const active=uniq([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]).filter(v=>!learnedSet.has(v));
          const activeSet=new Set(active);
          const all=uniq((ALL_VERBS||[]).map(x=>x&&x.v));
          const newList=all.filter(v=>!learnedSet.has(v)&&!activeSet.has(v));
          return {active,learned:[...learnedSet],new:newList};
        };
        window.verbsByStatus.__dedupe=true;
      }
      document.querySelectorAll('.verb-overview-grid').forEach(grid=>{
        const seen=new Set();
        grid.querySelectorAll('.verb-overview-card').forEach(card=>{
          const name=(card.querySelector('.verb-name')?.textContent||'').trim();
          if(!name)return;
          if(seen.has(name))card.remove();
          else seen.add(name);
        });
        const det=grid.closest('details');
        const count=det?.querySelector('summary .small');
        if(count)count.textContent=String(seen.size);
      });
    }catch(e){}
  }
  patch();setTimeout(patch,300);setTimeout(patch,1000);setInterval(patch,2500);
})();