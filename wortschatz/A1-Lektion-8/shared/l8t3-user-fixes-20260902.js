(function(){
'use strict';
if(window.__SP_L8T3_USER_FIXES_20260902_V1)return;window.__SP_L8T3_USER_FIXES_20260902_V1=true;
function themeOf(all){return all?.[3]||all?.['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null)}
const I=(context,scramble,prompt,answer,hint='')=>({type:'context-scramble',context,scramble,prompt,answer:Array.isArray(answer)?answer:[answer],hint});
function contextTask(){
 return {
  id:'wort-im-dialog-buchstaben-v1',title:'Wort im Dialog',kind:'context-scramble',icon:'🧩',emoji:'🧩',spL8T3ContextScramble:true,
  instruction:'Lies den Dialog. Ordne die Buchstaben und ergänze das Wort.',
  items:[
   I('Mia: War dein erster Job leicht?\nOmar: Nein. Am Anfang wusste ich noch nicht viel. Heute kenne ich viele Aufgaben.','R · F · A · H · R · U · N · E · G','Heute habe ich viel ___.',['Erfahrung','Berufserfahrung'],'Denke an etwas, das man durch Arbeit bekommt.'),
   I('Lina: Wo arbeitest du jetzt?\nSara: Ich verkaufe Kaffee, Tee und Kuchen.','F · A · C · É','Ich arbeite in einem kleinen ___.',['Café','Cafe'],'Ein Ort für Kaffee und Kuchen.'),
   I('Paul: Heute sind sehr viele Gäste da. Hast du Pause?\nNina: Nein, ich muss sehr schnell arbeiten.','S · T · R · E · S · S','Heute habe ich viel ___.','Stress','Viel Arbeit + wenig Zeit.'),
   I('Mila: Wer bringt uns das Essen?\nTom: Der Mann dort.','L · E · L · K · N · E · R','Das ist ___.',['der Kellner','Kellner'],'Schreibe den Beruf mit Artikel.'),
   I('Omar: Wer nimmt unsere Bestellung auf?\nLea: Die Frau am Tisch dort.','N · E · K · L · L · E · R · I · N','Das ist ___.',['die Kellnerin','Kellnerin'],'Schreibe den Beruf mit Artikel.'),
   I('Ben: Wo essen wir heute Abend?\nMira: Dort gibt es Vorspeise, Hauptgericht und Dessert.','R · E · S · T · A · U · R · A · N · T','Wir gehen in ein ___.',['Restaurant','das Restaurant'],'Hier bestellt man ein ganzes Essen.'),
   I('Nina: Wer plant das neue Haus?\nAli: Der Mann mit den Bauplänen.','A · R · C · H · I · T · E · K · T','Das ist ___.',['der Architekt','Architekt'],'Schreibe den Beruf mit Artikel.'),
   I('Sara: Wer zeichnet die Räume für das neue Büro?\nMila: Die Frau dort.','A · R · C · H · I · T · E · K · T · I · N','Das ist ___.',['die Architektin','Architektin'],'Schreibe den Beruf mit Artikel.'),
   I('Tom: Kennst du Paul aus der Firma?\nMina: Ja, wir arbeiten jeden Tag zusammen.','K · O · L · L · E · G · E','Paul ist mein ___.',['Kollege','der Kollege'],'Eine Person, mit der man zusammenarbeitet.'),
   I('Lea: Arbeitest du jeden Tag bis 18 Uhr?\nAmir: Fast jeden Tag.','O · F · T','Ich arbeite ___ bis 18 Uhr.','oft','Fast jeden Tag.'),
   I('Mila: Isst du jeden Tag in der Kantine?\nNina: Nein, nur an zwei Tagen in der Woche.','M · A · N · C · H · M · A · L','Ich esse ___ in der Kantine.','manchmal','Nicht immer, aber an einigen Tagen.'),
   I('Ben: Wie lange ist deine Pause?\nOmar: Nur fünf Minuten.','W · E · N · I · G','Ich habe heute ___ Zeit.','wenig','Nicht viel.'),
   I('Sara: Wie arbeitet dein neuer Chef?\nMina: Er erklärt klar, arbeitet genau und bleibt höflich.','P · R · O · F · E · S · S · I · O · N · E · L · L','Er arbeitet sehr ___.','professionell','Gut und passend zum Beruf.'),
   I('Ali: Ist die neue Aufgabe schwer?\nTom: Nein, ich weiß sofort, was ich machen muss.','E · I · N · F · A · C · H','Die Aufgabe ist ___.','einfach','Nicht schwer.'),
   I('Lea: Arbeitest du gern mit deinem Team?\nMira: Ja, wir lachen viel zusammen.','S · P · A · S · S','Wir haben viel ___.',['Spaß','Spass'],'Man lacht und arbeitet gern zusammen.')
  ]
 };
}
function timeTask(){
 const G='Gegenwart',V='Vergangenheit';
 const rows=[
  ['Heute ist mein Chef freundlich.',G],
  ['Jetzt habe ich viel Berufserfahrung.',G],
  ['Meine Kollegen arbeiten heute im Büro.',G],
  ['Wir haben heute wenig Stress.',G],
  ['Du bist jetzt Kellnerin.',G],
  ['Heute arbeitet Amir in einem Café.',G],
  ['Meine Arbeit ist heute einfach.',G],
  ['Sara arbeitet jetzt als Architektin.',G],
  ['Früher war mein Chef streng.',V],
  ['Vor zwei Jahren hatte ich keine Berufserfahrung.',V],
  ['Gestern waren meine Kollegen im Restaurant.',V],
  ['Damals hatten wir viel Stress.',V],
  ['Ich habe gestern lange gearbeitet.',V],
  ['Wir haben am Wochenende ein Restaurant besucht.',V],
  ['Mila ist vor drei Jahren nach Berlin gefahren.',V],
  ['Der Kellner hat gestern viele Gäste bedient.',V],
  ['Ich habe früher in einem Café gearbeitet.',V],
  ['Meine Kollegin hat eine Ausbildung gemacht.',V],
  ['Vor einem Jahr war unser Team noch klein.',V],
  ['Wir hatten damals wenig Zeit für Pausen.',V]
 ];
 return {
  id:'gegenwart-vergangenheit-mix-v2',title:'Gegenwart oder Vergangenheit?',kind:'time-sort',icon:'🕰️',emoji:'🕰️',spL8T3TimeSort:true,
  instruction:'Ordne die Sätze.',
  intro:'Vergangenheit: Perfekt oder Präteritum. Präteritum nur mit sein und haben.',
  items:rows.map(([sentence,answer])=>({sentence,answer:[answer]}))
 };
}
function writingTask(){
 const source='Vor fünf Jahren: Elena ist 24 Jahre alt. Sie wohnt in Homburg. Sie arbeitet als Kellnerin in einem großen Restaurant. Das Restaurant ist sehr voll. Elena hat wenig Berufserfahrung. Ihr Chef ist professionell, aber streng. Elena hat oft Stress, aber sie hat auch viel Spaß mit ihren Kollegen. Nach der Arbeit trifft sie oft ihre Freunde. Am Wochenende besucht sie ihre Familie.';
 return {
  id:'text-vor-fuenf-jahren-schreiben-v2',title:'Text umschreiben',kind:'past-writing',icon:'✍️',emoji:'✍️',spL8T3PastWriting:true,
  instruction:'Schreibe den ganzen Text in der Vergangenheit.',
  intro:'sein und haben → Präteritum. Andere Verben → Perfekt.',
  items:[{type:'past-writing',prompt:'Schreibe den Text neu.',context:source,required:true}]
 };
}
function addFourthImages(task,theme){
 if(!task?.items)return;
 const cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten')?.items||[];
 const pool=cards.map(c=>({term:String(c.term||c.word||c.full||''),image:String(c.image||c.img||'')})).filter(x=>x.term&&x.image);
 task.items.forEach((item,idx)=>{
  const have=new Set((item.options||[]).map(o=>String(o.term||'')));
  for(let step=0;step<pool.length&&have.size<4;step++){
   const candidate=pool[(idx*3+step+2)%pool.length];
   if(!candidate||have.has(candidate.term))continue;
   item.options.push({...candidate});have.add(candidate.term);
  }
  item.options=(item.options||[]).slice(0,4);
 });
}
function replaceAt(tasks,id,next){const i=tasks.findIndex(t=>String(t?.id)===id);if(i>=0)tasks.splice(i,1,next);return i}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const tasks=theme.tasks;
 const contextIndex=tasks.findIndex(t=>String(t?.title||'')==='Wort im Kontext'||String(t?.id||'').includes('context'));
 if(contextIndex>=0)tasks.splice(contextIndex,1,contextTask());
 const timeIndex=tasks.findIndex(t=>String(t?.id||'').startsWith('gegenwart-vergangenheit-'));
 if(timeIndex>=0)tasks.splice(timeIndex,1,timeTask());
 const writingIndex=tasks.findIndex(t=>String(t?.id||'').startsWith('text-vor-fuenf-jahren-'));
 if(writingIndex>=0)tasks.splice(writingIndex,1,writingTask());
 const listenImage=tasks.find(t=>String(t?.id)==='wortschatz-hoeren-bild');
 addFourthImages(listenImage,theme);
 theme.contentRevision='l8t3-user-fixes-20260902-v1';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_USER_FIXES_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T3 Nutzerkorrekturen',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_USER_FIXES_READY;
window.L8T3UserFixes20260902={apply,version:1};
})();
