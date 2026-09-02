(function(){
'use strict';
if(window.__SP_L8T2_TASK11_CONTEXT_V2)return;window.__SP_L8T2_TASK11_CONTEXT_V2=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ').trim();
const bare=v=>norm(v).replace(/^(der|die|das)\s+/,'');
const term=item=>String(item?.term||item?.word||item?.full||'').trim();
function themeOf(all){return all?.[2]||all?.['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null)}
function cardTask(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function overview(theme){return Array.isArray(theme?.vocabularyOverviewItems)&&theme.vocabularyOverviewItems.length?theme.vocabularyOverviewItems:(cardTask(theme)?.items||[])}
function allowedSet(theme){const s=new Set();for(const item of overview(theme)){const t=term(item);if(!t)continue;s.add(norm(t));s.add(bare(t))}return s}
const LEGACY_FOREIGN=['bewerbung','praktikum','abteilung','leiter','leiterin','wirtschaft','diplom','buro','information','gruss','anrede','stelle','firma','lebenslauf','anschreiben','zeugnis','abschluss','studium'];
function textOf(item){return `${item?.prompt||''} ${item?.context||''} ${item?.sentence||''} ${item?.text||''}`}
function answerArray(item){return (Array.isArray(item?.answer)?item.answer:[item?.answer]).filter(v=>v!==undefined&&v!==null&&String(v).trim())}
function isExperienceAnswer(value){const n=bare(value);return n==='erfahrung'||n==='berufserfahrung'}
function needsBareExperience(item){const t=norm(textOf(item));return /(sammle|sammelt|gesammelt)/.test(t)&&/(viel|wenig|mehr|keine|etwas)/.test(t)}
function foreignTarget(item,allowed){const answers=answerArray(item);if(!answers.length)return false;if(answers.some(isExperienceAnswer))return false;return answers.some(a=>{const n=bare(a);return LEGACY_FOREIGN.includes(n)&&!allowed.has(n)&&!allowed.has(norm(a))})}
function cleanOptions(item,allowed,sourceTerms){if(!Array.isArray(item?.options))return;const target=answerArray(item).map(bare);let opts=item.options.filter(o=>{const n=bare(typeof o==='object'?(o.term||o.word||''):o);return !LEGACY_FOREIGN.includes(n)||allowed.has(n)||target.includes(n)});for(const candidate of sourceTerms){if(opts.length>=4)break;const n=bare(candidate);if(!n||target.includes(n)||opts.some(o=>bare(typeof o==='object'?(o.term||o.word||''):o)===n))continue;opts.push(candidate)}item.options=opts.slice(0,Math.max(3,Math.min(4,opts.length)))}
function patchItem(item){if(!item)return;if(answerArray(item).some(isExperienceAnswer)&&needsBareExperience(item)){item.answer=['Erfahrung','Berufserfahrung'];item.acceptedAnswers=['Erfahrung','Berufserfahrung'];}}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks[10];if(!task)return theme;
 const allowed=allowedSet(theme),sourceTerms=overview(theme).map(term).filter(Boolean);
 const cleaned=[];
 for(const item of (task.items||[])){if(foreignTarget(item,allowed))continue;patchItem(item);cleanOptions(item,allowed,sourceTerms);cleaned.push(item)}
 task.items=cleaned;
 task.contentRule='Nur gelernter T2-Wortschatz; Antworten müssen grammatisch zum Satz passen.';
 theme.contentRevision=String(theme.contentRevision||'')+'-task11-context-v2';
 return theme
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_TASK11_CONTEXT_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T2 Aufgabe 11 Kontextkorrektur',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T2_TASK11_CONTEXT_READY;
window.L8T2Task11ErfahrungAlias20260902={apply,version:2};
})();
