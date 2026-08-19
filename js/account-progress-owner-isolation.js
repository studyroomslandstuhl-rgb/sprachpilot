import { getActiveProfile, getActiveRole } from '/js/auth.js?v=owner-isolation3';

const OWNER_KEY='SP_ACCOUNT_PROGRESS_OWNER';
const TRACKED_KEY='SP_ACCOUNT_PROGRESS_TRACKED';
const INTERNAL_PREFIX='SP_ACCOUNT_PROGRESS_';
const QUARANTINE_PREFIX='SP_ACCOUNT_PROGRESS_QUARANTINE_V1_';

function parse(value,fallback=null){try{return JSON.parse(value||'')}catch(e){return fallback}}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function clean(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function enc(value){
  try{
    const bytes=new TextEncoder().encode(String(value||''));let raw='';
    bytes.forEach(byte=>raw+=String.fromCharCode(byte));
    return btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');
  }catch(e){return clean(value)}
}
function profile(){return getActiveProfile?.()||parse(localStorage.getItem('SP_USER_PROFILE'),null)||parse(localStorage.getItem('SP_STUDENT_PROFILE'),null)||{}}
function isStudent(){
  const p=profile(),role=String(getActiveRole?.()||localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
  return role==='student'&&!!(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email)&&!p.teacherPreview&&!p.previewOnly&&!p.isTeacher;
}
function course(p=profile()){return p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function currentIds(p=profile()){
  const fallback=clean(`${course(p)||'kurs'}_${String(p.email||p.vorname||p.firstName||'student').trim().toLowerCase()}`);
  return uniq([
    p.canonicalStudentId,p.docId,p.studentId,p.userId,p.uid,p.id,
    ...(Array.isArray(p.aliasIds)?p.aliasIds:[]),
    localStorage.getItem('SP_STUDENT_ID'),fallback
  ]);
}
function sameOwner(owner,ids){
  if(!owner)return false;
  const exact=new Set(ids),normalized=new Set(ids.map(clean).filter(Boolean));
  return exact.has(String(owner))||normalized.has(clean(owner));
}
function denied(key){
  const k=String(key||'');
  if(!k||k.startsWith(INTERNAL_PREFIX))return true;
  if(['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_COURSE_CODE','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_AUTH_ROLE','SP_KEEP_LOGGED_IN','SP_MOTHER_LANGUAGE_CODE','motherLanguage','muttersprache','SP_TEACHER_PREVIEW'].includes(k))return true;
  if(/PASSWORD|PASSWORT|TOKEN|SECRET|CREDENTIAL|AUTH_TOKEN|ID_TOKEN|REFRESH_TOKEN/i.test(k))return true;
  if(/^(?:SP_)?(?:TEACHER|ADMIN|OWNER|COURSE_INVITE|INVITE|FIREBASE)/i.test(k))return true;
  if(/(?:_CACHE|CACHE_|ASSET_|IMAGE_|AUDIO_)/i.test(k))return true;
  return false;
}
function progressObject(value,depth=0){
  if(!value||typeof value!=='object'||depth>3||Array.isArray(value))return false;
  const markers=['done','queue','current','tries','hadWrong','answers','progress','percent','progressPercent','completed','completedTasks','score','bestScore','stars','points','attempts','known','unknown','unsure','learned','learnedVerbs','activeVerbs','exam'];
  if(Object.keys(value).some(key=>markers.includes(key)))return true;
  return Object.values(value).slice(0,30).some(item=>progressObject(item,depth+1));
}
function eligible(key,value){
  if(denied(key))return false;
  const k=String(key||''),raw=String(value??'');
  if(!raw)return false;
  if(k==='A1_ACTIVE_SESSION')return true;
  if(/^A1_(?!STUDENTS_)/i.test(k))return true;
  if(/^SP_(?:A1_L\d+|L\d+(?:_|$)|SCORE_RUN_|POINTS_TOTAL$|TASK_|EXAM_|VERBS?_|FRAGEN_|WORTSCHATZ_|PERFEKT_|GRAMMATIK_|LESSON_|THEME_|RUN_|STARS?_)/i.test(k))return true;
  if(/(?:progress|fortschritt|score|punkte|points|stars|attempt|completed|done|learned|known|unknown|unsure)/i.test(k)&&/^(?:SP_|A1_)/i.test(k))return true;
  return progressObject(parse(raw,null));
}
function strength(raw){
  if(raw==null)return 0;
  const parsed=parse(String(raw),null);
  if(typeof parsed==='number')return Math.max(0,parsed);
  const numeric=Number(raw);
  if(!parsed||typeof parsed!=='object')return Number.isFinite(numeric)?Math.max(0,numeric):0;
  let score=0,seen=new Set();
  function walk(value,depth=0){
    if(!value||typeof value!=='object'||depth>4||seen.has(value))return;
    seen.add(value);
    if(Array.isArray(value)){score+=value.length*10;return}
    for(const [keyRaw,item] of Object.entries(value)){
      const key=String(keyRaw).toLowerCase();
      if(Array.isArray(item)){
        if(/done|known|learned|completed|firstseen|assessed/.test(key))score+=item.length*10000;
        else if(/queue/.test(key))score+=Math.max(0,1000-item.length);
        else score+=item.length*10;
      }else if(typeof item==='number'&&Number.isFinite(item)){
        if(/percent|progress/.test(key))score+=Math.max(0,item)*1000;
        else if(/correct|done|completed|score|points|stars|attempt/.test(key))score+=Math.max(0,item)*100;
      }else if(typeof item==='boolean'&&item&&/completed|finished|done|passed/.test(key))score+=100000;
      else if(item&&typeof item==='object')walk(item,depth+1);
    }
  }
  walk(parsed);
  return score;
}
function localProgressEntries(){
  const out=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!key)continue;
    const value=localStorage.getItem(key);
    if(value!==null&&eligible(key,value))out.push([String(key),String(value)]);
  }
  return out;
}
function quarantineKey(owner,key){return `${QUARANTINE_PREFIX}${enc(owner)}_${enc(key)}`}
function saveQuarantine(owner,key,value){
  const qKey=quarantineKey(owner,key),existing=parse(localStorage.getItem(qKey),null);
  if(existing&&existing.value!==undefined&&strength(existing.value)>=strength(value))return qKey;
  localStorage.setItem(qKey,JSON.stringify({owner:String(owner),key:String(key),value:String(value),savedAt:Date.now()}));
  return qKey;
}
function quarantineCurrentLocal(owner){
  let moved=0,failed=0;
  for(const [key,value] of localProgressEntries()){
    let saved=false;
    try{saveQuarantine(owner,key,value);saved=true}catch(e){}
    if(!saved){failed++;continue}
    try{localStorage.removeItem(key);moved++}catch(e){failed++}
  }
  return{moved,failed};
}
function quarantineRecords(){
  const out=[];
  for(let i=0;i<localStorage.length;i++){
    const qKey=localStorage.key(i);if(!String(qKey||'').startsWith(QUARANTINE_PREFIX))continue;
    const record=parse(localStorage.getItem(qKey),null);
    if(record&&record.owner&&record.key&&record.value!==undefined)out.push({qKey,record});
  }
  return out;
}
function restoreCurrentQuarantine(ids){
  let restored=0,kept=0;
  for(const item of quarantineRecords()){
    const {qKey,record}=item;
    if(!sameOwner(record.owner,ids))continue;
    try{
      const existing=localStorage.getItem(record.key),archivedStrength=strength(record.value),existingStrength=strength(existing);
      if(existing===null||archivedStrength>existingStrength){
        localStorage.setItem(record.key,String(record.value));
        restored++;
      }else kept++;
      const finalValue=localStorage.getItem(record.key);
      if(finalValue!==null&&strength(finalValue)>=archivedStrength)localStorage.removeItem(qKey);
    }catch(e){}
  }
  return{restored,kept};
}

export async function isolateLocalProgressOwner(){
  if(!isStudent())return{active:false};
  const ids=currentIds(),current=ids[0]||'';
  if(!current)return{active:false};
  const oldOwner=String(localStorage.getItem(OWNER_KEY)||'').trim();
  const same=!oldOwner||sameOwner(oldOwner,ids);
  let quarantined={moved:0,failed:0};

  if(oldOwner&&!same){
    quarantined=quarantineCurrentLocal(oldOwner);
    // Sicherheitsregel: Solange auch nur ein alter Lernstand nicht dauerhaft
    // archiviert werden konnte, wird der Besitzer NICHT gewechselt. Dadurch kann
    // nichts versehentlich dem neuen Schülerkonto zugeordnet werden.
    if(quarantined.failed>0){
      const blocked={
        active:true,currentId:current,oldOwner,sameAccount:false,switchedAccount:false,
        blocked:true,quarantined:quarantined.moved,quarantineFailed:quarantined.failed,restored:0
      };
      try{window.SP_ACCOUNT_PROGRESS_OWNER_ISOLATION=blocked;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_OWNER_ISOLATION_BLOCKED',{detail:blocked}))}catch(e){}
      return blocked;
    }
    try{localStorage.setItem(TRACKED_KEY,'[]')}catch(e){}
  }

  const recovery=restoreCurrentQuarantine(ids);
  try{
    localStorage.setItem(OWNER_KEY,current);
    if(!same)localStorage.setItem(TRACKED_KEY,JSON.stringify(localProgressEntries().map(([key])=>key));
  }catch(e){}

  const result={
    active:true,currentId:current,oldOwner,sameAccount:same,
    switchedAccount:!!(oldOwner&&!same),blocked:false,
    quarantined:quarantined.moved,quarantineFailed:0,
    restored:recovery.restored,keptLocal:recovery.kept
  };
  try{window.SP_ACCOUNT_PROGRESS_OWNER_ISOLATION=result;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_OWNER_ISOLATED',{detail:result}))}catch(e){}
  return result;
}
