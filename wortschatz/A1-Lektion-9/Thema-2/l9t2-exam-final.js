(function(){
'use strict';
const D=window.L9T2;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const img=id=>`${CDN}${id}.webp`;
const aud=id=>`${AUDIO}${id}.mp3`;
const EXAM_VERSION='20260906-l9t2-exam15-v1';

function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function resetOldExamState(){const id=pid(),store=preview()?sessionStorage:localStorage,stateKey=`SP_L9_${id}_T2_pruefung`,marker=`SP_L9_${id}_T2_EXAM_VERSION`;try{if(store.getItem(marker)!==EXAM_VERSION){store.removeItem(stateKey);store.setItem(marker,EXAM_VERSION)}}catch(e){}}
resetOldExamState();

D.exam=[
 {id:'exam01',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('gebuehr'),answer:'die Gebühr',hint:'Gesucht ist das Geld, das man für eine Leistung bezahlt.'},
 {id:'exam02',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('anmeldung'),answer:'die Anmeldung',hint:'Hier meldet man sich offiziell an.'},
 {id:'exam03',kind:'image-input',prompt:'Schreibe das Wort mit Artikel.',image:img('wartebereich'),answer:'der Wartebereich',hint:'Hier sitzen Menschen und warten.'},

 {id:'exam04',kind:'audio-image',prompt:'Hör zu. Welches Bild passt?',audio:aud('aufstehen'),spoken:'aufstehen',answer:'aufstehen',options:[
  {id:'aufstehen',image:img('aufstehen')},{id:'warten',image:img('warten')},{id:'lachen',image:img('lachen')},{id:'zuhoeren',image:img('zuhoeren')}
 ],hint:'Die Person sitzt zuerst und kommt dann auf die Füße.'},
 {id:'exam05',kind:'audio-image',prompt:'Hör zu. Welches Bild passt?',audio:aud('autovermietung'),spoken:'die Autovermietung',answer:'autovermietung',options:[
  {id:'sprachschule',image:img('sprachschule')},{id:'autovermietung',image:img('autovermietung')},{id:'kasse',image:img('kasse')},{id:'wartebereich',image:img('wartebereich')}
 ],hint:'Dort kann man ein Auto mieten.'},
 {id:'exam06',kind:'audio-image',prompt:'Hör zu. Welches Bild passt?',audio:aud('zuhoeren'),spoken:'zuhören',answer:'zuhoeren',options:[
  {id:'lachen',image:img('lachen')},{id:'ausmachen',image:img('ausmachen')},{id:'zuhoeren',image:img('zuhoeren')},{id:'hingehen',image:img('hingehen')}
 ],hint:'Man hört einer Person aufmerksam zu.'},

 {id:'exam07',kind:'input',prompt:'Schreibe den Plural mit Artikel: die Gebühr → ___',answer:'die Gebühren',hint:'Achte auf die Endung -en.'},
 {id:'exam08',kind:'input',prompt:'Schreibe den Plural mit Artikel: die Sprachschule → ___',answer:'die Sprachschulen',hint:'Achte auf die Endung -n.'},
 {id:'exam09',kind:'input',prompt:'Schreibe den Plural mit Artikel: der Stock → ___',answer:'die Stockwerke',hint:'Der Plural ist unregelmäßig.'},

 {id:'exam10',kind:'input',prompt:'Bilde den Imperativ mit du: zuhören',answer:'Hör zu!',answers:['Hör zu'],hint:'Bei du fällt das Pronomen weg. Das Verb ist trennbar.'},
 {id:'exam11',kind:'input',prompt:'Bilde den Imperativ mit ihr: aufstehen',answer:'Steht auf!',answers:['Steht auf'],hint:'Bei ihr benutzt du die ihr-Form ohne Pronomen.'},
 {id:'exam12',kind:'input',prompt:'Bilde den Imperativ mit Sie: warten',answer:'Warten Sie!',answers:['Warten Sie'],hint:'Bei Sie bleibt das Pronomen stehen.'},
 {id:'exam13',kind:'input',prompt:'Bilde den Imperativ mit du: das Handy ausmachen',answer:'Mach das Handy aus!',answers:['Mach das Handy aus'],hint:'Das trennbare Präfix steht am Satzende.'},

 {id:'exam14',kind:'choice',prompt:'Du sprichst höflich mit einer Mitarbeiterin: „Erklären Sie das ___ noch einmal.“',options:['doch','mal','bitte'],answer:'bitte',hint:'Gesucht ist eine höfliche Bitte.'},
 {id:'exam15',kind:'input',prompt:'Du sprichst locker mit einem Freund. Er hört nicht zu. Benutze zuhören + mal.',answer:'Hör mal zu!',answers:['Hör mal zu'],hint:'Bilde den du-Imperativ und setze mal in den Satz.'}
];

const examTask=(D.tasks||[]).find(t=>t.id==='pruefung'||t.kind==='exam');
if(examTask)Object.assign(examTask,{id:'pruefung',kind:'exam',exam:true,title:'Prüfung',description:'Teste dein Wissen.',instruction:'Teste dein Wissen.',icon:'⭐'});

const oldItemIds=D.itemIds;
D.itemIds=function(taskId){if(taskId==='pruefung')return D.exam.map(x=>x.id);return typeof oldItemIds==='function'?oldItemIds(taskId):[]};
})();
