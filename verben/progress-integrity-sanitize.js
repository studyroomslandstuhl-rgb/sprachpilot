(function(){
'use strict';
if(window.__SP_VERB_PROGRESS_INTEGRITY_SANITIZE_V2)return;
window.__SP_VERB_PROGRESS_INTEGRITY_SANITIZE_V2=true;
const E=window.VerbGroupsEngine;if(!E)return;
const originalLoad=E.load.bind(E);
function marker(){const p=window.VerbGroupsProfile||{};const id=[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';return`SP_VERB_FALSE_COMPLETE_SANITIZED_V2_${id}`}
E.load=function(){
 const result=originalLoad();
 if(E.isPreview?.()||localStorage.getItem(marker())==='1')return result;
 let changed=false;
 for(const group of E.GROUPS||[]){
  const gs=E.groupState(group.id);if(!gs)continue;
  for(const run of Object.values(gs.runs||{})){
   for(const task of E.LEARN||[]){
    const st=run?.tasks?.[task];if(!st)continue;
    const full=(st.done||[]).length>=group.verbs.length&&group.verbs.length>0;
    const awarded=Number(run?.awards?.tasks?.[task]||0)>0;
    if(full&&!awarded&&!st.recoveredByVerb){st.done=[];st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;run.completed=false;changed=true}
   }
  }
 }
 if(changed)E.save();
 try{localStorage.setItem(marker(),'1')}catch{}
 window.SP_VERB_FALSE_COMPLETE_SANITIZED=changed;
 return result
};
})();