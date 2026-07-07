(function(){
  if(window.SP_PERFORMANCE_MODE||window.SP_NO_FIREBASE_SYNC||typeof window.spCanWriteFirebaseProgress==='function'&&window.spCanWriteFirebaseProgress()===false){
    window.spVerbScoreScan=function(){};
    return;
  }
  // Sicherheitsmodus: keine direkte Firebase-Punktevergabe mehr über diese Bridge.
  // Verben speichern lokal; Cloud-Sync wird separat und gedrosselt behandelt.
  window.spVerbScoreScan=function(){};
})();