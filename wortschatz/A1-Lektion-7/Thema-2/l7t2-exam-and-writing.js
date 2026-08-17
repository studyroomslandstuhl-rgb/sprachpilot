(function(){
'use strict';
if(window.__SP_L7T2_EXAM_WRITING_V2)return;
window.__SP_L7T2_EXAM_WRITING_V2=true;

function byId(theme,id){return theme?.tasks?.find(task=>task?.id===id)}
function unique(values){return[...new Set(values.filter(Boolean))]}

const WRITE_VARIANTS=[
 ['Lina hat am Dienstag Deutsch gelernt.','Am Dienstag hat Lina Deutsch gelernt.','Deutsch hat Lina am Dienstag gelernt.'],
 ['Ich habe gestern Hausaufgaben gemacht.','Gestern habe ich Hausaufgaben gemacht.','Hausaufgaben habe ich gestern gemacht.'],
 ['Samir hat am Vormittag einen Brief geschrieben.','Am Vormittag hat Samir einen Brief geschrieben.','Einen Brief hat Samir am Vormittag geschrieben.'],
 ['Wir haben am Abend Musik gehört.','Am Abend haben wir Musik gehört.','Musik haben wir am Abend gehört.'],
 ['Mia und Tom haben am Samstag Tennis gespielt und danach gegrillt.','Am Samstag haben Mia und Tom Tennis gespielt und danach gegrillt.','Tennis haben Mia und Tom am Samstag gespielt und danach gegrillt.'],
 ['Du hast gestern einen Film gesehen.','Gestern hast du einen Film gesehen.','Einen Film hast du gestern gesehen.'],
 ['Nina hat am Abend ein Buch gelesen.','Am Abend hat Nina ein Buch gelesen.','Ein Buch hat Nina am Abend gelesen.'],
 ['Mein Vater hat am Morgen Brot gekauft.','Am Morgen hat mein Vater Brot gekauft.','Brot hat mein Vater am Morgen gekauft.'],
 ['Wir haben in der Pause Deutsch gesprochen.','In der Pause haben wir Deutsch gesprochen.','Deutsch haben wir in der Pause gesprochen.'],
 ['Lea hat am Montag lange gearbeitet.','Am Montag hat Lea lange gearbeitet.','Lange hat Lea am Montag gearbeitet.'],
 ['Ich habe am Nachmittag meine Freundin getroffen und meinen Schlüssel gesucht.','Am Nachmittag habe ich meine Freundin getroffen und meinen Schlüssel gesucht.'],
 ['Das Kind hat am Sonntag lange geschlafen.','Am Sonntag hat das Kind lange geschlafen.','Lange hat das Kind am Sonntag geschlafen.'],
 ['Wir haben um neun Uhr gefrühstückt.','Um neun Uhr haben wir gefrühstückt.'],
 ['Maria hat am Abend Suppe gekocht und Brot gegessen.','Am Abend hat Maria Suppe gekocht und Brot gegessen.','Suppe hat Maria am Abend gekocht und Brot gegessen.'],
 ['Das Buch hat gestern zehn Euro gekostet.','Gestern hat das Buch zehn Euro gekostet.','Zehn Euro hat das Buch gestern gekostet.']
];

const EXAM_ITEMS=[
 {kind:'choice',prompt:'lernen',options:['gelernt','gelernen','lernt','gelernet'],answer:'gelernt'},
 {kind:'choice',prompt:'schreiben',options:['geschreibt','geschrieben','geschreiben','schreibt'],answer:'geschrieben'},
 {kind:'choice',prompt:'arbeiten',options:['gearbeiten','gearbeitet','arbeitet','gearbetit'],answer:'gearbeitet'},
 {kind:'choice',prompt:'lesen',options:['gelesen','gelest','geleset','liest'],answer:'gelesen'},
 {kind:'choice',prompt:'trinken',options:['getrinkt','getrunken','getrinken','trinkt'],answer:'getrunken'},

 {kind:'choice',prompt:'Welche Gruppe? gelernt',options:['-t','-en'],answer:'-t'},
 {kind:'choice',prompt:'Welche Gruppe? gesprochen',options:['-t','-en'],answer:'-en'},
 {kind:'choice',prompt:'Welche Gruppe? gearbeitet',options:['-t','-en'],answer:'-t'},

 {kind:'choice',context:'Ich ___ Deutsch gelernt.',prompt:'Welche Form von haben passt?',options:['habe','hast','hat','haben'],answer:'habe'},
 {kind:'choice',context:'Du ___ einen Film gesehen.',prompt:'Welche Form von haben passt?',options:['habe','hast','hat','habt'],answer:'hast'},
 {kind:'choice',context:'Anna ___ einen Brief geschrieben.',prompt:'Welche Form von haben passt?',options:['habe','hast','hat','haben'],answer:'hat'},
 {kind:'choice',context:'Wir ___ zusammen gefrühstückt.',prompt:'Welche Form von haben passt?',options:['hat','habt','haben','hast'],answer:'haben'},

 {kind:'choice',context:'Anna hat einen Brief geschrieben.',prompt:'Was ist das Hilfsverb?',options:['Anna','hat','einen Brief','geschrieben'],answer:'hat'},
 {kind:'choice',context:'Tim hat am Abend ein Buch gelesen.',prompt:'Was ist das Partizip II?',options:['Tim','hat','am Abend','gelesen'],answer:'gelesen'},
 {kind:'choice',context:'Maria hat eine Suppe gekocht.',prompt:'Was ist das Objekt?',options:['Maria','hat','eine Suppe','gekocht'],answer:'eine Suppe'},

 {kind:'choice',prompt:'Welcher Satz ist richtig?',options:['Gestern habe ich Hausaufgaben gemacht.','Gestern ich habe Hausaufgaben gemacht.','Gestern habe ich gemacht Hausaufgaben.'],answer:'Gestern habe ich Hausaufgaben gemacht.'},
 {kind:'choice',prompt:'Welcher Satz ist richtig?',options:['Am Abend hat Maria Suppe gekocht.','Am Abend Maria hat Suppe gekocht.','Am Abend hat gekocht Maria Suppe.'],answer:'Am Abend hat Maria Suppe gekocht.'},
 {kind:'choice',prompt:'Welcher Satz ist richtig?',options:['In der Pause haben wir Deutsch gesprochen.','In der Pause wir haben Deutsch gesprochen.','In der Pause haben gesprochen wir Deutsch.'],answer:'In der Pause haben wir Deutsch gesprochen.'},

 {kind:'choice',context:'Lea hat bis 16 Uhr gearbeitet. Danach hat sie Mina getroffen. Dann haben sie Kaffee getrunken.',prompt:'Was war nach der Arbeit?',options:['Mina treffen','Kaffee trinken','einen Film sehen'],answer:'Mina treffen'},
 {kind:'choice',context:'Nina hat gefrühstückt. Danach hat sie Sara getroffen. Am Nachmittag haben sie Musik gehört. Am Abend haben sie Pizza gebacken.',prompt:'Was war nach der Musik?',options:['Pizza backen','frühstücken','Sara treffen'],answer:'Pizza backen'},

 {kind:'choice',context:'A: Was hast du gestern gemacht?\nB: Ich habe meine Freunde ___.',prompt:'Was passt?',options:['getroffen','getrunken','gesehen','gekostet'],answer:'getroffen'},
 {kind:'choice',context:'A: Was habt ihr am Samstag gemacht?\nB: Wir haben im Garten ___.',prompt:'Was passt?',options:['gegrillt','geschrieben','gesprochen','geschlafen'],answer:'gegrillt'},

 {kind:'input',audio:'arbeiten.mp3',prompt:'Schreibe Partizip II.',answer:'gearbeitet'},
 {kind:'input',audio:'sprechen.mp3',prompt:'Schreibe Partizip II.',answer:'gesprochen'}
];

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const write=byId(theme,'saetze-schreiben');
 if(write?.items?.length){
  write.items.forEach((item,index)=>{
   const variants=WRITE_VARIANTS[index]||[item.answer];
   item.acceptedSentences=unique([item.answer,...variants]);
  });
 }
 const exam=(theme?.tasks||[]).find(task=>task?.exam);
 if(exam){
  exam.title='Prüfung';
  exam.description='Bearbeite die Prüfung.';
  exam.kind='';
  exam.items=EXAM_ITEMS;
  exam.exam=true;
  exam.spL7T2ExamRevision='20260817-v2';
 }
 theme.contentRevision='l7t2-standard-20260817-v15';
 window.L7_THEME=theme;
 return theme;
});
})();
