(function(){
'use strict';
if(window.__SP_L8T2_TASK10_EMAIL_CHOICE_20260903_V2)return;
window.__SP_L8T2_TASK10_EMAIL_CHOICE_20260903_V2=true;

const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const blank=(answers,options)=>({answers:Array.isArray(answers)?answers:[answers],options:shuffle(options)});

function build(){
 return [
  {
   type:'email-choice-blanks',
   lines:[
    'An: personal@restaurant-mitte.de',
    'Von: maria@email.de',
    'Betreff: Arbeit im Restaurant',
    '',
    'Sehr geehrte Frau Klein,',
    '',
    'ich möchte gern bei Ihnen arbeiten.',
    'Ich habe ein {{0}} in einem Restaurant gemacht.',
    'Dort habe ich viel {{1}} gesammelt.',
    'Ich möchte gern in Ihrer {{2}} arbeiten.',
    '',
    'Mit freundlichen Grüßen',
    'Maria Petrenko'
   ],
   blanks:[
    blank('Praktikum',['Praktikum','Diplom','Abteilung']),
    blank(['Berufserfahrung','Erfahrung'],['Berufserfahrung','Erfahrung','Praktikum']),
    blank('Abteilung',['Abteilung','Praktikum','Diplom'])
   ]
  },
  {
   type:'email-choice-blanks',
   lines:[
    'An: personal@hotel-stadt.de',
    'Von: emre@email.de',
    'Betreff: Arbeit im Hotel',
    '',
    'Sehr geehrter Herr Weber,',
    '',
    'ich interessiere mich für die Arbeit in Ihrem Hotel.',
    'Nach meiner Ausbildung habe ich ein {{0}} bekommen.',
    'Danach habe ich ein {{1}} in einem Hotel gemacht.',
    'Dort habe ich viel {{2}} gesammelt.',
    '',
    'Mit freundlichen Grüßen',
    'Emre Kaya'
   ],
   blanks:[
    blank('Diplom',['Diplom','Praktikum','Abteilung']),
    blank('Praktikum',['Praktikum','Diplom','Abteilung']),
    blank(['Berufserfahrung','Erfahrung'],['Berufserfahrung','Erfahrung','Diplom'])
   ]
  },
  {
   type:'email-choice-blanks',
   lines:[
    'An: personal@firma-koeln.de',
    'Von: olena@email.de',
    'Betreff: Arbeit in Ihrer Firma',
    '',
    'Sehr geehrte Frau Berger,',
    '',
    'ich möchte gern bei Ihnen arbeiten.',
    'Ich arbeite jetzt in einer {{0}} einer Firma.',
    'Nach meiner Ausbildung habe ich mein {{1}} bekommen.',
    'Ich habe schon viel {{2}} gesammelt.',
    '',
    'Mit freundlichen Grüßen',
    'Olena Bondar'
   ],
   blanks:[
    blank('Abteilung',['Abteilung','Praktikum','Diplom']),
    blank('Diplom',['Diplom','Praktikum','Abteilung']),
    blank(['Berufserfahrung','Erfahrung'],['Berufserfahrung','Erfahrung','Praktikum'])
   ]
  }
 ];
}

function visibleTask10(theme){
 const normalIndexes=[];
 theme.tasks.forEach((task,index)=>{if(!task?.exam)normalIndexes.push(index)});
 const index=normalIndexes[9];
 return Number.isInteger(index)?{index,task:theme.tasks[index]}:null;
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const slot=visibleTask10(theme);if(!slot)return theme;
 const replacement={
  ...slot.task,
  id:'bewerbung-email-auswahl-v2',
  title:'E-Mails – Wörter auswählen',
  instruction:'Klicke auf jede Lücke und wähle das passende Wort aus drei Möglichkeiten.',
  kind:'email-choice-blanks',icon:'📧',emoji:'📧',emailLayout:true,
  items:build(),
  spVocabularySource:'t2-learned-only'
 };
 delete replacement.intro;delete replacement.sections;delete replacement.audio;delete replacement.audioFile;delete replacement.formFields;delete replacement.scrambledHelp;
 theme.tasks.splice(slot.index,1,replacement);
 theme.contentRevision=String(theme.contentRevision||'')+'-visible-task10-email-choice-v2';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_TASK10_FINAL_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK10_FINAL_READY;
window.L8T2Task10Final20260903={apply,build,visibleTask10,version:2};
})();
