(function(){
  function optionsFor(mode,item){
    if(mode==='definite')return ['der','den','die','das'];
    if(mode==='indefinite')return ['ein','einen','eine'];
    if(mode==='possessive')return item.options.slice();
    return ['der','den','die','das'];
  }
  function itemQuestion(mode,item){
    if(mode==='svo'||mode==='nomakk')return `<div class="sentence-box">${L6T3.markTarget(item.sentence,item.target)}</div>`;
    const owner=mode==='possessive'?`<div class="owner-pill">Person: <b>${item.owner}</b></div>`:'';
    return owner+`<div class="sentence-box">${item.q}</div>`;
  }
  function stageTitle(stage){return ['1. Welcher Artikel passt?','2. Nominativ oder Akkusativ?','3. Warum?'][stage]}
  function start(config){
    const area=document.getElementById('area'),file=config.file,mode=config.mode;
    header(config.title);
    let items=[],index=0,stage=0,locked=false;
    function loadItems(){
      if(mode==='definite')return L6T3.definiteItems();
      if(mode==='indefinite')return L6T3.indefiniteItems();
      if(mode==='possessive')return L6T3.possessiveItems();
      return L6T3.analysisItems(file);
    }
    function show(){
      items=loadItems();
      if(loadTask(file,items.length).done.length>=items.length){complete(area,file,L6T3.nextFile(file));return}
      index=spNextIndex(file,items.length);stage=0;locked=false;render();
    }
    function render(){
      const item=items[index];
      if(!item){area.innerHTML='<div class="no">Die Aufgabe konnte nicht geladen werden.</div>';return}
      const answer=stage===0?item.answer||item.article:(stage===1?item.case:item.reason);
      const options=stage===0?optionsFor(mode,item):(stage===1?['Nominativ','Akkusativ']:L6T3.reasonOptions());
      area.innerHTML=`${progress(file,items.length)}<div class="small task-step">${stageTitle(stage)}</div>${itemQuestion(mode,item)}<div class="choice-grid">${L6T3.fisher(options).map(o=>`<button type="button" class="choice" onclick="L6T3Grammar.choose(this,'${encodeURIComponent(o)}')">${o}</button>`).join('')}</div><div id="fb" class="feedback"></div>`;
      window.L6T3Grammar.currentAnswer=answer;
    }
    function choose(btn,raw){
      if(locked)return;
      const value=decodeURIComponent(raw),item=items[index],answer=stage===0?(item.answer||item.article):(stage===1?item.case:item.reason);
      if(value===answer){
        btn.classList.add('ok');locked=true;
        if(stage<2){stage++;setTimeout(()=>{locked=false;render()},450);return}
        fb.innerHTML='<div class="ok">Richtig!</div>';spMarkRight(file,items.length);setTimeout(show,650);
      }else{
        btn.classList.add('no');const tries=spMarkWrong(file,items.length);fb.innerHTML=tries>=3?`<div class="no">Richtige Antwort: ${answer}</div>`:'<div class="no">Noch nicht richtig.</div>';
      }
    }
    window.L6T3Grammar.choose=choose;
    L6T3.refreshRelease(show);
  }
  window.L6T3Grammar={start,currentAnswer:''};
})();