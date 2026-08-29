(function(){
'use strict';
if(window.__SP_L8T1_ORDER_FIX_V1)return;window.__SP_L8T1_ORDER_FIX_V1=true;
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{
 const all=window.L8_ALL_THEMES||{};
 const theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):window.L8_THEME);
 if(!theme||!Array.isArray(theme.tasks))return value;
 const a=theme.tasks.findIndex(t=>t?.id==='arbeit-wortschatz-schreiben-v3');
 const b=theme.tasks.findIndex(t=>t?.id==='berufsfragen-status-v1');
 if(a>=0&&b>=0&&a!==b){[theme.tasks[a],theme.tasks[b]]=[theme.tasks[b],theme.tasks[a]];theme.tasks.forEach((task,index)=>task.order=index+1)}
 theme.orderRevision='l8t1-swap-14-15-v1';
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;
 return value;
});
})();
