(function(){
'use strict';
if(window.__SP_L8T2_DIALOG_UI_20260901)return;
window.__SP_L8T2_DIALOG_UI_20260901=true;

const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const originalTaskEmoji=base.taskEmoji;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const S=()=>window.L8S;
const T=()=>window.L8_THEME;

function currentTask(){
 const id=new URLSearchParams(location.search).get('task');
 return (T()?.tasks||[]).find(task=>String(task?.id)===String(id));
}
function taskNumber(task){const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''}
function previewNote(){return S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskHead(task,state){
 const pct=Math.round((state.done?.length||0)/Math.max(1,task.items.length)*100),emoji=originalTaskEmoji?originalTaskEmoji(task):(task.emoji||'✍️');
 return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>${esc(emoji)} ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`;
}
function imageSrc(raw){const v=String(raw||'').trim();if(!v)return'';if(/^https?:\/\//i.test(v))return v;return `https://sprachpilot.b-cdn.net/${v.replace(/^\/+/, '')}`}
function blankHtml(blank,index,value){
 const src=imageSrc(blank?.image);
 return `<span class="l8-dialog-blank"><input class="l8-input l8-dialog-input" data-dialog-blank="${index}" autocomplete="off" value="${esc(value||'')}" aria-label="Lücke ${index+1}">${src?`<img src="${esc(src)}" alt="" loading="lazy">`:''}</span>`;
}
function lineHtml(line,item,saved){
 const raw=String(line||''),m=raw.match(/^([^:]{1,20}):\s*(.*)$/),speaker=m?m[1]:'',text=m?m[2]:raw;
 const parts=text.split(/(\{\{\d+\}\})/g).map(part=>{
  const hit=part.match(/^\{\{(\d+)\}\}$/);if(!hit)return esc(part);
  const i=Number(hit[1]);return blankHtml(item.blanks?.[i],i,saved[i]||'');
 }).join('');
 return `<div class="l8-dialog-line">${speaker?`<strong class="l8-dialog-speaker">${esc(speaker)}:</strong>`:''}<span>${parts}</span></div>`;
}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function finish(task,root){
 root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast die Aufgabe zu 100 % abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`;
}
function render(task,root){
 let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);
 if(idx==null||idx<0)return finish(task,root);
 state=S().load(T().number,task.id,task.items.length);
 const item=task.items[idx],savedRaw=String(state.answers?.[idx]||''),saved=savedRaw.includes('|||')?savedRaw.split('|||'):[];
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead(task,state)}<section class="l8-card l8-exercise l8-dialog-exercise"><div class="l8-dialog">${(item.lines||[]).map(line=>lineHtml(line,item,saved)).join('')}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="dialogCheck" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
 const inputs=[...root.querySelectorAll('[data-dialog-blank]')];
 const checkNow=()=>{
  const values=inputs.map(input=>input.value.trim());
  if(values.some(v=>!v)){feedback('warn','Fülle alle Lücken aus.');return}
  const correct=(item.blanks||[]).every((blank,i)=>S().equal(values[i],blank.answers||[]));
  const stored=values.join('|||');
  if(correct){
   const r=S().right(T().number,task.id,task.items.length,idx,stored);
   feedback('good',r.needsReview?'Richtig. Dieser Dialog kommt am Ende noch einmal.':'Richtig!');
   setTimeout(()=>render(task,root),550);
  }else{
   const r=S().wrong(T().number,task.id,task.items.length,idx,stored),n=r.tries;
   if(n===1)feedback('bad','Noch nicht richtig.');
   else if(n===2)feedback('warn','Prüfe alle Lücken noch einmal.');
   else feedback('warn',`Lösung: ${(item.blanks||[]).map(b=>(b.answers||[])[0]||'').join(' · ')}`);
  }
 };
 document.getElementById('dialogCheck').onclick=checkNow;
 inputs.forEach((input,i)=>input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(i<inputs.length-1)inputs[i+1].focus();else checkNow()}}));
 inputs[0]?.focus?.();
}

function patchedTaskPage(){
 const task=currentTask(),root=document.getElementById('app');
 if(task&&(task.kind==='dialog-blanks'||(task.items||[]).some(item=>item?.type==='dialog-blanks'))){
  window.resetThemeProgress=()=>S().reset(T().number);
  return render(task,root);
 }
 return originalTaskPage();
}

window.L8UI={...base,taskPage:patchedTaskPage};
const style=document.createElement('style');
style.id='sp-l8t2-dialog-ui-20260901';
style.textContent=`.l8-dialog-exercise{max-width:920px;margin-inline:auto}.l8-dialog{display:grid;gap:14px}.l8-dialog-line{display:flex;gap:10px;align-items:flex-start;font-size:18px;line-height:1.65}.l8-dialog-speaker{min-width:28px;color:var(--lesson-main-dark,var(--l8-dark))}.l8-dialog-line>span{flex:1}.l8-dialog-blank{display:inline-flex;align-items:center;gap:7px;vertical-align:middle;margin:2px 4px}.l8-dialog-input{width:145px;min-width:105px;padding:8px 10px!important}.l8-dialog-blank img{width:48px;height:48px;object-fit:cover;border-radius:10px;border:1px solid var(--lesson-line,var(--l8-line));background:#fff}@media(max-width:620px){.l8-dialog-line{font-size:16px}.l8-dialog-input{width:118px}.l8-dialog-blank img{width:42px;height:42px}}`;
document.head.appendChild(style);
})();
