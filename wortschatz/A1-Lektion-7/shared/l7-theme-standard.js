(function(){
'use strict';
if(window.L7ThemeStandard)return;

const VERSION='l7-theme-standard2';

const COMMON_EMOJIS=Object.freeze({
  'karteikarten':'🃏',
  'bild-erklaerung-wort':'🖼️',
  'artikel-plural':'🔤',
  'infinitiv-partizip':'🔁',
  'memory':'🧠',
  'partizip-waehlen':'✅',
  'partizip-schreiben':'✍️',
  'fehler-korrigieren':'🛠️',
  'saetze-ordnen':'🧩',
  'saetze-bilden':'✍️',
  'ja-nein-fragen':'💬',
  'w-fragen':'❓',
  'bildimpulse':'🖼️',
  'fragen-antworten':'💬',
  'eigene-saetze':'✍️'
});

const THEME_EMOJIS=Object.freeze({
  1:Object.freeze({
    'karteikarten':'🃏',
    'bild-erklaerung-wort':'🖼️',
    'artikel-plural':'🔤',
    'koennen-formen':'💪',
    'wollen-formen':'🎯',
    'verbform-waehlen':'✅',
    'aussagen-ordnen':'🧩',
    'ja-nein-fragen':'💬',
    'w-fragen':'❓',
    'faehigkeiten-abstufen':'📊',
    'bildimpulse':'🖼️',
    'fragen-antworten':'💬',
    'partnerinterview':'🎤',
    'wollen-moechten':'⚖️',
    'dialoge-ergaenzen':'💬',
    'hoeren-wuensche':'🎧',
    'eigene-faehigkeiten':'💪',
    'eigene-plaene':'📅'
  }),
  2:Object.freeze({
    'karteikarten':'🃏',
    'infinitiv-partizip':'🔁',
    'memory':'🧠',
    'endung-sortieren':'📦',
    'endung-markieren':'🖍️',
    'silben-ordnen':'🧩',
    'partizip-waehlen':'✅',
    'partizip-schreiben':'✍️',
    'hoeren-partizip':'🎧',
    'fehler-korrigieren':'🛠️',
    'haben-konjugieren':'🔤',
    'satzklammer':'🧲',
    'saetze-ordnen':'🧩',
    'saetze-bilden':'✍️',
    'zeitangaben':'⏰',
    'dialogluecken':'💬',
    'fragen-antworten':'💬',
    'lesen-tagesrueckblick':'📖',
    'hoeren-rueckblick':'🎧',
    'eigene-saetze':'✍️'
  }),
  3:Object.freeze({
    'karteikarten':'🃏',
    'infinitiv-partizip':'🔁',
    'sein-konjugieren':'🔤',
    'hilfsverb-sein':'🔑',
    'partizip-waehlen':'✅',
    'saetze-ordnen':'🧩',
    'bild-satz':'🖼️',
    'bildimpulse':'🖼️',
    'saetze-bilden':'✍️',
    'ja-nein-fragen':'💬',
    'w-fragen':'❓',
    'dialoge':'💬',
    'hoeren-bewegung':'🎧',
    'haben-sein-sortieren':'⚖️',
    'hilfsverb-waehlen':'✅',
    'hilfsverb-schreiben':'✍️',
    'gemischte-saetze':'🔀',
    'fehler-korrigieren':'🛠️',
    'lesen-wochenende':'📖',
    'hoeren-was-passiert':'🎧',
    'eigene-saetze':'✍️'
  }),
  4:Object.freeze({
    'karteikarten':'🃏',
    'artikel':'🧩',
    'plural-sprechen':'🎤',
    'wort-bedeutung':'💡',
    'redemittel-ordnen':'🧩',
    'lesen-richtig-falsch':'✅',
    'lesen-abc':'🔤',
    'informationen-markieren':'🖍️',
    'ueberschrift':'📰',
    'rechtschreibung':'✍️',
    'informationen-schreiben':'📝',
    'hoeren-sekretariat':'🎧',
    'hoerdialog-ordnen':'🧩',
    'telefonluecken':'☎️',
    'telefonat-sprechen':'📞',
    'dialog-deutschkurs':'💬',
    'dialog-schulausflug':'🚌',
    'dialog-treffpunkt':'📍',
    'entschuldigung-schule':'📝',
    'nachricht-deutschkurs':'💌',
    'entschuldigung-pruefen':'✅',
    'eigener-dialog':'🗣️'
  })
});

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

function fallbackEmoji(task){
  const text=`${task?.id||''} ${task?.title||''}`.toLowerCase();
  if(/prüfung|pruefung|exam/.test(text))return'⭐';
  if(/karte/.test(text))return'🃏';
  if(/hör|hoer|audio/.test(text))return'🎧';
  if(/sprech|interview/.test(text))return'🎤';
  if(/les/.test(text))return'📖';
  if(/bild/.test(text))return'🖼️';
  if(/dialog|frage|antwort/.test(text))return'💬';
  if(/ordnen|sortier|silben/.test(text))return'🧩';
  if(/wähl|waehl|prüf|pruef/.test(text))return'✅';
  if(/schreib|satz/.test(text))return'✍️';
  if(/zeit|uhr/.test(text))return'⏰';
  return'📝';
}

function taskEmoji(theme,task){
  if(task?.exam)return'⭐';
  const id=String(task?.id||'').toLowerCase();
  return THEME_EMOJIS[theme]?.[id]||COMMON_EMOJIS[id]||fallbackEmoji(task);
}

function taskCard(theme,task,number){
  const percent=percentage(theme,task);
  const locked=!!task.exam&&!L7S.allDone(theme);
  const emoji=taskEmoji(theme,task);
  if(locked){
    return `<div id="task-${esc(task.id)}" class="module exam-locked" aria-disabled="true">
      <div class="num">${number}. ${esc(task.title)}</div>
      <div class="icon exam-icon">⭐</div>
      <p>Prüfung wird freigeschaltet, wenn alle Lernaufgaben 100% erreicht haben.</p>
      <div class="progress"><div class="bar" style="width:0%"></div></div>
      <div class="small">gesperrt</div>
      <div class="start">Prüfung gesperrt</div>
    </div>`;
  }
  return `<a id="task-${esc(task.id)}" class="module ${percent>=100?'done':''}" href="${taskHref(task)}">
    <div class="num">${number}. ${esc(task.title)}</div>
    <div class="icon ${task.exam?'exam-icon':''}">${esc(emoji)}</div>
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

window.L7ThemeStandard={render,taskEmoji};
})();
