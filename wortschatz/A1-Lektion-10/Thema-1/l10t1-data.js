(function(){
'use strict';
const BUNNY='https://sprachpilot.b-cdn.net/';
const card=(id,full,term,plural)=>({id,full,term,word:term,plural,type:'noun',image:BUNNY+id+'.webp',imageKey:id});
const cards=[
 card('mund','der Mund','Mund','die Münder'),
 card('arm','der Arm','Arm','die Arme'),
 card('ohr','das Ohr','Ohr','die Ohren'),
 card('auge','das Auge','Auge','die Augen'),
 card('zahn','der Zahn','Zahn','die Zähne'),
 card('fuss','der Fuß','Fuß','die Füße'),
 card('hand','die Hand','Hand','die Hände'),
 card('kopf','der Kopf','Kopf','die Köpfe'),
 card('nase','die Nase','Nase','die Nasen'),
 card('bein','das Bein','Bein','die Beine'),
 card('hals','der Hals','Hals','die Hälse'),
 card('ruecken','der Rücken','Rücken','die Rücken'),
 card('bauch','der Bauch','Bauch','die Bäuche'),
 card('knie','das Knie','Knie','die Knie'),
 card('nacken','der Nacken','Nacken','die Nacken'),
 card('po','der Po','Po','die Pos'),
 card('gesicht','das Gesicht','Gesicht','die Gesichter'),
 card('haar','das Haar','Haar','die Haare'),
 card('augenbraue','die Augenbraue','Augenbraue','die Augenbrauen'),
 card('stirn','die Stirn','Stirn','die Stirnen'),
 card('wimper','die Wimper','Wimper','die Wimpern'),
 card('zunge','die Zunge','Zunge','die Zungen'),
 card('backe','die Backe','Backe','die Backen'),
 card('lippe','die Lippe','Lippe','die Lippen'),
 card('kinn','das Kinn','Kinn','die Kinne'),
 card('augenlid','das Augenlid','Augenlid','die Augenlider'),
 card('schnurrbart','der Schnurrbart','Schnurrbart','die Schnurrbärte'),
 card('bart','der Bart','Bart','die Bärte'),
 card('zeh','der Zeh','Zeh','die Zehen'),
 card('ellbogen','der Ellbogen','Ellbogen','die Ellbogen'),
 card('brust','die Brust','Brust','die Brüste'),
 card('finger','der Finger','Finger','die Finger'),
 card('schulter','die Schulter','Schulter','die Schultern'),
 card('nagel','der Nagel','Nagel','die Nägel')
];
window.L10T1={cards};
})();
