(function(){
'use strict';
if(window.__SP_L8_VERB_PRESENT_ONLY_20260904)return;
window.__SP_L8_VERB_PRESENT_ONLY_20260904=true;

const rawTerm=item=>String(item?.term||item?.full||item?.word||'').trim();
const perfectTail=/\s*(?:–|—|-)\s*(?:hat|ist)\s+.+$/i;

function presentOnly(value){
 const raw=String(value||'').trim();
 return perfectTail.test(raw)?raw.replace(perfectTail,'').trim():raw;
}
function perfectOnly(value){
 const raw=String(value||'').trim();
 const m=raw.match(/\s*(?:–|—|-)\s*((?:hat|ist)\s+.+)$/i);
 return m?String(m[1]||'').trim():'';
}

function isVerb(item,raw){
 const type=String(item?.type||item?.wordType||item?.category||'').trim().toLowerCase();
 return type==='verb'||type==='verben'||/\bverb\b/.test(type)||perfectTail.test(raw);
}

function rewriteValue(value){
 if(typeof value!=='string')return value;
 return presentOnly(value);
}

function rewriteList(value){
 if(!Array.isArray(value))return value;
 return [...new Set(value.map(rewriteValue).filter(Boolean))];
}

function applyItem(item){
 if(!item||typeof item!=='object')return;
 const raw=rawTerm(item);
 if(!raw||!isVerb(item,raw))return;
 const perfect=perfectOnly(raw);
 if(perfect&&!item.perfectForm)item.perfectForm=perfect;
 const present=presentOnly(raw);
 if(!present||present===raw)return;

 item.term=present;
 if(typeof item.full==='string'&&item.full.trim()===raw)item.full=present;
 if(typeof item.word==='string'&&item.word.trim()===raw)item.word=present;
 if(typeof item.answer==='string')item.answer=rewriteValue(item.answer);
 else if(Array.isArray(item.answer))item.answer=rewriteList(item.answer);
 if(Array.isArray(item.answers))item.answers=rewriteList(item.answers);
 if(Array.isArray(item.accepted))item.accepted=rewriteList(item.accepted);
 item.presentForm=present;
}

function applyTheme(theme){
 if(!theme||typeof theme!=='object')return;
 for(const task of theme.tasks||[]){
  if(task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(String(task?.title||''))){
   for(const item of task.items||[])applyItem(item);
  }
 }
 for(const key of ['vocabularyOverviewItems','overviewOnlyItems']){
  for(const item of theme[key]||[])applyItem(item);
 }
}

function applyAll(){
 const all=window.L8_ALL_THEMES||{};
 if(Array.isArray(all))all.forEach(applyTheme);
 else Object.values(all).forEach(applyTheme);
 applyTheme(window.L8_THEME);
 return all;
}

applyAll();

const base=window.L8_CONTENT_READY;
const waits=[];
if(base&&typeof base.then==='function')waits.push(base);
for(const key of Object.keys(window)){
 if(key==='L8_CONTENT_READY'||key==='L8_VERB_PRESENT_ONLY_READY')continue;
 if(!/^L8.*READY$/i.test(key))continue;
 const value=window[key];
 if(value&&typeof value.then==='function'&&!waits.includes(value))waits.push(value);
}

const ready=Promise.allSettled(waits).then(()=>{
 const all=applyAll();
 const n=Number(document.body?.dataset?.theme||0);
 if(n&&all){
  const theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);
  if(theme)window.L8_THEME=theme;
 }
 return all;
});

window.L8_VERB_PRESENT_ONLY_READY=ready;
window.L8_CONTENT_READY=ready;
})();
