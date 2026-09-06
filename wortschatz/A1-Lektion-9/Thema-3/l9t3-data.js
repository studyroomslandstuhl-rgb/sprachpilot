(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const media=id=>({image:`${CDN}${id}.webp`,audio:`${AUDIO}${id}.mp3`});
const noun=(id,article,word,plural,example)=>({id,article,word,full:`${article} ${word}`,plural,type:'noun',example,...media(id)});
const word=(id,value,type,opts={})=>({id,word:value,full:value,article:'',plural:'',perfect:opts.perfect||'',type,example:opts.example||'',...media(id),...(opts.media||{})});
const cards=[
 word('international','international','adjective',{example:'Das ist ein internationaler Flughafen.'}),
 word('beantragen','beantragen','verb',{perfect:'hat beantragt',example:'Ich möchte ein Visum beantragen.'}),
 noun('zigarette','die','Zigarette','die Zigaretten','Hier darf man keine Zigarette rauchen.'),
 word('ausmachen','ausmachen','verb',{perfect:'hat ausgemacht',example:'Machen Sie bitte das Handy aus.'}),
 word('langsam','langsam','adverb',{example:'Fahren Sie bitte langsam.'}),
 noun('parkplatz','der','Parkplatz','die Parkplätze','Hier ist ein Parkplatz.'),
 word('parken','parken','verb',{perfect:'hat geparkt',example:'Darf man hier parken?'}),
 word('abgeben','abgeben','verb',{perfect:'hat abgegeben',example:'Man muss das Gepäck abgeben.'}),
 noun('laptop','der','Laptop','die Laptops','Der Laptop ist im Gepäck.'),
 noun('gepaeck','das','Gepäck','kein Plural','Das Gepäck ist schwer.'),
 word('rauchen','rauchen','verb',{perfect:'hat geraucht',example:'Man darf hier nicht rauchen.'}),
 noun('moment','der','Moment','die Momente','Einen Moment, bitte.'),
 word('achtung','Achtung!','interjection',{example:'Achtung! Hier darf man nicht rauchen.'}),
 word('erlaubt','erlaubt','adjective',{example:'Parken ist hier erlaubt.'}),
 word('verboten','verboten','adjective',{example:'Rauchen ist hier verboten.'}),
 word('gepaeck_abgeben','Gepäck abgeben','phrase',{perfect:'hat Gepäck abgegeben',example:'Man muss das Gepäck abgeben.',media:{image:`${CDN}abgeben.webp`,audio:''}}),
 word('mitnehmen','mitnehmen','verb',{perfect:'hat mitgenommen',example:'Darf ich den Laptop mitnehmen?'})
];
window.L9T3={title:'Was darf man?',cards};window.L9_T3_WORDS=cards;if(window.L9_THEMES?.[3])window.L9_THEMES[3].coreVocabulary=cards;
})();