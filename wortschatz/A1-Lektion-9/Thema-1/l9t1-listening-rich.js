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

set('fahrkarte-kaufen','Hallo! Möchten Sie eine Fahrkarte kaufen? Am Automaten geht das ganz einfach. Auf dem Bildschirm sehen Sie viele Orte. Wählen Sie den Ort, zu dem Sie fahren möchten. Danach fragt der Automat: Erwachsene oder Kind? Wählen Sie die passende Person. Jetzt sehen Sie verschiedene Tickets. Wählen Sie das Ticket, das Sie brauchen. Wenn alles richtig ist, bezahlen Sie. Sie können zum Beispiel bar bezahlen. Am Ende kommt die Fahrkarte aus dem Automaten. Nehmen Sie die Fahrkarte mit. Jetzt kann die Fahrt beginnen.');

set('antrag-stellen','Guten Tag. Sie möchten einen Antrag stellen? Den Antrag bekommen Sie hier im Amt. Nehmen Sie zuerst das Formular. Schreiben Sie Ihren Namen, Ihre Adresse und die anderen Informationen in den Antrag. Für den Termin brauchen wir auch Ihre Unterlagen. Bitte bringen Sie die wichtigen Papiere mit. Sehen Sie noch einmal nach: Ist alles da und ist alles richtig? Wenn der Antrag fertig ist, unterschreiben Sie ihn unten. Dann ist der Antrag fertig.');

set('auto-mieten','Guten Tag und willkommen bei unserer Autovermietung. Sie möchten heute ein Auto mieten? Kommen Sie bitte zuerst zu uns. Die Mitarbeiterin fragt nach Ihrem Führerschein. Zeigen Sie den Führerschein. Er muss natürlich noch gültig sein. Danach bekommen Sie die Papiere für das Auto. Lesen Sie kurz und unterschreiben Sie die Papiere. Wenn alles fertig ist, zeigt Ihnen die Mitarbeiterin das Auto. Zum Schluss holen Sie das Auto ab und können losfahren. Gute Fahrt!');

set('dokument-abholen','Guten Morgen. Ihr Dokument ist fertig und Sie möchten es abholen? Dann kommen Sie bitte zum Amt. Am Schalter fragt die Mitarbeiterin nach Ihrem Ausweis. Zeigen Sie den Ausweis. So sieht die Mitarbeiterin, wer Sie sind. Manchmal dauert es ein paar Minuten. Warten Sie bitte kurz. Wenn alles richtig ist, bekommen Sie Ihr Dokument. Nehmen Sie das Dokument mit. Sehen Sie vor dem Gehen noch einmal nach, ob Ihr Name richtig geschrieben ist. Dann sind Sie fertig.');
})();
