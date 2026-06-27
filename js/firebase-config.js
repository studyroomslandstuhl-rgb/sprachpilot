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

    window.dispatchEvent(new CustomEvent("TeacherFirebaseReady", {
      detail: { auth: window.auth, db: window.db }
    }));
  } catch (error) {
    console.error("Firebase konnte nicht initialisiert werden:", error);
    window.dispatchEvent(new CustomEvent("TeacherFirebaseError", {
      detail: { error }
    }));
  }
})();
