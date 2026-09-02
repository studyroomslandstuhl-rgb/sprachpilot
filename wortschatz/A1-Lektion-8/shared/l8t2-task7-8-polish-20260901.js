(function(){
'use strict';
if(window.__SP_L8T2_TASK7_8_POLISH_20260901)return;
window.__SP_L8T2_TASK7_8_POLISH_20260901=true;

const EMRE='https://sprachpilot.b-cdn.net/audio/l8t2_aufgabe7_bewerbung_emre.mp3';
const AYLIN='https://sprachpilot.b-cdn.net/audio/l8t2_aufgabe8_bewerbung_aylin.mp3';
const choice=(section,prompt,options,answer)=>({type:'choice',section,prompt,options,answer});
const input=(section,prompt,answers)=>({type:'input',section,prompt,answer:Array.isArray(answers)?answers:[answers]});

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;

 const listen=theme.tasks.find(t=>t?.id==='bewerbung-hoeren-gesamt');
 if(listen){
  listen.title='Zwei Gespräche';
  listen.instruction='Höre beide Gespräche und bearbeite die Fragen.';
  listen.kind='listening-two';listen.icon='☎️';listen.emoji='☎️';listen.acceptDigitWords=true;
  delete listen.audio;delete listen.audioFile;
  listen.sections=[
   {id:1,title:'Gespräch 1 – Emre',instruction:'Höre das Gespräch und wähle die richtige Antwort.',audio:EMRE,audioFile:EMRE,mode:'choice'},
   {id:2,title:'Gespräch 2 – Aylin',instruction:'Höre das Gespräch und beantworte die Fragen in vollständigen Sätzen.',audio:AYLIN,audioFile:AYLIN,mode:'input'}
  ];
  listen.items=[
   choice(1,'Wo wohnt Emre jetzt?',['In Köln.','In Bonn.','In Düsseldorf.'],'In Köln.'),
   choice(1,'Wie lange wohnt Emre schon in Köln?',['Seit drei Jahren.','Vor drei Jahren.','Drei Monate.'],'Seit drei Jahren.'),
   choice(1,'Wann ist Emre nach Deutschland gekommen?',['Vor fünf Jahren.','Seit fünf Jahren.','Fünf Monate.'],'Vor fünf Jahren.'),
   choice(1,'Welche Ausbildung hat Emre gemacht?',['Koch.','Kellner.','Architekt.'],'Koch.'),
   choice(1,'Wann hat Emre die Ausbildung angefangen?',['Vor vier Jahren.','Seit vier Jahren.','Vier Jahre.'],'Vor vier Jahren.'),
   choice(1,'Wie lange hat die Ausbildung gedauert?',['Zwei Jahre.','Seit zwei Jahren.','Vor zwei Jahren.'],'Zwei Jahre.'),
   choice(1,'Wie lange hat Emre nach der Ausbildung im Restaurant gearbeitet?',['Acht Monate.','Seit acht Monaten.','Vor acht Monaten.'],'Acht Monate.'),
   choice(1,'Seit wann besucht Emre einen Deutschkurs?',['Seit einem Jahr.','Vor einem Jahr.','Ein Jahr lang vor der Ausbildung.'],'Seit einem Jahr.'),
   choice(1,'Seit wann arbeitet Emre im Café?',['Seit zehn Monaten.','Vor zehn Monaten.','Zehn Jahre.'],'Seit zehn Monaten.'),
   choice(1,'Wie lange lernt Emre schon Deutsch?',['Seit zwei Jahren.','Vor zwei Jahren.','Zwei Monate.'],'Seit zwei Jahren.'),

   input(2,'Wo wohnt Aylin jetzt?',['Aylin wohnt jetzt in Köln.','Aylin wohnt in Köln.','Sie wohnt jetzt in Köln.','Sie wohnt in Köln.','Jetzt wohnt Aylin in Köln.']),
   input(2,'Wie lange lebt Aylin schon in Deutschland?',['Aylin lebt seit sechs Jahren in Deutschland.','Sie lebt seit sechs Jahren in Deutschland.','Seit sechs Jahren lebt Aylin in Deutschland.','Seit sechs Jahren lebt sie in Deutschland.']),
   input(2,'Wann hat Aylin ihre Ausbildung angefangen?',['Aylin hat ihre Ausbildung vor drei Jahren angefangen.','Sie hat ihre Ausbildung vor drei Jahren angefangen.','Vor drei Jahren hat Aylin ihre Ausbildung angefangen.','Vor drei Jahren hat sie ihre Ausbildung angefangen.']),
   input(2,'Wie lange hat die Ausbildung gedauert?',['Die Ausbildung hat ein Jahr gedauert.','Ihre Ausbildung hat ein Jahr gedauert.','Aylins Ausbildung hat ein Jahr gedauert.','Die Ausbildung dauerte ein Jahr.']),
   input(2,'Wie lange hat der Deutschkurs gedauert?',['Der Deutschkurs hat vier Monate gedauert.','Der Kurs hat vier Monate gedauert.','Ihr Deutschkurs hat vier Monate gedauert.','Der Deutschkurs dauerte vier Monate.']),
   input(2,'Wann hat Aylin ihre erste Stelle angefangen?',['Aylin hat ihre erste Stelle vor circa eineinhalb Jahren angefangen.','Sie hat ihre erste Stelle vor circa eineinhalb Jahren angefangen.','Vor circa eineinhalb Jahren hat Aylin ihre erste Stelle angefangen.','Vor circa eineinhalb Jahren hat sie ihre erste Stelle angefangen.','Aylin hat ihre erste Stelle vor ungefähr eineinhalb Jahren angefangen.']),
   input(2,'Seit wann arbeitet Aylin in Teilzeit?',['Aylin arbeitet seit acht Monaten in Teilzeit.','Sie arbeitet seit acht Monaten in Teilzeit.','Seit acht Monaten arbeitet Aylin in Teilzeit.','Seit acht Monaten arbeitet sie in Teilzeit.']),
   input(2,'Wie lange möchte Aylin das Praktikum machen?',['Aylin möchte das Praktikum zwei Monate machen.','Sie möchte das Praktikum zwei Monate machen.','Aylin möchte zwei Monate ein Praktikum machen.','Sie möchte zwei Monate ein Praktikum machen.','Das Praktikum soll zwei Monate dauern.']),
   input(2,'Wann kann Aylin mit dem Praktikum anfangen?',['Aylin kann in drei Wochen mit dem Praktikum anfangen.','Sie kann in drei Wochen mit dem Praktikum anfangen.','In drei Wochen kann Aylin mit dem Praktikum anfangen.','In drei Wochen kann sie mit dem Praktikum anfangen.']),
   input(2,'Wie lange hat Aylin in Düsseldorf gewohnt?',['Aylin hat zwei Jahre in Düsseldorf gewohnt.','Sie hat zwei Jahre in Düsseldorf gewohnt.','Zwei Jahre hat Aylin in Düsseldorf gewohnt.','Zwei Jahre hat sie in Düsseldorf gewohnt.'])
  ];
 }

 const email=theme.tasks.find(t=>t?.id==='bewerbung-lueckentext');
 if(email){
  email.title='Bewerbung per E-Mail – 3 Lückentexte';
  email.instruction='Lies die drei E-Mails und ergänze die fehlenden Wörter und Zeitangaben.';
  email.emailLayout=true;email.icon='📧';email.emoji='📧';
  email.items=[
   {
    type:'dialog-blanks',
    lines:[
     'An: bewerbung@restaurant-mitte.de',
     'Von: maria@email.de',
     'Betreff: Bewerbung als Kellnerin',
     '',
     '{{0}} Frau Klein,',
     '',
     'ich möchte mich um die {{1}} als Kellnerin in Ihrem Restaurant bewerben.',
     '',
     '{{2}} zwei Jahren habe ich meine {{3}} gemacht.',
     '{{4}} einem Jahr arbeite ich in einem Café.',
     'Dort arbeite ich im Team und habe viel {{5}}.',
     '',
     'Ich freue mich auf Ihre {{6}}.',
     '',
     '{{7}}',
     'Maria Petrenko'
    ],
    blanks:[
     {answers:['Sehr geehrte','Sehr geehrte Frau Klein']},
     {answers:['Stelle']},
     {answers:['Vor']},
     {answers:['Ausbildung']},
     {answers:['Seit']},
     {answers:['Berufserfahrung','Erfahrung']},
     {answers:['Antwort']},
     {answers:['Mit freundlichen Grüßen','Mit freundlichen Gruessen']}
    ]
   },
   {
    type:'dialog-blanks',
    lines:[
     'An: herr.weber@hotel-stadt.de',
     'Von: emre@email.de',
     'Betreff: Bewerbung als Koch',
     '',
     '{{0}} Herr Weber,',
     '',
     'ich interessiere mich für die {{1}} als Koch in Ihrem Hotel.',
     '{{2}} vier Jahren habe ich meine Ausbildung als Koch angefangen.',
     'Die Ausbildung hat zwei Jahre {{3}}.',
     '{{4}} zwei Jahren arbeite ich in einem Restaurant.',
     'Die Arbeit macht mir viel {{5}}.',
     '',
     'Ich freue mich auf Ihre {{6}}.',
     '',
     '{{7}}',
     'Emre Kaya'
    ],
    blanks:[
     {answers:['Sehr geehrter','Sehr geehrter Herr Weber']},
     {answers:['Stelle']},
     {answers:['Vor']},
     {answers:['gedauert']},
     {answers:['Seit']},
     {answers:['Spaß','Spass']},
     {answers:['Antwort']},
     {answers:['Mit freundlichen Grüßen','Mit freundlichen Gruessen']}
    ]
   },
   {
    type:'dialog-blanks',
    lines:[
     'An: frau.berger@buero.de',
     'Von: olena@email.de',
     'Betreff: Ihre E-Mail',
     '',
     '{{0}} Frau Berger,',
     '',
     'vielen Dank für Ihre E-Mail.',
     'Ich komme gern am Dienstag.',
     '{{1}} drei Jahren arbeite ich als Architektin.',
     '{{2}} fünf Jahren habe ich meine Ausbildung angefangen.',
     'Ich habe viel {{3}} und arbeite gern mit Kollegen zusammen.',
     '',
     'Vielen {{4}}.',
     '',
     '{{5}}',
     'Olena Bondar'
    ],
    blanks:[
     {answers:['Sehr geehrte','Sehr geehrte Frau Berger']},
     {answers:['Seit']},
     {answers:['Vor']},
     {answers:['Berufserfahrung','Erfahrung']},
     {answers:['Dank']},
     {answers:['Mit freundlichen Grüßen','Mit freundlichen Gruessen']}
    ]
   }
  ];
 }

 theme.contentRevision='l8t2-task7-8-polish-20260902-v4';
 return theme;
}

window.L8_T2_TASK7_8_POLISH_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK7_8_POLISH_READY;
window.L8T2Task7to8Polish={apply};
})();