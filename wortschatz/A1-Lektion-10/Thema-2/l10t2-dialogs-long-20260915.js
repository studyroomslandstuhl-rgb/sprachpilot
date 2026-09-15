(function(){
'use strict';
if(window.__SP_L10T2_DIALOGS_LONG_20260915)return;window.__SP_L10T2_DIALOGS_LONG_20260915=true;
const D=window.L10T2;if(!D)return;
const t=(D.tasks||[]).find(x=>x.id==='apotheke-dialoge-hoeren');
if(t)Object.assign(t,{title:'Apotheke – Dialog',cardText:'Höre einen langen Dialog in der Apotheke und beantworte 10 Fragen.',text:'Höre den Dialog in der Apotheke. Beantworte die 10 Fragen.'});
D.pharmacyDialogues=[{
id:'apo-lang-1',
audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-lang-1.mp3',
lines:[
['Apothekerin','Guten Tag. Was kann ich für Sie tun?'],
['Frau Berger','Guten Tag. Mir geht es seit gestern nicht gut. Ich habe Kopfschmerzen, Halsschmerzen und Schnupfen. Meine Nase läuft und ich huste auch ein bisschen.'],
['Apothekerin','Haben Sie Fieber?'],
['Frau Berger','Heute Morgen hatte ich 38,2 Grad. Jetzt weiß ich es nicht genau. Mein Hals tut besonders beim Schlucken weh und beim Husten habe ich manchmal Schmerzen in der Brust.'],
['Apothekerin','38,2 Grad ist schon Fieber. Haben Sie starke Schmerzen in der Brust oder Probleme beim Atmen?'],
['Frau Berger','Nein, beim Atmen habe ich keine Probleme. Die Schmerzen kommen nur, wenn ich viel huste.'],
['Apothekerin','Gut. Dann kann ich Sie hier beraten. Gegen die Kopfschmerzen können Sie Schmerztabletten nehmen. Nehmen Sie die Tabletten mit Wasser und nur so, wie es auf der Packung steht.'],
['Frau Berger','Ich nehme morgens schon andere Tabletten. Kann ich diese Schmerztabletten trotzdem verwenden?'],
['Apothekerin','Welche Medizin nehmen Sie? Zeigen Sie mir bitte die Packung.'],
['Frau Berger','Hier. Diese Tabletten nehme ich jeden Morgen.'],
['Apothekerin','Danke. Diese Medikamente können zusammen genommen werden. Für den Hals können Sie außerdem warmen Tee trinken und sich ruhig verhalten.'],
['Frau Berger','Und was kann ich gegen den Husten und den Schnupfen tun?'],
['Apothekerin','Trinken Sie viel. Bei Schnupfen hilft oft auch Ruhe. Gegen den Husten kann ich Ihnen einen Hustensaft geben. Verwenden Sie ihn nach der Packungsangabe.'],
['Frau Berger','Ich muss morgen eigentlich arbeiten. Meinen Sie, ich kann zur Arbeit gehen?'],
['Apothekerin','Bei Fieber und wenn Sie sich so schlecht fühlen, sollten Sie zu Hause bleiben und sich ausruhen. Wenn das Fieber über 38 Grad bleibt oder höher wird, sollten Sie zum Arzt gehen.'],
['Frau Berger','Ich habe auch eine rote Stelle am Arm. Ich war am Wochenende lange in der Sonne.'],
['Apothekerin','Das sieht nach einem leichten Sonnenbrand aus. Kühlen Sie die Haut vorsichtig. Sie können auch diese Salbe verwenden. Tragen Sie sie dünn auf.'],
['Frau Berger','Wie oft soll ich die Salbe benutzen?'],
['Apothekerin','Zweimal am Tag reicht. Nehmen Sie bitte kein Eis direkt auf die Haut.'],
['Frau Berger','Also Schmerztabletten mit Wasser, Hustensaft nach der Packungsangabe, viel trinken, die Haut kühlen und die Salbe zweimal am Tag verwenden?'],
['Apothekerin','Genau. Und bleiben Sie heute ruhig. Wenn das Fieber steigt, die Schmerzen in der Brust stark werden oder Sie Atemprobleme bekommen, gehen Sie bitte sofort zum Arzt.'],
['Frau Berger','Gut. Dann mache ich das so. Vielen Dank für die Beratung.'],
['Apothekerin','Gern. Gute Besserung!']
],
questions:[
{q:'Welche Beschwerden hat Frau Berger am Anfang?',a:'Kopfschmerzen, Halsschmerzen, Schnupfen und Husten',options:['Kopfschmerzen, Halsschmerzen, Schnupfen und Husten','Nur Rückenschmerzen','Nur Zahnschmerzen','Sonnenbrand und Bauchschmerzen']},
{q:'Wie hoch war ihre Temperatur am Morgen?',a:'38,2 Grad',options:['38,2 Grad','36,2 Grad','39,8 Grad','37,0 Grad']},
{q:'Wann hat Frau Berger Schmerzen in der Brust?',a:'Wenn sie viel hustet',options:['Wenn sie viel hustet','Wenn sie geht','Wenn sie Tee trinkt','Wenn sie schläft']},
{q:'Was empfiehlt die Apothekerin gegen die Kopfschmerzen?',a:'Schmerztabletten mit Wasser nehmen',options:['Schmerztabletten mit Wasser nehmen','Eine Salbe auf den Kopf geben','Sport machen','Nichts trinken']},
{q:'Warum zeigt Frau Berger der Apothekerin eine Packung?',a:'Weil sie schon andere Tabletten nimmt',options:['Weil sie schon andere Tabletten nimmt','Weil sie die Postleitzahl sucht','Weil die Salbe leer ist','Weil sie ein Attest braucht']},
{q:'Was bekommt Frau Berger gegen den Husten?',a:'Hustensaft',options:['Hustensaft','Eine Spritze','Ein Attest','Eine Krankmeldung']},
{q:'Was soll Frau Berger wegen des Fiebers und ihres Zustands machen?',a:'Zu Hause bleiben und sich ausruhen',options:['Zu Hause bleiben und sich ausruhen','Zur Arbeit gehen','Fußball spielen','Schwere Sachen tragen']},
{q:'Was hat Frau Berger außerdem am Arm?',a:'Einen leichten Sonnenbrand',options:['Einen leichten Sonnenbrand','Eine offene Wunde','Einen Knochenbruch','Schnupfen']},
{q:'Wie oft soll sie die Salbe verwenden?',a:'Zweimal am Tag',options:['Zweimal am Tag','Einmal pro Woche','Jede Stunde','Gar nicht']},
{q:'Wann soll Frau Berger sofort zum Arzt gehen?',a:'Wenn das Fieber steigt, die Brustschmerzen stark werden oder Atemprobleme kommen',options:['Wenn das Fieber steigt, die Brustschmerzen stark werden oder Atemprobleme kommen','Wenn sie Tee trinkt','Wenn die Apotheke schließt','Wenn sie schlafen möchte']}
]
}];
})();
