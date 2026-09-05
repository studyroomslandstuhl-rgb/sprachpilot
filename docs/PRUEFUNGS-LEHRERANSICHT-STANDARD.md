# SprachPilot – Prüfungs-Lehreransicht-Standard V1

> **Kurzregel:** Jede Prüfung in jeder Lektion und in jedem Thema bekommt automatisch dieselbe Lehrkraft-Prüfungsansicht wie die Referenz A1 Lektion 8 · Thema 3.

## 1. Verbindliche Referenz

Live-Referenz:

`https://www.sprachpilot.org/wortschatz/A1-Lektion-8/Thema-3/task.html?task=pruefung-l8t3-inhalte-v3&teacherExamRead=1`

Zentrale technische Datei:

`/js/sp-teacher-exam-reader.js`

Globaler Autoload:

`/js/session-restore.js`

Die Lehrkraft-Ansicht wird dadurch auf allen SprachPilot-Wortschatzseiten unter `A*-Lektion-*/Thema-*` automatisch geladen. Eine neue Prüfung soll keine eigene lokale Lehreransicht benötigen.

---

## 2. Geltungsbereich

Dieser Standard gilt verbindlich für:

- jede Lektion
- jedes Thema
- jede Prüfung
- bestehende Prüfungen, sobald ihr Datenmodell vom zentralen Reader erkannt wird
- jede neu angelegte Prüfung

Eine Prüfung ist als Prüfung erkennbar, wenn mindestens eines gilt:

- `exam: true`
- `isExam: true`
- `kind` bzw. `type` enthält `exam`
- ID oder Titel enthält `pruefung`, `prüfung` oder `exam`

---

## 3. Was Lehrkräfte automatisch bekommen

Wenn eine Lehrkraft die Themenübersicht öffnet:

- die Prüfung ist für die Lehrkraft vollständig freigeschaltet
- Teilnehmer-Freischaltbedingungen blockieren die Lehrkraft nicht
- der Prüfungszugang führt in die Lehreransicht
- die Prüfungs-Kachel zeigt `Prüfung lesen`
- der Status zeigt `Lehreransicht · vollständig freigeschaltet`

Die Lehreransicht verwendet den URL-Parameter:

`teacherExamRead=1`

Beispiel:

`task.html?task=<PRUEFUNGS-ID>&teacherExamRead=1`

---

## 4. Was in der Lehreransicht sichtbar sein muss

Die Lehrkraft sieht die komplette Prüfung auf einer Seite und nicht nur die aktuell aktive Teilnehmerfrage.

Für jede Prüfungsaufgabe werden – sofern vorhanden – angezeigt:

- Aufgabennummer
- Aufgabentyp
- Bezeichnung / Label
- Kontext / Lesetext / Dialog
- Bild
- Hörtext / Transkript oder Hinweis auf hinterlegtes Audio
- genaue Aufgabenstellung / Frage
- alle Auswahloptionen
- alle Satzteile / Tokens bei Sortieraufgaben
- Hinweis
- hinterlegte Soll-Lösung bzw. alle akzeptierten Lösungen

Die Lehreransicht zeigt **alle Prüfungsitems gleichzeitig**, damit Inhalt, Reihenfolge, Formulierungen und Lösungen überprüft werden können.

---

## 5. Prüfung testen

Die Lehreransicht enthält immer den Button:

`Prüfung testen`

Damit kann die Lehrkraft die Prüfung in der normalen Teilnehmerdarstellung bearbeiten und vollständig durchspielen.

Die globale Lehrer-Freischaltung sorgt dabei dafür, dass:

- Prüfungssperren für Lehrkräfte nicht greifen
- Testfortschritt der Lehrkraft getrennt behandelt wird
- keine Teilnehmerpunkte verändert werden
- kein Teilnehmerfortschritt überschrieben wird
- keine Firebase-Teilnehmerwerte aus der Lehrkraft-Vorschau geschrieben werden

---

## 6. Verbindlicher Prüfungs-Datenstandard

Damit die Lehreransicht Inhalt und Lösungen vollständig anzeigen kann, muss jede neue Prüfung ihre Aufgaben als strukturierte Daten bereitstellen.

Bevorzugte Struktur:

```js
{
  id: "pruefung-...",
  exam: true,
  title: "Prüfung",
  instruction: "Löse die Aufgaben.",
  items: [
    {
      type: "choice",
      label: "Bedeutung → Wort",
      context: "...",
      prompt: "Welche Antwort ist richtig?",
      options: ["A", "B", "C"],
      answer: "B",
      hint: "..."
    }
  ]
}
```

Der zentrale Reader akzeptiert zusätzlich als Fragenliste:

- `questions`
- `exercises`
- `aufgaben`

Für die Lösung werden unter anderem erkannt:

- `answer`
- `answers`
- `correctAnswer`
- `correct`
- `solution`
- `solutions`
- `expected`
- `accepted`
- `word`
- `form`
- `correctIndex` zusammen mit `options`

Neue Prüfungen sollen trotzdem bevorzugt den einfachen Standard `items` + `answer` verwenden.

---

## 7. Keine versteckten Lösungen in Renderer-Code

Nicht erlaubt bei neuen Prüfungen:

- richtige Antworten nur in Event-Handlern verstecken
- Lösungen nur über lokale `if`-Abfragen im Renderer definieren
- Prüfungsfragen ausschließlich als fertiges HTML ohne strukturierten Datensatz bauen
- Lehreransicht lokal neu programmieren
- eine separate zweite Prüfungsdatenliste nur für Lehrkräfte pflegen

Die Teilnehmerprüfung und die Lehreransicht müssen **dieselbe Prüfungsdatenquelle** lesen. Dadurch sieht die Lehrkraft genau die Inhalte und Antworten, die tatsächlich in der Prüfung verwendet werden.

---

## 8. Bearbeitbarkeit der Prüfung

Prüfungsinhalte müssen in einer klaren, zentralen Datenstruktur liegen, damit Fragen, Texte, Bilder, Optionen und Soll-Lösungen gezielt geändert werden können.

Die Referenz-Lehreransicht selbst ist eine Kontroll- und Testansicht. Änderungen an der veröffentlichten Prüfung werden an der zugehörigen Prüfungsdatenquelle vorgenommen; es wird keine zweite Lehrkraft-Kopie der Inhalte gepflegt.

Dadurch gilt:

- eine Änderung am Prüfungsdatensatz ändert Teilnehmerprüfung und Lehreransicht gemeinsam
- keine abweichenden Lehrerlösungen
- keine veraltete Kontrollansicht

---

## 9. Automatische technische Einbindung

Der zentrale Loader in `/js/session-restore.js` lädt auf jeder SprachPilot-Themenseite automatisch:

`/js/sp-teacher-exam-reader.js`

Der Reader erkennt Lektion und Thema aus dem Pfad:

`/wortschatz/A*-Lektion-X/Thema-Y/`

Er sucht anschließend automatisch nach dem zugehörigen Theme-/Task-Datenmodell und allen Prüfungen.

Für eine normale neue Prüfung ist daher **keine eigene `<script>`-Einbindung für die Lehreransicht mehr erforderlich**.

---

## 10. Unterstützte Theme-Modelle

Der zentrale Reader erkennt unter anderem die SprachPilot-Modelle:

- `Lx_THEME`
- `LxTy`
- `Lx_THEMES`
- `Lx_ALL_THEMES`
- `SP_THEME`
- `SP_CURRENT_THEME`
- `THEME`

Zusätzlich sucht er nach passenden `Lx...`-Globals mit einem `tasks`-Array.

Neue Lektionen sollen nach Möglichkeit eines dieser gemeinsamen Datenmodelle verwenden.

---

## 11. Schutz der Teilnehmerdaten

Die Lehrkraft-Prüfungsansicht darf niemals:

- Teilnehmerfortschritt verändern
- Teilnehmerpunkte vergeben oder abziehen
- Prüfungsversuche eines Teilnehmers verbrauchen
- Prüfungsergebnisse eines Teilnehmers überschreiben
- Teilnehmer-Firebase-Daten schreiben

Die bestehende zentrale Lehrkraft-Freischaltung `/js/sp-teacher-unlocked.js` bleibt dafür verbindlich.

---

## 12. Abnahmekriterien für jede neue Prüfung

Eine neue Prüfung ist erst fertig, wenn alle folgenden Punkte erfüllt sind:

- Prüfung ist als `exam` erkennbar
- stabile Prüfungs-ID vorhanden
- alle Fragen liegen strukturiert vor
- jede geschlossene Frage besitzt eine explizite Soll-Lösung
- offene Antworten sind bewusst als offen definiert
- Lehrkraft sieht die Prüfung in der Themenübersicht
- `Prüfung lesen` öffnet die vollständige Lehreransicht
- alle Prüfungsfragen werden gleichzeitig angezeigt
- alle Soll-Lösungen werden angezeigt
- Bilder sind sichtbar
- Hörtexte/Audio-Hinweise sind sichtbar
- Auswahloptionen und Satzteile sind sichtbar
- `Prüfung testen` funktioniert
- Lehrkraft wird nicht durch Schüler-Freischaltbedingungen gesperrt
- beim Testen werden keine Teilnehmerdaten verändert

---

## 13. Vorgehen bei jeder neuen Prüfung

1. Prüfung im normalen Theme-Datensatz anlegen.
2. `exam: true` setzen.
3. stabile `id` vergeben.
4. Fragen unter `items` speichern.
5. Soll-Lösungen direkt an den Items speichern.
6. Teilnehmer-Renderer auf dieselben Items zugreifen lassen.
7. Keine lokale Lehreransicht erstellen.
8. Themenübersicht als Lehrkraft öffnen.
9. `Prüfung lesen` kontrollieren.
10. alle Fragen und Lösungen prüfen.
11. `Prüfung testen` vollständig durchspielen.
12. sicherstellen, dass keine Teilnehmerdaten geschrieben wurden.

---

## 14. Kurzregel für zukünftige Arbeit

> **Jede neue SprachPilot-Prüfung muss automatisch eine vollständige Lehrkraft-Prüfungsansicht besitzen. Die Lehrkraft sieht alle Inhalte und Soll-Lösungen auf einmal und kann die Prüfung testen. Teilnehmer- und Lehreransicht verwenden dieselbe Prüfungsdatenquelle. Keine lokale Sonderlösung pro Lektion oder Thema.**
