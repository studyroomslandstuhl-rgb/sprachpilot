import {getActiveProfile,getActiveRole} from '/js/auth.js?v=login-main-4';
import {loadCourseRelease,releasedVerbs} from '/js/course-releases.js?v=verb-release-order1';

const uniq=list=>{const seen=new Set(),out=[];(list||[]).forEach(v=>{v=String(v||'').trim();if(v&&!seen.has(v)){seen.add(v);out.push(v)}});return out};
function releaseOrder(data){
 const candidates=[data?.verbReleaseOrder,data?.releases?.Verben?.wordOrder,data?.releases?.verben?.wordOrder,data?.releases?.['Verben A1']?.wordOrder,data?.releases?.['verben-A1']?.wordOrder];
 return uniq(candidates.find(Array.isArray)||[])
}
function orderedReleased(data,allDe){
 const active=releasedVerbs(data,allDe),activeSet=new Set(active),out=[],seen=new Set();
 releaseOrder(data).forEach(v=>{if(activeSet.has(v)&&!seen.has(v)){seen.add(v);out.push(v)}});
 active.forEach(v=>{if(!seen.has(v)){seen.add(v);out.push(v)}});
 return out
}
async function prepareFinnishGroups(){
 const all=(window.SP_FI_VERBS||[]).slice(),byDe=new Map(all.map(v=>[v.de,v]));
 const role=String(getActiveRole()||'').toLowerCase();
 let ordered=all;
 if(role!=='teacher'){
  const profile=getActiveProfile()||{};
  let data=profile.assignments||{};
  try{data=await loadCourseRelease(profile)||data}catch{}
  ordered=orderedReleased(data,all.map(v=>v.de)).map(de=>byDe.get(de)).filter(Boolean);
 }
 const fullCount=Math.floor(ordered.length/20)*20;
 window.SP_FI_PENDING_VERBS=ordered.slice(fullCount);
 window.SP_FI_VERBS=ordered.slice(0,fullCount);
}

const SOURCE_URL='./app-standard.js?v=fi-verben-standard14-source';
try{
  await prepareFinnishGroups();
  const response=await fetch(SOURCE_URL,{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let source=await response.text();

  source=source.replace(
    'from "/js/auth.js?v=login-main-4";',
    `from "${location.origin}/js/auth.js?v=login-main-4";`
  );

  // Aufgabe 7 bleibt vollständig entfernt.
  source=source.replace(/,\['read-sentence','▣→🔊','Bild → Hören'\]/,'');

  // Gemeinsame kurze A1-Bedeutungen verwenden.
  source=source.replace(
    "const clue=v=>CLUES[v.de]||'die Handlung auf dem Bild ausführen';",
    "const clue=v=>window.SP_VERB_A1_MEANINGS?.[v.de]||CLUES[v.de]||'die Handlung auf dem Bild';"
  );

  // Alte direkte Links zu entfernten Aufgaben nicht mehr öffnen.
  source=source.replace(
    "function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||'',view:q.get('view')||''}}",
    "function route(){const q=new URLSearchParams(location.search),raw=q.get('task')||'';return{group:Number(q.get('group'))||0,task:TASKS.some(x=>x[0]===raw)?raw:'',view:q.get('view')||''}}"
  );

  // Jede Aufgabe einer 20er-Gruppe verwendet alle 20 Verben.
  source=source.replace(
    "function targets(id,t){const g=GROUPS[id-1];if(!g)return[];return['choose-form','write-form','speak-form','sentence'].includes(t)?g.verbs.filter(v=>forms(v)):g.verbs}",
    "function targets(id,t){const g=GROUPS[id-1];if(!g)return[];return g.verbs}"
  );

  // Fehlende Formen kommen aus derselben zentralen finnischen Formenfunktion.
  source=source.replace(
    "function forms(v){if(FORMS[v.fi])return FORMS[v.fi];return null}",
    "function forms(v){return FORMS[v.fi]||window.SP_FI_ALL_FORMS?.(v.fi)||null}"
  );

  const blob=new Blob([source],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  try {
    await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  await import('./sentence-a1-all.js?v=4');
} catch(error){
  console.error('Finnische Verben konnten nicht geladen werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
