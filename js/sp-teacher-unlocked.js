(function(){
  if(window.__SP_TEACHER_UNLOCKED__)return;
  window.__SP_TEACHER_UNLOCKED__=true;

  function role(){
    return String(
      localStorage.getItem('SP_LOGIN_ROLE')||
      localStorage.getItem('SP_ACTIVE_ROLE')||
      localStorage.getItem('SP_AUTH_ROLE')||
      localStorage.getItem('SP_LOGIN_CONTEXT')||''
    ).toLowerCase();
  }
  function profile(){try{return JSON.parse(localStorage.getItem('SP_TEACHER_PROFILE')||localStorage.getItem('SP_USER_PROFILE')||'{}')||{}}catch(e){return{}}}
  function isTeacher(){
    const r=role(),p=profile();
    return r==='teacher'||r==='lehrer'||r==='admin'||p.role==='teacher'||p.role==='lehrer'||p.isTeacher===true||p.teacher===true||p.admin===true;
  }
  if(!isTeacher())return;

  window.spTeacherCanSeeAll=true;
  window.spIsTeacherUnrestricted=function(){return true};
  if(typeof window.spCanSaveStudentProgress!=='function')window.spCanSaveStudentProgress=function(){return false};

  function patchFunctions(){
    try{window.isExamUnlocked=function(){return true}}catch(e){}
    try{window.allPrereqComplete=function(){return true}}catch(e){}
    try{window.examUnlocked=function(){return true}}catch(e){}
    try{window.unlocked=function(){return true}}catch(e){}
    try{window.l6t4ExamUnlocked=function(){return true}}catch(e){}
    try{window.l6t3ExamUnlocked=function(){return true}}catch(e){}
    if(typeof window.pctFor==='function'&&!window.pctFor.__teacherUnlocked){
      const old=window.pctFor;
      const patched=function(file,total){
        if(String(file||'').includes('pruefung')||String(file||'').includes('exam'))return old(file,total)||0;
        return Math.max(old(file,total)||0,100);
      };
      patched.__teacherUnlocked=true;
      window.pctFor=patched;
    }
    if(typeof window.pct==='function'&&!window.pct.__teacherUnlocked){
      const old=window.pct;
      const patched=function(file,total){
        if(String(file||'').includes('pruefung')||String(file||'').includes('exam'))return old(file,total)||0;
        return Math.max(old(file,total)||0,100);
      };
      patched.__teacherUnlocked=true;
      window.pct=patched;
    }
  }
  function unlockDom(){
    document.querySelectorAll('.locked,.exam-locked,[aria-disabled="true"]').forEach(el=>{
      el.classList.remove('locked','exam-locked');
      el.removeAttribute('aria-disabled');
      el.style.pointerEvents='';
      el.style.opacity='';
      const start=el.querySelector?.('.start');
      if(start&&/gesperrt/i.test(start.textContent||''))start.textContent='Starten';
      const p=el.querySelector?.('p');
      if(p&&/gesperrt|freigeschaltet|100/i.test(p.textContent||''))p.textContent='Lehreransicht: frei zum Testen.';
    });
    document.querySelectorAll('a.module').forEach(a=>{a.style.pointerEvents='';a.removeAttribute('aria-disabled')});
  }
  function run(){patchFunctions();unlockDom()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  window.addEventListener('load',run);
  [0,100,400,1000,2200].forEach(t=>setTimeout(run,t));
  try{new MutationObserver(()=>setTimeout(run,30)).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();