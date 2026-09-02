(function(){
'use strict';
if(window.__SP_L8_RANDOMIZATION_STANDARD_20260902_V3)return;window.__SP_L8_RANDOMIZATION_STANDARD_20260902_V3=true;
function themeNo(){return Number(document.body?.dataset?.theme||location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0)}
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
const PAGE_SEED=(window.crypto?.randomUUID?.()||`${Date.now()}_${Math.random()}_${Math.random()}`);
function hash(text){let h=2166136261;for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function shuffle(values,key){const a=[...(values||[])];let x=hash(`${PAGE_SEED}|${key}`)||1;for(let i=a.length-1;i>0;i--){x=(Math.imul(x,1664525)+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 for(const task of theme.tasks){
  (task.items||[]).forEach((item,i)=>{
   if(Array.isArray(item.options)&&item.options.length>1)item.options=shuffle(item.options,`${task.id}|item|${i}|options`);
   if(Array.isArray(item.tokens)&&item.tokens.length>1)item.tokens=shuffle(item.tokens,`${task.id}|item|${i}|tokens`);
   if(Array.isArray(item.wordBank)&&item.wordBank.length>1)item.wordBank=shuffle(item.wordBank,`${task.id}|item|${i}|wordBank`);
  });
  if(Array.isArray(task.ads)&&task.ads.length>1)task.ads=shuffle(task.ads,`${task.id}|ads`);
  if(Array.isArray(task.options)&&task.options.length>1)task.options=shuffle(task.options,`${task.id}|options`);
 }
 return theme
}
const previous=window.L8_CONTENT_READY;
window.L8_RANDOMIZATION_STANDARD_READY=Promise.resolve(previous).then(themes=>{const n=themeNo(),all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,n);apply(theme);if(theme&&Number(window.L8_THEME?.number)===n)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8 Zufallsstandard',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_RANDOMIZATION_STANDARD_READY;
window.L8RandomizationStandard20260902={shuffle,apply,version:3};
})();
