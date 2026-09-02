(function(){
'use strict';
if(window.__SP_L8T3_EXTRA_TASKS_20260902_V1)return;
window.__SP_L8T3_EXTRA_TASKS_20260902_V1=true;

const C=(prompt,options,answer,context='',hint='')=>({type:'choice',prompt,options,answer,context,hint});
const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const F=(prompt,starter,min,context)=>({type:'free',prompt,starter,min,context});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}

function readingTask(){
 const texts=[
  {
   title:'Text 1 · Mariams erster Job',
   text:'Mein erster Job war in einer kleinen Bäckerei. Ich war 19 Jahre alt und hatte noch keine Berufserfahrung. Ich habe morgens sehr früh angefangen und habe Brot und Kuchen verkauft. Meine Chefin war freundlich, aber die Arbeit war manchmal stressig. Am Anfang habe ich viele Fragen gestellt. Nach einigen Wochen war die Arbeit für mich einfacher.',
   qs:[
    C('Mariam hatte am Anfang schon viel Berufserfahrung.',['Richtig','Falsch'],'Falsch'),
    C('Wo war Mariams erster Job?',['in einer Bäckerei','in einem Restaurant','in einem Büro'],'in einer Bäckerei'),
    C('Wie war die Arbeit am Anfang?',['manchmal stressig','immer langweilig','sehr kurz'],'manchmal stressig')
   ]
  },
  {
   title:'Text 2 · Omars erster Job',
   text:'Mein erster Job war in einem großen Restaurant. Ich war Küchenhilfe und habe dem Koch geholfen. Das Team war groß und wir hatten am Abend oft viel Arbeit. Mein Chef war professionell und hat mir alles genau gezeigt. Ich hatte wenig Erfahrung, aber die Kollegen waren nett. Nach drei Monaten habe ich schon viele Aufgaben allein gemacht.',
   qs:[
    C('Omar hat als Küchenhilfe gearbeitet.',['Richtig','Falsch'],'Richtig'),
    C('Wann hatten sie besonders viel Arbeit?',['am Abend','am Morgen','nur am Wochenende'],'am Abend'),
    C('Wie war Omars Chef?',['professionell','unfreundlich','oft krank'],'professionell')
   ]
  },
  {
   title:'Text 3 · Elenas erster Job',
   text:'Mit 20 Jahren war mein erster Job in einem Café. Ich habe dort als Kellnerin gearbeitet. Das Café war klein und hatte nur zehn Tische. Ich habe Bestellungen aufgenommen, Kaffee gebracht und die Tische sauber gemacht. Die Gäste waren meistens freundlich. Manchmal hatte ich Stress, aber ich hatte auch viel Spaß mit meiner Kollegin.',
   qs:[
    C('Das Café hatte sehr viele Tische.',['Richtig','Falsch'],'Falsch'),
    C('Was hat Elena als Kellnerin gemacht?',['Bestellungen aufgenommen','Häuser geplant','Autos repariert'],'Bestellungen aufgenommen'),
    C('Mit wem hatte Elena viel Spaß?',['mit ihrer Kollegin','mit ihrem Lehrer','mit ihrer Nachbarin'],'mit ihrer Kollegin')
   ]
  },
  {
   title:'Text 4 · Pavels erster Job',
   text:'Mein erster Job war in einer kleinen Firma. Ich war Arbeiter und habe dort jeden Tag von sieben bis fünfzehn Uhr gearbeitet. Die Arbeit war nicht schwer, aber sie war oft langweilig. Wir hatten jeden Morgen eine kurze Besprechung. Mein Team war nett und mein Kollege Viktor hat mir viel geholfen. Deshalb hatte ich am Anfang wenig Stress.',
   qs:[
    C('Pavels Arbeit war sehr schwer.',['Richtig','Falsch'],'Falsch'),
    C('Wann hat Pavel gearbeitet?',['von sieben bis fünfzehn Uhr','nur nachts','von zwölf bis zwanzig Uhr'],'von sieben bis fünfzehn Uhr'),
    C('Warum hatte Pavel am Anfang wenig Stress?',['Ein Kollege hat ihm geholfen.','Er hatte jeden Tag frei.','Er hat allein gearbeitet.'],'Ein Kollege hat ihm geholfen.')
   ]
  },
  {
   title:'Text 5 · Sofias erster Job',
   text:'Nach meiner Ausbildung war mein erster Job in einem Hotel. Ich habe an der Rezeption gearbeitet. Das Hotel war modern und die Gäste waren aus vielen Ländern. Ich hatte oft Kontakt mit Menschen und habe viele Fragen beantwortet. Meine Arbeit war interessant, aber manchmal hatte ich wenig Zeit. Meine Kolleginnen waren sehr erfahren und haben mir oft geholfen.',
   qs:[
    C('Sofia hat an der Rezeption gearbeitet.',['Richtig','Falsch'],'Richtig'),
    C('Was war an Sofias Arbeit manchmal schwierig?',['Sie hatte wenig Zeit.','Es gab keine Gäste.','Das Hotel war geschlossen.'],'Sie hatte wenig Zeit.'),
    C('Wer hat Sofia oft geholfen?',['ihre Kolleginnen','die Gäste','ihre Familie'],'ihre Kolleginnen')
   ]
  }
 ];
 const items=[];
 texts.forEach(t=>t.qs.forEach(q=>items.push({...q,context:`${t.title}\n\n${t.text}`})));
 return {id:'lesen-erster-job-fuenf-texte',title:'Erster Job: 5 Lesetexte',kind:'reading',icon:'📚',emoji:'📚',instruction:'Lies den Text und beantworte die Fragen.',intro:'Du liest fünf kurze Texte über den ersten Job. Es gibt Richtig/Falsch- und A/B/C-Fragen.',items};
}

function listeningTask(){
 const dialogues=[
  {
   title:'Dialog 1 · Sara',
   audio:'Nina: Sara, wo hast du früher gearbeitet? Sara: Früher war ich Kellnerin in einem großen Restaurant. Wir hatten am Abend oft viel Stress. Heute arbeite ich in einem kleinen Café. Das Team ist kleiner und ich habe mehr Zeit für die Gäste. Nina: Macht dir die Arbeit heute mehr Spaß? Sara: Ja, viel mehr.',
   qs:[
    C('Sara hatte früher am Abend oft Stress.',['Richtig','Falsch'],'Richtig'),
    C('Wo arbeitet Sara heute?',['in einem kleinen Café','in einem Hotel','in einer Bäckerei'],'in einem kleinen Café'),
    I('Wie findet Sara ihre Arbeit heute?',['Sie macht ihr mehr Spaß.','mehr Spaß','viel mehr Spaß'],'','Antworte kurz, zum Beispiel mit zwei oder drei Wörtern.')
   ]
  },
  {
   title:'Dialog 2 · Karim',
   audio:'Mila: Karim, wie war dein erster Job? Karim: Mein erster Job war in einer Werkstatt. Ich hatte noch wenig Erfahrung und mein Chef war sehr streng. Heute arbeite ich in einer anderen Firma. Mein Chef ist freundlich und meine Kollegen helfen mir oft. Mila: Hast du heute weniger Stress? Karim: Ja, meistens.',
   qs:[
    C('Karims erster Chef war freundlich.',['Richtig','Falsch'],'Falsch'),
    C('Was ist heute anders?',['Die Kollegen helfen Karim.','Karim arbeitet allein.','Karim hat keinen Chef.'],'Die Kollegen helfen Karim.'),
    I('Wo war Karims erster Job?',['in einer Werkstatt','Werkstatt'],'','Antworte mit dem Ort.')
   ]
  },
  {
   title:'Dialog 3 · Nina',
   audio:'Omar: Nina, du bist doch Köchin. Warst du schon immer Köchin? Nina: Nein. Früher war ich Arbeiterin in einer großen Firma. Die Arbeit war einfach, aber ich hatte keinen Spaß. Danach habe ich eine Ausbildung gemacht. Heute bin ich Köchin in einem Restaurant und meine Arbeit ist sehr interessant. Omar: Hast du heute viel Berufserfahrung? Nina: Ja, inzwischen schon.',
   qs:[
    C('Nina war früher Arbeiterin.',['Richtig','Falsch'],'Richtig'),
    C('Warum hat Nina ihre frühere Arbeit nicht gemocht?',['Sie hatte keinen Spaß.','Die Arbeit war zu schwer.','Sie hatte keine Kollegen.'],'Sie hatte keinen Spaß.'),
    I('Was ist Nina heute von Beruf?',['Köchin','eine Köchin'],'','Schreibe nur den Beruf.')
   ]
  },
  {
   title:'Dialog 4 · Amir',
   audio:'Lea: Amir, wie war deine Arbeit vor zwei Jahren? Amir: Damals war ich in einem kleinen Büro. Das Team war nett, aber wir hatten sehr wenig Zeit und oft Stress. Heute arbeite ich in einem größeren Büro. Wir haben mehr Kollegen und die Aufgaben sind besser verteilt. Lea: Ist die Arbeit heute einfacher? Amir: Ja, viel einfacher.',
   qs:[
    C('Amirs Team war vor zwei Jahren unfreundlich.',['Richtig','Falsch'],'Falsch'),
    C('Warum ist die Arbeit heute einfacher?',['Es gibt mehr Kollegen.','Amir arbeitet nicht mehr.','Es gibt keine Aufgaben.'],'Es gibt mehr Kollegen.'),
    I('Wie war das Team früher?',['nett','Das Team war nett.'],'','Antworte kurz.')
   ]
  },
  {
   title:'Dialog 5 · Elena',
   audio:'Paul: Elena, hattest du in deinem ersten Job viel Berufserfahrung? Elena: Nein, gar nicht. Ich war 18 und habe in einem Café gearbeitet. Meine Kollegin war sehr erfahren und hat mir viel gezeigt. Heute arbeite ich in einem Restaurant. Ich habe jetzt vier Jahre Berufserfahrung und arbeite oft allein. Paul: Hast du heute noch viel Stress? Elena: Manchmal, aber nicht mehr so oft.',
   qs:[
    C('Elena hatte im ersten Job viel Berufserfahrung.',['Richtig','Falsch'],'Falsch'),
    C('Wer hat Elena im ersten Job viel gezeigt?',['ihre Kollegin','ihr Bruder','ein Gast'],'ihre Kollegin'),
    I('Wie viel Berufserfahrung hat Elena heute?',['vier Jahre','4 Jahre','vier Jahre Berufserfahrung'],'','Antworte mit der Zeitangabe.')
   ]
  }
 ];
 const items=[];
 dialogues.forEach(d=>d.qs.forEach(q=>items.push({...q,context:d.title,audio:d.audio})));
 return {id:'hoeren-arbeit-frueher-heute-fuenf-dialoge',title:'Arbeit früher und heute: 5 Hördialoge',kind:'listening',icon:'🎧',emoji:'🎧',instruction:'Höre den Dialog und beantworte die Frage.',intro:'Zu jedem Dialog gibt es Richtig/Falsch, A/B/C und eine kurze offene Frage.',items};
}

function rewriteTask(){
 const source='Vor fünf Jahren: Elena ist 24 Jahre alt. Sie wohnt in Homburg. Sie arbeitet als Kellnerin in einem großen Restaurant. Das Restaurant ist sehr voll. Elena hat wenig Berufserfahrung. Ihr Chef ist professionell, aber streng. Elena hat oft Stress, aber sie hat auch viel Spaß mit ihren Kollegen. Nach der Arbeit trifft sie oft ihre Freunde. Am Wochenende besucht sie ihre Familie.';
 return {
  id:'text-vor-fuenf-jahren-umschreiben',title:'Vor fünf Jahren: Text umschreiben',kind:'free',icon:'📝',emoji:'📝',
  instruction:'Schreibe den ganzen Text in der Vergangenheit neu.',
  intro:'Regel: sein und haben → Präteritum. Andere Verben → Perfekt.',
  items:[F('Schreibe den Text noch einmal. Benutze Perfekt und Präteritum.','Vor fünf Jahren war Elena 24 Jahre alt. ',9,source)]
 };
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const ids=new Set(['lesen-erster-job-fuenf-texte','hoeren-arbeit-frueher-heute-fuenf-dialoge','text-vor-fuenf-jahren-umschreiben']);
 const base=theme.tasks.filter(t=>!ids.has(String(t?.id||'')));
 const exam=base.find(t=>t?.exam)||null;
 const normal=base.filter(t=>!t?.exam);
 theme.tasks=[...normal,readingTask(),listeningTask(),rewriteTask(),...(exam?[exam]:[])];
 theme.contentRevision=String(theme.contentRevision||'l8t3')+'-extra3-v1';
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T3_EXTRA_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T3 Zusatzaufgaben konnten nicht angewendet werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_EXTRA_READY;
window.L8T3ExtraTasks20260902={apply,version:1};
})();
