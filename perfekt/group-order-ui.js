(function(){
'use strict';

const ORDER=['Regelmäßige Verben','Starke / unregelmäßige Verben','Verben auf -ieren','Nicht trennbare Verben','Reflexive Verben','Trennbare Verben'];
const rank=title=>{const index=ORDER.findIndex(item=>String(title||'').includes(item));return index<0?ORDER.length:index};
const mapping=new Map();
let applying=false;
let queued=false;

function setText(element,value){
 if(element&&element.textContent!==value)element.textContent=value
}

function rememberMapping(panels){
 mapping.clear();
 panels.forEach((panel,index)=>{
  const summary=panel.querySelector('summary[data-group]');
  const actual=Number(summary?.dataset.group)||0;
  if(actual)mapping.set(actual,index+1);
  setText(panel.querySelector('.group-number'),`Gruppe ${index+1}`)
 });
 try{sessionStorage.setItem('SP_PERFEKT_VISIBLE_GROUPS',JSON.stringify(Object.fromEntries(mapping)))}catch{}
}

function loadMapping(){
 if(mapping.size)return;
 try{const saved=JSON.parse(sessionStorage.getItem('SP_PERFEKT_VISIBLE_GROUPS')||'{}');Object.entries(saved).forEach(([actual,visible])=>mapping.set(Number(actual),Number(visible)))}catch{}
}

function replaceGroupLabels(root=document){
 loadMapping();
 if(!mapping.size)return;
 root.querySelectorAll('.eyebrow,.group-number,.task-page-head p,.score-card p').forEach(element=>{
  const match=String(element.textContent||'').trim().match(/^Gruppe\s+(\d+)$/i);
  if(!match)return;
  const visible=mapping.get(Number(match[1]));
  if(visible)setText(element,`Gruppe ${visible}`)
 })
}

function sameOrder(current,sorted){
 return current.length===sorted.length&&current.every((panel,index)=>panel===sorted[index])
}

function apply(){
 if(applying)return;
 applying=true;
 observer.disconnect();
 try{
  const panels=[...document.querySelectorAll('#app .group-panel')];
  if(panels.length){
   const parent=panels[0].parentElement;
   const sorted=panels.slice().sort((a,b)=>{
    const aTitle=a.querySelector('summary span:nth-child(2)')?.textContent||'';
    const bTitle=b.querySelector('summary span:nth-child(2)')?.textContent||'';
    return rank(aTitle)-rank(bTitle)
   });
   if(parent&&!sameOrder(panels,sorted))sorted.forEach(panel=>parent.appendChild(panel));
   rememberMapping(sorted)
  }
  replaceGroupLabels(document)
 }finally{
  observer.observe(document.documentElement,{childList:true,subtree:true});
  applying=false
 }
}

function schedule(){
 if(queued)return;
 queued=true;
 const run=()=>{queued=false;apply()};
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(run);else setTimeout(run,0)
}

const observer=new MutationObserver(schedule);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);
document.addEventListener('click',()=>setTimeout(schedule,0),true);
schedule();
})();