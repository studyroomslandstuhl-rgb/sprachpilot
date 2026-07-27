(function(){
'use strict';
const FILE='task-dialog-abc';
const VERSION='l6t4-dialoge-standalone1';
const AUDIO='https://sprachpilot.b-cdn.net/audio/';
const area=document.getElementById('area');
if(!area)return;
const DIALOGS=[
 {
  number:1,
  audio:AUDIO+'l6t4-aufgabe13-dialog-01.mp3',
  questions:[
   {prompt:'Was macht Omar am Vormittag?',answer:'Er arbeitet.',options:['Er fährt Fahrrad.','Er arbeitet.','Er spielt Backgammon.']},
   {prompt:'Wo treffen sich Lea und Omar?',answer:'Am Bahnhof.',options:['Am See.','Am Bahnhof.','Vor Omars Arbeit.']},
   {prompt:'Was machen sie bei Regen?',answer:'Sie gehen in ein Café und spielen.',options:['Sie fahren mit dem Fahrrad.','Sie gehen nach Hause.','Sie gehen in ein Café und spielen.']}
  ]
 },
 {
  number:2,
  audio:AUDIO+'l6t4-aufgabe13-dialog-02.mp3',
  questions:[
   {prompt:'Warum sehen Mara und Tom nicht den Krimi?',answer:'Tom kann nicht pünktlich da sein.',options:['Mara mag keine Krimis.','Tom kann nicht pünktlich da sein.','Der Krimi beginnt erst um 21 Uhr.']},
   {prompt:'Wer kauft die Kinokarten?',answer:'Mara.',options:['Mara.','Tom.','Paul.']},
   {prompt:'Was machen Mara und Tom nach dem Film?',answer:'Sie besuchen ein Konzert.',options:['Sie gehen direkt nach Hause.','Sie fahren Fahrrad.','Sie besuchen ein Konzert.']}
  ]
 },
 {
  number:3,
  audio:AUDIO+'l6t4-aufgabe13-dialog-03.mp3',
  questions:[
   {prompt:'Was macht Jonas vor dem Grillen?',answer:'Er geht schwimmen.',options:['Er geht schwimmen.','Er arbeitet.','Er trifft Mara im Café.']},
   {prompt:'Was soll Jonas mitbringen?',answer:'Brot und Wasser.',options:['Fleisch und Kartoffeln.','Brot und Wasser.','Einen Salat und Kaffee.']},
   {prompt:'Warum hat Nina auch viel Gemüse gekauft?',answer:'Ahmed isst kein Fleisch.',options:['Jonas mag kein Brot.','Mara möchte nur Salat.','Ahmed isst kein Fleisch.']}
  ]
 },
 {
  number:4,
  audio:AUDIO+'l6t4-aufgabe13-dialog-04.mp3',
  questions:[
   {prompt:'Warum sucht Sofia ein neues Hobby?',answer:'Sie findet ihre Freizeit im Internet langweilig.',options:['Sie möchte weniger arbeiten.','Sie findet ihre Freizeit im Internet langweilig.','Sie möchte einen neuen Beruf finden.']},
   {prompt:'Wann treffen sich Sofia und Paul?',answer:'Um 17:45 Uhr.',options:['Um 17:45 Uhr.','Um 17 Uhr.','Um 18:20 Uhr.']},
   {prompt:'Was ist für Sofia beim ersten Besuch wichtig?',answer:'Sie hat Spaß.',options:['Sie kann schon gut tanzen.','Sie bringt 30 Euro mit.','Sie hat Spaß.']}
  ]
 },
 {
  number:5,
  audio:AUDIO+'l6t4-aufgabe13-dialog-05.mp3',
  questions:[
   {prompt:'Wo haben Anna und Daniel zuletzt mit dem Würfel gespielt?',answer:'Im Café.',options:['Im Park.','Im Café.','Bei Daniel zu Hause.']},
   {prompt:'Wo hat der Kellner den Würfel gefunden?',answer:'Unter einem Stuhl.',options:['Unter einem Stuhl.','In Annas Tasche.','Neben der Kasse.']},
   {prompt:'Was machen Anna und Daniel danach?',answer:'Sie gehen zu Daniel und spielen weiter.',options:['Sie gehen wieder in den Park.','Sie fahren mit dem Fahrrad.','Sie gehen zu Daniel und spielen weiter.']}
  ]
 }
];
let activeIndex=null;
let selections={};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function storage(){return typeof l6t4Storage==='function'?l6t4Storage():localStorage}
function key(){return typeof l6t4TaskKey==='function'?l6t4TaskKey(FILE):'SP_L6_T4_V2_'+FILE}
function prepareState(){
 const store=storage();
 const marker=(typeof l6t4IsPreview==='function'&&l6t4IsPreview()?'SP_L6_T4_PREVIEW_':'SP_L6_T4_')+'DIALOG13_CONTENT_VERSION';
 if(store.getItem(marker)===VERSION)return;
 store.setItem(marker,VERSION);
 store.setItem(key(),JSON.stringify({total:DIALOGS.length,done:[],queue:[0,1,2,3,4],current:null,tries:0,hadWrong:false,firstCorrect:0,firstSeen:[]}));
}
function state(){return l6t4Load(FILE,DIALOGS.length)}
function getIndex(){const saved=state();return saved.current===null||saved.current===undefined?l6t4NextIndex(FILE,DIALOGS.length):saved.current}
function current(){const index=getIndex();if(activeIndex!==index){activeIndex=index;selections={}}return DIALOGS[index]}
function feedback(dialog){
 const tries=state().tries||0;
 if(tries===1)return'<div class="no">Noch nicht richtig. Höre den Dialog noch einmal und prüfe alle drei Antworten.</div>';
 if(tries===2)return'<div class="hint"><strong>Hinweis:</strong> Achte auf Zeiten, Orte und Gründe.</div>';
 if(tries>=3)return'<div class="no"><strong>Lösungen:</strong>'+dialog.questions.map((question,index)=>'<br>'+(index+1)+'. '+String.fromCharCode(65+question.options.indexOf(question.answer))+' – '+esc(question.answer)).join('')+'<br>Der Dialog kommt später noch einmal.</div>';
 return'';
}
function questionHtml(question,index){return'<section class="dialog13-question"><div class="dialog13-question-number">'+(index+1)+'</div><h2>'+esc(question.prompt)+'</h2><div class="dialog13-options abc-list">'+question.options.map((option,optionIndex)=>'<button type="button" class="option" data-question="'+index+'" data-value="'+esc(option)+'" aria-pressed="false"><span class="abc-letter">'+String.fromCharCode(65+optionIndex)+'</span><span>'+esc(option)+'</span></button>').join('')+'</div></section>'}
function render(){
 const saved=state();
 if(saved.done.length>=DIALOGS.length){finish();return}
 const dialog=current();
 if(!dialog){storage().removeItem(key());prepareState();activeIndex=null;selections={};render();return}
 if(typeof l6t4MatchedHeader==='function')l6t4MatchedHeader('Dialoge');else if(typeof l6t4Header==='function')l6t4Header('Dialoge');
 document.title='Aufgabe 13 · Dialoge';
 area.innerHTML='<div class="task-title-block"><span class="task-number">Aufgabe 13</span><h1>Dialoge</h1></div>'+l6t4Progress(FILE,DIALOGS.length)+'<div class="task-instruction">Höre den Dialog und beantworte alle drei Fragen.</div><div class="dialog13-audio"><audio controls preload="metadata" src="'+esc(dialog.audio)+'"></audio><div class="audio-load-error" hidden>Die Audiodatei konnte nicht geladen werden.</div></div><div class="dialog13-page-label">Dialog '+dialog.number+' von '+DIALOGS.length+'</div><div class="dialog13-question-list">'+dialog.questions.map(questionHtml).join('')+'</div><div class="actions centered"><button class="btn" type="button" data-check disabled>Kontrollieren</button></div><div id="feedback" class="feedback">'+feedback(dialog)+'</div><div id="tech"></div>';
 const audio=area.querySelector('audio');
 audio?.addEventListener('error',()=>{audio.hidden=true;const error=audio.nextElementSibling;if(error)error.hidden=false},{once:true});
}
function select(button){
 const question=Number(button.dataset.question);
 selections[question]=button.dataset.value;
 area.querySelectorAll('[data-question="'+question+'"]').forEach(option=>{const selected=option===button;option.classList.toggle('selected',selected);option.setAttribute('aria-pressed',selected?'true':'false')});
 const check=area.querySelector('[data-check]');
 if(check)check.disabled=Object.keys(selections).length<3;
}
function check(){
 const dialog=current();
 if(Object.keys(selections).length<3)return;
 const correct=dialog.questions.every((question,index)=>l6t4Exact(selections[index],question.answer));
 l6t4RegisterAttempt(FILE,DIALOGS.length,activeIndex,correct);
 if(correct){
  const repeated=state().hadWrong||state().tries>0;
  l6t4Right(FILE,DIALOGS.length);
  area.querySelectorAll('button,audio').forEach(element=>element.disabled=true);
  document.getElementById('feedback').innerHTML='<div class="ok">Richtig.'+(repeated?' Der Dialog kommt am Ende noch einmal.':'')+'</div>';
  activeIndex=null;selections={};setTimeout(render,700);return;
 }
 l6t4Wrong(FILE,DIALOGS.length);selections={};render();
}
function finish(){
 l6t4Complete(area,'task.html?task=phrases&v=l6t4-dialoge1','Du hast alle fünf Dialoge fehlerfrei bearbeitet.');
}
area.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.question!==undefined){select(button);return}if(button.hasAttribute('data-check'))check()});
prepareState();
render();
})();
