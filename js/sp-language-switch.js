(() => {
  "use strict";

  const SWITCH_ID = "spLanguageSwitch";
  const STYLE_ID = "spLanguageSwitchStyle";
  const STORAGE_KEY = "SP_LEARNING_LANGUAGE";

  function inFinnishArea() {
    const path = String(location.pathname || "").toLowerCase();
    return path === "/finnisch" || path.startsWith("/finnisch/");
  }

  function currentLanguage() {
    return inFinnishArea() ? "fi" : "de";
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${SWITCH_ID}.sp-language-switch{
        display:flex;
        align-items:center;
        margin:0;
        flex:0 0 auto;
      }
      #${SWITCH_ID} .sp-language-select{
        width:auto !important;
        min-width:126px;
        max-width:155px;
        margin:0 !important;
        padding:7px 28px 7px 10px !important;
        border:1px solid #d9eef7 !important;
        border-radius:10px !important;
        background:#effaff !important;
        color:#123047 !important;
        font:inherit;
        font-size:13px !important;
        font-weight:800 !important;
        line-height:1.2;
        box-shadow:none !important;
        cursor:pointer;
      }
      #${SWITCH_ID} .sp-language-select:focus{
        outline:2px solid #84e3ff;
        outline-offset:2px;
      }
      @media (max-width:520px){
        #${SWITCH_ID} .sp-language-select{
          min-width:118px;
          max-width:132px;
          padding-left:8px !important;
          padding-right:24px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildSwitch() {
    const wrap = document.createElement("div");
    wrap.id = SWITCH_ID;
    wrap.className = "sp-language-switch";

    const select = document.createElement("select");
    select.id = "spLanguageSelect";
    select.className = "sp-language-select";
    select.setAttribute("aria-label", "Lernsprache wählen");

    const de = document.createElement("option");
    de.value = "de";
    de.textContent = "🇩🇪 Deutsch";

    const fi = document.createElement("option");
    fi.value = "fi";
    fi.textContent = "🇫🇮 Finnisch";

    select.append(de, fi);
    select.value = currentLanguage();

    select.addEventListener("change", () => {
      const lang = select.value === "fi" ? "fi" : "de";
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (_) {}

      location.href = lang === "fi" ? "/finnisch/" : "/index.html";
    });

    wrap.append(select);
    return wrap;
  }

  function mount() {
    const strip = document.getElementById("accountStrip");
    if (!strip) return false;

    addStyles();

    let links = strip.querySelector(".account-links");
    if (!links) return false;

    const existing = document.getElementById(SWITCH_ID);
    if (existing && existing.parentElement === links) {
      const select = existing.querySelector("select");
      if (select) select.value = currentLanguage();
      return true;
    }

    if (existing) existing.remove();
    links.prepend(buildSwitch());
    return true;
  }

  let scheduled = false;
  function scheduleMount() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      mount();
    });
  }

  function init() {
    mount();

    const observer = new MutationObserver(() => {
      if (!document.getElementById(SWITCH_ID)) scheduleMount();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
