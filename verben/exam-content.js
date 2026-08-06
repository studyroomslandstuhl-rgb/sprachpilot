(function(){
'use strict';
if(window.__SP_VERB_EXAM_CONTENT_V1)return;
window.__SP_VERB_EXAM_CONTENT_V1=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const originalQuestion=E.question.bind(E);
const EXAM_PATTERN=[
 'exam-meaning-to-verb',
 'exam-verb-to-meaning',
 'exam-listen',
 'exam-image',
 'exam-group',
 'exam-form-choice',
 'exam-form-write',
 'exam-sentence',
 'exam-meaning-to-verb',
 'exam-verb-to-meaning',
 'exam-listen',
 'exam-image',
 'exam-form-choice',
 'exam-form-write',
 'exam-sentence',
 'exam-group',
 'exam-meaning-to-verb',
 'exam-listen',
 'exam-form-choice',
 'exam-sentence'
];
const GROUP_OPTIONS=['Regelmäßig','Unregelmäßig','Trennbar','Nicht trennbar','Reflexiv','Modalverb'];

const normalize=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ');
const unique=list=>{
 const seen=new Set();
 return(list||[]).filter(value=>{
  const key=normalize(value);
  if(!key||seen.has(key))return false;
  seen.add(key);
  return true;
 });
};
function shuffle(list){
 const output=[...(list||[])];
 for(let index=output.length-1;index>0;index--){
  const swap=Math.floor(Math.random()*(index+1));
  [output[index],output[swap]]=[output[swap],output[index]];
 }
 return output;
}
function group(groupId){return E.GROUPS.find(item=>Number(item.id)===Number(groupId))||E.GROUPS[Number(groupId)-1]||null}
function verbsFor(groupId){return group(groupId)?.verbs?.slice()||[]}
function optionSet(answer,primary,secondary=[],count=4){
 const options=unique([answer,...shuffle(primary),...shuffle(secondary)]).slice(0,count);
 return shuffle(options);
}
function personIndex(groupId,task,verb,override){
 if(Number.isInteger(override))return override;
 try{return Number(E.personFor(groupId,task,verb))||0}catch(error){return 0}
}
function personLabel(index){return E.PERSONS?.[index]?.label||['ich','du','er/sie/es','wir','ihr','sie/Sie'][index]||'ich'}
function formOptions(groupId,verb,index){
 const answer=E.displayForm(verb,index);
 const local=verbsFor(groupId).map(item=>E.displayForm(item,index));
 const all=(E.ALL||[]).map(item=>E.displayForm(item,index));
 return optionSet(answer,local,all,4);
}
function meaningOptions(groupId,verb){
 const answer=E.meaning(verb);
 const local=verbsFor(groupId).map(item=>E.meaning(item));
 const all=(E.ALL||[]).map(item=>E.meaning(item));
 return optionSet(answer,local,all,4);
}
function verbOptions(groupId,verb){return optionSet(verb,verbsFor(groupId),E.ALL||[],4)}

E.examItems=function(groupId){
 const verbs=shuffle(verbsFor(groupId));
 if(!verbs.length)return[];
 return verbs.map((verb,index)=>({
  task:EXAM_PATTERN[index%EXAM_PATTERN.length],
  v:verb,
  person:personIndex(groupId,`exam-${index}`,verb,index%6),
  number:index+1
 }));
};

E.question=function(groupId,task,verb,personOverride=null){
 if(!String(task||'').startsWith('exam-'))return originalQuestion(groupId,task,verb,personOverride);
 const person=personIndex(groupId,task,verb,personOverride);
 const label=personLabel(person);
 const form=E.displayForm(verb,person);

 if(task==='exam-meaning-to-verb')return{
  kind:'mc',
  prompt:`Welches Verb passt zu „${E.meaning(verb)}“?`,
  answer:verb,
  options:verbOptions(groupId,verb)
 };
 if(task==='exam-verb-to-meaning')return{
  kind:'mc',
  prompt:`Was bedeutet „${verb}“?`,
  answer:E.meaning(verb),
  options:meaningOptions(groupId,verb)
 };
 if(task==='exam-listen')return{
  kind:'mc',
  prompt:'Welches Verb hörst du?',
  answer:verb,
  options:verbOptions(groupId,verb),
  audio:verb
 };
 if(task==='exam-image')return{
  kind:'mc',
  prompt:'Welches Verb zeigt das Bild?',
  answer:verb,
  options:verbOptions(groupId,verb),
  image:verb
 };
 if(task==='exam-group')return{
  kind:'mc',
  prompt:`Zu welcher Verbgruppe gehört „${verb}“?`,
  answer:E.groupLabel(verb),
  options:optionSet(E.groupLabel(verb),GROUP_OPTIONS,[],4)
 };
 if(task==='exam-form-choice')return{
  kind:'mc',
  prompt:`Wähle die richtige Form: ${label} – ${verb}`,
  answer:form,
  options:formOptions(groupId,verb,person)
 };
 if(task==='exam-form-write')return{
  kind:'input',
  prompt:`Schreibe die richtige Form: ${label} – ${verb}`,
  answer:form,
  writeAnswer:form,
  placeholder:'Verbform schreiben'
 };
 if(task==='exam-sentence'){
  const sentence=originalQuestion(groupId,'sentence',verb,person);
  return{
   ...sentence,
   kind:'input',
   prompt:sentence?.prompt||`${label} ________ (${verb}).`,
   answer:sentence?.answer||form,
   writeAnswer:sentence?.writeAnswer||sentence?.answer||form,
   placeholder:'Verbform schreiben'
  };
 }
 return originalQuestion(groupId,'write-form',verb,person);
};

E.EXAM_QUESTION_COUNT=20;
E.EXAM_PATTERN=EXAM_PATTERN.slice();

function enhanceExamIntro(){
 const route=new URLSearchParams(location.search);
 if(route.get('task')!=='exam')return;
 const box=document.querySelector('.finish-box');
 if(!box||box.querySelector('.verb-exam-description'))return;
 const heading=box.querySelector('h2');
 if(!heading||!/gruppenprüfung/i.test(heading.textContent||''))return;
 const groupId=Number(route.get('group'))||0;
 const count=verbsFor(groupId).length||20;
 const description=document.createElement('div');
 description.className='verb-exam-description';
 description.innerHTML=`<p><strong>${count} Prüfungsfragen</strong> – jedes Verb dieser Gruppe kommt einmal vor.</p><p>Bedeutung · Hören · Bild · Verbgruppe · Konjugation · Satz</p>`;
 heading.after(description);
}

const style=document.createElement('style');
style.textContent='.verb-exam-description{margin:12px auto 22px;padding:14px 18px;border:2px solid #f0c95a;border-radius:16px;background:#fffdf2;line-height:1.5}.verb-exam-description p{margin:5px 0}';
document.head.appendChild(style);
new MutationObserver(()=>enhanceExamIntro()).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(enhanceExamIntro,0);
})();
