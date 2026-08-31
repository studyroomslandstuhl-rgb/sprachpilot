(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V12)return;
window.__SP_TEACHER_POINTS_SUITE_V12=true;
const FINAL='20260831-global-progress-points-v6-clean-dashboard';
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
async function openInspector(){
  removeInspectorPanel();
  await load('/teacher/student-point-inspector.js');
  try{await window.SPStudentPointInspector?.inspect?.(true)}catch(e){}
  return window.SPStudentPointInspector||null;
}
async function start(){
  try{
    removeInspectorPanel();
    // Die globale V4-Reconciliation bleibt aktiv. Der große Einzel-/Schülerprüfer wird
    // nicht mehr automatisch in die Lehrer-Übersicht gerendert und kann nur noch
    // ausdrücklich über openInspector() geladen werden.
    await load('/shared/points-recalculator.js');
    await load('/shared/dativ-points-extension.js');
    await load('/teacher/points-dashboard.js');
  }catch(error){console.warn('Punkte-Prüfwerkzeuge konnten nicht vollständig geladen werden',error)}
}
if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start,openInspector,removeInspectorPanel,version:FINAL,mode:'automatic-v4-reconciliation-clean-dashboard'};
})();
