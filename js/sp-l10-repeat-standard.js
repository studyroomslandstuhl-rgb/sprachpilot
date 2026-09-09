(function(){
'use strict';
if(window.SPL10RepeatStandard)return;

const lessonMatch=location.pathname.match(/A1-Lektion-10\/Thema-(1|2)/i);
if(!lessonMatch)return;
const theme=Number(lessonMatch[1]);
const qs=new URLSearchParams(location.search);
const inferredCard=/\/karteikarten\.html$/i.test(location.pathname)?'karteikarten':'';
const taskId=String(qs.get('task')||inferredCard||'').trim().toLowerCase();

function isPreview(){
 try{
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
  return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
 }catch(e){return false}
}
function owner(){
 try{
  const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{};
  return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_');
 }catch(e){return'student'}
}
function shuffle(a){
 const b=Array.isArray(a)?a.slice():[];
 for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}
 return b;
}

// Sichtbarer Standard: Die Seite/Navigation heißt immer nur „Übersicht“.
function normalizeOverviewLabels(root=document){
 try{
  if(/Wortschatzübersicht/i.test(document.title))document.title=document.title.replace(/Wortschatzübersicht/gi,'Übersicht');
  const scope=root&&root.nodeType?root:document;
  const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;
  while((n=walker.nextNode()))nodes.push(n);
  for(const node of nodes){
   const parent=node.parentElement;
   if(!parent||/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(parent.tagName))continue;
   const raw=String(node.nodeValue||'');
   let next=raw.replace(/Wortschatzübersicht/gi,'Übersicht');
   if(/^\s*Wortschatz\s*$/i.test(next))next=next.replace(/Wortschatz/i,'Übersicht');
   if(next!==raw)node.nodeValue=next;
  }
 }catch(e){}
}
normalizeOverviewLabels(document);
const labelObserver=new MutationObserver(muts=>{
 for(const m of muts)for(const node of m.addedNodes||[])if(node.nodeType===1||node.nodeType===3)normalizeOverviewLabels(node.nodeType===1?node:node.parentElement||document);
});
try{labelObserver.observe(document.documentElement,{childList:true,subtree:true})}catch(e){}

const api={version:'1.0',theme,taskId,normalizeOverviewLabels,markError:()=>{}};
window.SPL10RepeatStandard=api;

// Übersichtsseiten brauchen nur die einheitliche Benennung.
if(!taskId||/^(pruefung|exam)$/i.test(taskId)||isPreview())return;

const flagKey=`SP_RETRY_L10_${owner()}_T${theme}_${taskId}`;
let restarting=false;
const inheritedSetItem=Storage.prototype.setItem;

function setFlag(){
 try{inheritedSetItem.call(localStorage,flagKey,'1')}catch(e){}
}
function clearFlag(){try{localStorage.removeItem(flagKey)}catch(e){}}
function hasFlag(){try{return localStorage.getItem(flagKey)==='1'}catch(e){return false}}
function hasPositiveMap(v){
 if(!v||typeof v!=='object')return false;
 return Object.values(v).some(x=>x===true||Number(x)>0);
}
function stateShowsError(s){
 if(!s||typeof s!=='object')return false;
 if(s._cycleHadError===true)return true;
 if(hasPositiveMap(s.wrong)||hasPositiveMap(s.review)||hasPositiveMap(s.tries))return true;
 if(Array.isArray(s.review)&&s.review.length>0)return true;
 if(Number(s.round||1)>1)return true;
 return false;
}
function matchesTaskKey(key){
 const k=String(key||'');
 if(!/^SP_L10_/i.test(k)||/^SP_RETRY_/i.test(k))return false;
 const low=k.toLowerCase(),needle=`_t${theme}_${taskId}`.toLowerCase();
 return low.includes(needle)||low===`sp_l10_t${theme}_${taskId}`.toLowerCase();
}
function resetCycle(s,total){
 const next={...s};
 next.done=[];
 next.firstCorrect=[];
 next.firstSeen=[];
 next.wrong={};
 next.review=Array.isArray(next.review)?[]:{};
 next.reviewFirstCorrect={};
 next.tries={};
 next.finished=false;
 next.percent=0;
 next.current=null;
 next._cycleHadError=false;
 next._spRepeatCount=Math.max(0,Number(next._spRepeatCount||0))+1;
 next._spRepeatRequired=true;
 if(Array.isArray(next.order))next.order=shuffle(next.order);
 if(Array.isArray(next.queue))next.queue=shuffle([...Array(total).keys()]);
 if(Array.isArray(next.pairOrder))next.pairOrder=shuffle(next.pairOrder);
 if(Array.isArray(next.roundIds))next.roundIds=Array.isArray(next.order)&&next.order.length?next.order.slice():shuffle(next.roundIds);
 if(next.placements&&typeof next.placements==='object')next.placements={};
 if('round'in next)next.round=1;
 if('notice'in next)next.notice='Wiederholung: In der letzten Runde gab es Fehler.';
 return next;
}
function scheduleRestart(){
 if(restarting)return;
 restarting=true;
 setTimeout(()=>location.reload(),40);
}

api.markError=setFlag;
api.hasError=hasFlag;

Storage.prototype.setItem=function(key,value){
 let nextValue=value;
 try{
  if(matchesTaskKey(key)){
   let state=null;try{state=JSON.parse(String(value||'null'))}catch(e){}
   if(state&&typeof state==='object'){
    if(stateShowsError(state))setFlag();
    const total=Math.max(0,Number(state.total||0));
    const done=Array.isArray(state.done)?state.done.length:Math.max(0,Number(state.done||0));
    if(total>0&&done>=total&&hasFlag()){
     state=resetCycle(state,total);
     nextValue=JSON.stringify(state);
     clearFlag();
     scheduleRestart();
    }
   }
  }
 }catch(e){}
 return inheritedSetItem.call(this,key,nextValue);
};

// Manche ältere L10-Aufgaben speichern Fehlversuche nicht im State.
// Daher werden sichtbare Fehlermeldungen zusätzlich als Fehler der aktuellen Runde markiert.
function scanForError(root=document){
 try{
  const bad=root.querySelector?.('.l8-feedback.bad,.l10-feedback.bad,.l10-drag-feedback.bad,.incorrect,button.wrong,.l8-option.wrong');
  if(bad){setFlag();return}
  const texts=root.querySelectorAll?.('.l8-feedback,.l10-feedback,.l10-drag-feedback')||[];
  for(const el of texts){
   const t=String(el.textContent||'').toLowerCase();
   if(/noch nicht|noch einmal|korrigier|musst du noch einmal|übrig|mach weiter|falsch/.test(t)){setFlag();return}
  }
 }catch(e){}
}
const app=document.getElementById('app')||document.body;
const errorObserver=new MutationObserver(()=>scanForError(app));
try{errorObserver.observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}
scanForError(app);

// Verhindert, dass ein gerade zurückgesetzter fehlerhafter Durchlauf noch als 100%-Event weitergereicht wird.
window.addEventListener('sprachpilot-progress',e=>{if(restarting){try{e.stopImmediatePropagation()}catch(err){}}},true);
})();
