(function(){
'use strict';
const D=window.L9T3;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const img=id=>`${CDN}${id}.webp`;
const EXAM_VERSION='20260914-l9t3-exam18-v2';

function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function resetOldExamState(){const id=pid(),store=preview()?sessionStorage:localStorage,stateKey=`SP_L9_${id}_T3_pruefung`,marker=`SP_L9_${id}_T3_EXAM_VERSION`;try{if(store.getItem(marker)!==EXAM_VERSION){store.removeItem(stateKey);store.setItem(marker,EXAM_VERSION)}}catch(e){}}
resetOldExamState();

D.exam=[
 {id:'exam01',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('zigarette'),answer:'die Zigarette',hint:'Das Bild zeigt etwas, das man raucht.'},
 {id:'exam02',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('parkplatz'),answer:'der Parkplatz',hint:'Hier kann ein Auto stehen.'},
 {id:'exam03',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('gepaeck'),answer:'das Gepäck',hint:'Koffer und Taschen auf einer Reise.'},

 {id:'exam04',kind:'choice',prompt:'Was bedeutet „erlaubt“?',options:['Man darf etwas machen.','Man muss etwas machen.','Man kann etwas nicht machen.','Man will etwas machen.'],answer:'Man darf etwas machen.',hint:'Erlaubt bedeutet: Es ist nicht verboten.'},
 {id:'exam05',kind:'choice',prompt:'Was bedeutet „verboten“?',options:['Man darf etwas nicht machen.','Man muss etwas machen.','Man möchte etwas machen.','Man kann etwas machen.'],answer:'Man darf etwas nicht machen.',hint:'Verboten bedeutet: Es ist nicht erlaubt.'},

 {id:'exam06',kind:'input',prompt:'Schreibe den Plural mit Artikel: der Parkplatz → ___',answer:'die Parkplätze',hint:'Achte auf den Umlaut und die Endung -e.'},
 {id:'exam07',kind:'input',prompt:'Schreibe den Plural mit Artikel: der Laptop → ___',answer:'die Laptops',hint:'Der Plural endet auf -s.'},
 {id:'exam08',kind:'input',prompt:'Schreibe den Plural mit Artikel: die Regel → ___',answer:'die Regeln',hint:'Der Plural endet auf -n.'},

 {id:'exam09',kind:'input',prompt:'Konjugiere dürfen: ich ___',answer:'darf',hint:'Die Form für ich ist unregelmäßig.'},
 {id:'exam10',kind:'input',prompt:'Konjugiere dürfen: du ___',answer:'darfst',hint:'Bei du kommt -st dazu.'},
 {id:'exam11',kind:'input',prompt:'Konjugiere dürfen: ihr ___',answer:'dürft',hint:'Bei ihr lautet die Form dürft.'},
 {id:'exam12',kind:'input',prompt:'Konjugiere dürfen: wir ___',answer:'dürfen',hint:'Bei wir steht der Infinitiv.'},

 {id:'exam15',kind:'input',prompt:'Bilde einen Satz: wir / das Gepäck / dürfen / mitnehmen',answer:'Wir dürfen das Gepäck mitnehmen.',answers:['Wir dürfen das Gepäck mitnehmen'],hint:'Das Modalverb steht auf Position 2, der Infinitiv am Ende.'},

 {id:'exam16',kind:'choice',prompt:'Ich habe morgen einen Termin. Ich ___ meinen Ausweis mitbringen.',options:['muss','darf','will','kann','möchte'],answer:'muss',hint:'Der Termin macht das Mitbringen notwendig.'},
 {id:'exam17',kind:'choice',prompt:'Anna hat einen Plan. Sie ___ morgen ein Auto mieten.',options:['muss','darf','will','kann','mag'],answer:'will',hint:'Es geht um einen Plan.'},
 {id:'exam18',kind:'choice',prompt:'Im Café: „Ich ___ bitte einen Kaffee.“',options:['muss','darf','will','kann','möchte'],answer:'möchte',hint:'Es ist ein höflicher Wunsch.'},
 {id:'exam19',kind:'choice',prompt:'Der Automat funktioniert. Man ___ hier ein Ticket kaufen.',options:['muss','darf','will','kann','mag'],answer:'kann',hint:'Es geht um eine Möglichkeit.'},

 {id:'exam20',kind:'choice',prompt:'In der Bibliothek ist Rauchen verboten. Darf man dort rauchen?',options:['Ja','Nein'],answer:'Nein',hint:'Rauchen ist ausdrücklich verboten.'}
];

const examTask=(D.tasks||[]).find(t=>t.id==='pruefung'||t.kind==='exam');
if(examTask)Object.assign(examTask,{id:'pruefung',kind:'exam',exam:true,title:'Prüfung',description:'Teste dein Wissen.',instruction:'Teste dein Wissen.',icon:'⭐'});

const oldItemIds=D.itemIds;
D.itemIds=function(taskId){
 if(taskId==='pruefung')return D.exam.map(x=>x.id);
 return typeof oldItemIds==='function'?oldItemIds(taskId):[];
};
})();