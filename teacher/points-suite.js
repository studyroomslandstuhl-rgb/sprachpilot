(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V14)return;
window.__SP_TEACHER_POINTS_SUITE_V14=true;
const FINAL='20260831-global-progress-points-v8-target-force-all-lessons';
const TARGETS=['Oksana Binchukova','Denys Tkachuk'];
const TARGET_KEY='SP_TARGET_RECONCILIATION_OKSANA_DENYS_ALL_LESSONS_V1';
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
function removeInspectorPanel(){try{document.querySelectorAll('[data-student-point-inspector]').forEach(node=>node.remove())}catch(e){}}
function norm(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function installInspectorHider(){if(document.getElementById('sp-target-audit-hide-inspector'))return;const style=document.createElement('style');style.id='sp-target-audit-hide-inspector';style.textContent='[data-student-point-inspector]{display:none!important}';document.head.appendChild(style)}
function targetReport(name){const rows=window.SPStudentPointInspector?.reports||[],q=norm(name);return rows.find(r=>norm(r.name)===q)||rows.find(r=>norm(r.name).includes(q))||null}
function renderCompactTargetAudit(results=[]){
  const app=document.getElementById('app');if(!app)return;
  let card=document.querySelector('[data-sp-target-point-audit]');if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spTargetPointAudit='1';(app.querySelector('.sp-grid')||app).appendChild(card)}
  const resultByName=new Map(results.map(r=>[norm(r.name),r]));
  const rows=TARGETS.map(name=>{
    const r=targetReport(name),forced=resultByName.get(norm(name));
    if(!r)return `<div style="padding:8px 0;border-bottom:1px solid var(--sp-line,#d9e8ef)"><strong>${name}</strong>: kein eindeutig zuordenbarer Firebase-Datensatz gefunden.</div>`;
    const flags=(r.flags||[]).join(' · '),forcedText=forced?.result?.ok?` · gezielt neu berechnet: ${Number(forced.result.after)||0}`:forced?.error?' · Neuberechnung fehlgeschlagen':'';
    return `<div style="padding:9px 0;border-bottom:1px solid var(--sp-line,#d9e8ef)"><strong>${r.name}</strong>${r.course?` · ${r.course}`:''}<br><span style="font-size:13px">historisch <strong>${Number(r.historicalHighest)||0}</strong> · aus Firebase-Evidenz neu berechnet <strong>${Number(r.canonicalCalculated)||0}</strong> · gültig <strong>${Number(r.finalExpected)||0}</strong>${forcedText}${flags?` · ${flags}`:''}</span></div>`;
  }).join('');
  card.innerHTML=`<h2 style="margin-bottom:8px">Punkteprüfung</h2>${rows}<p class="small" style="margin:8px 0 0">Alle in Firebase vorhandenen Lektionen/Themen und gespeicherten Runs 1–3 werden berücksichtigt. Historisch höhere Werte bleiben erhalten.</p>`;
}
async function forceTargetReconciliation(){
  const api=window.SPTeacherPointsDashboard;if(!api?.reconciliationStudents||!api?.mergeOneStudent)return[];
  try{if(sessionStorage.getItem(TARGET_KEY)==='1')return[]}catch(e){}
  const students=await api.reconciliationStudents(),results=[];
  for(const name of TARGETS){
    const q=norm(name),student=students.find(s=>norm([s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))===q)||students.find(s=>norm(s.studentName||s.displayName||s.name)===q);
    if(!student){results.push({name,error:'not-found'});continue}
    try{const result=await api.mergeOneStudent(student,{force:true});results.push({name,result})}catch(error){console.warn('Gezielte vollständige Punkte-Neuberechnung fehlgeschlagen',name,error);results.push({name,error:String(error?.message||error)})}
  }
  try{sessionStorage.setItem(TARGET_KEY,'1')}catch(e){}
  try{await api.loadRankings?.(true)}catch(e){}
  return results;
}
async function loadTargetAudit(results=[]){
  try{
    installInspectorHider();await load('/teacher/student-point-inspector.js');const inspector=window.SPStudentPointInspector;if(!inspector)return;
    await inspector.inspect?.(true);removeInspectorPanel();renderCompactTargetAudit(results);
  }catch(error){console.warn('Gezielte Punkteprüfung für Oksana/Denys konnte noch nicht geladen werden',error)}
}
async function openInspector(){const style=document.getElementById('sp-target-audit-hide-inspector');if(style)style.remove();await load('/teacher/student-point-inspector.js');try{await window.SPStudentPointInspector?.inspect?.(true)}catch(e){}return window.SPStudentPointInspector||null}
async function start(){
  try{
    installInspectorHider();removeInspectorPanel();
    await load('/shared/points-recalculator.js');
    await load('/shared/dativ-points-extension.js');
    await load('/teacher/points-dashboard.js');
    const run=async()=>{const results=await forceTargetReconciliation();await loadTargetAudit(results)};
    if(window.SPTeacherDashboard?.state?.loadedAt)setTimeout(run,350);else setTimeout(run,1200);
  }catch(error){console.warn('Punkte-Prüfwerkzeuge konnten nicht vollständig geladen werden',error)}
}
if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start,openInspector,forceTargetReconciliation,loadTargetAudit,renderCompactTargetAudit,removeInspectorPanel,version:FINAL,mode:'forced-target-reconciliation-all-lessons-non-destructive'};
})();
