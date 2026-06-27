// SprachPilot Firebase-Konfiguration (compat)
// Diese Datei wird von Seiten benutzt, die Firebase über die compat-Skripte laden,
// z. B. teacher/index.html. Sie ersetzt nicht js/firebase.js für Modul-Seiten.

window.firebaseConfig = window.firebaseConfig || {
  apiKey: "AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468",
  authDomain: "sprachpilot-12c68.firebaseapp.com",
  projectId: "sprachpilot-12c68",
  storageBucket: "sprachpilot-12c68.firebasestorage.app",
  messagingSenderId: "454992284519",
  appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2",
  measurementId: "G-2XXR3FSY89"
};

(function initSprachPilotFirebaseCompat(){
  window.SprachPilotFirebaseError = null;

  try {
    if (typeof firebase === "undefined") {
      throw new Error("Firebase SDK wurde nicht geladen.");
    }

    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }

    if (firebase.firestore) {
      window.db = window.db || firebase.firestore();
    }

    if (firebase.auth) {
      window.auth = window.auth || firebase.auth();
    }

    window.SprachPilotFirebaseReady = true;
    window.TeacherFirebaseReady = true;
  } catch (err) {
    window.SprachPilotFirebaseReady = false;
    window.TeacherFirebaseReady = false;
    window.SprachPilotFirebaseError = err;
    window.TeacherFirebaseError = err;
    console.error("SprachPilot Firebase konnte nicht initialisiert werden:", err);
  }
})();
