(function(){
'use strict';
if(window.__SP_L7T1_CONTENT_ONLY_1)return;
window.__SP_L7T1_CONTENT_ONLY_1=true;

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
 'das Buch':'Ich lese ein Buch.'
});

const VERB_TASKS=new Set([
 'koennen-formen','wollen-formen','verbform-waehlen','wollen-moechten',
 'bildimpulse','fragen-antworten','partnerinterview','dialoge-ergaenzen',
 'eigene-faehigkeiten','eigene-plaene'
]);

function wordOf(item){
 return String(item?.word||item?.full||item?.answer||item?.infinitive||item?.verb||'').trim();
}
function inferInfinitive(item,taskId){
 const text=[
  item?.infinitive,item?.verb,item?.word,item?.answer,item?.prompt,
  item?.context,item?.example,...(item?.options||[])
 ].filter(Boolean).join(' ').toLowerCase();
 if(taskId==='koennen-formen'||/\b(kann|kannst|können|koennen|könnt|koennt)\b/.test(text))return'können';
 if(taskId==='wollen-formen'||/\b(will|willst|wollen|wollt)\b/.test(text))return'wollen';
 if(/\b(möchte|moechte|möchtest|moechtest|möchten|moechten|möchtet|moechtet)\b/.test(text))return'möchten';
 const direct=wordOf(item);
 return /^(sich\s+)?[A-Za-zÄÖÜäöüß]+(?:\s+[A-Za-zÄÖÜäöüß]+)?$/.test(direct)?direct:'';
}
function enrich(theme){
 if(!theme||!Array.isArray(theme.tasks))throw new Error('Die L7T1-Daten konnten nicht geladen werden.');
 for(const task of theme.tasks){
  const meta=META[task.id];
  if(meta){
   task.title=meta[0];
   task.description=meta[1];
  }
  const items=Array.isArray(task.items)?task.items:[];
  if(task.id==='karteikarten'){
   for(const item of items){
    const word=wordOf(item);
    if(EXAMPLES[word])item.example=EXAMPLES[word];
    if(!item.audio&&word)item.audio=word;
   }
  }
  if(VERB_TASKS.has(task.id)){
   for(const item of items){
    const infinitive=inferInfinitive(item,task.id);
    if(infinitive){
     item.audio=infinitive;
     item.audioInfinitive=infinitive;
    }
   }
  }
 }
 theme.contentRevision='l7t1-own-vocabulary-only';
 return theme;
}

const source=window.L7_THEME_READY;
window.L7_THEME_READY=Promise.resolve(source)
 .then(enrich)
 .then(theme=>{
  window.L7_THEME=theme;
  return theme;
 });
})();
