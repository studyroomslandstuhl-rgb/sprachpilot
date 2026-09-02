(function(){
'use strict';
if(window.__SP_L8T4_WRITING_STANDARD_20260902_V1)return;window.__SP_L8T4_WRITING_STANDARD_20260902_V1=true;
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
const previous=window.L8_CONTENT_READY;
window.L8_T4_WRITING_STANDARD_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all),task=(theme?.tasks||[]).find(t=>String(t?.id)==='l8t4-schreiben-nachfrage');if(task?.items?.[0]){task.items[0].min=4;task.items[0].minWords=undefined;task.intro='Frage nach zwei Informationen und schreibe, wann du Zeit hast.'}return themes}).catch(error=>{console.error('L8T4 Schreibstandard',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_WRITING_STANDARD_READY;
})();
