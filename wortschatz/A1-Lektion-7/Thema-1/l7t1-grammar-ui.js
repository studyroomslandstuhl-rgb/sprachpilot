(function(){
'use strict';
if(window.__SP_L7T1_GRAMMAR_UI_1)return;
window.__SP_L7T1_GRAMMAR_UI_1=true;
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
function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(item=>item.id===task.id)+1]||null}
function finish(theme,task){
 const root=document.getElementById('app'),next=nextTask(task);
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`;
}
function stateFor(theme,task,total){return S.load(theme,task.id,total)}
function key(index,name){return`grammar:${index}:${name}`}
function saveValue(theme,task,total,index,name,value){
 const state=stateFor(theme,task,total);state.answers=state.answers||{};
 const k=key(index,name);
 if(value===''||value==null||(Array.isArray(value)&&!value.length))delete state.answers[k];else state.answers[k]=value;
 S.save(theme,task.id,state,false);
}
function getValue(state,index,name,fallback){return state.answers?.[key(index,name)]??fallback}
function clearIndex(theme,task,total,index){
 const state=stateFor(theme,task,total);state.answers=state.answers||{};
 Object.keys(state.answers).filter(k=>k.startsWith(`grammar:${index}:`)).forEach(k=>delete state.answers[k]);
 S.save(theme,task.id,state,false);
}
function markWrong(){
 const{theme,task,total,index}=current;
 S.attempt(theme,task.id,total,index,false);S.wrong(theme,task.id,total);renderSpecial(theme,task.id);
}
function markRight(delay=550){
 const{theme,task,total,index}=current;
 S.attempt(theme,task.id,total,index,true);clearIndex(theme,task,total,index);S.right(theme,task.id,total);
 const feedback=document.getElementById('spGrammarFeedback');if(feedback)feedback.innerHTML='<div class="l7-ok">Richtig.</div>';
 document.querySelectorAll('#spGrammarTask button,#spGrammarTask input').forEach(node=>node.disabled=true);
 setTimeout(()=>renderSpecial(theme,task.id),delay);
}
function shell(theme,task,total,state,body){
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description)}</div><div id="spGrammarTask" class="l7-question-card">${body}<div id="spGrammarFeedback">${state.tries?'<div class="l7-no">Noch nicht richtig.</div>':''}</div></div></section><footer>© SprachPilot</footer></div>`;
}

function renderTable(theme,task,total,index,state,item){
 current={theme,task,total,index,kind:'table'};
 const values=item.rows.map((row,rowIndex)=>String(getValue(state,index,`row-${rowIndex}`,'')||''));
 const rows=item.rows.map((row,rowIndex)=>`<tr><th>${esc(row.pronoun)}</th><td><input data-conj-row="${rowIndex}" autocomplete="off" value="${esc(values[rowIndex])}"></td></tr>`).join('');
 shell(theme,task,total,state,`<div class="sp-conj-write-table-wrap"><table class="sp-conj-write-table"><thead><tr><th>Pronomen</th><th>${esc(item.verb)}</th></tr></thead><tbody>${rows}</tbody></table></div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckConjTable">Prüfen</button></div>`);
 document.querySelectorAll('[data-conj-row]').forEach(input=>input.addEventListener('input',event=>saveValue(theme,task,total,index,`row-${event.target.dataset.conjRow}`,event.target.value)));
 const check=()=>{
  const inputs=[...document.querySelectorAll('[data-conj-row]')];
  if(inputs.some(input=>!String(input.value||'').trim()))return;
  const ok=item.rows.every((row,rowIndex)=>S.norm(inputs[rowIndex].value)===S.norm(row.answer));
  if(ok)return markRight(650);markWrong();
 };
 document.getElementById('spCheckConjTable')?.addEventListener('click',check);
 document.querySelectorAll('[data-conj-row]').forEach(input=>input.addEventListener('keydown',event=>{if(event.key==='Enter')check()}));
}
function renderForm(theme,task,total,index,state,item){
 current={theme,task,total,index,kind:'form'};
 const value=String(getValue(state,index,'input','')||'');
 shell(theme,task,total,state,`<div class="sp-grammar-form-prompt">${esc(item.prompt)}</div><div class="sp-grammar-single-input"><input id="spGrammarInput" autocomplete="off" value="${esc(value)}"><button type="button" class="l7-btn" id="spCheckGrammarInput">Prüfen</button></div>`);
 const input=document.getElementById('spGrammarInput');
 input?.addEventListener('input',event=>saveValue(theme,task,total,index,'input',event.target.value));
 const check=()=>{const value=String(input?.value||'').trim();if(!value)return;return S.norm(value)===S.norm(item.answer)?markRight():markWrong()};
 document.getElementById('spCheckGrammarInput')?.addEventListener('click',check);input?.addEventListener('keydown',event=>{if(event.key==='Enter')check()});
 input?.focus();
}
function renderContext(theme,task,total,index,state,item){
 current={theme,task,total,index,kind:'context'};
 shell(theme,task,total,state,`<h2 class="sp-context-prompt">${esc(item.prompt)}</h2><div class="l7-options">${S.shuffle([...(item.options||[])]).map(option=>`<button type="button" data-context-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div>`);
 document.querySelectorAll('[data-context-answer]').forEach(button=>button.addEventListener('click',()=>S.norm(button.dataset.contextAnswer||'')===S.norm(item.answer||'')?markRight():markWrong()));
}

function orderArray(state,index){const saved=getValue(state,index,'order',[]);return Array.isArray(saved)?[...saved]:[]}
function usedCounts(order){const used={};order.forEach(token=>used[token]=(used[token]||0)+1);return used}
function renderTokenBank(tokens,order){
 const used=usedCounts(order);
 return S.shuffle(tokens).map(token=>{const disabled=(used[token]||0)>0;if(disabled)used[token]--;return`<button type="button" data-order-token="${esc(token)}" ${disabled?'disabled':''}>${esc(token)}</button>`}).join('');
}
function compact(value){return S.norm(value).replace(/\s+/g,'')}
function orderedText(order){return order.join(' ').replace(/\s+([.?!,])/g,'$1')}
function renderOrderStage(theme,task,total,index,state,item){
 current={theme,task,total,index,kind:'order'};
 const order=orderArray(state,index);
 shell(theme,task,total,state,`<div id="spOrderAnswer" class="l7-order-answer">${order.length?esc(orderedText(order)):' '}</div><div class="l7-tokens" id="spOrderTokens">${renderTokenBank(item.tokens||[],order)}</div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckOrder">Prüfen</button><button type="button" class="l7-btn secondary" id="spUndoOrder">Zurück</button><button type="button" class="l7-btn ghost" id="spResetOrder">Neu</button></div>`);
 const redraw=()=>renderOrderStage(theme,task,total,index,stateFor(theme,task,total),item);
 document.querySelectorAll('[data-order-token]').forEach(button=>button.addEventListener('click',()=>{const next=orderArray(stateFor(theme,task,total),index);next.push(button.dataset.orderToken);saveValue(theme,task,total,index,'order',next);redraw()}));
 document.getElementById('spUndoOrder')?.addEventListener('click',()=>{const next=orderArray(stateFor(theme,task,total),index);next.pop();saveValue(theme,task,total,index,'order',next);redraw()});
 document.getElementById('spResetOrder')?.addEventListener('click',()=>{saveValue(theme,task,total,index,'order',[]);redraw()});
 document.getElementById('spCheckOrder')?.addEventListener('click',()=>{
  const next=orderArray(stateFor(theme,task,total),index);if(!next.length)return;
  if(compact(orderedText(next))!==compact(item.answer||''))return markWrong();
  saveValue(theme,task,total,index,'phase','mark');renderMarkStage(theme,task,total,index,stateFor(theme,task,total),item);
 });
}
function selectedSet(state,index,name){const value=getValue(state,index,name,[]);return new Set(Array.isArray(value)?value:[])}
function sameSet(a,b){if(a.size!==b.size)return false;for(const value of a)if(!b.has(value))return false;return true}
function renderMarkStage(theme,task,total,index,state,item){
 current={theme,task,total,index,kind:'mark'};
 const mode=String(getValue(state,index,'mode','subject')||'subject');
 const subject=selectedSet(state,index,'subject');
 const verbs=selectedSet(state,index,'verbs');
 const tokens=(item.tokens||[]).filter(token=>!/^[.?!,]$/.test(token));
 const sentence=tokens.map((token,tokenIndex)=>{
  const id=`${tokenIndex}:${token}`;
  const cls=[subject.has(id)?'is-subject':'',verbs.has(id)?'is-verb':''].filter(Boolean).join(' ');
  return`<button type="button" class="sp-mark-token ${cls}" data-mark-id="${esc(id)}" data-mark-token="${esc(token)}">${esc(token)}</button>`;
 }).join(' ');
 shell(theme,task,total,state,`<div class="sp-mark-modes"><button type="button" class="${mode==='subject'?'active':''}" data-mark-mode="subject">Subjekt</button><button type="button" class="${mode==='verbs'?'active':''}" data-mark-mode="verbs">Verben</button></div><div class="sp-mark-sentence">${sentence}</div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckMarks">Prüfen</button></div>`);
 document.querySelectorAll('[data-mark-mode]').forEach(button=>button.addEventListener('click',()=>{saveValue(theme,task,total,index,'mode',button.dataset.markMode);renderMarkStage(theme,task,total,index,stateFor(theme,task,total),item)}));
 document.querySelectorAll('[data-mark-id]').forEach(button=>button.addEventListener('click',()=>{
  const currentState=stateFor(theme,task,total),currentMode=String(getValue(currentState,index,'mode','subject')||'subject');
  const set=selectedSet(currentState,index,currentMode);const id=button.dataset.markId;
  if(set.has(id))set.delete(id);else set.add(id);
  saveValue(theme,task,total,index,currentMode,[...set]);renderMarkStage(theme,task,total,index,stateFor(theme,task,total),item);
 }));
 document.getElementById('spCheckMarks')?.addEventListener('click',()=>{
  const currentState=stateFor(theme,task,total);
  const chosenSubject=selectedSet(currentState,index,'subject'),chosenVerbs=selectedSet(currentState,index,'verbs');
  const expectedSubject=new Set(),expectedVerbs=new Set();
  tokens.forEach((token,tokenIndex)=>{
   const id=`${tokenIndex}:${token}`;
   if((item.subject||[]).some(value=>S.norm(value)===S.norm(token)))expectedSubject.add(id);
   if((item.verbs||[]).some(value=>S.norm(value)===S.norm(token)))expectedVerbs.add(id);
  });
  if(sameSet(chosenSubject,expectedSubject)&&sameSet(chosenVerbs,expectedVerbs))return markRight(650);
  markWrong();
 });
}
function renderOrderMark(theme,task,total,index,state,item){
 const phase=String(getValue(state,index,'phase','order')||'order');
 return phase==='mark'?renderMarkStage(theme,task,total,index,state,item):renderOrderStage(theme,task,total,index,state,item);
}

function renderSpecial(theme,id){
 theme=Number(theme);const task=taskById(id);if(!task)return originalRender(theme,id);
 const total=Math.max(1,task.items?.length||0);let state=stateFor(theme,task,total);
 if(state.done.length>=total)return finish(theme,task);
 const index=S.index(theme,task.id,total);state=stateFor(theme,task,total);const item=task.items?.[index]||{};
 if(id==='modal-konjugieren')return renderTable(theme,task,total,index,state,item);
 if(id==='modalformen-schreiben')return renderForm(theme,task,total,index,state,item);
 if(id==='modalverb-kontext')return renderContext(theme,task,total,index,state,item);
 if(id==='aussagen-ordnen-markieren'||id==='fragen-ordnen-markieren')return renderOrderMark(theme,task,total,index,state,item);
 return originalRender(theme,id);
}

const style=document.createElement('style');
style.id='sp-l7t1-grammar-ui-style';
style.textContent=`
.sp-conj-write-table-wrap{overflow-x:auto}.sp-conj-write-table{width:100%;border-collapse:separate;border-spacing:8px;margin:8px 0 18px}.sp-conj-write-table th{padding:10px;text-align:left;color:var(--dark);font-size:18px}.sp-conj-write-table thead th{text-align:center}.sp-conj-write-table td{padding:4px}.sp-conj-write-table input,.sp-grammar-single-input input{width:100%;box-sizing:border-box;padding:13px 15px;border:2px solid var(--line);border-radius:13px;font:inherit;background:#fff;color:var(--dark)}.sp-grammar-form-prompt{font-size:26px;font-weight:900;color:var(--dark);margin:10px 0 18px}.sp-grammar-single-input{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.sp-context-prompt{margin:8px 0 20px;color:var(--dark)}.sp-mark-modes{display:flex;gap:10px;margin-bottom:18px}.sp-mark-modes button{padding:10px 18px;border:2px solid var(--line);border-radius:999px;background:#fff;color:var(--dark);font-weight:900}.sp-mark-modes button.active{border-color:var(--dark);background:var(--soft)}.sp-mark-sentence{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 22px}.sp-mark-token{padding:10px 13px;border:2px solid var(--line);border-radius:12px;background:#fff;color:var(--dark);font-size:18px;font-weight:800}.sp-mark-token.is-subject{outline:3px solid currentColor}.sp-mark-token.is-verb{text-decoration:underline;text-decoration-thickness:4px;text-underline-offset:5px}.sp-mark-token.is-subject.is-verb{outline:3px solid currentColor;text-decoration:underline;text-decoration-thickness:4px}@media(max-width:650px){.sp-grammar-single-input{grid-template-columns:1fr}.sp-conj-write-table th{font-size:15px}.sp-mark-token{font-size:16px}}
`;
document.head.appendChild(style);

window.L7.renderTaskPage=function(theme,id){
 if(['modal-konjugieren','modalformen-schreiben','modalverb-kontext','aussagen-ordnen-markieren','fragen-ordnen-markieren'].includes(id))return renderSpecial(theme,id);
 return originalRender(theme,id);
};
})();
