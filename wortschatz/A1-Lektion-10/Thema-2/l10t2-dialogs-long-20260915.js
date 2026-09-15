(function(){
'use strict';
if(window.__SP_L10T2_DIALOGS_LONG_20260915)return;window.__SP_L10T2_DIALOGS_LONG_20260915=true;
const D=window.L10T2;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='apotheke-dialoge-hoeren');
if(t)Object.assign(t,{title:'Apotheke – Dialoge',cardText:'Höre 3 längere Dialoge in der Apotheke und beantworte jeweils 3 Fragen.',text:'Höre den Dialog. Beantworte die 3 Fragen.'});
D.pharmacyDialogues=[
{
id:'apo-sonnenbrand',
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
{q:'Was ist das Problem?',a:'Sonnenbrand',options:['Sonnenbrand','Schnupfen','Rückenschmerzen','Husten']},
{q:'Welche Symptome hat die Person?',a:'Rote, heiße und brennende Haut',options:['Rote, heiße und brennende Haut','Husten, Schnupfen und Fieber','Kopfschmerzen und Schwindel','Bauchschmerzen und Übelkeit']},
{q:'Was soll die Person machen?',a:'Die Haut kühlen, eine Salbe verwenden und im Schatten bleiben',options:['Die Haut kühlen, eine Salbe verwenden und im Schatten bleiben','Eis direkt auf die Haut legen und in die Sonne gehen','Sport machen und wenig trinken','Nichts tun und morgen schwimmen gehen']}
]
},
{
id:'apo-ruecken',
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
{q:'Was ist das Problem?',a:'Rückenschmerzen',options:['Rückenschmerzen','Sonnenbrand','Halsschmerzen','Fieber']},
{q:'Welche Symptome hat die Person?',a:'Der untere Rücken tut bei Bewegung und beim Heben weh',options:['Der untere Rücken tut bei Bewegung und beim Heben weh','Die Haut ist rot und heiß','Die Nase läuft und der Hals tut weh','Der Kopf tut weh und ihr ist schwindelig']},
{q:'Was soll die Person machen?',a:'Eine Salbe verwenden, sich vorsichtig bewegen und nichts Schweres tragen',options:['Eine Salbe verwenden, sich vorsichtig bewegen und nichts Schweres tragen','Den ganzen Tag liegen und schwere Kisten tragen','Sport machen und keine Salbe benutzen','Sofort wieder normal arbeiten']}
]
},
{
id:'apo-kind-fieber',
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
{q:'Was ist das Problem?',a:'Das Kind hat hohes Fieber',options:['Das Kind hat hohes Fieber','Das Kind hat Rückenschmerzen','Das Kind hat Sonnenbrand','Das Kind hat Zahnschmerzen']},
{q:'Welche Symptome hat der Sohn?',a:'Husten, Schnupfen, Halsschmerzen und wenig Appetit',options:['Husten, Schnupfen, Halsschmerzen und wenig Appetit','Rückenschmerzen und taube Beine','Rote Haut und Blasen','Kopfschmerzen und Bauchschmerzen']},
{q:'Was soll die Mutter machen?',a:'Mit ihrem Sohn zum Arzt gehen, ihm viel zu trinken geben und ihn ausruhen lassen',options:['Mit ihrem Sohn zum Arzt gehen, ihm viel zu trinken geben und ihn ausruhen lassen','Ihn zur Schule schicken und Sport machen lassen','Ihm mehr Medizin als angegeben geben','Nichts tun und bis morgen warten']}
]
}
];
})();
