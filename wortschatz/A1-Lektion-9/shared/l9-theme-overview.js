(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function taskEmoji(text){const t=String(text||'').toLowerCase();if(/karte/.test(t))return'🃏';if(/hör|hoer|audio/.test(t))return'🎧';if(/sprech|dialog|rollenspiel/.test(t))return'🎤';if(/konjug|grammatik|imperativ|dürfen|muessen|müssen/.test(t))return'🔤';if(/schreib|lücke|luecke|text/.test(t))return'✍️';if(/prüf|pruef/.test(t))return'⭐';return'✅'}
function normalizeTask(x,i,n){
 const standard=window.L9TaskCopyStandard?.standardize?.(x,i,n);
 const source=standard||((typeof x==='string')?{title:x,description:'Bearbeite die Aufgabe.'}:{...x});
 const t={...source};
 t.icon=t.icon||taskEmoji(t.title);
 t.locked=typeof x==='string'?(x.locked!==false):(t.locked!==false);
 t.progress=Math.max(0,Math.min(100,Number(t.progress)||0));
 if(/prüfung/i.test(t.title||'')){t.title='Prüfung';t.description='Teste dein Wissen.';t.instruction='Teste dein Wissen.';t.icon='⭐'}
 return t;
}
function renderTask(t,i){
 const p=t.progress||0,done=p>=100;
 if(t.locked)return`<div class="l8-card l8-task-card locked" aria-disabled="true"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Noch nicht verfügbar</div></div>`;
 const href=t.href||`task.html?task=${encodeURIComponent(t.id||'')}`;
 return`<a class="l8-card l8-task-card ${done?'done':''}" href="${esc(href)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${done?'Fertig':'Starten'}</div></a>`;
}
function render(){
 const n=Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||1),theme=window.L9_THEMES?.[n]||window.L9_THEMES?.[String(n)],app=document.getElementById('app');
 if(!theme||!app)return;
 const tasks=(theme.tasks||[]).map((x,i)=>normalizeTask(x,i,n)),practice=tasks.filter(t=>!/prüfung/i.test(t.title||'')),completed=practice.filter(t=>t.progress>=100).length,avg=practice.length?Math.round(practice.reduce((sum,t)=>sum+(t.progress||0),0)/practice.length):0;
 app.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-progress-card"><div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${completed} / ${practice.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><p class="l8-small l8-theme-subtitle">${esc(theme.title||`Thema ${n}`)}</p><div class="l8-tags">${(theme.chips||[]).map(x=>`<span class="l8-tag">${esc(x)}</span>`).join('')}</div></div></section><section class="l8-grid">${tasks.map(renderTask).join('')}</section><footer>© SprachPilot</footer></div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();