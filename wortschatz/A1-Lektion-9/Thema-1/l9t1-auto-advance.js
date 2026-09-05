(function(){
'use strict';
const id=new URLSearchParams(location.search).get('task');
const sequential=new Set(['hoeren-bild','bedeutung-wort','bild-sprechen','muessen-saetze','modal-kontext','anweisungen-hoeren','pruefung']);
if(!sequential.has(id))return;
const root=document.getElementById('app');if(!root)return;
let timer=null;
function schedule(node){
 clearTimeout(timer);
 timer=setTimeout(()=>{
  if(!node?.isConnected)return;
  const text=String(node.textContent||'').trim();
  if(!/^Richtig\.?$/i.test(text)&&!/Richtig\./i.test(text))return;
  location.reload();
 },950);
}
function scan(){
 root.querySelectorAll('.ok,.l8-feedback.good,.l9-ok').forEach(node=>{
  if(node.dataset.l9AdvanceWatch==='1')return;
  const text=String(node.textContent||'').trim();
  if(!/Richtig/i.test(text))return;
  node.dataset.l9AdvanceWatch='1';schedule(node);
 });
}
new MutationObserver(scan).observe(root,{childList:true,subtree:true});
scan();
})();