(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V5)return;
window.__SP_TEACHER_POINTS_SUITE_V5=true;
const FINAL='20260829-points10-final';
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
    await load('/shared/points-recalculator.js');
    await load('/shared/dativ-points-extension.js');
    await load('/teacher/points-dashboard.js');
    await load('/teacher/point-floor-preflight.js');
    try{await window.SPPointFloorPreflightReady}catch(error){console.warn('Historische Punkte-Untergrenze konnte nicht vollständig vorbereitet werden',error)}
    await load('/teacher/b1-points-alias-normalize.js');
    await load('/teacher/b1-points-recalculate.js');
    await load('/teacher/b1-points-control.js');
  }catch(error){console.warn('Punkte-Werkzeuge konnten nicht vollständig geladen werden',error)}
}
if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start,version:FINAL};
})();