function renderMenu(){
  const m=document.getElementById("spMenu");
  if(!m)return;
  m.innerHTML=`
    <div class="menu-actions">
      <span class="menu-title">Verben A1</span>
      <button class="btn secondary" onclick="renderHome()">Übersicht</button>
      <button class="btn secondary" onclick="openVerbTask('startAssessment')">Verben einschätzen</button>
      <button class="btn secondary" onclick="openVerbTask('flashcards')">Karteikarten</button>
      <button class="btn secondary" onclick="openVerbTask('memory')">Memory</button>
      <button class="btn secondary" onclick="openVerbTask('writeVerb')">Schreiben</button>
      <button class="btn secondary" onclick="openVerbTask('renderStudentDashboard')">Statistik</button>
    </div>`;
}
