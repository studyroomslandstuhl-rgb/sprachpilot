(function(){
'use strict';
const TRANSLATIONS={"Englisch":{"prima":"great / excellent","das Team":"team","wecken":"to wake someone","das Frühstück":"breakfast","fertig":"finished / ready","los sein":"to be happening","schreiben":"to write","Mathematik":"mathematics","der Test":"test","pünktlich":"on time","auf keinen Fall":"definitely not","auf jeden Fall":"definitely / in any case","schmecken":"to taste","nach Hause":"home","die Schule":"school","krank":"ill / sick","der Arzt":"doctor (male)","die Ärztin":"doctor (female)","backen":"to bake","singen":"to sing","reiten":"to ride a horse","das Klavier":"piano","Klavier spielen":"to play the piano","malen":"to paint / draw","der Ski":"ski","Ski fahren":"to ski","Tennis spielen":"to play tennis","endlich":"finally","das Lied":"song","üben":"to practise","der Text":"text","die Übung":"exercise","der Brief":"letter","das Diktat":"dictation","das Buch":"book"},"Russisch":{"prima":"отлично","das Team":"команда","wecken":"будить","das Frühstück":"завтрак","fertig":"готовый / законченный","los sein":"происходить","schreiben":"писать","Mathematik":"математика","der Test":"тест","pünktlich":"вовремя","auf keinen Fall":"ни в коем случае","auf jeden Fall":"обязательно / в любом случае","schmecken":"быть на вкус","nach Hause":"домой","die Schule":"школа","krank":"больной","der Arzt":"врач (мужчина)","die Ärztin":"врач (женщина)","backen":"печь","singen":"петь","reiten":"ездить верхом","das Klavier":"пианино","Klavier spielen":"играть на пианино","malen":"рисовать","der Ski":"лыжа","Ski fahren":"кататься на лыжах","Tennis spielen":"играть в теннис","endlich":"наконец","das Lied":"песня","üben":"упражняться / тренироваться","der Text":"текст","die Übung":"упражнение","der Brief":"письмо","das Diktat":"диктант","das Buch":"книга"},"Ukrainisch":{"prima":"чудово","das Team":"команда","wecken":"будити","das Frühstück":"сніданок","fertig":"готовий / закінчений","los sein":"відбуватися","schreiben":"писати","Mathematik":"математика","der Test":"тест","pünktlich":"вчасно","auf keinen Fall":"у жодному разі","auf jeden Fall":"обов’язково / у будь-якому разі","schmecken":"мати смак","nach Hause":"додому","die Schule":"школа","krank":"хворий","der Arzt":"лікар","die Ärztin":"лікарка","backen":"пекти","singen":"співати","reiten":"їздити верхи","das Klavier":"піаніно","Klavier spielen":"грати на піаніно","malen":"малювати","der Ski":"лижа","Ski fahren":"кататися на лижах","Tennis spielen":"грати в теніс","endlich":"нарешті","das Lied":"пісня","üben":"тренуватися / вправлятися","der Text":"текст","die Übung":"вправа","der Brief":"лист","das Diktat":"диктант","das Buch":"книга"},"Türkisch":{"prima":"harika","das Team":"takım","wecken":"uyandırmak","das Frühstück":"kahvaltı","fertig":"hazır / bitmiş","los sein":"olmak / gerçekleşmek","schreiben":"yazmak","Mathematik":"matematik","der Test":"test","pünktlich":"zamanında","auf keinen Fall":"kesinlikle hayır","auf jeden Fall":"kesinlikle / her hâlükârda","schmecken":"tadı olmak","nach Hause":"eve","die Schule":"okul","krank":"hasta","der Arzt":"doktor (erkek)","die Ärztin":"doktor (kadın)","backen":"fırında pişirmek","singen":"şarkı söylemek","reiten":"ata binmek","das Klavier":"piyano","Klavier spielen":"piyano çalmak","malen":"resim yapmak","der Ski":"kayak","Ski fahren":"kayak yapmak","Tennis spielen":"tenis oynamak","endlich":"sonunda","das Lied":"şarkı","üben":"alıştırma yapmak","der Text":"metin","die Übung":"alıştırma","der Brief":"mektup","das Diktat":"dikte","das Buch":"kitap"},"Arabisch":{"prima":"ممتاز","das Team":"الفريق","wecken":"يوقظ","das Frühstück":"الفطور","fertig":"جاهز / منتهٍ","los sein":"يحدث","schreiben":"يكتب","Mathematik":"الرياضيات","der Test":"الاختبار","pünktlich":"في الموعد","auf keinen Fall":"مستحيل / بأي حال من الأحوال","auf jeden Fall":"بالتأكيد / على كل حال","schmecken":"يكون مذاقه","nach Hause":"إلى البيت","die Schule":"المدرسة","krank":"مريض","der Arzt":"الطبيب","die Ärztin":"الطبيبة","backen":"يخبز","singen":"يغني","reiten":"يركب الخيل","das Klavier":"البيانو","Klavier spielen":"يعزف البيانو","malen":"يرسم","der Ski":"زَلّاجة","Ski fahren":"يتزلج","Tennis spielen":"يلعب التنس","endlich":"أخيرًا","das Lied":"الأغنية","üben":"يتدرّب","der Text":"النص","die Übung":"التمرين","der Brief":"الرسالة","das Diktat":"الإملاء","das Buch":"الكتاب"},"Rumänisch":{"prima":"excelent","das Team":"echipa","wecken":"a trezi","das Frühstück":"micul dejun","fertig":"gata / terminat","los sein":"a se întâmpla","schreiben":"a scrie","Mathematik":"matematică","der Test":"testul","pünktlich":"punctual / la timp","auf keinen Fall":"în niciun caz","auf jeden Fall":"cu siguranță / în orice caz","schmecken":"a avea gust","nach Hause":"acasă","die Schule":"școala","krank":"bolnav","der Arzt":"medicul","die Ärztin":"doctorița","backen":"a coace","singen":"a cânta","reiten":"a călări","das Klavier":"pianul","Klavier spielen":"a cânta la pian","malen":"a picta / desena","der Ski":"schiul","Ski fahren":"a schia","Tennis spielen":"a juca tenis","endlich":"în sfârșit","das Lied":"cântecul","üben":"a exersa","der Text":"textul","die Übung":"exercițiul","der Brief":"scrisoarea","das Diktat":"dictarea","das Buch":"cartea"},"Polnisch":{"prima":"świetnie","das Team":"zespół","wecken":"budzić","das Frühstück":"śniadanie","fertig":"gotowy / skończony","los sein":"dziać się","schreiben":"pisać","Mathematik":"matematyka","der Test":"test","pünktlich":"punktualnie","auf keinen Fall":"w żadnym wypadku","auf jeden Fall":"na pewno / w każdym razie","schmecken":"smakować","nach Hause":"do domu","die Schule":"szkoła","krank":"chory","der Arzt":"lekarz","die Ärztin":"lekarka","backen":"piec","singen":"śpiewać","reiten":"jeździć konno","das Klavier":"pianino","Klavier spielen":"grać na pianinie","malen":"malować / rysować","der Ski":"narta","Ski fahren":"jeździć na nartach","Tennis spielen":"grać w tenisa","endlich":"wreszcie","das Lied":"piosenka","üben":"ćwiczyć","der Text":"tekst","die Übung":"ćwiczenie","der Brief":"list","das Diktat":"dyktando","das Buch":"książka"},"Japanisch":{"prima":"すばらしい","das Team":"チーム","wecken":"起こす","das Frühstück":"朝食","fertig":"できあがった / 終わった","los sein":"起きている","schreiben":"書く","Mathematik":"数学","der Test":"テスト","pünktlich":"時間どおりに","auf keinen Fall":"絶対に～ない","auf jeden Fall":"必ず / とにかく","schmecken":"味がする","nach Hause":"家へ","die Schule":"学校","krank":"病気の","der Arzt":"男性医師","die Ärztin":"女性医師","backen":"焼く","singen":"歌う","reiten":"乗馬する","das Klavier":"ピアノ","Klavier spielen":"ピアノを弾く","malen":"絵を描く","der Ski":"スキー板","Ski fahren":"スキーをする","Tennis spielen":"テニスをする","endlich":"やっと","das Lied":"歌","üben":"練習する","der Text":"文章","die Übung":"練習問題","der Brief":"手紙","das Diktat":"書き取り","das Buch":"本"}};
window.L7T1_TRANSLATIONS=TRANSLATIONS;
const clone=value=>JSON.parse(JSON.stringify(value));
const norm=value=>String(value||'').trim().toLowerCase();
const rotate=(list,offset)=>{const a=[...list];if(!a.length)return a;const n=((offset%a.length)+a.length)%a.length;return a.slice(n).concat(a.slice(0,n))};
const choiceOptions=(answer,pool,index,count=4)=>{
 const other=[...new Set(pool.filter(value=>value&&value!==answer))];
 return [answer,...rotate(other,index).slice(0,Math.max(1,count-1))];
};
const findTask=(tasks,id)=>tasks.find(task=>task.id===id);
const wordsBy=(cards,names)=>names.map(name=>cards.find(item=>item.word===name)).filter(Boolean);
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const source=Object.fromEntries(theme.tasks.map(task=>[task.id,task]));
 const cards=clone(source.karteikarten||{items:[]});
 cards.id='karteikarten';cards.title='Karteikarten';cards.icon='🃏';cards.description='Lerne die Wörter.';cards.instruction='Sprich oder schreibe das deutsche Wort. Drehe die Karte nur um, wenn du Hilfe brauchst.';
 const seenCardWords=new Set();
 cards.items=(cards.items||[]).filter(item=>{const key=norm(item.word);if(!key||seenCardWords.has(key))return false;seenCardWords.add(key);return true}).map(item=>({...item,kind:'card',audio:item.audio||item.word}));

 const allCards=cards.items||[];
 const allWords=allCards.map(item=>item.word);
 const meaningNames=['prima','fertig','los sein','Mathematik','pünktlich','auf keinen Fall','auf jeden Fall','schmecken','nach Hause','endlich'];
 const meaningItems=wordsBy(allCards,meaningNames).map((item,index)=>({
  kind:'choice',prompt:item.meaning,answer:item.word,options:choiceOptions(item.word,allWords,index),hint:`Das Wort beginnt mit „${item.word[0]}“.`
 }));
 const imageNames=['das Team','wecken','die Schule','der Arzt','die Ärztin','backen','singen','reiten','Klavier spielen','malen'];
 const imageCards=wordsBy(allCards,imageNames);
 const imageItems=imageCards.map((item,index)=>({
  kind:'choice',prompt:'Welches Wort passt zum Bild?',answer:item.word,options:choiceOptions(item.word,imageCards.map(card=>card.word),index),hint:'Sieh das Bild genau an.',image:item.image
 }));
 const listenItems=imageCards.map((item,index)=>({
  kind:'image-choice',prompt:'Welches Bild passt zum Wort?',answer:item.word,audio:item.word,
  options:choiceOptions(item.word,imageCards.map(card=>card.word),index).map(word=>{const card=imageCards.find(entry=>entry.word===word);return{label:word,image:card?.image||''}}),
  hint:'Höre das Wort noch einmal.'
 }));

 const nounNames=['das Team','das Frühstück','der Test','die Schule','der Arzt','die Ärztin','das Klavier','der Ski','das Lied','das Buch'];
 const nouns=wordsBy(allCards,nounNames);
 const articleItems=nouns.map(item=>{
  const match=item.word.match(/^(der|die|das)\s+(.+)$/i),article=match?.[1]||'',noun=match?.[2]||item.word;
  return{kind:'choice',prompt:`___ ${noun}`,answer:article,options:['der','die','das'],hint:`Das Wort heißt „${item.word}“.`}
 });
 const pluralItems=nouns.filter(item=>item.plural).map(item=>({
  kind:'produce',prompt:`${item.word}`,answer:item.plural,answers:[String(item.plural).replace(/^die\s+/i,'')],hint:'Beginne mit „die“.',audio:item.word
 }));

 const simple=(id,title,icon,description,instruction)=>{
  const task=clone(source[id]||{id,items:[]});Object.assign(task,{id,title,icon,description,instruction});return task
 };
 const koennen=simple('koennen-formen','können','KANN','Wähle die richtige Form von „können“.','Wähle die richtige Form von „können“.');
 const wollen=simple('wollen-formen','wollen','WILL','Wähle die richtige Form von „wollen“.','Wähle die richtige Form von „wollen“.');
 wollen.items=(wollen.items||[]).filter(item=>norm(item.answer)!=='auf jeden fall');
 const verbform=simple('verbform-waehlen','Verbformen','Aa','Wähle die passende Verbform.','Wähle die passende Form von „können“ oder „wollen“.');
 const aussagen=simple('aussagen-ordnen','Aussagesätze','1–2–3','Ordne den Aussagesatz.','Ordne den Satz. Das Modalverb steht auf Position 2, der Infinitiv am Ende.');
 const jaNein=simple('ja-nein-fragen','Ja-/Nein-Fragen','?','Ordne die Ja-/Nein-Frage.','Ordne die Frage. Das Modalverb steht auf Position 1.');
 const wFragen=simple('w-fragen','W-Fragen','W?','Ordne die W-Frage.','Ordne die Frage: Fragewort – Modalverb – Subjekt – Ergänzung – Infinitiv.');
 const faehigkeiten=simple('faehigkeiten-abstufen','Fähigkeiten','★★★','Wähle die passende Abstufung.','Wähle den Satz mit der passenden Abstufung.');
 const abilityLabels=['sehr gut','gut','ein bisschen','nicht so gut','gar nicht'];
 (faehigkeiten.items||[]).forEach((item,index)=>{const parts=String(item.prompt||'').split('/').map(x=>x.trim());if(parts.length>=2)item.prompt=`${parts[0]} / ${parts[1]} / ${abilityLabels[index]||parts[2]||''}`});
 const bildimpulse=simple('bildimpulse','Bildimpulse','🖼️💬','Sprich oder schreibe einen vollständigen Satz.','Sieh das Bild an. Sprich oder schreibe einen vollständigen Satz.');
 (bildimpulse.items||[]).forEach(item=>{item.kind='produce'});
 const fragen=simple('fragen-antworten','Fragen und Antworten','💬','Finde die passende Antwort.','Lies die Frage und wähle die passende Antwort.');
 const moechten=simple('wollen-moechten','wollen oder möchten?','W/M','Unterscheide Plan und höflichen Wunsch.','Wähle „wollen“ für einen Plan und „möchten“ für einen höflichen Wunsch.');
 const dialoge=simple('dialoge-ergaenzen','Dialoge ergänzen','▤','Ergänze den Dialog.','Lies den Dialog und wähle die passenden Formen.');
 dialoge.items=(dialoge.items||[]).map((item,index)=>{
  const answer=String(item.answer||'').replace(/\s*\|\s*/g,' – ');
  const options=answer.includes(' – ')
   ? choiceOptions(answer,index===0?['wollen – will','möchten – möchte','willst – will','möchtet – möchte']:['möchten – möchte','willst – will','wollen – wollen','möchtet – möchte'],index)
   : choiceOptions(answer,['will','willst','wollen','wollt','möchte','möchten','möchtet'],index);
  return{...item,kind:'choice',answer,answers:[],options:[...new Set(options)].slice(0,4)}
 });
 const hoeren=simple('hoeren-wuensche','Hören und Verstehen','🎧','Höre und beantworte die Frage.','Höre den Text. Sprich oder schreibe die Antwort.');
 (hoeren.items||[]).forEach(item=>{item.kind='audio-produce';item.transcript=item.audio});
 const sound=simple('hoeren-erkennen','Hören und Erkennen','🔉','Höre und erkenne die Aktivität.','Höre das Geräusch. Wähle zuerst die Aktivität und nenne sie danach selbst.');
 delete sound.external;
 (sound.items||[]).forEach(item=>{if(item.audioFile)item.kind=item.phase==='produce'?'audio-file-produce':'audio-file-choice'});
 const own=simple('partnerinterview','Sprechen und Schreiben','🎤✍️','Sprich oder schreibe über Fähigkeiten, Wünsche und Pläne.','Beantworte die Frage mit einem vollständigen Satz.');
 own.items=[
  ...clone(source.partnerinterview?.items||[]),
  ...clone(source['eigene-faehigkeiten']?.items||[]),
  ...clone(source['eigene-plaene']?.items||[])
 ].map(item=>({...item,kind:'free'}));

 const examSource=clone(source.pruefung||{items:[]});
 const extraExam=[
  {kind:'choice',prompt:'___ Klavier',answer:'das',options:['der','die','das'],hint:'Das Wort heißt „das Klavier“.'},
  {kind:'input',prompt:'Bilde den Plural mit Artikel: das Lied',answer:'die Lieder',answers:['Lieder'],hint:'Beginne mit „die“.'},
  {kind:'choice',prompt:'Was bedeutet „ganz sicher“?',answer:'auf jeden Fall',options:['auf jeden Fall','auf keinen Fall','endlich','pünktlich'],hint:'Die Person ist sicher.'},
  {kind:'choice',prompt:'Welche Antwort passt? Kannst du gut singen?',answer:'Ja, ich kann gut singen.',options:['Ja, ich kann gut singen.','Ich will einen Tee.','Nein, ich bin Arzt.'],hint:'Die Frage fragt nach einer Fähigkeit.'}
 ];
 const exam={...examSource,id:'pruefung',title:'Themenprüfung',icon:'⭐',description:'Zeige, was du gelernt hast.',instruction:'Bearbeite 15 Aufgaben. Für das Prüfungsergebnis zählt jeweils nur deine erste Antwort.',exam:true,items:[...(examSource.items||[]),...extraExam].slice(0,15)};
 (exam.items||[]).forEach(item=>{if(item.audio){item.kind='audio-produce';item.transcript=item.audio}});

 theme.title='können, wollen und möchten';
 theme.subtitle='Fähigkeiten, Wünsche und Pläne';
 theme.goal='Ziel: Wortschatz, können, wollen, möchten, Satzbau, Sprechen und Hörverstehen sicher benutzen.';
 theme.tasks=[
  cards,
  {id:'bedeutung-wort',title:'Bedeutung → Wort',icon:'💡',description:'Finde das Wort.',instruction:'Lies die Bedeutung und finde das Wort.',items:meaningItems},
  {id:'bild-erklaerung-wort',title:'Bild → Wort',icon:'🖼️',description:'Finde das Wort.',instruction:'Sieh das Bild an und finde das Wort.',items:imageItems},
  {id:'hoeren-bild',title:'Hören → Bild',icon:'🎧',description:'Höre das Wort und finde das Bild.',instruction:'Höre das Wort und wähle das passende Bild.',items:listenItems},
  {id:'artikel-plural',title:'Artikel',icon:'der',description:'Wähle den passenden Artikel.',instruction:'Wähle den passenden Artikel.',items:articleItems},
  {id:'plural',title:'Plural',icon:'🎤',description:'Bilde die Pluralform mit Artikel.',instruction:'Sprich oder schreibe die Pluralform mit Artikel.',items:pluralItems},
  koennen,wollen,verbform,aussagen,jaNein,wFragen,faehigkeiten,bildimpulse,fragen,moechten,dialoge,hoeren,sound,own,exam
 ];
 theme.tasks.forEach((task,index)=>{task.number=String(index+1)});
 window.L7T1_STANDARD_VERSION='l7t1-full1';
 return theme
});
})();
