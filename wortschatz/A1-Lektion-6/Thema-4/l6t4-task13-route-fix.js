(function(){
'use strict';
const TARGET='dialoge.html?v=202607301352';
function fix(){
 document.querySelectorAll('#taskGrid a').forEach(link=>{
  const text=(link.textContent||'').toLowerCase();
  const href=link.getAttribute('href')||'';
  if(text.includes('13.')||href.includes('dialoge.html')||href.includes('dialog-abc'))link.setAttribute('href',TARGET);
 });
}
fix();
const grid=document.getElementById('taskGrid');
if(grid)new MutationObserver(fix).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();