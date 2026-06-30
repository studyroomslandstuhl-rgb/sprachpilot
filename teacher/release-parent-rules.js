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

    function enabledWortschatzLessons(){
      const out=[];
      try{
        (RELEASE_CATALOG.lessons||[]).forEach(lesson=>{
          const on=ReleaseDraft.getAny([
            ['enabledLessons',lesson.key],
            ['enabledLessons','wortschatz/'+lesson.key],
            ['releases','wortschatz','lessons',lesson.key,'enabled'],
            ['releases','Wortschatz','lessons',lesson.key,'enabled']
          ],false);
          if(on===true)out.push(lesson.key);
        });
      }catch(e){console.warn('Wortschatz assignment list failed',e)}
      return out;
    }

    async function syncLegacyAssignments(){
      try{
        if(!window.db||!ReleaseDraft.courseCode)return;
        const wortschatz=enabledWortschatzLessons();
        const payload={wortschatz:wortschatz,updatedAt:new Date().toISOString(),source:'teacher-release-dashboard'};
        await db.collection('assignments').doc(String(ReleaseDraft.courseCode)).set(payload,{merge:false});
        if(ReleaseDraft.courseName&&String(ReleaseDraft.courseName)!==String(ReleaseDraft.courseCode)){
          await db.collection('assignments').doc(String(ReleaseDraft.courseName)).set(payload,{merge:false});
        }
      }catch(e){console.warn('Legacy assignments sync failed',e)}
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

    const oldOpen=ReleaseDraft.open?.bind(ReleaseDraft);
    ReleaseDraft.open=function(course){
      if(oldOpen)oldOpen(course);
      this.data=this.data||{};
      this.data.releaseMode='locked';
      this.data.defaultLocked=true;
    };

    const oldNormalize=ReleaseDraft.normalizeBeforeSave?.bind(ReleaseDraft);
    ReleaseDraft.normalizeBeforeSave=function(){
      const data=oldNormalize?oldNormalize():this.data;
      try{
        this.data=this.data||data||{};
        this.data.releaseMode='locked';
        this.data.defaultLocked=true;
        data.releaseMode='locked';
        data.defaultLocked=true;
        (RELEASE_CATALOG.lessons||[]).forEach(lesson=>{
          const lessonOn=this.getAny([
            ['enabledLessons',lesson.key],
            ['enabledLessons','wortschatz/'+lesson.key],
            ['releases','wortschatz','lessons',lesson.key,'enabled'],
            ['releases','Wortschatz','lessons',lesson.key,'enabled']
          ],false);
          this.setMany([
            ['enabledLessons',lesson.key],
            ['enabledLessons','wortschatz/'+lesson.key],
            ['releases','wortschatz','lessons',lesson.key,'enabled'],
            ['releases','Wortschatz','lessons',lesson.key,'enabled']
          ],lessonOn===true);
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

    const oldSave=ReleaseDraft.save?.bind(ReleaseDraft);
    ReleaseDraft.save=async function(){
      if(oldSave)await oldSave();
      await syncLegacyAssignments();
    };
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
})();