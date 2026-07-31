(function(){
'use strict';
if(window.__SP_L7T1_CONTENT_RESTORE_1)return;
window.__SP_L7T1_CONTENT_RESTORE_1=true;

const VERSION='l7t1-content-restore1';
const META=Object.freeze({
 'karteikarten':['Karteikarten','Lerne die Wörter.'],
 'bild-erklaerung-wort':['Bedeutung → Wort','Finde das passende Wort.'],
 'artikel-plural':['Artikel und Plural','Wähle den Artikel und die Pluralform.'],
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
 'eigene-faehigkeiten':['Eigene Fähigkeiten','Schreibe über deine Fähigkeiten.'],
 'eigene-plaene':['Eigene Wünsche und Pläne','Schreibe über deine Wünsche und Pläne.'],
 'hoeren-erkennen':['Hören und Erkennen','Höre und erkenne die Aktivität.'],
 'pruefung':['Themenprüfung','Zeige, was du gelernt hast.']
});

const EXAMPLES=Object.freeze({
 'prima':'Das Essen schmeckt prima.',
 'das Team':'Wir arbeiten im Team.',
 'wecken':'Meine Mutter weckt mich um sieben Uhr.',
 'das Frühstück':'Das Frühstück ist fertig.',
 'fertig':'Ich bin mit der Aufgabe fertig.',
 'fertig sein':'Ich bin mit der Aufgabe fertig.',
 'los sein':'Was ist los?',
 'schreiben':'Ich schreibe einen Brief.',
 'Mathematik':'Mathematik ist heute einfach.',
 'die Mathematik':'Mathematik ist heute einfach.',
 'der Test':'Wir schreiben heute einen Test.',
 'pünktlich':'Ali kommt pünktlich zum Unterricht.',
 'auf keinen Fall':'Ich komme auf keinen Fall zu spät.',
 'auf jeden Fall':'Ich komme auf jeden Fall mit.',
 'schmecken':'Der Kuchen schmeckt gut.',
 'nach Hause':'Ich gehe nach Hause.',
 'die Schule':'Die Kinder gehen in die Schule.',
 'können':'Ich kann gut schwimmen.',
 'krank':'Maria ist heute krank.',
 'der Arzt':'Der Arzt untersucht den Patienten.',
 'die Ärztin':'Die Ärztin arbeitet im Krankenhaus.',
 'backen':'Wir backen einen Kuchen.',
 'singen':'Jana kann gut singen.',
 'reiten':'Anna möchte reiten.',
 'das Klavier':'Das Klavier steht im Wohnzimmer.',
 'Klavier spielen':'Sie kann Klavier spielen.',
 'malen':'Mina malt ein Bild.',
 'der Ski':'Die Skier stehen im Keller.',
 'Ski fahren':'Wir möchten im Winter Ski fahren.',
 'das Tennis':'Wir spielen am Samstag Tennis.',
 'Tennis spielen':'Wir spielen am Samstag Tennis.',
 'wollen':'Wir wollen heute grillen.',
 'möchten':'Ich möchte einen Tee.',
 'endlich':'Der Bus kommt endlich.',
 'das Lied':'Wir hören ein Lied.',
 'üben':'Ich übe jeden Tag Deutsch.',
 'der Text':'Ich lese den Text.',
 'die Übung':'Die Übung ist leicht.',
 'der Brief':'Ich schreibe einen Brief.',
 'das Diktat':'Wir schreiben heute ein Diktat.',
 'das Buch':'Ich lese ein Buch.',
 'der Film':'Der Film beginnt um acht Uhr.',
 'die Grammatik':'Wir üben die Grammatik.',
 'das Spiel':'Das Spiel macht Spaß.',
 'das Fahrrad':'Mein Fahrrad ist neu.',
 'die Gitarre':'Er spielt Gitarre.',
 'Gitarre spielen':'Er kann Gitarre spielen.',
 'der Kuchen':'Der Kuchen schmeckt prima.',
 'die Hausaufgabe':'Die Hausaufgabe ist schwer.',
 'der Freund':'Mein Freund kommt heute.',
 'hören':'Ich höre ein Lied.',
 'machen':'Wir machen eine Übung.',
 'lesen':'Ich lese ein Buch.',
 'sehen':'Wir sehen einen Film.',
 'spielen':'Wir spielen Tennis.',
 'fahren':'Ich fahre mit dem Fahrrad.',
 'treffen':'Ich treffe meine Freunde.',
 'gehen':'Wir gehen nach Hause.',
 'sprechen':'Wir sprechen Deutsch.',
 'tanzen':'Wir tanzen zur Musik.',
 'wandern':'Wir wandern am Wochenende.',
 'grillen':'Wir grillen im Garten.',
 'schwimmen':'Ich schwimme gern.',
 'stricken':'Meine Oma strickt einen Schal.',
 'jonglieren':'Er kann gut jonglieren.',
 'kochen':'Wir kochen eine Suppe.',
 'fotografieren':'Sie fotografiert die Stadt.',
 'einkaufen':'Ich kaufe im Supermarkt ein.',
 'aufstehen':'Ich stehe um sieben Uhr auf.'
});

const VERB_TASKS=new Set(['koennen-formen','wollen-formen','verbform-waehlen','wollen-moechten','bildimpulse','fragen-antworten','partnerinterview','dialoge-ergaenzen','eigene-faehigkeiten','eigene-plaene']);

function clone(value){
 try{return structuredClone(value)}catch(error){return JSON.parse(JSON.stringify(value))}
}
function textOf(item){
 return String(item?.word||item?.full||item?.answer||item?.infinitive||item?.verb||'').trim();
}
function inferInfinitive(item,taskId){
 const text=[item?.infinitive,item?.verb,item?.word,item?.answer,item?.prompt,item?.context,item?.example,...(item?.options||[])].filter(Boolean).join(' ').toLowerCase();
 if(taskId==='koennen-formen'||/\b(kann|kannst|können|koennen|könnt|koennt|konnte|konnten)\b/.test(text))return'können';
 if(taskId==='wollen-formen'||/\b(will|willst|wollen|wollt|wollte|wollten)\b/.test(text))return'wollen';
 if(/\b(möchte|moechte|möchtest|moechtest|möchten|moechten|möchtet|moechtet)\b/.test(text))return'möchten';
 const direct=textOf(item);
 if(/^(sich\s+)?[A-Za-zÄÖÜäöüß]+(?:\s+[A-Za-zÄÖÜäöüß]+)?$/.test(direct))return direct;
 return'';
}
function enrich(theme){
 if(!theme||!Array.isArray(theme.tasks))throw new Error('L7T1-Inhaltsdaten fehlen.');
 for(const task of theme.tasks){
  const meta=META[task.id];
  if(meta){task.title=meta[0];task.description=meta[1]}
  const items=Array.isArray(task.items)?task.items:[];
  if(task.id==='karteikarten'){
   for(const item of items){
    const word=textOf(item);
    const example=EXAMPLES[word];
    if(example)item.example=example;
    if(!item.audio&&word)item.audio=word;
   }
  }
  if(VERB_TASKS.has(task.id)){
   for(const item of items){
    const infinitive=inferInfinitive(item,task.id);
    if(infinitive){item.audio=infinitive;item.audioInfinitive=infinitive}
   }
  }
 }
 theme.contentRevision='l7t1-requested-content-20260730';
 return theme;
}
function fallback(){
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=`data-loader.js?v=${VERSION}`;
  script.onload=()=>Promise.resolve(window.L7_THEME_READY).then(resolve,reject);
  script.onerror=()=>reject(new Error('L7T1-Ersatzdaten konnten nicht geladen werden.'));
  document.head.appendChild(script);
 });
}
async function extractRestoredTheme(){
 if(!('DecompressionStream'in window))return fallback();
 const payload=(window.L7T1_REV5_PARTS||[]).join('');
 delete window.L7T1_REV5_PARTS;
 if(!payload)return fallback();
 const bytes=Uint8Array.from(atob(payload),character=>character.charCodeAt(0));
 const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
 const code=await new Response(stream).text();
 const frame=document.createElement('iframe');
 frame.hidden=true;
 frame.setAttribute('aria-hidden','true');
 frame.tabIndex=-1;
 document.documentElement.appendChild(frame);
 let theme;
 try{
  const doc=frame.contentDocument;
  doc.open();
  doc.write('<!doctype html><html><head></head><body data-theme="1" data-page="content"><div id="app"></div></body></html>');
  doc.close();
  const isolated=frame.contentWindow;
  isolated.console=console;
  isolated.eval(code);
  if(isolated.L7_THEME_READY){
   theme=await Promise.race([
    Promise.resolve(isolated.L7_THEME_READY),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('Zeitüberschreitung beim Wiederherstellen der L7T1-Inhalte.')),4000))
   ]);
  }
  theme=theme||isolated.L7_THEME;
  if(!theme)throw new Error('Der frühere L7T1-Inhaltsstand enthält keine Themendaten.');
  return clone(theme);
 }finally{
  frame.remove();
 }
}

window.L7_THEME_READY=extractRestoredTheme()
 .catch(error=>{console.warn('L7T1-Inhaltswiederherstellung:',error);return fallback()})
 .then(enrich)
 .then(theme=>{window.L7_THEME=theme;return theme});
})();
