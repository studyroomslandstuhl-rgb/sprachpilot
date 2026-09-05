# SprachPilot – verbindliche Standards für Lernaufgaben

Stand: 2026-09-05

Diese Regeln gelten für alle Lektionen und Themen und müssen bei neuen sowie überarbeiteten Aufgaben erhalten bleiben.

## 1. Themenübersicht ist die Wortschatzquelle

- Die sichtbare Wortschatzübersicht eines Themas ist die verbindliche Quelle für die in diesem Thema aktiv geübten Lernwörter.
- Karteikarten und Wortschatzaufgaben dürfen keine zusätzlichen Zielwörter einführen, die nicht in dieser Übersicht stehen.
- Antwort-Distraktoren in Wortschatzaufgaben sollen ebenfalls aus der vorhandenen Themenübersicht kommen.
- Grammatik-, Lese-, Hör- und Schreibkontexte dürfen natürlich notwendige bekannte A1-Funktionswörter enthalten; sie dürfen aber nicht unbemerkt neue Wörter als zu lernenden Wortschatz behandeln.
- Wenn die Übersicht geändert wird, müssen die dazugehörigen Wortschatzübungen dieselbe Quelle verwenden statt eine unabhängige zweite Wortliste zu pflegen.

## 2. Zufällige Reihenfolge

- Wörter, Karten, Fragen und einzelne Übungsitems werden bei einem neuen Durchlauf bzw. Seitenaufruf in zufälliger Reihenfolge präsentiert, soweit die Aufgabe keine didaktisch notwendige feste Reihenfolge hat.
- A/B/C- und andere Auswahlantworten werden ebenfalls zufällig angeordnet.
- Die richtige Antwort darf nicht dauerhaft an derselben Position stehen.
- Die Mischung bleibt innerhalb derselben gerade bearbeiteten Frage stabil, damit eine falsche Antwort nicht durch plötzlich springende Optionen erschwert wird.
- Aufgaben mit notwendiger innerer Reihenfolge, z. B. zusammenhängende Dialogzeilen oder Textabschnitte, behalten ihre innere Struktur; die dazugehörigen Antwortoptionen werden trotzdem gemischt, soweit sinnvoll.

## 3. Fortschritt und Bewertung

- Zufallsmischung darf weder stabile Task-IDs noch gespeicherte Fortschritte, Wiederholungslogik, Punkte oder Prüfungssperren verändern.
- Prüfungen bleiben nach den jeweils geltenden Freischaltregeln für Teilnehmer gesperrt und werden nicht durch Randomisierung umgangen.
- Lehrkräfte dürfen Prüfungen unabhängig vom Teilnehmerfortschritt vollständig lesen und testen.
- Lehrkraft-Tests dürfen keine Teilnehmerpunkte, Teilnehmerfortschritte oder Teilnehmer-Prüfungsergebnisse verändern.

## 4. Verbindliche Lehrkraft-Prüfungsansicht

Jede Prüfung in jeder Lektion und jedem Thema muss automatisch die zentrale Lehrkraft-Prüfungsansicht unterstützen.

Verbindliche Detailregel:

`docs/PRUEFUNGS-LEHRERANSICHT-STANDARD.md`

Referenz:

`A1 Lektion 8 · Thema 3 · task.html?task=pruefung-l8t3-inhalte-v3&teacherExamRead=1`

Pflicht für jede neue Prüfung:

- als Prüfung im Theme-Datensatz eindeutig markiert
- alle Prüfungsfragen strukturiert gespeichert
- Soll-Lösungen direkt im selben Datensatz gespeichert
- Lehrkraft sieht alle Fragen und Lösungen auf einer Seite
- Lehrkraft kann die Prüfung über `Prüfung testen` vollständig bearbeiten
- keine zweite, abweichende Lehrer-Datenkopie
- keine lokale Sonderimplementierung der Lehreransicht
- Teilnehmerdaten bleiben beim Lesen und Testen unverändert

Die zentrale Umsetzung erfolgt über:

- `/js/sp-teacher-exam-reader.js`
- `/js/sp-teacher-unlocked.js`
- automatisches Laden über `/js/session-restore.js`

## Lektion 8

Für Lektion 8, Thema 1–4, werden die allgemeinen Lernaufgabenregeln über die gemeinsamen Schutz- und Randomisierungsschichten umgesetzt. Thema 4 stellt zusätzlich den vor den späteren Umbauten akzeptierten Wortschatz-Snapshot wieder her und verwendet diesen als Quelle der Übersicht und Wortschatzübungen. Die bestehende Lehrkraft-Prüfungsansicht von L8T3 ist die verbindliche Referenz für alle Prüfungen.