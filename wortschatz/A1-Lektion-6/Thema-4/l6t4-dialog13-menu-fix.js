(function(){
'use strict';
if(window.__L6T4_DIALOG13_MENU_FIX)return;
window.__L6T4_DIALOG13_MENU_FIX=true;
const original=window.l6t4MatchedMenu;
if(typeof original!=='function')return;
window.l6t4MatchedMenu=function(){
 const result=original.apply(this,arguments);
 document.querySelectorAll('a[href*="task.html?task=dialog-abc"]').forEach(link=>{
  try{
   const url=new URL(link.getAttribute('href'),location.href);
   url.searchParams.set('v','l6t4-dialog13-3');
   link.setAttribute('href',url.pathname.split('/').pop()+url.search)
  }catch(e){}
 });
 return result
};
})();
