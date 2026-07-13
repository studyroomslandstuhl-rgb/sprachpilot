const PATH=String(location.pathname||"");
const MATCH=PATH.match(/\/wortschatz\/(A\d-Lektion-(\d+))\/(Thema-(\d+))\//i);
const IS_EXAM=/\/pruefung\.html$/i.test(PATH);
const STORE_PREFIX="SP_EXAM_UNLOCK_FIX_";
window.__SP_EXAM_UNLOCK_FILES=window.__SP_EXAM_UNLOCK_FILES||{};
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function unlockKey(){if(!MATCH)return"";return `SP_EXAM_UNLOCKED_L${MATCH[2]}_T${MATCH[4]}`}
function writeJson(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function readJson(k,f=null){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function topicMatches(key,t){if(!MATCH||!t)return false;const lesson=String(t.lesson||t.lektion||"").replace(/\D+/g,"");const theme=String(t.theme||t.thema||t.topic||"").replace(/\D+/g,"");if(lesson===MATCH[2]&&theme===MATCH[4])return true;const k=cleanId(key||t.id||t.topicId||"");return k.includes(`lektion-${MATCH[2]}`)&&k.includes(`thema-${MATCH[4]}`)}
function isTaskComplete(t){return !!(t&&(t.completed===true||t.done===true||clamp(t.percent)>=100||(Number(t.total||0)>0&&Number(t.done||0)>=Number(t.total||1))))}
function findTopic(progress){const mod=progress&&progress.wortschatz||{};for(const [key,t] of Object.entries(mod)){if(topicMatches(key,t))return{key,t}}return null}
function localTopics(){const out=[];["SP_DASHBOARD_PROGRESS_ALL","SP_STUDENT_PROGRESS_ALL","SP_PROGRESS_ALL","SP_WORTSCHATZ_PROGRESS_ALL"].forEach(k=>{const all=readJson(k,{});Object.entries(all||{}).forEach(([key,t])=>{if(topicMatches(key,t))out.push(t)})});Object.keys(localStorage).forEach(k=>{if(!/DASHBOARD|PROGRESS|L[3456]_T|SP_TASK_STATE/i.test(k))return;const v=readJson(k,null);if(v&&typeof v==="object"&&topicMatches(k,v))out.push(v)});return out}
function completeFilesFromTopic(topic){const tasks=topic&&topic.tasks||{};const out={};const vals=Array.isArray(tasks)?tasks:Object.values(tasks);vals.forEach(t=>{const file=String(t.file||t.key||t.taskKey||"");if(!file||/pruefung\.html$/i.test(file))return;if(isTaskComplete(t))out[file]={total:Number(t.total||t.done||100)||100,done:Number(t.done||t.total||100)||100,percent:100};});return out}
function topicAllowsExam(topic){if(!topic)return false;const raw=topic.tasks||{};const allKnown=(Array.isArray(raw)?raw:Object.values(raw)).filter(t=>!String(t.file||t.key||"").includes("pruefung"));if(allKnown.length>0)return allKnown.every(isTaskComplete);const taskPercent=clamp(topic.taskPercent||topic.current&&topic.current.taskPercent||topic.current&&topic.current.percent||topic.progressPercent||topic.percent||0);const completed=Number(topic.completedTasks||topic.current&&topic.current.completedTasks||0);const total=Number(topic.totalTasks||topic.current&&topic.current.totalTasks||0);return taskPercent>=100||(total>0&&completed>=total)}
function currentStateKeys(file){const keys=[];try{if(typeof window.spTaskStateKey==="function")keys.push(window.spTaskStateKey(file))}catch(e){}try{if(typeof window.taskKey==="function")keys.push(window.taskKey(file))}catch(e){}try{if(window.CFG&&window.CFG.key)keys.push(window.CFG.key+"_"+file)}catch(e){}try{if(window.SP_L5_THEME){const theme=String((window.SP_L5_THEME.id||"Thema-1").match(/\d+/)?.[0]||"1");keys.push((window.SP_L5_THEME.key||`SP_L5_T${theme}_V1`)+"_"+file)}}catch(e){}try{if(typeof window.KEY==="string")keys.push(window.KEY+"_"+file)}catch(e){}return [...new Set(keys.filter(Boolean))]}
function standardPercent(file,total){
  try{if(window.SPProgressStandard&&typeof window.SPProgressStandard.taskPercent==="function")return clamp(window.SPProgressStandard.taskPercent(file,total))}catch(e){}
  const names=[String(file||""),cleanId(file),String(file||"").replace(/\.html$/i,""),cleanId(String(file||"").replace(/\.html$/i,""))].filter(Boolean);
  let best=0;
  names.forEach(name=>{best=Math.max(best,clamp((readJson("SP_TASK_STATE_"+name,{})||{}).percent),isTaskComplete(readJson("SP_TASK_STATE_"+name,null))?100:0)});
  return best;
}
function pageTaskFiles(){
  const files=[];
  try{if(Array.isArray(window.TASKS))window.TASKS.forEach(t=>files.push(String((Array.isArray(t)?t[0]:t&&t.file)||"")))}catch(e){}
  try{if(typeof window.taskTotals==="function")window.taskTotals().forEach(t=>files.push(String((Array.isArray(t)?t[0]:t&&t.file)||"")))}catch(e){}
  try{document.querySelectorAll('a.module[href],a.task-card[href]').forEach(a=>files.push(String(a.getAttribute('href')||'').split('/').pop()))}catch(e){}
  return [...new Set(files.map(f=>String(f||'').split('?')[0].split('#')[0]).filter(f=>/\.html$/i.test(f)&&!/^(index|statistik|uebersicht|übersicht|pruefung)\.html$/i.test(f)))];
}
function releasedFiles(files){
  try{if(window.SprachPilotRelease&&typeof window.SprachPilotRelease.taskReleased==="function")return files.filter(f=>window.SprachPilotRelease.taskReleased(f))}catch(e){}
  return files;
}
function seedLocalCompletion(file,total){total=Number(total||100)||100;const st={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false,completed:true,percent:100};currentStateKeys(file).forEach(k=>writeJson(k,st));writeJson("SP_TASK_STATE_"+file,st)}
function patchPercentReaders(files={}){Object.assign(window.__SP_EXAM_UNLOCK_FILES,files);const done=file=>localStorage.getItem(unlockKey())==="1"||!!window.__SP_EXAM_UNLOCK_FILES[String(file||"")];
if(typeof window.pctFor==="function"&&!window.pctFor.__spExamUnlock){const old=window.pctFor;window.pctFor=function(file,total){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p};window.pctFor.__spExamUnlock=true}
if(typeof window.pct==="function"&&!window.pct.__spExamUnlock){const old=window.pct;window.pct=function(file,total){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p};window.pct.__spExamUnlock=true}
if(typeof window.taskPercent==="function"&&!window.taskPercent.__spExamUnlock){const old=window.taskPercent;window.taskPercent=function(file){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p};window.taskPercent.__spExamUnlock=true}
if(typeof window.examUnlocked==="function"&&!window.examUnlocked.__spExamUnlock){const old=window.examUnlocked;window.examUnlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)};window.examUnlocked.__spExamUnlock=true}
if(typeof window.isExamUnlocked==="function"&&!window.isExamUnlocked.__spExamUnlock){const old=window.isExamUnlocked;window.isExamUnlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)};window.isExamUnlocked.__spExamUnlock=true}
if(typeof window.spL3ExamUnlocked==="function"&&!window.spL3ExamUnlocked.__spExamUnlock){const old=window.spL3ExamUnlocked;window.spL3ExamUnlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)};window.spL3ExamUnlocked.__spExamUnlock=true}}
function unlockVisibleExamCard(){
  if(!MATCH||localStorage.getItem(unlockKey())!=="1")return;
  const href="pruefung.html";
  document.querySelectorAll('.exam-locked,.disabled-card,.module.locked,.module').forEach(el=>{
    const text=String(el.textContent||'');
    const isExam=/Prüfung|Pruefung/i.test(text)||el.querySelector('.exam-icon');
    if(!isExam)return;
    if(el.tagName&&el.tagName.toLowerCase()==='a'){
      el.setAttribute('href',href);el.removeAttribute('aria-disabled');el.style.pointerEvents='auto';
    }else{
      el.style.pointerEvents='auto';el.setAttribute('role','link');el.tabIndex=0;el.onclick=function(){location.href=href};
    }
    el.classList.remove('locked','exam-locked','disabled-card');
    el.style.opacity='';el.style.background='';
    const small=el.querySelector('.small');if(small&&/gesperrt/i.test(small.textContent||''))small.textContent='offen';
    const start=el.querySelector('.start');if(start&&/gesperrt/i.test(start.textContent||''))start.textContent='Starten';
    const icon=el.querySelector('.icon,.big-icon,.exam-icon');if(icon)icon.textContent='⭐';
  });
}
function unlockFromStandardTasks(){
  if(!MATCH)return false;
  const files=releasedFiles(pageTaskFiles());
  if(!files.length)return false;
  const done={};
  const ok=files.every(file=>{const p=standardPercent(file,100);if(p>=100)done[file]={total:100,done:100,percent:100};return p>=100});
  if(!ok)return false;
  localStorage.setItem(unlockKey(),"1");
  Object.entries(done).forEach(([file,info])=>seedLocalCompletion(file,info.total));
  patchPercentReaders(done);
  unlockVisibleExamCard();
  return true;
}
function unlockFromTopic(topic){if(!topicAllowsExam(topic))return false;const files=completeFilesFromTopic(topic);localStorage.setItem(unlockKey(),"1");Object.entries(files).forEach(([file,info])=>seedLocalCompletion(file,info.total));patchPercentReaders(files);unlockVisibleExamCard();return true}
function rerenderOrReload(){try{if(typeof window.renderPage==="function")window.renderPage()}catch(e){}try{if(typeof window.renderMenu==="function")window.renderMenu()}catch(e){}try{if(typeof window.render==="function")window.render()}catch(e){}unlockVisibleExamCard();if(IS_EXAM&&sessionStorage.getItem(STORE_PREFIX+PATH)!=="1"){sessionStorage.setItem(STORE_PREFIX+PATH,"1");setTimeout(()=>location.reload(),150)}}
function runLocal(){if(!MATCH)return false;if(unlockFromStandardTasks()){rerenderOrReload();return true}for(const t of localTopics()){if(unlockFromTopic(t)){rerenderOrReload();return true}}return false}
async function run(){if(!MATCH)return;if(runLocal())return;try{const mod=await import('/js/progress.js?v=10');const progress=await mod.loadCurrentStudentProgress();const found=findTopic(progress);if(found&&unlockFromTopic(found.t))rerenderOrReload()}catch(e){console.warn('Pruefungsfreigabe konnte nicht geprueft werden',e)}}
function patchFromLocalFlag(){if(MATCH&&localStorage.getItem(unlockKey())==="1"){patchPercentReaders({});unlockVisibleExamCard()}}
patchFromLocalFlag();
setTimeout(patchFromLocalFlag,250);
setTimeout(patchFromLocalFlag,900);
setTimeout(run,80);
setTimeout(run,600);
setTimeout(run,1600);
setTimeout(run,3000);
try{new MutationObserver(()=>{patchFromLocalFlag()}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}