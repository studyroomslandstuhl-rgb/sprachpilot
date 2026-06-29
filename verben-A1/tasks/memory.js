function pendingMemoryItems(){
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
function memory(){
  rememberPhase("memory");state.currentGame="memory";
  const items=shuffle(pendingMemoryItems()).slice(0,6);
  if(!items.length){renderHome();return}
  state.memoryCards=shuffle(items.flatMap(item=>[{type:"word",v:item.v,slot:item.slot},{type:"img",v:item.v,slot:item.slot}]));state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;saveState();renderMemory()
}
function renderMemory(){
  const done=state.memoryDone||[], open=state.openCards||[];
  $("app").innerHTML=`<h2>Memory</h2>${taskProgressHtml("memory","Memory")}<div class="memory">${state.memoryCards.map((c,i)=>`<button class="mem ${(done.includes(i)?"done":"")} ${(open.includes(i)?"open":"")}" onclick="openMemory(${i})" id="mem${i}">${done.includes(i)||open.includes(i)?(c.type==="img"?imageBox(c.v,true):safeText(c.v)):"?"}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function openMemory(i){
  if(state.lock)return;state.memoryDone=state.memoryDone||[];state.openCards=state.openCards||[];
  if(state.memoryDone.includes(i)||state.openCards.includes(i))return;
  if(state.openCards.length===2){
    const [a,b]=state.openCards;const ca=state.memoryCards[a], cb=state.memoryCards[b];
    if(!(ca.v===cb.v&&ca.type!==cb.type&&ca.slot===cb.slot)){state.openCards=[];}
  }
  state.openCards.push(i);
  if(state.openCards.length===2){
    const [a,b]=state.openCards;const ca=state.memoryCards[a], cb=state.memoryCards[b];
    if(ca.v===cb.v&&ca.type!==cb.type&&ca.slot===cb.slot){
      state.memoryDone.push(a,b);
      state.currentTask={skill:skillKey("memory"),v:ca.v,slot:ca.slot,tries:0,hadWrong:false,helped:false};
      ensureAttempt("memory",ca.v);handleCorrectAnswer("memory",ca.v,()=>{},0,"fb");state.openCards=[];
      if((state.memoryDone||[]).length===state.memoryCards.length){$("fb").innerHTML="<div class='ok'>Memory-Runde geschafft.</div>";setTimeout(()=>{if(taskDone("memory"))renderHome();else memory()},700)}
    }
  }
  saveState();renderMemory();
}
function findMemorySlot(v){const done=state.taskDoneSets[taskDoneSetKey("memory")]||[];const source=(state.practicePool&&state.practicePool.length)?state.practicePool:currentPracticeVerbs();const idx=source.findIndex((x,i)=>x===v&&!done.includes(x+":"+i));return idx<0?0:idx}
