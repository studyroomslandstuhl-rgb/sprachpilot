(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_SUITE_V1)return;
window.__SP_TEACHER_POINTS_SUITE_V1=true;

function load(src){
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
    await load('/shared/points-recalculator.js?v=2');
    await load('/shared/dativ-points-extension.js?v=2');
    await load('/teacher/points-dashboard.js?v=1');
    await load('/teacher/b1-points-recalculate.js?v=1');
    await load('/teacher/b1-points-control.js?v=1');
  }catch(error){console.warn('Punkte-Werkzeuge konnten nicht vollständig geladen werden',error)}
}

if(document.readyState==='complete')setTimeout(start,120);else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
window.SPTeacherPointsSuite={start};
})();
