(function(){
'use strict';
if(window.__SP_L7_RELEASE_ENFORCER_V1)return;window.__SP_L7_RELEASE_ENFORCER_V1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/'))return;
let observer=null,lastLocked=false;
function themeNumber(){return Number(document.body?.dataset?.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||0)}
function page(){return String(document.body?.dataset?.page||(/\/task\.html$/i.test(location.pathname)?'task':'theme'))}
function examTask(){return (window.L7_THEME?.tasks||[]).find(task=>task?.exam)||null}
function releaseApi(){return window.SprachPilotRelease||null}
function examReleased(){
 const api=releaseApi(),theme=themeNumber();if(!api||!theme)return true;
 const ctx={module:'wortschatz',lesson:'A1-Lektion-7',theme:`Thema-${theme}`,file:'__exam__',kind:'task'};
 try{return api.taskReleased('__exam__',ctx,api.localData?.()||{})!==false}catch(e){return true}
}
function style(){if(document.getElementById('sp-l7-exam-release-style'))return;const s=document.createElement('style');s.id='sp-l7-exam-release-style';s.textContent='.sp-l7-exam-release-locked{opacity:.55!important;filter:saturate(.55);cursor:not-allowed!important}.sp-l7-exam-release-locked .start,.sp-l7-exam-release-locked .l7-module-bottom strong{font-size:0!important}.sp-l7-exam-release-locked .start:after,.sp-l7-exam-release-locked .l7-module-bottom strong:after{content:"Prüfung gesperrt";font-size:initial!important}';document.head.appendChild(s)}
function overview(){
 const exam=examTask();if(!exam)return false;style();const card=document.getElementById(`task-${exam.id}`);if(!card)return false;const open=examReleased();lastLocked=!open;
 if(open){if(card.dataset.spExamReleaseHref){card.setAttribute('href',card.dataset.spExamReleaseHref);delete card.dataset.spExamReleaseHref}card.classList.remove('sp-l7-exam-release-locked');if(card.tagName==='A')card.removeAttribute('aria-disabled');return true}
 if(card.tagName==='A'){if(!card.dataset.spExamReleaseHref)card.dataset.spExamReleaseHref=card.getAttribute('href')||'';card.setAttribute('href','#');card.setAttribute('aria-disabled','true')}
 card.classList.add('sp-l7-exam-release-locked');return true
}
function taskPage(){
 const exam=examTask(),current=String(new URLSearchParams(location.search).get('task')||'');if(!exam||current!==String(exam.id))return false;
 if(examReleased()){lastLocked=false;return true}lastLocked=true;
 const root=document.getElementById('app');if(!root)return false;
 if(root.dataset.spExamReleaseLocked==='1')return true;
 root.dataset.spExamReleaseLocked='1';root.innerHTML='<div class="l7-page"><section class="l7-card l7-finish"><div>🔒</div><h2>Prüfung gesperrt</h2><p>Diese Prüfung ist für deinen Kurs noch nicht freigegeben.</p><a class="l7-btn" href="index.html">Zur Übersicht</a></section></div>';return true
}
function apply(){return page()==='task'?taskPage():overview()}
function schedule(){[20,80,180,420,900,1600,2800].forEach(delay=>setTimeout(apply,delay))}
Promise.resolve(window.L7_THEME_READY).then(()=>{schedule();if(observer)return;let timer=null;observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,40)});observer.observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true})}).catch(()=>schedule());
window.addEventListener('SP_RELEASES_UPDATED',()=>{const root=document.getElementById('app');if(root&&lastLocked&&page()==='task'&&examReleased())location.reload();else schedule()});
document.addEventListener('click',event=>{const exam=examTask();if(!exam||examReleased())return;const card=event.target?.closest?.(`#task-${CSS.escape(String(exam.id))}`);if(!card)return;event.preventDefault();event.stopPropagation();alert('Diese Prüfung ist für deinen Kurs noch nicht freigegeben.')},true);
schedule();
})();