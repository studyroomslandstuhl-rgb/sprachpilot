(function(){
'use strict';
if(window.__SP_L10T3_DIALOGS_LONG_20260915)return;window.__SP_L10T3_DIALOGS_LONG_20260915=true;
const D=window.L10T3;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='arzt-arbeit-dialoge-hoeren');
if(t)Object.assign(t,{title:'Krankmelden – Dialoge mit Chef/Chefin',cardText:'Höre 5 längere Gespräche über Krankmeldung bei der Arbeit und beantworte jeweils 3 Fragen.',text:'Höre das Gespräch mit Chef oder Chefin. Beantworte die 3 Fragen.'});
D.workDialogues=[
{id:'chef1',audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-v2-1.mp3',lines:[
['Herr Kaya','Guten Morgen, Frau Weber. Ich möchte mich krankmelden. Mir geht es seit gestern Abend nicht gut und ich kann heute nicht zur Arbeit kommen.'],
['Chefin','Guten Morgen, Herr Kaya. Was haben Sie denn?'],
['Herr Kaya','Ich habe Fieber, starken Husten und Schnupfen. Heute Morgen hatte ich 38,8 Grad. Außerdem tut mir der Hals weh.'],
['Chefin','Das klingt nicht gut. Waren Sie schon beim Arzt?'],
['Herr Kaya','Noch nicht. Ich habe um zehn Uhr Sprechstunde bei meiner Hausärztin. Sie hat am Telefon gesagt, ich soll zu Hause bleiben und viel trinken.'],
['Chefin','In Ordnung. Melden Sie sich bitte nach dem Arztbesuch noch einmal. Wir müssen wissen, wie lange Sie fehlen.'],
['Herr Kaya','Ja, das mache ich. Wenn ich eine Arztbescheinigung bekomme, schicke ich sie sofort per E-Mail.'],
['Chefin','Bitte schreiben Sie in den Betreff „Krankmeldung“ und schicken Sie das Attest an mich und an die Personalabteilung.'],
['Herr Kaya','Gut. Ich schreibe eine kurze E-Mail und füge die Bescheinigung anbei.'],
['Chefin','Danke. Ruhen Sie sich aus und werden Sie erst wieder gesund. Gute Besserung.']
],questions:[
{q:'Warum kann Herr Kaya heute nicht arbeiten?',a:'Er hat Fieber, Husten, Schnupfen und Halsschmerzen',options:['Er hat Fieber, Husten, Schnupfen und Halsschmerzen','Er hat Urlaub','Sein Auto ist kaputt','Er hat einen Termin beim Amt']},
{q:'Was soll Herr Kaya nach dem Arztbesuch machen?',a:'Seine Chefin informieren, wie lange er fehlt',options:['Seine Chefin informieren, wie lange er fehlt','Direkt zur Arbeit kommen','Eine Bewerbung schreiben','Zur Apotheke gehen und nichts sagen']},
{q:'Was soll im Betreff der E-Mail stehen?',a:'Krankmeldung',options:['Krankmeldung','Urlaub','Rechnung','Bewerbung']}
]},
{id:'chef2',audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-v2-2.mp3',lines:[
['Frau Rossi','Hallo Herr Meier, hier ist Laura Rossi. Ich komme gerade vom Arzt und wollte mich bei Ihnen melden.'],
['Chef','Hallo Frau Rossi. Was ist passiert?'],
['Frau Rossi','Mein Rücken tut sehr weh. Gestern habe ich bei der Arbeit schwere Kisten getragen. Heute Morgen konnte ich mich kaum bewegen.'],
['Chef','Hat der Arzt Sie untersucht?'],
['Frau Rossi','Ja. Er sagt, ich soll mich ausruhen, nichts Schweres tragen und ein paar ruhige Schritte gehen. Ich soll auch eine Salbe verwenden.'],
['Chef','Und wie lange sind Sie krankgeschrieben?'],
['Frau Rossi','Für drei Tage. Auf dem Attest steht, dass ich bis Donnerstag arbeitsunfähig bin. Am Freitag kann ich wahrscheinlich wiederkommen.'],
['Chef','Dann schicken Sie die Arztbescheinigung bitte heute noch ans Büro.'],
['Frau Rossi','Ich habe das Attest gerade auf meinem Handy empfangen. Ich schicke es gleich als Anhang.'],
['Chef','Sehr gut. Wenn sich etwas ändert und Sie am Freitag noch nicht arbeiten können, melden Sie sich bitte wieder.'],
['Frau Rossi','Mache ich. Vielen Dank und bis bald.']
],questions:[
{q:'Warum ist Frau Rossi krankgeschrieben?',a:'Sie hat starke Rückenschmerzen nach dem Tragen schwerer Kisten',options:['Sie hat starke Rückenschmerzen nach dem Tragen schwerer Kisten','Sie hat Sonnenbrand','Sie hat Schnupfen','Sie hat Zahnschmerzen']},
{q:'Wie lange kann Frau Rossi nicht arbeiten?',a:'Drei Tage, bis Donnerstag',options:['Drei Tage, bis Donnerstag','Nur heute','Bis nächste Woche Freitag','Einen Monat']},
{q:'Was soll Frau Rossi heute noch schicken?',a:'Die Arztbescheinigung',options:['Die Arztbescheinigung','Den Führerschein','Eine Rechnung','Eine Einladung']}
]},
{id:'chef3',audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-v2-3.mp3',lines:[
['Herr Chen','Guten Morgen, Frau Becker. Ich muss mich leider krankmelden.'],
['Chefin','Guten Morgen, Herr Chen. Was ist los?'],
['Herr Chen','Ich habe seit der Nacht starke Kopfschmerzen und mir ist schwindelig. Ich kann heute nicht sicher Auto fahren und auch nicht konzentriert arbeiten.'],
['Chefin','Waren Sie schon beim Arzt?'],
['Herr Chen','Noch nicht. Ich habe in der Praxis angerufen. Die Sprechstunde beginnt um neun Uhr und ich soll gleich vorbeikommen.'],
['Chefin','Dann gehen Sie bitte zuerst zum Arzt. Wissen Sie schon, ob Sie morgen wieder arbeiten können?'],
['Herr Chen','Nein, das weiß ich noch nicht. Nach dem Gespräch mit dem Arzt melde ich mich sofort bei Ihnen.'],
['Chefin','Gut. Falls der Arzt Sie krankschreibt, brauchen wir die Krankmeldung beziehungsweise das Attest für die Personalabteilung.'],
['Herr Chen','Verstanden. Ich schicke die Bescheinigung anbei per E-Mail. Soll ich Sie zusätzlich anrufen?'],
['Chefin','Eine E-Mail reicht. Schreiben Sie bitte das Datum und die voraussichtliche Dauer hinein.'],
['Herr Chen','Alles klar. Dann melde ich mich nach dem Arztbesuch noch einmal.']
],questions:[
{q:'Warum kann Herr Chen heute nicht arbeiten?',a:'Er hat starke Kopfschmerzen und Schwindel',options:['Er hat starke Kopfschmerzen und Schwindel','Er hat Urlaub','Er muss einkaufen','Er besucht Freunde']},
{q:'Was macht Herr Chen als Nächstes?',a:'Er geht zur Sprechstunde beim Arzt',options:['Er geht zur Sprechstunde beim Arzt','Er fährt zur Arbeit','Er macht Sport','Er geht in die Apotheke arbeiten']},
{q:'Welche Informationen soll Herr Chen in die E-Mail schreiben?',a:'Das Datum und die voraussichtliche Dauer',options:['Das Datum und die voraussichtliche Dauer','Nur seine Hausnummer','Nur den Betreff ohne Text','Seine Lieblingsmedizin']}
]},
{id:'chef4',audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-v2-4.mp3',lines:[
['Frau Yilmaz','Guten Tag, Frau Winter. Ich rufe wegen meiner Krankmeldung an.'],
['Chefin','Guten Tag, Frau Yilmaz. Wie geht es Ihnen?'],
['Frau Yilmaz','Leider noch nicht gut. Ich habe Husten und Fieber. Der Arzt hat mich heute untersucht und bis Freitag krankgeschrieben.'],
['Chefin','Dann bleiben Sie bitte zu Hause und erholen Sie sich. Haben Sie eine Arztbescheinigung bekommen?'],
['Frau Yilmaz','Ja. Die Praxis hat mir das Attest digital geschickt. Ich habe es vor ein paar Minuten empfangen.'],
['Chefin','Perfekt. Bitte schicken Sie es an die Personalabteilung.'],
['Frau Yilmaz','Soll ich eine formelle E-Mail schreiben?'],
['Chefin','Ja. Beginnen Sie mit einer Anrede, schreiben Sie kurz, dass Sie krankgeschrieben sind, nennen Sie die Dauer und schreiben Sie, dass das Attest anbei ist.'],
['Frau Yilmaz','Dann schreibe ich: „Sehr geehrte Frau Winter, ich bin bis Freitag krankgeschrieben. Das Attest finden Sie anbei.“'],
['Chefin','Genau. Am Schluss noch „Mit freundlichen Grüßen“ und Ihr Name.'],
['Frau Yilmaz','Alles klar. Ich schicke die E-Mail sofort. Vielen Dank.']
],questions:[
{q:'Wie lange ist Frau Yilmaz krankgeschrieben?',a:'Bis Freitag',options:['Bis Freitag','Nur bis heute Mittag','Bis Montag in zwei Wochen','Nur eine Stunde']},
{q:'Was hat Frau Yilmaz digital empfangen?',a:'Das Attest beziehungsweise die Arztbescheinigung',options:['Das Attest beziehungsweise die Arztbescheinigung','Eine Rechnung','Einen Führerschein','Eine Einladung']},
{q:'Was soll in ihrer E-Mail stehen?',a:'Dauer der Krankmeldung und dass das Attest anbei ist',options:['Dauer der Krankmeldung und dass das Attest anbei ist','Nur ihre Hausnummer','Nur der Name der Apotheke','Nur ein Gruß ohne Information']}
]},
{id:'chef5',audio:'https://sprachpilot.b-cdn.net/audio/l10t3-krankmeldung-dialog-v2-5.mp3',lines:[
['Herr Novak','Guten Morgen, Herr Stein. Ich wollte kurz Bescheid geben, wie es mir geht.'],
['Chef','Guten Morgen, Herr Novak. Geht es Ihnen besser?'],
['Herr Novak','Ja, deutlich besser. Ich war gestern noch einmal beim Arzt. Mein Fieber ist weg und der Husten ist nur noch leicht.'],
['Chef','Das freut mich. Sind Sie noch krankgeschrieben?'],
['Herr Novak','Das Attest gilt noch bis heute. Der Arzt sagt, ich kann morgen wieder arbeiten, wenn ich mich weiterhin gut fühle.'],
['Chef','Gut. Haben Sie die Krankmeldung schon geschickt?'],
['Herr Novak','Ja, gestern Abend. Ich habe eine E-Mail mit dem Betreff „Krankmeldung“ geschickt und die Arztbescheinigung als Anhang beigefügt.'],
['Chef','Sehr gut. Ich habe die E-Mail noch nicht gesehen, aber die Personalabteilung hat sie wahrscheinlich schon empfangen.'],
['Herr Novak','Soll ich sie noch einmal schicken?'],
['Chef','Nein, das ist nicht nötig. Kommen Sie morgen bitte nur, wenn Sie wirklich gesund sind. Wenn es wieder schlechter wird, melden Sie sich und gehen Sie erneut zum Arzt.'],
['Herr Novak','In Ordnung. Dann bis morgen, wenn alles gut bleibt.']
],questions:[
{q:'Wann kann Herr Novak wahrscheinlich wieder arbeiten?',a:'Morgen',options:['Morgen','Nächste Woche','In einem Monat','Heute Abend']},
{q:'Was hat Herr Novak bereits geschickt?',a:'Eine E-Mail mit Krankmeldung und Arztbescheinigung im Anhang',options:['Eine E-Mail mit Krankmeldung und Arztbescheinigung im Anhang','Eine Bewerbung','Eine Rechnung','Seinen Ausweis']},
{q:'Wann soll Herr Novak morgen nicht zur Arbeit kommen?',a:'Wenn es ihm wieder schlechter geht',options:['Wenn es ihm wieder schlechter geht','Wenn die Sonne scheint','Wenn er Wasser trinkt','Wenn er die E-Mail schon geschickt hat']}
]}
];
D.combinedDialogues=[...D.workDialogues];
})();
