import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T1||{cards:[],tasks:[]};
const taskId=String(new URLSearchParams(location.search).get('task')||'');
const task=D.tasks.find(t=>t.id===taskId);
const cards=D.cards||[];
const byId=Object.fromEntries(cards.map(x=>[x.id,x]));
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const run=Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
const KEY=`SP_L10_T1_${taskId}`;
let selectedId='';
let busy=false;

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function base(){return{_run:run,order:shuffle(cards.map(x=>x.id)),done:[],placements:{},total:cards.length,updatedAt:Date.now()}}
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){};if(!s||Number(s._run||1)!==run||!Array.isArray(s.order)||s.order.length!==cards.length||cards.some(x=>!s.order.includes(x.id)))s=base();s.done=Array.isArray(s.done)?s.done.filter(id=>byId[id]):[];s.placements=s.placements&&typeof s.placements==='object'?s.placements:{};s.total=cards.length;save(s);return s}
let state=load();
function save(s=state){s._run=run;s.updatedAt=Date.now();localStorage.setItem(KEY,JSON.stringify(s))}
function pct(){return state.total?Math.round(state.done.length/state.total*100):0}
function correctGroup(item){
 if(taskId==='artikel-sortieren')return item.article;
 if(taskId==='gesicht-koerper')return D.dragGroups?.face?.has(item.id)?'face':'body';
 return '';
}
function groups(){return taskId==='artikel-sortieren'?[{id:'der',label:'der'},{id:'die',label:'die'},{id:'das',label:'das'}]:[{id:'face',label:'das Gesicht'},{id:'body',label:'der Körper'}]}
function wordLabel(item){return taskId==='artikel-sortieren'?item.term:item.full}
function header(){return renderSpHeader({subtitle:`${task?.title||'Zuordnen'} · A1 Lektion 10 · Thema 1`,color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'}})}
function head(){return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><h1>${esc(task?.title||'Zuordnen')}</h1><p>${esc(task?.icon||'🧲')} ${esc(task?.text||'Ziehe die Wörter in die richtige Spalte.')}</p></div><div class="l10-progress"><span>${state.done.length} / ${state.total}</span><div><i style="width:${pct()}%"></i></div></div></section>`}
function shell(content){root.innerHTML=`<div class="l10-task-page">${header()}<div class="l8-wrap">${head()}${content}<footer>© SprachPilot</footer></div></div>`;bindSpHeader(root);setTimeout(()=>window.SPTaskAutoScroll?.schedule?.(0,'render'),30)}
function completeThemePractice(){return(D.tasks||[]).filter(t=>!t.exam).every(t=>{try{const s=JSON.parse(localStorage.getItem(`SP_L10_T1_${t.id}`)||'null');return s&&Number(s._run||1)===run&&Array.isArray(s.done)&&Number(s.total||34)>0&&s.done.length>=Number(s.total||34)}catch(e){return false}})}
function finish(){const next=taskId==='artikel-sortieren'?'gesicht-koerper':null;const examOk=completeThemePractice();shell(`<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast alle ${state.total} Wörter richtig zugeordnet.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="./">Zur Übersicht</a>${next?`<a class="l8-btn primary" href="task.html?task=${next}">Weiter</a>`:examOk?'<a class="l8-btn primary" href="task.html?task=pruefung">Weiter zur Prüfung</a>':''}</div></section>`)}
function chip(id,placed=false){const item=byId[id];if(!item)return'';return`<button class="l10-drag-chip ${selectedId===id?'selected':''} ${placed?'placed':''}" type="button" draggable="${placed?'false':'true'}" data-drag-id="${esc(id)}" ${placed?'tabindex="-1"':''}>${esc(wordLabel(item))}</button>`}
function render(){if(state.done.length>=state.total)return finish();const open=state.order.filter(id=>!state.done.includes(id));const cols=groups().map(g=>{const placed=state.order.filter(id=>state.done.includes(id)&&state.placements[id]===g.id);return`<section class="l10-drop-column" data-drop-group="${esc(g.id)}" tabindex="0" role="button" aria-label="${esc(g.label)}"><div class="l10-drop-title">${esc(g.label)}</div><div class="l10-drop-items">${placed.map(id=>chip(id,true)).join('')}<div class="l10-drop-placeholder">Hier ablegen</div></div></section>`}).join('');shell(`<section class="l8-card l10-drag-task"><div class="l8-note"><strong>Drag & Drop:</strong> Ziehe ein Wort in die passende Spalte. Auf dem Handy kannst du zuerst das Wort und danach die Spalte antippen.</div><div class="l10-drag-pool" aria-label="Wörter">${open.map(id=>chip(id)).join('')}</div><div class="l10-drop-table cols-${groups().length}">${cols}</div><div class="l10-drag-feedback" id="dragFeedback" aria-live="polite"></div></section>`);bindDrag()}
function feedback(text,type){const box=document.getElementById('dragFeedback');if(!box)return;box.textContent=text;box.className='l10-drag-feedback '+type}
function attempt(id,group){if(busy||!id||state.done.includes(id))return;const item=byId[id];if(!item)return;if(correctGroup(item)!==group){feedback('Noch einmal. Das Wort gehört in eine andere Spalte.','bad');document.querySelector(`[data-drag-id="${CSS.escape(id)}"]`)?.classList.add('wrong');setTimeout(()=>document.querySelector(`[data-drag-id="${CSS.escape(id)}"]`)?.classList.remove('wrong'),450);return}state.done.push(id);state.placements[id]=group;save();selectedId='';feedback('Richtig!','good');busy=true;setTimeout(()=>{busy=false;render()},260)}
function bindDrag(){
 document.querySelectorAll('.l10-drag-chip:not(.placed)').forEach(el=>{
  el.addEventListener('dragstart',e=>{selectedId=el.dataset.dragId||'';el.classList.add('dragging');try{e.dataTransfer.setData('text/plain',selectedId);e.dataTransfer.effectAllowed='move'}catch(err){}});
  el.addEventListener('dragend',()=>el.classList.remove('dragging'));
  el.addEventListener('click',()=>{selectedId=selectedId===el.dataset.dragId?'':el.dataset.dragId;document.querySelectorAll('.l10-drag-chip').forEach(x=>x.classList.toggle('selected',x.dataset.dragId===selectedId));feedback(selectedId?'Wort ausgewählt. Tippe jetzt auf die passende Spalte.':'','')});
 });
 document.querySelectorAll('[data-drop-group]').forEach(zone=>{
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('over');try{e.dataTransfer.dropEffect='move'}catch(err){}});
  zone.addEventListener('dragleave',()=>zone.classList.remove('over'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('over');let id='';try{id=e.dataTransfer.getData('text/plain')}catch(err){};attempt(id||selectedId,zone.dataset.dropGroup)});
  zone.addEventListener('click',e=>{if(e.target.closest('.l10-drag-chip.placed'))return;if(selectedId)attempt(selectedId,zone.dataset.dropGroup)});
  zone.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&selectedId){e.preventDefault();attempt(selectedId,zone.dataset.dropGroup)}});
 });
}

render();
