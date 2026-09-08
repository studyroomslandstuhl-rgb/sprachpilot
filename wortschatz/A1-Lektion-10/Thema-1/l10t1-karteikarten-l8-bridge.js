(function(){
'use strict';
const SOURCE=window.L10T1||{};
const cards=Array.isArray(SOURCE.cards)?SOURCE.cards:[];
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const KEY='SP_L10_T1_karteikarten';
const SCHEMA=1;

function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function preview(){try{return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').toLowerCase())||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}}
const store=preview()?sessionStorage:localStorage;
const storageKey=preview()?KEY+'_PREVIEW':KEY;
function runNo(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function shuffle(values){const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function validIndex(i,total){const n=Number(i);return Number.isInteger(n)&&n>=0&&n<total}
function unique(values){return[...new Set((values||[]).map(Number).filter(Number.isInteger))]}
function blank(total){return{schema:SCHEMA,_run:runNo(),total,done:[],queue:shuffle([...Array(total).keys()]),reviewQueue:[],current:null,review:{},tries:{},firstSeen:[],firstCorrect:0,answers:{},updatedAt:new Date().toISOString()}}
function normalizeState(raw,total){
 total=Math.max(0,Number(total)||0);
 if(!raw||typeof raw!=='object'||Number(raw.schema)!==SCHEMA||Number(raw._run||1)!==runNo()||Number(raw.total)!==total)return blank(total);
 const base=blank(total),done=unique(raw.done).filter(i=>validIndex(i,total));
 const review={};for(const [k,v] of Object.entries(raw.review&&typeof raw.review==='object'?raw.review:{})){const i=Number(k),stage=Number(v);if(validIndex(i,total)&&!done.includes(i)&&stage>0)review[i]=stage}
 const tries={};for(const [k,v] of Object.entries(raw.tries&&typeof raw.tries==='object'?raw.tries:{})){const i=Number(k),n=Number(v);if(validIndex(i,total)&&n>0)tries[i]=n}
 const current=validIndex(raw.current,total)&&!done.includes(Number(raw.current))?Number(raw.current):null;
 const reviewQueue=unique([...(raw.reviewQueue||[]),...Object.keys(review).filter(k=>Number(review[k])===2).map(Number)]).filter(i=>validIndex(i,total)&&!done.includes(i)&&i!==current);
 const queue=unique(raw.queue).filter(i=>validIndex(i,total)&&!done.includes(i)&&i!==current&&!reviewQueue.includes(i));
 const missing=[...Array(total).keys()].filter(i=>!done.includes(i)&&i!==current&&!queue.includes(i)&&!reviewQueue.includes(i));
 queue.push(...shuffle(missing));
 return{...base,...raw,schema:SCHEMA,_run:runNo(),total,done,queue,reviewQueue,current,review,tries,firstSeen:unique(raw.firstSeen).filter(i=>validIndex(i,total)),firstCorrect:Math.max(0,Number(raw.firstCorrect)||0),answers:raw.answers&&typeof raw.answers==='object'?raw.answers:{}};
}
function load(theme,task,total){try{return normalizeState(JSON.parse(store.getItem(storageKey)||'null'),total)}catch(e){return blank(total)}}
function save(theme,task,state){const out=normalizeState(state,Math.max(0,Number(state?.total)||0));out._run=runNo();out.updatedAt=new Date().toISOString();try{store.setItem(storageKey,JSON.stringify(out))}catch(e){};try{window.dispatchEvent(new CustomEvent('sp:l10t1-progress-changed',{detail:{task:'karteikarten',state:out}}))}catch(e){};return out}
function first(state,index,ok){if(!state.firstSeen.includes(index)){state.firstSeen.push(index);if(ok)state.firstCorrect++}}
function nextIndex(theme,task,total){const s=load(theme,task,total);if(validIndex(s.current,total)&&!s.done.includes(Number(s.current)))return Number(s.current);while(s.queue.length&&s.done.includes(s.queue[0]))s.queue.shift();if(!s.queue.length)while(s.reviewQueue.length&&s.done.includes(s.reviewQueue[0]))s.reviewQueue.shift();if(!s.queue.length&&!s.reviewQueue.length){const missing=[...Array(total).keys()].filter(i=>!s.done.includes(i));if(missing.length)s.queue=shuffle(missing.filter(i=>Number(s.review?.[i]||0)!==2));if(!s.queue.length)s.reviewQueue=shuffle(missing)}const next=s.queue.length?s.queue.shift():s.reviewQueue.shift();s.current=validIndex(next,total)?Number(next):null;save(theme,task,s);return s.current}
function wrong(theme,task,total,index,answer){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return{s,tries:0,stage:0};first(s,i,false);s.current=i;s.answers[i]=answer;s.tries[i]=Number(s.tries[i]||0)+1;if(!s.review[i])s.review[i]=1;save(theme,task,s);return{s,tries:s.tries[i],stage:Number(s.review[i]||1)}}
function right(theme,task,total,index,answer){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return{s,needsReview:false};first(s,i,true);s.answers[i]=answer;const stage=Number(s.review[i]||0),tries=Number(s.tries[i]||0);let needsReview=false;if(stage===2){delete s.review[i];delete s.tries[i];s.reviewQueue=s.reviewQueue.filter(x=>Number(x)!==i);if(!s.done.includes(i))s.done.push(i)}else if(stage===1||tries>0){s.review[i]=2;s.tries[i]=0;s.queue=s.queue.filter(x=>Number(x)!==i);if(!s.reviewQueue.includes(i))s.reviewQueue.push(i);needsReview=true}else{delete s.review[i];delete s.tries[i];if(!s.done.includes(i))s.done.push(i)}s.current=null;save(theme,task,s);return{s,needsReview}}
function completeFree(theme,task,total,index,text){const s=load(theme,task,total),i=Number(index);if(!validIndex(i,total))return s;first(s,i,true);s.answers[i]=text;if(!s.done.includes(i))s.done.push(i);s.current=null;save(theme,task,s);return s}
function norm(v){return String(v??'').normalize('NFC').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function equal(answer,expected){const a=norm(answer);return(Array.isArray(expected)?expected:[expected]).some(x=>norm(x)===a)}
let activeAudio=null;
function tts(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function say(text,audioFile){if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0}catch(e){}activeAudio=null}if(audioFile){const raw=String(audioFile||''),src=/^https?:\/\//i.test(raw)?raw:`https://sprachpilot.b-cdn.net/audio/${raw.replace(/^audio\//i,'')}`;const a=new Audio(src);activeAudio=a;a.onerror=()=>{if(activeAudio===a)activeAudio=null;tts(text)};a.onended=()=>{if(activeAudio===a)activeAudio=null};a.play().catch(()=>tts(text));return}tts(text)}
function pid(){const p=readProfile();return String(p.authUid||p.studentId||p.uid||p.email||'student')}
function allDone(){const s=load(10,'karteikarten',cards.length);return s.done.length>=cards.length}
function reset(){if(preview()){sessionStorage.removeItem(storageKey);location.reload();return}if(!confirm('Fortschritte in Lektion 10 · Thema 1 löschen? Bereits verdiente Punkte bleiben erhalten.'))return;const del=[];for(let i=0;i<localStorage.length;i++){const k=String(localStorage.key(i)||'');if(k.startsWith('SP_L10_T1_'))del.push(k)}del.forEach(k=>localStorage.removeItem(k));location.href='index.html?reset='+Date.now()}

const items=cards.map(card=>({
 ...card,
 term:String(card.full||card.term||card.word||''),
 word:String(card.full||card.term||card.word||''),
 answers:[card.full,card.term,card.word].filter(Boolean),
 accepted:[card.full,card.term,card.word].filter(Boolean),
 hint:'Achte auf den Artikel und die genaue Wortform.'
}));
window.L8_THEME={number:10,title:'Körper und Körperteile',subtitle:'Körper und Körperteile',tasks:[{id:'karteikarten',kind:'cards',title:'Karteikarten',instruction:'Lerne die Wörter.',items}]};
window.L8S={profile:readProfile,preview,pid,load,save,nextIndex,wrong,right,completeFree,equal,norm,say,allDone,reset,runNo,stateSchema:SCHEMA};
window.L10T1CardBridgeReady=items.length>0;
})();
