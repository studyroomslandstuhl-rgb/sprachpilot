(function(){
'use strict';
if(window.__SP_VERB_GROUP_INTEGRITY_V1)return;
window.__SP_VERB_GROUP_INTEGRITY_V1=true;
const E=window.VerbGroupsEngine;if(!E||typeof E.setActiveVerbs!=='function')return;
const original=E.setActiveVerbs.bind(E);
const clean=v=>String(v||'').normalize('NFC').trim().toLowerCase().replace(/\s+/g,' ');
function unique(list){const seen=new Set(),out=[];for(const raw of list||[]){const v=String(raw||'').trim(),k=clean(v);if(v&&k&&!seen.has(k)){seen.add(k);out.push(v)}}return out}
function rebuildExact(list){
 const ordered=unique(list),verbs=E.VERBS,groups=E.GROUPS;
 // E.VERBS und E.GROUPS sind Getter auf die internen Arrays. Wir verändern
 // diese Arrays direkt, damit die vom Lehrer gespeicherte Freigabereihenfolge
 // nicht noch einmal durch eine alte kanonische Sortierung verändert wird.
 if(Array.isArray(verbs))verbs.splice(0,verbs.length,...ordered);
 if(Array.isArray(groups)){
  groups.splice(0,groups.length);
  for(let i=0;i<ordered.length;i+=20){
   const part=ordered.slice(i,i+20);
   groups.push({id:groups.length+1,verbs:part,signature:part.join('|')});
  }
 }
 const seen=new Set(),duplicates=[];
 for(const g of groups||[])for(const v of g.verbs||[]){const k=clean(v);if(seen.has(k))duplicates.push(v);else seen.add(k)}
 window.SP_VERB_GROUP_INTEGRITY={count:ordered.length,groups:(groups||[]).length,duplicates,groupSizes:(groups||[]).map(g=>g.verbs.length)};
 return ordered
}
E.setActiveVerbs=function(list){
 const ordered=unique(list);
 original(ordered);
 rebuildExact(ordered);
};
})();