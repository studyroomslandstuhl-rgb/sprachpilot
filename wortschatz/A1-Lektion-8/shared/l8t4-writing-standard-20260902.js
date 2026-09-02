(function(){
'use strict';
if(window.__SP_L8T4_WRITING_STANDARD_20260902_V2)return;window.__SP_L8T4_WRITING_STANDARD_20260902_V2=true;
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
function hash(text){let h=2166136261;for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function shuffle(values,seedText){const a=[...(values||[])];let seed=hash(seedText)||1;for(let i=a.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function mixTask(task){(task?.items||[]).forEach((item,i)=>{if(Array.isArray(item.options)&&item.options.length>1)item.options=shuffle(item.options,`${task.id}|${i}`)})}
const previous=window.L8_CONTENT_READY;
window.L8_T4_WRITING_STANDARD_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);
 const writing=(theme?.tasks||[]).find(t=>String(t?.id)==='l8t4-schreiben-nachfrage');
 if(writing?.items?.[0]){writing.items[0].min=4;delete writing.items[0].minWords;writing.intro='Frage nach zwei Informationen und schreibe, wann du Zeit hast.'}
 mixTask((theme?.tasks||[]).find(t=>String(t?.id)==='l8t4-bild-wort'));
 mixTask((theme?.tasks||[]).find(t=>String(t?.id)==='l8t4-hoeren-bild'));
 return themes;
}).catch(error=>{console.error('L8T4 Schreib-/Antwortstandard',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_WRITING_STANDARD_READY;
})();
