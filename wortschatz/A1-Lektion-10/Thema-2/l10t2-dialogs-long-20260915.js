(function(){
'use strict';
if(window.__SP_L10T2_DIALOGS_LONG_20260915)return;window.__SP_L10T2_DIALOGS_LONG_20260915=true;
const D=window.L10T2;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='apotheke-dialoge-hoeren');
if(t)Object.assign(t,{title:'Apotheke – Dialoge',cardText:'Höre 5 längere Dialoge in der Apotheke und beantworte jeweils 3 Fragen.',text:'Höre den Dialog in der Apotheke. Beantworte die 3 Fragen.'});
D.pharmacyDialogues=[
{id:'apo1',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-v2-1.mp3',lines:[
['Apothekerin','Guten Tag. Was kann ich für Sie tun?'],
['Frau Berger','Guten Tag. Seit gestern habe ich starke Kopfschmerzen und Halsschmerzen. Mein Hals tut besonders beim Schlucken weh.'],
['Apothekerin','Haben Sie auch Fieber oder Schnupfen?'],
['Frau Berger','Fieber habe ich nicht. Meine Nase läuft aber ein bisschen und ich fühle mich müde.'],
['Apothekerin','Dann können Sie zuerst viel trinken und sich ruhig verhalten. Möchten Sie etwas gegen die Kopfschmerzen?'],
['Frau Berger','Ja, bitte. Ich muss morgen arbeiten und möchte heute etwas nehmen.'],
['Apothekerin','Sie können diese Schmerztabletten verwenden. Nehmen Sie eine Tablette mit Wasser und lesen Sie bitte die Packungsangabe.'],
['Frau Berger','Soll ich auch etwas für den Hals nehmen?'],
['Apothekerin','Warmer Tee kann helfen. Wenn Sie Fieber bekommen oder die Schmerzen stärker werden, sollen Sie zum Arzt gehen.'],
['Frau Berger','Gut, dann nehme ich die Tabletten und trinke heute viel Tee. Danke.']
],questions:[
{q:'Welche Beschwerden hat Frau Berger?',a:'Kopfschmerzen, Halsschmerzen und etwas Schnupfen',options:['Kopfschmerzen, Halsschmerzen und etwas Schnupfen','Nur Bauchschmerzen','Rückenschmerzen und Fieber','Sonnenbrand']},
{q:'Was soll Frau Berger zuerst machen?',a:'Viel trinken und eine Schmerztablette nehmen',options:['Viel trinken und eine Schmerztablette nehmen','Sport machen','Schwere Sachen tragen','Zur Arbeit gehen und nichts trinken']},
{q:'Wann soll Frau Berger zum Arzt gehen?',a:'Wenn sie Fieber bekommt oder die Schmerzen stärker werden',options:['Wenn sie Fieber bekommt oder die Schmerzen stärker werden','Wenn der Tee warm ist','Wenn sie arbeiten möchte','Wenn ihre Nase nicht läuft']}
]},
{id:'apo2',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-v2-2.mp3',lines:[
['Apotheker','Guten Tag. Wie kann ich Ihnen helfen?'],
['Herr Yilmaz','Ich habe seit drei Tagen Husten und Schnupfen. Meine Nase ist oft zu und nachts kann ich schlecht schlafen.'],
['Apotheker','Ist der Husten trocken oder haben Sie Schmerzen in der Brust?'],
['Herr Yilmaz','Der Husten ist meistens trocken. Wenn ich lange huste, tut meine Brust ein bisschen weh.'],
['Apotheker','Haben Sie Fieber?'],
['Herr Yilmaz','Nein, die Temperatur ist normal. Ich möchte aber etwas gegen den Husten.'],
['Apotheker','Sie können diesen Hustensaft verwenden. Nehmen Sie ihn nach der Packungsangabe. Trinken Sie außerdem viel Wasser oder Tee.'],
['Herr Yilmaz','Kann ich den Hustensaft zusammen mit meinen Tabletten nehmen?'],
['Apotheker','Das kommt auf die Tabletten an. Zeigen Sie mir bitte die Packung. Dann kann ich das kontrollieren.'],
['Herr Yilmaz','Hier ist sie.'],
['Apotheker','Danke. Das ist in Ordnung. Ruhen Sie sich aus. Wenn Fieber dazukommt oder Sie starke Schmerzen in der Brust bekommen, gehen Sie bitte zum Arzt.']
],questions:[
{q:'Welche Beschwerden hat Herr Yilmaz?',a:'Husten, Schnupfen und leichte Schmerzen in der Brust beim Husten',options:['Husten, Schnupfen und leichte Schmerzen in der Brust beim Husten','Nur Zahnschmerzen','Sonnenbrand und Fieber','Knieschmerzen']},
{q:'Was bekommt Herr Yilmaz in der Apotheke?',a:'Hustensaft',options:['Hustensaft','Eine Spritze','Ein Attest','Eine Krankmeldung']},
{q:'Wann soll Herr Yilmaz zum Arzt gehen?',a:'Bei Fieber oder starken Schmerzen in der Brust',options:['Bei Fieber oder starken Schmerzen in der Brust','Wenn er Tee trinkt','Wenn er schlafen kann','Wenn die Packung grün ist']}
]},
{id:'apo3',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-v2-3.mp3',lines:[
['Apothekerin','Guten Tag. Was fehlt Ihnen?'],
['Frau Novak','Mein Rücken tut seit gestern weh. Bei der Arbeit habe ich viele schwere Kisten getragen.'],
['Apothekerin','Tut der Rücken immer weh oder nur bei Bewegung?'],
['Frau Novak','Vor allem bei Bewegung. Wenn ich ruhig sitze, ist es besser.'],
['Apothekerin','Können Sie normal gehen?'],
['Frau Novak','Ja, aber ich bewege mich langsam. Ich möchte gern eine Salbe verwenden.'],
['Apothekerin','Diese Salbe können Sie auf die schmerzende Stelle geben. Verwenden Sie sie zweimal am Tag.'],
['Frau Novak','Soll ich den ganzen Tag liegen?'],
['Apothekerin','Nein. Ein paar ruhige Schritte sind meistens besser. Aber Sie sollen heute nichts Schweres tragen.'],
['Frau Novak','Und wenn es morgen noch genauso weh tut?'],
['Apothekerin','Dann gehen Sie bitte zum Arzt. Bei sehr starken Schmerzen oder Taubheit sollten Sie nicht warten.']
],questions:[
{q:'Warum hat Frau Novak Rückenschmerzen?',a:'Sie hat bei der Arbeit schwere Kisten getragen',options:['Sie hat bei der Arbeit schwere Kisten getragen','Sie war zu lange in der Sonne','Sie hat Husten','Sie hat Fieber']},
{q:'Wie soll Frau Novak die Salbe verwenden?',a:'Zweimal am Tag',options:['Zweimal am Tag','Einmal pro Woche','Nur nachts','Gar nicht']},
{q:'Was soll Frau Novak heute vermeiden?',a:'Schwere Sachen tragen',options:['Schwere Sachen tragen','Ein paar ruhige Schritte','Wasser trinken','Die Salbe verwenden']}
]},
{id:'apo4',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-v2-4.mp3',lines:[
['Apotheker','Guten Tag. Was ist passiert?'],
['Herr Sato','Ich war gestern viele Stunden in der Sonne. Jetzt sind meine Schultern und mein Rücken sehr rot und die Haut tut weh.'],
['Apotheker','Das klingt nach einem Sonnenbrand. Haben Sie Blasen auf der Haut oder Fieber?'],
['Herr Sato','Nein, keine Blasen und kein Fieber. Aber die Haut ist heiß.'],
['Apotheker','Dann sollen Sie die Haut vorsichtig kühlen. Nehmen Sie kein Eis direkt auf die Haut.'],
['Herr Sato','Kann ich auch eine Salbe verwenden?'],
['Apotheker','Ja. Diese Salbe ist für gereizte Haut. Tragen Sie sie dünn auf und bleiben Sie die nächsten Tage möglichst aus der Sonne.'],
['Herr Sato','Wie oft soll ich die Salbe benutzen?'],
['Apotheker','Zweimal am Tag reicht. Trinken Sie außerdem viel Wasser.'],
['Herr Sato','Und wann muss ich zum Arzt?'],
['Apotheker','Wenn Sie Fieber bekommen, große Blasen entstehen oder die Schmerzen sehr stark werden.']
],questions:[
{q:'Was hat Herr Sato?',a:'Einen Sonnenbrand an Schultern und Rücken',options:['Einen Sonnenbrand an Schultern und Rücken','Schnupfen','Halsschmerzen','Zahnschmerzen']},
{q:'Was soll Herr Sato mit der Haut machen?',a:'Sie vorsichtig kühlen und eine Salbe verwenden',options:['Sie vorsichtig kühlen und eine Salbe verwenden','Sie heiß duschen','Direkt Eis darauflegen','In die Sonne gehen']},
{q:'Wann soll Herr Sato zum Arzt gehen?',a:'Bei Fieber, großen Blasen oder sehr starken Schmerzen',options:['Bei Fieber, großen Blasen oder sehr starken Schmerzen','Wenn er Wasser trinkt','Wenn er die Salbe zweimal benutzt','Wenn die Haut nicht mehr rot ist']}
]},
{id:'apo5',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-v2-5.mp3',lines:[
['Apothekerin','Guten Abend. Was kann ich für Sie tun?'],
['Frau Klein','Mir geht es seit heute Morgen sehr schlecht. Ich habe starken Husten, Schnupfen und 39 Grad Fieber. Mein ganzer Körper tut weh.'],
['Apothekerin','39 Grad ist hohes Fieber. Haben Sie die Temperatur gerade gemessen?'],
['Frau Klein','Ja, vor ungefähr zwanzig Minuten. Ich habe zu Hause schon viel Wasser getrunken, aber ich fühle mich immer schwächer.'],
['Apothekerin','Haben Sie Atemprobleme oder sehr starke Schmerzen in der Brust?'],
['Frau Klein','Nein, aber ich bin sehr müde und kann kaum etwas tun.'],
['Apothekerin','Dann sollten Sie heute noch ärztlichen Rat bekommen. Die Apotheke kann Medikamente verkaufen und beraten, aber bei hohem Fieber reicht das nicht immer.'],
['Frau Klein','Kann ich bis dahin etwas gegen das Fieber nehmen?'],
['Apothekerin','Wenn Sie das Medikament vertragen und es für Sie geeignet ist, können Sie ein fiebersenkendes Mittel nach der Packungsangabe nehmen. Ich erkläre Ihnen die Anwendung.'],
['Frau Klein','Danke. Dann rufe ich gleich beim ärztlichen Bereitschaftsdienst an.'],
['Apothekerin','Das ist gut. Bleiben Sie ruhig, trinken Sie weiter und lassen Sie sich helfen, wenn es Ihnen schlechter geht.']
],questions:[
{q:'Welche Beschwerden hat Frau Klein?',a:'Starken Husten, Schnupfen, hohes Fieber und Schmerzen im ganzen Körper',options:['Starken Husten, Schnupfen, hohes Fieber und Schmerzen im ganzen Körper','Nur Schnupfen','Nur Rückenschmerzen','Sonnenbrand']},
{q:'Warum reicht die Beratung in der Apotheke nicht?',a:'Weil Frau Klein 39 Grad Fieber hat und sich sehr schlecht fühlt',options:['Weil Frau Klein 39 Grad Fieber hat und sich sehr schlecht fühlt','Weil sie keine Hausnummer kennt','Weil sie keine Salbe möchte','Weil die Apotheke geschlossen ist']},
{q:'Was macht Frau Klein nach dem Gespräch?',a:'Sie ruft beim ärztlichen Bereitschaftsdienst an',options:['Sie ruft beim ärztlichen Bereitschaftsdienst an','Sie geht zur Arbeit','Sie macht Sport','Sie fährt in Urlaub']}
]}
];
})();
