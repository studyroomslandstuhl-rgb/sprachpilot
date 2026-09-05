# SprachPilot Karteikarten-Standard V1

## Verbindliche Referenz

Die Aufgabe `Karteikarten` in:

`/wortschatz/A1-Lektion-8/Thema-1/task.html?task=karteikarten`

ist die verbindliche visuelle und funktionale Referenz.

Zentrale Standarddatei:

`/js/sp-karteikarten-standard-v1.js`

## Grundregel

Bei neuen Aufgaben vom Typ **Karteikarten** dürfen nur zwei Dinge geändert werden:

1. **Farbe** des jeweiligen Lektion-/Thema-Designs
2. **Inhalt** der Karten

Alles andere bleibt identisch zur Referenz.

## Unveränderlich

- Seitenbreite und Abstände
- Aufgaben-Kopf mit Aufgabennummer, Titel, kurzer Anweisung und Fortschrittsanzeige
- Kartenposition und Kartengröße
- Flip-Animation und Bedienung per Klick, Enter und Leertaste
- Vorderseite: quadratisches 300×300-Bild, darunter Übersetzung in der Muttersprache
- Rückseite: kleines Bild, deutsches Wort, Übersetzung, Plural/Beispiel und Audio
- Bilddarstellung mit `object-fit: contain`
- Button-Reihenfolge und Beschriftung: `🎤 Sprechen`, `✍️ Schreiben`, `🔊 Anhören`
- Schreibfeld und Prüfen-Logik
- Spracherkennung auf Deutsch
- Audio-Wiedergabe mit Bunny-Audio und TTS-Fallback
- 3-stufige Fehlerhilfe
- falsch beantwortete/umgedrehte Karten werden zur Wiederholung vorgemerkt
- Karte gilt erst nach korrekter eigener Antwort als abgeschlossen
- Fortschrittsanzeige und Abschluss-Screen
- responsive Darstellung auf Mobilgeräten
- Bunny-Storage-Normalisierung für Bilder und Audios
- Übersetzung aus der im Profil hinterlegten Muttersprache
- Punkt-/Fortschrittssystem des jeweiligen Themas
- Lehrer-Vorschau darf keine Teilnehmerpunkte speichern

## Inhalt einer Karte

Der Karteninhalt wird weiterhin über die jeweilige Theme-/Task-Datenstruktur geliefert. Unterstützte Kernfelder:

```js
{
  term: "der Beruf",
  image: "https://sprachpilot.b-cdn.net/beruf.webp",
  audio: "https://sprachpilot.b-cdn.net/audio/beruf.mp3",
  plural: "die Berufe",
  example: "Was bist du von Beruf?",
  translations: {
    en: "profession",
    uk: "професія",
    ru: "профессия"
  },
  accepted: []
}
```

Die eigentlichen Wörter, Bilder, Audios, Übersetzungen, Pluralformen, Beispiele und akzeptierten Antworten sind **Inhalt** und dürfen je Thema geändert werden.

## Farbe

Die Standarddatei verwendet ausschließlich die bestehenden CSS-Variablen:

- `--lesson-main`
- `--lesson-main-dark`
- `--lesson-main-light`
- `--lesson-soft`
- `--lesson-line`
- `--lesson-bg`
- `--lesson-text`
- `--lesson-shadow`

Damit ändert eine neue Lektion nur ihre Farbvariablen; die Karte selbst wird nicht neu gestaltet.

Wenn der Pfad dem Muster `A1-Lektion-X` entspricht, setzt der Standard automatisch `data-sp-card-lesson="X"`.

## Einbindung in neue Karteikarten-Aufgaben

Nach dem gemeinsamen Task-Renderer wird immer die zentrale Standarddatei geladen:

```html
<script src="/js/sp-karteikarten-standard-v1.js?v=1"></script>
```

Keine neue lokale CSS-/JS-Kopie für das Kartenlayout anlegen.

## Bestehende technische Grundlage der Referenz

Die Referenz nutzt zusätzlich die gemeinsamen SprachPilot-Systeme für:

- Task-Rendering
- State/Fortschritt
- Theme-Punkte/Firebase
- Bunny-Bilder und Bunny-Audio
- Muttersprache/Übersetzungen
- Randomisierung/Wiederholungslogik
- Standard-Header/Navigation

Diese Systeme dürfen bei einer neuen Karteikarten-Aufgabe nicht durch eine eigene Sonderlösung ersetzt werden.

## Änderungsregel

Wenn das Karteikarten-Design später bewusst geändert werden soll, wird ausschließlich die zentrale Standarddatei versioniert. Einzelne Lektionen oder Themen erhalten keine abweichenden Kartenlayouts.
