(function(){
'use strict';
if(window.__SP_L8T1_PEDAGOGY_POLISH_V1)return;window.__SP_L8T1_PEDAGOGY_POLISH_V1=true;
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;if(!theme)return themes;
 const interview=(theme.tasks||[]).find(task=>task?.id==='berufsinterview-v2');
 for(const item of interview?.items||[]){if(item.starter){item.context=[item.context,item.starter].filter(Boolean).join('\n');delete item.starter}}
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();