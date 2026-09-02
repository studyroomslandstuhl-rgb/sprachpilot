(function(){
'use strict';
if(window.__SP_L8_OVERVIEW_VOCAB_GUARD_20260902_V1)return;window.__SP_L8_OVERVIEW_VOCAB_GUARD_20260902_V1=true;
const clone=v=>{try{return structuredClone(v)}catch(e){return JSON.parse(JSON.stringify(v))}};
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/i,'').replace(/\s+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
function themeNo(){return Number(document.body?.dataset?.theme||location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0)}
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function cardsOf(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function sourceOf(theme){
 if(Array.isArray(theme?.vocabularyOverviewItems)&&theme.vocabularyOverviewItems.length)return theme.vocabularyOverviewItems;
 const cards=cardsOf(theme);if(Array.isArray(cards?.items)&&cards.items.length)return cards.items;
 if(Array.isArray(theme?.overviewOnlyItems)&&theme.overviewOnlyItems.length)return theme.overviewOnlyItems;
 return []
}
function isVocabTask(task){
 const text=norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''}`);
 return task?.kind==='cards'||/karte|card|memory|vocab|wortschatz|bild wort|wort bild|bedeutung wort|wort bedeutung|horen bild|hoeren bild|listen image|wort zuord|zuord wort/.test(text)
}
function answers(item){return [...(Array.isArray(item?.answer)?item.answer:[item?.answer]),...(item?.accepted||[]),...(item?.answers||[])].filter(v=>typeof v==='string'&&v.trim())}
function replenishStrings(original,answer,source,allowed){
 const wanted=Math.max(2,original.length||3),out=[],seen=new Set();
 const add=v=>{const n=norm(v);if(!v||!allowed.has(n)||seen.has(n))return;seen.add(n);out.push(v)};
 add(answer);original.forEach(add);source.forEach(x=>add(term(x)));
 return out.slice(0,wanted)
}
function replenishObjects(original,answer,source,allowed){
 const wanted=Math.max(2,original.length||3),out=[],seen=new Set();
 const add=o=>{const v=term(o),n=norm(v);if(!v||!allowed.has(n)||seen.has(n))return;seen.add(n);out.push(clone(o))};
 const a=source.find(x=>norm(term(x))===norm(answer));if(a)add(a);original.forEach(add);source.forEach(add);
 return out.slice(0,wanted)
}
function cleanTask(task,source,allowed){
 if(!isVocabTask(task)||!Array.isArray(task.items))return;
 if(task.kind==='cards'){
  task.items=source.map(clone);return
 }
 const next=[];
 for(const item0 of task.items){
  const item=clone(item0),ans=answers(item),target=ans.find(a=>allowed.has(norm(a)))||'';
  const own=term(item);
  if(own&&!allowed.has(norm(own)))continue;
  const opts=Array.isArray(item.options)?item.options:null;
  const stringOpts=opts&&opts.every(x=>typeof x==='string');
  const objectOpts=opts&&opts.every(x=>x&&typeof x==='object'&&term(x));
  const optionMatches=stringOpts?opts.filter(x=>allowed.has(norm(x))).length:objectOpts?opts.filter(x=>allowed.has(norm(term(x)))).length:0;
  if(ans.length&&optionMatches>=1&&!target)continue;
  if(target&&stringOpts)item.options=replenishStrings(opts,target,source,allowed);
  else if(target&&objectOpts)item.options=replenishObjects(opts,target,source,allowed);
  if(Array.isArray(item.wordBank)&&item.wordBank.every(x=>typeof x==='string')){
   const kept=item.wordBank.filter(x=>allowed.has(norm(x)));
   if(kept.length)item.wordBank=replenishStrings(kept,target||kept[0],source,allowed)
  }
  next.push(item)
 }
 if(next.length)task.items=next
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const source=sourceOf(theme).map(clone);if(!source.length)return theme;
 const allowed=new Set(source.map(x=>norm(term(x))).filter(Boolean));
 theme.vocabularyOverviewItems=source.map(clone);theme.acceptedVocabularyTerms=source.map(term);
 const cards=cardsOf(theme);if(cards)cards.items=source.map(clone);
 for(const task of theme.tasks)cleanTask(task,source,allowed);
 theme.contentRevision=String(theme.contentRevision||'')+'-overview-vocab-guard-v1';
 return theme
}
const previous=window.L8_CONTENT_READY;
window.L8_OVERVIEW_VOCAB_GUARD_READY=Promise.resolve(previous).then(themes=>{const n=themeNo(),all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,n);apply(theme);if(theme&&Number(window.L8_THEME?.number)===n)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8 Wortschatz-Übersichtsregel',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_OVERVIEW_VOCAB_GUARD_READY;
window.L8OverviewVocabGuard20260902={apply,version:1};
})();
