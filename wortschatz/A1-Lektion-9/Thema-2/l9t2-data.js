(function(){
'use strict';
const core=window.L9_THEMES?.[2]?.coreVocabulary||window.L9_T2_WORDS||[];
const MEANINGS={
 leiser:'Nicht so laut. Die Stimme oder ein Geräusch soll weniger laut sein.',
 erklaeren:'Man sagt etwas so, dass eine andere Person es besser verstehen kann.',
 laut:'Mit viel Lautstärke. Man kann es deutlich hören.',
 ausmachen:'Ein Gerät oder Licht ausschalten. Danach ist es nicht mehr an.',
 zuhoeren:'Man hört aufmerksam, was eine andere Person sagt.',
 aufstehen:'Man sitzt oder liegt und kommt dann nach oben auf die Füße.',
 warten:'Man bleibt eine Zeit lang, bis etwas passiert oder jemand kommt.',
 gebuehr:'Geld, das man für eine bestimmte Leistung oder einen offiziellen Vorgang bezahlt.',
 kasse:'Der Ort, an dem man bezahlt.',
 lachen:'Man zeigt mit Stimme und Gesicht, dass etwas lustig ist oder man sich freut.',
 aufhoeren:'Man beendet eine Handlung und macht nicht weiter.',
 doch:'Ein kleines Wort, das eine Bitte oder Aufforderung freundlicher oder nachdrücklicher machen kann.',
 bitte:'Ein höfliches Wort für Bitten und Aufforderungen.',
 mal:'Ein kleines Wort, das eine Aufforderung im Alltag oft natürlicher und lockerer macht.',
 anmeldung:'Man meldet sich offiziell für etwas an und gibt dafür seine Daten an.',
 kursgebuehr:'Das Geld, das man für einen Kurs bezahlen muss.',
 stock:'Eine Etage in einem Gebäude.',
 unterricht:'Die Zeit, in der eine Lehrkraft mit Lernenden arbeitet und etwas erklärt oder übt.',
 sprachschule:'Eine Schule, in der man eine Sprache lernt.'
};
const cards=core.map(item=>({
 ...item,
 image:item.image||`https://sprachpilot.b-cdn.net/${item.id}.webp`,
 audio:item.audio||`https://sprachpilot.b-cdn.net/audio/${item.id}.mp3`,
 meaning:MEANINGS[item.id]||item.example||'',
 answers:[item.full||item.word].filter(Boolean)
}));
window.L9_THEME=window.L9_THEMES?.[2]||null;
window.L9T2={
 title:'Mach das bitte!',
 cards,
 tasks:[{
  id:'karteikarten',
  kind:'cards',
  title:'Karteikarten',
  description:'Lerne die Wörter.',
  instruction:'Lerne die Wörter.',
  icon:'🃏'
 }]
};
})();