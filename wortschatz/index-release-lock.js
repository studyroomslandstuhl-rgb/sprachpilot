// wortschatz/index-release-lock.js
(function(){
  function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')||{}}catch(e){return {}}}
  function allAccess(){
    const p=profile();
    const c=String(p.kurs||p.kursnummer||p.courseCode||localStorage.getItem('SP_PREVIEW_COURSE')||'').toUpperCase();
    try{const prev=JSON.parse(sessionStorage.getItem('SP_TEACHER_PREVIEW')||'null');if(prev&&prev.allAccess===true)return true}catch(e){}
    return c==='ALLE'||localStorage.getItem('SP_TEACHER_ALL_ACCESS')==='1';
  }
  function code(){const p=profile();return String(p.kurs||p.kursnummer||p.courseCode||localStorage.getItem('SP_COURSE_CODE')||localStorage.getItem('SP_PREVIEW_COURSE')||'').trim()}
  function store(){try{return window.db||(window.firebase&&firebase.firestore?firebase.firestore():null)}catch(e){return null}}
  function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function setStatus(text,bad){let box=document.getElementById('assignmentStatus');if(!box){box=document.createElement('div');box.id='assignmentStatus';const first=document.querySelector('.card');if(first)first.prepend(box)}box.className='assignment-status'+(bad?' no':'');box.innerHTML=text}
  async function getCourseData(courseCode){
    if(allAccess())return {allAccess:true};
    const dbx=store();
    if(!courseCode||!dbx)return null;
    const variants=[courseCode,courseCode.toUpperCase(),courseCode.toLowerCase()].filter((v,i,a)=>v&&a.indexOf(v)===i);
    for(const c of variants){try{const snap=await dbx.collection('courses').doc(String(c)).get();if(snap.exists)return snap.data()||{}}catch(e){}}
    for(const field of ['courseCode','kurs','kursnummer','name','courseName','code']){try{const s=await dbx.collection('courses').where(field,'==',String(courseCode)).limit(1).get();if(s&&!s.empty)return s.docs[0].data()||{}}catch(e){}}
    return null;
  }
  function explicitLesson(data,lesson){
    if(allAccess()||data?.allAccess)return true;
    if(!data)return false;
    const moduleOff=[['enabledModules','Wortschatz'],['enabledModules','wortschatz'],['releases','Wortschatz','enabled'],['releases','wortschatz','enabled']].some(p=>val(data,p)===false);
    if(moduleOff)return false;
    const lessonPaths=[['enabledLessons',lesson],['enabledLessons','wortschatz/'+lesson],['enabledLessons','Wortschatz/'+lesson],['releases','wortschatz','lessons',lesson,'enabled'],['releases','Wortschatz','lessons',lesson,'enabled']];
    if(lessonPaths.some(p=>val(data,p)===false))return false;
    if(lessonPaths.some(p=>val(data,p)===true))return true;
    const prefixes=[lesson+'/', 'wortschatz/'+lesson+'/', 'Wortschatz/'+lesson+'/'];
    if(Object.keys(data.enabledThemes||{}).some(k=>data.enabledThemes[k]===true&&prefixes.some(p=>String(k).startsWith(p))))return true;
    if(Object.keys(data.enabledTasks||{}).some(k=>data.enabledTasks[k]===true&&prefixes.some(p=>String(k).startsWith(p))))return true;
    const rel=data.releases?.wortschatz||data.releases?.Wortschatz||{};
    const themes=rel.lessons?.[lesson]?.themes||{};
    return Object.values(themes).some(t=>t&&t.enabled===true)||Object.values(themes).some(t=>t&&t.tasks&&Object.values(t.tasks).some(v=>v===true));
  }
  function clean(a){return (a.textContent||'').replace('Gesperrt','').replace('Offen','').replace('🔒','').replace('✅','').trim()}
  function apply(data){
    let count=0;
    document.querySelectorAll('.lesson-btn[data-lesson]').forEach(old=>{
      const a=old.cloneNode(true);
      const lesson=a.dataset.lesson;
      const open=explicitLesson(data,lesson);
      a.textContent=clean(a);
      a.classList.toggle('open',open);
      a.classList.toggle('locked',!open);
      a.dataset.releaseOpen=open?'1':'0';
      if(open){a.setAttribute('href','./'+lesson+'/')}else{a.removeAttribute('href')}
      a.onclick=function(e){if(!open){e.preventDefault();alert('Diese Lektion ist für deinen Kurs noch nicht freigeschaltet.')}};
      a.style.display='';
      if(open)count++;
      old.replaceWith(a);
    });
    return count;
  }
  async function run(){
    const c=code();
    if(allAccess()){const count=apply({allAccess:true});setStatus('All-Access: alle Wortschatz-Lektionen sind zum Testen freigegeben.',false);return}
    if(!c){apply(null);setStatus('Bitte zuerst auf der Startseite einloggen. Danach siehst du deine freigeschalteten Lektionen.',true);return}
    const data=await getCourseData(c);
    if(data){localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data));try{const p=profile();p.assignments=data;localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p))}catch(e){}}
    const count=apply(data);
    if(!data){setStatus('Für deinen Kurs <strong>'+c+'</strong> wurde keine Kurs-Freigabe gefunden. Alles bleibt gesperrt.',true);return}
    setStatus('Eingeloggt: <strong>'+((profile().vorname||'')+' '+(profile().nachname||'')).trim()+'</strong> · Kurs: <strong>'+c+'</strong><br>Freigeschaltet: <strong>'+count+'</strong> Lektion(en)',count===0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  setTimeout(run,700);
  setTimeout(run,1800);
})();