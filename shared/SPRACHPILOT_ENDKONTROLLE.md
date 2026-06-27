# SprachPilot – Schritt 17 Endkontrolle

## Was in Schritt 17 repariert wurde

1. `teacher/js/releases.js` war keine gültige JavaScript-Datei, sondern enthielt HTML.  
   Das ist jetzt ein harmloser Kompatibilitäts-Bridge zu `teacher/releases.js`.

2. Schüler-Registrierung prüft doppelte Schülerprofile jetzt robuster.  
   Wichtig bei Kursen, bei denen Firebase-Dokument-ID und sichtbarer Kurscode unterschiedlich sind.

## Technische Prüfung

- JavaScript-Syntaxprüfung: OK – keine Syntaxfehler gefunden.
- Lokale Link-/Dateiprüfung: 7 offene Hinweise gefunden.

### Link-/Dateihinweise

- `verben-A1/index.html` → `src="bilder/"` → Ziel nicht gefunden: `verben-A1/bilder`
- `wortschatz/index.html` → `href="./A2-Lektion-1/"` → Ziel nicht gefunden: `wortschatz/A2-Lektion-1`
- `wortschatz/index.html` → `href="./A2-Lektion-3/"` → Ziel nicht gefunden: `wortschatz/A2-Lektion-3`
- `wortschatz/index.html` → `href="./A2-Lektion-4/"` → Ziel nicht gefunden: `wortschatz/A2-Lektion-4`
- `wortschatz/index.html` → `href="./B1-Lektion-1/"` → Ziel nicht gefunden: `wortschatz/B1-Lektion-1`
- `wortschatz/index.html` → `href="./B1-Lektion-3/"` → Ziel nicht gefunden: `wortschatz/B1-Lektion-3`
- `wortschatz/index.html` → `href="./B1-Lektion-4/"` → Ziel nicht gefunden: `wortschatz/B1-Lektion-4`

## Nächste sinnvolle Schritte

1. Offene Link-Hinweise prüfen und entscheiden, ob es echte Fehler oder geplante/gesperrte Inhalte sind.
2. Danach eine Konsolidierungs-ZIP erstellen, damit du nicht 17 Einzelpatches nacheinander hochladen musst.
3. Danach einzelne UI-Probleme aus echtem Testen reparieren: Kurse sichtbar, Registrierung, Schüler-Dashboard, Freigaben.
