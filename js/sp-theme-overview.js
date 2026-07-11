import { getActiveProfile, safeText } from "./auth.js";
import { renderSpHeader, bindSpHeader } from "./sp-header.js";

const DEFAULT_ICONS={
  karteikarten:"🃏",
  artikel:"🔤",
  plural:"🔢",
  hoeren:"🎧",
  sprechen:"🎙️",
  schreiben:"✍️",
  lesen:"📖",
  memory:"🧩",
  zuordnen:"🧲",
  dialog:"💬",
  saetze:"🧱",
  pruefung:"⭐",
  default:"▶"
};

function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function pct(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):0}
function taskFile(task){return String(task?.file||task?.href||"").split("/").pop()}
function taskKey(file){return cleanId(file.replace(/\.html$/i,""))}
function iconFor(task){const key=task.iconKey||taskKey(taskFile(task));return task.icon||DEFAULT_ICONS[key]||DEFAULT_ICONS.default}

function releaseBridge(){return window.SprachPilotRelease||null}
function taskAllowed(task,config={}){
  if(config.showAllTasks)return true;
  const file=taskFile(task);
  if(!file)return false;
  const bridge=releaseBridge();
  if(bridge&&typeof bridge.taskReleased==="function")return bridge.taskReleased(file)!==false;
  return true;
}

function storedProgress(file){
  try{
    const candidates=[
      file,
      taskKey(file),
      location.pathname.replace(/index\.html$/i,"")+file
    ];
    for(const key of candidates){
      const raw=localStorage.getItem(key)||localStorage.getItem("SP_TASK_"+key)||localStorage.getItem("SP_PROGRESS_"+key);
      if(!raw)continue;
      const data=JSON.parse(raw);
      const p=pct(data.percent||data.progress||data.pct||data.donePercent);
      if(p)return p;
      if(data.done||data.completed)return 100;
    }
  }catch(e){}
  return 0;
}

function taskPercent(task,progress={}){
  const file=taskFile(task);
  if(!file)return 0;
  if(typeof task.percent==="number")return pct(task.percent);
  const direct=progress[file]||progress[taskKey(file)]||progress[task.id];
  if(typeof direct==="number")return pct(direct);
  if(direct&&typeof direct==="object")return pct(direct.percent||direct.progress||direct.pct||(direct.done||direct.completed?100:0));
  return storedProgress(file);
}

function allPracticeComplete(tasks,progress){
  const practice=tasks.filter(t=>!t.exam&&!/pruefung/i.test(taskFile(t)));
  return practice.length>0&&practice.every(t=>taskPercent(t,progress)>=100);
}

function statusText(percent,locked=false){
  if(locked)return "Gesperrt";
  if(percent>=100)return "Fertig";
  if(percent>0)return "Weiter";
  return "Starten";
}

function renderTask(task,index,progress,examUnlocked,config){
  const file=taskFile(task);
  const isExam=task.exam||/pruefung/i.test(file);
  const allowed=taskAllowed(task,config);
  if(!allowed&&!isExam)return "";
  const locked=isExam&&!examUnlocked;
  const percent=locked?0:taskPercent(task,progress);
  const href=locked?"#":safeText(task.href||task.file||"#");
  const tag=locked?"div":"a";
  return `<${tag} class="sp-task-card ${locked?"is-locked":""}" ${locked?'aria-disabled="true"':`href="${href}"`}>
    <div class="sp-task-card__top">
      <div class="sp-task-card__number">${index+1}. ${safeText(task.title||task.name||"Aufgabe")}</div>
      <div class="sp-task-card__icon">${safeText(iconFor(task))}</div>
    </div>
    <div class="sp-task-card__text">${safeText(task.text||task.desc||"")}</div>
    <div class="sp-task-card__footer">
      <div class="sp-task-card__mini-bar"><div class="sp-task-card__mini-fill" style="width:${percent}%"></div></div>
      <div class="sp-task-card__status">${locked?"Prüfung gesperrt":statusText(percent)}</div>
    </div>
  </${tag}>`;
}

export function renderThemeOverview(config){
  const root=document.getElementById(config.rootId||"themeOverview");
  if(!root)return;
  const profile=getActiveProfile();
  const tasks=config.tasks||[];
  const progress=config.progress||{};
  const visiblePractice=tasks.filter(t=>!t.exam&&!/pruefung/i.test(taskFile(t))&&taskAllowed(t,config));
  const examUnlocked=allPracticeComplete(visiblePractice,progress);
  const visibleTasks=tasks.filter(t=>taskAllowed(t,config)||t.exam||/pruefung/i.test(taskFile(t)));
  const avg=visiblePractice.length?Math.round(visiblePractice.reduce((sum,t)=>sum+taskPercent(t,progress),0)/visiblePractice.length):0;

  root.innerHTML=`<div class="sp-theme-page">
    ${renderSpHeader({profile})}
    <section class="sp-theme-progress">
      <div class="sp-theme-progress__top"><span>${safeText(config.title||"Thema")}</span><span>${avg}%</span></div>
      <div class="sp-theme-progress__bar"><div class="sp-theme-progress__fill" style="width:${avg}%"></div></div>
    </section>
    <section class="sp-task-grid">${visibleTasks.map((task,i)=>renderTask(task,i,progress,examUnlocked,config)).join("")}</section>
  </div>`;
  bindSpHeader(root);
}

window.SprachPilotThemeOverview={renderThemeOverview};