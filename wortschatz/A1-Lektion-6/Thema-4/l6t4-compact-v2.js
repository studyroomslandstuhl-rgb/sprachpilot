(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data||data.__compactRevisionV2)return;
data.__compactRevisionV2=true;
const task=id=>(data.tasks||[]).find(item=>item.id===id);
const copy=value=>value&&typeof value==='object'?{...value}:value;

const rf=task('dialog-rf');
const abc=task('dialog-abc');
const pairIndexes=[0,3,6,9,12];
const dialogItems=pairIndexes.map((index,screen)=>{
 const trueFalse=rf?.items?.[index]||rf?.items?.[screen]||{};
 const multiple=abc?.items?.[index]||abc?.items?.[screen]||{};
 return{
  kind:'dialog-combo',
  dialog:trueFalse.dialog||multiple.dialog||[],
  trueFalsePrompt:trueFalse.prompt||'Welche Aussage passt?',
  trueFalseAnswer:trueFalse.answer||'Richtig',
  trueFalseOptions:['Richtig','Falsch'],
  abcPrompt:multiple.prompt||'Welche Antwort passt?',
  abcAnswer:multiple.answer||'',
  abcOptions:[...(multiple.options||[])],
  prompt:`Dialog ${screen+1}`,
  hint:'Lies den ganzen Dialog und beantworte beide Fragen.'
 };
});
const dialogsTask={
 id:'dialogs',title:'Dialoge',icon:'💬',
 description:'Lies den Dialog und beantworte beide Fragen.',
 instruction:'Lies den Dialog. Antworte zuerst richtig oder falsch und dann A, B oder C.',
 kind:'dialog-combo',items:dialogItems
};

const phrases=task('phrases');
const gaps=task('gaps');
const phraseIndexes=[0,2,6,10,13];
const gapIndexes=[0,1,4,8,11];
const combinedReactions=[];
for(let i=0;i<5;i++){
 const phrase=phrases?.items?.[phraseIndexes[i]];
 const gap=gaps?.items?.[gapIndexes[i]];
 if(phrase)combinedReactions.push({...copy(phrase),prompt:''});
 if(gap)combinedReactions.push({...copy(gap),prompt:''});
}
if(gaps){
 Object.assign(gaps,{
  title:'Dialoge ergänzen',icon:'▤',
  description:'Lies den Dialog und wähle die passende Reaktion.',
  instruction:'Lies den Dialog und wähle die passende Reaktion.',
  items:combinedReactions.slice(0,10)
 });
}

const trimToTen=['image-word','word-image','listen-image','noun-verb','nehmen','yes-no-doch','doch-answer','listen-abc','finden','questions','singular-plural'];
trimToTen.forEach(id=>{const current=task(id);if(current?.items?.length>10)current.items=current.items.slice(0,10)});

const removeIds=new Set(['sound-activity','phrase-reaction','dialog-rf','dialog-abc','phrases']);
data.tasks=(data.tasks||[]).filter(item=>!removeIds.has(item.id));
if(!data.tasks.some(item=>item.id==='dialogs'))data.tasks.push(dialogsTask);

let exam=task('exam');
if(!exam){exam={id:'exam',title:'Prüfung',icon:'⭐',description:'Zeige, was du gelernt hast.',exam:true,items:[]};data.tasks.push(exam)}
Object.assign(exam,{title:'Prüfung',icon:'⭐',description:'Zeige, was du gelernt hast.',exam:true,external:'pruefung.html',items:Array.from({length:15},(_,index)=>({prompt:`Prüfungsaufgabe ${index+1}`}))});

const desiredOrder=['cards','image-word','word-image','listen-image','article','plural','noun-verb','nehmen','yes-no-doch','doch-answer','dialogs','gaps','listen-abc','finden','questions','singular-plural','exam'];
data.tasks.sort((a,b)=>desiredOrder.indexOf(a.id)-desiredOrder.indexOf(b.id));

window.L6T4_USER_META=[
 ['cards','1','Karteikarten','🃏','Lerne die Wörter.'],
 ['image-word','2','Bedeutung → Wort','💡','Finde das Wort.'],
 ['word-image','3','Bild → Wort','🖼️','Finde das Wort.'],
 ['listen-image','4','Hören → Bild','🎧','Höre das Wort und finde das Bild.'],
 ['article','5','Artikel','der','Wähle den passenden Artikel.'],
 ['plural','6','Plural','🎤','Bilde die Pluralform mit Artikel.','plural-sprechen.html'],
 ['noun-verb','7','Nomen-Verb-Verbindungen','↔️','Finde das passende Verb.'],
 ['nehmen','8','Verb „nehmen“','☕','Finde die richtige Form von „nehmen“.'],
 ['yes-no-doch','9','Ja, Nein oder Doch','↩️','Wähle die passende Antwort.'],
 ['doch-answer','10','Doch','DOCH','Widersprich der Aussage.'],
 ['dialogs','11','Dialoge','💬','Lies den Dialog und beantworte beide Fragen.'],
 ['gaps','12','Dialoge ergänzen','▤','Wähle die passende Reaktion.'],
 ['listen-abc','13','Hören und Verstehen','🎧','Höre den Dialog und entscheide A, B oder C.'],
 ['finden','14','Bedeutungen von „finden“','🔍','Unterscheide Meinung und Aktivität.'],
 ['questions','15','Hobbys und Lieblingssachen','❓','Finde die passende Antwort.'],
 ['singular-plural','16','Hobby','1↔2','Wähle die richtige Frage oder Antwort.'],
 ['exam','17','Prüfung','⭐','Zeige, was du gelernt hast.','pruefung.html']
].map(([id,number,title,icon,description,external])=>({id,number,title,icon,description,external}));
})();
