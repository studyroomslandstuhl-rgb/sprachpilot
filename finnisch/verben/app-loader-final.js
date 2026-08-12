const SOURCE='./app-loader.js?v=10-mobile-safe';
try{
  const response=await fetch(SOURCE,{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let source=await response.text();

  // app-loader.js wird als Blob-Modul gestartet. Relative/Root-Imports sind
  // aus Blob-URLs auf manchen mobilen Browsern nicht zuverlässig auflösbar.
  // Deshalb alle Abhängigkeiten vor dem Import auf vollständige HTTPS-URLs setzen.
  source=source.replace(
    "from '/js/auth.js?v=login-main-4';",
    `from '${location.origin}/js/auth.js?v=login-main-4';`
  );
  source=source.replace(
    "from '/js/course-releases.js?v=verb-release-order1';",
    `from '${location.origin}/js/course-releases.js?v=verb-release-order1';`
  );
  source=source.replace(
    "const SOURCE_URL='./app-standard.js?v=fi-verben-standard15-source';",
    `const SOURCE_URL='${location.origin}/finnisch/verben/app-standard.js?v=fi-verben-standard15-source';`
  );

  // Auch die letzte, noch nicht volle Gruppe soll angezeigt werden.
  const pattern=/const fullCount=Math\.floor\(ordered\.length\/20\)\*20;\s*window\.SP_FI_PENDING_VERBS=ordered\.slice\(fullCount\);\s*window\.SP_FI_VERBS=ordered\.slice\(0,fullCount\);/;
  if(pattern.test(source)){
    source=source.replace(pattern,'window.SP_FI_PENDING_VERBS=[];\n  window.SP_FI_VERBS=ordered.slice();');
  }

  source=source.replace(
    "await import('./sentence-a1-all.js?v=5');",
    `await import('${location.origin}/finnisch/verben/sentence-a1-all.js?v=5');`
  );

  const blob=new Blob([source],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  try{
    await import(url);
  }finally{
    URL.revokeObjectURL(url);
  }
}catch(error){
  console.error('Finnischer Verben-Loader konnte nicht gestartet werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
