(function(){
'use strict';
if(window.__SP_L8T2_LISTENING_ALL_UI_20260901)return;
window.__SP_L8T2_LISTENING_ALL_UI_20260901=true;

const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
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
 const total=task.items.length,pct=Math.round((state.done?.length||0)/Math.max(1,total)*100);
 return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>🎧 ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`;
}
function choiceHtml(item,index,saved,done,wrong){
 return `<div class="l8-listen-question ${done?'is-done':''} ${wrong?'is-wrong':''}" data-q="${index}"><div class="l8-listen-qhead"><strong>${index+1}.</strong><span>${esc(item.prompt)}</span></div><div class="l8-listen-options">${(item.options||[]).map((opt,j)=>{const id=`l8la-${index}-${j}`;return `<label for="${id}"><input id="${id}" type="radio" name="q${index}" value="${esc(opt)}" ${String(saved)===String(opt)?'checked':''} ${done?'disabled':''}><span>${esc(opt)}</span></label>`}).join('')}</div>${wrong?'<div class="l8-listen-mini">Noch nicht richtig.</div>':''}</div>`;
}
function inputHtml(item,index,saved,done,wrong){
 return `<div class="l8-listen-question ${done?'is-done':''} ${wrong?'is-wrong':''}" data-q="${index}"><div class="l8-listen-qhead"><strong>${index+1}.</strong><span>${esc(item.prompt)}</span></div><input class="l8-input l8-listen-text" data-input-q="${index}" autocomplete="off" value="${esc(saved||'')}" ${done?'disabled':''} placeholder="Antworte in einem vollständigen Satz.">${wrong?'<div class="l8-listen-mini">Noch nicht richtig.</div>':''}</div>`;
}
function canonicalNumberText(value){
 return S().norm(value)
  .replace(/\bzwei\b/g,'2')
  .replace(/\bdrei\b/g,'3')
  .replace(/\bvier\b/g,'4')
  .replace(/\bfünf\b/g,'5')
  .replace(/\bfuenf\b/g,'5')
  .replace(/\bsechs\b/g,'6')
  .replace(/\bsieben\b/g,'7')
  .replace(/\bacht\b/g,'8')
  .replace(/\bneun\b/g,'9')
  .replace(/\bzehn\b/g,'10');
}
function equalAnswer(value,expected,task){
 if(S().equal(value,expected))return true;
 if(!task?.acceptDigitWords)return false;
 const v=canonicalNumberText(value),all=Array.isArray(expected)?expected:[expected];
 return all.some(x=>canonicalNumberText(x)===v);
}
function render(task,root){
 const total=task.items.length,state=S().load(T().number,task.id,total),doneSet=new Set(state.done||[]);
 if(doneSet.size>=total){
  root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Fragen richtig beantwortet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`;
  return;
 }
 const questions=task.items.map((item,index)=>{
  const saved=state.answers?.[index]||'',done=doneSet.has(index),wrong=!done&&Number(state.tries?.[index]||0)>0;
  return item.type==='choice'?choiceHtml(item,index,saved,done,wrong):inputHtml(item,index,saved,done,wrong);
 }).join('');
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead(task,state)}<section class="l8-card l8-listening-all"><div class="l8-listen-audio"><button class="l8-btn l8-audio primary" id="listenAll" type="button">🔊 Gespräch anhören</button><span>Du kannst das Gespräch mehrmals hören.</span></div><div class="l8-listen-questions">${questions}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="checkAll" type="button">Alle Antworten prüfen</button></div><div id="feedback"></div></section></div>`;
 document.getElementById('listenAll').onclick=()=>S().say('',task.audioFile||task.audio);
 document.getElementById('checkAll').onclick=()=>{
  const fresh=S().load(T().number,task.id,total),already=new Set(fresh.done||[]),values=[];
  let missing=false;
  task.items.forEach((item,index)=>{
   if(already.has(index)){values[index]=fresh.answers?.[index]||'';return}
   if(item.type==='choice'){
    const checked=root.querySelector(`input[name="q${index}"]:checked`);values[index]=checked?.value||'';
   }else{
    values[index]=root.querySelector(`[data-input-q="${index}"]`)?.value?.trim()||'';
   }
   if(!values[index])missing=true;
  });
  if(missing){const box=document.getElementById('feedback');if(box)box.innerHTML='<div class="l8-feedback warn">Beantworte zuerst alle offenen Fragen.</div>';return}
  task.items.forEach((item,index)=>{
   if(already.has(index))return;
   const value=values[index],expected=item.answer;
   if(equalAnswer(value,expected,task)){
    const r=S().right(T().number,task.id,total,index,value);
    if(r.needsReview)S().right(T().number,task.id,total,index,value);
   }else S().wrong(T().number,task.id,total,index,value);
  });
  setTimeout(()=>render(task,root),120);
 };
}

function patchedTaskPage(){
 const task=currentTask(),root=document.getElementById('app');
 if(task&&task.kind==='listening-all'){
  window.resetThemeProgress=()=>S().reset(T().number);
  return render(task,root);
 }
 return originalTaskPage();
}
window.L8UI={...base,taskPage:patchedTaskPage};

const style=document.createElement('style');
style.id='sp-l8t2-listening-all-ui-20260901';
style.textContent=`.l8-listening-all{max-width:920px;margin-inline:auto}.l8-listen-audio{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:24px}.l8-listen-audio span{font-size:14px;opacity:.75}.l8-listen-questions{display:grid;gap:14px}.l8-listen-question{padding:16px;border:1px solid var(--lesson-line,var(--l8-line));border-radius:16px;background:#fff}.l8-listen-question.is-done{background:#f2fbf4;border-color:#a8d8b0}.l8-listen-question.is-wrong{background:#fff8f4;border-color:#efb9a3}.l8-listen-qhead{display:flex;gap:8px;align-items:flex-start;font-size:17px;line-height:1.45;margin-bottom:10px}.l8-listen-options{display:grid;gap:8px}.l8-listen-options label{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:#f7fafc}.l8-listen-text{width:100%;max-width:760px}.l8-listen-mini{margin-top:8px;font-size:14px;color:#9b4a2b}@media(max-width:620px){.l8-listen-question{padding:13px}.l8-listen-qhead{font-size:16px}.l8-listen-audio .l8-btn{width:100%}}`;
document.head.appendChild(style);
})();