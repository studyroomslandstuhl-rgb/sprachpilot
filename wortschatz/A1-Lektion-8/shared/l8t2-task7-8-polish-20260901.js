(function(){
'use strict';
if(window.__SP_L8T2_TASK7_8_POLISH_20260901)return;
window.__SP_L8T2_TASK7_8_POLISH_20260901=true;

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;

 const listen=theme.tasks.find(t=>t?.id==='bewerbung-hoeren-gesamt');
 if(listen){
  listen.acceptDigitWords=true;
 }

 const email=theme.tasks.find(t=>t?.id==='bewerbung-lueckentext');
 if(email){
  email.title='Bewerbung per E-Mail – Lückentext';
  email.instruction='Lies die E-Mail und ergänze die fehlenden Wörter und Zeitangaben.';
  email.emailLayout=true;
  email.items=[{
   type:'dialog-blanks',
   lines:[
    'An: bewerbung@hotel-rheinblick.de',
    'Von: aylin.yilmaz@email.de',
    'Betreff: Bewerbung als Köchin',
    '',
    '{{0}} Frau Berger,',
    '',
    'ich möchte mich um die {{1}} als Köchin in Ihrem Restaurant bewerben.',
    '',
    '{{2}} drei Jahren habe ich meine {{3}} als Köchin angefangen. Die Ausbildung hat zwei Jahre {{4}}.',
    '{{5}} einem Jahr arbeite ich in einem Café. Dort habe ich viel {{6}} gesammelt.',
    '',
    'Im Anhang finden Sie meinen {{7}}, mein {{8}} und mein {{9}}.',
    'Ich freue mich über eine Einladung zu einem {{10}}.',
    '',
    '{{11}}',
    'Aylin Yilmaz'
   ],
   blanks:[
    {answers:['Sehr geehrte','Sehr geehrte Frau Berger']},
    {answers:['Stelle']},
    {answers:['Vor']},
    {answers:['Ausbildung']},
    {answers:['gedauert']},
    {answers:['Seit']},
    {answers:['Berufserfahrung']},
    {answers:['Lebenslauf']},
    {answers:['Anschreiben']},
    {answers:['Zeugnis']},
    {answers:['Bewerbungsgespräch','Vorstellungsgespräch']},
    {answers:['Mit freundlichen Grüßen','Mit freundlichen Gruessen']}
   ]
  }];
 }

 theme.contentRevision='l8t2-task7-8-polish-20260901-v1';
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