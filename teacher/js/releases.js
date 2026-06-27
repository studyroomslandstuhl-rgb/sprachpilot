// Deprecated compatibility bridge.
// The active release logic is now in /teacher/releases.js.
// This file used to contain HTML by mistake, which caused a JavaScript syntax error
// if it was ever loaded as a script.
(function(){
  try {
    if (typeof window.renderReleaseEditor === "function") return;
    var script = document.createElement("script");
    script.src = "../releases.js?v=step17";
    script.defer = true;
    document.head.appendChild(script);
  } catch (e) {
    console.warn("SprachPilot release bridge konnte nicht geladen werden", e);
  }
})();
