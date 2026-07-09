(function(){
  function app(){return document.getElementById('app')}
  function hasContent(){const el=app();return !!(el&&String(el.innerHTML||'').trim())}
  function remember(kind,value){try{localStorage.setItem('SP_VERBS_LAST_WATCHDOG_'+kind,String(value&&value.stack||value&&value.message||value||''))}catch(e){}}
  function fallback(error){
    const el=app();
    if(!el||hasContent())return;
    remember('ERROR',error);
    el.classList.remove('card');
    el.innerHTML='<section class="card"><h2>Verben konnten nicht vollständig geladen werden</h2><p class="small">Bitte einmal neu laden. Wenn es danach weiter leer bleibt, öffne das Dashboard und komme zurück zu Verben.</p><div class="actions"><button class="btn secondary" onclick="location.reload()">Neu laden</button><button class="btn secondary" onclick="try{renderVerbChooser()}catch(e){location.href=\'/student-dashboard/index.html\'}">Verben wählen</button><a class="btn secondary" href="/student-dashboard/index.html">Zum Dashboard</a></div></section>';
  }
  function retry(){
    if(hasContent())return;
    try{
      if(typeof renderVerbNeutralHome==='function')renderVerbNeutralHome();
      else if(typeof renderHome==='function')renderHome();
    }catch(e){fallback(e);return}
    setTimeout(function(){fallback('empty after retry')},700);
  }
  window.addEventListener('error',function(e){remember('JS',e.message||e.error);setTimeout(retry,0)});
  window.addEventListener('unhandledrejection',function(e){remember('PROMISE',e.reason);setTimeout(retry,0)});
  document.addEventListener('DOMContentLoaded',function(){setTimeout(retry,1500);setTimeout(retry,4000)});
})();
