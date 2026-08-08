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

const SOURCE_URL='./app-standard.js?v=fi-verben-standard15-source';
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

  // Die Prüfung nutzt jedes der 20 Verben genau einmal und mischt alle aktuellen
  // prüfbaren Aufgabentypen. Karteikarten sind Lernhilfe und kein Prüfungsformat.
  const examCode=String.raw`
const FI_EXAM_TASKS=['meaning-to-verb','verb-to-meaning','listen','image-to-verb','verb-to-image','verb-type','choose-form','write-form','speak-form','sentence'];
function fiExamQuestion(id,item){
 const group=GROUPS[id-1],v=group&&group.verbs.find(x=>x.de===item.de);if(!v)return null;
 let q=qFor(id,item.task,v);
 if(item.task==='sentence'){
  const f=forms(v),fallback=f?((v.index%2===0?'Maria '+f[2]:'Minä '+f[0])+' tänään.'):(v.fi+'.');
  const sentence=(window.SP_FI_SENTENCE_FOR_VERB&&window.SP_FI_SENTENCE_FOR_VERB(v,id))||fallback;
  q={kind:'blocks',prompt:'Bringe die Wörter in die richtige Reihenfolge.',answer:sentence,solution:sentence};
 }
 return Object.assign({},q,{v:v});
}
function fiExamShell(id,s,body){
 const p=Math.round((s.i||0)/Math.max(1,s.qs.length)*100);
 return '<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe '+id+'</p><h2>Gruppenprüfung</h2></div></div><div class="task-progress-row"><span>'+(s.i+1)+'/'+s.qs.length+'</span><strong>'+p+'%</strong></div><div class="mini-progress"><div style="width:'+p+'%"></div></div><div class="question-card">'+body+'<div id="feedback"></div></div></section>';
}
function fiExamTokens(sentence){return String(sentence||'').match(/[A-Za-zÅÄÖåäöŠŽšž]+(?:['’-][A-Za-zÅÄÖåäöŠŽšž]+)*|\d+(?::\d+)?|[^\sA-Za-zÅÄÖåäöŠŽšž\d]/g)||[]}
function fiExamAnswer(id,value,q){
 if(locked)return;const r=run(id),s=r.exam.session;if(!s)return;
 locked=true;const good=norm(value)===norm(q.answer);if(good)s.ok++;s.i++;save();
 const e=document.querySelector('#feedback');if(e){e.className='feedback '+(good?'ok':'no');e.innerHTML=good?'Richtig!':'Lösung: <strong>'+esc(q.solution||q.answer)+'</strong>'}
 setTimeout(()=>exam(id),550);
}
function fiBindExamBlocks(id,q){
 const source=shuffle(fiExamTokens(q.answer).map((x,i)=>({x:x,i:i}))),picked=[];
 const built=document.querySelector('#fiExamBuilt'),bank=document.querySelector('#fiExamBank');
 function draw(){
  built.innerHTML=picked.length?picked.map((z,i)=>'<button class="sentence-token chosen" data-fi-pick="'+i+'">'+esc(z.x)+'</button>').join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=source.filter(z=>!picked.includes(z)).map(z=>'<button class="sentence-token" data-fi-src="'+z.i+'">'+esc(z.x)+'</button>').join('');
  built.querySelectorAll('[data-fi-pick]').forEach(b=>b.onclick=()=>{picked.splice(Number(b.dataset.fiPick),1);draw()});
  bank.querySelectorAll('[data-fi-src]').forEach(b=>b.onclick=()=>{const z=source.find(x=>x.i===Number(b.dataset.fiSrc));if(z){picked.push(z);draw()}});
 }
 document.querySelector('#fiExamBlockCheck').onclick=()=>fiExamAnswer(id,picked.map(z=>z.x).join(' ').replace(/\s+([.,!?;:])/g,'$1').trim(),q);
 document.querySelector('#fiExamBlockReset').onclick=()=>{picked.splice(0);draw()};draw();
}
function fiRenderExamQuestion(id,s,q){
 locked=false;let body='';
 if(q.image)body+=image(q.image);
 if(q.audio)body+='<div class="listen-box"><button class="btn" id="fiExamPlay">🔊 Hören</button><button class="btn secondary" id="fiExamSlow">Langsam</button></div>';
 body+='<div class="question">'+esc(q.prompt)+'</div>';
 if(q.kind==='mc')body+='<div class="option-grid">'+q.options.map(o=>'<button class="option" data-fi-exam-answer="'+esc(o)+'">'+esc(o)+'</button>').join('')+'</div>';
 if(q.kind==='images')body+='<div class="image-choice-grid">'+q.options.map(o=>'<button class="image-option" data-fi-exam-answer="'+esc(o.de)+'">'+image(o,true)+'</button>').join('')+'</div>';
 if(q.kind==='input'||q.kind==='speech')body+='<div class="answer-row"><input id="fiExamInput" autocomplete="off"><button class="btn" id="fiExamCheck">Kontrollieren</button></div>'+(q.kind==='speech'?'<button class="btn" id="fiExamMic">🎤 Sprechen</button>':'');
 if(q.kind==='blocks')body+='<div class="sentence-block-builder"><div id="fiExamBuilt" class="sentence-built"></div><div id="fiExamBank" class="sentence-bank"></div><div class="sentence-block-actions"><button class="btn" id="fiExamBlockCheck">Kontrollieren</button><button class="btn secondary" id="fiExamBlockReset">Zurücksetzen</button></div></div>';
 app.innerHTML=fiExamShell(id,s,body);
 document.querySelector('#fiExamPlay')?.addEventListener('click',()=>speak(q.audio));
 document.querySelector('#fiExamSlow')?.addEventListener('click',()=>speak(q.audio,true));
 document.querySelectorAll('[data-fi-exam-answer]').forEach(b=>b.onclick=()=>fiExamAnswer(id,b.dataset.fiExamAnswer,q));
 document.querySelector('#fiExamCheck')?.addEventListener('click',()=>fiExamAnswer(id,document.querySelector('#fiExamInput').value,q));
 document.querySelector('#fiExamInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')fiExamAnswer(id,e.target.value,q)});
 document.querySelector('#fiExamMic')?.addEventListener('click',()=>speech(x=>fiExamAnswer(id,x,q)));
 if(q.kind==='blocks')fiBindExamBlocks(id,q);
}
function exam(id){
 if(!learnDone(id)){app.innerHTML='<section class="card locked-card"><h2>🔒 Gruppenprüfung</h2><p>Erst nach 100% in allen Aufgaben.</p></section>';return}
 const r=run(id),group=GROUPS[id-1];if(!group)return;
 if(!r.exam.session||r.exam.session.version!==3||!Array.isArray(r.exam.session.qs)||r.exam.session.qs.length!==group.verbs.length){
  const verbs=shuffle(group.verbs);
  r.exam.session={version:3,i:0,ok:0,qs:verbs.map((v,i)=>({de:v.de,task:FI_EXAM_TASKS[i%FI_EXAM_TASKS.length]}))};save();
 }
 const s=r.exam.session;
 if(s.i>=s.qs.length){
  const p=Math.round(s.ok*100/Math.max(1,s.qs.length));
  if(p>Number(r.exam.bestPercent||0)){r.exam.bestPercent=p;r.exam.stars=p>=100?3:p>=70?2:p>=50?1:0;r.awards.examPoints=p*(groupState(id).currentRun||1)}
  r.exam.session=null;save();
  app.innerHTML='<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Gut gemacht!</h2><p>'+p+'% · '+s.ok+'/'+s.qs.length+' richtig</p></div></section>';return;
 }
 const q=fiExamQuestion(id,s.qs[s.i]);if(!q){s.i++;save();return exam(id)}
 fiRenderExamQuestion(id,s,q);
}
`;
  const examStart=source.indexOf('function exam(id){');
  const examEnd=examStart>=0?source.indexOf('function render(){',examStart):-1;
  if(examStart<0||examEnd<0)throw new Error('Finnische Prüfungsfunktion wurde nicht gefunden');
  source=source.slice(0,examStart)+examCode+'\n'+source.slice(examEnd);

  const blob=new Blob([source],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  try {
    await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  await import('./sentence-a1-all.js?v=5');
} catch(error){
  console.error('Finnische Verben konnten nicht geladen werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
