(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const aud=id=>`${CDN}audio/${id}.mp3`;
const img=id=>`${CDN}${id}.webp`;
const card=id=>(D.cards||[]).find(x=>x.id===id)||{};

// Korrekte Personenbezeichnungen: der ErwachseneR / die Erwachsene.
const male=card('erwachsener');
if(male){male.word='Erwachsener';male.full='der Erwachsene';male.article='der';male.plural='die Erwachsenen';}
const female=card('erwachsene');
if(female){female.word='Erwachsene';female.full='die Erwachsene';female.article='die';female.plural='die Erwachsenen';}

// Aufgabe 7: Modalverb-Kontexte müssen die Bedeutung eindeutig machen.
const modalBy=id=>(D.modals||[]).find(x=>x.id===id);
if(modalBy('m1')){Object.assign(modalBy('m1'),{
 prompt:'Mein Auto ist kaputt. Ich kann heute mit dem Bus oder mit dem Zug fahren. Ich ___ heute mit dem Bus fahren.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Es gibt mehrere Möglichkeiten. Deshalb ist es möglich, aber nicht notwendig.'
});}
if(modalBy('m11')){Object.assign(modalBy('m11'),{
 prompt:'Er braucht ein Ticket. Er kann es am Automaten oder online kaufen. Er ___ das Ticket am Automaten kaufen.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Das Ticket ist notwendig, aber der Ort ist frei wählbar.'
});}
if(modalBy('m16')){Object.assign(modalBy('m16'),{
 prompt:'Man hat einen Online-Termin gebucht. Die Bestätigung kann man auf dem Handy oder auf Papier zeigen. Man ___ die Bestätigung auf dem Handy zeigen.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Das Handy ist nur eine Möglichkeit. Man muss nicht genau diese Form wählen.'
});}

// Aufgabe 8: Nur bereits gelernter Wortschatz aus L9T1 bzw. sehr alter A1-Grundwortschatz.
D.sequences=[
 {
  id:'fahrkarte-kaufen',title:'Fahrkarte kaufen',audio:aud('l9t1_anleitung_fahrkarte'),
  spoken:'Zuerst wählt man das Ziel. Danach wählt man Erwachsene oder Kind aus. Dann wählt man das Ticket aus. Zum Schluss bezahlt man und nimmt die Fahrkarte.',
  steps:[
   {id:'fahrkarte-ziel',image:img('l9t1_fahrkarte_ziel'),text:'Man wählt das Ziel.'},
   {id:'fahrkarte-person',image:img('l9t1_fahrkarte_person'),text:'Man wählt Erwachsene oder Kind aus.'},
   {id:'fahrkarte-ticket',image:img('l9t1_fahrkarte_ticket'),text:'Man wählt das Ticket aus.'},
   {id:'fahrkarte-bezahlen',image:img('l9t1_fahrkarte_bezahlen'),text:'Man bezahlt und nimmt die Fahrkarte.'}
  ]
 },
 {
  id:'antrag-stellen',title:'Antrag stellen',audio:aud('l9t1_anleitung_antrag'),
  spoken:'Zuerst holt man einen Antrag. Danach füllt man den Antrag aus. Dann bringt man die Unterlagen mit. Zum Schluss unterschreibt man den Antrag.',
  steps:[
   {id:'antrag-holen',image:img('l9t1_antrag_holen'),text:'Man holt einen Antrag.'},
   {id:'antrag-ausfuellen',image:img('l9t1_antrag_ausfuellen'),text:'Man füllt den Antrag aus.'},
   {id:'antrag-unterlagen',image:img('l9t1_antrag_unterlagen'),text:'Man bringt die Unterlagen mit.'},
   {id:'antrag-unterschreiben',image:img('l9t1_antrag_unterschreiben'),text:'Man unterschreibt den Antrag.'}
  ]
 },
 {
  id:'auto-mieten',title:'Auto mieten',audio:aud('l9t1_anleitung_auto_mieten'),
  spoken:'Zuerst geht man zur Autovermietung. Danach zeigt man den Führerschein. Dann unterschreibt man die Papiere. Zum Schluss holt man das Auto ab.',
  steps:[
   {id:'auto-vermietung',image:img('l9t1_auto_autovermietung'),text:'Man geht zur Autovermietung.'},
   {id:'auto-fuehrerschein',image:img('l9t1_auto_fuehrerschein'),text:'Man zeigt den Führerschein.'},
   {id:'auto-papiere',image:img('l9t1_auto_papiere'),text:'Man unterschreibt die Papiere.'},
   {id:'auto-abholen',image:img('l9t1_auto_abholen'),text:'Man holt das Auto ab.'}
  ]
 },
 {
  id:'dokument-abholen',title:'Dokument beim Amt abholen',audio:aud('l9t1_anleitung_dokument_abholen'),
  spoken:'Zuerst geht man zum Amt. Danach zeigt man den Ausweis. Dann wartet man kurz. Zum Schluss holt man das Dokument ab.',
  steps:[
   {id:'dokument-amt',image:img('l9t1_dokument_amt'),text:'Man geht zum Amt.'},
   {id:'dokument-ausweis',image:img('l9t1_dokument_ausweis'),text:'Man zeigt den Ausweis.'},
   {id:'dokument-warten',image:img('l9t1_dokument_warten'),text:'Man wartet kurz.'},
   {id:'dokument-abholen-schritt',image:img('l9t1_dokument_abholen'),text:'Man holt das Dokument ab.'}
  ]
 }
];

// Aufgabe "Anleitung schreiben": jede Anleitung ist genau ein Item.
D.writing=[
 {
  id:'w-fahrkarte',title:'Fahrkarte kaufen',
  images:['l9t1_fahrkarte_ziel','l9t1_fahrkarte_person','l9t1_fahrkarte_ticket','l9t1_fahrkarte_bezahlen'].map(img),
  answer:'Zuerst muss man das Ziel wählen. Danach muss man Erwachsene oder Kind auswählen. Dann muss man das Ticket auswählen. Zum Schluss muss man bezahlen und die Fahrkarte nehmen.',
  hint:'Vier Schritte: Ziel wählen – Person auswählen – Ticket auswählen – bezahlen und Fahrkarte nehmen.'
 },
 {
  id:'w-antrag',title:'Antrag stellen',
  images:['l9t1_antrag_holen','l9t1_antrag_ausfuellen','l9t1_antrag_unterlagen','l9t1_antrag_unterschreiben'].map(img),
  answer:'Zuerst muss man einen Antrag holen. Danach muss man den Antrag ausfüllen. Dann muss man die Unterlagen mitbringen. Zum Schluss muss man den Antrag unterschreiben.',
  hint:'Vier Schritte: Antrag holen – ausfüllen – Unterlagen mitbringen – unterschreiben.'
 },
 {
  id:'w-auto',title:'Auto mieten',
  images:['l9t1_auto_autovermietung','l9t1_auto_fuehrerschein','l9t1_auto_papiere','l9t1_auto_abholen'].map(img),
  answer:'Zuerst muss man zur Autovermietung gehen. Danach muss man den Führerschein zeigen. Dann muss man die Papiere unterschreiben. Zum Schluss muss man das Auto abholen.',
  hint:'Vier Schritte: zur Autovermietung gehen – Führerschein zeigen – Papiere unterschreiben – Auto abholen.'
 }
];

// Aufgabe "Anweisungen im Text": zuerst Wortauswahl, danach dieselben Texte frei schreiben.
D.cloze=[
 {
  title:'Bei der Autovermietung',
  parts:['Zuerst geht man zur ',' . Dort muss man den ',' zeigen. Danach muss man die ',' unterschreiben. Zum Schluss kann man das Auto ',' .'],
  answers:['Autovermietung','Führerschein','Papiere','abholen']
 },
 {
  title:'Beim Amt',
  parts:['Ich muss einen ',' stellen. Zuerst muss ich ihn ',' . Danach muss ich meinen ',' mitbringen. Die Mitarbeiterin kann das Dokument ',' .'],
  answers:['Antrag','ausfüllen','Ausweis','stempeln']
 },
 {
  title:'Fahrkarte kaufen',
  parts:['Zuerst muss man das ',' wählen. Danach muss man Erwachsene oder Kind ',' . Dann kann man ',' bezahlen. Zum Schluss nimmt man die ',' .'],
  answers:['Ziel','auswählen','bar','Fahrkarte']
 },
 {
  title:'Für einen Termin',
  parts:['Für den Termin braucht man verschiedene ',' . Man muss sie ',' . Der ',' muss gültig sein. Zum Schluss kann man das fertige Dokument ',' .'],
  answers:['Unterlagen','mitbringen','Ausweis','abholen']
 },
 {
  title:'Vor der Fahrt',
  parts:['Vor der ',' braucht man eine ',' . Man wählt zuerst das ',' . Wenn man zu viel Geld gibt, bekommt man ',' .'],
  answers:['Fahrt','Fahrkarte','Ziel','Wechselgeld']
 }
];

// Alle Nomen aus der tatsächlich sichtbaren L9T1-Wortquelle.
const nounIds=(D.cards||[]).filter(c=>c&&c.type==='noun'&&c.id).map(c=>c.id);
const nounWord=c=>String(c.word||c.full||'').replace(/^(der|die|das)\s+/i,'');
D.articleNouns=nounIds.map(id=>{const c=card(id);return{
 id:`art-${id}`,word:nounWord(c),answer:c.article||'',strict:true,
 hint:'Achte auf den richtigen bestimmten Artikel.'
}});
D.pluralNouns=nounIds.map(id=>{const c=card(id),raw=String(c.plural||'').trim();let answer='';
 if(/^kein plural$/i.test(raw))answer='kein Plural';
 else if(/^nur plural$/i.test(raw))answer=nounWord(c);
 else answer=raw.replace(/^die\s+/i,'');
 return{
  id:`pl-${id}`,word:nounWord(c),image:c.image||img(id),answer,strict:true,
  answers:/^kein plural$/i.test(answer)?['kein Plural']:[],
  hint:/^kein plural$/i.test(answer)?'Dieses Nomen hat keinen Plural.':'Achte genau auf Umlaut und Endung der Pluralform.'
 }});

const dlg=(id,a,before,article,after,answer,imageId,hint)=>({id,a,before,article,after,answer,image:card(imageId).image||img(imageId),hint,strict:true});
D.nounDialogs=[
 dlg('dlg01','Was muss ich für den Termin mitbringen?','Bitte bringen Sie ','den',' mit.','Ausweis','ausweis','Das Bild zeigt das gesuchte Dokument.'),
 dlg('dlg02','Welche Sachen brauche ich für den Termin?','Bitte bringen Sie ','die',' mit.','Unterlagen','unterlagen','Hier wird ein Pluralwort gebraucht.'),
 dlg('dlg03','Was muss ich zuerst machen?','Sie müssen ','einen',' stellen.','Antrag','antrag','Nach „einen“ steht ein maskulines Nomen im Singular.'),
 dlg('dlg04','Was muss ich unterschreiben?','Unterschreiben Sie bitte ','die','.','Papiere','papiere','Hier wird ein Pluralwort gebraucht.'),
 dlg('dlg05','Was stempelt die Mitarbeiterin?','Sie stempelt ','das','.','Dokument','dokument','„das“ zeigt Singular.'),
 dlg('dlg06','Was bekomme ich nach dem Bezahlen?','Sie bekommen ','die','.','Fahrkarte','fahrkarte','„die“ und das Verb zeigen Singular.'),
 dlg('dlg07','Was muss ich zeigen, wenn ich ein Auto mieten möchte?','Zeigen Sie bitte ','den','.','Führerschein','fuehrerschein','„den“ zeigt ein maskulines Nomen im Singular.'),
 dlg('dlg08','Was brauche ich für die Fahrt?','Sie brauchen ','ein','.','Ticket','ticket','„ein“ zeigt Neutrum Singular.'),
 dlg('dlg09','Wo muss ich für den Termin hingehen?','Gehen Sie zu ','dem','.','Amt','amt','Nach „zu“ steht Dativ.'),
 dlg('dlg10','Was funktioniert wieder?','Der ','',' funktioniert wieder.','Automat','automat','„Der“ zeigt maskulinen Singular.'),
 dlg('dlg11','Was wählt man zuerst?','Zuerst wählt man ','das','.','Ziel','ziel','„das“ zeigt Neutrum Singular.'),
 dlg('dlg12','Was beginnt um zehn Uhr?','Die ','',' beginnt um zehn Uhr.','Fahrt','fahrt','„Die“ und „beginnt“ zeigen Singular.'),
 dlg('dlg13','Wie heißt die Gruppe vieler europäischer Länder?','Das ist ','die','.','Europäische Union','europaeische_union','Das Bild und der Inhalt helfen.'),
 dlg('dlg14','Wo kann man ein Auto mieten?','Bei ','der','.','Autovermietung','autovermietung','Nach „bei“ steht Dativ.'),
 dlg('dlg15','Was bekommt man zurück, wenn man zu viel bezahlt?','Man bekommt ','das','.','Wechselgeld','wechselgeld','Dieses Nomen hat keinen Plural.'),
 dlg('dlg16','Wer kauft das Ticket?','Der ','',' kauft das Ticket.','Erwachsene','erwachsener','„Der“ und „kauft“ zeigen einen Mann im Singular.'),
 dlg('dlg17','Wer kauft die Fahrkarte?','Die ','',' kauft die Fahrkarte.','Erwachsene','erwachsene','„Die“ und „kauft“ zeigen eine Frau im Singular.'),
 dlg('dlg18','Was nehmen wir für drei Personen?','Wir nehmen ','die','.','Fahrkarten','fahrkarte','Der Kontext zeigt Plural.'),
 dlg('dlg19','Was zeigen die beiden Männer?','Sie zeigen ','die','.','Führerscheine','fuehrerschein','„die beiden“ zeigt Plural.'),
 dlg('dlg20','Was ist samstags oft geschlossen?','Samstags sind ','die',' oft geschlossen.','Ämter','amt','„sind“ zeigt Plural.')
];

const cas=(id,before,noun,after,answer,hint)=>({id,before,noun,after,answer,hint,strict:true});
D.caseArticles=[
 cas('case01','Man muss ','Antrag',' ausfüllen.','den','Akkusativ nach „ausfüllen“: der → den.'),
 cas('case02','Bitte bringen Sie ','Ausweis',' mit.','den','Akkusativ nach „mitbringen“: der → den.'),
 cas('case03','Man muss ','Papiere',' unterschreiben.','die','Plural im Akkusativ: die.'),
 cas('case04','Die Mitarbeiterin stempelt ','Dokument','.','das','Neutrum im Akkusativ bleibt das.'),
 cas('case05','Zuerst wählt man ','Ziel','.','das','Neutrum im Akkusativ bleibt das.'),
 cas('case06','Danach wählt man ','Erwachsene',' aus.','die','Femininum im Akkusativ bleibt die.'),
 cas('case07','Man muss ','Führerschein',' zeigen.','den','Akkusativ: der → den.'),
 cas('case08','Man kauft ','Fahrkarte',' am Automaten.','die','Femininum im Akkusativ bleibt die.'),
 cas('case09','Man braucht ','Ticket',' für die Fahrt.','das','Neutrum im Akkusativ bleibt das.'),
 cas('case10','Man muss ','Unterlagen',' mitbringen.','die','Plural im Akkusativ: die.'),
 cas('case11','Der Automat gibt ','Wechselgeld',' zurück.','das','Neutrum im Akkusativ bleibt das.'),
 cas('case12','Man plant ','Fahrt',' nach Berlin.','die','Femininum im Akkusativ bleibt die.'),
 cas('case13','Man besucht ','Autovermietung',' am Morgen.','die','Femininum im Akkusativ bleibt die.'),
 cas('case14','Viele Menschen kennen ','Europäische Union','.','die','Femininum im Akkusativ bleibt die.'),
 cas('case15','Wir sehen ','Ämter',' in der Stadt.','die','Plural im Akkusativ: die.'),
 cas('case16','Um ','Automaten',' warten viele Menschen.','die','„Automaten“ ist hier Plural; nach „um“ steht Akkusativ: die Automaten.'),
 cas('case17','Die beiden Männer zeigen ','Führerscheine','.','die','Plural im Akkusativ: die.'),
 cas('case18','Wir kaufen ','Fahrkarten',' online.','die','Plural im Akkusativ: die.'),
 cas('case19','Die Erwachsenen brauchen ','Tickets','.','die','Plural im Akkusativ: die.'),
 cas('case20','Die Mitarbeiterin prüft ','Anträge','.','die','Plural im Akkusativ: die.'),
 cas('case21','Bei ','Amt',' stellt man einen Antrag.','dem','Nach „bei“ steht Dativ: das → dem.'),
 cas('case22','Bei ','Autovermietung',' zeigt man den Führerschein.','der','Nach „bei“ steht Dativ: die → der.'),
 cas('case23','Nach ','Fahrt',' ist das Ticket nicht mehr gültig.','der','Nach „nach“ steht Dativ: die → der.'),
 cas('case24','Ich komme gerade aus ','Amt','.','dem','Nach „aus“ steht Dativ: das → dem.'),
 cas('case25','Von ','Autovermietung',' holen wir das Auto ab.','der','Nach „von“ steht Dativ: die → der.'),
 cas('case26','Zu ','Amt',' muss man den Ausweis mitbringen.','dem','Nach „zu“ steht Dativ: das → dem.'),
 cas('case27','Seit ','Fahrt',' finde ich meinen Ausweis nicht.','der','Nach „seit“ steht Dativ: die → der.'),
 cas('case28','Bei ','Automaten',' kann man bar bezahlen.','den','„Automaten“ ist hier Plural; nach „bei“ steht Dativ: den Automaten.'),
 cas('case29','Ohne ','Fahrkarte',' kann man nicht mitfahren.','die','Nach „ohne“ steht Akkusativ: die.'),
 cas('case30','Für ','Tickets',' kann man bar bezahlen.','die','Nach „für“ steht Akkusativ; Plural: die.')
];

const extraTasks=[
 {id:'artikel-nomen',icon:'🧾',title:'Artikel',description:'Schreibe den richtigen Artikel.',kind:'noun-article'},
 {id:'plural-bild',icon:'🔤',title:'Plural',description:'Schreibe die richtige Pluralform.',kind:'noun-plural'},
 {id:'nomen-dialoge',icon:'💬',title:'Nomen im Dialog',description:'Ergänze das Nomen in der richtigen Form.',kind:'noun-dialog'},
 {id:'artikel-kasus',icon:'✍️',title:'Artikel im Satz',description:'Ergänze den richtigen Artikel.',kind:'case-article'}
];
const extraIds=new Set(extraTasks.map(x=>x.id));
D.tasks=(D.tasks||[]).filter(t=>!extraIds.has(t.id));
D.tasks.splice(4,0,...extraTasks);
})();
