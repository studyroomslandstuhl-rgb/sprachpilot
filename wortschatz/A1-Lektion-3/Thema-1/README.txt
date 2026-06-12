UPLOAD-STRUKTUR

Lege diesen Ordner so ab:

wortschatz/
└── A1-Lektion-3/
    ├── bilder/
    │   ├── brot.png
    │   ├── apfel.png
    │   └── ...
    └── Thema-1/
        ├── index.html
        ├── app.js
        ├── style.css
        └── ...

Die Bildpfade im Code sind jetzt:
../bilder/<dateiname>.png

Dashboard-Vorbereitung:
localStorage-Key: SP_TEACHER_A1_L3_T1

Beispiel:
localStorage.setItem("SP_TEACHER_A1_L3_T1", JSON.stringify({
  activeWords: ["brot","apfel","milch"],
  tasks: ["karteikarten.html","bild-wort.html","artikel.html"]
}));
