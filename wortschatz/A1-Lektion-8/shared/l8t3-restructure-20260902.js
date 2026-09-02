(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902)return;
window.__SP_L8T3_RESTRUCTURE_20260902=true;

const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const C=(prompt,options,answer,context='',hint='')=>({type:'choice',prompt,options,answer,context,hint});

function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}

function seinTask(){
 return {
  id:'sein-praeteritum-konjugieren',
  title:'sein im Präteritum: war',
  kind:'input',icon:'🔤',emoji:'🔤',
  instruction:'Konjugiere sein im Präteritum. Schreibe die richtige Form.',
  intro:'sein im Präteritum: ich war · du warst · er/sie/es war · wir waren · ihr wart · sie/Sie waren',
  items:[
   I('ich ___','war','','Form von sein im Präteritum'),
   I('du ___','warst','','Form von sein im Präteritum'),
   I('er / sie / es ___','war','','Form von sein im Präteritum'),
   I('wir ___','waren','','Form von sein im Präteritum'),
   I('ihr ___','wart','','Form von sein im Präteritum'),
   I('sie / Sie ___','waren','','Form von sein im Präteritum')
  ]
 };
}

function habenTask(){
 return {
  id:'haben-praeteritum-konjugieren',
  title:'haben im Präteritum: hatte',
  kind:'input',icon:'🔤',emoji:'🔤',
  instruction:'Konjugiere haben im Präteritum. Schreibe die richtige Form.',
  intro:'haben im Präteritum: ich hatte · du hattest · er/sie/es hatte · wir hatten · ihr hattet · sie/Sie hatten',
  items:[
   I('ich ___','hatte','','Form von haben im Präteritum'),
   I('du ___','hattest','','Form von haben im Präteritum'),
   I('er / sie / es ___','hatte','','Form von haben im Präteritum'),
   I('wir ___','hatten','','Form von haben im Präteritum'),
   I('ihr ___','hattet','','Form von haben im Präteritum'),
   I('sie / Sie ___','hatten','','Form von haben im Präteritum')
  ]
 };
}

function contextTask(){
 return {
  id:'sein-haben-fuenf-texte',
  title:'Früher oder heute? Fünf Texte',
  kind:'choice',icon:'📖',emoji:'📖',
  instruction:'Lies fünf kurze Texte und setze die passende Form von sein oder haben ein.',
  intro:'Achte auf die Zeit: früher / damals / gestern → Präteritum. heute / jetzt → Präsens. Achte auch auf die Bedeutung: Mit sein beschreibst du Personen oder Situationen; mit haben nennst du z. B. Stress, Zeit, Spaß oder Erfahrung.',
  items:[
   C('Text 1: Was passt in die Lücke?',['war','hatte','ist','hat'],'war','Früher arbeitete Maria in einem großen Restaurant. Die Arbeit ___ sehr stressig. Heute arbeitet sie in einem kleinen Café und die Arbeit ist ruhig.','Früher + Beschreibung der Arbeit → sein im Präteritum.'),
   C('Text 2: Was passt in die Lücke?',['hatte','war','habe','bin'],'hatte','Mein erster Job war in einer Bäckerei. Ich war neu und ich ___ noch keine Berufserfahrung. Heute habe ich schon viel Erfahrung.','Früher + Berufserfahrung haben → hatte.'),
   C('Text 3: Was passt in die Lücke?',['habe','bin','hatte','war'],'habe','Heute arbeite ich in einem Café. Mein Team ist nett und ich ___ viel Spaß bei der Arbeit. Früher hatte ich oft Stress.','Heute + Spaß haben → habe.'),
   C('Text 4: Was passt in die Lücke?',['war','hatte','bin','habe'],'war','Vor zwei Jahren ___ ich Kellnerin in einem Restaurant. Heute bin ich Köchin und arbeite in einer Kantine.','Vor zwei Jahren + Beruf/Person → sein im Präteritum.'),
   C('Text 5: Was passt in die Lücke?',['ist','hat','war','hatte'],'ist','Paul arbeitet jetzt in einem Architekturbüro. Sein Chef ___ sehr professionell und das Team ist freundlich. Früher war sein Chef oft unfreundlich.','Jetzt + Beschreibung des Chefs → sein im Präsens.')
  ]
 };
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=[...theme.tasks];
 const keep1=old[0]||null;
 const keep5=old[4]||null;
 const old12=old[11]||null;
 const exam=old.find(t=>t?.exam)||null;
 const end=[];
 if(old12)end.push(old12);
 if(exam&&exam!==old12)end.push(exam);
 const next=[keep1,seinTask(),habenTask(),contextTask(),keep5,...end].filter(Boolean);
 const seen=new Set();
 theme.tasks=next.filter(task=>{const key=String(task?.id||'');if(!key)return true;if(seen.has(key))return false;seen.add(key);return true});
 theme.title='Meine Arbeit früher';
 theme.subtitle='sein und haben im Präteritum konjugieren und aus dem Kontext zwischen früher und heute unterscheiden.';
 theme.contentRevision='l8t3-restructure-20260902-v1';
 return theme;
}

window.L8_T3_RESTRUCTURE_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T3_RESTRUCTURE_READY;
window.L8T3Restructure20260902={apply};
})();
