import { getActiveProfile, getActiveRole } from '/js/auth.js?v=login-main-4';
import { loadCourseRelease, moduleOpen } from '/js/course-releases.js?v=20260901-course-release-fix2';

const LEVELS=['A1','A2','B1','B2','C1'];
const COUNTS={A1:11,A2:15,B1:12,B2:6,C1:3};
const app=document.querySelector('#app');
let ready=false;
let moduleAllowed=true;
let allowedLevels=new Set(LEVELS);
let applyQueued=false;

function getPath(obj,path){let cur=obj;for(const part of path){if(!cur||typeof cur!=='object'||!(part in cur))return undefined;cur=cur[part]}return cur}
function defaultOpen(data){return data?.releaseMode==='all'||data?.releaseMode==='open'||data?.defaultLocked===false}
function levelPaths(level){return [
  ['enabledSets',`dativverben/${level}`],
  ['enabledSets',`Dativverben/${level}`],
  ['releases','dativverben','levels',level,'enabled'],
  ['releases','Dativverben','levels',level,'enabled']
]}
function levelOpen(data,level){
  const values=levelPaths(level).map(path=>getPath(data,path)).filter(v=>v!==undefined);
  if(values.some(v=>v===true))return true;
  if(values.some(v=>v===false))return false;
  return defaultOpen(data);
}
function currentLevel(){const group=Number(new URLSearchParams(location.search).get('group'))||0;return LEVELS[group-1]||''}
function visibleCount(){return [...allowedLevels].reduce((sum,level)=>sum+(COUNTS[level]||0),0)}
function visibleLevelText(){const levels=LEVELS.filter(level=>allowedLevels.has(level));return levels.length?levels.join(', '):'keine Niveaustufe'}
function setText(el,text){if(el&&el.textContent!==text)el.textContent=text}
function lockView(title,text,key){
  if(!app)return;
  if(app.dataset.dativAccessState===key&&app.querySelector('.dativ-access-lock'))return;
  app.dataset.dativAccessState=key;
  app.innerHTML=`<section class="card locked-card dativ-access-lock"><h2>${title}</h2><p>${text}</p><a class="btn" href="/verben-bereich/">Zurück zu Verben</a></section>`;
}
function clearLockState(){if(app&&app.dataset.dativAccessState!=='open')app.dataset.dativAccessState='open'}
function ensureEmptyNotice(){
  if(!app||allowedLevels.size)return;
  const container=app.querySelector('.groups-accordion');
  if(container&&!container.querySelector('.dativ-release-empty'))container.insertAdjacentHTML('beforeend','<div class="dativ-release-empty">Für deinen Kurs ist noch keine Niveaustufe freigegeben.</div>');
}
function apply(){
  if(!ready||!app)return;
  const role=String(getActiveRole()||'').toLowerCase();
  if(role==='teacher'||role==='owner'){clearLockState();return}
  if(!moduleAllowed){lockView('Dativverben sind gesperrt','Dieser Lernbereich ist für deinen Kurs noch nicht freigeschaltet.','module-locked');return}
  const level=currentLevel();
  if(level&&!allowedLevels.has(level)){lockView(`${level} ist gesperrt`,`Die Niveaustufe ${level} ist für deinen Kurs noch nicht freigeschaltet.`,`level-locked-${level}`);return}
  clearLockState();
  document.querySelectorAll('.group-panel').forEach(panel=>{
    const levelText=panel.querySelector('.group-number')?.textContent?.trim()||'';
    panel.hidden=!allowedLevels.has(levelText);
  });
  document.querySelectorAll('.overview-level').forEach(section=>{
    const heading=section.querySelector('h2')?.textContent?.trim()||'';
    const levelName=LEVELS.find(x=>heading.startsWith(x));
    if(levelName)section.hidden=!allowedLevels.has(levelName);
  });
  ensureEmptyNotice();
  setText(document.querySelector('#topbar .brand p'),`${visibleCount()} freigegeben · ${visibleLevelText()}`);
  document.querySelectorAll('.section-head .overview-total').forEach(el=>{
    if(/Verben/i.test(el.textContent||''))setText(el,`${visibleCount()} Verben`);
  });
}
function queueApply(){
  if(applyQueued)return;
  applyQueued=true;
  requestAnimationFrame(()=>{applyQueued=false;apply()});
}

const observer=new MutationObserver(queueApply);
if(app)observer.observe(app,{childList:true,subtree:true});
window.addEventListener('popstate',queueApply);

aSyncInit();
async function aSyncInit(){
  const role=String(getActiveRole()||'').toLowerCase();
  if(role==='teacher'||role==='owner'){
    allowedLevels=new Set(LEVELS);moduleAllowed=true;ready=true;apply();return;
  }
  const profile=getActiveProfile()||{};
  try{
    const assignments=await loadCourseRelease(profile);
    moduleAllowed=moduleOpen(assignments,'Dativverben');
    allowedLevels=new Set(LEVELS.filter(level=>levelOpen(assignments,level)));
  }catch(error){
    console.warn('Dativverben-Freigabe konnte nicht geladen werden',error);
    moduleAllowed=false;allowedLevels=new Set();
  }
  ready=true;apply();
}
