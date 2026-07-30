(function(){
'use strict';
const TARGET='dialoge.html?v=202607301410';
let running=false;
function fix(){
 if(running)return;
 running=true;
 try{
  document.querySelectorAll('#taskGrid a').forEach(link=>{
   const text=(link.textContent||'').toLowerCase();
   const href=link.getAttribute('href')||'';
   if(text.includes('13.')||href.includes('dialoge.html')||href.includes('dialog-abc')){
    if(href!==TARGET)link.setAttribute('href',TARGET);
   }
  });
 }finally{
  running=false;
 }
}
fix();
const grid=document.getElementById('taskGrid');
if(grid)new MutationObserver(fix).observe(grid,{childList:true,subtree:true});
})();