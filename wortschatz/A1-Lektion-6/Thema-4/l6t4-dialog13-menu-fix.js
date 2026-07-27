(function(){
'use strict';
if(window.__L6T4_DIALOG13_MENU_FIX)return;
window.__L6T4_DIALOG13_MENU_FIX=true;
const original=window.l6t4MatchedMenu;
if(typeof original!=='function')return;
window.l6t4MatchedMenu=function(){
 const result=original.apply(this,arguments);
 document.querySelectorAll('a[href*="task.html?task=dialog-abc"]').forEach(link=>{
  link.setAttribute('href','dialoge.html?v=l6t4-dialoge1');
 });
 return result
};
})();
