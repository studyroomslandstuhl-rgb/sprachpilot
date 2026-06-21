window.TeacherFirebaseReady = false;
window.TeacherFirebaseError = null;

let db = null;
let auth = null;

try {
  const firebaseConfig = {
  apiKey: "AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468",
  authDomain: "sprachpilot-12c68.firebaseapp.com",
  projectId: "sprachpilot-12c68",
  storageBucket: "sprachpilot-12c68.firebasestorage.app",
  messagingSenderId: "454992284519",
  appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2",
  measurementId: "G-2XXR3FSY89"
};

  if (typeof firebase === "undefined") {
    throw new Error("Firebase SDK wurde nicht geladen.");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  db = firebase.firestore();
  auth = firebase.auth();

  window.db = db;
  window.auth = auth;
  window.TeacherFirebaseReady = true;

  console.log("Teacher Firebase verbunden");

} catch (err) {
  window.TeacherFirebaseError = err;
  console.error("Teacher Firebase Fehler:", err);
}
