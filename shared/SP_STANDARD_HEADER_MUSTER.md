# SprachPilot Standard-Header Muster

Stand: 2026-07-30

Diese Vorlage ist der feste Standard fuer neue oder bereinigte Themen-Seiten. Sie wurde aus dem reparierten L7T1-Header abgeleitet: gleiche Funktionen, gleiches Design, kein dauerndes Neuzeichnen, stabile Buttons.

## Datei

```text
/shared/sp-standard-header-template.js
```

Diese Datei ist eine Vorlage. Sie wird nur auf Seiten eingebunden, die bewusst migriert wurden.

## Was gleich bleiben muss

Nicht veraendern:

- Button-Reihenfolge: Logo/Name/Dashboard/Profil/Abmelden, unten Zurueck, Uebersicht, Fortschritte loeschen in Rot
- Klicklogik ueber `data-sp-action` und `data-sp-href`
- zentraler Klick-Handler mit `event.stopImmediatePropagation()`
- `headerKey`, damit der Header nicht bei jeder kleinen Seitenaenderung neu gezeichnet wird
- `goBack()` mit vorheriger SprachPilot-Seite plus Fallback
- kompaktes weisses Header-Design mit Lektionsfarbe als Akzent

## Was pro Lektion/Thema angepasst werden darf

Nur diese Werte duerfen pro Seite gesetzt werden:

```html
<script>
window.SP_STANDARD_HEADER = {
  lessonTitle: 'koennen, wollen und moechten',
  subtitle: 'A1 Lektion 7 · Thema 1',
  lessonColor: '#7c3aed',
  lessonDark: '#4c1d95',
  lessonSoft: '#f5f0ff',
  lessonLine: '#d8b4fe',
  lessonBg: '#f7f2ff',
  backHref: '../index.html',
  overviewHref: 'uebersicht.html?v=DEINE_VERSION'
};
</script>
<script src="/shared/sp-standard-header-template.js?v=DEINE_VERSION"></script>
```

## Pflicht im Body

```html
<body class="sp-standard-page" data-page="theme" data-lesson="7" data-theme="1">
  <div id="app"></div>
</body>
```

`data-page` bestimmt den Zurueck-Fallback:

- `lesson`: zur Wortschatz-Uebersicht
- `theme`: zur Lektionsuebersicht
- `overview`: zur Themenuebersicht
- `task`: zur Themenuebersicht

## Button-Funktionen

- Logo: `/index.html`
- Dashboard: Lehrer zu `/teacher/index.html`, Schueler zu `/student-dashboard/index.html`
- Profil: `/profile/index.html`
- Abmelden: leert Login-/Preview-Daten und geht zu `/index.html`
- Zurueck: nutzt zuerst Browser-History innerhalb SprachPilot, sonst Fallback
- Uebersicht: nutzt `overviewHref`
- Fortschritte loeschen: erscheint auf allen Nicht-Aufgaben-Seiten als roter Button; auf Aufgaben-Seiten nicht

## Wichtig fuer kuenftige Arbeit

Wenn eine Seite diesen Standard bekommt, alte Header auf dieser Seite entfernen. Nicht zwei Header-Systeme gleichzeitig laden.

Wenn ein Button nicht funktioniert, zuerst pruefen:

1. Wird `/shared/sp-standard-header-template.js` wirklich geladen?
2. Hat der Button `data-sp-action` oder `data-sp-href`?
3. Wird der Header dauernd neu erzeugt? Dann fehlt vermutlich die `headerKey`-Logik.
4. Ist der letzte GitHub-Deploy gruen?

## Beispiel fuer L7T1

L7T1 nutzt aktuell dieselbe reparierte Logik direkt in:

```text
/wortschatz/A1-Lektion-7/Thema-1/l7t1-bunny-word-audio.js
```

Die Vorlage hier ist dafuer da, diese Logik spaeter sauber und unveraendert auf weitere Themen zu uebertragen.
