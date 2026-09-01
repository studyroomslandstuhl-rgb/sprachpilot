(function(){
'use strict';
if(window.__SP_L8T2_TASK9_FEWER_HINTS_20260901)return;
window.__SP_L8T2_TASK9_FEWER_HINTS_20260901=true;

const HINTS=[
 'Hilfe: Ausbildung · Berufserfahrung',
 'Hilfe: Abschluss · Stelle',
 'Hilfe: Bewerbung · Lebenslauf',
 'Hilfe: Praktikum · Abteilung',
 'Hilfe: Ausbildung · Arbeitgeberin'
];
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.id==='biografien-luecken');
 if(!task||!Array.isArray(task.items))return theme;
 task.items.forEach((item,i)=>{
  if(Array.isArray(item.lines)&&item.lines.length)item.lines[0]=HINTS[i]||'Hilfe: Nutze den Wortschatz aus Thema 2.';
 });
 task.instruction='Ergänze die fehlenden Wörter und Zeitpräpositionen. Einige Wörter musst du selbst finden.';
 theme.contentRevision='l8t2-task9-fewer-hints-20260901-v1';
 return theme;
}
window.L8_T2_TASK9_FEWER_HINTS_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK9_FEWER_HINTS_READY;
})();