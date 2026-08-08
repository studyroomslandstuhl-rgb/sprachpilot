(function(){
'use strict';

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

function uniqueStrings(list){
 const seen=new Set();
 const result=[];
 const removedDuplicates=[];
 for(const item of Array.isArray(list)?list:[]){
  const verb=cleanVerb(typeof item==='string'?item:item&&item.v);
  const key=canonicalVerb(verb);
  if(!verb)continue;
  if(seen.has(key)){
   removedDuplicates.push(verb);
   continue;
  }
  seen.add(key);
  result.push(verb);
 }
 return{result,removedDuplicates};
}

// Perfekt benutzt exakt denselben Verbkatalog wie der Bereich „Verben“.
// Modalverben oder andere Verben werden hier nicht mehr separat entfernt.
const source=window.SP_VERB_GROUP_DATA&&Array.isArray(window.SP_VERB_GROUP_DATA.verbs)
 ?window.SP_VERB_GROUP_DATA.verbs
 :[];
const filtered=uniqueStrings(source);

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
  if(!verb||byVerb.has(key))continue;
  byVerb.set(key,typeof item==='string'?{v:verb}:({...item,v:verb}));
 }
 window.ALL_VERBS=[...byVerb.values()];
}

window.SP_PERFEKT_VERB_FILTER={
 version:2,
 removedModals:[],
 removedDuplicates:filtered.removedDuplicates,
 uniqueCount:filtered.result.length,
 mirrorsVerben:true
};
})();
