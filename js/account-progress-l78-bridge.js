import '/js/account-progress-cloud-core.js?v=2';

const core=window.SPAccountProgressCloudCore;
if(!core)throw new Error('L78_ACCOUNT_PROGRESS_CORE_MISSING');

const PENDING_PREFIX='SP_ACCOUNT_PROGRESS_PENDING_V1_';
const MIGRATION_PREFIX='SP_ACCOUNT_PROGRESS_L78_LEDGER_MIGRATED_V1_';
let runtimeInstallStarted=false;
let hydratingVisible=false;
let refreshListenerInstalled=false;

function parse(value,fallback=null){try{return JSON.parse(value||'')}catch(e){return fallback}}
function profile(){return parse(localStorage.getItem('SP_USER_PROFILE'),null)||parse(localStorage.getItem('SP_STUDENT_PROFILE'),null)||{}}
function canonicalId(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim()}
function ownerUid(){const p=profile();return String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim()}
function journalKey(){return `${PENDING_PREFIX}${core.clean(ownerUid())}_${core.clean(canonicalId())}`}
function migrationKey(){return `${MIGRATION_PREFIX}${core.clean(ownerUid())}_${core.clean(canonicalId())}`}
function pidClean(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
function currentPid(){
  const p=profile();
  return pidClean(p.uid||p.userId||p.id||p.email||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'))||'student';
}
function legacyPid(){
  const p=profile();
  return pidClean([p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.firstName,p.nachname,p.lastName].filter(Boolean).join('_'));
}
function allowedLedgerPids(){
  const p=profile(),values=[
    currentPid(),canonicalId(),p.canonicalStudentId,p.docId,p.studentId,p.userId,p.uid,p.id,p.email,
    ...(Array.isArray(p.aliasIds)?p.aliasIds:[]),legacyPid(),localStorage.getItem('SP_L7_STABLE_PID')
  ];
  return new Set(values.map(pidClean).filter(value=>value&&value!=='student'));
}
function freshJournal(){return{ownerUid:ownerUid(),studentId:canonicalId(),entries:{}}}
function loadJournal(){
  const raw=parse(localStorage.getItem(journalKey()),null);
  if(!raw||String(raw.ownerUid||'')!==ownerUid()||String(raw.studentId||'')!==canonicalId())return freshJournal();
  raw.entries=raw.entries&&typeof raw.entries==='object'?raw.entries:{};return raw;
}
function saveJournal(journal){localStorage.setItem(journalKey(),JSON.stringify(journal))}
function resetKey(lesson,theme){return`SP_THEME_RESET_A1_L${lesson}_T${theme}`}
function runKey(lesson,theme){return`SP_SCORE_RUN_wortschatz-a1-lektion-${lesson}-thema-${theme}`}
function ledgerKey(lesson,theme,version=1,pid=currentPid()){return`SP_THEME_SCORE_A1_L${lesson}_T${theme}_V${version}_${pid}`}
function rawStateKeys(lesson,theme,id,ledgerPid){
  const pids=[String(ledgerPid||'').trim(),currentPid()].filter(Boolean);
  return [...new Set(pids)].map(pid=>`SP_L${lesson}_${pid}_T${theme}_${id}`);
}
function ledgerRows(){
  const allowed=allowedLedgerPids(),rows=[];
  for(let i=0;i<localStorage.length;i++){
    const key=String(localStorage.key(i)||''),match=key.match(/^SP_THEME_SCORE_A1_L([78])_T(\d+)_V(\d+)_(.+)$/i);if(!match)continue;
    if(!allowed.has(pidClean(match[4])))continue;
    const ledger=parse(localStorage.getItem(key),null);if(!ledger||typeof ledger!=='object')continue;
    rows.push({key,lesson:Number(match[1]),theme:Number(match[2]),version:Number(match[3])||1,pid:match[4],ledger});
  }
  return rows;
}
function pairKey(lesson,theme){return`${Number(lesson)}:${Number(theme)}`}
function allowedThemePairs(rows=ledgerRows()){return new Set(rows.map(row=>pairKey(row.lesson,row.theme)))}
function stageableBridgeKey(key,pairs){
  const k=String(key||''),ledger=k.match(/^SP_THEME_SCORE_A1_L([78])_T(\d+)_V\d+_(.+)$/i);
  if(ledger)return allowedLedgerPids().has(pidClean(ledger[3]));
  const run=k.match(/^SP_SCORE_RUN_wortschatz-a1-lektion-([78])-thema-(\d+)$/i);
  if(run)return pairs.has(pairKey(run[1],run[2]));
  const reset=k.match(/^SP_THEME_RESET_A1_L([78])_T(\d+)$/i);
  if(reset)return pairs.has(pairKey(reset[1],reset[2]));
  return false;
}
function rowStrength(row){try{return core.strength(JSON.stringify(row?.ledger||{}))}catch(e){return 0}}
function betterRow(a,b){
  if(!a)return b;if(!b)return a;
  if(Number(b.version)!==Number(a.version))return Number(b.version)>Number(a.version)?b:a;
  const ar=Math.max(1,Number(a.ledger?.currentRun)||1),br=Math.max(1,Number(b.ledger?.currentRun)||1);if(ar!==br)return br>ar?b:a;
  const as=rowStrength(a),bs=rowStrength(b);if(as!==bs)return bs>as?b:a;
  return stateTimestamp(b.ledger?.updatedAt)>stateTimestamp(a.ledger?.updatedAt)?b:a;
}
function bestLedgerRows(rows=ledgerRows()){
  const best=new Map();
  for(const row of rows){const key=pairKey(row.lesson,row.theme);best.set(key,betterRow(best.get(key),row))}
  return [...best.values()];
}
function canonicalizeLedgers(){
  let copied=0;
  for(const row of bestLedgerRows()){
    const target=ledgerKey(row.lesson,row.theme,row.version,currentPid()),raw=JSON.stringify(row.ledger),old=localStorage.getItem(target);
    if(old===null||core.strength(raw)>core.strength(old)){
      localStorage.setItem(target,raw);copied++;
    }
  }
  return copied;
}
function migrateExistingRawStateIntoLedgers(rows=ledgerRows()){
  let migrated=0;
  for(const row of rows){
    const {lesson,theme,pid,ledger,key}=row,run=Math.max(1,Math.min(3,Number(ledger.currentRun)||1));
    const runData=ledger.runs?.[String(run)]||ledger.runs?.[run]||{},tasks=runData.tasks||{};
    ledger.clientStates=ledger.clientStates&&typeof ledger.clientStates==='object'?ledger.clientStates:{};
    ledger.clientStateProgressFloor=Math.max(0,Number(ledger.clientStateProgressFloor)||0);
    let changed=false;
    for(const id of Object.keys(tasks)){
      let bestRaw=null;
      for(const rawKey of rawStateKeys(lesson,theme,id,pid)){
        const raw=localStorage.getItem(rawKey);if(raw===null)continue;
        if(bestRaw===null||core.strength(raw)>core.strength(bestRaw))bestRaw=raw;
      }
      const state=parse(bestRaw,null);if(!state||typeof state!=='object')continue;
      const compound=`${run}:${id}`,old=ledger.clientStates[compound],oldRaw=old?.state?JSON.stringify(old.state):null;
      ledger.clientStateProgressFloor=Math.max(ledger.clientStateProgressFloor,core.strength(bestRaw),core.strength(oldRaw));
      if(!oldRaw||core.strength(bestRaw)>core.strength(oldRaw)){
        ledger.clientStates[compound]={state,updatedAt:Date.now()};changed=true;migrated++;
      }
    }
    if(changed)localStorage.setItem(key,JSON.stringify(ledger));
  }
  return migrated;
}

export function prepareL78AccountProgressBridge(){
  const uid=ownerUid(),studentId=canonicalId();
  if(!uid||!studentId)return{active:false,staged:0,rawMigrated:0};
  if(localStorage.getItem(migrationKey())==='1')return{active:true,staged:0,rawMigrated:0,alreadyPrepared:true};
  const rows=ledgerRows(),pairs=allowedThemePairs(rows),rawMigrated=migrateExistingRawStateIntoLedgers(rows);
  canonicalizeLedgers();
  const journal=loadJournal();let staged=0;
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!stageableBridgeKey(key,pairs))continue;
    const value=localStorage.getItem(key);if(value===null)continue;
    const old=journal.entries[key];
    if(!old||core.strength(value)>core.strength(old.value)||String(old.value)!==String(value)){
      journal.entries[key]={value:String(value),updatedAt:Date.now()};staged++;
    }
  }
  saveJournal(journal);
  localStorage.setItem(migrationKey(),'1');
  return{active:true,staged,rawMigrated};
}

function stateTimestamp(value){const n=Date.parse(String(value||''));return Number.isFinite(n)?n:0}
function approximateState(lesson,item={}){
  const total=Math.max(1,Number(item.total)||Number(item.done)||1),doneCount=Math.max(0,Math.min(total,Number(item.done)||((item.completed||Number(item.percent)>=100)?total:Math.round(total*Math.max(0,Math.min(100,Number(item.percent)||0))/100))));
  const done=[...Array(doneCount).keys()],queue=[...Array(total).keys()].filter(i=>i>=doneCount);
  if(Number(lesson)===7)return{total,done,queue,current:null,tries:0,hadWrong:false,wrongTries:{},firstSeen:[...done],firstCorrect:doneCount,answers:{}};
  return{total,done,review:{},tries:{},firstSeen:[...done],firstCorrect:doneCount,answers:{},updatedAt:new Date().toISOString()};
}
function visiblePrefixes(lesson,theme,extraPid=''){
  const pids=new Set([...allowedLedgerPids(),pidClean(extraPid),pidClean(currentPid())].filter(Boolean));
  return [...pids].map(pid=>`SP_L${lesson}_${pid}_T${theme}_`);
}
function clearVisibleTheme(lesson,theme,extraPid=''){
  const prefixes=visiblePrefixes(lesson,theme,extraPid),remove=[];
  for(let i=0;i<localStorage.length;i++){const key=String(localStorage.key(i)||'');if(prefixes.some(prefix=>key.startsWith(prefix)))remove.push(key)}
  remove.forEach(key=>localStorage.removeItem(key));return remove.length;
}
function writeVisibleState(lesson,theme,id,ledgerPid,state){
  if(!state||typeof state!=='object'||!id)return 0;
  const raw=JSON.stringify(state);let changed=0;
  for(const key of rawStateKeys(lesson,theme,id,ledgerPid)){
    const old=localStorage.getItem(key);
    if(old===null||core.strength(raw)>core.strength(old)){localStorage.setItem(key,raw);changed++}
  }
  return changed;
}
export function hydrateL78VisibleProgress(){
  let restored=0;const cleared=new Set();
  hydratingVisible=true;
  try{
    canonicalizeLedgers();
    for(const row of bestLedgerRows()){
      const {lesson,theme,pid,ledger}=row,run=Math.max(1,Math.min(3,Number(ledger.currentRun)||1)),pair=pairKey(lesson,theme);
      try{localStorage.setItem(runKey(lesson,theme),String(run))}catch(e){}
      const resetAt=Math.max(0,Number(localStorage.getItem(resetKey(lesson,theme)))||0);
      if(resetAt&&!cleared.has(pair)){clearVisibleTheme(lesson,theme,pid);cleared.add(pair)}
      const exact=ledger.clientStates&&typeof ledger.clientStates==='object'?ledger.clientStates:{};
      const exactIds=new Set();
      for(const [compound,record] of Object.entries(exact)){
        const cut=compound.indexOf(':');if(cut<0||Number(compound.slice(0,cut))!==run)continue;
        const id=compound.slice(cut+1);if(!id||!record?.state)continue;
        const updatedAt=Math.max(Number(record.updatedAt)||0,stateTimestamp(record.state?.updatedAt));
        if(resetAt&&updatedAt<=resetAt)continue;
        exactIds.add(id);restored+=writeVisibleState(lesson,theme,id,pid,record.state);
      }
      const runData=ledger.runs?.[String(run)]||ledger.runs?.[run]||{};
      for(const [id,item] of Object.entries(runData.tasks||{})){
        if(exactIds.has(id))continue;
        const updatedAt=Math.max(stateTimestamp(item?.updatedAt),0);if(resetAt&&updatedAt&&updatedAt<=resetAt)continue;
        if(resetAt&&!updatedAt)continue;
        restored+=writeVisibleState(lesson,theme,id,pid,approximateState(lesson,item));
      }
    }
  }finally{hydratingVisible=false}
  return restored;
}

function cloneState(state){
  try{const raw=JSON.stringify(state||{});if(raw.length>120000)return null;return JSON.parse(raw)}catch(e){return null}
}
function wrapThemeScore(score,lesson){
  if(!score||score.__spAccountStateBridgeV1)return !!score;
  if(typeof score.recordState!=='function'||typeof score.read!=='function'||typeof score.write!=='function')return false;
  const original=score.recordState.bind(score);
  score.recordState=function(theme,id,state){
    const result=original(theme,id,state);
    try{
      const snapshot=cloneState(state);if(!snapshot)return result;
      const snapshotRaw=JSON.stringify(snapshot),ledger=score.read(theme),run=Math.max(1,Math.min(3,Number(ledger.currentRun)||1)),compound=`${run}:${String(id)}`;
      ledger.clientStates=ledger.clientStates&&typeof ledger.clientStates==='object'?ledger.clientStates:{};
      const old=ledger.clientStates[compound],oldRaw=old?.state?JSON.stringify(old.state):null;
      ledger.clientStateProgressFloor=Math.max(0,Number(ledger.clientStateProgressFloor)||0,core.strength(oldRaw),core.strength(snapshotRaw));
      ledger.clientStates[compound]={state:snapshot,updatedAt:Date.now()};
      score.write(theme,ledger);
    }catch(error){console.warn(`L${lesson} Account-Aufgabenstand konnte nicht in den Ledger geschrieben werden`,error)}
    return result;
  };
  score.__spAccountStateBridgeV1=true;return true;
}
function installResetTracking(){
  const previousRemove=Storage.prototype.removeItem;
  if(previousRemove?.__spL78ResetTrackingV1)return;
  const wrapped=function(key){
    const raw=String(key||''),match=raw.match(/^SP_L([78])_(?!PREVIEW(?:_|$)|EXAM_SYNCED(?:_|$)|STABLE_PID$).+_T(\d+)_/i);
    const result=previousRemove.apply(this,arguments);
    if(this===localStorage&&match&&!hydratingVisible){
      try{localStorage.setItem(resetKey(Number(match[1]),Number(match[2])),String(Date.now()))}catch(e){}
    }
    return result;
  };
  try{Object.defineProperty(wrapped,'__spL78ResetTrackingV1',{value:true})}catch(e){wrapped.__spL78ResetTrackingV1=true}
  Storage.prototype.removeItem=wrapped;
}
function installRefreshListener(){
  if(refreshListenerInstalled)return;refreshListenerInstalled=true;
  window.addEventListener('SP_ACCOUNT_PROGRESS_REFRESHED',()=>setTimeout(()=>{try{hydrateL78VisibleProgress()}catch(error){console.warn('L7/L8 Cloud-Refresh konnte nicht angewendet werden',error)}},0));
}
export function installL78RuntimeBridge(){
  installResetTracking();installRefreshListener();
  if(runtimeInstallStarted)return;runtimeInstallStarted=true;
  const wanted=/\/A1-Lektion-7\//i.test(location.pathname)?7:/\/A1-Lektion-8\//i.test(location.pathname)?8:0;
  if(!wanted)return;
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    const score=wanted===7?window.L7ThemeScore:window.L8ThemeScore;
    if(wrapThemeScore(score,wanted)||tries>160)clearInterval(timer);
  },50);
}
