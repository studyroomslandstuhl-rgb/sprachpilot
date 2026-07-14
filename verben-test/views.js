function header(){
  const name=[profile?.vorname||profile?.firstName,profile?.nachname||profile?.lastName].filter(Boolean).join(' ')||'Schüler/in';
  topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>SprachPilot</h1><div class="subtitle">Verben Test · neues unabhängiges Paketsystem</div></div></a><div class="account"><span class="pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a></div></div><nav class="nav"><a class="btn secondary" href="/index.html">← Startseite</a><button class="secondary" data-route="home">Verben Test</button><button class="danger" id="resetTestBtn">Testfortschritt löschen</button></nav>`;
  document.getElementById('resetTestBtn')?.addEventListener('click',resetTest);
}
function lockedPage(){app.innerHTML=`<section class="card locked-box"><h2>Verben Test ist gesperrt</h2><p>Diese neue Testkategorie muss zuerst für deinen Kurs freigeschaltet werden.</p><div class="actions"><a class="btn secondary" href="/index.html">Zur Startseite</a></div></section>`}
function errorPage(message){app.innerHTML=`<section class="card error-box"><h2>Verben Test konnte nicht geladen werden</h2><p>${esc(message)}</p><div class="actions"><button onclick="location.reload()">Neu laden</button><a class="btn secondary" href="/index.html">Zur Startseite</a></div></section>`}

function route(){const p=new URLSearchParams(location.search);return{task:p.get('task')||'',mode:p.get('mode')||'',view:p.get('view')||''}}
function navigate(params={},replace=false){const url=new URL('/verben-test/',location.origin);Object.entries(params).forEach(([key,value])=>{if(value)url.searchParams.set(key,value)});history[replace?'replaceState':'pushState'](null,'',url.pathname+url.search);renderRoute()}
function goHome(){navigate({},true)}
function renderRoute(){header();const r=route();if(r.task){renderTask(r.task);return}if(r.mode==='choose'){renderChoose();return}if(r.mode==='assess'){renderAssessment();return}if(r.view==='groups'){renderGroups();return}renderHome()}

function renderHome(){
  const pkg=activePackage();
  if(!pkg){
    const available=newVerbs().length;
    app.innerHTML=`<section class="card hero"><h2>Neues Verben-System testen</h2><p>Nur drei Gruppen: <b>Neu</b>, <b>Aktiv</b> und <b>Gelernt</b>. Ein aktives Paket bleibt unverändert und enthält bis zu ${PACKAGE_SIZE} Verben.</p><div class="actions"><button data-route="choose" ${available?'':'disabled'}>20 Verben wählen</button><button class="secondary" data-route="assess" ${available?'':'disabled'}>Verben einschätzen</button><button class="secondary" data-route="groups">Gruppen ansehen</button></div>${available?'':`<div class="notice">Alle verfügbaren Verben sind bereits gelernt.</div>`}</section>
    <section class="card"><div class="stats"><div class="stat"><b>${newVerbs().length}</b>Neu</div><div class="stat"><b>0</b>Aktiv</div><div class="stat"><b>${state.learned.length}</b>Gelernt</div><div class="stat"><b>${state.archives.length}</b>Paket(e)</div></div></section>`;
    bindRouteButtons();return;
  }
  const done=TASKS.filter(t=>taskPercent(t.id)>=100).length;
  app.innerHTML=`<section class="card hero"><h2>Aktives Paket</h2><p>Dieses Paket enthält genau ${pkg.verbs.length} feste Verben. Alle Aufgaben und Antwortmöglichkeiten verwenden ausschließlich diese Verben.</p><div class="package-list">${pkg.verbs.map(v=>`<span class="pill">${esc(v)}</span>`).join('')}</div></section>
  <section class="card"><div class="stats"><div class="stat"><b>${newVerbs().length}</b>Neu</div><div class="stat"><b>${pkg.verbs.length}</b>Aktiv</div><div class="stat"><b>${state.learned.length}</b>Gelernt</div><div class="stat"><b>${packagePoints()}</b>Punkte im Paket</div></div></section>
  <section class="card"><div class="task-head"><div><h2>Aufgaben</h2><div class="small">${done} / ${TASKS.length} Aufgaben abgeschlossen · je Aufgabe einmalig 5 Punkte</div></div><button class="secondary" data-route="groups">Gruppen ansehen</button></div><div class="grid">${TASKS.map(task=>taskCard(task)).join('')}${examCard()}</div></section>
  ${completedPackage()?`<section class="card finish"><h2>Paket vollständig geschafft</h2><p>Alle Aufgaben und die Prüfung sind bei 100 %. Die ${pkg.verbs.length} Verben können jetzt nach „Gelernt“ verschoben werden.</p><button id="finishPackageBtn">Paket abschließen</button></section>`:''}`;
  document.getElementById('finishPackageBtn')?.addEventListener('click',finishPackage);bindRouteButtons();
}
function taskCard(task){const pct=taskPercent(task.id),points=Number(activePackage()?.taskPoints?.[task.id]||0);return `<a class="module" href="?task=${encodeURIComponent(task.id)}" data-link-route><div class="icon">${task.icon}</div><h3>${esc(task.title)}</h3><p class="small">${esc(task.desc)}</p><div class="progress"><div class="bar" style="width:${pct}%"></div></div><div class="small">${pct}% · ${points}/5 Punkte</div></a>`}
function examCard(){const open=allTasksComplete(),best=activePackage()?.examBest||0;return `<a class="module ${open?'':'locked'}" href="${open?'?task=pruefung':'#'}" ${open?'data-link-route':'aria-disabled="true"'}><div class="icon">⭐</div><h3>Prüfung</h3><p class="small">20 zufällige Fragen, genau eine pro Paketverb. Bestes Ergebnis zählt.</p><div class="progress"><div class="bar" style="width:${best}%"></div></div><div class="small">${open?`${best}/100 Punkte`:'Erst nach allen Aufgaben'}</div></a>`}
function bindRouteButtons(){document.querySelectorAll('[data-route]').forEach(btn=>btn.addEventListener('click',()=>{const target=btn.dataset.route;if(target==='home')navigate({});else if(target==='choose')navigate({mode:'choose'});else if(target==='assess')navigate({mode:'assess'});else if(target==='groups')navigate({view:'groups'})}));document.querySelectorAll('[data-link-route]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();const url=new URL(link.href,location.href);navigate(Object.fromEntries(url.searchParams.entries()))}))}

function renderGroups(){
  const groups=[{title:'Neu',verbs:newVerbs()},{title:'Aktiv',verbs:packageVerbs()},{title:'Gelernt',verbs:state.learned}];
  app.innerHTML=`<section class="card"><div class="task-head"><div><h2>Verbgruppen</h2><p class="small">„Neu“ wird automatisch berechnet. Nur „Aktiv“ und „Gelernt“ werden gespeichert.</p></div><button class="secondary" data-route="home">Zurück</button></div><div class="tabs">${groups.map((g,i)=>`<button class="tab ${i===0?'active':''}" data-group-index="${i}">${esc(g.title)} · ${g.verbs.length}</button>`).join('')}</div><div id="groupContent"></div></section>`;
  const draw=index=>{document.querySelectorAll('.tab').forEach((b,i)=>b.classList.toggle('active',i===index));const g=groups[index];document.getElementById('groupContent').innerHTML=`<div class="verb-list">${g.verbs.map(v=>`<div class="verb-row"><div><b>${esc(v)}</b><span class="translation">${esc(translationFor(v))}</span></div></div>`).join('')||'<div class="notice">Keine Verben in dieser Gruppe.</div>'}</div>`};
  document.querySelectorAll('[data-group-index]').forEach(btn=>btn.addEventListener('click',()=>draw(Number(btn.dataset.groupIndex))));bindRouteButtons();draw(0);
}
function renderChoose(){
  if(activePackage()){goHome();return}
  const available=newVerbs(),required=Math.min(PACKAGE_SIZE,available.length);
  const filtered=available.filter(v=>clean(v+' '+translationFor(v)).includes(clean(choiceSearch)));
  app.innerHTML=`<section class="card"><div class="task-head"><div><h2>Verben wählen</h2><p class="small">Wähle genau ${required} Verben. Das Paket bleibt danach unverändert.</p></div><button class="secondary" data-route="home">Abbrechen</button></div><input class="search" id="verbSearch" value="${esc(choiceSearch)}" placeholder="Verb oder Übersetzung suchen"><div class="notice">Ausgewählt: <b>${choiceSelection.size} / ${required}</b></div><div class="verb-list">${filtered.map(v=>`<label class="verb-row"><input type="checkbox" value="${esc(v)}" ${choiceSelection.has(v)?'checked':''}><div><b>${esc(v)}</b><span class="translation">${esc(translationFor(v))}</span></div></label>`).join('')}</div><div class="actions"><button id="createChoicePackage" ${choiceSelection.size===required?'':'disabled'}>Aktives Paket erstellen</button></div></section>`;
  document.getElementById('verbSearch').addEventListener('input',e=>{choiceSearch=e.target.value;renderChoose()});
  document.querySelectorAll('.verb-row input').forEach(input=>input.addEventListener('change',()=>{if(input.checked){if(choiceSelection.size<required)choiceSelection.add(input.value);else input.checked=false}else choiceSelection.delete(input.value);renderChoose()}));
  document.getElementById('createChoicePackage')?.addEventListener('click',()=>{try{createPackage([...choiceSelection],'choose')}catch(e){alert(e.message)}});bindRouteButtons();
}
function ensureAssessment(){
  if(activePackage())return;
  const selected=new Set(state.assessment.selected||[]);
  const available=newVerbs().filter(v=>!selected.has(v));
  if(!state.assessment.queue.length||state.assessment.index>=state.assessment.queue.length){state.assessment={queue:shuffle(available,hash(ownerId()+now())),index:0,selected:[...selected]};persistLocal()}
}
function renderAssessment(){
  if(activePackage()){goHome();return}ensureAssessment();
  const a=state.assessment,required=Math.min(PACKAGE_SIZE,newVerbs().length),verb=a.queue[a.index];
  if(a.selected.length>=required&&required>0){createPackage(a.selected,'assessment');return}
  if(!verb){app.innerHTML=`<section class="card finish"><h2>Einschätzung abgeschlossen</h2><p>Es wurden ${a.selected.length} Verben für das aktive Paket ausgewählt.</p><button id="useAssessment" ${a.selected.length?'':'disabled'}>Paket mit ${a.selected.length} Verben erstellen</button><button class="secondary" data-route="home">Zurück</button></section>`;document.getElementById('useAssessment')?.addEventListener('click',()=>createPackage(a.selected,'assessment'));bindRouteButtons();return}
  app.innerHTML=`<section class="card"><div class="task-head"><div><h2>Verben einschätzen</h2><p class="small">„Schon gelernt“ verschiebt das Verb direkt nach Gelernt. „Aktiv lernen“ sammelt es für das feste Paket.</p></div><button class="secondary" data-route="home">Pause</button></div><div class="assessment"><div>${imageBox(verb)}</div><div><div class="question">${esc(verb)}</div><p><b>Übersetzung:</b> ${esc(translationFor(verb))}</p><p><b>Beispiel:</b> ${esc(sentenceFor(verb))}</p><div class="notice">Für Aktiv ausgewählt: ${a.selected.length} / ${required}</div><div class="actions"><button class="secondary" id="assessmentLearned">Schon gelernt</button><button id="assessmentActive">Aktiv lernen</button></div></div></div></section>`;
  document.getElementById('assessmentLearned').addEventListener('click',()=>{state.learned=uniq([...state.learned,verb]);a.index++;persistLocal();renderAssessment()});
  document.getElementById('assessmentActive').addEventListener('click',()=>{a.selected=uniq([...a.selected,verb]);a.index++;persistLocal();renderAssessment()});bindRouteButtons();
}
