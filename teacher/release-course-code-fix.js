(function(){
  function patch(){
    if(typeof ReleaseDraft==='undefined'||typeof Courses==='undefined'||typeof TeacherApp==='undefined')return false;
    if(ReleaseDraft.__courseCodeSaveFix)return true;
    ReleaseDraft.__courseCodeSaveFix=true;
    ReleaseDraft.save=async function(){
      if(!this.courseName||!this.data)return alert('Keine Freigabe ausgewählt.');
      var payload=this.normalizeBeforeSave();
      var code=String(this.courseCode||payload.courseCode||payload.kurs||payload.kursnummer||'').trim();
      var doc=String(this.courseName||'').trim();
      payload.courseCode=code||payload.courseCode||doc;
      payload.kurs=code||payload.kurs||doc;
      payload.kursnummer=code||payload.kursnummer||doc;
      payload.courseDocId=doc||payload.courseDocId||code;
      payload.courseName=payload.courseName||code||doc;

      // Freigaben gehören genau in das im Lehrer-Dashboard ausgewählte Kursdokument.
      // Früher wurde zusätzlich unter dem Kurscode ein zweites Dokument geschrieben.
      // Das erzeugte doppelte Kursstände und konnte Schüler auf einem veralteten Stand halten.
      await Courses.update(doc,payload);

      alert('Freigabe gespeichert.');
      TeacherApp.render();
    };
    return true;
  }
  if(!patch()){
    document.addEventListener('DOMContentLoaded',patch);
    setTimeout(patch,100);
    setTimeout(patch,500);
    setTimeout(patch,1500);
  }
})();
