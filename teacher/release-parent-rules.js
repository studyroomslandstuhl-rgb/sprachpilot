(function(){
  function install(){
    if(typeof ReleaseDraft==='undefined'||ReleaseDraft.__parentRulesInstalled)return;
    ReleaseDraft.__parentRulesInstalled=true;

    function findTheme(lessonKey,themeKey){
      try{
        const lesson=(RELEASE_CATALOG.lessons||[]).find(l=>l.key===lessonKey);
        return lesson?(lesson.themes||[]).find(t=>t.key===themeKey):null;
      }catch(e){return null;}
    }

    function setThemeChildren(lessonKey,themeKey,value){
      const th=findTheme(lessonKey,themeKey);
      if(!th)return;
      (th.tasks||[]).forEach(t=>{
        const file=Array.isArray(t)?t[0]:t.file;
        if(file&&typeof taskReleasePaths==='function')ReleaseDraft.setMany(taskReleasePaths(lessonKey,themeKey,file),value);
      });
      (th.sets||[]).forEach(set=>{
        if(typeof setPaths==='function')ReleaseDraft.setMany(setPaths(lessonKey,themeKey,set.key,set.aliases||[]),value);
        ReleaseDraft.set(['releases','wortschatz','lessons',lessonKey,'themes',themeKey,'sets',set.key],value);
        ReleaseDraft.set(['releases','Wortschatz','lessons',lessonKey,'themes',themeKey,'sets',set.key],value);
      });
    }

    const oldSetTheme=ReleaseDraft.setTheme?.bind(ReleaseDraft);
    ReleaseDraft.setTheme=function(lessonKey,themeKey,value){
      if(oldSetTheme)oldSetTheme(lessonKey,themeKey,value);
      else{
        if(typeof themeReleasePaths==='function')this.setMany(themeReleasePaths(lessonKey,themeKey),value);
        if(value&&this.enableLesson)this.enableLesson(lessonKey);
      }
      setThemeChildren(lessonKey,themeKey,value);
    };

    const oldNormalize=ReleaseDraft.normalizeBeforeSave?.bind(ReleaseDraft);
    ReleaseDraft.normalizeBeforeSave=function(){
      const data=oldNormalize?oldNormalize():this.data;
      try{
        (RELEASE_CATALOG.lessons||[]).forEach(lesson=>{
          (lesson.themes||[]).forEach(th=>{
            const isThemeOn=this.getAny(themeReleasePaths(lesson.key,th.key),false);
            if(isThemeOn){
              const hasAnyChild=[...(th.tasks||[]).map(t=>Array.isArray(t)?t[0]:t.file),...(th.sets||[]).map(s=>s.key)].some(Boolean);
              if(hasAnyChild){
                (th.tasks||[]).forEach(t=>{
                  const file=Array.isArray(t)?t[0]:t.file;
                  const paths=taskReleasePaths(lesson.key,th.key,file);
                  const current=this.getAny(paths,undefined);
                  if(current===undefined)this.setMany(paths,true);
                });
                (th.sets||[]).forEach(set=>{
                  const paths=setPaths(lesson.key,th.key,set.key,set.aliases||[]);
                  const current=this.getAny(paths,undefined);
                  if(current===undefined)this.setMany(paths,true);
                });
              }
            }
          });
        });
      }catch(e){console.warn('Parent release normalization failed',e)}
      return data;
    };
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
})();
