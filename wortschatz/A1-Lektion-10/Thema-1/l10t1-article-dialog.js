import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T1||{tasks:[],articleDialogs:[]};
const task=D.tasks.find(t=>t.id==='artikel-dialoge');
const items=D.articleDialogs||[];
const byId=Object.fromEntries(items.map(x=>[x.id,x]));
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const KEY='SP_L10_T1_artikel-dialoge';
const run=Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
let busy=false;

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v??'').trim().toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function base(){return{_run:run,order:shuffle(items.map(x=>x.id)),done:[],firstSeen:[],firstCorrect:[],wrong:{},total:items.length,updatedAt:Date.now()}}
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){};if(!s||Number(s._run||1)!==run||!Array.isArray(s.order)||s.order.length!==items.length||items.some(x=>!s.order.includes(x.id)))s=base();s.done=Array.isArray(s.done)?s.done.filter(id=>byId[id]):[];s.firstSeen=Array.isArray(s.firstSeen)?s.firstSeen:[];s.firstCorrect=Array.isArray(s.firstCorrect)?s.firstCorrect:[];s.wrong=s.wrong||{};s.total=items.length;save(s);return s}
let state=load();
function save(s=state){s._run=run;s.updatedAt=Date.now();localStorage.setItem(KEY,JSON.stringify(s))}
function current(){const id=state.order.find(id=>!state.done.includes(id));return id?byId[id]:null}
function pct(){return state.total?Math.round(state.done.length/state.total*100):0}
function header(){return renderSpHeader({subtitle:'Artikel in Dialogen · A1 Lektion 10 · Thema 1',color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'},navItems:[{label:'← Zurück',href:'./'},{label:'Wortschatz',href:'uebersicht.html'}]})}
function head(){return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 12</span><h1>${esc(task.title)}</h1><p>${esc(task.icon)} ${esc(task.text)}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${state.total} fertig</span><strong>${pct()}%</strong></div><div class="l8-progress"><div style="width:${pct()}%"></div></div></section>`}
function shell(content){root.innerHTML=`<div class="l10-task-page">${header()}<div class="l8-wrap">${head()}${content}<footer>© SprachPilot</footer></div></div>`;bindSpHeader(root);setTimeout(()=>window.SPTaskAutoScroll?.schedule?.(0,'render'),30)}
function dialogueHtml(text){return String(text||'').split('\n').map(line=>`<div>${esc(line).replace('___','<span class="l10-dialog-blank">_____</span>')}</div>`).join('')}
function feedback(html,type){const box=document.getElementById('feedback');if(!box)return;box.className=`l8-feedback ${type}`;box.innerHTML=html}
function completeThemePractice(){return(D.tasks||[]).filter(t=>!t.exam).every(t=>{try{const s=JSON.parse(localStorage.getItem(`SP_L10_T1_${t.id}`)||'null');return s&&Number(s._run||1)===run&&Array.isArray(s.done)&&Number(s.total||34)>0&&s.done.length>=Number(s.total||34)}catch(e){return false}})}
function finish(){const canExam=completeThemePractice();shell(`<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast Aufgabe 12 zu 100% abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="./">Zur Übersicht</a>${canExam?'<a class="l8-btn primary" href="task.html?task=pruefung">Weiter zur Prüfung</a>':''}</div></section>`)}
function render(){const item=current();if(!item)return finish();shell(`<section class="l8-card l8-exercise l10-dialog-task"><div class="l8-note"><strong>Entscheide selbst:</strong> Ist der Artikel bestimmt oder unbestimmt? Brauchst du Nominativ oder Akkusativ?</div><div class="l10-dialogue">${dialogueHtml(item.html)}</div><div class="l8-answer-row"><input class="l8-input" id="articleInput" autocomplete="off" autocapitalize="off" placeholder="Artikel schreiben"><button class="l8-btn primary" id="checkBtn" type="button">Prüfen</button></div><div id="feedback" aria-live="polite"></div></section>`);const input=document.getElementById('articleInput');const check=()=>submit(item,input.value);document.getElementById('checkBtn').onclick=check;input.onkeydown=e=>{if(e.key==='Enter')check()};input.focus()}
function submit(item,value){if(busy)return;const id=item.id,correct=norm(value)===norm(item.answer);if(!state.firstSeen.includes(id)){state.firstSeen.push(id);if(correct)state.firstCorrect.push(id)}if(correct){if(!state.done.includes(id))state.done.push(id);delete state.wrong[id];save();feedback(`Richtig: <strong>${esc(item.answer)}</strong> · ${esc(item.type)} · ${esc(item.case)}`,'good');busy=true;setTimeout(()=>{busy=false;render()},650);return}state.wrong[id]=(Number(state.wrong[id])||0)+1;save();const n=state.wrong[id];if(n===1)feedback('Noch nicht richtig. Korrigiere deine Antwort.','bad');else if(n===2)feedback('<strong>Hinweis:</strong> Prüfe zuerst: Wer/was? = Nominativ oder wen/was? = Akkusativ. Entscheide dann: bestimmt oder unbestimmt.','warn');else feedback(`<strong>Lösung:</strong> ${esc(item.answer)} · ${esc(item.type)} · ${esc(item.case)}. Schreibe die Lösung selbst in die Lücke.`,'warn')}

render();
