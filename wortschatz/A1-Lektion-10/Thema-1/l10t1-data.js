(function(){
'use strict';
const BUNNY='https://sprachpilot.b-cdn.net/';
const MEANING={
 mund:'Mit diesem Körperteil spreche, esse und trinke ich.',
 arm:'Dieser Körperteil geht von der Schulter bis zur Hand.',
 ohr:'Mit diesem Körperteil höre ich.',
 auge:'Mit diesem Körperteil sehe ich.',
 zahn:'Dieser Körperteil ist im Mund und hilft beim Kauen.',
 fuss:'Dieser Körperteil ist unten am Bein. Darauf stehe ich.',
 hand:'Mit diesem Körperteil greife und schreibe ich.',
 kopf:'Dieser Körperteil ist ganz oben. Dort sind Augen, Nase und Mund.',
 nase:'Mit diesem Körperteil rieche ich.',
 bein:'Mit diesem Körperteil gehe und stehe ich. Unten ist der Fuß.',
 hals:'Dieser Körperteil verbindet den Kopf mit dem Körper.',
 ruecken:'Dieser Körperteil ist hinten zwischen Nacken und Po.',
 bauch:'Dieser Körperteil ist vorne unter der Brust.',
 knie:'Dieser Körperteil ist in der Mitte des Beins. Beim Sitzen beuge ich ihn.',
 nacken:'Dieser Körperteil ist hinten zwischen Kopf und Rücken.',
 po:'Auf diesem Körperteil sitze ich.',
 gesicht:'Augen, Nase und Mund sind in diesem Körperbereich.',
 haar:'Es wächst auf dem Kopf.',
 augenbraue:'Sie ist direkt über dem Auge.',
 stirn:'Sie ist über den Augen und unter den Haaren.',
 wimper:'Diese kleinen Haare sind am Augenlid.',
 zunge:'Sie ist im Mund. Mit ihr schmecke ich.',
 backe:'Sie ist rechts oder links im Gesicht neben dem Mund.',
 lippe:'Sie ist oben oder unten am Mund.',
 kinn:'Es ist direkt unter dem Mund.',
 augenlid:'Es liegt über dem Auge und kann das Auge schließen.',
 schnurrbart:'Das sind Haare zwischen Nase und Mund.',
 bart:'Das sind Haare im Gesicht, besonders am Kinn und an den Backen.',
 zeh:'Er ist am Fuß. Ein Fuß hat fünf davon.',
 ellbogen:'Dieser Körperteil ist in der Mitte des Arms. Dort beuge ich den Arm.',
 brust:'Sie ist vorne am Oberkörper über dem Bauch.',
 finger:'Er ist an der Hand. Eine Hand hat fünf davon.',
 schulter:'Sie ist zwischen Hals und Arm.',
 nagel:'Er ist am Ende eines Fingers oder Zehs.'
};
const GAP={
 mund:'Zum Sprechen öffne ich den ___.',arm:'Ich trage die Tasche mit dem ___.',ohr:'Mit dem ___ höre ich Musik.',auge:'Mit dem ___ sehe ich die Tafel.',zahn:'Der ___ ist weiß.',fuss:'Der Schuh ist am ___.',hand:'Ich schreibe mit der ___.',kopf:'Die Mütze ist auf dem ___.',nase:'Mit der ___ rieche ich.',bein:'Beim Gehen bewege ich das ___.',hals:'Der Schal ist um den ___.',ruecken:'Der Rucksack liegt auf dem ___.',bauch:'Nach dem Essen ist mein ___ voll.',knie:'Beim Sitzen beuge ich das ___.',nacken:'Nach langer Arbeit tut mein ___ weh.',po:'Ich sitze auf dem ___.',gesicht:'Ich wasche morgens mein ___.',haar:'Auf meinem Pullover liegt ein ___.',augenbraue:'Über dem Auge ist die ___.',stirn:'Die ___ ist über den Augen.',wimper:'Am Auge sehe ich eine ___.',zunge:'Beim Arzt zeige ich die ___.',backe:'Die linke ___ ist rot.',lippe:'Die obere ___ ist trocken.',kinn:'Der Bart wächst am ___.',augenlid:'Beim Schlafen ist das ___ geschlossen.',schnurrbart:'Er trägt einen ___ unter der Nase.',bart:'Mein Opa hat einen langen ___.',zeh:'Am Fuß ist ein ___ verletzt.',ellbogen:'Ich stütze den ___ auf den Tisch.',brust:'Der Arzt hört die ___ ab.',finger:'Ich zeige mit dem ___.',schulter:'Die Tasche hängt an der ___.',nagel:'Am Finger ist der ___ kurz.'
};
const card=(id,full,term,plural)=>({id,full,term,word:term,plural,article:full.split(' ')[0],type:'noun',image:BUNNY+id+'.webp',imageKey:id,meaning:MEANING[id],gap:GAP[id]});
const cards=[
 card('mund','der Mund','Mund','die Münder'),card('arm','der Arm','Arm','die Arme'),card('ohr','das Ohr','Ohr','die Ohren'),card('auge','das Auge','Auge','die Augen'),card('zahn','der Zahn','Zahn','die Zähne'),card('fuss','der Fuß','Fuß','die Füße'),card('hand','die Hand','Hand','die Hände'),card('kopf','der Kopf','Kopf','die Köpfe'),card('nase','die Nase','Nase','die Nasen'),card('bein','das Bein','Bein','die Beine'),card('hals','der Hals','Hals','die Hälse'),card('ruecken','der Rücken','Rücken','die Rücken'),card('bauch','der Bauch','Bauch','die Bäuche'),card('knie','das Knie','Knie','die Knie'),card('nacken','der Nacken','Nacken','die Nacken'),card('po','der Po','Po','die Pos'),card('gesicht','das Gesicht','Gesicht','die Gesichter'),card('haar','das Haar','Haar','die Haare'),card('augenbraue','die Augenbraue','Augenbraue','die Augenbrauen'),card('stirn','die Stirn','Stirn','die Stirnen'),card('wimper','die Wimper','Wimper','die Wimpern'),card('zunge','die Zunge','Zunge','die Zungen'),card('backe','die Backe','Backe','die Backen'),card('lippe','die Lippe','Lippe','die Lippen'),card('kinn','das Kinn','Kinn','die Kinne'),card('augenlid','das Augenlid','Augenlid','die Augenlider'),card('schnurrbart','der Schnurrbart','Schnurrbart','die Schnurrbärte'),card('bart','der Bart','Bart','die Bärte'),card('zeh','der Zeh','Zeh','die Zehen'),card('ellbogen','der Ellbogen','Ellbogen','die Ellbogen'),card('brust','die Brust','Brust','die Brüste'),card('finger','der Finger','Finger','die Finger'),card('schulter','die Schulter','Schulter','die Schultern'),card('nagel','der Nagel','Nagel','die Nägel')
];
const tasks=[
{id:'karteikarten',kind:'cards',title:'Karteikarten',icon:'🃏',text:'Lerne alle Körperteile.'},
{id:'bild-wort',kind:'cards',title:'Bild – 4 Antworten',icon:'🖼️',text:'Sieh das Bild und wähle das richtige Wort.'},
{id:'wort-bild',kind:'cards',title:'Wort – 4 Bilder',icon:'🔎',text:'Lies das Wort und wähle das richtige Bild.'},
{id:'artikel',kind:'cards',title:'Artikel wählen',icon:'🔤',text:'Sieh das Bild und wähle den richtigen Artikel.'},
{id:'plural',kind:'cards',title:'Plural schreiben',icon:'🔢',text:'Sieh das Bild und schreibe die richtige Pluralform.'},
{id:'hoeren-bild',kind:'cards',title:'Hören – Bild wählen',icon:'🎧',text:'Höre das Wort und wähle das richtige Bild.'},
{id:'hoeren-schreiben',kind:'cards',title:'Hören – schreiben',icon:'✍️',text:'Höre das Wort und schreibe es.'},
{id:'memory',kind:'cards',title:'Memory',icon:'🧩',text:'Finde die passenden Paare aus Bild und Wort.'},
{id:'lueckentext',kind:'cards',title:'Lückentext',icon:'📝',text:'Ergänze das passende Körperteil.'},
{id:'bedeutung-waehlen',kind:'cards',title:'Bedeutung – Wort wählen',icon:'💡',text:'Lies die Bedeutung und wähle das richtige Wort.'},
{id:'bedeutung-schreiben',kind:'cards',title:'Bedeutung – Wort schreiben',icon:'⌨️',text:'Lies die Bedeutung und schreibe das passende Wort.'},
{id:'artikel-dialoge',kind:'cards',title:'Artikel in Dialogen',icon:'💬',text:'Ergänze den richtigen Artikel. Entscheide selbst: bestimmt oder unbestimmt, Nominativ oder Akkusativ.'},
{id:'pruefung',kind:'exam',exam:true,title:'Prüfung',icon:'⭐',text:'Prüfe deinen Wortschatz aus dem ganzen Thema.'}
];
const articleDialogs=[
{id:'mund',answer:'einen',case:'Akkusativ',type:'unbestimmt',html:'A: Was hat das Kind?\nB: Es hat ___ Mund voller Schokolade.'},
{id:'arm',answer:'der',case:'Nominativ',type:'bestimmt',html:'A: Welcher Körperteil tut dir weh?\nB: ___ Arm tut mir weh.'},
{id:'ohr',answer:'ein',case:'Nominativ',type:'unbestimmt',html:'A: Was ist auf dem Bild?\nB: Da ist ___ Ohr.'},
{id:'auge',answer:'das',case:'Nominativ',type:'bestimmt',html:'A: Welches Auge ist rot?\nB: ___ Auge links ist rot.'},
{id:'zahn',answer:'einen',case:'Akkusativ',type:'unbestimmt',html:'A: Was sieht der Zahnarzt?\nB: Er sieht ___ Zahn mit einem Loch.'},
{id:'fuss',answer:'den',case:'Akkusativ',type:'bestimmt',html:'A: Welchen Fuß soll ich untersuchen?\nB: Bitte untersuchen Sie ___ Fuß rechts.'},
{id:'hand',answer:'eine',case:'Nominativ',type:'unbestimmt',html:'A: Was sieht man unter der Decke?\nB: Da ist ___ Hand.'},
{id:'kopf',answer:'den',case:'Akkusativ',type:'bestimmt',html:'A: Was wäscht er?\nB: Er wäscht ___ Kopf.'},
{id:'nase',answer:'die',case:'Akkusativ',type:'bestimmt',html:'A: Was putzt das Kind?\nB: Es putzt ___ Nase.'},
{id:'bein',answer:'ein',case:'Nominativ',type:'unbestimmt',html:'A: Was ist verletzt?\nB: ___ Bein ist verletzt.'},
{id:'hals',answer:'der',case:'Nominativ',type:'bestimmt',html:'A: Was ist bei dir rot?\nB: ___ Hals ist rot.'},
{id:'ruecken',answer:'den',case:'Akkusativ',type:'bestimmt',html:'A: Was massiert die Frau?\nB: Sie massiert ___ Rücken.'},
{id:'bauch',answer:'einen',case:'Akkusativ',type:'unbestimmt',html:'A: Was malt das Kind auf die Figur?\nB: Es malt ___ Bauch.'},
{id:'knie',answer:'das',case:'Nominativ',type:'bestimmt',html:'A: Welches Knie ist dick?\nB: ___ Knie rechts ist dick.'},
{id:'nacken',answer:'der',case:'Nominativ',type:'bestimmt',html:'A: Was ist nach der Arbeit verspannt?\nB: ___ Nacken ist verspannt.'},
{id:'po',answer:'den',case:'Akkusativ',type:'bestimmt',html:'A: Was setzt das Kind auf den Stuhl?\nB: Es setzt ___ Po auf den Stuhl.'},
{id:'gesicht',answer:'das',case:'Akkusativ',type:'bestimmt',html:'A: Was wäscht sie am Morgen?\nB: Sie wäscht ___ Gesicht.'},
{id:'haar',answer:'ein',case:'Nominativ',type:'unbestimmt',html:'A: Was liegt auf dem Pullover?\nB: Da liegt ___ Haar.'},
{id:'augenbraue',answer:'eine',case:'Akkusativ',type:'unbestimmt',html:'A: Was zeichnet sie zuerst?\nB: Zuerst zeichnet sie ___ Augenbraue.'},
{id:'stirn',answer:'die',case:'Akkusativ',type:'bestimmt',html:'A: Was berührt die Mutter?\nB: Sie berührt ___ Stirn.'},
{id:'wimper',answer:'eine',case:'Akkusativ',type:'unbestimmt',html:'A: Was hat sie im Auge?\nB: Sie hat ___ Wimper im Auge.'},
{id:'zunge',answer:'die',case:'Akkusativ',type:'bestimmt',html:'A: Was soll ich beim Arzt zeigen?\nB: Zeig bitte ___ Zunge.'},
{id:'backe',answer:'eine',case:'Nominativ',type:'unbestimmt',html:'A: Was ist ganz rot?\nB: ___ Backe ist ganz rot.'},
{id:'lippe',answer:'die',case:'Nominativ',type:'bestimmt',html:'A: Welche Lippe ist verletzt?\nB: ___ Lippe unten ist verletzt.'},
{id:'kinn',answer:'das',case:'Akkusativ',type:'bestimmt',html:'A: Was rasiert er?\nB: Er rasiert ___ Kinn.'},
{id:'augenlid',answer:'ein',case:'Nominativ',type:'unbestimmt',html:'A: Was ist geschwollen?\nB: ___ Augenlid ist geschwollen.'},
{id:'schnurrbart',answer:'einen',case:'Akkusativ',type:'unbestimmt',html:'A: Was möchte er wachsen lassen?\nB: Er möchte ___ Schnurrbart wachsen lassen.'},
{id:'bart',answer:'der',case:'Nominativ',type:'bestimmt',html:'A: Was ist jetzt sehr lang?\nB: ___ Bart ist jetzt sehr lang.'},
{id:'zeh',answer:'einen',case:'Akkusativ',type:'unbestimmt',html:'A: Was hat er sich verletzt?\nB: Er hat sich ___ Zeh verletzt.'},
{id:'ellbogen',answer:'den',case:'Akkusativ',type:'bestimmt',html:'A: Was legt er auf den Tisch?\nB: Er legt ___ Ellbogen auf den Tisch.'},
{id:'brust',answer:'die',case:'Akkusativ',type:'bestimmt',html:'A: Was hört der Arzt ab?\nB: Er hört ___ Brust ab.'},
{id:'finger',answer:'ein',case:'Nominativ',type:'unbestimmt',html:'A: Was ist verbunden?\nB: ___ Finger ist verbunden.'},
{id:'schulter',answer:'eine',case:'Akkusativ',type:'unbestimmt',html:'A: Was sieht man auf dem Foto?\nB: Man sieht ___ Schulter.'},
{id:'nagel',answer:'der',case:'Nominativ',type:'bestimmt',html:'A: Welcher Nagel ist kaputt?\nB: ___ Nagel am Daumen ist kaputt.'}
];
window.L10T1={cards,tasks,articleDialogs};
})();
