(function(){
'use strict';
if(window.__SP_L8T3_LISTENING_CONTENT_20260903_V2)return;
window.__SP_L8T3_LISTENING_CONTENT_20260903_V2=true;

function themeOf(all){return all?.[3]||all?.['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null)}
const C=(prompt,options,answer)=>({type:'choice',prompt,options,answer});
const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
const FILES=[
 'l8t3_a12_dialog_01_sara.mp3',
 'l8t3_a12_dialog_02_karim.mp3',
 'l8t3_a12_dialog_03_nina.mp3',
 'l8t3_a12_dialog_04_amir.mp3',
 'l8t3_a12_dialog_05_elena.mp3'
];

const DIALOGUES=[
 {
  title:'Dialog 1 · Sara',
  audio:'Nina: Sara, wo hast du früher gearbeitet? Sara: Früher war ich Kellnerin in einem kleinen Café. Das Team war sehr nett und ich hatte viel Spaß. Ich hatte dort nicht so viel Stress. Nina: Und heute? Sara: Heute arbeite ich in einem großen Restaurant. Ich verdiene mehr, aber wir haben sehr viele Gäste. Nina: Hast du viel Stress? Sara: Ja, oft. Ich habe auch weniger Zeit für meine Kollegen. Nina: Welche Arbeit gefällt dir mehr? Sara: Die Arbeit im Café gefällt mir mehr.',
  qs:[
   C('Was war früher gut?',['Sara hatte mehr Geld.','Sara hatte nicht so viel Stress.','Sara hatte mehr Gäste.'],'Sara hatte nicht so viel Stress.'),
   C('Was ist heute gut?',['Sara hat mehr Verdienst.','Sara hat mehr Zeit.','Sara hat weniger Arbeit.'],'Sara hat mehr Verdienst.'),
   C('Welche Arbeit gefällt Sara mehr?',['die Arbeit im Restaurant','die Arbeit im Café','beide gleich'],'die Arbeit im Café')
  ]
 },
 {
  title:'Dialog 2 · Karim',
  audio:'Mila: Karim, wie war dein erster Job? Karim: Ich war Arbeiter in einer kleinen Firma. Ich hatte wenig Berufserfahrung und die Arbeit war oft schwer. Mila: Hattest du viel Stress? Karim: Manchmal. Aber meine Kollegen waren toll und wir hatten viel Spaß zusammen. Mila: Und heute? Karim: Heute arbeite ich in einem großen Büro. Die Arbeit ist einfach und ich habe wenig Stress. Mila: Gefällt dir das? Karim: Ja und nein. Die Arbeit ist einfach, aber manchmal ist sie langweilig. Meine alten Kollegen fehlen mir. Ich möchte sie gern wieder sehen.',
  qs:[
   C('Was war früher das Problem?',['Karim hatte wenig Erfahrung.','Karim hatte keine Kollegen.','Die Arbeit war zu einfach.'],'Karim hatte wenig Erfahrung.'),
   C('Was war früher gut?',['Karim hatte wenig Arbeit.','Karim hatte viel Spaß.','Karim arbeitete allein.'],'Karim hatte viel Spaß.'),
   C('Was möchte Karim heute?',['Er möchte mehr Stress.','Er möchte allein arbeiten.','Er möchte seine alten Kollegen wieder sehen.'],'Er möchte seine alten Kollegen wieder sehen.')
  ]
 },
 {
  title:'Dialog 3 · Nina',
  audio:'Omar: Nina, was war dein erster Job? Nina: Früher war ich Arbeiterin in einer kleinen Firma. Omar: Wie war die Arbeit? Nina: Gut. Die Arbeit war einfach und mein Chef war freundlich. Omar: Warum arbeitest du heute nicht mehr dort? Nina: Ich wollte einen anderen Beruf lernen. Ich wollte Köchin werden. Dann habe ich eine Ausbildung gemacht. Omar: Und heute? Nina: Heute bin ich Köchin in einem Restaurant. Die Arbeit ist manchmal stressig, aber sehr interessant. Omar: Welche Arbeit war gut? Nina: Die alte und die neue Arbeit waren gut. Aber Kochen macht mir mehr Spaß.',
  qs:[
   C('Warum arbeitet Nina heute nicht mehr in der alten Firma?',['Der Chef war schlecht.','Die Arbeit war zu schwer.','Sie möchte einen anderen Beruf lernen.'],'Sie möchte einen anderen Beruf lernen.'),
   C('Wie ist ihre Arbeit heute?',['langweilig und einfach','nicht langweilig, aber auch nicht einfach','langweilig und schwer'],'nicht langweilig, aber auch nicht einfach'),
   C('Welche Arbeit findet Nina gut?',['nur die alte Arbeit','nur die neue Arbeit','die alte und die neue Arbeit'],'die alte und die neue Arbeit')
  ]
 },
 {
  title:'Dialog 4 · Amir',
  audio:'Lea: Amir, wie war deine Arbeit vor zwei Jahren? Amir: Ich war in einem großen Büro. Wir hatten viele Kollegen und mein Chef war sehr professionell. Lea: War alles gut? Amir: Nein. Wir hatten oft sehr viel Arbeit und wenig Zeit. Lea: Und heute? Amir: Heute arbeite ich in einem kleinen Büro. Wir haben weniger Arbeit und ich habe mehr Zeit. Lea: Das klingt gut. Amir: Ja, aber ich habe nur zwei Kollegen. Manchmal arbeite ich fast allein. Das finde ich nicht so schön.',
  qs:[
   C('Was war früher gut?',['Der Chef war gut.','Amir hatte wenig Arbeit.','Amir arbeitete allein.'],'Der Chef war gut.'),
   C('Was ist heute besser?',['Amir hat nicht wenig Zeit.','Amir hat mehr Stress.','Amir hat mehr Arbeit.'],'Amir hat nicht wenig Zeit.'),
   C('Was findet Amir heute nicht so gut?',['Er hat einen strengen Chef.','Er hat zu viele Kollegen.','Er hat nur wenige Kollegen.'],'Er hat nur wenige Kollegen.')
  ]
 },
 {
  title:'Dialog 5 · Elena',
  audio:'Paul: Elena, wo war dein erster Job? Elena: In einem kleinen Restaurant. Ich war 18 und hatte noch wenig Berufserfahrung. Paul: Wie war die Arbeit? Elena: Am Anfang war vieles neu. Meine Kollegin hat mir viel gezeigt. Das Team war sehr nett und wir hatten viel Spaß zusammen. Paul: Und heute? Elena: Heute arbeite ich in einem großen Hotelrestaurant. Ich habe viel Berufserfahrung und arbeite sehr professionell. Paul: Gefällt dir die Arbeit? Elena: Ja. Die Arbeit ist interessant und ich verdiene mehr Geld. Aber früher hatte ich mit meinem Team mehr Spaß.',
  qs:[
   C('Wer hat Elena im ersten Job geholfen?',['der Chef','ihre Kollegin','ein Gast'],'ihre Kollegin'),
   C('Was ist heute besser?',['Elena hat keine Berufserfahrung.','Sie hat mehr Erfahrung und verdient mehr Geld.','Sie arbeitet weniger.'],'Sie hat mehr Erfahrung und verdient mehr Geld.'),
   C('Was war früher besser?',['Sie hatte mehr Erfahrung.','Sie verdiente mehr Geld.','Sie hatte mehr Spaß.'],'Sie hatte mehr Spaß.')
  ]
 }
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>String(t?.id)==='hoeren-arbeit-frueher-heute-fuenf-dialoge');
 if(!task)return theme;
 const items=[];
 const dialogues=[];
 DIALOGUES.forEach((d,index)=>{
  const start=items.length;
  d.qs.forEach(q=>items.push({...q,context:d.title,audio:d.audio,audioFile:AUDIO_BASE+FILES[index]}));
  dialogues.push({title:d.title,audio:d.audio,audioFile:AUDIO_BASE+FILES[index],fileName:FILES[index],questionIndexes:[start,start+1,start+2]});
 });
 task.items=items;
 task.dialogues=dialogues;
 task.spL8T3ListeningGroups=true;
 task.title='Arbeit früher und heute: 5 Hördialoge';
 task.icon='🎧';task.emoji='🎧';
 task.instruction='Höre einen Dialog und beantworte alle drei Fragen auf derselben Seite.';
 task.intro='Höre genau: Früher und heute sind nicht immer besser oder schlechter.';
 task.spTeacherReview={transcripts:DIALOGUES.map(d=>({title:d.title,transcript:d.audio,questions:d.qs.map(q=>({type:'3er-Auswahl',prompt:q.prompt,options:q.options.slice(),answer:q.answer}))}))};
 task.contentNote='Transkripte sind als Lehrkraft-Reviewdaten hinterlegt und werden Lernenden nicht automatisch angezeigt.';
 task.contentRevision=String(task.contentRevision||'')+'-listening-content-20260903-v2-bunny';
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T3_LISTENING_CONTENT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T3 A12 Hörinhalt konnte nicht aktualisiert werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_LISTENING_CONTENT_READY;
window.L8T3ListeningContent20260903={apply,dialogues:DIALOGUES,fileNames:FILES.slice(),version:2};
})();
