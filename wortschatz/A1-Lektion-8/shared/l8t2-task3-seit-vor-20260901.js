(function(){
'use strict';
if(window.__SP_L8T2_TASK3_SEIT_VOR_20260901)return;
window.__SP_L8T2_TASK3_SEIT_VOR_20260901=true;

const ITEMS=[
 {prompt:'seit + 1 + Sekunde',answer:['seit einer Sekunde']},
 {prompt:'vor + 2 + Sekunden',answer:['vor zwei Sekunden','vor 2 Sekunden']},
 {prompt:'seit + 4 + Sekunden',answer:['seit vier Sekunden','seit 4 Sekunden']},
 {prompt:'vor + 7 + Sekunden',answer:['vor sieben Sekunden','vor 7 Sekunden']},
 {prompt:'seit + 1 + Minute',answer:['seit einer Minute']},
 {prompt:'vor + 3 + Minuten',answer:['vor drei Minuten','vor 3 Minuten']},
 {prompt:'seit + 6 + Minuten',answer:['seit sechs Minuten','seit 6 Minuten']},
 {prompt:'vor + 10 + Minuten',answer:['vor zehn Minuten','vor 10 Minuten']},
 {prompt:'seit + 1 + Stunde',answer:['seit einer Stunde']},
 {prompt:'vor + 2 + Stunden',answer:['vor zwei Stunden','vor 2 Stunden']},
 {prompt:'seit + 5 + Stunden',answer:['seit fünf Stunden','seit 5 Stunden']},
 {prompt:'vor + 8 + Stunden',answer:['vor acht Stunden','vor 8 Stunden']},
 {prompt:'seit + 1 + Tag',answer:['seit einem Tag']},
 {prompt:'vor + 2 + Tage',answer:['vor zwei Tagen','vor 2 Tagen']},
 {prompt:'seit + 4 + Tage',answer:['seit vier Tagen','seit 4 Tagen']},
 {prompt:'vor + 9 + Tage',answer:['vor neun Tagen','vor 9 Tagen']},
 {prompt:'seit + 1 + Woche',answer:['seit einer Woche']},
 {prompt:'vor + 2 + Wochen',answer:['vor zwei Wochen','vor 2 Wochen']},
 {prompt:'seit + 3 + Wochen',answer:['seit drei Wochen','seit 3 Wochen']},
 {prompt:'vor + 6 + Wochen',answer:['vor sechs Wochen','vor 6 Wochen']},
 {prompt:'seit + 1 + Monat',answer:['seit einem Monat']},
 {prompt:'vor + 2 + Monate',answer:['vor zwei Monaten','vor 2 Monaten']},
 {prompt:'seit + 5 + Monate',answer:['seit fünf Monaten','seit 5 Monaten']},
 {prompt:'vor + 8 + Monate',answer:['vor acht Monaten','vor 8 Monaten']},
 {prompt:'seit + 1 + Jahr',answer:['seit einem Jahr']},
 {prompt:'vor + 2 + Jahre',answer:['vor zwei Jahren','vor 2 Jahren']},
 {prompt:'seit + 3 + Jahre',answer:['seit drei Jahren','seit 3 Jahren']},
 {prompt:'vor + 5 + Jahre',answer:['vor fünf Jahren','vor 5 Jahren']},
 {prompt:'seit + 7 + Jahre',answer:['seit sieben Jahren','seit 7 Jahren']},
 {prompt:'vor + 10 + Jahre',answer:['vor zehn Jahren','vor 10 Jahren']}
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(item=>item?.id==='zeitwoerter-seit-vor');
 if(!task)return theme;
 task.title='Seit und vor';
 task.instruction='Schreibe die richtigen Zeitangaben.';
 task.kind='input';
 task.icon='✍️';
 task.emoji='✍️';
 delete task.intro;
 task.items=ITEMS.map(item=>({type:'input',prompt:item.prompt,answer:[...item.answer]}));
 return theme;
}

window.L8_T2_TASK3_SEIT_VOR_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK3_SEIT_VOR_READY;
window.L8T2Task3SeitVor={apply};
})();