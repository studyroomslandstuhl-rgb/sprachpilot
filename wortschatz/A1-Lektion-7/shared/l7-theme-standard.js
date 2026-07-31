(function(){
'use strict';
if(window.L7ThemeStandard)return;

const VERSION='l7-theme-standard1';

function esc(value){
  if(window.L7S?.esc)return L7S.esc(value);
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function taskHref(task){
  return `task.html?task=${encodeURIComponent(task.id)}&v=${VERSION}`;
}

function percentage(theme,task){
  try{return Number(L7S.pct(theme,task.id,task.items.length))||0}catch(error){return 0}
}

function taskCard(theme,task,number){
  const percent=percentage(theme,task);
  const locked=!!task.exam&&!L7S.allDone(theme);
  if(locked){
    return `<div id="task-${esc(task.id)}" class="module exam-locked" aria-disabled="true">
      <div class="num">${number}. ${esc(task.title)}</div>
      <div class="icon exam-icon">${esc(task.icon||'⭐')}</div>
      <p>Prüfung wird freigeschaltet, wenn alle Lernaufgaben 100% erreicht haben.</p>
      <div class="progress"><div class="bar" style="width:0%"></div></div>
      <div class="small">gesperrt</div>
      <div class="start">Prüfung gesperrt</div>
    </div>`;
  }
  return `<a id="task-${esc(task.id)}" class="module ${percent>=100?'done':''}" href="${taskHref(task)}">
    <div class="num">${number}. ${esc(task.title)}</div>
    <div class="icon ${task.exam?'exam-icon':''}">${esc(task.icon||'📝')}</div>
    <p>${esc(task.description||'Aufgabe bearbeiten.')}</p>
    <div class="progress"><div class="bar" style="width:${percent}%"></div></div>
    <div class="small">${percent}%</div>
    <div class="start">${percent>=100?'Fertig':'Starten'}</div>
  </a>`;
}

function previewNote(){
  if(!window.L7S?.preview?.())return'';
  return '<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>';
}

function render(themeNumber){
  const theme=Number(themeNumber);
  const root=document.getElementById('app');
  const data=window.L7_THEME;
  if(!root||!data||!window.L7S)return;

  const tasks=Array.isArray(data.tasks)?data.tasks:[];
  const percentages=tasks.map(task=>percentage(theme,task));
  const average=percentages.length?Math.round(percentages.reduce((sum,value)=>sum+value,0)/percentages.length):0;
  const completed=percentages.filter(value=>value>=100).length;

  root.innerHTML=`
    ${previewNote()}
    <section class="card progress-card">
      <div class="circle" id="totalCircle">${average}%</div>
      <div class="progress-main">
        <h2>Dein Fortschritt</h2>
        <p class="small" id="totalText">${completed} / ${tasks.length} Aufgaben abgeschlossen</p>
        <div class="progress"><div class="bar" id="totalBar" style="width:${average}%"></div></div>
        <p class="small">${esc(data.goal||'Wortschatz und Grammatik üben.')}</p>
      </div>
    </section>
    <section class="grid" id="taskGrid">
      ${tasks.map((task,index)=>taskCard(theme,task,index+1)).join('')}
    </section>
    <footer>© SprachPilot</footer>`;

  window.resetThemeProgress=()=>L7S.reset(theme);
  if(location.hash){
    setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),80);
  }
}

window.L7ThemeStandard={render};
})();
