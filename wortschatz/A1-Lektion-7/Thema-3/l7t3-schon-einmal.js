(function(){
'use strict';
if(window.__SP_L7T3_SCHON_EINMAL_V3)return;window.__SP_L7T3_SCHON_EINMAL_V3=true;
const items=[
 {verb:'backen',extra:'der Schokoladenkuchen',image:'backen.webp',positive:false,question:'Hast du schon einmal einen Schokoladenkuchen gebacken?',answer:'Nein, ich habe noch nie einen Schokoladenkuchen gebacken.'},
 {verb:'fliegen',extra:'nach Spanien',image:'fliegen.webp',positive:true,question:'Bist du schon einmal nach Spanien geflogen?',answer:'Ja, ich bin schon einmal nach Spanien geflogen.'},
 {verb:'schwimmen',extra:'im Meer',image:'schwimmen.webp',positive:false,question:'Bist du schon einmal im Meer geschwommen?',answer:'Nein, ich bin noch nie im Meer geschwommen.'},
 {verb:'fahren',extra:'mit dem Zug nach Berlin',image:'fahren.webp',positive:true,question:'Bist du schon einmal mit dem Zug nach Berlin gefahren?',answer:'Ja, ich bin schon einmal mit dem Zug nach Berlin gefahren.'},
 {verb:'wandern',extra:'in den Bergen',image:'wandern.webp',positive:true,question:'Bist du schon einmal in den Bergen gewandert?',answer:'Ja, ich bin schon einmal in den Bergen gewandert.'},
 {verb:'spazieren gehen',extra:'im Wald',image:'spazierengehen.webp',positive:false,question:'Bist du schon einmal im Wald spazieren gegangen?',answer:'Nein, ich bin noch nie im Wald spazieren gegangen.'},
 {verb:'tanzen',extra:'Salsa',image:'tanzen.webp',positive:true,question:'Hast du schon einmal Salsa getanzt?',answer:'Ja, ich habe schon einmal Salsa getanzt.'},
 {verb:'gehen',extra:'ins Theater',image:'gehen.webp',positive:false,question:'Bist du schon einmal ins Theater gegangen?',answer:'Nein, ich bin noch nie ins Theater gegangen.'},
 {verb:'kommen',extra:'zu spät zur Arbeit',image:'kommen.webp',positive:true,question:'Bist du schon einmal zu spät zur Arbeit gekommen?',answer:'Ja, ich bin schon einmal zu spät zur Arbeit gekommen.'},
 {verb:'bleiben',extra:'drei Tage in Berlin',image:'bleiben.webp',positive:false,question:'Bist du schon einmal drei Tage in Berlin geblieben?',answer:'Nein, ich bin noch nie drei Tage in Berlin geblieben.'},
 {verb:'backen',extra:'eine Pizza',image:'backen.webp',positive:true,question:'Hast du schon einmal eine Pizza gebacken?',answer:'Ja, ich habe schon einmal eine Pizza gebacken.'},
 {verb:'fliegen',extra:'allein',image:'fliegen.webp',positive:false,question:'Bist du schon einmal allein geflogen?',answer:'Nein, ich bin noch nie allein geflogen.'}
].map(x=>({...x,hint:'Achte auf haben/sein, „schon einmal“ und das Partizip II.'}));
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let task=theme.tasks.find(t=>t?.id==='t3-schon-einmal-v1');
 if(!task){
  task={id:'t3-schon-einmal-v1',title:'Hast du das schon einmal gemacht?',description:'Bilde die Fragen und antworte.',icon:'💬',kind:'schon-einmal',items};
  const examIndex=theme.tasks.findIndex(t=>t?.exam||/pr[uü]fung|exam/i.test(String(t?.id||'')+' '+String(t?.title||'')));
  if(examIndex>=0)theme.tasks.splice(examIndex,0,task);else theme.tasks.push(task);
 }else{
  task.description='Bilde die Fragen und antworte.';
 }
 const exam=theme.tasks.find(t=>t?.exam);
 if(exam&&Array.isArray(exam.items)&&!exam.items.some(x=>x?.sourceTask==='schon-einmal')){
  exam.items.push(
   {kind:'input',sourceTask:'schon-einmal',context:'backen · der Schokoladenkuchen',prompt:'Bilde die Frage mit „schon einmal“.',answer:'Hast du schon einmal einen Schokoladenkuchen gebacken?',answers:['Hast du schon einmal einen Schokoladenkuchen gebacken?'],hint:'Achte auf haben und das Partizip II.'},
   {kind:'input',sourceTask:'schon-einmal',context:'🙁 · backen · der Schokoladenkuchen',prompt:'Antworte negativ mit „noch nie“.',answer:'Nein, ich habe noch nie einen Schokoladenkuchen gebacken.',answers:['Nein, ich habe noch nie einen Schokoladenkuchen gebacken.'],hint:'Beginne mit „Nein, ich habe noch nie …“.'}
  );
 }
 theme.contentRevision='l7t3-schon-einmal-20260822-v3';window.L7_THEME=theme;return theme;
});
window.L7T3_SCHON_EINMAL_ITEMS=items;
})();
