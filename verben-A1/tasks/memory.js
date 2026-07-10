function pendingMemoryItems(){
  ensureProgressObjects();
  const source=(state.practicePool&&state.practicePool.length)?state.practicePool:buildPracticePool();
  const done=state.taskDoneSets[taskDoneSetKey("memory")]||[];
  const seen=new Set();
  const items=[];
  source.forEach((v,slot)=>{
    const key=v+":"+slot;
    if(done.includes(key)||seen.has(v))return;
    seen.add(v);
    items.push({v,slot});
  });
  return items;
}
function saveMemoryPairDone(v,slot){
  ensureProgressObjects();
  const sk=skillKey("memory"),dKey=taskDoneSetKey(sk),qKey=taskQueueKey(sk),eKey=taskErrorSetKey(sk);
  state.taskDoneSets[dKey]=ensureArrayStore(state.taskDoneSets,dKey);
  state.taskQueues[qKey]=ensureArrayStore(state.taskQueues,qKey);
  state.taskErrorSets[eKey]=ensureArrayStore(state.taskErrorSets,eKey);
  const key=v+":"+slot;
  const hadError=state.taskErrorSets[eKey].includes(v);
  if(!hadError&&!state.taskDoneSets[dKey].includes(key))state.taskDoneSets[dKey].push(key);
  if(hadError){
    state.taskQueues[qKey]=state.taskQueues[qKey].filter(x=>x&&!(x.v===v&&Number(x.slot)===Number(slot)));
    if(!state.taskQueues[qKey].some(x=>x&&x.v===v&&Number(x.slot)===Number(slot)))state.taskQueues[qKey].push({v,slot});
    state.taskErrorSets[eKey]=state.taskErrorSets[eKey].filter(x=>x!==v);
  }else{
    state.taskQueues[qKey]=state.taskQueues[qKey].filter(x=>x&&x.v!==v);
    ensureSkillState(v);
    state.skillDone[v][sk]=true;
  }
  if(state.currentTask&&state.currentTask.skill===sk&&state.currentTask.v===v)state.currentTask=null;
  saveState();
  try{sendProgress()}catch(e){}
  return !hadError;
}
function memory(){
  rememberPhase("memory");state.currentGame="memory";
  const items=shuffle(pendingMemoryItems()).slice(0,6);
  if(!items.length){if(typeof renderTaskFinishScreen==='function')renderTaskFinishScreen('memory');else renderTaskOverview();return}
  state.memoryCards=shuffle(items.flatMap(item=>[{type:"word",v:item.v,slot:item.slot},{type:"img",v:item.v,slot:item.slot}]));
  state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.phase="memory";saveState();renderMemory()
}
function renderMemory(){
  const done=state.memoryDone||[], open=state.openCards||[];
  $("app").innerHTML=`<h2>Memory</h2>${taskProgressHtml("memory","Memory")}<div class="memory">${state.memoryCards.map((c,i)=>`<button class="mem ${(done.includes(i)?"done":"")} ${(open.includes(i)?"open":"")}" onclick="openMemory(${i})" id="mem${i}">${done.includes(i)||open.includes(i)?(c.type==="img"?imageBox(c.v,true):`<span class="mem-word">${safeText(c.v)}</span>`):"?"}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function openMemory(i){
  if(state.lock)return;state.memoryDone=state.memoryDone||[];state.openCards=state.openCards||[];
  if(state.memoryDone.includes(i)||state.openCards.includes(i))return;
  if(state.openCards.length===2){
    const [a,b]=state.openCards;const ca=state.memoryCards[a], cb=state.memoryCards[b];
    if(!(ca.v===cb.v&&ca.type!==cb.type&&Number(ca.slot)===Number(cb.slot))){state.openCards=[];}
  }
  state.openCards.push(i);
  if(state.openCards.length===2){
    const [a,b]=state.openCards;const ca=state.memoryCards[a], cb=state.memoryCards[b];
    if(ca.v===cb.v&&ca.type!==cb.type&&Number(ca.slot)===Number(cb.slot)){
      state.memoryDone.push(a,b);
      state.currentTask={skill:skillKey("memory"),v:ca.v,slot:ca.slot,tries:0,hadWrong:false,helped:false};
      ensureAttempt("memory",ca.v);
      addEncounter(ca.v,"memory",true);
      const saved=saveMemoryPairDone(ca.v,ca.slot);
      state.openCards=[];
      if($("fb"))$("fb").innerHTML=saved?"<div class='ok'>Richtig. Gespeichert.</div>":"<div class='ok'>Richtig. Dieses Verb wird später wiederholt.</div>";
      if((state.memoryDone||[]).length===state.memoryCards.length){
        saveState();
        try{if(typeof window.flushVerbProgress==='function')window.flushVerbProgress()}catch(e){}
        setTimeout(()=>{if(taskDone("memory")){if(typeof renderTaskFinishScreen==='function')renderTaskFinishScreen('memory');else renderTaskOverview()}else memory()},700)
      }
    } else {
      try{markTaskNeedsRepeat("memory",ca.v);markTaskNeedsRepeat("memory",cb.v)}catch(e){}
      if($("fb"))$("fb").innerHTML="<div class='no'>Nicht passend. Diese Karten werden später wiederholt.</div>";
    }
  }
  saveState();renderMemory();
}
function findMemorySlot(v){const done=state.taskDoneSets[taskDoneSetKey("memory")]||[];const source=(state.practicePool&&state.practicePool.length)?state.practicePool:currentPracticeVerbs();const idx=source.findIndex((x,i)=>x===v&&!done.includes(x+":"+i));return idx<0?0:idx}