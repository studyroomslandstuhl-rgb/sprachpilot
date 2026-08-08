(function(){
'use strict';
if(window.__SP_VERB_GROUP_COMPLETION_FEEDBACK_V1)return;
window.__SP_VERB_GROUP_COMPLETION_FEEDBACK_V1=true;
const finalSummary=text=>/Runde\s*3\s*\/\s*3/i.test(text)&&/(\d+)\s*\/\s*\1\s*·\s*Prüfung\s*100\s*%/i.test(text);
function apply(){
 document.querySelectorAll('.group-panel').forEach(panel=>{
  const summary=panel.querySelector('summary');if(!summary)return;
  const done=finalSummary(summary.textContent||'');
  panel.classList.toggle('sp-group-final-complete',done);
  let badge=summary.querySelector('.sp-group-final-badge');
  if(done&&!badge){badge=document.createElement('span');badge.className='sp-group-final-badge';badge.textContent='✓ Erledigt';summary.appendChild(badge)}
  if(!done&&badge)badge.remove();
  if(done&&panel.open){
   const score=document.querySelector('.score-card');
   if(score&&!score.querySelector('.sp-group-final-praise')){
    const praise=document.createElement('div');praise.className='sp-group-final-praise';praise.innerHTML='<strong>Sehr gut!</strong><span>Du hast diese Gruppe dreimal vollständig abgeschlossen.</span>';score.appendChild(praise)
   }
  }
 });
}
const style=document.createElement('style');style.textContent=`
.group-panel.sp-group-final-complete{border-color:#86cfa1!important;background:#f1fbf4!important;box-shadow:0 10px 26px rgba(22,101,52,.10)!important}
.group-panel.sp-group-final-complete>summary{background:#f1fbf4!important;color:#166534!important}
.sp-group-final-badge{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:999px;background:#dcfce7;color:#166534;font-size:13px;font-weight:900;white-space:nowrap}
.sp-group-final-praise{grid-column:1/-1;width:100%;margin-top:10px;padding:12px 14px;border:2px solid #86cfa1;border-radius:16px;background:#f1fbf4;color:#166534;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.sp-group-final-praise strong{font-size:18px}.sp-group-final-praise span{font-size:15px}
`;document.head.appendChild(style);
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
window.addEventListener('popstate',schedule);schedule();
})();
