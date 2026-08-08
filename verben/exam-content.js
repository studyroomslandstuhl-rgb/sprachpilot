(function(){
'use strict';
if(window.__SP_VERB_EXAM_CONTENT_V3)return;
window.__SP_VERB_EXAM_CONTENT_V3=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const originalQuestion=E.question.bind(E);
// 20 Fragen = genau die 20 gelernten Verben dieser Gruppe.
// Diese 10 prüfbaren Aufgabentypen kommen je zweimal vor.
// Karteikarten sind Lernhilfe und deshalb kein Prüfungsformat.
const EXAM_PATTERN=[
 'exam-meaning-to-verb',
 'exam-verb-to-meaning',
 'exam-listen-to-image',
 'exam-image-to-verb',
 'exam-verb-to-image',
 'exam-image-to-listen',
 'exam-form-choice',
 'exam-form-write',
 'exam-form-speak',
 'exam-sentence'
];

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
function clue(verb){
 try{const value=window.SPVerbSemanticClue?.(verb);if(value)return value}catch{}
 return window.SP_VERB_A1_MEANINGS?.[verb]||E.meaning(verb)||verb;
}
function optionSet(answer,primary,secondary=[],count=4){
 const options=unique([answer,...shuffle(primary),...shuffle(secondary)]).slice(0,count);
 return shuffle(options);
}
function personIndex(groupId,task,verb,override){
 if(Number.isInteger(override))return override;
 try{return Number(E.personFor(groupId,task,verb))||0}catch{return 0}
}
function personLabel(index){return E.PERSONS?.[index]?.label||['ich','du','er/sie/es','wir','ihr','sie/Sie'][index]||'ich'}
function formOptions(groupId,verb,index){
 const answer=E.displayForm(verb,index);
 const localVerbs=verbsFor(groupId);
 const samePerson=localVerbs.map(item=>E.displayForm(item,index));
 const localAllForms=localVerbs.flatMap(item=>[0,1,2,3,4,5].map(pi=>E.displayForm(item,pi)));
 return optionSet(answer,samePerson,localAllForms,4);
}
function meaningOptions(groupId,verb){
 const answer=clue(verb);
 const local=verbsFor(groupId).map(clue);
 return optionSet(answer,local,[],4);
}
function verbOptions(groupId,verb){return optionSet(verb,verbsFor(groupId),[],4)}
function sentenceFor(groupId,verb){
 const stored=String(window.SP_VERB_SENTENCES?.[verb]||'').trim();
 if(stored&&!/Ich lerne das Verb/i.test(stored))return stored;
 const index=Math.max(0,verbsFor(groupId).indexOf(verb));
 return index%2===0?`Maria ${E.displayForm(verb,2)}.`:`Ich ${E.displayForm(verb,0)}.`;
}

E.examItems=function(groupId){
 const verbs=shuffle(verbsFor(groupId));
 if(!verbs.length)return[];
 return verbs.map((verb,index)=>({
  task:EXAM_PATTERN[index%EXAM_PATTERN.length],
  v:verb,
  person:index%6,
  number:index+1
 }));
};

E.question=function(groupId,task,verb,personOverride=null){
 if(!String(task||'').startsWith('exam-'))return originalQuestion(groupId,task,verb,personOverride);
 const person=personIndex(groupId,task,verb,personOverride);
 const label=personLabel(person);
 const form=E.displayForm(verb,person);

 if(task==='exam-meaning-to-verb')return{
  kind:'mc',prompt:clue(verb),answer:verb,options:verbOptions(groupId,verb),image:verb
 };
 if(task==='exam-verb-to-meaning')return{
  kind:'mc',prompt:`Was bedeutet „${verb}“?`,answer:clue(verb),options:meaningOptions(groupId,verb),image:verb
 };
 if(task==='exam-listen-to-image')return{
  kind:'images',prompt:'Höre das Verb und wähle das richtige Bild.',answer:verb,options:verbOptions(groupId,verb),audio:verb
 };
 if(task==='exam-image-to-verb')return{
  kind:'mc',prompt:'Welches Verb zeigt das Bild?',answer:verb,options:verbOptions(groupId,verb),image:verb
 };
 if(task==='exam-verb-to-image')return{
  kind:'images',prompt:`Welches Bild passt zu „${verb}“?`,answer:verb,options:verbOptions(groupId,verb)
 };
 if(task==='exam-image-to-listen')return{
  kind:'mc',prompt:'Welches gehörte Verb passt zum Bild?',answer:verb,options:verbOptions(groupId,verb),image:verb,audioChoices:true
 };
 if(task==='exam-form-choice')return{
  kind:'mc',prompt:`Wähle die richtige Form: ${label} – ${verb}`,answer:form,options:formOptions(groupId,verb,person)
 };
 if(task==='exam-form-write')return{
  kind:'input',prompt:`Schreibe die richtige Form: ${label} – ${verb}`,answer:form,writeAnswer:form,placeholder:'Verbform schreiben'
 };
 if(task==='exam-form-speak')return{
  kind:'speech',prompt:`Sprich: ${label} – ${verb}`,answer:E.phrase(verb,person),answers:[E.phrase(verb,person),form],writeAnswer:form,examSpeech:true
 };
 if(task==='exam-sentence'){
  const sentence=sentenceFor(groupId,verb);
  return{kind:'input',prompt:`Baue den Satz mit „${verb}“.`,answer:sentence,writeAnswer:sentence,placeholder:'Satz',examSentenceBlocks:true};
 }
 return originalQuestion(groupId,'write-form',verb,person);
};

E.EXAM_QUESTION_COUNT=20;
E.EXAM_PATTERN=EXAM_PATTERN.slice();
E.EXAM_SESSION_SCHEMA=3;

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
 description.innerHTML=`<p><strong>${count} Prüfungsfragen</strong> – jedes gelernte Verb dieser Gruppe kommt genau einmal vor.</p><p>Auch alle Antwortmöglichkeiten stammen nur aus dieser 20er-Gruppe.</p><p>Bedeutung · Hören/Bild · Bild/Verb · Bild/Hören · Formen · Sprechen · Satz bauen</p>`;
 heading.after(description);
}

const style=document.createElement('style');
style.textContent='.verb-exam-description{margin:12px auto 22px;padding:14px 18px;border:2px solid #f0c95a;border-radius:16px;background:#fffdf2;line-height:1.5}.verb-exam-description p{margin:5px 0}';
document.head.appendChild(style);
new MutationObserver(()=>enhanceExamIntro()).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(enhanceExamIntro,0);
})();
