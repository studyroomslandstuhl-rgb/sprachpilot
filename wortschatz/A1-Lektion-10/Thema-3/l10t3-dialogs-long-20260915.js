(function(){
'use strict';
if(window.__SP_L10T3_DIALOGS_LONG_20260915)return;window.__SP_L10T3_DIALOGS_LONG_20260915=true;
const D=window.L10T3;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='arzt-arbeit-dialoge-hoeren');
if(t)Object.assign(t,{title:'Krankmelden – Gespräch mit der Chefin',cardText:'Höre ein langes Gespräch über eine Krankmeldung und beantworte 10 Fragen.',text:'Höre das Gespräch mit der Chefin. Beantworte die 10 Fragen.'});
D.workDialogues=[{
id:'chef-lang-1',
audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-lang-1.mp3',
lines:[
['Herr Kaya','Guten Morgen, Frau Weber. Hier ist Emre Kaya. Ich möchte mich krankmelden, weil ich heute nicht zur Arbeit kommen kann.'],
['Chefin','Guten Morgen, Herr Kaya. Was ist passiert?'],
['Herr Kaya','Seit gestern Abend habe ich starken Husten, Schnupfen und Halsschmerzen. Heute Morgen hatte ich außerdem 38,8 Grad Fieber. Ich fühle mich sehr schwach.'],
['Chefin','Das klingt wirklich nicht gut. Waren Sie schon beim Arzt?'],
['Herr Kaya','Noch nicht. Ich habe aber schon in der Praxis angerufen. Die Sprechstunde beginnt um zehn Uhr und ich soll gleich vorbeikommen.'],
['Chefin','Dann gehen Sie bitte zuerst zum Arzt. Wissen Sie schon, wie lange Sie nicht arbeiten können?'],
['Herr Kaya','Nein. Im Moment weiß ich nur, dass ich heute nicht kommen kann. Nach dem Gespräch mit der Ärztin melde ich mich noch einmal.'],
['Chefin','Das ist wichtig. Wenn die Ärztin Sie krankschreibt, brauchen wir die Krankmeldung beziehungsweise die Arztbescheinigung für die Personalabteilung.'],
['Herr Kaya','Ja. Wenn ich ein Attest bekomme, schicke ich es sofort per E-Mail.'],
['Chefin','Bitte schreiben Sie in den Betreff „Krankmeldung“. In der Nachricht schreiben Sie auch, wie lange Sie voraussichtlich fehlen.'],
['Herr Kaya','Soll ich das Attest als Anhang schicken?'],
['Chefin','Ja. Schreiben Sie zum Beispiel, dass das Attest anbei ist. Dann weiß die Personalabteilung sofort, dass die Bescheinigung mitgeschickt wurde.'],
['Herr Kaya','Gut. Und wenn ich die Bescheinigung erst später von der Praxis empfange?'],
['Chefin','Dann schicken Sie zuerst die Krankmeldung ohne Attest und schreiben Sie, dass Sie die Arztbescheinigung später nachreichen. Sobald Sie sie empfangen haben, schicken Sie sie bitte direkt weiter.'],
['Herr Kaya','Verstanden. Ich rufe Sie nach dem Arztbesuch noch einmal an.'],
['Chefin','Eine E-Mail reicht auch. Wichtig sind das Datum, die Dauer und die Information zum Attest.'],
['Herr Kaya','Alles klar. Ich gehe jetzt zur Ärztin. Sie hat mir am Telefon schon gesagt, ich soll viel trinken, ruhig bleiben und mich ausruhen.'],
['Chefin','Machen Sie das. Arbeiten ist heute wirklich keine gute Idee. Ihre Gesundheit geht vor.'],
['Herr Kaya','Danke. Ich melde mich später noch einmal.'],
['Herr Kaya','Guten Tag, Frau Weber. Ich bin wieder zu Hause. Ich war jetzt beim Arzt.'],
['Chefin','Hallo Herr Kaya. Was hat die Ärztin gesagt?'],
['Herr Kaya','Sie hat mich untersucht und für drei Tage krankgeschrieben. Ich soll zu Hause bleiben, viel trinken und die Tabletten nach dem Essen nehmen.'],
['Chefin','Dann kommen Sie also erst am Freitag wieder?'],
['Herr Kaya','Ja, wenn es mir dann besser geht. Die Ärztin sagt, ich soll am Freitag noch einmal in die Sprechstunde kommen, falls das Fieber nicht weg ist.'],
['Chefin','Haben Sie das Attest schon bekommen?'],
['Herr Kaya','Ja. Die Praxis hat mir die Arztbescheinigung gerade digital geschickt. Ich habe sie vor ein paar Minuten empfangen.'],
['Chefin','Sehr gut. Schicken Sie sie bitte gleich an mich und an die Personalabteilung.'],
['Herr Kaya','Mache ich. Ich schreibe: „Sehr geehrte Frau Weber, ich bin für drei Tage krankgeschrieben und kann bis Donnerstag nicht arbeiten. Das Attest finden Sie anbei.“'],
['Chefin','Das ist richtig. Schreiben Sie am Schluss noch „Mit freundlichen Grüßen“ und Ihren Namen.'],
['Herr Kaya','Gut. Dann schicke ich die E-Mail jetzt sofort. Vielen Dank für das Gespräch.'],
['Chefin','Gern. Ruhen Sie sich aus und gute Besserung.']
],
questions:[
{q:'Warum meldet sich Herr Kaya am Morgen bei seiner Chefin?',a:'Weil er krank ist und nicht zur Arbeit kommen kann',options:['Weil er krank ist und nicht zur Arbeit kommen kann','Weil er Urlaub möchte','Weil sein Auto kaputt ist','Weil er einen Termin beim Amt hat']},
{q:'Welche Beschwerden hat Herr Kaya?',a:'Husten, Schnupfen, Halsschmerzen und Fieber',options:['Husten, Schnupfen, Halsschmerzen und Fieber','Nur Rückenschmerzen','Nur Sonnenbrand','Zahnschmerzen']},
{q:'Was macht Herr Kaya zuerst?',a:'Er geht zur Sprechstunde beim Arzt',options:['Er geht zur Sprechstunde beim Arzt','Er fährt zur Arbeit','Er geht einkaufen','Er macht Sport']},
{q:'Was soll im Betreff seiner E-Mail stehen?',a:'Krankmeldung',options:['Krankmeldung','Urlaub','Bewerbung','Rechnung']},
{q:'Welche Informationen sind der Chefin in der E-Mail wichtig?',a:'Datum, Dauer und Information zum Attest',options:['Datum, Dauer und Information zum Attest','Nur die Hausnummer','Nur die Postleitzahl','Nur der Gruß']},
{q:'Was soll Herr Kaya tun, wenn das Attest später kommt?',a:'Er soll es nachreichen, sobald er es empfangen hat',options:['Er soll es nachreichen, sobald er es empfangen hat','Er soll gar nichts schicken','Er soll zur Arbeit kommen','Er soll eine neue E-Mail-Adresse machen']},
{q:'Wie lange schreibt die Ärztin Herrn Kaya krank?',a:'Drei Tage',options:['Drei Tage','Einen Tag','Eine Woche','Einen Monat']},
{q:'Was empfiehlt die Ärztin Herrn Kaya?',a:'Zu Hause bleiben, viel trinken und die Tabletten nach dem Essen nehmen',options:['Zu Hause bleiben, viel trinken und die Tabletten nach dem Essen nehmen','Sport machen und arbeiten','Schwere Sachen tragen','Nur Kaffee trinken']},
{q:'Was hat Herr Kaya nach dem Arztbesuch digital empfangen?',a:'Die Arztbescheinigung beziehungsweise das Attest',options:['Die Arztbescheinigung beziehungsweise das Attest','Eine Rechnung','Einen Führerschein','Eine Einladung']},
{q:'Wie formuliert Herr Kaya die Information über die Dauer und das Attest?',a:'Er ist drei Tage krankgeschrieben und das Attest ist anbei',options:['Er ist drei Tage krankgeschrieben und das Attest ist anbei','Er hat Urlaub und kommt morgen','Er möchte kündigen','Er schickt nur einen Gruß']}
]
}];
D.combinedDialogues=[...D.workDialogues];
})();
