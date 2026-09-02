(function(){
'use strict';
if(window.__SP_L8T2_TASK10_SAFE_20260902_V1)return;
window.__SP_L8T2_TASK10_SAFE_20260902_V1=true;

const FIELDS=[
 ['Name','Elena Markovic'],
 ['Geburtsjahr','1995'],
 ['Geburtsort','Belgrad'],
 ['Wohnort','Köln'],
 ['Deutschland','seit 9 Jahren'],
 ['Ausbildung','Köchin'],
 ['Ausbildung angefangen','vor 6 Jahren'],
 ['Dauer der Ausbildung','3 Jahre'],
 ['Arbeit','Restaurant in Köln · seit 3 Jahren']
];
const HELP=['geboren','wohnt','seit','vor','Ausbildung','Köchin','Jahre','arbeitet','Restaurant','Erfahrung'];
function themeOf(all){return all?.[2]||all?.['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>String(t?.id)==='biografie-schreiben');
 if(!task)return theme;
 task.title='Biografie schreiben';
 task.instruction='Schreibe aus den Angaben eine kurze Biografie.';
 task.kind='free';task.icon='✍️';task.emoji='✍️';
 task.items=[{
  type:'free',min:4,
  prompt:'Schreibe mindestens vier vollständige Sätze. Nutze die Angaben und die Wörter als Hilfe.',
  context:`Wörter als Hilfe: ${HELP.join(' · ')}\n\n${FIELDS.map(([label,value])=>`${label}: ${value}`).join('\n')}`
 }];
 theme.contentRevision=String(theme.contentRevision||'')+'-task10-safe-v1';
 return theme;
}
function disableOldUi(){
 if(window.L8T2BiographyWrite){
  window.L8T2BiographyWrite.install=()=>false;
  window.L8T2BiographyWrite.validate=()=>[];
 }
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_TASK10_SAFE_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);
 apply(theme);disableOldUi();
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T2 Aufgabe 10 Safe',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T2_TASK10_SAFE_READY;
disableOldUi();
window.L8T2Task10Safe20260902={apply,disableOldUi,version:1};
})();
