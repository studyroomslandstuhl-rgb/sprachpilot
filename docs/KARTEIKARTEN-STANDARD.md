# SprachPilot Karteikarten-Standard V1.3

> **Kurzregel:** Neue Karteikarten = **A1 Lektion 8 · Thema 1 exakt übernehmen**.  
> **Nur Farbe und Karteninhalt ändern. Alles andere bleibt zentral und identisch.**

## 1. Verbindliche Referenzen

**Live-Referenz**

`https://www.sprachpilot.org/wortschatz/A1-Lektion-8/Thema-1/task.html?task=karteikarten`

**Zentrale technische Standarddatei**

`/js/sp-karteikarten-standard-v1.js`

**Zentrale Farbtabelle**

`/css/sp-card-standard-colors.css`

**Google-Drive-Referenz**

`https://docs.google.com/document/d/1RC7XkDGz6W-7n8Qf0jdsennEOPH8FNFMOIfomj7EYy8/edit`

### Priorität bei Widersprüchen

1. Eine neue ausdrückliche globale Entscheidung von Alisa.
2. `/js/sp-karteikarten-standard-v1.js`.
3. Die Live-Referenz L8T1.
4. Diese Dokumentation und das Google-Drive-Dokument.

Wenn der globale Standard geändert wird, müssen zentrale Datei, L8T1 und Dokumentationen gemeinsam aktualisiert werden.

---

## 2. Grundregel: IDENTISCH bedeutet identisch

Bei jeder Aufgabe vom Typ **Karteikarten** dürfen ausschließlich zwei Dinge variieren:

1. **Farbe** der Lektion/des Themas.
2. **Karteninhalt**.

Nicht variabel sind unter anderem:

- Titel
- Emoji
- Standardanweisung
- Aufgaben-Kopf
- Fortschrittsanzeige
- Kartengröße
- Vorderseitenstruktur
- Rückseitenstruktur
- Bildgrößen und Bildpositionen
- Flip-Verhalten
- Buttontexte und Buttonreihenfolge
- Schreibfeld und Prüfen-Button
- Spracherkennung
- Audioverhalten
- 3-stufige Hilfe
- Wiederholungslogik
- Abschlussverhalten
- Mobilansicht
- **automatisches Scrollen zum Bild**

Es werden keine lokalen Sonderlayouts oder themenspezifischen UI-Varianten gebaut.

---

## 3. Feste Task-Identität

```js
{
  id: "karteikarten",
  kind: "cards",
  title: "Karteikarten",
  instruction: "Lerne die Wörter.",
  items: []
}
```

Das verbindliche Karteikarten-Emoji ist:

`🃏`

Die sichtbare Standardanweisung lautet daher exakt:

`🃏 Lerne die Wörter.`

Keine Lektion darf eigene Titel wie „Karteikarten: Wortschatz + ...“, andere Emojis oder längere improvisierte Anweisungen verwenden.

---

## 4. Feste Seitenstruktur

Unverändert bleiben:

- gemeinsamer SprachPilot-Header
- Standardnavigation
- Zurück-Navigation zur Themenübersicht
- Aufgaben-Kopf
- Aufgabennummer
- Titel `Karteikarten`
- Anweisung `🃏 Lerne die Wörter.`
- Fortschrittszeile
- Fortschrittsbalken
- Kartenbereich
- Feedbackbereich
- Abschluss-Screen `Gut gemacht!`

Karteikarten dürfen keinen eigenen Seitenrahmen oder eigenes Navigationssystem erhalten.

---

## 5. Festes Kartendesign

### Gesamtbereich

- Aufgabenbreite maximal ca. `980px`
- Karten-Container maximal ca. `690px`
- gleiche Abstände, Rahmen, Rundungen und Schatten wie L8T1
- Farben ausschließlich aus den Lektion-/Thema-Variablen

### Vorderseite

- großes quadratisches Bild
- `300 × 300px`
- `object-fit: contain`
- zentriert
- darunter Übersetzung in der Muttersprache
- deutsches Zielwort nicht vorwegnehmen

### Rückseite

Desktop:

- kleines Bild links
- `120 × 120px`
- deutsches Wort
- Übersetzung in der Muttersprache
- nur standardisierte inhaltliche Zusatzfelder wie `Plural` und `Beispiel`
- `🔊 Anhören`

Nicht standardisierte UI-Felder wie ein zusätzliches `Perfekt`-Feld werden nicht zugelassen.

### Mobil

- Rückseite einspaltig
- Rückseitenbild `100 × 100px`
- gleiche Wortgröße, Abstände und Bedienung wie im zentralen Standard
- keine eigene mobile Sonderversion

---

## 6. Verbindlicher Auto-Scroll zum Bild

**Das automatische Scrollen gehört fest zum Karteikarten-Standard.**

Beim Öffnen einer Karteikarten-Aufgabe wird automatisch nach unten zur aktuellen Karte bzw. zum **großen Bild auf der Vorderseite** gescrollt.

Nach **jedem Kartenwechsel** wird erneut automatisch zur neuen Karte bzw. zum neuen großen Bild gescrollt, damit die aktuelle Karte sofort im sichtbaren Bereich steht.

Technische Vorgabe:

- Ziel ist primär `.l8-flip-front .l8-card-visual`
- Fallback ist `.l8-card-stage`
- der Scroll erfolgt automatisch und weich
- beim Rendern einer neuen Karte wird anhand des aktuellen Karteninhalts erkannt, dass erneut gescrollt werden muss
- der Auto-Scroll darf lokal nicht entfernt werden
- die Scrollposition darf nicht pro Lektion auf einen anderen Bereich umgestellt werden
- lokale Renderer dürfen keinen konkurrierenden Scroll-Mechanismus einbauen, der anschließend wieder vom Bild wegscrollt

Die zentrale Umsetzung liegt in:

`SPCardTaskStandard.autoScrollToImage()`

in

`/js/sp-karteikarten-standard-v1.js`

---

## 7. Feste Bedienung

### Karte umdrehen

- Klick/Tap
- Enter
- Leertaste

Die Flip-Animation und das Verhalten bleiben identisch.

### Aktionsbuttons

Unter jeder Karte immer exakt in dieser Reihenfolge:

1. `🎤 Sprechen`
2. `✍️ Schreiben`

Auf der Rückseite:

- `🔊 Anhören`

### Schreiben

`✍️ Schreiben` öffnet das standardisierte Eingabefeld.

- Placeholder: `Wort schreiben`
- Button: `Prüfen`
- Enter prüft ebenfalls

---

## 8. Verbindliche Lernlogik

### Umdrehen ist ein Hilfeschritt

Das Umdrehen zeigt die Lösung und wird als Fehler-/Hilfeschritt registriert.

Die Karte wird dadurch niemals als richtig oder abgeschlossen markiert.

Danach muss der Lernende das Wort selbst sprechen oder schreiben.

### 3-stufige Hilfe

1. Erster Fehler / erstes Ansehen: erneuter eigener Versuch.
2. Zweiter Fehler: Hinweis.
3. Dritter Fehler: Lösung anzeigen; anschließend trotzdem selbst antworten.

### Wiederholung

Eine Karte mit Fehler oder verwendeter Hilfe:

- wird zur Wiederholung vorgemerkt
- gilt nach der unmittelbar folgenden richtigen Antwort noch nicht endgültig als erledigt
- kommt später erneut
- wird erst nach einer späteren korrekten eigenen Antwort abgeschlossen

Eine Karte ohne Fehler kann nach der korrekten eigenen Antwort direkt abgeschlossen werden.

---

## 9. Sprechen und Antwortprüfung

### Sprechen

- Browser SpeechRecognition/WebkitSpeechRecognition
- Sprache `de-DE`
- mehrere Erkennungsalternativen berücksichtigen
- mit Zielantworten vergleichen
- bei Mikrofonproblemen auf Schreiben verweisen

### Antwortprüfung

Geprüft werden:

- deutsches Zielwort
- ausdrücklich akzeptierte Antworten (`answers` / `accepted`)

Keine Karte darf durch bloßes Umdrehen fertig werden.

---

## 10. Audio und Bilder

### Audio

Standard:

`https://sprachpilot.b-cdn.net/audio/name.mp3`

Fallback: deutsche Browser-TTS mit `de-DE`.

### Bilder

Standard:

`https://sprachpilot.b-cdn.net/name.webp`

SprachPilot-Wortschatzbildstandard:

- Quelldatei `800 × 800px`
- `.webp`
- Dateiname in der Regel ohne Artikel
- mehrere Wörter mit `_`
- Kartendarstellung immer `object-fit: contain`

---

## 11. Muttersprache und Übersetzung

Die Vorderseite zeigt die Übersetzung in der im Teilnehmerprofil hinterlegten Muttersprache.

Die Rückseite zeigt dieselbe Übersetzung erneut.

Die Sprach-/Übersetzungslogik wird global gepflegt, nicht pro Lektion neu gebaut.

---

## 12. Fortschritt, Wiederholung und Punkte

Karteikarten verwenden das gemeinsame SprachPilot-System für:

- offene Karten
- zufällige Queue
- aktuelle Karte
- Fehleranzahl
- Hilfestufen
- Review-/Wiederholungsqueue
- abgeschlossene Karten
- Antworten
- Fortschrittsprozent
- Punkte/Firebase

Eine neue Karteikarten-Aufgabe darf keine eigene parallele Fortschritts- oder Punktelogik erhalten.

In der Lehrer-Vorschau werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.

---

## 13. Was geändert werden darf

### A. Farbe

Nur zentrale Lektion-/Thema-Farbvariablen, z. B.:

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

### B. Karteninhalt

Variabel sind z. B.:

- deutsches Zielwort
- Bild
- Audio
- Übersetzungen
- Plural
- Beispiel
- akzeptierte Antwortvarianten
- ggf. inhaltlicher Hint

Nicht als „Inhalt“ gelten UI-Texte, Titel, Emoji, Buttonnamen, Aufgabenanweisung oder zusätzliche Layoutblöcke.

---

## 14. Einbindung

Die zentrale Standarddatei muss geladen werden:

```html
<script src="/js/sp-karteikarten-standard-v1.js?v=VERSION"></script>
```

Sie aktiviert sich nur bei `?task=karteikarten` bzw. `?task=cards`.

Keine lokale Datei wie `lXtY-card-standard.js` oder eine eigene Karten-CSS-Kopie anlegen, wenn sie ein abweichendes Layout erzeugt.

---

## 15. Verbotene Abweichungen

Ohne ausdrückliche globale Standardänderung nicht erlaubt:

- anderes Emoji
- andere Standardanweisung
- anderer Titel
- andere Kartengröße
- andere Vorderseitenstruktur
- andere Rückseitenstruktur
- andere Bildgröße/-position
- anderes `object-fit`
- andere Buttonnamen
- andere Buttonreihenfolge
- Sprechen/Schreiben/Anhören entfernen
- Muttersprache entfernen
- anderes Flip-Verhalten
- anderes Fehler-/Hilfesystem
- andere Review-Logik
- eigene lokale Fortschrittslogik
- eigenes lokales Punktesystem
- eigene lokale Bunny-/Audio-/TTS-Logik
- eigenes mobiles Kartenlayout
- zusätzliche nicht standardisierte Rückseitenfelder
- lokale CSS-Overrides gegen den Standard
- **Auto-Scroll zum Bild entfernen oder verändern**
- **nach einem Kartenwechsel an eine andere Position statt zum Bild scrollen**

---

## 16. Abnahmekriterien

Eine Karteikarten-Aufgabe ist nur standardkonform, wenn:

- sie optisch bis auf Farbe und Inhalt wie L8T1 aussieht
- `🃏 Lerne die Wörter.` exakt verwendet wird
- Vorder- und Rückseite gleich aufgebaut sind
- Maße und Abstände identisch sind
- Sprechen, Schreiben und Anhören vorhanden sind
- Muttersprache auf Vorder- und Rückseite funktioniert
- Bunny-Bild und Bunny-Audio funktionieren
- Umdrehen die Karte nicht abschließt
- 3-stufige Hilfe funktioniert
- fehlerhafte/angesehene Karten wiederholt werden
- Fortschritt und Punkte das gemeinsame System verwenden
- Lehrer-Vorschau keine Teilnehmerdaten speichert
- Mobilansicht identisch reagiert
- **beim Öffnen automatisch zum Bild gescrollt wird**
- **nach jedem Kartenwechsel automatisch zum neuen Bild gescrollt wird**
- keine lokale Kartenlayout-Kopie existiert

---

## 17. Änderung des globalen Standards

Wenn das Karteikarten-Design oder Verhalten bewusst für **alle** Karteikarten geändert werden soll:

1. zentrale Standarddatei ändern
2. Versionsnummer erhöhen
3. L8T1 als Referenz aktualisieren
4. bestehende Karteikarten gegenprüfen
5. GitHub-Dokumentation aktualisieren
6. Google-Drive-Dokument aktualisieren

Einzelne Lektionen/Themen erhalten keine abweichende Variante, solange sie zum Aufgabentyp **Karteikarten** gehören.

---

## 18. Kurzregel für zukünftige Arbeiten

> **Neue Karteikarten = L8T1 exakt übernehmen. Nur Farbe und Karteninhalt ändern. Beim Öffnen und nach jedem Kartenwechsel automatisch zum Bild scrollen. Alles andere bleibt zentral und identisch.**
