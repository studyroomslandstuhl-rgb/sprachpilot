(function(){
'use strict';

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function isThemeMenu(){
 const path=location.pathname.replace(/\/+$/,'');
 return path.endsWith('/Thema-4')||path.endsWith('/Thema-4/index.html');
}
function backHref(){return isThemeMenu()?'../index.html':'index.html'}
function taskHref(task){
 const separator=task.file.includes('?')?'&':'?';
 return `${task.file}${separator}v=l6t4-bunny1`;
}
function overviewImage(word,icon){
 const bunny=window.L6T4Bunny;
 const item=bunny?.vocabularyItem(word);
 if(!item?.image)return`<div class="word-placeholder" aria-hidden="true">${esc(icon||'📚')}</div>`;
 const source=bunny.url(item.image);
 return`<div class="word-placeholder"><img data-bunny-file="${esc(item.image)}" src="${esc(source)}" alt="${esc(word)}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span aria-hidden="true" hidden>${esc(icon||'📚')}</span></div>`;
}

window.l6t4MatchedHeader=function(title,showReset=false){
 const header=document.querySelector('.topbar');
 if(!header)return;
 const profile=l6t4Profile();
 const name=`${profile?.vorname||profile?.firstName||''} ${profile?.nachname||profile?.lastName||''}`.trim()||'Schüler/in';
 const activeRole=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 const dashboard=activeRole==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
 header.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · ${L6T4_CFG.title}</div></div></a><div class="account-tools"><span class="account-pill">${name}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${backHref()}">← Zurück</a><a class="btn secondary" href="uebersicht.html?v=l6t4-bunny1">Übersicht</a>${showReset?'<button class="btn danger-btn" type="button" onclick="l6t4Reset()">Fortschritte löschen</button>':''}</nav>`;
};

window.l6t4MatchedMenu=function(){
 const grid=document.getElementById('taskGrid');
 const circle=document.getElementById('totalCircle');
 const text=document.getElementById('totalText');
 const bar=document.getElementById('totalBar');
 const values=L6T4_TASKS.map(task=>({task,percent:l6t4Percent(task.key,task.total)}));
 const average=Math.round(values.reduce((sum,item)=>sum+item.percent,0)/Math.max(1,values.length))||0;
 if(circle)circle.textContent=average+'%';
 if(bar)bar.style.width=average+'%';
 if(text)text.textContent=values.filter(item=>item.percent>=100).length+' / '+values.length+' Aufgaben abgeschlossen';
 if(!grid)return;
 const examUnlocked=l6t4ExamUnlocked();
 grid.innerHTML='<div class="grid">'+values.map(item=>{
  const task=item.task;
  const percent=item.percent;
  const locked=task.exam&&!examUnlocked;
  const cls='module'+(locked?' exam-locked':'');
  const href=locked?'':` href="${taskHref(task)}"`;
  const aria=locked?' aria-disabled="true"':'';
  const start=locked?'Gesperrt':percent>=100?'Fertig':'Starten';
  const description=locked?'Die Prüfung wird geöffnet, wenn alle vorherigen Aufgaben 100% erreicht haben.':task.description;
  return `<a class="${cls}"${href}${aria}><div class="num">${task.number}. ${task.title}</div><div class="big-icon">${task.icon||'▶'}</div><p class="small">${description}</p><div class="progress"><div class="bar" style="width:${percent}%"></div></div><div class="small">${percent}%</div><div class="start">${start}</div></a>`;
 }).join('')+'</div>';
};

window.l6t4MatchedVocabulary=function(target){
 if(!target)return;
 const groups=window.L6T4_DATA?.overviewGroups||[];
 target.innerHTML=groups.map(group=>`<section class="type-block"><div class="type-title">${group.icon||'📚'} ${group.title}</div>${group.words.map(word=>{const item=window.L6T4Bunny?.vocabularyItem(word);return`<div class="word-row">${overviewImage(word,group.icon)}<div><b>${esc(word)}</b><br><span class="small">${esc(item?.meaning||'Wortschatz aus Lektion 6 · Thema 4')}</span></div></div>`}).join('')}</section>`).join('');
 window.L6T4Bunny?.enforce(target);
};
})();