function memorySource(){
  ensureProgressObjects();
  let source=releaseFilterVerbs(state.practicePool&&state.practicePool.length?state.practicePool:currentPracticeVerbs());
  if(!source.length)source=releaseFilterVerbs(buildPracticePool());
  state.practicePool=source.slice();
  return source;
}
function memoryDoneKeys(){
  ensureProgressObjects();
  const dKey=taskDoneSetKey('memory');
  return ensureArrayStore(state.taskDoneSets,dKey);
}
function memoryErrorVerbs(){
  ensureProgressObjects();
  const eKey=taskErrorSetKey('memory');
  return ensureArrayStore(state.taskErrorSets,eKey);
}
function memoryKey(item){return item.v+':'+item.slot}
function pendingMemoryItems(){
  const source=memorySource();
  const done=new Set(memoryDoneKeys());
  const seen=new Set();
  const items=[];
  source.forEach((v,slot)=>{
    const item={v,slot};
    const key=memoryKey(item);
    if(done.has(key)||seen.has(v))return;
    seen.add(v);
    items.push(item);
  });
  return items;
}
function memoryProgress(){
  const source=memorySource();
  const done=new Set(memoryDoneKeys());
  const doneCount=source.filter((v,slot)=>done.has(v+':'+slot)).length;
  const total=source.length;
  return {done:doneCount,total,pct:total?Math.round(doneCount*100/total):0};
}
function markMemoryPairDone(v,slot){
  ensureProgressObjects();
  const dKey=taskDoneSetKey('memory');
  const eKey=taskErrorSetKey('memory');
  const done=ensureArrayStore(state.taskDoneSets,dKey);
  const errors=ensureArrayStore(state.taskErrorSets,eKey);
  const key=v+':'+slot;
  if(errors.includes(v)){
    state.taskErrorSets[eKey]=errors.filter(x=>x!==v);
    return 'repeat';
  }
  if(!done.includes(key))done.push(key);
  try{ensureSkillState(v);state.skillDone[v]=state.skillDone[v]||{};state.skillDone[v].memory=true;state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillAttempts[v].memory=(state.skillAttempts[v].memory||0)+1;state.skillSuccess[v]=state.skillSuccess[v]||{};state.skillSuccess[v].memory=(state.skillSuccess[v].memory||0)+1}catch(e){}
  return 'done';
}
function showMemoryBlockDone(){
  const p=memoryProgress();
  saveState();try{if(typeof window.flushVerbProgress==='function')window.flushVerbProgress()}catch(e){}
  $('app').innerHTML=`<section class="card finish-box task-finish-card"><div class="finish-icon">✓</div><p class="eyebrow">Memory</p><h2>Memory-Block geschafft</h2><p class="small">${p.done}/${p.total} Verben sind in Memory erledigt.</p><div class="progress"><div class="bar" style="width:${p.pct}%"></div></div><div class="actions finish-actions"><button class="btn green" onclick="memory()">Weiter</button><button class="btn secondary" onclick="goTaskOverview()">Aufgabenübersicht</button></div></section>`;
}
function memory(){
  rememberPhase('memory');state.currentGame='memory';state.phase='memory';
  const pending=pendingMemoryItems();
  const items=shuffle(pending).slice(0,6);
  if(!items.length){if(typeof renderTaskFinishScreen==='function')renderTaskFinishScreen('memory');else renderTaskOverview();return}
  state.memoryCards=shuffle(items.flatMap(item=>[{type:'word',v:item.v,slot:item.slot},{type:'img',v:item.v,slot:item.slot}]));
  state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;
  saveState();renderMemory();
}
function renderMemory(){
  const done=state.memoryDone||[], open=state.openCards||[];
  const p=memoryProgress();
  $('app').innerHTML=`<h2>Memory</h2><div class="task-progress"><div class="task-progress-title"><span>Memory · ${p.done}/${p.total} · ${p.pct}%</span></div><div class="task-progress-line"><div class="task-progress-fill" style="width:${p.pct}%"></div></div></div><div class="memory">${(state.memoryCards||[]).map((c,i)=>`<button class="mem ${(done.includes(i)?'done':'')} ${(open.includes(i)?'open':'')}" onclick="openMemory(${i})" id="mem${i}">${done.includes(i)||open.includes(i)?(c.type==='img'?imageBox(c.v,true):`<span class="mem-word">${safeText(c.v)}</span>`):'?'}</button>`).join('')}</div><div id="fb"></div>`;
  renderAndHydrate();
}
function openMemory(i){
  if(state.lock)return;
  state.memoryDone=state.memoryDone||[];state.openCards=state.openCards||[];
  if(state.memoryDone.includes(i)||state.openCards.includes(i))return;
  state.openCards.push(i);
  if(state.openCards.length===2){
    const [a,b]=state.openCards;
    const ca=state.memoryCards[a],cb=state.memoryCards[b];
    if(ca&&cb&&ca.v===cb.v&&ca.type!==cb.type&&ca.slot===cb.slot){
      state.memoryDone.push(a,b);
      state.openCards=[];
      const result=markMemoryPairDone(ca.v,ca.slot);
      saveState();
      renderMemory();
      const fb=$('fb');
      if(fb)fb.innerHTML=result==='repeat'?"<div class='ok'>Richtig. Wegen eines früheren Fehlers kommt dieses Verb später noch einmal.</div>":"<div class='ok'>Richtig.</div>";
      if((state.memoryDone||[]).length===(state.memoryCards||[]).length){
        setTimeout(()=>{if(taskDone('memory')){if(typeof renderTaskFinishScreen==='function')renderTaskFinishScreen('memory');else renderTaskOverview()}else showMemoryBlockDone()},650);
      }
      return;
    }
    state.lock=true;
    try{markTaskNeedsRepeat('memory',ca&&ca.v);markTaskNeedsRepeat('memory',cb&&cb.v)}catch(e){}
    saveState();renderMemory();
    const fb=$('fb');if(fb)fb.innerHTML="<div class='no'>Nicht passend. Diese Verben werden später wiederholt.</div>";
    setTimeout(()=>{state.openCards=[];state.lock=false;saveState();renderMemory()},900);
    return;
  }
  saveState();renderMemory();
}
function findMemorySlot(v){const source=memorySource();const done=new Set(memoryDoneKeys());const idx=source.findIndex((x,i)=>x===v&&!done.has(x+':'+i));return idx<0?0:idx}