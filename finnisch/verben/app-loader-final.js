const SOURCE='./app-loader.js?v=9-base';
try{
  const response=await fetch(SOURCE,{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let source=await response.text();
  const old=`const fullCount=Math.floor(ordered.length/20)*20;\n window.SP_FI_PENDING_VERBS=ordered.slice(fullCount);\n window.SP_FI_VERBS=ordered.slice(0,fullCount);`;
  const next=`window.SP_FI_PENDING_VERBS=[];\n window.SP_FI_VERBS=ordered.slice();`;
  if(!source.includes(old))throw new Error('Finnische Restgruppen-Logik wurde nicht gefunden');
  source=source.replace(old,next);
  const blob=new Blob([source],{type:'text/javascript'}),url=URL.createObjectURL(blob);
  try{await import(url)}finally{URL.revokeObjectURL(url)}
}catch(error){
  console.error('Finnischer Verben-Loader konnte nicht gestartet werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
