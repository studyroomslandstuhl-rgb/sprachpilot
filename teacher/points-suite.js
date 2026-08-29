(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V6)return;
window.__SP_TEACHER_POINTS_SUITE_V6=true;
const FINAL='20260829-points11-individual';
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
async function start(){
  try{
    // Ab jetzt keine automatische Kurs-Neuberechnung mehr. Diese Suite liest nur.
    await load('/shared/points-recalculator.js');
    await load('/shared/dativ-points-extension.js');
    await load('/teacher/points-dashboard.js');
    await load('/teacher/student-point-inspector.js');
  }catch(error){console.warn('Punkte-Prüfwerkzeuge konnten nicht vollständig geladen werden',error)}
}
if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start,version:FINAL,mode:'read-only-individual'};
})();