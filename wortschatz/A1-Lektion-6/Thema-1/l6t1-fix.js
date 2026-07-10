function wordItems(){return words()}
const L6_T1_TASK_ICONS={
  'karteikarten.html':'🃏',
  'artikel.html':'🔤',
  'hoeren-schreiben.html':'🎧',
  'hoeren-bild.html':'🖼️',
  'nomen-satz-a.html':'💬',
  'nomen-satz-b.html':'🔁',
  'geraeusche.html':'🔊',
  'geraeusche-satz.html':'🌦️',
  'wetter-saetze.html':'✍️',
  'hoeren.html':'🎧',
  'pruefung.html':'★'
};
function l6t1Logout(){try{if(typeof logout==='function'){logout();return}}catch(e){}try{localStorage.removeItem('SP_USER_PROFILE');localStorage.removeItem('SP_STUDENT_PROFILE');localStorage.removeItem('SP_KEEP_LOGGED_IN');localStorage.removeItem('SP_LOGIN_ROLE');localStorage.removeItem('SP_ACTIVE_ROLE')}catch(e){}location.href='/index.html'}
function header(title,showReset=false){
  const h=document.querySelector('.topbar');if(!h)return;
  const p=profile()||{};
  const first=p.vorname||p.firstName||'';
  const last=p.nachname||p.lastName||'';
  const name=`${first} ${last}`.trim()||'Schüler/in';
  const course=p.kurs||p.kursnummer||p.courseCode||'';
  const dashboard=localStorage.getItem('SP_LOGIN_ROLE')==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
  h.innerHTML=`<div class="topbar-main sp-account-row"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · ${CFG.sub}</div></div></a><div class="account-tools"><span class="account-pill">${name}${course?' · '+course:''}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" onclick="l6t1Logout()">Abmelden</button></div></div><nav class="nav sp-page-nav"><a class="btn secondary" href="index.html">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a>${showReset?'<button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`;
}
function taskTotals(){return[['karteikarten.html',cardItems().length,'Karteikarten'],['artikel.html',nouns().length,'Artikel'],['hoeren-schreiben.html',wordItems().length,'Hören/Schreiben'],['hoeren-bild.html',words().length,'Hören/Karte'],['nomen-satz-a.html',sentenceItems().length,'Nomen → Satz A'],['nomen-satz-b.html',sentenceItems().length,'Nomen → Satz B'],['geraeusche.html',soundWords().length,'Geräusche'],['geraeusche-satz.html',soundWords().length,'Geräusch → Satz'],['wetter-saetze.html',20,'20 Sätze'],['hoeren.html',listenItems().length,'Hören'],['pruefung.html',12,'Prüfung']]}
function renderTaskList(includeExam=true){
  const ts=taskTotals().filter(t=>includeExam||t[0]!=='pruefung.html');
  return `<div class="grid task-grid">${ts.map((t,i)=>{const p=pctFor(t[0],t[1]);const icon=L6_T1_TASK_ICONS[t[0]]||'▶';return `<a class="module task-card" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="icon big-icon">${icon}</div><p>${t[0]==='pruefung.html'?'Teste dein Wissen.':'Wetter und Sätze üben.'}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</div>`;
}
function renderMenu(){
  const box=document.getElementById('teacherBox');
  if(box){box.innerHTML=isTeacher()?`<section class="card teacher-box"><div class="toggle-row"><div><b>Lehreroption</b><br><span class="small">Wetter „Nicht im Buch“ aktivieren: Gewitter, Blitz, Eis, Donner, Hagel, Nebel, Sturm.</span></div><label class="switch"><input type="checkbox" ${extraOn()?'checked':''} onchange="setExtraWeather(this.checked)"> Nicht im Buch</label></div></section>`:''}
  taskGrid.innerHTML=renderTaskList(true);
  const ts=taskTotals(),avg=Math.round(ts.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/ts.length)||0,done=ts.filter(t=>pctFor(t[0],t[1])>=100).length;
  totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';totalText.textContent=done+' / '+ts.length+' Aufgaben abgeschlossen';
}
(function(){
  const css=document.createElement('style');
  css.textContent='.topbar-main.sp-account-row{align-items:center}.sp-page-nav{margin-top:14px}.task-grid .module{text-align:center}.task-grid .icon.big-icon{font-size:46px;line-height:1;margin:14px auto;color:var(--lesson-main-dark)}.task-grid .module p{min-height:44px}.account-btn{cursor:pointer}';
  document.head.appendChild(css);
})();