(function(){
'use strict';
if(window.__SP_L7T2_TASKS_V6)return;
window.__SP_L7T2_TASKS_V6=true;

const FORMS=[
 {v:'lernen',p:'gelernt',img:'lernen.webp',audio:'lernen.mp3',group:'t',parts:['ge','lern','t'],wrong:['gelernen','lernt','gelernet','gelernt'],en:'learned'},
 {v:'machen',p:'gemacht',img:'machen.webp',audio:'machen.mp3',group:'t',parts:['ge','mach','t'],wrong:['gemachen','macht','gemachtet','gemacht'],en:'made'},
 {v:'schreiben',p:'geschrieben',img:'schreiben.webp',audio:'schreiben.mp3',group:'en',parts:['ge','schrie','ben'],wrong:['geschreibt','schreibt','geschreiben','geschrieben'],en:'wrote'},
 {v:'hören',p:'gehört',img:'hoeren.webp',audio:'hoeren.mp3',group:'t',parts:['ge','hör','t'],wrong:['gehören','hört','gehöret','gehört'],en:'heard'},
 {v:'spielen',p:'gespielt',img:'spielen.webp',audio:'spielen.mp3',group:'t',parts:['ge','spiel','t'],wrong:['gespielen','spielt','gespielet','gespielt'],en:'played'},
 {v:'sehen',p:'gesehen',img:'sehen.webp',audio:'sehen.mp3',group:'en',parts:['ge','seh','en'],wrong:['geseht','sieht','gesieht','gesehen'],en:'saw'},
 {v:'lesen',p:'gelesen',img:'lesen.webp',audio:'lesen.mp3',group:'en',parts:['ge','les','en'],wrong:['gelest','liest','geleset','gelesen'],en:'read'},
 {v:'kaufen',p:'gekauft',img:'kaufen.webp',audio:'kaufen.mp3',group:'t',parts:['ge','kauf','t'],wrong:['gekaufen','kauft','gekaufet','gekauft'],en:'bought'},
 {v:'sprechen',p:'gesprochen',img:'sprechen.webp',audio:'sprechen.mp3',group:'en',parts:['ge','sproch','en'],wrong:['gesprecht','spricht','gesprechen','gesprochen'],en:'spoke'},
 {v:'arbeiten',p:'gearbeitet',img:'arbeiten.webp',audio:'arbeiten.mp3',group:'t',parts:['ge','arbeit','et'],wrong:['gearbeiten','arbeitet','gearbetit','gearbeitet'],en:'worked'},
 {v:'treffen',p:'getroffen',img:'treffen.webp',audio:'treffen.mp3',group:'en',parts:['ge','troff','en'],wrong:['getrefft','trifft','getreffen','getroffen'],en:'met'},
 {v:'frühstücken',p:'gefrühstückt',img:'fruehstuecken.webp',audio:'fruehstuecken.mp3',group:'t',parts:['ge','frühstück','t'],wrong:['gefrühstücken','frühstückt','gefrühstücket','gefrühstückt'],en:'had breakfast'},
 {v:'schlafen',p:'geschlafen',img:'schlafen.webp',audio:'schlafen.mp3',group:'en',parts:['ge','schlaf','en'],wrong:['geschlaft','schläft','geschläfen','geschlafen'],en:'slept'},
 {v:'kochen',p:'gekocht',img:'kochen.webp',audio:'kochen.mp3',group:'t',parts:['ge','koch','t'],wrong:['gekochen','kocht','gekochtet','gekocht'],en:'cooked'},
 {v:'essen',p:'gegessen',img:'essen.webp',audio:'essen.mp3',group:'en',parts:['ge','gess','en'],wrong:['geesst','isst','geessen','gegessen'],en:'ate'},
 {v:'trinken',p:'getrunken',img:'trinken.webp',audio:'trinken.mp3',group:'en',parts:['ge','trun','ken'],wrong:['getrinkt','trinkt','getrinken','getrunken'],en:'drank'},
 {v:'sagen',p:'gesagt',img:'sagen.webp',audio:'sagen.mp3',group:'t',parts:['ge','sag','t'],wrong:['gesagen','sagt','gesaget','gesagt'],en:'said'},
 {v:'leben',p:'gelebt',img:'leben.webp',audio:'leben.mp3',group:'t',parts:['ge','leb','t'],wrong:['geleben','lebt','gelebet','gelebt'],en:'lived'},
 {v:'kosten',p:'gekostet',img:'kosten.webp',audio:'kosten.mp3',group:'t',parts:['ge','kost','et'],wrong:['gekosten','kostet','gekost','gekostet'],en:'cost'},
 {v:'grillen',p:'gegrillt',img:'grillen.webp',audio:'grillen.mp3',group:'t',parts:['ge','grill','t'],wrong:['gegrillen','grillt','gegrillet','gegrillt'],en:'grilled'},
 {v:'suchen',p:'gesucht',img:'suchen.webp',audio:'suchen.mp3',group:'t',parts:['ge','such','t'],wrong:['gesuchen','sucht','gesuchet','gesucht'],en:'looked for'},
 {v:'wohnen',p:'gewohnt',img:'wohnen.webp',audio:'wohnen.mp3',group:'t',parts:['ge','wohn','t'],wrong:['gewohnen','wohnt','gewohnet','gewohnt'],en:'lived'}
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

const CARDS=FORMS.map(x=>({kind:'cards',image:x.img,word:`hat ${x.p}`,answer:`hat ${x.p}`,answers:[`hat ${x.p}`],meaning:translation(x),example:`${x.v} – hat ${x.p}`,audio:`hat ${x.p}`,prompt:x.v,hint:'Nenne das Hilfsverb und das Partizip II.'}));
const CHOICE=FORMS.map(x=>({kind:'choice',prompt:x.v,answer:x.p,options:x.wrong,hint:'Achte auf das Partizip II.'}));
const MEMORY=FORMS.map((x,i)=>({id:`paar-${i+1}`,infinitive:x.v,perfekt:x.p}));
const SYLLABLES=FORMS.map(x=>({kind:'order',prompt:x.v,answer:x.p,tokens:x.parts,hint:'Baue das Partizip II.'}));
const ENDINGS=FORMS.map(x=>({infinitive:x.v,participle:x.p,group:x.group}));
const WRITE=FORMS.map(x=>({kind:'input',prompt:x.v,answer:`hat ${x.p}`,answers:[`hat ${x.p}`]}));
const LISTEN_PARTICIPLE=FORMS.map(x=>({infinitive:x.v,audioFile:x.audio,answer:x.p}));
const HABEN=[['ich','habe'],['du','hast'],['er','hat'],['sie','hat'],['es','hat'],['wir','haben'],['ihr','habt'],['sie','haben'],['Sie','haben']].map(([pronoun,form])=>({pronoun,form}));

const GRAMMAR=[
 ['Anna hat einen Brief geschrieben.',['Anna','hat','einen Brief','geschrieben'],'Was ist das Hilfsverb?','hat'],
 ['Tim hat am Abend ein Buch gelesen.',['Tim','hat','am Abend','ein Buch','gelesen'],'Was ist das Partizip II?','gelesen'],
 ['Maria hat eine Suppe gekocht.',['Maria','hat','eine Suppe','gekocht'],'Was ist das Objekt?','eine Suppe'],
 ['Omar hat lange gearbeitet.',['Omar','hat','lange','gearbeitet'],'Was ist das Subjekt?','Omar'],
 ['Wir haben Musik gehört.',['Wir','haben','Musik','gehört'],'Was ist das Hilfsverb?','haben'],
 ['Sara hat Brot gekauft.',['Sara','hat','Brot','gekauft'],'Was ist das Partizip II?','gekauft'],
 ['Die Freunde haben Kaffee getrunken.',['Die Freunde','haben','Kaffee','getrunken'],'Was ist das Subjekt?','Die Freunde'],
 ['Paul hat einen Test geschrieben.',['Paul','hat','einen Test','geschrieben'],'Was ist das Objekt?','einen Test'],
 ['Ihr habt zusammen gespielt.',['Ihr','habt','zusammen','gespielt'],'Was ist das Hilfsverb?','habt'],
 ['Mina hat Deutsch gelernt.',['Mina','hat','Deutsch','gelernt'],'Was ist das Partizip II?','gelernt'],
 ['Die Lehrerin hat den Satz gesagt.',['Die Lehrerin','hat','den Satz','gesagt'],'Was ist das Objekt?','den Satz'],
 ['Ali und Samira haben in Berlin gewohnt.',['Ali und Samira','haben','in Berlin','gewohnt'],'Was ist das Subjekt?','Ali und Samira'],
 ['Ich habe meine Freunde getroffen.',['Ich','habe','meine Freunde','getroffen'],'Was ist das Partizip II?','getroffen'],
 ['Du hast Pizza gegessen.',['Du','hast','Pizza','gegessen'],'Was ist das Hilfsverb?','hast'],
 ['Das Buch hat zehn Euro gekostet.',['Das Buch','hat','zehn Euro','gekostet'],'Was ist das Subjekt?','Das Buch']
].map(([sentence,parts,question,answer])=>({sentence,parts,question,answer}));

const ORDER_SENTENCES=[
 'Ich habe am Montag Deutsch gelernt.',
 'Anna hat am Vormittag eine Übung gemacht.',
 'Tim hat am Abend einen Brief geschrieben.',
 'Wir haben nach dem Unterricht Musik gehört.',
 'Die Freunde haben am Samstag Tennis gespielt und später gegrillt.',
 'Sara hat am Abend einen Film gesehen.',
 'Paul hat lange in Köln gelebt und viele Bücher gelesen.',
 'Meine Mutter hat am Morgen Brot gekauft.',
 'Wir haben in der Pause Deutsch gesprochen.',
 'Omar hat in Berlin gewohnt und dort lange gearbeitet.',
 'Ich habe am Nachmittag meine Freunde getroffen und meinen Schlüssel gesucht.',
 'Am Sonntag haben wir lange geschlafen und zusammen gefrühstückt.',
 'Maria hat am Abend Suppe gekocht und Brot gegessen.',
 'Tim hat Tee getrunken und Danke gesagt.',
 'Das Buch hat zehn Euro gekostet.'
];
const ORDER_ITEMS=ORDER_SENTENCES.map(sentence=>({sentence,tokens:sentence.replace(/[.?!]$/,'').split(' ')}));

const WRITE_SENTENCES=[
 ['Lina – am Dienstag – Deutsch – lernen','Lina hat am Dienstag Deutsch gelernt.'],
 ['ich – gestern – Hausaufgaben – machen','Ich habe gestern Hausaufgaben gemacht.'],
 ['Samir – am Vormittag – Brief – schreiben','Samir hat am Vormittag einen Brief geschrieben.'],
 ['wir – am Abend – Musik – hören','Wir haben am Abend Musik gehört.'],
 ['Mia und Tom – am Samstag – Tennis – spielen – danach – grillen','Mia und Tom haben am Samstag Tennis gespielt und danach gegrillt.'],
 ['du – gestern – Film – sehen','Du hast gestern einen Film gesehen.'],
 ['Nina – am Abend – Buch – lesen','Nina hat am Abend ein Buch gelesen.'],
 ['mein Vater – am Morgen – Brot – kaufen','Mein Vater hat am Morgen Brot gekauft.'],
 ['wir – in der Pause – Deutsch – sprechen','Wir haben in der Pause Deutsch gesprochen.'],
 ['Lea – am Montag – lange – arbeiten','Lea hat am Montag lange gearbeitet.'],
 ['ich – am Nachmittag – Freundin – treffen – Schlüssel – suchen','Ich habe am Nachmittag meine Freundin getroffen und meinen Schlüssel gesucht.'],
 ['das Kind – am Sonntag – lange – schlafen','Das Kind hat am Sonntag lange geschlafen.'],
 ['wir – um neun Uhr – frühstücken','Wir haben um neun Uhr gefrühstückt.'],
 ['Maria – am Abend – Suppe – kochen – Brot – essen','Maria hat am Abend Suppe gekocht und Brot gegessen.'],
 ['das Buch – zehn Euro – kosten','Das Buch hat zehn Euro gekostet.']
].map(([cue,answer])=>({cue,answer}));

const DIALOGUES=[
 ['Was hast du gestern gemacht?','Ich habe Deutsch ___.','gelernt',['gelernt','gekauft','gesehen','getrunken']],
 ['Ist der Brief fertig?','Ja, ich habe ihn gestern ___.','geschrieben',['geschrieben','gesprochen','geschlafen','gesucht']],
 ['War die Musik gut?','Ja, wir haben sie lange ___.','gehört',['gehört','gemacht','gekostet','gelebt']],
 ['Was habt ihr am Samstag gemacht?','Wir haben Tennis ___.','gespielt',['gespielt','gesagt','gelesen','gewohnt']],
 ['Kennst du den Film?','Ja, ich habe ihn gestern ___.','gesehen',['gesehen','gegessen','gelernt','gegrillt']],
 ['Wo ist das Buch?','Ich habe es gestern ___.','gelesen',['gelesen','gearbeitet','getroffen','gekocht']],
 ['Habt ihr Brot zu Hause?','Ja, ich habe Brot ___.','gekauft',['gekauft','gesprochen','geschlafen','gesagt']],
 ['Welche Sprache habt ihr im Kurs benutzt?','Wir haben Deutsch ___.','gesprochen',['gesprochen','geschrieben','gespielt','gesucht']],
 ['Warst du lange im Büro?','Ja, ich habe bis 18 Uhr ___.','gearbeitet',['gearbeitet','getrunken','gewohnt','gesehen']],
 ['Warst du bei Sara?','Ja, ich habe sie am Nachmittag ___.','getroffen',['getroffen','gekostet','gelernt','gehört']],
 ['Warum bist du müde?','Ich habe nur fünf Stunden ___.','geschlafen',['geschlafen','geschrieben','gekauft','gespielt']],
 ['Was gab es zum Abendessen?','Ich habe Suppe ___.','gekocht',['gekocht','getroffen','gelebt','gehört']],
 ['Hast du schon gegessen?','Ja, ich habe Brot und Salat ___.','gegessen',['gegessen','gesehen','gesagt','gewohnt']],
 ['Was hast du zum Frühstück getrunken?','Ich habe Tee ___.','getrunken',['getrunken','gegrillt','gelernt','gemacht']],
 ['Was hat die Lehrerin erklärt?','Sie hat den Satz noch einmal ___.','gesagt',['gesagt','gesucht','geschlafen','gekauft']]
].map(([left,right,answer,options])=>({left,right,answer,options}));

const REWRITE={
 present:'Am Samstag steht Lara um acht Uhr auf. Sie frühstückt und hört Musik. Danach lernt sie Deutsch und schreibt einen kurzen Text. Am Mittag trifft sie ihre Freundin Mia. Sie trinken Kaffee und kaufen ein Buch. Am Abend kocht Lara Suppe, liest im Buch und sieht einen Film.',
 perfect:'Am Samstag ist Lara um acht Uhr aufgestanden. Sie hat gefrühstückt und Musik gehört. Danach hat sie Deutsch gelernt und einen kurzen Text geschrieben. Am Mittag hat sie ihre Freundin Mia getroffen. Sie haben Kaffee getrunken und ein Buch gekauft. Am Abend hat Lara Suppe gekocht, im Buch gelesen und einen Film gesehen.'
};

const READINGS=[
 {
 text:'Gestern war Samstag. Nina hat bis acht Uhr geschlafen und um neun Uhr gefrühstückt. Danach hat sie ihre Freundin Sara getroffen. Sie haben zusammen Kaffee getrunken und ein Buch gekauft. Am Nachmittag haben sie Musik gehört. Am Abend hat Nina mit Sara Pizza gebacken. Später hat Nina noch einen Brief geschrieben und einen Film gesehen.',
 tf:[['Nina hat um neun Uhr gefrühstückt.',true],['Nina hat am Nachmittag allein Kaffee getrunken.',false],['Am Abend haben Nina und Sara Pizza gebacken.',true]],
 abc:[['Was hat Nina gekauft?',['ein Buch','einen Test','eine Gitarre'],'ein Buch'],['Was hat Nina am Nachmittag gehört?',['Musik','einen Test','Mathematik'],'Musik'],['Was hat Nina später geschrieben?',['einen Brief','ein Buch','einen Test'],'einen Brief']]
 },
 {
 text:'Am Montag hat Omar früh gefrühstückt und ist pünktlich zur Arbeit gefahren. Er hat bis zum Nachmittag gearbeitet. In der Pause hat er mit einer Kollegin gesprochen. Nach der Arbeit hat Omar Brot und Milch gekauft. Zu Hause hat er Suppe gekocht, Brot gegessen und Tee getrunken. Am Abend hat er noch einen Film gesehen.',
 tf:[['Omar hat am Montag gearbeitet.',true],['Omar hat nach der Arbeit ein Buch gekauft.',false],['Am Abend hat Omar einen Film gesehen.',true]],
 abc:[['Mit wem hat Omar in der Pause gesprochen?',['mit einer Kollegin','mit einem Arzt','mit seiner Lehrerin'],'mit einer Kollegin'],['Was hat Omar gekocht?',['Suppe','Pizza','Kuchen'],'Suppe'],['Was hat Omar getrunken?',['Tee','Kaffee','Milch'],'Tee']]
 },
 {
 text:'Am Mittwoch hat Anna einen langen Tag gehabt. Am Vormittag hat sie Deutsch gelernt und einen Test geschrieben. Danach hat sie mit ihrer Lehrerin gesprochen. Am Nachmittag hat Anna ihre Hausaufgaben gemacht und ein Buch gelesen. Später hat sie ihre Schwester getroffen. Zusammen haben sie Musik gehört und Tee getrunken.',
 tf:[['Anna hat am Vormittag Deutsch gelernt.',true],['Anna hat am Nachmittag einen Test geschrieben.',false],['Anna hat später ihre Schwester getroffen.',true]],
 abc:[['Mit wem hat Anna gesprochen?',['mit ihrer Lehrerin','mit einem Arzt','mit ihrem Freund'],'mit ihrer Lehrerin'],['Was hat Anna am Nachmittag gemacht?',['Hausaufgaben','Frühstück','Tennis'],'Hausaufgaben'],['Was haben Anna und ihre Schwester getrunken?',['Tee','Saft','Wasser'],'Tee']]
 },
 {
 text:'Am Sonntag hat Familie Kaya lange gefrühstückt. Danach haben die Eltern in der Küche gearbeitet und die Kinder haben ein Spiel gespielt. Am Mittag haben alle zusammen gegrillt und gegessen. Später hat der Vater seinen Schlüssel gesucht. Die Mutter hat ein Buch gelesen. Am Abend haben sie noch lange gesprochen und Musik gehört.',
 tf:[['Familie Kaya hat am Sonntag zusammen gefrühstückt.',true],['Der Vater hat am Nachmittag ein Buch gelesen.',false],['Am Abend hat die Familie Musik gehört.',true]],
 abc:[['Was haben die Kinder gemacht?',['ein Spiel gespielt','einen Brief geschrieben','Deutsch gelernt'],'ein Spiel gespielt'],['Was hat der Vater gesucht?',['seinen Schlüssel','sein Buch','seinen Test'],'seinen Schlüssel'],['Was hat die Mutter gelesen?',['ein Buch','einen Brief','einen Text im Test'],'ein Buch']]
 },
 {
 text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie im Supermarkt Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch eine Nachricht geschrieben.',
 tf:[['Lea hat am Freitag bis 16 Uhr gearbeitet.',true],['Lea und Mina haben zuerst Tee getrunken.',false],['Nach dem Essen haben sie einen Film gesehen.',true]],
 abc:[['Was haben Lea und Mina gekauft?',['Brot','ein Buch','eine Gitarre'],'Brot'],['Wer hat Suppe gekocht?',['Mina','Lea','Sara'],'Mina'],['Was hat Mina später geschrieben?',['eine Nachricht','einen Test','ein Buch'],'eine Nachricht']]
 }
];

const LISTENING_RECAPS=[
 {
 audioFile:'l7t2_tagesrueckblick_01.mp3',
 transcript:'Gestern habe ich lange gearbeitet. In der Pause habe ich mit meiner Kollegin gesprochen. Nach der Arbeit habe ich Brot gekauft. Zu Hause habe ich Suppe gekocht und später einen Film gesehen.',
 questions:[['Was hat die Person in der Pause gemacht?',['mit einer Kollegin gesprochen','ein Buch gelesen','Tennis gespielt'],'mit einer Kollegin gesprochen'],['Was hat die Person gekauft?',['Brot','ein Buch','einen Test'],'Brot'],['Was hat die Person am Abend gesehen?',['einen Film','eine Schule','einen Brief'],'einen Film']]
 },
 {
 audioFile:'l7t2_tagesrueckblick_02.mp3',
 transcript:'Am Samstag habe ich lange geschlafen und um neun Uhr gefrühstückt. Danach habe ich meine Freundin getroffen. Wir haben Kaffee getrunken, Musik gehört und am Abend zusammen gegrillt.',
 questions:[['Wann hat die Person gefrühstückt?',['um neun Uhr','um sieben Uhr','um zwölf Uhr'],'um neun Uhr'],['Wen hat die Person getroffen?',['eine Freundin','einen Arzt','eine Lehrerin'],'eine Freundin'],['Was haben sie am Abend gemacht?',['gegrillt','gearbeitet','gelernt'],'gegrillt']]
 },
 {
 audioFile:'l7t2_tagesrueckblick_03.mp3',
 transcript:'Heute habe ich viel Deutsch gelernt. Am Vormittag habe ich einen Text gelesen und einen Brief geschrieben. Später habe ich mit meinem Lehrer gesprochen. Am Abend habe ich noch Musik gehört.',
 questions:[['Was hat die Person gelernt?',['Deutsch','Mathematik','Französisch'],'Deutsch'],['Was hat die Person geschrieben?',['einen Brief','ein Buch','einen Test'],'einen Brief'],['Mit wem hat die Person gesprochen?',['mit dem Lehrer','mit dem Arzt','mit der Freundin'],'mit dem Lehrer']]
 },
 {
 audioFile:'l7t2_tagesrueckblick_04.mp3',
 transcript:'Am Sonntag haben wir zusammen gefrühstückt. Danach haben wir Tennis gespielt. Am Mittag haben wir gekocht und gegessen. Später habe ich meinen Schlüssel gesucht und meine Schwester hat ein Buch gelesen.',
 questions:[['Was haben sie nach dem Frühstück gemacht?',['Tennis gespielt','einen Film gesehen','Deutsch gelernt'],'Tennis gespielt'],['Was hat die Person gesucht?',['einen Schlüssel','ein Buch','Brot'],'einen Schlüssel'],['Wer hat ein Buch gelesen?',['die Schwester','der Lehrer','die Freundin'],'die Schwester']]
 },
 {
 audioFile:'l7t2_tagesrueckblick_05.mp3',
 transcript:'Ich habe lange in Köln gewohnt und dort auch gearbeitet. Gestern habe ich alte Freunde getroffen. Wir haben zusammen gegessen und Tee getrunken. Das Essen hat zwanzig Euro gekostet. Später haben wir noch lange gesprochen.',
 questions:[['Wo hat die Person gewohnt?',['in Köln','in Berlin','in Bonn'],'in Köln'],['Wen hat die Person getroffen?',['alte Freunde','eine Ärztin','eine Lehrerin'],'alte Freunde'],['Wie viel hat das Essen gekostet?',['zwanzig Euro','zehn Euro','fünf Euro'],'zwanzig Euro']]
 }
];

function base(old,index,id,title,description,kind,items,extra={}){
 return {...(old[index]||{}),id,title,description,kind,items,...extra,exam:false};
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=[...theme.tasks],exam=old.find(t=>t?.exam)||null;
 const tasks=[
  base(old,0,'karteikarten','Karteikarten','Lern die Wörter.','cards',CARDS),
  base(old,1,'partizip-finden','Partizip II finden','Wähle die richtige Partizip-II-Form.','choice',CHOICE),
  base(old,2,'memory','Memory','Finde passende Paare.','memory-pairs',MEMORY,{spL7T2Memory:true}),
  base(old,5,'partizip-bauen','Partizip II bauen','Baue das Partizip II.','order',SYLLABLES,{spL7T2Syllables:true}),
  base(old,3,'endungen','Endung -t oder -en?','Ordne die Verben zu.','endings-write',ENDINGS,{spL7T2Endings:true}),
  base(old,7,'partizip-schreiben','Partizip II schreiben','Schreibe die Partizip-II-Formen mit Hilfsverb.','input',WRITE,{spL7T2Write:true}),
  base(old,8,'hoeren-partizip','Hören','Schreibe Partizip II.','listen-participle',LISTEN_PARTICIPLE,{spL7T2ListenParticiple:true}),
  base(old,10,'haben','haben','Konjugiere haben.','haben-table',HABEN,{spL7T2Haben:true}),
  base(old,11,'grammatik','Grammatik','Erkenne Hilfsverb und Partizip II im Satz.','grammar-parts',GRAMMAR,{spL7T2Grammar:true}),
  base(old,12,'saetze','Sätze','Ordne die Sätze.','sentence-order',ORDER_ITEMS,{spL7T2SentenceOrder:true}),
  base(old,13,'saetze-schreiben','Sätze schreiben','Schreibe die Sätze im Perfekt.','sentence-write',WRITE_SENTENCES,{spL7T2SentenceWrite:true}),
  base(old,15,'dialoge','Dialoge','Wähle das passende Verb.','dialog-choice',DIALOGUES,{spL7T2Dialogs:true}),
  {id:'text-umschreiben',title:'Text umschreiben',description:'Schreibe den Text im Perfekt.',kind:'rewrite-text',items:[REWRITE],icon:'✍️',spL7T2Rewrite:true,exam:false},
  base(old,17,'lesen','Lesen','Lies die Texte und antworte.','reading-sets',READINGS,{spL7T2Reading:true}),
  base(old,18,'hoeren-tagesrueckblicke','Hören','Höre kurze Tagesrückblicke.','listening-sets',LISTENING_RECAPS,{spL7T2Listening:true})
 ];
 if(exam)tasks.push(exam);
 tasks.forEach((task,index)=>task.order=index+1);
 theme.tasks=tasks;
 theme.contentRevision='l7t2-standard-20260817-v6';
 theme.l7t2Forms=FORMS;
 window.L7_THEME=theme;
 return theme
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
