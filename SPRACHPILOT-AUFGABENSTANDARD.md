# SprachPilot · verbindlicher Aufgabenstandard

Diese Regeln gelten für alle bestehenden und zukünftigen SprachPilot-Lektionen. Bei Überarbeitungen sind bereits von der Lehrkraft akzeptierte Inhalte und Korrekturen maßgeblich. Alte, verworfene Inhalte dürfen nicht durch spätere Patches wieder eingeführt werden.

## 1. Die sichtbare Wortübersicht ist die einzige Wortquelle

Für jedes Thema gilt:

- Die **sichtbare Wortschatzübersicht des Themas ist die Source of Truth**.
- Karteikarten enthalten **genau die Wörter aus dieser Übersicht**: nicht mehr und nicht weniger.
- Wortschatzaufgaben wie `Bild → Wort`, `Hören → Bild`, `Hören → Schreiben`, `Bedeutung → Wort`, `Wort → Bedeutung`, Memory, Artikel-/Pluraltraining und Wortschatz-Lückentexte dürfen als Zielwörter **nur Wörter aus dieser Übersicht** verwenden.
- Antwortalternativen in Wortschatzaufgaben stammen ebenfalls aus dem Wortbestand des aktuellen Themas, sofern die Aufgabe nicht ausdrücklich grammatische Fehlformen prüft.
- Ein Wort, das aus der Übersicht entfernt wurde, darf nicht durch eine alte Datenliste, Übersetzungstabelle, Karteikartenliste oder einen späteren Patch wieder erscheinen.
- Ein Wort wird erst in Wortschatzaufgaben benutzt, wenn es in der Übersicht des Themas vorhanden ist.
- Übersicht und Karteikarten werden möglichst aus **derselben Datenquelle** erzeugt, damit sie nicht auseinanderlaufen.
- Prüfungen prüfen nur Inhalte, die im betreffenden Thema zuvor gelernt und geübt wurden.

## 2. Reihenfolge und Antwortpositionen sind immer zufällig

Für alle Lektionen und Themen gilt:

- **Alle Items einer Aufgabe werden zufällig gemischt.** Fragen, Wörter, Karten und Übungsitems dürfen nicht dauerhaft in derselben Reihenfolge erscheinen.
- Beim Start eines neuen Übungsdurchlaufs bzw. einer neuen Sitzung wird die Item-Reihenfolge neu zufällig gemischt.
- **Alle sichtbaren Antwortoptionen werden zufällig gemischt.** Das gilt für Multiple Choice, Bildauswahl, Wortauswahl und andere Auswahlformate.
- Die richtige Antwort darf keine feste Position wie immer A, immer links, immer oben oder immer erstes Bild haben.
- Bei vier Bildern werden die vier Bildpositionen ebenfalls gemischt.
- Satzbausteine, Wortbanken und andere auswählbare Elemente werden gemischt, sofern ihre Reihenfolge nicht selbst Lernziel ist.
- Die Zufallsreihenfolge bleibt während der Bearbeitung eines einzelnen Items stabil. Ein Re-Render nach einem Klick darf die Optionen nicht plötzlich an andere Positionen springen lassen.
- Randomisierung darf niemals die fachlich richtige Lösung verändern. Bei `correctIndex`/`answerIndex` muss nach dem Mischen der neue korrekte Index berechnet werden.
- Fortschritt wird anhand stabiler Item-IDs gespeichert; Randomisierung darf gespeicherten Fortschritt nicht zerstören.
- **Jedes neue Übungsitem braucht deshalb eine stabile `id`/`key`. Neue Aufgaben ohne stabile Item-Identität sind nicht standardkonform.**
- Reihenfolgen, die selbst Lernziel sind (z. B. Ablaufschritte in einer Sortieraufgabe), werden nicht als Lösungsreihenfolge zerstört; gemischt werden dort die auswählbaren Ausgangselemente.

Zentrale technische Datei:

`/js/sp-task-random-standard.js`

Sie wird global über `/js/guard.js` auf allen Wortschatzseiten unter `A*-Lektion-*/Thema-*` geladen.

## 3. Bereits akzeptierte Lehrkraft-Korrekturen haben Vorrang

- Vor einer Änderung wird der aktuelle akzeptierte Stand geprüft.
- Eine neue Korrektur darf nicht versehentlich ältere, bereits verworfene Wörter oder Aufgaben wiederherstellen.
- Wenn eine Übersicht bereits von der Lehrkraft bereinigt wurde, wird diese bereinigte Übersicht als Basis verwendet und nicht eine ältere Rohdatenliste.
- Bei Unsicherheit wird technisch die tatsächlich ausgelieferte/akzeptierte Datenquelle wiederverwendet statt eine neue Wortliste zu erfinden.

## 4. Verständnis statt Wortgleichheit

- Lese- und Hörverstehen dürfen nicht durch bloßes Finden desselben Wortes im Ausgangstext lösbar sein.
- Fragen prüfen Bedeutung, Zusammenhang oder einfache Schlussfolgerungen.
- Direkte Wort-Bild-Zuordnung ist nur dort erlaubt, wo das Lernziel ausdrücklich Wortschatzerkennung ist.

## 5. Prüfungen

- maximal 15 Items pro Themenprüfung;
- maximal 25 % Multiple Choice;
- mindestens 75 % aktive Produktion;
- nur bereits gelernte Themeninhalte;
- Item-Reihenfolge und Antwortpositionen immer gemischt;
- keine wortgleiche Abschreibprüfung;
- Prüfung ⭐ und für Lernende bis zum Abschluss der normalen Aufgaben gesperrt;
- Lehrkräfte dürfen Prüfungen jederzeit lesen und testen.

## 6. Navigation, Wiederaufnahme und Fortschritt

Für jede Themenübersicht und jede Aufgabe gilt verbindlich:

- Beim Öffnen einer Aufgabe wird automatisch zur **echten Arbeitsfläche / aktuellen Aufgabe** gescrollt.
- Nach jedem Wechsel zum nächsten Item wird wieder automatisch zur aktuellen Arbeitsfläche gescrollt.
- Die zuletzt geöffnete Aufgabe eines Themas wird pro Profil gespeichert.
- Beim Zurückkehren zur **Themenübersicht** wird automatisch zu genau dieser zuletzt bearbeiteten Aufgabe gescrollt.
- Der Nutzer soll nach einer Rückkehr nicht wieder oben auf der Seite suchen müssen, wo er zuletzt gearbeitet hat.
- Aufgaben- und Themenübersicht lesen denselben Fortschritts-State.
- Fortschrittsbalken müssen nach Rückkehr sofort den gespeicherten Stand zeigen.
- Punkte/Fortschritt werden über die vorhandene Firebase-/Dashboard-Logik synchronisiert; Inhaltsänderungen dürfen diese Logik nicht ersetzen oder umgehen.

Zentrale technische Dateien:

- `/js/sp-task-position-standard.js` – merkt sich die zuletzt bearbeitete Aufgabe und scrollt die Themenübersicht dorthin.
- `/js/sp-task-autoscroll.js` – scrollt innerhalb einer Aufgabe zur Arbeitsfläche und nach UI-/Itemwechseln erneut dorthin.
- `/js/guard.js` – lädt die globalen Randomisierungs- und Positionsstandards automatisch.

## 7. Abnahmekriterien für jede neue Aufgabe

Eine neue Aufgabe ist erst fertig, wenn:

- alle Items eine stabile Identität besitzen;
- die Item-Reihenfolge zufällig ist;
- alle sichtbaren Auswahlantworten zufällig angeordnet sind;
- richtige Antworten nach der Randomisierung weiterhin eindeutig korrekt ausgewertet werden;
- ein Re-Render die aktuelle Antwortreihenfolge nicht mitten im Item verändert;
- gespeicherter Fortschritt trotz Randomisierung korrekt wiederaufgenommen wird;
- beim Öffnen automatisch zur Arbeitsfläche gescrollt wird;
- nach dem nächsten Item erneut zur Arbeitsfläche gescrollt wird;
- beim Zurückkehren zur Themenübersicht automatisch die zuletzt bearbeitete Aufgabe ins Sichtfeld kommt;
- Firebase-/Punkte-/Prüfungslogik unverändert korrekt weiterarbeitet.

## 8. Kurzregel

> **Alle SprachPilot-Aufgaben randomisieren Items und sichtbare Antworten. Jede Aufgabe hat stabile Item-IDs. Beim Öffnen und nach jedem Itemwechsel wird automatisch zur Arbeitsfläche gescrollt. Beim Zurückkehren zur Themenübersicht wird automatisch zur zuletzt bearbeiteten Aufgabe gescrollt. Diese Regeln sind global und dürfen nicht pro Lektion neu interpretiert werden.**
