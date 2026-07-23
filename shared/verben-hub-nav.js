(function(){
'use strict';
const topbar=document.querySelector('#topbar');
if(!topbar)return;
function apply(){
 topbar.querySelectorAll('nav.topnav a[href="/index.html"]').forEach(link=>{
  link.href='/verben-bereich/';
  link.textContent='← Verben';
 });
}
apply();
new MutationObserver(apply).observe(topbar,{childList:true,subtree:true});
})();