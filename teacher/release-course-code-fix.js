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
      payload.courseName=payload.courseName||doc||code;
      await Courses.update(doc,payload);
      if(code&&code!==doc){
        try{await Courses.update(code,payload)}catch(e){console.warn('Freigabe konnte nicht zusätzlich unter Kurscode gespeichert werden',e)}
      }
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
