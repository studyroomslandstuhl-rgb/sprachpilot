(function(){
  const TASK_ORDER=[
    ["karteikarten.html","Karteikarten"],
    ["bild-wort.html","Bild → Wort"],
    ["wort-bild.html","Wort → Bild"],
    ["hoeren.html","Hören"],
    ["sprechen.html","Sprechen"],
    ["schreiben.html","Schreiben"],
    ["artikel.html","Artikel"],
    ["drag-drop-artikel.html","Artikel zuordnen"],
    ["plural.html","Plural schreiben"],
    ["plural-drag-drop.html","Pluralgruppen"],
    ["memory.html","Memory"],
    ["pruefung.html","Prüfung"],
    ["ein-eine.html","Das ist ..."],
    ["kein-keine.html","Nein, das ist ..."],
    ["fragen-ohne-fragewort.html","Fragen ohne Fragewort"],
    ["fragen-mit-fragewort.html","Fragen mit Fragewort"]
  ];
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  function currentTask(){
    const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    const idx=TASK_ORDER.findIndex(t=>t[0]===file);
    if(idx<0) return null;
    return {file:TASK_ORDER[idx][0],name:TASK_ORDER[idx][1],number:idx+1};
  }
  const originalHeader=window.header;
  window.header=function(title){
    if(typeof originalHeader==="function") originalHeader(title);
    const task=currentTask();
    const topbar=document.querySelector(".topbar");
    if(!topbar) return;
    const sub=topbar.querySelector(".sub");
    if(sub){
      sub.textContent="A1 Lektion 3 · Thema 1";
      let taskTitle=topbar.querySelector(".task-title");
      if(!taskTitle){
        taskTitle=document.createElement("div");
        taskTitle.className="task-title";
        sub.insertAdjacentElement("afterend",taskTitle);
      }
      taskTitle.innerHTML=esc(task?`${task.number}. ${task.name}`:title);
    }
    topbar.querySelectorAll('a[href="statistik.html"]').forEach(a=>a.remove());
    const firstBack=topbar.querySelector(".nav a");
    if(firstBack){
      firstBack.href="index.html";
      firstBack.textContent="← Zurück";
    }
  };
  function award(file){
    if(window.SprachPilotScoring&&typeof window.SprachPilotScoring.awardTask==="function"){
      window.SprachPilotScoring.awardTask(file);
      return;
    }
    if(!window.__l3t1ScoringLoad){
      window.__l3t1ScoringLoad=import("/js/scoring.js?v=6").catch(()=>null);
    }
    window.__l3t1ScoringLoad.then(()=>window.SprachPilotScoring&&window.SprachPilotScoring.awardTask&&window.SprachPilotScoring.awardTask(file));
  }
  window.complete=function(area,file,next){
    if(typeof window.finishTask==="function") window.finishTask(file);
    if(file!=="pruefung.html") award(file);
    area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Gut gemacht!</div><div class="big">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="actions finish-actions"><a class="btn green" href="${esc(next)}">Weiter</a><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>`;
  };
  const oldFix=window.fixImg;
  window.fixImg=function(img){
    if(!img.dataset.retry){
      img.dataset.retry="1";
      const src=img.getAttribute("src")||"";
      img.src=src.replace("../bilder/","/wortschatz/A1-Lektion-3/bilder/");
      return;
    }
    if(typeof oldFix==="function") oldFix(img);
    const box=document.createElement("div");
    box.className="food-img image-fallback";
    box.textContent=img.alt||"Bild";
    img.replaceWith(box);
  };
})();