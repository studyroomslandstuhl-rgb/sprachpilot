(function(){
'use strict';
const D=window.L9T2;if(!D||!Array.isArray(D.imperativeTable))return;
for(let i=D.imperativeTable.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[D.imperativeTable[i],D.imperativeTable[j]]=[D.imperativeTable[j],D.imperativeTable[i]]}
if(String(new URLSearchParams(location.search).get('task')||'')==='imperativ-tabelle'){
 const s=document.createElement('script');
 s.src='./l9t2-task8-help-fix.js?v=20260907-task8help1';
 s.defer=true;
 document.head.appendChild(s);
}
})();
