import '/js/account-progress-cloud-core.js?v=1';
import { db, doc, getDocFromServer, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const core=window.SPAccountProgressCloudCore;
if(!core)throw new Error('CLOUD_PROGRESS_CORE_MISSING');

const FIELD='clientProgressStateV1';
const AUTHORITY_VERSION=2;
const OWNER_KEY='SP_ACCOUNT_PROGRESS_OWNER';
const TRACKED_KEY='SP_ACCOUNT_PROGRESS_TRACKED';
const PENDING_PREFIX='SP_ACCOUNT_PROGRESS_PENDING_V1_';
const FLUSH_DELAY=650;
const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
let started=false,patched=false,hydrating=true,applying=false,activeId='',ownerUid='';
let tracked=new Set(),dirty=new Set(),remoteCache=new Map(),flushTimer=null,flushPromise=null,refreshPromise=null;
let readyResolve=()=>{};
export const accountProgressReady=new Promise(resolve=>{readyResolve=resolve});
try{window.SPAccountProgressReady=accountProgressReady}catch(e){}

function parse(v,f=null){return core.parse(v,f)}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function profile(){return getActiveProfile?.()||parse(localStorage.getItem('SP_USER_PROFILE'),null)||parse(localStorage.getItem('SP_STUDENT_PROFILE'),null)||{}}
function role(){return String(getActiveRole?.()||localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function isStudent(){const p=profile();return role()==='student'&&!!(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email)&&!p.teacherPreview&&!p.previewOnly&&!p.isTeacher}
function canonicalId(p=profile()){return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim()}
function ids(p=profile()){
  return uniq([p.canonicalStudentId,p.docId,p.studentId,p.userId,p.id,...(Array.isArray(p.aliasIds)?p.aliasIds:[]),localStorage.getItem('SP_STUDENT_ID')]);
}
function secureOwner(){
  const p=profile(),user=currentFirebaseUser?.();
  const expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  return user&&!user.isAnonymous&&user.emailVerified===true&&expected&&String(user.uid)===expected?user:null;
}
function journalKey(){return `${PENDING_PREFIX}${core.clean(ownerUid)}_${core.clean(activeId)}`}
function loadJournal(){
  try{return core.validJournal(localStorage.getItem(journalKey()),ownerUid,activeId)}catch(e){return core.validJournal(null,ownerUid,activeId)}
}
function saveJournal(journal){
  try{nativeSet.call(localStorage,journalKey(),JSON.stringify(journal));return true}catch(e){console.error('Pending-Fortschrittsjournal konnte nicht gespeichert werden',e);return false}
}
function saveTracking(){
  try{nativeSet.call(localStorage,OWNER_KEY,activeId);nativeSet.call(localStorage,TRACKED_KEY,JSON.stringify([...tracked]))}catch(e){}
}
function safeSet(key,value){applying=true;try{nativeSet.call(localStorage,key,String(value))}finally{applying=false}}
function safeRemove(key){applying=true;try{nativeRemove.call(localStorage,key)}finally{applying=false}}
function scanLocal(){
  const out=new Map();
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!key)continue;
    const value=localStorage.getItem(key);
    if(value!==null&&core.eligible(key,value))out.set(key,String(value));
  }
  return out;
}
function meaningfulValue(raw,depth=0){
  if(raw==null||depth>5)return false;
  let value=raw;
  if(typeof raw==='string'){
    const parsed=parse(raw,undefined);
    if(parsed!==undefined)value=parsed;
    else{const n=Number(raw);return Number.isFinite(n)&&n>0}
  }
  if(typeof value==='number')return Number.isFinite(value)&&value>0;
  if(typeof value==='boolean')return value===true;
  if(Array.isArray(value))return value.length>0;
  if(!value||typeof value!=='object')return false;
  for(const [key,item] of Object.entries(value)){
    const k=String(key).toLowerCase();
    if(Array.isArray(item)&&/done|known|learned|completed|firstseen|assessed/.test(k)&&item.length>0)return true;
    if(typeof item==='number'&&Number.isFinite(item)&&item>0&&/percent|progress|correct|done|completed|score|points|stars|attempt|tries/.test(k))return true;
    if(typeof item==='boolean'&&item&&/completed|finished|done|passed|attempted/.test(k))return true;
    if(item&&typeof item==='object'&&meaningfulValue(item,depth+1))return true;
  }
  return false;
}
function entriesHaveMeaningful(entries){for(const [,entry] of entries||[])if(meaningfulValue(entry?.value))return true;return false}
function clearStaleLocal(remoteEntries,pendingEntries){
  const keep=new Set([...remoteEntries.keys(),...Object.keys(pendingEntries||{})]);
  const remove=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!key)continue;
    const value=localStorage.getItem(key);
    if(value!==null&&core.eligible(key,value)&&!keep.has(key))remove.push(key);
  }
  remove.forEach(safeRemove);return remove.length;
}
function absorbRemoteRow(id,data,state){
  if(!id||state.seen.has(id))return;
  state.seen.add(id);state.docs.push({id,data:data||{}});state.aliases.add(String(id));
  core.mergeRemote(state.entries,core.positiveEntries(data?.[FIELD]));
  state.authorityVersion=Math.max(state.authorityVersion,Number(data?.clientProgressAuthorityVersion||0));
  const linked=uniq([...(data?.aliasIds||[]),data?.canonicalStudentId,data?.studentId,data?.userId,data?.docId]);
  linked.forEach(alias=>{state.aliases.add(alias);if(!state.seen.has(alias))state.queue.push(alias)});
}
async function readServerRemote(){
  const canonical=canonicalId(),seed=uniq([canonical,...ids()]),state={entries:new Map(),aliases:new Set(seed),docs:[],queue:seed.slice(),seen:new Set(),authorityVersion:0};
  let successfulReads=0,canonicalRead=false;
  while(state.queue.length&&state.seen.size<80){
    const id=String(state.queue.shift()||'');if(!id||state.seen.has(id))continue;
    try{
      const snap=await getDocFromServer(doc(db,'progress',id));successfulReads++;
      if(id===canonical)canonicalRead=true;
      if(snap.exists())absorbRemoteRow(snap.id||id,snap.data()||{},state);
      else state.seen.add(id);
    }catch(error){
      state.seen.add(id);
      if(id===canonical){console.warn('Kanonischer Cloud-Fortschritt konnte nicht frisch gelesen werden',id,error);throw new Error('CLOUD_PROGRESS_SERVER_REQUIRED')}
      console.warn('Historischer Fortschritts-Alias wurde beim Server-Read übersprungen',id,error);
    }
  }
  if(!successfulReads||!canonicalRead)throw new Error('CLOUD_PROGRESS_SERVER_REQUIRED');
  state.authorityReady=state.authorityVersion>=AUTHORITY_VERSION;
  return state;
}
function topicNumbers(key,topic){
  const text=[key,topic?.topicId,topic?.themeId,topic?.title,topic?.lesson,topic?.lektion,topic?.theme,topic?.thema].filter(Boolean).join(' ');
  const directLesson=String(topic?.lesson||topic?.lektion||'').match(/\d+/)?.[0]||'';
  const directTheme=String(topic?.theme||topic?.thema||'').match(/\d+/)?.[0]||'';
  return{lesson:directLesson||(text.match(/lektion[-_\s]*(\d+)/i)?.[1]||''),theme:directTheme||(text.match(/thema[-_\s]*(\d+)/i)?.[1]||'')};
}
function stateFromTask(task){
  if(!task||typeof task!=='object')return null;
  const pct=Math.max(0,Math.min(100,Number(task.percent??task.progress??0)||0));
  const doneRaw=Array.isArray(task.done)?task.done.length:Number(task.done)||0;
  const total=Math.max(1,Number(task.total)||doneRaw||((task.completed||pct>=100)?1:0));
  const done=Math.max(0,Math.min(total,doneRaw||((task.completed||pct>=100)?total:Math.round(total*pct/100))));
  if(done<=0)return null;
  return{total,done:[...Array(done).keys()],queue:[...Array(total).keys()].filter(i=>i>=done),current:null,tries:0,hadWrong:false,completed:done>=total,percent:Math.round(done/total*100)};
}
function l6t4LocalFile(file){
  const f=String(file||'');
  if(/^dialoge\.html/i.test(f))return'task-dialog-abc';
  if(/^task-/.test(f)||f==='plural-sprechen.html')return f;
  if(/^task\.html\?/i.test(f)){try{const id=new URLSearchParams(f.split('?')[1]||'').get('task');if(id)return'task-'+id}catch(e){}}
  return f;
}
function localKeysFor(lesson,theme,file){
  const lt=`${lesson}|${theme}`;
  const prefix={
    '4|1':'SP_L4_T1_V2_','4|2':'SP_L4_T2_FINAL_V3_','4|3':'SP_L4_T3_V2_',
    '5|1':'SP_L5_T1_V1_','5|2':'SP_L5_T2_V1_','5|3':'SP_L5_T3_V2_','6|2':'SP_L6_T2_V1_','6|3':'SP_L6_T3_V1_'
  }[lt];
  if(prefix)return[prefix+file];
  if(lt==='6|1')return['SP_L6_T1_V1_'+(localStorage.getItem('SP_L6_T1_EXTRA_WEATHER')==='1'?'EXTRA_':'BOOK_')+file];
  if(lt==='6|4')return['SP_L6_T4_V2_'+l6t4LocalFile(file)];
  return[];
}
function recoverStructuredLessons(docs){
  let restored=0;
  for(const row of docs||[]){
    for(const[key,topic]of Object.entries(row.data?.wortschatz||{})){
      if(!topic||typeof topic!=='object')continue;
      const nums=topicNumbers(key,topic);if(!nums.lesson||!nums.theme)continue;
      for(const[file,task]of Object.entries(topic.tasks||{})){
        const state=stateFromTask(task);if(!state)continue;
        const raw=JSON.stringify(state);
        for(const localKey of localKeysFor(nums.lesson,nums.theme,file)){
          const old=localStorage.getItem(localKey);
          if(old===null||core.strength(raw)>core.strength(old)){safeSet(localKey,raw);restored++}
        }
      }
    }
  }
  return restored;
}
function structuredProgressEvidence(docs){
  for(const row of docs||[]){
    const data=row.data||{};
    if(Number(data?.totals?.points||data?.pointsTotal||data?.lifetimePoints||data?.punkteGesamt||data?.ranking?.points||0)>0)return true;
    for(const module of ['wortschatz','fragen','verben','perfekt','grammatik']){
      for(const record of Object.values(data?.[module]||{})){
        if(!record||typeof record!=='object')continue;
        if(Number(record.progressPercent??record.current?.percent??0)>0||record.completed===true)return true;
        if(Number(record.exam?.bestPercent??record.exam?.percent??record.exam?.stars??0)>0||record.exam?.completed===true)return true;
        for(const task of Object.values(record.tasks||{}))if(stateFromTask(task))return true;
      }
    }
  }
  return false;
}
async function bootstrapAuthorityV2(remote){
  const restoredStructured=recoverStructuredLessons(remote.docs);
  const local=scanLocal(),merged=new Map(remote.entries),now=Date.now();
  let rescuedLocal=0;
  for(const[key,value]of local){
    const old=merged.get(key);
    if(!old||core.strength(value)>=core.strength(old.value)){
      merged.set(key,{key,value:String(value),deleted:false,updatedAt:now});rescuedLocal++;
    }
  }
  if(structuredProgressEvidence(remote.docs)&&!entriesHaveMeaningful(merged)){
    const error=new Error('CLOUD_PROGRESS_REPAIR_SOURCE_REQUIRED');
    error.legacyAuthorityVersion=remote.authorityVersion;throw error;
  }
  const map=core.buildMap(merged),id=canonicalId();
  await setDoc(doc(db,'progress',id),{
    [FIELD]:map,
    clientProgressStateVersion:core.STATE_VERSION,
    clientProgressStateUpdatedAt:serverTimestamp(),
    clientProgressNonDestructive:true,
    clientProgressAuthorityVersion:AUTHORITY_VERSION,
    clientProgressAuthorityMode:'server-first-v2',
    clientProgressAuthorityActivatedAt:serverTimestamp(),
    clientProgressAuthorityRepairedFromVersion:Number(remote.authorityVersion||0)
  },{merge:true});
  const verify=await getDocFromServer(doc(db,'progress',id));
  if(!verify.exists()||Number(verify.data()?.clientProgressAuthorityVersion||0)<AUTHORITY_VERSION)throw new Error('CLOUD_PROGRESS_AUTHORITY_VERIFY_FAILED');
  const verifiedEntries=core.positiveEntries(verify.data()?.[FIELD]);
  if(entriesHaveMeaningful(merged)&&!entriesHaveMeaningful(verifiedEntries))throw new Error('CLOUD_PROGRESS_STATE_VERIFY_FAILED');
  const next=await readServerRemote();
  if(!next.authorityReady)throw new Error('CLOUD_PROGRESS_AUTHORITY_VERIFY_FAILED');
  return{remote:next,restoredStructured,rescuedLocal,repairedFrom:Number(remote.authorityVersion||0)};
}
function recordPending(key){
  if(!started||hydrating||applying||!isStudent()||core.denied(key))return;
  const value=localStorage.getItem(key);if(value===null||!core.eligible(key,value))return;
  const journal=loadJournal();journal.entries[key]={value:String(value),updatedAt:Date.now()};
  if(!saveJournal(journal)){try{window.SP_ACCOUNT_PROGRESS_JOURNAL_ERROR=true}catch(e){}}
  tracked.add(key);dirty.add(key);saveTracking();scheduleFlush();
}
function patchStorage(){
  if(patched)return;patched=true;
  Storage.prototype.setItem=function(key,value){const result=nativeSet.apply(this,arguments);try{if(this===localStorage)recordPending(String(key||''))}catch(e){}return result};
  Storage.prototype.removeItem=function(){return nativeRemove.apply(this,arguments)};
}
function applySnapshot(remote){
  const journal=loadJournal();
  const removed=clearStaleLocal(remote.entries,journal.entries);
  tracked=new Set();dirty.clear();
  for(const [key,entry] of remote.entries){safeSet(key,entry.value);tracked.add(key)}
  let pendingApplied=0,cloudWon=0;
  for(const [key,pending] of Object.entries(journal.entries||{})){
    const remoteEntry=remote.entries.get(key),chosen=core.chooseCloudOrPending(remoteEntry,pending);
    if(chosen.source==='pending'){
      safeSet(key,pending.value);tracked.add(key);dirty.add(key);pendingApplied++;
    }else if(chosen.source==='cloud'){
      if(remoteEntry)safeSet(key,remoteEntry.value);delete journal.entries[key];cloudWon++;
    }
  }
  remoteCache=new Map(remote.entries);saveJournal(journal);saveTracking();
  return{removed,pendingApplied,cloudWon,restored:remote.entries.size};
}
async function flush(){
  if(flushPromise)return flushPromise;
  if(!started||hydrating||!activeId||!isStudent())return null;
  const journal=loadJournal(),pendingEntries={...journal.entries};
  const keys=Object.keys(pendingEntries);if(!keys.length){dirty.clear();return{ok:true,keys:0}}
  flushPromise=(async()=>{
    let committedEntries=null;
    try{
      const ref=doc(db,'progress',activeId);
      await runTransaction(db,async transaction=>{
        const snap=await transaction.get(ref),data=snap.exists()?snap.data()||{}:{};
        const entries=core.positiveEntries(data[FIELD]);core.mergeRemote(entries,remoteCache);
        for(const key of keys){
          const pending=pendingEntries[key];if(!pending)continue;
          const remote=entries.get(key),chosen=core.chooseCloudOrPending(remote,pending);
          if(chosen.source==='pending')entries.set(key,{key,value:String(pending.value),deleted:false,updatedAt:Number(pending.updatedAt)||Date.now()});
        }
        const map=core.buildMap(entries);
        transaction.set(ref,{
          [FIELD]:map,
          clientProgressStateVersion:core.STATE_VERSION,
          clientProgressStateUpdatedAt:serverTimestamp(),
          clientProgressNonDestructive:true,
          clientProgressAuthorityVersion:AUTHORITY_VERSION,
          clientProgressAuthorityMode:'server-first-v2'
        },{merge:true});
        committedEntries=core.positiveEntries(map);
      });
      remoteCache=committedEntries||remoteCache;
      const current=loadJournal();
      for(const key of keys){
        const sent=pendingEntries[key],latest=current.entries[key];
        if(latest&&sent&&String(latest.value)===String(sent.value)&&Number(latest.updatedAt)===Number(sent.updatedAt))delete current.entries[key];
        const pendingNow=current.entries[key];
        if(pendingNow){dirty.add(key);safeSet(key,pendingNow.value);continue}
        dirty.delete(key);const cloud=remoteCache.get(key);if(cloud)safeSet(key,cloud.value);
      }
      saveJournal(current);saveTracking();
      try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNCED',{detail:{studentId:activeId,keys:keys.length,serverAuthoritative:true,authorityVersion:AUTHORITY_VERSION}}))}catch(e){}
      return{ok:true,keys:keys.length,serverAuthoritative:true};
    }catch(error){
      keys.forEach(key=>dirty.add(key));console.warn('Pending-Fortschritt konnte nicht an Firebase übertragen werden',error);scheduleFlush(2200);
      return{ok:false,error,keys:keys.length};
    }finally{flushPromise=null}
  })();
  return flushPromise;
}
function scheduleFlush(delay=FLUSH_DELAY){clearTimeout(flushTimer);flushTimer=setTimeout(()=>flush(),delay)}
async function refreshFromCloud(){
  if(refreshPromise||!started||hydrating||!activeId)return refreshPromise;
  refreshPromise=(async()=>{
    try{
      const remote=await readServerRemote();if(!remote.authorityReady)throw new Error('CLOUD_PROGRESS_AUTHORITY_REPAIR_REQUIRED');
      const applied=applySnapshot(remote);if(dirty.size)await flush();
      try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_REFRESHED',{detail:{studentId:activeId,serverAuthoritative:true,authorityVersion:AUTHORITY_VERSION,...applied}}))}catch(e){}
      return{ok:true,...applied};
    }catch(error){return{ok:false,error}}
    finally{refreshPromise=null}
  })();
  return refreshPromise;
}
function blocked(error){
  const result={active:false,blocked:true,reason:String(error?.message||error||'CLOUD_PROGRESS_SERVER_REQUIRED'),serverAuthoritative:false,authorityVersion:AUTHORITY_VERSION};
  try{window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED=result;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNC_BLOCKED',{detail:result}))}catch(e){}
  return result;
}

export async function startAccountProgressSync(){
  if(started)return accountProgressReady;started=true;
  if(!isStudent()){hydrating=false;readyResolve({active:false});return accountProgressReady}
  const user=secureOwner();if(!user){hydrating=false;const result=blocked('SECURE_STUDENT_AUTH_REQUIRED');readyResolve(result);return accountProgressReady}
  ownerUid=String(user.uid);activeId=canonicalId();if(!activeId){hydrating=false;const result=blocked('STUDENT_ID_MISSING');readyResolve(result);return accountProgressReady}
  try{
    let remote=await readServerRemote(),repair=null;
    if(!remote.authorityReady){repair=await bootstrapAuthorityV2(remote);remote=repair.remote}
    patchStorage();
    const applied=applySnapshot(remote);hydrating=false;
    if(dirty.size)await flush();
    const result={active:true,studentId:activeId,authorityMode:'server-first-v2',authorityVersion:AUTHORITY_VERSION,serverAuthoritative:true,source:'firestore-server',sourceDocs:remote.docs.length,authorityRepaired:!!repair,repairedFrom:repair?.repairedFrom??null,rescuedLocal:repair?.rescuedLocal||0,restoredStructured:repair?.restoredStructured||0,...applied};
    try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_READY',{detail:result}))}catch(e){}
    readyResolve(result);return accountProgressReady;
  }catch(error){
    hydrating=false;console.error('Cloud-Fortschritt ist erforderlich; lokaler Cache wird nicht als normale Quelle verwendet.',error);
    const result=blocked(error);readyResolve(result);return accountProgressReady;
  }
}

window.addEventListener('online',()=>{if(started&&!hydrating){refreshFromCloud();if(dirty.size)scheduleFlush(100)}});
window.addEventListener('focus',()=>{if(started&&!hydrating)refreshFromCloud()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&started&&!hydrating)refreshFromCloud();else if(document.hidden&&started&&!hydrating&&dirty.size)flush()});
window.addEventListener('pagehide',()=>{if(started&&!hydrating&&dirty.size)flush()});
window.SPAccountProgressSync={start:startAccountProgressSync,flush,refresh:refreshFromCloud,ready:accountProgressReady,field:FIELD,version:core.STATE_VERSION,authorityVersion:AUTHORITY_VERSION,serverAuthoritative:true};
