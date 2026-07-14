function usableTranslation(verb){const value=String(translationFor(verb)||'').trim();return value&&value!=='—'&&clean(value)!==clean(verb)?value:''}
function infinitivePrompt(verb){
  const translation=usableTranslation(verb);
  if(translation)return{label:translation,note:'Schreibe das deutsche Verb im Infinitiv.'};
  return{label:sentenceGap(verb),note:'Welches Verb passt? Schreibe den Infinitiv.'};
}
renderWriting=function(task,verb){
  const prompt=infinitivePrompt(verb);
  taskShell(task,`<div class="question">${esc(prompt.label)}</div><p class="small" style="text-align:center">${esc(prompt.note)}</p><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Deutsches Verb"><div class="actions"><button id="checkAnswer">Kontrollieren</button></div>`);
  bindTextAnswer(task.id,verb,'Nutze die Bedeutung oder den Satz und schreibe den deutschen Infinitiv.');
};
examQuestionFor=function(verb,index){
  const type=['image-write','meaning-write','sentence-choice','conjugation'][index%4];
  if(type==='image-write')return{verb,type,prompt:'Welches Verb passt zum Bild?',answer:verb};
  if(type==='meaning-write'){const prompt=infinitivePrompt(verb);return{verb,type,prompt:prompt.label,answer:verb}}
  if(type==='sentence-choice')return{verb,type,prompt:sentenceGap(verb),answer:verb,options:shuffle([verb,...distractors(verb)],hash(verb+'exam'))};
  return{verb,type,prompt:`Ich __________. (${verb})`,answer:ichForm(verb)};
};
const oldRenderExam=renderExam;
renderExam=function(){
  oldRenderExam();
  const run=activePackage()?.examRun,q=run?.questions?.[run.index];
  if(q?.type==='meaning-write'&&!document.getElementById('examInput')){
    const input=document.querySelector('.answer-input');if(input)input.id='examInput';
  }
};
window.VERBEN_TEST_CONTEXT={usableTranslation,infinitivePrompt};
