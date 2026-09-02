(function(){
'use strict';
if(window.__SP_L8T3_SENTENCE_ANALYSIS_UI_20260902)return;
window.__SP_L8T3_SENTENCE_ANALYSIS_UI_20260902=true;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
function themeNo(){return Number(window.L8_THEME?.number||document.body?.dataset?.theme||3)}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>t?.id===task?.id);return i>=0?i+1:''}
function optionsFor(item){
 const data={
  'Ich arbeite heute in einem Café.':[['Ich','heute','in einem Café'],['arbeite','heute','in einem Café']],
  'Meine Kollegin arbeitet oft im Restaurant.':[['Meine Kollegin','oft','im Restaurant'],['arbeitet','oft','im Restaurant']],
  'Wir haben heute wenig Stress.':[['Wir','heute','wenig Stress'],['haben','heute','Stress']],
  'Der Chef ist sehr professionell.':[['Der Chef','sehr professionell','professionell'],['ist','professionell','sehr']],
  'Ihr habt viel Spaß bei der Arbeit.':[['Ihr','viel Spaß','bei der Arbeit'],['habt','Spaß','bei der Arbeit']],
  'Ich habe vor zwei Jahren im Restaurant gearbeitet.':[['Ich','vor zwei Jahren','im Restaurant'],['habe gearbeitet','habe','gearbeitet']],
  'Meine Kollegin hat eine Ausbildung gemacht.':[['Meine Kollegin','eine Ausbildung','Ausbildung'],['hat gemacht','hat','gemacht']],
  'Wir haben schon viel Berufserfahrung gesammelt.':[['Wir','viel Berufserfahrung','Berufserfahrung'],['haben gesammelt','haben','gesammelt']],
  'Der Koch hat gestern lange gearbeitet.':[['Der Koch','gestern','lange'],['hat gearbeitet','hat','gearbeitet']],
  'Die Architektin hat in einem großen Büro gearbeitet.':[['Die Architektin','in einem großen Büro','Büro'],['hat gearbeitet','hat','gearbeitet']],
  'Früher war ich Kellnerin.':[['Ich','früher','Kellnerin'],['war','früher','Kellnerin']],
  'Du hattest damals wenig Berufserfahrung.':[['Du','damals','wenig Berufserfahrung'],['hattest','damals','Berufserfahrung']],
  'Unser Team war früher sehr klein.':[['Unser Team','früher','sehr klein'],['war','früher','klein']],
  'Wir hatten oft viel Stress.':[['Wir','oft','viel Stress'],['hatten','oft','Stress']],
  'Die Kollegen waren immer sehr nett.':[['Die Kollegen','immer','sehr nett'],['waren','immer','nett']]
 };
 return data[item.sentence]||[[item.subject,'heute','früher'],[item.verb,'ist','hat']];
}
function load(task){return window.L8S.load(themeNo(),task.id,task.items.length)}
function save(task,state,sync=false){return window.L8S.save(themeNo(),task.id,state,sync)}
function current(task){const i=window.L8S.nextIndex(themeNo(),task.id,task.items.length);return Number.isInteger(i)?i:null}
function ensurePool(task,state,index,item){
 state.answers=state.answers||{};
 const key=`pool:${index}`;
 if(!Array.isArray(state.answers[key])||state.answers[key].length!==item.tokens.length){
  let ids=shuffle(item.tokens.map((_,i)=>i));
  if(ids.every((v,i)=>v===i)&&ids.length>1)[ids[0],ids[1]]=[ids[1],ids[0]];
  state.answers[key]=ids;save(task,state,false)
 }
 return state.answers[key]
}
function builtIds(state,index){state.answers=state.answers||{};return Array.isArray(state.answers[`builtIds:${index}`])?state.answers[`builtIds:${index}`]:[]}
function setBuiltIds(task,state,index,ids){state.answers=state.answers||{};state.answers[`builtIds:${index}`]=ids;save(task,state,false)}
function selected(task,state,index,key,value){state.answers=state.answers||{};state.answers[`${key}:${index}`]=value;save(task,state,false)}
function msg(state,index){
 const tries=Number(state.tries?.[index]||0),stage=Number(state.review?.[index]||0);
 if(stage===2)return '<div class="sp-sa-note hint">Richtig korrigiert. Dieser Satz kommt noch einmal.</div>';
 if(tries===1)return '<div class="sp-sa-note bad">Noch nicht richtig.</div>';
 if(tries===2)return '<div class="sp-sa-note hint">Hinweis: Achte auf die Satzstellung und danach auf Subjekt, Verb und Zeitform.</div>';
 if(tries>=3)return '<div class="sp-sa-note hint">Prüfe besonders die Verbform. Im Präteritum kommen hier nur <strong>sein</strong> und <strong>haben</strong> vor.</div>';
 return ''
}
function progress(task,state){const p=Math.round(state.done.length/Math.max(1,task.items.length)*100);return `<div class="sp-sa-progress"><span>${state.done.length} von ${task.items.length} fertig</span><strong>${p}%</strong></div><div class="sp-sa-bar"><span style="width:${p}%"></span></div>`}
function finish(task){
 document.getElementById('app').innerHTML=`<div class="l8-wrap"><section class="l8-card sp-sa-finish"><div>🎯</div><h2>Aufgabe abgeschlossen</h2><p>Du hast 15 Sätze gebaut und analysiert.</p><a class="l8-btn primary" href="index.html">Zur Übersicht</a></section></div>`
}
function renderBuild(task,index,item,state){
 const pool=ensurePool(task,state,index,item),chosen=builtIds(state,index),remaining=pool.filter(id=>!chosen.includes(id));
 const built=chosen.map(id=>item.tokens[id]).join(' ');
 return `<section class="l8-card sp-sa-card"><div class="sp-sa-step">1 · Satz bauen</div><div class="sp-sa-built ${chosen.length?'':'empty'}">${chosen.length?chosen.map((id,pos)=>`<button type="button" data-remove="${pos}">${esc(item.tokens[id])}</button>`).join(' '):'Baue hier den Satz.'}</div><div class="sp-sa-pool">${remaining.map(id=>`<button type="button" data-token="${id}">${esc(item.tokens[id])}</button>`).join('')}</div><div class="sp-sa-actions"><button class="l8-btn secondary" id="spSaClear" type="button">Löschen</button><button class="l8-btn primary" id="spSaCheckOrder" type="button" ${chosen.length!==item.tokens.length?'disabled':''}>Prüfen</button></div>${msg(state,index)}</section>`
}
function choiceBlock(label,key,values,chosen){return `<div class="sp-sa-question"><h3>${esc(label)}</h3><div class="sp-sa-choices">${values.map(v=>`<button type="button" class="${String(chosen)===String(v)?'selected':''}" data-analysis-key="${key}" data-analysis-value="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>`}
function renderAnalysis(task,index,item,state){
 const [subjectOptions,verbOptions]=optionsFor(item),subject=state.answers?.[`subject:${index}`]||'',verb=state.answers?.[`verb:${index}`]||'',tense=state.answers?.[`tense:${index}`]||'';
 return `<section class="l8-card sp-sa-card"><div class="sp-sa-step">2 · Satz untersuchen</div><div class="sp-sa-correct-sentence">${esc(item.sentence)}</div>${choiceBlock('Was ist das Subjekt?','subject',subjectOptions,subject)}${choiceBlock('Was ist das Verb?','verb',verbOptions,verb)}${choiceBlock('Welche Zeitform hat das Verb?','tense',['Präsens','Perfekt','Präteritum'],tense)}<button class="l8-btn primary sp-sa-full" id="spSaCheckAnalysis" type="button" ${!subject||!verb||!tense?'disabled':''}>Prüfen</button>${msg(state,index)}</section>`
}
function render(task){
 const root=document.getElementById('app'),S=window.L8S;if(!root||!S)return false;
 let state=load(task);if(state.done.length>=task.items.length){finish(task);return true}
 const index=current(task);if(index==null){finish(task);return true}
 state=load(task);const item=task.items[index],analysis=state.answers?.[`orderOk:${index}`]===true;
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-sa-head"><div class="sp-sa-kicker">Aufgabe ${taskNo(task)} · Satz ${index+1} von ${task.items.length}</div><h1>🏗️ ${esc(task.title)}</h1><p>${esc(task.instruction)}</p>${progress(task,state)}</section>${analysis?renderAnalysis(task,index,item,state):renderBuild(task,index,item,state)}</div>`;
 if(!analysis){
  document.querySelectorAll('[data-token]').forEach(btn=>btn.addEventListener('click',()=>{const x=load(task),ids=builtIds(x,index);ids.push(Number(btn.dataset.token));setBuiltIds(task,x,index,ids);render(task)}));
  document.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{const x=load(task),ids=builtIds(x,index);ids.splice(Number(btn.dataset.remove),1);setBuiltIds(task,x,index,ids);render(task)}));
  document.getElementById('spSaClear')?.addEventListener('click',()=>{const x=load(task);setBuiltIds(task,x,index,[]);render(task)});
  document.getElementById('spSaCheckOrder')?.addEventListener('click',()=>{
   let x=load(task);const text=builtIds(x,index).map(id=>item.tokens[id]).join(' '),target=item.sentence.replace(/[.!?]$/,'');
   if(S.equal(text,target)){x.answers=x.answers||{};x.answers[`orderOk:${index}`]=true;save(task,x,false);render(task)}
   else{S.wrong(themeNo(),task.id,task.items.length,index,text);x=load(task);x.answers=x.answers||{};x.answers[`builtIds:${index}`]=[];save(task,x,false);render(task)}
  })
 }else{
  document.querySelectorAll('[data-analysis-key]').forEach(btn=>btn.addEventListener('click',()=>{const x=load(task);selected(task,x,index,btn.dataset.analysisKey,btn.dataset.analysisValue);render(task)}));
  document.getElementById('spSaCheckAnalysis')?.addEventListener('click',()=>{
   let x=load(task),a=x.answers||{};const ok=S.equal(a[`subject:${index}`],item.subject)&&S.equal(a[`verb:${index}`],item.verb)&&S.equal(a[`tense:${index}`],item.tense);
   if(ok){
    const r=S.right(themeNo(),task.id,task.items.length,index,item.sentence),y=r.s;y.answers=y.answers||{};
    delete y.answers[`orderOk:${index}`];delete y.answers[`builtIds:${index}`];delete y.answers[`subject:${index}`];delete y.answers[`verb:${index}`];delete y.answers[`tense:${index}`];delete y.answers[`pool:${index}`];save(task,y,false);render(task)
   }else{S.wrong(themeNo(),task.id,task.items.length,index,`${a[`subject:${index}`]||''}|${a[`verb:${index}`]||''}|${a[`tense:${index}`]||''}`);render(task)}
  })
 }
 return true
}
function install(){
 if(!window.L8UI||window.L8UI.__spT3SentenceAnalysis)return false;
 const raw=window.L8UI.taskPage.bind(window.L8UI);
 window.L8UI.taskPage=function(){
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.spL8T3SentenceAnalysis)return render(task);
  return raw()
 };
 window.L8UI.__spT3SentenceAnalysis=true;return true
}
const style=document.createElement('style');style.id='sp-l8t3-sentence-analysis-style';style.textContent=`
.sp-sa-head h1{margin:6px 0 8px}.sp-sa-kicker{font-weight:900;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}.sp-sa-progress{display:flex;justify-content:space-between;gap:12px;margin-top:14px;font-weight:850}.sp-sa-bar{height:9px;border-radius:999px;background:#ececf2;overflow:hidden;margin-top:6px}.sp-sa-bar span{display:block;height:100%;background:var(--lesson-main,var(--l8-main,#68539b));border-radius:inherit}.sp-sa-card{margin-top:16px}.sp-sa-step{font-size:18px;font-weight:950;margin-bottom:14px}.sp-sa-built{min-height:76px;border:2px dashed var(--lesson-line,var(--l8-line,#d7d5df));border-radius:16px;padding:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#fafafd}.sp-sa-built.empty{color:#777}.sp-sa-built button,.sp-sa-pool button,.sp-sa-choices button{border:2px solid var(--lesson-line,var(--l8-line,#d7d5df));background:#fff;border-radius:12px;padding:10px 13px;font:inherit;font-weight:800;cursor:pointer}.sp-sa-pool{display:flex;flex-wrap:wrap;gap:9px;margin:18px 0}.sp-sa-pool button:hover,.sp-sa-choices button:hover{transform:translateY(-1px)}.sp-sa-actions{display:flex;gap:10px;justify-content:flex-end}.sp-sa-actions .l8-btn{min-width:150px}.sp-sa-note{margin-top:14px;padding:10px 12px;border-radius:12px;font-weight:800}.sp-sa-note.bad{background:#fff0f0;color:#9d2828}.sp-sa-note.hint{background:#fff8dc;color:#725500}.sp-sa-correct-sentence{font-size:clamp(21px,3vw,28px);font-weight:900;padding:16px;border-radius:15px;background:var(--lesson-soft,var(--l8-soft,#f3effa));margin-bottom:20px}.sp-sa-question{padding:15px 0;border-top:1px solid var(--lesson-line,var(--l8-line,#dedce5))}.sp-sa-question h3{margin:0 0 10px;font-size:18px}.sp-sa-choices{display:flex;flex-wrap:wrap;gap:9px}.sp-sa-choices button.selected{border-color:var(--lesson-main,var(--l8-main,#68539b));background:var(--lesson-soft,var(--l8-soft,#f3effa));box-shadow:0 0 0 2px rgba(104,83,155,.12)}.sp-sa-full{width:min(420px,100%);display:block;margin:18px auto 0}.sp-sa-finish{text-align:center}.sp-sa-finish>div:first-child{font-size:56px}@media(max-width:600px){.sp-sa-actions{flex-direction:column}.sp-sa-actions .l8-btn{width:100%}.sp-sa-built{min-height:64px}.sp-sa-built button,.sp-sa-pool button,.sp-sa-choices button{padding:9px 10px}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.L8T3SentenceAnalysisUI={install,render};
})();