# Schritt 8 – Firebase-Verbindung Lehrer-Dashboard

Repariert:

- `js/firebase-config.js` war nur ein Platzhalter.
- `teacher/index.html` lädt genau diese Datei.
- Dadurch waren `firebase.auth()` und `firebase.firestore()` im Lehrer-Dashboard nicht verbunden.
- Jetzt enthält `js/firebase-config.js` die echte Firebase-Konfiguration und initialisiert compat Firebase.
- Das Lehrer-Dashboard kann wieder Kurse, Schüler und Fortschritt laden.

Hinweis:

- `js/firebase.js` bleibt für Modul-Seiten bestehen.
- `js/firebase-config.js` ist für Seiten mit Firebase-Compat-Skripten.
