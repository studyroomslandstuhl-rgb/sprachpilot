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


NEU – Dashboard/Auth:
- Dashboard zeigt jetzt freigeschaltete/gesperrte Module und Fortschritte.
- Der nutzlose „Zur Startseite“-Button im Dashboard ist weg.
- Oben rechts gibt es eine dünne Account-Leiste: Name/Kurs, Dashboard, Profil, Abmelden.
- Login/Registrierung benutzen redirect=...
- Wenn ein Schüler eine geschützte Seite ohne Login öffnet, soll die Seite /js/guard.js einbinden.
  Beispiel in geschützten HTML-Seiten vor eigenem App-Code:
  <div id="accountStrip" class="account-strip"></div>
  <script type="module" src="/js/guard.js"></script>
- Nach Login/Registrierung landet der Schüler wieder auf der ursprünglichen Seite.
