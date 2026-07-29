(function(){
  'use strict';
  const VERSION = 'l7t1-l6t4-clean1';
  const CDN = 'https://sprachpilot.b-cdn.net/';
  const AUDIO_CDN = 'https://sprachpilot.b-cdn.net/audio/';

  const TASK_META = {
    'karteikarten': ['Karteikarten', '🃏', 'Lerne die Wörter.'],
    'bild-erklaerung-wort': ['Bedeutung → Wort', '💡', 'Finde das passende Wort.'],
    'artikel-plural': ['Artikel und Plural', 'der', 'Wähle Artikel und Pluralform.'],
    'koennen-formen': ['Verb „können“', 'K', 'Finde die richtige Form von „können“.'],
    'wollen-formen': ['Verb „wollen“', 'W', 'Finde die richtige Form von „wollen“.'],
    'verbform-waehlen': ['Verbform auswählen', '✓', 'Wähle die richtige Verbform.'],
    'aussagen-ordnen': ['Aussagesätze', '1-2-3', 'Ordne den Aussagesatz.'],
    'ja-nein-fragen': ['Ja-/Nein-Fragen', '?', 'Ordne die Ja-/Nein-Frage.'],
    'w-fragen': ['W-Fragen', 'W?', 'Ordne die W-Frage.'],
    'faehigkeiten-abstufen': ['Wie gut?', '★★★', 'Wähle die passende Abstufung.'],
    'bildimpulse': ['Sprechen und Schreiben', '🖼️', 'Sprich oder schreibe den Satz.'],
    'fragen-antworten': ['Fragen und Antworten', '↔️', 'Finde die passende Antwort.'],
    'partnerinterview': ['Partnerinterview', '👥', 'Beantworte die Frage in vollständigen Sätzen.'],
    'wollen-moechten': ['Wollen oder möchten', '☕', 'Wähle „wollen“ oder „möchten“.'],
    'dialoge-ergaenzen': ['Dialoge ergänzen', '💬', 'Ergänze den Dialog.'],
    'hoeren-wuensche': ['Hören und Verstehen', '🎧', 'Höre und schreibe die Antwort.'],
    'eigene-faehigkeiten': ['Eigene Fähigkeiten', '✍️', 'Schreibe über deine Fähigkeiten.'],
    'eigene-plaene': ['Eigene Wünsche und Pläne', '📝', 'Schreibe über deine Wünsche und Pläne.'],
    'hoeren-erkennen': ['Hören und Erkennen', '🔉', 'Höre und erkenne die Aktivität.'],
    'pruefung': ['Prüfung', '⭐', 'Zeige, was du gelernt hast.']
  };

  const IMAGE_BY_WORD = {
    backen: 'backen.webp',
    kochen: 'kochen.webp',
    singen: 'singen.webp',
    reiten: 'reiten.webp',
    malen: 'malen.webp',
    schreiben: 'schreiben.webp',
    lesen: 'lesen.webp',
    schwimmen: 'schwimmen.webp',
    tanzen: 'tanzen.webp',
    laufen: 'laufen.webp',
    wandern: 'wandern.webp',
    reisen: 'reisen.webp',
    einkaufen: 'einkaufen.webp',
    schlafen: 'schlafen.webp'
  };

  function basename(value){
    return String(value || '').trim().split(/[?#]/)[0].split('/').filter(Boolean).pop() || '';
  }

  function slug(value){
    return String(value || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function imageUrl(file){
    const name = basename(file);
    return name ? CDN + encodeURIComponent(name) : '';
  }

  function audioUrl(file){
    const name = basename(file);
    return name ? AUDIO_CDN + encodeURIComponent(name) : '';
  }

  function normalizeItem(item){
    if(!item || typeof item !== 'object') return item;
    if(item.image) item.image = basename(item.image);
    if(!item.image){
      const key = slug(item.word || item.answer || item.prompt);
      if(IMAGE_BY_WORD[key]) item.image = IMAGE_BY_WORD[key];
    }
    if(item.audioFile) item.audioFile = basename(item.audioFile);
    return item;
  }

  function normalizeTheme(theme){
    if(!theme || !Array.isArray(theme.tasks)) return theme;
    theme.title = theme.title || 'können, wollen und möchten';
    theme.goal = theme.goal || 'Du kannst über Fähigkeiten, Wünsche und Pläne sprechen.';
    theme.lessonColor = 'dark-purple';
    theme.tasks.forEach((task) => {
      if(!task || typeof task !== 'object') return;
      const meta = TASK_META[task.id];
      if(meta){
        task.title = meta[0];
        task.icon = meta[1];
        task.description = meta[2];
      }
      if(task.exam) task.icon = '⭐';
      (task.items || []).forEach(normalizeItem);
    });
    return theme;
  }

  function fixMedia(root){
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if(src.includes('sprachpilot.b-cdn.net/')) img.setAttribute('loading', 'lazy');
    });
    scope.querySelectorAll('audio[src]').forEach((audio) => {
      const src = audio.getAttribute('src') || '';
      if(!src.includes('sprachpilot.b-cdn.net/')) return;
      const fixed = audioUrl(src);
      if(fixed && src !== fixed) audio.setAttribute('src', fixed);
    });
    scope.querySelectorAll('.nav a').forEach((link) => {
      if((link.textContent || '').trim().includes('Übersicht')){
        link.setAttribute('href', 'uebersicht.html?v=' + VERSION);
      }
    });
  }

  window.L7_THEME_READY = Promise.resolve(window.L7_THEME_READY)
    .then((theme) => normalizeTheme(theme || window.L7_THEME));

  window.L7T1_MEDIA = { imageUrl, audioUrl, fixMedia, version: VERSION };

  if(document.readyState !== 'loading') fixMedia(document);
  document.addEventListener('DOMContentLoaded', () => fixMedia(document));
  new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => fixMedia(node)));
    fixMedia(document);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();