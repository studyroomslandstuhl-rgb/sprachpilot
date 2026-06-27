# SprachPilot Bilder-System – Schritt 16

## Entscheidung

Alle Bilder sollen langfristig in einen zentralen Ordner:

```text
/assets/img/
```

Damit können Bilder aus einer Lektion später in anderen Lektionen wiederverwendet werden.

## Warum noch nicht alles verschieben?

Aktuell greifen viele Aufgaben direkt auf alte Pfade zu, z. B.:

```text
verben-A1/bilder/...
wortschatz/A1-Lektion-3/...
wortschatz/A1-Lektion-4/...
```

Wenn wir alle Bilder sofort verschieben, würden viele Aufgaben kaputtgehen. Deshalb ist Schritt 16 nur die sichere Vorbereitung.

## Neue Dateien

- `/assets/img/README.md`
- `/assets/img/sprachpilot-image-registry.json`
- `/shared/sprachpilot-assets.js`

## Nutzung in neuen/umgebauten Aufgaben

```html
<script src="/shared/sprachpilot-assets.js"></script>
```

```js
const src = spImagePath("kaufen.png");
const srcForLesson4 = spImagePath("wohnung.png", { lesson: 4 });
```

Oder direkt als HTML:

```js
area.innerHTML = spImgTag("kaufen.png", "kaufen", "task-img");
```

## Ergebnis der Analyse

Gefundene Bilddateien: **412**
Doppelte/ähnliche Namen: **41**

Typische Dopplungen/Großschreibungsprobleme:

- `antworten`: verben-A1/bilder/antworten.PNG, verben-A1/bilder/antworten.png, verben-A1/bilder/antworten.png.PNG
- `bedeuten`: verben-A1/bilder/bedeuten.PNG, verben-A1/bilder/bedeuten.png, verben-A1/bilder/bedeuten.png.PNG
- `blau`: wortschatz/A1-Lektion-4/bilder/blau.PNG, wortschatz/A1-Lektion-4/bilder/blau.png
- `dunkelblau`: wortschatz/A1-Lektion-4/bilder/dunkelblau.PNG, wortschatz/A1-Lektion-4/bilder/dunkelblau.png
- `dunkelbraun`: wortschatz/A1-Lektion-4/bilder/dunkelbraun.PNG, wortschatz/A1-Lektion-4/bilder/dunkelbraun.png
- `dunkelgelb`: wortschatz/A1-Lektion-4/bilder/dunkelgelb.PNG, wortschatz/A1-Lektion-4/bilder/dunkelgelb.png
- `dunkelgrau`: wortschatz/A1-Lektion-4/bilder/dunkelgrau.PNG, wortschatz/A1-Lektion-4/bilder/dunkelgrau.png
- `dunkelgruen`: wortschatz/A1-Lektion-4/bilder/dunkelgruen.PNG, wortschatz/A1-Lektion-4/bilder/dunkelgruen.png
- `dunkellila`: wortschatz/A1-Lektion-4/bilder/dunkellila.PNG, wortschatz/A1-Lektion-4/bilder/dunkellila.png
- `dunkelrosa`: wortschatz/A1-Lektion-4/bilder/dunkelrosa.PNG, wortschatz/A1-Lektion-4/bilder/dunkelrosa.png
- `dunkelrot`: wortschatz/A1-Lektion-4/bilder/dunkelrot.PNG, wortschatz/A1-Lektion-4/bilder/dunkelrot.png
- `gelb`: wortschatz/A1-Lektion-4/bilder/gelb.PNG, wortschatz/A1-Lektion-4/bilder/gelb.png
- `grau`: wortschatz/A1-Lektion-4/bilder/grau.PNG, wortschatz/A1-Lektion-4/bilder/grau.png
- `gruen`: wortschatz/A1-Lektion-4/bilder/gruen.PNG, wortschatz/A1-Lektion-4/bilder/gruen.png
- `hellblau`: wortschatz/A1-Lektion-4/bilder/hellblau.PNG, wortschatz/A1-Lektion-4/bilder/hellblau.png
- `hellbraun`: wortschatz/A1-Lektion-4/bilder/hellbraun.PNG, wortschatz/A1-Lektion-4/bilder/hellbraun.png
- `hellgelb`: wortschatz/A1-Lektion-4/bilder/hellgelb.PNG, wortschatz/A1-Lektion-4/bilder/hellgelb.png
- `hellgrau`: wortschatz/A1-Lektion-4/bilder/hellgrau.PNG, wortschatz/A1-Lektion-4/bilder/hellgrau.png
- `hellgruen`: wortschatz/A1-Lektion-4/bilder/hellgruen.PNG, wortschatz/A1-Lektion-4/bilder/hellgruen.png
- `helllila`: wortschatz/A1-Lektion-4/bilder/helllila.PNG, wortschatz/A1-Lektion-4/bilder/helllila.png
- `hellrosa`: wortschatz/A1-Lektion-4/bilder/hellrosa.PNG, wortschatz/A1-Lektion-4/bilder/hellrosa.png
- `hellrot`: wortschatz/A1-Lektion-4/bilder/hellrot.PNG, wortschatz/A1-Lektion-4/bilder/hellrot.png
- `kaffeemaschine`: wortschatz/A1-Lektion-3/bilder/kaffeemaschine.png, wortschatz/A1-Lektion-4/bilder/Kaffeemaschine.png, wortschatz/A1-Lektion-4/bilder/kaffeemaschine.png
- `kinderzimmer`: wortschatz/A1-Lektion-4/bilder/Kinderzimmer.png, wortschatz/A1-Lektion-4/bilder/kinderzimmer.png
- `laden`: verben-A1/bilder/laden.PNG, verben-A1/bilder/laden.png, verben-A1/bilder/laden.png.PNG
- `lassen`: verben-A1/bilder/lassen.PNG, verben-A1/bilder/lassen.png, verben-A1/bilder/lassen.png.PNG
- `lila`: wortschatz/A1-Lektion-4/bilder/lila.PNG, wortschatz/A1-Lektion-4/bilder/lila.png
- `nehmen`: verben-A1/bilder/nehmen.PNG, verben-A1/bilder/nehmen.png, verben-A1/bilder/nehmen.png.PNG
- `orange`: wortschatz/A1-Lektion-3/bilder/orange.png, wortschatz/A1-Lektion-4/bilder/orange.png
- `raten`: verben-A1/bilder/raten.PNG, verben-A1/bilder/raten.png, verben-A1/bilder/raten.png.PNG

## Nächster sinnvoller Schritt

Nicht alle Bilder auf einmal verschieben. Besser:

1. Neue Aufgaben nutzen ab jetzt `spImagePath(...)`.
2. Pro Bereich Bilder nach `/assets/img/...` kopieren.
3. Aufgabenpfade nach und nach umstellen.
4. Erst nach Tests alte Duplikate löschen.
