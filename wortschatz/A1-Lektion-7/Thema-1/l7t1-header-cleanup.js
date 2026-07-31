(function(){
'use strict';
if(window.__SP_L7T1_HEADER_CLEANUP_1)return;
window.__SP_L7T1_HEADER_CLEANUP_1=true;

let scheduled=false;
let headerRequested=false;

function isLegacyHeader(element){
  if(!(element instanceof Element))return false;
  if(element.classList.contains('sp-header'))return false;
  const classes=String(element.className||'').toLowerCase();
  if(/(?:^|\s)(?:l7-)?(?:topbar|header)(?:\s|$)/.test(classes))return true;
  const text=String(element.textContent||'').replace(/\s+/g,' ').trim();
  return /SprachPilot/i.test(text)&&/(Dashboard|Profil|Abmelden|Zurück|Übersicht|Fortschritte löschen)/i.test(text);
}

function requestStandardHeader(){
  if(document.querySelector('.sp-header')||headerRequested)return;
  headerRequested=true;
  import('/js/sp-header.js?v=theme-standard2').then(module=>{
    module.installSpHeader();
    setTimeout(()=>{headerRequested=false;schedule();},80);
  }).catch(()=>{headerRequested=false;});
}

function clean(){
  scheduled=false;
  const standardHeaders=[...document.querySelectorAll('.sp-header')];
  standardHeaders.slice(1).forEach(header=>header.remove());

  const root=document.getElementById('app');
  if(root){
    const candidates=new Set([
      ...root.querySelectorAll('header,.topbar,.l7-topbar,.l7-header,[class*="topbar"],[class*="header"]'),
      ...root.querySelectorAll(':scope > *, .l7-page > :first-child')
    ]);
    candidates.forEach(element=>{
      if(isLegacyHeader(element))element.remove();
    });
  }

  requestStandardHeader();
}

function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(clean);
}

const style=document.createElement('style');
style.id='l7t1-header-cleanup-style';
style.textContent=`
#app .topbar,
#app .l7-topbar,
#app .l7-header,
#app header:not(.sp-header){display:none!important}
`;
document.head.appendChild(style);

const observe=()=>{
  const target=document.getElementById('app')||document.body;
  if(!target)return;
  new MutationObserver(schedule).observe(target,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
[0,80,220,600,1400,3000].forEach(delay=>setTimeout(schedule,delay));
})();
