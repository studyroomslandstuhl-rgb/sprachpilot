(function(){
'use strict';
if(window.__SP_L8T2_TASK11_ERFAHRUNG_ALIAS_20260902_V1)return;window.__SP_L8T2_TASK11_ERFAHRUNG_ALIAS_20260902_V1=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
function themeOf(all){return all?.[2]||all?.['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null)}
function patchItem(item){if(!item)return;const answers=Array.isArray(item.answer)?item.answer:[item.answer].filter(Boolean);if(!answers.some(a=>['erfahrung','die erfahrung','berufserfahrung','die berufserfahrung'].includes(norm(a))))return;const merged=['Erfahrung','die Erfahrung','Berufserfahrung','die Berufserfahrung',...answers];item.answer=[...new Set(merged)];}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;const task=theme.tasks[10];if(!task)return theme;(task.items||[]).forEach(patchItem);theme.contentRevision=String(theme.contentRevision||'')+'-task11-erfahrung-alias-v1';return theme}
const previous=window.L8_CONTENT_READY;window.L8_T2_TASK11_ERFAHRUNG_ALIAS_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T2 Aufgabe 11 Erfahrung-Alias',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T2_TASK11_ERFAHRUNG_ALIAS_READY;window.L8T2Task11ErfahrungAlias20260902={apply,version:1};
})();
