(function(){
'use strict';
if(window.__SP_L7T1_CONTENT_ONLY_2)return;
window.__SP_L7T1_CONTENT_ONLY_2=true;

const META=Object.freeze({
 'karteikarten':['Karteikarten','Sprich oder schreibe jedes einzelne Wort richtig.'],
 'bild-erklaerung-wort':['Bedeutung → Wort','Finde das passende Wort.'],
 'artikel-plural':['Artikel und Plural','Schreibe Singular und Plural mit Artikel.'],
 'nomen-verben-verbinden':['Was passt zusammen?','Verbinde das Nomen mit dem passenden Verb.'],
 'koennen-formen':['Verb „können“','Finde die richtige Form von „können“.'],
 'wollen-formen':['Verb „wollen“','Finde die richtige Form von „wollen“.'],
 'verbform-waehlen':['Verbform auswählen','Wähle die richtige Verbform.'],
 'aussagen-ordnen':['Aussagesätze','Ordne den Aussagesatz.'],
 'ja-nein-fragen':['Ja-/Nein-Fragen','Ordne die Ja-/Nein-Frage.'],
 'w-fragen':['W-Fragen','Ordne die W-Frage.'],
 'faehigkeiten-abstufen':['Wie gut?','Wähle die passende Abstufung.'],
 'bildimpulse':['Sprechen und Schreiben','Sprich oder schreibe den Satz.'],
 'fragen-antworten':['Fragen und Antworten','Finde die passende Antwort.'],
 'partnerinterview':['Partnerinterview','Beantworte die Frage in vollständigen Sätzen.'],
 'wollen-moechten':['Wollen oder möchten','Wähle „wollen“ oder „möchten“.'],
 'dialoge-ergaenzen':['Dialoge ergänzen','Ergänze den Dialog.'],
 'hoeren-wuensche':['Hören und Verstehen','Höre und schreibe die Antwort.'],
 'eigene-faehigkeiten':['Eigene Fähigkeiten und Pläne','Schreibe über deine Fähigkeiten, Wünsche und Pläne.'],
 'hoeren-erkennen':['Hören und Erkennen','Höre und erkenne die Aktivität.'],
 'pruefung':['Themenprüfung','Zeige, was du gelernt hast.']
});

const EXAMPLES=Object.freeze({
 'prima':'Das Essen schmeckt prima.',
 'das team':'Wir arbeiten im Team.',
 'wecken':'Meine Mutter weckt mich um sieben Uhr.',
 'das frühstück':'Das Frühstück ist fertig.',
 'fertig':'Ich bin mit der Aufgabe fertig.',
 'fertig sein':'Ich bin mit der Aufgabe fertig.',
 'los sein':'Was ist los?',
 'schreiben':'Ich schreibe einen Brief.',
 'die mathematik':'Mathematik ist heute einfach.',
 'mathematik':'Mathematik ist heute einfach.',
 'der test':'Wir schreiben heute einen Test.',
 'pünktlich':'Ali kommt pünktlich zum Unterricht.',
 'auf keinen fall':'Ich komme auf keinen Fall zu spät.',
 'auf jeden fall':'Ich komme auf jeden Fall mit.',
 'schmecken':'Der Kuchen schmeckt gut.',
 'nach hause':'Ich gehe nach Hause.',
 'die schule':'Die Kinder gehen in die Schule.',
 'können':'Ich kann gut schwimmen.',
 'krank':'Maria ist heute krank.',
 'der arzt':'Der Arzt untersucht den Patienten.',
 'die ärztin':'Die Ärztin arbeitet im Krankenhaus.',
 'backen':'Wir backen einen Kuchen.',
 'singen':'Jana kann gut singen.',
 'reiten':'Anna möchte reiten.',
 'das klavier':'Das Klavier steht im Wohnzimmer.',
 'malen':'Mina malt ein Bild.',
 'der ski':'Die Skier stehen im Keller.',
 'das tennis':'Wir spielen am Samstag Tennis.',
 'wollen':'Wir wollen heute grillen.',
 'möchten':'Ich möchte einen Tee.',
 'endlich':'Der Bus kommt endlich.',
 'das lied':'Wir hören ein Lied.',
 'üben':'Ich übe jeden Tag Deutsch.',
 'der text':'Ich lese den Text.',
 'die übung':'Die Übung ist leicht.',
 'der brief':'Ich schreibe einen Brief.',
 'das buch':'Ich lese ein Buch.',
 'das spiel':'Wir machen ein Spiel.',
 'der film':'Wir sehen einen Film.',
 'die grammatik':'Wir üben die Grammatik.',
 'die hausaufgabe':'Ich mache meine Hausaufgabe.',
 'die gitarre':'Die Gitarre steht im Zimmer.',
 'das fahrrad':'Das Fahrrad ist neu.',
 'der kuchen':'Der Kuchen schmeckt gut.',
 'der freund':'Mein Freund spielt Tennis.',
 'der handstand':'Sie kann einen Handstand machen.',
 'hören':'Ich höre ein Lied.',
 'machen':'Wir machen eine Übung.',
 'lesen':'Ich lese einen Text.',
 'sehen':'Wir sehen einen Film.',
 'spielen':'Wir spielen am Samstag.',
 'fahren':'Wir fahren am Wochenende Fahrrad.',
 'treffen':'Ich treffe meine Freunde.',
 'gehen':'Ich gehe zum Arzt.',
 'sprechen':'Sie spricht Französisch.',
 'französisch':'Er spricht Französisch.',
 'fotografieren':'Ich fotografiere gern.',
 'jonglieren':'Er kann gut jonglieren.'
});

const PLURALS=Object.freeze({
 'das team':'die Teams',
 'das frühstück':'die Frühstücke',
 'die mathematik':'kein Plural',
 'der test':'die Tests',
 'die schule':'die Schulen',
 'der arzt':'die Ärzte',
 'die ärztin':'die Ärztinnen',
 'das klavier':'die Klaviere',
 'der ski':'die Skier',
 'das tennis':'kein Plural',
 'das lied':'die Lieder',
 'der text':'die Texte',
 'die übung':'die Übungen',
 'der brief':'die Briefe',
 'das buch':'die Bücher',
 'das spiel':'die Spiele',
 'der film':'die Filme',
 'die grammatik':'die Grammatiken',
 'die hausaufgabe':'die Hausaufgaben',
 'die gitarre':'die Gitarren',
 'das fahrrad':'die Fahrräder',
 'der kuchen':'die Kuchen',
 'der freund':'die Freunde',
 'der handstand':'die Handstände'
});

const ADDED_CARDS=Object.freeze([
 ['das Spiel','noun','die Spiele','spiel.webp',{en:'game',ru:'игра',tr:'oyun',uk:'гра',ar:'لعبة',ja:'ゲーム',ro:'joc',pl:'gra',ku:'lîstik'}],
 ['der Film','noun','die Filme','film.webp',{en:'film / movie',ru:'фильм',tr:'film',uk:'фільм',ar:'فيلم',ja:'映画',ro:'film',pl:'film',ku:'fîlm'}],
 ['die Grammatik','noun','die Grammatiken','grammatik.webp',{en:'grammar',ru:'грамматика',tr:'dil bilgisi',uk:'граматика',ar:'قواعد اللغة',ja:'文法',ro:'gramatică',pl:'gramatyka',ku:'rêziman'}],
 ['die Hausaufgabe','noun','die Hausaufgaben','hausaufgabe.webp',{en:'homework',ru:'домашнее задание',tr:'ödev',uk:'домашнє завдання',ar:'واجب منزلي',ja:'宿題',ro:'temă',pl:'praca domowa',ku:'karê malê'}],
 ['die Gitarre','noun','die Gitarren','gitarre.webp',{en:'guitar',ru:'гитара',tr:'gitar',uk:'гітара',ar:'غيتار',ja:'ギター',ro:'chitară',pl:'gitara',ku:'gîtar'}],
 ['das Fahrrad','noun','die Fahrräder','fahrrad.webp',{en:'bicycle',ru:'велосипед',tr:'bisiklet',uk:'велосипед',ar:'دراجة هوائية',ja:'自転車',ro:'bicicletă',pl:'rower',ku:'bisîklet'}],
 ['der Kuchen','noun','die Kuchen','kuchen.webp',{en:'cake',ru:'пирог',tr:'kek',uk:'пиріг',ar:'كعكة',ja:'ケーキ',ro:'prăjitură',pl:'ciasto',ku:'kek'}],
 ['der Freund','noun','die Freunde','freund.webp',{en:'friend',ru:'друг',tr:'arkadaş',uk:'друг',ar:'صديق',ja:'友達',ro:'prieten',pl:'przyjaciel',ku:'heval'}],
 ['der Handstand','noun','die Handstände','handstand.webp',{en:'handstand',ru:'стойка на руках',tr:'amuda kalkma',uk:'стійка на руках',ar:'الوقوف على اليدين',ja:'逆立ち',ro:'stând în mâini',pl:'stanie na rękach',ku:'li ser destan rawestan'}],
 ['hören','verb','', 'hoeren.webp',{en:'to hear / listen',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يسمع / يستمع',ja:'聞く',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'}],
 ['machen','verb','', 'machen.webp',{en:'to do / make',ru:'делать',tr:'yapmak',uk:'робити',ar:'يفعل',ja:'する',ro:'a face',pl:'robić',ku:'kirin'}],
 ['lesen','verb','', 'lesen.webp',{en:'to read',ru:'читать',tr:'okumak',uk:'читати',ar:'يقرأ',ja:'読む',ro:'a citi',pl:'czytać',ku:'xwendin'}],
 ['sehen','verb','', 'sehen.webp',{en:'to see / watch',ru:'смотреть',tr:'görmek / izlemek',uk:'дивитися',ar:'يرى / يشاهد',ja:'見る',ro:'a vedea',pl:'widzieć / oglądać',ku:'dîtin'}],
 ['spielen','verb','', 'spielen.webp',{en:'to play',ru:'играть',tr:'oynamak',uk:'грати',ar:'يلعب',ja:'遊ぶ / 演奏する',ro:'a juca',pl:'grać',ku:'lîstin'}],
 ['fahren','verb','', 'fahren.webp',{en:'to go / drive / ride',ru:'ехать',tr:'gitmek / sürmek',uk:'їхати',ar:'يذهب بالمركبة',ja:'乗って行く',ro:'a merge cu',pl:'jechać',ku:'çûn bi wesayîtê'}],
 ['treffen','verb','', 'treffen.webp',{en:'to meet',ru:'встречать',tr:'buluşmak',uk:'зустрічати',ar:'يقابل',ja:'会う',ro:'a întâlni',pl:'spotykać',ku:'hevdîtin'}],
 ['gehen','verb','', 'gehen.webp',{en:'to go',ru:'идти',tr:'gitmek',uk:'йти',ar:'يذهب',ja:'行く',ro:'a merge',pl:'iść',ku:'çûn'}],
 ['sprechen','verb','', 'sprechen.webp',{en:'to speak',ru:'говорить',tr:'konuşmak',uk:'говорити',ar:'يتكلم',ja:'話す',ro:'a vorbi',pl:'mówić',ku:'axivîn'}],
 ['Französisch','other','', 'franzoesisch.webp',{en:'French',ru:'французский язык',tr:'Fransızca',uk:'французька мова',ar:'الفرنسية',ja:'フランス語',ro:'franceză',pl:'francuski',ku:'fransî'}],
 ['fotografieren','verb','', 'fotografieren.webp',{en:'to take photos',ru:'фотографировать',tr:'fotoğraf çekmek',uk:'фотографувати',ar:'يصور',ja:'写真を撮る',ro:'a fotografia',pl:'fotografować',ku:'wêne kişandin'}],
 ['jonglieren','verb','', 'jonglieren.webp',{en:'to juggle',ru:'жонглировать',tr:'jonglörlük yapmak',uk:'жонглювати',ar:'يمارس ألعاب الخفة',ja:'ジャグリングする',ro:'a jongla',pl:'żonglować',ku:'jonglêrî kirin'}]
]);

const COMBINATIONS=Object.freeze([
 ['Lieder','hören'],
 ['Spiele','machen'],
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

const COMBINATION_CARDS=new Set(COMBINATIONS.map(([noun,verb])=>normalize(noun+' '+verb)));
[
 'Lied hören','Spiel machen','Text lesen','Film sehen','Grammatik üben','Übung machen',
 'Hausaufgabe machen','Freund treffen','Arzt gehen'
].forEach(value=>COMBINATION_CARDS.add(normalize(value)));

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
}
function slug(value){
 return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/i,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function fullWord(item){
 const direct=String(item?.full||item?.word||item?.answer||item?.term||'').trim();
 const article=String(item?.article||'').trim();
 if(article&&!/^(der|die|das)\s/i.test(direct))return`${article} ${direct}`.trim();
 return direct;
}
function isNoun(item){return!!item?.article||/^(der|die|das)\s/i.test(fullWord(item))||String(item?.category||item?.type||'').toLowerCase()==='noun'}
function bannedText(value){
 const text=normalize(value);
 return /(^|\s)lieb($|\s)/.test(text)||text.includes('diktat');
}
function cleanTaskItems(task){
 if(!Array.isArray(task?.items))return task;
 task.items=task.items.filter(item=>{
  try{return!bannedText(JSON.stringify(item))}catch(error){return true}
 });
 return task;
}
function defaultCard(entry){
 const[word,category,plural,image,translations]=entry;
 const normalized=normalize(word);
 const articleMatch=word.match(/^(der|die|das)\s+(.+)$/i);
 return{
  word,
  full:word,
  answer:word,
  answers:articleMatch?[word,articleMatch[2]]:[word],
  article:articleMatch?articleMatch[1].toLowerCase():'',
  category,
  type:category,
  plural:plural||'',
  image,
  audio:slug(word),
  meaning:translations.en||word,
  translations,
  example:EXAMPLES[normalized]||''
 };
}
function prepareCards(task){
 const source=Array.isArray(task?.items)?task.items:[];
 const cards=[];
 const seen=new Set();
 for(const original of source){
  const item={...original};
  const full=fullWord(item);
  const key=normalize(full);
  if(!key||bannedText(key)||COMBINATION_CARDS.has(key))continue;
  if(seen.has(key))continue;
  item.full=full;
  item.word=full;
  item.answer=item.answer||full;
  item.answers=Array.isArray(item.answers)?item.answers:[item.answer,full].filter(Boolean);
  item.example=EXAMPLES[key]||item.example||'';
  item.audio=item.audio||slug(full);
  if(isNoun(item))item.plural=item.plural||PLURALS[key]||'';
  cards.push(item);
  seen.add(key);
 }
 for(const entry of ADDED_CARDS){
  const key=normalize(entry[0]);
  if(seen.has(key))continue;
  cards.push(defaultCard(entry));
  seen.add(key);
 }
 task.kind='cards';
 task.items=cards;
 task.title=META.karteikarten[0];
 task.description=META.karteikarten[1];
 return cards;
}
function cardMap(cards){return new Map(cards.map(item=>[normalize(fullWord(item)),item]))}
function cardFor(map,word){return map.get(normalize(word))||null}
function imageFor(map,word){return cardFor(map,word)?.image||`${slug(word)}.webp`}
function meaningTask(map){
 const rows=[
  ['können','fähig sein, etwas zu tun',['wollen','können','möchten','machen']],
  ['wollen','einen festen Wunsch oder Plan haben',['können','möchten','wollen','spielen']],
  ['möchten','einen höflichen Wunsch ausdrücken',['möchten','wollen','können','gehen']],
  ['auf jeden Fall','ganz sicher oder unbedingt',['auf keinen Fall','endlich','auf jeden Fall','prima']],
  ['auf keinen Fall','ganz sicher nicht',['auf jeden Fall','auf keinen Fall','nicht so gut','krank']],
  ['das Lied','ein kurzer Text mit Musik',['der Text','das Lied','das Spiel','der Film']],
  ['der Text','geschriebene Wörter und Sätze',['der Brief','der Test','der Text','das Buch']],
  ['die Übung','eine Aufgabe zum Lernen und Trainieren',['die Schule','die Grammatik','die Übung','die Hausaufgabe']],
  ['das Klavier','ein Musikinstrument mit schwarzen und weißen Tasten',['die Gitarre','das Klavier','das Fahrrad','der Ski']],
  ['der Ski','ein langes Sportgerät für Schnee',['das Tennis','der Ski','das Fahrrad','das Spiel']],
  ['das Tennis','eine Sportart mit Ball und Schläger',['das Spiel','das Tennis','der Handstand','der Film']],
  ['backen','einen Kuchen im Ofen machen',['machen','backen','lesen','sehen']],
  ['singen','mit der Stimme Musik machen',['sprechen','hören','singen','spielen']],
  ['reiten','auf einem Pferd sitzen und fahren',['fahren','reiten','gehen','jonglieren']]
 ];
 return{
  id:'bild-erklaerung-wort',icon:'🔎',kind:'choice',title:META['bild-erklaerung-wort'][0],description:META['bild-erklaerung-wort'][1],
  items:rows.map(([answer,prompt,options])=>({answer,prompt,options,image:imageFor(map,answer),hint:`Das gesuchte Wort beginnt mit „${answer[0]}“.`}))
 };
}
function articlePluralTask(cards){
 const nouns=cards.filter(isNoun);
 return{
  id:'artikel-plural',icon:'🧩',kind:'input',title:META['artikel-plural'][0],description:META['artikel-plural'][1],
  items:nouns.map(item=>{
   const singular=fullWord(item);
   const articleMatch=singular.match(/^(der|die|das)\s+(.+)$/i);
   const noun=articleMatch?articleMatch[2]:singular;
   const plural=String(item.plural||PLURALS[normalize(singular)]||'kein Plural').trim();
   const answer=`${singular} – ${plural}`;
   return{
    prompt:`${noun}: Schreibe den Singular und den Plural mit Artikel.`,
    context:'Beispiel: Buch → das Buch – die Bücher',
    answer,
    answers:[answer,`${singular}, ${plural}`,`${singular}; ${plural}`,`${singular} ${plural}`],
    hint:`Beginne mit „${articleMatch?.[1]||'der/die/das'} ${noun}“`,
    image:item.image||''
   };
  })
 };
}
function combinationTask(){
 const verbs=[...new Set(COMBINATIONS.map(([,verb])=>verb))];
 return{
  id:'nomen-verben-verbinden',icon:'🔗',kind:'choice',title:META['nomen-verben-verbinden'][0],description:META['nomen-verben-verbinden'][1],
  items:COMBINATIONS.map(([noun,answer],index)=>{
   const options=[answer];
   for(let step=1;options.length<4&&step<verbs.length+2;step++){
    const candidate=verbs[(index+step*3)%verbs.length];
    if(!options.includes(candidate))options.push(candidate);
   }
   return{prompt:`${noun} …`,context:'Welches Verb passt?',answer,options,hint:`Die richtige Verbindung lautet: ${noun} ${answer}.`};
  })
 };
}
function mergeOwnTasks(tasks){
 const abilities=tasks.find(task=>task.id==='eigene-faehigkeiten');
 const plans=tasks.find(task=>task.id==='eigene-plaene');
 if(!abilities||!plans)return tasks;
 abilities.title=META['eigene-faehigkeiten'][0];
 abilities.description=META['eigene-faehigkeiten'][1];
 abilities.icon=abilities.icon||'✍️';
 abilities.items=[...(abilities.items||[]),...(plans.items||[])];
 return tasks.filter(task=>task!==plans);
}
function ensureListeningRecognition(tasks){
 const task=tasks.find(item=>item.id==='hoeren-erkennen');
 if(!task)return;
 const sounds=[
  ['backen','l7t1-geraeusch-backen.mp3'],
  ['Ski fahren','l7t1-geraeusch-ski-fahren.mp3'],
  ['Tennis spielen','l7t1-geraeusch-tennis-spielen.mp3'],
  ['Klavier spielen','l7t1-geraeusch-klavier-spielen.mp3'],
  ['malen','l7t1-geraeusch-malen.mp3'],
  ['reiten','l7t1-geraeusch-reiten.mp3'],
  ['Französisch sprechen','l7t1-geraeusch-franzoesisch-sprechen.mp3'],
  ['singen','l7t1-geraeusch-singen.mp3'],
  ['fotografieren','l7t1-geraeusch-fotografieren.mp3'],
  ['jonglieren','l7t1-geraeusch-jonglieren.mp3']
 ];
 const labels=sounds.map(([label])=>label);
 task.kind='choice';
 task.items=sounds.map(([answer,audio],index)=>({
  prompt:'Welche Aktivität hörst du?',audio,answer,
  options:[answer,labels[(index+3)%labels.length],labels[(index+6)%labels.length],labels[(index+8)%labels.length]].filter((value,pos,array)=>array.indexOf(value)===pos),
  hint:`Achte genau auf das Geräusch von „${answer}“.`
 }));
}
function applyMeta(tasks){
 for(const task of tasks){
  const meta=META[task.id];
  if(meta){task.title=meta[0];task.description=meta[1]}
  cleanTaskItems(task);
 }
}
function enrich(theme){
 if(!theme||!Array.isArray(theme.tasks))throw new Error('Die L7T1-Daten konnten nicht geladen werden.');
 theme.title='Thema 1: Fähigkeiten, Wünsche und Pläne';
 theme.subtitle='A1 · Lektion 7 · Thema 1';
 theme.goal='Du kannst über Fähigkeiten, Wünsche und Pläne sprechen.';

 let tasks=theme.tasks.filter(task=>{
  const text=normalize(`${task?.id||''} ${task?.title||''}`);
  return!text.includes('diktat')&&!text.includes('wortdiktat');
 });
 let cardsTask=tasks.find(task=>task.id==='karteikarten'||task.kind==='cards');
 if(!cardsTask){cardsTask={id:'karteikarten',icon:'🗂️',kind:'cards',items:[]};tasks.unshift(cardsTask)}
 const cards=prepareCards(cardsTask);
 const map=cardMap(cards);
 window.L7T1_VOCAB=cards;

 const meaning=meaningTask(map);
 const article=articlePluralTask(cards);
 const combinations=combinationTask();
 tasks=tasks.filter(task=>!['bild-erklaerung-wort','artikel-plural','nomen-verben-verbinden'].includes(task.id));
 const cardIndex=Math.max(0,tasks.indexOf(cardsTask));
 tasks.splice(cardIndex+1,0,meaning,article,combinations);
 tasks=mergeOwnTasks(tasks);
 ensureListeningRecognition(tasks);
 applyMeta(tasks);

 const exam=tasks.find(task=>task.exam||task.id==='pruefung');
 if(exam){tasks=tasks.filter(task=>task!==exam);exam.exam=true;tasks.push(exam)}
 theme.tasks=tasks;
 theme.contentRevision='l7t1-combinations-article-plural-2026-08-01';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(enrich);
})();
