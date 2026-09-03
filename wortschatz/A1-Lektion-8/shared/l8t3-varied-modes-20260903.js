(function(){
'use strict';
if(window.__SP_L8T3_VARIED_MODES_20260903_V1)return;
window.__SP_L8T3_VARIED_MODES_20260903_V1=true;
function themeOf(all){return all?.[3]||all?.['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null)}
const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

function duelTask(){
 const rows=[
  ['Ich ___ viel Spaß.','haben','hatte',['hatte','war','hatten']],
  ['Er ___ heute sehr spät.','sein','war',['war','hatte','waren']],
  ['Wir ___ keine Zeit.','haben','hatten',['hatten','waren','hatte']],
  ['Du ___ gestern sehr müde.','sein','warst',['warst','hattest','wart']],
  ['Meine Kollegin ___ viel Berufserfahrung.','haben','hatte',['hatte','war','hatten']],
  ['Ihr ___ ein gutes Team.','sein','wart',['wart','hattet','waren']],
  ['Ihr ___ bei der Arbeit viel Stress.','haben','hattet',['hattet','wart','hatten']],
  ['Der Chef ___ sehr professionell.','sein','war',['war','hatte','waren']],
  ['Die Kollegen ___ wenig Zeit für Pausen.','haben','hatten',['hatten','waren','hattet']],
  ['Sie ___ immer sehr nett.','sein','waren',['waren','hatten','war']],
  ['Ich ___ früher Kellnerin.','sein','war',['war','hatte','waren']],
  ['Du ___ damals keinen Spaß bei der Arbeit.','haben','hattest',['hattest','warst','hatte']],
  ['Das Café ___ sehr klein.','sein','war',['war','hatte','waren']],
  ['Wir ___ viele nette Kollegen.','haben','hatten',['hatten','waren','hatte']],
  ['Sie ___ früher Arbeiterin.','sein','war',['war','hatte','waren']],
  ['Ihr ___ noch keine Berufserfahrung.','haben','hattet',['hattet','wart','hatten']],
  ['Meine Arbeit ___ einfach.','sein','war',['war','hatte','waren']],
  ['Die Arbeitstage ___ sehr lang.','sein','waren',['waren','hatten','war']],
  ['Meine Kollegen ___ schon viel Erfahrung.','haben','hatten',['hatten','waren','hattet']],
  ['Sie ___ einen sehr guten Chef.','haben','hatten',['hatten','waren','hatte']]
 ];
 return {
  id:'sein-haben-form-duell-v1',title:'sein oder haben? Form-Duell',kind:'verb-form-duel',icon:'⚔️',emoji:'⚔️',spL8T3VerbFormDuel:true,
  instruction:'1. Wähle sein oder haben. 2. Wähle die richtige Präteritumform.',
  intro:'Achte zuerst auf die Bedeutung und dann auf das Subjekt.',
  items:rows.map(([sentence,verb,answer,forms])=>({sentence,verb,answer:[answer],verbOptions:shuffle(['sein','haben']),formOptions:shuffle(forms)}))
 };
}

const PROFILES=[
 {id:'mariam',name:'Mariam',title:'Mariam · Bäckerei',text:'Mein erster Job war in einer kleinen Bäckerei. Ich war 19 Jahre alt und hatte noch keine Berufserfahrung. Ich habe morgens sehr früh angefangen und habe Brot und Kuchen verkauft. Meine Chefin war freundlich, aber die Arbeit war manchmal stressig. Am Anfang habe ich viele Fragen gestellt. Nach einigen Wochen war die Arbeit für mich einfacher.'},
 {id:'omar',name:'Omar',title:'Omar · Restaurant',text:'Mein erster Job war in einem großen Restaurant. Ich war Küchenhilfe und habe dem Koch geholfen. Das Team war groß und wir hatten am Abend oft viel Arbeit. Mein Chef war professionell und hat mir alles genau gezeigt. Ich hatte wenig Erfahrung, aber die Kollegen waren nett. Nach drei Monaten habe ich schon viele Aufgaben allein gemacht.'},
 {id:'elena',name:'Elena',title:'Elena · Café',text:'Mit 20 Jahren war mein erster Job in einem Café. Ich habe dort als Kellnerin gearbeitet. Das Café war klein und hatte nur zehn Tische. Ich habe Bestellungen aufgenommen, Kaffee gebracht und die Tische sauber gemacht. Die Gäste waren meistens freundlich. Manchmal hatte ich Stress, aber ich hatte auch viel Spaß mit meiner Kollegin.'},
 {id:'pavel',name:'Pavel',title:'Pavel · Firma',text:'Mein erster Job war in einer kleinen Firma. Ich war Arbeiter und habe dort jeden Tag von sieben bis fünfzehn Uhr gearbeitet. Die Arbeit war nicht schwer, aber sie war oft langweilig. Wir hatten jeden Morgen eine kurze Besprechung. Mein Team war nett und mein Kollege Viktor hat mir viel geholfen. Deshalb hatte ich am Anfang wenig Stress.'},
 {id:'sofia',name:'Sofia',title:'Sofia · Hotel',text:'Nach meiner Ausbildung war mein erster Job in einem Hotel. Ich habe an der Rezeption gearbeitet. Das Hotel war modern und die Gäste waren aus vielen Ländern. Ich hatte oft Kontakt mit Menschen und habe viele Fragen beantwortet. Meine Arbeit war interessant, aber manchmal hatte ich wenig Zeit. Meine Kolleginnen waren sehr erfahren und haben mir oft geholfen.'}
];
function detectiveTask(){
 const statements=[
  ['Wer war 19 und hatte noch keine Berufserfahrung?','mariam'],
  ['Wer hat Brot und Kuchen verkauft?','mariam'],
  ['Bei wem wurde die Arbeit nach einigen Wochen einfacher?','mariam'],
  ['Wer war Küchenhilfe?','omar'],
  ['Wessen Chef war professionell und hat alles genau gezeigt?','omar'],
  ['Wer konnte nach drei Monaten viele Aufgaben allein machen?','omar'],
  ['Wer hat in einem kleinen Café mit zehn Tischen gearbeitet?','elena'],
  ['Wer hat Bestellungen aufgenommen und Kaffee gebracht?','elena'],
  ['Wer hatte viel Spaß mit einer Kollegin?','elena'],
  ['Wer hat jeden Tag von sieben bis fünfzehn Uhr gearbeitet?','pavel'],
  ['Wessen Arbeit war nicht schwer, aber oft langweilig?','pavel'],
  ['Wer hatte wenig Stress, weil ein Kollege geholfen hat?','pavel'],
  ['Wer hat an einer Rezeption gearbeitet?','sofia'],
  ['Wer hatte Kontakt mit Gästen aus vielen Ländern?','sofia'],
  ['Wem haben erfahrene Kolleginnen oft geholfen?','sofia']
 ];
 return {
  id:'lesen-erster-job-detektiv-v1',title:'Lese-Detektiv: Wer ist das?',kind:'reading-detective',icon:'🕵️',emoji:'🕵️',spL8T3ReadingDetective:true,
  instruction:'Lies die fünf Texte. Ordne danach jede Aussage der richtigen Person zu.',
  profiles:PROFILES.map(p=>({...p})),
  items:statements.map(([prompt,answer])=>({prompt,answer:[answer],options:shuffle(PROFILES.map(p=>p.id))}))
 };
}

const LISTENING_REVIEW=[
 {title:'Dialog 1 · Sara',transcript:'Nina: Sara, wo hast du früher gearbeitet? Sara: Früher war ich Kellnerin in einem großen Restaurant. Wir hatten am Abend oft viel Stress. Heute arbeite ich in einem kleinen Café. Das Team ist kleiner und ich habe mehr Zeit für die Gäste. Nina: Macht dir die Arbeit heute mehr Spaß? Sara: Ja, viel mehr.',questions:[
  {type:'Richtig/Falsch',prompt:'Sara hatte früher am Abend oft Stress.',answer:'Richtig'},
  {type:'3er-Auswahl',prompt:'Wo arbeitet Sara heute?',options:['in einem kleinen Café','in einem Hotel','in einer Bäckerei'],answer:'in einem kleinen Café'},
  {type:'offen',prompt:'Wie findet Sara ihre Arbeit heute?',answers:['Sie macht ihr mehr Spaß.','mehr Spaß','viel mehr Spaß']}
 ]},
 {title:'Dialog 2 · Karim',transcript:'Mila: Karim, wie war dein erster Job? Karim: Mein erster Job war in einer Werkstatt. Ich hatte noch wenig Erfahrung und mein Chef war sehr streng. Heute arbeite ich in einer anderen Firma. Mein Chef ist freundlich und meine Kollegen helfen mir oft. Mila: Hast du heute weniger Stress? Karim: Ja, meistens.',questions:[
  {type:'Richtig/Falsch',prompt:'Karims erster Chef war freundlich.',answer:'Falsch'},
  {type:'3er-Auswahl',prompt:'Was ist heute anders?',options:['Die Kollegen helfen Karim.','Karim arbeitet allein.','Karim hat keinen Chef.'],answer:'Die Kollegen helfen Karim.'},
  {type:'offen',prompt:'Wo war Karims erster Job?',answers:['in einer Werkstatt','Werkstatt']}
 ]},
 {title:'Dialog 3 · Nina',transcript:'Omar: Nina, du bist doch Köchin. Warst du schon immer Köchin? Nina: Nein. Früher war ich Arbeiterin in einer großen Firma. Die Arbeit war einfach, aber ich hatte keinen Spaß. Danach habe ich eine Ausbildung gemacht. Heute bin ich Köchin in einem Restaurant und meine Arbeit ist sehr interessant. Omar: Hast du heute viel Berufserfahrung? Nina: Ja, inzwischen schon.',questions:[
  {type:'Richtig/Falsch',prompt:'Nina war früher Arbeiterin.',answer:'Richtig'},
  {type:'3er-Auswahl',prompt:'Warum hat Nina ihre frühere Arbeit nicht gemocht?',options:['Sie hatte keinen Spaß.','Die Arbeit war zu schwer.','Sie hatte keine Kollegen.'],answer:'Sie hatte keinen Spaß.'},
  {type:'offen',prompt:'Was ist Nina heute von Beruf?',answers:['Köchin','eine Köchin']}
 ]},
 {title:'Dialog 4 · Amir',transcript:'Lea: Amir, wie war deine Arbeit vor zwei Jahren? Amir: Damals war ich in einem kleinen Büro. Das Team war nett, aber wir hatten sehr wenig Zeit und oft Stress. Heute arbeite ich in einem größeren Büro. Wir haben mehr Kollegen und die Aufgaben sind besser verteilt. Lea: Ist die Arbeit heute einfacher? Amir: Ja, viel einfacher.',questions:[
  {type:'Richtig/Falsch',prompt:'Amirs Team war vor zwei Jahren unfreundlich.',answer:'Falsch'},
  {type:'3er-Auswahl',prompt:'Warum ist die Arbeit heute einfacher?',options:['Es gibt mehr Kollegen.','Amir arbeitet nicht mehr.','Es gibt keine Aufgaben.'],answer:'Es gibt mehr Kollegen.'},
  {type:'offen',prompt:'Wie war das Team früher?',answers:['nett','Das Team war nett.']}
 ]},
 {title:'Dialog 5 · Elena',transcript:'Paul: Elena, hattest du in deinem ersten Job viel Berufserfahrung? Elena: Nein, gar nicht. Ich war 18 und habe in einem Café gearbeitet. Meine Kollegin war sehr erfahren und hat mir viel gezeigt. Heute arbeite ich in einem Restaurant. Ich habe jetzt vier Jahre Berufserfahrung und arbeite oft allein. Paul: Hast du heute noch viel Stress? Elena: Manchmal, aber nicht mehr so oft.',questions:[
  {type:'Richtig/Falsch',prompt:'Elena hatte im ersten Job viel Berufserfahrung.',answer:'Falsch'},
  {type:'3er-Auswahl',prompt:'Wer hat Elena im ersten Job viel gezeigt?',options:['ihre Kollegin','ihr Bruder','ein Gast'],answer:'ihre Kollegin'},
  {type:'offen',prompt:'Wie viel Berufserfahrung hat Elena heute?',answers:['vier Jahre','4 Jahre','vier Jahre Berufserfahrung']}
 ]}
];
function enrichListening(theme){
 const task=(theme.tasks||[]).find(t=>String(t?.id)==='hoeren-arbeit-frueher-heute-fuenf-dialoge');
 if(!task)return;
 task.spTeacherReview={transcripts:LISTENING_REVIEW.map(x=>({title:x.title,transcript:x.transcript,questions:x.questions.map(q=>({...q}))}))};
 task.contentNote='Transkripte sind als Lehrkraft-Reviewdaten hinterlegt und werden Lernenden nicht automatisch angezeigt.';
}
function replaceById(theme,ids,next){const i=theme.tasks.findIndex(t=>ids.includes(String(t?.id||'')));if(i>=0)theme.tasks.splice(i,1,next)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 replaceById(theme,['war-oder-hatte-richtige-form','sein-haben-form-duell-v1'],duelTask());
 replaceById(theme,['lesen-erster-job-fuenf-texte','lesen-erster-job-detektiv-v1'],detectiveTask());
 enrichListening(theme);
 theme.contentRevision=String(theme.contentRevision||'')+'-varied-modes-20260903-v1';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_VARIED_MODES_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T3 abwechslungsreiche Modi',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_VARIED_MODES_READY;
window.L8T3VariedModes20260903={apply,duelTask,detectiveTask,listeningReview:LISTENING_REVIEW,version:1};
})();
