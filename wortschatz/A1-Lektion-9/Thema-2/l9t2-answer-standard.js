(function(){
'use strict';
if(window.__SP_L9T2_ANSWER_STANDARD_V2)return;
window.__SP_L9T2_ANSWER_STANDARD_V2=true;
const D=window.L9T2||{};
const taskId=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(!taskId)return;

function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function storage(){return preview()?sessionStorage:localStorage}
function storageKey(id=taskId){return `SP_L9_${pid()}_T2_${id}`}
function readState(id=taskId){try{return JSON.parse(storage().getItem(storageKey(id))||'{}')||{}}catch(e){return{}}}
function saveState(s,id=taskId){try{storage().setItem(storageKey(id),JSON.stringify(s))}catch(e){}}
function emit(s,id=taskId){try{window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{lesson:9,theme:2,task:id,state:s}}))}catch(e){}}

/* Umlaute sind Teil der richtigen Schreibweise. Groß-/Kleinschreibung,
   Satzzeichen und ß/ss bleiben wie bisher tolerant. */
function strictNorm(v){return String(v??'').trim().toLowerCase().normalize('NFC').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function looseNorm(v){return strictNorm(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function listAnswers(item){if(!item)return[];return[item.answer,...(item.answers||[]),...(item.accepted||[])].filter(x=>typeof x==='string'&&x.trim())}
function currentId(s=readState(),id=taskId){
 const order=Array.isArray(s.order)?s.order:[],done=Array.isArray(s.done)?s.done:[];
 if(id==='karteikarten'||id==='cards'){
  const first=order.find(x=>!done.includes(x)&&!(s.reviewFirstCorrect||{})[x]);
  return first||order.find(x=>!done.includes(x))||null;
 }
 return order.find(x=>!done.includes(x))||order.find(x=>(s.review||{})[x])||null;
}
function answersForInput(inp){
 if(inp?.dataset?.row&&inp?.dataset?.field){const row=(D.imperativeTable||[]).find(x=>x.id===inp.dataset.row),f=inp.dataset.field;if(!row)return[];return[row[f],...(row[f+'Answers']||[])].filter(Boolean)}
 if(taskId==='karteikarten'||taskId==='cards'){const id=currentId(),card=(D.flashcards||D.cards||[]).find(x=>x.id===id);if(!card)return[];return[card.full||card.word,...(card.answers||[]),...(card.accepted||[])].filter(Boolean)}
 if(taskId==='pruefung'){const s=readState('pruefung'),order=Array.isArray(s.order)?s.order:[],done=Array.isArray(s.done)?s.done:[],id=order.find(x=>!done.includes(x)),item=(D.exam||[]).find(x=>x.id===id);return listAnswers(item)}
 const id=currentId();
 if(taskId==='dialog-luecken')return listAnswers((D.dialogGaps||[]).find(x=>x.id===id));
 if(taskId==='imperativ-bilden')return listAnswers((D.imperativeBuild||[]).find(x=>x.id===id));
 if(taskId==='modalpartikel-schreiben')return listAnswers((D.particleWrite||[]).find(x=>x.id===id));
 return[];
}
function umlautMismatch(value,expected){const raw=String(value??'').trim();if(!raw||!expected.length)return false;const strict=strictNorm(raw),loose=looseNorm(raw);if(expected.some(x=>strictNorm(x)===strict))return false;return expected.some(x=>looseNorm(x)===loose&&strictNorm(x)!==strict)}

function markPracticeWrong(ids){const s=readState();s.done=Array.isArray(s.done)?s.done:[];s.wrong=s.wrong||{};s.review=s.review||{};s.__spReviewReady=s.__spReviewReady||{};s.reviewFirstCorrect=s.reviewFirstCorrect||{};for(const id of ids.filter(Boolean)){s.wrong[id]=(Number(s.wrong[id])||0)+1;s.review[id]=true;delete s.__spReviewReady[id];if(taskId==='karteikarten'||taskId==='cards')delete s.reviewFirstCorrect[id]}saveState(s);emit(s)}
function markExamWrong(){const s=readState('pruefung'),order=Array.isArray(s.order)?s.order:[],done=Array.isArray(s.done)?s.done:[],id=order.find(x=>!done.includes(x));if(!id)return;s.firstSeen=Array.isArray(s.firstSeen)?s.firstSeen:[];s.firstCorrect=Array.isArray(s.firstCorrect)?s.firstCorrect:[];s.wrong=s.wrong||{};if(!s.firstSeen.includes(id))s.firstSeen.push(id);s.wrong[id]=(Number(s.wrong[id])||0)+1;saveState(s,'pruefung');emit(s,'pruefung')}
function showUmlautError(inputs){const msg='<div class="l8-feedback bad">Noch nicht richtig. <strong>ä, ö und ü müssen genau stimmen.</strong> Ein fehlender Umlaut ist ein Fehler.</div>';const fb=document.getElementById('feedback');if(fb)fb.innerHTML=msg;for(const inp of inputs){if(inp.dataset?.row&&inp.dataset?.field){const cell=document.getElementById(`fb-${inp.dataset.row}-${inp.dataset.field}`);if(cell)cell.innerHTML='<span class="l8-feedback bad">Umlaut korrigieren</span>'}}}
function textInputsFor(button){if(button?.id==='cardCheck'){const x=document.getElementById('cardInput');return x?[x]:[]}if(button?.id==='checkTable')return[...document.querySelectorAll('input[data-row]:not(:disabled)')];const area=button?.closest('.l8-exercise,.l8-card')||document.getElementById('taskArea')||document;return[...area.querySelectorAll('input,textarea')].filter(x=>!x.disabled&&!['radio','checkbox','hidden','button','submit'].includes(String(x.type||'text').toLowerCase()))}
function guardInputs(inputs,event){const bad=inputs.filter(x=>umlautMismatch(x.value,answersForInput(x)));if(!bad.length)return false;event.preventDefault();event.stopImmediatePropagation();if(taskId==='pruefung')markExamWrong();else{const rowIds=[...new Set(bad.map(x=>x.dataset?.row).filter(Boolean))];markPracticeWrong(rowIds.length?rowIds:[currentId()])}showUmlautError(bad);return true}

document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const check=b.id==='cardCheck'||b.id==='check'||b.id==='checkTable'||/prüfen/i.test(String(b.textContent||''));if(!check)return;guardInputs(textInputsFor(b),e)},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const x=e.target;if(!(x instanceof HTMLInputElement||x instanceof HTMLTextAreaElement))return;if(['radio','checkbox','hidden','button','submit'].includes(String(x.type||'text').toLowerCase()))return;guardInputs([x],e)},true);

/* Karteikarten haben ihre eigene Wiederholung. Wenn in der Wiederholung erneut
   ein Fehler passiert, beginnt für dieses Wort wieder eine neue Endwiederholung. */
if(taskId==='karteikarten'||taskId==='cards'){
 window.addEventListener('sprachpilot-progress',e=>{const d=e.detail||{};if(Number(d.lesson)!==9||Number(d.theme)!==2||!['karteikarten','cards'].includes(String(d.task||'')))return;const s=d.state;if(!s?.reviewFirstCorrect||!s.review||!s.wrong)return;let changed=false;for(const id of Object.keys(s.reviewFirstCorrect)){if(s.review[id]&&Number(s.wrong[id])>0){delete s.reviewFirstCorrect[id];changed=true}}if(changed)saveState(s,String(d.task||taskId))},true);
}

/* Einheitliche Wiederholungsregel für alle übrigen Übungsaufgaben:
   Fehler -> richtig korrigiert -> noch nicht erledigt -> ans Ende ->
   beim zweiten korrekten Lösen erst endgültig erledigt.
   Passiert bei der Endwiederholung erneut ein Fehler, wird wieder eine neue
   Endwiederholung verlangt. */
const repeatManaged=!['karteikarten','cards','memory','pruefung'].includes(taskId);
let internal=false;
if(repeatManaged){
 function migrate(){const s=readState();if(!Array.isArray(s.done)||!s.review||!Array.isArray(s.order))return;s.__spReviewReady=s.__spReviewReady||{};let changed=false;for(const id of [...s.done])if(s.review[id]){s.done=s.done.filter(x=>x!==id);s.__spReviewReady[id]=true;s.order=[...s.order.filter(x=>x!==id),id];changed=true}if(changed)saveState(s)}
 migrate();
 window.addEventListener('sprachpilot-progress',e=>{
  if(internal)return;const d=e.detail||{};if(Number(d.lesson)!==9||Number(d.theme)!==2||String(d.task||'')!==taskId)return;const s=d.state;if(!s||!Array.isArray(s.done)||!s.review||!Array.isArray(s.order))return;s.__spReviewReady=s.__spReviewReady||{};s.wrong=s.wrong||{};let changed=false,deferred=[];
  for(const id of Object.keys(s.__spReviewReady)){if(s.__spReviewReady[id]&&s.review[id]&&!s.done.includes(id)&&Number(s.wrong[id])>0){delete s.__spReviewReady[id];changed=true}}
  for(const id of [...s.done]){
   if(!s.review[id])continue;
   if(s.__spReviewReady[id]){delete s.review[id];delete s.__spReviewReady[id];changed=true;continue}
   s.done=s.done.filter(x=>x!==id);s.__spReviewReady[id]=true;s.order=[...s.order.filter(x=>x!==id),id];deferred.push(id);changed=true;
  }
  if(!changed)return;internal=true;saveState(s);internal=false;
  if(deferred.length)setTimeout(()=>{const fb=document.getElementById('feedback');if(fb)fb.innerHTML='<div class="l8-feedback warn"><strong>Richtig korrigiert.</strong> Dieses Item zählt noch nicht als erledigt und kommt am Ende noch einmal.</div>';for(const id of deferred)document.querySelectorAll(`[id^="fb-${id}-"]`).forEach(el=>el.innerHTML='<span class="l8-feedback warn">Kommt noch einmal</span>')},0);
 },true);
}
})();