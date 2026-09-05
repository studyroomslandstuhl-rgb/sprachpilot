# SprachPilot Karteikarten-Standard V1

> **Kurzregel:** Neue Karteikarten = **A1 Lektion 8 · Thema 1 exakt übernehmen**.  
> **Nur Farbe und Inhalt ändern. Alles andere bleibt zentral und identisch.**

## 1. Verbindliche Referenzen

**Live-Referenz**

`https://www.sprachpilot.org/wortschatz/A1-Lektion-8/Thema-1/task.html?task=karteikarten`

**Zentrale Layout-/Normalisierungsdatei**

`/js/sp-karteikarten-standard-v1.js`

**Diese Dokumentation**

`/docs/KARTEIKARTEN-STANDARD.md`

**Google-Drive-Referenz**

`https://docs.google.com/document/d/1RC7XkDGz6W-7n8Qf0jdsennEOPH8FNFMOIfomj7EYy8/edit`

**Zentrale Farbdefinitionen**

`/css/sp-card-standard-colors.css`

### Priorität bei Widersprüchen

1. Eine neue ausdrückliche Entscheidung von Alisa zum globalen Karteikarten-Standard.
2. Die aktuelle zentrale Standarddatei `/js/sp-karteikarten-standard-v1.js`.
3. Die Live-Referenz L8T1.
4. Diese Dokumentation und das gleichnamige Google-Drive-Dokument.

Wenn eine globale Änderung beschlossen wird, müssen zentrale Standarddatei, L8T1 und beide Dokumentationen zusammen aktualisiert werden. Keine Lektion erhält stillschweigend eine Sondervariante.

---

## 2. Grundregel

Bei jeder neuen Aufgabe vom Typ **Karteikarten** dürfen ausschließlich zwei Dinge variieren:

1. **Farbe** der Lektion/des Themas.
2. **Inhalt** der Karten.

Nicht variabel sind Layout, Maße, Abstände, Vorder-/Rückseite, Flip-Verhalten, Button-Reihenfolge, Texte der Bedienbuttons, Spracherkennung, Schreibprüfung, Audioverhalten, Muttersprache, 3-stufige Hilfe, Wiederholungslogik, Fortschritt, Abschlussverhalten und Mobilansicht.

**Keine neue lokale Karteikarten-CSS- oder Karteikarten-Layout-JS-Datei anlegen.**

---

## 3. Feste Task-Identität

Eine normale Karteikarten-Aufgabe verwendet:

```js
{
  id: "karteikarten",
  kind: "cards",
  title: "Karteikarten",
  instruction: "Lerne die Wörter.",
  items: []
}
```

Der Inhalt von `items` kommt aus dem jeweiligen Thema. Der Aufgabentyp selbst wird nicht pro Thema neu erfunden.

---

## 4. Feste Seitenstruktur

Die Karteikarten laufen innerhalb der normalen SprachPilot-Aufgabenseite.

Unverändert bleiben:

- gemeinsamer SprachPilot-Header
- Standardnavigation
- Zurück-Navigation zur Themenübersicht
- Aufgaben-Kopf
- Aufgabennummer
- Titel `Karteikarten`
- kurze Anweisung
- Fortschrittszeile
- Fortschrittsbalken
- Kartenbereich
- Feedbackbereich
- Abschluss-Screen `Gut gemacht!`

Die Referenz verwendet den gemeinsamen Task-Renderer; Karteikarten dürfen keinen eigenen Seitenrahmen oder eigenes Navigationssystem erhalten.

---

## 5. Festes Kartendesign

### Gesamtbereich

Der aktuelle zentrale Standard normalisiert L8T1 u. a. auf:

- Aufgabenbreite: maximal ca. `980px`
- Kartenbereich mit denselben Abständen wie L8T1
- Karten-Container: maximal ca. `690px`
- gleiche Rundungen, Rahmen, Schatten und Abstände
- Farben ausschließlich aus den Lektion-/Thema-Variablen

### Vorderseite

Verbindlich:

- großes quadratisches Bild
- Kartenansicht: `300 × 300px`
- `object-fit: contain`
- zentriert
- darunter Übersetzung in der Muttersprache
- gleiche Rahmenstärke, Rundung, Innenabstände und Typografie wie L8T1
- deutsches Zielwort wird auf der Vorderseite nicht vorweggenommen

### Rückseite

Verbindlich:

- Desktop: Informationsgrid mit kleinem Bild links und Informationen rechts
- kleines Bild: `120 × 120px`
- deutsches Wort
- dieselbe Muttersprache-Übersetzung
- inhaltlich vorhandene Zusatzfelder wie Plural und Beispiel
- `🔊 Anhören`
- identische Reihenfolge der Informationsblöcke
- keine doppelten alten Rückseiten-Elemente

### Mobil

Verbindlich:

- Rückseiten-Grid wird einspaltig
- kleines Rückseitenbild: `100 × 100px`
- Wortgröße und Abstände entsprechen dem zentralen Standard
- Sprechen/Schreiben und Eingabe bleiben bedienbar
- keine eigene mobile Sonderversion pro Lektion

---

## 6. Feste Bedienung

### Karte umdrehen

Die Karte lässt sich umdrehen durch:

- Klick/Tap
- Enter
- Leertaste

Die Flip-Animation und das Verhalten bleiben identisch.

### Aktionsbuttons

Unter jeder Karte immer in dieser Reihenfolge:

1. `🎤 Sprechen`
2. `✍️ Schreiben`

Auf der Rückseite:

- `🔊 Anhören`

Beschriftung, Reihenfolge und Grundfunktion dürfen lokal nicht geändert werden.

### Schreiben

`✍️ Schreiben` öffnet das standardisierte Eingabefeld.

- Eingabe des deutschen Wortes
- `Prüfen`
- Enter prüft ebenfalls
- gleiche Feedbackdarstellung wie L8T1

---

## 7. Verbindliche Lernlogik

### Umdrehen ist ein Hilfeschritt

Das Umdrehen zeigt die Lösung. Im aktuellen Referenzsystem wird dies deshalb als Fehler-/Hilfeschritt registriert.

**Wichtig:** Die Karte wird durch Umdrehen niemals als richtig oder abgeschlossen markiert.

Danach muss der Lernende das Wort selbst sprechen oder schreiben.

### 3-stufige Hilfe

Die gemeinsame Lernlogik bleibt:

1. **Erster Fehler / erstes Ansehen:** erneuter eigener Versuch.
2. **Zweiter Fehler:** Hinweis.
3. **Dritter Fehler:** Lösung wird gezeigt; anschließend muss die Antwort trotzdem selbst gegeben werden.

Keine Lektion bekommt eine eigene vereinfachte Hilfelogik.

### Wiederholung fehlerhafter Karten

Wenn eine Karte angesehen wurde oder eine falsche Antwort hatte:

- sie wird zur Wiederholung vorgemerkt
- eine unmittelbar danach richtige Antwort beendet sie noch nicht endgültig
- sie kommt später erneut
- erst eine spätere korrekte eigene Antwort schließt die Karte endgültig ab

Eine Karte ohne vorherigen Fehler kann nach der korrekten eigenen Antwort direkt abgeschlossen werden.

### Reihenfolge

Die Reihenfolge wird vom gemeinsamen State-System verwaltet. Keine lokale `cardIndex++`-Sonderlogik als Ersatz für Queue/ReviewQueue einbauen.

---

## 8. Sprechen

Verbindlich:

- Browser SpeechRecognition/WebkitSpeechRecognition, soweit verfügbar
- Sprache: `de-DE`
- mehrere Erkennungsalternativen werden berücksichtigt
- erkannte Antwort wird mit den akzeptierten Zielantworten verglichen
- bei nicht unterstütztem oder fehlerhaftem Mikrofon wird auf Schreiben verwiesen

Keine lektionseigene Spracherkennungslogik bauen.

---

## 9. Schreiben und Antwortprüfung

Geprüft werden:

- das deutsche Zielwort
- zusätzliche ausdrücklich akzeptierte Antworten (`answers` / `accepted`)

Normalisierung und Gleichheitsprüfung kommen aus dem gemeinsamen SprachPilot-System.

Eine richtige Antwort wird über das gemeinsame State-System gespeichert. Eine falsche Antwort erhöht die Hilfestufe und beeinflusst die Wiederholungslogik.

---

## 10. Audio

### Bunny Storage

Standard:

```text
https://sprachpilot.b-cdn.net/audio/name.mp3
```

Die zentrale Bunny-Normalisierung soll explizite Audiofelder oder aus dem Begriff abgeleitete Dateien auf Bunny Storage abbilden.

### Fallback

Kann die MP3 nicht abgespielt werden, nutzt das gemeinsame System Browser-TTS:

- Sprache `de-DE`
- keine lokale Sonder-TTS pro Thema

---

## 11. Bilder

### Bunny Storage

Standard:

```text
https://sprachpilot.b-cdn.net/name.webp
```

SprachPilot-Wortschatzbildstandard:

- Quelldatei `800 × 800px`
- Format `.webp`
- Dateiname in der Regel ohne Artikel
- mehrere Wörter mit `_`, z. B. `tennis_spielen.webp`
- Darstellung in der Karte immer mit `object-fit: contain`

Die zentrale Bunny-Normalisierung unterstützt außerdem bestehende Sonderzuordnungen. Solche Sonderfälle werden zentral gepflegt, nicht in einem neuen Kartenlayout.

---

## 12. Muttersprache und Übersetzungen

Die Vorderseite zeigt die Übersetzung in der Muttersprache aus dem Teilnehmerprofil.

Die Rückseite zeigt dieselbe Übersetzung erneut.

Die Übersetzungslogik ist **global**. Wenn eine neue Muttersprache unterstützt werden soll, wird das gemeinsame Profil-/Übersetzungssystem erweitert. Es wird keine eigene Sprachlogik nur für eine einzelne Karteikarten-Aufgabe angelegt.

---

## 13. Fortschritt, Wiederholung und Punkte

Karteikarten nutzen das gemeinsame State-System für:

- offene Karten
- zufällige Queue
- aktuelle Karte
- Fehleranzahl
- Hilfestufen
- Review-/Wiederholungsqueue
- abgeschlossene Karten
- Antworten
- Fortschrittsprozent

Das gemeinsame Theme-Score-System übernimmt die Punktesynchronisation einschließlich Firebase, sofern das jeweilige Thema daran angeschlossen ist.

**Nicht erlaubt:** ein separates Punkte- oder Fortschrittssystem nur für eine neue Karteikarten-Aufgabe.

### Lehrer-Vorschau

In der Lehrer-Vorschau werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.

---

## 14. Abschluss

Nach vollständigem Abschluss erscheint der SprachPilot-Standard-Screen:

`Gut gemacht!`

Die Aufgabe ist erst `100 %`, wenn alle Karten nach der vorgesehenen Lern- und Wiederholungslogik abgeschlossen sind.

---

## 15. Was geändert werden darf

### A. Farbe

Nur die zentralen Variablen der jeweiligen Lektion/des Themas:

```css
--lesson-main
--lesson-main-dark
--lesson-main-light
--lesson-soft
--lesson-line
--lesson-bg
--lesson-text
--lesson-shadow
```

Der Kartenstandard liest diese Variablen. Für eine andere Farbe wird **kein neues Kartenlayout** erstellt.

### B. Inhalt

Kartendaten dürfen variieren, z. B.:

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

Inhaltlich variabel sind insbesondere:

- `term` / deutsches Zielwort
- Bild
- Audio
- Übersetzungen
- Plural
- Beispiel
- akzeptierte Antwortvarianten
- ggf. inhaltlicher Hint

---

## 16. Zentrale technische Abhängigkeiten

Verbindliche zentrale Kartenlayoutdatei:

```text
/js/sp-karteikarten-standard-v1.js
```

Zentrale Farbtabelle:

```text
/css/sp-card-standard-colors.css
```

Die aktuelle L8T1-Referenz nutzt außerdem die gemeinsamen SprachPilot-Systeme für:

- Task-Rendering
- Bunny-Bilder und Bunny-Audio
- Übersetzungen
- State/Fortschritt
- Review-Logik
- Theme-Score/Firebase
- Audio/TTS
- Standardnavigation
- responsive Grunddarstellung

Diese Systeme dürfen nicht durch eine themenspezifische Parallelimplementierung ersetzt werden.

---

## 17. Einbindung in neue Aufgaben

Nach dem gemeinsamen Task-Renderer die zentrale Standarddatei laden:

```html
<script src="/js/sp-karteikarten-standard-v1.js?v=1"></script>
```

Die Datei aktiviert sich nur für `?task=karteikarten` bzw. `?task=cards`.

Wenn der Pfad einem Muster `A1-Lektion-X` entspricht, kann der Standard die Lektion für die zentrale Farbzuordnung erkennen.

---

## 18. Verbotene Abweichungen

Ohne ausdrückliche globale Standardänderung **nicht erlaubt**:

- andere Kartengröße
- andere Vorderseitenstruktur
- andere Rückseitenstruktur
- andere Bildgröße/-position
- anderes `object-fit`
- andere Buttonnamen
- andere Buttonreihenfolge
- Sprechen entfernen
- Schreiben entfernen
- Anhören entfernen
- Muttersprache entfernen
- anderes Flip-Verhalten
- Umdrehen als richtige Antwort werten
- automatische Weiterleitung nur durch Umdrehen
- anderes Fehler-/Hilfesystem
- andere Review-/Wiederholungslogik
- eigene lokale Fortschrittslogik
- eigenes lokales Punktesystem
- eigene lokale Bunny-Logik
- eigene lokale TTS-/Audio-Logik
- eigenes mobiles Kartenlayout
- lokale CSS-Overrides, die den zentralen Kartenstandard verändern
- neue Dateien wie `lXtY-card-standard.js`, wenn sie nur ein abweichendes Layout erzeugen

---

## 19. Vorgehen für jede neue Karteikarten-Aufgabe

1. Gemeinsamen Task-Renderer verwenden.
2. Task mit `id: "karteikarten"` und `kind: "cards"` anlegen.
3. Titel und Standardanweisung beibehalten.
4. Nur neue Kartendaten eintragen.
5. Bilder mit Bunny Storage verbinden.
6. Audios mit Bunny Storage verbinden.
7. Übersetzungen über das gemeinsame Übersetzungssystem liefern.
8. Farbe nur über die zentralen Lektion-/Thema-Variablen setzen.
9. `/js/sp-karteikarten-standard-v1.js` laden.
10. Gemeinsames State-/Score-System verwenden.
11. Keine lokalen Kartenlayout-Overrides hinzufügen.
12. Desktop und Mobil gegen L8T1 prüfen.

---

## 20. Abnahmekriterien

Eine neue Karteikarten-Aufgabe ist nur standardkonform, wenn:

- optisch bis auf die Farbe wie L8T1
- gleicher Aufgaben-Kopf
- gleiche Vorderseite
- gleiche Rückseite
- gleiche Maße und Abstände
- gleiche Flip-Animation
- `🎤 Sprechen` vorhanden
- `✍️ Schreiben` vorhanden
- `🔊 Anhören` vorhanden
- Muttersprache auf Vorder- und Rückseite
- Bunny-Bild funktioniert
- Bunny-Audio funktioniert
- Audio-Fallback funktioniert
- Umdrehen beendet die Karte nicht
- 3-stufige Hilfe funktioniert
- angesehene/falsch beantwortete Karten werden wiederholt
- korrekte Abschlusslogik funktioniert
- Fortschritt wird über das gemeinsame System gespeichert
- Punkte verwenden das gemeinsame Theme-Score/Firebase-System
- Lehrer-Vorschau speichert keine Teilnehmerdaten
- Mobilansicht reagiert wie die Referenz
- keine lokale Layoutkopie wurde erzeugt

---

## 21. Änderung des globalen Standards

Wenn Alisa später ausdrücklich sagt, dass das Karteikarten-Design oder Verhalten **für alle Karteikarten** geändert werden soll:

1. zentrale Standarddatei ändern
2. Version erhöhen
3. L8T1 als Referenz aktualisieren
4. bestehende Karteikarten-Aufgaben gegenprüfen
5. diese GitHub-Dokumentation aktualisieren
6. das Google-Drive-Standarddokument aktualisieren

Einzelne Lektionen/Themen bekommen keine abweichende Variante, solange die Aufgabe weiterhin zum Typ **Karteikarten** gehört.

---

## 22. Kurzregel für zukünftige Chats und Arbeiten

> **„Neue Karteikarten = L8T1 exakt kopieren. Nur Farbe und Inhalt ändern. Alles andere bleibt zentral und identisch.“**
