(function(){
'use strict';
const params=new URLSearchParams(location.search);
if(params.get('task')!=='dialog-abc')return;
const task=window.L6T4_DATA?.tasks?.find(item=>item.id==='dialog-abc');
const meta=typeof L6T4_TASKS!=='undefined'?L6T4_TASKS.find(item=>item.id==='dialog-abc'):null;
const area=document.getElementById('area');
if(!task||!meta||!area||task.kind!=='audio-dialog-pages')return;
const FILE='task-dialog-abc';
let activeIndex=null;
let selections={};
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function state(){return l6t4Load(FILE,task.items.length)}
function currentIndex(){const saved=state();return saved.current===null||saved.current===undefined?l6t4NextIndex(FILE,task.items.length):saved.current}
function current(){const index=currentIndex();if(activeIndex!==index){activeIndex=index;selections={}}return task.items[index]}
function solutionLetter(question){const index=(question.options||[]).findIndex(option=>l6t4Exact(option,question.answer));return index>=0?String.fromCharCode(65+index):''}
function hint(item){
 const tries=state().tries||0;
 if(tries===1)return'<div class="no">Noch nicht richtig. Höre den Dialog noch einmal und prüfe alle drei Antworten.</div>';
 if(tries===2)return'<div class="hint"><strong>Hinweis:</strong> Achte auf Zeiten, Orte und den Grund für die Entscheidung.</div>';
 if(tries>=3)return`<div class="no"><strong>Lösungen:</strong>${item.questions.map((question,index)=>`<br>${index+1}. ${solutionLetter(question)} – ${esc(question.answer)}`).join('')}<br>Der Dialog kommt später noch einmal.</div>`;
 return'';
}
function audioBlock(item){return`<div class="dialog13-audio"><audio controls preload="metadata" src="${esc(item.audioFile)}"></audio><div class="audio-load-error" hidden>Die Audiodatei konnte nicht geladen werden.</div></div>`}
function questionBlock(question,index){return`<section class="dialog13-question"><div class="dialog13-question-number">${index+1}</div><h2>${esc(question.prompt)}</h2><div class="dialog13-options abc-list">${question.options.map((option,optionIndex)=>`<button type="button" class="option" data-d13-question="${index}" data-d13-value="${esc(option)}" aria-pressed="false"><span class="abc-letter">${String.fromCharCode(65+optionIndex)}</span><span>${esc(option)}</span></button>`).join('')}</div></section>`}
function render(){
 if(state().done.length>=task.items.length){finish();return}
 const item=current();
 if(!item){l6t4Storage().removeItem(l6t4TaskKey(FILE));activeIndex=null;selections={};render();return}
 l6t4Header(meta.title);
 document.title=`Aufgabe ${meta.number} · ${meta.title}`;
 area.innerHTML=`<div class="task-title-block"><span class="task-number">Aufgabe ${esc(meta.number)}</span><h1>${esc(meta.title)}</h1></div>${l6t4Progress(FILE,task.items.length)}<div class="task-instruction">${esc(task.instruction)}</div>${audioBlock(item)}<div class="dialog13-page-label">Dialog ${esc(item.dialogNumber)} von ${task.items.length}</div><div class="dialog13-question-list">${item.questions.map(questionBlock).join('')}</div><div class="actions centered"><button class="btn" type="button" data-d13-check disabled>Kontrollieren</button></div><div id="d13Feedback" class="feedback">${hint(item)}</div><div id="d13Tech"></div>`;
 const audio=area.querySelector('audio');
 audio?.addEventListener('error',()=>{audio.hidden=true;const error=audio.nextElementSibling;if(error)error.hidden=false},{once:true});
}
function selectAnswer(button){
 const questionIndex=Number(button.dataset.d13Question);
 selections[questionIndex]=button.dataset.d13Value;
 area.querySelectorAll(`[data-d13-question="${questionIndex}"]`).forEach(option=>{const selected=option===button;option.classList.toggle('selected',selected);option.setAttribute('aria-pressed',selected?'true':'false')});
 const check=area.querySelector('[data-d13-check]');
 if(check)check.disabled=Object.keys(selections).length<3;
 const tech=document.getElementById('d13Tech');
 if(tech)tech.innerHTML='';
}
function checkAnswers(){
 const item=current();
 if(Object.keys(selections).length<item.questions.length){const tech=document.getElementById('d13Tech');if(tech)tech.innerHTML='<div class="hint">Beantworte zuerst alle drei Fragen.</div>';return}
 const correct=item.questions.every((question,index)=>l6t4Exact(selections[index],question.answer));
 l6t4RegisterAttempt(FILE,task.items.length,activeIndex,correct);
 if(correct){
  const saved=state(),repeated=saved.hadWrong||saved.tries>0;
  l6t4Right(FILE,task.items.length);
  area.querySelectorAll('button,audio').forEach(element=>element.disabled=true);
  const feedback=document.getElementById('d13Feedback');
  if(feedback)feedback.innerHTML=`<div class="ok">Richtig.${repeated?' Der Dialog kommt am Ende noch einmal.':''}</div>`;
  activeIndex=null;selections={};
  setTimeout(render,700);
  return;
 }
 l6t4Wrong(FILE,task.items.length);
 selections={};
 render();
}
function finish(){
 const next=typeof l6t4NextTask==='function'?l6t4NextTask('dialog-abc'):'task.html?task=phrases';
 const suffix=next.includes('?')?'&v=l6t4-dialog13':'?v=l6t4-dialog13';
 l6t4Complete(area,next==='index.html'?next:next+suffix,'Du hast alle fünf Dialoge fehlerfrei bearbeitet.');
}
area.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(!button)return;
 if(button.dataset.d13Question!==undefined){selectAnswer(button);return}
 if(button.hasAttribute('data-d13-check'))checkAnswers();
});
render();
})();
