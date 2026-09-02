(function(){
'use strict';
if(window.__SP_L8T2_TASK6_BIOGRAPHY_PAIRS_20260902)return;
window.__SP_L8T2_TASK6_BIOGRAPHY_PAIRS_20260902=true;

const BIOGRAPHIES=[
 {
  context:'Daniel ist 29 Jahre alt. Er ist Architekt. Vor drei Jahren hat er in einem Büro angefangen. Im Büro arbeiten Daniel und vier Kollegen. Das Büro ist nicht groß. Daniel arbeitet seit drei Jahren dort.',
  tf:{prompt:'Daniel arbeitet seit drei Jahren mit mehr als zehn Kollegen.',answer:'Falsch'},
  mc:{prompt:'Wo arbeitet Daniel?',options:['Auf einer Baustelle.','In einem großen Büro.','In einem kleinen Büro.'],answer:'In einem kleinen Büro.'}
 },
 {
  context:'Maria ist Kellnerin. Vor vier Jahren hat sie eine Ausbildung angefangen. Die Ausbildung hat zwei Jahre gedauert. Seit zwei Jahren arbeitet sie in einem Hotelrestaurant. Dort arbeitet sie am Abend oft mit sechs Kollegen.',
  tf:{prompt:'Maria hat vor zwei Jahren im Hotelrestaurant angefangen.',answer:'Richtig'},
  mc:{prompt:'Wie lange hat Marias Ausbildung gedauert?',options:['Sechs Monate.','Zwei Jahre.','Vier Jahre.'],answer:'Zwei Jahre.'}
 },
 {
  context:'Amir ist Koch. Vor fünf Jahren hat er eine Ausbildung als Koch angefangen. Die Ausbildung hat drei Jahre gedauert. Seit zwei Jahren arbeitet er in einem Restaurant. In der Küche arbeiten acht Personen.',
  tf:{prompt:'Amir arbeitet seit fünf Jahren im Restaurant.',answer:'Falsch'},
  mc:{prompt:'Was hat Amir vor fünf Jahren angefangen?',options:['Eine Ausbildung.','Die Arbeit im Restaurant.','Einen Deutschkurs.'],answer:'Eine Ausbildung.'}
 },
 {
  context:'Lena arbeitet bei einer Firma. Sie hat dort vor sechs Jahren angefangen. Am Anfang hat sie einfache Aufgaben gemacht. Vor vier Jahren hat sie einen Kurs gemacht. Jetzt zeigt sie neuen Kollegen die Arbeit.',
  tf:{prompt:'Lena arbeitet seit sechs Jahren bei derselben Firma.',answer:'Richtig'},
  mc:{prompt:'Was macht Lena heute?',options:['Sie sucht ihre erste Stelle.','Sie zeigt neuen Kollegen die Arbeit.','Sie lernt ihre Arbeit von neuen Kollegen.'],answer:'Sie zeigt neuen Kollegen die Arbeit.'}
 },
 {
  context:'Sofia ist Arbeiterin. Vor drei Jahren hat sie bei einer großen Firma angefangen. Dort arbeiten 60 Personen. Seit einem Jahr arbeitet Sofia in einer kleinen Firma. Dort hat sie fünf Kollegen. Die Arbeit macht ihr mehr Spaß.',
  tf:{prompt:'Sofia arbeitet seit drei Jahren bei der kleinen Firma.',answer:'Falsch'},
  mc:{prompt:'Wie ist Sofias Arbeitsplatz heute?',options:['Sie arbeitet in einem kleinen Team.','Sie arbeitet mit mehr als 50 Kollegen.','Sie arbeitet ganz allein.'],answer:'Sie arbeitet in einem kleinen Team.'}
 },
 {
  context:'Mehmet ist Kellner. Vor fünf Jahren hat er in einem Café angefangen. Dort hat er zwei Jahre gearbeitet. Seit drei Jahren arbeitet er in einem Restaurant. Am Wochenende ist die Arbeit oft stressig.',
  tf:{prompt:'Mehmet arbeitet seit drei Jahren im Restaurant.',answer:'Richtig'},
  mc:{prompt:'Wo hat Mehmet zuerst gearbeitet?',options:['In einem Café.','In einem Restaurant.','In einem Büro.'],answer:'In einem Café.'}
 },
 {
  context:'Amina ist Architektin. Vor zwei Jahren hat sie bei einer Firma angefangen. Im Büro arbeiten 25 Personen. Amina arbeitet dort seit zwei Jahren. Sie plant Häuser und spricht oft mit Kunden.',
  tf:{prompt:'Amina hat vor zwei Jahren ihre Arbeit bei der Firma angefangen.',answer:'Richtig'},
  mc:{prompt:'Welche Beschreibung passt zu Aminas Büro?',options:['Dort arbeiten viele Personen.','Amina arbeitet dort allein.','Dort arbeiten nur zwei Personen.'],answer:'Dort arbeiten viele Personen.'}
 },
 {
  context:'Jonas ist Koch. Vor sechs Jahren hat er seine Ausbildung angefangen. Die Ausbildung hat drei Jahre gedauert. Vor drei Jahren hat er in einem kleinen Café angefangen. Er arbeitet noch heute dort.',
  tf:{prompt:'Jonas arbeitet seit drei Jahren im Café.',answer:'Richtig'},
  mc:{prompt:'Was hat Jonas vor sechs Jahren gemacht?',options:['Er hat seine Ausbildung angefangen.','Er hat im Café angefangen.','Er hat die Stelle gewechselt.'],answer:'Er hat seine Ausbildung angefangen.'}
 },
 {
  context:'Olga arbeitet als Arbeiterin. Vor vier Jahren hat sie bei einer Firma angefangen. Im ersten Jahr hat sie wenig Berufserfahrung gehabt. Jetzt arbeitet sie sehr selbstständig. Neue Kollegen fragen Olga oft.',
  tf:{prompt:'Olga hat jetzt wenig Berufserfahrung.',answer:'Falsch'},
  mc:{prompt:'Warum fragen neue Kollegen Olga?',options:['Olga kennt die Arbeit gut.','Olga ist neu in der Firma.','Olga arbeitet erst seit einer Woche dort.'],answer:'Olga kennt die Arbeit gut.'}
 },
 {
  context:'Farid ist Kellner. Vor drei Jahren hat er eine Ausbildung beendet. Dann hat er in einem Restaurant angefangen. Seit einem Jahr arbeitet er in einem Café. Im Café arbeitet er nur am Vormittag.',
  tf:{prompt:'Farid arbeitet seit einem Jahr im Café.',answer:'Richtig'},
  mc:{prompt:'Was passt zu Farids Arbeit heute?',options:['Café am Vormittag.','Restaurant am Abend.','Büro am Morgen.'],answer:'Café am Vormittag.'}
 }
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.title==='Biografien verstehen')||theme.tasks.filter(t=>!t?.exam)[5];
 if(!task)return theme;
 task.title='Biografien verstehen';
 task.instruction='Lies jede Biografie. Beantworte beide Fragen.';
 task.kind='biography-pairs';task.icon='📖';task.emoji='📖';
 task.items=BIOGRAPHIES.map((item,i)=>({...item,id:`biografie-${i+1}`,type:'biography-pair'}));
 theme.contentRevision='l8t2-biography-pairs-20260902-v1';
 return theme;
}

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function install(){
 if(window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902||!window.L8UI?.taskPage)return;
 window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902=true;
 const base=window.L8UI,originalTaskPage=base.taskPage,S=()=>window.L8S,T=()=>window.L8_THEME;
 const currentTask=()=>{const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))};
 const taskNumber=task=>{const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''};
 const previewNote=()=>S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':'';
 function head(task,state){const done=state.done?.length||0,total=Math.max(1,task.items.length),pct=Math.round(done/total*100);return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>📖 ${esc(task.instruction)}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} Biografien fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
 function feedback(kind,html){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${kind}">${html}</div>`}
 function finish(task,root){root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle 10 Biografien bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
 function choiceButtons(group,options){return `<div class="sp-bio-options" data-group="${group}">${options.map((o,i)=>`<button type="button" class="l8-option sp-bio-option" data-answer="${esc(o)}"><b>${group==='mc'?String.fromCharCode(65+i)+'.':''}</b> ${esc(o)}</button>`).join('')}</div>`}
 function render(task,root){
  let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);
  if(idx==null||idx<0)return finish(task,root);
  state=S().load(T().number,task.id,task.items.length);const item=task.items[idx];
  root.innerHTML=`<div class="l8-wrap">${previewNote()}${head(task,state)}<section class="l8-card l8-exercise sp-bio-pair"><div class="sp-bio-count">Biografie ${idx+1} von ${task.items.length}</div><div class="l8-context sp-bio-text">${esc(item.context)}</div><div class="sp-bio-question"><h3>1. Richtig oder falsch?</h3><div class="l8-prompt">${esc(item.tf.prompt)}</div>${choiceButtons('tf',['Richtig','Falsch'])}</div><div class="sp-bio-question"><h3>2. Wähle A, B oder C.</h3><div class="l8-prompt">${esc(item.mc.prompt)}</div>${choiceButtons('mc',item.mc.options)}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="spBioCheck" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
  const selected={tf:'',mc:''};
  root.querySelectorAll('.sp-bio-options').forEach(group=>group.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{group.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selected[group.dataset.group]=btn.dataset.answer||''}));
  document.getElementById('spBioCheck').onclick=()=>{
   if(!selected.tf||!selected.mc){feedback('warn','Beantworte beide Fragen.');return}
   const tfOK=S().equal(selected.tf,item.tf.answer),mcOK=S().equal(selected.mc,item.mc.answer);
   if(tfOK&&mcOK){let r=S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));if(r.needsReview)S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));feedback('good','Beide Antworten sind richtig.');root.querySelectorAll('button').forEach(b=>b.disabled=true);setTimeout(()=>render(task,root),550);return}
   S().wrong(T().number,task.id,task.items.length,idx,JSON.stringify(selected));
   const parts=[];if(!tfOK)parts.push('Frage 1 ist noch nicht richtig.');if(!mcOK)parts.push('Frage 2 ist noch nicht richtig.');feedback('bad',parts.join(' '));
  };
 }
 function patchedTaskPage(){const task=currentTask(),root=document.getElementById('app');if(task?.kind==='biography-pairs'&&root){window.resetThemeProgress=()=>S().reset(T().number);return render(task,root)}return originalTaskPage()}
 window.L8UI={...base,taskPage:patchedTaskPage};
 if(!document.getElementById('sp-l8t2-biography-pairs-style')){const style=document.createElement('style');style.id='sp-l8t2-biography-pairs-style';style.textContent='.sp-bio-pair{max-width:900px;margin-inline:auto}.sp-bio-count{font-weight:900;color:var(--lesson-main-dark,var(--l8-dark));margin-bottom:10px}.sp-bio-text{font-size:18px;line-height:1.65}.sp-bio-question{margin-top:22px;padding-top:18px;border-top:1px solid var(--lesson-line,var(--l8-line))}.sp-bio-question h3{margin:0 0 8px}.sp-bio-options{display:grid;gap:9px;margin-top:12px}.sp-bio-option.selected{outline:3px solid var(--lesson-main-dark,var(--l8-dark));background:var(--lesson-soft,var(--l8-soft))}.sp-bio-option b{display:inline-block;min-width:24px}@media(max-width:620px){.sp-bio-text{font-size:16px}.sp-bio-question{margin-top:18px;padding-top:14px}}';document.head.appendChild(style)}
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