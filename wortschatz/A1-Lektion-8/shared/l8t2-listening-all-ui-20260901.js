(function(){
'use strict';
if(window.__SP_L8T2_LISTENING_ALL_UI_20260902_PLAYER)return;
window.__SP_L8T2_LISTENING_ALL_UI_20260902_PLAYER=true;

const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=()=>window.L8S;
const T=()=>window.L8_THEME;
const playerState=new Map();

function currentTask(){const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(task=>String(task?.id)===String(id))}
function taskNumber(task){const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''}
function previewNote(){return S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskHead(task,state){
 const total=task.items.length,pct=Math.round((state.done?.length||0)/Math.max(1,total)*100),emoji=task.emoji||task.icon||'☎️';
 return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>${esc(emoji)} ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`;
}
function numberNorm(value){
 let s=String(value??'').toLowerCase();
 const map={'eineinhalb':'1.5','anderthalb':'1.5','zehn':'10','neun':'9','acht':'8','sieben':'7','sechs':'6','fünf':'5','funf':'5','vier':'4','drei':'3','zwei':'2','eins':'1','einem':'1','einen':'1','einer':'1','eines':'1','eine':'1','ein':'1'};
 for(const [word,num] of Object.entries(map))s=s.replace(new RegExp(`\\b${word}\\b`,'g'),num);
 return S().norm(s.replace(/1[,.]5/g,'1.5'));
}
function equalFlexible(value,expected){const a=numberNorm(value);return (Array.isArray(expected)?expected:[expected]).some(x=>numberNorm(x)===a)}
function choiceHtml(item,index,saved,done,wrong){
 return `<div class="l8-listen-question ${done?'is-done':''} ${wrong?'is-wrong':''}" data-q="${index}"><div class="l8-listen-qhead"><strong>${index+1}.</strong><span>${esc(item.prompt)}</span></div><div class="l8-listen-options">${(item.options||[]).map((opt,j)=>{const id=`l8la-${index}-${j}`;return `<label for="${id}"><input id="${id}" type="radio" name="q${index}" value="${esc(opt)}" ${String(saved)===String(opt)?'checked':''} ${done?'disabled':''}><span>${esc(opt)}</span></label>`}).join('')}</div>${wrong?'<div class="l8-listen-mini">Noch nicht richtig.</div>':''}</div>`;
}
function inputHtml(item,index,saved,done,wrong){
 return `<div class="l8-listen-question ${done?'is-done':''} ${wrong?'is-wrong':''}" data-q="${index}"><div class="l8-listen-qhead"><strong>${index+1}.</strong><span>${esc(item.prompt)}</span></div><input class="l8-input l8-listen-text" data-input-q="${index}" autocomplete="off" value="${esc(saved||'')}" ${done?'disabled':''} placeholder="Antworte in einem vollständigen Satz.">${wrong?'<div class="l8-listen-mini">Noch nicht richtig.</div>':''}</div>`;
}
function finish(task,root){root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Fragen bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
function audioSrc(task,section){return String(section?.audioFile||section?.audio||task?.audioFile||task?.audio||'').trim()}
function playerKey(task,section){return `${task.id}:${section.id}`}
function playerHtml(task,section){
 const src=audioSrc(task,section);if(!src)return'';
 return `<div class="l8-listen-player-wrap"><div class="l8-listen-player-label">🎧 Gespräch</div><audio class="l8-listen-player" data-listen-player="${esc(playerKey(task,section))}" controls preload="metadata" src="${esc(src)}">Dein Browser unterstützt diesen Audio-Player nicht.</audio><div class="l8-listen-player-hint">Du kannst pausieren und mit der Zeitleiste zu einer Stelle zurückspringen.</div></div>`;
}
function sectionHtml(task,section,state,doneSet){
 const indices=task.items.map((item,i)=>item.section===section.id?i:-1).filter(i=>i>=0);
 const questions=indices.map(index=>{const item=task.items[index],saved=state.answers?.[index]||'',done=doneSet.has(index),wrong=!done&&Number(state.tries?.[index]||0)>0;return item.type==='choice'?choiceHtml(item,index,saved,done,wrong):inputHtml(item,index,saved,done,wrong)}).join('');
 return `<section class="l8-card l8-listening-section"><div class="l8-listen-section-head"><div><span class="l8-listen-section-kicker">${esc(section.mode==='choice'?'Multiple Choice':'Antworten schreiben')}</span><h2>${esc(section.title)}</h2><p>${esc(section.instruction||'')}</p></div></div>${playerHtml(task,section)}<div class="l8-listen-questions">${questions}</div></section>`;
}
function bindPlayers(root){
 root.querySelectorAll('[data-listen-player]').forEach(player=>{
  const key=player.dataset.listenPlayer,state=playerState.get(key)||{time:0};
  const restore=()=>{if(Number.isFinite(state.time)&&state.time>0&&Math.abs(player.currentTime-state.time)>.5){try{player.currentTime=state.time}catch(e){}}};
  if(player.readyState>=1)restore();else player.addEventListener('loadedmetadata',restore,{once:true});
  const save=()=>{playerState.set(key,{time:Number(player.currentTime)||0})};
  player.addEventListener('timeupdate',save);player.addEventListener('pause',save);player.addEventListener('ended',()=>playerState.set(key,{time:0}));
 });
}
function render(task,root){
 const total=task.items.length,state=S().load(T().number,task.id,total),doneSet=new Set(state.done||[]);
 if(doneSet.size>=total)return finish(task,root);
 const sections=Array.isArray(task.sections)&&task.sections.length?task.sections:[{id:1,title:'Gespräch',instruction:task.instruction||'',audio:task.audio,audioFile:task.audioFile,mode:'mixed'}];
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead(task,state)}<div class="l8-two-listenings">${sections.map(section=>sectionHtml(task,section,state,doneSet)).join('')}</div><section class="l8-card l8-listen-check-card"><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="checkAll" type="button">Alle Antworten prüfen</button></div><div id="feedback"></div></section></div>`;
 bindPlayers(root);
 document.getElementById('checkAll').onclick=()=>{
  root.querySelectorAll('[data-listen-player]').forEach(player=>playerState.set(player.dataset.listenPlayer,{time:Number(player.currentTime)||0}));
  const fresh=S().load(T().number,task.id,total),already=new Set(fresh.done||[]),values=[];let missing=false;
  task.items.forEach((item,index)=>{
   if(already.has(index)){values[index]=fresh.answers?.[index]||'';return}
   if(item.type==='choice'){const checked=root.querySelector(`input[name="q${index}"]:checked`);values[index]=checked?.value||''}
   else values[index]=root.querySelector(`[data-input-q="${index}"]`)?.value?.trim()||'';
   if(!values[index])missing=true;
  });
  const box=document.getElementById('feedback');
  if(missing){if(box)box.innerHTML='<div class="l8-feedback warn">Beantworte zuerst alle offenen Fragen.</div>';return}
  task.items.forEach((item,index)=>{
   if(already.has(index))return;
   const value=values[index],ok=item.type==='choice'?S().equal(value,item.answer):equalFlexible(value,item.answer);
   if(ok){let r=S().right(T().number,task.id,total,index,value);if(r.needsReview)r=S().right(T().number,task.id,total,index,value)}else S().wrong(T().number,task.id,total,index,value);
  });
  setTimeout(()=>render(task,root),120);
 };
}

function patchedTaskPage(){const task=currentTask(),root=document.getElementById('app');if(task&&(task.kind==='listening-all'||task.kind==='listening-two')){window.resetThemeProgress=()=>S().reset(T().number);return render(task,root)}return originalTaskPage()}
window.L8UI={...base,taskPage:patchedTaskPage};

const style=document.createElement('style');style.id='sp-l8t2-listening-all-ui-20260902-player';style.textContent=`.l8-two-listenings{display:grid;gap:18px}.l8-listening-section{max-width:960px;margin-inline:auto;width:100%;box-sizing:border-box}.l8-listen-section-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}.l8-listen-section-head h2{margin:4px 0 6px}.l8-listen-section-head p{margin:0}.l8-listen-section-kicker{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--lesson-main-dark,var(--l8-dark))}.l8-listen-player-wrap{position:sticky;top:8px;z-index:5;margin:0 0 22px;padding:14px 16px;border:2px solid var(--lesson-line,var(--l8-line));border-radius:16px;background:#fff;box-shadow:0 6px 18px rgba(32,56,74,.08)}.l8-listen-player-label{font-weight:900;color:var(--lesson-main-dark,var(--l8-dark));margin-bottom:8px}.l8-listen-player{display:block;width:100%;height:44px}.l8-listen-player-hint{margin-top:7px;font-size:13px;color:var(--lesson-muted,#607384)}.l8-listen-questions{display:grid;gap:14px}.l8-listen-question{padding:16px;border:1px solid var(--lesson-line,var(--l8-line));border-radius:16px;background:#fff}.l8-listen-question.is-done{background:#f2fbf4;border-color:#a8d8b0}.l8-listen-question.is-wrong{background:#fff8f4;border-color:#efb9a3}.l8-listen-qhead{display:flex;gap:8px;align-items:flex-start;font-size:17px;line-height:1.45;margin-bottom:10px}.l8-listen-options{display:grid;gap:8px}.l8-listen-options label{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:#f7fafc}.l8-listen-text{width:100%;max-width:800px}.l8-listen-mini{margin-top:8px;font-size:14px;color:#9b4a2b}.l8-listen-check-card{max-width:960px;margin-inline:auto}@media(max-width:620px){.l8-listening-section{padding:14px}.l8-listen-question{padding:13px}.l8-listen-qhead{font-size:16px}.l8-listen-section-head{display:grid}.l8-listen-player-wrap{top:4px;padding:11px 12px}.l8-listen-player-hint{font-size:12px}}`;
document.head.appendChild(style);
})();