(function(){
'use strict';
const root=document.documentElement;
if(!root.classList.contains('sp-header-first'))return;
const started=Date.now();
function reveal(){root.classList.remove('sp-header-first');root.classList.add('sp-header-ready')}
function check(){
 if(document.querySelector('.sp-header')){reveal();return}
 if(Date.now()-started>6000){reveal();return}
 requestAnimationFrame(check)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});else check();
})();
