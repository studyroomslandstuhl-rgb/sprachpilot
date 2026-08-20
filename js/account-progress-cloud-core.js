(function(root){
  'use strict';
  if(root.SPAccountProgressCloudCore)return;

  const AUTHORITY_VERSION=1;
  const STATE_VERSION=7;
  const INTERNAL_PREFIX='SP_ACCOUNT_PROGRESS_';
  const MAX_ENTRY_CHARS=180000;
  const MAX_ENTRIES=700;
  const MAX_TOTAL_CHARS=700000;

  function parse(v,f=null){try{return JSON.parse(v||'')}catch(e){return f}}
  function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
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
    if(Object.keys(value).some(k=>markers.includes(k)))return true;
    return Object.values(value).slice(0,30).some(v=>progressObject(v,depth+1));
  }
  function eligible(key,value){
    if(denied(key))return false;
    const k=String(key||''),raw=String(value??'');
    if(raw.length>MAX_ENTRY_CHARS)return false;
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
    const n=Number(raw);
    if(!parsed||typeof parsed!=='object')return Number.isFinite(n)?Math.max(0,n):0;
    let score=0,seen=new Set();
    function walk(v,d=0){
      if(!v||typeof v!=='object'||d>4||seen.has(v))return;seen.add(v);
      if(Array.isArray(v)){score+=v.length*10;return}
      for(const[k,x]of Object.entries(v)){
        const key=String(k).toLowerCase();
        if(Array.isArray(x)){
          if(/done|known|learned|completed|firstseen|assessed/.test(key))score+=x.length*10000;
          else if(/queue/.test(key))score+=Math.max(0,1000-x.length);
          else score+=x.length*10;
        }else if(typeof x==='number'&&Number.isFinite(x)){
          if(/percent|progress/.test(key))score+=Math.max(0,x)*1000;
          else if(/correct|done|completed|score|points|stars|attempt/.test(key))score+=Math.max(0,x)*100;
        }else if(typeof x==='boolean'&&x&&/completed|finished|done|passed/.test(key))score+=100000;
        else if(x&&typeof x==='object')walk(x,d+1);
      }
    }
    walk(parsed);return score;
  }
  function enc(key){
    try{const bytes=new TextEncoder().encode(String(key));let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}
    catch(e){return clean(key)}
  }
  function positiveEntries(map){
    const out=new Map();if(!map||typeof map!=='object')return out;
    Object.values(map).forEach(raw=>{
      if(!raw||typeof raw!=='object'||!raw.key||raw.deleted||raw.value==null||denied(raw.key))return;
      const e={key:String(raw.key),value:String(raw.value),deleted:false,updatedAt:Number(raw.updatedAt)||0};
      const old=out.get(e.key);
      if(!old||strength(e.value)>strength(old.value)||(strength(e.value)===strength(old.value)&&e.updatedAt>old.updatedAt))out.set(e.key,e);
    });
    return out;
  }
  function mergeRemote(target,source){
    for(const[k,e]of source||[]){
      if(!e||e.deleted||e.value==null)continue;
      const old=target.get(k);
      if(!old||strength(e.value)>strength(old.value)||(strength(e.value)===strength(old.value)&&(e.updatedAt||0)>(old.updatedAt||0)))target.set(k,{...e,deleted:false});
    }
    return target;
  }
  function chooseCloudOrPending(remote,pending){
    if(!pending)return{value:remote?.value??null,source:remote?'cloud':'none'};
    if(!remote)return{value:pending.value,source:'pending'};
    const rs=strength(remote.value),ps=strength(pending.value);
    if(rs>ps)return{value:remote.value,source:'cloud'};
    if(rs===ps&&(Number(remote.updatedAt)||0)>(Number(pending.updatedAt)||0))return{value:remote.value,source:'cloud'};
    return{value:pending.value,source:'pending'};
  }
  function buildMap(entries){
    const list=[...entries.values()].filter(e=>e&&e.key&&e.value!=null&&!e.deleted&&!denied(e.key)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    const out={};let chars=0,count=0;
    for(const e of list){
      const len=String(e.value||'').length,est=len+String(e.key).length+80;
      if(len>MAX_ENTRY_CHARS||count>=MAX_ENTRIES||chars+est>MAX_TOTAL_CHARS)continue;
      out[enc(e.key)]={key:e.key,value:String(e.value),deleted:false,updatedAt:Number(e.updatedAt)||Date.now()};chars+=est;count++;
    }
    return out;
  }
  function validJournal(raw,ownerUid,studentId){
    const journal=typeof raw==='string'?parse(raw,null):raw;
    if(!journal||typeof journal!=='object')return{ownerUid:String(ownerUid||''),studentId:String(studentId||''),entries:{}};
    if(String(journal.ownerUid||'')!==String(ownerUid||'')||String(journal.studentId||'')!==String(studentId||''))return{ownerUid:String(ownerUid||''),studentId:String(studentId||''),entries:{}};
    const entries={};
    for(const [key,e] of Object.entries(journal.entries||{})){
      if(!e||e.value==null||!eligible(key,e.value))continue;
      entries[key]={value:String(e.value),updatedAt:Number(e.updatedAt)||0};
    }
    return{ownerUid:String(ownerUid||''),studentId:String(studentId||''),entries};
  }

  root.SPAccountProgressCloudCore={AUTHORITY_VERSION,STATE_VERSION,INTERNAL_PREFIX,parse,clean,denied,eligible,strength,enc,positiveEntries,mergeRemote,chooseCloudOrPending,buildMap,validJournal};
})(typeof window!=='undefined'?window:globalThis);
