import { getActiveProfile, logout, safeText, dashboardHref } from "./auth.js";

const LESSONS={
  1:{title:"Lektion 1",subtitle:"Wortschatz · A1 Lektion 1",color:{main:"#2f95ad",dark:"#0b5c73"}},
  2:{title:"Lektion 2",subtitle:"Wortschatz · A1 Lektion 2",color:{main:"#6f8f2f",dark:"#3d5415"}},
  3:{title:"Lektion 3: Einkaufen",subtitle:"Wortschatz · A1 Lektion 3 · Einkaufen",color:{main:"#f6b46b",dark:"#8a4f16"}},
  4:{title:"Lektion 4: Wohnen",subtitle:"Wortschatz · A1 Lektion 4 · Wohnen",color:{main:"#f6d96b",dark:"#6d5a00"}},
  5:{title:"Lektion 5: Mein Tag",subtitle:"Wortschatz · A1 Lektion 5 · Mein Tag",color:{main:"#2f95ad",dark:"#0b5c73"}},
  6:{title:"Lektion 6: Wetter",subtitle:"Wortschatz · A1 Lektion 6 · Wetter",color:{main:"#FFB6C1",dark:"#8a3a4f"}}
};

function profileText(profile){
  if(!profile) return "Nicht eingeloggt";
  const name=[profile.vorname||profile.firstName||profile.name,profile.nachname||profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const course=profile.kurs||profile.kursnummer||profile.courseCode||profile.course||"";
  return [name||profile.email||"Profil",course].filter(Boolean).join(" · ");
}

function fileTitle(file){
  const raw=String(file||"").replace(/\.html$/i,"").replace(/[-_]+/g," ").trim();
  if(!raw||raw.toLowerCase()==="index") return "";
  return raw.charAt(0).toUpperCase()+raw.slice(1);
}

function setColor(name,value){
  if(value) document.documentElement.style.setProperty(name,value);
}

function lessonHref(lessonNumber){return `/wortschatz/A1-Lektion-${lessonNumber}/`}
function themeHref(lessonNumber,themeNumber){return `/wortschatz/A1-Lektion-${lessonNumber}/Thema-${themeNumber}/`}

export function detectSpHeaderContext(pathname=window.location.pathname){
  const path=String(pathname||"/").replace(/\/index\.html$/i,"/");
  const match=path.match(/\/wortschatz\/A1-Lektion-(\d+)\/?(?:Thema-(\d+)\/?)?(?:([^/]+\.html))?$/i);
  if(match){
    const lessonNumber=Number(match[1]);
    const themeNumber=match[2] ? Number(match[2]) : null;
    const file=match[3]||"";
    const lesson=LESSONS[lessonNumber]||{title:`Lektion ${lessonNumber}`,subtitle:`Wortschatz · A1 Lektion ${lessonNumber}`,color:{}};
    const isTask=!!file && !/^index\.html$/i.test(file);
    const level=isTask ? "task" : (themeNumber ? "theme" : "lesson");
    const taskTitle=fileTitle(file);
    const subtitle=level==="task"
      ? `${taskTitle} · A1 Lektion ${lessonNumber} · Thema ${themeNumber}`
      : level==="theme"
        ? `A1 Lektion ${lessonNumber} · Thema ${themeNumber}`
        : lesson.subtitle;
    const backHref=level==="lesson" ? "/wortschatz/" : (level==="theme" ? lessonHref(lessonNumber) : themeHref(lessonNumber,themeNumber));
    const overviewHref=themeNumber ? themeHref(lessonNumber,themeNumber) : lessonHref(lessonNumber);
    const navItems=level==="lesson"
      ? [{label:"← Zurück",href:backHref}]
      : [
          {label:"← Zurück",href:backHref},
          {label:"Übersicht",href:overviewHref},
          {label:"Fortschritte löschen",type:"button",action:"reset-progress",variant:"danger"}
        ];
    return {area:"wortschatz",level,lessonNumber,themeNumber,taskTitle,title:"SprachPilot",subtitle,navItems,color:lesson.color,variant:level};
  }

  if(/^\/verben-A1\/?/i.test(path)){
    return {area:"verben-A1",level:"verben",title:"SprachPilot",subtitle:"Verben A1",navItems:[{label:"← Zurück",href:"/student-dashboard/index.html"}],color:{main:"#2f95ad",dark:"#0b5c73"},variant:"verben"};
  }

  return {area:"default",level:"default",title:"SprachPilot",subtitle:"",navItems:[],color:{main:"#2f95ad",dark:"#0b5c73"},variant:"default"};
}

function navItem(item){
  if(!item) return "";
  const danger=item.variant==="danger" ? " is-danger" : "";
  if(item.type==="button")return `<button class="sp-header__nav-link${danger}" type="button" ${item.action?`data-sp-action="${safeText(item.action)}"`:""}>${safeText(item.label)}</button>`;
  return `<a class="sp-header__nav-link${danger}" href="${safeText(item.href||"#")}">${safeText(item.label)}</a>`;
}

export function renderSpHeader(options={}){
  const detected=detectSpHeaderContext(options.pathname||window.location.pathname);
  const context={...detected,...options};
  const color={...(detected.color||{}),...(options.color||{})};
  setColor("--lesson-main",color.main);
  setColor("--lesson-dark",color.dark);

  const profile=context.profile||getActiveProfile();
  const account=context.accountText||profileText(profile);
  const title=context.title||"SprachPilot";
  const subtitle=context.subtitle||"";
  const homeHref=context.homeHref||"/index.html";
  const dash=context.dashboardHref||((typeof dashboardHref==="function") ? dashboardHref() : "/student-dashboard/index.html");
  const nav=(context.navItems||[]).map(navItem).join("");

  return `<header class="sp-header ${safeText(context.variant?`sp-header--${context.variant}`:"")}"><div class="sp-header__main"><a class="sp-header__brand" href="${safeText(homeHref)}"><span class="sp-header__logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></span><span class="sp-header__title"><h1>${safeText(title)}</h1>${subtitle?`<span class="sp-header__subtitle">${safeText(subtitle)}</span>`:""}</span></a><div class="sp-header__account"><span class="sp-header__pill">${safeText(account)}</span><a class="sp-header__button" href="${safeText(dash)}">Dashboard</a><a class="sp-header__button" href="/profile/index.html">Profil</a><button class="sp-header__button" type="button" data-sp-logout>Abmelden</button></div></div>${nav?`<nav class="sp-header__nav">${nav}</nav>`:""}</header>`;
}

export function bindSpHeader(root=document){
  root.querySelectorAll("[data-sp-logout]").forEach(button=>{if(button.dataset.spBound)return;button.dataset.spBound="1";button.addEventListener("click",()=>logout())});
  root.querySelectorAll('[data-sp-action="reset-progress"]').forEach(button=>{if(button.dataset.spBound)return;button.dataset.spBound="1";button.addEventListener("click",()=>{if(typeof window.resetThemeProgress==="function")window.resetThemeProgress();else window.dispatchEvent(new CustomEvent("sp:reset-theme-progress"))})});
}

function ensureHeaderCss(){
  if(document.querySelector('link[href="/css/sp-header.css"]')) return;
  const link=document.createElement("link");
  link.rel="stylesheet";
  link.href="/css/sp-header.css";
  document.head.appendChild(link);
}

function hideOldAccountStrip(){document.querySelectorAll("#accountStrip,.account-strip").forEach(el=>{el.remove()})}
function removeExtraSharedHeaders(){[...document.querySelectorAll(".sp-header")].slice(1).forEach(el=>el.remove())}
function removeOldHeaders(){document.querySelectorAll(".topbar,#spHeader").forEach(el=>{if(!el.classList.contains("sp-header"))el.remove()});document.querySelectorAll(".hero").forEach(hero=>{if(!hero.textContent.trim()&&!hero.querySelector("img,video,canvas,.sp-header"))hero.remove()})}

function replaceOldHeader(){
  hideOldAccountStrip();
  removeExtraSharedHeaders();
  const existing=document.querySelector(".sp-header");
  if(existing){removeOldHeaders();bindSpHeader(document);return true}
  const html=renderSpHeader();
  const explicit=document.getElementById("spHeader");
  if(explicit){explicit.outerHTML=html;bindSpHeader(document);return true}
  const topbar=document.querySelector(".topbar");
  if(topbar){topbar.outerHTML=html;bindSpHeader(document);return true}
  const hero=document.querySelector(".hero");
  if(hero){hero.outerHTML=html;bindSpHeader(document);return true}
  return false;
}

export function installSpHeader(){
  ensureHeaderCss();
  hideOldAccountStrip();
  const run=()=>replaceOldHeader();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
  window.addEventListener("load",run,{once:true});
  setTimeout(run,100);setTimeout(run,500);setTimeout(run,1200);setTimeout(run,2500);
  if(!window.SP_HEADER_OBSERVER){window.SP_HEADER_OBSERVER=new MutationObserver(()=>run());const startObserver=()=>document.body&&window.SP_HEADER_OBSERVER.observe(document.body,{childList:true,subtree:true});if(document.body)startObserver();else document.addEventListener("DOMContentLoaded",startObserver,{once:true})}
}

export function renderAutoSpHeader(target=document.getElementById("spHeader")){if(!target)return;target.outerHTML=renderSpHeader();bindSpHeader(document)}
if(document.currentScript?.hasAttribute("data-sp-auto-header"))installSpHeader();