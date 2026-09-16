(function(){
'use strict';
const TARGET='/wortschatz/A1-Lektion-11/Thema-1/';
function isBack(el){
 const text=String(el?.textContent||'').replace(/\s+/g,' ').trim();
 return text==='← Zurück'||text==='Zurück';
}
function fixBack(){
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{
  if(!isBack(link))return;
  link.setAttribute('href',TARGET);
  link.onclick=function(e){
   e.preventDefault();
   e.stopPropagation();
   window.location.assign(TARGET);
   return false;
  };
 });
}
document.addEventListener('click',function(e){
 const link=e.target.closest('.sp-header__nav-link');
 if(!link||!isBack(link))return;
 e.preventDefault();
 e.stopImmediatePropagation();
 window.location.assign(TARGET);
},true);
new MutationObserver(fixBack).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixBack,{once:true});else fixBack();
[0,50,150,400,1000,2000].forEach(ms=>setTimeout(fixBack,ms));
})();
