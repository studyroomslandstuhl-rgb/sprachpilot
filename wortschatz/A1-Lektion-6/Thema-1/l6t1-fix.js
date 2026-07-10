function l6ReleaseData(){try{return (window.SprachPilotRelease&&SprachPilotRelease.localData&&SprachPilotRelease.localData())||JSON.parse(localStorage.getItem('SP_COURSE_RELEASES')||'{}')||((profile()||{}).assignments)||{}}catch(e){return {}}}
function l6Val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
function l6Any(paths,fallback){const data=l6ReleaseData();for(const p of paths){const v=l6Val(data,p);if(v!==undefined)return v===true}return fallback}
function l6SetPaths(key){const aliases={book:['book','buch','basis','im-buch','im_buch'],extra:['extra','plus','nicht-im-buch','nicht_im_buch','nicht-aus-dem-buch']}[key]||[key];const out=[];aliases.forEach(k=>{out.push(['enabledSets','A1-Lektion-6/Thema-1/'+k],['enabledSets','wortschatz/A1-Lektion-6/Thema-1/'+k],['enabledSets','Thema-1/'+k],['enabledSets',k],['releases','wortschatz','lessons','A1-Lektion-6','themes','Thema-1','sets',k],['releases','Wortschatz','lessons','A1-Lektion-6','themes','Thema-1','sets',k])});return out}
function l6HasExplicitSetData(){const data=l6ReleaseData();return l6SetPaths('book').concat(l6SetPaths('extra')).some(p=>l6Val(data,p)!==undefined)}
function bookOn(){return l6Any(l6SetPaths('book'),true)}
function extraOn(){return l6Any(l6SetPaths('extra'),localStorage.getItem('SP_L6_T1_EXTRA_WEATHER')==='1')}
function setExtraWeather(v){localStorage.setItem('SP_L6_T1_EXTRA_WEATHER',v?'1':'0');Object.keys(localStorage).filter(k=>k.startsWith(CFG.key)).forEach(k=>localStorage.removeItem(k));location.reload()}
function words(){return (bookOn()?BASE_WORDS:[]).concat(extraOn()?EXTRA_WORDS:[])}
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
function l6StatusBox(){const b=bookOn(),e=extraOn(),explicit=l6HasExplicitSetData();return `<section class="card release-status-card"><h2>Wortschatz-Freigabe</h2><div class="release-pill-row"><span class="release-pill ${b?'is-on':'is-off'}">Im Buch: ${b?'freigegeben':'gesperrt'}</span><span class="release-pill ${e?'is-on':'is-off'}">Nicht im Buch: ${e?'freigegeben':'gesperrt'}</span></div><p class="small">${explicit?'Diese Einstellung kommt aus der Kursfreigabe im Lehrer-Dashboard.':'Noch keine explizite Kursfreigabe gefunden: Basiswortschatz bleibt sichtbar, Zusatzwörter bleiben gesperrt.'}</p>${isTeacher()?'<p class="small"><a href="/teacher/index.html">Im Lehrer-Dashboard ändern</a></p>':''}</section>`}
function taskTotals(){return[['karteikarten.html',cardItems().length,'Karteikarten'],['artikel.html',nouns().length,'Artikel'],['hoeren-schreiben.html',wordItems().length,'Hören/Schreiben'],['hoeren-bild.html',words().length,'Hören/Karte'],['nomen-satz-a.html',sentenceItems().length,'Nomen → Satz A'],['nomen-satz-b.html',sentenceItems().length,'Nomen → Satz B'],['geraeusche.html',soundWords().length,'Geräusche'],['geraeusche-satz.html',soundWords().length,'Geräusch → Satz'],['wetter-saetze.html',20,'20 Sätze'],['hoeren.html',listenItems().length,'Hören'],['pruefung.html',12,'Prüfung']]}
function renderTaskList(includeExam=true){
  const ts=taskTotals().filter(t=>includeExam||t[0]!=='pruefung.html');
  return `<div class="grid task-grid">${ts.map((t,i)=>{const p=pctFor(t[0],t[1]);const icon=L6_T1_TASK_ICONS[t[0]]||'▶';return `<a class="module task-card" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="icon big-icon">${icon}</div><p>${t[0]==='pruefung.html'?'Teste dein Wissen.':'Wetter und Sätze üben.'}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</div>`;
}
function renderOverview(target){target.innerHTML=['Im Buch','Nicht im Buch'].map(g=>{const visible=g==='Im Buch'?bookOn():extraOn();const list=(g==='Im Buch'?BASE_WORDS:EXTRA_WORDS);if(!visible)return `<section class="type-block locked-set"><div class="type-title">${g} 🔒</div><p class="small">Diese Wortschatzliste ist für deinen Kurs noch nicht freigegeben.</p></section>`;return `<section class="type-block"><div class="type-title">${g}</div>${list.map(w=>`<div class="word-row"><div class="word-placeholder">${w.symbol}</div><div><b>${full(w)}</b><br><span class="small">${w.sentence}${w.altSentences?' / '+w.altSentences.join(' / '):''}</span><div class="small">Übersetzung (${LANGS[langKey()]||'EN'}): ${tr(w)}</div><span class="tag">${w.type}</span></div></div>`).join('')}</section>`}).join('')}
function renderMenu(){
  const box=document.getElementById('teacherBox');
  if(box){box.innerHTML=l6StatusBox()}
  const usable=words().length>0;
  taskGrid.innerHTML=usable?renderTaskList(true):'<section class="card"><h2>Keine Wörter freigegeben</h2><p class="small">Für dieses Thema ist noch keine Wortschatzliste freigeschaltet.</p></section>';
  const ts=usable?taskTotals():[],avg=ts.length?Math.round(ts.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/ts.length)||0:0,done=ts.filter(t=>pctFor(t[0],t[1])>=100).length;
  totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';totalText.textContent=done+' / '+ts.length+' Aufgaben abgeschlossen';
}
(function(){
  const css=document.createElement('style');
  css.textContent='.topbar-main.sp-account-row{align-items:center}.sp-page-nav{margin-top:14px}.task-grid .module{text-align:center}.task-grid .icon.big-icon{font-size:46px;line-height:1;margin:14px auto;color:var(--lesson-main-dark)}.task-grid .module p{min-height:44px}.account-btn{cursor:pointer}.release-status-card{margin:16px 0}.release-pill-row{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}.release-pill{display:inline-flex;border-radius:999px;padding:9px 14px;font-weight:900;border:2px solid var(--lesson-line);background:#fff}.release-pill.is-on{background:#dcfce7;border-color:#22c55e;color:#166534}.release-pill.is-off{background:#fee2e2;border-color:#ef4444;color:#991b1b}.locked-set{opacity:.72;border-style:dashed}';
  document.head.appendChild(css);
})();
try{setTimeout(()=>{if(window.SprachPilotRelease&&SprachPilotRelease.refresh)SprachPilotRelease.refresh().then(()=>{try{renderMenu()}catch(e){}})},900)}catch(e){}