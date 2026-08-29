import { requireLogin, getActiveProfile, getActiveRole, dashboardHref, logout } from '/js/auth.js?v=login-main-4';
import { loadCourseRelease, moduleOpen } from '/js/course-releases.js?v=verb-stable3';

const app=document.querySelector('#app');
const topbar=document.querySelector('#topbar');

const TASKS=[
 ['cards','Aa','Karteikarten'],
 ['listen-word','🔊','Verb hören und erkennen'],
 ['listen-sentence','🖼','Bild + Verb hören'],
 ['listen-write','✎','Diktat: Verb schreiben'],
 ['read-choose','🖼','Bild + Verb auswählen'],
 ['verb-meaning','?','Verb → Bedeutung'],
 ['meaning-verb','?','Bedeutung → Verb'],
 ['conjugate','ich','Verb konjugieren'],
 ['read-write','▦','Satz aus Bausteinen'],
 ['dativ-use','…','Lückensatz: Artikel oder Verb'],
 ['context-write','✎','Satz mit Vorgaben schreiben'],
 ['exam','★','Gruppenprüfung']
];
const LEARN=TASKS.slice(0,-1).map(x=>x[0]);
const TITLE=Object.fromEntries(TASKS.map(x=>[x[0],x[2]]));
const LEVELS=['A1','A2','B1','B2','C1'];
const LEVEL_TITLES={A1:'A1 · Grundlagen',A2:'A2 · Alltag',B1:'B1 · Erweiterung',B2:'B2 · Fortgeschritten',C1:'C1 · Sicher anwenden'};
const PRONOUNS=['ich','du','er / sie / es','wir','ihr','sie / Sie'];

const {ENTRIES,CONJ,A1_GAPS}=window.SPDativLearningData||{ENTRIES:[],CONJ:{},A1_GAPS:{}};

const GROUPS=LEVELS.map((level,index)=>({
 id:index+1,level,title:LEVEL_TITLES[level],entries:ENTRIES.filter(e=>e.level===level),
 signature:`v2|${level}|${ENTRIES.filter(e=>e.level===level).map(e=>e.verb).join('|')}`
}));

let profile={},preview=false,locked=false,state=null,currentQuestion=null,rec=null,cardRevealed=false,currentCardEntry=null,activeAudio=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:"'`´()„“”]/g,'').replace(/\s+/g,' ');
const answerNorm=v=>norm(v).replace(/\s+/g,'');
const randomInt=max=>{
 max=Math.floor(Number(max)||0);if(max<=1)return 0;
 try{
  if(globalThis.crypto?.getRandomValues){
   const range=0x100000000,limit=Math.floor(range/max)*max,buf=new Uint32Array(1);
   do{globalThis.crypto.getRandomValues(buf)}while(buf[0]>=limit);
   return buf[0]%max;
  }
 }catch{}
 return Math.floor(Math.random()*max);
};
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const pickRandom=a=>Array.isArray(a)&&a.length?a[randomInt(a.length)]:null;
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
const entryKey=e=>`${e.level}:${e.verb}`;
const baseEntryKey=key=>String(key||'').split('#')[0];
const entryByKey=key=>ENTRIES.find(e=>entryKey(e)===baseEntryKey(key))||null;
const groupById=id=>GROUPS[id-1]||null;
const optionLayouts=new Map();

function imageName(verb){return String(verb||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/\s+/g,'_').replace(/[\/]/g,'_')}
function imageUrl(e){return `https://sprachpilot.b-cdn.net/${encodeURIComponent(imageName(e.verb))}.webp`}
function options(answer,pool,count=4){
 const seen=new Set([norm(answer)]),others=[];
 shuffle(pool).forEach(x=>{if(x!=null&&!seen.has(norm(x))){seen.add(norm(x));others.push(x)}});
 let result=shuffle([answer,...others.slice(0,count-1)]);
 const setKey=[norm(answer),...result.map(norm).sort()].join('|'),signature=result.map(norm).join('|'),previous=optionLayouts.get(setKey);
 if(previous===signature&&result.length>1){
  const shiftBy=1+randomInt(result.length-1);
  result=[...result.slice(shiftBy),...result.slice(0,shiftBy)];
 }
 optionLayouts.set(setKey,result.map(norm).join('|'));
 return result;
}
function replaceFirst(text,needle,replacement){const source=String(text||''),target=String(needle||''),i=source.indexOf(target);return i<0?source:source.slice(0,i)+replacement+source.slice(i+target.length)}
function datArticle(e){return String(e.dat||'').trim().split(/\s+/)[0]||''}
function wrongVerbForm(e){const forms=CONJ[e.verb]||[];return forms.find(x=>norm(x)!==norm(e.form)&&!norm(e.sentence).includes(norm(x)))||e.verb}
function sentenceCues(e){return uniq([e.verb,e.subject,e.nom])}
function buildBlocks(e){
 let target=String(e.sentence||'').replace(/[.!?]+$/,'');
 let marked=replaceFirst(target,e.dat,'{{DAT}}');
 marked=replaceFirst(marked,e.form,'{{VERB}}');
 const parts=marked.split(/(\{\{DAT\}\}|\{\{VERB\}\})/).map(x=>x.trim()).filter(Boolean).map(x=>x==='{{DAT}}'?e.dat:x==='{{VERB}}'?e.form:x);
 const distractors=uniq([e.nom,e.verb,wrongVerbForm(e)]).filter(x=>!parts.some(p=>norm(p)===norm(x)));
 return{parts,bank:shuffle([...parts,...distractors]),target:e.sentence};
}

function genericGapUnits(e){
 const article=datArticle(e),articleSentence=replaceFirst(e.sentence,article,'_____');
 const verbSentence=replaceFirst(e.sentence,e.form,'_____');
 return[
  {id:`${entryKey(e)}#article`,entry:e,prompt:'Ergänze den richtigen Dativartikel.',text:articleSentence,answer:article,hintType:'dativ'},
  {id:`${entryKey(e)}#verb`,entry:e,prompt:'Setze das Verb richtig ein.',text:verbSentence,answer:e.form,hintType:'verb'}
 ];
}
function a1GapUnits(e){
 const rows=A1_GAPS[e.verb]||[];
 return rows.map((row,i)=>({id:`${entryKey(e)}#a1gap${i+1}`,entry:e,prompt:row[2]==='dativ'?'Ergänze den richtigen Dativartikel.':'Setze das Verb richtig ein.',text:row[0],answer:row[1],hintType:row[2]}));
}
function gapUnits(g){return g.entries.flatMap(e=>g.level==='A1'?a1GapUnits(e):genericGapUnits(e))}
function taskUnitKeys(g,t){return t==='dativ-use'?gapUnits(g).map(x=>x.id):g.entries.map(entryKey)}
function unitForKey(g,t,key){
 if(t==='dativ-use')return gapUnits(g).find(x=>x.id===key)||null;
 const e=entryByKey(key);return e?{id:key,entry:e}:null;
}

const userSlug=()=>[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const storageKey=()=>`SP_DATIVVERBEN_V2_${userSlug()}`;
const blankTask=total=>({total,done:[],queue:[],current:null,last:null,tries:0,hadWrong:false});
const blankRun=()=>({tasks:{},exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0},completed:false});
const blankGroup=sig=>({signature:sig,currentRun:1,runs:{'1':blankRun()}});
const blankState=()=>({version:2,taskSchema:4,selectedGroup:1,groups:{}});

function normalizeRun(run,g,resetTasks=false){
 run={...blankRun(),...(run||{})};
 run.tasks=resetTasks?{}:(run.tasks||{});
 for(const t of LEARN){
  const keys=taskUnitKeys(g,t),x=run.tasks[t]||blankTask(keys.length);
  x.total=keys.length;
  x.done=[...new Set((x.done||[]).filter(k=>keys.includes(k)))];
  x.queue=[];
  x.current=x.current&&keys.includes(x.current)&&!x.done.includes(x.current)?x.current:null;
  x.last=x.last&&keys.includes(x.last)?x.last:null;
  x.tries=Number(x.tries)||0;x.hadWrong=!!x.hadWrong;
  run.tasks[t]=x;
 }
 run.exam={bestPercent:0,stars:0,session:null,...(run.exam||{})};
 run.awards={tasks:{},examPoints:0,...(run.awards||{})};
 run.awards.tasks=run.awards.tasks||{};
 return run;
}
function groupState(id){
 const g=groupById(id);if(!g)return null;
 let gs=state.groups[g.signature];if(!gs)gs=state.groups[g.signature]=blankGroup(g.signature);
 gs.currentRun=Math.max(1,Math.min(3,Number(gs.currentRun)||1));gs.runs=gs.runs||{};
 for(let r=1;r<=gs.currentRun;r++)gs.runs[String(r)]=normalizeRun(gs.runs[String(r)],g,false);
 return gs;
}
const currentRun=id=>{const gs=groupState(id);return gs?.runs?.[String(gs.currentRun)]||null};
function load(){
 try{state=JSON.parse(localStorage.getItem(storageKey())||'null')||blankState()}catch{state=blankState()}
 state.groups=state.groups||{};
 const oldSchema=Number(state.taskSchema||0);
 if(oldSchema!==4){
  for(const g of GROUPS){
   const gs=state.groups[g.signature];if(!gs?.runs)continue;
   for(const k of Object.keys(gs.runs))gs.runs[k]=normalizeRun(gs.runs[k],g,true);
  }
  state.taskSchema=4;
 }
 GROUPS.forEach(g=>groupState(g.id));save();
}
function save(){if(preview)return;try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}
const taskState=(id,t)=>currentRun(id)?.tasks?.[t];
const taskPercent=(id,t)=>{const x=taskState(id,t);return x?.total?Math.round(x.done.length/x.total*100):0};
const taskDone=(id,t)=>taskPercent(id,t)>=100;
const learnDone=id=>LEARN.every(t=>taskDone(id,t));
function taskPoints(id){return(groupState(id)?.currentRun||1)*5}
function groupPoints(id){const gs=groupState(id);if(!gs)return 0;return Object.values(gs.runs||{}).reduce((sum,r)=>sum+Object.values(r.awards?.tasks||{}).reduce((s,n)=>s+(Number(n)||0),0)+(Number(r.awards?.examPoints)||0),0)}
const totalPoints=()=>GROUPS.reduce((s,g)=>s+groupPoints(g.id),0);

function nextUnit(id,t){
 const x=taskState(id,t),g=groupById(id);if(!x||!g)return null;
 const keys=taskUnitKeys(g,t);
 if(x.current&&!x.done.includes(x.current))return unitForKey(g,t,x.current);
 const pending=keys.filter(k=>!x.done.includes(k));
 if(!pending.length){x.current=null;x.queue=[];save();return null}
 let candidates=pending;
 if(x.last&&pending.length>1){
  const otherVerb=pending.filter(k=>baseEntryKey(k)!==baseEntryKey(x.last));
  if(otherVerb.length)candidates=otherVerb;
  else{const notSame=pending.filter(k=>k!==x.last);if(notSame.length)candidates=notSame}
 }
 x.current=pickRandom(candidates);x.queue=[];x.tries=0;x.hadWrong=false;save();
 return unitForKey(g,t,x.current);
}
function markWrong(id,t){const x=taskState(id,t);if(!x)return 0;x.tries++;x.hadWrong=true;save();return x.tries}
function markRight(id,t){
 const x=taskState(id,t),k=x?.current;if(!x||!k)return;
 if(!x.hadWrong&&x.tries===0&&!x.done.includes(k))x.done.push(k);
 x.last=k;x.current=null;x.queue=[];x.tries=0;x.hadWrong=false;
 if(taskDone(id,t)&&!currentRun(id).awards.tasks[t])currentRun(id).awards.tasks[t]=taskPoints(id);
 save();
}
function resetGroup(id){
 const g=groupById(id),gs=groupState(id);if(!g||!gs)return;
 const awards={};for(const[r,run]of Object.entries(gs.runs||{}))awards[r]=run.awards;
 state.groups[g.signature]=blankGroup(g.signature);
 for(const[r,a]of Object.entries(awards)){state.groups[g.signature].runs[r]=normalizeRun(blankRun(),g);state.groups[g.signature].runs[r].awards=a}
 save();
}
function canRepeat(id){const gs=groupState(id),run=currentRun(id);return!!gs&&gs.currentRun<3&&learnDone(id)&&Number(run.exam.bestPercent||0)>=100}
function nextRun(id){const gs=groupState(id),g=groupById(id);if(!canRepeat(id))return false;gs.currentRun++;gs.runs[String(gs.currentRun)]=normalizeRun(blankRun(),g);save();return true}

function route(){const q=new URLSearchParams(location.search),group=Math.max(0,Math.min(GROUPS.length,Number(q.get('group'))||0)),task=q.get('task')||'',view=q.get('view')||'';return{group,task:TASKS.some(x=>x[0]===task)?task:'',view:view==='overview'?'overview':''}}
function href(group=0,task='',view=''){const q=new URLSearchParams();if(group)q.set('group',group);if(task)q.set('task',task);if(view)q.set('view',view);return'/dativverben/'+(q.toString()?'?'+q.toString():'')}
function go(o){history.pushState(null,'',href(o.group,o.task,o.view));render()}
function stopMic(){if(rec)try{rec.abort()}catch{}rec=null}
function stopAudio(){try{activeAudio?.pause()}catch{}activeAudio=null;try{speechSynthesis.cancel()}catch{}}
function bunnySlug(value){return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function speech(text,slow=false){if(!('speechSynthesis'in window))return;stopAudio();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='de-DE';u.rate=slow?.62:.9;speechSynthesis.speak(u)}
function playAudio(text,slow=false){
 const value=String(text||'').trim();if(!value)return;stopAudio();
 const candidates=[`https://sprachpilot.b-cdn.net/audio/${encodeURIComponent(bunnySlug(value))}.mp3`,`https://sprachpilot.b-cdn.net/audio/${encodeURIComponent(value)}.mp3`];
 let i=0;const next=()=>{if(i>=candidates.length){speech(value,slow);return}const a=new Audio(candidates[i++]);activeAudio=a;a.preload='auto';a.playbackRate=slow?.78:1;a.onerror=()=>{if(activeAudio===a)activeAudio=null;next()};a.onended=()=>{if(activeAudio===a)activeAudio=null};const p=a.play();if(p&&typeof p.catch==='function')p.catch(()=>{if(activeAudio===a)activeAudio=null;next()})};next();
}

function header(r){
 const name=[profile.vorname||profile.firstName,profile.nachname||profile.lastName].filter(Boolean).join(' ')||(preview?'Lehrer-Vorschau':'Schüler');
 const back=r.view==='overview'?'<a class="btn secondary" href="/dativverben/">← Zurück</a>':'<a class="btn secondary" href="/verben-bereich/">← Zurück</a>';
 topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/verben-bereich/"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Dativverben</h1><p>${ENTRIES.length} Verben · A1 bis C1</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" data-action="logout">Abmelden</button></div></div><nav class="topnav">${back}${r.view!=='overview'?'<button class="btn secondary" data-action="overview">Übersicht</button>':''}${r.group?`<button class="btn secondary" data-action="group" data-group="${r.group}">Aufgaben</button><button class="btn danger-btn" data-action="reset-group" data-group="${r.group}">Fortschritt löschen</button>`:''}</nav>`;
}
const previewNote=()=>preview?'<div class="preview-note">Lehrer-Vorschau · alle Aufgaben und Prüfungen sind geöffnet · nichts wird gespeichert</div>':'';
function grammarBox(level){return`<section class="card dativ-rule"><h2>Dativ im Satz</h2><p>Frage: <strong>Wem?</strong></p><div class="case-grid"><span><b>der</b> → dem</span><span><b>die</b> → der</span><span><b>das</b> → dem</span><span><b>Plural</b> → den + -n</span></div>${level==='A1'||level==='A2'?'<p class="small">Hier werden keine Dativpronomen geübt.</p>':''}</section>`}
function scoreCard(id=0){
 if(preview)return'';
 if(!id)return`<section class="card score-card compact-score"><h2>${totalPoints()} Punkte</h2><span>gesamt</span></section>`;
 const gs=groupState(id),run=currentRun(id);
 return`<section class="card score-card"><div><p class="eyebrow">${esc(groupById(id).level)}</p><h2>Runde ${gs.currentRun} von 3</h2><p>${Object.values(run.awards.tasks||{}).reduce((s,n)=>s+(Number(n)||0),0)} Aufgabenpunkte · ${Number(run.awards.examPoints)||0} Prüfungspunkte</p>${canRepeat(id)?`<button class="btn" data-action="next-run" data-group="${id}">Runde ${gs.currentRun+1} starten</button>`:''}</div><div class="score-total">${groupPoints(id)}<span>Punkte</span></div></section>`;
}
function taskCards(id){
 const run=currentRun(id);
 return TASKS.map((t,i)=>{const exam=t[0]==='exam',open=!exam||preview||learnDone(id),p=exam?Number(run.exam.bestPercent)||0:taskPercent(id,t[0]);return`<button class="task-card ${p>=100?'done-card':''} ${!open?'locked-task':''}" data-action="task" data-group="${id}" data-task="${t[0]}" ${open?'':'disabled'}><span class="task-number">${i+1}</span><span class="task-icon">${open?t[1]:'🔒'}</span><span class="task-title">${esc(t[2])}</span><div class="task-mini-progress"><span style="width:${p}%"></span></div><span class="task-status">${open?(p>=100?'Fertig':p?`${p}%`:'Starten'):'Gesperrt'}</span></button>`}).join('');
}
function renderHome(selected=0){
 const panels=GROUPS.map(g=>{const gs=groupState(g.id),done=LEARN.filter(t=>taskDone(g.id,t)).length,exam=Number(currentRun(g.id).exam.bestPercent)||0;return`<details class="group-panel" ${selected===g.id?'open':''}><summary data-action="group" data-group="${g.id}"><span class="group-number">${g.level}</span><span>${esc(g.title)}</span><span>${g.entries.length} Verben</span><span>Runde ${gs.currentRun}/3 · ${done}/${LEARN.length} · Prüfung ${exam}%</span></summary><div class="group-body"><div class="task-grid">${taskCards(g.id)}</div></div></details>`}).join('');
 app.innerHTML=`${previewNote()}${scoreCard(selected)}<section class="card"><div class="section-head"><h2>Niveaustufen</h2><span class="overview-total">${ENTRIES.length} Verben</span></div><div class="groups-accordion">${panels}</div></section>`;
}
function imageOnly(e,cls='verb-picture-question'){
 return`<div class="${cls} image-only-media"><img src="${imageUrl(e)}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-only-fallback" hidden>Bild nicht verfügbar</div></div>`;
}
function renderOverview(){
 const sections=GROUPS.map(g=>`<section class="overview-level image-only-overview"><div class="section-head"><h2>${esc(g.title)}</h2><span class="overview-total">${g.entries.length} Verben</span></div><div class="dativ-overview-grid">${g.entries.map(e=>`<article class="overview-image-only-card">${imageOnly(e,'overview-photo')}<button class="audio-icon-only" data-action="audio" data-text="${esc(e.verb)}" aria-label="Wort anhören" title="Wort anhören">🔊</button></article>`).join('')}</div></section>`).join('');
 app.innerHTML=`${previewNote()}<section class="card"><div class="section-head"><h2>Übersicht</h2><span class="overview-total">${ENTRIES.length} Verben</span></div>${sections}</section>`;
}
function progress(id,t){const x=taskState(id,t),p=taskPercent(id,t);return`<div class="task-progress-row"><span>${x.done.length} richtig · ${x.total-x.done.length} übrig</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div>`}
function feedback(text,ok=false){const el=document.querySelector('#feedback');if(el){el.className='feedback '+(ok?'ok':'no');el.innerHTML=text}}
function hint(tries,q){
 if(tries>=3)return`Lösung: <strong>${esc(q.solutionLabel||q.answer)}</strong>`;
 if(tries===2){
  if(q.hintType==='dativ')return'Tipp 2: Frage <strong>Wem?</strong>. Achte auf dem / der / den.';
  if(q.hintType==='meaning')return`Tipp 2: Lies die Erklärung noch einmal Wort für Wort.`;
  if(q.hintType==='conjugation')return`Tipp 2: Achte auf Stamm, Endung und bei trennbaren Verben auf den zweiten Teil.`;
  return`Tipp 2: Die Lösung beginnt mit <strong>${esc(String(q.answer||'').slice(0,2))}…</strong>`;
 }
 if(q.hintType==='dativ')return'Tipp 1: Suche zuerst die Person oder Sache nach „Wem?“.';
 if(q.hintType==='conjugation')return'Tipp 1: Prüfe jede Zeile einzeln: ich, du, er/sie/es, wir, ihr, sie/Sie.';
 return'Tipp 1: Höre oder lies noch einmal genau.';
}

function question(id,t,unit){
 const g=groupById(id),e=unit.entry,verbs=g.entries.map(x=>x.verb),meanings=g.entries.map(x=>x.meaning);
 if(t==='listen-word')return{kind:'mc',prompt:'Welches Verb hörst du?',answer:e.verb,options:options(e.verb,verbs),audio:e.verb,hintType:'verb'};
 if(t==='listen-sentence')return{kind:'audio-choice',prompt:'Welches gehörte Verb passt zum Bild?',answer:e.verb,options:options(e.verb,verbs),image:e,hintType:'verb'};
 if(t==='listen-write')return{kind:'input',prompt:'Höre das Verb und schreibe es.',answer:e.verb,audio:e.verb,placeholder:'Verb schreiben',hintType:'verb'};
 if(t==='read-choose')return{kind:'image-mc',prompt:'Welches Verb passt zum Bild?',answer:e.verb,options:options(e.verb,verbs),image:e,hintType:'verb'};
 if(t==='verb-meaning')return{kind:'mc',prompt:`Was bedeutet „${e.verb}“?`,answer:e.meaning,options:options(e.meaning,meanings),hintType:'meaning'};
 if(t==='meaning-verb')return{kind:'mc',prompt:'Welches Verb passt zu dieser Bedeutung?',subprompt:e.meaning,answer:e.verb,options:options(e.verb,verbs),hintType:'meaning'};
 if(t==='conjugate')return{kind:'conjugation',prompt:`Konjugiere „${e.verb}“.`,answer:e.verb,forms:CONJ[e.verb],hintType:'conjugation',solutionLabel:(CONJ[e.verb]||[]).join(' · ')};
 if(t==='read-write'){const block=buildBlocks(e);return{kind:'blocks',prompt:'Baue den richtigen Satz. Es gibt auch falsche Bausteine.',answer:block.target,bank:block.bank,hintType:'dativ'};}
 if(t==='dativ-use')return{kind:'input',prompt:unit.prompt,subprompt:unit.text,answer:unit.answer,placeholder:unit.hintType==='dativ'?'Artikel schreiben':'Verbform schreiben',hintType:unit.hintType,grammar:true};
 if(t==='context-write')return{kind:'sentence-write',prompt:'Schreibe mit den Wörtern einen richtigen Satz.',answer:e.sentence,cues:sentenceCues(e),placeholder:'Ganzen Satz schreiben',hintType:'dativ',grammar:true};
 return{kind:'input',prompt:'Verb',answer:e.verb,hintType:'verb'};
}
function body(q){
 const media=q.audio?`<div class="listen-box"><button class="btn" data-action="audio" data-text="${esc(q.audio)}">🔊 Hören</button></div>`:'';
 const sub=q.subprompt?`<div class="question-sub gap-context">${esc(q.subprompt)}</div>`:'';
 const image=q.image?imageOnly(q.image):'';
 let answer='';
 if(q.kind==='mc'||q.kind==='image-mc')answer=`<div class="option-grid">${q.options.map(o=>`<button class="option" data-action="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 if(q.kind==='audio-choice')answer=`<div class="audio-choice-grid">${q.options.map((o,i)=>`<button class="audio-choice" data-action="select-audio" data-value="${esc(o)}" data-index="${i}" aria-label="Verb anhören und auswählen">🔊 <span>Anhören</span></button>`).join('')}</div><div class="actions centered-actions"><button class="btn" data-action="check-audio-choice">Kontrollieren</button></div>`;
 if(q.kind==='input'||q.kind==='sentence-write')answer=`${q.kind==='sentence-write'?`<div class="cue-row">${q.cues.map(x=>`<span class="cue-chip">${esc(x)}</span>`).join('')}</div>`:''}<div class="answer-form"><div class="answer-row"><input id="answerInput" autocomplete="off" placeholder="${esc(q.placeholder||'Antwort schreiben')}"><button class="btn" data-action="check-input">Kontrollieren</button></div></div>`;
 if(q.kind==='blocks')answer=`<div id="blockAnswer" class="block-answer" aria-live="polite"><span class="block-placeholder">Bausteine hier auswählen</span></div><div class="block-bank">${q.bank.map((x,i)=>`<button class="block-chip" data-action="block-word" data-index="${i}" data-word="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="actions"><button class="btn" data-action="check-blocks">Kontrollieren</button><button class="btn secondary" data-action="clear-blocks">Neu ordnen</button></div>`;
 if(q.kind==='conjugation')answer=`<div class="conjugation-wrap"><table class="conjugation-table"><thead><tr><th>Pronomen</th><th>Verbform</th></tr></thead><tbody>${PRONOUNS.map((p,i)=>`<tr><th>${esc(p)}</th><td><input class="conj-input" data-conj-index="${i}" autocomplete="off" aria-label="${esc(p)}"></td></tr>`).join('')}</tbody></table><button class="btn" data-action="check-conjugation">Kontrollieren</button></div>`;
 return`${media}${image}<div class="question">${esc(q.prompt)}</div>${sub}${answer}<div id="feedback"></div>`;
}

function renderCards(id){
 const unit=nextUnit(id,'cards');if(!unit)return finishTask(id,'cards');const e=unit.entry;
 currentCardEntry=e;currentQuestion={answer:e.verb,hintType:'verb'};cardRevealed=false;
 app.innerHTML=`<section class="card task-page card-standard-page"><div class="task-page-head"><div><p class="eyebrow">${esc(groupById(id).level)}</p><h2>Aufgabe 1 · Karteikarten</h2></div><button class="btn secondary" data-action="group" data-group="${id}">Aufgaben</button></div>${progress(id,'cards')}<div class="card-learning-note">Sieh das Bild. Drehe die Karte um. Danach sprich oder schreibe das Verb richtig.</div><div class="flip-wrap"><div id="verbFlipCard" class="flip-card dativ-standard-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front"><div class="dativ-card-front-standard card-front-image-only">${imageOnly(e,'card-photo-only')}</div></div><div class="flip-face flip-back"><div class="flip-back-info card-back-text-only"><div class="flip-word">${esc(e.verb)}</div><div class="card-details"><div><span>Beispiel</span><strong>${esc(e.sentence)}</strong></div></div><button type="button" class="btn secondary card-listen-btn" data-action="audio" data-text="${esc(e.verb)}">🔊 Verb anhören</button></div></div></div></div><div id="cardActions" class="actions card-actions" hidden><button class="btn" data-action="card-mic">🎤 Sprechen</button><button class="btn secondary" data-action="card-write">✍️ Schreiben</button></div><div id="cardAnswerBox" class="answer-form hidden"><div class="answer-row"><input id="cardAnswerInput" autocomplete="off" placeholder="Verb im Infinitiv"><button class="btn" data-action="card-check">Kontrollieren</button></div></div><div id="feedback" class="feedback"></div></section>`;
 const flip=document.querySelector('#verbFlipCard');const reveal=()=>{if(cardRevealed)return;cardRevealed=true;flip.classList.add('flipped');document.querySelector('#cardActions').hidden=false};flip.addEventListener('click',reveal);flip.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();reveal()}});
}
function cardCorrect(value){const r=route(),e=currentCardEntry;if(!r.group||!e)return;if(answerNorm(value)===answerNorm(e.verb)){feedback('Richtig.',true);markRight(r.group,'cards');setTimeout(()=>renderCards(r.group),350)}else{const tries=markWrong(r.group,'cards');feedback(hint(tries,{answer:e.verb,hintType:'verb'}))}}
function startRecognition(expected,onResult,onFallback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){onFallback?.();return}try{stopMic();rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;rec.onresult=e=>onResult(e.results?.[0]?.[0]?.transcript||'');rec.onerror=()=>onFallback?.();rec.onnomatch=()=>onFallback?.();rec.onend=()=>{rec=null};rec.start()}catch{onFallback?.()}}
function cardMic(){const s=document.querySelector('#feedback');if(s){s.className='feedback';s.textContent='Ich höre zu …'}startRecognition(currentCardEntry?.verb,text=>cardCorrect(text),()=>{document.querySelector('#cardAnswerBox')?.classList.remove('hidden');document.querySelector('#cardAnswerInput')?.focus();feedback('Mikrofon nicht verfügbar. Schreibe das Verb.')})}
function cardWrite(){document.querySelector('#cardAnswerBox')?.classList.remove('hidden');document.querySelector('#cardAnswerInput')?.focus()}

function renderTask(id,t){
 if(t==='exam')return renderExam(id);
 if(taskDone(id,t))return finishTask(id,t);
 if(t==='cards')return renderCards(id);
 const unit=nextUnit(id,t);if(!unit)return finishTask(id,t);
 currentQuestion=question(id,t,unit);
 app.innerHTML=`${currentQuestion.grammar?grammarBox(groupById(id).level):''}<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">${esc(groupById(id).level)}</p><h2>${esc(TITLE[t])}</h2></div><button class="btn secondary" data-action="group" data-group="${id}">Aufgaben</button></div>${progress(id,t)}<div class="question-card">${body(currentQuestion)}</div></section>`;
 setTimeout(()=>document.querySelector('#answerInput,.conj-input')?.focus(),40);
}
function finishTask(id,t){const gs=groupState(id),pts=Number(currentRun(id).awards.tasks[t])||0,next=LEARN[LEARN.indexOf(t)+1]||'exam';app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Gut gemacht!</h2><p>${pts} Punkte · Runde ${gs.currentRun}</p><div class="actions"><button class="btn" data-action="task" data-group="${id}" data-task="${next}">Weiter</button><button class="btn secondary" data-action="group" data-group="${id}">Aufgaben</button></div></div></section>`}
function isCorrect(value,q){return answerNorm(value)===answerNorm(q.answer)}
function checkTask(value){const r=route(),q=currentQuestion;if(!r.group||!r.task||!q)return;if(isCorrect(value,q)){feedback('Richtig.',true);markRight(r.group,r.task);setTimeout(()=>renderTask(r.group,r.task),350)}else{const tries=markWrong(r.group,r.task);feedback(hint(tries,q))}}
function answerFromInput(){const value=document.querySelector('#answerInput')?.value||'';route().task==='exam'?checkExam(value):checkTask(value)}

let selectedAudioValue='';
function selectAudio(button){document.querySelectorAll('.audio-choice').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');selectedAudioValue=button.dataset.value||'';playAudio(selectedAudioValue)}
function checkAudioChoice(){if(!selectedAudioValue){feedback('Wähle zuerst ein gehörtes Verb aus.');return}route().task==='exam'?checkExam(selectedAudioValue):checkTask(selectedAudioValue);selectedAudioValue=''}

function selectedBlockText(){return[...document.querySelectorAll('#blockAnswer .selected-block')].map(el=>el.dataset.word||'').join(' ')}
function addBlock(button){const host=document.querySelector('#blockAnswer');if(!host||button.disabled)return;host.querySelector('.block-placeholder')?.remove();const chip=document.createElement('button');chip.type='button';chip.className='selected-block';chip.dataset.word=button.dataset.word||'';chip.dataset.sourceIndex=button.dataset.index||'';chip.dataset.action='block-remove';chip.textContent=button.dataset.word||'';host.appendChild(chip);button.disabled=true}
function removeBlock(button){const i=button.dataset.sourceIndex;const source=document.querySelector(`.block-chip[data-index="${CSS.escape(i||'')}"]`);if(source)source.disabled=false;button.remove();const host=document.querySelector('#blockAnswer');if(host&&!host.querySelector('.selected-block'))host.innerHTML='<span class="block-placeholder">Bausteine hier auswählen</span>'}
function clearBlocks(){document.querySelectorAll('.block-chip').forEach(b=>b.disabled=false);const host=document.querySelector('#blockAnswer');if(host)host.innerHTML='<span class="block-placeholder">Bausteine hier auswählen</span>'}
function checkBlocks(){const value=selectedBlockText();route().task==='exam'?checkExam(value):checkTask(value)}

function conjugationValues(){return[...document.querySelectorAll('.conj-input')].map(i=>i.value||'')}
function checkConjugation(){
 const q=currentQuestion,r=route(),values=conjugationValues(),forms=q?.forms||[];
 if(!q||!forms.length)return;
 const wrong=[];values.forEach((v,i)=>{const input=document.querySelector(`.conj-input[data-conj-index="${i}"]`);const ok=answerNorm(v)===answerNorm(forms[i]);input?.classList.toggle('wrong-input',!ok);input?.classList.toggle('right-input',ok);if(!ok)wrong.push(i)});
 if(!wrong.length){
  feedback('Alles richtig.',true);
  if(r.task==='exam')return checkExamConjugation(true);
  markRight(r.group,r.task);setTimeout(()=>renderTask(r.group,r.task),450);return;
 }
 if(r.task==='exam')return checkExamConjugation(false);
 const tries=markWrong(r.group,r.task);
 if(tries>=3)feedback(`Lösung:<div class="conj-solution">${PRONOUNS.map((p,i)=>`<span><b>${esc(p)}</b> ${esc(forms[i])}</span>`).join('')}</div>`);
 else feedback(hint(tries,q));
}

function examItems(id){
 const g=groupById(id),lex=['listen-word','listen-sentence','listen-write','read-choose','verb-meaning','meaning-verb'],items=[],entries=shuffle(g.entries);
 for(let i=0;i<14;i++)items.push({key:entryKey(entries[i%entries.length]),task:lex[i%lex.length]});
 for(let i=0;i<3;i++)items.push({key:entryKey(entries[(i+2)%entries.length]),task:'read-write'});
 for(let i=0;i<3;i++)items.push({key:entryKey(entries[(i+5)%entries.length]),task:i===2?'context-write':'dativ-use'});
 const mixed=shuffle(items);
 mixed.forEach(item=>{
  if(item.task!=='dativ-use')return;
  const e=entryByKey(item.key),rows=e?(g.level==='A1'?a1GapUnits(e):genericGapUnits(e)):[];
  item.unitKey=pickRandom(rows)?.id||null;
 });
 return mixed;
}
function examUnit(id,item){
 const g=groupById(id),e=entryByKey(item.key);if(!e)return null;
 if(item.task==='dativ-use'){
  const rows=g.level==='A1'?a1GapUnits(e):genericGapUnits(e);
  const selected=rows.find(row=>row.id===item.unitKey)||pickRandom(rows)||rows[0];
  if(selected&&!item.unitKey)item.unitKey=selected.id;
  return selected;
 }
 return{id:item.key,entry:e};
}
function renderExam(id){
 if(!preview&&!learnDone(id)){app.innerHTML=`<section class="card locked-card"><h2>Prüfung gesperrt</h2><p>Bearbeite zuerst alle elf Lernaufgaben zu 100 %.</p><button class="btn" data-action="group" data-group="${id}">Aufgaben</button></section>`;return}
 const run=currentRun(id),ex=run.exam;
 if(!ex.session){app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">★</div><h2>Gruppenprüfung</h2><p>Die Prüfung testet Hören, Bilder, Bedeutungen und die Anwendung im Satz.</p><p>Bester Stand: ${ex.bestPercent||0}%</p><button class="btn" data-action="start-exam" data-group="${id}">Starten</button><button class="btn secondary" data-action="group" data-group="${id}">Aufgaben</button></div></section>`;return}
 if(ex.session.index>=ex.session.items.length)return finishExam(id);
 const item=ex.session.items[ex.session.index],unit=examUnit(id,item);currentQuestion=question(id,item.task,unit);selectedAudioValue='';
 const p=Math.round(ex.session.index/ex.session.items.length*100);
 app.innerHTML=`${currentQuestion.grammar?grammarBox(groupById(id).level):''}<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">${esc(groupById(id).level)}</p><h2>Gruppenprüfung</h2></div><button class="btn secondary" data-action="group" data-group="${id}">Abbrechen</button></div><div class="task-progress-row"><span>${ex.session.index+1}/${ex.session.items.length}</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div><div class="question-card">${body(currentQuestion)}</div></section>`;
}
function startExam(id){currentRun(id).exam.session={items:examItems(id),index:0,correct:0};save();renderExam(id)}
function checkExam(value){const r=route(),ex=currentRun(r.group).exam,q=currentQuestion;if(!ex.session||!q)return;const good=isCorrect(value,q);if(good)ex.session.correct++;feedback(good?'Richtig.':`Lösung: <strong>${esc(q.answer)}</strong>`,good);ex.session.index++;save();setTimeout(()=>renderExam(r.group),450)}
function checkExamConjugation(good){const r=route(),ex=currentRun(r.group).exam;if(!ex.session)return;if(good)ex.session.correct++;feedback(good?'Richtig.':'Nicht vollständig richtig.',good);ex.session.index++;save();setTimeout(()=>renderExam(r.group),450)}
function finishExam(id){
 const run=currentRun(id),session=run.exam.session,total=session?.items?.length||1,correct=session?.correct||0,p=Math.round(correct/total*100),stars=p>=100?3:p>=70?2:p>=50?1:0;
 run.exam.session=null;run.exam.bestPercent=Math.max(Number(run.exam.bestPercent)||0,p);run.exam.stars=Math.max(Number(run.exam.stars)||0,stars);
 const max=groupState(id).currentRun*100,earned=Math.round(max*p/100);run.awards.examPoints=Math.max(Number(run.awards.examPoints)||0,earned);run.completed=learnDone(id)&&run.exam.bestPercent>=100;save();
 app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>${p}%</h2><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${correct}/${total} richtig</p><div class="actions"><button class="btn" data-action="start-exam" data-group="${id}">Noch einmal</button><button class="btn secondary" data-action="group" data-group="${id}">Aufgaben</button>${canRepeat(id)?`<button class="btn" data-action="next-run" data-group="${id}">Runde ${groupState(id).currentRun+1}</button>`:''}</div></div></section>`;
}

function render(){
 stopMic();stopAudio();selectedAudioValue='';
 const r=route();header(r);
 if(locked){app.innerHTML='<section class="card locked-card"><h2>Dativverben sind gesperrt</h2><a class="btn" href="/verben-bereich/">Zurück</a></section>';return}
 if(r.view==='overview')return renderOverview();
 if(r.group&&r.task)return renderTask(r.group,r.task);
 renderHome(r.group);
}

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b)return;
 const a=b.dataset.action,g=Number(b.dataset.group)||0,t=b.dataset.task||'';
 if(a==='logout')return logout();
 if(a==='overview')return go({view:'overview'});
 if(a==='group')return go({group:g});
 if(a==='task')return go({group:g,task:t});
 if(a==='reset-group'){if(!preview&&confirm(`Fortschritt von ${groupById(g)?.level||'dieser Gruppe'} löschen? Bereits verdiente Punkte bleiben erhalten.`)){resetGroup(g);render()}return}
 if(a==='next-run'){if(confirm(`Runde ${groupState(g).currentRun+1} starten?`)&&nextRun(g))go({group:g});return}
 if(a==='audio')return playAudio(b.dataset.text||'');
 if(a==='answer')return route().task==='exam'?checkExam(b.dataset.answer||''):checkTask(b.dataset.answer||'');
 if(a==='select-audio')return selectAudio(b);
 if(a==='check-audio-choice')return checkAudioChoice();
 if(a==='check-input')return answerFromInput();
 if(a==='block-word')return addBlock(b);
 if(a==='block-remove')return removeBlock(b);
 if(a==='clear-blocks')return clearBlocks();
 if(a==='check-blocks')return checkBlocks();
 if(a==='check-conjugation')return checkConjugation();
 if(a==='card-mic')return cardMic();
 if(a==='card-write')return cardWrite();
 if(a==='card-check')return cardCorrect(document.querySelector('#cardAnswerInput')?.value||'');
 if(a==='start-exam'){go({group:g,task:'exam'});return startExam(g)}
});
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter')return;
 if(e.target?.id==='answerInput'){e.preventDefault();answerFromInput()}
 if(e.target?.id==='cardAnswerInput'){e.preventDefault();cardCorrect(e.target.value)}
});
window.addEventListener('popstate',render);

async function init(){
 const user=requireLogin();if(!user)return;
 profile=getActiveProfile()||{};
 const role=String(getActiveRole()||'').toLowerCase();preview=role==='teacher'||role==='owner'||role==='lehrer'||role==='admin';
 try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true}catch{}
 try{const assignments=await loadCourseRelease(profile);locked=!preview&&!moduleOpen(assignments,'Dativverben')}catch{locked=!preview}
 load();render();
}
init().catch(error=>{console.error(error);app.innerHTML='<section class="card"><h2>Dativverben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
