(function(){
'use strict';
if(window.__SP_L8T4_A5_A7_20260903_V1)return;
window.__SP_L8T4_A5_A7_20260903_V1=true;

const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);

function a5(){
 const rows=[
  ['montags','jeden Montag'],
  ['jeden Dienstag','dienstags'],
  ['mittwochs','jeden Mittwoch'],
  ['jeden Donnerstag','donnerstags'],
  ['freitags','jeden Freitag'],
  ['jeden Samstag','samstags'],
  ['sonntags','jeden Sonntag'],
  ['jeden Morgen','morgens'],
  ['vormittags','jeden Vormittag'],
  ['jeden Mittag','mittags'],
  ['nachmittags','jeden Nachmittag'],
  ['jeden Abend','abends'],
  ['jede Nacht','nachts'],
  ['jeden Tag','täglich'],
  ['am Wochenende','samstags und sonntags']
 ];
 return {
  id:'l8t4-alternativen-schreiben-v2',
  title:'Alternative schreiben',
  kind:'case-input',
  icon:'🔁',emoji:'🔁',spL8T4CaseInput:true,
  instruction:'Schreibe die Alternative. Beispiel: montags → jeden Montag.',
  items:rows.map(([prompt,answer])=>({prompt,answer:[answer],caseSensitive:true}))
 };
}

function a6(){
 const rows=[
  ['Ich arbeite ___.',['jeden Morgen','morgens','jeder Morgen'],'jeder Morgen'],
  ['Ich arbeite ___.',['montags','jeden Montag','am Montags'],'am Montags'],
  ['Ich arbeite ___.',['jeden Abend','abends','jeder Abend'],'jeder Abend'],
  ['Ich arbeite ___.',['dienstags','jeden Dienstag','am Dienstags'],'am Dienstags'],
  ['Ich arbeite ___.',['nachmittags','jeden Nachmittag','jede Nachmittag'],'jede Nachmittag'],
  ['Ich arbeite ___.',['donnerstags','jeden Donnerstag','am Donnerstags'],'am Donnerstags'],
  ['Ich arbeite ___.',['vormittags','jeden Vormittag','jeder Vormittag'],'jeder Vormittag'],
  ['Ich arbeite ___.',['freitags','jeden Freitag','am Freitags'],'am Freitags'],
  ['Ich arbeite ___.',['samstags','jeden Samstag','am Samstags'],'am Samstags'],
  ['Ich arbeite ___.',['sonntags','jeden Sonntag','am Sonntags'],'am Sonntags'],
  ['Ich arbeite ___.',['mittags','jeden Mittag','am Mittags'],'am Mittags'],
  ['Ich arbeite ___.',['mittwochs','jeden Mittwoch','am Mittwochs'],'am Mittwochs'],
  ['Ich arbeite ___.',['jede Nacht','nachts','jeder Nacht'],'jeder Nacht'],
  ['Ich arbeite ___.',['jeden Tag','täglich','jeder Tag'],'jeder Tag'],
  ['Ich arbeite ___.',['am Wochenende','samstags und sonntags','am Wochenendes'],'am Wochenendes']
 ];
 return {
  id:'l8t4-falsche-form-v2',
  title:'Falsche Form',
  kind:'choice',icon:'🚫',emoji:'🚫',
  instruction:'Markiere die falsche Zeitangabe.',
  items:rows.map(([context,options,answer])=>({type:'choice',context,prompt:'Welche Form ist falsch?',options,answer,hint:'Setze jede Form in den Satz ein.'}))
 };
}

function a7(){
 const groups=[
  {
   title:'Anzeige A · Café am Markt',
   text:'Wir suchen dringend eine Aushilfe im Service. Teilzeit, halbtags von 8 bis 12 Uhr, montags bis freitags. 14 Euro pro Stunde. Die Stelle ist für vier Monate befristet.',
   qs:[
    ['Maria geht vormittags zum Deutschkurs. Sie kann diese Arbeit machen.','Falsch'],
    ['Peter braucht einen Job für vier Monate. Diese Stelle passt Peter.','Richtig'],
    ['Lea sucht eine Vollzeitstelle. Diese Stelle passt Lea nicht.','Richtig']
   ]
  },
  {
   title:'Anzeige B · Universität',
   text:'Die Universität sucht eine Sekretärin oder einen Sekretär. Vollzeit, montags bis freitags von 8 bis 16:30 Uhr. Gute Computerkenntnisse sind wichtig. Die Stelle ist nicht befristet.',
   qs:[
    ['Amina kann gut am Computer arbeiten. Sie sucht Vollzeit. Die Stelle passt Amina.','Richtig'],
    ['Leon kann nur nachmittags arbeiten. Die Stelle passt Leon.','Falsch'],
    ['Marta sucht eine Stelle für drei Monate. Diese Stelle ist befristet.','Falsch']
   ]
  },
  {
   title:'Anzeige C · Hilfe im Alltag',
   text:'Wir suchen eine Aushilfe. Sie hilft einem Senior und einer Seniorin. Arbeitszeit: samstags und sonntags von 9 bis 13 Uhr. 15 Euro pro Stunde. Ein Führerschein ist nicht nötig.',
   qs:[
    ['Samir hat keinen Führerschein. Er kann diese Arbeit machen.','Richtig'],
    ['Eva ist samstags und sonntags frei. Die Stelle passt Eva.','Richtig'],
    ['Tom arbeitet am Wochenende. Die Stelle passt Tom.','Falsch']
   ]
  },
  {
   title:'Anzeige D · Lieferdienst',
   text:'Wir suchen dringend eine Aushilfe im Lieferdienst. Vollzeit für drei Monate. Arbeitszeit tagsüber. Ein Führerschein ist wichtig. 16 Euro pro Stunde.',
   qs:[
    ['Ali hat keinen Führerschein. Die Stelle passt Ali.','Falsch'],
    ['Nina sucht Vollzeit für drei Monate. Sie hat einen Führerschein. Die Stelle passt Nina.','Richtig'],
    ['Paul kann nur abends arbeiten. Die Stelle passt Paul.','Falsch']
   ]
  },
  {
   title:'Anzeige E · Nachhilfe Plus',
   text:'Wir suchen eine Aushilfe für Nachhilfe in Mathematik. Teilzeit, dienstags und donnerstags von 16 bis 19 Uhr. 18 Euro pro Stunde. Gute Mathematikkenntnisse sind wichtig.',
   qs:[
    ['Sofia kann gut Mathematik. Sie hat dienstags und donnerstags Zeit. Die Stelle passt Sofia.','Richtig'],
    ['Emil kann nur vormittags arbeiten. Die Stelle passt Emil.','Falsch'],
    ['Lara sucht eine Stelle im Service. Diese Stelle passt Lara nicht.','Richtig']
   ]
  }
 ];
 const items=[],adGroups=[];
 groups.forEach(g=>{
  const questionIndexes=[];
  g.qs.forEach(([prompt,answer])=>{
   questionIndexes.push(items.length);
   items.push({type:'choice',prompt,options:['Richtig','Falsch'],answer,context:g.text});
  });
  adGroups.push({title:g.title,text:g.text,questionIndexes});
 });
 return {
  id:'l8t4-anzeigen-verstehen-v2',
  title:'Stellenanzeige verstehen',
  kind:'ad-reading',icon:'📰',emoji:'📰',spL8T4AdReadingGroups:true,
  instruction:'Lies die Anzeige. Lies die Sätze. Wähle Richtig oder Falsch.',
  items,adGroups
 };
}

function replace(theme,id,next){
 const i=(theme.tasks||[]).findIndex(t=>String(t?.id||'')===id);
 if(i>=0)theme.tasks.splice(i,1,next);
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 replace(theme,'l8t4-alternativen-schreiben-v2',a5());
 replace(theme,'l8t4-falsche-form-v2',a6());
 replace(theme,'l8t4-anzeigen-verstehen-v2',a7());
 theme.contentRevision=String(theme.contentRevision||'')+'-a5-a7-20260903-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T4_A5_A7_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);
 apply(theme);
 return themes;
}).catch(error=>{console.error('L8T4 A5-A7 Anpassung',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_A5_A7_READY;
window.L8T4A5A7_20260903={apply,a5,a6,a7,version:1};
})();
