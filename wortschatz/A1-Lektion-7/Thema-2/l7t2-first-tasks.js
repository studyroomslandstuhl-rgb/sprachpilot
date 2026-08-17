(function(){
'use strict';
if(window.__SP_L7T2_FIRST_TASKS_V1)return;
window.__SP_L7T2_FIRST_TASKS_V1=true;

const FORMS=[
 ['lernen','gelernt',['gelernen','lernt','gelernet','gelernt']],
 ['machen','gemacht',['gemachen','macht','gemachtet','gemacht']],
 ['schreiben','geschrieben',['geschreibt','schreibt','geschreiben','geschrieben']],
 ['hören','gehört',['gehören','hört','gehöret','gehört']],
 ['spielen','gespielt',['gespielen','spielt','gespielet','gespielt']],
 ['sehen','gesehen',['geseht','sieht','gesieht','gesehen']],
 ['lesen','gelesen',['gelest','liest','geleset','gelesen']],
 ['kaufen','gekauft',['gekaufen','kauft','gekaufet','gekauft']],
 ['sprechen','gesprochen',['gesprecht','spricht','gesprechen','gesprochen']],
 ['arbeiten','gearbeitet',['gearbeiten','arbeitet','gearbetit','gearbeitet']],
 ['treffen','getroffen',['getrefft','trifft','getreffen','getroffen']],
 ['frühstücken','gefrühstückt',['gefrühstücken','frühstückt','gefrühstücket','gefrühstückt']],
 ['schlafen','geschlafen',['geschlaft','schläft','geschläfen','geschlafen']],
 ['kochen','gekocht',['gekochen','kocht','gekochtet','gekocht']],
 ['essen','gegessen',['geesst','isst','geessen','gegessen']],
 ['trinken','getrunken',['getrinkt','trinkt','getrinken','getrunken']],
 ['sagen','gesagt',['gesagen','sagt','gesaget','gesagt']],
 ['leben','gelebt',['geleben','lebt','gelebet','gelebt']],
 ['kosten','gekostet',['gekosten','kostet','gekost','gekostet']],
 ['grillen','gegrillt',['gegrillen','grillt','gegrillet','gegrillt']],
 ['suchen','gesucht',['gesuchen','sucht','gesuchet','gesucht']],
 ['wohnen','gewohnt',['gewohnen','wohnt','gewohnet','gewohnt']]
];

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
 const cards={...tasks[0]};
 cards.kind='cards';
 cards.title='Karteikarten';
 cards.description='Lerne Infinitiv und Partizip II nach dem SprachPilot-Karteikartenstandard.';

 const choice={...tasks[1],kind:'choice',title:'Perfektform finden',description:'Du siehst einen Infinitiv. Wähle aus vier ähnlichen Formen die richtige Perfektform.',items:CHOICE_ITEMS,spL7T2Choice:true};
 const memory={...tasks[2],kind:'memory-pairs',title:'Infinitiv & Perfekt – Memory',description:'Finde die passenden Paare: Infinitiv und Partizip II.',items:MEMORY_PAIRS,spL7T2Memory:true};
 tasks[0]=cards;tasks[1]=choice;tasks[2]=memory;
 tasks.forEach((task,index)=>task.order=index+1);
 theme.tasks=tasks;
 theme.contentRevision='l7t2-first-three-20260817-v1';
 window.L7_THEME=theme;
 return theme;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();