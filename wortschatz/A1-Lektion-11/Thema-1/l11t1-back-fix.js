(function(){
'use strict';
function fixBack(){
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{
  const text=String(link.textContent||'').replace(/\s+/g,' ').trim();
  if(text==='← Zurück'||text==='Zurück'){
   link.setAttribute('href','index.html');
   if(link.dataset.l11BackFixed!=='1'){
    link.dataset.l11BackFixed='1';
    link.addEventListener('click',function(e){
     e.preventDefault();
     window.location.href='index.html';
    });
   }
  }
 });
}
new MutationObserver(fixBack).observe(document.documentElement,{childList:true,subtree:true});
[0,50,150,400,1000].forEach(ms=>setTimeout(fixBack,ms));
})();
