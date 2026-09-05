# Verbindlicher Wortschatz-Übersicht-Standard

Referenzseite: `/wortschatz/A1-Lektion-9/Thema-1/uebersicht.html`

Diese Übersicht ist ab jetzt die verbindliche Vorlage für neue Wortschatz-Übersichten in SprachPilot. Struktur, Design, Abstände, Karten, responsive Verhalten und Bedienung werden nicht neu erfunden. Bei einer neuen Lektion oder einem neuen Thema dürfen nur **Inhalt** und **Lektionsfarbe** geändert werden.

## 1. Lade-Reihenfolge

- Die globale SprachPilot-Leiste muss immer zuerst sichtbar werden.
- Der Seiteninhalt bleibt bis zum Laden der `.sp-header` verborgen.
- Dafür wird im HTML `class="sp-header-first"` gesetzt und `/css/sp-header-first.css` sowie `/js/sp-header-first-gate.js` geladen.
- Erst nach der globalen Leiste wird die Übersicht sichtbar.
- Es darf keine zweite lokale Topbar oder Navigationsleiste geben.

## 2. Feste Übersichtsstruktur

Die Struktur entspricht exakt der Referenz L9T1:

1. globale SprachPilot-Leiste
2. Intro-Karte mit `WORTSCHATZÜBERSICHT`, Titel und einem kurzen Satz
3. Wortgruppen als weiße Standardkarten
4. pro Wort eine horizontale Wortzeile
5. Footer `© SprachPilot`

Jede Wortzeile zeigt:

- Bild links
- deutsches Wort mit Artikel bzw. vollständigem Ausdruck
- vorhandene grammatische Zusatzinformation: Plural und bei Verben Perfekt
- vorhandenen kurzen Beispielsatz
- genau eine Übersetzung in der Muttersprache des Teilnehmers
- rechts den Button `🔊 Hören`

## 3. Feste Gruppen

Standardgruppen:

- Nomen
- Verben
- Adjektive
- Weitere Wörter
- Redewendungen

Die Gruppierung darf inhaltlich passend befüllt werden; das Layout der Gruppen bleibt identisch.

## 4. Bilder und Audio

- Bilder kommen aus Bunny Storage: `https://sprachpilot.b-cdn.net/name.webp`.
- Audio kommt aus Bunny Storage: `https://sprachpilot.b-cdn.net/audio/name.mp3`.
- Falls eine Audiodatei technisch nicht geladen werden kann, darf die deutsche Sprachsynthese als Fallback genutzt werden.
- Bilder und Audio werden in der Daten-/Theme-Datei angegeben, nicht durch eigenes Seitenlayout ersetzt.

## 5. Design

Die zentrale Designbasis ist:

- `/css/sp-vocab-overview-standard.css`
- `/js/sp-vocab-overview-standard.js`

Theme-spezifisch werden nur CSS-Farbvariablen wie `--lesson-main`, `--lesson-main-dark`, `--lesson-soft`, `--lesson-line` usw. gesetzt.

Keine neue Theme-CSS darf die Größen, Abstände, Rundungen, Raster, Zeilenstruktur oder responsive Darstellung der Übersicht verändern.

## 6. Technische Nutzung

Eine Themen-Datei liefert nur die Daten an `SPWordOverviewStandard.render(...)`, z. B. Wörter, Titel, Muttersprache und Header-Untertitel. Der zentrale Renderer erzeugt die Oberfläche.

Damit gilt verbindlich: **gleiche Übersicht, nur anderer Inhalt und andere Farbe.**
