let db = null;
let auth = null;

try {

  const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "sprachpilot-12c68.firebaseapp.com",
    projectId: "sprachpilot-12c68",
    storageBucket: "sprachpilot-12c68.firebasestorage.app",
    messagingSenderId: "454992284519",
    appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  db = firebase.firestore();

  if (firebase.auth) {
    auth = firebase.auth();
  }

  console.log("Firebase verbunden");

} catch (err) {

  console.error("Firebase Fehler:", err);

}
