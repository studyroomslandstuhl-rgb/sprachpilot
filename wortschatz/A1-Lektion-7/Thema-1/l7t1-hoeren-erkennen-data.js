(function(){
'use strict';
const rows=[
 ['duschen','l6t4-geraeusch-duschen.mp3'],
 ['kochen','l6t4-geraeusch-kochen.mp3'],
 ['staubsaugen','l6t4-geraeusch-staubsaugen.mp3'],
 ['telefonieren','l6t4-geraeusch-telefonieren.mp3'],
 ['lachen','l6t4-geraeusch-lachen.mp3'],
 ['weinen','l6t4-geraeusch-weinen.mp3'],
 ['schnarchen','l6t4-geraeusch-schnarchen.mp3'],
 ['Zähne putzen','l6t4-geraeusch-zaehne-putzen.mp3'],
 ['Geschirr spülen','l6t4-geraeusch-geschirr-spuelen.mp3'],
 ['Musik hören','l6t4-geraeusch-musik-hoeren.mp3']
];
const names=rows.map(row=>row[0]);
const options=(answer,index)=>{const other=names.filter(value=>value!==answer),shift=index%other.length;return[answer,...other.slice(shift).concat(other.slice(0,shift)).slice(0,3)]};
const items=[];
rows.forEach(([answer,audioFile],index)=>items.push({phase:'choice',kind:'choice',prompt:'Welche Aktivität hörst du?',answer,options:options(answer,index),audioFile}));
rows.forEach(([answer,audioFile])=>items.push({phase:'produce',kind:'input',prompt:'Welche Aktivität hörst du?',answer,answers:[String(answer).replace(/^die\s+/i,'')],audioFile}));
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(()=>{
 const theme=window.L7_THEME;if(!theme||!Array.isArray(theme.tasks))return theme;
 if(theme.tasks.some(task=>task.id==='hoeren-erkennen'))return theme;
 const entry={id:'hoeren-erkennen',title:'Hören und Erkennen',icon:'🔉',description:'Höre Geräusche und erkenne die Aktivitäten.',external:'hoeren-erkennen.html?v=l7t1-sound1',items};
 const examIndex=theme.tasks.findIndex(task=>task.exam);
 if(examIndex>=0)theme.tasks.splice(examIndex,0,entry);else theme.tasks.push(entry);
 return theme
});
})();
