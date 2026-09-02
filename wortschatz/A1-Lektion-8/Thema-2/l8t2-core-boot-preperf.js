(function(){
'use strict';
if(window.__SP_L8T2_CORE_PERF_FIX)return;
window.__SP_L8T2_CORE_PERF_FIX=true;

const WAIT_MS=5000;
const READY_KEYS=[
 'L8_CONTENT_READY','L8_T2_TIME_REVIEW_READY','L8_T2_QUALITY_READY','L8_T2_CURRENT_READY',
 'L8_T2_TRANSLATIONS_READY','L8_T2_VOCAB_READY','L8_T2_EXTRA_TRANSLATIONS_READY',
 'L8_T2_MEDIA_FIXES_READY','L8_T2_VOCAB_FINAL_READY','L8_T2_TASK2_PLURAL_READY',
 'L8_T2_TASK3_SEIT_VOR_READY','L8_T2_TASK4_6_READY','L8_T2_TASK6_SIMPLE_READY',
 'L8_T2_DIALOG_GRAMMAR_READY','L8_T2_TASK7_9_READY','L8_T2_TASK7_8_POLISH_READY',
 'L8_T2_TASK10_BIOGRAFIE_TEXT_READY','L8_T2_VOCAB_PRACTICE_READY'
];
const PENDING_KEYS=['L8_T2_TIME_REVIEW_PENDING','L8_T2_QUALITY_PENDING','L8_T2_VOCAB_PENDING','L8_T2_VOCAB_FINAL_PENDING'];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let stateV2Promise=null;
let started=false;
function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){return{}}}
function teacherAccess(){const roles=['teacher','lehrer','admin','owner','superadmin'];const stored=['SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE'].map(key=>String(localStorage.getItem(key)||'').trim().toLowerCase());if(stored.some(value=>roles.includes(value)))return true;const access=String(window.SP_SECURE_ACCESS?.type||'').toLowerCase();if(access==='teacher'||access==='teacher-preview')return true;if(window.spTeacherCanSeeAll===true)return true;const profiles=[readJson('SP_TEACHER_PROFILE'),readJson('SP_USER_PROFILE')];return profiles.some(p=>p?.isTeacher===true||p?.teacher===true||p?.admin===true||p?.owner===true||roles.includes(String(p?.role||p?.loginRole||p?.type||p?.accountType||'').toLowerCase()))}
function installTeacherExamAccess(){if(!teacherAccess()||!window.L8S)return false;try{window.L8S.preview=()=>true}catch(e){}try{window.L8S.allDone=()=>true}catch(e){}try{window.spTeacherCanSeeAll=true}catch(e){}return true}
function ensureTeacherExamReader(){if(!teacherAccess())return;import('/js/sp-teacher-exam-reader.js?v=20260902-1').then(()=>setTimeout(()=>window.SPTeacherExamReader?.run?.(),0)).catch(()=>{})}

function ensureStateV2(){
 if(window.__SP_L8_STATE_V2&&window.L8S?.stateSchema===2&&typeof window.L8S?.runNo==='function')return Promise.resolve(true);
 if(stateV2Promise)return stateV2Promise;
 stateV2Promise=new Promise(resolve=>{
  const existing=[...document.scripts].find(s=>String(s.src||'').includes('/l8-state-v2.js'));
  if(existing){
   if(window.L8S?.stateSchema===2)return resolve(true);
   existing.addEventListener('load',()=>resolve(window.L8S?.stateSchema===2),{once:true});
   existing.addEventListener('error',()=>resolve(false),{once:true});
   setTimeout(()=>resolve(window.L8S?.stateSchema===2),1500);
   return;
  }
  const s=document.createElement('script');
  s.src='../shared/l8-state-v2.js?v=20260902-previewfix1';
  s.onload=()=>resolve(window.L8S?.stateSchema===2);
  s.onerror=()=>resolve(false);
  document.head.appendChild(s);
 });
 return stateV2Promise;
}
function uniqueReadyPromises(){const seen=new Set(),out=[];for(const key of READY_KEYS){const value=window[key];if(!value||typeof value.then!=='function'||seen.has(value))continue;seen.add(value);out.push(Promise.resolve(value))}return out}
async function waitForContent(){const promises=uniqueReadyPromises();if(!promises.length)return'empty';return Promise.race([Promise.allSettled(promises).then(()=>'settled'),sleep(WAIT_MS).then(()=>'timeout')])}
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()}
function resolveThemeNumber(){const fromBody=Number(document.body?.dataset?.theme||0);const fromPath=Number(location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0);return fromBody||fromPath||Number(window.L8_THEME?.number||0)||0}
function normalizeThemeIdentity(){const n=resolveThemeNumber();if(!n)return null;const all=window.L8_ALL_THEMES||{},theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)||window.L8_THEME;if(!theme)return null;theme.number=n;if(!theme.title)theme.title=`Thema ${n}`;window.L8_THEME=theme;return theme}
function reinstallSafeAudio(){try{window.L8AudioCoreSafeV3?.install?.()}catch(error){console.error('L8 sichere Audiofunktion konnte nicht installiert werden',error)}}
function finalizeCardMedia(theme){if(!theme)return;try{window.L8CardBunnyStandardV4?.patchTheme?.(theme)}catch(error){console.error('L8 Bunny-Medien der Karteikarten konnten nicht finalisiert werden',error)}}
function taskText(task){const items=(Array.isArray(task?.items)?task.items:[]).slice(0,6).map(item=>`${item?.type||''} ${item?.prompt||''} ${item?.context||''} ${item?.hint||''}`).join(' ');return norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''} ${task?.instruction||''} ${task?.intro||''} ${items}`)}
function taskEmoji(task){const text=taskText(task),types=new Set((Array.isArray(task?.items)?task.items:[]).map(item=>String(item?.type||'').toLowerCase()));if(task?.exam||/prufung|exam/.test(text))return'⭐';if(/karte|card/.test(text)||task?.kind==='cards')return'📚';if(/memory/.test(text))return'🧠';if(/hor|listen|audio/.test(text)||(task?.items||[]).some(item=>item?.audio||item?.audioFile))return'🎧';if(/lesen|reading|text versteh|leseversteh/.test(text))return'📖';if(/grammatik|grammar|satzteil/.test(text))return'🧲';if(/konjug|\bsein\b|\bhaben\b/.test(text))return'🔤';if(/endung|gruppe|sort|zuord/.test(text))return'📦';if(/ordnen|order|reihenfolge|redemittel/.test(text)||types.has('order'))return'🧩';if(/schreib|write|lucke|text|brief|information|markier|plural/.test(text)||types.has('input')||types.has('free'))return'✍️';if(/wahl|choice|artikel|richtig|falsch|uberschrift|fehler/.test(text)||types.has('choice'))return'✅';if(task?.icon)return String(task.icon);return'✅'}
function polishHeader(){const t=normalizeThemeIdentity();if(!t)return;const n=resolveThemeNumber();const taskId=new URLSearchParams(location.search).get('task');const task=(t.tasks||[]).find(x=>x.id===taskId);const subtitle=document.querySelector('.sp-header__subtitle');if(subtitle)subtitle.textContent=task?`${task.title} · A1 Lektion 8 · Thema ${n}`:`${t.title} · A1 Lektion 8 · Thema ${n}`;document.querySelectorAll('.sp-header__nav-link').forEach(link=>{if(String(link.textContent||'').trim()==='Übersicht'&&link.tagName==='A')link.setAttribute('href','uebersicht.html')})}
function polishTaskEmojis(){const t=normalizeThemeIdentity();if(!t||!Array.isArray(t.tasks))return;if(document.body.dataset.page==='theme'){document.querySelectorAll('.l8-task-card').forEach((card,index)=>{const task=t.tasks[index],node=card.querySelector('.emoji');if(task&&node)node.textContent=taskEmoji(task)});return}const taskId=new URLSearchParams(location.search).get('task'),task=t.tasks.find(item=>String(item?.id)===String(taskId));const line=document.querySelector('.l8-task-title-block p');if(task&&line)line.textContent=`${taskEmoji(task)} ${task.instruction||''}`}
function showStartError(message){const root=document.getElementById('app');if(root)root.innerHTML=`<div class="l8-wrap"><section class="l8-card"><h2>Die Seite konnte nicht vollständig geladen werden.</h2><p>${message}</p><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>`}
async function start(){
 if(started)return;started=true;
 const [stateReady,contentState]=await Promise.all([ensureStateV2(),waitForContent()]);
 installTeacherExamAccess();
 const theme=normalizeThemeIdentity();
 if(contentState==='timeout'){for(const key of PENDING_KEYS)if(window[key])console.warn(`L8T2: ${key} nach ${WAIT_MS} ms noch aktiv; Start wird nicht weiter blockiert.`)}
 if(!stateReady||!window.L8S||window.L8S.stateSchema!==2){showStartError('Das Fortschrittssystem ist nicht bereit.');return}
 if(!theme||!window.L8UI){showStartError('Die Lerninhalte oder die Benutzeroberfläche sind nicht bereit.');return}
 installTeacherExamAccess();
 finalizeCardMedia(theme);reinstallSafeAudio();
 try{window.L8T2BiographyPairs?.install?.()}catch(error){console.error('L8T2 Biografien-UI',error)}
 try{window.L8T2BiographyWrite?.install?.()}catch(error){console.error('L8T2 Biografie-Schreib-UI',error)}
 if(document.body.dataset.page==='theme')window.L8UI.themeOverview();else window.L8UI.taskPage();
 ensureTeacherExamReader();
 [0,120,450,900].forEach(ms=>setTimeout(()=>{const t=normalizeThemeIdentity();finalizeCardMedia(t);reinstallSafeAudio();installTeacherExamAccess();polishHeader();polishTaskEmojis();window.SPTeacherExamReader?.run?.()},ms));
}
window.L8TaskEmoji=taskEmoji;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();