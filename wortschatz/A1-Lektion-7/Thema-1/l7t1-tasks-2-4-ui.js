(function(){
'use strict';
if(window.__SP_L7T1_TASKS_2_4_UI_1)return;
window.__SP_L7T1_TASKS_2_4_UI_1=true;
if(!window.L7||!window.L7S)return;

const S=window.L7S;
const originalRender=window.L7.renderTaskPage;
let current=null;

function esc(value){return S.esc(value)}
function taskById(id){return S.task(id)}
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
 const root=document.getElementById('app');
 const next=nextTask(task);
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Aufgaben richtig gelöst.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`;
}
function correctAndContinue(delay=500){
 const{theme,task,total,index}=current;
 const before=S.load(theme,task.id,total);
 const repeat=before.hadWrong||before.tries>0;
 S.right(theme,task.id,total);
 const feedback=document.getElementById('spSpecialFeedback');
 if(feedback)feedback.innerHTML=`<div class="l7-ok">Richtig.${repeat?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;
 document.querySelectorAll('#spSpecialTask button,#spSpecialTask input').forEach(node=>node.disabled=true);
 setTimeout(()=>renderSpecial(theme,task.id),delay);
}
function wrongAndRepeat(){
 const{theme,task,total}=current;
 S.wrong(theme,task.id,total);
 renderSpecial(theme,task.id);
}

function renderMeaning(theme,task,total,index,state,item){
 const root=document.getElementById('app');
 const options=S.shuffle([...(item.options||[])]).slice(0,6);
 const wrong=Number(state.tries||0)>0?'<div class="l7-no">Noch nicht richtig. Versuche es noch einmal.</div>':'';
 current={theme,task,total,index,kind:'meaning'};
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description)}</div><div id="spSpecialTask" class="l7-question-card"><p class="eyebrow">Aufgabe ${state.done.length+1} von ${total}</p><h2>${esc(item.prompt)}</h2><div class="l7-options">${options.map(option=>`<button type="button" data-meaning-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div><div id="spSpecialFeedback">${wrong}</div></div></section><footer>© SprachPilot</footer></div>`;
 document.querySelectorAll('[data-meaning-answer]').forEach(button=>button.addEventListener('click',()=>{
  const answer=button.dataset.meaningAnswer||'';
  const ok=S.norm(answer)===S.norm(item.answer||'');
  S.attempt(theme,task.id,total,index,ok);
  if(ok)return correctAndContinue();
  wrongAndRepeat();
 }));
}

function draftKey(index,field){return`nounplural:${index}:${field}`}
function draftValue(state,index,field){return String(state.answers?.[draftKey(index,field)]??'')}
function saveDraft(theme,task,total,index,field,value){
 const state=S.load(theme,task.id,total);
 state.answers=state.answers||{};
 const key=draftKey(index,field);
 if(String(value||'').trim())state.answers[key]=String(value);else delete state.answers[key];
 S.save(theme,task.id,state,false);
}
function clearNounDrafts(){
 const{theme,task,total,index}=current;
 const state=S.load(theme,task.id,total);
 state.answers=state.answers||{};
 delete state.answers[draftKey(index,'singular')];
 delete state.answers[draftKey(index,'plural')];
 S.save(theme,task.id,state,false);
}
function normalizePlural(value){return S.norm(value).replace(/^die\s+/,'die ')}
function renderNounPlural(theme,task,total,index,state,item){
 const root=document.getElementById('app');
 const singular=draftValue(state,index,'singular');
 const plural=draftValue(state,index,'plural');
 const wrong=Number(state.tries||0)>0?'<div class="l7-no">Noch nicht richtig. Prüfe beide Felder.</div>':'';
 current={theme,task,total,index,kind:'noun-plural'};
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description)}</div><div id="spSpecialTask" class="l7-question-card"><p class="eyebrow">Aufgabe ${state.done.length+1} von ${total}</p>${item.image?S.image(item.image,'Nomen'):''}<div class="sp-noun-plural-inputs"><label>Nomen mit Artikel<input id="spNounSingular" autocomplete="off" placeholder="z. B. das Buch" value="${esc(singular)}"></label><label>Plural<input id="spNounPlural" autocomplete="off" placeholder="z. B. die Bücher" value="${esc(plural)}"></label></div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckNounPlural">Prüfen</button></div><div id="spSpecialFeedback">${wrong}</div></div></section><footer>© SprachPilot</footer></div>`;
 const singularInput=document.getElementById('spNounSingular');
 const pluralInput=document.getElementById('spNounPlural');
 singularInput?.addEventListener('input',event=>saveDraft(theme,task,total,index,'singular',event.target.value));
 pluralInput?.addEventListener('input',event=>saveDraft(theme,task,total,index,'plural',event.target.value));
 const check=()=>{
  const singularValue=String(singularInput?.value||'').trim();
  const pluralValue=String(pluralInput?.value||'').trim();
  if(!singularValue||!pluralValue)return;
  saveDraft(theme,task,total,index,'singular',singularValue);
  saveDraft(theme,task,total,index,'plural',pluralValue);
  const singularOk=S.norm(singularValue)===S.norm(item.singularAnswer||'');
  const expectedPlural=String(item.pluralAnswer||'').trim();
  const pluralOk=normalizePlural(pluralValue)===normalizePlural(expectedPlural);
  const ok=singularOk&&pluralOk;
  S.attempt(theme,task.id,total,index,ok);
  if(ok){clearNounDrafts();return correctAndContinue(650)}
  wrongAndRepeat();
 };
 document.getElementById('spCheckNounPlural')?.addEventListener('click',check);
 [singularInput,pluralInput].forEach(input=>input?.addEventListener('keydown',event=>{if(event.key==='Enter')check()}));
}

function renderSpecial(theme,id){
 theme=Number(theme);
 const task=taskById(id);
 if(!task)return originalRender(theme,id);
 const total=Math.max(1,task.items?.length||0);
 let state=S.load(theme,task.id,total);
 if(state.done.length>=total)return finish(theme,task);
 const index=S.index(theme,task.id,total);
 state=S.load(theme,task.id,total);
 const item=task.items?.[index]||{};
 if(id==='bild-erklaerung-wort')return renderMeaning(theme,task,total,index,state,item);
 if(id==='artikel-plural')return renderNounPlural(theme,task,total,index,state,item);
 return originalRender(theme,id);
}

const style=document.createElement('style');
style.id='sp-l7t1-tasks-2-4-style';
style.textContent=`
.sp-noun-plural-inputs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}.sp-noun-plural-inputs label{display:grid;gap:8px;color:var(--dark);font-weight:900;font-size:16px}.sp-noun-plural-inputs input{width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid var(--line);border-radius:14px;background:#fff;color:var(--dark);font:inherit}.sp-noun-plural-inputs input:focus{outline:3px solid rgba(91,61,135,.18);border-color:var(--dark)}@media(max-width:650px){.sp-noun-plural-inputs{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

window.L7.renderTaskPage=function(theme,id){
 if(id==='bild-erklaerung-wort'||id==='artikel-plural')return renderSpecial(theme,id);
 return originalRender(theme,id);
};
})();
