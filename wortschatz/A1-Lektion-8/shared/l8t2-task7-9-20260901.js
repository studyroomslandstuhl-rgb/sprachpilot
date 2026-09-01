(function(){
'use strict';
if(window.__SP_L8T2_TASK7_10_20260901_V3)return;
window.__SP_L8T2_TASK7_10_20260901_V3=true;

const AUDIO='https://sprachpilot.b-cdn.net/audio/l8t2_aufgabe8_bewerbung_aylin.mp3';
const input=(prompt,answer)=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer]});
const choice=(prompt,options,answer)=>({type:'choice',prompt,options,answer});
const blank=answers=>({answers:Array.isArray(answers)?answers:[answers]});
const cloze=(lines,blanks)=>({type:'dialog-blanks',lines,blanks});

const TASK7={
 id:'bewerbung-hoeren-gesamt',
 title:'Bewerbungsgespräch – Hören',
 instruction:'Höre das Telefongespräch. Beantworte alle Fragen auf dieser Seite.',
 kind:'listening-all',icon:'🎧',emoji:'🎧',audio:AUDIO,audioFile:AUDIO,
 items:[
  input('Wo wohnt Aylin jetzt?',['Aylin wohnt jetzt in Köln.','Aylin wohnt in Köln.','Sie wohnt jetzt in Köln.','Sie wohnt in Köln.','Jetzt wohnt Aylin in Köln.','In Köln wohnt Aylin jetzt.']),
  input('Wie lange lebt Aylin schon in Deutschland?',['Aylin lebt seit sechs Jahren in Deutschland.','Sie lebt seit sechs Jahren in Deutschland.','Seit sechs Jahren lebt Aylin in Deutschland.','Seit sechs Jahren lebt sie in Deutschland.','Aylin lebt seit 6 Jahren in Deutschland.','Sie lebt seit 6 Jahren in Deutschland.']),
  input('Wann hat Aylin ihre Ausbildung begonnen?',['Aylin hat ihre Ausbildung vor drei Jahren begonnen.','Sie hat ihre Ausbildung vor drei Jahren begonnen.','Aylin hat vor drei Jahren ihre Ausbildung begonnen.','Sie hat vor drei Jahren ihre Ausbildung begonnen.','Vor drei Jahren hat Aylin ihre Ausbildung begonnen.','Vor drei Jahren hat sie ihre Ausbildung begonnen.','Aylin hat ihre Ausbildung vor 3 Jahren begonnen.','Sie hat ihre Ausbildung vor 3 Jahren begonnen.']),
  input('Wie lange hat Aylins Ausbildung gedauert?',['Aylins Ausbildung hat ein Jahr gedauert.','Die Ausbildung hat ein Jahr gedauert.','Ihre Ausbildung hat ein Jahr gedauert.','Ein Jahr hat die Ausbildung gedauert.','Aylins Ausbildung hat 1 Jahr gedauert.','Die Ausbildung hat 1 Jahr gedauert.']),
  input('Wann hat Aylin ihre erste Stelle angefangen?',['Aylin hat ihre erste Stelle vor circa eineinhalb Jahren angefangen.','Sie hat ihre erste Stelle vor circa eineinhalb Jahren angefangen.','Vor circa eineinhalb Jahren hat Aylin ihre erste Stelle angefangen.','Vor circa eineinhalb Jahren hat sie ihre erste Stelle angefangen.','Aylin hat vor circa eineinhalb Jahren ihre erste Stelle angefangen.']),
  input('Seit wann arbeitet Aylin in Teilzeit?',['Aylin arbeitet seit acht Monaten in Teilzeit.','Sie arbeitet seit acht Monaten in Teilzeit.','Seit acht Monaten arbeitet Aylin in Teilzeit.','Seit acht Monaten arbeitet sie in Teilzeit.','Aylin arbeitet seit 8 Monaten in Teilzeit.','Sie arbeitet seit 8 Monaten in Teilzeit.']),
  input('Seit wann macht Aylin den Deutschkurs?',['Aylin macht seit vier Monaten den Deutschkurs.','Sie macht seit vier Monaten den Deutschkurs.','Seit vier Monaten macht Aylin den Deutschkurs.','Seit vier Monaten macht sie den Deutschkurs.','Aylin macht seit 4 Monaten den Deutschkurs.','Sie macht seit 4 Monaten den Deutschkurs.']),
  input('Wie lange möchte Aylin das Praktikum machen?',['Aylin möchte das Praktikum zwei Monate machen.','Sie möchte das Praktikum zwei Monate machen.','Aylin möchte zwei Monate ein Praktikum machen.','Sie möchte zwei Monate ein Praktikum machen.','Das Praktikum möchte Aylin zwei Monate machen.','Aylin möchte das Praktikum 2 Monate machen.']),
  input('Wann kann Aylin mit dem Praktikum anfangen?',['Aylin kann in drei Wochen mit dem Praktikum anfangen.','Sie kann in drei Wochen mit dem Praktikum anfangen.','In drei Wochen kann Aylin mit dem Praktikum anfangen.','In drei Wochen kann sie mit dem Praktikum anfangen.','Aylin kann in 3 Wochen mit dem Praktikum anfangen.','Sie kann in 3 Wochen mit dem Praktikum anfangen.']),
  input('Wie lange hat Aylin in Düsseldorf gewohnt?',['Aylin hat zwei Jahre in Düsseldorf gewohnt.','Sie hat zwei Jahre in Düsseldorf gewohnt.','Zwei Jahre hat Aylin in Düsseldorf gewohnt.','Zwei Jahre hat sie in Düsseldorf gewohnt.','Aylin hat 2 Jahre in Düsseldorf gewohnt.','Sie hat 2 Jahre in Düsseldorf gewohnt.']),
  choice('Aylin wohnt immer noch in Düsseldorf.',['Richtig','Falsch'],'Falsch'),
  choice('Aylin macht seit vier Monaten den Deutschkurs.',['Richtig','Falsch'],'Richtig'),
  choice('Aylin hat ihre Ausbildung vor drei Jahren begonnen.',['Richtig','Falsch'],'Richtig'),
  choice('Die Ausbildung hat drei Jahre gedauert.',['Richtig','Falsch'],'Falsch'),
  choice('Seit acht Monaten arbeitet Aylin in Teilzeit.',['Richtig','Falsch'],'Richtig'),
  choice('Welche Antwort passt zu „Wann hat Aylin ihre Ausbildung begonnen?“',['Vor drei Jahren.','Seit drei Jahren.','Drei Jahre.'],'Vor drei Jahren.'),
  choice('Welche Antwort passt zu „Wie lange hat die Ausbildung gedauert?“',['Ein Jahr.','Seit einem Jahr.','Vor einem Jahr.'],'Ein Jahr.'),
  choice('Welche Antwort passt zu „Seit wann arbeitet Aylin in Teilzeit?“',['Seit acht Monaten.','Vor acht Monaten.','Acht Monate.'],'Seit acht Monaten.'),
  choice('Welche Antwort passt zu „Wie lange möchte Aylin das Praktikum machen?“',['Zwei Monate.','Seit zwei Monaten.','Vor zwei Monaten.'],'Zwei Monate.'),
  choice('Welche Antwort passt zu „Wann kann Aylin anfangen?“',['In drei Wochen.','Seit drei Wochen.','Vor drei Wochen.'],'In drei Wochen.')
 ]
};

const TASK8={
 id:'bewerbung-lueckentext',
 title:'Bewerbung – Lückentext',
 instruction:'Ergänze die fehlenden Wörter und Zeitangaben.',
 kind:'dialog-blanks',icon:'✉️',emoji:'✉️',
 items:[
  cloze([
   '{{0}} Frau Berger,',
   '',
   'ich möchte mich um die {{1}} als Köchin in Ihrem Restaurant bewerben.',
   '{{2}} drei Jahren habe ich meine {{3}} als Köchin angefangen. Die Ausbildung hat zwei Jahre {{4}}.',
   '{{5}} einem Jahr arbeite ich in einem Café. Dort habe ich viel {{6}} gesammelt.',
   'Meinen {{7}}, mein {{8}} und mein {{9}} habe ich mit der {{10}} geschickt.',
   'Ich freue mich auf ein {{11}} und auf Ihre Antwort.',
   '',
   '{{12}}',
   'Aylin Yilmaz'
  ],[
   blank(['Sehr geehrte','Sehr geehrte Frau Berger']),
   blank('Stelle'),
   blank('Vor'),
   blank('Ausbildung'),
   blank('gedauert'),
   blank('Seit'),
   blank('Berufserfahrung'),
   blank('Lebenslauf'),
   blank('Anschreiben'),
   blank('Zeugnis'),
   blank('Bewerbung'),
   blank(['Bewerbungsgespräch','Vorstellungsgespräch']),
   blank(['Mit freundlichen Grüßen','Mit freundlichen Gruessen'])
  ])
 ]
};

const TASK9={
 id:'biografien-luecken',
 title:'Biografien ergänzen',
 instruction:'Ergänze die Wörter und Zeitpräpositionen. Nutze den Wortschatz aus Thema 2.',
 kind:'dialog-blanks',icon:'🧩',emoji:'🧩',
 items:[
  cloze([
   'Wortbank: vor · Ausbildung · gedauert · seit · Firma · Berufserfahrung',
   'Samira ist 29 Jahre alt. {{0}} vier Jahren hat sie eine {{1}} als Verkäuferin angefangen. Die Ausbildung hat zwei Jahre {{2}}. {{3}} zwei Jahren arbeitet sie bei einer großen {{4}}. Dort hat sie viel {{5}} gesammelt.'
  ],[blank('Vor'),blank('Ausbildung'),blank('gedauert'),blank('Seit'),blank('Firma'),blank('Berufserfahrung')]),
  cloze([
   'Wortbank: Studium · Abschluss · vor · Büro · seit · Stelle',
   'Omar hat Wirtschaft studiert. Sein {{0}} war {{1}} drei Jahren. Danach hat er eine {{2}} in einem großen {{3}} gefunden. {{4}} zweieinhalb Jahren arbeitet er dort. Die {{5}} gefällt ihm gut.'
  ],[blank('Abschluss'),blank('vor'),blank('Stelle'),blank('Büro'),blank('Seit'),blank('Stelle')]),
  cloze([
   'Wortbank: Bewerbung · Lebenslauf · Zeugnis · Bewerbungsgespräch · vor · seit',
   'Elena wollte eine neue Arbeit. {{0}} sechs Monaten hat sie eine {{1}} geschickt. Dazu gehörten ihr {{2}} und ein {{3}}. Eine Woche später hatte sie ein {{4}}. {{5}} fünf Monaten arbeitet sie bei der neuen Firma.'
  ],[blank('Vor'),blank('Bewerbung'),blank('Lebenslauf'),blank('Zeugnis'),blank(['Bewerbungsgespräch','Vorstellungsgespräch']),blank('Seit')]),
  cloze([
   'Wortbank: Berufsschule · Diplom · Praktikum · Abteilung · vor · seit',
   'Daniel war drei Jahre in der {{0}}. Sein {{1}} hat er {{2}} zwei Jahren bekommen. Danach hat er ein {{3}} gemacht. {{4}} einem Jahr arbeitet er in einer technischen {{5}}.'
  ],[blank('Berufsschule'),blank('Diplom'),blank('vor'),blank('Praktikum'),blank('Seit'),blank('Abteilung')]),
  cloze([
   'Wortbank: Arbeitgeberin · Ausbildung · Stelle · anfangen · vor · seit',
   'Aylin hat ihre {{0}} als Friseurin {{1}} fünf Jahren beendet. Danach hat sie eine {{2}} in einem Salon bekommen. {{3}} drei Jahren arbeitet sie bei derselben {{4}}. Jetzt möchte sie später eine neue Stelle {{5}}.'
  ],[blank('Ausbildung'),blank('vor'),blank('Stelle'),blank('Seit'),blank('Arbeitgeberin'),blank('anfangen')])
 ]
};

const TASK10={
 id:'biografie-schreiben',
 title:'Biografie schreiben',
 instruction:'Schreibe aus den Bausteinen eine Biografie in vollständigen Sätzen.',
 kind:'free',icon:'✍️',emoji:'✍️',
 items:[{
  type:'free',min:6,
  prompt:'Schreibe die Biografie von Elena Markovic.',
  context:'Name: Elena Markovic\nGeboren: 1995 in Belgrad\nNach Deutschland gekommen: vor 9 Jahren\nWohnort: seit 7 Jahren in Köln\nAusbildung als Köchin: vor 6 Jahren angefangen\nDauer der Ausbildung: 3 Jahre\nErste Stelle im Restaurant: vor 3 Jahren angefangen\nArbeitet dort: seit 3 Jahren\nBeruf: Köchin\nZiel: mehr Berufserfahrung sammeln'
 }]
};

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const practice=theme.tasks.filter(task=>!task?.exam);
 const exams=theme.tasks.filter(task=>task?.exam);
 const firstSix=practice.slice(0,6);
 theme.tasks=[...firstSix,TASK7,TASK8,TASK9,TASK10,...exams];
 theme.contentRevision='l8t2-task7-10-20260901-v3';
 return theme;
}

window.L8_T2_TASK7_10_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK7_10_READY;
window.L8T2Task7to10={apply};
})();