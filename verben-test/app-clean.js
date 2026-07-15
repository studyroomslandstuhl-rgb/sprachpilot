// Verben Test clean logic.
// Regeln und Aenderungsschutz stehen in verben-test/LOGIK.md.
// Keine zweite Speicher-, Punkte-, Paket- oder Pruefungslogik neben dieser Datei anlegen.
(function(){
  'use strict';

  const DEPS=window.VT_DEPS||{};
  const MODULE_TITLE='Verben Test';
  const VERSION=1;
  const PACKAGE_SIZE=20;
  const BUNNY='https://sprachpilot.b-cdn.net/';
  const TASKS=[
    {id:'karteikarten',title:'Karteikarten',icon:'🃏',desc:'Bild, Verb und Übersetzung sicher lernen.'},
    {id:'memory',title:'Memory',icon:'🧠',desc:'Bilder und Verben verbinden.'},
    {id:'bild-verb',title:'Bild → Verb',icon:'🖼️',desc:'Zum Bild das richtige Verb wählen.'},
    {id:'verb-bild',title:'Verb → Bild',icon:'🔁',desc:'Zum Verb das richtige Bild wählen.'},
    {id:'schreiben',title:'Schreiben',icon:'✍️',desc:'Das Verb richtig schreiben.'},
    {id:'hoeren-schreiben',title:'Hören → Schreiben',icon:'🎧',desc:'Das gehörte Verb schreiben.'},
    {id:'hoeren-sprechen',title:'Hören → Sprechen',icon:'🎙️',desc:'Das Verb hören und nachsprechen.'},
    {id:'bild-sprechen',title:'Bild → Sprechen',icon:'🗣️',desc:'Das Verb zum Bild sprechen.'},
    {id:'satz-puzzle',title:'Satz-Puzzle',icon:'🧩',desc:'Einen Satz richtig ordnen.'},
    {id:'konjugieren',title:'Konjugieren',icon:'🔤',desc:'Die Ich-Form bilden.'}
  ];
  const TASK_IDS=TASKS.map(t=>t.id);
  const SPECIAL_IMAGES={
    'sich vorstellen':'sich_vorstellen.webp','sich kämmen':'sich_kaemmen.webp','sich rasieren':'sich_rasieren.webp','sich schminken':'sich_schminken.webp','sich bewegen':'sich_bewegen.webp','sich verändern':'sich_veraendern.webp','sich benehmen':'sich_benehmen.webp','spazieren gehen':'spazierengehen.webp','öffnen':'oeffnen.webp','schließen':'schliessen.webp','reißen':'reissen.webp','können':'koennen.webp','üben':'ueben.webp','wählen':'waehlen.webp'
  };
  const SPECIAL_ICH={sein:'bin',haben:'habe',werden:'werde',wissen:'weiß',tun:'tue',können:'kann',müssen:'muss',dürfen:'darf',wollen:'will',sollen:'soll',mögen:'mag',sehen:'sehe',lesen:'lese',sprechen:'spreche',essen:'esse',nehmen:'nehme',geben:'gebe',helfen:'helfe',treffen:'treffe',laufen:'laufe',fahren:'fahre',schlafen:'schlafe','aufstehen':'stehe auf','anfangen':'fange an','anrufen':'rufe an','einkaufen':'kaufe ein','fernsehen':'sehe fern','sich vorstellen':'stelle mich vor','sich kämmen':'kämme mich','sich rasieren':'rasiere mich','sich schminken':'schminke mich','sich bewegen':'bewege mich','sich verändern':'verändere mich'};

  const topbar=document.getElementById('topbar');
  const app=document.getElementById('app');
  let profile=null;
  let releases={};
  let catalog=[];
  let byVerb=new Map();
  let state=null;
  let saveTimer=null;

  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:;"'`´]/g,'').replace(/\s+/g,' ');
  const slug=v=>String(v||'').trim().toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  const uniq=list=>[...new Set((list||[]).filter(Boolean).map(String))];
  const clone=v=>JSON.parse(JSON.stringify(v));
  const now=()=>Date.now();
  function hash(value){let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function shuffle(list,seed){const out=[...(list||[])];let x=(seed||Math.floor(Math.random()*1e9))>>>0;for(let i=out.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[out[i],out[j]]=[out[j],out[i]]}return out}
  function normalizeAnswer(value){return clean(value).replace(/\beuro\b/g,'eur').replace(/\bgramm\b/g,'g').replace(/\bgram\b/g,'g').replace(/\bliter\b/g,'l').replace(/\bkilo\b/g,'kg').replace(/\bkilogramm\b/g,'kg')}

  function profileName(){return [profile?.vorname,profile?.nachname].filter(Boolean).join(' ')||profile?.email||'Teilnehmer';}
  function courseCode(){return profile?.kurs||profile?.courseCode||profile?.kursnummer||'test';}
  function ownerId(){return slug([profile?.studentId,profile?.uid,profile?.email,courseCode()].filter(Boolean).join('_'))||'local_test';}
  function storageKey(){return `SP_VERBEN_TEST_CLEAN_V${VERSION}_${ownerId()}`;}
  function legacyKeys(){return [`SP_VERBEN_TEST_V1_${ownerId()}`,`SP_VERBEN_TEST_STATE_${ownerId()}`];}
  function language(){
    const raw=clean(profile?.muttersprache||profile?.motherLanguage||'Englisch');
    const map={englisch:'Englisch',english:'Englisch',en:'Englisch',russisch:'Russisch',russian:'Russisch',ru:'Russisch',ukrainisch:'Ukrainisch',ukrainian:'Ukrainisch',uk:'Ukrainisch',arabisch:'Arabisch',arabic:'Arabisch',ar:'Arabisch',tuerkisch:'Türkisch',turkish:'Türkisch',tr:'Türkisch',rumaenisch:'Rumänisch',romanian:'Rumänisch',ro:'Rumänisch',polnisch:'Polnisch',polish:'Polnisch',pl:'Polnisch'};
    return map[raw]||profile?.muttersprache||'Englisch';
  }

  function buildCatalog(){
    const source=window.VERBEN_TEST_SOURCE||{};
    const raw=Array.isArray(source.verbs)?source.verbs:[];
    catalog=raw.map((item,index)=>{
      const verb=String(item?.verb||item?.infinitive||item||'').trim();
      if(!verb)return null;
      const file=SPECIAL_IMAGES[verb]||`${slug(verb)}.webp`;
      return {verb,id:slug(verb),index,translation:translationFor(verb),sentence:sentenceFor(verb),ich:ichForm(verb),image:`${BUNNY}verben-A1/bilder/${file}`};
    }).filter(Boolean);
    byVerb=new Map(catalog.map(v=>[v.verb,v]));
  }
  function translationFor(verb){
    const data=window.VERBEN_TEST_SOURCE?.translations||{};
    const lang=language();
    return data?.[lang]?.[verb]||data?.Englisch?.[verb]||data?.Russisch?.[verb]||'—';
  }
  function sentenceFor(verb){
    const data=window.VERBEN_TEST_SOURCE?.sentences||{};
    if(data[verb])return String(data[verb]);
    if(verb.startsWith('sich '))return `Ich möchte mich ${verb.slice(5)}.`;
    if(verb==='leidtun')return 'Das tut mir leid.';
    if(verb==='dabeihaben')return 'Ich habe meinen Ausweis dabei.';
    return `Ich möchte ${verb}.`;
  }
  function ichForm(verb){
    if(SPECIAL_ICH[verb])return SPECIAL_ICH[verb];
    if(verb.endsWith('eln'))return verb.slice(0,-3)+'le';
    if(verb.endsWith('ern'))return verb.slice(0,-3)+'ere';
    if(verb.endsWith('en'))return verb.slice(0,-2)+'e';
    return verb;
  }

  function defaultState(){return {version:VERSION,ownerId:ownerId(),updatedAt:now(),learned:[],archives:[],assessment:{known:[],unknown:[]},activePackage:null};}
  function normalizeState(input){
    const base=defaultState();
    if(!input||typeof input!=='object')return base;
    const active=normalizePackage(input.activePackage||input.package||null);
    return {...base,...input,version:VERSION,ownerId:ownerId(),learned:uniq(input.learned||input.doneVerbs||[]),archives:Array.isArray(input.archives)?input.archives:[],assessment:{known:uniq(input.assessment?.known||[]),unknown:uniq(input.assessment?.unknown||[])},activePackage:active};
  }
  function normalizePackage(pkg){
    if(!pkg||typeof pkg!=='object')return null;
    const verbs=uniq(pkg.verbs||pkg.activeVerbs||[]).filter(v=>byVerb.has(v));
    if(!verbs.length)return null;
    const taskDone={};
    TASK_IDS.forEach(id=>taskDone[id]=uniq(pkg.taskDone?.[id]||pkg.taskDoneSets?.[id]||[]).filter(v=>verbs.includes(v)));
    return {id:pkg.id||`pkg_${now()}`,createdAt:pkg.createdAt||now(),source:pkg.source||'clean',verbs,taskDone,taskPoints:{...(pkg.taskPoints||{})},runtime:{...(pkg.runtime||{})},examBest:Number(pkg.examBest||pkg.exam?.best||0)||0,examAttempts:Number(pkg.examAttempts||pkg.exam?.attempts||0)||0,examRun:pkg.examRun||null};
  }
  function readLocal(){
    for(const key of [storageKey(),...legacyKeys()]){
      try{const raw=localStorage.getItem(key);if(raw)return normalizeState(JSON.parse(raw));}catch(_e){}
    }
    return defaultState();
  }
  function save(){
    if(!state)return;
    state.updatedAt=now();
    localStorage.setItem(storageKey(),JSON.stringify(state));
    clearTimeout(saveTimer);
    saveTimer=setTimeout(saveRemote,700);
  }
  async function saveRemote(){
    try{
      const db=window.firebase?.firestore?.();
      if(!db)return;
      await db.collection('progress').doc(ownerId()).set({verbenTestClean:{state:clone(state),updatedAt:new Date().toISOString(),updatedAtMs:now()}},{merge:true});
    }catch(e){console.warn('[Verben Test] Firebase speichern nicht möglich',e);}
  }
  async function loadRemote(){
    try{
      const db=window.firebase?.firestore?.();
      if(!db)return;
      const snap=await db.collection('progress').doc(ownerId()).get();
      const remote=snap.exists?snap.data()?.verbenTestClean?.state:null;
      if(remote&&Number(remote.updatedAt||0)>Number(state.updatedAt||0)){state=normalizeState(remote);save();render();}
    }catch(e){console.warn('[Verben Test] Firebase laden nicht möglich',e);}
  }

  function moduleIsOpen(){
    if(!DEPS.moduleOpen)return true;
    return DEPS.moduleOpen(releases,MODULE_TITLE)||DEPS.moduleOpen(releases,'Verben A1')||String(DEPS.getActiveRole?.()||'').toLowerCase()==='teacher';
  }
  function activeVerbs(){return state.activePackage?.verbs||[];}
  function learnedSet(){return new Set(state.learned||[]);}
  function openVerbList(){
    const blocked=new Set([...state.learned,...activeVerbs()]);
    return catalog.map(v=>v.verb).filter(v=>!blocked.has(v));
  }
  function plannedVerbs(){
    const open=new Set(openVerbList());
    return uniq(state.assessment?.unknown||[]).filter(v=>open.has(v));
  }
  function availableVerbs(){
    const planned=plannedVerbs();
    const plannedSet=new Set(planned);
    return uniq([...planned,...openVerbList().filter(v=>!plannedSet.has(v))]);
  }
  function assessableVerbs(){
    const decided=new Set([...state.learned,...activeVerbs(),...(state.assessment?.known||[]),...(state.assessment?.unknown||[])]);
    return catalog.map(v=>v.verb).filter(v=>!decided.has(v));
  }
  function startPackage(verbs,source){
    if(state.activePackage&&!packageComplete()){go('overview');return;}
    if(state.activePackage&&packageComplete())finishPackage(false);
    const selected=uniq(verbs).filter(v=>byVerb.has(v)).filter(v=>!learnedSet().has(v)).slice(0,PACKAGE_SIZE);
    if(!selected.length)return;
    const taskDone={};TASK_IDS.forEach(id=>taskDone[id]=[]);
    state.activePackage={id:`pkg_${now()}`,createdAt:now(),source,verbs:selected,taskDone,taskPoints:{},runtime:{},examBest:0,examAttempts:0,examRun:null};
    state.assessment.unknown=uniq(state.assessment.unknown||[]).filter(v=>!selected.includes(v));
    save();go('overview');
  }
  function ensurePackage(){
    if(state.activePackage)return true;
    const verbs=availableVerbs().slice(0,PACKAGE_SIZE);
    if(!verbs.length)return false;
    startPackage(verbs,'auto');
    return true;
  }
  function taskPercent(id){
    const pkg=state.activePackage;if(!pkg)return 0;
    return Math.round((uniq(pkg.taskDone[id]||[]).length/pkg.verbs.length)*100);
  }
  function allTasksDone(){return !!state.activePackage&&TASK_IDS.every(id=>taskPercent(id)>=100);}
  function examUnlocked(){return allTasksDone();}
  function packageComplete(){return allTasksDone()&&Number(state.activePackage?.examBest||0)>=100;}
  function totalPercent(){if(!state.activePackage)return 0;const sum=TASK_IDS.reduce((n,id)=>n+taskPercent(id),0)+(state.activePackage.examBest||0);return Math.round(sum/(TASK_IDS.length+1));}
  function testPoints(){
    const pkg=state.activePackage;if(!pkg)return 0;
    return Object.values(pkg.taskPoints||{}).reduce((a,b)=>a+(Number(b)||0),0)+(pkg.examBest>=100?100:0);
  }
  function markTaskDone(taskId,verb){
    const pkg=state.activePackage;if(!pkg||!pkg.verbs.includes(verb))return;
    pkg.taskDone[taskId]=uniq([...(pkg.taskDone[taskId]||[]),verb]);
    if(taskPercent(taskId)>=100&&!pkg.taskPoints[taskId])pkg.taskPoints[taskId]=5;
    delete pkg.runtime[taskId];
    save();
  }
  function nextVerb(taskId){
    const pkg=state.activePackage;
    const done=new Set(pkg.taskDone[taskId]||[]);
    return pkg.verbs.find(v=>!done.has(v))||null;
  }
  function finishPackage(navigate=true){
    const pkg=state.activePackage;
    if(!pkg||!packageComplete())return;
    state.learned=uniq([...state.learned,...pkg.verbs]);
    state.archives=[{...clone(pkg),finishedAt:now()},...state.archives].slice(0,20);
    state.activePackage=null;
    save();
    if(navigate)go('home');
  }
  function resetAll(){
    if(!confirm('Verben-Test-Fortschritte wirklich löschen?'))return;
    state=defaultState();
    localStorage.removeItem(storageKey());
    save();go('home');
  }

  function header(){
    const dash=DEPS.dashboardHref?DEPS.dashboardHref():('/dashboard.html');
    topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/wortschatz/"><img src="/assets/logo.png" alt=""><div><h1>SprachPilot</h1><div class="subtitle">${MODULE_TITLE}</div></div></a><div class="account"><span class="pill">${esc(profileName())} · ${esc(courseCode())}</span><a class="btn secondary" href="${esc(dash)}">Dashboard</a><a class="btn secondary" href="/profil.html">Profil</a><button class="secondary" data-action="logout">Abmelden</button></div></div><nav class="nav"><button class="secondary" data-back>← Zurück</button><button class="secondary" data-go="home">Übersicht</button><button class="danger" data-reset>Fortschritte löschen</button></nav>`;
  }
  function bindGlobal(){
    document.body.onclick=e=>{
      const reset=e.target.closest('[data-reset]');if(reset){resetAll();return;}
      const back=e.target.closest('[data-back]');if(back){go('home');return;}
      const nav=e.target.closest('[data-go]');if(nav){go(nav.dataset.go);return;}
      const logout=e.target.closest('[data-action="logout"]');if(logout){localStorage.clear();location.href='/index.html';}
    };
  }
  function go(view,params={}){const url=new URL(location.href);url.search='';url.searchParams.set('view',view);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));history.pushState(null,'',url);render();}
  function view(){return new URL(location.href).searchParams.get('view')||'home';}
  function param(name){return new URL(location.href).searchParams.get(name)||'';}
  window.addEventListener('popstate',render);

  function render(){
    header();
    if(!moduleIsOpen()){app.innerHTML=`<section class="card locked-box"><h2>Verben Test ist gesperrt</h2><p>Die Lehrkraft muss diesen Bereich zuerst freigeben.</p></section>`;return;}
    const v=view();
    if(v==='choose')return renderChoose();
    if(v==='assess')return renderAssess();
    if(v==='overview')return renderOverview();
    if(v==='task')return renderTask(param('id'));
    if(v==='exam')return renderExam();
    renderHome();
  }
  function renderHome(){
    const canPractice=!!state.activePackage||availableVerbs().length>0;
    app.innerHTML=`<section class="card hero"><h2>Was möchtest du machen?</h2><p>Verben werden in Paketen bis 20 Wörter gelernt. Ein neues Paket kommt erst, wenn das aktuelle Paket inklusive Prüfung fertig ist.</p><div class="actions"><button ${canPractice?'':'disabled'} data-start-practice>${state.activePackage?'Weiter üben':'Üben'}</button><button class="secondary" data-go="assess">Verben einschätzen</button><button class="secondary" data-go="choose">Verben wählen</button></div></section>${state.activePackage?packageSummary():''}${verbOverview()}`;
    const btn=app.querySelector('[data-start-practice]');
    if(btn)btn.onclick=()=>{if(ensurePackage())go('overview');};
  }
  function packageSummary(){const pkg=state.activePackage;return `<section class="card"><div class="task-head"><div><h2>Aktuelles Paket</h2><p>${pkg.verbs.length} Verben · ${totalPercent()}% · ${testPoints()} Testpunkte</p></div>${packageComplete()?'<button data-finish-package>Neue 20 Verben freischalten</button>':''}</div><div class="package-list">${pkg.verbs.map(v=>`<span class="pill">${esc(v)}</span>`).join('')}</div></section>`;}
  function verbOverview(){
    const active=activeVerbs();
    const planned=plannedVerbs();
    const plannedSet=new Set(planned);
    const next=openVerbList().filter(v=>!plannedSet.has(v));
    const learned=state.learned||[];
    return `<section class="card"><h2>Übersicht</h2><p><b>${catalog.length}</b> mögliche Verben · <b>${learned.length}</b> gelernt · <b>${openVerbList().length}</b> noch offen</p><div class="stats"><div class="stat"><b>${active.length}</b>Aktuelles Paket</div><div class="stat"><b>${planned.length}</b>Vorgemerkt</div><div class="stat"><b>${next.length}</b>Weitere Verben</div><div class="stat"><b>${learned.length}</b>Gelernt</div></div>${verbGroup('Aktuelles Paket',active,'Kein Paket aktiv.')}${verbGroup('Zum Lernen vorgemerkt',planned,'Noch keine Verben vorgemerkt.')}${verbGroup('Weitere mögliche Verben',next,'Keine weiteren Verben offen.')}${verbGroup('Gelernt',learned,'Noch nichts gelernt.')}</section>`;
  }
  function verbGroup(title,list,empty){
    const shown=(list||[]).slice(0,60);
    const rest=Math.max(0,(list||[]).length-shown.length);
    return `<div style="margin-top:16px"><h3>${esc(title)}</h3>${shown.length?`<div class="package-list">${shown.map(v=>`<span class="pill">${esc(v)}</span>`).join('')}${rest?`<span class="pill">+${rest} weitere</span>`:''}</div>`:`<p class="small">${esc(empty)}</p>`}</div>`;
  }
  function renderOverview(){
    if(!ensurePackage())return renderHome();
    const examLock=!examUnlocked();
    app.innerHTML=`<section class="card"><div class="task-head"><div><h2>Aufgabenübersicht</h2><p>${state.activePackage.verbs.length} Verben · ${totalPercent()}%</p></div>${packageComplete()?'<button data-finish-package>Neue 20 Verben freischalten</button>':''}</div><div class="stats"><div class="stat"><b>${state.activePackage.verbs.length}</b>Verben</div><div class="stat"><b>${TASK_IDS.filter(id=>taskPercent(id)>=100).length}/${TASK_IDS.length}</b>Aufgaben fertig</div><div class="stat"><b>${state.activePackage.examBest}%</b>Prüfung</div><div class="stat"><b>${testPoints()}</b>Testpunkte</div></div></section><section class="grid">${TASKS.map(t=>taskCard(t)).join('')}${examCard(examLock)}</section>`;
    const finish=app.querySelector('[data-finish-package]');if(finish)finish.onclick=()=>finishPackage(true);
  }
  function taskCard(t){const p=taskPercent(t.id);return `<a class="module" href="?view=task&id=${t.id}"><div class="icon">${t.icon}</div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><b>${p}%</b></a>`;}
  function examCard(locked){return `<a class="module ${locked?'locked':''}" href="?view=exam"><div class="icon">⭐</div><h3>Prüfung</h3><p>${locked?'Erst alle Aufgaben auf 100% bringen.':'Prüfung machen oder wiederholen.'}</p><div class="progress"><div class="bar" style="width:${state.activePackage.examBest||0}%"></div></div><b>${locked?'gesperrt':state.activePackage.examBest+'%'}</b></a>`;}
  function renderChoose(){
    if(state.activePackage&&!packageComplete()){app.innerHTML=`<section class="card locked-box"><h2>Erst aktuelles Paket fertig machen</h2><p>Neue Verben können gewählt werden, sobald das aktuelle Paket inklusive Prüfung 100% hat.</p><button data-go="overview">Weiter üben</button></section>`;return;}
    if(state.activePackage&&packageComplete())finishPackage(false);
    const verbs=availableVerbs();
    app.innerHTML=`<section class="card"><h2>Verben wählen</h2><p>Wähle bis zu ${PACKAGE_SIZE} Verben für ein Testpaket. Vorgemerkte Verben stehen oben.</p><input class="search" placeholder="Verb suchen" data-search><div class="verb-list">${verbs.map(v=>verbRow(v)).join('')}</div><div class="actions"><button data-create-choice>Auswahl starten</button></div></section>`;
    app.querySelector('[data-search]').oninput=e=>{const q=clean(e.target.value);app.querySelector('.verb-list').innerHTML=verbs.filter(v=>clean(v).includes(q)||clean(byVerb.get(v)?.translation).includes(q)).map(v=>verbRow(v)).join('');};
    app.querySelector('[data-create-choice]').onclick=()=>{const selected=[...app.querySelectorAll('input[data-verb]:checked')].map(i=>i.dataset.verb);startPackage(selected,'choice');};
  }
  function verbRow(v){const item=byVerb.get(v);const planned=plannedVerbs().includes(v);return `<label class="verb-row"><input type="checkbox" data-verb="${esc(v)}" ${planned?'checked':''}><span><b>${esc(v)}</b><span class="translation">${esc(item?.translation)}${planned?' · vorgemerkt':''}</span></span></label>`;}
  function renderAssess(){
    if(state.activePackage&&!packageComplete()){app.innerHTML=`<section class="card locked-box"><h2>Erst aktuelles Paket fertig machen</h2><p>Weitere Verben können eingeschätzt werden, sobald das aktuelle Paket inklusive Prüfung 100% hat.</p><button data-go="overview">Weiter üben</button></section>`;return;}
    if(state.activePackage&&packageComplete())finishPackage(false);
    const verbs=assessableVerbs();
    const first=verbs[0];
    if(!first){app.innerHTML=`<section class="card finish"><h2>Alle offenen Verben sind eingeschätzt</h2><p>Du kannst jetzt ein neues Paket wählen oder direkt üben.</p><div class="actions"><button data-start-practice>Üben</button><button class="secondary" data-go="choose">Verben wählen</button></div></section>`;const btn=app.querySelector('[data-start-practice]');if(btn)btn.onclick=()=>{if(ensurePackage())go('overview');};return;}
    const item=byVerb.get(first);
    app.innerHTML=`<section class="card assessment"><div class="image-box"><img src="${esc(item.image)}" alt="${esc(first)}" loading="eager" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback',textContent:'Bild fehlt'}))"></div><div><h2>Verben einschätzen</h2><div class="question">${esc(first)}</div><p>${esc(item.translation)}</p><div class="actions"><button data-assess="unknown">Lernen</button><button class="secondary" data-assess="known">Kann ich schon</button></div></div></section>`;
    app.querySelectorAll('[data-assess]').forEach(btn=>btn.onclick=()=>{const list=btn.dataset.assess;state.assessment[list]=uniq([...(state.assessment[list]||[]),first]);state.learned=list==='known'?uniq([...state.learned,first]):state.learned;save();renderAssess();});
  }

  function renderTask(taskId){
    if(!TASK_IDS.includes(taskId))return go('overview');
    if(!ensurePackage())return renderHome();
    if(taskPercent(taskId)>=100){app.innerHTML=`<section class="card finish"><h2>Gut gemacht</h2><p>Diese Aufgabe ist fertig.</p><div class="actions"><button data-go="overview">Weiter</button></div></section>`;return;}
    const verb=nextVerb(taskId);if(!verb)return go('overview');
    const task=TASKS.find(t=>t.id===taskId);const item=byVerb.get(verb);
    app.innerHTML=`<section class="card"><div class="task-head"><div><h2>${TASK_IDS.indexOf(taskId)+1}. ${esc(task.title)}</h2><p>${taskPercent(taskId)}% fertig</p></div><button class="secondary" data-go="overview">Aufgabenübersicht</button></div>${taskBody(taskId,item)}<div class="feedback" id="feedback"></div></section>`;
    bindTask(taskId,item);
  }
  function taskBody(taskId,item){
    const image=`<div class="image-box"><img src="${esc(item.image)}" alt="${esc(item.verb)}" loading="eager" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback',textContent:'Bild fehlt'}))"></div>`;
    if(taskId==='karteikarten')return `${image}<div class="question">${esc(item.verb)}</div><p class="small" style="text-align:center">${esc(item.translation)}</p><div class="actions"><button data-correct>Kann ich</button><button class="secondary" data-wrong>Noch einmal</button></div>`;
    if(taskId==='memory')return memoryBody(item);
    if(taskId==='bild-verb')return `${image}<div class="choices">${choiceWords(item.verb).map(v=>`<button class="choice" data-choice="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
    if(taskId==='verb-bild')return `<div class="question">${esc(item.verb)}</div><div class="choices">${choiceWords(item.verb).map(v=>{const it=byVerb.get(v);return `<button class="choice" data-choice="${esc(v)}"><img src="${esc(it.image)}" alt="${esc(v)}" onerror="this.style.display='none'"></button>`}).join('')}</div>`;
    if(taskId==='schreiben')return `${image}<input class="answer-input" data-answer placeholder="Verb schreiben"><div class="actions"><button data-check>Kontrollieren</button></div>`;
    if(taskId==='hoeren-schreiben')return `<div class="question">🔊 Deutsch</div><div class="actions"><button class="secondary" data-speak="${esc(item.verb)}">Anhören</button></div><input class="answer-input" data-answer placeholder="Verb schreiben"><div class="actions"><button data-check>Kontrollieren</button></div>`;
    if(taskId==='hoeren-sprechen'||taskId==='bild-sprechen')return `${taskId==='bild-sprechen'?image:'<div class="question">🔊 Deutsch</div>'}<div class="actions"><button class="secondary" data-speak="${esc(item.verb)}">Anhören</button><button data-mic>🎙️ Sprechen</button></div><input class="answer-input" data-answer placeholder="Oder hier schreiben"><div class="actions"><button data-check>Kontrollieren</button></div>`;
    if(taskId==='satz-puzzle')return puzzleBody(item);
    if(taskId==='konjugieren')return `<div class="question">ich + ${esc(item.verb)}</div><input class="answer-input" data-answer placeholder="Ich-Form schreiben"><div class="actions"><button data-check>Kontrollieren</button></div>`;
    return '';
  }
  function choiceWords(answer){const pool=state.activePackage.verbs.filter(v=>v!==answer);return shuffle([answer,...shuffle(pool,hash(answer)).slice(0,3)],hash(answer+'choices'));}
  function memoryBody(item){return `<div class="question">Finde das Paar</div><div class="choices"><button class="choice" data-choice="${esc(item.verb)}">${esc(item.verb)}</button><button class="choice" data-choice="${esc(item.verb)}"><img src="${esc(item.image)}" alt="${esc(item.verb)}" onerror="this.style.display='none'"></button></div>`;}
  function puzzleBody(item){const words=shuffle(item.sentence.replace(/[.!?]/g,'').split(/\s+/),hash(item.verb));return `<p class="small" style="text-align:center">Baue den Satz:</p><div class="puzzle-built" data-built></div><div class="puzzle-bank">${words.map(w=>`<button class="word-chip" data-word="${esc(w)}">${esc(w)}</button>`).join('')}</div><div class="actions"><button data-check-puzzle>Kontrollieren</button></div>`;}
  function bindTask(taskId,item){
    const fb=()=>document.getElementById('feedback');
    const ok=()=>{markTaskDone(taskId,item.verb);fb().innerHTML='<div class="ok">Richtig. Gut gemacht!</div>';setTimeout(()=>renderTask(taskId),550);};
    const wrong=(text='Noch nicht richtig. Versuch es noch einmal.')=>{fb().innerHTML=`<div class="no">${esc(text)}</div><div class="hint">Hilfe: ${esc(item.translation)} · ${esc(item.verb[0]||'')}</div>`;};
    app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>normalizeAnswer(b.dataset.choice)===normalizeAnswer(item.verb)?ok():wrong());
    const correct=app.querySelector('[data-correct]');if(correct)correct.onclick=ok;
    const wrongBtn=app.querySelector('[data-wrong]');if(wrongBtn)wrongBtn.onclick=()=>wrong('Diese Karte bleibt in der Übung.');
    const check=app.querySelector('[data-check]');if(check)check.onclick=()=>{const val=app.querySelector('[data-answer]')?.value||'';const answer=taskId==='konjugieren'?item.ich:item.verb;normalizeAnswer(val)===normalizeAnswer(answer)?ok():wrong();};
    app.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
    const mic=app.querySelector('[data-mic]');if(mic)mic.onclick=()=>startMic(app.querySelector('[data-answer]'),item.verb,ok,wrong);
    app.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{app.querySelector('[data-built]').appendChild(b);});
    const puzzle=app.querySelector('[data-check-puzzle]');if(puzzle)puzzle.onclick=()=>{const got=[...app.querySelector('[data-built]').children].map(b=>b.textContent).join(' ');normalizeAnswer(got)===normalizeAnswer(item.sentence.replace(/[.!?]/g,''))?ok():wrong('Der Satz ist noch nicht richtig.');};
  }
  function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.9;speechSynthesis.speak(u);}catch(_e){}}
  function startMic(input,answer,ok,wrong){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){wrong('Mikrofon wird auf diesem Gerät nicht unterstützt. Bitte schreibe die Antwort.');return;}
    const rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.maxAlternatives=3;
    rec.onresult=e=>{const texts=[...e.results[0]].map(r=>r.transcript);if(input)input.value=texts[0]||'';texts.some(t=>normalizeAnswer(t)===normalizeAnswer(answer))?ok():wrong('Ich habe das noch nicht als richtig erkannt. Versuche es noch einmal oder schreibe die Antwort.');};
    rec.onerror=()=>wrong('Mikrofon konnte nicht geprüft werden. Bitte schreibe die Antwort.');
    rec.start();
  }

  function renderExam(){
    if(!ensurePackage())return renderHome();
    if(!examUnlocked()){app.innerHTML=`<section class="card locked-box"><h2>⭐ Prüfung ist gesperrt</h2><p>Erst alle Aufgaben auf 100% bringen.</p><button data-go="overview">Zur Aufgabenübersicht</button></section>`;return;}
    const pkg=state.activePackage;
    if(!pkg.examRun){pkg.examRun={index:0,answers:[],queue:shuffle(pkg.verbs,hash(pkg.id+pkg.examAttempts))};save();}
    const verb=pkg.examRun.queue[pkg.examRun.index];
    if(!verb)return finishExam();
    const item=byVerb.get(verb);
    app.innerHTML=`<section class="card"><div class="task-head"><div><h2>⭐ Prüfung</h2><p>Frage ${pkg.examRun.index+1} von ${pkg.examRun.queue.length}</p></div><button class="secondary" data-go="overview">Aufgabenübersicht</button></div><div class="image-box"><img src="${esc(item.image)}" alt="${esc(verb)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback',textContent:'Bild fehlt'}))"></div><input class="answer-input" data-answer placeholder="Verb schreiben"><div class="actions"><button data-exam-check>Kontrollieren</button></div><div class="feedback" id="feedback"></div></section>`;
    app.querySelector('[data-exam-check]').onclick=()=>{const val=app.querySelector('[data-answer]').value;const right=normalizeAnswer(val)===normalizeAnswer(verb);pkg.examRun.answers.push({verb,given:val,right});pkg.examRun.index+=1;save();renderExam();};
  }
  function finishExam(){
    const pkg=state.activePackage;
    const answers=pkg.examRun.answers||[];
    const right=answers.filter(a=>a.right).length;
    const score=Math.round((right/pkg.verbs.length)*100);
    pkg.examAttempts+=1;pkg.examBest=Math.max(pkg.examBest||0,score);pkg.examRun=null;save();
    app.innerHTML=`<section class="card finish"><div class="stars">⭐</div><h2>${score>=100?'Prüfung bestanden':'Prüfung beendet'}</h2><p>${score}% richtig. Bester Wert: ${pkg.examBest}%.</p><div class="actions"><button data-go="overview">Weiter</button>${score<100?'<button class="secondary" data-go="exam">Prüfung wiederholen</button>':''}${packageComplete()?'<button data-finish-package>Neue 20 Verben freischalten</button>':''}</div></section>`;
    const finish=app.querySelector('[data-finish-package]');if(finish)finish.onclick=()=>finishPackage(true);
  }

  async function start(){
    profile=DEPS.getActiveProfile?DEPS.getActiveProfile():null;
    if(!profile){app.innerHTML=`<section class="card locked-box"><h2>Bitte einloggen</h2><p>Der Verben Test braucht ein Profil.</p><a class="btn" href="/login.html">Zum Login</a></section>`;return;}
    try{releases=DEPS.loadCourseRelease?await DEPS.loadCourseRelease(profile):{};}catch(_e){releases={};}
    buildCatalog();
    state=readLocal();
    bindGlobal();
    render();
    loadRemote();
  }

  window.VERBEN_TEST={start,resetAll};
})();
