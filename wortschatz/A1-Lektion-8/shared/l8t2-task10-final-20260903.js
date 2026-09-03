(function(){
'use strict';
if(window.__SP_L8T2_TASK10_EMAIL_CHOICE_20260903_V3)return;
window.__SP_L8T2_TASK10_EMAIL_CHOICE_20260903_V3=true;

const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const blank=(answers,options)=>({answers:Array.isArray(answers)?answers:[answers],options:shuffle(options)});
const salutationFemale=(name)=>blank(`Sehr geehrte Frau ${name},`,[`Sehr geehrte Frau ${name},`,`Sehr geehrter Herr ${name},`,'Mit freundlichen Grüßen']);
const salutationMale=(name)=>blank(`Sehr geehrter Herr ${name},`,[`Sehr geehrter Herr ${name},`,`Sehr geehrte Frau ${name},`,'Mit freundlichen Grüßen']);
const closing=()=>blank('Mit freundlichen Grüßen',['Mit freundlichen Grüßen','Sehr geehrte Frau','Sehr geehrter Herr']);
const experience=wrong=>blank(['Berufserfahrung','Erfahrung'],['Berufserfahrung','Erfahrung',wrong]);
const internship=()=>blank('Praktikum',['Praktikum','Diplom','Abteilung']);
const diploma=()=>blank('Diplom',['Diplom','Praktikum','Abteilung']);
const department=()=>blank('Abteilung',['Abteilung','Praktikum','Diplom']);

function email({to,from,subject,salutation,body,blanks,name}){
 return {type:'email-choice-blanks',lines:[`An: ${to}`,`Von: ${from}`,`Betreff: ${subject}`,'','{{0}}','',...body,'','{{'+(blanks.length+1)+'}}',name],blanks:[salutation,...blanks,closing()]};
}

function build(){
 return [
  email({
   to:'personal@restaurant-mitte.de',from:'maria@email.de',subject:'Arbeit im Restaurant',salutation:salutationFemale('Klein'),name:'Maria Petrenko',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich habe ein {{1}} in einem Restaurant gemacht.','Dort habe ich viel {{2}} gesammelt.','Ich möchte gern in Ihrer {{3}} arbeiten.'],
   blanks:[internship(),experience('Diplom'),department()]
  }),
  email({
   to:'personal@hotel-stadt.de',from:'emre@email.de',subject:'Arbeit im Hotel',salutation:salutationMale('Weber'),name:'Emre Kaya',
   body:['ich möchte gern bei Ihnen arbeiten.','Nach meiner Ausbildung habe ich ein {{1}} bekommen.','Danach habe ich ein {{2}} in einem Hotel gemacht.','Dort habe ich viel {{3}} gesammelt.'],
   blanks:[diploma(),internship(),experience('Abteilung')]
  }),
  email({
   to:'personal@firma-koeln.de',from:'olena@email.de',subject:'Arbeit in Ihrer Firma',salutation:salutationFemale('Berger'),name:'Olena Bondar',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich arbeite jetzt in einer {{1}} einer Firma.','Nach meiner Ausbildung habe ich mein {{2}} bekommen.','Ich habe schon viel {{3}} gesammelt.'],
   blanks:[department(),diploma(),experience('Praktikum')]
  }),
  email({
   to:'personal@cafe-sonne.de',from:'ali@email.de',subject:'Arbeit im Café',salutation:salutationMale('Schulz'),name:'Ali Demir',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich habe ein {{1}} in einem Café gemacht.','Dort war ich in einer kleinen {{2}}.','Ich habe dabei viel {{3}} gesammelt.'],
   blanks:[internship(),department(),experience('Diplom')]
  }),
  email({
   to:'personal@restaurant-park.de',from:'sara@email.de',subject:'Arbeit im Restaurant',salutation:salutationFemale('Neumann'),name:'Sara Ionescu',
   body:['ich möchte gern bei Ihnen arbeiten.','Nach meiner Ausbildung habe ich ein {{1}} bekommen.','Danach habe ich in einer {{2}} gearbeitet.','Dort habe ich viel {{3}} gesammelt.'],
   blanks:[diploma(),department(),experience('Praktikum')]
  }),
  email({
   to:'personal@hotel-am-markt.de',from:'ivan@email.de',subject:'Arbeit im Hotel',salutation:salutationMale('Fischer'),name:'Ivan Kovac',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich habe ein {{1}} in einem Hotel gemacht.','Nach meiner Ausbildung habe ich mein {{2}} bekommen.','Im Hotel habe ich viel {{3}} gesammelt.'],
   blanks:[internship(),diploma(),experience('Abteilung')]
  }),
  email({
   to:'personal@firma-west.de',from:'aylin@email.de',subject:'Arbeit in der Firma',salutation:salutationFemale('Wolf'),name:'Aylin Yilmaz',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich arbeite jetzt in einer {{1}}.','Vorher habe ich ein {{2}} bei einer Firma gemacht.','Dort habe ich viel {{3}} gesammelt.'],
   blanks:[department(),internship(),experience('Diplom')]
  }),
  email({
   to:'personal@restaurant-rhein.de',from:'daniel@email.de',subject:'Arbeit im Restaurant',salutation:salutationMale('Becker'),name:'Daniel Popescu',
   body:['ich möchte gern bei Ihnen arbeiten.','Nach meiner Ausbildung habe ich mein {{1}} bekommen.','Danach habe ich ein {{2}} in einem Restaurant gemacht.','Heute möchte ich gern in Ihrer {{3}} arbeiten.'],
   blanks:[diploma(),internship(),department()]
  }),
  email({
   to:'personal@hotel-zentrum.de',from:'nadia@email.de',subject:'Arbeit im Hotel',salutation:salutationFemale('Koch'),name:'Nadia Melnyk',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich arbeite zurzeit in einer {{1}}.','Dort habe ich viel {{2}} gesammelt.','Nach meiner Ausbildung habe ich ein {{3}} bekommen.'],
   blanks:[department(),experience('Praktikum'),diploma()]
  }),
  email({
   to:'personal@firma-sued.de',from:'yusuf@email.de',subject:'Arbeit in Ihrer Firma',salutation:salutationMale('Schmidt'),name:'Yusuf Arslan',
   body:['ich möchte gern bei Ihnen arbeiten.','Ich habe ein {{1}} bei einer Firma gemacht.','Dort habe ich viel {{2}} gesammelt.','Nach meiner Ausbildung habe ich mein {{3}} bekommen.'],
   blanks:[internship(),experience('Abteilung'),diploma()]
  })
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
  id:'bewerbung-email-auswahl-v3',
  title:'E-Mails – Wörter auswählen',
  instruction:'Klicke auf jede Lücke und wähle die passende Antwort aus drei Möglichkeiten.',
  kind:'email-choice-blanks',icon:'📧',emoji:'📧',emailLayout:true,
  items:build(),
  spVocabularySource:'t2-learned-only',
  spEmailSalutationAndClosingGaps:true
 };
 delete replacement.intro;delete replacement.sections;delete replacement.audio;delete replacement.audioFile;delete replacement.formFields;delete replacement.scrambledHelp;
 theme.tasks.splice(slot.index,1,replacement);
 theme.contentRevision=String(theme.contentRevision||'')+'-visible-task10-email-choice-v3-ten-emails';
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
window.L8T2Task10Final20260903={apply,build,visibleTask10,version:3};
})();
