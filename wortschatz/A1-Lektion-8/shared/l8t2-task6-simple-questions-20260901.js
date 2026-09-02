(function(){
'use strict';
if(window.__SP_L8T2_TASK8_BIOGRAPHY_PAIRS_20260902_V3)return;
window.__SP_L8T2_TASK8_BIOGRAPHY_PAIRS_20260902_V3=true;

const BIOGRAPHIES=[
 {
  context:'Daniel ist 29 Jahre alt. Er ist Architekt. Vor fünf Jahren hat er eine Ausbildung angefangen. Die Ausbildung hat drei Jahre gedauert. Seit zwei Jahren arbeitet Daniel bei einer Firma. Er arbeitet in einem Büro. Im Büro arbeiten vier Kollegen. Daniel hat jetzt viel Berufserfahrung.',
  tf:{prompt:'Daniels Ausbildung war vor zwei Jahren fertig.',answer:'Richtig'},
  mc:{prompt:'Wie lange arbeitet Daniel bei der Firma?',options:['Seit zwei Jahren.','Seit drei Jahren.','Seit fünf Jahren.'],answer:'Seit zwei Jahren.'}
 },
 {
  context:'Maria ist Kellnerin. Vor sechs Jahren hat sie eine Ausbildung angefangen. Die Ausbildung hat zwei Jahre gedauert. Vor vier Jahren hat Maria in einem Restaurant angefangen. Dort hat sie ein Jahr gearbeitet. Seit drei Jahren arbeitet sie in einem Café. Dort hat sie fünf Kollegen. Die Arbeit ist oft stressig. Maria hat Spaß an der Arbeit.',
  tf:{prompt:'Marias Ausbildung war vor vier Jahren fertig.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Maria im Restaurant gearbeitet?',options:['Ein Jahr.','Zwei Jahre.','Drei Jahre.'],answer:'Ein Jahr.'}
 },
 {
  context:'Amir ist Koch. Vor sieben Jahren ist er nach Deutschland gekommen. Vor sechs Jahren hat er einen Deutschkurs gemacht. Der Deutschkurs hat ein Jahr gedauert. Vor fünf Jahren hat Amir eine Ausbildung als Koch angefangen. Die Ausbildung hat drei Jahre gedauert. Seit zwei Jahren arbeitet Amir in einem Restaurant. Dort hat er acht Kollegen.',
  tf:{prompt:'Amirs Ausbildung war vor zwei Jahren fertig.',answer:'Richtig'},
  mc:{prompt:'Was hat Amir vor sechs Jahren gemacht?',options:['Einen Deutschkurs.','Eine Ausbildung als Koch.','Eine Stelle im Restaurant.'],answer:'Einen Deutschkurs.'}
 },
 {
  context:'Lena ist Arbeiterin. Seit sechs Jahren arbeitet sie bei einer Firma. Vor vier Jahren hat sie einen Kurs gemacht. Der Kurs hat sechs Monate gedauert. Lena arbeitet in einer Abteilung. Dort hat sie sieben Kollegen. Heute zeigt Lena neuen Kollegen die Arbeit. Lena hat viel Berufserfahrung.',
  tf:{prompt:'Lena arbeitet seit sechs Jahren bei der Firma.',answer:'Richtig'},
  mc:{prompt:'Lena arbeitet seit sechs Jahren bei der Firma. Der Kurs war vor vier Jahren. Wie viele Jahre war Lena schon bei der Firma?',options:['Zwei Jahre.','Vier Jahre.','Sechs Jahre.'],answer:'Zwei Jahre.'}
 },
 {
  context:'Sofia ist Arbeiterin. Vor vier Jahren hat sie bei einer großen Firma angefangen. Dort hatte sie viele Kollegen. Seit einem Jahr arbeitet Sofia bei einer kleinen Firma. Dort hat sie fünf Kollegen. Die Arbeit ist jetzt einfacher. Sofia hat weniger Stress. Sie hat mehr Spaß an der Arbeit.',
  tf:{prompt:'Sofia arbeitet jetzt bei einer kleinen Firma.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Sofia bei der großen Firma gearbeitet?',options:['Drei Jahre.','Ein Jahr.','Vier Jahre.'],answer:'Drei Jahre.'}
 },
 {
  context:'Mehmet ist Kellner. Vor fünf Jahren hat er in einem Café angefangen. Im Café hat er zwei Jahre gearbeitet. Seit drei Jahren arbeitet Mehmet in einem Restaurant. Dort hat er sechs Kollegen. Vor einem Jahr hat er in Teilzeit angefangen. Am Wochenende ist die Arbeit oft stressig. Mehmet hat trotzdem Spaß an der Arbeit.',
  tf:{prompt:'Mehmet arbeitet seit drei Jahren im Restaurant.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Mehmet im Café gearbeitet?',options:['Zwei Jahre.','Drei Jahre.','Fünf Jahre.'],answer:'Zwei Jahre.'}
 },
 {
  context:'Amina ist Architektin. Vor sieben Jahren hat sie ein Studium angefangen. Das Studium hat vier Jahre gedauert. Vor drei Jahren hat Amina eine Bewerbung an eine Firma geschickt. Sie hat eine Stelle bekommen. Seit drei Jahren arbeitet sie bei der Firma. Amina arbeitet in einem Büro. Dort hat sie viele Kollegen.',
  tf:{prompt:'Aminas Studium war vor drei Jahren fertig.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Aminas Studium gedauert?',options:['Vier Jahre.','Drei Jahre.','Sieben Jahre.'],answer:'Vier Jahre.'}
 },
 {
  context:'Jonas ist Koch. Vor sieben Jahren hat er eine Ausbildung angefangen. Die Ausbildung hat drei Jahre gedauert. Vor vier Jahren hat Jonas in einem Café angefangen. Im Café hat er zwei Jahre gearbeitet. Seit zwei Jahren arbeitet Jonas in einem Restaurant. Dort hat er viel Berufserfahrung. Die Arbeit ist oft stressig.',
  tf:{prompt:'Jonas arbeitet seit zwei Jahren im Restaurant.',answer:'Richtig'},
  mc:{prompt:'Vor wie vielen Jahren war die Ausbildung fertig?',options:['Vor vier Jahren.','Vor zwei Jahren.','Vor sieben Jahren.'],answer:'Vor vier Jahren.'}
 },
 {
  context:'Olga ist Arbeiterin. Seit fünf Jahren arbeitet sie bei einer Firma. Am Anfang hatte Olga wenig Berufserfahrung. Vor drei Jahren hat sie einen Kurs gemacht. Der Kurs hat ein Jahr gedauert. Heute arbeitet Olga in einer Abteilung. Dort hat sie vier Kollegen. Neue Kollegen fragen Olga oft. Olga zeigt ihnen die Arbeit.',
  tf:{prompt:'Olga hat heute mehr Berufserfahrung.',answer:'Richtig'},
  mc:{prompt:'Olga arbeitet seit fünf Jahren bei der Firma. Der Kurs war vor drei Jahren. Wie viele Jahre war Olga schon bei der Firma?',options:['Zwei Jahre.','Drei Jahre.','Fünf Jahre.'],answer:'Zwei Jahre.'}
 },
 {
  context:'Farid ist Kellner. Vor sechs Jahren hat er eine Ausbildung angefangen. Die Ausbildung hat zwei Jahre gedauert. Vor vier Jahren hat Farid in einem Restaurant angefangen. Dort hat er drei Jahre gearbeitet. Vor einem Jahr hat Farid eine Bewerbung an ein Café geschickt. Er hat die Stelle bekommen. Seit einem Jahr arbeitet er im Café.',
  tf:{prompt:'Farids Ausbildung war vor vier Jahren fertig.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Farid im Restaurant gearbeitet?',options:['Drei Jahre.','Ein Jahr.','Vier Jahre.'],answer:'Drei Jahre.'}
 }
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.title==='Biografien verstehen')||theme.tasks.filter(t=>!t?.exam)[5];
 if(!task)return theme;
 task.title='Biografien verstehen';
 task.instruction='Lies jede Biografie. Beantworte beide Fragen. Achte auf die Zeitangaben.';
 task.kind='biography-pairs';task.icon='📖';task.emoji='📖';
 task.items=BIOGRAPHIES.map((item,i)=>({...item,id:`biografie-${i+1}`,type:'biography-pair'}));
 theme.contentRevision='l8t2-biography-pairs-20260902-v3';
 return theme;
}

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function install(){
 if(window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902_V3||!window.L8UI?.taskPage)return;
 window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902_V3=true;
 const base=window.L8UI,originalTaskPage=base.taskPage,S=()=>window.L8S,T=()=>window.L8_THEME;
 const currentTask=()=>{const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))};
 const taskNumber=task=>{const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''};
 const previewNote=()=>S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Der Fortschritt dieser Vorschau wird keinem Teilnehmer gespeichert.</div>':'';
 function head(task,state){const done=state.done?.length||0,total=Math.max(1,task.items.length),pct=Math.round(done/total*100);return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>📖 ${esc(task.instruction)}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} Biografien fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
 function feedback(kind,html){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${kind}">${html}</div>`}
 function finish(task,root){root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle 10 Biografien bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
 function choiceButtons(group,options){return `<div class="sp-bio-options" data-group="${group}">${options.map((o,i)=>`<button type="button" class="l8-option sp-bio-option" data-answer="${esc(o)}"><b>${group==='mc'?String.fromCharCode(65+i)+'.':''}</b> ${esc(o)}</button>`).join('')}</div>`}
 function render(task,root){
  let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);
  if(idx==null||idx<0)return finish(task,root);
  state=S().load(T().number,task.id,task.items.length);const item=task.items[idx];
  root.innerHTML=`<div class="l8-wrap">${previewNote()}${head(task,state)}<section class="l8-card l8-exercise sp-bio-pair"><div class="sp-bio-count">Biografie ${state.done.length+1} von ${task.items.length}</div><div class="l8-context sp-bio-text">${esc(item.context)}</div><div class="sp-bio-question"><h3>1. Richtig oder falsch?</h3><div class="l8-prompt">${esc(item.tf.prompt)}</div>${choiceButtons('tf',['Richtig','Falsch'])}</div><div class="sp-bio-question"><h3>2. Wähle A, B oder C.</h3><div class="l8-prompt">${esc(item.mc.prompt)}</div>${choiceButtons('mc',item.mc.options)}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="spBioCheck" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
  const selected={tf:'',mc:''};
  root.querySelectorAll('.sp-bio-options').forEach(group=>group.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{group.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selected[group.dataset.group]=btn.dataset.answer||''}));
  document.getElementById('spBioCheck').onclick=()=>{
   if(!selected.tf||!selected.mc){feedback('warn','Beantworte beide Fragen.');return}
   const tfOK=S().equal(selected.tf,item.tf.answer),mcOK=S().equal(selected.mc,item.mc.answer);
   if(tfOK&&mcOK){let r=S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));if(r.needsReview)S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));feedback('good','Beide Antworten sind richtig.');const check=document.getElementById('spBioCheck');if(check)check.disabled=true;setTimeout(()=>render(task,root),220);return}
   S().wrong(T().number,task.id,task.items.length,idx,JSON.stringify(selected));
   const parts=[];if(!tfOK)parts.push('Frage 1 ist noch nicht richtig.');if(!mcOK)parts.push('Frage 2 ist noch nicht richtig.');feedback('bad',parts.join(' '));
  };
 }
 function patchedTaskPage(){const task=currentTask(),root=document.getElementById('app');if(task?.kind==='biography-pairs'&&root){window.resetThemeProgress=()=>S().reset(T().number);return render(task,root)}return originalTaskPage()}
 window.L8UI={...base,taskPage:patchedTaskPage};
 if(!document.getElementById('sp-l8t2-biography-pairs-style')){const style=document.createElement('style');style.id='sp-l8t2-biography-pairs-style';style.textContent='.sp-bio-pair{max-width:900px;margin-inline:auto}.sp-bio-count{font-weight:900;color:var(--lesson-main-dark,var(--l8-dark));margin-bottom:10px}.sp-bio-text{font-size:18px;line-height:1.72;padding:18px}.sp-bio-question{margin-top:24px;padding-top:18px;border-top:1px solid var(--lesson-line,var(--l8-line))}.sp-bio-question h3{margin:0 0 8px}.sp-bio-options{display:grid;gap:9px;margin-top:12px}.sp-bio-option.selected{outline:3px solid var(--lesson-main-dark,var(--l8-dark));background:var(--lesson-soft,var(--l8-soft))}.sp-bio-option b{display:inline-block;min-width:24px}@media(max-width:620px){.sp-bio-text{font-size:16px;line-height:1.65;padding:14px}.sp-bio-question{margin-top:18px;padding-top:14px}}';document.head.appendChild(style)}
}

window.L8_T2_TASK6_SIMPLE_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK6_SIMPLE_READY;
window.L8T2BiographyPairs={apply,install};
})();