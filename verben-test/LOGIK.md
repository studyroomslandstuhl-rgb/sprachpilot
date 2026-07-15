# Verben Test - saubere Logik

Stand: 2026-07-15

Dieses Modul ist ein Testbereich. Es dient dazu, die Verben-Logik sauber und ohne widersprechende Wege zu pruefen, bevor etwas auf `verben-A1` uebertragen wird.

## Ziel

`verben-test` darf nur eine fachliche Logik haben:

- ein Einstieg
- eine zentrale Code-Datei
- ein Speicherformat
- eine Regel fuer Aufgabenfortschritt
- eine Regel fuer Pruefungsfreigabe
- eine Regel fuer gelernte Verben und neue Pakete
- eine Regel fuer den Uebergang von einem 20er-Paket zum naechsten

Damit sollen keine alten Dateien mehr gleichzeitig Fortschritt, Punkte, Pakete oder Pruefungen berechnen.

## Aktuelle Dateien

Diese Dateien gehoeren zum Testmodul:

- `verben-test/index.html` laedt nur Daten und den Einstieg.
- `verben-test/boot.js` verbindet Auth, Kursfreigabe und Firebase und startet die App.
- `verben-test/app-clean.js` ist die einzige fachliche Logik fuer Verben Test.
- `verben-test/styles.css` ist nur Darstellung.

Die alten Testdateien wurden geloescht und duerfen nicht wieder parallel geladen werden:

- `core.js`
- `views.js`
- `tasks.js`
- `storage.js`
- `scoring.js`
- `images.js`
- `integrity.js`
- `integrity-start.js`
- `task-context.js`

## Datenquelle

`index.html` laedt nur den bestehenden Verben-Katalog aus `verben-A1/data/...`.

Wichtig: Das Testmodul nutzt die Verben-A1-Daten, aber nicht die alte Verben-A1-Status-, Punkte- oder Paketlogik.

Die Daten werden in `window.VERBEN_TEST_SOURCE` gesammelt:

- Verben
- Uebersetzungen
- Beispielsaetze
- Sonderformen

## Zentrale Logikdatei

Alle Regeln liegen in:

`verben-test/app-clean.js`

Diese Datei entscheidet allein ueber:

- Paketgroesse
- Aufgabenliste
- Aufgabe fertig oder nicht fertig
- Testpunkte
- Pruefung gesperrt oder offen
- Pruefung bestanden
- Verben gelernt
- neues Paket
- lokales Speichern
- Firebase-Speichern
- Uebersicht, Verben waehlen und Verben einschaetzen

Wenn spaeter etwas an Verben Test geaendert wird, zuerst diese Datei pruefen. Keine zweite Datei fuer dieselbe Entscheidung anlegen.

## Uebersichtsregel

Die Seite `Uebersicht` zeigt den ganzen Lernvorrat, nicht nur das aktive Paket.

Sie sortiert die Verben in vier Gruppen:

1. Aktuelles Paket
2. Zum Lernen vorgemerkt
3. Weitere moegliche Verben
4. Gelernt

Die Uebersicht nutzt dieselben Daten wie `Ueben`, `Verben einschaetzen` und `Verben waehlen`.

Wichtig: Es darf keine zweite Uebersichtsliste geben, die anders zaehlt als die Paketlogik.

## Paketregel

- Ein Paket hat maximal 20 Verben.
- Wenn kein Paket aktiv ist, startet `Ueben` automatisch ein neues Paket aus verfuegbaren Verben.
- Vorgemerkte Verben aus `Verben einschaetzen -> Lernen` stehen beim naechsten Paket zuerst.
- Verben, die bereits gelernt sind, werden nicht noch einmal automatisch in ein neues Paket gelegt.
- Ein neues Paket kommt erst, wenn das aktuelle Paket inklusive Pruefung fertig ist.
- Solange ein Paket noch nicht fertig ist, duerfen `Verben waehlen` und `Verben einschaetzen` kein neues Paket ueberschreiben.

Der Uebergang ist:

1. Teilnehmende lernen Paket 1 mit bis zu 20 Verben.
2. Alle Aufgaben werden 100 Prozent.
3. Die Pruefung wird freigeschaltet.
4. Die Pruefung wird mit 100 Prozent bestanden.
5. `finishPackage()` markiert diese Verben als gelernt.
6. Danach kann Paket 2 gewaehlt, eingeschaetzt oder automatisch mit `Ueben` gestartet werden.

## Einschaetzregel

`Verben einschaetzen` nutzt eine eigene Liste:

`assessableVerbs()`

Dort erscheinen nur Verben, die noch nicht:

- gelernt sind
- im aktuellen Paket sind
- schon als `Kann ich schon` markiert wurden
- schon als `Lernen` vorgemerkt wurden

Wenn ein Verb als `Lernen` markiert wird, wird es in `assessment.unknown` gespeichert und verschwindet aus der Einschaetzkarte. Es steht danach in der Uebersicht unter `Zum Lernen vorgemerkt` und wird beim naechsten Paket bevorzugt.

Wenn ein Verb als `Kann ich schon` markiert wird, wird es als gelernt behandelt und nicht mehr automatisch vorgeschlagen.

## Aufgabenregel

Die Aufgaben stehen in `TASKS` in `app-clean.js`.

Aktuell gibt es 10 Aufgaben:

1. Karteikarten
2. Memory
3. Bild -> Verb
4. Verb -> Bild
5. Schreiben
6. Hoeren -> Schreiben
7. Hoeren -> Sprechen
8. Bild -> Sprechen
9. Satz-Puzzle
10. Konjugieren

Eine Aufgabe ist genau dann 100 Prozent, wenn alle Verben des aktiven Pakets in dieser Aufgabe erledigt sind.

Der Fortschritt einer Aufgabe wird gespeichert unter:

`activePackage.taskDone[taskId]`

Dort steht eine Liste der Verben, die in dieser Aufgabe erledigt wurden.

## Punkte im Testbereich

Im Testbereich werden nur Testpunkte im Testzustand gespeichert.

- Erste fertige Aufgabe: 5 Testpunkte
- Pruefung mit 100 Prozent: 100 Testpunkte im Testpaket

Wichtig: Diese Testpunkte sind nicht das echte Schueler-Punktesystem von Verben A1. Erst wenn die Logik stabil ist, darf entschieden werden, wie sie sauber in das echte Punktesystem uebertragen wird.

## Pruefungsregel

Die Pruefung ist gesperrt, solange nicht alle Aufgaben 100 Prozent haben.

Die Pruefung ist offen, wenn:

`allTasksDone() === true`

Ein Paket ist komplett fertig, wenn:

- alle Aufgaben 100 Prozent haben
- die Pruefung mindestens einmal mit 100 Prozent bestanden wurde

Erst dann werden die Verben als gelernt markiert und ein neues Paket kann kommen.

## Speicherregel

Es gibt zwei Speicherorte:

1. Lokal im Browser: `SP_VERBEN_TEST_CLEAN_V1_<ownerId>`
2. Firebase: Collection `progress`, Feld `verbenTestClean.state`

`ownerId` wird aus Teilnehmerdaten gebildet, damit der Fortschritt zu Person und Kurs passt.

Speichern passiert zentral ueber:

- `save()`
- `saveRemote()`
- `loadRemote()`

Keine Aufgabe darf direkt eigene Firebase- oder LocalStorage-Wege bauen.

## Firebase-Regel

`boot.js` verbindet die Projekt-Firebase mit dem Testmodul.

`app-clean.js` benutzt nur diese vorbereitete Verbindung und speichert unter `verbenTestClean`.

Wichtig: Keine echte Verben-A1-Fortschrittsstruktur wird im Testmodul ueberschrieben.

## Freigaberegel

Das Modul ist offen, wenn eine dieser Bedingungen gilt:

- `Verben Test` ist fuer den Kurs freigegeben
- `Verben A1` ist fuer den Kurs freigegeben
- die aktive Rolle ist Lehrkraft

Diese Entscheidung liegt in `moduleIsOpen()`.

## Fehlerregel bei Aufgaben

Wenn eine Antwort falsch ist:

- die Aufgabe geht nicht automatisch weiter
- das Verb wird nicht als erledigt gespeichert
- es erscheint eine Hilfe
- der Teilnehmende muss erneut antworten

Richtig wird nur gespeichert, wenn die Antwort zur erwarteten Loesung passt.

## Bildregel

Bilder werden aus Bunny geladen:

`https://sprachpilot.b-cdn.net/verben-A1/bilder/<datei>.webp`

Spezielle Bildnamen stehen in `SPECIAL_IMAGES` in `app-clean.js`.

Wenn ein Bild fehlt, wird im Test sichtbar `Bild fehlt` angezeigt. Das ist Absicht, damit fehlende Bildverlinkungen auffallen.

## Aenderungsregel fuer spaeter

Wenn dieses Modul geaendert wird:

1. Keine zweite Speicherdatei erstellen.
2. Keine zweite Punkteberechnung erstellen.
3. Keine zweite Pruefungsfreigabe erstellen.
4. Keine alten Testdateien wieder in `boot.js` laden.
5. Neue Aufgaben nur in `TASKS` und in `taskBody()`/`bindTask()` ergaenzen.
6. Fortschritt nur ueber `markTaskDone()` speichern.
7. Pruefung nur ueber `examUnlocked()`, `renderExam()` und `finishExam()` steuern.
8. Paketabschluss nur ueber `finishPackage()` machen.
9. Firebase nur ueber `saveRemote()` und `loadRemote()` nutzen.
10. Uebersicht, Waehlen und Einschaetzen muessen dieselbe Verben-Sortierung nutzen.
11. Nach jeder Aenderung `verben-test-check.yml` passend halten.

## Schutz durch GitHub Actions

Die Datei `.github/workflows/verben-test-check.yml` prueft:

- `app-clean.js` existiert
- `boot.js` laedt `app-clean.js`
- die alten Verben-Test-Dateien werden nicht mehr erwartet
- wichtige Regeln wie Paketgroesse, Firebase-Schluessel und Pruefungslogik sind vorhanden
- die Uebergangsfunktionen `plannedVerbs` und `assessableVerbs` vorhanden sind

Wenn spaeter wieder eine parallele Logik entsteht, soll der Testlauf sichtbar warnen.

## Uebertragung auf Verben A1

Diese Testlogik darf erst auf `verben-A1` uebertragen werden, wenn sie im Testbereich stabil ist.

Beim Uebertragen muss vorher dokumentiert werden:

- welche bestehenden Verben-A1-Dateien ersetzt werden
- welche alten Speicherwege geloescht werden
- wie alte echte Fortschritte migriert werden
- wie echte Punkte sicher erhalten bleiben
- wie betroffene Teilnehmerdaten gesichert werden

Keine direkte Uebertragung ohne Backup- und Migrationsplan.
