(function(){
  function simplifyNav(){
    try{
      document.querySelectorAll('.nav a,.nav button').forEach(el=>{
        const t=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(t.includes('Zurück')||t==='Übersicht')return;
        el.remove();
      });
    }catch(e){}
  }
  function showFallback(){
    const area=document.getElementById('area');
    const grid=document.getElementById('tasksGrid');
    const card=document.querySelector('.card');
    if(grid && !grid.innerHTML.trim() && typeof TASK_FILES!=='undefined'){
      try{
        grid.innerHTML=TASK_FILES.map((f,i)=>{
          const title=(typeof TASK_TITLES!=='undefined'&&TASK_TITLES[f])||f;
          const total=typeof getTotal==='function'?getTotal(f):1;
          const p=typeof pct==='function'?pct(f,total):0;
          return `<a class="module" href="${f}"><div class="num">${i+1}. ${title}</div><div class="icon">▶</div><p>Aufgabe öffnen.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`;
        }).join('')+`<a class="module ${typeof examUnlocked==='function'&&examUnlocked()?'':'exam-locked'}" href="${typeof examUnlocked==='function'&&examUnlocked()?'pruefung.html':'#'}"><div class="num">Prüfung</div><div class="icon">★</div><p>${typeof examUnlocked==='function'&&examUnlocked()?'Teste dein Wissen.':'Erst alle Aufgaben 100%.'}</p><div class="start">${typeof examUnlocked==='function'&&examUnlocked()?'Starten':'Gesperrt'}</div></a>`;
      }catch(e){}
    }
    if(area && !area.innerHTML.trim() && /pruefung\.html$/i.test(location.pathname)){
      try{
        if(typeof examUnlocked==='function'&&examUnlocked()&&typeof startExam==='function')startExam();
        else if(!(typeof examUnlocked==='function'&&examUnlocked())) area.innerHTML='<div class="finish-box"><div class="question">Prüfung gesperrt</div><p>Schließe zuerst alle Aufgaben mit 100% ab.</p><div class="actions"><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>';
      }catch(e){area.innerHTML='<div class="finish-box"><div class="question">Seite konnte nicht geladen werden</div><p class="small">Bitte zurück zum Thema und die Seite neu öffnen.</p><div class="actions"><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>'}
    }
    if(card && !card.textContent.trim() && !grid){
      card.innerHTML='<div class="finish-box"><div class="question">Seite konnte nicht geladen werden</div><p class="small">Bitte gehe zurück zum Thema und öffne die Aufgabe erneut.</p><div class="actions"><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>';
    }
  }
  window.addEventListener('error',()=>setTimeout(showFallback,50));
  window.addEventListener('unhandledrejection',()=>setTimeout(showFallback,50));
  document.addEventListener('DOMContentLoaded',()=>{simplifyNav();setTimeout(showFallback,80);setTimeout(showFallback,500)});
  setTimeout(()=>{simplifyNav();showFallback()},1000);
})();