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
