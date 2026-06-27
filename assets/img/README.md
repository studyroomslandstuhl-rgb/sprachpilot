# Zentraler Bilderordner SprachPilot

Dieser Ordner ist der zukünftige zentrale Ort für wiederverwendbare Bilder.

## Ziel

Bilder sollen später nicht mehr pro Lektion doppelt gespeichert werden. Ein Bild kann dann z. B. in Lektion 1 und Lektion 5 genutzt werden.

Geplante Struktur:

```text
/assets/img/
  verben/
  wortschatz/
    wohnen/
    einkaufen/
    wohnungsanzeigen/
  grammatik/
  ui/
```

## Aktueller Stand

In diesem Schritt wurden **noch keine bestehenden Bilder verschoben**, damit keine vorhandenen Aufgaben kaputtgehen.

Stattdessen gibt es jetzt:

- `/shared/sprachpilot-assets.js`
- `/assets/img/sprachpilot-image-registry.json`

Damit können neue oder umgebaute Aufgaben Bilder zentral anfragen und trotzdem auf alte Bildpfade zurückfallen.

## Wichtig

Alte Pfade bleiben vorerst gültig. Die echte Migration erfolgt später ordnerweise.

Gefundene Bilddateien im Projekt: **412**
Gefundene doppelte/ähnliche Bildnamen: **41**
