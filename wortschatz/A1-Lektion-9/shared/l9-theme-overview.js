(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function taskEmoji(text){const t=String(text||'').toLowerCase();if(/karte/.test(t))return'🃏';if(/hör|hoer|audio/.test(t))return'🎧';if(/sprech|dialog/.test(t))return'🎤';if(/konjug|grammatik|imperativ|dürfen|muessen|müssen/.test(t))return'🔤';if(/schreib|lücke|luecke|text/.test(t))return'✍️';if(/prüf|pruef/.test(t))return'⭐';return'✅'}
function normalizeTask(x,i){
 if(typeof x==='string')return{title:x,description:'Diese Aufgabe wird im L8/L9-Standard umgesetzt.',icon:taskEmoji(x),locked:true,progress:0};
 const t={...x};t.icon=t.icon||taskEmoji(t.title);t.locked=t.locked!==false;t.progress=Math.max(0,Math.min(100,Number(t.progress)||0));return t;
}
function renderTask(t,i){
 const p=t.progress||0,done=p>=100;
 if(t.locked)return`<div class="l8-card l8-task-card locked" aria-disabled="true"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">in Vorbereitung</div><div class="l8-task-start">Noch nicht freigeschaltet</div></div>`;
 const href=t.href||`task.html?task=${encodeURIComponent(t.id||'')}`;
 return`<a class="l8-card l8-task-card ${done?'done':''}" href="${esc(href)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${done?'Fertig':'Starten'}</div></a>`;
}
function render(){
 const n=Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||1),theme=window.L9_THEMES?.[n]||window.L9_THEMES?.[String(n)],app=document.getElementById('app');
 if(!theme||!app)return;
 const tasks=(theme.tasks||[]).map(normalizeTask),completed=tasks.filter(t=>t.progress>=100).length,avg=tasks.length?Math.round(tasks.reduce((sum,t)=>sum+(t.progress||0),0)/tasks.length):0;
 app.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-progress-card"><div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${completed} / ${tasks.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><p class="l8-small l8-theme-subtitle">${esc(theme.title||`Thema ${n}`)}</p><div class="l8-tags">${(theme.chips||[]).map(x=>`<span class="l8-tag">${esc(x)}</span>`).join('')}</div></div><div class="l8-score-slot"><div class="l8-score-panel"><div class="l8-score-label">Lektion 9 · Thema ${n}</div><div class="l8-score-total">Grün</div><div class="l8-small">Aufgaben verwenden den L8-Standard.</div></div></div></section><section class="l8-grid">${tasks.map(renderTask).join('')}</section><footer>© SprachPilot</footer></div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();