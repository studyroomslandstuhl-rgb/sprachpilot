// verbs.js
// SprachPilot – Verben A1
// Reines Datenmodul. Keine Firebase-Logik, keine Fortschrittslogik.
// Bildpfad: bilder/verbname.png ohne Text im Bild.

export const VERBS = {
  "lieben": {
    image: "bilder/lieben.png",
    level: "A1",
    topic: "Basis",
    irregular: false,
    translationKey: "lieben",
    sentenceKey: "lieben",
    description: "Person zeigt ein Herz"
  },

  "kaufen": {
    image: "bilder/kaufen.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "kaufen",
    sentenceKey: "kaufen",
    description: "Person kauft im Geschäft"
  },

  "verstehen": {
    image: "bilder/verstehen.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "verstehen",
    sentenceKey: "verstehen",
    description: "Person versteht"
  },

  "brauchen": {
    image: "bilder/brauchen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "brauchen",
    sentenceKey: "brauchen",
    description: "Person braucht eine Tasche"
  },

  "hören": {
    image: "bilder/hoeren.png",
    level: "A1",
    topic: "Wahrnehmung",
    irregular: false,
    translationKey: "hören",
    sentenceKey: "hören",
    description: "Person hört Musik"
  },

  "lernen": {
    image: "bilder/lernen.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "lernen",
    sentenceKey: "lernen",
    description: "Person lernt Deutsch"
  },

  "wohnen": {
    image: "bilder/wohnen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "wohnen",
    sentenceKey: "wohnen",
    description: "Person wohnt in einer Stadt"
  },

  "bringen": {
    image: "bilder/bringen.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "bringen",
    sentenceKey: "bringen",
    description: "Person bringt etwas"
  },

  "sein": {
    image: "bilder/sein.png",
    level: "A1",
    topic: "Basis",
    irregular: true,
    translationKey: "sein",
    sentenceKey: "sein",
    description: "Person ist da"
  },

  "schreiben": {
    image: "bilder/schreiben.png",
    level: "A1",
    topic: "Kurs",
    irregular: true,
    translationKey: "schreiben",
    sentenceKey: "schreiben",
    description: "Person schreibt"
  },

  "fotografieren": {
    image: "bilder/fotografieren.png",
    level: "A1",
    topic: "Freizeit",
    irregular: false,
    translationKey: "fotografieren",
    sentenceKey: "fotografieren",
    description: "Person fotografiert"
  },

  "telefonieren": {
    image: "bilder/telefonieren.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "telefonieren",
    sentenceKey: "telefonieren",
    description: "Person telefoniert"
  },

  "kochen": {
    image: "bilder/kochen.png",
    level: "A1",
    topic: "Kochen",
    irregular: false,
    translationKey: "kochen",
    sentenceKey: "kochen",
    description: "Person kocht"
  },

  "leben": {
    image: "bilder/leben.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "leben",
    sentenceKey: "leben",
    description: "Person lebt in Deutschland"
  },

  "kommen": {
    image: "bilder/kommen.png",
    level: "A1",
    topic: "Bewegung",
    irregular: true,
    translationKey: "kommen",
    sentenceKey: "kommen",
    description: "Person kommt"
  },

  "buchstabieren": {
    image: "bilder/buchstabieren.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "buchstabieren",
    sentenceKey: "buchstabieren",
    description: "Person buchstabiert"
  },

  "gehen": {
    image: "bilder/gehen.png",
    level: "A1",
    topic: "Bewegung",
    irregular: true,
    translationKey: "gehen",
    sentenceKey: "gehen",
    description: "Person geht"
  },

  "schwimmen": {
    image: "bilder/schwimmen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: true,
    translationKey: "schwimmen",
    sentenceKey: "schwimmen",
    description: "Person schwimmt"
  },

  "suchen": {
    image: "bilder/suchen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "suchen",
    sentenceKey: "suchen",
    description: "Person sucht"
  },

  "bestellen": {
    image: "bilder/bestellen.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "bestellen",
    sentenceKey: "bestellen",
    description: "Person bestellt"
  },

  "weinen": {
    image: "bilder/weinen.png",
    level: "A1",
    topic: "Gefühle",
    irregular: false,
    translationKey: "weinen",
    sentenceKey: "weinen",
    description: "Person weint"
  },

  "reparieren": {
    image: "bilder/reparieren.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "reparieren",
    sentenceKey: "reparieren",
    description: "Person repariert"
  },

  "gewinnen": {
    image: "bilder/gewinnen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: true,
    translationKey: "gewinnen",
    sentenceKey: "gewinnen",
    description: "Person gewinnt"
  },

  "spielen": {
    image: "bilder/spielen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: false,
    translationKey: "spielen",
    sentenceKey: "spielen",
    description: "Person spielt"
  },

  "springen": {
    image: "bilder/springen.png",
    level: "A1",
    topic: "Bewegung",
    irregular: true,
    translationKey: "springen",
    sentenceKey: "springen",
    description: "Person springt"
  },

  "verlieren": {
    image: "bilder/verlieren.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "verlieren",
    sentenceKey: "verlieren",
    description: "Person verliert"
  },

  "fragen": {
    image: "bilder/fragen.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "fragen",
    sentenceKey: "fragen",
    description: "Person fragt"
  },

  "verkaufen": {
    image: "bilder/verkaufen.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "verkaufen",
    sentenceKey: "verkaufen",
    description: "Person verkauft"
  },

  "unterschreiben": {
    image: "bilder/unterschreiben.png",
    level: "A1",
    topic: "Büro",
    irregular: false,
    translationKey: "unterschreiben",
    sentenceKey: "unterschreiben",
    description: "Person unterschreibt"
  },

  "reservieren": {
    image: "bilder/reservieren.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "reservieren",
    sentenceKey: "reservieren",
    description: "Person reserviert"
  },

  "buchen": {
    image: "bilder/buchen.png",
    level: "A1",
    topic: "Reisen",
    irregular: false,
    translationKey: "buchen",
    sentenceKey: "buchen",
    description: "Person bucht"
  },

  "machen": {
    image: "bilder/machen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "machen",
    sentenceKey: "machen",
    description: "Person macht etwas"
  },

  "malen": {
    image: "bilder/malen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: false,
    translationKey: "malen",
    sentenceKey: "malen",
    description: "Person malt"
  },

  "trinken": {
    image: "bilder/trinken.png",
    level: "A1",
    topic: "Essen",
    irregular: true,
    translationKey: "trinken",
    sentenceKey: "trinken",
    description: "Person trinkt"
  },

  "schicken": {
    image: "bilder/schicken.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "schicken",
    sentenceKey: "schicken",
    description: "Person schickt eine Nachricht"
  },

  "denken": {
    image: "bilder/denken.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "denken",
    sentenceKey: "denken",
    description: "Person denkt"
  },

  "winken": {
    image: "bilder/winken.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "winken",
    sentenceKey: "winken",
    description: "Person winkt"
  },

  "hassen": {
    image: "bilder/hassen.png",
    level: "A1",
    topic: "Gefühle",
    irregular: false,
    translationKey: "hassen",
    sentenceKey: "hassen",
    description: "Person mag etwas gar nicht"
  },

  "beißen": {
    image: "bilder/beissen.png",
    level: "A1",
    topic: "Essen",
    irregular: true,
    translationKey: "beißen",
    sentenceKey: "beißen",
    description: "Person beißt"
  },

  "gießen": {
    image: "bilder/giessen.png",
    level: "A1",
    topic: "Haushalt",
    irregular: true,
    translationKey: "gießen",
    sentenceKey: "gießen",
    description: "Person gießt Pflanzen"
  },

  "reißen": {
    image: "bilder/reissen.png",
    level: "A1",
    topic: "Kurs",
    irregular: true,
    translationKey: "reißen",
    sentenceKey: "reißen",
    description: "Person reißt Papier"
  },

  "putzen": {
    image: "bilder/putzen.png",
    level: "A1",
    topic: "Haushalt",
    irregular: false,
    translationKey: "putzen",
    sentenceKey: "putzen",
    description: "Person putzt"
  },

  "küssen": {
    image: "bilder/kuessen.png",
    level: "A1",
    topic: "Familie",
    irregular: false,
    translationKey: "küssen",
    sentenceKey: "küssen",
    description: "Person küsst"
  },

  "tanzen": {
    image: "bilder/tanzen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: false,
    translationKey: "tanzen",
    sentenceKey: "tanzen",
    description: "Person tanzt"
  },

  "mixen": {
    image: "bilder/mixen.png",
    level: "A1",
    topic: "Kochen",
    irregular: false,
    translationKey: "mixen",
    sentenceKey: "mixen",
    description: "Person mixt"
  },

  "reisen": {
    image: "bilder/reisen.png",
    level: "A1",
    topic: "Reisen",
    irregular: false,
    translationKey: "reisen",
    sentenceKey: "reisen",
    description: "Person reist"
  },

  "haben": {
    image: "bilder/haben.png",
    level: "A1",
    topic: "Basis",
    irregular: true,
    translationKey: "haben",
    sentenceKey: "haben",
    description: "Person hat eine Tasche"
  },

  "überqueren": {
    image: "bilder/ueberqueren.png",
    level: "A1",
    topic: "Verkehr",
    irregular: false,
    translationKey: "überqueren",
    sentenceKey: "überqueren",
    description: "Person überquert die Straße"
  },

  "grüßen": {
    image: "bilder/gruessen.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "grüßen",
    sentenceKey: "grüßen",
    description: "Person grüßt"
  },

  "genießen": {
    image: "bilder/geniessen.png",
    level: "A1",
    topic: "Gefühle",
    irregular: false,
    translationKey: "genießen",
    sentenceKey: "genießen",
    description: "Person genießt das Essen"
  },

  "singen": {
    image: "bilder/singen.png",
    level: "A1",
    topic: "Freizeit",
    irregular: true,
    translationKey: "singen",
    sentenceKey: "singen",
    description: "Person singt"
  },

  "schließen": {
    image: "bilder/schliessen.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "schließen",
    sentenceKey: "schließen",
    description: "Person schließt die Tür"
  },

  "rennen": {
    image: "bilder/rennen.png",
    level: "A1",
    topic: "Bewegung",
    irregular: false,
    translationKey: "rennen",
    sentenceKey: "rennen",
    description: "Person rennt"
  },

  "lachen": {
    image: "bilder/lachen.png",
    level: "A1",
    topic: "Gefühle",
    irregular: false,
    translationKey: "lachen",
    sentenceKey: "lachen",
    description: "Person lacht"
  },

  "warten": {
    image: "bilder/warten.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "warten",
    sentenceKey: "warten",
    description: "Person wartet"
  },

  "arbeiten": {
    image: "bilder/arbeiten.png",
    level: "A1",
    topic: "Beruf",
    irregular: false,
    translationKey: "arbeiten",
    sentenceKey: "arbeiten",
    description: "Person arbeitet"
  },

  "finden": {
    image: "bilder/finden.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "finden",
    sentenceKey: "finden",
    description: "Person findet etwas"
  },

  "benutzen": {
    image: "bilder/benutzen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "benutzen",
    sentenceKey: "benutzen",
    description: "Person benutzt ein Gerät"
  },

  "rechnen": {
    image: "bilder/rechnen.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "rechnen",
    sentenceKey: "rechnen",
    description: "Person rechnet"
  },

  "zeichnen": {
    image: "bilder/zeichnen.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "zeichnen",
    sentenceKey: "zeichnen",
    description: "Person zeichnet"
  },

  "öffnen": {
    image: "bilder/oeffnen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "öffnen",
    sentenceKey: "öffnen",
    description: "Person öffnet die Tür"
  },

  "wiederholen": {
    image: "bilder/wiederholen.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "wiederholen",
    sentenceKey: "wiederholen",
    description: "Person wiederholt"
  },

  "schneiden": {
    image: "bilder/schneiden.png",
    level: "A1",
    topic: "Kochen",
    irregular: false,
    translationKey: "schneiden",
    sentenceKey: "schneiden",
    description: "Person schneidet"
  },

  "streiten": {
    image: "bilder/streiten.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "streiten",
    sentenceKey: "streiten",
    description: "Person streitet"
  },

  "atmen": {
    image: "bilder/atmen.png",
    level: "A1",
    topic: "Körper",
    irregular: false,
    translationKey: "atmen",
    sentenceKey: "atmen",
    description: "Person atmet"
  },

  "essen": {
    image: "bilder/essen.png",
    level: "A1",
    topic: "Essen",
    irregular: true,
    translationKey: "essen",
    sentenceKey: "essen",
    description: "Person isst"
  },

  "sprechen": {
    image: "bilder/sprechen.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: true,
    translationKey: "sprechen",
    sentenceKey: "sprechen",
    description: "Person spricht"
  },

  "fahren": {
    image: "bilder/fahren.png",
    level: "A1",
    topic: "Verkehr",
    irregular: true,
    translationKey: "fahren",
    sentenceKey: "fahren",
    description: "Person fährt"
  },

  "schlafen": {
    image: "bilder/schlafen.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "schlafen",
    sentenceKey: "schlafen",
    description: "Person schläft"
  },

  "sehen": {
    image: "bilder/sehen.png",
    level: "A1",
    topic: "Wahrnehmung",
    irregular: true,
    translationKey: "sehen",
    sentenceKey: "sehen",
    description: "Person sieht"
  },

  "lesen": {
    image: "bilder/lesen.png",
    level: "A1",
    topic: "Kurs",
    irregular: true,
    translationKey: "lesen",
    sentenceKey: "lesen",
    description: "Person liest"
  },

  "rufen": {
    image: "bilder/rufen.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: true,
    translationKey: "rufen",
    sentenceKey: "rufen",
    description: "Person ruft eine andere Person zu sich"
  },

  "schreien": {
    image: "bilder/schreien.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: false,
    translationKey: "schreien",
    sentenceKey: "schreien",
    description: "Person schreit"
  },

  "träumen": {
    image: "bilder/traeumen.png",
    level: "A1",
    topic: "Alltag",
    irregular: false,
    translationKey: "träumen",
    sentenceKey: "träumen",
    description: "Person träumt"
  },

  "kleben": {
    image: "bilder/kleben.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "kleben",
    sentenceKey: "kleben",
    description: "Person klebt"
  },

  "kosten": {
    image: "bilder/kosten.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "kosten",
    sentenceKey: "kosten",
    description: "Etwas kostet Geld"
  },

  "schieben": {
    image: "bilder/schieben.png",
    level: "A1",
    topic: "Bewegung",
    irregular: true,
    translationKey: "schieben",
    sentenceKey: "schieben",
    description: "Person schiebt"
  },

  "ziehen": {
    image: "bilder/ziehen.png",
    level: "A1",
    topic: "Bewegung",
    irregular: true,
    translationKey: "ziehen",
    sentenceKey: "ziehen",
    description: "Person zieht"
  },

  "schenken": {
    image: "bilder/schenken.png",
    level: "A1",
    topic: "Familie",
    irregular: false,
    translationKey: "schenken",
    sentenceKey: "schenken",
    description: "Person schenkt"
  },

  "füttern": {
    image: "bilder/fuettern.png",
    level: "A1",
    topic: "Tiere",
    irregular: false,
    translationKey: "füttern",
    sentenceKey: "füttern",
    description: "Person füttert"
  },

  "kontrollieren": {
    image: "bilder/kontrollieren.png",
    level: "A1",
    topic: "Kurs",
    irregular: false,
    translationKey: "kontrollieren",
    sentenceKey: "kontrollieren",
    description: "Person kontrolliert"
  },

  "funktionieren": {
    image: "bilder/funktionieren.png",
    level: "A1",
    topic: "Technik",
    irregular: false,
    translationKey: "funktionieren",
    sentenceKey: "funktionieren",
    description: "Gerät funktioniert"
  },

  "stehen": {
    image: "bilder/stehen.png",
    level: "A1",
    topic: "Position",
    irregular: true,
    translationKey: "stehen",
    sentenceKey: "stehen",
    description: "Person steht"
  },

  "bekommen": {
    image: "bilder/bekommen.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "bekommen",
    sentenceKey: "bekommen",
    description: "Person bekommt etwas"
  },

  "schmecken": {
    image: "bilder/schmecken.png",
    level: "A1",
    topic: "Essen",
    irregular: false,
    translationKey: "schmecken",
    sentenceKey: "schmecken",
    description: "Essen schmeckt"
  },

  "bezahlen": {
    image: "bilder/bezahlen.png",
    level: "A1",
    topic: "Einkaufen",
    irregular: false,
    translationKey: "bezahlen",
    sentenceKey: "bezahlen",
    description: "Person bezahlt"
  },

  "empfehlen": {
    image: "bilder/empfehlen.png",
    level: "A1",
    topic: "Kommunikation",
    irregular: true,
    translationKey: "empfehlen",
    sentenceKey: "empfehlen",
    description: "Person empfiehlt etwas"
  },

  "geben": {
    image: "bilder/geben.png",
    level: "A1",
    topic: "Alltag",
    irregular: true,
    translationKey: "geben",
    sentenceKey: "geben",
    description: "Person gibt jemandem etwas"
  },

  "backen": {
    image: "bilder/backen.png",
    level: "A1",
    topic: "Kochen",
    irregular: true,
    translationKey: "backen",
    sentenceKey: "backen",
    description: "Person backt einen Kuchen"
  }

};

export const VERB_KEYS = Object.keys(VERBS);
export const PACKAGE_SIZE = 20;