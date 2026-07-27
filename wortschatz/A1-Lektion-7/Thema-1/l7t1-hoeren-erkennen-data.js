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

const phrase='auf jeden Fall';
const normalized=value=>String(value||'').trim().toLowerCase().replace(/[.!?;,]/g,'');
const isPhrase=value=>normalized(value)===phrase;
function migrateSavedTotal(task,oldTotal){
 if(!task?.id||task.items.length===oldTotal)return;
 const newTotal=task.items.length,newIndex=oldTotal,suffix=`_T1_${task.id}`;
 for(const storage of[localStorage,sessionStorage]){
  const keys=[];for(let i=0;i<storage.length;i++){const key=String(storage.key(i)||'');if((key.startsWith('SP_L7_')||key.startsWith('SP_L7_PREVIEW_'))&&key.endsWith(suffix))keys.push(key)}
  keys.forEach(key=>{try{
   const state=JSON.parse(storage.getItem(key)||'null');if(!state||Number(state.total)!==oldTotal)return;
   state.total=newTotal;state.done=Array.isArray(state.done)?state.done:[];state.queue=Array.isArray(state.queue)?state.queue:[];
   if(!state.done.includes(newIndex)&&state.current!==newIndex&&!state.queue.includes(newIndex))state.queue.push(newIndex);
   storage.setItem(key,JSON.stringify(state))
  }catch(e){}})
 }
}
function appendItem(task,item){const oldTotal=task.items.length;task.items.push(item);migrateSavedTotal(task,oldTotal)}
function addPhraseToTheme(theme){
 const tasks=theme.tasks||[];
 const cardTask=tasks.find(task=>Array.isArray(task.items)&&task.items.some(item=>item&&item.word&&item.meaning))||tasks.find(task=>task.kind==='cards'||/karteikarten|wortschatz|wörter/i.test(String(task.title||'')));
 if(cardTask){
  cardTask.items=Array.isArray(cardTask.items)?cardTask.items:[];
  if(!cardTask.items.some(item=>isPhrase(item?.word)))appendItem(cardTask,{word:'auf jeden Fall',meaning:'ganz sicher; in jedem Fall',image:'auf_jeden_fall.webp',audio:'auf jeden Fall',example:'Ich komme auf jeden Fall.'});
 }
 const practiceTask=tasks.find(task=>{
  if(task.exam||task===cardTask||!Array.isArray(task.items))return false;
  const label=`${task.title||''} ${task.description||''}`;
  return /wollen|möchten|dialog|reaktion|redemittel|antwort/i.test(label)&&task.items.some(item=>(item.kind||task.kind)==='choice')
 });
 if(practiceTask&&!practiceTask.items.some(item=>isPhrase(item?.answer))){
  appendItem(practiceTask,{kind:'choice',context:'Mara: Kommst du morgen zum Konzert?\nTim: Ja, ich komme ___.',prompt:'Welche Redewendung passt?',answer:'auf jeden Fall',options:['auf jeden Fall','vielleicht','leider','gar nicht'],hint:'Tim ist ganz sicher.'});
 }
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(()=>{
 const theme=window.L7_THEME;if(!theme||!Array.isArray(theme.tasks))return theme;
 addPhraseToTheme(theme);
 if(!theme.tasks.some(task=>task.id==='hoeren-erkennen')){
  const entry={id:'hoeren-erkennen',title:'Hören und Erkennen',icon:'🔉',description:'Höre Geräusche und erkenne die Aktivitäten.',external:'hoeren-erkennen.html?v=l7t1-sound1',items};
  const examIndex=theme.tasks.findIndex(task=>task.exam);
  if(examIndex>=0)theme.tasks.splice(examIndex,0,entry);else theme.tasks.push(entry)
 }
 return theme
});
})();
