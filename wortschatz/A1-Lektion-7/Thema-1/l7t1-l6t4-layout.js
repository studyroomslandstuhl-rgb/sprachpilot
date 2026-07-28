(function(){
'use strict';
if(window.__L7T1_L6T4_LAYOUT)return;
window.__L7T1_L6T4_LAYOUT=true;
document.body.classList.add('l7t1-l6t4');
function percent(module){
 const width=module.querySelector('.l7-progress span')?.style?.width||'';
 const parsed=Number.parseInt(width,10);
 if(Number.isFinite(parsed))return Math.max(0,Math.min(100,parsed));
 const text=module.textContent.match(/\b(\d{1,3})%\b/);
 return text?Math.max(0,Math.min(100,Number(text[1]))):0
}
function header(){
 const nav=document.querySelector('.l7-topbar nav');
 if(!nav)return;
 const links=nav.querySelectorAll('a');
 if(links[0])links[0].textContent='← Zurück';
 if(links[1])links[1].textContent='Übersicht'
}
function theme(){
 const grid=document.querySelector('.l7-grid');
 if(!grid)return;
 grid.closest('.l7-card')?.classList.add('l7-theme-tasks');
 grid.querySelectorAll('.l7-module').forEach(module=>{
  if(module.dataset.l7t1Matched==='1')return;
  const number=module.querySelector('.l7-module-top span')?.textContent?.trim()||'';
  const icon=module.querySelector('.l7-icon')?.textContent?.trim()||'▶';
  const title=module.querySelector('h3')?.textContent?.trim()||'Aufgabe';
  const description=module.querySelector('p')?.textContent?.trim()||'';
  const value=percent(module);
  const locked=module.classList.contains('locked');
  const done=module.classList.contains('done')||value>=100;
  const start=locked?'Gesperrt':done?'Fertig':'Starten';
  module.innerHTML=`<div class="num">${number}. ${title}</div><div class="big-icon" aria-hidden="true">${icon}</div><p class="small">${description}</p><div class="l7-progress"><span style="width:${value}%"></span></div><div class="small">${value}%</div><div class="start">${start}</div>`;
  module.dataset.l7t1Matched='1'
 })
}
function task(){
 const area=document.getElementById('taskArea');
 area?.closest('.l7-card')?.classList.add('l7-task-shell')
}
function enhance(){
 document.body.classList.add('l7t1-l6t4');
 header();
 if(document.body.dataset.page==='theme')theme();else task()
}
let queued=false;
function schedule(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;enhance()})
}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
enhance();
})();
