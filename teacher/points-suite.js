(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V13)return;
window.__SP_TEACHER_POINTS_SUITE_V13=true;
const FINAL='20260831-global-progress-points-v7-target-audit';
const TARGETS=['Oksana Binchukova','Denys Tkachuk'];
function load(path){
  const src=path+(path.includes('?')?'&':'?')+'v='+FINAL;
  return new Promise((resolve,reject)=>{
    if(document.querySelector(`script[data-sp-points-src="${src}"]`)){resolve();return}
    const script=document.createElement('script');
    script.src=src;script.async=false;script.dataset.spPointsSrc=src;
    script.onload=()=>resolve();script.onerror=()=>reject(new Error(`Punkte-Modul konnte nicht geladen werden: ${src}`));
    document.head.appendChild(script);
  });
}
function removeInspectorPanel(){
  try{document.querySelectorAll('[data-student-point-inspector]').forEach(node=>node.remove())}catch(e){}
}
function norm(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function installInspectorHider(){
  if(document.getElementById('sp-target-audit-hide-inspector'))return;
  const style=document.createElement('style');style.id='sp-target-audit-hide-inspector';style.textContent='[data-student-point-inspector]{display:none!important}';document.head.appendChild(style);
}
function targetReport(name){const rows=window.SPStudentPointInspector?.reports||[];const q=norm(name);return rows.find(r=>norm(r.name)===q)||rows.find(r=>norm(r.name).includes(q))||null}
function renderCompactTargetAudit(){
  const app=document.getElementById('app');if(!app)return;
  let card=document.querySelector('[data-sp-target-point-audit]');
  if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spTargetPointAudit='1';const grid=app.querySelector('.sp-grid')||app;grid.appendChild(card)}
  const rows=TARGETS.map(name=>{
    const r=targetReport(name);
    if(!r)return `<div style="padding:8px 0;border-bottom:1px solid var(--sp-line,#d9e8ef)"><strong>${name}</strong>: kein eindeutig zuordenbarer Firebase-Datensatz gefunden.</div>`;
    const flags=(r.flags||[]).join(' · ');
    return `<div style="padding:9px 0;border-bottom:1px solid var(--sp-line,#d9e8ef)"><strong>${r.name}</strong>${r.course?` · ${r.course}`:''}<br><span style="font-size:13px">historisch <strong>${Number(r.historicalHighest)||0}</strong> · aus Firebase-Evidenz neu berechnet <strong>${Number(r.canonicalCalculated)||0}</strong> · gültig <strong>${Number(r.finalExpected)||0}</strong>${flags?` · ${flags}`:''}</span></div>`;
  }).join('');
  card.innerHTML=`<h2 style="margin-bottom:8px">Punkteprüfung</h2>${rows}<p class="small" style="margin:8px 0 0">Nur lesen. Wiederholungen zählen über gespeicherte Run-/Reset-/Punkte-Evidenz; kein Wert wird abgesenkt.</p>`;
}
async function loadTargetAudit(){
  try{
    installInspectorHider();
    await load('/teacher/student-point-inspector.js');
    const inspector=window.SPStudentPointInspector;if(!inspector)return;
    if(!Array.isArray(inspector.reports)||!inspector.reports.length)await inspector.inspect?.(true);
    removeInspectorPanel();renderCompactTargetAudit();
  }catch(error){console.warn('Gezielte Punkteprüfung für Oksana/Denys konnte noch nicht geladen werden',error)}
}
async function openInspector(){
  const style=document.getElementById('sp-target-audit-hide-inspector');if(style)style.remove();
  await load('/teacher/student-point-inspector.js');
  try{await window.SPStudentPointInspector?.inspect?.(true)}catch(e){}
  return window.SPStudentPointInspector||null;
}
async function start(){
  try{
    installInspectorHider();removeInspectorPanel();
    await load('/shared/points-recalculator.js');
    await load('/shared/dativ-points-extension.js');
    await load('/teacher/points-dashboard.js');
    // Nur die zwei aktuell angefragten TN werden kompakt angezeigt; die große
    // Einzelprüfungsansicht bleibt verborgen.
    setTimeout(loadTargetAudit,350);
  }catch(error){console.warn('Punkte-Prüfwerkzeuge konnten nicht vollständig geladen werden',error)}
}
if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start,openInspector,loadTargetAudit,renderCompactTargetAudit,removeInspectorPanel,version:FINAL,mode:'automatic-v4-reconciliation-compact-target-audit'};
})();
