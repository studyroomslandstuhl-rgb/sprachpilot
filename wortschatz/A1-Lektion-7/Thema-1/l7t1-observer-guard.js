(function(){
'use strict';
if(window.__L7T1_OBSERVER_GUARD)return;
window.__L7T1_OBSERVER_GUARD=true;
const NativeObserver=window.MutationObserver;
if(typeof NativeObserver!=='function')return;
window.MutationObserver=class L7T1MutationObserver extends NativeObserver{
 constructor(callback){
  super((mutations,observer)=>{
   const onlyTranslationChanges=mutations.length>0&&mutations.every(mutation=>{
    const node=mutation.target?.nodeType===3?mutation.target.parentElement:mutation.target;
    return Boolean(node?.closest?.('.card-translation-box,.task-instruction'));
   });
   if(onlyTranslationChanges)return;
   callback(mutations,observer);
  });
 }
};
})();