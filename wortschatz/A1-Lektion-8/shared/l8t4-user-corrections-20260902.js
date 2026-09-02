(function(){
'use strict';
if(window.__SP_L8T4_USER_CORRECTIONS_20260902_V1)return;window.__SP_L8T4_USER_CORRECTIONS_20260902_V1=true;
const ALLOWED=[
 'die Stellenanzeige','die Stelle','das Ausland','der Arbeitsplatz','der Traumjob','tagsüber','der Sekretär','die Sekretärin','die Universität','befristet','Vollzeit','Teilzeit','ganztags','halbtags','die Nachhilfe','die Senioren','die Aushilfe','dringend','der Service','pro Stunde','die Nachfrage','frei','die Arbeitszeit','der Verdienst'
];
const PICTURE=['die Stellenanzeige','die Stelle','das Ausland','der Arbeitsplatz','der Traumjob','der Sekretär','die Sekretärin','die Universität','Vollzeit','Teilzeit','die Nachhilfe','die Senioren','die Aushilfe','dringend','der Service','frei'];
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
function clone(item){return {...item,translations:{...(item?.translations||item?.tr||{})},tr:{...(item?.tr||item?.translations||{})}}}
function words(){return (window.L8T4FinalStandard20260902?.words||[]).map(clone)}
function byTerm(){return new Map(words().map(x=>[norm(x.term),x]))}
function four(target,index,map){const out=[target];for(let step=1;out.length<4&&step<PICTURE.length+4;step++){const t=PICTURE[(index*5+step)%PICTURE.length];if(!out.includes(t))out.push(t)}return out.map(t=>map.get(norm(t))).filter(Boolean).slice(0,4)}
function cardTask(theme,map){let task=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));if(!task){task={id:'karteikarten',kind:'cards',items:[]};theme.tasks.unshift(task)}task.id='karteikarten';task.kind='cards';task.title='Karteikarten';task.icon='📚';task.emoji='📚';task.instruction='Lerne die Wörter.';task.items=ALLOWED.map(t=>map.get(norm(t))).filter(Boolean).map(clone);theme.vocabularyOverviewItems=task.items.map(clone);theme.overviewOnlyItems=task.items.map(clone);return task}
function imageTask(map){return{id:'l8t4-bild-wort-v2',title:'Bild → Wort',kind:'t4-image',icon:'🖼️',emoji:'🖼️',spL8T4Image:true,instruction:'Sieh das Bild. Wähle das Wort.',items:PICTURE.map((target,i)=>{const ref=map.get(norm(target));return{image:ref?.image||'',prompt:'Was passt?',options:four(target,i,map).map(x=>x.term),answer:[target]}})}}
function listenImageTask(map){return{id:'l8t4-hoeren-bild-v2',title:'Hören → Bild',kind:'t4-listen-image',icon:'👂',emoji:'👂',spL8T4ListenImage:true,instruction:'Höre das Wort. Wähle das Bild.',items:PICTURE.map((target,i)=>{const ref=map.get(norm(target));return{audioText:target,audioFile:ref?.audioFile||ref?.audio||'',answer:[target],options:four(target,i+2,map).map(x=>({term:x.term,image:x.image||''}))}})}}
function alternativesTask(){const rows=[
 ['donnerstags','jeden Donnerstag'],['jeden Abend','abends'],['montags','jeden Montag'],['jeden Morgen','morgens'],['freitags','jeden Freitag'],['jeden Nachmittag','nachmittags'],['samstags','jeden Samstag'],['jeden Vormittag','vormittags'],['sonntags','jeden Sonntag'],['jeden Mittag','mittags'],['dienstags','jeden Dienstag'],['jeden Mittwoch','mittwochs']
 ];return{id:'l8t4-alternativen-schreiben-v2',title:'Alternative schreiben',kind:'case-input',icon:'🔁',emoji:'🔁',spL8T4CaseInput:true,instruction:'Schreibe die Alternative.',items:rows.map(([prompt,answer])=>({prompt,answer:[answer],caseSensitive:true}))}}
function wrongFormsTask(){const rows=[
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
 ['Ich arbeite ___.',['mittwochs','jeden Mittwoch','am Mittwochs'],'am Mittwochs']
 ];return{id:'l8t4-falsche-form-v2',title:'Falsche Form',kind:'choice',icon:'🚫',emoji:'🚫',instruction:'Markiere die falsche Zeitangabe.',items:rows.map(([context,options,answer])=>({type:'choice',context,prompt:'Welche Form ist falsch?',options,answer,hint:'Setze jede Form in den Satz ein.'}))}}
function adReadingTask(){
 const groups=[
  {title:'Anzeige A · Café am Markt',text:'Wir suchen dringend eine Aushilfe im Service. Teilzeit, halbtags von 8 bis 12 Uhr, montags bis freitags. 14 Euro pro Stunde. Die Stelle ist für vier Monate befristet.',qs:[
   {type:'choice',prompt:'Eine Person, die nur nachmittags Zeit hat, kann diese Stelle gut machen.',options:['Richtig','Falsch'],answer:'Falsch'},
   {type:'choice',prompt:'Für welche Person passt die Arbeitszeit am besten?',options:['Eine Person mit Zeit von 8 bis 12 Uhr.','Eine Person mit Zeit erst ab 16 Uhr.','Eine Person, die nur nachts arbeiten kann.'],answer:'Eine Person mit Zeit von 8 bis 12 Uhr.'},
   {type:'choice',prompt:'Was passiert nach vier Monaten?',options:['Die befristete Stelle endet.','Die Arbeit wird automatisch Vollzeit.','Der Stundenlohn wird null Euro.'],answer:'Die befristete Stelle endet.'}
  ]},
  {title:'Anzeige B · Universität',text:'Für unser Sekretariat suchen wir eine Sekretärin oder einen Sekretär. Vollzeit, montags bis freitags von 8 bis 16:30 Uhr. Gute Computerkenntnisse sind wichtig. Die Stelle ist nicht befristet.',qs:[
   {type:'choice',prompt:'Die Stelle passt gut zu einer Person, die nur halbtags arbeiten möchte.',options:['Richtig','Falsch'],answer:'Falsch'},
   {type:'choice',prompt:'Welche Person passt am besten?',options:['Eine Person mit Büroerfahrung und guten Computerkenntnissen.','Eine Person, die nur am Wochenende Zeit hat.','Eine Person, die nur zwei Stunden pro Woche arbeiten möchte.'],answer:'Eine Person mit Büroerfahrung und guten Computerkenntnissen.'},
   {type:'choice',prompt:'Welche Aussage zur Dauer passt?',options:['Die Stelle ist dauerhaft.','Die Stelle dauert nur zwei Wochen.','Die Stelle endet jeden Freitag.'],answer:'Die Stelle ist dauerhaft.'}
  ]},
  {title:'Anzeige C · Seniorenhilfe',text:'Wir suchen eine Aushilfe für die Seniorenhilfe. Samstags und sonntags von 9 bis 13 Uhr. 15 Euro pro Stunde. Führerschein ist nicht nötig. Bewerben können sich Personen ab 18 Jahren. Auch Senioren sind willkommen.',qs:[
   {type:'choice',prompt:'Eine Person ohne Auto kann sich bewerben.',options:['Richtig','Falsch'],answer:'Richtig'},
   {type:'choice',prompt:'Für wen passt die Anzeige nicht so gut?',options:['Eine Person mit 17 Jahren.','Eine Person mit 35 Jahren.','Eine Person mit 60 Jahren.'],answer:'Eine Person mit 17 Jahren.'},
   {type:'choice',prompt:'Welche Person braucht unter der Woche keine Zeit für diesen Job?',options:['Eine Person, die nur am Wochenende frei hat.','Eine Person, die nur montags frei hat.','Eine Person, die nur mittwochs frei hat.'],answer:'Eine Person, die nur am Wochenende frei hat.'}
  ]},
  {title:'Anzeige D · Lieferdienst',text:'Wir suchen dringend eine Aushilfe für drei Monate. Die Stelle ist Vollzeit und befristet. Arbeitszeit tagsüber. Ein Führerschein ist wichtig. 16 Euro pro Stunde.',qs:[
   {type:'choice',prompt:'Die Stelle passt zu einer Person, die kein Auto fahren kann.',options:['Richtig','Falsch'],answer:'Falsch'},
   {type:'choice',prompt:'Welche Person passt am besten?',options:['Eine Person mit Führerschein, die tagsüber Vollzeit arbeiten kann.','Eine Person ohne Führerschein, die nur abends Zeit hat.','Eine Person, die nur einen Vormittag im Monat arbeiten kann.'],answer:'Eine Person mit Führerschein, die tagsüber Vollzeit arbeiten kann.'},
   {type:'choice',prompt:'Was muss die Person nach drei Monaten wahrscheinlich machen, wenn sie weiterarbeiten möchte?',options:['Eine neue Stelle suchen oder einen neuen Vertrag bekommen.','Den Führerschein abgeben.','Nur noch nachts arbeiten.'],answer:'Eine neue Stelle suchen oder einen neuen Vertrag bekommen.'}
  ]}
 ];
 const items=[],adGroups=[];groups.forEach(g=>{const indexes=[];g.qs.forEach(q=>{indexes.push(items.length);items.push({...q,context:g.text})});adGroups.push({title:g.title,text:g.text,questionIndexes:indexes})});
 return{id:'l8t4-anzeigen-verstehen-v2',title:'Stellenanzeige verstehen',kind:'ad-reading',icon:'📰',emoji:'📰',spL8T4AdReadingGroups:true,instruction:'Lies die Anzeige. Beantworte die Fragen.',items,adGroups};
}
function personAdsTask(){
 const ads=[
  {id:'A',title:'Restaurant Abendrot',text:'Minijob im Service. Freitags und samstags 17–22 Uhr. Berufserfahrung ist nicht nötig.'},
  {id:'B',title:'Bäckerei Klein',text:'Minijob montags bis donnerstags 11–14 Uhr.'},
  {id:'C',title:'Universität West',text:'Sekretariat, Teilzeit. Montags bis freitags 8–12 Uhr. Gute Computerkenntnisse sind wichtig.'},
  {id:'D',title:'Büro Zentrum',text:'Sekretariat, Vollzeit. Montags bis freitags 8–17 Uhr.'},
  {id:'E',title:'Nachhilfe Plus',text:'Nachhilfe dienstags und donnerstags 17–20 Uhr. Sehr gute Mathematikkenntnisse sind wichtig.'},
  {id:'F',title:'Seniorencafé',text:'Aushilfe dienstags und donnerstags 9–12 Uhr. Führerschein ist nicht nötig.'},
  {id:'G',title:'City Lieferdienst',text:'Vollzeit für drei Monate, tagsüber. Führerschein ist notwendig.'},
  {id:'H',title:'Besuchsdienst',text:'Aushilfe samstags und sonntags 9–13 Uhr. Führerschein ist notwendig.'}
 ];
 const items=[
  {person:'Emilio ist 18. Er hat die Schule beendet und möchte später eine Ausbildung machen. Jetzt sucht er einen Minijob am Abend oder am Wochenende. Er hat keinen Führerschein.',answer:['A']},
  {person:'Amina ist 34. Sie hat schon im Büro gearbeitet und kann gut mit dem Computer arbeiten. Sie sucht Teilzeit am Vormittag von Montag bis Freitag.',answer:['C']},
  {person:'Pavel ist 62 und möchte nur wenige Stunden arbeiten. Dienstag und Donnerstag am Vormittag hat er Zeit. Er fährt kein Auto.',answer:['F']},
  {person:'Leyla ist 27 und hat einen Führerschein. Sie kann tagsüber Vollzeit arbeiten, möchte aber nur für drei Monate eine Stelle.',answer:['G']}
 ];
 return{id:'l8t4-person-anzeige-v2',title:'Person → Anzeige',kind:'person-ads',icon:'🧑‍💼',emoji:'🧑‍💼',spL8T4PersonAds:true,instruction:'Lies die Person. Wähle die passende Anzeige.',items,ads};
}
function replace(theme,oldIds,next){const i=theme.tasks.findIndex(t=>oldIds.includes(String(t?.id||'')));if(i>=0)theme.tasks.splice(i,1,next)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;const map=byTerm(),cards=cardTask(theme,map);
 replace(theme,['l8t4-bild-wort','l8t4-bild-wort-v2'],imageTask(map));
 replace(theme,['l8t4-hoeren-bild','l8t4-hoeren-bild-v2'],listenImageTask(map));
 replace(theme,['l8t4-zeiten-s','l8t4-alternativen-schreiben-v2'],alternativesTask());
 replace(theme,['l8t4-fuer-zeit','l8t4-falsche-form-v2'],wrongFormsTask());
 replace(theme,['l8t4-lesen-anzeigen','l8t4-anzeigen-verstehen-v2'],adReadingTask());
 replace(theme,['l8t4-person-anzeige','l8t4-person-anzeige-v2'],personAdsTask());
 theme.vocabularyOverviewItems=cards.items.map(clone);theme.overviewOnlyItems=cards.items.map(clone);
 theme.contentRevision='l8t4-user-corrections-20260902-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;return theme
}
const previous=window.L8_CONTENT_READY;window.L8_T4_USER_CORRECTIONS_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 Nutzerkorrekturen',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_USER_CORRECTIONS_READY;window.L8T4UserCorrections20260902={apply,version:1,allowed:ALLOWED};
})();
