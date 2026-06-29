window.SP_FLASHCARD_STATE = window.SP_FLASHCARD_STATE || {
  verb: "",
  tries: 0,
  hadWrong: false,
  flipped: false
};

function flashcards() {
  const v = nextFromTaskQueue("karteikarte");

  if (!v) {
    renderHome();
    return;
  }

  window.SP_FLASHCARD_STATE = {
    verb: v,
    tries: 0,
    hadWrong: false,
    flipped: false
  };

  state.currentVerb = v;
  saveState();

  $("app").innerHTML = `
    <h2>Karteikarten</h2>
    ${taskProgressHtml("karteikarte", "Karteikarten")}

    <div class="assessment-card flashcard-standard-card">
      <div class="task-instruction">Sage oder schreibe das deutsche Verb.</div>

      <div class="small">${safeText(nativeLang())}</div>
      <div class="native-word">${safeText(nativeWord(v))}</div>

      ${imageBox(v)}

      <div class="answer-line flash-answer-line">
        <button class="secondary" onclick="startFlashSpeech('${safeText(v)}')">Sprechen</button>
        <input id="flashInput" autocomplete="off" placeholder="Schreibe das Verb auf Deutsch">
        <button class="success" onclick="checkFlashAnswer('${safeText(v)}')">Kontrollieren</button>
      </div>

      <div class="actions flash-actions">
        <button class="secondary" onclick="showFlashAnswer('${safeText(v)}')">Karte umdrehen</button>
        <button class="secondary" onclick="flashCannotSpeak()">Ich kann nicht sprechen</button>
      </div>

      <div id="flashFb" class="feedback"></div>
    </div>
  `;

  renderAndHydrate();

  setTimeout(() => {
    const input = $("flashInput");
    if (input) input.focus();
  }, 50);
}

function showFlashAnswer(v) {
  const s = window.SP_FLASHCARD_STATE || {};
  s.flipped = true;
  s.hadWrong = true;
  s.tries = Math.max(1, s.tries || 0);
  window.SP_FLASHCARD_STATE = s;

  const input = $("flashInput");
  if (input) {
    input.value = v;
    input.focus();
  }

  const fb = $("flashFb");
  if (fb) {
    fb.innerHTML = `
      <div class="no">
        Lösung: ${safeText(v)}<br>
        Schreibe das Verb ab. Diese Karte zählt noch nicht als gelernt.
      </div>
    `;
  }
}

function checkFlashAnswer(v) {
  const s = window.SP_FLASHCARD_STATE || {};
  const input = $("flashInput");
  const value = input ? input.value : "";
  const ok = clean(value) === clean(v);

  if (ok) {
    const learned = !s.hadWrong && !s.flipped;

    $("flashFb").innerHTML = learned
      ? "<div class='ok'>Richtig!</div>"
      : "<div class='helped'>Richtig abgeschrieben. Diese Karte kommt später noch einmal.</div>";

    addEncounter(v, "karteikarte", learned);
    finishQueuedVerb("karteikarte", v, true);

    setTimeout(flashcards, 700);
    return;
  }

  s.tries = (s.tries || 0) + 1;
  s.hadWrong = true;
  window.SP_FLASHCARD_STATE = s;

  $("flashFb").innerHTML = `
    <div class="no">
      ${flashFeedbackForTry(s.tries, v)}
    </div>
  `;
}

function flashFeedbackForTry(tries, solution) {
  if (tries === 1) {
    return "Da ist noch ein Fehler.";
  }

  if (tries === 2) {
    return "Tipp: Prüfe die Schreibweise des Verbs.";
  }

  return "Lösung: " + safeText(solution);
}

function flashCannotSpeak() {
  const input = $("flashInput");
  const fb = $("flashFb");

  if (input) input.focus();

  if (fb) {
    fb.innerHTML = `
      <div class="helped">
        Kein Problem. Schreibe das Verb in das Feld und klicke auf Kontrollieren.
      </div>
    `;
  }
}

function startFlashSpeech(v) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    flashCannotSpeak();
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const fb = $("flashFb");
  if (fb) {
    fb.innerHTML = "<div class='helped'>Ich höre zu ...</div>";
  }

  recognition.onresult = function(event) {
    const text = event.results && event.results[0] && event.results[0][0]
      ? event.results[0][0].transcript
      : "";

    const input = $("flashInput");
    if (input) input.value = text;

    checkFlashAnswer(v);
  };

  recognition.onerror = function() {
    if (fb) {
      fb.innerHTML = `
        <div class="helped">
          Sprechen hat nicht funktioniert. Schreibe das Verb in das Feld.
        </div>
      `;
    }
  };

  recognition.start();
}
