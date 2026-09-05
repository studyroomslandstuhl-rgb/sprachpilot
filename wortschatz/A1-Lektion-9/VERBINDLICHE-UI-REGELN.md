# Verbindliche UI-Regeln für Lektion 9

Diese Regeln gelten für alle Themen und alle neuen oder überarbeiteten Aufgaben in Lektion 9.

- Struktur und Design werden aus Lektion 7 und insbesondere dem aktuellen Lektion-8-Standard übernommen. Lektion 9 erfindet kein eigenes Aufgabenlayout.
- Der einzige visuelle Unterschied zum L8-Standard ist die grüne L9-Farbpalette. Inhalte, Bilder, Audios und Aufgabenlogik sind L9-spezifisch.
- **Lade-Reihenfolge ist verbindlich:** Die globale SprachPilot-Leiste wird immer zuerst sichtbar. Seiteninhalt darf erst danach erscheinen. Standardseiten benutzen dafür `sp-header-first`, `/css/sp-header-first.css` und `/js/sp-header-first-gate.js`.
- Jede Seite hat genau eine globale SprachPilot-Standardleiste. Aufgaben rendern niemals eine zweite eigene Topbar, Header- oder Navigationsleiste.
- Themenübersicht: zuerst kompakte Fortschritts-/Punktekarte wie in L8, danach das L8-Aufgabenkarten-Raster.
- Geöffnete Aufgabe: zuerst die L8-Aufgaben-Kopfkarte mit „Aufgabe X“, Titel, genau einer kurzen Anweisung und Fortschrittsbalken; danach genau eine L8-Aufgabenkarte für den Inhalt.
- Buttons, Eingaben, Multiple Choice, Tabellen, Feedback, Rundungen, Abstände und mobile Darstellung verwenden die L8-Komponenten und L8-Klassen.
- Karteikarten verwenden den L8T1-Karteikartenstandard mit Vorderseite, Bild, Muttersprache, Rückseite, Wort, Plural/Perfekt/Beispiel, Anhören, Sprechen und Schreiben.
- Richtige Einzelantworten gehen automatisch zum nächsten Item. Es darf keinen konkurrierenden Timer geben.
- Falsch beantwortete Items werden später erneut gezeigt, bis sie richtig gelöst wurden.
- **Automatisches Scrollen ist verbindlich:** Beim Öffnen und nach dem Wechsel zum nächsten Item wird zur aktiven Aufgabenkarte gescrollt. Reines Fehlerfeedback darf nicht unnötig neu scrollen. Technische Standardbasis: `/js/sp-task-runtime-standard.js`.
- **Fortschritt wird immer gespeichert:** lokaler Zustand sofort; sichtbarer Aufgabenfortschritt zusätzlich zentral über `/js/progress.js` und `recordTaskProgress(...)`. Falls `SPProgress` noch nicht geladen ist, muss wie in L4 über `SP_PROGRESS_QUEUE` gespeichert und das Modul nachgeladen werden.
- **Punktesystem ist verbindlich wie in L4:** Lernaufgaben geben bei 100 % im 1./2./3. Durchlauf 5/10/15 Punkte. Prüfungen haben im 1./2./3. Durchlauf maximal 100/200/300 Punkte und vergeben Punkte proportional zum Ergebnis.
- **Dashboard-Verbindung ist verpflichtend:** Punkte und Fortschritte werden in denselben zentralen Progress-Datensatz geschrieben und mit den Gesamtpunkten im Schüler-Dashboard zusammengezählt. Kein Thema darf ein isoliertes eigenes Punktesystem führen.
- Am Ende einer Lernaufgabe muss sichtbar sein, dass die Punkte gespeichert wurden bzw. wie viele Punkte gerade erreicht wurden.
- Der zentrale ausführliche Standard dazu steht in `wortschatz/AUFGABEN-FORTSCHRITT-STANDARD.md`.
- Lehrer-Vorschau speichert keinen Teilnehmerfortschritt, muss aber innerhalb der Sitzung normal weiterlaufen können; dafür wird nur temporärer Sitzungsstatus verwendet.
- Bilder: Bunny Storage `https://sprachpilot.b-cdn.net/name.webp`.
- Audio: Bunny Storage `https://sprachpilot.b-cdn.net/audio/name.mp3`; nur bei technischem Fehlschlag darf die vorhandene Sprachsynthese als Fallback dienen.
- Abschluss einer Aufgabe: L8-Feedbackscreen „Gut gemacht!“.
- Prüfung: Stern-Emoji, bis zum Abschluss aller Lernaufgaben gesperrt, danach normales L8/L9-Design.

## Verbindlicher Wortschatz-Übersicht-Standard

Für alle L9-Wortschatzübersichten gilt zusätzlich der zentrale Standard `wortschatz/UEBERSICHT-STANDARD.md`.

Referenz: `/wortschatz/A1-Lektion-9/Thema-1/uebersicht.html`.

Diese Seite wird 1:1 als Struktur- und Designvorlage benutzt. Bei neuen Themen dürfen an der Übersicht nur geändert werden:

1. Wortschatz/Inhalt,
2. Übersetzungen,
3. Bilder und Audio,
4. Lektionsfarbe.

Nicht geändert werden dürfen Aufbau, Größen, Abstände, Kartenform, Gruppenaufbau, Audio-Button, responsive Darstellung oder Lade-Reihenfolge.
