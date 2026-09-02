(function(){
'use strict';
if(window.__SP_L8T2_TASK6_SIMPLE_QUESTIONS_20260901)return;
window.__SP_L8T2_TASK6_SIMPLE_QUESTIONS_20260901=true;

const QUESTIONS=[
 ['Maria hatte direkt nach der Ausbildung eine Arbeit.','Falsch'],
 ['Maria hat länger gearbeitet als ihre Ausbildung gedauert hat.','Richtig'],
 ['Maria arbeitet heute noch im Hotel.','Falsch'],
 ['Marias Ausbildung war vor ungefähr drei Jahren fertig.','Richtig'],

 ['Amir hat vor der Ausbildung Deutsch gelernt.','Richtig'],
 ['Amir arbeitet seit ungefähr einem Jahr im Krankenhaus.','Richtig'],
 ['Amir hat sofort nach seiner Ankunft in Deutschland die Ausbildung angefangen.','Falsch'],
 ['Amirs Ausbildung war vor ungefähr einem Jahr fertig.','Richtig'],

 ['Nach der Ausbildung hat Lena zuerst im Café gearbeitet.','Falsch'],
 ['Lena hat nach der Ausbildung schon mehr als drei Jahre gearbeitet.','Richtig'],
 ['Lena arbeitet heute noch bei ihrem ersten Arbeitgeber nach der Ausbildung.','Falsch'],
 ['Lenas Ausbildung dauerte zwei Jahre. Sie arbeitet jetzt auch seit zwei Jahren im Café.','Richtig'],

 ['Daniel bekam seine neuen Aufgaben vor dem Kurs.','Falsch'],
 ['Vor dem Kurs arbeitete Daniel schon ungefähr zwei Jahre bei der Firma.','Richtig'],
 ['Daniel hat heute mehr Berufserfahrung als am Anfang.','Richtig'],
 ['Daniel macht heute andere Aufgaben als am Anfang.','Richtig'],

 ['Sofia hat nach der Ausbildung nur bei einem Arbeitgeber gearbeitet.','Falsch'],
 ['Sofia arbeitet seit ungefähr zwei Jahren im kleinen Salon.','Richtig'],
 ['Sofia hat heute mehr Kollegen als früher.','Falsch'],
 ['Sofia arbeitet heute näher an ihrer Wohnung als früher.','Richtig']
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.title==='Biografien verstehen')||theme.tasks.filter(t=>!t?.exam)[5];
 if(!task||!Array.isArray(task.items)||task.items.length!==QUESTIONS.length)return theme;
 task.instruction='Lies den Text und entscheide: richtig oder falsch.';
 task.items=task.items.map((item,i)=>({...item,prompt:QUESTIONS[i][0],answer:QUESTIONS[i][1]}));
 theme.contentRevision='l8t2-task6-simple-questions-20260902-v2';
 return theme;
}

function norm(v){return String(v??'').trim().replace(/\s+/g,' ')}
function currentTask(){
 const theme=window.L8_THEME,id=new URLSearchParams(location.search).get('task');
 return (theme?.tasks||[]).find(task=>String(task?.id)===String(id));
}
function visibleIndex(task,state){
 const current=Number(state?.current);
 if(Number.isInteger(current)&&current>=0&&current<task.items.length)return current;
 const prompt=norm(document.querySelector('.l8-prompt')?.textContent||'');
 if(!prompt)return-1;
 return task.items.findIndex(item=>norm(item?.prompt)===prompt);
}
function setFeedback(kind,text){
 const box=document.getElementById('feedback');
 if(box)box.innerHTML=`<div class="l8-feedback ${kind}">${String(text||'')}</div>`;
}
function installMobileChoiceFix(){
 if(window.__SP_L8T2_BIOGRAPHY_CHOICE_FIX_20260902)return;
 window.__SP_L8T2_BIOGRAPHY_CHOICE_FIX_20260902=true;
 document.addEventListener('click',event=>{
  const button=event.target?.closest?.('.l8-option[data-answer]');
  if(!button)return;
  const task=currentTask(),theme=window.L8_THEME,S=window.L8S;
  if(!task||task.title!=='Biografien verstehen'||!theme||!S)return;
  const state=S.load(theme.number,task.id,task.items.length),idx=visibleIndex(task,state);
  if(idx<0)return;
  const item=task.items[idx],answer=String(button.dataset.answer||'');
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  if(button.dataset.spBusy==='1')return;
  if(S.equal(answer,item.answer)){
   button.dataset.spBusy='1';
   document.querySelectorAll('.l8-option').forEach(node=>node.disabled=true);
   const result=S.right(theme.number,task.id,task.items.length,idx,answer);
   button.classList.add('correct');
   setFeedback('good',result.needsReview?'Richtig. Diese Frage kommt am Ende noch einmal.':'Richtig!');
   setTimeout(()=>window.L8UI?.taskPage?.(),380);
  }else{
   const result=S.wrong(theme.number,task.id,task.items.length,idx,answer);
   button.classList.add('wrong');
   if(result.tries===1)setFeedback('bad','Noch nicht richtig. Versuch es noch einmal.');
   else if(result.tries===2)setFeedback('warn','Lies den Text noch einmal genau.');
   else setFeedback('warn',`Lösung: ${Array.isArray(item.answer)?item.answer[0]:item.answer}`);
  }
 },true);
}

installMobileChoiceFix();

window.L8_T2_TASK6_SIMPLE_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK6_SIMPLE_READY;
window.L8T2Task6SimpleQuestions={apply};
})();