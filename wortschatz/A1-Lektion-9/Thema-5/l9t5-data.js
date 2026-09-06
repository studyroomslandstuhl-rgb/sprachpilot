(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const removed=new Set(['buergeramt','fahrerlaubnisbehoerde','wohnungsgeberbestaetigung','steuer_id','fahrzeugpapiere','versicherungsnachweis']);
const base=(window.L9_THEMES?.[5]?.coreVocabulary||window.L9_T5_WORDS||[]).filter(x=>!removed.has(x.id));
const phrase=(id,full,example,asset=id)=>({id,word:full,full,article:'',plural:'',type:'phrase',example,image:`${CDN}${asset}.webp`,audio:`${AUDIO}${asset}.mp3`});
const phrases=[
 phrase('fuehrerschein_beantragen','einen Führerschein beantragen','Ich möchte einen Führerschein beantragen.','fuehrerschein'),
 phrase('einen_antrag_ausfuellen','einen Antrag ausfüllen','Ich muss einen Antrag ausfüllen.','einen_antrag_ausfuellen'),
 phrase('ausweis_mitbringen','den Ausweis mitbringen','Bitte bringen Sie den Ausweis mit.','ausweis'),
 phrase('reisepass_mitbringen','den Reisepass mitbringen','Bitte bringen Sie den Reisepass mit.','reisepass'),
 phrase('viele_papiere_mitbringen','viele Papiere mitbringen','Ich muss viele Papiere mitbringen.','papiere'),
 phrase('antrag_abgeben','einen Antrag abgeben','Ich muss den Antrag am Schalter abgeben.','antrag'),
 phrase('dokument_unterschreiben','ein Dokument unterschreiben','Bitte unterschreiben Sie das Dokument.','dokument'),
 phrase('gebuehr_zahlen','eine Gebühr zahlen','Ich muss eine Gebühr zahlen.','gebuehr'),
 phrase('visum_bekommen','ein Visum bekommen','Ich möchte ein Visum bekommen.','visum')
];
const cards=[...base,...phrases];
window.L9T5={title:'Welche Behörde brauche ich?',cards,phrases};
window.L9_T5_WORDS=cards;
if(window.L9_THEMES?.[5])window.L9_THEMES[5].coreVocabulary=cards;
})();