(function(){
'use strict';
if(window.__SP_L8T3_LISTENING_GROUPS_PATCH_20260902)return;
window.__SP_L8T3_LISTENING_GROUPS_PATCH_20260902=true;
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
const FILES=[
 'l8t3_auf8_dialog_01_sara.mp3',
 'l8t3_auf8_dialog_02_karim.mp3',
 'l8t3_auf8_dialog_03_nina.mp3',
 'l8t3_auf8_dialog_04_amir.mp3',
 'l8t3_auf8_dialog_05_elena.mp3'
];
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>String(t?.id)==='hoeren-arbeit-frueher-heute-fuenf-dialoge');
 if(!task||!Array.isArray(task.items)||task.items.length!==15)return theme;
 const dialogues=[];
 for(let d=0;d<5;d++){
  const start=d*3,first=task.items[start]||{};
  dialogues.push({
   title:String(first.context||`Dialog ${d+1}`),
   audio:String(first.audio||''),
   fileName:FILES[d],
   questionIndexes:[start,start+1,start+2]
  });
 }
 task.dialogues=dialogues;
 task.spL8T3ListeningGroups=true;
 task.title='Arbeit früher und heute: 5 Hördialoge';
 task.icon='🎧';task.emoji='🎧';
 task.instruction='Höre einen Dialog und beantworte alle drei Fragen auf derselben Seite.';
 task.intro='Pro Dialog: 1× Richtig/Falsch, 1× A/B/C und 1× kurze offene Antwort.';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_LISTENING_GROUPS_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T3 Hördialog-Gruppierung konnte nicht angewendet werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_LISTENING_GROUPS_READY;
window.L8T3ListeningGroupsPatch20260902={apply,version:1,fileNames:FILES.slice()};
})();
