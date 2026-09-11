(function(){
'use strict';
const D=window.L9T2;if(!D)return;

const B1=Object.freeze({
 leise:'Wenn jemand so spricht, hört man die Stimme nur schwach, und andere Personen werden kaum gestört.',
 erklaeren:'Man beschreibt einen Inhalt so genau, dass eine andere Person ihn verstehen kann.',
 laut:'Eine Stimme oder ein Geräusch ist so stark, dass man es deutlich oder sogar aus größerer Entfernung hört.',
 ausmachen:'Man beendet die Funktion eines Geräts, sodass es danach nicht mehr eingeschaltet ist.',
 zuhoeren:'Man konzentriert sich auf das, was eine andere Person sagt, und versucht den Inhalt zu verstehen.',
 aufstehen:'Man verlässt eine sitzende oder liegende Position und stellt sich auf die Füße.',
 warten:'Man bleibt an einem Ort, bis eine Person kommt oder ein Ereignis beginnt.',
 gebuehr:'Das ist ein Geldbetrag, den man für eine bestimmte Dienstleistung oder einen offiziellen Vorgang bezahlen muss.',
 kasse:'Dort bezahlt man Waren, Eintritt oder andere Kosten.',
 lachen:'Man reagiert mit Stimme und Gesicht, weil etwas lustig ist oder Freude macht.',
 aufhoeren:'Man beendet eine Handlung und macht danach nicht weiter.',
 anmeldung:'Dabei gibt man seine Daten an, um offiziell an einem Kurs, Termin oder Angebot teilzunehmen.',
 stock:'Das ist eine Ebene in einem mehrstöckigen Gebäude.',
 unterricht:'Das ist die Zeit, in der Lernende gemeinsam mit einer Lehrkraft lernen und üben.',
 sprachschule:'Das ist eine Bildungseinrichtung, in der Menschen eine Fremdsprache lernen.',
 autovermietung:'Das ist eine Firma, bei der man gegen Bezahlung für eine bestimmte Zeit ein Fahrzeug bekommt.',
 hingehen:'Man bewegt sich zu einem bestimmten Ort, weil man dort etwas erledigen oder jemanden treffen möchte.',
 laden:'Man bringt Gegenstände oder Gepäck in ein Fahrzeug, damit sie transportiert werden können.',
 wartebereich:'Das ist ein Platz mit Sitzmöglichkeiten, an dem Menschen bis zu ihrem Termin bleiben.',
 doch:'Dieses Wort kann eine Aufforderung stärker machen oder jemanden freundlich ermutigen, etwas trotzdem zu tun.',
 bitte:'Dieses Wort macht eine Aufforderung höflicher und zeigt Respekt gegenüber der anderen Person.',
 mal:'Dieses Wort macht eine Aufforderung lockerer und natürlicher, besonders in einem informellen Gespräch.'
});

function applyText(list){
 for(const item of list||[]){if(item&&B1[item.id])item.b1Text=B1[item.id]}
}
applyText(D.cards);
applyText(D.flashcards);
applyText(D.visualWords);
applyText(D.mixedWords);

for(const task of D.tasks||[]){
 if(!task)continue;
 if(task.id==='bild-wort'){
  task.title='Bild – B1-Bedeutung';
  task.description='Sieh das Bild und wähle die passende Erklärung auf B1-Deutsch.';
  task.instruction=task.description;
  task.icon='🖼️';
 }
 if(task.id==='bild-hoeren'){
  task.title='Bild – B1-Hören';
  task.description='Sieh das Bild, höre vier Erklärungen auf B1-Deutsch und wähle die passende aus.';
  task.instruction=task.description;
  task.icon='🎧';
 }
}

D.b1ImageAudioText=B1;
D.b1Text=function(item){return B1[item?.id]||String(item?.meaning||item?.full||item?.word||'').trim()};
window.L9T2B1ImageAudio={texts:B1,apply:()=>{applyText(D.visualWords);applyText(D.flashcards)}};
})();
