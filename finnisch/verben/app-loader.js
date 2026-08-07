const SOURCE_URL='./app-standard.js?v=fi-verben-standard11-source';
try{
  const response=await fetch(SOURCE_URL,{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let source=await response.text();

  // Alte Aufgabe 7 „Lesen/Bild → Hören“ vollständig aus Aufgabenliste und Fortschritt entfernen.
  source=source.replace(/,\['read-sentence','▣→🔊','Bild → Hören'\]/,'');

  // Bedeutungen immer zuerst aus dem gemeinsamen A1-Wörterbuch nehmen.
  source=source.replace(
    "const clue=v=>CLUES[v.de]||'die Handlung auf dem Bild ausführen';",
    "const clue=v=>window.SP_VERB_A1_MEANINGS?.[v.de]||CLUES[v.de]||'die Handlung auf dem Bild';"
  );

  // Alte direkte Links zur entfernten Aufgabe werden nicht mehr geöffnet.
  source=source.replace(
    "function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||'',view:q.get('view')||''}}",
    "function route(){const q=new URLSearchParams(location.search),raw=q.get('task')||'';return{group:Number(q.get('group'))||0,task:TASKS.some(x=>x[0]===raw)?raw:'',view:q.get('view')||''}}"
  );

  const blob=new Blob([source],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  try{
    await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  await import('./sentence-a1-ui.js?v=1');
} catch(error){
  console.error('Finnische Verben konnten nicht geladen werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
