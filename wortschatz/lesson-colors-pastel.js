(function(){
'use strict';
const COLORS={
 9:{main:'#E7EFCB',soft:'#F8FAF0',line:'#D9E2B9',ink:'#46522C',sub:'#66723F'},
 14:{main:'#C6DED2',soft:'#F2F8F5',line:'#B9D3C6',ink:'#365B4A',sub:'#557867'}
};
function lessonNumber(el){
 const href=String(el.getAttribute?.('href')||'');
 const byHref=href.match(/A1-Lektion-(\d+)/i);if(byHref)return Number(byHref[1]);
 const byText=String(el.textContent||'').match(/Lektion\s+(\d+)/i);return byText?Number(byText[1]):0;
}
function apply(){
 document.querySelectorAll('.lesson-btn').forEach(el=>{
  const c=COLORS[lessonNumber(el)];if(!c)return;
  el.style.setProperty('--lesson-btn-main',c.main);
  el.style.setProperty('--lesson-btn-soft',c.soft);
  el.style.setProperty('--lesson-btn-line',c.line);
  el.style.setProperty('--lesson-btn-ink',c.ink);
  el.style.setProperty('--lesson-btn-sub',c.sub);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
new MutationObserver(()=>apply()).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(apply,400);setTimeout(apply,1400);
})();
