(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;
const task=(data.tasks||[]).find(item=>item.id==='dialog-abc');
if(!task)return;
const audio=name=>`https://sprachpilot.b-cdn.net/audio/l6t4-aufgabe13-dialog-${name}.mp3`;
const Q=(prompt,answer,options)=>({prompt,answer,options});
task.title='Dialoge';
task.description='Höre den Dialog und beantworte alle drei Fragen.';
task.instruction='Höre den Dialog und beantworte alle drei Fragen.';
task.kind='audio-dialog-pages';
task.items=[
 {
  id:'dialog-01',kind:'audio-dialog-group',dialogNumber:1,audioFile:audio('01'),
  questions:[
   Q('Was macht Omar am Vormittag?','Er arbeitet.',['Er fährt Fahrrad.','Er arbeitet.','Er spielt Backgammon.']),
   Q('Wo treffen sich Lea und Omar?','Am Bahnhof.',['Am See.','Am Bahnhof.','Vor Omars Arbeit.']),
   Q('Was machen sie bei Regen?','Sie gehen in ein Café und spielen.',['Sie fahren mit dem Fahrrad.','Sie gehen nach Hause.','Sie gehen in ein Café und spielen.'])
  ]
 },
 {
  id:'dialog-02',kind:'audio-dialog-group',dialogNumber:2,audioFile:audio('02'),
  questions:[
   Q('Warum sehen Mara und Tom nicht den Krimi?','Tom kann nicht pünktlich da sein.',['Mara mag keine Krimis.','Tom kann nicht pünktlich da sein.','Der Krimi beginnt erst um 21 Uhr.']),
   Q('Wer kauft die Kinokarten?','Mara.',['Mara.','Tom.','Paul.']),
   Q('Was machen Mara und Tom nach dem Film?','Sie besuchen ein Konzert.',['Sie gehen direkt nach Hause.','Sie fahren Fahrrad.','Sie besuchen ein Konzert.'])
  ]
 },
 {
  id:'dialog-03',kind:'audio-dialog-group',dialogNumber:3,audioFile:audio('03'),
  questions:[
   Q('Was macht Jonas vor dem Grillen?','Er geht schwimmen.',['Er geht schwimmen.','Er arbeitet.','Er trifft Mara im Café.']),
   Q('Was soll Jonas mitbringen?','Brot und Wasser.',['Fleisch und Kartoffeln.','Brot und Wasser.','Einen Salat und Kaffee.']),
   Q('Warum hat Nina auch viel Gemüse gekauft?','Ahmed isst kein Fleisch.',['Jonas mag kein Brot.','Mara möchte nur Salat.','Ahmed isst kein Fleisch.'])
  ]
 },
 {
  id:'dialog-04',kind:'audio-dialog-group',dialogNumber:4,audioFile:audio('04'),
  questions:[
   Q('Warum sucht Sofia ein neues Hobby?','Sie findet ihre Freizeit im Internet langweilig.',['Sie möchte weniger arbeiten.','Sie findet ihre Freizeit im Internet langweilig.','Sie möchte einen neuen Beruf finden.']),
   Q('Wann treffen sich Sofia und Paul?','Um 17:45 Uhr.',['Um 17:45 Uhr.','Um 17 Uhr.','Um 18:20 Uhr.']),
   Q('Was ist für Sofia beim ersten Besuch wichtig?','Sie hat Spaß.',['Sie kann schon gut tanzen.','Sie bringt 30 Euro.','Sie hat Spaß.'])
  ]
 },
 {
  id:'dialog-05',kind:'audio-dialog-group',dialogNumber:5,audioFile:audio('05'),
  questions:[
   Q('Wo haben Anna und Daniel zuletzt mit dem Würfel gespielt?','Im Café.',['Im Park.','Im Café.','Bei Daniel zu Hause.']),
   Q('Wo hat der Kellner den Würfel gefunden?','Unter einem Stuhl.',['Unter einem Stuhl.','In Annas Tasche.','Neben der Kasse.']),
   Q('Was machen Anna und Daniel danach?','Sie gehen zu Daniel und spielen weiter.',['Sie gehen wieder in den Park.','Sie fahren mit dem Fahrrad.','Sie gehen zu Daniel und spielen weiter.'])
  ]
 }
];
const meta=window.L6T4_USER_META?.find(item=>item.id==='dialog-abc');
if(meta){meta.title='Dialoge';meta.description='Höre einen Dialog und beantworte drei Fragen.'}
function migrate(storage,key){
 try{
  const old=JSON.parse(storage.getItem(key)||'null');
  const total=task.items.length;
  if(old&&Number(old.total)===15){
   const oldDone=Array.isArray(old.done)?old.done.map(Number):[];
   const done=[0,1,2,3,4].filter(page=>[page*3,page*3+1,page*3+2].every(index=>oldDone.includes(index)));
   const remaining=[0,1,2,3,4].filter(index=>!done.includes(index));
   storage.setItem(key,JSON.stringify({total,done,queue:remaining,current:null,tries:0,hadWrong:false,firstCorrect:done.length,firstSeen:[...done]}));
   return;
  }
  if(old&&Number(old.total)===total){
   const done=[...new Set((old.done||[]).map(Number).filter(index=>index>=0&&index<total))];
   const current=Number.isInteger(Number(old.current))&&!done.includes(Number(old.current))?Number(old.current):null;
   const queue=[0,1,2,3,4].filter(index=>!done.includes(index)&&index!==current);
   storage.setItem(key,JSON.stringify({...old,total,done,current,queue}));
   return;
  }
  storage.setItem(key,JSON.stringify({total,done:[],queue:[0,1,2,3,4],current:null,tries:0,hadWrong:false,firstCorrect:0,firstSeen:[]}));
 }catch(e){}
}
migrate(localStorage,'SP_L6_T4_V2_task-dialog-abc');
migrate(sessionStorage,'SP_L6_T4_PREVIEW_task-dialog-abc');
})();
