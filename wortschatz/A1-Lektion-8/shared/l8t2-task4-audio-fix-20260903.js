(function(){
'use strict';
if(window.__SP_L8T2_TASK4_AUDIO_FIX_20260903)return;
window.__SP_L8T2_TASK4_AUDIO_FIX_20260903=true;

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const practice=theme.tasks.filter(task=>!task?.exam);
 const task4=practice[3];
 if(!task4||!Array.isArray(task4.items))return theme;
 task4.items=task4.items.map(item=>{
  if(!item||item.type!=='choice')return item;
  const spoken=String(item.context||item.prompt||'').trim();
  return spoken?{...item,audio:spoken}:item;
 });
 return theme;
}

window.L8_T2_TASK4_AUDIO_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK4_AUDIO_READY;
window.L8T2Task4AudioFix={apply,version:1};
})();
