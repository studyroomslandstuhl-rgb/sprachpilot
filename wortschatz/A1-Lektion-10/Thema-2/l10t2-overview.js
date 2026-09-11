(async function(){
'use strict';
if(window.__SP_L10T2_L8_OVERVIEW_V1)return;window.__SP_L10T2_L8_OVERVIEW_V1=true;
const D=window.L10T2||{tasks:[]};
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-2';
const tasks=Array.isArray(D.tasks)?D.tasks:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function preview(){try{const p=profile(),role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}}
function owner(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function stateKey(id){return `SP_L10_${owner()}_T2_${id}`}
function localPct(t){if(preview())return 0;try{const s=JSON.parse(localStorage.getItem(stateKey(t.id))||'null');if(!s||Number(s._run||1)!==run())return 0;const total=Math.max(0,Number(s.total||0)),done=Array.isArray(s.done)?s.done.length:Math.max(0,Number(s.done||0));return total?Math.min(100,Math.round(done/total*100)):0}catch(e){return 0}}
function teacherNote(){return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskPoints(r){return r===1?5:r===2?10:r===3?15:0}
function taskEmoji(t){return String(t?.icon||'✅')}
function lastKey(){return'SP_L10_LAST_TASK_T2'}
function resetThemeProgress(){if(preview()){alert('In der Lehrer-Vorschau werden keine Teilnehmerfortschritte gespeichert.');return}if(!confirm('Fortschritte in Lektion 10 · Thema 2 löschen? Bereits verdiente Punkte bleiben erhalten.'))return;const prefix=`SP_L10_${owner()}_T2_`,del=[];for(let i=0;i<localStorage.length;i++){const k=String(localStorage.key(i)||'');if(k.startsWith(prefix)||k.startsWith(`SP_RETRY_L10_${owner()}_T2_`))del.push(k)}del.forEach(k=>localStorage.removeItem(k));location.href='index.html?reset='+Date.now()}
window.resetThemeProgress=resetThemeProgress;
function polishHeader(){const sub=document.querySelector('.sp-header__subtitle');if(sub)sub.textContent='Gesundheit und Possessivpronomen · A1 Lektion 10 · Thema 2';document.querySelectorAll('.sp-header__nav-link').forEach(a=>{if(String(a.textContent||'').trim()==='Übersicht'&&a.tagName==='A')a.setAttribute('href','uebersicht.html')})}
function scrollLast(){let id='';try{id=sessionStorage.getItem(lastKey())||localStorage.getItem(lastKey())||''}catch(e){}if(!id)return;const target=[...document.querySelectorAll('a.l8-task-card')].find(a=>{try{return new URL(a.href,location.href).searchParams.get('task')===id}catch(e){return false}});if(target){target.style.scrollMarginTop='18px';setTimeout(()=>target.scrollIntoView({behavior:'auto',block:'center'}),80)}}
const progress=Object.fromEntries(tasks.map(t=>[t.id,localPct(t)]));
let cloudTopic=null;
if(!preview()){
 try{
  const mod=await import('/js/progress.js?v=20260911-l10t2-l8');
  const cloud=await mod.loadCurrentStudentProgress();
  cloudTopic=cloud?.wortschatz?.[TOPIC]||null;
  if(cloudTopic){
   const active=run();
   for(const t of tasks){
    const rec=cloudTopic.tasks?.[t.id]||cloudTopic.tasks?.[`task.html?task=${t.id}`];if(!rec)continue;
    const rr=Number(rec.run||cloudTopic.currentRun||cloudTopic.current?.run||active)||active;
    if(rr===active)progress[t.id]=Math.max(progress[t.id]||0,Math.max(0,Math.min(100,Number(rec.percent||0))));
   }
  }
 }catch(e){console.warn('L10T2 L8 overview progress',e)}
}
const completed=tasks.filter(t=>(progress[t.id]||0)>=100).length;
const avg=tasks.length?Math.round(tasks.reduce((sum,t)=>sum+(progress[t.id]||0),0)/tasks.length):0;
function score(){
 const r=run(),per=taskPoints(r);let current=completed*per,lifetime=current,pending=false;
 if(cloudTopic){
  const lp=Number(cloudTopic?.lifetime?.points);if(Number.isFinite(lp)&&lp>=0)lifetime=lp;
  let cloudCurrent=0,found=false;
  for(const t of tasks){const rec=cloudTopic.tasks?.[t.id]||cloudTopic.tasks?.[`task.html?task=${t.id}`];if(!rec)continue;const by=Number(rec?.pointsByRun?.[String(r)]);if(Number.isFinite(by)&&by>0){cloudCurrent+=by;found=true}}
  if(found)current=Math.max(current,cloudCurrent);
  pending=tasks.some(t=>(progress[t.id]||0)>Number((cloudTopic.tasks?.[t.id]||cloudTopic.tasks?.[`task.html?task=${t.id}`])?.percent||0));
 }
 return{r,current,lifetime,pending};
}
function scorePanel(){if(preview())return'<div class="l8-score-panel"><div class="l8-score-label">Punkte</div><div class="l8-score-total">Vorschau</div><div class="l8-small">Keine Teilnehmerpunkte</div></div>';const s=score();return`<div class="l8-score-panel"><div class="l8-score-label">${s.r===1?'Versuch 1 von 3':`Wiederholung ${s.r} von 3`}</div><div class="l8-score-total">${s.lifetime} Punkte</div><div class="l8-small">Aufgaben: ${s.current}</div>${s.pending?'<div class="l8-small l8-score-sync">Synchronisierung läuft …</div>':''}</div>`}
function renderTask(t,i){const p=Math.round(progress[t.id]||0),done=p>=100;return`<a class="l8-card l8-task-card ${done?'done':''}" href="task.html?task=${encodeURIComponent(t.id)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(taskEmoji(t))}</div><p>${esc(t.text||t.instruction||'')}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${done?'Fertig':'Starten'}</div></a>`}
if(root){root.innerHTML=`<div class="l8-wrap">${teacherNote()}<section class="l8-card l8-progress-card"><div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${completed} / ${tasks.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><p class="l8-small l8-theme-subtitle">Gesundheit und Possessivpronomen</p><div class="l8-tags"><span class="l8-tag">21 Wörter</span><span class="l8-tag">wehtun / -schmerzen</span><span class="l8-tag">Possessivpronomen</span></div></div><div class="l8-score-slot">${scorePanel()}</div></section><section class="l8-grid">${tasks.map(renderTask).join('')}</section><footer>© SprachPilot</footer></div>`;[50,250,700].forEach(ms=>setTimeout(()=>{scrollLast();polishHeader()},ms))}
})();
