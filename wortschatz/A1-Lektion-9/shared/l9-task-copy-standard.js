(function(){
'use strict';
function norm(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()}
function copy(raw,themeNo){
 const s=norm(typeof raw==='string'?raw:(raw?.title||raw?.id||''));
 const exact=(title,description)=>({title,description});
 if(/themenprufung|^prufung$|\bexam\b/.test(s))return exact('Prüfung','Teste dein Wissen.');
 if(/karteikarten/.test(s)){
  if(/behorden/.test(s))return exact('Karteikarten: Behörden','Lerne die Behörden.');
  if(/unterlagen/.test(s))return exact('Karteikarten: Unterlagen','Lerne die Unterlagen.');
  return exact('Karteikarten','Lerne die neuen Wörter.');
 }
 if(/bild oder erklarung.*wort|bild.*beschreibung.*behorde|beschreibung.*behorde/.test(s))return exact(themeNo===5?'Behörde finden':'Wort finden',themeNo===5?'Sieh das Bild oder lies die Beschreibung. Wähle die Behörde.':'Sieh das Bild oder lies die Erklärung. Wähle das Wort.');
 if(/bild.*erklarung.*unterlage|erklarung.*unterlage/.test(s))return exact('Unterlage finden','Sieh das Bild oder lies die Erklärung. Wähle die Unterlage.');
 if(/nomen.*artikel.*plural/.test(s))return exact('Artikel & Plural','Schreibe Artikel und Plural.');
 if(/verben.*infinitiv.*perfekt/.test(s))return exact('Verben','Ordne die Verbformen richtig zu.');
 if(/mussen.*konjug|muessen.*konjug/.test(s))return exact('müssen konjugieren','Schreibe die richtige Form von müssen.');
 if(/durfen.*konjug/.test(s))return exact('dürfen konjugieren','Schreibe die richtige Form von dürfen.');
 if(/man.*muss/.test(s))return exact('man + muss','Ergänze die Sätze mit man und muss.');
 if(/man.*darf.*nicht/.test(s))return exact('man darf / darf nicht','Ergänze die passende Form.');
 if(/aussagen.*fragen.*durfen/.test(s))return exact('Sätze & Fragen mit dürfen','Bilde richtige Sätze und Fragen mit dürfen.');
 if(/aussagen.*mussen|aussagen.*muessen/.test(s))return exact('Sätze mit müssen','Bilde richtige Sätze mit müssen.');
 if(/fragen.*mussen|fragen.*muessen/.test(s))return exact('Fragen mit müssen','Bilde richtige Fragen mit müssen.');
 if(/reihenfolge|schritte ordnen|weg durch mehrere schritte|ablauf.*zuerst.*danach.*dann/.test(s))return exact('Reihenfolge','Ordne die Schritte richtig.');
 if(/fahrkartenautomat/.test(s))return exact('Fahrkartenautomat','Verstehe die Anweisung und wähle den richtigen Schritt.');
 if(/behordengesprach/.test(s))return exact('Behördengespräch','Ergänze das Gespräch.');
 if(/anleitung horen/.test(s))return exact('Hören & ordnen','Hör zu und ordne die Schritte.');
 if(/eigene.*anleitung/.test(s))return exact('Anleitung geben','Sprich oder schreibe eine kurze Anleitung.');
 if(/imperativ oder aussagesatz/.test(s))return exact('Imperativ erkennen','Entscheide: Imperativ oder Aussagesatz.');
 if(/du.*ihr.*sie.*unterscheiden/.test(s))return exact('du, ihr oder Sie?','Wähle die passende Person.');
 if(/du imperativ bilden/.test(s))return exact('Imperativ mit du','Bilde den Imperativ für du.');
 if(/ihr imperativ bilden/.test(s))return exact('Imperativ mit ihr','Bilde den Imperativ für ihr.');
 if(/sie imperativ bilden/.test(s))return exact('Imperativ mit Sie','Bilde den Imperativ für Sie.');
 if(/dieselbe anweisung.*du.*ihr.*sie/.test(s))return exact('du · ihr · Sie','Bilde dieselbe Anweisung in allen drei Formen.');
 if(/trennbare verben.*imperativ/.test(s))return exact('Trennbare Verben','Bilde den Imperativ mit trennbaren Verben.');
 if(/imperativform.*kontext/.test(s))return exact('Imperativ im Kontext','Wähle die passende Imperativform.');
 if(/gehorte anweisung|gehörte anweisung/.test(typeof raw==='string'?raw:(raw?.title||''))||/gehorte anweisung/.test(s))return exact('Hören','Hör zu und wähle die richtige Anweisung.');
 if(/passende anweisung/.test(s))return exact('Anweisung wählen','Wähle die passende Anweisung.');
 if(/doch.*bitte.*mal/.test(s))return exact('doch · bitte · mal','Ergänze doch, bitte oder mal.');
 if(/sprachschule.*dialog|dialoge erganzen|luckendialog|lueckendialog/.test(s))return exact('Dialoge','Ergänze die Dialoge.');
 if(/eigene anweisungen/.test(s))return exact('Anweisungen geben','Sprich oder schreibe eigene Anweisungen.');
 if(/mischaufgabe.*imperativ/.test(s))return exact('Imperativ-Mix','Übe verschiedene Imperativformen.');
 if(/erlaubt oder verboten/.test(s))return exact('Erlaubt oder verboten?','Wähle die richtige Bedeutung.');
 if(/schilder.*regeln/.test(s))return exact('Schilder & Regeln','Lies die Regel und wähle die passende Antwort.');
 if(/darf.*darf nicht.*muss.*muss nicht/.test(s))return exact('darf oder muss?','Wähle darf, darf nicht, muss oder muss nicht.');
 if(/bedeutung.*erlaubt.*verboten.*notwendig/.test(s))return exact('Bedeutung','Ordne die richtige Bedeutung zu.');
 if(/durfen oder mussen/.test(s))return exact('dürfen oder müssen?','Wähle das passende Verb.');
 if(/regel dialog/.test(s))return exact('Dialoge','Ergänze die Dialoge über Regeln.');
 if(/gepack.*abgeben.*mitnehmen/.test(s))return exact('Gepäck','Wähle abgeben oder mitnehmen.');
 if(/eigene regeln/.test(s))return exact('Regeln formulieren','Schreibe eigene kurze Regeln.');
 if(/mischaufgabe.*durfen.*mussen/.test(s))return exact('dürfen & müssen','Übe dürfen und müssen zusammen.');
 if(/personendaten erkennen/.test(s))return exact('Personendaten','Erkenne die richtige Angabe.');
 if(/frage.*personliche angabe|frage.*angabe verbinden/.test(s))return exact('Frage & Angabe','Ordne Frage und Angabe zu.');
 if(/anmeldung.*was mochte|anmeldung.*anliegen/.test(s))return exact('Anmeldung','Wähle das richtige Anliegen.');
 if(/typische fragen.*schalter/.test(s))return exact('Fragen am Schalter','Lies die Frage und wähle die passende Antwort.');
 if(/passende antwort/.test(s))return exact('Antwort wählen','Wähle die passende Antwort.');
 if(/nichtverstehen|nicht verstehen/.test(s))return exact('Nicht verstehen','Wähle die passende Formulierung.');
 if(/hilfe.*wiederholung.*erklarung/.test(s))return exact('Um Hilfe bitten','Wähle oder bilde die passende Bitte.');
 if(/dialogbausteine ordnen/.test(s))return exact('Dialog ordnen','Ordne die Sätze zum richtigen Dialog.');
 if(/horen.*gesprach.*schalter/.test(s))return exact('Hören','Hör zu und beantworte die Frage.');
 if(/angaben.*unterlagen/.test(s))return exact('Angaben & Unterlagen','Wähle die passenden Angaben oder Unterlagen.');
 if(/gesprach mit auswahlhilfen/.test(s))return exact('Gespräch führen','Führe das Gespräch mit den Auswahlhilfen.');
 if(/sprechen.*schreib fallback|freie sprechaufgabe/.test(s))return exact('Sprechen','Sprich. Wenn nötig, schreibe deine Antwort.');
 if(/rollenspiel/.test(s))return exact('Rollenspiel','Führe ein kurzes Gespräch.');
 if(/behorde.*anliegen verbinden/.test(s))return exact('Anliegen zuordnen','Ordne das Anliegen der richtigen Behörde zu.');
 if(/behorde.*typische unterlagen/.test(s))return exact('Unterlagen zuordnen','Ordne die Unterlagen der richtigen Behörde zu.');
 if(/welche behorde brauche ich/.test(s))return exact('Welche Behörde?','Wähle die richtige Behörde.');
 if(/welche unterlagen brauche ich/.test(s))return exact('Welche Unterlagen?','Wähle die richtigen Unterlagen.');
 if(/muss.*muss nicht.*darf.*darf nicht.*behordenkontext/.test(s))return exact('dürfen & müssen','Wähle die passende Form.');
 if(/dokument vorhanden.*fehlt|dokument.*mitbringen/.test(s))return exact('Dokumente','Entscheide: vorhanden, fehlt oder mitbringen.');
 if(/frage.*antwort verbinden/.test(s))return exact('Frage & Antwort','Ordne Frage und Antwort zu.');
 if(/kurze dialoge.*schalter|dialoge.*schalter/.test(s))return exact('Dialoge','Ergänze die Dialoge am Schalter.');
 if(/horen.*welche behorde.*unterlagen|horen.*behorde.*unterlagen/.test(s))return exact('Hören','Hör zu und wähle Behörde oder Unterlage.');
 if(/behorde.*anliegen.*unterlagen/.test(s))return exact('Große Zuordnung','Ordne Behörde, Anliegen und Unterlagen zu.');
 const title=String(typeof raw==='string'?raw:(raw?.title||`Aufgabe`)).replace(/Themenprüfung/gi,'Prüfung').replace(/^Karteikarten:\s*/i,'Karteikarten: ').trim();
 return exact(title,String(raw?.description||raw?.instruction||'Bearbeite die Aufgabe.').replace(/Diese Aufgabe wird im L8\/L9-Standard umgesetzt\.?/gi,'Bearbeite die Aufgabe.'));
}
function standardize(task,index,themeNo){const base=typeof task==='string'?{}:{...task};const c=copy(task,themeNo);base.title=c.title;base.description=c.description;base.instruction=c.description;if(/prüfung/i.test(base.title)){base.title='Prüfung';base.description='Teste dein Wissen.';base.instruction='Teste dein Wissen.';base.exam=base.exam!==false}return base}
function applyList(list,themeNo){return (list||[]).map((t,i)=>standardize(t,i,themeNo))}
function apply(){if(window.L9T1?.tasks)window.L9T1.tasks=applyList(window.L9T1.tasks,1);for(let n=1;n<=5;n++){const theme=window.L9_THEMES?.[n];if(theme?.tasks)theme.tasks=applyList(theme.tasks,n)}}
window.L9TaskCopyStandard={copy,standardize,applyList,apply};
apply();
})();