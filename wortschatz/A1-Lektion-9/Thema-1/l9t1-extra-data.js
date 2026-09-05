(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const card=id=>(D.cards||[]).find(x=>x.id===id)||{};
const nounIds=['fuehrerschein','ticket','amt','europaeische_union','fahrt','fahrkarte','antrag','ausweis','papiere','automat','ziel','erwachsener','erwachsene','autovermietung','unterlagen','dokument','wechselgeld'];
const promptWord=(c,id)=>id==='erwachsener'?'Erwachsene (Mann)':id==='erwachsene'?'Erwachsene (Frau)':String(c.word||c.full||id).replace(/^(der|die|das)\s+/i,'');

D.articleNouns=nounIds.map(id=>{const c=card(id);return{
 id:`art-${id}`,
 word:promptWord(c,id),
 answer:c.article||String(c.full||'').split(/\s+/)[0]||'',
 hint:'Achte auf das Genus des Nomens.',
 image:c.image||`${CDN}${id}.webp`
}});

D.pluralNouns=nounIds.map(id=>{const c=card(id);const raw=String(c.plural||'').trim();let answer=raw;
 if(/^nur plural$/i.test(raw))answer=String(c.full||'').trim();
 if(!answer)answer='kein Plural';
 return{
  id:`pl-${id}`,
  word:promptWord(c,id),
  image:c.image||`${CDN}${id}.webp`,
  answer,
  answers:/^kein plural$/i.test(answer)?['kein Plural','kein plural']:[],
  hint:/^kein plural$/i.test(answer)?'Dieses Nomen hat keinen Plural.':'Schreibe den Plural immer zusammen mit dem Artikel.'
 }});

const dlg=(id,a,before,article,after,answer,image,hint)=>({id,a,before,article,after,answer,image:card(image).image||`${CDN}${image}.webp`,hint});
D.nounDialogs=[
 dlg('dlg01','Was muss ich zum Amt mitbringen?','Bitte bringen Sie ','den',' mit.','Ausweis','ausweis','„den“ zeigt hier Singular. Das Bild zeigt das gesuchte Dokument.'),
 dlg('dlg02','Welche Sachen brauche ich für den Termin?','Bringen Sie bitte ','die',' mit.','Unterlagen','unterlagen','„die“ und der Inhalt zeigen: Hier ist ein Pluralwort gemeint.'),
 dlg('dlg03','Was muss ich zuerst machen?','Sie müssen ','einen',' stellen.','Antrag','antrag','Nach „einen“ steht ein maskulines Nomen im Singular.'),
 dlg('dlg04','Was muss ich unterschreiben?','Unterschreiben Sie bitte ','die','.','Papiere','papiere','Das Verb „unterschreiben“ und „die“ passen hier zu einem Pluralwort.'),
 dlg('dlg05','Was stempelt die Mitarbeiterin?','Sie stempelt ','das','.','Dokument','dokument','„das“ zeigt Neutrum Singular.'),
 dlg('dlg06','Was kaufe ich am Automaten?','Sie kaufen ','eine','.','Fahrkarte','fahrkarte','„eine“ zeigt Femininum Singular.'),
 dlg('dlg07','Was muss ich bei der Autovermietung zeigen?','Zeigen Sie ','den','.','Führerschein','fuehrerschein','„den“ + der Kontext zeigen Singular.'),
 dlg('dlg08','Was brauche ich für die Fahrt?','Sie brauchen ','ein','.','Ticket','ticket','„ein“ zeigt Neutrum Singular.'),
 dlg('dlg09','Wo kaufe ich die Fahrkarte?','Bei ','dem','.','Automaten','automat','Nach „bei“ steht Dativ. Der Erwachsene sagt: bei dem Automaten.'),
 dlg('dlg10','Wo stelle ich den Antrag?','Bei ','dem','.','Amt','amt','Nach „bei“ steht Dativ; „dem“ zeigt Neutrum Singular.'),
 dlg('dlg11','Was wählt man zuerst?','Zuerst wählt man ','das','.','Ziel','ziel','Das Verb „wählen“ und „das“ zeigen die gesuchte Singularform.'),
 dlg('dlg12','Was beginnt jetzt?','Jetzt beginnt ','die','.','Fahrt','fahrt','„die“ und „beginnt“ zeigen Singular.'),
 dlg('dlg13','Welche Gruppe von Ländern arbeitet zusammen?','Das ist ','die','.','Europäische Union','europaeische_union','Der Inhalt und „die“ zeigen den festen Namen im Singular.'),
 dlg('dlg14','Wo mietet man ein Auto?','Bei ','der','.','Autovermietung','autovermietung','Nach „bei“ steht Dativ; „der“ zeigt ein feminines Nomen.'),
 dlg('dlg15','Was bekomme ich zurück?','Sie bekommen ','das','.','Wechselgeld','wechselgeld','Dieses Nomen hat keinen Plural; „das“ zeigt Singular.'),
 dlg('dlg16','Für wen ist die Fahrkarte?','Für ','den','.','Erwachsenen','erwachsener','Nach „für“ steht Akkusativ. Bei „der Erwachsene“ lautet die Form: den Erwachsenen.'),
 dlg('dlg17','Wer holt das Dokument ab?','Das macht ','die','.','Erwachsene','erwachsene','„die“ + „macht“ zeigen eine Frau im Singular.'),
 dlg('dlg18','Welche Fahrkarten nehmt ihr?','Wir nehmen ','die','.','Fahrkarten','fahrkarte','Der Artikel „die“ und der Inhalt zeigen Plural.'),
 dlg('dlg19','Was zeigen die Erwachsenen?','Sie zeigen ','die','.','Führerscheine','fuehrerschein','Der Artikel „die“ und der Inhalt zeigen Plural.'),
 dlg('dlg20','Welche Ämter sind geöffnet?','Geöffnet sind ','die','.','Ämter','amt','Der Artikel „die“ und „sind“ zeigen Plural; achte auf den Umlaut.')
];

const cas=(id,before,noun,after,answer,hint)=>({id,before,noun,after,answer,hint});
D.caseArticles=[
 cas('case01','Man muss ','Antrag',' ausfüllen.','den','„ausfüllen“ hat hier ein Akkusativobjekt: der Antrag → den Antrag.'),
 cas('case02','Bitte bringen Sie ','Ausweis',' mit.','den','„mitbringen“ hat hier ein Akkusativobjekt: der Ausweis → den Ausweis.'),
 cas('case03','Man muss ','Papiere',' unterschreiben.','die','Plural im Akkusativ: die Papiere.'),
 cas('case04','Die Mitarbeiterin stempelt ','Dokument','.','das','Neutrum im Akkusativ bleibt: das Dokument.'),
 cas('case05','Zuerst wählt man ','Ziel','.','das','„wählen“ verlangt hier Akkusativ: das Ziel.'),
 cas('case06','Danach wählt man ','Erwachsene',' aus.','die','Femininum im Akkusativ: die Erwachsene.'),
 cas('case07','Für ','Führerschein',' braucht man Unterlagen.','den','Nach „für“ steht Akkusativ: der → den.'),
 cas('case08','Für ','Fahrt',' braucht man eine Fahrkarte.','die','Nach „für“ steht Akkusativ; Femininum bleibt die.'),
 cas('case09','Ohne ','Ticket',' kann man nicht fahren.','das','Nach „ohne“ steht Akkusativ; Neutrum bleibt das.'),
 cas('case10','Ohne ','Führerschein',' kann man kein Auto mieten.','den','Nach „ohne“ steht Akkusativ: der → den.'),
 cas('case11','Um ','Automaten',' stehen Erwachsene.','den','Nach „um“ steht Akkusativ: der Automat → den Automaten.'),
 cas('case12','Bei ','Amt',' stellt man einen Antrag.','dem','Nach „bei“ steht Dativ: das → dem.'),
 cas('case13','Bei ','Autovermietung',' kann man ein Auto mieten.','der','Nach „bei“ steht Dativ: die → der.'),
 cas('case14','Nach ','Fahrt',' ist das Ticket noch gültig.','der','Nach „nach“ steht Dativ: die → der.'),
 cas('case15','Aus ','Amt',' holt man das Dokument ab.','dem','Nach „aus“ steht Dativ: das → dem.'),
 cas('case16','Von ','Autovermietung',' holt man das Auto ab.','der','Nach „von“ steht Dativ: die → der.'),
 cas('case17','Zu ','Amt',' muss man den Ausweis mitbringen.','dem','Nach „zu“ steht Dativ: das → dem.'),
 cas('case18','Seit ','Fahrt',' ist das Ticket nicht mehr gültig.','der','Nach „seit“ steht Dativ: die → der.'),
 cas('case19','Bei ','Automaten',' wählt man zuerst das Ziel.','dem','Nach „bei“ steht Dativ: der → dem.'),
 cas('case20','Von ','Erwachsenen',' bekommt man die Papiere.','dem','Nach „von“ steht Dativ: der Erwachsene → dem Erwachsenen.')
];

const extraTasks=[
 {id:'artikel-nomen',icon:'🧾',title:'Artikel schreiben',description:'Schreibe den richtigen Artikel.',kind:'noun-article'},
 {id:'plural-bild',icon:'🖼️',title:'Plural schreiben',description:'Sieh das Bild und schreibe den Plural mit Artikel. Hat das Nomen keinen Plural, schreibe „kein Plural“.',kind:'noun-plural'},
 {id:'nomen-dialoge',icon:'💬',title:'Nomen im Dialog',description:'Ergänze das Nomen in der richtigen Form.',kind:'noun-dialog'},
 {id:'artikel-kasus',icon:'✍️',title:'Artikel im Satz',description:'Ergänze den richtigen Artikel.',kind:'case-article'}
];
const examIndex=(D.tasks||[]).findIndex(t=>t.exam||t.kind==='exam');
if(!(D.tasks||[]).some(t=>t.id==='artikel-nomen')){
 if(examIndex>=0)D.tasks.splice(examIndex,0,...extraTasks);else D.tasks.push(...extraTasks);
}
})();
