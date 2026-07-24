function safeText(value){
  return String(value??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function readJson(storage,key){
  try{return JSON.parse(storage.getItem(key)||"null")}catch(e){return null}
}

function activeProfile(){
  return readJson(localStorage,"SP_USER_PROFILE")
    || readJson(localStorage,"SP_STUDENT_PROFILE")
    || readJson(localStorage,"SP_TEACHER_PROFILE")
    || null;
}

function activeRole(){
  const stored=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
  if(["teacher","lehrer","admin","owner"].includes(stored))return"teacher";
  return"student";
}

function dashboardHref(){
  return activeRole()==="teacher"?"/teacher/index.html":"/student-dashboard/index.html";
}

function profileText(profile){
  if(!profile)return"Nicht eingeloggt";
  const name=[profile.vorname||profile.firstName||profile.name,profile.nachname||profile.lastName]
    .filter(Boolean).join(" ").trim();
  const course=profile.kurs||profile.kursnummer||profile.courseCode||profile.course||"";
  return[name||profile.email||"Profil",course].filter(Boolean).join(" · ");
}

function logout(){
  try{
    ["SP_USER_PROFILE","SP_STUDENT_PROFILE","SP_KEEP_LOGGED_IN","SP_STUDENT_ID","motherLanguage","muttersprache","SP_MOTHER_LANGUAGE_CODE","SP_LOGIN_ROLE","SP_ACTIVE_ROLE","SP_AUTH_ROLE","SP_LOGIN_CONTEXT","SP_TEACHER_MODE","SP_USER_ROLE","SP_TEACHER_EMAIL","SP_TEACHER_ID","SP_TEACHER_UID","SP_TEACHER_PROFILE"].forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
  }catch(e){}
  location.href="/index.html";
}

function renderHeader(config,profile){
  return `
    <header class="sp-header sp-header--lesson">
      <div class="sp-header__main">
        <a class="sp-header__brand" href="/index.html">
          <span class="sp-header__logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></span>
          <span class="sp-header__title">
            <h1>SprachPilot</h1>
            <span class="sp-header__subtitle">${safeText(config.subtitle||"")}</span>
          </span>
        </a>
        <div class="sp-header__account">
          <span class="sp-header__pill">${safeText(profileText(profile))}</span>
          <a class="sp-header__button" href="${safeText(dashboardHref())}">Dashboard</a>
          <a class="sp-header__button" href="/profile/index.html">Profil</a>
          <button class="sp-header__button" type="button" data-sp-lesson-logout>Abmelden</button>
        </div>
      </div>
      <nav class="sp-header__nav">
        <a class="sp-header__nav-link" href="${safeText(config.backHref||"/wortschatz/")}">← Zurück</a>
      </nav>
    </header>`;
}

function bindHeader(root){
  root.querySelectorAll("[data-sp-lesson-logout]").forEach(button=>{
    if(button.dataset.bound)return;
    button.dataset.bound="1";
    button.addEventListener("click",logout);
  });
}

function setColor(name,value){
  if(value)document.documentElement.style.setProperty(name,value);
}

function cleanId(value){
  return String(value||"").trim().toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-|-$/g,"");
}

function percent(value){
  const number=Number(value);
  return Number.isFinite(number)?Math.max(0,Math.min(100,Math.round(number))):0;
}

function withTimeout(promise,ms,label){
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error(label||"Zeitüberschreitung")),ms))
  ]);
}

function progressKeys(config,theme){
  const lessonNumber=String(config.lessonNumber||config.lessonId||"").replace(/^.*?(\d+)$/,"$1");
  const themeNumber=String(theme.number||theme.id||"").replace(/^.*?(\d+)$/,"$1");
  return[
    theme.progressKey,
    theme.id,
    `${config.lessonId}/${theme.id}`,
    cleanId(["wortschatz","A1","lektion",lessonNumber,"thema",themeNumber].join(" ")),
    cleanId(["wortschatz","A1",config.lessonId,theme.id].join(" "))
  ].filter(Boolean);
}

function findTopicProgress(progress,config,theme){
  const moduleProgress=progress?.wortschatz||progress?.Wortschatz||{};
  for(const key of progressKeys(config,theme)){
    if(moduleProgress[key])return moduleProgress[key];
    if(progress?.topics?.[key])return progress.topics[key];
  }
  return{};
}

function taskPercent(topic,file){
  const tasks=topic?.tasks||{};
  const direct=tasks[file];
  if(direct)return percent(direct.percent||direct.progress);
  const short=cleanId(file);
  const match=Object.entries(tasks).find(([key])=>cleanId(key)===short);
  return match?percent(match[1]?.percent||match[1]?.progress):0;
}

function themeStarted(topic,theme){
  const taskValues=Object.values(topic?.tasks||{});
  if(taskValues.some(task=>percent(task?.percent||task?.progress)>0||task?.completed||task?.done))return true;
  if(percent(topic?.progressPercent||topic?.current?.percent)>0)return true;
  if(topic?.exam?.attempted||topic?.exam?.completed)return true;
  return(theme.tasks||[]).some(file=>taskPercent(topic,file)>0);
}

function themeAllComplete(topic,theme){
  const files=theme.tasks||[];
  const tasksComplete=files.length
    ?files.every(file=>taskPercent(topic,file)>=100)
    :percent(topic?.progressPercent||topic?.current?.percent)>=100;
  const exam=topic?.exam||{};
  const examComplete=exam.completed===true||percent(exam.percent||exam.bestPercent||exam.lastPercent)>=100;
  return tasksComplete&&examComplete;
}

function repeatCount(topic,allComplete=false){
  const lifetime=topic?.lifetime||{};
  const resets=Number(lifetime.resets||topic?.resets||0);
  return Math.max(
    Number(topic?.repeatCount||0),
    Number(topic?.repeats||0),
    Number(topic?.completedRuns||0),
    Number(lifetime.finishedRuns||0),
    Number(lifetime.completedRuns||0),
    allComplete?resets+1:resets
  );
}

export function getThemeStatus({isReleased,started,allComplete,repeats}){
  if(!isReleased)return"locked";
  if(repeats>=3)return"done";
  if(allComplete)return"repeat";
  if(started)return"continue";
  return"new";
}

export function statusText(status){
  return{locked:"Gesperrt",new:"Neu",continue:"Weiter",repeat:"Wiederholen",done:"Fertig"}[status]||"Neu";
}

function renderThemeCard(theme,status){
  const locked=status==="locked";
  const tag=locked?"div":"a";
  const href=locked?"":` href="${safeText(theme.href||"#")}"`;
  const chips=(theme.chips||theme.words||[]).map(item=>`<span class="theme-chip">${safeText(item)}</span>`).join("");
  return `
    <${tag} class="theme-card ${locked?"is-locked":""}"${href} ${locked?'aria-disabled="true"':""}>
      <div class="theme-top">
        <div class="theme-number">${safeText(theme.number)}</div>
        <span class="theme-status ${locked?"is-locked":""}">${statusText(status)}</span>
      </div>
      <div class="theme-title">${safeText(theme.title)}</div>
      <p class="theme-desc">${safeText(theme.text||theme.desc||"")}</p>
      <div class="theme-meta">${chips}</div>
      <div class="theme-footer"><div class="theme-button">${locked?"Gesperrt":"Starten"}</div></div>
    </${tag}>`;
}

export async function renderLessonOverview(config){
  const root=document.getElementById(config.rootId||"lessonOverview");
  if(!root)return;

  setColor("--lesson-main",config.color?.main);
  setColor("--lesson-dark",config.color?.dark);
  setColor("--lesson-soft",config.color?.soft);
  setColor("--lesson-line",config.color?.line);
  setColor("--lesson-bg-2",config.color?.bg2||config.color?.soft);

  const profile=activeProfile();

  function draw(releaseData={},progress={},releaseReady=false,progressReady=false){
    const cards=(config.themes||[]).map(theme=>{
      const open=releaseReady&&typeof releaseData.themeOpen==="function"
        ?releaseData.themeOpen(releaseData.data,config.module||"wortschatz",config.lessonId,theme.id)
        :true;
      const topic=progressReady?findTopicProgress(progress,config,theme):{};
      const started=progressReady?themeStarted(topic,theme):false;
      const allComplete=progressReady?themeAllComplete(topic,theme):false;
      const repeats=progressReady?repeatCount(topic,allComplete):0;
      return renderThemeCard(theme,getThemeStatus({isReleased:open,started,allComplete,repeats}));
    }).join("");

    root.innerHTML=`
      <div class="sp-page">
        ${renderHeader(config,profile)}
        <section class="lesson-title-card"><h2>${safeText(config.lessonTitle)}</h2></section>
        <section class="theme-grid">${cards}</section>
        <footer class="sp-note">© SprachPilot</footer>
      </div>`;
    bindHeader(root);
  }

  // Sofort darstellen. Firebase, Netzwerk und Fortschritt dürfen die Seite nie blockieren.
  draw();

  const timeoutMs=Number(config.loadTimeoutMs||3500);
  const releasePromise=withTimeout(
    import("./course-releases.js?v=lesson-overview-fix1")
      .then(async module=>({data:await module.loadCourseRelease(profile||{}),themeOpen:module.themeOpen})),
    timeoutMs,
    "Lektionsfreigaben: Zeitüberschreitung"
  );
  const progressPromise=withTimeout(
    import("./progress.js?v=lesson-overview-fix1").then(module=>module.loadCurrentStudentProgress()),
    timeoutMs,
    "Fortschritt: Zeitüberschreitung"
  );

  const[releaseResult,progressResult]=await Promise.allSettled([releasePromise,progressPromise]);
  if(releaseResult.status==="rejected")console.warn("Lektionsfreigaben konnten nicht geladen werden:",releaseResult.reason);
  if(progressResult.status==="rejected")console.warn("Fortschritt konnte nicht geladen werden:",progressResult.reason);

  draw(
    releaseResult.status==="fulfilled"?releaseResult.value:{},
    progressResult.status==="fulfilled"?progressResult.value:{},
    releaseResult.status==="fulfilled",
    progressResult.status==="fulfilled"
  );
}