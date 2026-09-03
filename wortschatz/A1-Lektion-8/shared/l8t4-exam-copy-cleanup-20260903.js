(function(){
'use strict';
if(window.__SP_L8T4_EXAM_COPY_CLEANUP_20260903)return;
window.__SP_L8T4_EXAM_COPY_CLEANUP_20260903=true;
const previous=window.L8_CONTENT_READY;
window.L8_CONTENT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
 const exam=(theme?.tasks||[]).find(t=>t?.exam||String(t?.id||'')==='pruefung');
 if(exam){exam.instruction='Bearbeite 15 Prüfungsfragen.';exam.intro='';}
 return themes;
});
})();