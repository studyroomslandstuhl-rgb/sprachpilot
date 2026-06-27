// Falls deine Firebase-Konfiguration schon zentral existiert, diese Datei nicht ersetzen.
// Sie ist nur als Platzhalter im ZIP, damit teacher/index.html eindeutig zeigt, wo firebase initialisiert wird.
if(typeof firebase!=="undefined" && !firebase.apps.length && window.firebaseConfig){
  firebase.initializeApp(window.firebaseConfig);
}
if(typeof firebase!=="undefined"){
  window.db = window.db || firebase.firestore();
}
