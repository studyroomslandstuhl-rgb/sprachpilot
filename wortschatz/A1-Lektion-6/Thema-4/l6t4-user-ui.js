(function(){
'use strict';
if(window.__L6T4_USER_UI_20260727)return;
window.__L6T4_USER_UI_20260727=true;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function profile(){try{return typeof l6t4Profile==='function'?(l6t4Profile()||{}):JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function languageKey(){
 const raw=String(profile().muttersprache||profile().motherLanguage||profile().language||'').toLowerCase();
 if(/ukrain|україн|\buk\b|\bua\b/.test(raw))return'uk';
 if(/russ|рус/.test(raw))return'ru';
 if(/türk|turk/.test(raw))return'tr';
 if(/arab|عرب/.test(raw))return'ar';
 if(/japan|日本/.test(raw))return'ja';
 if(/rumän|ruman|romanian/.test(raw))return'ro';
 if(/pol|poln|polish/.test(raw))return'pl';
 if(/kurd|kurdî|kurdi/.test(raw))return'ku';
 return'en';
}
const LANGUAGE_NAMES={en:'Englisch',ru:'Russisch',uk:'Ukrainisch',tr:'Türkisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function translation(item){const key=languageKey();return item?.translations?.[key]||item?.translations?.en||item?.meaning||''}
window.l6t4LanguageKey=languageKey;
window.l6t4LanguageName=()=>LANGUAGE_NAMES[languageKey()]||'Englisch';
window.l6t4Translation=translation;

function rebuildMeta(){
 const source=window.L6T4_USER_META||[];
 if(!source.length||typeof L6T4_META==='undefined'||typeof L6T4_TASKS==='undefined')return;
 const build=entry=>{
  const current=window.L6T4_DATA?.tasks?.find(item=>item.id===entry.id);
  const file=entry.external||`task.html?task=${encodeURIComponent(entry.id)}`;
  const key=entry.external||`task-${entry.id}`;
  const total=entry.id==='plural'?(window.L6T4PluralItems?.length||0):(current?.items?.length||0);
  return{...entry,file,key,total,exam:entry.id==='exam'};
 };
 L6T4_META.splice(0,L6T4_META.length,...source);
 L6T4_TASKS.splice(0,L6T4_TASKS.length,...source.map(build));
}
rebuildMeta();
window.l6t4RebuildUserMeta=rebuildMeta;

function isThemeIndex(){const path=location.pathname.replace(/\/+$/,'');return path.endsWith('/Thema-4')||path.endsWith('/Thema-4/index.html')}
function backHref(){return isThemeIndex()?'../index.html':'index.html'}
function headerHtml(title,showReset=false){
 const p=profile(),name=`${p.vorname||p.firstName||''} ${p.nachname||p.lastName||''}`.trim()||'Schüler/in';
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 const dashboard=role==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
 return`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · ${esc(L6T4_CFG.title)}</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${backHref()}">← Zurück</a>${!isThemeIndex()?'<a class="btn secondary" href="uebersicht.html?v=l6t4-user1">Übersicht</a>':''}${showReset?'<button class="btn danger-btn" type="button" onclick="l6t4Reset()">Fortschritte löschen</button>':''}</nav>`;
}
window.l6t4Header=function(title,showReset=false){const header=document.querySelector('.topbar');if(header)header.innerHTML=headerHtml(title,showReset)};
window.l6t4MatchedHeader=window.l6t4Header;

function taskHref(task){const separator=task.file.includes('?')?'&':'?';return`${task.file}${separator}v=l6t4-user1`}
window.l6t4MatchedMenu=function(){
 rebuildMeta();
 const grid=document.getElementById('taskGrid'),circle=document.getElementById('totalCircle'),text=document.getElementById('totalText'),bar=document.getElementById('totalBar');
 const values=L6T4_TASKS.map(task=>({task,percent:l6t4Percent(task.key,task.total)}));
 const average=Math.round(values.reduce((sum,item)=>sum+item.percent,0)/Math.max(1,values.length))||0;
 if(circle)circle.textContent=average+'%';if(bar)bar.style.width=average+'%';if(text)text.textContent=values.filter(item=>item.percent>=100).length+' / '+values.length+' Aufgaben abgeschlossen';
 if(!grid)return;
 const examUnlocked=l6t4ExamUnlocked();
 grid.innerHTML='<div class="grid">'+values.map(({task,percent})=>{
  const locked=task.exam&&!examUnlocked,cls='module'+(locked?' exam-locked':''),href=locked?'':` href="${taskHref(task)}"`,aria=locked?' aria-disabled="true"':'',start=locked?'Gesperrt':percent>=100?'Fertig':'Starten';
  const description=locked?'Schließe zuerst alle anderen Aufgaben zu 100 % ab.':task.description;
  return`<a class="${cls}"${href}${aria}><div class="num">${esc(task.number)}. ${esc(task.title)}</div><div class="big-icon">${task.icon||'▶'}</div><p class="small">${esc(description)}</p><div class="progress"><div class="bar" style="width:${percent}%"></div></div><div class="small">${percent}%</div><div class="start">${start}</div></a>`;
 }).join('')+'</div>';
};

function overviewImage(item,icon){
 if(!item?.image)return`<div class="word-placeholder" aria-hidden="true">${esc(icon||'📚')}</div>`;
 const source=window.L6T4Bunny?.url(item.image)||`https://sprachpilot.b-cdn.net/${encodeURIComponent(item.image)}`;
 return`<div class="word-placeholder"><img data-bunny-file="${esc(item.image)}" src="${esc(source)}" alt="${esc(item.word)}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span aria-hidden="true" hidden>${esc(icon||'📚')}</span></div>`;
}
window.l6t4MatchedVocabulary=function(target){
 if(!target)return;
 const groups=window.L6T4_DATA?.overviewGroups||[],vocabulary=window.L6T4_DATA?.vocabulary||[];
 const find=word=>vocabulary.find(item=>item.word===word)||window.L6T4Bunny?.vocabularyItem(word);
 target.innerHTML=`<div class="translation-language-note">Übersetzung: <b>${esc(window.l6t4LanguageName())}</b></div>`+groups.map(group=>`<section class="type-block"><div class="type-title">${group.icon||'📚'} ${esc(group.title)}</div>${group.words.map(word=>{const item=find(word);return`<div class="word-row">${overviewImage(item,group.icon)}<div><b>${esc(word)}</b><br><span class="small">${esc(item?.meaning||'')}</span><div class="mother-translation"><span>${esc(window.l6t4LanguageName())}</span><strong>${esc(translation(item))}</strong></div></div></div>`}).join('')}</section>`).join('');
 window.L6T4Bunny?.enforce(target);
};
})();