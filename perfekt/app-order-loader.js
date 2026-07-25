(async function(){
 'use strict';
 const sourceUrl='/perfekt/app-stable.js?v=perfekt-order1';
 const original="const CATEGORY_ORDER=[['reflexive','Reflexive Verben'],['separable','Trennbare Verben'],['strong','Starke / unregelmäßige Verben'],['ieren','Verben auf -ieren'],['inseparable','Nicht trennbare Verben'],['weak','Regelmäßige Verben']];";
 const replacement="const CATEGORY_ORDER=[['weak','Regelmäßige Verben'],['reflexive','Reflexive Verben'],['strong','Starke / unregelmäßige Verben'],['ieren','Verben auf -ieren'],['inseparable','Nicht trennbare Verben'],['separable','Trennbare Verben']];";
 try{
  const response=await fetch(sourceUrl,{cache:'no-store'});
  if(!response.ok)throw new Error('Perfekt-App konnte nicht geladen werden.');
  const source=await response.text();
  if(!source.includes(original))throw new Error('Die Gruppenreihenfolge konnte nicht gefunden werden.');
  const module=document.createElement('script');
  module.type='module';
  module.textContent=source.replace(original,replacement)+"\n//# sourceURL=/perfekt/app-stable-order1.js";
  document.head.appendChild(module)
 }catch(error){
  console.error(error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Perfekt konnte nicht geladen werden</h2><p>Bitte öffne den Verben-Bereich erneut.</p><a class="btn" href="/verben-bereich/">Zum Verben-Bereich</a></section>'
 }
})();
