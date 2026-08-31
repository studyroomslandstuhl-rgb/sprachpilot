(function(root){
  'use strict';
  const CORE_REVISION=10;
  if(Number(root.SPAccountProgressCloudCore?.CORE_REVISION||0)>=CORE_REVISION)return;

  const AUTHORITY_VERSION=1;
  const STATE_VERSION=9;
  const INTERNAL_PREFIX='SP_ACCOUNT_PROGRESS_';
  const MAX_ENTRY_CHARS=180000;
  const MAX_ENTRIES=700;
  const MAX_TOTAL_CHARS=700000;

  function parse(v,f=null){try{return JSON.parse(v||'')}catch(e){return f}}
  function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function denied(key){
    const k=String(key||'');
    if(!k||k.startsWith(INTERNAL_PREFIX))return true;
    if(['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_COURSE_CODE','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_AUTH_ROLE','SP_KEEP_LOGGED_IN','SP_MOTHER_LANGUAGE_CODE','motherLanguage','muttersprache','SP_TEACHER_PREVIEW','SP_L7_STABLE_PID'].includes(k))return true;
    // Alte Standard-Schlüssel waren nur nach Dateiname benannt (z. B. karteikarten.html)
    // und konnten dadurch Fortschritt verschiedener Themen vermischen. Ab V2 werden
    // ausschließlich themenspezifische Standard-Schlüssel synchronisiert.
    if(/^SP_TASK_STATE_(?!V2_)/i.test(k))return true;
    // L4-L6 besitzen bereits strukturierte Firebase-Themenstände via progress.js.
    // Die rohen Browserzustände dürfen nicht zusätzlich als zweite Cloud-Wahrheit
    // transportiert werden, sonst kann ein alter Geräte-Run einen Reset rückgängig machen.
    if(/^SP_L4_T1_V2_/i.test(k)||/^SP_L4_T2_FINAL_V3_/i.test(k)||/^SP_L4_T3_V2_/i.test(k))return true;
    if(/^SP_L5_T1_V1_/i.test(k)||/^SP_L5_T2_V1_/i.test(k)||/^SP_L5_T3_V2_/i.test(k))return true;
    if(/^SP_L6_T1_V1_/i.test(k)||/^SP_L6_T2_V1_/i.test(k)||/^SP_L6_T3_V1_/i.test(k)||/^SP_L6_T4_V2_/i.test(k))return true;
    // L7/L8 besitzen eine absichtlich nicht monotone Übungsansicht. Sichtbare Rohstände
    // werden nicht kontoweit gemergt; synchronisiert werden die Run-Ledger.
    if(/^SP_L[78]_.+_T\d+_/i.test(k))return true;
    if(/PASSWORD|PASSWORT|TOKEN|SECRET|CREDENTIAL|AUTH_TOKEN|ID_TOKEN|REFRESH_TOKEN/i.test(k))return true;
    if(/^(?:SP_)?(?:TEACHER|ADMIN|OWNER|COURSE_INVITE|INVITE|FIREBASE)/i.test(k))return true;
    if(/(?:_CACHE|CACHE_|ASSET_|IMAGE_|AUDIO_)/i.test(k))return true;
    return false;
  }
  function progressObject(value,depth=0){
    if(!value||typeof value!=='object'||depth>3||Array.isArray(value))return false;
    const markers=['done','queue','current','tries','hadWrong','answers','progress','percent','progressPercent','completed','completedTasks','score','bestScore','stars','points','attempts','known','unknown','unsure','learned','learnedVerbs','activeVerbs','exam','runs','currentRun'];
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
      if(!v||typeof v!=='object'||d>5||seen.has(v))return;seen.add(v);
      if(Array.isArray(v)){score+=v.length*10;return}
      for(const[k,x]of Object.entries(v)){
        const key=String(k).toLowerCase();
        if(Array.isArray(x)){
          if(/done|known|learned|completed|firstseen|assessed/.test(key))score+=x.length*10000;
          else if(/queue/.test(key))score+=Math.max(0,1000-x.length);
          else score+=x.length*10;
        }else if(typeof x==='number'&&Number.isFinite(x)){
          if(/percent|progress/.test(key))score+=Math.max(0,x)*1000;
          else if(/correct|done|completed|score|points|stars|attempt|run|reset/.test(key))score+=Math.max(0,x)*100;
        }else if(typeof x==='boolean'&&x&&/completed|finished|done|passed/.test(key))score+=100000;
        else if(x&&typeof x==='object')walk(x,d+1);
      }
    }
    walk(parsed);return score;
  }
  function timeOf(v){
    if(!v||typeof v!=='object')return 0;
    const values=[v.updatedAt,v.lastActiveAt,v.completedAt,v.lastAttemptAt,v.resetAt,v.startedAt];
    let best=0;
    for(const x of values){const n=typeof x==='number'?x:Date.parse(String(x||''));if(Number.isFinite(n))best=Math.max(best,n)}
    return best;
  }
  function stableValue(v){try{return JSON.stringify(v)}catch(e){return String(v)}}
  function unionArray(a=[],b=[]){
    const out=[],seen=new Set();
    for(const value of [...a,...b]){const key=stableValue(value);if(seen.has(key))continue;seen.add(key);out.push(value)}
    return out;
  }
  function monotoneNumberKey(key){return /(?:percent|progress|score|best|correct|points?|stars?|attempts?|total|done|completed|learned|known|unknown|unsure|resets?|finishedruns|currentrun|revision|firstcorrect|count)$/i.test(String(key||''))}
  function monotoneBooleanKey(key){return /(?:completed|finished|done|passed|attempted|unlocked|known|learned)$/i.test(String(key||''))}
  function mergeParsed(a,b,key='',depth=0){
    if(a===undefined||a===null)return b;
    if(b===undefined||b===null)return a;
    if(depth>10)return strength(JSON.stringify(a))>=strength(JSON.stringify(b))?a:b;
    if(Array.isArray(a)&&Array.isArray(b))return unionArray(a,b);
    if(typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
      const ta=timeOf(a),tb=timeOf(b),out={...(tb>=ta?a:b),...(tb>=ta?b:a)};
      for(const child of new Set([...Object.keys(a),...Object.keys(b)]))out[child]=mergeParsed(a[child],b[child],child,depth+1);
      normalizeTaskLike(out,a,b);
      return out;
    }
    if(typeof a==='number'&&typeof b==='number'){
      if(monotoneNumberKey(key))return Math.max(a,b);
      return b;
    }
    if(typeof a==='boolean'&&typeof b==='boolean')return monotoneBooleanKey(key)?(a||b):b;
    if(/(?:updatedat|lastactiveat|completedat|lastattemptat|resetat|startedat)$/i.test(String(key||''))){
      const at=Date.parse(String(a||'')),bt=Date.parse(String(b||''));if(Number.isFinite(at)||Number.isFinite(bt))return (Number.isFinite(bt)?bt:0)>=(Number.isFinite(at)?at:0)?b:a;
    }
    return b;
  }
  function normalizeTaskLike(out,a,b){
    if(!out||typeof out!=='object'||Array.isArray(out))return out;
    const taskish=('done'in out)||('queue'in out)||('percent'in out)||('progress'in out)||('completed'in out);
    if(!taskish)return out;
    if(Array.isArray(a?.done)||Array.isArray(b?.done)||Array.isArray(out.done))out.done=unionArray(Array.isArray(a?.done)?a.done:[],Array.isArray(b?.done)?b.done:[]);
    if(Array.isArray(a?.firstSeen)||Array.isArray(b?.firstSeen))out.firstSeen=unionArray(Array.isArray(a?.firstSeen)?a.firstSeen:[],Array.isArray(b?.firstSeen)?b.firstSeen:[]);
    if(Array.isArray(a?.known)||Array.isArray(b?.known))out.known=unionArray(Array.isArray(a?.known)?a.known:[],Array.isArray(b?.known)?b.known:[]);
    if(Array.isArray(a?.learned)||Array.isArray(b?.learned))out.learned=unionArray(Array.isArray(a?.learned)?a.learned:[],Array.isArray(b?.learned)?b.learned:[]);
    const total=Math.max(Number(a?.total)||0,Number(b?.total)||0,Number(out.total)||0);
    if(total>0)out.total=total;
    if(Array.isArray(out.done)&&total>0){
      const numeric=out.done.every(x=>Number.isInteger(Number(x)));
      if(numeric)out.done=[...new Set(out.done.map(Number).filter(i=>i>=0&&i<total))].sort((x,y)=>x-y);
      const doneCount=out.done.length;
      out.percent=Math.max(Number(a?.percent??a?.progress??0)||0,Number(b?.percent??b?.progress??0)||0,Math.round(doneCount/total*100));
      out.completed=!!(a?.completed||b?.completed||doneCount>=total);
      if(Array.isArray(a?.queue)||Array.isArray(b?.queue)){
        if(numeric)out.queue=[...Array(total).keys()].filter(i=>!out.done.includes(i));
        else out.queue=unionArray(Array.isArray(a?.queue)?a.queue:[],Array.isArray(b?.queue)?b.queue:[]).filter(x=>!out.done.includes(x));
      }
      if(out.current!==null&&out.current!==undefined&&out.done.includes(out.current))out.current=null;
    }else{
      if('percent'in out||'progress'in out)out.percent=Math.max(Number(a?.percent??a?.progress??0)||0,Number(b?.percent??b?.progress??0)||0);
      if('completed'in out)out.completed=!!(a?.completed||b?.completed);
    }
    return out;
  }
  function mergeValues(aRaw,bRaw){
    if(aRaw==null)return bRaw==null?null:String(bRaw);
    if(bRaw==null)return String(aRaw);
    const a=parse(String(aRaw),null),b=parse(String(bRaw),null);
    if(a&&b&&typeof a==='object'&&typeof b==='object'){
      try{return JSON.stringify(mergeParsed(a,b,'',0))}catch(e){}
    }
    const as=strength(aRaw),bs=strength(bRaw);return bs>as?String(bRaw):String(aRaw);
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
      if(!old)out.set(e.key,e);
      else out.set(e.key,{key:e.key,value:mergeValues(old.value,e.value),deleted:false,updatedAt:Math.max(old.updatedAt,e.updatedAt)});
    });
    return out;
  }
  function mergeRemote(target,source){
    for(const[k,e]of source||[]){
      if(!e||e.deleted||e.value==null)continue;
      const old=target.get(k);
      if(!old)target.set(k,{...e,deleted:false});
      else target.set(k,{key:k,value:mergeValues(old.value,e.value),deleted:false,updatedAt:Math.max(Number(old.updatedAt)||0,Number(e.updatedAt)||0)});
    }
    return target;
  }
  function chooseCloudOrPending(remote,pending){
    if(!pending)return{value:remote?.value??null,source:remote?'cloud':'none'};
    if(!remote)return{value:pending.value,source:'pending'};
    return{value:mergeValues(remote.value,pending.value),source:'merged'};
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

  root.SPAccountProgressCloudCore={CORE_REVISION,AUTHORITY_VERSION,STATE_VERSION,INTERNAL_PREFIX,parse,clean,denied,eligible,strength,mergeValues,enc,positiveEntries,mergeRemote,chooseCloudOrPending,buildMap,validJournal};
})(typeof window!=='undefined'?window:globalThis);
