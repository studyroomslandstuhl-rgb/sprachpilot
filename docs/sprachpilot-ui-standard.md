# SprachPilot UI-Standard

## Standardleiste

Auf Themenübersichten, Aufgaben und Wortschatzübersichten darf genau eine Leiste erscheinen: `.sp-header` aus `/js/sp-header.js`.

Die Leiste enthält:

- SprachPilot-Logo und Seitentitel
- Name und Kurs
- Dashboard
- Profil
- Abmelden
- ← Zurück
- Übersicht
- Fortschritte löschen

Alte `.topbar`, `.l7-topbar`, `.l7-header` oder selbst erzeugte Ersatzleisten dürfen nicht parallel angezeigt oder neu erzeugt werden.

## Navigation

Jedes Thema besitzt eine eigene Wortschatzübersicht unter:

`Thema-N/uebersicht.html`

Verbindliche Rückwege:

- Aufgabe → Themenübersicht (TÜ)
- Wortschatzübersicht → Themenübersicht (TÜ)
- Themenübersicht → Lektionsübersicht (LÜ)

Der Knopf „Übersicht“ führt immer auf die eigene `uebersicht.html` des aktuellen Themas.

## Karteikarten

Alle Karteikarten verwenden den gemeinsamen Kartenstandard:

- Vorderseite: Bild und Übersetzung in der gewählten Muttersprache
- Rückseite: kleines Bild, deutsches Wort, Übersetzung, Plural, Beispiel und Anhören
- Knöpfe: 🎤 Sprechen und ✍️ Schreiben
- Das Umdrehen zeigt nur die Rückseite und überspringt keine Karte.
- Erst eine richtige gesprochene oder geschriebene Antwort führt weiter.
- Fehlerhafte Karten werden später erneut gezeigt.

## Wortschatzübersicht

Jede Wortschatzübersicht beginnt mit der Informationskarte:

- Kennzeichnung „WORTSCHATZÜBERSICHT“
- Überschrift „Wörter aus Thema N“
- Erklärung: „Hier siehst und hörst du nur die einzelnen Wörter und Redewendungen aus diesem Thema.“

Die Wörter werden nach Wortart gruppiert. Pro Eintrag werden Bild, Wort, Plural bei Nomen, Hörknopf und die Standardübersetzungen angezeigt.

Standardsprachen:

- Englisch
- Russisch
- Türkisch
- Ukrainisch
- Arabisch
- Japanisch
- Rumänisch
- Polnisch
- Kurdisch

## Audio

Es darf immer nur eine Hördatei gleichzeitig laufen.

Vor dem Start einer neuen Hördatei werden beendet:

- die vorherige Audioinstanz
- andere Audioelemente auf der Seite
- eine laufende Sprachausgabe

Fehler- und Fallback-Ereignisse dürfen pro Audioquelle nur einmal zur nächsten Quelle wechseln.
