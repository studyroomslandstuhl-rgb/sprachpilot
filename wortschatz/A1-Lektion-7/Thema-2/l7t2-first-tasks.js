(function(){
'use strict';
if(window.__SP_L7T2_TASKS_V5)return;
window.__SP_L7T2_TASKS_V5=true;

const FORMS=[
 {v:'lernen',p:'gelernt',img:'lernen.webp',group:'t',parts:['ge','lern','t'],wrong:['gelernen','lernt','gelernet','gelernt'],en:'learned'},
 {v:'machen',p:'gemacht',img:'machen.webp',group:'t',parts:['ge','mach','t'],wrong:['gemachen','macht','gemachtet','gemacht'],en:'made'},
 {v:'schreiben',p:'geschrieben',img:'schreiben.webp',group:'en',parts:['ge','schrie','ben'],wrong:['geschreibt','schreibt','geschreiben','geschrieben'],en:'wrote'},
 {v:'hören',p:'gehört',img:'hoeren.webp',group:'t',parts:['ge','hör','t'],wrong:['gehören','hört','gehöret','gehört'],en:'heard'},
 {v:'spielen',p:'gespielt',img:'spielen.webp',group:'t',parts:['ge','spiel','t'],wrong:['gespielen','spielt','gespielet','gespielt'],en:'played'},
 {v:'sehen',p:'gesehen',img:'sehen.webp',group:'en',parts:['ge','seh','en'],wrong:['geseht','sieht','gesieht','gesehen'],en:'saw'},
 {v:'lesen',p:'gelesen',img:'lesen.webp',group:'en',parts:['ge','les','en'],wrong:['gelest','liest','geleset','gelesen'],en:'read'},
 {v:'kaufen',p:'gekauft',img:'kaufen.webp',group:'t',parts:['ge','kauf','t'],wrong:['gekaufen','kauft','gekaufet','gekauft'],en:'bought'},
 {v:'sprechen',p:'gesprochen',img:'sprechen.webp',group:'en',parts:['ge','sproch','en'],wrong:['gesprecht','spricht','gesprechen','gesprochen'],en:'spoke'},
 {v:'arbeiten',p:'gearbeitet',img:'arbeiten.webp',group:'t',parts:['ge','arbeit','et'],wrong:['gearbeiten','arbeitet','gearbetit','gearbeitet'],en:'worked'},
 {v:'treffen',p:'getroffen',img:'treffen.webp',group:'en',parts:['ge','troff','en'],wrong:['getrefft','trifft','getreffen','getroffen'],en:'met'},
 {v:'frühstücken',p:'gefrühstückt',img:'fruehstuecken.webp',group:'t',parts:['ge','frühstück','t'],wrong:['gefrühstücken','frühstückt','gefrühstücket','gefrühstückt'],en:'had breakfast'},
 {v:'schlafen',p:'geschlafen',img:'schlafen.webp',group:'en',parts:['ge','schlaf','en'],wrong:['geschlaft','schläft','geschläfen','geschlafen'],en:'slept'},
 {v:'kochen',p:'gekocht',img:'kochen.webp',group:'t',parts:['ge','koch','t'],wrong:['gekochen','kocht','gekochtet','gekocht'],en:'cooked'},
 {v:'essen',p:'gegessen',img:'essen.webp',group:'en',parts:['ge','gess','en'],wrong:['geesst','isst','geessen','gegessen'],en:'ate'},
 {v:'trinken',p:'getrunken',img:'trinken.webp',group:'en',parts:['ge','trun','ken'],wrong:['getrinkt','trinkt','getrinken','getrunken'],en:'drank'},
 {v:'sagen',p:'gesagt',img:'sagen.webp',group:'t',parts:['ge','sag','t'],wrong:['gesagen','sagt','gesaget','gesagt'],en:'said'},
 {v:'leben',p:'gelebt',img:'leben.webp',group:'t',parts:['ge','leb','t'],wrong:['geleben','lebt','gelebet','gelebt'],en:'lived'},
 {v:'kosten',p:'gekostet',img:'kosten.webp',group:'t',parts:['ge','kost','et'],wrong:['gekosten','kostet','gekost','gekostet'],en:'cost'},
 {v:'grillen',p:'gegrillt',img:'grillen.webp',group:'t',parts:['ge','grill','t'],wrong:['gegrillen','grillt','gegrillet','gegrillt'],en:'grilled'},
 {v:'suchen',p:'gesucht',img:'suchen.webp',group:'t',parts:['ge','such','t'],wrong:['gesuchen','sucht','gesuchet','gesucht'],en:'looked for'},
 {v:'wohnen',p:'gewohnt',img:'wohnen.webp',group:'t',parts:['ge','wohn','t'],wrong:['gewohnen','wohnt','gewohnet','gewohnt'],en:'lived'}
];

const TRANSLATIONS={
 ru:{lernen:'выучил(а)',machen:'сделал(а)',schreiben:'написал(а)',hören:'слушал(а)',spielen:'играл(а)',sehen:'увидел(а)',lesen:'прочитал(а)',kaufen:'купил(а)',sprechen:'говорил(а)',arbeiten:'работал(а)',treffen:'встретил(а)',frühstücken:'завтракал(а)',schlafen:'спал(а)',kochen:'готовил(а)',essen:'ел / ела',trinken:'пил(а)',sagen:'сказал(а)',leben:'жил(а)',kosten:'стоил(а)',grillen:'жарил(а) на гриле',suchen:'искал(а)',wohnen:'жил(а)'},
 tr:{lernen:'öğrendi',machen:'yaptı',schreiben:'yazdı',hören:'dinledi',spielen:'oynadı',sehen:'gördü',lesen:'okudu',kaufen:'satın aldı',sprechen:'konuştu',arbeiten:'çalıştı',treffen:'buluştu',frühstücken:'kahvaltı yaptı',schlafen:'uyudu',kochen:'pişirdi',essen:'yedi',trinken:'içti',sagen:'söyledi',leben:'yaşadı',kosten:'fiyatı oldu',grillen:'ızgara yaptı',suchen:'aradı',wohnen:'oturdu'},
 uk:{lernen:'вивчив / вивчила',machen:'зробив / зробила',schreiben:'написав / написала',hören:'слухав / слухала',spielen:'грав / грала',sehen:'побачив / побачила',lesen:'прочитав / прочитала',kaufen:'купив / купила',sprechen:'говорив / говорила',arbeiten:'працював / працювала',treffen:'зустрів / зустріла',frühstücken:'снідав / снідала',schlafen:'спав / спала',kochen:'готував / готувала',essen:'їв / їла',trinken:'пив / пила',sagen:'сказав / сказала',leben:'жив / жила',kosten:'коштував / коштувала',grillen:'смажив / смажила на грилі',suchen:'шукав / шукала',wohnen:'проживав / проживала'},
 ar:{lernen:'تعلّم',machen:'فعل',schreiben:'كتب',hören:'سمع',spielen:'لعب',sehen:'رأى',lesen:'قرأ',kaufen:'اشترى',sprechen:'تكلّم',arbeiten:'عمل',treffen:'قابل',frühstücken:'تناول الفطور',schlafen:'نام',kochen:'طبخ',essen:'أكل',trinken:'شرب',sagen:'قال',leben:'عاش',kosten:'كلّف',grillen:'شوى',suchen:'بحث عن',wohnen:'سكن'},
 ja:{lernen:'学んだ',machen:'した',schreiben:'書いた',hören:'聞いた',spielen:'遊んだ',sehen:'見た',lesen:'読んだ',kaufen:'買った',sprechen:'話した',arbeiten:'働いた',treffen:'会った',frühstücken:'朝食を食べた',schlafen:'寝た',kochen:'料理した',essen:'食べた',trinken:'飲んだ',sagen:'言った',leben:'暮らした',kosten:'値段がかかった',grillen:'グリルした',suchen:'探した',wohnen:'住んでいた'},
 ro:{lernen:'a învățat',machen:'a făcut',schreiben:'a scris',hören:'a ascultat',spielen:'a jucat',sehen:'a văzut',lesen:'a citit',kaufen:'a cumpărat',sprechen:'a vorbit',arbeiten:'a lucrat',treffen:'s-a întâlnit',frühstücken:'a luat micul dejun',schlafen:'a dormit',kochen:'a gătit',essen:'a mâncat',trinken:'a băut',sagen:'a spus',leben:'a trăit',kosten:'a costat',grillen:'a făcut grătar',suchen:'a căutat',wohnen:'a locuit'},
 pl:{lernen:'nauczył(a) się',machen:'zrobił(a)',schreiben:'napisał(a)',hören:'słuchał(a)',spielen:'grał(a)',sehen:'zobaczył(a)',lesen:'przeczytał(a)',kaufen:'kupił(a)',sprechen:'mówił(a)',arbeiten:'pracował(a)',treffen:'spotkał(a)',frühstücken:'jadł(a) śniadanie',schlafen:'spał(a)',kochen:'gotował(a)',essen:'jadł(a)',trinken:'pił(a)',sagen:'powiedział(a)',leben:'żył(a)',kosten:'kosztował(a)',grillen:'grillował(a)',suchen:'szukał(a)',wohnen:'mieszkał(a)'},
 ku:{lernen:'hîn bû',machen:'kir',schreiben:'nivîsand',hören:'guhdarî kir',spielen:'lîst',sehen:'dît',lesen:'xwend',kaufen:'kirî',sprechen:'axivî',arbeiten:'xebitî',treffen:'hevdît',frühstücken:'taşt xwar',schlafen:'razayî',kochen:'pijand',essen:'xwar',trinken:'vexwar',sagen:'got',leben:'jiya',kosten:'biha bû',grillen:'li ser agir pijand',suchen:'lê geriya',wohnen:'niştecih bû'}
};
function lang(){let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){}const raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/russ|^ru/.test(raw))return'ru';if(/türk|turk|^tr/.test(raw))return'tr';if(/ukrain|^uk|^ua/.test(raw))return'uk';if(/arab|^ar/.test(raw))return'ar';if(/japan|^ja/.test(raw))return'ja';if(/rum|roman|^ro/.test(raw))return'ro';if(/pol|^pl/.test(raw))return'pl';if(/kurd|kurm|^ku/.test(raw))return'ku';return'en'}
function translation(x){const l=lang();return l==='en'?x.en:(TRANSLATIONS[l]?.[x.v]||x.en)}

const CARD_ITEMS=FORMS.map(x=>({kind:'cards',image:x.img,word:`hat ${x.p}`,answer:`hat ${x.p}`,answers:[`hat ${x.p}`],meaning:translation(x),example:`${x.v} – hat ${x.p}`,audio:`hat ${x.p}`,prompt:x.v,hint:'Nenne das Hilfsverb und das Partizip II.'}));
const CHOICE_ITEMS=FORMS.map(x=>({kind:'choice',prompt:x.v,answer:x.p,options:x.wrong,hint:'Achte auf das Partizip II.'}));
const MEMORY_PAIRS=FORMS.map((x,index)=>({id:`paar-${index+1}`,infinitive:x.v,perfekt:x.p}));
const SYLLABLE_ITEMS=FORMS.map(x=>({kind:'order',prompt:x.v,answer:x.p,tokens:x.parts,hint:'Baue das Partizip II.'}));
const ENDING_ITEMS=FORMS.map(x=>({infinitive:x.v,participle:x.p,group:x.group}));
const WRITE_ITEMS=FORMS.map(x=>({kind:'input',prompt:x.v,answer:`hat ${x.p}`,answers:[`hat ${x.p}`],hint:'Schreibe das Hilfsverb und das Partizip II.'}));

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks)||theme.tasks.length<8)return theme;
 const old=[...theme.tasks];
 const cards={...old[0],kind:'cards',title:'Karteikarten',description:'Lern die Wörter.',items:CARD_ITEMS};
 const choice={...old[1],kind:'choice',title:'Partizip II finden',description:'Wähle die richtige Partizip-II-Form.',items:CHOICE_ITEMS};
 const memory={...old[2],kind:'memory-pairs',title:'Memory',description:'Finde passende Paare.',items:MEMORY_PAIRS,spL7T2Memory:true};
 const syllables={...old[5],kind:'order',title:'Partizip II bauen',description:'Baue das Partizip II.',items:SYLLABLE_ITEMS,spL7T2Syllables:true};
 const endings={...old[3],kind:'endings-write',title:'Endung -t oder -en?',description:'Ordne die Verben zu.',items:ENDING_ITEMS,spL7T2Endings:true};
 const write={...old[7],kind:'input',title:'Partizip II schreiben',description:'Schreibe die Partizip-II-Formen mit Hilfsverb.',items:WRITE_ITEMS,spL7T2Write:true};
 theme.tasks=[cards,choice,memory,syllables,endings,write,...old.slice(8)];
 theme.tasks.forEach((task,index)=>task.order=index+1);
 theme.contentRevision='l7t2-standard-short-all-verbs-20260817-v5';
 window.L7_THEME=theme;return theme
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();