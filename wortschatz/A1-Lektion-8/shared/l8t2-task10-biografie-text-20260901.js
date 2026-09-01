(function(){
'use strict';
if(window.__SP_L8T2_TASK10_BIOGRAFIE_TEXT_20260901)return;
window.__SP_L8T2_TASK10_BIOGRAFIE_TEXT_20260901=true;

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.id==='biografie-schreiben');
 if(!task)return theme;
 task.title='Biografie schreiben';
 task.instruction='Schreibe aus allen Informationen einen zusammenhängenden Text.';
 task.kind='free';
 task.icon='✍️';task.emoji='✍️';
 task.items=[{
  type:'free',
  min:8,
  prompt:'Schreibe die Biografie von Elena Markovic als vollständigen Text. Nutze alle Informationen und passende Zeitangaben.',
  context:'Elena Markovic – 1995 in Belgrad geboren – vor 9 Jahren nach Deutschland gekommen – seit 7 Jahren in Köln – vor 6 Jahren Ausbildung als Köchin angefangen – Ausbildung: 3 Jahre – vor 3 Jahren erste Stelle in einem Restaurant angefangen – seit 3 Jahren dort – Beruf: Köchin – möchte mehr Berufserfahrung sammeln'
 }];
 theme.contentRevision='l8t2-task10-biografie-text-20260901-v1';
 return theme;
}

window.L8_T2_TASK10_BIOGRAFIE_TEXT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK10_BIOGRAFIE_TEXT_READY;
window.L8T2Task10BiografieText={apply};
})();