(function(){
'use strict';
if(window.__SP_L10T3_MODAL_EXTENSION_V1)return;window.__SP_L10T3_MODAL_EXTENSION_V1=true;
const D=window.L10T3;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
D.sollenSentences=[
{id:'s0',q:'Ich ___ heute zu Hause bleiben.',a:'soll'},
{id:'s1',q:'Du ___ viel Wasser trinken.',a:'sollst'},
{id:'s2',q:'Paul hat Fieber. Er ___ sich ausruhen.',a:'soll'},
{id:'s3',q:'Maria hat Halsschmerzen. Sie ___ viel Tee trinken.',a:'soll'},
{id:'s4',q:'Das Kind ist krank. Es ___ heute im Bett bleiben.',a:'soll'},
{id:'s5',q:'Wir ___ die Arztbescheinigung an die Firma schicken.',a:'sollen'},
{id:'s6',q:'Ihr ___ die Tabletten nach dem Essen nehmen.',a:'sollt'},
{id:'s7',q:'Tom und Mia sind krank. Sie ___ heute nicht arbeiten.',a:'sollen'},
{id:'s8',q:'Die Kinder haben Fieber. Sie ___ viel schlafen.',a:'sollen'},
{id:'s9',q:'Frau Klein, Sie ___ morgen wiederkommen.',a:'sollen'},
{id:'s10',q:'Herr Ali, Sie ___ nichts Schweres tragen.',a:'sollen'},
{id:'s11',q:'Anna und Sofia haben Sonnenbrand. Sie ___ die Haut kühlen.',a:'sollen'},
{id:'s12',q:'Mein Bruder hat Rückenschmerzen. Er ___ die Salbe verwenden.',a:'soll'},
{id:'s13',q:'Meine Eltern sind krank. Sie ___ beim Arzt anrufen.',a:'sollen'},
{id:'s14',q:'Du hast Kopfschmerzen. Du ___ dich heute ausruhen.',a:'sollst'},
{id:'s15',q:'Ich bin krankgeschrieben. Ich ___ das Attest per E-Mail schicken.',a:'soll'},
{id:'s16',q:'Wir haben hohes Fieber. Wir ___ zum Arzt gehen.',a:'sollen'},
{id:'s17',q:'Ihr seid noch krank. Ihr ___ heute keinen Sport machen.',a:'sollt'},
{id:'s18',q:'Frau Chen ist schwindelig. Sie ___ heute nicht Auto fahren.',a:'soll'},
{id:'s19',q:'Herr Sato und Frau Rossi sind krank. Sie ___ zu Hause bleiben.',a:'sollen'}
];
D.sollenGaps=[
['sg01','Bei Fieber','du viel Wasser','sollst','trinken','fieber'],
['sg02','Heute','Maria die Salbe zweimal','soll','verwenden','salbe'],
['sg03','Nach dem Essen','ihr die Tabletten','sollt','nehmen','tabletten_nehmen'],
['sg04','Bei Sonnenbrand','man die Haut','soll','kühlen','sonnenbrand'],
['sg05','Morgen','Herr Ali das Attest an die Firma','soll','schicken','attest'],
['sg06','Bei starkem Husten','wir zum Arzt','sollen','gehen','husten'],
['sg07','Heute','ich zu Hause','soll','bleiben','krankmeldung'],
['sg08','Nach dem Arztbesuch','Tom und Mia ihren Chef','sollen','anrufen','gespraech'],
['sg09','Am Abend','du dich','sollst','ausruhen','gesundheit'],
['sg10','Bei Rückenschmerzen','Paul nichts Schweres','soll','tragen','schritt'],
['sg11','Frau Klein, heute','Sie viel Tee','sollen','trinken','medizin'],
['sg12','Bei hohem Fieber','die Kinder im Bett','sollen','bleiben','fieber'],
['sg13','Nach der Sprechstunde','ich die Arztbescheinigung','soll','schicken','arztbescheinigung'],
['sg14','Heute','ihr ruhig','sollt','sein','ruhig'],
['sg15','Bei Schnupfen','meine Schwester viel Wasser','soll','trinken','schnupfen'],
['sg16','Morgen','wir noch einmal in die Praxis','sollen','kommen','sprechstunde'],
['sg17','Nach der Arbeit','du die Stelle','sollst','kühlen','kuehlen'],
['sg18','Herr Sato und Frau Rossi','Sie heute nicht','sollen','arbeiten','krankmeldung'],
['sg19','Vor dem Schlafen','ich die Medizin','soll','nehmen','medizin'],
['sg20','Bei Problemen','man mit dem Arzt','soll','sprechen','gespraech']
].map(x=>({id:x[0],left:x[1],middle:x[2],modal:x[3],verb:x[4],image:CDN+x[5]+'.webp',hint:'Achte auf das Subjekt. Das Modalverb steht auf Position 2, der Infinitiv am Satzende.'}));
D.sollenBuilders=[
['sb01',['Maria','soll','viel Tee','trinken'],'Maria soll viel Tee trinken.'],
['sb02',['Tom und Mia','sollen','heute','zu Hause','bleiben'],'Tom und Mia sollen heute zu Hause bleiben.'],
['sb03',['du','sollst','die Haut','kühlen'],'Du sollst die Haut kühlen.'],
['sb04',['wir','sollen','die Arztbescheinigung','schicken'],'Wir sollen die Arztbescheinigung schicken.'],
['sb05',['Frau Klein','Sie','sollen','morgen','wiederkommen'],'Frau Klein, Sie sollen morgen wiederkommen.'],
['sb06',['ich','soll','die Tabletten','nach dem Essen','nehmen'],'Ich soll die Tabletten nach dem Essen nehmen.'],
['sb07',['ihr','sollt','heute','keinen Sport','machen'],'Ihr sollt heute keinen Sport machen.'],
['sb08',['Paul','soll','nichts Schweres','tragen'],'Paul soll nichts Schweres tragen.'],
['sb09',['die Kinder','sollen','viel','schlafen'],'Die Kinder sollen viel schlafen.'],
['sb10',['man','soll','bei hohem Fieber','zum Arzt','gehen'],'Man soll bei hohem Fieber zum Arzt gehen.'],
['sb11',['Herr Ali','Sie','sollen','das Attest','per E-Mail','schicken'],'Herr Ali, Sie sollen das Attest per E-Mail schicken.'],
['sb12',['Anna','soll','die Salbe','zweimal am Tag','verwenden'],'Anna soll die Salbe zweimal am Tag verwenden.'],
['sb13',['wir','sollen','heute','ruhig','sein'],'Wir sollen heute ruhig sein.'],
['sb14',['du','sollst','viel Wasser','trinken'],'Du sollst viel Wasser trinken.'],
['sb15',['meine Eltern','sollen','beim Arzt','anrufen'],'Meine Eltern sollen beim Arzt anrufen.'],
['sb16',['ich','soll','mich','ausruhen'],'Ich soll mich ausruhen.'],
['sb17',['Frau Chen','soll','heute','nicht Auto','fahren'],'Frau Chen soll heute nicht Auto fahren.'],
['sb18',['ihr','sollt','die Medizin','nehmen'],'Ihr sollt die Medizin nehmen.'],
['sb19',['Herr Sato und Frau Rossi','sollen','zu Hause','bleiben'],'Herr Sato und Frau Rossi sollen zu Hause bleiben.'],
['sb20',['man','soll','bei Problemen','mit dem Arzt','sprechen'],'Man soll bei Problemen mit dem Arzt sprechen.']
].map(x=>({id:x[0],chunks:x[1],answer:x[2],hint:'Modalverb auf Position 2, Infinitiv am Satzende.'}));
D.modalChoiceItems=[
{id:'sm01',prompt:'Der Arzt gibt mir einen Tipp: Ich ___ heute viel Wasser trinken.',answer:'soll',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm02',prompt:'Rauchen ist hier verboten. Du ___ hier nicht rauchen.',answer:'darfst',options:['kannst','willst','möchtest','magst','musst','darfst','sollst']},
{id:'sm03',prompt:'Morgen habe ich einen wichtigen Arzttermin. Ich ___ um 9 Uhr dort sein.',answer:'muss',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm04',prompt:'Anna spricht sehr gut Deutsch. Sie ___ mit dem Arzt allein sprechen.',answer:'kann',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm05',prompt:'Paul hat einen Plan: Er ___ morgen wieder arbeiten.',answer:'will',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm06',prompt:'In der Apotheke: „Ich ___ bitte eine Salbe.“',answer:'möchte',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm07',prompt:'Mia trinkt sehr gern Tee. Sie ___ Tee.',answer:'mag',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm08',prompt:'Der Arzt sagt zu euch: Ihr ___ euch heute ausruhen.',answer:'sollt',options:['könnt','wollt','möchtet','mögt','müsst','dürft','sollt']},
{id:'sm09',prompt:'Ihr habt morgen einen Termin. Ihr ___ eure Versichertenkarten mitbringen.',answer:'müsst',options:['könnt','wollt','möchtet','mögt','müsst','dürft','sollt']},
{id:'sm10',prompt:'Hier ist Essen erlaubt. Ihr ___ hier essen.',answer:'dürft',options:['könnt','wollt','möchtet','mögt','müsst','dürft','sollt']},
{id:'sm11',prompt:'Wir haben ein Auto. Wir ___ selbst zum Arzt fahren.',answer:'können',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm12',prompt:'Wir haben beschlossen: Wir ___ heute früher schlafen.',answer:'wollen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm13',prompt:'Der Arzt empfiehlt es: Wir ___ heute keinen Sport machen.',answer:'sollen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm14',prompt:'Tom und Mia haben 39 Grad Fieber. Sie ___ zu Hause bleiben.',answer:'müssen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm15',prompt:'Die Kinder lieben Kakao. Sie ___ Kakao.',answer:'mögen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm16',prompt:'Frau Klein, was ___ Sie trinken?',answer:'möchten',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm17',prompt:'Herr Ali, der Arzt sagt: Sie ___ heute nichts Schweres tragen.',answer:'sollen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm18',prompt:'Frau Rossi, Sie haben die Erlaubnis. Sie ___ heute früher nach Hause gehen.',answer:'dürfen',options:['können','wollen','möchten','mögen','müssen','dürfen','sollen']},
{id:'sm19',prompt:'Mein Bruder hat genug Geld. Er ___ die Medizin selbst bezahlen.',answer:'kann',options:['kann','will','möchte','mag','muss','darf','soll']},
{id:'sm20',prompt:'Ich bin krankgeschrieben. Mein Chef sagt, ich ___ das Attest heute schicken.',answer:'soll',options:['kann','will','möchte','mag','muss','darf','soll']}
].map(x=>({...x,hint:'Lies den ganzen Kontext: Tipp, Pflicht, Erlaubnis, Möglichkeit, Plan, Wunsch oder Vorliebe?'}));
const defs=[
{id:'sollen-verb',title:'sollen + Verb',icon:'🧩',cardText:'Ergänze sollen und den Infinitiv.',text:'Ergänze die Form von sollen und das Verb.',example:'Bei Fieber du viel Wasser: sollst · trinken'},
{id:'sollen-satz-bauen',title:'Sätze mit sollen bauen',icon:'🧱',cardText:'Baue 20 vollständige Sätze.',text:'Ordne die Wörter. Schreibe den vollständigen Satz.',example:'Maria / viel Tee / sollen / trinken → Maria soll viel Tee trinken.'},
{id:'modalverb-waehlen',title:'Welches Modalverb?',icon:'💡',cardText:'Wähle das passende Modalverb.',text:'Wähle die richtige Modalverbform.'}
];
if(Array.isArray(D.tasks)){
 const newIds=new Set(defs.map(x=>x.id));
 D.tasks=D.tasks.filter(t=>!newIds.has(t.id));
 const pos=D.tasks.findIndex(t=>t.id==='sollen-saetze');
 D.tasks.splice(pos>=0?pos+1:D.tasks.length,0,...defs);
}
})();
