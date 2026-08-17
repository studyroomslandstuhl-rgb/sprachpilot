(function(){
'use strict';
if(window.__SP_L7T2_FIRST_TASKS_V2)return;
window.__SP_L7T2_FIRST_TASKS_V2=true;

const FORMS=[
 ['lernen','gelernt',['gelernen','lernt','gelernet','gelernt'],'lernen.webp'],
 ['machen','gemacht',['gemachen','macht','gemachtet','gemacht'],'machen.webp'],
 ['schreiben','geschrieben',['geschreibt','schreibt','geschreiben','geschrieben'],'schreiben.webp'],
 ['hören','gehört',['gehören','hört','gehöret','gehört'],'hoeren.webp'],
 ['spielen','gespielt',['gespielen','spielt','gespielet','gespielt'],'spielen.webp'],
 ['sehen','gesehen',['geseht','sieht','gesieht','gesehen'],'sehen.webp'],
 ['lesen','gelesen',['gelest','liest','geleset','gelesen'],'lesen.webp'],
 ['kaufen','gekauft',['gekaufen','kauft','gekaufet','gekauft'],'kaufen.webp'],
 ['sprechen','gesprochen',['gesprecht','spricht','gesprechen','gesprochen'],'sprechen.webp'],
 ['arbeiten','gearbeitet',['gearbeiten','arbeitet','gearbetit','gearbeitet'],'arbeiten.webp'],
 ['treffen','getroffen',['getrefft','trifft','getreffen','getroffen'],'treffen.webp'],
 ['frühstücken','gefrühstückt',['gefrühstücken','frühstückt','gefrühstücket','gefrühstückt'],'fruehstuecken.webp'],
 ['schlafen','geschlafen',['geschlaft','schläft','geschläfen','geschlafen'],'schlafen.webp'],
 ['kochen','gekocht',['gekochen','kocht','gekochtet','gekocht'],'kochen.webp'],
 ['essen','gegessen',['geesst','isst','geessen','gegessen'],'essen.webp'],
 ['trinken','getrunken',['getrinkt','trinkt','getrinken','getrunken'],'trinken.webp'],
 ['sagen','gesagt',['gesagen','sagt','gesaget','gesagt'],'sagen.webp'],
 ['leben','gelebt',['geleben','lebt','gelebet','gelebt'],'leben.webp'],
 ['kosten','gekostet',['gekosten','kostet','gekost','gekostet'],'kosten.webp'],
 ['grillen','gegrillt',['gegrillen','grillt','gegrillet','gegrillt'],'grillen.webp'],
 ['suchen','gesucht',['gesuchen','sucht','gesuchet','gesucht'],'suchen.webp'],
 ['wohnen','gewohnt',['gewohnen','wohnt','gewohnet','gewohnt'],'wohnen.webp']
];

const CARD_ITEMS=FORMS.map(([infinitive,participle,,image])=>({
 kind:'cards',
 infinitive,
 participle,
 image,
 prompt:'Wie heißt das Verb im Perfekt?',
 answer:`hat ${participle}`,
 answers:[`hat ${participle}`,`er hat ${participle}`,`sie hat ${participle}`],
 example:`${infinitive} – hat ${participle}`,
 hint:'Das Hilfsverb ist „hat“. Ergänze danach das richtige Partizip II.'
}));

const CHOICE_ITEMS=FORMS.map(([infinitive,answer,options])=>({
 kind:'choice',prompt:infinitive,context:'Welche Perfektform ist richtig?',answer,options,
 hint:'Achte auf die richtige Form des Partizips II.'
}));

const MEMORY_PAIRS=[
 ['machen','gemacht'],['spielen','gespielt'],['lesen','gelesen'],['arbeiten','gearbeitet'],
 ['frühstücken','gefrühstückt'],['kochen','gekocht'],['sagen','gesagt'],['kosten','gekostet'],
 ['suchen','gesucht'],['leben','gelebt'],['schreiben','geschrieben'],['trinken','getrunken']
].map(([infinitive,perfekt],index)=>({id:`paar-${index+1}`,infinitive,perfekt}));

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks)||theme.tasks.length<3)return theme;
 const tasks=[...theme.tasks];
 const cards={...tasks[0],kind:'cards',title:'Karteikarten',description:'Sieh dir das Bild an und nenne das Verb im Perfekt mit haben, zum Beispiel: hat gearbeitet.',items:CARD_ITEMS,spL7T2ImageCards:true};
 const choice={...tasks[1],kind:'choice',title:'Perfektform finden',description:'Du siehst einen Infinitiv. Wähle aus vier ähnlichen Formen die richtige Perfektform.',items:CHOICE_ITEMS,spL7T2Choice:true};
 const memory={...tasks[2],kind:'memory-pairs',title:'Infinitiv & Perfekt – Memory',description:'Finde die passenden Paare: Infinitiv und Partizip II.',items:MEMORY_PAIRS,spL7T2Memory:true};
 tasks[0]=cards;tasks[1]=choice;tasks[2]=memory;
 tasks.forEach((task,index)=>task.order=index+1);
 theme.tasks=tasks;
 theme.contentRevision='l7t2-first-three-20260817-v2';
 window.L7_THEME=theme;
 return theme;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();