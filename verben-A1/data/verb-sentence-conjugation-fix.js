// data/verb-sentence-conjugation-fix.js
// Letzte Qualitätskontrolle: echte A1-Sätze, keine generische "Ich lerne + Verb"-Fallback-Logik,
// und saubere Konjugationsdaten für Aufgaben.
(function(){
  const SENTENCE_FIXES={
    kochen:"Mein Mann kocht eine Suppe.",
    warten:"Der Vater wartet auf den Sohn.",
    ziehen:"Ich ziehe die Karte.",
    blasen:"Der Wind bläst.",
    laden:"Mein Handy lädt.",
    zumachen:"Wir machen die Fenster zu.",
    vergeben:"Er vergibt ihm nicht.",
    aufgeben:"Sie gibt nicht auf."
  };

  const CONJ_EXAMPLE_FIXES={
    kochen:"eine Suppe",
    warten:"auf den Sohn",
    ziehen:"die Karte",
    blasen:"in die Flöte",
    laden:"das Handy",
    zumachen:"die Fenster",
    vergeben:"ihm nicht",
    aufgeben:"nicht",
    vorhaben:"heute viel",
    planen:"einen Ausflug",
    zuhören:"gut",
    zusehen:"beim Spiel",
    gehören:"mir",
    abschreiben:"den Satz",
    vorlesen:"den Text",
    verschlafen:"den Termin"
  };

  const SEPARABLE_FIXES={
    aufräumen:{base:"räumen",prefix:"auf"},
    einkaufen:{base:"kaufen",prefix:"ein"},
    anrufen:{base:"rufen",prefix:"an"},
    fernsehen:{base:"sehen",prefix:"fern"},
    anfangen:{base:"fangen",prefix:"an"},
    aussterben:{base:"sterben",prefix:"aus"},
    aufmachen:{base:"machen",prefix:"auf"},
    zumachen:{base:"machen",prefix:"zu"},
    mitgeben:{base:"geben",prefix:"mit"},
    mitnehmen:{base:"nehmen",prefix:"mit"},
    aufstehen:{base:"stehen",prefix:"auf"},
    anziehen:{base:"ziehen",prefix:"an"},
    ausziehen:{base:"ziehen",prefix:"aus"},
    einsteigen:{base:"steigen",prefix:"ein"},
    aussteigen:{base:"steigen",prefix:"aus"},
    umsteigen:{base:"steigen",prefix:"um"},
    ankommen:{base:"kommen",prefix:"an"},
    abfahren:{base:"fahren",prefix:"ab"},
    ausfüllen:{base:"füllen",prefix:"aus"},
    anmelden:{base:"melden",prefix:"an"},
    mitkommen:{base:"kommen",prefix:"mit"},
    zurückkommen:{base:"kommen",prefix:"zurück"},
    abbiegen:{base:"biegen",prefix:"ab"},
    kennenlernen:{base:"lernen",prefix:"kennen"},
    einladen:{base:"laden",prefix:"ein"},
    vorhaben:{base:"haben",prefix:"vor"},
    aufgeben:{base:"geben",prefix:"auf"},
    zuhören:{base:"hören",prefix:"zu"},
    zusehen:{base:"sehen",prefix:"zu"},
    abschreiben:{base:"schreiben",prefix:"ab"},
    vorlesen:{base:"lesen",prefix:"vor"}
  };

  const FULL_FORM_FIXES={
    sein:{"ich":"bin","du":"bist","er/sie/es":"ist","wir":"sind","ihr":"seid","sie/Sie":"sind"},
    haben:{"ich":"habe","du":"hast","er/sie/es":"hat","wir":"haben","ihr":"habt","sie/Sie":"haben"},
    werden:{"ich":"werde","du":"wirst","er/sie/es":"wird","wir":"werden","ihr":"werdet","sie/Sie":"werden"},
    wissen:{"ich":"weiß","du":"weißt","er/sie/es":"weiß","wir":"wissen","ihr":"wisst","sie/Sie":"wissen"},
    geben:{"ich":"gebe","du":"gibst","er/sie/es":"gibt","wir":"geben","ihr":"gebt","sie/Sie":"geben"},
    nehmen:{"ich":"nehme","du":"nimmst","er/sie/es":"nimmt","wir":"nehmen","ihr":"nehmt","sie/Sie":"nehmen"},
    sprechen:{"ich":"spreche","du":"sprichst","er/sie/es":"spricht","wir":"sprechen","ihr":"sprecht","sie/Sie":"sprechen"},
    fahren:{"ich":"fahre","du":"fährst","er/sie/es":"fährt","wir":"fahren","ihr":"fahrt","sie/Sie":"fahren"},
    sehen:{"ich":"sehe","du":"siehst","er/sie/es":"sieht","wir":"sehen","ihr":"seht","sie/Sie":"sehen"},
    lesen:{"ich":"lese","du":"liest","er/sie/es":"liest","wir":"lesen","ihr":"lest","sie/Sie":"lesen"},
    essen:{"ich":"esse","du":"isst","er/sie/es":"isst","wir":"essen","ihr":"esst","sie/Sie":"essen"},
    helfen:{"ich":"helfe","du":"hilfst","er/sie/es":"hilft","wir":"helfen","ihr":"helft","sie/Sie":"helfen"},
    treffen:{"ich":"treffe","du":"triffst","er/sie/es":"trifft","wir":"treffen","ihr":"trefft","sie/Sie":"treffen"},
    werfen:{"ich":"werfe","du":"wirfst","er/sie/es":"wirft","wir":"werfen","ihr":"werft","sie/Sie":"werfen"},
    fangen:{"ich":"fange","du":"fängst","er/sie/es":"fängt","wir":"fangen","ihr":"fangt","sie/Sie":"fangen"},
    laufen:{"ich":"laufe","du":"läufst","er/sie/es":"läuft","wir":"laufen","ihr":"lauft","sie/Sie":"laufen"},
    schlafen:{"ich":"schlafe","du":"schläfst","er/sie/es":"schläft","wir":"schlafen","ihr":"schlaft","sie/Sie":"schlafen"},
    halten:{"ich":"halte","du":"hältst","er/sie/es":"hält","wir":"halten","ihr":"haltet","sie/Sie":"halten"},
    lassen:{"ich":"lasse","du":"lässt","er/sie/es":"lässt","wir":"lassen","ihr":"lasst","sie/Sie":"lassen"},
    wachsen:{"ich":"wachse","du":"wächst","er/sie/es":"wächst","wir":"wachsen","ihr":"wachst","sie/Sie":"wachsen"},
    laden:{"ich":"lade","du":"lädst","er/sie/es":"lädt","wir":"laden","ihr":"ladet","sie/Sie":"laden"},
    gefallen:{"ich":"gefalle","du":"gefällst","er/sie/es":"gefällt","wir":"gefallen","ihr":"gefallt","sie/Sie":"gefallen"},
    empfehlen:{"ich":"empfehle","du":"empfiehlst","er/sie/es":"empfiehlt","wir":"empfehlen","ihr":"empfehlt","sie/Sie":"empfehlen"},
    befehlen:{"ich":"befehle","du":"befiehlst","er/sie/es":"befiehlt","wir":"befehlen","ihr":"befehlt","sie/Sie":"befehlen"},
    braten:{"ich":"brate","du":"brätst","er/sie/es":"brät","wir":"braten","ihr":"bratet","sie/Sie":"braten"},
    waschen:{"ich":"wasche","du":"wäschst","er/sie/es":"wäscht","wir":"waschen","ihr":"wascht","sie/Sie":"waschen"},
    tragen:{"ich":"trage","du":"trägst","er/sie/es":"trägt","wir":"tragen","ihr":"tragt","sie/Sie":"tragen"},
    stehlen:{"ich":"stehle","du":"stiehlst","er/sie/es":"stiehlt","wir":"stehlen","ihr":"stehlt","sie/Sie":"stehlen"},
    brechen:{"ich":"breche","du":"brichst","er/sie/es":"bricht","wir":"brechen","ihr":"brecht","sie/Sie":"brechen"},
    vergessen:{"ich":"vergesse","du":"vergisst","er/sie/es":"vergisst","wir":"vergessen","ihr":"vergesst","sie/Sie":"vergessen"},
    messen:{"ich":"messe","du":"misst","er/sie/es":"misst","wir":"messen","ihr":"messt","sie/Sie":"messen"},
    fressen:{"ich":"fresse","du":"frisst","er/sie/es":"frisst","wir":"fressen","ihr":"fresst","sie/Sie":"fressen"},
    graben:{"ich":"grabe","du":"gräbst","er/sie/es":"gräbt","wir":"graben","ihr":"grabt","sie/Sie":"graben"},
    schlagen:{"ich":"schlage","du":"schlägst","er/sie/es":"schlägt","wir":"schlagen","ihr":"schlagt","sie/Sie":"schlagen"},
    sterben:{"ich":"sterbe","du":"stirbst","er/sie/es":"stirbt","wir":"sterben","ihr":"sterbt","sie/Sie":"sterben"},
    blasen:{"ich":"blase","du":"bläst","er/sie/es":"bläst","wir":"blasen","ihr":"blast","sie/Sie":"blasen"},
    fallen:{"ich":"falle","du":"fällst","er/sie/es":"fällt","wir":"fallen","ihr":"fallt","sie/Sie":"fallen"},
    saufen:{"ich":"saufe","du":"säufst","er/sie/es":"säuft","wir":"saufen","ihr":"sauft","sie/Sie":"saufen"},
    raten:{"ich":"rate","du":"rätst","er/sie/es":"rät","wir":"raten","ihr":"ratet","sie/Sie":"raten"},
    backen:{"ich":"backe","du":"bäckst","er/sie/es":"bäckt","wir":"backen","ihr":"backt","sie/Sie":"backen"},
    verschlafen:{"ich":"verschlafe","du":"verschläfst","er/sie/es":"verschläft","wir":"verschlafen","ihr":"verschlaft","sie/Sie":"verschlafen"},
    vergeben:{"ich":"vergebe","du":"vergibst","er/sie/es":"vergibt","wir":"vergeben","ihr":"vergebt","sie/Sie":"vergeben"},
    anfangen:{"ich":"fange","du":"fängst","er/sie/es":"fängt","wir":"fangen","ihr":"fangt","sie/Sie":"fangen"},
    beginnen:{"ich":"beginne","du":"beginnst","er/sie/es":"beginnt","wir":"beginnen","ihr":"beginnt","sie/Sie":"beginnen"},
    heißen:{"ich":"heiße","du":"heißt","er/sie/es":"heißt","wir":"heißen","ihr":"heißt","sie/Sie":"heißen"},
    stehen:{"ich":"stehe","du":"stehst","er/sie/es":"steht","wir":"stehen","ihr":"steht","sie/Sie":"stehen"},
    ziehen:{"ich":"ziehe","du":"ziehst","er/sie/es":"zieht","wir":"ziehen","ihr":"zieht","sie/Sie":"ziehen"},
    kommen:{"ich":"komme","du":"kommst","er/sie/es":"kommt","wir":"kommen","ihr":"kommt","sie/Sie":"kommen"},
    hören:{"ich":"höre","du":"hörst","er/sie/es":"hört","wir":"hören","ihr":"hört","sie/Sie":"hören"},
    schreiben:{"ich":"schreibe","du":"schreibst","er/sie/es":"schreibt","wir":"schreiben","ihr":"schreibt","sie/Sie":"schreiben"},
    biegen:{"ich":"biege","du":"biegst","er/sie/es":"biegt","wir":"biegen","ihr":"biegt","sie/Sie":"biegen"},
    räumen:{"ich":"räume","du":"räumst","er/sie/es":"räumt","wir":"räumen","ihr":"räumt","sie/Sie":"räumen"},
    machen:{"ich":"mache","du":"machst","er/sie/es":"macht","wir":"machen","ihr":"macht","sie/Sie":"machen"},
    füllen:{"ich":"fülle","du":"füllst","er/sie/es":"füllt","wir":"füllen","ihr":"füllt","sie/Sie":"füllen"},
    melden:{"ich":"melde","du":"meldest","er/sie/es":"meldet","wir":"melden","ihr":"meldet","sie/Sie":"melden"},
    steigen:{"ich":"steige","du":"steigst","er/sie/es":"steigt","wir":"steigen","ihr":"steigt","sie/Sie":"steigen"}
  };

  if(window.VERB_SENTENCES)Object.assign(window.VERB_SENTENCES,SENTENCE_FIXES);
  const oldSentence=window.sentenceForVerb;
  window.sentenceForVerb=function(v){
    return (window.VERB_SENTENCES&&window.VERB_SENTENCES[v]) || (typeof oldSentence==="function"&&oldSentence(v)!==`Ich lerne ${v}.`?oldSentence(v):"Ich schreibe einen Satz.");
  };
  if(typeof CONJ_EXAMPLES!=="undefined")Object.assign(CONJ_EXAMPLES,CONJ_EXAMPLE_FIXES);
  if(typeof window.CONJ_EXAMPLES!=="undefined")Object.assign(window.CONJ_EXAMPLES,CONJ_EXAMPLE_FIXES);
  if(typeof SEPARABLE_VERBS!=="undefined")Object.assign(SEPARABLE_VERBS,SEPARABLE_FIXES);
  if(typeof window.SEPARABLE_VERBS!=="undefined")Object.assign(window.SEPARABLE_VERBS,SEPARABLE_FIXES);
  if(typeof FULL_FORMS!=="undefined")Object.assign(FULL_FORMS,FULL_FORM_FIXES);
  if(typeof window.FULL_FORMS!=="undefined")Object.assign(window.FULL_FORMS,FULL_FORM_FIXES);
})();