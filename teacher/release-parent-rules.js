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
        const database=typeof Courses!=='undefined'&&Courses.database?Courses.database():(window.db||null);
        if(!database||!ReleaseDraft.courseCode)return;
        const wortschatz=enabledWortschatzLessons();
        const payload={wortschatz:wortschatz,updatedAt:new Date().toISOString(),source:'teacher-release-dashboard'};
        await database.collection('assignments').doc(String(ReleaseDraft.courseCode)).set(payload,{merge:false});
        if(ReleaseDraft.courseName&&String(ReleaseDraft.courseName)!==String(ReleaseDraft.courseCode)){
          await database.collection('assignments').doc(String(ReleaseDraft.courseName)).set(payload,{merge:false});
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

    function setDashboardStatus(message,kind){
      const el=document.getElementById('spStatus');
      if(!el)return;
      el.textContent=message;
      el.className='sp-status'+(kind?' '+kind:'');
    }

    function firestoreSafeKey(key){
      const text=String(key||'');
      if(!/^__.*__$/.test(text))return text;
      if(text==='__exam__')return 'task.html?task=exam';
      const core=text.replace(/^__+|__+$/g,'')||'field';
      return 'sp_'+core;
    }

    function sanitizeFirestoreObject(value){
      if(Array.isArray(value))return value.map(sanitizeFirestoreObject);
      if(!value||typeof value!=='object'||value instanceof Date)return value;
      const out={};
      Object.entries(value).forEach(([key,item])=>{
        const safeKey=firestoreSafeKey(key);
        const safeValue=sanitizeFirestoreObject(item);
        if(safeKey in out&&typeof out[safeKey]==='boolean'&&typeof safeValue==='boolean')out[safeKey]=out[safeKey]||safeValue;
        else out[safeKey]=safeValue;
      });
      return out;
    }

    // Ein einziger, sichtbarer Save-Handler. Keine verketteten Save-Overrides mehr.
    ReleaseDraft.save=async function(){
      if(this.__saveInFlight)return;
      if(!this.courseName||!this.data){
        setDashboardStatus('Keine Freigabe ausgewählt.','error');
        alert('Keine Freigabe ausgewählt.');
        return;
      }

      const button=document.querySelector('.save-btn');
      const originalText=button?button.textContent:'Speichern';
      this.__saveInFlight=true;
      if(button){button.disabled=true;button.textContent='Speichert …';}
      setDashboardStatus('Freigaben werden gespeichert …','');

      try{
        const normalized=this.normalizeBeforeSave();
        const payload=sanitizeFirestoreObject(normalized);
        const doc=String(this.courseName||'').trim();
        const code=String(this.courseCode||payload.courseCode||payload.kurs||payload.kursnummer||'').trim();
        payload.courseDocId=doc;
        if(code){payload.courseCode=code;payload.kurs=code;payload.kursnummer=code;}
        if(!payload.courseName)payload.courseName=code||doc;

        await Courses.update(doc,payload);
        this.data=payload;
        await syncLegacyAssignments();

        setDashboardStatus('Freigaben gespeichert.','ok');
        if(button)button.textContent='Gespeichert ✓';
      }catch(error){
        console.error('Freigaben konnten nicht gespeichert werden',error);
        const message=String(error&&error.message||error||'Unbekannter Fehler');
        setDashboardStatus('Speichern fehlgeschlagen: '+message,'error');
        if(button)button.textContent='Fehler';
        alert('Freigaben konnten nicht gespeichert werden: '+message);
      }finally{
        this.__saveInFlight=false;
        if(button){
          setTimeout(()=>{
            if(document.body.contains(button)){
              button.disabled=false;
              button.textContent=originalText;
            }
          },1400);
        }
      }
    };
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
})();
