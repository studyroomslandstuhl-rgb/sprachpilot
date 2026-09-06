# SprachPilot · verbindlicher Aufgabenstandard

Diese Regeln gelten für alle bestehenden und zukünftigen SprachPilot-Lektionen. Bei Überarbeitungen sind bereits von der Lehrkraft akzeptierte Inhalte und Korrekturen maßgeblich. Alte, verworfene Inhalte dürfen nicht durch spätere Patches wieder eingeführt werden.

## 1. Die sichtbare Wortübersicht ist die einzige Wortquelle

- Die sichtbare Wortschatzübersicht des Themas ist die Source of Truth.
- Karteikarten enthalten genau die Wörter aus dieser Übersicht: nicht mehr und nicht weniger.
- Wortschatzaufgaben wie Bild → Wort, Hören → Bild, Hören → Schreiben, Bedeutung → Wort, Wort → Bedeutung, Memory, Artikel-/Pluraltraining und Wortschatz-Lückentexte dürfen als Zielwörter nur Wörter aus dieser Übersicht verwenden.
- Antwortalternativen stammen ebenfalls aus dem Wortbestand des aktuellen Themas, sofern nicht ausdrücklich grammatische Fehlformen geprüft werden.
- Ein entferntes Wort darf nicht über alte Datenlisten oder spätere Patches wieder erscheinen.
- Prüfungen prüfen nur Inhalte, die im betreffenden Thema zuvor gelernt und geübt wurden.

## 2. Reihenfolge und Antwortpositionen sind immer zufällig

- Alle Items einer Aufgabe werden zufällig gemischt, sofern die Lehrkraft nicht ausdrücklich eine didaktisch feste Reihenfolge verlangt.
- Beim Start eines neuen Übungsdurchlaufs bzw. einer neuen Sitzung wird neu gemischt.
- Alle sichtbaren Antwortoptionen werden zufällig gemischt.
- Die richtige Antwort darf keine feste Position haben.
- Bei vier Bildern werden auch die vier Bildpositionen gemischt.
- Wortbanken und auswählbare Elemente werden gemischt, sofern ihre Reihenfolge nicht selbst Lernziel ist.
- Die Zufallsreihenfolge bleibt innerhalb eines einzelnen Items stabil.
- Fortschritt wird anhand stabiler Item-IDs gespeichert.

Zentrale technische Datei: `/js/sp-task-random-standard.js`

## 3. Bereits akzeptierte Lehrkraft-Korrekturen haben Vorrang

- Vor einer Änderung wird der aktuelle akzeptierte Stand geprüft.
- Neue Korrekturen dürfen keine alten, bereits verworfenen Inhalte wiederherstellen.
- Bei Unsicherheit wird die tatsächlich ausgelieferte und akzeptierte Datenquelle wiederverwendet.

## 4. Verständnis statt Wortgleichheit

- Lese- und Hörverstehen dürfen nicht durch bloßes Finden desselben Wortes im Ausgangstext lösbar sein.
- Fragen prüfen Bedeutung, Zusammenhang oder einfache Schlussfolgerungen.
- Direkte Wort-Bild-Zuordnung ist nur dort erlaubt, wo Wortschatzerkennung ausdrücklich Lernziel ist.

## 5. Prüfungen

- maximal 15 Items pro Themenprüfung;
- maximal 25 % Multiple Choice;
- mindestens 75 % aktive Produktion;
- nur bereits gelernte Themeninhalte;
- Item-Reihenfolge und Antwortpositionen immer gemischt;
- Prüfung ⭐ und für Lernende bis zum Abschluss der normalen Aufgaben gesperrt;
- Lehrkräfte dürfen Prüfungen jederzeit direkt öffnen, lesen und testen, auch wenn die Teilnehmer-Aufgaben noch nicht abgeschlossen sind.

## 6. Navigation, Wiederaufnahme und Fortschritt

- Beim Öffnen einer Aufgabe wird genau einmal zur echten Arbeitsfläche gescrollt.
- Nach einem echten Wechsel zum nächsten Item darf genau einmal wieder zur neuen Arbeitsfläche gescrollt werden.
- **Innerhalb einer Aufgabe darf es technisch nur einen einzigen Auto-Scroll-Verantwortlichen geben: `/js/sp-task-autoscroll.js`.** Andere Runtime-, Fortschritts-, Positions-, Header- oder Inhaltsdateien dürfen keine eigenen `scrollIntoView`, `scrollTo`, `scrollBy`, MutationObserver-Scrolls oder wiederholten Scroll-Timer ausführen.
- `/js/sp-task-position-standard.js` merkt auf Aufgabenseiten ausschließlich die zuletzt bearbeitete Aufgabe. Es scrollt dort nicht. Sein Scroll-Verhalten ist nur für die Themenübersicht zuständig.
- `/js/sp-task-runtime-standard.js` ist für Fortschritt/Punkte zuständig und darf nicht eigenständig scrollen.
- Automatisches Scrollen darf niemals durch MutationObserver, Klick-Schleifen, Fokus-Schleifen oder wiederholte Timer gegen das manuelle Scrollen des Nutzers arbeiten.
- Sobald der Nutzer selbst wischt, scrollt, das Mausrad benutzt oder die Seite berührt, wird ein noch ausstehender automatischer Scrollvorgang abgebrochen. Ein nachfolgender normaler Itemwechsel darf den Nutzer nicht sofort gegen seine aktive Wischbewegung zurückziehen.
- Automatischer Fokus auf Eingabefelder darf auf Mobilgeräten keinen Scrollsprung auslösen. Bei Fokus ist `preventScroll` zu verwenden; ein automatischer Fokus direkt nach Rendern ist auf Touch-Geräten zu vermeiden.
- Die zuletzt geöffnete Aufgabe eines Themas wird pro Profil gespeichert.
- Beim Zurückkehren zur Themenübersicht wird automatisch zu genau dieser zuletzt bearbeiteten Aufgabe gescrollt.
- Aufgaben- und Themenübersicht lesen denselben Fortschritts-State.
- Punkte/Fortschritt werden über die vorhandene Firebase-/Dashboard-Logik synchronisiert.

Zentrale technische Dateien:
- `/js/sp-task-position-standard.js`
- `/js/sp-task-autoscroll.js`
- `/js/sp-task-runtime-standard.js`
- `/js/guard.js`

## 7. Bilder und mobile Darstellung

- Niemals sichtbare Bild-Fallback-Emojis, Rahmenbild-Symbole oder Platzhalter wie `🖼️` unter oder neben einem Bild anzeigen.
- Wenn ein Bild nicht geladen werden kann, wird das fehlerhafte Bild still ausgeblendet; es erscheint kein Ersatz-Emoji.
- Bildauswahl mit vier Optionen wird auf Mobilgeräten grundsätzlich als kompakte 2×2-Matrix dargestellt.
- Die Bilder dürfen auf dem Handy nicht unnötig groß werden; die gesamte Auswahl soll möglichst ohne langes Scrollen erfassbar sein.
- Auch auf sehr schmalen Displays darf eine Vierer-Bildauswahl nicht automatisch in eine lange Einspaltenliste zerfallen.
- Bilder verwenden `object-fit: contain`, damit das gesamte Motiv sichtbar bleibt.
- Kleine Hinweisbilder direkt neben einer Lücke bleiben klein und verdrängen den Text nicht.

## 8. Abnahmekriterien für jede neue Aufgabe

Eine neue Aufgabe ist erst fertig, wenn:
- alle Items eine stabile Identität besitzen;
- Item- und Antwortreihenfolge korrekt randomisiert werden;
- richtige Antworten nach Randomisierung eindeutig ausgewertet werden;
- ein Re-Render die aktuelle Antwortreihenfolge nicht mitten im Item verändert;
- gespeicherter Fortschritt korrekt wiederaufgenommen wird;
- die Seite beim Scrollen nicht wackelt und nicht gegen den Nutzer zurückscrollt;
- technisch nur ein einziges System das Scrollen innerhalb der Aufgabe steuert;
- die mobile Bilddarstellung kompakt ist und keine Fallback-Emojis zeigt;
- Lehrer die Prüfung unabhängig vom Teilnehmerfortschritt öffnen können;
- Firebase-/Punkte-/Prüfungslogik korrekt weiterarbeitet.

## 9. Kurzregel

> Alle SprachPilot-Aufgaben randomisieren Items und sichtbare Antworten, sofern keine ausdrücklich feste didaktische Reihenfolge verlangt wird. Jede Aufgabe hat stabile Item-IDs. Innerhalb einer Aufgabe darf ausschließlich `sp-task-autoscroll.js` automatisch scrollen; Positions- und Runtime-Dateien dürfen dort nicht zusätzlich scrollen. Auto-Scroll ist ein einmaliger, ruhiger Sprung beim Öffnen bzw. echten Itemwechsel und darf niemals gegen manuelles Scrollen arbeiten. Vier Bildoptionen erscheinen mobil als 2×2-Matrix. Sichtbare Bild-Fallback-Emojis sind verboten. Lehrkräfte können Prüfungen jederzeit öffnen.
