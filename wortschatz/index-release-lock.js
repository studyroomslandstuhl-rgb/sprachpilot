// wortschatz/index-release-lock.js
// Strenge Lektionsfreigabe für die Wortschatz-Startseite: courses/releases statt alter assignments.
(function(){
  function safeJson(s,f){try{return JSON.parse(s||'')||f}catch(e){return f}}
  function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')||{}}catch(e){return {}}}
  function code(){const p=profile();return String(p.kurs||p.kursnummer||p.courseCode||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function locked(data){return !data||data.defaultLocked!==false&&data.releaseMode!=='open'&&data.releaseMode!=='all'}
  function setStatus(text,bad){let box=document.getElementById('assignmentStatus');if(!box){box=document.createElement('div');box.id='assignmentStatus';const first=document.querySelector('.card');if(first)first.prepend(box)}box.className='assignment-status'+(bad?' no':'');box.innerHTML=text}
  async function getCourseData(courseCode){
    if(!courseCode||!window.db)return null;
    const variants=[courseCode,courseCode.toUpperCase(),courseCode.toLowerCase()].filter((v,i,a)=>v&&a.indexOf(v)===i);
    for(const c of variants){try{const snap=await db.collection('courses').doc(String(c)).get();if(snap.exists)return snap.data()||{}}catch(e){}}
    for(const field of ['courseCode','kurs','kursnummer','name','courseName','code']){try{const s=await db.collection('courses').where(field,'==',String(courseCode)).limit(1).get();if(s&&!s.empty)return s.docs[0].data()||{}}catch(e){}}
    return null;
  }
  function moduleOpen(data){
    const paths=[['enabledModules','Wortschatz'],['enabledModules','wortschatz'],['releases','Wortschatz','enabled'],['releases','wortschatz','enabled']];
    for(const p of paths){const v=val(data,p);if(v!==undefined)return v===true}
    return !locked(data);
  }
  function lessonOpen(data,lesson){
    if(!moduleOpen(data))return false;
    const paths=[['enabledLessons',lesson],['enabledLessons','wortschatz/'+lesson],['releases','wortschatz','lessons',lesson,'enabled'],['releases','Wortschatz','lessons',lesson,'enabled']];
    for(const p of paths){const v=val(data,p);if(v!==undefined)return v===true}
    return !locked(data);
  }
  function clean(a){return (a.textContent||'').replace('Gesperrt','').replace('Offen','').replace('🔒','').replace('✅','').trim()}
  function apply(data){
    let count=0;
    document.querySelectorAll('.lesson-btn[data-lesson]').forEach(old=>{
      const a=old.cloneNode(true);
      const lesson=a.dataset.lesson;
      const open=lessonOpen(data,lesson);
      a.textContent=clean(a);
      a.classList.toggle('open',open);
      a.classList.toggle('locked',!open);
      a.dataset.releaseOpen=open?'1':'0';
      a.onclick=function(e){if(!open){e.preventDefault();alert('Diese Lektion ist für deinen Kurs noch nicht freigeschaltet.')}};
      if(open)count++;
      old.replaceWith(a);
    });
    return count;
  }
  async function run(){
    const c=code();
    if(!c){apply(null);setStatus('Bitte zuerst auf der Startseite einloggen. Danach siehst du deine freigeschalteten Lektionen.',true);return}
    const data=await getCourseData(c);
    if(data){localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data));try{const p=profile();p.assignments=data;localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p))}catch(e){}}
    const count=apply(data);
    if(!data){setStatus('Für deinen Kurs <strong>'+c+'</strong> wurde keine Kurs-Freigabe gefunden. Alles bleibt gesperrt.',true);return}
    setStatus('Eingeloggt: <strong>'+((profile().vorname||'')+' '+(profile().nachname||'')).trim()+'</strong> · Kurs: <strong>'+c+'</strong><br>Freigeschaltet: <strong>'+count+'</strong> Lektion(en)',count===0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  setTimeout(run,500);setTimeout(run,1500);
})();
