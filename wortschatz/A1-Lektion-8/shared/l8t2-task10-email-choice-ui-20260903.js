(function(){
'use strict';
if(window.__SP_L8T2_TASK10_EMAIL_CHOICE_UI_20260903_V1)return;
window.__SP_L8T2_TASK10_EMAIL_CHOICE_UI_20260903_V1=true;
const base=window.L8UI;if(!base||typeof base.taskPage!=='function')return;
const original=base.taskPage;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=()=>window.L8S,T=()=>window.L8_THEME;
function current(){const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))||null}
function taskNumber(task){const i=(T()?.tasks||[]).findIndex(x=>String(x?.id)===String(task?.id));return i>=0?i+1:''}
function head(task,state){const done=state.done?.length||0,total=Math.max(1,task.items.length),pct=Math.round(done/total*100);return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>📧 ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function finish(root){root.innerHTML='<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle E-Mails bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>'}
function gapHtml(blank,index,value){const label=value||'___';return `<span class="sp-email-choice-wrap" data-gap-wrap="${index}"><button type="button" class="sp-email-gap${value?' has-value':''}" data-gap="${index}">${esc(label)}</button><span class="sp-email-options" data-options="${index}" hidden>${(blank.options||[]).map(o=>`<button type="button" data-pick="${index}" data-value="${esc(o)}">${esc(o)}</button>`).join('')}</span></span>`}
function lineHtml(line,item,selected){const raw=String(line||''),m=raw.match(/^([^:]{1,20}):\s*(.*)$/),speaker=m?m[1]:'',text=m?m[2]:raw;const parts=text.split(/(\{\{\d+\}\})/g).map(part=>{const hit=part.match(/^\{\{(\d+)\}\}$/);if(!hit)return esc(part);const i=Number(hit[1]);return gapHtml(item.blanks?.[i]||{},i,selected[i]||'')}).join('');return `<div class="l8-dialog-line ${raw===''?'is-empty':''}">${speaker?`<strong class="l8-dialog-speaker">${esc(speaker)}:</strong>`:''}<span>${parts}</span></div>`}
function closeMenus(root){root.querySelectorAll('.sp-email-options').forEach(x=>x.hidden=true)}
function render(task,root){
 let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);if(idx==null||idx<0)return finish(root);
 state=S().load(T().number,task.id,task.items.length);const item=task.items[idx],selected=Array((item.blanks||[]).length).fill('');
 root.innerHTML=`<div class="l8-wrap">${head(task,state)}<section class="l8-card l8-exercise l8-dialog-exercise l8-email-exercise sp-email-choice-exercise"><div class="l8-dialog">${(item.lines||[]).map(line=>lineHtml(line,item,selected)).join('')}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="spEmailChoiceCheck" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
 root.querySelectorAll('[data-gap]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const i=Number(btn.dataset.gap),menu=root.querySelector(`[data-options="${i}"]`),wasOpen=menu&&!menu.hidden;closeMenus(root);if(menu)menu.hidden=wasOpen});
 root.querySelectorAll('[data-pick]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const i=Number(btn.dataset.pick),value=btn.dataset.value||'';selected[i]=value;const gap=root.querySelector(`[data-gap="${i}"]`);if(gap){gap.textContent=value;gap.classList.add('has-value');gap.classList.remove('is-wrong','is-right')}closeMenus(root)});
 root.onclick=e=>{if(!e.target.closest('.sp-email-choice-wrap'))closeMenus(root)};
 document.getElementById('spEmailChoiceCheck').onclick=()=>{
  if(selected.some(v=>!v)){feedback('warn','Wähle für jede Lücke ein Wort.');return}
  let all=true;
  (item.blanks||[]).forEach((blank,i)=>{const ok=S().equal(selected[i],blank.answers||[]),gap=root.querySelector(`[data-gap="${i}"]`);if(gap){gap.classList.toggle('is-right',ok);gap.classList.toggle('is-wrong',!ok)}if(!ok)all=false});
  const stored=selected.join('|||');
  if(!all){S().wrong(T().number,task.id,task.items.length,idx,stored);feedback('bad','Mindestens eine Auswahl ist noch nicht richtig.');return}
  const r=S().right(T().number,task.id,task.items.length,idx,stored);feedback('good',r.needsReview?'Richtig. Diese E-Mail kommt am Ende noch einmal.':'Richtig!');const check=document.getElementById('spEmailChoiceCheck');if(check)check.disabled=true;setTimeout(()=>render(task,root),180)
 };
}
function patched(){const task=current(),root=document.getElementById('app');if(task?.kind==='email-choice-blanks'&&root)return render(task,root);return original()}
window.L8UI={...base,taskPage:patched};
const style=document.createElement('style');style.id='sp-l8t2-email-choice-ui-style';style.textContent=`.sp-email-choice-exercise{background:#f4f7fa}.sp-email-choice-exercise .l8-dialog{background:#fff;border:1px solid #d8e0e7;border-radius:16px;padding:22px 24px;box-shadow:0 8px 24px rgba(32,56,74,.07);gap:10px}.sp-email-choice-wrap{position:relative;display:inline-block;vertical-align:middle;margin:2px 4px}.sp-email-gap{min-width:104px;padding:7px 10px;border:2px dashed var(--lesson-main,var(--l8-main));border-radius:10px;background:#fffdf2;font:inherit;font-weight:800;cursor:pointer}.sp-email-gap.has-value{border-style:solid}.sp-email-gap.is-right{outline:3px solid #b9e7c5}.sp-email-gap.is-wrong{outline:3px solid #f3b6b6}.sp-email-options{position:absolute;z-index:20;left:0;top:calc(100% + 5px);min-width:180px;padding:6px;background:#fff;border:1px solid #cfd9e2;border-radius:12px;box-shadow:0 10px 28px rgba(25,47,64,.16)}.sp-email-options button{display:block;width:100%;border:0;background:#fff;text-align:left;padding:9px 10px;border-radius:8px;font:inherit;font-weight:750;cursor:pointer}.sp-email-options button:hover,.sp-email-options button:focus{background:var(--lesson-soft,var(--l8-soft))}@media(max-width:620px){.sp-email-choice-exercise .l8-dialog{padding:16px 14px}.sp-email-options{position:fixed;left:12px;right:12px;top:auto;bottom:18px;min-width:0}.sp-email-options button{padding:12px}}`;document.head.appendChild(style);
})();
