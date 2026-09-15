(function(){
'use strict';
if(window.__SP_L10T3_REPAIR_V2)return;window.__SP_L10T3_REPAIR_V2=true;
const D=window.L10T3;if(!D)return;
(D.letterLabelParts||[]).forEach(x=>{if(x.id==='lp7'){x.part='Grußformel';x.article='die';}});
(D.letterQuestions||[]).forEach(x=>{if(x.id==='bq7')x.a='die Grußformel';});
const label=(D.tasks||[]).find(t=>t.id==='brief-beschriften');if(label){label.cardText='Beschrifte die Teile im Brief und schreibe den Artikel selbst.';label.text='Wähle neben jedem Briefteil die Bezeichnung. Schreibe den Artikel selbst.';}
const q=(D.tasks||[]).find(t=>t.id==='brief-fragen-artikel');if(q){q.cardText='Beantworte 8 Fragen wie im Beispiel mit Artikel.';q.text='Beantworte die Frage mit Artikel. Sprich oder schreibe.';}
})();
