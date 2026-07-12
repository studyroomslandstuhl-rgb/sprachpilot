import { getActiveProfile, safeText } from "./auth.js";
import { renderSpHeader, bindSpHeader } from "./sp-header.js";
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
      <p class="theme-desc">${safeText(theme.text||theme.desc||"")}</p>
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

  function removeForeignHeaders(){
    document.querySelectorAll(".sp-header").forEach(header=>{
      if(!root.contains(header)) header.remove();
    });
  }

  function draw(releaseData={},progress={},ready=false){
    removeForeignHeaders();
    const cards=(config.themes||[]).map(theme=>{
      const open=ready ? themeOpen(releaseData,config.module||"wortschatz",config.lessonId,theme.id) : true;
      const topic=findTopicProgress(progress,config,theme);
      const started=ready ? themeStarted(topic,theme) : false;
      const allComplete=ready ? themeAllComplete(topic,theme) : false;
      const repeats=ready ? repeatCount(topic,allComplete) : 0;
      const status=getThemeStatus({isReleased:open,started,allComplete,repeats});
      return renderThemeCard(theme,status);
    }).join("");

    root.innerHTML=`
      <div class="sp-page">
        ${renderSpHeader({profile})}
        <section class="lesson-title-card">
          <h2>${safeText(config.lessonTitle)}</h2>
        </section>
        <section class="theme-grid">${cards}</section>
        <footer class="sp-note">© SprachPilot</footer>
      </div>
    `;

    bindSpHeader(root);
  }

  removeForeignHeaders();
  draw({}, {}, false);

  const [releaseResult,progressResult]=await Promise.allSettled([
    loadCourseRelease(profile),
    loadCurrentStudentProgress()
  ]);
  if(releaseResult.status==="rejected")console.warn("Lektionsfreigaben konnten nicht geladen werden:",releaseResult.reason);
  if(progressResult.status==="rejected")console.warn("Fortschritt konnte nicht geladen werden:",progressResult.reason);
  draw(
    releaseResult.status==="fulfilled"?releaseResult.value:{},
    progressResult.status==="fulfilled"?progressResult.value:{},
    true
  );
}