(function(){
'use strict';
if(window.__SP_L7T1_QUALITY_CONTENT_3)return;
window.__SP_L7T1_QUALITY_CONTENT_3=true;

function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function fullWord(item){
 const direct=String(item?.full||item?.word||item?.answer||item?.term||'').trim();
 const article=String(item?.article||'').trim();
 return article&&!/^(der|die|das)\s/i.test(direct)?`${article} ${direct}`.trim():direct;
}
function wordKey(value){return norm(String(value||'').replace(/^(der|die|das)\s+/i,''))}
function isNoun(item){return!!item?.article||/^(der|die|das)\s/i.test(fullWord(item))||String(item?.category||item?.type||'').toLowerCase()==='noun'}
function cards(theme){
 const task=(theme.tasks||[]).find(item=>item?.id==='karteikarten'||item?.kind==='cards'||/karteikarten/i.test(item?.title||''));
 return Array.isArray(task?.items)?task.items:[];
}
function isWrongModalFallback(item){
 const text=norm(`${item?.prompt||''} ${item?.context||''}`);
 const answer=norm(item?.answer||'');
 return answer==='kann'&&(text.includes('schreibe das passende modalverb')||text.includes('welche form passt ich'));
}

const DEFINITIONS=Object.freeze({
 'prima':'Das bedeutet: sehr gut.',
 'team':'Das ist eine Gruppe. Die Personen arbeiten oder spielen zusammen.',
 'wecken':'Du machst, dass eine Person nicht mehr schläft.',
 'fruhstuck':'Das ist das Essen am Morgen.',
 'fertig':'Etwas ist zu Ende oder bereit.',
 'fertig sein':'Etwas ist zu Ende oder bereit.',
 'los sein':'Man möchte wissen, was gerade passiert.',
 'schreiben':'Du machst Wörter und Sätze mit einem Stift oder am Computer.',
 'mathematik':'In diesem Schulfach rechnet man mit Zahlen.',
 'test':'Eine Aufgabe in der Schule. Die Lehrkraft kontrolliert, was du kannst.',
 'punktlich':'Du kommst genau zur richtigen Zeit.',
 'auf keinen fall':'Das bedeutet: ganz sicher nicht.',
 'auf jeden fall':'Das bedeutet: ganz sicher oder unbedingt.',
 'nach hause':'Du gehst zurück in deine Wohnung oder zu deiner Familie.',
 'schule':'Hier lernen Kinder und Jugendliche.',
 'konnen':'Du hast die Fähigkeit, etwas zu tun.',
 'krank':'Du bist nicht gesund.',
 'arzt':'Ein Mann, der kranke Menschen untersucht und hilft.',
 'arztin':'Eine Frau, die kranke Menschen untersucht und hilft.',
 'backen':'Du machst Brot oder Kuchen im Ofen.',
 'singen':'Du machst Musik mit deiner Stimme.',
 'reiten':'Du sitzt auf einem Pferd und bewegst dich mit ihm.',
 'klavier':'Ein Musikinstrument mit schwarzen und weißen Tasten.',
 'malen':'Du machst ein Bild mit Farben.',
 'ski':'Ein langes Sportgerät für Schnee.',
 'tennis':'Eine Sportart mit Ball und Schläger.',
 'wollen':'Du hast einen starken Wunsch oder einen Plan.',
 'mochten':'Du sagst einen Wunsch höflich.',
 'endlich':'Du hast lange gewartet. Jetzt passiert etwas.',
 'lied':'Das ist Musik mit Wörtern, die man singen kann.',
 'uben':'Du machst etwas oft, damit du es besser kannst.',
 'text':'Das sind mehrere geschriebene Wörter und Sätze.',
 'ubung':'Das ist eine Aufgabe zum Lernen und Trainieren.',
 'brief':'Das ist ein geschriebener Text, den du an eine Person schickst.',
 'buch':'Darin sind viele Seiten mit Texten oder Bildern.',
 'schade':'Etwas ist nicht so, wie du es möchtest. Du findest das traurig.',
 'kilometer':'Das ist eine Einheit für Entfernung. 1000 Meter sind eins.',
 'kommunikation':'Menschen sprechen oder schreiben miteinander und geben Informationen.',
 'madchen':'Das ist ein weibliches Kind.',
 'junge':'Das ist ein männliches Kind.',
 'klasse':'Das ist eine Gruppe von Schülerinnen und Schülern, die zusammen lernt.',
 'schwimmbad':'Das ist ein Ort mit Becken. Dort kann man schwimmen.',
 'eintritt':'Das ist das Geld, das man bezahlt, um zum Beispiel in ein Museum oder Schwimmbad zu gehen.',
 'losfahren':'Eine Fahrt beginnt. Ein Auto, Bus oder Fahrrad startet.',
 'grundschule':'Das ist die erste Schule für Kinder.',
 'unterricht':'Das ist die Zeit in der Schule, in der man zusammen lernt.',
 'leidtun':'Du bist traurig, weil etwas nicht gut war, und entschuldigst dich.',
 'spiel':'Das macht man zum Spaß und meistens nach Regeln.',
 'film':'Das ist eine Geschichte mit bewegten Bildern, die man im Kino oder Fernsehen sehen kann.',
 'grammatik':'Das sind Regeln einer Sprache für Wörter und Sätze.',
 'hausaufgabe':'Das ist eine Aufgabe aus der Schule, die du zu Hause machst.',
 'gitarre':'Das ist ein Musikinstrument mit Saiten.',
 'fahrrad':'Das hat zwei Räder und man fährt damit mit den Beinen.',
 'kuchen':'Das ist etwas Süßes, das man im Ofen backt.',
 'freund':'Das ist eine Person, die du gut kennst und gern hast.',
 'handstand':'Dabei stehst du mit den Händen auf dem Boden und die Füße sind oben.',
 'horen':'Du benutzt deine Ohren und nimmst Töne oder Wörter wahr.',
 'machen':'Du tust oder produzierst etwas.',
 'lesen':'Du siehst geschriebene Wörter und verstehst sie.',
 'sehen':'Du benutzt deine Augen und nimmst etwas wahr.',
 'spielen':'Du machst ein Spiel, Sport oder Musik zum Spaß.',
 'fahren':'Du bewegst dich mit einem Auto, Bus, Fahrrad oder Zug.',
 'treffen':'Du kommst mit einer anderen Person zusammen.',
 'gehen':'Du bewegst dich zu Fuß von einem Ort zu einem anderen.',
 'sprechen':'Du sagst Wörter und Sätze mit deiner Stimme.',
 'franzosisch':'Das ist eine Sprache, die man zum Beispiel in Frankreich spricht.',
 'fotografieren':'Du machst mit einer Kamera oder einem Handy ein Bild.',
 'jonglieren':'Du wirfst mehrere Dinge in die Luft und fängst sie immer wieder.',
 'gut':'Das bedeutet: positiv oder richtig.',
 'sehr gut':'Das bedeutet: besonders gut.',
 'nicht gut':'Das bedeutet: schlecht oder nicht gut genug.',
 'nicht so gut':'Das bedeutet: nur wenig gut.',
 'gar nicht':'Das bedeutet: überhaupt nicht.',
 'ein bisschen':'Das bedeutet: eine kleine Menge oder nur wenig.'
});

function meaningItems(theme){
 const vocabulary=cards(theme).filter(item=>wordKey(fullWord(item))!=='schmecken');
 const usable=vocabulary.filter(item=>DEFINITIONS[wordKey(fullWord(item))]);
 const words=usable.map(fullWord);
 return usable.map((item,index)=>{
  const answer=fullWord(item);
  const options=[answer];
  let step=1;
  while(options.length<6&&step<=words.length+6){
   const candidate=words[(index+step*7)%words.length];
   if(candidate&&!options.includes(candidate))options.push(candidate);
   step++;
  }
  return{
   kind:'choice',
   prompt:DEFINITIONS[wordKey(answer)],
   answer,
   options:options.slice(0,6),
   noHelp:true,
   noImage:true,
   noAudio:true
  };
 });
}

function articleItems(theme){
 return cards(theme).filter(isNoun).map(item=>{
  const singular=fullWord(item);
  const match=singular.match(/^(der|die|das)\s+(.+)$/i);
  if(!match)return null;
  const plural=String(item.plural||'kein Plural').trim()||'kein Plural';
  return{
   kind:'noun-plural',
   image:item.image||'',
   singularAnswer:singular,
   pluralAnswer:plural,
   answer:`${singular} | ${plural}`,
   word:singular
  };
 }).filter(Boolean);
}

const COMBINATIONS=Object.freeze([
 ['Lieder','hören'],
 ['Spiele','spielen'],
 ['Texte','lesen'],
 ['Filme','sehen'],
 ['Grammatik','üben'],
 ['Übungen','machen'],
 ['Hausaufgaben','machen'],
 ['Gitarre','spielen'],
 ['Klavier','spielen'],
 ['Tennis','spielen'],
 ['Ski','fahren'],
 ['Fahrrad','fahren'],
 ['Kuchen','backen'],
 ['Freunde','treffen'],
 ['Handstand','machen'],
 ['Französisch','sprechen'],
 ['zum Arzt','gehen']
]);
function combinationItems(){
 const verbs=[...new Set(COMBINATIONS.map(([,verb])=>verb))];
 return COMBINATIONS.map(([noun,answer],index)=>{
  const options=[answer];
  let step=1;
  while(options.length<6&&step<=verbs.length+6){
   const candidate=verbs[(index+step*2)%verbs.length];
   if(candidate&&!options.includes(candidate))options.push(candidate);
   step++;
  }
  return{kind:'choice',prompt:`${noun} …`,answer,options:options.slice(0,6),noHelp:true};
 });
}

function ensureModalVariety(task){
 if(!task||task.id!=='modalverb-waehlen'||!Array.isArray(task.items))return;
 const answers=new Set(task.items.map(item=>norm(item?.answer)).filter(Boolean));
 if(answers.size>=3)return;
 const extra=[
  {kind:'choice',prompt:'Ich ___ gut singen.',answer:'kann',options:['kann','will','möchte','können'],hint:'Fähigkeit: können.'},
  {kind:'choice',prompt:'Du ___ heute Tennis spielen. Das ist dein Plan.',answer:'willst',options:['willst','kannst','möchtest','wollen'],hint:'Plan: wollen.'},
  {kind:'choice',prompt:'Ich ___ gern einen Tee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'Höflicher Wunsch: möchten.'},
  {kind:'choice',prompt:'Wir ___ gut Fahrrad fahren.',answer:'können',options:['können','wollen','möchten','kann'],hint:'Fähigkeit: können.'},
  {kind:'choice',prompt:'Ihr ___ am Wochenende Ski fahren. Das ist euer Plan.',answer:'wollt',options:['wollt','könnt','möchtet','wollen'],hint:'Plan: wollen.'},
  {kind:'choice',prompt:'Frau Klein ___ einen Kaffee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'Höflicher Wunsch: möchten.'}
 ];
 task.items=[...task.items,...extra];
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const report={removedWrongFallbacks:[],emptyTasks:[],articleCount:0,meaningCount:0,combinationCount:0};
 for(const task of theme.tasks){
  if(!Array.isArray(task.items))task.items=[];
  const modal=/modal|koennen|wollen|verbform/i.test(String(task.id||''));
  if(!modal){
   const before=task.items.length;
   task.items=task.items.filter(item=>!isWrongModalFallback(item));
   if(task.items.length!==before)report.removedWrongFallbacks.push(task.id);
  }
 }

 const meaning=theme.tasks.find(task=>task.id==='bild-erklaerung-wort');
 if(meaning){
  meaning.kind='choice';
  meaning.title='Bedeutungen';
  meaning.description='Lese die Bedeutung und wähle das Wort.';
  meaning.items=meaningItems(theme);
  report.meaningCount=meaning.items.length;
 }

 const article=theme.tasks.find(task=>task.id==='artikel-plural');
 if(article){
  article.kind='noun-plural';
  article.title='Artikel und Plural';
  article.description='Schreibe das Nomen mit Artikel und Plural.';
  article.items=articleItems(theme);
  report.articleCount=article.items.length;
 }

 const combinations=theme.tasks.find(task=>task.id==='nomen-verben-verbinden');
 if(combinations){
  combinations.kind='choice';
  combinations.title='Nomen-Verb-Verbindungen';
  combinations.description='Nomen-Verb-Verbindungen: Welches Verb passt?';
  combinations.items=combinationItems();
  report.combinationCount=combinations.items.length;
 }

 ensureModalVariety(theme.tasks.find(task=>task.id==='modalverb-waehlen'));
 report.emptyTasks=theme.tasks.filter(task=>!task.exam&&(!Array.isArray(task.items)||!task.items.length)).map(task=>task.id);
 theme.qualityRevision='l7t1-quality-content-2026-08-13-v3';
 window.L7T1QualityReport=report;
 return theme;
});
})();
