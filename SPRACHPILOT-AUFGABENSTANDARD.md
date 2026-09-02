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

- Wörter und Fragen einer Aufgabe erscheinen **nicht dauerhaft in derselben Reihenfolge**.
- Beim Start eines neuen Übungsdurchlaufs wird die Item-Reihenfolge zufällig gemischt.
- Multiple-Choice-, Bild- und andere Auswahlantworten werden zufällig gemischt.
- Die richtige Antwort darf keine feste Position wie immer A, immer links oder immer erstes Bild haben.
- Bei vier Bildern werden die vier Bildpositionen ebenfalls gemischt.
- Satzbausteine, Wortbanken und andere auswählbare Elemente werden gemischt, sofern ihre Reihenfolge nicht selbst Lernziel ist.
- Die Zufallsreihenfolge bleibt während der Bearbeitung eines einzelnen Items stabil. Ein Re-Render nach einem Klick darf die Optionen nicht plötzlich an andere Positionen springen lassen.
- Bei einem neuen Übungsdurchlauf bzw. einer neuen Sitzung darf eine neue Reihenfolge entstehen.
- Fortschritt wird anhand stabiler Item-IDs/Indizes gespeichert; Randomisierung darf gespeicherten Fortschritt nicht zerstören.

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
- Antwortpositionen immer gemischt;
- keine wortgleiche Abschreibprüfung;
- Prüfung ⭐ und für Lernende bis zum Abschluss der normalen Aufgaben gesperrt;
- Lehrkräfte dürfen Prüfungen jederzeit lesen und testen.

## 6. Navigation und Fortschritt

- Beim Öffnen einer Aufgabe automatisch zur echten Arbeitsfläche scrollen.
- Beim Zurückkehren zur Themenübersicht zur zuletzt bearbeiteten Aufgabe scrollen.
- Aufgaben- und Themenübersicht lesen denselben Fortschritts-State.
- Fortschrittsbalken müssen nach Rückkehr sofort den gespeicherten Stand zeigen.
- Punkte/Fortschritt werden über die vorhandene Firebase-/Dashboard-Logik synchronisiert; Inhaltsänderungen dürfen diese Logik nicht ersetzen oder umgehen.
