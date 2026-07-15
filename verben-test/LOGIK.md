# Verben Test - saubere Logik

Stand: 2026-07-15

Dieses Modul ist ein Testbereich. Es dient dazu, die Verben-Logik sauber und ohne widersprechende Wege zu pruefen, bevor etwas auf `verben-A1` uebertragen wird.

## Grundregel

Zuerst werden Verben ausgewaehlt. Erst danach kann gespielt werden.

`Ueben` darf kein Paket automatisch erzeugen. Ohne aktives Paket bleibt `Ueben` gesperrt und die Nutzerin muss zuerst `Verben waehlen` benutzen.

## Datenquelle

`index.html` laedt den bestehenden Verben-Katalog aus `verben-A1/data/...`.

`app-clean.js` baut daraus den Test-Katalog. Dabei werden Verben aus zwei Quellen zusammengefuehrt:

- `window.VERBEN_TEST_SOURCE.verbs`
- alle Verb-Schluessel aus `window.VERBEN_TEST_SOURCE.translations`

Damit werden auch Verben aufgenommen, die in den Uebersetzungsdaten vorhanden sind. Bilder werden ueber Bunny aus `verben-A1/bilder` geladen. Wenn ein Bild fehlt, erscheint im Test sichtbar `Bild fehlt`.

## Aktuelle Dateien

- `verben-test/index.html` laedt nur Daten und den Einstieg.
- `verben-test/boot.js` verbindet Auth, Kursfreigabe und Firebase und startet die App.
- `verben-test/app-clean.js` ist die einzige fachliche Logik fuer Verben Test.
- `verben-test/styles.css` ist nur Darstellung.

Die alten Testdateien wurden geloescht und duerfen nicht wieder parallel geladen werden.

## Paketregel

- Ein Paket hat maximal 20 Verben.
- Ein Paket entsteht nur durch `Verben waehlen`.
- `Ueben`, Aufgaben und Pruefung duerfen kein Paket automatisch erzeugen.
- Vorgemerkte Verben aus `Verben einschaetzen -> Lernen` stehen beim Waehlen oben.
- Ein neues Paket kommt erst, wenn das aktuelle Paket inklusive Pruefung fertig ist.
- Solange ein Paket noch nicht fertig ist, duerfen `Verben waehlen` und `Verben einschaetzen` kein neues Paket ueberschreiben.

Der Uebergang ist:

1. Teilnehmende waehlen bis zu 20 Verben.
2. Danach wird gespielt.
3. Alle Aufgaben werden 100 Prozent.
4. Die Pruefung wird freigeschaltet.
5. Die Pruefung wird mit 100 Prozent bestanden.
6. `finishPackage()` markiert diese Verben als gelernt.
7. Danach koennen neue Verben gewaehlt werden.

## Uebersichtsregel

Die Seite `Uebersicht` zeigt den ganzen Lernvorrat, nicht nur das aktive Paket.

Sie sortiert die Verben in vier Gruppen:

1. Aktuelles Paket
2. Zum Lernen vorgemerkt
3. Weitere moegliche Verben
4. Gelernt

## Einschaetzregel

`Verben einschaetzen` erzeugt kein Paket. Es sortiert nur vor.

- `Lernen` speichert das Verb in `assessment.unknown`.
- `Kann ich schon` speichert das Verb als gelernt und in `assessment.known`.
- Ein Verb darf nicht gleichzeitig in `known` und `unknown` bleiben.
- Nach dem Einschaetzen muss die Nutzerin ueber `Verben waehlen` ein Paket starten.

## Aufgabenregel

Die Aufgaben stehen in `TASKS` in `app-clean.js`.

Eine Aufgabe ist genau dann 100 Prozent, wenn alle Verben des aktiven Pakets in dieser Aufgabe erledigt sind.

Der Fortschritt wird gespeichert unter:

`activePackage.taskDone[taskId]`

## Pruefungsregel

Die Pruefung ist gesperrt, solange nicht alle Aufgaben 100 Prozent haben.

Ein Paket ist komplett fertig, wenn:

- alle Aufgaben 100 Prozent haben
- die Pruefung mindestens einmal mit 100 Prozent bestanden wurde

## Speicherregel

Es gibt zwei Speicherorte:

1. Lokal im Browser: `SP_VERBEN_TEST_CLEAN_V1_<ownerId>`
2. Firebase: Collection `progress`, Feld `verbenTestClean.state`

Speichern passiert zentral ueber:

- `save()`
- `saveRemote()`
- `loadRemote()`

Keine Aufgabe darf direkt eigene Firebase- oder LocalStorage-Wege bauen.

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
10. `Ueben` darf ohne vorherige Auswahl kein Paket erzeugen.
11. Nach jeder Aenderung `verben-test-check.yml` passend halten.

## Schutz durch GitHub Actions

`.github/workflows/verben-test-check.yml` prueft, dass die zentrale Datei existiert, keine alten Logiken geladen werden und die Choose-first-Regel vorhanden ist.

## Uebertragung auf Verben A1

Diese Testlogik darf erst auf `verben-A1` uebertragen werden, wenn sie im Testbereich stabil ist.

Vorher braucht es einen Backup- und Migrationsplan fuer echte Fortschritte und echte Punkte.
