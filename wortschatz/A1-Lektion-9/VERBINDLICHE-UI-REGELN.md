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
