(function(){
'use strict';
if(window.__SP_L10T2_DIALOGS_LONG_20260915)return;window.__SP_L10T2_DIALOGS_LONG_20260915=true;
const D=window.L10T2;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='apotheke-dialoge-hoeren');
if(t)Object.assign(t,{title:'Apotheke – Dialoge',cardText:'Höre 3 längere Dialoge in der Apotheke und beantworte jeweils 3 Fragen.',text:'Höre den Dialog. Beantworte die 3 Fragen.'});
D.pharmacyDialogues=[
{
id:'apo-sonnenbrand-v2',
audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-sonnenbrand.mp3',
lines:[
['Apothekerin','Guten Tag. Was ist passiert?'],
['Kunde','Ich war gestern fast den ganzen Tag draußen in der Sonne. Jetzt sind meine Schultern und mein Rücken ganz rot.'],
['Apothekerin','Tut die Haut auch weh?'],
['Kunde','Ja, sie ist sehr heiß und brennt.'],
['Apothekerin','Haben Sie Blasen auf der Haut?'],
['Kunde','Nein, nur sehr rote Haut.'],
['Apothekerin','Haben Sie Fieber oder fühlen Sie sich krank?'],
['Kunde','Nein, sonst geht es mir gut.'],
['Apothekerin','Dann haben Sie wahrscheinlich einen Sonnenbrand. Sie sollten die Haut vorsichtig kühlen.'],
['Kunde','Kann ich Eis direkt auf die Haut legen?'],
['Apothekerin','Nein, bitte nicht. Das ist zu kalt. Nehmen Sie lieber ein kühles, feuchtes Tuch.'],
['Kunde','Kann ich auch eine Salbe verwenden?'],
['Apothekerin','Ja, diese Salbe können Sie dünn auf die Haut auftragen.'],
['Kunde','Wie oft soll ich das machen?'],
['Apothekerin','Zweimal am Tag reicht. Trinken Sie außerdem viel Wasser.'],
['Kunde','Darf ich morgen wieder in die Sonne?'],
['Apothekerin','Besser nicht. Bleiben Sie die nächsten Tage möglichst im Schatten und schützen Sie die Haut.'],
['Kunde','Wann muss ich zum Arzt?'],
['Apothekerin','Wenn Sie Fieber bekommen, große Blasen entstehen oder die Schmerzen sehr stark werden.'],
['Kunde','Gut, danke. Dann kühle ich die Haut und verwende die Salbe.']
],
questions:[
{q:'Was ist das Problem?',a:'Sonnenbrand',options:['Sonnenbrand','Hautausschlag','Rückenschmerzen','Fieber']},
{q:'Welche Symptome hat die Person?',a:'Rote, heiße Haut und Brennen',options:['Rote, heiße Haut und Brennen','Rote Haut und Husten','Heiße Haut und Schnupfen','Blasen und Halsschmerzen']},
{q:'Was soll die Person machen?',a:'Haut kühlen und Salbe verwenden',options:['Haut kühlen und Salbe verwenden','Eis direkt auf die Haut legen','Wieder in die Sonne gehen','Nur Wasser trinken']}
]
},
{
id:'apo-ruecken-v2',
audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-rueckenschmerzen.mp3',
lines:[
['Apotheker','Guten Tag. Wie kann ich Ihnen helfen?'],
['Kundin','Ich brauche etwas gegen Schmerzen. Gestern habe ich bei der Arbeit fast den ganzen Tag schwere Kartons getragen.'],
['Apotheker','Wo haben Sie jetzt Probleme?'],
['Kundin','Unten im Rücken. Wenn ich mich bewege oder etwas hochhebe, tut es besonders weh.'],
['Apotheker','Können Sie normal gehen?'],
['Kundin','Ja, aber ich bewege mich langsam. Wenn ich ruhig sitze, ist es besser.'],
['Apotheker','Haben Sie sehr starke Schmerzen oder fühlen sich Ihre Beine manchmal taub an?'],
['Kundin','Nein, das nicht.'],
['Apotheker','Dann können Sie zuerst eine Salbe verwenden. Diese Salbe ist für Muskeln und Rücken.'],
['Kundin','Wie oft soll ich die Salbe benutzen?'],
['Apotheker','Zweimal am Tag. Tragen Sie nur eine kleine Menge auf die schmerzende Stelle auf.'],
['Kundin','Soll ich den ganzen Tag im Bett bleiben?'],
['Apotheker','Nein. Das ist meistens nicht gut. Bewegen Sie sich vorsichtig. Ein paar ruhige Schritte sind besser als den ganzen Tag zu liegen.'],
['Kundin','Kann ich morgen wieder schwere Kisten tragen?'],
['Apotheker','Nein. Sie sollten in den nächsten Tagen nichts Schweres tragen. Wenn es nicht besser wird oder die Schmerzen stärker werden, gehen Sie bitte zum Arzt.'],
['Kundin','Gut. Dann nehme ich die Salbe und passe heute auf. Danke.']
],
questions:[
{q:'Was ist das Problem?',a:'Rückenschmerzen',options:['Rückenschmerzen','Beinschmerzen','Bauchschmerzen','Kopfschmerzen']},
{q:'Welche Symptome hat die Person?',a:'Schmerzen beim Bewegen und Heben',options:['Schmerzen beim Bewegen und Heben','Schmerzen beim Husten und Atmen','Schmerzen beim Essen und Trinken','Schmerzen beim Schlafen und Sprechen']},
{q:'Was soll die Person machen?',a:'Salbe benutzen und nichts Schweres tragen',options:['Salbe benutzen und nichts Schweres tragen','Schmerztabletten nehmen und arbeiten','Den ganzen Tag im Bett bleiben','Schwere Kisten tragen']}
]
},
{
id:'apo-kind-fieber-v2',
audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-kind-fieber.mp3',
lines:[
['Mutter','Guten Tag. Ich brauche etwas für meinen Sohn. Er ist acht Jahre alt und ihm geht es seit gestern nicht gut.'],
['Apothekerin','Was fehlt ihm denn?'],
['Mutter','Gestern war er nur ein bisschen müde. In der Nacht hat er oft gehustet und heute Morgen war er ganz heiß.'],
['Apothekerin','Haben Sie seine Temperatur gemessen?'],
['Mutter','Ja. Das Thermometer hat 39 Grad gezeigt.'],
['Apothekerin','Hat er noch andere Beschwerden?'],
['Mutter','Seine Nase läuft die ganze Zeit und er sagt, dass ihm der Hals beim Schlucken wehtut. Essen möchte er heute auch kaum.'],
['Apothekerin','Trinkt er genug?'],
['Mutter','Nicht besonders viel. Ich muss ihn immer wieder daran erinnern.'],
['Apothekerin','Bei 39 Grad sollten Sie mit ihm heute noch zum Arzt gehen. Bis dahin soll er viel trinken und sich ausruhen.'],
['Mutter','Kann ich ihm vorher etwas gegen das Fieber geben?'],
['Apothekerin','Haben Sie zu Hause ein Medikament für Kinder?'],
['Mutter','Ja, einen Fiebersaft. Aber ich weiß nicht mehr genau, wie viel er nehmen darf.'],
['Apothekerin','Dann schauen wir gemeinsam auf die Packung. Die Menge hängt vom Alter und vom Gewicht ab. Geben Sie ihm bitte nicht einfach mehr, wenn das Fieber nicht sofort sinkt.'],
['Mutter','Soll er im Bett bleiben?'],
['Apothekerin','Er soll sich ruhig verhalten. Er muss nicht die ganze Zeit schlafen, aber Sport oder draußen spielen ist heute keine gute Idee.'],
['Mutter','Gut. Dann fahren wir nachher zum Arzt.'],
['Apothekerin','Das ist sinnvoll. Achten Sie darauf, dass er regelmäßig Wasser oder Tee trinkt. Gute Besserung.']
],
questions:[
{q:'Was ist das Problem?',a:'Das Kind hat Fieber',options:['Das Kind hat Fieber','Das Kind hat Kopfschmerzen','Das Kind hat Schnupfen, aber keine Halsschmerzen','Das Kind hat nur Husten']},
{q:'Welche Symptome hat der Sohn?',a:'Schnupfen, Husten, wenig Appetit und Halsschmerzen',options:['Kopfschmerzen, Husten und Schnupfen','Fieber, Husten und Augenschmerzen','Schnupfen, Halsschmerzen und viel Appetit','Schnupfen, Husten, wenig Appetit und Halsschmerzen']},
{q:'Was soll die Mutter machen?',a:'Zum Arzt gehen',options:['Hustensaft geben','Nichts machen','Zum Arzt gehen','Fieber messen']}
]
}
];
})();
