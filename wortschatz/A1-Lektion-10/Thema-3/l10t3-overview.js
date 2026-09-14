import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T3||{tasks:[]};
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-3';
const tasks=D.tasks||[];
const practice=tasks.filter(function(t){return !t.exam});
const exam=tasks.find(function(t){return t.exam});
const esc=function(v){
  return String(v??'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
};

function profile(){
  try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}
  catch(e){return{}}
}
function owner(){
  const p=profile();
  return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student')
    .trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_');
}
function preview(){
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||profile().role||'').toLowerCase();
  return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||
    sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||
    localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
}
function run(){
  return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
}
function localPct(t){
  if(preview())return 0;
  try{
    const s=JSON.parse(localStorage.getItem('SP_L10_'+owner()+'_T3_'+t.id)||'null');
    if(!s||Number(s._run||1)!==run())return 0;
    if(t.exam&&Number.isFinite(Number(s.percent)))return Number(s.percent);
    const total=Number(s.total||0);
    const done=Array.isArray(s.done)?s.done.length:0;
    return total?Math.min(100,Math.round(done/total*100)):0;
  }catch(e){return 0}
}
function teacherNote(){
  return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Fortschritte und Punkte der Teilnehmer werden nicht verändert.</div>':'';
}
function taskCard(t,i,progress,examOpen){
  const p=Math.round(progress[t.id]||0);
  const locked=t.exam&&!examOpen;
  const summary=t.cardText||t.text||'';
  if(locked){
    return '<div class="l8-card l8-task-card locked"><div class="l8-task-number">'+(i+1)+'. '+esc(t.title)+'</div><div class="emoji">'+esc(t.icon)+'</div><p>'+esc(summary)+'</p><div class="l8-progress"><div style="width:0"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>';
  }
  const action=t.exam&&preview()?'Prüfung ansehen':p>=100?'Fertig':'Starten';
  return '<a class="l8-card l8-task-card '+(p>=100?'done':'')+'" href="task.html?task='+encodeURIComponent(t.id)+'"><div class="l8-task-number">'+(i+1)+'. '+esc(t.title)+'</div><div class="emoji">'+esc(t.icon)+'</div><p>'+esc(summary)+'</p><div class="l8-progress"><div style="width:'+p+'%"></div></div><div class="l8-small">'+p+'%</div><div class="l8-task-start">'+action+'</div></a>';
}
function polishHeader(){
  document.querySelectorAll('.sp-header__nav-link').forEach(function(a){
    if(String(a.textContent||'').trim()==='Übersicht')a.setAttribute('href','uebersicht.html');
  });
}
function scrollLast(){
  let id='';
  try{id=sessionStorage.getItem('SP_L10_LAST_TASK_T3')||localStorage.getItem('SP_L10_LAST_TASK_T3')||''}catch(e){}
  if(!id)return;
  const links=Array.from(document.querySelectorAll('a.l8-task-card'));
  const target=links.find(function(a){return new URL(a.href,location.href).searchParams.get('task')===id});
  if(target)setTimeout(function(){target.scrollIntoView({block:'center'})},80);
}

async function main(){
  const progress=Object.fromEntries(tasks.map(function(t){return[t.id,localPct(t)]}));
  if(!preview()){
    try{
      const m=await import('/js/progress.js?v=20260831-central6');
      const cloud=await m.loadCurrentStudentProgress();
      const topic=cloud?.wortschatz?.[TOPIC];
      if(topic){
        practice.forEach(function(t){
          const record=topic.tasks?.[t.id]||topic.tasks?.['task.html?task='+t.id];
          if(record&&Number(record.run||run())===run())progress[t.id]=Math.max(progress[t.id],Number(record.percent||0));
        });
        if(exam)progress[exam.id]=Math.max(progress[exam.id],Number(topic.exam?.percent||topic.exam?.bestPercent||0));
      }
    }catch(e){console.warn('L10T3 Fortschritt konnte nicht geladen werden.',e)}
  }
  const completed=practice.filter(function(t){return progress[t.id]>=100}).length;
  const sum=practice.reduce(function(n,t){return n+(progress[t.id]||0)},0);
  const avg=Math.round(sum/Math.max(1,practice.length));
  const examOpen=preview()||completed===practice.length;
  const points=preview()?'Vorschau':(Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0)+' Punkte';
  const header=renderSpHeader({subtitle:'sollen, Arztempfehlungen und Krankmeldung · A1 Lektion 10 · Thema 3',color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'}});
  const practiceHtml=practice.map(function(t,i){return taskCard(t,i,progress,examOpen)}).join('');
  const examHtml=exam?'<section class="l8-grid l8-exam-grid">'+taskCard(exam,practice.length,progress,examOpen)+'</section>':'';
  root.innerHTML='<div class="l10-theme-page">'+header+'<div class="l8-wrap">'+teacherNote()+
    '<section class="l8-card l8-progress-card"><div class="l8-progress-circle">'+avg+'%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">'+completed+' / '+practice.length+' Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:'+avg+'%"></div></div><p class="l8-small l8-theme-subtitle">sollen, Arztempfehlungen und Krankmeldung</p><div class="l8-tags"><span class="l8-tag">27 Wörter</span><span class="l8-tag">sollen</span><span class="l8-tag">Krankmeldung</span></div></div><div class="l8-score-slot"><div class="l8-score-panel"><div class="l8-score-label">Punkte</div><div class="l8-score-total">'+points+'</div><div class="l8-small">Fortschritt wird automatisch gespeichert.</div></div></div></section>'+
    '<section class="l8-grid">'+practiceHtml+'</section>'+examHtml+'<footer>© SprachPilot</footer></div></div>';
  bindSpHeader(root);
  polishHeader();
  [50,250,700].forEach(function(ms){setTimeout(scrollLast,ms)});
}

main().catch(function(error){
  console.error('L10T3 Übersicht',error);
  root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h1>Thema konnte nicht geladen werden.</h1><button class="l8-btn primary" onclick="location.reload()">Neu laden</button></section></div>';
});
