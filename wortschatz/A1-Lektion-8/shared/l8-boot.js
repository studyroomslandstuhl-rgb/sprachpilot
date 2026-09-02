(function(){
'use strict';
let stateV2Promise=null;
let startAttempts=0;
const CONTENT_WAIT_MS=3500;
const RETRY_MS=120;
const MAX_PENDING_RETRIES=35;
const MAX_CORE_RETRIES=60;

function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){return{}}}
function teacherAccess(){
 const roles=['teacher','lehrer','admin','owner','superadmin'];
 const stored=['SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE'].map(key=>String(localStorage.getItem(key)||'').trim().toLowerCase());
 if(stored.some(value=>roles.includes(value)))return true;
 const access=String(window.SP_SECURE_ACCESS?.type||'').toLowerCase();
 if(access==='teacher'||access==='teacher-preview')return true;
 if(window.spTeacherCanSeeAll===true)return true;
 const profiles=[readJson('SP_TEACHER_PROFILE'),readJson('SP_USER_PROFILE')];
 return profiles.some(p=>p?.isTeacher===true||p?.teacher===true||p?.admin===true||p?.owner===true||roles.includes(String(p?.role||p?.loginRole||p?.type||p?.accountType||'').toLowerCase()));
}
function installTeacherExamAccess(){
 if(!teacherAccess()||!window.L8S)return false;
 try{window.L8S.preview=()=>true}catch(e){}
 try{window.L8S.allDone=()=>true}catch(e){}
 try{window.spTeacherCanSeeAll=true}catch(e){}
 return true;
}
function ensureTeacherExamReader(){
 if(!teacherAccess())return;
 import('/js/sp-teacher-exam-reader.js?v=20260902-1').then(()=>setTimeout(()=>window.SPTeacherExamReader?.run?.(),0)).catch(()=>{});
}
function ensureStateV2(){
 if(window.__SP_L8_STATE_V2&&window.L8S?.stateSchema===2&&typeof window.L8S?.runNo==='function')return Promise.resolve();
 if(stateV2Promise)return stateV2Promise;
 stateV2Promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='../shared/l8-state-v2.js?v=20260902-previewfix1';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
 return stateV2Promise;
}
function waitWithTimeout(gate,label){
 if(!gate||typeof gate.then!=='function')return Promise.resolve();
 let timer=null;
 return Promise.race([
  Promise.resolve(gate).catch(error=>{console.error(label,error)}),
  new Promise(resolve=>{timer=setTimeout(()=>{console.warn(`${label}: Zeitlimit erreicht; Seite startet mit dem bereits vorbereiteten Stand.`);resolve()},CONTENT_WAIT_MS)})
 ]).finally(()=>{if(timer)clearTimeout(timer)});
}
async function waitForFinalContent(){
 const first=window.L8_CONTENT_READY;
 await waitWithTimeout(first,'L8 Inhalte konnten nicht vollständig vorbereitet werden');
 const latest=window.L8_CONTENT_READY;
 if(latest&&latest!==first)await waitWithTimeout(latest,'L8 finale Inhalte konnten nicht vollständig vorbereitet werden');
}
function reinstallSafeAudio(){
 try{window.L8AudioCoreSafeV3?.install?.()}catch(error){console.error('L8 sichere Audiofunktion konnte nicht installiert werden',error)}
}
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()}
function resolveThemeNumber(){const fromBody=Number(document.body?.dataset?.theme||0);const fromPath=Number(location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0);return fromBody||fromPath||Number(window.L8_THEME?.number||0)||0}
function normalizeThemeIdentity(){const n=resolveThemeNumber();if(!n)return null;const all=window.L8_ALL_THEMES||{},theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)||window.L8_THEME;if(!theme)return null;theme.number=n;if(!theme.title)theme.title=`Thema ${n}`;window.L8_THEME=theme;return theme}
function finalizeCardMedia(theme){
 if(!theme)return;
 try{window.L8CardBunnyStandardV4?.patchTheme?.(theme)}catch(error){console.error('L8 Bunny-Medien der Karteikarten konnten nicht finalisiert werden',error)}
}
function taskText(task){
 const items=(Array.isArray(task?.items)?task.items:[]).slice(0,6).map(item=>`${item?.type||''} ${item?.prompt||''} ${item?.context||''} ${item?.hint||''}`).join(' ');
 return norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''} ${task?.instruction||''} ${task?.intro||''} ${items}`);
}
function taskEmoji(task){
 const text=taskText(task),types=new Set((Array.isArray(task?.items)?task.items:[]).map(item=>String(item?.type||'').toLowerCase()));
 if(task?.exam||/prufung|exam/.test(text))return'⭐';
 if(/karte|card/.test(text)||task?.kind==='cards')return'📚';
 if(/memory/.test(text))return'🧠';
 if(/hor|listen|audio/.test(text)||(task?.items||[]).some(item=>item?.audio||item?.audioFile))return'🎧';
 if(/lesen|reading|text versteh|leseversteh/.test(text))return'📖';
 if(/grammatik|grammar|satzteil/.test(text))return'🧲';
 if(/konjug|\bsein\b|\bhaben\b/.test(text))return'🔤';
 if(/endung|gruppe|sort|zuord/.test(text))return'📦';
 if(/ordnen|order|reihenfolge|redemittel/.test(text)||types.has('order'))return'🧩';
 if(/schreib|write|lucke|text|brief|information|markier|plural/.test(text)||types.has('input')||types.has('free'))return'✍️';
 if(/wahl|choice|artikel|richtig|falsch|uberschrift|fehler/.test(text)||types.has('choice'))return'✅';
 if(task?.icon)return String(task.icon);
 return'✅';
}
function polishHeader(){
 const t=normalizeThemeIdentity();if(!t)return;
 const n=resolveThemeNumber();
 const taskId=new URLSearchParams(location.search).get('task');
 const task=(t.tasks||[]).find(x=>x.id===taskId);
 const subtitle=document.querySelector('.sp-header__subtitle');
 if(subtitle)subtitle.textContent=task?`${task.title} · A1 Lektion 8 · Thema ${n}`:`${t.title} · A1 Lektion 8 · Thema ${n}`;
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{if(String(link.textContent||'').trim()==='Übersicht'&&link.tagName==='A')link.setAttribute('href','uebersicht.html')});
}
function polishTaskEmojis(){
 const t=normalizeThemeIdentity();if(!t||!Array.isArray(t.tasks))return;
 if(document.body.dataset.page==='theme'){
  document.querySelectorAll('.l8-task-card').forEach((card,index)=>{
   const task=t.tasks[index],node=card.querySelector('.emoji');
   if(task&&node)node.textContent=taskEmoji(task);
  });
  return;
 }
 const taskId=new URLSearchParams(location.search).get('task'),task=t.tasks.find(item=>String(item?.id)===String(taskId));
 const line=document.querySelector('.l8-task-title-block p');
 if(task&&line)line.textContent=`${taskEmoji(task)} ${task.instruction||''}`;
}
function renderLoadError(){
 const root=document.getElementById('app');
 if(!root)return;
 root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Die Aufgabe konnte nicht vollständig geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>';
}
function scheduleRetry(){setTimeout(start,RETRY_MS)}
async function start(){
 startAttempts++;
 try{await ensureStateV2()}catch(error){console.error('L8 Fortschrittssystem konnte nicht geladen werden',error)}
 installTeacherExamAccess();
 reinstallSafeAudio();
 await waitForFinalContent();
 const theme=normalizeThemeIdentity();
 installTeacherExamAccess();
 const coreMissing=!theme||!window.L8S||!window.L8UI||window.L8S.stateSchema!==2;
 const contentPending=!!(window.L8_T2_TIME_REVIEW_PENDING||window.L8_T2_QUALITY_PENDING||window.L8_T2_VOCAB_PENDING||window.L8_T2_VOCAB_FINAL_PENDING);
 if(coreMissing){
  if(startAttempts<MAX_CORE_RETRIES){scheduleRetry();return}
  console.error('L8 Start abgebrochen: Kernkomponenten fehlen.');renderLoadError();return;
 }
 if(contentPending&&startAttempts<MAX_PENDING_RETRIES){scheduleRetry();return}
 if(contentPending)console.warn('L8T2: veraltete Pending-Flags werden nach dem Zeitlimit ignoriert.');
 finalizeCardMedia(theme);
 reinstallSafeAudio();
 normalizeThemeIdentity();
 installTeacherExamAccess();
 if(document.body.dataset.page==='theme')window.L8UI.themeOverview();else window.L8UI.taskPage();
 ensureTeacherExamReader();
 [0,80,250,700,1500].forEach(ms=>setTimeout(()=>{const t=normalizeThemeIdentity();finalizeCardMedia(t);reinstallSafeAudio();installTeacherExamAccess();polishHeader();polishTaskEmojis();window.SPTeacherExamReader?.run?.()},ms));
}
window.L8TaskEmoji=taskEmoji;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
