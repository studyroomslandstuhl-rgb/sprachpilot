import { getActiveProfile, logout, safeText, dashboardHref } from "./auth.js";
import { loadCourseRelease, themeOpen } from "./course-releases.js";
import { loadCurrentStudentProgress } from "./progress.js";

function setColor(name,value){
  if(value) document.documentElement.style.setProperty(name,value);
}

function cleanId(s){
  return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function percent(v){
  const n=Number(v);
  return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):0;
}

function profileText(profile){
  if(!profile) return "Nicht eingeloggt";
  const name=[profile.vorname||profile.firstName||profile.name,profile.nachname||profile.lastName].filter(Boolean).join(" ").trim();
  const course=profile.kurs||profile.kursnummer||profile.courseCode||profile.course||"";
  return [name||profile.email||"Profil",course].filter(Boolean).join(" · ");
}

function progressKeys(config,theme){
  const lessonNumber=String(config.lessonNumber||config.lessonId||"").replace(/^.*?(\d+)$/,"$1");
  const themeNumber=String(theme.number||theme.id||"").replace(/^.*?(\d+)$/,"$1");
  return [
    theme.progressKey,
    theme.id,
    `${config.lessonId}/${theme.id}`,
    cleanId(["wortschatz","A1","lektion",lessonNumber,"thema",themeNumber].join(" ")),
    cleanId(["wortschatz","A1",config.lessonId,theme.id].join(" "))
  ].filter(Boolean);
}

function findTopicProgress(progress,config,theme){
  const moduleProgress=progress?.wortschatz||progress?.Wortschatz||{};
  const keys=progressKeys(config,theme);
  for(const key of keys){
    if(moduleProgress[key]) return moduleProgress[key];
    if(progress?.topics?.[key]) return progress.topics[key];
  }
  return {};
}

function taskPercent(topic,file){
  const tasks=topic?.tasks||{};
  const direct=tasks[file];
  if(direct) return percent(direct.percent||direct.progress);
  const short=cleanId(file);
  const match=Object.entries(tasks).find(([key])=>cleanId(key)===short);
  return match?percent(match[1]?.percent||match[1]?.progress):0;
}

function themeStarted(topic,theme){
  const taskValues=Object.values(topic?.tasks||{});
  if(taskValues.some(t=>percent(t?.percent||t?.progress)>0 || t?.completed || t?.done)) return true;
  if(percent(topic?.progressPercent||topic?.current?.percent)>0) return true;
  if(topic?.exam?.attempted || topic?.exam?.completed) return true;
  return (theme.tasks||[]).some(file=>taskPercent(topic,file)>0);
}

function themeAllComplete(topic,theme){
  const files=theme.tasks||[];
  const tasksComplete=files.length
    ? files.every(file=>taskPercent(topic,file)>=100)
    : percent(topic?.progressPercent||topic?.current?.percent)>=100;
  const exam=topic?.exam||{};
  const examComplete=exam.completed===true || percent(exam.percent||exam.bestPercent||exam.lastPercent)>=100;
  return tasksComplete && examComplete;
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
    allComplete ? resets+1 : resets
  );
}

export function getThemeStatus({isReleased,started,allComplete,repeats}){
  if(!isReleased) return "locked";
  if(repeats>=3) return "done";
  if(allComplete) return "repeat";
  if(started) return "continue";
  return "new";
}

export function statusText(status){
  return {
    locked:"Gesperrt",
    new:"Neu",
    continue:"Weiter",
    repeat:"Wiederholen",
    done:"Fertig"
  }[status]||"Neu";
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
      <p class="theme-desc">${safeText(theme.text||theme.desc)}</p>
      <div class="theme-meta">${chips}</div>
      <div class="theme-footer">
        <div class="theme-button">${locked?"Gesperrt":"Starten"}</div>
      </div>
    </${tag}>
  `;
}

export async function renderLessonOverview(config){
  const root=document.getElementById(config.rootId||"lessonOverview");
  if(!root) return;

  setColor("--lesson-main",config.color?.main);
  setColor("--lesson-dark",config.color?.dark);
  setColor("--lesson-soft",config.color?.soft);
  setColor("--lesson-line",config.color?.line);
  setColor("--lesson-bg-2",config.color?.bg2||config.color?.soft);

  const profile=getActiveProfile();
  let releaseData={};
  let progress={};
  try{
    releaseData=await loadCourseRelease(profile);
  }catch(e){
    console.warn("Lektionsfreigaben konnten nicht geladen werden:",e);
  }
  try{
    progress=await loadCurrentStudentProgress();
  }catch(e){
    console.warn("Fortschritt konnte nicht geladen werden:",e);
  }
  const account=profileText(profile);
  const dash=dashboardHref ? dashboardHref() : "/student-dashboard/index.html";

  const cards=(config.themes||[]).map(theme=>{
    const open=themeOpen(releaseData,config.module||"wortschatz",config.lessonId,theme.id);
    const topic=findTopicProgress(progress,config,theme);
    const started=themeStarted(topic,theme);
    const allComplete=themeAllComplete(topic,theme);
    const repeats=repeatCount(topic,allComplete);
    const status=getThemeStatus({isReleased:open,started,allComplete,repeats});
    return renderThemeCard(theme,status);
  }).join("");

  root.innerHTML=`
    <div class="sp-page">
      <header class="sp-lesson-header">
        <div class="sp-header-main">
          <a class="sp-brand" href="/index.html">
            <div class="sp-logo">SP</div>
            <div class="sp-title">
              <h1>SprachPilot</h1>
              <div class="sp-subtitle">${safeText(config.subtitle||config.lessonTitle)}</div>
            </div>
          </a>
          <div class="sp-account">
            <span class="sp-pill">${safeText(account)}</span>
            <a class="sp-link" href="${safeText(dash)}">Dashboard</a>
            <a class="sp-link" href="/profile/index.html">Profil</a>
            <button class="sp-link" type="button" id="spLogoutBtn">Abmelden</button>
          </div>
        </div>
        <nav class="sp-nav">
          <a class="sp-back" href="${safeText(config.backHref||"../index.html")}">Zurück</a>
        </nav>
      </header>
      <section class="lesson-title-card">
        <h2>${safeText(config.lessonTitle)}</h2>
      </section>
      <section class="theme-grid">${cards}</section>
      <footer class="sp-note">© SprachPilot</footer>
    </div>
  `;

  const logoutBtn=document.getElementById("spLogoutBtn");
  if(logoutBtn) logoutBtn.addEventListener("click",()=>logout());
}
