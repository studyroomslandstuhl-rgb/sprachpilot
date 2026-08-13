(function(){
'use strict';
if(window.__SP_L7T1_ABILITY_UI_1)return;
window.__SP_L7T1_ABILITY_UI_1=true;
if(!window.L7||!window.L7S)return;

const S=window.L7S;
const originalRender=window.L7.renderTaskPage;
const CDN='https://sprachpilot.b-cdn.net/';
let current=null;

function esc(value){return S.esc(value)}
function fileUrl(file){
 const value=String(file||'').trim();
 if(!value)return'';
 if(/^https?:\/\//i.test(value))return value;
 return CDN+value.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}
function progressHtml(theme,task,total){
 const state=S.load(theme,task.id,total);
 const percent=Math.round(state.done.length/Math.max(1,total)*100);
 return `<div class="l7-progress-row"><span>${state.done.length} fehlerfrei · ${total-state.done.length} übrig</span><strong>${percent}%</strong></div><div class="l7-progress"><span style="width:${percent}%"></span></div>`;
}
function nextTask(task){
 const tasks=S.T.tasks||[];
 return tasks[tasks.findIndex(item=>item.id===task.id)+1]||null;
}
function finish(theme,task){
 const root=document.getElementById('app'),next=nextTask(task);
 root.innerHTML=`<div class="l7-page"><section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`;
}
function draftKey(index){return`ability:${index}`}
function saveDraft(theme,task,total,index,value){
 const state=S.load(theme,task.id,total);state.answers=state.answers||{};
 const key=draftKey(index);
 if(String(value||'').trim())state.answers[key]=String(value);else delete state.answers[key];
 S.save(theme,task.id,state,false);
}
function clearDraft(theme,task,total,index){
 const state=S.load(theme,task.id,total);state.answers=state.answers||{};
 delete state.answers[draftKey(index)];S.save(theme,task.id,state,false);
}
function activityImage(item){
 const src=fileUrl(item.image);
 if(!src)return'';
 return `<div class="sp-ability-image"><img src="${esc(src)}" alt="" loading="eager" decoding="async" onerror="this.hidden=true"></div>`;
}
function renderAbility(theme,id){
 theme=Number(theme);
 const task=S.task(id);
 if(!task)return originalRender(theme,id);
 const total=Math.max(1,task.items?.length||0);
 let state=S.load(theme,task.id,total);
 if(state.done.length>=total)return finish(theme,task);
 const index=S.index(theme,task.id,total);
 state=S.load(theme,task.id,total);
 const item=task.items?.[index]||{};
 const value=String(state.answers?.[draftKey(index)]||'');
 current={theme,task,total,index,item};
 const wrong=state.tries?'<div class="l7-no">Noch nicht richtig.</div>':'';
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page"><section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description)}</div><div id="spAbilityTask" class="l7-question-card"><div class="sp-ability-cue"><div class="sp-ability-subject">${esc(item.subject)}</div><div class="sp-ability-emoji" role="img" aria-label="${esc(item.level)}">${esc(item.emoji)}</div>${activityImage(item)}</div><div class="sp-ability-answer"><input id="spAbilityInput" autocomplete="off" autocapitalize="sentences" value="${esc(value)}"><button type="button" class="l7-btn" id="spCheckAbility">Prüfen</button></div><div id="spAbilityFeedback">${wrong}</div></div></section><footer>© SprachPilot</footer></div>`;
 const input=document.getElementById('spAbilityInput');
 input?.addEventListener('input',event=>saveDraft(theme,task,total,index,event.target.value));
 const check=()=>{
  const answer=String(input?.value||'').trim();if(!answer)return;
  const ok=[item.answer,...(item.answers||[])].filter(Boolean).some(expected=>S.norm(expected)===S.norm(answer));
  S.attempt(theme,task.id,total,index,ok);
  if(!ok){S.wrong(theme,task.id,total);return renderAbility(theme,id)}
  clearDraft(theme,task,total,index);S.right(theme,task.id,total);
  const feedback=document.getElementById('spAbilityFeedback');if(feedback)feedback.innerHTML='<div class="l7-ok">Richtig.</div>';
  document.querySelectorAll('#spAbilityTask button,#spAbilityTask input').forEach(node=>node.disabled=true);
  setTimeout(()=>renderAbility(theme,id),550);
 };
 document.getElementById('spCheckAbility')?.addEventListener('click',check);
 input?.addEventListener('keydown',event=>{if(event.key==='Enter')check()});
 input?.focus();
 window.L7T1BunnyImages?.patchAll?.(root);
}

const style=document.createElement('style');
style.id='sp-l7t1-ability-ui-style';
style.textContent=`
.sp-ability-cue{display:grid;grid-template-columns:minmax(100px,auto) 76px 190px;gap:18px;align-items:center;justify-content:center;margin:8px auto 24px}.sp-ability-subject{font-size:30px;font-weight:950;color:var(--dark);text-align:center}.sp-ability-emoji{font-size:58px;line-height:1;text-align:center}.sp-ability-image{width:170px;height:170px;border-radius:20px;overflow:hidden;background:var(--soft);display:grid;place-items:center}.sp-ability-image img{width:100%;height:100%;object-fit:contain;display:block}.sp-ability-answer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;max-width:720px;margin:0 auto}.sp-ability-answer input{width:100%;box-sizing:border-box;padding:15px 17px;border:2px solid var(--line);border-radius:14px;background:#fff;color:var(--dark);font:inherit;font-size:19px}@media(max-width:650px){.sp-ability-cue{grid-template-columns:1fr 70px;gap:12px}.sp-ability-image{grid-column:1/-1;width:min(170px,55vw);height:min(170px,55vw);justify-self:center}.sp-ability-subject{font-size:26px}.sp-ability-answer{grid-template-columns:1fr}.sp-ability-emoji{font-size:50px}}
`;
document.head.appendChild(style);

window.L7.renderTaskPage=function(theme,id){
 if(id==='faehigkeit-saetze-schreiben')return renderAbility(theme,id);
 return originalRender(theme,id);
};
})();
