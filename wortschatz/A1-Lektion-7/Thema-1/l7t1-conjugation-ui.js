(function(){
'use strict';
if(window.__SP_L7T1_CONJUGATION_UI_1)return;
window.__SP_L7T1_CONJUGATION_UI_1=true;
if(!window.L7||!window.L7S)return;

const S=window.L7S;
const originalRender=window.L7.renderTaskPage;
let current=null;

function esc(value){return S.esc(value)}
function tokensFor(rows){
 const tokens=[];
 rows.forEach((row,index)=>{
  tokens.push({id:`k-${index}`,label:row.koennen,target:`k-zone-${index}`});
  tokens.push({id:`w-${index}`,label:row.wollen,target:`w-zone-${index}`});
 });
 return tokens;
}
function stateFor(theme,task){
 S.index(theme,task.id,1);
 const state=S.load(theme,task.id,1);
 const saved=state.answers?.placements;
 return saved&&typeof saved==='object'&&!Array.isArray(saved)?{...saved}:{};
}
function savePlacements(){
 const{theme,task,placements}=current;
 const state=S.load(theme,task.id,1);
 state.answers=state.answers||{};
 state.answers.placements={...placements};
 S.save(theme,task.id,state,false);
}
function clearPlacements(){
 current.placements={};
 current.selected='';
 savePlacements();
}
function tokenById(id){return current.tokens.find(token=>token.id===id)}
function assignedToken(target){
 const id=current.placements[target];
 return id?tokenById(id):null;
}
function availableTokens(){
 const assigned=new Set(Object.values(current.placements));
 return current.tokenOrder.map(id=>tokenById(id)).filter(token=>token&&!assigned.has(token.id));
}
function zoneHtml(target,label){
 const token=assignedToken(target);
 const wrong=current.wrongTargets.has(target);
 return `<button type="button" class="sp-conj-zone ${token?'filled':''} ${wrong?'wrong':''}" data-zone="${esc(target)}" aria-label="Form für ${esc(label)}">${token?`<span data-remove-token="${esc(token.id)}">${esc(token.label)} ×</span>`:'Hier ablegen'}</button>`;
}
function boardHtml(){
 const rows=current.rows;
 return `<div class="sp-conj-bank" aria-label="Verbformen">${availableTokens().map(token=>`<button type="button" class="sp-conj-token ${current.selected===token.id?'selected':''}" draggable="true" data-token="${esc(token.id)}">${esc(token.label)}</button>`).join('')||'<span class="sp-conj-bank-empty">Alle Formen sind verteilt.</span>'}</div>
 <div class="sp-conj-table-wrap"><table class="sp-conj-table"><thead><tr><th>Personalpronomen</th><th>können</th><th>wollen</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><th>${esc(row.pronoun)}</th><td>${zoneHtml(`k-zone-${index}`,`${row.pronoun} können`)}</td><td>${zoneHtml(`w-zone-${index}`,`${row.pronoun} wollen`)}</td></tr>`).join('')}</tbody></table></div>`;
}
function solutionHtml(){
 return `<div class="l7-hint"><strong>Lösung:</strong><br>${current.rows.map(row=>`${esc(row.pronoun)}: ${esc(row.koennen)} · ${esc(row.wollen)}`).join('<br>')}<br>Ordne die Formen trotzdem selbst richtig zu.</div>`;
}
function draw(){
 const board=document.getElementById('spConjugationBoard');
 if(board)board.innerHTML=boardHtml();
 const feedback=document.getElementById('spConjugationFeedback');
 if(feedback)feedback.innerHTML=current.feedback+(current.showSolution?solutionHtml():'');
 bindBoard();
}
function assign(tokenId,target){
 if(!tokenById(tokenId))return;
 for(const [zone,id] of Object.entries(current.placements))if(id===tokenId)delete current.placements[zone];
 current.placements[target]=tokenId;
 current.selected='';
 current.wrongTargets.delete(target);
 savePlacements();
 draw();
}
function removeToken(tokenId){
 for(const [zone,id] of Object.entries(current.placements))if(id===tokenId)delete current.placements[zone];
 current.selected=tokenId;
 savePlacements();
 draw();
}
function bindBoard(){
 document.querySelectorAll('[data-token]').forEach(button=>{
  button.addEventListener('click',()=>{current.selected=button.dataset.token;draw()});
  button.addEventListener('dragstart',event=>{current.selected=button.dataset.token;event.dataTransfer?.setData('text/plain',button.dataset.token)});
 });
 document.querySelectorAll('[data-zone]').forEach(zone=>{
  zone.addEventListener('dragover',event=>event.preventDefault());
  zone.addEventListener('drop',event=>{
   event.preventDefault();
   const tokenId=event.dataTransfer?.getData('text/plain')||current.selected;
   if(tokenId)assign(tokenId,zone.dataset.zone);
  });
  zone.addEventListener('click',event=>{
   const remove=event.target.closest('[data-remove-token]');
   if(remove)return removeToken(remove.dataset.removeToken);
   if(current.selected)assign(current.selected,zone.dataset.zone);
  });
 });
}
function check(){
 const expected={};
 current.tokens.forEach(token=>expected[token.target]=token.id);
 const targets=Object.keys(expected);
 const missing=targets.filter(target=>!current.placements[target]);
 if(missing.length){
  current.feedback='<div class="l7-hint">Ordne zuerst alle Verbformen zu.</div>';
  draw();
  return;
 }
 const wrong=targets.filter(target=>current.placements[target]!==expected[target]);
 const ok=wrong.length===0;
 S.attempt(current.theme,current.task.id,1,0,ok);
 if(!ok){
  const tries=S.wrong(current.theme,current.task.id,1);
  current.wrongTargets=new Set(tries>=2?wrong:[]);
  current.showSolution=tries>=3;
  current.feedback=tries===1?'<div class="l7-no">Noch nicht richtig. Versuche es noch einmal.</div>':tries===2?'<div class="l7-hint"><strong>Hinweis:</strong> Die markierten Felder sind noch falsch.</div>':'<div class="l7-no">Prüfe die Tabelle mit der Lösung und ordne alle Formen selbst richtig zu.</div>';
  draw();
  return;
 }
 const before=S.load(current.theme,current.task.id,1);
 const repeat=before.hadWrong||before.tries>0;
 clearPlacements();
 S.right(current.theme,current.task.id,1);
 current.feedback=`<div class="l7-ok">Richtig.${repeat?' Die Tabelle kommt noch einmal.':''}</div>`;
 current.wrongTargets.clear();
 current.showSolution=false;
 draw();
 setTimeout(()=>renderConjugation(current.theme,current.task.id),650);
}
function finish(theme,task){
 const root=document.getElementById('app');
 const tasks=S.T.tasks;
 const next=tasks[tasks.findIndex(item=>item.id===task.id)+1];
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Formen von „können“ und „wollen“ richtig zugeordnet.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`;
}
function renderConjugation(theme,id){
 theme=Number(theme);
 const task=S.task(id);
 if(!task)return originalRender(theme,id);
 const state=S.load(theme,task.id,1);
 if(state.done.length>=1)return finish(theme,task);
 const item=task.items?.[0]||{};
 const rows=Array.isArray(item.rows)?item.rows:[];
 const placements=stateFor(theme,task);
 const tokens=tokensFor(rows);
 current={theme,task,rows,tokens,placements,selected:'',wrongTargets:new Set(),showSolution:false,feedback:'',tokenOrder:S.shuffle(tokens.map(token=>token.id))};
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card"><div class="l7-progress-row"><span>0 fehlerfrei · 1 übrig</span><strong>0%</strong></div><div class="l7-progress"><span style="width:0%"></span></div><div class="l7-instruction">${esc(task.description)}</div><div class="l7-question-card"><p class="eyebrow">Aufgabe 1</p><h2>${esc(item.prompt||task.description)}</h2><p class="sp-conj-help">Ziehe eine Form in ein Feld. Auf dem Smartphone kannst du zuerst die Form und danach das Feld antippen.</p><div id="spConjugationBoard"></div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckConjugation">Prüfen</button><button type="button" class="l7-btn secondary" id="spResetConjugation">Neu ordnen</button></div><div id="spConjugationFeedback"></div></div></section><footer>© SprachPilot</footer></div>`;
 document.getElementById('spCheckConjugation')?.addEventListener('click',check);
 document.getElementById('spResetConjugation')?.addEventListener('click',()=>{clearPlacements();current.feedback='';current.wrongTargets.clear();current.showSolution=false;draw()});
 draw();
}

const style=document.createElement('style');
style.id='sp-l7t1-conjugation-style';
style.textContent=`
.sp-conj-help{margin:0 0 16px;color:var(--muted);font-size:16px}.sp-conj-bank{display:flex;flex-wrap:wrap;gap:10px;min-height:66px;padding:14px;margin:16px 0;border:2px dashed var(--line);border-radius:18px;background:var(--soft)}.sp-conj-token{padding:11px 16px;border:2px solid var(--dark);border-radius:14px;background:#fff;color:var(--dark);font-weight:900;font-size:17px;cursor:grab}.sp-conj-token.selected{outline:4px solid rgba(91,61,135,.22);transform:translateY(-2px)}.sp-conj-bank-empty{align-self:center;color:var(--muted);font-weight:800}.sp-conj-table-wrap{overflow-x:auto}.sp-conj-table{width:100%;border-collapse:separate;border-spacing:8px}.sp-conj-table th{color:var(--dark);font-size:17px;text-align:left}.sp-conj-table thead th{text-align:center}.sp-conj-table tbody th{min-width:130px}.sp-conj-zone{width:100%;min-width:140px;min-height:52px;padding:10px;border:2px dashed var(--line);border-radius:14px;background:#fff;color:var(--muted);font-weight:800}.sp-conj-zone.filled{border-style:solid;border-color:var(--dark);color:var(--dark);background:var(--soft)}.sp-conj-zone.wrong{border-color:#b42318;background:#fff1f0}.sp-conj-zone span{display:block}.sp-conj-table td{min-width:155px}@media(max-width:650px){.sp-conj-table{border-spacing:5px}.sp-conj-table th{font-size:14px}.sp-conj-table tbody th{min-width:90px}.sp-conj-table td{min-width:125px}.sp-conj-zone{min-width:115px;font-size:14px}.sp-conj-token{font-size:15px;padding:10px 13px}}
`;
document.head.appendChild(style);

window.L7.renderTaskPage=function(theme,id){
 if(id==='koennen-wollen-formen')return renderConjugation(theme,id);
 return originalRender(theme,id);
};
})();
