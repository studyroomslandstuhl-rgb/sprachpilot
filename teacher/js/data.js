const MODULES = [
  "Verben A1",
  "Fragen A1",
  "Wortschatz",
  "Grammatik"
];

const LESSONS = [
  "A1 Lektion 1",
  "A1 Lektion 2",
  "A1 Lektion 3",
  "A1 Lektion 4",
  "A1 Lektion 5",
  "A1 Lektion 6",
  "A1 Lektion 7",
  "A1 Lektion 8",
  "A1 Lektion 9",
  "A1 Lektion 10",
  "A1 Lektion 11",
  "A1 Lektion 12",
  "A1 Lektion 13",
  "A1 Lektion 14"
];

const DEFAULT_TASKS = [
  "Karteikarten",
  "Memory",
  "Bild → Verb",
  "Verb → Bild",
  "Schreiben",
  "Hören → Schreiben",
  "Hören → Sprechen",
  "Bild → Sprechen",
  "Satz-Puzzle"
];

const FALLBACK_VERB_WORDS = [
  "lieben","kaufen","verstehen","brauchen","hören","lernen","wohnen","bringen",
  "sein","schreiben","fotografieren","telefonieren","kochen","leben","kommen",
  "buchstabieren","gehen","schwimmen","suchen","bestellen","weinen","reparieren",
  "gewinnen","spielen","springen","verlieren","fragen","verkaufen","unterschreiben",
  "reservieren","buchen","machen","malen","trinken","schicken","denken","winken",
  "hassen","beißen","gießen","reißen","putzen","küssen","tanzen","mixen","reisen",
  "haben","überqueren","grüßen","genießen","singen","schließen","rennen","lachen",
  "warten","arbeiten","finden","benutzen","rechnen","zeichnen","öffnen","wiederholen",
  "schneiden","streiten","atmen","essen","sprechen","fahren","schlafen","sehen","lesen",
  "rufen","schreien","träumen","kleben","kosten","schieben","ziehen","schenken","füttern",
  "kontrollieren","funktionieren","stehen","bekommen","schmecken","bezahlen","empfehlen",
  "geben","backen","zeigen","reden","sagen","markieren","versuchen","probieren","tun",
  "besuchen","reiten","drehen","greifen","antworten","kennen","erklären","bedeuten",
  "notieren","hoffen","glauben","befehlen","helfen","braten","waschen","nehmen","stehlen",
  "tragen","brechen","laufen","vergessen","messen","fressen","graben","schlagen","sterben",
  "treffen","werfen","fangen","blasen","fallen","saufen","halten","laden","lassen","wachsen",
  "werben","raten","wissen","stechen","werden"
];

function getVerbWords(){
  if(typeof ALL_VERBS !== "undefined" && Array.isArray(ALL_VERBS)){
    return ALL_VERBS.map(v => v.v).filter(Boolean);
  }

  return FALLBACK_VERB_WORDS;
}

const VERB_WORDS = getVerbWords();
