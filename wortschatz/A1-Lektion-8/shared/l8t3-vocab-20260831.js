(function(){
'use strict';
if(window.__SP_L8T3_VOCAB_20260831)return;window.__SP_L8T3_VOCAB_20260831=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const tr=(en,ru,tr,uk,ar,ja,ro,pl,ku)=>({en,ru,tr,uk,ar,ja,ro,pl,ku});
const item=(term,type,stem,translations,extra={})=>({term,type,image:CDN+stem+'.webp',audio:AUDIO+stem+'.mp3',audioFile:AUDIO+stem+'.mp3',translations,tr:translations,...extra});
const WORDS=[
 item('die Erfahrung','noun','berufserfahrung',tr('experience','опыт','deneyim','досвід','خبرة','経験','experiență','doświadczenie','ezmûn'),{plural:'die Erfahrungen',audio:AUDIO+'erfahrung.mp3',audioFile:AUDIO+'erfahrung.mp3'}),
 item('das Café','noun','cafe',tr('café','кафе','kafe','кафе','مقهى','カフェ','cafenea','kawiarnia','kafe'),{plural:'die Cafés'}),
 item('der Stress','noun','stress',tr('stress','стресс','stres','стрес','توتر / ضغط','ストレス','stres','stres','stres')),
 item('der Kellner','noun','kellner',tr('waiter','официант','garson','офіціант','نادل','ウェイター','chelner','kelner','garson'),{plural:'die Kellner'}),
 item('die Kellnerin','noun','kellnerin',tr('waitress','официантка','kadın garson','офіціантка','نادلة','ウェイトレス','chelneriță','kelnerka','garsona jin'),{plural:'die Kellnerinnen'}),
 item('das Restaurant','noun','restaurant',tr('restaurant','ресторан','restoran','ресторан','مطعم','レストラン','restaurant','restauracja','restoran'),{plural:'die Restaurants'}),
 item('der Architekt','noun','architekt',tr('architect','архитектор','mimar','архітектор','مهندس معماري','建築家','arhitect','architekt','mîmar'),{plural:'die Architekten'}),
 item('die Architektin','noun','architektin',tr('female architect','архитектор','kadın mimar','архітекторка','مهندسة معمارية','女性建築家','arhitectă','architektka','mîmara jin'),{plural:'die Architektinnen'}),
 item('der Arbeiter','noun','arbeiter',tr('worker','рабочий','işçi','робітник','عامل','労働者','muncitor','robotnik','karker'),{plural:'die Arbeiter'}),
 item('die Arbeiterin','noun','arbeiterin',tr('female worker','работница','kadın işçi','робітниця','عاملة','女性労働者','muncitoare','robotnica','karkera jin'),{plural:'die Arbeiterinnen'}),
 item('der Kollege','noun','kollege',tr('colleague','коллега','iş arkadaşı','колега','زميل','同僚','coleg','kolega','hevalkar'),{plural:'die Kollegen'}),
 item('oft','adverb','oft',tr('often','часто','sık sık','часто','غالبًا','よく','des','często','pir caran')),
 item('manchmal','adverb','manchmal',tr('sometimes','иногда','bazen','іноді','أحيانًا','時々','uneori','czasami','carinan')),
 item('wenig','adverb','wenig',tr('little / not much','мало','az','мало','قليل','少し / 少ない','puțin','mało','kêm')),
 item('schlecht','adjective','schlecht',tr('bad','плохой / плохо','kötü','поганий / погано','سيئ','悪い','rău','zły / źle','xerab')),
 item('toll','adjective','toll',tr('great','отличный / здорово','harika','чудовий / чудово','رائع','すばらしい','grozav','świetny','pir baş')),
 item('einfach','adjective','einfach',tr('easy / simple','простой / легко','kolay / basit','простий / легко','سهل / بسيط','簡単な','simplu / ușor','prosty / łatwy','hêsan')),
 item('professionell','adjective','professionell',tr('professional','профессиональный','profesyonel','професійний','مهني / احترافي','プロフェッショナルな','profesionist','profesjonalny','profesyonel')),
 item('Spaß haben','phrase','spass_haben',tr('to have fun','веселиться / получать удовольствие','eğlenmek','веселитися','يستمتع','楽しむ','a se distra','dobrze się bawić','kêfxweş bûn'),{answers:['Spaß haben'],accepted:['Spaß haben']}),
 item('war','verb','sein',tr('was (past of “sein”)','был / была / было','idi (sein fiilinin geçmişi)','був / була / було','كان','～だった','era','był / była / było','bû'),{audio:AUDIO+'war.mp3',audioFile:AUDIO+'war.mp3',answers:['war'],accepted:['war']}),
 item('hatte','verb','haben',tr('had (past of “haben”)','имел / имела','vardı / sahipti','мав / мала','كان لديه','持っていた','avea','miał / miała','hebû'),{audio:AUDIO+'hatte.mp3',audioFile:AUDIO+'hatte.mp3',answers:['hatte'],accepted:['hatte']})
];
window.L8_T3_VOCAB_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=all[3]||all['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null);if(!theme||!Array.isArray(theme.tasks))return themes;
 theme.number=3;if(!theme.title)theme.title='Thema 3';
 let cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
 if(!cards){cards={id:'karteikarten',title:'Karteikarten',kind:'cards',items:[]};theme.tasks.unshift(cards)}
 cards.id='karteikarten';cards.title='Karteikarten';cards.kind='cards';cards.emoji='📚';cards.icon='📚';cards.instruction='Lerne die Wörter aus Thema 3.';cards.items=WORDS.map(x=>({...x,translations:{...x.translations},tr:{...x.tr}}));
 theme.vocabularyOverviewItems=cards.items;
 theme.grammarOverview=[{title:'war',text:'Präteritum von sein'},{title:'hatte',text:'Präteritum von haben'}];
 theme.translationRevision='l8t3-standard-languages-v1';theme.mediaRevision='l8t3-bunny-v2';
 if(Number(document.body?.dataset?.theme)===3)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T3_VOCAB_READY;
})();