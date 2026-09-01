(function(){
  'use strict';

  function install(){
    const draft=window.ReleaseDraft;
    if(!draft||draft.__lessonCascadeInstalled)return !!draft;
    if(typeof draft.setLesson!=='function')return false;

    const oldSetLesson=draft.setLesson.bind(draft);
    draft.setLesson=function(lessonKey,value){
      oldSetLesson(lessonKey,value);
      let lesson=null;
      try{lesson=(window.RELEASE_CATALOG?.lessons||[]).find(item=>item.key===lessonKey)||null}catch(e){}
      (lesson?.themes||[]).forEach(theme=>{
        if(theme?.key&&typeof this.setTheme==='function')this.setTheme(lessonKey,theme.key,!!value);
      });
    };
    draft.__lessonCascadeInstalled=true;
    return true;
  }

  if(install())return;
  const timer=setInterval(()=>{
    if(install())clearInterval(timer);
  },250);
})();
