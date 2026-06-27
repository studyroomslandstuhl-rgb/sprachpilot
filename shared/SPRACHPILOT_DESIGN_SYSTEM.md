# SprachPilot Design-System v15

## Grundregel

- Alle Nicht-Lektionsseiten nutzen die festen SprachPilot-Farben: Babyblau, Blau, Weiß und brauner Akzent.
- Sobald man eine Lektion öffnet, nutzt die gesamte Lektion ihre eigene Lektionsfarbe.
- Struktur bleibt überall gleich: Header, Account-Leiste, Navigation, Karten, Fortschrittskarte, Aufgaben-Grid und Abschlussboxen.
- Vorbild für Layout und Abstände bleibt Lektion 4 / Thema 2.

## Neue zentrale Dateien

- `/shared/sprachpilot-design-system.css`
- `/shared/sprachpilot-design-system.js`

Diese Dateien sind die neue Basis für zukünftige Umbauten. Alte Seiten werden Schritt für Schritt migriert, damit nicht alles auf einmal kaputtgeht.

## Klassen für neue Seiten

Nicht-Lektionsseiten:

```html
<link rel="stylesheet" href="/shared/sprachpilot-design-system.css">
<body class="sp-nonlesson">
  <div class="sp-shell">
    <header class="sp-topbar" id="spHeader"></header>
    <section class="sp-card">...</section>
  </div>
  <script src="/shared/sprachpilot-design-system.js"></script>
</body>
```

Lektionsseiten:

```html
<link rel="stylesheet" href="/shared/sprachpilot-design-system.css">
<body class="sp-lesson" data-lesson="4">
```

## Farben

- Nicht-Lektionen: `--sp-blue`, `--sp-baby`, `--sp-white`, `--sp-accent`
- Lektion 3: Orange
- Lektion 4: Gelb
- Weitere Lektionen bekommen später eigene `data-lesson` Farbvariablen.

## Logo

Oben links wird immer `/assets/logo/sprachpilot-logo.png` genutzt. Das Logo ist gleichzeitig der Startseiten-Link.

## Wichtig

Diese Stufe bereitet das globale Designsystem vor. Noch nicht alle alten Seiten sind vollständig umgestellt. Die nächsten Schritte migrieren die alten Bereiche Ordner für Ordner.


## Schritt 16 – Bilder-System

Bilder werden langfristig zentral unter `/assets/img/` gesammelt. Alte Bildpfade werden noch nicht gelöscht oder verschoben.

Neue/umgebaute Aufgaben können `/shared/sprachpilot-assets.js` nutzen:

```js
spImagePath("kaufen.png")
spImagePath("wohnung.png", { lesson: 4 })
```

Das erlaubt zentrale Bilder und sichere Rückfälle auf alte Pfade.
