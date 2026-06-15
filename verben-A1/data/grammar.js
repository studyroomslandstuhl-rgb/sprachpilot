// grammar.js
// Unregelmäßige und wichtige Verbformen für A1

export const IRREGULAR_VERB_FORMS = {
  "sein": {
    "ich": "bin",
    "du": "bist",
    "er/sie/es": "ist",
    "wir": "sind",
    "ihr": "seid",
    "sie/Sie": "sind"
  },
  "haben": {
    "ich": "habe",
    "du": "hast",
    "er/sie/es": "hat",
    "wir": "haben",
    "ihr": "habt",
    "sie/Sie": "haben"
  },
  "gehen": {
    "ich": "gehe",
    "du": "gehst",
    "er/sie/es": "geht",
    "wir": "gehen",
    "ihr": "geht",
    "sie/Sie": "gehen"
  },
  "essen": {
    "ich": "esse",
    "du": "isst",
    "er/sie/es": "isst",
    "wir": "essen",
    "ihr": "esst",
    "sie/Sie": "essen"
  },
  "sprechen": {
    "ich": "spreche",
    "du": "sprichst",
    "er/sie/es": "spricht",
    "wir": "sprechen",
    "ihr": "sprecht",
    "sie/Sie": "sprechen"
  },
  "fahren": {
    "ich": "fahre",
    "du": "fährst",
    "er/sie/es": "fährt",
    "wir": "fahren",
    "ihr": "fahrt",
    "sie/Sie": "fahren"
  },
  "schlafen": {
    "ich": "schlafe",
    "du": "schläfst",
    "er/sie/es": "schläft",
    "wir": "schlafen",
    "ihr": "schlaft",
    "sie/Sie": "schlafen"
  },
  "sehen": {
    "ich": "sehe",
    "du": "siehst",
    "er/sie/es": "sieht",
    "wir": "sehen",
    "ihr": "seht",
    "sie/Sie": "sehen"
  },
  "lesen": {
    "ich": "lese",
    "du": "liest",
    "er/sie/es": "liest",
    "wir": "lesen",
    "ihr": "lest",
    "sie/Sie": "lesen"
  },
  "geben": {
    "ich": "gebe",
    "du": "gibst",
    "er/sie/es": "gibt",
    "wir": "geben",
    "ihr": "gebt",
    "sie/Sie": "geben"
  },
  "empfehlen": {
    "ich": "empfehle",
    "du": "empfiehlst",
    "er/sie/es": "empfiehlt",
    "wir": "empfehlen",
    "ihr": "empfehlt",
    "sie/Sie": "empfehlen"
  },
  "backen": {
    "ich": "backe",
    "du": "bäckst",
    "er/sie/es": "bäckt",
    "wir": "backen",
    "ihr": "backt",
    "sie/Sie": "backen"
  },
  "stehen": {
    "ich": "stehe",
    "du": "stehst",
    "er/sie/es": "steht",
    "wir": "stehen",
    "ihr": "steht",
    "sie/Sie": "stehen"
  },
  "bekommen": {
    "ich": "bekomme",
    "du": "bekommst",
    "er/sie/es": "bekommt",
    "wir": "bekommen",
    "ihr": "bekommt",
    "sie/Sie": "bekommen"
  },
  "bringen": {
    "ich": "bringe",
    "du": "bringst",
    "er/sie/es": "bringt",
    "wir": "bringen",
    "ihr": "bringt",
    "sie/Sie": "bringen"
  },
  "denken": {
    "ich": "denke",
    "du": "denkst",
    "er/sie/es": "denkt",
    "wir": "denken",
    "ihr": "denkt",
    "sie/Sie": "denken"
  },
  "rennen": {
    "ich": "renne",
    "du": "rennst",
    "er/sie/es": "rennt",
    "wir": "rennen",
    "ihr": "rennt",
    "sie/Sie": "rennen"
  }
};

export function getVerbForms(verb){ return IRREGULAR_VERB_FORMS[verb] || null; }
