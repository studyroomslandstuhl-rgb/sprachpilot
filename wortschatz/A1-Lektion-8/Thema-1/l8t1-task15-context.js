(function(){
'use strict';
if(window.__SP_L8T1_TASK15_CONTEXT_V1)return;window.__SP_L8T1_TASK15_CONTEXT_V1=true;
const rows=[
 ['Ich habe keinen Job und keine Stelle. Ich bin ___.',['arbeitslos']],
 ['Ich habe einen Job und arbeite jeden Tag. Ich bin ___.',['berufstätig']],
 ['Ich arbeite bei einer Firma und habe einen Chef. Ich bin dort ___.',['angestellt']],
 ['Ich habe eine eigene Firma und keinen Chef. Ich bin ___.',['selbstständig']],
 ['Ich arbeite jetzt nicht. ___ bin ich arbeitslos.',['zurzeit']],
 ['Was machst du ___? – Ich bin Koch.',['beruflich']],
 ['Ich bin Studentin. Ich ___.',['studiere']],
 ['Ich lerne einen Beruf. Ich mache eine ___.',['Ausbildung','ausbildung']],
 ['Die Ärztin ist selbstständig. Sie hat eine eigene ___.',['Praxis','praxis']],
 ['Ich arbeite bei Lidl. Lidl ist eine ___.',['Firma','firma']],
 ['Heute sprechen wir über Berufe und Arbeit. Das ist das ___.',['Thema','thema']],
 ['Ich sehe das Interview im ___.',['Fernsehen','fernsehen']],
 ['Der Journalist schreibt für eine ___.',['Zeitung','zeitung']],
 ['Der Journalist fragt die Ärztin. Die Ärztin antwortet. Das ist ein ___.',['Interview','interview']],
 ['Der Journalist schreibt über eine Person. Das ist eine ___.',['Geschichte','geschichte']],
 ['Der Patient ist krank. Der Krankenpfleger arbeitet dort. Der Patient ist im ___.',['Krankenhaus','krankenhaus']],
 ['Ich bin arbeitslos und suche Arbeit. Ich suche eine neue ___.',['Stelle','stelle']],
 ['Ich habe Arbeit. Ich habe einen ___.',['Job','job']],
 ['Ich bin Koch. Koch ist mein ___.',['Beruf','beruf']],
 ['Ich habe keine Arbeit. ___ bin ich arbeitslos.',['zurzeit']],
 ['Ich habe eine eigene Praxis und keinen Chef. Ich bin ___.',['selbstständig']],
 ['Ich arbeite bei einer Zeitung und habe einen Chef. Ich bin dort ___.',['angestellt']],
 ['Ich habe eine Stelle und arbeite. Ich bin ___.',['berufstätig']],
 ['Ich habe keinen Job. Ich suche eine Stelle. Ich bin ___.',['arbeitslos']],
 ['Was machen Sie ___? – Ich bin Journalistin.',['beruflich']],
 ['Ich bin Student. Ich ___.',['studiere']],
 ['Die Journalistin fragt den Chef. Der Chef antwortet. Sie macht ein ___.',['Interview','interview']],
 ['Der Krankenpfleger arbeitet dort und viele Patienten sind dort. Das ist ein ___.',['Krankenhaus','krankenhaus']]
];
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null)||window.L8_THEME;
 if(!theme)return value;
 const task=(theme.tasks||[]).find(t=>t.id==='arbeit-wortschatz-schreiben-v3');
 if(task){
  task.title='Wortschatz selbst schreiben';
  task.instruction='Lies den Kontext und schreibe das passende Wort.';
  task.items=rows.map(([prompt,answer])=>({type:'input',prompt,answer,hint:'Lies beide Sätze zusammen. Der Kontext zeigt dir, welches Wort passt.'}));
  task.contextRevision='l8t1-task15-context-v1';
 }
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;
 return value;
});
})();
