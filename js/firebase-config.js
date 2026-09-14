// SprachPilot Firebase-Konfiguration für ältere Seiten mit Firebase-Compat-SDK.
// Diese Datei wird u. a. vom Lehrer-Dashboard geladen.
(function(){
  const config = window.firebaseConfig || {
    apiKey: "AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468",
    authDomain: "sprachpilot-12c68.firebaseapp.com",
    projectId: "sprachpilot-12c68",
    storageBucket: "sprachpilot-12c68.firebasestorage.app",
    messagingSenderId: "454992284519",
    appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2",
    measurementId: "G-2XXR3FSY89"
  };

  window.firebaseConfig = config;

  if (typeof firebase === "undefined") {
    console.error("Firebase SDK wurde nicht geladen.");
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    window.auth = window.auth || firebase.auth();
    window.db = window.db || firebase.firestore();

    const isTeacherArea = /(^|\/)teacher(\/|$)/i.test(location.pathname || "");

    // Im Lehrerbereich muss die bestehende E-Mail/Passwort-Sitzung erhalten bleiben.
    // Eine anonyme Anmeldung würde den authentifizierten Lehrer ersetzen und danach
    // fälschlich "Kein Lehrerzugang" auslösen.
    window.spCompatAuthReady = new Promise(function(resolve){
      let finished = false;
      let stop = function(){};
      let timer = null;
      const finish = function(user){
        if(finished) return;
        finished = true;
        if(timer) clearTimeout(timer);
        try{stop()}catch(e){}
        resolve(user || window.auth.currentUser || null);
      };
      timer = setTimeout(function(){
        console.warn('Firebase Auth hat nicht rechtzeitig geantwortet. Aktueller Sitzungsstand wird verwendet.');
        finish(window.auth.currentUser || null);
      }, 6000);
      stop = window.auth.onAuthStateChanged(function(user){
        if(finished) return;
        if(user || isTeacherArea){
          finish(user || null);
          return;
        }
        // Außerhalb des Lehrerbereichs dürfen ältere Seiten weiterhin anonym arbeiten.
        finished = true;
        if(timer) clearTimeout(timer);
        try{stop()}catch(e){}
        window.auth.signInAnonymously()
          .then(function(result){ resolve(result && result.user ? result.user : window.auth.currentUser || null); })
          .catch(function(error){
            console.warn("Firebase Anonymous Auth konnte nicht gestartet werden:", error);
            resolve(null);
          });
      }, function(error){
        console.warn('Firebase Auth State konnte nicht gelesen werden:', error);
        finish(window.auth.currentUser || null);
      });
    });

    window.dispatchEvent(new CustomEvent("TeacherFirebaseReady", {
      detail: { auth: window.auth, db: window.db, authReady: window.spCompatAuthReady }
    }));
  } catch (error) {
    console.error("Firebase konnte nicht initialisiert werden:", error);
    window.dispatchEvent(new CustomEvent("TeacherFirebaseError", {
      detail: { error }
    }));
  }
})();
