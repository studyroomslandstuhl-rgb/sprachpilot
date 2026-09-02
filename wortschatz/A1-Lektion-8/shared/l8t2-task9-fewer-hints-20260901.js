(function(){
'use strict';
if(window.__SP_L8T2_TASK11_CLEAN_20260902_V1)return;
window.__SP_L8T2_TASK11_CLEAN_20260902_V1=true;
const input=(prompt,answer,hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],hint});
const ITEMS=[
 input('Ich suche eine neue ___.','Stelle','das Wort aus der Übersicht: die Stelle'),
 input('Ich arbeite ___ in einem Café.','gerade','Alternative für „jetzt“'),
 input('___ möchte ich als Köchin arbeiten.','Später','Nicht jetzt, sondern …'),
 input('Wie lange soll die Ausbildung ___?','dauern','Grundform des Verbs'),
 input('Kannst du mir die Arbeit ___?','zeigen','Grundform des Verbs'),
 input('Möchtest du später ___?','heiraten','Grundform des Verbs'),
 input('Was bedeutet das ___?','eigentlich','Das Wort steht am Satzende.'),
 input('Der Computer muss mir ___.','zur Verfügung stehen','Die ganze Redewendung aus der Übersicht.'),
 input('Am Anfang einer formellen E-Mail steht die ___.','Anrede','Nomen aus der Übersicht.'),
 input('Ist dein Chef heute ___?',['da','Da'],'Das Wort bedeutet hier: anwesend.')
];
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>String(t?.id)==='biografien-luecken'||String(t?.id)==='wortschatz-im-kontext-v2');
 if(!task)return theme;
 task.id='wortschatz-im-kontext-v2';
 task.title='Wörter im Kontext';
 task.instruction='Ergänze nur Wörter aus der Wortschatzübersicht von Thema 2.';
 task.kind='input';task.icon='✍️';task.emoji='✍️';delete task.intro;delete task.emailLayout;
 task.items=ITEMS.map(item=>({...item,answer:[...item.answer]}));
 theme.contentRevision='l8t2-task11-overview-vocab-only-20260902-v1';
 return theme
}
window.L8_T2_TASK9_FEWER_HINTS_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes});
window.L8_CONTENT_READY=window.L8_T2_TASK9_FEWER_HINTS_READY;
window.L8T2Task11Clean20260902={apply,version:1};
})();
