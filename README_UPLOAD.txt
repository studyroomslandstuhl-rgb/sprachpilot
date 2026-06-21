Hochladen/ersetzen im SprachPilot-Hauptordner:

index.html
style.css
js/firebase.js
js/auth.js
login/index.html
register/index.html
dashboard/index.html

Login wurde geändert:
- sucht Schüler robust über Firestore-Felder email + kurs
- ist nicht mehr abhängig von der Dokument-ID
- findet auch alte Dokumente, wenn email und kurs als Felder vorhanden sind


NEU:
- Nach Login/Registrierung geht es zurück zur Startseite.
- Dashboard ist nicht mehr nötig als Zwischenseite.
- Auf der Startseite erscheint bei eingeloggten Schülern „Profil bearbeiten“.
- Schüler können Vorname, Nachname, E-Mail und Muttersprache ändern.
- Kurscode bleibt gesperrt.
- Muttersprache wird in localStorage als motherLanguage/muttersprache aktualisiert.
