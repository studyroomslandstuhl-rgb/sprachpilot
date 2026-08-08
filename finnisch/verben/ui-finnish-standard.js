(function(){
'use strict';
if(window.__SP_FI_UI_STANDARD_V1)return;
window.__SP_FI_UI_STANDARD_V1=true;

try{localStorage.setItem('SP_LEARNING_LANGUAGE','fi')}catch{}

function replaceText(root=document){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName))continue;
    let text=node.nodeValue||'';
    text=text.replace(/Bedeutung → Verb/g,'Übersetzung → Verb')
      .replace(/Verb → Bedeutung/g,'Verb → Übersetzung')
      .replace(/Bedeutung:/g,'Übersetzung:')
      .replace(/Nutze Bedeutung/g,'Nutze Übersetzung')
      .replace(/Was bedeutet „([^”]+)“\?/g,'Welche deutsche Übersetzung passt zu „$1“?');
    if(text!==node.nodeValue)node.nodeValue=text;
  }
}
function apply(){
  if(!location.pathname.startsWith('/finnisch/'))return;
  try{localStorage.setItem('SP_LEARNING_LANGUAGE','fi')}catch{}
  document.querySelectorAll('a.brand[href="/index.html"],a.brand-logo[href="/index.html"]').forEach(a=>a.href='/finnisch/');
  replaceText(document.querySelector('#app')||document);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);schedule();
})();
