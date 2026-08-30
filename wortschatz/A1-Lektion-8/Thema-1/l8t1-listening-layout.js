(function(){
'use strict';
if(window.__SP_L8T1_LISTENING_LAYOUT_V2)return;window.__SP_L8T1_LISTENING_LAYOUT_V2=true;
function isListening(){return new URLSearchParams(location.search).get('task')==='berufe-hoeren-v3'}
function adjustLayout(){
 if(!isListening())return;
 const head=document.querySelector('.l8-task-head');
 const progress=head?.querySelector('.l8-progress');
 const instruction=head?.querySelector('.l8-task-title-block p, p.l8t1-listening-instruction');
 if(head&&progress&&instruction){
  instruction.classList.add('l8t1-listening-instruction');
  if(progress.nextElementSibling!==instruction)progress.after(instruction);
 }
}
function needsRecovery(){
 if(!isListening())return false;
 const text=String(document.getElementById('app')?.textContent||'');
 return text.includes('Diese Aufgabe konnte nicht dargestellt werden')||text.includes('Aufgabe wird geladen');
}
function recoverOnce(){
 if(!needsRecovery())return;
 try{
  window.L8T1ListeningV2?.install?.();
  if(window.L8UI?.taskPage)window.L8UI.taskPage();
 }catch(e){console.warn('L8T1 Hören konnte noch nicht gerendert werden',e)}
}
const style=document.createElement('style');style.textContent='.l8t1-listening-instruction{margin:16px 0 0!important;font-size:18px!important;line-height:1.45!important;font-weight:800!important;color:var(--lesson-text,#24384a)!important}.l8-task-head>.l8t1-listening-instruction{width:100%}';document.head.appendChild(style);
const root=document.getElementById('app');
if(root)new MutationObserver(adjustLayout).observe(root,{childList:true,subtree:true});
[0,80,220,600,1400].forEach(ms=>setTimeout(adjustLayout,ms));
// Recovery is deliberately timer-bound. Never re-render from the MutationObserver:
// changing app.innerHTML would trigger the observer again and could create a render loop.
[60,180,450,900,1600].forEach(ms=>setTimeout(()=>{recoverOnce();adjustLayout()},ms));
})();