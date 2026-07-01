let firebaseSaveTimer=null;
function skillKey(skill){return skill==="zuordnung"?"bild_verb":skill}
function releaseFilterVerbs(list){
  if(typeof window!=="undefined"&&typeof window.spStrictReleasedVerbList==="function"){
    const allowed=new Set(window.spStrictReleasedVerbList());
    if(allowed.size)return (list||[]).filter(v=>allowed.has(v));
  }
  return list||[];
}
function verbSkillCount(v){ensureSkillState(v);return VERB_SKILLS.filter(s=>state.skillDone[v]&&state.skillDone[v][s]).length}
function verbPercent(v){return Math.round((verbSkillCount(v)*100)/VERB_SKILLS.length)}
function overall(){const verbs=currentPracticeVerbs();if(!verbs.length)return 0;return Math.round(verbs.reduce((s,v)=>s+verbPercent(v),0)/verbs.length)}
function totalStars(){return currentPracticeVerbs().filter(v=>verbPercent(v)===100).length}
function addEncounter(v,skill,good=true){const sk=skillKey(skill);ensureSkillState(v);state.skillAttempts[v][sk]=(state.skillAttempts[v][sk]||0)+1;if(good){state.skillSuccess[v][sk]=(state.skillSuccess[v][sk]||0)+1;state.skillDone[v][sk]=true}else{state.weak[v]=(state.weak[v]||0)+1}saveState()}
function sendProgress(){if(!profile||!db)return;const sid=firebaseStudentId();if(!sid)return;clearTimeout(firebaseSaveTimer);firebaseSaveTimer=setTimeout(async()=>{try{const progressValue=overall();await db.collection("progress").doc(sid).set({studentId:sid,kurs:profile.kurs||profile.kursnummer||"",verben:{progress:progressValue,stars:totalStars(),activeVerbs:releaseFilterVerbs(state.active||[]),learnedVerbs:releaseFilterVerbs(state.learned||[]),known:releaseFilterVerbs(state.known||[]),unsure:releaseFilterVerbs(state.unsure||[]),unknown:releaseFilterVerbs(state.unknown||[]),assessed:releaseFilterVerbs(state.assessed||[]),currentPackageVerbs:currentPackageAllVerbs(),exam:state.exam||{},state:state,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});await db.collection("students").doc(sid).set({studentId:sid,vorname:profile.vorname||"",nachname:profile.nachname||"",kurs:profile.kurs||profile.kursnummer||"",muttersprache:profile.muttersprache||"",verbenFortschritt:progressValue,lastActivity:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})}catch(e){console.warn("Firebase Speichern fehlgeschlagen",e)}},600)}
function taskQueueKey(skill){return "queue_"+skillKey(skill)}
function taskDoneSetKey(skill){return "done_"+skillKey(skill)}
function weightForVerb(v){if((state.unknown||[]).includes(v))return 2;return 1}
function buildPracticePool(){
  let source=releaseFilterVerbs(currentPracticeVerbs());
  const pool=[]; source.forEach(v=>{for(let i=0;i<weightForVerb(v);i++)pool.push(v)});
  state.practicePool=shuffle(pool.length?pool:source);
  saveState();return state.practicePool;
}
function initTaskQueue(skill){
  const qKey=taskQueueKey(skill),dKey=taskDoneSetKey(skill);
  state.taskDoneSets[dKey]=state.taskDoneSets[dKey]||[];
  state.practicePool=releaseFilterVerbs(state.practicePool||[]);
  const source=(state.practicePool&&state.practicePool.length)?state.practicePool:buildPracticePool();
  const allowed=new Set(releaseFilterVerbs(source));
  state.taskQueues[qKey]=(state.taskQueues[qKey]||[]).filter(x=>x&&allowed.has(x.v));
  state.taskDoneSets[dKey]=(state.taskDoneSets[dKey]||[]).filter(k=>allowed.has(String(k).split(":")[0]));
  const done=new Set(state.taskDoneSets[dKey]);
  if(!Array.isArray(state.taskQueues[qKey])||!state.taskQueues[qKey].length){
    state.taskQueues[qKey]=shuffle(source.map((v,i)=>({v,slot:i})).filter(x=>allowed.has(x.v)&&!done.has(x.v+":"+x.slot)));
  }
  saveState();
}
function currentTaskItem(skill){
  const sk=skillKey(skill);
  const allowed=new Set(releaseFilterVerbs(currentPracticeVerbs()));
  if(state.currentTask&&state.currentTask.skill===sk&&state.currentTask.v&&allowed.has(state.currentTask.v))return state.currentTask;
  if(state.currentTask&&state.currentTask.skill===sk&&state.currentTask.v&&!allowed.has(state.currentTask.v))state.currentTask=null;
  initTaskQueue(sk);
  const q=state.taskQueues[taskQueueKey(sk)]||[];
  const item=q.shift();
  state.taskQueues[taskQueueKey(sk)]=q;
  if(!item){state.currentTask=null;saveState();return null}
  state.currentTask={skill:sk,v:item.v,slot:item.slot,tries:0,hadWrong:false,helped:false};
  saveState();
  return state.currentTask;
}
function nextFromTaskQueue(skill){const item=currentTaskItem(skill);return item?item.v:null}
function finishQueuedVerb(skill,v,good=true){
  const allowed=new Set(releaseFilterVerbs(currentPracticeVerbs()));
  if(!allowed.has(v)){if(state.currentTask)state.currentTask=null;saveState();return}
  const sk=skillKey(skill), dKey=taskDoneSetKey(sk), qKey=taskQueueKey(sk);
  state.taskDoneSets[dKey]=state.taskDoneSets[dKey]||[];
  const slot=(state.currentTask&&state.currentTask.skill===sk&&state.currentTask.v===v)?state.currentTask.slot:null;
  if(good){
    if(slot!==null){const key=v+":"+slot;if(!state.taskDoneSets[dKey].includes(key))state.taskDoneSets[dKey].push(key)}
    else {const source=(state.practicePool&&state.practicePool.length)?releaseFilterVerbs(state.practicePool):buildPracticePool();const found=source.findIndex((x,i)=>x===v&&!state.taskDoneSets[dKey].includes(x+":"+i));if(found>=0)state.taskDoneSets[dKey].push(v+":"+found)}
  } else {
    state.taskQueues[qKey]=state.taskQueues[qKey]||[];
    if(slot!==null)state.taskQueues[qKey].push({v,slot});
  }
  if(state.currentTask&&state.currentTask.skill===sk)state.currentTask=null;
  saveState();
}
function queuedProgress(skill){const dKey=taskDoneSetKey(skill);const done=(state.taskDoneSets[dKey]||[]).length;const total=((state.practicePool&&state.practicePool.length)?releaseFilterVerbs(state.practicePool):currentPracticeVerbs()).length;return {done,total,pct:total?Math.min(100,Math.round(done*100/total)):0}}
function taskDone(skill){const p=queuedProgress(skill);return p.total>0&&p.done>=p.total}
function taskProgressHtml(skill,label){const p=queuedProgress(skill);return `<div class="task-progress"><div class="task-progress-title"><span>${safeText(label)} · ${p.done}/${p.total} · ${p.pct}%</span></div><div class="task-progress-line"><div class="task-progress-fill" style="width:${p.pct}%"></div></div></div>`}