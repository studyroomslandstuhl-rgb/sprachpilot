# SprachPilot Verben A1 – Lehrer-ready Struktur

## Wichtigste Idee

Die Schülerseite lädt nicht mehr automatisch alle Verben.
Sie lädt zuerst die Lehrer-Zuweisung aus Firebase:

```text
verbAssignments/{kurs}
```

Beispiel-Dokument:

```js
{
  assignmentId: "kurs-123-a1-start",
  title: "A1 Startpaket",
  activeSetIds: ["a1-standard-start"],
  activeVerbs: ["lieben", "kaufen", "verstehen"],
  enabledTasks: ["flashcards", "memory", "writeVerb"],
  notifyNewVerbs: true
}
```

## Neue Verben freischalten

Der Lehrer ergänzt in `activeVerbs` neue Verben, z. B. 5 weitere.
Beim nächsten Öffnen erkennt die Schülerseite:

```text
Diese Verben waren vorher nicht in seenAssignedVerbs.
```

Dann erscheint:

```text
Sie haben neue Verben zu üben.
```

## Warum diese Struktur sicherer ist

- `index.html` enthält keine Aufgabenlogik mehr.
- Firebase liegt nur in `js/firebase.js`.
- Fortschritt liegt nur in `js/progress.js`.
- Lehrer-Auswahl liegt nur in `js/teacherConfig.js`.
- Jede Aufgabe hat eine eigene Datei in `js/tasks/`.

So kann man später neue Aufgaben oder neue Verben ergänzen, ohne alles kaputt zu machen.
