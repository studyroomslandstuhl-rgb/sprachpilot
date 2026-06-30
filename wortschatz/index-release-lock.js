// wortschatz/index-release-lock.js
(function(){
  function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')||{}}catch(e){return {}}}
  function teacher(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();return r==='teacher'||r==='lehrer'||localStorage.getItem('SP_TEACHER_MODE')==='1'}
  function code(){const p=profile();return String(p.kurs||p.kursnummer||p.courseCode||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function store(){try{return window.db||(window.firebase&&firebase.firestore?firebase.firestore():null)}catch(e){return null}}
  function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function setStatus(text,bad){let box=document.getElementById('assignmentStatus');if(!box){box=document.createElement('div');box.id='assignmentStatus';const first=document.querySelector('.card');if(first)first.prepend(box)}box.className='assignment-status'+(bad?' no':'');box.innerHTML=text}
  async function getCourseData(courseCode){
    if(teacher())return {teacherAccess:true};
    const dbx=store();
    if(!courseCode||!dbx)return null;
    const variants=[courseCode,courseCode.toUpperCase(),courseCode.toLowerCase()].filter((v,i,a)=>v&&a.indexOf(v)===i);
    for(const c of variants){try{const snap=await dbx.collection('courses').doc(String(c)).get();if(snap.exists)return snap.data()||{}}catch(e){}}
    for(const field of ['courseCode','kurs','kursnummer','name','courseName','code']){try{const s=await dbx.collection('courses').where(field,'==',String(courseCode)).limit(1).get();if(s&&!s.empty)return s.docs[0].data()||{}}catch(e){}}
    return null;
  }
  function moduleOpen(data){
    if(teacher())return true;
    if(!data)return false;
    const paths=[['enabledModules','Wortschatz'],['enabledModules','wortschatz'],['releases','Wortschatz','enabled'],['releases','wortschatz','enabled']];
    for(const p of paths){const v=val(data,p);if(v!==undefined)return v===true}
    return false;
  }
  function lessonOpen(data,lesson){
    if(teacher())return true;
    if(!moduleOpen(data))return false;
    const paths=[['enabledLessons',lesson],['enabledLessons','wortschatz/'+lesson],['releases','wortschatz','lessons',lesson,'enabled'],['releases','Wortschatz','lessons',lesson,'enabled']];
    for(const p of paths){const v=val(data,p);if(v!==undefined)return v===true}
    return false;
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
      if(open){a.setAttribute('href','./'+lesson+'/')}else{a.removeAttribute('href')}
      a.onclick=function(e){if(!open){e.preventDefault();alert('Diese Lektion ist für deinen Kurs noch nicht freigeschaltet.')}};
      if(open)count++;
      old.replaceWith(a);
    });
    return count;
  }
  async function run(){
    const c=code();
    if(teacher()){const count=apply({teacherAccess:true});setStatus('Lehrerzugang: alle Lektionen sind zum Testen freigegeben.',false);return}
    if(!c){apply(null);setStatus('Bitte zuerst auf der Startseite einloggen. Danach siehst du deine freigeschalteten Lektionen.',true);return}
    const data=await getCourseData(c);
    if(data){localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data));try{const p=profile();p.assignments=data;localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p))}catch(e){}}
    const count=apply(data);
    if(!data){setStatus('Für deinen Kurs <strong>'+c+'</strong> wurde keine Kurs-Freigabe gefunden. Alles bleibt gesperrt.',true);return}
    setStatus('Eingeloggt: <strong>'+((profile().vorname||'')+' '+(profile().nachname||'')).trim()+'</strong> · Kurs: <strong>'+c+'</strong><br>Freigeschaltet: <strong>'+count+'</strong> Lektion(en)',count===0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  setTimeout(run,500);setTimeout(run,1500);setTimeout(run,3000);
})();