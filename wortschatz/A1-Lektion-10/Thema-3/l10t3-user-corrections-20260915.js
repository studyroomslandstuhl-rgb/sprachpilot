(function(){
'use strict';
if(window.__SP_L10T3_USER_CORRECTIONS_20260915)return;window.__SP_L10T3_USER_CORRECTIONS_20260915=true;
const D=window.L10T3;if(!D)return;
const byId=Object.fromEntries((D.tasks||[]).map(t=>[t.id,t]));
function task(id,title,icon,cardText,text,extra={}){const t=byId[id]||{id};Object.assign(t,{title,icon,cardText,text},extra);return t}
const order=[
 task('karteikarten','Karteikarten','🃏','Lerne die Wörter.','Sprich oder schreibe das deutsche Wort.'),
 task('wort-bedeutung','Wort – Bedeutung','💡','Wähle die richtige Bedeutung.','Wähle die richtige Bedeutung.'),
 task('hoeren-bild','Hören – Bild','🎧','Höre das Wort. Wähle das Bild.','Höre. Wähle das richtige Bild.'),
 task('artikel-plural','Artikel und Plural','🔤','Wähle den Artikel. Schreibe den Plural.','Ergänze Artikel und Plural.'),
 task('sollen-tabelle','sollen – Tabelle','📋','Ergänze die Formen von sollen.','Ergänze die Tabelle.'),
 task('sollen-saetze','sollen – Sätze','✍️','Schreibe die richtige Form von sollen.','Schreibe die richtige Form von sollen.'),
 task('sollen-verb','sollen + Verb','🧩','Ergänze sollen und den Infinitiv.','Ergänze die Form von sollen und das Verb.'),
 task('sollen-satz-bauen','Sätze mit sollen bauen','🧱','Bringe die Wörter in die richtige Reihenfolge.','Lies die Wortbausteine. Sprich oder schreibe den vollständigen Satz.'),
 task('modalverb-waehlen','Welches Modalverb?','💡','Wähle das passende Modalverb.','Wähle die richtige Modalverbform.'),
 task('arzt-empfehlungen','Empfehlungen vom Arzt','🩺','Schreibe 15 Empfehlungen mit sollen.','Schreibe den Satz mit sollen.',{example:'Der Arzt sagt: viel trinken. → Der Arzt sagt: Ich soll viel trinken.'}),
 task('imperativ-sollen','Imperativ ↔ sollen','🔁','Formuliere Imperativ und sollen um.','Formuliere den Satz um.'),
 task('gesundheitstipps','Gesundheitstipps','💚','Formuliere 10 Fragen und passende Gesundheitstipps.','Sprich oder schreibe zuerst die Frage und dann den Gesundheitstipp.',{example:'Freund · Kopfschmerzen → Mein Freund hat Kopfschmerzen. Was kann man da tun? · Schmerztabletten nehmen → Er soll Schmerztabletten nehmen.'}),
 task('brief-beschriften','Briefteile beschriften','✉️','Wähle den richtigen Briefteil und schreibe den Artikel.','Wähle die Bezeichnung. Schreibe den richtigen Artikel.'),
 task('briefteile','Krankmeldung – Briefteile','📝','Wähle A, B oder C.','Wähle die richtige Antwort.'),
 task('brief-fragen-artikel','Briefteile – Schreiben','❓','Beantworte die Fragen zu den Briefteilen.','Schreibe die Antwort mit Artikel.'),
 task('krankmeldung-attest-lesen','Atteste lesen','📄','Lies die Atteste und beantworte die Fragen.','Lies das Attest. Beantworte die Fragen.'),
 task('krankmeldung-schreiben','Krankmeldung schreiben','📝','Schreibe eine vollständige Krankmeldung an deine Chefin.','Schreibe die Krankmeldung. Alle wichtigen Punkte werden kontrolliert.'),
 task('pruefung','Prüfung','⭐','Prüfe das ganze Thema.','Löse die Prüfung.',{exam:true})
];
D.tasks=order.filter(t=>t&&t.id);
D.doctorWritingItems=[
 ['viel trinken','Der Arzt sagt: Ich soll viel trinken.'],['im Bett bleiben','Der Arzt sagt: Ich soll im Bett bleiben.'],['die Tabletten nehmen','Der Arzt sagt: Ich soll die Tabletten nehmen.'],['die Salbe verwenden','Der Arzt sagt: Ich soll die Salbe verwenden.'],['mich ausruhen','Der Arzt sagt: Ich soll mich ausruhen.'],['die Haut kühlen','Der Arzt sagt: Ich soll die Haut kühlen.'],['viel Tee trinken','Der Arzt sagt: Ich soll viel Tee trinken.'],['zu Hause bleiben','Der Arzt sagt: Ich soll zu Hause bleiben.'],['zum Arzt gehen','Der Arzt sagt: Ich soll zum Arzt gehen.'],['nicht arbeiten','Der Arzt sagt: Ich soll nicht arbeiten.'],['nichts Schweres tragen','Der Arzt sagt: Ich soll nichts Schweres tragen.'],['morgen wiederkommen','Der Arzt sagt: Ich soll morgen wiederkommen.'],['den Hals warm halten','Der Arzt sagt: Ich soll den Hals warm halten.'],['keinen Sport machen','Der Arzt sagt: Ich soll keinen Sport machen.'],['die Medizin nach dem Essen nehmen','Der Arzt sagt: Ich soll die Medizin nach dem Essen nehmen.']
].map((x,i)=>({id:'arztw'+(i+1),prompt:'Der Arzt sagt: '+x[0]+'.',answer:x[1]}));
D.healthTipItems=[
 {id:'ht1',person:'Freund',problem:'Kopfschmerzen',question:'Mein Freund hat Kopfschmerzen. Was kann man da tun?',tip:'Schmerztabletten nehmen',answer:'Er soll Schmerztabletten nehmen.'},
 {id:'ht2',person:'Freundin',problem:'Halsschmerzen',question:'Meine Freundin hat Halsschmerzen. Was kann man da tun?',tip:'viel Tee trinken',answer:'Sie soll viel Tee trinken.'},
 {id:'ht3',person:'Vater',problem:'Rückenschmerzen',question:'Mein Vater hat Rückenschmerzen. Was kann man da tun?',tip:'ein paar Schritte gehen',answer:'Er soll ein paar Schritte gehen.'},
 {id:'ht4',person:'Mutter',problem:'Fieber',question:'Meine Mutter hat Fieber. Was kann man da tun?',tip:'im Bett bleiben',answer:'Sie soll im Bett bleiben.'},
 {id:'ht5',person:'Bruder',problem:'Husten',question:'Mein Bruder hat Husten. Was kann man da tun?',tip:'viel trinken',answer:'Er soll viel trinken.'},
 {id:'ht6',person:'Schwester',problem:'Schnupfen',question:'Meine Schwester hat Schnupfen. Was kann man da tun?',tip:'viel Tee trinken',answer:'Sie soll viel Tee trinken.'},
 {id:'ht7',person:'Kollege',problem:'Bauchschmerzen',question:'Mein Kollege hat Bauchschmerzen. Was kann man da tun?',tip:'zum Arzt gehen',answer:'Er soll zum Arzt gehen.'},
 {id:'ht8',person:'Kollegin',problem:'Zahnschmerzen',question:'Meine Kollegin hat Zahnschmerzen. Was kann man da tun?',tip:'zum Zahnarzt gehen',answer:'Sie soll zum Zahnarzt gehen.'},
 {id:'ht9',person:'Bekannter',problem:'Erkältung',question:'Mein Bekannter ist erkältet. Was kann man da tun?',tip:'zu Hause bleiben',answer:'Er soll zu Hause bleiben.'},
 {id:'ht10',person:'Bekannte',problem:'starke Schmerzen',question:'Meine Bekannte hat starke Schmerzen. Was kann man da tun?',tip:'den Hausarzt anrufen',answer:'Sie soll den Hausarzt anrufen.'}
];
D.sickNotes=[{id:'kn1',label:'Nach dem Arztbesuch',prompt:'Sie waren beim Arzt und können drei Tage nicht arbeiten. Schreiben Sie Ihrer Chefin. Informieren Sie über die Dauer und das Attest.'}];
try{
 const id=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
 let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){}
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();
 const teacher=['teacher','lehrer','admin','owner','superadmin'].includes(role)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
 if(id==='pruefung'&&teacher)setTimeout(()=>import('/js/sp-l10-teacher-exam-preview.js?v=20260915-1'),250);
}catch(e){}
})();