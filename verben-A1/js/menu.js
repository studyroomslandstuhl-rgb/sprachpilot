function renderMenu(){
  const m=document.getElementById("spMenu");
  if(!m)return;
  const logo = `<img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot" onerror="this.replaceWith(document.createTextNode('SP'))">`;
  m.innerHTML=`
  <div class="menu-card">
    <div class="menu-logo"><span class="logo big">${logo}</span><div><strong>SprachPilot</strong><small>Verben A1</small></div></div>
    <details open><summary>Verben A1</summary>
      <button onclick="renderHome()">Übersicht</button>
      <button onclick="startAssessment()">Verben einschätzen</button>
      <button onclick="renderStudentDashboard()">Meine Statistik</button>
    </details>
    <details open><summary>Aufgaben</summary>
      <button onclick="flashcards()">Karteikarten</button>
      <button onclick="memory()">Memory</button>
      <button onclick="quiz()">Bild → Verb</button>
      <button onclick="verbToImage()">Verb → Bild</button>
      <button onclick="writeVerb()">Schreiben</button>
      <button onclick="hearWrite()">Hören → Schreiben</button>
      <button onclick="hearSpeak()">Hören → Sprechen</button>
      <button onclick="imageSpeak()">Bild → Sprechen</button>
      <button onclick="sentencePuzzle()">Satz-Puzzle</button>
    </details>
    <div class="menu-muted">Weitere Bereiche öffnen sich über die Startseite.</div>
  </div>`;
}
