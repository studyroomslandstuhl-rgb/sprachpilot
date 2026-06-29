function memory(){
  rememberPhase("memory");state.currentGame="memory";
  const source=(state.practicePool&&state.practicePool.length?state.practicePool:state.active).filter(v=>!((state.taskDoneSets[taskDoneSetKey("memory")]||[]).some(k=>k.startsWith(v+":"))));
  const verbs=shuffle(source.length?source:(state.practicePool&&state.practicePool.length?state.practicePool:state.active)).slice(0,6);
  if(!verbs.length){renderHome();return}
  state.memoryCards=shuffle(verbs.flatMap(v=>[{type:"word",v},{type:"img",v}]));state.memoryDone=[];state.memoryOpen=[];state.first=null;state.lock=false;saveState();renderMemory()
}
function renderMemory(){
  const done=state.memoryDone||[], open=state.memoryOpen||[];
  $("app").innerHTML=`<h2>Memory</h2>${taskProgressHtml("memory","Memory")}<div class="memory">${state.memoryCards.map((c,i)=>{const visible=done.includes(i)||open.includes(i);return `<button class="mem ${(done.includes(i)?"done":"")} ${(open.includes(i)?"open":"")}" onclick="openMemory(${i})" id="mem${i}">${visible?(c.type==="img"?imageBox(c.v,true):safeText(c.v)):"?"}</button>`}).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function openMemory(i){
  state.memoryDone=state.memoryDone||[];state.memoryOpen=state.memoryOpen||[];
  if(state.memoryDone.includes(i)||state.memoryOpen.includes(i))return;
  if(state.memoryOpen.length===2){
    const [a,b]=state.memoryOpen;const ca=state.memoryCards[a],cb=state.memoryCards[b];
    if(!(ca.v===cb.v&&ca.type!==cb.type))state.memoryOpen=[];
  }
  state.memoryOpen.push(i);
  if(state.memoryOpen.length===2){
    const [a,b]=state.memoryOpen;const ca=state.memoryCards[a],cb=state.memoryCards[b];
    if(ca.v===cb.v&&ca.type!==cb.type){
      state.memoryDone.push(a,b);addEncounter(ca.v,"memory",true);state.currentTask={skill:"memory",v:ca.v,slot:findMemorySlot(ca.v)};finishQueuedVerb("memory",ca.v,true);state.memoryOpen=[];
      if((state.memoryDone||[]).length===state.memoryCards.length){saveState();renderMemory();$("fb").innerHTML="<div class='ok'>Memory-Runde geschafft.</div>";setTimeout(()=>{if(taskDone("memory"))renderHome();else memory()},700);return}
    }
  }
  saveState();renderMemory();
}
function findMemorySlot(v){const done=state.taskDoneSets[taskDoneSetKey("memory")]||[];const source=(state.practicePool&&state.practicePool.length)?state.practicePool:state.active;const idx=source.findIndex((x,i)=>x===v&&!done.includes(x+":"+i));return idx<0?0:idx}
