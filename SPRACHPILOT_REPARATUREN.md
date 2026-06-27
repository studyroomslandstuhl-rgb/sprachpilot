# SprachPilot Reparaturen


## Schritt 6
- Lektion 3 bekommt einen eigenen Standard-Style auf Basis von Lektion 4/Thema 2.
- Lektion 3 Hauptseite wurde auf die einheitliche Karten-/Header-Struktur umgebaut.
- Lektion 3 Thema 1 und Thema 2 Übersichten wurden auf Fortschrittskarte + Modul-Karten umgebaut.
- Emojis auf diesen Übersichtsseiten wurden entfernt/reduziert.
- Lektion 3 bleibt orange als Lektionsfarbe.

## Schritt 7 – Lektion 4 Thema 3/4 Feinreparatur

- Thema 3: Zurück-Button auf der Themenübersicht führt jetzt zur Lektion-4-Übersicht statt auf dieselbe Seite.
- Thema 3: Schriftgrößen, Abstände, Icon-Höhen, Modul-Karten und Fortschrittskarte wurden an Thema 2 angeglichen.
- Thema 3: Prüfungskarte nutzt dieselbe Sperrlogik und denselben Prüfungs-Icon-Stil wie die anderen Lektion-4-Themen.
- Thema 4: Prüfungskarte nutzt jetzt ebenfalls den gleichen Prüfungs-Icon-Stil.


## Schritt 9 – Lektion 3 Aufgaben-Seiten vereinheitlicht
- Lektion 3 Thema 1 und Thema 2 Aufgaben-Seiten nutzen jetzt Header/Navigation im SprachPilot-Standard.
- Altes SP-Buchstabenlogo wurde in den Aufgaben durch das zentrale SprachPilot-Logo ersetzt.
- Dashboard/Profil/Abmelden sind rollenrichtig in der Aufgabenleiste.
- Abschlussboxen wurden an den einheitlichen Stil angepasst.
- Fortschritte löschen ist auf den Aufgaben-Seiten verfügbar.


## Schritt 10 – 5 Aufgaben pro Reihe / Grid-Standard

- Desktop-Grid auf 5 Aufgaben-Karten pro Reihe gesetzt.
- Lektion 4 Thema 3 zeigt jetzt nicht mehr nur 4 Karten pro Reihe.
- Grid-Standard auch für Lektion 3 vorbereitet, damit die nächsten vereinheitlichten Seiten dieselbe Kartenbreite nutzen.
- Containerbreite für Lektionsseiten auf 1440 px erweitert.
- Responsive Verhalten bleibt erhalten: 4 / 3 / 2 / 1 Karten je nach Bildschirmbreite.


## Schritt 11 – Lektion 3 Aufgaben- und Übersichtsstandard

Geändert:
- Lektion 3 Thema 1 und Thema 2: alte Emoji-Aufgabennamen entfernt.
- Lektion 3 Aufgaben-Seiten: Headerbereich nicht mehr als doppelte Karte gerendert.
- Abschlussboxen: grüner Weiter-Button wie im Standard.
- L3 shared Header: Dashboard-Link ist rollenrichtig.
- L3 Themenübersichten: Fortschritte-löschen Button ergänzt.
- Kartenlayout: weiter an L4/T2 angepasst, 5 Karten pro Reihe bleibt aktiv.


## Schritt 12 – Lektion 4 finaler Designabgleich

- Lektion 4 nutzt oben jetzt das echte SprachPilot-Logo statt „SP“.
- Account-Leiste in Lektion 4 ist reduziert: Dashboard, Profil, Abmelden ohne Emoji-Überladung.
- Prüfungskachel ist in Thema 1–4 einheitlich: gleicher Stern/Icon-Stil.
- Thema 4 Hören nutzt denselben Kopfhörer-Stil wie die anderen Themen.
- Logo-CSS ist in Shared und in den Themen-Styles abgesichert, damit auch ältere Aufgabe-Seiten korrekt aussehen.


## Schritt 13 – Startseite, Schülerlogin und Schülerregistrierung finalisiert

- Aktive Login-Rolle entscheidet jetzt vor alten Profildaten: gleiche E-Mail kann Schüler und Lehrer sein.
- Schülerregistrierung setzt eindeutig `student` und löscht alte Lehrer-/Preview-Werte.
- Schülerregistrierung sucht Kurse robuster: Dokument-ID, Kurscode-Felder und alte Kursdokumente.
- Schülerprofil speichert mehrere kompatible Kursfelder (`kurs`, `kursnummer`, `courseCode`, `courseDocId`).
- Nach Schülerregistrierung geht es ausdrücklich zur Startseite, nicht zum Lehrerlogin.
- Startseite rendert rolle-zuerst: Lehrerzugang wird nicht durch altes Schülerprofil überlagert und umgekehrt.
- Account-Leiste zeigt bei Lehrerrolle korrekt Lehrer-Dashboard, bei Schülerrolle Schüler-Dashboard.
- Cache-Busting auf Start/Login/Register/Dashboard/Profile aktualisiert.


## Schritt 14 – Dashboard-/Vorschau-Schutz finalisiert

- `js/firebase-config.js` initialisiert Firebase-Compat jetzt direkt mit der Projektkonfiguration.
- Lehrer-Dashboard bekommt dadurch zuverlässig `window.auth` und `window.db`.
- `js/sp-progress-guard.js` repariert fehlende Lehrerprofil-Prüfung und entscheidet Rolle strikt nach aktiver Login-Art.
- Schüler-Dashboard lädt den Progress-Guard jetzt wirklich.
- Schüler-Dashboard löscht alte Lehrer-Vorschau, sobald aktive Rolle `student` ist.
- Lehrer-Vorschau kann nicht mehr aus einer Schüler-Session aktiviert werden.
- Modulare Firebase-Fortschrittsfunktionen in `js/progress.js` schreiben in Lehrer-Vorschau nicht mehr in Firestore.
- Lehrer-Logout löscht alte Rollen-/Preview-/Studentenreste vollständig.


## Schritt 15 – globales Designsystem vorbereitet

- Neue zentrale Datei `/shared/sprachpilot-design-system.css` erstellt.
- Neue zentrale Datei `/shared/sprachpilot-design-system.js` erstellt.
- Dokumentation `/shared/SPRACHPILOT_DESIGN_SYSTEM.md` erstellt.
- Nicht-Lektionsfarben als feste SprachPilot-Palette definiert: Babyblau, Blau, Weiß und brauner Akzent.
- Lektionsfarben als getrennte Variablen vorbereitet: Lektionen behalten eigene Farbe, Struktur bleibt gleich.
- Standardklassen für Header, Account-Leiste, Navigation, Karten, 5er-Grid, Fortschrittskarte und Buttons vorbereitet.
- Logo-Pfad zentral festgelegt: `/assets/logo/sprachpilot-logo.png`.
- Bestehende Haupt-CSS-Dateien importieren das zentrale Designsystem jetzt, ohne alte Seiten sofort komplett umzubauen.
- Nächste Migration kann Ordner für Ordner erfolgen, ohne jedes Mal neue Strukturen zu erfinden.


## Schritt 17 – Endkontrolle und kritische Restfehler

- `teacher/js/releases.js` repariert: Datei ist wieder gültiges JavaScript.
- Schüler-Registrierung gegen doppelte Profile robuster gemacht, auch wenn Kurs-Dokument-ID und Kurscode unterschiedlich sind.
- Endkontrollbericht ergänzt: `shared/SPRACHPILOT_ENDKONTROLLE.md`.


## Schritt 18 – Lehrerzugang repariert

- Lehrerlogin prüft Lehrerzugang nicht mehr nur starr über `teachers/{uid}`.
- Zugriff wird jetzt auch über E-Mail und alternative Felder gefunden.
- Unterstützt werden `teachers` und `teachers_pending`.
- Rollen wie `teacher`, `lehrer`, `lehrerin`, `admin`, `owner`, `dozent/in` werden akzeptiert.
- Alte Lehrer-Dokumente ohne `approved:true` werden nicht mehr automatisch blockiert, solange sie nicht ausdrücklich `approved:false`, `active:false` oder `status: pending` haben.
- Fehlermeldungen zeigen jetzt klarer, ob der Zugang fehlt, pending oder deaktiviert ist.
