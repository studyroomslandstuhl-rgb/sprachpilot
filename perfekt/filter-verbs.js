(function(){
'use strict';

const MODAL_VERBS=new Set(['können','müssen','wollen','dürfen','sollen','möchten','mögen']);

function canonicalVerb(value){
 return String(value||'')
  .normalize('NFC')
  .trim()
  .toLowerCase()
  .replace(/\s+/g,' ');
}

function cleanVerb(value){
 return String(value||'')
  .normalize('NFC')
  .trim()
  .replace(/\s+/g,' ');
}

function filterStrings(list){
 const seen=new Set();
 const result=[];
 const removedModals=[];
 const removedDuplicates=[];
 for(const item of Array.isArray(list)?list:[]){
  const verb=cleanVerb(typeof item==='string'?item:item&&item.v);
  const key=canonicalVerb(verb);
  if(!verb)continue;
  if(MODAL_VERBS.has(key)){
   removedModals.push(verb);
   continue;
  }
  if(seen.has(key)){
   removedDuplicates.push(verb);
   continue;
  }
  seen.add(key);
  result.push(verb);
 }
 return{result,removedModals,removedDuplicates};
}

const source=window.SP_VERB_GROUP_DATA&&Array.isArray(window.SP_VERB_GROUP_DATA.verbs)
 ?window.SP_VERB_GROUP_DATA.verbs
 :[];
const filtered=filterStrings(source);

if(window.SP_VERB_GROUP_DATA){
 window.SP_VERB_GROUP_DATA={
  ...window.SP_VERB_GROUP_DATA,
  verbs:filtered.result.slice()
 };
}

if(Array.isArray(window.ALL_VERBS)){
 const byVerb=new Map();
 for(const item of window.ALL_VERBS){
  const verb=cleanVerb(typeof item==='string'?item:item&&item.v);
  const key=canonicalVerb(verb);
  if(!verb||MODAL_VERBS.has(key)||byVerb.has(key))continue;
  byVerb.set(key,typeof item==='string'?{v:verb}:({...item,v:verb}));
 }
 window.ALL_VERBS=[...byVerb.values()];
}

window.SP_PERFEKT_VERB_FILTER={
 version:1,
 modalVerbs:[...MODAL_VERBS],
 removedModals:filtered.removedModals,
 removedDuplicates:filtered.removedDuplicates,
 uniqueCount:filtered.result.length
};
})();
