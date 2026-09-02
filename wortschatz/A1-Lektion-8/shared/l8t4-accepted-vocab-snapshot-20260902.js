(function(){
'use strict';
if(window.__SP_L8T4_ACCEPTED_VOCAB_SNAPSHOT_20260902_V1)return;
window.__SP_L8T4_ACCEPTED_VOCAB_SNAPSHOT_20260902_V1=true;
const clone=v=>{try{return structuredClone(v)}catch(e){return JSON.parse(JSON.stringify(v))}};
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
function cardsOf(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
const previous=window.L8_CONTENT_READY;
window.L8_T4_ACCEPTED_VOCAB_SNAPSHOT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all),cards=cardsOf(theme);
 const source=Array.isArray(theme?.vocabularyOverviewItems)&&theme.vocabularyOverviewItems.length?theme.vocabularyOverviewItems:(cards?.items||[]);
 window.L8_T4_ACCEPTED_VOCAB_SNAPSHOT={
  items:clone(source||[]),
  capturedRevision:String(theme?.contentRevision||'base-after-accepted-patches'),
  capturedAt:'2026-09-02'
 };
 return themes;
}).catch(error=>{console.error('L8T4 Wortschatz-Snapshot',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_ACCEPTED_VOCAB_SNAPSHOT_READY;
})();
