(function(){
'use strict';
if(window.__SP_B1_POINTS_RUNTIME_FIX_V3)return;
window.__SP_B1_POINTS_RUNTIME_FIX_V3=true;

const COURSE='B174698';
const text=value=>String(value==null?'':value).trim();
let running=false,done=false;
function state(){return window.SPTeacherDashboard?.state||null}
function status(message,kind=''){
 const el=document.getElementById('spStatus');if(!el)return;el.textContent=message;if(kind)el.className='sp-status '+kind;
}
function summaryCard(summary){
 const app=document.getElementById('app');if(!app||!summary)return;
 let card=app.querySelector('[data-b1-runtime-summary]');
 if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.b1RuntimeSummary='1';card.style.marginBottom='16px';const head=app.querySelector('.sp-page-head');if(head)head.insertAdjacentElement('afterend',card);else app.prepend(card)}
 card.innerHTML=`<h2>B1-Punkte sicher abgeglichen</h2><p>Kurs <strong>${COURSE}</strong>: ${Number(summary.processed)||0} TN geprüft · ${Number(summary.updated)||0} gespeichert · ${Number(summary.restoredStudents)||0} mit wiederhergestellten Punkten · ${Number(summary.restoredPoints)||0} Punkte wiederhergestellt · ${Number(summary.noEvidence)||0} ohne sichere Punktquelle · ${Number(summary.failed)||0} Fehler.</p>`;
}
async function waitReady(){
 for(let i=0;i<100;i++){
  const s=state();if(s?.loadedAt&&window.SPB1PointRecalculation?.run)return true;
  await new Promise(resolve=>setTimeout(resolve,125));
 }
 return false;
}
async function run({force=false}={}){
 if(running||done)return window.SPB1PointRecalculation?.lastSummary||null;
 if(!(await waitReady())){status('B1-Punkteabgleich konnte nicht gestartet werden: Punkte-Modul nicht geladen.','error');return null}
 if(!state()?.isOwner)return null;
 running=true;status(`Punkte im Kurs ${COURSE} werden aus allen verfügbaren Speicherständen sicher abgeglichen …`);
 try{
  const summary=await window.SPB1PointRecalculation.run({force,refresh:true});
  if(!summary)return null;
  done=true;try{sessionStorage.setItem('SP_B1_POINT_RUNTIME_FIX_V3',JSON.stringify(summary))}catch(e){}
  status(`B1-Punkte abgeglichen: ${summary.processed||0} TN · ${summary.restoredStudents||0} TN mit wiederhergestellten Punkten · ${summary.failed||0} Fehler.`,summary.failed?'error':'ok');
  summaryCard(summary);setTimeout(()=>window.SPTeacherPointsDashboard?.loadRankings?.(true),350);return summary;
 }catch(error){status('B1-Punkteabgleich fehlgeschlagen: '+text(error?.message||error),'error');return null}
 finally{running=false}
}
function addButton(){
 const s=state(),app=document.getElementById('app');if(!s?.isOwner||!app||!['overview','students'].includes(s.view))return;
 const head=app.querySelector('.sp-page-head');if(!head||head.querySelector('[data-b1-runtime-button]'))return;
 const box=document.createElement('div');box.className='sp-row-actions';const button=document.createElement('button');button.type='button';button.className='sp-button';button.dataset.b1RuntimeButton='1';button.textContent='B1-Punkte sicher abgleichen';
 button.onclick=async()=>{done=false;button.disabled=true;button.textContent='Punkte werden abgeglichen …';try{await run({force:true})}finally{button.disabled=false;button.textContent='B1-Punkte sicher abgleichen'}};box.appendChild(button);head.appendChild(box);
}
const observer=new MutationObserver(addButton);observer.observe(document.documentElement,{childList:true,subtree:true});
[500,1200,2500].forEach(delay=>setTimeout(addButton,delay));
setTimeout(()=>run({force:false}),1800);
window.SPB1PointRuntimeFix={run};
})();