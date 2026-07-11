import { getActiveProfile, logout, safeText, dashboardHref } from "./auth.js";

function profileText(profile){
  if(!profile) return "Nicht eingeloggt";
  const name=[profile.vorname||profile.firstName||profile.name,profile.nachname||profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const course=profile.kurs||profile.kursnummer||profile.courseCode||profile.course||"";
  return [name||profile.email||"Profil",course].filter(Boolean).join(" · ");
}

function navItem(item){
  if(!item) return "";
  const danger=item.variant==="danger" ? " is-danger" : "";
  if(item.type==="button"){
    return `<button class="sp-header__nav-link${danger}" type="button" ${item.action?`data-sp-action="${safeText(item.action)}"`:""}>${safeText(item.label)}</button>`;
  }
  return `<a class="sp-header__nav-link${danger}" href="${safeText(item.href||"#")}">${safeText(item.label)}</a>`;
}

export function renderSpHeader(options={}){
  const profile=options.profile||getActiveProfile();
  const account=options.accountText||profileText(profile);
  const title=options.title||"SprachPilot";
  const subtitle=options.subtitle||"";
  const homeHref=options.homeHref||"/index.html";
  const dash=options.dashboardHref||((typeof dashboardHref==="function") ? dashboardHref() : "/student-dashboard/index.html");
  const nav=(options.navItems||[]).map(navItem).join("");

  return `
    <header class="sp-header ${safeText(options.variant?`sp-header--${options.variant}`:"")}">
      <div class="sp-header__main">
        <a class="sp-header__brand" href="${safeText(homeHref)}">
          <span class="sp-header__logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></span>
          <span class="sp-header__title">
            <h1>${safeText(title)}</h1>
            ${subtitle?`<span class="sp-header__subtitle">${safeText(subtitle)}</span>`:""}
          </span>
        </a>
        <div class="sp-header__account">
          <span class="sp-header__pill">${safeText(account)}</span>
          <a class="sp-header__button" href="${safeText(dash)}">Dashboard</a>
          <a class="sp-header__button" href="/profile/index.html">Profil</a>
          <button class="sp-header__button" type="button" data-sp-logout>Abmelden</button>
        </div>
      </div>
      ${nav?`<nav class="sp-header__nav">${nav}</nav>`:""}
    </header>
  `;
}

export function bindSpHeader(root=document){
  root.querySelectorAll("[data-sp-logout]").forEach(button=>{
    button.addEventListener("click",()=>logout());
  });
}
