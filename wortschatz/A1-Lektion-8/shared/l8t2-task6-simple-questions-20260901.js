(function(){
'use strict';
if(window.__SP_L8T2_TASK8_BIOGRAPHY_PAIRS_20260902_V2)return;
window.__SP_L8T2_TASK8_BIOGRAPHY_PAIRS_20260902_V2=true;

const BIOGRAPHIES=[
 {
  context:'Daniel ist 29 Jahre alt und arbeitet heute als Architekt. Vor fünf Jahren hat er seine Ausbildung angefangen. Die Ausbildung hat drei Jahre gedauert. Danach hat er eine Stelle in einem kleinen Architekturbüro gefunden. Dort arbeitet er seit zwei Jahren mit vier Kollegen. Am Anfang hat Daniel nur einfache Aufgaben gemacht. Seit einem Jahr plant er auch kleine Projekte selbst und spricht öfter mit Kunden.',
  tf:{prompt:'Daniel hat schon Berufserfahrung gesammelt, aber seine Ausbildung hat länger gedauert als seine bisherige Arbeit im Büro.',answer:'Richtig'},
  mc:{prompt:'Was ist in Daniels beruflichem Werdegang direkt vor seiner heutigen Stelle passiert?',options:['Er hat seine Ausbildung beendet.','Er hat ein Jahr als Kellner gearbeitet.','Er hat die Firma gewechselt.'],answer:'Er hat seine Ausbildung beendet.'}
 },
 {
  context:'Maria ist Kellnerin. Vor sechs Jahren hat sie eine Ausbildung angefangen. Nach zwei Jahren war die Ausbildung fertig. Danach hat sie ein Jahr in einem kleinen Restaurant gearbeitet. Dann hat Maria den Arbeitgeber gewechselt. Seit drei Jahren arbeitet sie in einem Hotelrestaurant. Dort arbeitet sie meistens am Abend. Am Wochenende ist viel los, aber Maria sagt, dass sie dort viel Berufserfahrung gesammelt hat.',
  tf:{prompt:'Maria arbeitet seit ihrer Ausbildung nicht die ganze Zeit bei demselben Arbeitgeber.',answer:'Richtig'},
  mc:{prompt:'Wo hat Maria bis jetzt länger gearbeitet?',options:['Im kleinen Restaurant.','Im Hotelrestaurant.','In beiden Betrieben gleich lange.'],answer:'Im Hotelrestaurant.'}
 },
 {
  context:'Amir ist vor sieben Jahren nach Deutschland gekommen. Zuerst hat er einen Deutschkurs gemacht. Ein Jahr später hat er eine Ausbildung als Koch angefangen. Die Ausbildung hat drei Jahre gedauert. Danach hat Amir ein Jahr in einem Café gearbeitet. Seit zwei Jahren arbeitet er in einem großen Restaurant. Dort arbeitet er in einer Küche mit acht Personen. Amir möchte später noch mehr Berufserfahrung sammeln und einmal Küchenleiter werden.',
  tf:{prompt:'Amir hat Deutsch gelernt, bevor er seine Ausbildung als Koch angefangen hat.',answer:'Richtig'},
  mc:{prompt:'Wie lange arbeitet Amir insgesamt schon nach seiner Ausbildung?',options:['Seit ungefähr drei Jahren.','Seit ungefähr sechs Jahren.','Seit ungefähr einem Jahr.'],answer:'Seit ungefähr drei Jahren.'}
 },
 {
  context:'Lena arbeitet seit sechs Jahren bei derselben Firma. In den ersten zwei Jahren hat sie in einer Abteilung nur einfache Aufgaben gemacht. Vor vier Jahren hat sie einen Kurs angefangen. Der Kurs hat sechs Monate gedauert. Danach ist Lena in eine andere Abteilung gewechselt. Dort hat sie mehr Verantwortung bekommen. Heute zeigt sie neuen Kollegen die Arbeit und hilft ihnen oft bei Fragen.',
  tf:{prompt:'Als Lena den Kurs angefangen hat, hatte sie schon ungefähr zwei Jahre Erfahrung in der Firma.',answer:'Richtig'},
  mc:{prompt:'Warum fragen neue Kollegen Lena heute wahrscheinlich oft?',options:['Weil Lena die Arbeit gut kennt.','Weil Lena erst seit einer Woche dort arbeitet.','Weil Lena noch keine Berufserfahrung hat.'],answer:'Weil Lena die Arbeit gut kennt.'}
 },
 {
  context:'Sofia arbeitet als Arbeiterin. Vor vier Jahren hat sie bei einer großen Firma angefangen. Dort waren mehr als 60 Personen beschäftigt. Sofia hat dort drei Jahre gearbeitet. Dann wollte sie in einem kleineren Team arbeiten und hat die Stelle gewechselt. Seit einem Jahr arbeitet sie bei einer kleinen Firma mit fünf Kollegen. Dort muss sie mehr Aufgaben selbst machen. Sofia sagt, dass die Arbeit jetzt ruhiger ist, aber sie auch mehr Verantwortung hat.',
  tf:{prompt:'Sofia hat insgesamt mehr Berufserfahrung in der großen Firma als in ihrer heutigen Firma.',answer:'Richtig'},
  mc:{prompt:'Was hat sich nach Sofias Stellenwechsel verändert?',options:['Sie arbeitet jetzt in einem kleineren Team und selbstständiger.','Sie arbeitet jetzt mit mehr als 60 Kollegen.','Sie hat jetzt gar keine eigenen Aufgaben mehr.'],answer:'Sie arbeitet jetzt in einem kleineren Team und selbstständiger.'}
 },
 {
  context:'Mehmet ist Kellner. Vor fünf Jahren hat er seine erste Stelle in einem Café angefangen. Dort hat er zwei Jahre gearbeitet. Danach hat er eine Stelle in einem Restaurant gefunden. Seit drei Jahren arbeitet er dort. Vor einem Jahr hat Mehmet seine Arbeitszeit reduziert und arbeitet jetzt in Teilzeit. Am Wochenende ist die Arbeit oft stressig. Trotzdem möchte er im Restaurant bleiben, weil das Team gut zusammenarbeitet.',
  tf:{prompt:'Mehmet arbeitet heute schon länger im Restaurant als früher im Café.',answer:'Richtig'},
  mc:{prompt:'Welche Information beschreibt Mehmets heutige Arbeit richtig?',options:['Er arbeitet im Restaurant und seit einem Jahr in Teilzeit.','Er arbeitet noch immer in seinem ersten Café.','Er hat erst vor einem Jahr seine erste Stelle angefangen.'],answer:'Er arbeitet im Restaurant und seit einem Jahr in Teilzeit.'}
 },
 {
  context:'Amina ist Architektin. Vor sieben Jahren hat sie ein Studium angefangen. Das Studium hat vier Jahre gedauert. Im letzten Studienjahr hat sie ein Praktikum in einem Architekturbüro gemacht. Nach dem Abschluss hat sie eine Bewerbung an eine große Firma geschickt. Dort hat sie vor drei Jahren angefangen. Am Anfang hat Amina vor allem Pläne kontrolliert. Seit einem Jahr spricht sie auch selbst mit Kunden und plant kleinere Häuser.',
  tf:{prompt:'Amina kannte die Arbeit in einem Architekturbüro schon vor ihrem Abschluss ein wenig.',answer:'Richtig'},
  mc:{prompt:'Was kam zuerst?',options:['Das Praktikum.','Die Stelle bei der großen Firma.','Die Arbeit mit eigenen Kundenprojekten.'],answer:'Das Praktikum.'}
 },
 {
  context:'Jonas ist Koch. Vor sieben Jahren hat er seine Ausbildung angefangen. Die Ausbildung hat drei Jahre gedauert. Danach hat Jonas zwei Jahre in einem kleinen Café gearbeitet. Vor zwei Jahren hat er die Stelle gewechselt und in einem Restaurant angefangen. Seit einem Jahr arbeitet er dort auch manchmal am Abend als Verantwortlicher für die Küche. Jonas sagt, dass die Arbeit jetzt stressiger ist, aber er lernt viel.',
  tf:{prompt:'Jonas hat nach seiner Ausbildung schon bei zwei verschiedenen Arbeitgebern gearbeitet.',answer:'Richtig'},
  mc:{prompt:'Welche Tätigkeit hat Jonas erst später im Restaurant übernommen?',options:['Verantwortung für die Küche am Abend.','Seine Ausbildung als Koch.','Die Arbeit im kleinen Café.'],answer:'Verantwortung für die Küche am Abend.'}
 },
 {
  context:'Olga arbeitet seit fünf Jahren bei einer technischen Firma. Im ersten Jahr hatte sie noch wenig Berufserfahrung und musste viele Fragen stellen. Vor drei Jahren hat sie einen internen Kurs gemacht. Danach hat sie neue Aufgaben bekommen. Seit zwei Jahren arbeitet Olga sehr selbstständig in ihrer Abteilung. Neue Kollegen kommen oft zu ihr, wenn sie etwas nicht verstehen. Olga möchte später vielleicht selbst neue Mitarbeiter einarbeiten.',
  tf:{prompt:'Olga hat ihre heutigen Aufgaben nicht schon am ersten Arbeitstag bekommen.',answer:'Richtig'},
  mc:{prompt:'Welche Entwicklung passt am besten zu Olgas Biografie?',options:['Von wenig Erfahrung zu mehr Verantwortung.','Von einer Leitungsstelle zu einer Ausbildung.','Von einer großen Firma zu einem Café.'],answer:'Von wenig Erfahrung zu mehr Verantwortung.'}
 },
 {
  context:'Farid hat vor sechs Jahren eine Ausbildung als Kellner angefangen. Nach zwei Jahren hat er die Ausbildung beendet. Danach hat er drei Jahre in einem Restaurant gearbeitet. Vor einem Jahr hat Farid eine Bewerbung an ein Café geschickt, weil er lieber am Vormittag arbeiten wollte. Er hat die Stelle bekommen und arbeitet seitdem dort. Im Café ist das Team kleiner als im Restaurant. Farid sagt, dass die Arbeitszeiten jetzt besser zu seinem Alltag passen.',
  tf:{prompt:'Farid hat seinen Arbeitgeber gewechselt, obwohl er schon mehrere Jahre Berufserfahrung im Restaurant hatte.',answer:'Richtig'},
  mc:{prompt:'Was war für Farids Stellenwechsel wichtig?',options:['Andere Arbeitszeiten.','Eine neue Ausbildung.','Mehr Kollegen im Team.'],answer:'Andere Arbeitszeiten.'}
 }
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.title==='Biografien verstehen')||theme.tasks.filter(t=>!t?.exam)[5];
 if(!task)return theme;
 task.title='Biografien verstehen';
 task.instruction='Lies jede Biografie genau. Die Antworten stehen nicht immer wörtlich im Text: Achte auf Reihenfolge, Dauer und Zusammenhänge.';
 task.kind='biography-pairs';task.icon='📖';task.emoji='📖';
 task.items=BIOGRAPHIES.map((item,i)=>({...item,id:`biografie-${i+1}`,type:'biography-pair'}));
 theme.contentRevision='l8t2-biography-pairs-20260902-v2';
 return theme;
}

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function install(){
 if(window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902_V2||!window.L8UI?.taskPage)return;
 window.__SP_L8T2_BIOGRAPHY_PAIRS_UI_20260902_V2=true;
 const base=window.L8UI,originalTaskPage=base.taskPage,S=()=>window.L8S,T=()=>window.L8_THEME;
 const currentTask=()=>{const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))};
 const taskNumber=task=>{const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''};
 const previewNote=()=>S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Der Fortschritt dieser Vorschau gilt nur bis zum Neuladen der Seite und wird keinem Teilnehmer gespeichert.</div>':'';
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
   if(tfOK&&mcOK){
    let r=S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));
    if(r.needsReview)S().right(T().number,task.id,task.items.length,idx,JSON.stringify(selected));
    feedback('good','Beide Antworten sind richtig. Weiter zur nächsten Biografie …');
    const check=document.getElementById('spBioCheck');if(check)check.disabled=true;
    setTimeout(()=>render(task,root),220);return;
   }
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