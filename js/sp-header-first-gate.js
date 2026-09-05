(function(){
'use strict';
const root=document.documentElement;
let resolveReady;
const ready=new Promise(resolve=>{resolveReady=resolve});
window.SPHeaderFirst={ready};
if(!root.classList.contains('sp-header-first')){resolveReady(true);return}
const started=Date.now();let scheduled=false,settled=false;
function settle(value){if(settled)return;settled=true;resolveReady(value)}
function reveal(){root.classList.remove('sp-header-first');root.classList.add('sp-header-ready')}
function showContentAfterHeaderPaint(){if(scheduled)return;scheduled=true;settle(true);requestAnimationFrame(()=>requestAnimationFrame(reveal))}
function check(){
 if(document.querySelector('.sp-header')){showContentAfterHeaderPaint();return}
 if(Date.now()-started>6000){settle(false);reveal();return}
 requestAnimationFrame(check)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});else check();
})();
