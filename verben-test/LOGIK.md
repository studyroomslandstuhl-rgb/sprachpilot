# Verben Test - Aufgabenlogik

Stand: 2026-07-15

`verben-test` ist ein Testbereich. Hier wird die Verben-Logik stabil gemacht, bevor etwas auf echte Teilnehmende in `verben-A1` uebertragen wird.

## Analyse der SprachPilot-Muster

Die stabilen Aufgaben aus Lektion 5 und Lektion 6 folgen diesem Aufbau:

1. Eine Themen-`app.js` enthaelt Daten, Fortschrittsfunktionen, Hilfe, Header und Pruefungsfreigabe.
2. Jede Aufgabe nutzt denselben Fortschrittskern.
3. Jede Aufgabe hat aber ein eigenes Aufgabenmuster, z.B. Karteikarten, Bild-Wort, Hören-Schreiben oder Sätze bauen.
4. Falsche Antworten gehen nicht automatisch weiter.
5. Bei Fehlern bleibt die Aufgabe aktiv oder kommt spaeter erneut.
6. Hilfe ist stufig.
7. Die Pruefung bleibt gesperrt, bis alle Aufgaben 100 Prozent haben.

Dieses Muster wurde fuer `verben-test/app.js` uebernommen.

## Aktuelle Dateien

- `verben-test/index.html` laedt nur Daten, CSS und `app.js`.
- `verben-test/app.js` ist die einzige fachliche Logik.
- `verben-test/styles.css` ist nur Darstellung.
- `verben-test/LOGIK.md` dokumentiert diese Regeln.

Nicht mehr erlaubt sind parallele Zusatzwege wie `boot.js`, `app-clean.js`, `choose-filter.js`, `l6-card-pattern.js` oder eigene Fortschritts-Patches.

## Paketregel

- Erst Verben waehlen oder einschaetzen.
- `Ueben` ist ohne aktives Paket gesperrt.
- Ein Paket hat maximal 20 Verben.
- Das aktive Paket wird nicht automatisch ersetzt.
- Wenn die Pruefung mit 100 Prozent bestanden ist, werden die Verben als gelernt gespeichert und es koennen neue Verben gewaehlt werden.

## Fortschrittskern

Jede Aufgabe speichert pro Paket:

- `done`: richtig erledigte Verben
- `queue`: Verben, die noch kommen oder wegen Fehler wiederkommen
- `current`: aktuelles Verb
- `tries`: Fehlerzaehler fuer die aktuelle Frage
- `hadWrong`: ob bei diesem Verb ein Fehler passiert ist
- `pointsGiven`: ob die Punkte fuer diese Aufgabe schon vergeben wurden

Eine Aufgabe ist 100 Prozent, wenn alle Verben des Pakets in `done` stehen.

## Fehlerregel

- Bei falscher Antwort geht die Aufgabe nicht weiter.
- Bei richtiger Antwort nach einem Fehler wird das Verb nicht als erledigt gezählt, sondern wieder in die Warteschlange gelegt.
- Erst eine richtige Antwort ohne Fehler zaehlt als erledigt.

Das entspricht dem Muster aus L5/L6: Fehler fuehren zu Wiederholung, nicht zu Fortschritt.

## Hilfe-Regel

Die Hilfe steigt pro Fehler:

1. Bedeutung oder erster Tipp
2. Beispielsatz oder genauer Tipp
3. Loesung

## Aufgabenmuster

Aktuell sind eingebaut:

1. `Karteikarten`: nach L6T2, echte Flip-Karte, Rueckseite mit Verb, Hoeren-Button, Sprechen oder Schreiben.
2. `Bild -> Verb`: nach L6 Bild-Wort, Bild plus Auswahl.
3. `Verb -> Bild`: Wort plus Bild-Auswahl.
4. `Hoeren -> Schreiben`: nach L6 Hoeren-Schreiben, Deutsch hoeren und schreiben.
5. `Schreiben`: Bild, Uebersetzung, Verb schreiben.
6. `Saetze bauen`: nach L6 Saetze-bauen, Wortchips in Reihenfolge klicken.
7. `Konjugieren`: ich-Form schreiben.
8. `Pruefung`: Stern, gesperrt bis alle Aufgaben 100 Prozent haben.

## Punkte

- Runde 1: 5 Punkte pro Aufgabe bei erstem 100-Prozent-Abschluss.
- Runde 2: 10 Punkte pro Aufgabe.
- Runde 3: 15 Punkte pro Aufgabe.
- Pruefung: 100/200/300 Punkte je nach Runde bei 100 Prozent.

Im Testbereich wird das lokal gespeichert. Fuer echte TN darf diese Logik erst nach stabiler Pruefung mit Firebase-Migration uebernommen werden.

## Pruefung

Die Pruefung oeffnet nur, wenn `allTasksDone()` wahr ist.

Bei 100 Prozent:

- Paket-Verben werden in `learned` gespeichert.
- Aktives Paket wird beendet.
- Neue Verben koennen gewaehlt werden.

Bei weniger als 100 Prozent:

- Paket bleibt aktiv.
- Pruefung kann wiederholt werden.

## Aenderungsregel

Wenn spaeter etwas geaendert wird:

1. Keine zweite Aufgabenlogik laden.
2. Keine zweite Fortschrittsdatei laden.
3. Keine Pruefungsfreigabe ausserhalb von `allTasksDone()` bauen.
4. Neue Aufgaben nur ueber `TASKS`, eigenes `render...()` und den gemeinsamen Fortschrittskern ergaenzen.
5. Falsche Antwort darf nie automatisch als Fortschritt zaehlen.
6. Nach jeder Aenderung muss `.github/workflows/verben-test-check.yml` weiter gruen sein.
