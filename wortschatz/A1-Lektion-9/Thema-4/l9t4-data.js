(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const media=id=>({image:`${CDN}${id}.webp`,audio:`${AUDIO}${id}.mp3`});
const noun=(id,article,word,plural,example)=>({id,article,word,full:`${article} ${word}`,plural,type:'noun',example,...media(id)});
const word=(id,value,type,opts={})=>({id,word:value,full:value,article:'',plural:'',perfect:opts.perfect||'',type,example:opts.example||'',...media(id)});
const cards=[
 word('allein','allein','adverb',{example:'Die Person kommt allein.'}),
 noun('behoerde','die','Behörde','die Behörden','Ich habe einen Termin bei der Behörde.'),
 noun('person','die','Person','die Personen','Die Person wartet am Schalter.'),
 noun('geburtsname','der','Geburtsname','die Geburtsnamen','Wie ist Ihr Geburtsname?'),
 noun('geschlecht','das','Geschlecht','die Geschlechter','Bitte geben Sie Ihr Geschlecht an.'),
 noun('auslaender','der','Ausländer','die Ausländer','Der Ausländer braucht eine Auskunft.'),
 noun('auslaenderin','die','Ausländerin','die Ausländerinnen','Die Ausländerin wartet bei der Behörde.'),
 word('maennlich','männlich','adjective',{example:'Geschlecht: männlich.'}),
 word('weiblich','weiblich','adjective',{example:'Geschlecht: weiblich.'}),
 noun('angehoeriger','der','Angehörige','die Angehörigen','Mein Angehöriger kommt mit.'),
 noun('angehoerige','die','Angehörige','die Angehörigen','Meine Angehörige kommt mit.'),
 word('bedeuten','bedeuten','verb',{perfect:'hat bedeutet',example:'Was bedeutet das?'}),
 word('wiederholen','wiederholen','verb',{perfect:'hat wiederholt',example:'Können Sie das bitte wiederholen?'}),
 word('verstehen','verstehen','verb',{perfect:'hat verstanden',example:'Ich verstehe das nicht.'}),
 word('sprachschule_besuchen','die Sprachschule besuchen','phrase',{perfect:'hat die Sprachschule besucht',example:'Ich besuche eine Sprachschule.'}),
 word('helfen','helfen','verb',{perfect:'hat geholfen',example:'Können Sie mir helfen?'}),
 noun('auskunft','die','Auskunft','die Auskünfte','Ich brauche eine Auskunft.'),
 noun('erlaubnis','die','Erlaubnis','die Erlaubnisse','Ich brauche eine Erlaubnis.'),
 noun('erklaerung','die','Erklärung','die Erklärungen','Ich brauche eine Erklärung.'),
 noun('dokument','das','Dokument','die Dokumente','Das Dokument ist wichtig.'),
 noun('geld','das','Geld','kein Plural','Ich habe genug Geld.'),
 word('genug','genug','adverb',{example:'Ich habe genug Geld.'}),
 noun('einkommen','das','Einkommen','die Einkommen','Wie hoch ist Ihr Einkommen?'),
 noun('reise','die','Reise','die Reisen','Die Reise ist im Juli.'),
 noun('versicherung','die','Versicherung','die Versicherungen','Ich habe eine Versicherung.'),
 noun('botschaft','die','Botschaft','die Botschaften','Ich habe einen Termin bei der Botschaft.'),
 noun('visum','das','Visum','die Visa','Ich brauche ein Visum.'),
 noun('mitarbeiter','der','Mitarbeiter','die Mitarbeiter','Der Mitarbeiter hilft mir.'),
 noun('mitarbeiterin','die','Mitarbeiterin','die Mitarbeiterinnen','Die Mitarbeiterin erklärt das Formular.'),
 noun('beamter','der','Beamte','die Beamten','Der Beamte arbeitet bei der Behörde.'),
 noun('beamtin','die','Beamtin','die Beamtinnen','Die Beamtin gibt eine Auskunft.'),
 word('verdienen','verdienen','verb',{perfect:'hat verdient',example:'Wie viel verdienen Sie?'}),
 noun('reisepass','der','Reisepass','die Reisepässe','Bitte bringen Sie Ihren Reisepass mit.'),
 word('reisen','reisen','verb',{perfect:'ist gereist',example:'Ich reise im Sommer.'}),
 word('bisherige','bisherige','adjective',{example:'Wie ist Ihre bisherige Adresse?'}),
 noun('familienstand','der','Familienstand','die Familienstände','Wie ist Ihr Familienstand?'),
 noun('verpflichtungserklaerung','die','Verpflichtungserklärung','die Verpflichtungserklärungen','Ich brauche eine Verpflichtungserklärung.'),
 noun('einkommensnachweis','der','Einkommensnachweis','die Einkommensnachweise','Bitte bringen Sie einen Einkommensnachweis mit.'),
 word('kennenlernen','kennenlernen','verb',{perfect:'hat kennengelernt',example:'Ich habe meine Frau in Deutschland kennengelernt.'}),
 word('schriftlich','schriftlich','adjective',{example:'Bitte geben Sie die Antwort schriftlich.'}),
 word('muendlich','mündlich','adjective',{example:'Die Prüfung ist mündlich.'}),
 word('hoffentlich','hoffentlich','adverb',{example:'Hoffentlich bekomme ich das Visum.'}),
 word('zum_glueck','zum Glück','phrase',{example:'Zum Glück habe ich alle Dokumente.'}),
 word('endlich','endlich','adverb',{example:'Endlich habe ich das Visum.'})
];
const practicePhrases=['Darf ich etwas fragen?','Können Sie mir helfen?','Helfen Sie mir?','Ich brauche eine Auskunft.','Ich verstehe nicht.','Das habe ich nicht verstanden.','Ich kann noch nicht so gut Deutsch.','Was heißt das?','Was bedeutet das?','Können Sie mir bitte erklären?','Können Sie bitte wiederholen?','Wie bitte?','Noch einmal bitte.'];
window.L9T4={title:'Bei der Behörde',cards,practicePhrases};window.L9_T4_WORDS=cards;if(window.L9_THEMES?.[4]){window.L9_THEMES[4].coreVocabulary=cards;window.L9_THEMES[4].practicePhrases=practicePhrases;window.L9_THEMES[4].examples=practicePhrases;window.L9_THEMES[4].subtitle='Personendaten · Auskunft · Reisepass · Visum · verstehen und nachfragen';window.L9_THEMES[4].chips=['Personendaten','Auskunft','Reisepass','Visum','nachfragen'];}
})();