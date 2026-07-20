# SprachPilot · A1 Lektion 7

## Status

Die erste vollständige interaktive Version von Lektion 7 ist aufgebaut:

- Thema 1: 19 Aufgaben
- Thema 2: 21 Aufgaben
- Thema 3: 22 Aufgaben
- Thema 4: 23 Aufgaben
- insgesamt: 85 Aufgaben mit 678 Übungsitems

Jedes Thema besitzt eine eigene Übersicht, eine gesperrte Themenprüfung und ein gemeinsames interaktives Aufgabensystem. Hörinhalte werden in dieser ersten Version über die deutsche Browser-Sprachausgabe wiedergegeben. Eigene MP3-Dateien können später ergänzt werden. Bilder werden über das SprachPilot-CDN geladen; fehlt ein Bild, erscheint automatisch eine Bedeutungskarte.

## Technische Seiten

- [`index.html`](./index.html) – Übersicht Lektion 7
- `Thema-1/index.html` bis `Thema-4/index.html` – Themenübersichten
- `Thema-1/task.html` bis `Thema-4/task.html` – gemeinsamer Aufgabentyp pro Thema
- `Thema-1/data-loader.js` bis `Thema-4/data-loader.js` – vollständige interaktive Datensätze
- [`shared/l7-state.js`](./shared/l7-state.js) – Fortschritt, Fehlerwiederholung, Punkte und Prüfungssperre
- [`shared/l7-ui.js`](./shared/l7-ui.js) – gemeinsame Aufgabenoberfläche
- [`shared/l7-style.css`](./shared/l7-style.css) – gemeinsames Design

## Verbindliche Quelldateien

Der vollständige Arbeitsauftrag ist in [`ARBEITS-PROMPT.md`](./ARBEITS-PROMPT.md) gespeichert. Die vier `STRUKTUR.md`-Dateien legen die Aufgabenfolge fest. Die vollständigen Aufgabeninhalte, Hörtexte, Schreibaufträge, Prüfungen und Lösungen stehen in:

- [`Thema-1/INHALTE.md`](./Thema-1/INHALTE.md) – können, wollen und möchten
- [`Thema-2/INHALTE.md`](./Thema-2/INHALTE.md) – Perfekt mit haben
- [`Thema-3/INHALTE.md`](./Thema-3/INHALTE.md) – Perfekt mit sein und haben/sein
- [`Thema-4/INHALTE.md`](./Thema-4/INHALTE.md) – Kommunikation in der Schule

## Übergeordnete Lernziele

Die Lernenden sollen:

- **können** und **wollen** konjugieren und anwenden,
- Fragen und Aussagesätze mit Modalverben bilden,
- Fähigkeiten, Wünsche und Absichten ausdrücken,
- **wollen** und **möchten** unterscheiden,
- Freizeit- und Hobbywortschatz wiederholen,
- das Perfekt mit **haben** bilden,
- häufige Partizip-II-Formen erkennen, schreiben und aktiv verwenden,
- das Perfekt mit Bewegungsverben und **sein** bilden,
- **haben** und **sein** als Hilfsverben unterscheiden,
- einfache schulische Mitteilungen und Entschuldigungen verstehen und schreiben,
- Gespräche mit Schule oder Sekretariat führen.

## Verbindliche didaktische und technische Regeln

1. Alle Inhalte bleiben auf A1-Niveau.
2. Neue Strukturen werden zuerst erkannt, dann kontrolliert geübt und anschließend selbstständig angewendet.
3. Alle relevanten Nomen werden mit Artikel, Singular und Plural trainiert.
4. Geschlossene Aufgaben besitzen genau eine eindeutige Lösung.
5. Eine falsch beantwortete Aufgabe bleibt stehen, bis sie richtig gelöst ist, und erscheint danach am Ende erneut.
6. Dreistufige Hilfe: erster Fehler = falsch, zweiter Fehler = konkreter Hinweis, ab drittem Fehler = Lösung; die richtige Antwort muss anschließend selbst eingegeben werden.
7. Sprechaufgaben besitzen immer einen sichtbaren Schreib-Fallback. Ein technischer Mikrofonfehler zählt nicht als falsche Antwort.
8. Angefangene Aufgaben und freie Texte werden pro Teilnehmer gespeichert.
9. Eine Themenprüfung öffnet erst, wenn alle vorherigen Aufgaben des Themas zu 100 % abgeschlossen sind.
10. Erstversuche werden für das Prüfungsergebnis getrennt erfasst.
11. Lehrer-Vorschau verändert keine Teilnehmerpunkte oder Teilnehmerfortschritte.
12. Thema 2 verwendet ausschließlich Perfekt mit **haben**.
13. Thema 3 beginnt ausschließlich mit Perfekt mit **sein**; erst danach werden **haben** und **sein** verglichen.
14. Keine Passivformen.
15. Das unklare Wort **„Direktometer“** wird nicht aufgenommen.

## Themenübersicht

### Thema 1 · können, wollen und möchten

Fähigkeiten, Wünsche, Pläne, Satzklammer, Fragen, Abstufungen, höfliche Wünsche und Hobbywortschatz. 19 Aufgaben.

### Thema 2 · Perfekt mit haben

Partizip-II-Formen, Endungen **-t/-en**, Satzklammer, Zeitangaben, Lesen und Hören. 21 Aufgaben.

### Thema 3 · Perfekt mit sein

Bewegungsverben und Formen von **sein**, danach die Unterscheidung **haben/sein**. 22 Aufgaben in zwei klar getrennten Phasen.

### Thema 4 · Kommunikation in der Schule

Schulwortschatz, Mitteilungen, Entschuldigungen, Telefongespräche, Lesen, Hören, Schreiben und Sprechen. 23 Aufgaben.

## Noch offen für spätere Ausbaustufen

- eigene MP3-Dateien statt Browser-Sprachausgabe,
- praktische Kontrolle aller Mikrofonvarianten auf verschiedenen Android-Geräten,
- Kontrolle und Ergänzung aller gewünschten CDN-Bilder,
- zusätzliche redaktionelle Feinkorrekturen nach dem ersten Unterrichtstest.
