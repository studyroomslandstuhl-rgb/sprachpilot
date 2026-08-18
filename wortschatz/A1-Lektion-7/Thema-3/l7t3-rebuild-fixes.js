(function(){
'use strict';
if(window.__SP_L7T3_REBUILD_FIXES_V3)return;window.__SP_L7T3_REBUILD_FIXES_V3=true;
const PARTS=['Gestern ',' ich früh nach Berlin gefahren. Dort ',' meine Freundin Sara schon Kaffee getrunken. Wir ',' zusammen in die Stadt gegangen. Sara ',' am Vormittag gearbeitet, aber ich ',' im Park spazieren gegangen. Mittags ',' wir in einem Café geblieben und ',' Kuchen gegessen. Danach ',' wir ins Schwimmbad gegangen und ',' eine Stunde geschwommen. Am Abend ',' Sara Brot gebacken und wir ',' auf einer Party getanzt. Unsere Freunde ',' auch gekommen. Ihr ',' sehr spät nach Hause gefahren, aber ich ',' noch bei Sara geblieben. Am nächsten Morgen ',' ich früh nach Hause gegangen.'];
const ANSWERS=['bin','hat','sind','hat','bin','sind','haben','sind','sind','hat','haben','sind','seid','bin','bin'];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const cloze=(theme.tasks||[]).find(t=>t.id==='t3-lueckentext-v2');if(cloze){cloze.clozeParts=PARTS;cloze.items=ANSWERS.map((answer,index)=>({answer,index}));cloze.kind='aux-cloze';cloze.spL7T3Kind='cloze'}
 const errors=(theme.tasks||[]).find(t=>t.id==='t3-fehler-korrigieren-v2');if(errors?.items?.[10])errors.items[10]={sentence:'Wir sind im Park spazieren gehen.',wrongWord:'gehen',answer:'gegangen',errorType:'Perfekt'};
 const exam=(theme.tasks||[]).find(t=>t.exam);if(exam)exam.kind='';
 return theme;
});
})();
