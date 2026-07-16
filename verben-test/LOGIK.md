# Verben Test - Aufgabenlogik

Stand: 2026-07-16

`verben-test` ist ein Testbereich. Hier wird die Verben-Logik stabil gemacht, bevor etwas auf echte Teilnehmende in `verben-A1` übertragen wird.

## Ziel

Der Testbereich soll sich fachlich wie `verben-A1` verhalten, aber ohne die alten widersprüchlichen Zusatzwege, ohne doppelte Fortschrittslogik und ohne Fortschritt über 100%.

## Analyse der SprachPilot-Muster

Die stabilen Aufgaben aus Verben A1 sowie Lektion 5 und Lektion 6 folgen diesem Aufbau:

1. Es gibt einen gemeinsamen Fortschrittskern.
2. Jede Aufgabe nutzt diesen Kern.
3. Jede Aufgabe hat trotzdem ein eigenes Aufgabenmuster, z.B. Karteikarten, Bild-Wort, Hören-Schreiben oder Sätze bauen.
4. Falsche Antworten gehen nicht automatisch weiter.
5. Bei Fehlern bleibt die Aufgabe aktiv oder kommt später erneut.
6. Hilfe ist stufig.
7. Die Prüfung bleibt gesperrt, bis alle Aufgaben 100 Prozent haben.

Dieses Muster gilt jetzt für `verben-test/app.js`.

## Aktuelle Dateien

- `verben-test/index.html` lädt nur Daten, CSS und `app.js`.
- `verben-test/app.js` ist die einzige fachliche Logik.
- `verben-test/styles.css` ist nur Darstellung.
- `verben-test/LOGIK.md` dokumentiert diese Regeln.

Nicht mehr erlaubt sind parallele Zusatzwege wie `boot.js`, `app-clean.js`, `choose-filter.js`, `l6-card-pattern.js` oder eigene Fortschritts-Patches.

## Einschätzung wie bei Verben A1

Die Einschätzung funktioniert wie bei `verben-A1/tasks/assessment.js`:

1. Die Teilnehmerin sieht Muttersprache/Übersetzung und Bild.
2. Sie muss das deutsche Verb schreiben.
3. Schnell und richtig unter 7 Sekunden, ohne Lösung und ohne Fehler: `ich kann`.
4. Richtig, aber langsam oder nach Fehler: `unsicher`.
5. Lösung zeigen oder `Ich weiß es nicht`: `ich kann nicht`.
6. `unsicher` und `ich kann nicht` werden zum aktiven Übungspaket.
7. Wenn genug Übungsverben gesammelt sind, startet die Aufgabenübersicht.
8. Wenn bereits ein aktives Paket da ist, wird keine neue Einschätzung darübergelegt; dann soll direkt geübt werden.

## Paketregel

- Erst Verben wählen oder einschätzen.
- `Üben` ist ohne aktives Paket gesperrt.
- Ein Paket hat maximal 20 Verben.
- Das aktive Paket wird nicht automatisch ersetzt.
- Wenn die Prüfung mit 100 Prozent bestanden ist, werden die Verben als gelernt gespeichert und es können neue Verben gewählt oder eingeschätzt werden.

## Fortschrittskern

Jede Aufgabe speichert pro Paket:

- `done`: richtig erledigte Verben
- `queue`: Verben, die noch kommen oder wegen Fehler wiederkommen
- `current`: aktuelles Verb
- `tries`: Fehlerzähler für die aktuelle Frage
- `hadWrong`: ob bei diesem Verb ein Fehler passiert ist
- `pointsGiven`: ob die Punkte für diese Aufgabe schon vergeben wurden

Eine Aufgabe ist 100 Prozent, wenn alle Verben des Pakets in `done` stehen.

## Fehlerregel

- Bei falscher Antwort geht die Aufgabe nicht weiter.
- Bei richtiger Antwort nach einem Fehler wird das Verb nicht als erledigt gezählt, sondern wieder in die Warteschlange gelegt.
- Erst eine richtige Antwort ohne Fehler zählt als erledigt.

Das entspricht dem Muster aus L5/L6 und Verben A1: Fehler führen zu Wiederholung, nicht zu Fortschritt.

## Hilfe-Regel

Die Hilfe steigt pro Fehler:

1. Bedeutung oder erster Tipp
2. Beispielsatz oder genauer Tipp
3. Lösung

## Aufgabenmuster

Aktuell sind eingebaut:

1. `Karteikarten`: nach L6T2, echte Flip-Karte, Rückseite mit Verb, Hören-Button, Sprechen oder Schreiben.
2. `Bild → Verb`: Bild plus Auswahl.
3. `Verb → Bild`: Wort plus Bild-Auswahl.
4. `Hören → Schreiben`: Deutsch hören und schreiben.
5. `Schreiben`: Bild, Übersetzung, Verb schreiben.
6. `Sätze bauen`: Wortchips in Reihenfolge klicken.
7. `Konjugieren`: ich-Form schreiben.
8. `Prüfung`: Stern, gesperrt bis alle Aufgaben 100 Prozent haben.

## Punkte

- Runde 1: 5 Punkte pro Aufgabe bei erstem 100-Prozent-Abschluss.
- Runde 2: 10 Punkte pro Aufgabe.
- Runde 3: 15 Punkte pro Aufgabe.
- Prüfung: 100/200/300 Punkte je nach Runde bei 100 Prozent.

Im Testbereich wird das lokal gespeichert. Für echte TN darf diese Logik erst nach stabiler Prüfung mit Firebase-Migration übernommen werden.

## Prüfung

Die Prüfung öffnet nur, wenn `allTasksDone()` wahr ist.

Bei 100 Prozent:

- Paket-Verben werden in `learned` und `known` gespeichert.
- Aktives Paket wird beendet.
- Neue Verben können gewählt oder eingeschätzt werden.

Bei weniger als 100 Prozent:

- Paket bleibt aktiv.
- Prüfung kann wiederholt werden.

## Änderungsregel

Wenn später etwas geändert wird:

1. Keine zweite Aufgabenlogik laden.
2. Keine zweite Fortschrittsdatei laden.
3. Keine Prüfungsfreigabe außerhalb von `allTasksDone()` bauen.
4. Neue Aufgaben nur über `TASKS`, eigenes `render...()` und den gemeinsamen Fortschrittskern ergänzen.
5. Falsche Antwort darf nie automatisch als Fortschritt zählen.
6. Einschätzung muss weiter wie Verben A1 funktionieren.
7. Nach jeder Änderung muss `.github/workflows/verben-test-check.yml` weiter grün sein.
