(function(){
'use strict';
if(window.__SP_VERB_LISTEN_IMAGE_TASKS_V1)return;
window.__SP_VERB_LISTEN_IMAGE_TASKS_V1=true;
const E=window.VerbGroupsEngine;
if(!E)return;

const listenTask=E.TASKS.find(item=>item[0]==='listen');
if(listenTask){listenTask[1]='🔊→▣';listenTask[2]='Hören → Bild'}
E.TASK_TITLE.listen='Hören → Bild';

if(!E.TASKS.some(item=>item[0]==='image-to-audio')){
 const listenIndex=E.TASKS.findIndex(item=>item[0]==='listen');
 E.TASKS.splice(listenIndex>=0?listenIndex+1:4,0,['image-to-audio','▣→🔊','Bild → Hören']);
 const learnIndex=E.LEARN.indexOf('listen');
 E.LEARN.splice(learnIndex>=0?learnIndex+1:E.LEARN.length,0,'image-to-audio');
}
E.TASK_TITLE['image-to-audio']='Bild → Hören';

function shuffle(list){
 const out=[...(list||[])];
 for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
 return out;
}
function choices(groupId,correct){
 const group=E.GROUPS.find(item=>Number(item.id)===Number(groupId))||E.GROUPS[Number(groupId)-1];
 const pool=(group?.verbs||[]).filter(v=>v!==correct);
 return shuffle([correct,...shuffle(pool).slice(0,3)]);
}

const previousQuestion=E.question.bind(E);
E.question=function(groupId,task,verb,personOverride=null){
 if(task==='listen')return{
  kind:'images',
  prompt:'Höre das Verb und wähle das richtige Bild.',
  answer:verb,
  options:choices(groupId,verb),
  audio:verb
 };
 if(task==='image-to-audio')return{
  kind:'mc',
  prompt:'Welches gehörte Verb passt zum Bild?',
  answer:verb,
  options:choices(groupId,verb),
  image:verb,
  audioChoices:true
 };
 return previousQuestion(groupId,task,verb,personOverride);
};

function speakFallback(text){
 try{
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='de-DE';u.rate=.92;
  speechSynthesis.speak(u);
 }catch(e){}
}
function playVerb(verb,button){
 const bunny=window.SPVerbBunnyAllInfinitives;
 if(bunny){
  const resolved=bunny.resolveVerb?.(verb)||verb;
  if(bunny.play?.(resolved,false,button))return;
  if(bunny.computerSpeak?.(resolved,false))return;
 }
 speakFallback(verb);
}
function enhanceAudioChoices(root=document){
 const q=new URLSearchParams(location.search);
 if(q.get('task')!=='image-to-audio')return;
 root.querySelectorAll('.question-card .option-grid').forEach(grid=>{
  if(grid.dataset.audioChoicesReady==='1')return;
  const buttons=[...grid.querySelectorAll(':scope > .option[data-action="answer"]')];
  if(buttons.length!==4)return;
  grid.dataset.audioChoicesReady='1';
  grid.classList.add('audio-choice-grid');
  buttons.forEach((answerButton,index)=>{
   const verb=answerButton.dataset.answer||'';
   const row=document.createElement('div');
   row.className='audio-choice-row';
   const play=document.createElement('button');
   play.type='button';
   play.className='btn secondary audio-choice-play';
   play.textContent=`🔊 Hören ${index+1}`;
   play.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();playVerb(verb,play)});
   answerButton.textContent='Auswählen';
   answerButton.classList.add('audio-choice-select');
   answerButton.parentNode.insertBefore(row,answerButton);
   row.append(play,answerButton);
  });
 });
}

const style=document.createElement('style');
style.textContent=`
.audio-choice-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.audio-choice-row{display:grid;grid-template-columns:1fr;gap:8px;padding:10px;border:2px solid var(--line,#d9eef7);border-radius:18px;background:#fff}
.audio-choice-row .btn,.audio-choice-row .option{width:100%;margin:0;min-height:52px}
.audio-choice-play{font-weight:900}
@media(max-width:560px){.audio-choice-grid{grid-template-columns:1fr!important}}
`;
document.head.appendChild(style);

let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhanceAudioChoices()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);
schedule();
})();