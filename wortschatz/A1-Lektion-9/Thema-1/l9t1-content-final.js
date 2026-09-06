(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const file=name=>CDN+String(name||'').split('/').map(encodeURIComponent).join('/');
const audio=name=>AUDIO+encodeURIComponent(name);

/* Verbindlicher Endstand Aufgabe 8 */
const task=(D.tasks||[]).find(t=>t.id==='anweisungen-hoeren');
if(task){
 task.title='Anweisungen hören';
 task.description='Ordne die Schritte zu.';
 task.instruction='Ordne die Schritte zu.';
}

D.sequences=[
 {
  id:'fahrkarte-kaufen',title:'Fahrkarte kaufen',audio:audio('l9t1_anleitung_fahrkarte.mp3'),
  spoken:'Hallo! Möchten Sie eine Fahrkarte kaufen? Am Automaten geht das schnell. Auf dem Bildschirm sehen Sie zuerst verschiedene Orte. Wählen Sie das Ziel, zu dem Sie fahren möchten. Danach fragt der Automat, ob die Fahrkarte für einen Erwachsenen oder für ein Kind ist. Wählen Sie die passende Person aus. Jetzt sehen Sie den Preis. Bezahlen Sie das Ticket. Sie können je nach Automat zum Beispiel bar oder mit Karte bezahlen. Danach kommt das Ticket unten aus dem Automaten. Vergessen Sie nicht, es mitzunehmen. Dann können Sie losfahren.',
  steps:[
   {id:'fahrkarte-ziel',image:file('fahrkarte_schritt1_ziel_waehlen.png'),text:'Ziel wählen'},
   {id:'fahrkarte-person',image:file('fahrkarte_schritt2_erwachsener_oder_kind_auswaehlen.png'),text:'Erwachsener oder Kind auswählen'},
   {id:'fahrkarte-bezahlen',image:file('fahrkarte_schritt3_ticket_bezahlen.png'),text:'Ticket bezahlen'},
   {id:'fahrkarte-nehmen',image:file('fahrkarte_schritt4_ticket_nehmen.png'),text:'Ticket nehmen'}
  ]
 },
 {
  id:'antrag-stellen',title:'Antrag stellen',audio:audio('l9t1_anleitung_antrag.mp3'),
  spoken:'Guten Tag. Sie möchten einen Antrag stellen? Dann kommen Sie zuerst zum Amt. Dort bekommen Sie die Formulare, die Sie brauchen. Füllen Sie die Formulare sorgfältig aus und kontrollieren Sie Ihre Angaben. Für den Antrag braucht die Behörde außerdem Ihre Unterlagen. Geben Sie die Unterlagen am Schalter ab. Wenn alles vollständig ist, unterschreiben Sie den Antrag. Danach kann die Mitarbeiterin den Antrag bearbeiten.',
  steps:[
   {id:'antrag-amt',image:file('antrag_schritt1_zum_amt_gehen.png'),text:'zum Amt gehen'},
   {id:'antrag-formulare',image:file('antrag_schritt2_formular_ausfuellen.png'),text:'Formulare ausfüllen'},
   {id:'antrag-unterlagen-abgeben',image:file('antrag_schritt3_unterlagen_abgeben.png'),text:'Unterlagen abgeben'},
   {id:'antrag-unterschreiben',image:file('antrag_schritt4_antrag_unterschreiben.png'),text:'Antrag unterschreiben'}
  ]
 },
 {
  id:'auto-mieten',title:'Auto mieten',audio:audio('l9t1_anleitung_auto_mieten.mp3'),
  spoken:'Guten Tag und willkommen bei der Autovermietung. Wenn Sie ein Auto mieten möchten, kommen Sie zuerst zu uns in die Autovermietung. Am Schalter braucht die Mitarbeiterin Ihren Führerschein. Zeigen Sie ihn bitte kurz. Danach bekommen Sie den Mietvertrag. Lesen Sie den Vertrag in Ruhe und unterschreiben Sie ihn, wenn alles stimmt. Anschließend bekommen Sie das Auto. Gehen Sie zum Fahrzeug, setzen Sie sich hinein und dann kann die Fahrt beginnen.',
  steps:[
   {id:'auto-vermietung',image:file('auto_mieten_01_zur_autovermietung_gehen.webp'),text:'zur Autovermietung gehen'},
   {id:'auto-fuehrerschein',image:file('auto_mieten_02_fuehrerschein_zeigen.webp'),text:'Führerschein zeigen'},
   {id:'auto-vertrag',image:file('auto_mieten_03_vertrag_lesen_und_unterschreiben.webp'),text:'Vertrag lesen und unterschreiben'},
   {id:'auto-abholen',image:file('auto_mieten_04_auto_abholen.webp'),text:'Auto abholen'}
  ]
 },
 {
  id:'dokument-abholen',title:'Dokument beim Amt abholen',audio:audio('l9t1_anleitung_dokument_abholen.mp3'),
  spoken:'Guten Morgen. Sie möchten ein fertiges Dokument abholen? Gehen Sie zuerst zum Amt und suchen Sie den richtigen Schalter. Dort können Sie die Mitarbeiterin fragen, ob sie Ihren Ausweis braucht. Danach sucht die Mitarbeiterin Ihr Dokument. Das kann einen Moment dauern, deshalb warten Sie bitte. Wenn die Mitarbeiterin zurückkommt, bekommen Sie das Dokument. Kontrollieren Sie kurz, ob die Angaben richtig sind, und nehmen Sie das Dokument dann mit.',
  steps:[
   {id:'dokument-amt',image:file('dokument_abholen_01_zum_amt_gehen.webp'),text:'zum Amt gehen'},
   {id:'dokument-schalter',image:file('dokument_abholen_02_am_schalter_fragen.webp'),text:'am Schalter nach dem Ausweis fragen'},
   {id:'dokument-warten',image:file('dokument_abholen_03_warten.webp'),text:'warten'},
   {id:'dokument-kontrollieren',image:file('dokument_abholen_04_ausweis_kontrollieren_und_dokument_abholen.webp'),text:'Dokument kontrollieren und abholen'}
  ]
 }
];
D.sequences.forEach(g=>{g.mediaSource='bunny';(g.steps||[]).forEach(s=>s.mediaSource='bunny')});

/* Aufgabe 9: dieselben Abläufe und dieselben Bilder. */
const writingBy=id=>(D.writing||[]).find(x=>x.id===id);
const wF=writingBy('w-fahrkarte');
if(wF){Object.assign(wF,{images:D.sequences[0].steps.map(x=>x.image),answer:'Zuerst muss man das Ziel wählen. Danach muss man Erwachsener oder Kind auswählen. Dann muss man das Ticket bezahlen. Zum Schluss muss man das Ticket nehmen.',hint:'Ziel wählen – Erwachsener oder Kind auswählen – Ticket bezahlen – Ticket nehmen.'});}
const wA=writingBy('w-antrag');
if(wA){Object.assign(wA,{images:D.sequences[1].steps.map(x=>x.image),answer:'Zuerst muss man zum Amt gehen. Danach muss man die Formulare ausfüllen. Dann muss man die Unterlagen abgeben. Zum Schluss muss man den Antrag unterschreiben.',hint:'zum Amt gehen – Formulare ausfüllen – Unterlagen abgeben – Antrag unterschreiben.'});}
const wAuto=writingBy('w-auto');
if(wAuto){Object.assign(wAuto,{images:D.sequences[2].steps.map(x=>x.image),answer:'Zuerst muss man zur Autovermietung gehen. Danach muss man den Führerschein zeigen. Dann muss man den Vertrag lesen und unterschreiben. Zum Schluss muss man das Auto abholen.',hint:'zur Autovermietung gehen – Führerschein zeigen – Vertrag lesen und unterschreiben – Auto abholen.'});}

/* Wortschatzwort abgeben: Karteikarten, Übersicht und mehrere Übungen. */
const has=(arr,id)=>Array.isArray(arr)&&arr.some(x=>String(x?.id)===String(id));
const translations={en:'to hand in / submit',ru:'сдавать / подавать',tr:'teslim etmek',uk:'здавати / подавати',ar:'يُسلّم / يُقدّم',ja:'提出する',ro:'a preda / a depune',pl:'oddawać / składać',ku:'radest kirin'};
if(!has(D.cards,'abgeben')){
 const code=window.L9T1Translations?.code||'en';
 D.cards.push({id:'abgeben',word:'abgeben',full:'abgeben',article:'',plural:'',section:'Handlungen',type:'verb',perfect:'hat abgegeben',example:'Man muss die Unterlagen abgeben.',meaning:'Man gibt etwas einer Person oder Stelle und lässt es dort.',translation:translations[code]||translations.en,image:file('abgeben.webp'),audio:audio('abgeben.mp3'),mediaSource:'bunny'});
}
const card=id=>(D.cards||[]).find(x=>x.id===id)||{};
if(Array.isArray(D.listen)&&!has(D.listen,'abgeben'))D.listen.push({id:'abgeben',prompt:'Hör zu. Welches Bild passt?',audio:audio('abgeben.mp3'),spoken:'abgeben',answer:'abgeben',options:['abgeben','mitbringen','abholen','unterschreiben'],optionImages:{abgeben:file('abgeben.webp'),mitbringen:card('mitbringen').image,abholen:card('abholen').image,unterschreiben:card('unterschreiben').image},hint:'Man gibt etwas einer Person oder Stelle und lässt es dort.',mediaSource:'bunny'});
if(Array.isArray(D.defs)&&!has(D.defs,'abgeben'))D.defs.push({id:'abgeben',prompt:'Man gibt etwas einer Person oder Stelle und lässt es dort.',answer:'abgeben',options:['abgeben','mitbringen','abholen','ausfüllen'],hint:'Zum Beispiel: Unterlagen beim Amt abgeben.',image:file('abgeben.webp'),audio:audio('abgeben.mp3'),mediaSource:'bunny'});
if(Array.isArray(D.speak)&&!has(D.speak,'abgeben'))D.speak.push({id:'abgeben',prompt:'Was ist das? Sprich oder schreibe das Wort.',image:file('abgeben.webp'),audio:audio('abgeben.mp3'),answer:'abgeben',hint:'Man gibt Unterlagen am Schalter.',mediaSource:'bunny'});
if(Array.isArray(D.gaps)&&!has(D.gaps,'g-abgeben'))D.gaps.push({id:'g-abgeben',left:'Beim Amt',middle:'man die Unterlagen',modal:'muss',verb:'abgeben',verbId:'abgeben',image:file('abgeben.webp'),audio:audio('abgeben.mp3'),hint:'Die Unterlagen bleiben beim Amt.',mediaSource:'bunny'});

/* Aufgabe 10 verwendet abgeben ebenfalls aktiv. */
const beimAmt=(D.cloze||[]).find(x=>x.title==='Beim Amt');
if(beimAmt){
 beimAmt.parts=['Ich möchte einen ',' stellen. Zuerst muss ich ihn ',' . Danach muss ich meine ',' am Schalter ',' .'];
 beimAmt.answers=['Antrag','ausfüllen','Unterlagen','abgeben'];
}

window.L9T1_CONTENT_FINAL={version:'20260906-steps2'};
})();
