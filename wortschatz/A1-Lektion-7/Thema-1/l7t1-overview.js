(function(){
  'use strict';
  const VERSION = 'l7t1-l6t4-clean1';
  const root = document.getElementById('app');

  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function uniq(items){
    const seen = new Set();
    return items.filter((item) => {
      const key = String(item.word || item.answer || item.prompt || '').trim().toLowerCase();
      if(!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function collect(theme){
    const rows = [];
    (theme.tasks || []).forEach((task) => {
      if(task.exam) return;
      (task.items || []).forEach((item) => {
        const word = item.word || item.answer;
        if(!word) return;
        rows.push({
          word,
          meaning: item.meaning || item.translation || '',
          example: item.example || item.prompt || '',
          image: item.image || '',
          audioFile: item.audioFile || ''
        });
      });
    });
    return uniq(rows);
  }

  function header(title){
    return `<header class="topbar">
      <div class="topbar-main">
        <a class="brand" href="/index.html">
          <div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div>
          <div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · A1 Lektion 7 · Thema 1</div></div>
        </a>
        <div class="account-tools">
          <a class="account-link" href="/student-dashboard/index.html">Dashboard</a>
          <a class="account-link" href="/profile/index.html">Profil</a>
        </div>
      </div>
      <nav class="nav">
        <a class="btn secondary" href="index.html?v=${VERSION}">← Zurück</a>
        <a class="btn secondary" href="uebersicht.html?v=${VERSION}">Übersicht</a>
      </nav>
    </header>`;
  }

  function row(item){
    const image = window.L7T1_MEDIA && window.L7T1_MEDIA.imageUrl ? window.L7T1_MEDIA.imageUrl(item.image) : '';
    const audio = window.L7T1_MEDIA && window.L7T1_MEDIA.audioUrl ? window.L7T1_MEDIA.audioUrl(item.audioFile) : '';
    return `<article class="overview-word">
      <div class="overview-image">${image ? `<img src="${image}" alt="${esc(item.word)}" loading="lazy">` : '<span></span>'}</div>
      <div>
        <h2>${esc(item.word)}</h2>
        ${item.meaning ? `<p class="small">${esc(item.meaning)}</p>` : ''}
        ${item.example ? `<p>${esc(item.example)}</p>` : ''}
      </div>
      ${audio ? `<audio controls preload="metadata" src="${audio}"></audio>` : ''}
    </article>`;
  }

  Promise.resolve(window.L7_THEME_READY).then((theme) => {
    const rows = collect(theme || window.L7_THEME);
    root.innerHTML = `<div class="container">
      ${header('Übersicht')}
      <section class="card">
        <div class="task-title-block">
          <span class="task-number">Übersicht</span>
          <h1>${esc((theme && theme.title) || 'können, wollen und möchten')}</h1>
        </div>
        <div class="overview-grid">${rows.map(row).join('')}</div>
      </section>
      <footer>© SprachPilot</footer>
    </div>`;
  }).catch((error) => {
    console.error(error);
    root.innerHTML = '<div class="container"><section class="card finish-box"><h2>Die Übersicht konnte nicht geladen werden.</h2><a class="btn" href="index.html">Zurück</a></section></div>';
  });
})();