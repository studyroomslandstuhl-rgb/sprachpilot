SprachPilot Verben A1 – modulare Version

Struktur:
- index.html: lädt Firebase, die zentrale Verben-Datei, alle Aufgabenmodule und die gemeinsame App-Logik.
- data/verbs-data.js: zentrale Grundlage für alle Aufgaben: ALL_VERBS, Bildinfos, Übersetzungen, Erklärungen/Fallbacks.
- tasks/01-auswahl.js: Verben auswählen / kann-unsicher-kann nicht.
- tasks/02-karteikarten.js: Karteikarten.
- tasks/03-memory.js: Memory.
- tasks/04-quiz.js: Quiz.
- tasks/05-schreiben.js: Schreiben.
- tasks/06-hoeren-schreiben.js: Hören + schreiben.
- tasks/07-hoeren-sprechen.js: Hören + sprechen.
- tasks/08-bild-sprechen.js: Bild sprechen.
- tasks/09-verb-zu-bild.js: Verb zu Bild.
- tasks/10-satzpuzzle.js: Satzpuzzle.
- js/core.js: gemeinsame Funktionen für Profil, Fortschritt, Navigation, Speicherung, Statistik.

Wichtig:
Neue Verben werden jetzt zuerst in data/verbs-data.js ergänzt. Alle Aufgaben holen ihre Verb-/Bild-/Übersetzungsdaten von dort.
