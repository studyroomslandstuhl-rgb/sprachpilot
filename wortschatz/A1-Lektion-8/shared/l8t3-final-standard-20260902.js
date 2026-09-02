(function(){
'use strict';
if(window.__SP_L8T3_FINAL_STANDARD_20260902_V1)return;window.__SP_L8T3_FINAL_STANDARD_20260902_V1=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const LANGS=['en','ru','tr','uk','ar','ja','ro','pl','ku'];
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
const V=[
 ['die Erfahrung','erfahrung','experience','опыт','deneyim','досвід','خبرة','経験','experiență','doświadczenie','ezmûn'],
 ['das Café','cafe','café','кафе','kafe','кафе','مقهى','カフェ','cafenea','kawiarnia','kafe'],
 ['der Stress','stress','stress','стресс','stres','стрес','توتر / ضغط','ストレス','stres','stres','stres'],
 ['der Kellner','kellner','waiter','официант','garson','офіціант','نادل','ウェイター','chelner','kelner','garson'],
 ['die Kellnerin','kellnerin','waitress','официантка','kadın garson','офіціантка','نادلة','ウェイトレス','chelneriță','kelnerka','garsona jin'],
 ['das Restaurant','restaurant','restaurant','ресторан','restoran','ресторан','مطعم','レストラン','restaurant','restauracja','restoran'],
 ['der Architekt','architekt','architect','архитектор','mimar','архітектор','مهندس معماري','建築家','arhitect','architekt','mîmar'],
 ['die Architektin','architektin','female architect','архитектор','kadın mimar','архітекторка','مهندسة معمارية','女性建築家','arhitectă','architektka','mîmara jin'],
 ['der Arbeiter','arbeiter','worker','рабочий','işçi','робітник','عامل','労働者','muncitor','robotnik','karker'],
 ['die Arbeiterin','arbeiterin','female worker','работница','kadın işçi','робітниця','عاملة','女性労働者','muncitoare','robotnica','karkera jin'],
 ['der Kollege','kollege','colleague','коллега','iş arkadaşı','колега','زميل','同僚','coleg','kolega','hevalkar'],
 ['oft','oft','often','часто','sık sık','часто','غالبًا','よく','des','często','pir caran'],
 ['manchmal','manchmal','sometimes','иногда','bazen','іноді','أحيانًا','時々','uneori','czasami','carinan'],
 ['wenig','wenig','little / not much','мало','az','мало','قليل','少し / 少ない','puțin','mało','kêm'],
 ['schlecht','schlecht','bad','плохой / плохо','kötü','поганий / погано','سيئ','悪い','rău','zły / źle','xerab'],
 ['toll','toll','great','отличный / здорово','harika','чудовий / чудово','رائع','すばらしい','grozav','świetny','pir baş'],
 ['einfach','einfach','easy / simple','простой / легко','kolay / basit','простий / легко','سهل / بسيط','簡単な','simplu / ușor','prosty / łatwy','hêsan'],
 ['professionell','professionell','professional','профессиональный','profesyonel','професійний','مهني / احترافي','プロフェッショナルな','profesionist','profesjonalny','profesyonel'],
 ['Spaß haben','spass_haben','to have fun','веселиться / получать удовольствие','eğlenmek','веселитися','يستمتع','楽しむ','a se distra','dobrze się bawić','kêfxweş bûn']
].map(([term,stem,en,ru,tr,uk,ar,ja,ro,pl,ku])=>({term,stem,image:CDN+stem+'.webp',audioFile:AUDIO+stem+'.mp3',translations:{en,ru,tr,uk,ar,ja,ro,pl,ku}}));
const byTerm=new Map(V.map(x=>[norm(x.term),x]));
function findCards(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function patchCards(theme){
 const cards=findCards(theme);if(!cards)return null;
 cards.id='karteikarten';cards.title='Karteikarten';cards.icon='📚';cards.emoji='📚';cards.instruction='Lerne die Wörter.';
 (cards.items||[]).forEach(item=>{
  const key=norm(item?.term||item?.word||item?.full||'');const ref=byTerm.get(key);if(!ref)return;
  item.image=ref.image;item.audio=ref.audioFile;item.audioFile=ref.audioFile;
  const cur=item.translations&&typeof item.translations==='object'?item.translations:{};
  const old=item.tr&&typeof item.tr==='object'?item.tr:{};
  item.translations={...ref.translations,...old,...cur};item.tr={...ref.translations,...old,...cur};
  LANGS.forEach(lang=>{if(!item.translations[lang])item.translations[lang]=ref.translations[lang];if(!item.tr[lang])item.tr[lang]=ref.translations[lang]});
 });
 return cards;
}
const vocab=(term)=>byTerm.get(norm(term));
function imageTask(){
 const rows=[
  ['die Erfahrung',['der Stress','die Erfahrung','das Café']],['das Café',['das Restaurant','das Café','die Erfahrung']],['der Stress',['Spaß haben','der Stress','die Erfahrung']],
  ['der Kellner',['der Architekt','der Arbeiter','der Kellner']],['die Kellnerin',['die Arbeiterin','die Kellnerin','die Architektin']],['das Restaurant',['das Café','das Restaurant','die Erfahrung']],
  ['der Architekt',['der Kellner','der Architekt','der Arbeiter']],['die Architektin',['die Kellnerin','die Arbeiterin','die Architektin']],['der Arbeiter',['der Architekt','der Arbeiter','der Kellner']],
  ['die Arbeiterin',['die Architektin','die Arbeiterin','die Kellnerin']],['der Kollege',['der Kollege','der Kellner','der Arbeiter']],['professionell',['schlecht','professionell','einfach']],
  ['einfach',['professionell','schlecht','einfach']],['schlecht',['toll','einfach','schlecht']],['Spaß haben',['der Stress','Spaß haben','die Erfahrung']]
 ];
 return {id:'wortschatz-bild-verstehen',title:'Bild → Wort',kind:'image-vocab',icon:'🖼️',emoji:'🖼️',spL8T3ImageVocab:true,instruction:'Sieh das Bild. Wähle das Wort.',items:rows.map(([answer,options])=>({image:vocab(answer)?.image||'',prompt:'Was passt?',options,answer:[answer]}))};
}
function listenImageTask(){
 const rows=[
  ['die Erfahrung',['die Erfahrung','der Stress','das Café']],['das Café',['das Café','das Restaurant','die Erfahrung']],['der Stress',['der Stress','Spaß haben','die Erfahrung']],
  ['der Kellner',['der Kellner','der Architekt','der Arbeiter']],['die Kellnerin',['die Kellnerin','die Architektin','die Arbeiterin']],['das Restaurant',['das Restaurant','das Café','der Stress']],
  ['der Architekt',['der Architekt','der Arbeiter','der Kellner']],['die Architektin',['die Architektin','die Arbeiterin','die Kellnerin']],['der Arbeiter',['der Arbeiter','der Architekt','der Kellner']],
  ['die Arbeiterin',['die Arbeiterin','die Architektin','die Kellnerin']],['der Kollege',['der Kollege','der Kellner','der Arbeiter']],['professionell',['professionell','einfach','schlecht']],
  ['einfach',['einfach','professionell','schlecht']],['schlecht',['schlecht','toll','einfach']],['Spaß haben',['Spaß haben','der Stress','die Erfahrung']]
 ];
 return {id:'wortschatz-hoeren-bild',title:'Hören → Bild',kind:'listen-image',icon:'👂',emoji:'👂',spL8T3ListenImage:true,instruction:'Höre das Wort. Wähle das Bild.',items:rows.map(([answer,options])=>({audioText:answer,audioFile:vocab(answer)?.audioFile||'',answer:[answer],options:options.map(term=>({term,image:vocab(term)?.image||''}))}))};
}
function meaningTask(){
 const rows=[
  ['Man hat schon lange gearbeitet und viel gelernt.','die Erfahrung'],
  ['Hier bestellt man oft Kaffee, Tee und Kuchen.','das Café'],
  ['Sehr viel Arbeit, wenig Zeit und keine Pause.','der Stress'],
  ['Er nimmt Bestellungen auf und bringt Essen an den Tisch.','der Kellner'],
  ['Sie nimmt Bestellungen auf und bringt Essen an den Tisch.','die Kellnerin'],
  ['Hier bestellt man Vorspeise, Hauptgericht und Getränke am Tisch.','das Restaurant'],
  ['Er plant Häuser und zeichnet Räume.','der Architekt'],
  ['Sie plant Häuser und zeichnet Räume.','die Architektin'],
  ['Er arbeitet zum Beispiel in einer Fabrik oder Produktion.','der Arbeiter'],
  ['Sie arbeitet zum Beispiel in einer Fabrik oder Produktion.','die Arbeiterin'],
  ['Eine Person, mit der ich zusammenarbeite.','der Kollege'],
  ['An vielen Tagen, aber nicht immer.','oft'],
  ['An einigen Tagen, aber nicht jeden Tag.','manchmal'],
  ['Nicht viel.','wenig'],
  ['Nicht gut.','schlecht'],
  ['Sehr gut und schön.','toll'],
  ['Nicht schwer.','einfach'],
  ['Gut, genau und passend für den Beruf.','professionell'],
  ['Die Arbeit macht Freude und man lacht gern.','Spaß haben']
 ];
 return {id:'wortschatz-bedeutung-wort',title:'Bedeutung → Wort',kind:'meaning-production',icon:'💬',emoji:'💬',spL8T3MeaningProduction:true,instruction:'Lies die Bedeutung. Sage oder schreibe das Wort.',items:rows.map(([prompt,answer])=>({prompt,answer:[answer,answer.replace(/^(der|die|das)\s+/i,'')],hint:'Denke an die Wörter aus den Karteikarten.'}))};
}
function locateContextVocab(tasks){return tasks.find(t=>!t?.exam&&Array.isArray(t?.items)&&t.items.length===15&&t.items.some(i=>(i.options||[]).includes('Berufserfahrung')))}
function setMeta(task,title,instruction,emoji){if(!task)return;task.title=title;task.instruction=instruction;task.icon=emoji;task.emoji=emoji}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=[...theme.tasks],cards=patchCards(theme),exam=old.find(t=>t?.exam),contextVocab=locateContextVocab(old);
 const conj=old.find(t=>t?.id==='sein-haben-praeteritum-tabellen');
 const forms=old.find(t=>t?.id==='war-oder-hatte-richtige-form');
 const dialogs=old.find(t=>t?.id==='drei-grosse-dialoge-sein-haben');
 const sentence=old.find(t=>t?.id==='saetze-bauen-subjekt-verb-zeitform-v2');
 const reading=old.find(t=>t?.id==='lesen-erster-job-fuenf-texte');
 const listening=old.find(t=>t?.id==='hoeren-arbeit-frueher-heute-fuenf-dialoge');
 const rewrite=old.find(t=>t?.id==='text-vor-fuenf-jahren-umschreiben');
 const time=old.find(t=>t?.id==='gegenwart-vergangenheit-sortieren');
 setMeta(contextVocab,'Wort im Kontext','Lies den Satz. Wähle das passende Wort.','🧭');
 setMeta(conj,'war und hatte','Konjugiere sein und haben im Präteritum.','🔤');
 setMeta(forms,'war oder hatte?','Schreibe die richtige Form.','🧩');
 setMeta(dialogs,'Dialoge','Ergänze sein oder haben.','🎭');
 setMeta(sentence,'Sätze bauen','Baue den Satz. Markiere Subjekt und Verb.','🧱');
 setMeta(reading,'Lesen: erster Job','Lies den Text. Beantworte die Fragen.','📖');
 setMeta(listening,'Hören: Arbeit','Höre den Dialog. Beantworte die Fragen.','🎧');
 setMeta(rewrite,'Text umschreiben','Schreibe den Text in der Vergangenheit.','✍️');
 setMeta(time,'Gegenwart oder Vergangenheit?','Ordne die Sätze.','🕰️');
 const ordered=[cards,imageTask(),listenImageTask(),meaningTask(),contextVocab,conj,forms,dialogs,sentence,reading,listening,rewrite,time,exam].filter(Boolean);
 const seen=new Set();theme.tasks=ordered.filter(t=>{const id=String(t.id||'');if(id&&seen.has(id))return false;if(id)seen.add(id);return true});
 theme.title='Meine Arbeit früher';theme.subtitle='Arbeit früher und heute: Wortschatz, sein und haben.';
 theme.contentRevision='l8t3-final-standard-20260902-v1';
 if(Number(document.body?.dataset?.theme||0)===3)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_FINAL_STANDARD_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,3);apply(theme);return themes}).catch(error=>{console.error('L8T3 Finalstandard',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_FINAL_STANDARD_READY;
window.L8T3FinalStandard20260902={apply,version:1,vocabulary:V};
})();
