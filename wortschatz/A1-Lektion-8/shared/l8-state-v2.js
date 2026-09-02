(function(){
'use strict';
if(window.__SP_L8_STATE_V2)return;window.__SP_L8_STATE_V2=true;
const VERSION=2;
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'');
const unique=a=>[...new Set((a||[]).map(Number).filter(Number.isInteger))];
const shuffled=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const previewMemory=new Map();
function readJson(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}}
function profile(){return readJson('SP_USER_PROFILE')||readJson('SP_STUDENT_PROFILE')||{}}
function role(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').toLowerCase()}
function preview(){
 const context=String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase(),p=profile();
 const explicit=p.previewOnly===true||p.teacherPreview===true||p.studentCoursePreview===true;
 const flag=sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
 return context==='teacher-student-preview'&&(explicit||flag);
}
function browserId(){let id=clean(localStorage.getItem('SP_L8_BROWSER_PID_V2'));if(id)return id;try{id='browser_'+crypto.randomUUID().replace(/-/g,'')}catch(e){id='browser_'+Date.now().toString(36)+Math.random().toString(36).slice(2)};try{localStorage.setItem('SP_L8_BROWSER_PID_V2',id)}catch(e){}return id}
function resolvedProfileId(){
 const p=profile(),course=p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||'',name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_');
 const candidates=[p.authUid,p.canonicalStudentId,p.courseDocId,p.docId,p.studentId,p.uid,p.userId,p.id,localStorage.getItem('SP_STUDENT_ID'),p.email,course&&(p.email||name)?`${course}_${p.email||name}`:''];
 return candidates.map(clean).find(Boolean)||'';
}
function pid(){
 if(preview())return'teacher_preview';
 const resolved=resolvedProfileId();
 let active=clean(localStorage.getItem('SP_L8_ACTIVE_PID_V2'));
 let owner=clean(localStorage.getItem('SP_L8_ACTIVE_OWNER_V2'));
 if(resolved){
  if(!active){active=resolved;try{localStorage.setItem('SP_L8_ACTIVE_PID_V2',active)}catch(e){}}
  else if(owner&&owner!==resolved){active=resolved;try{localStorage.setItem('SP_L8_ACTIVE_PID_V2',active)}catch(e){}}
  if(owner!==resolved){owner=resolved;try{localStorage.setItem('SP_L8_ACTIVE_OWNER_V2',owner)}catch(e){}}
  return active;
 }
 if(active)return active;
 active=browserId();try{localStorage.setItem('SP_L8_ACTIVE_PID_V2',active)}catch(e){}
 return active;
}
const prefix=()=>preview()?'SP_L8V2_PREVIEW':'SP_L8V2';
function runNo(theme){const key=`SP_SCORE_RUN_wortschatz-a1-lektion-8-thema-${Number(theme)}`;return Math.max(1,Math.min(3,Number(localStorage.getItem(key))||1))}
function key(theme,task){theme=Number(theme);if(theme===1)return`${prefix()}_${pid()}_T1_R${runNo(theme)}_REV20260825_TASKS5_${String(task)}`;return`${prefix()}_${pid()}_T${theme}_${String(task)}`}
function blank(total){total=Math.max(0,Number(total)||0);return{schema:VERSION,total,done:[],queue:shuffled([...Array(total).keys()]),reviewQueue:[],current:null,review:{},tries:{},firstSeen:[],firstCorrect:0,answers:{},updatedAt:new Date().toISOString()}}
function validIndex(i,total){if(i===null||i===undefined||i==='')return false;const n=Number(i);return Number.isInteger(n)&&n>=0&&n<total}
function normalizeState(raw,total){
 total=Math.max(0,Number(total)||0);const base=blank(total),x=raw&&typeof raw==='object'&&Number(raw.schema)===VERSION?raw:{},done=unique(x.done).filter(i=>validIndex(i,total));
 const review={};for(const [k,v] of Object.entries(x.review&&typeof x.review==='object'?x.review:{})){const i=Number(k),stage=Number(v);if(validIndex(i,total)&&!done.includes(i)&&stage>0)review[i]=stage}
 const tries={};for(const [k,v] of Object.entries(x.tries&&typeof x.tries==='object'?x.tries:{})){const i=Number(k),n=Number(v);if(validIndex(i,total)&&n>0)tries[i]=n}
 let current=validIndex(x.current,total)&&!done.includes(Number(x.current))?Number(x.current):null;
 const reviewQueue=unique([...(x.reviewQueue||[]),...Object.keys(review).filter(k=>Number(review[k])===2).map(Number)]).filter(i=>validIndex(i,total)&&!done.includes(i)&&i!==current);
 const queue=unique(x.queue).filter(i=>validIndex(i,total)&&!done.includes(i)&&i!==current&&!reviewQueue.includes(i));
 const missing=[...Array(total).keys()].filter(i=>!done.includes(i)&&i!==current&&!queue.includes(i)&&!reviewQueue.includes(i));queue.push(...shuffled(missing));
 return{...base,...x,schema:VERSION,total,done,queue,reviewQueue,current,review,tries,firstSeen:unique(x.firstSeen).filter(i=>validIndex(i,total)),firstCorrect:Math.max(0,Number(x.firstCorrect)||0),answers:x.answers&&typeof x.answers==='object'?x.answers:{}};
}
function load(theme,task,total){
 const storageKey=key(theme,task);
 if(preview())return normalizeState(previewMemory.get(storageKey)||null,total);
 try{return normalizeState(JSON.parse(localStorage.getItem(storageKey)||'null'),total)}catch(e){return blank(total)}
}
function save(theme,task,state,doSync=true){
 const out=normalizeState(state,Math.max(0,Number(state?.total)||0));out.updatedAt=new Date().toISOString();
 const storageKey=key(theme,task);
 if(preview()){previewMemory.set(storageKey,out);return out}
 localStorage.setItem(storageKey,JSON.stringify(out));
 if(doSync)try{window.L8ThemeScore?.recordState?.(theme,task,out)}catch(e){}
 return out;
}
function first(s,index,ok){if(!s.firstSeen.includes(index)){s.firstSeen.push(index);if(ok)s.firstCorrect++}}
function nextIndex(theme,task,total){const s=load(theme,task,total);if(validIndex(s.current,total)&&!s.done.includes(Number(s.current)))return Number(s.current);while(s.queue.length&&s.done.includes(s.queue[0]))s.queue.shift();if(!s.queue.length){while(s.reviewQueue.length&&s.done.includes(s.reviewQueue[0]))s.reviewQueue.shift()}if(!s.queue.length&&!s.reviewQueue.length){const missing=[...Array(total).keys()].filter(i=>!s.done.includes(i));if(missing.length)s.queue=shuffled(missing.filter(i=>Number(s.review?.[i]||0)!==2));if(!s.queue.length)s.reviewQueue=shuffled(missing)}const next=s.queue.length?s.queue.shift():s.reviewQueue.shift();s.current=validIndex(next,total)?Number(next):null;save(theme,task,s,false);return s.current}
function wrong(theme,task,total,index,answer){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return{s,tries:0,stage:0};first(s,i,false);s.current=i;s.answers[i]=answer;s.tries[i]=Number(s.tries[i]||0)+1;if(!s.review[i])s.review[i]=1;save(theme,task,s);return{s,tries:s.tries[i],stage:Number(s.review[i]||1)}}
function right(theme,task,total,index,answer){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return{s,needsReview:false};first(s,i,true);s.answers[i]=answer;const stage=Number(s.review[i]||0),tries=Number(s.tries[i]||0);let needsReview=false;if(stage===2){delete s.review[i];delete s.tries[i];s.reviewQueue=s.reviewQueue.filter(x=>Number(x)!==i);if(!s.done.includes(i))s.done.push(i)}else if(stage===1||tries>0){s.review[i]=2;s.tries[i]=0;s.queue=s.queue.filter(x=>Number(x)!==i);if(!s.reviewQueue.includes(i))s.reviewQueue.push(i);needsReview=true}else{delete s.review[i];delete s.tries[i];if(!s.done.includes(i))s.done.push(i)}s.current=null;save(theme,task,s);return{s,needsReview}}
function completeFree(theme,task,total,index,text){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return s;first(s,i,true);s.answers[i]=text;if(!s.done.includes(i))s.done.push(i);delete s.review[i];delete s.tries[i];s.queue=s.queue.filter(x=>Number(x)!==i);s.reviewQueue=s.reviewQueue.filter(x=>Number(x)!==i);s.current=null;save(theme,task,s);return s}
function doneCount(theme,task,total){return load(theme,task,total).done.length}
function pct(theme,task,total){total=Math.max(0,Number(total)||0);if(!total)return 0;const done=doneCount(theme,task,total);return done>=total?100:Math.min(99,Math.round(done/total*100))}
function allDone(theme){const T=window.L8_THEME;if(!T)return false;if(preview())return true;return (T.tasks||[]).filter(t=>!t.exam).every(t=>{const total=Array.isArray(t.items)?t.items.length:0;return total>0&&doneCount(theme,t.id,total)>=total})}
function reset(theme){if(preview()){alert('In der Lehrer-Vorschau werden keine Teilnehmerfortschritte gespeichert.');return}if(!confirm(`Fortschritte in Lektion 8 · Thema ${theme} löschen? Bereits verdiente Punkte bleiben erhalten.`))return;const prefixes=[`SP_L8V2_${pid()}_T${theme}_`,`SP_L8_${pid()}_T${theme}_`],del=[];for(let i=0;i<localStorage.length;i++){const k=String(localStorage.key(i)||'');if(prefixes.some(p=>k.startsWith(p)))del.push(k)}del.forEach(k=>localStorage.removeItem(k));location.href='index.html?reset='+Date.now()}
function norm(v){return String(v??'').normalize('NFC').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function equal(answer,expected){const a=norm(answer);return(Array.isArray(expected)?expected:[expected]).some(x=>norm(x)===a)}
let activeAudio=null;
function say(text,audioFile){if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0}catch(e){}activeAudio=null}if(audioFile){const raw=String(audioFile||''),src=/^https?:\/\//i.test(raw)?raw:`https://sprachpilot.b-cdn.net/audio/${raw.replace(/^audio\//i,'')}`;const a=new Audio(src);activeAudio=a;a.onerror=()=>{if(activeAudio===a)activeAudio=null;tts(text)};a.onended=()=>{if(activeAudio===a)activeAudio=null};a.play().catch(()=>tts(text));return}tts(text)}
function tts(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
window.L8S={profile,preview,pid,key,load,save,nextIndex,wrong,right,completeFree,pct,allDone,reset,norm,equal,say,stateSchema:VERSION,runNo};
})();