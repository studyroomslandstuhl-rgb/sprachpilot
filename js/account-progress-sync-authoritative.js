import '/js/account-progress-cloud-core.js?v=1';
import { db, doc, getDocFromServer, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const core=window.SPAccountProgressCloudCore;
if(!core)throw new Error('CLOUD_PROGRESS_CORE_MISSING');

const FIELD='clientProgressStateV1';
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
  const linked=uniq([...(data?.aliasIds||[]),data?.canonicalStudentId,data?.studentId,data?.userId,data?.docId]);
  linked.forEach(alias=>{state.aliases.add(alias);if(!state.seen.has(alias))state.queue.push(alias)});
}
async function readServerRemote(){
  const canonical=canonicalId(),seed=uniq([canonical,...ids()]),state={entries:new Map(),aliases:new Set(seed),docs:[],queue:seed.slice(),seen:new Set()};
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
  state.authorityReady=state.docs.some(row=>Number(row.data?.clientProgressAuthorityVersion||0)>=core.AUTHORITY_VERSION);
  return state;
}
function recordPending(key){
  if(!started||hydrating||applying||!isStudent()||core.denied(key))return;
  const value=localStorage.getItem(key);if(value===null||!core.eligible(key,value))return;
  const journal=loadJournal();journal.entries[key]={value:String(value),updatedAt:Date.now()};
  if(!saveJournal(journal)){
    try{window.SP_ACCOUNT_PROGRESS_JOURNAL_ERROR=true}catch(e){}
  }
  tracked.add(key);dirty.add(key);saveTracking();scheduleFlush();
}
function patchStorage(){
  if(patched)return;patched=true;
  Storage.prototype.setItem=function(key,value){const result=nativeSet.apply(this,arguments);try{if(this===localStorage)recordPending(String(key||''))}catch(e){}return result};
  // Löschen lokaler Zustände ist weiterhin kein Cloud-Löschbefehl. Ein Seiten-Reset darf
  // gespeicherten Firebase-Fortschritt nicht vernichten.
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
async function markAuthorityReady(id){
  await setDoc(doc(db,'progress',id),{
    clientProgressAuthorityVersion:core.AUTHORITY_VERSION,
    clientProgressAuthorityMode:'server-first',
    clientProgressAuthorityActivatedAt:serverTimestamp()
  },{merge:true});
}
async function migrateLegacyOnce(id){
  const legacy=await import('/js/account-progress-sync-safe.js?v=6');
  const result=await legacy.startAccountProgressSync?.();
  const resolved=await Promise.resolve(result);
  if(!resolved||resolved.active!==true)throw new Error('LEGACY_PROGRESS_MIGRATION_NOT_READY');
  await markAuthorityReady(id);
  try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_CLOUD_AUTHORITY_ACTIVATED',{detail:{studentId:id}}))}catch(e){}
  return{...resolved,active:true,authorityActivated:true,authorityMode:'migration-complete',reloadRequired:true,serverAuthoritative:false};
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
          clientProgressAuthorityVersion:core.AUTHORITY_VERSION,
          clientProgressAuthorityMode:'server-first'
        },{merge:true});
        committedEntries=core.positiveEntries(map);
      });
      remoteCache=committedEntries||remoteCache;
      const current=loadJournal();
      for(const key of keys){
        const sent=pendingEntries[key],now=current.entries[key];
        if(now&&sent&&String(now.value)===String(sent.value)&&Number(now.updatedAt)===Number(sent.updatedAt))delete current.entries[key];
        const latest=current.entries[key];
        if(latest){dirty.add(key);safeSet(key,latest.value);continue}
        dirty.delete(key);
        const cloud=remoteCache.get(key);if(cloud)safeSet(key,cloud.value);
      }
      saveJournal(current);saveTracking();
      try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNCED',{detail:{studentId:activeId,keys:keys.length,serverAuthoritative:true}}))}catch(e){}
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
      const remote=await readServerRemote();const applied=applySnapshot(remote);
      if(dirty.size)await flush();
      try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_REFRESHED',{detail:{studentId:activeId,serverAuthoritative:true,...applied}}))}catch(e){}
      return{ok:true,...applied};
    }catch(error){return{ok:false,error}}
    finally{refreshPromise=null}
  })();
  return refreshPromise;
}
function blocked(error){
  const result={active:false,blocked:true,reason:String(error?.message||error||'CLOUD_PROGRESS_SERVER_REQUIRED'),serverAuthoritative:true};
  try{window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED=result;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNC_BLOCKED',{detail:result}))}catch(e){}
  return result;
}

export async function startAccountProgressSync(){
  if(started)return accountProgressReady;started=true;
  if(!isStudent()){hydrating=false;readyResolve({active:false});return accountProgressReady}
  const user=secureOwner();if(!user){hydrating=false;const result=blocked('SECURE_STUDENT_AUTH_REQUIRED');readyResolve(result);return accountProgressReady}
  ownerUid=String(user.uid);activeId=canonicalId();if(!activeId){hydrating=false;const result=blocked('STUDENT_ID_MISSING');readyResolve(result);return accountProgressReady}
  try{
    const remote=await readServerRemote();
    if(!remote.authorityReady){
      const migrated=await migrateLegacyOnce(activeId);hydrating=false;readyResolve(migrated);return accountProgressReady;
    }
    patchStorage();
    const applied=applySnapshot(remote);hydrating=false;
    if(dirty.size)await flush();
    const result={active:true,studentId:activeId,authorityMode:'server-first',serverAuthoritative:true,source:'firestore-server',sourceDocs:remote.docs.length,...applied};
    try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_READY',{detail:result}))}catch(e){}
    readyResolve(result);return accountProgressReady;
  }catch(error){
    hydrating=false;console.error('Cloud-Fortschritt ist erforderlich; lokaler Cache wird nicht als Quelle verwendet.',error);
    const result=blocked(error);readyResolve(result);return accountProgressReady;
  }
}

window.addEventListener('online',()=>{if(started&&!hydrating){refreshFromCloud();if(dirty.size)scheduleFlush(100)}});
window.addEventListener('focus',()=>{if(started&&!hydrating)refreshFromCloud()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&started&&!hydrating)refreshFromCloud();else if(document.hidden&&started&&!hydrating&&dirty.size)flush()});
window.addEventListener('pagehide',()=>{if(started&&!hydrating&&dirty.size)flush()});
window.SPAccountProgressSync={start:startAccountProgressSync,flush,refresh:refreshFromCloud,ready:accountProgressReady,field:FIELD,version:core.STATE_VERSION,authorityVersion:core.AUTHORITY_VERSION,serverAuthoritative:true};
