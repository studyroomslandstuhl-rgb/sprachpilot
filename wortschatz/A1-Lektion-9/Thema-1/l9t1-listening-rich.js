(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const task=(D.tasks||[]).find(t=>t.id==='anweisungen-hoeren');
if(task){
 task.title='Anweisungen hören';
 task.description='Hör genau zu. Im Text gibt es zusätzliche Informationen. Ordne nur die vier wichtigen Schritte in der richtigen Reihenfolge.';
 task.instruction='Hör genau zu. Nicht jeder Satz ist ein Schritt. Finde die vier wichtigen Handlungen und ordne sie.';
}
const by=id=>(D.sequences||[]).find(x=>x.id===id);
const set=(id,text)=>{const x=by(id);if(x)x.spoken=text};

set('fahrkarte-kaufen','Hallo! Möchten Sie eine Fahrkarte kaufen? Am Automaten ist das ganz einfach. Auf dem Bildschirm sehen Sie zuerst viele Orte. Tippen Sie auf die Stadt, in die Sie fahren möchten. Danach fragt der Automat, für wen die Fahrkarte ist: für einen Erwachsenen oder für ein Kind. Wählen Sie die passende Person. Jetzt sehen Sie verschiedene Tickets. Entscheiden Sie sich für das Ticket, das Sie brauchen. Wenn alles stimmt, bezahlen Sie. Sie können zum Beispiel bar bezahlen. Vergessen Sie am Ende nicht, Ihre Fahrkarte aus dem Automaten zu nehmen. Dann kann die Fahrt beginnen.');

set('antrag-stellen','Guten Tag. Sie möchten einen Antrag stellen? Den Antrag bekommen Sie hier im Amt. Nehmen Sie zuerst das Formular. Dort stehen viele Felder, zum Beispiel Name und Adresse. Füllen Sie den Antrag in Ruhe aus. Für Ihren Termin brauchen wir außerdem Ihre Unterlagen. Bitte bringen Sie alle wichtigen Papiere mit. Sehen Sie noch einmal nach, ob alles vollständig ist. Wenn der Antrag fertig ist, unterschreiben Sie ihn unten. Dann ist alles vorbereitet und die Mitarbeiterin kann Ihren Antrag weiter bearbeiten.');

set('auto-mieten','Guten Tag und willkommen bei unserer Autovermietung. Sie möchten heute ein Auto mieten? Kommen Sie bitte zuerst zu uns. Die Mitarbeiterin fragt nach Ihrem Führerschein, deshalb müssen Sie ihn zeigen. Wichtig ist auch, dass der Führerschein noch gültig ist. Danach bekommen Sie die Papiere für das Auto. Lesen Sie sie kurz und unterschreiben Sie die Papiere. Wenn alles fertig ist, zeigt Ihnen die Mitarbeiterin das Auto. Zum Schluss können Sie das Auto abholen und losfahren. Gute Fahrt!');

set('dokument-abholen','Guten Morgen. Ihr Dokument ist fertig und Sie möchten es abholen? Dann kommen Sie bitte zum Amt. Am Schalter fragt die Mitarbeiterin nach Ihrem Ausweis. Zeigen Sie den Ausweis, damit sie prüfen kann, wer Sie sind. Manchmal dauert das ein paar Minuten. Warten Sie deshalb bitte kurz. Wenn alles geprüft ist, bekommen Sie Ihr Dokument. Nehmen Sie es mit und schauen Sie vor dem Gehen noch einmal, ob Ihr Name richtig geschrieben ist. Dann sind Sie fertig.');
})();
