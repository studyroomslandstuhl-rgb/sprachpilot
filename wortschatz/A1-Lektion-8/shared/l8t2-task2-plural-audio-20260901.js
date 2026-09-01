(function(){
'use strict';
if(window.__SP_L8T2_TASK2_PLURAL_AUDIO_20260901)return;
window.__SP_L8T2_TASK2_PLURAL_AUDIO_20260901=true;

const AUDIO='https://sprachpilot.b-cdn.net/audio/';
const ids=[
 ['sekunde','Sekunden'],
 ['minute','Minuten'],
 ['stunde','Stunden'],
 ['tag','Tage'],
 ['woche','Wochen'],
 ['monat','Monate'],
 ['jahr','Jahre']
];

function timeWord(id){
 return (window.L8_T2_TIME_WORDS||[]).find(item=>String(item?.id||'')===id)||{};
}
function audioFor(id){
 const word=timeWord(id);
 return String(word.audioFile||word.wordAudio||word.audio||`${AUDIO}${id}.mp3`).trim();
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(item=>item?.id==='zeitwoerter-artikel-plural');
 if(!task)return theme;
 task.title='Zeitwörter: Plural';
 task.instruction='Schreibe die richtige Pluralform.';
 task.kind='input';
 task.icon='🎧';
 task.emoji='🎧';
 delete task.intro;
 task.items=ids.map(([id,answer])=>{
  const audio=audioFor(id);
  return{
   type:'input',
   prompt:'',
   answer:[answer],
   audio,
   audioFile:audio
  };
 });
 return theme;
}

window.L8_T2_TASK2_PLURAL_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK2_PLURAL_READY;
window.L8T2Task2PluralAudio={apply};
})();
