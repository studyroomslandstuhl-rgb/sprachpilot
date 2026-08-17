(function(){
'use strict';
if(window.__SP_L7T2_ENDINGS_UI_V3)return;
window.__SP_L7T2_ENDINGS_UI_V3=true;

function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2EndingsV3)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7);
 let selected=null,feedback='';
 function taskById(id){return S.task(id)}
 function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===task.id)+1]||null}
 function data(theme,task){const st=S.load(theme,task.id,task.items.length);st.answers=st.answers||{};st.answers.placements=st.answers.placements||{};st.answers.drafts=st.answers.drafts||{};st.answers.tries=st.answers.tries||{};st.answers.needsCleanRepeat=st.answers.needsCleanRepeat||{};return st}
 function progress(theme,task){const st=data(theme,task),p=Math.round(st.done.length/Math.max(1,task.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} von ${task.items.length} fertig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function finish(theme,task){const root=document.getElementById('app'),next=nextTask(task);root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Gut gemacht!</h2><p>Aufgabe abgeschlossen.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${S.esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function itemHtml(theme,task,index,placed){
  const item=task.items[index],st=data(theme,task),done=st.done.includes(index),draft=String(st.answers.drafts[index]||'');
  if(done)return`<div class="sp-ending-row done"><span class="sp-ending-chip done">${S.esc(item.infinitive)}</span><strong>${S.esc(item.participle)}</strong></div>`;
  if(!placed)return`<button type="button" class="sp-ending-chip ${selected===index?'selected':''}" draggable="true" data-ending-chip="${index}">${S.esc(item.infinitive)}</button>`;
  return`<div class="sp-ending-row" data-ending-row="${index}"><button type="button" class="sp-ending-chip placed ${selected===index?'selected':''}" draggable="true" data-ending-chip="${index}">${S.esc(item.infinitive)}</button><div class="sp-ending-write"><input data-ending-input="${index}" autocomplete="off" placeholder="Partizip II" value="${S.esc(draft)}"><button type="button" class="l7-btn" data-ending-check="${index}">Prüfen</button></div></div>`
 }
 function render(theme,id){
  const task=taskById(id);if(!task?.spL7T2Endings)return raw(theme,id);
  const st=data(theme,task);if(st.done.length>=task.items.length)return finish(theme,task);
  const source=[],tRows=[],enRows=[];
  task.items.forEach((item,index)=>{
   if(st.done.includes(index)){(item.group==='t'?tRows:enRows).push(itemHtml(theme,task,index,true));return}
   const placed=st.answers.placements[index];
   if(placed==='t')tRows.push(itemHtml(theme,task,index,true));
   else if(placed==='en')enRows.push(itemHtml(theme,task,index,true));
   else source.push(itemHtml(theme,task,index,false));
  });
  const root=document.getElementById('app');
  root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progress(theme,task)}<div class="l7-instruction">${S.esc(task.description)}</div><div class="sp-ending-source" id="spEndingSource">${source.join('')}</div><div class="sp-ending-grid"><section class="sp-ending-zone" data-ending-zone="t"><h2>-t</h2><div>${tRows.join('')}</div></section><section class="sp-ending-zone" data-ending-zone="en"><h2>-en</h2><div>${enRows.join('')}</div></section></div><div id="spEndingFeedback">${feedback}</div></section><footer>© SprachPilot</footer></div>`;
  bind(theme,task)
 }
 function bind(theme,task){
  document.querySelectorAll('[data-ending-chip]').forEach(chip=>{
   chip.addEventListener('click',e=>{e.stopPropagation();selected=Number(chip.dataset.endingChip);feedback='';render(theme,task.id)});
   chip.addEventListener('dragstart',e=>{selected=Number(chip.dataset.endingChip);e.dataTransfer?.setData('text/plain',String(selected));if(e.dataTransfer)e.dataTransfer.effectAllowed='move'})
  });
  document.querySelectorAll('[data-ending-zone]').forEach(zone=>{
   zone.addEventListener('dragover',e=>{e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move'});
   zone.addEventListener('drop',e=>{e.preventDefault();const value=e.dataTransfer?.getData('text/plain');const index=value!==''?Number(value):selected;place(theme,task,index,zone.dataset.endingZone)});
   zone.addEventListener('click',e=>{if(e.target.closest('input,button,[data-ending-row]'))return;if(selected!=null)place(theme,task,selected,zone.dataset.endingZone)})
  });
  document.querySelectorAll('[data-ending-input]').forEach(input=>{
   input.addEventListener('input',()=>{const st=data(theme,task);st.answers.drafts[input.dataset.endingInput]=input.value;S.save(theme,task.id,st,false)});
   input.addEventListener('keydown',e=>{if(e.key==='Enter')check(theme,task,Number(input.dataset.endingInput),input.value)})
  });
  document.querySelectorAll('[data-ending-check]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.endingCheck),input=document.querySelector(`[data-ending-input="${index}"]`);check(theme,task,index,input?.value||'')}))
 }
 function place(theme,task,index,group){
  if(!Number.isInteger(index)||!task.items[index]||(group!=='t'&&group!=='en'))return;
  const st=data(theme,task);st.answers.placements[index]=group;S.save(theme,task.id,st,false);selected=null;feedback='';render(theme,task.id);setTimeout(()=>document.querySelector(`[data-ending-input="${index}"]`)?.focus(),30)
 }
 function check(theme,task,index,value){
  const item=task.items[index],st=data(theme,task);if(!item||!String(value||'').trim())return;
  st.answers.drafts[index]=String(value);
  const group=st.answers.placements[index],groupOk=group===item.group,formOk=S.norm(value)===S.norm(item.participle);
  if(!groupOk||!formOk){
   const n=Number(st.answers.tries[index]||0)+1;st.answers.tries[index]=n;st.answers.needsCleanRepeat[index]=true;S.save(theme,task.id,st,false);
   let text='Noch nicht richtig.';
   if(n===2)text=!groupOk?'Hinweis: Prüfe, ob das Partizip auf -t oder -en endet.':'Hinweis: Achte auf die richtige Partizip-II-Form.';
   if(n>=3)text=`Lösung: ${item.infinitive} → ${item.participle} · ${item.group==='t'?'-t':'-en'}. Ordne das Verb selbst richtig zu und schreibe die Form.`;
   feedback=`<div class="${n===2?'l7-hint':'l7-no'}">${S.esc(text)}</div>`;return render(theme,task.id)
  }
  if(st.answers.needsCleanRepeat[index]){
   delete st.answers.needsCleanRepeat[index];delete st.answers.placements[index];delete st.answers.drafts[index];delete st.answers.tries[index];S.save(theme,task.id,st,false);selected=null;feedback='<div class="l7-ok">Richtig. Dieses Verb kommt später noch einmal.</div>';return render(theme,task.id)
  }
  if(!st.done.includes(index))st.done.push(index);delete st.answers.drafts[index];delete st.answers.tries[index];delete st.answers.placements[index];st.current=null;S.save(theme,task.id,st,true);selected=null;feedback='<div class="l7-ok">Richtig!</div>';render(theme,task.id)
 }
 const style=document.createElement('style');style.id='sp-l7t2-endings-style-v3';style.textContent=`
 .sp-ending-source{display:flex;flex-wrap:wrap;gap:7px;padding:10px;margin:8px 0 14px;border:1px solid var(--line);border-radius:15px;background:var(--soft)}
 .sp-ending-chip{appearance:none;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--dark);font:inherit;font-weight:850;font-size:14px;padding:7px 10px;cursor:grab;line-height:1.1}.sp-ending-chip:active{cursor:grabbing}.sp-ending-chip.selected{outline:3px solid rgba(91,61,135,.2);border-color:var(--main)}.sp-ending-chip.placed{cursor:grab}.sp-ending-chip.done{background:#e8f8ee;border-color:#52a56d;cursor:default}
 .sp-ending-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.sp-ending-zone{min-height:190px;border:2px dashed var(--line);border-radius:17px;padding:10px;background:#fff}.sp-ending-zone h2{text-align:center;margin:0 0 8px;font-size:25px}.sp-ending-zone>div{display:grid;gap:7px}
 .sp-ending-row{display:grid;grid-template-columns:minmax(95px,.7fr) minmax(150px,1.3fr);gap:7px;align-items:center;padding:6px;border:1px solid var(--line);border-radius:11px;background:var(--soft)}.sp-ending-row.done{background:#effaf3}.sp-ending-row.done>strong{font-size:14px}
 .sp-ending-write{display:flex;gap:5px}.sp-ending-write input{min-width:0;width:100%;padding:8px 9px;border:1px solid var(--line);border-radius:9px;font:inherit}.sp-ending-write .l7-btn{padding:8px 10px;min-width:72px}
 @media(max-width:720px){.sp-ending-grid{grid-template-columns:1fr}.sp-ending-row{grid-template-columns:110px minmax(0,1fr)}}@media(max-width:430px){.sp-ending-row{grid-template-columns:1fr}.sp-ending-write{display:grid;grid-template-columns:1fr auto}}
 `;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){const task=taskById(id);if(task?.spL7T2Endings){selected=null;feedback='';return render(Number(theme),id)}return raw(theme,id)};
 window.L7.__l7t2EndingsV3=true;return true
 }
 window.L7T2EndingsUI={install};
})();
