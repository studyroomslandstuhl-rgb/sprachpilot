(function(){
'use strict';
const E=window.VerbGroupsEngine;
if(!E||E.__spConjugationCorrectionsV1)return;
E.__spConjugationCorrectionsV1=true;

const CORRECTIONS={
  stechen:['steche','stichst','sticht','stechen','stecht','stechen']
};
const originalForms=E.forms;
const originalDisplayForm=E.displayForm;
const originalPhrase=E.phrase;
const originalQuestion=E.question;

function correctedForms(verb){return CORRECTIONS[verb]||null}
function correctedForm(verb,personIndex){const forms=correctedForms(verb);return forms&&forms[personIndex]||null}
function escapeRegExp(value){return String(value||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function unique(values){const seen=new Set();return(values||[]).filter(value=>{const key=String(value||'').trim().toLowerCase();if(!key||seen.has(key))return false;seen.add(key);return true})}

E.forms=function(verb){const forms=correctedForms(verb);return forms?forms.slice():originalForms(verb)};
E.displayForm=function(verb,personIndex){return correctedForm(verb,personIndex)||originalDisplayForm(verb,personIndex)};
E.phrase=function(verb,personIndex){const form=correctedForm(verb,personIndex);return form?`${E.PERSONS[personIndex].label} ${form}`:originalPhrase(verb,personIndex)};
E.question=function(groupId,task,verb,personOverride=null){
  const question=originalQuestion(groupId,task,verb,personOverride);
  const forms=correctedForms(verb);
  if(!forms)return question;
  const personIndex=personOverride??E.personFor(groupId,task,verb);
  const form=forms[personIndex];
  if(!form)return question;

  if(task==='choose-form'){
    const oldAnswer=question.answer;
    question.answer=form;
    question.options=unique((question.options||[]).map(option=>option===oldAnswer?form:option));
  }else if(task==='write-form'){
    question.answer=form;
  }else if(task==='speak'){
    const spoken=`${E.PERSONS[personIndex].label} ${form}`;
    question.answer=spoken;
    question.answers=[spoken,form];
    question.writeAnswer=form;
  }else if(task==='sentence'){
    question.answer=form;
    const sentence=E.sentence(verb);
    const pattern=new RegExp(`\\b${escapeRegExp(form)}\\b`,'i');
    question.prompt=pattern.test(sentence)?sentence.replace(pattern,'________'):`${E.PERSONS[personIndex].label} ________ (${verb}).`;
  }
  return question;
};
})();
