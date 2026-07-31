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

## Themenübersicht und Aufgaben-Emojis

Jede Aufgabe auf der TÜ besitzt genau ein fest zugeordnetes Emoji, das die tatsächliche Tätigkeit der Aufgabe zeigt. Zufällige Dekorationen oder Emojis ohne inhaltlichen Bezug sind nicht erlaubt.

Verbindliche Grundzuordnung:

- Karteikarten: 🃏
- Bildaufgabe: 🖼️
- Hören: 🎧
- Sprechen oder Interview: 🎤
- Schreiben oder Sätze bilden: ✍️
- Ordnen oder Sortieren: 🧩
- Auswählen oder Prüfen: ✅
- Fragen, Antworten oder Dialog: 💬
- Lesen: 📖
- Zeitangaben: ⏰
- Prüfung: immer ⭐

Bei spezielleren Aufgaben wird ein eindeutiges, unmittelbar passendes Emoji fest in der Themenkonfiguration zugeordnet. Das in den Inhaltsdaten vorhandene Emoji darf den TÜ-Standard nicht überschreiben.

## Karteikarten

Alle Karteikarten verwenden den gemeinsamen Kartenstandard:

- Vorderseite: Bild und Übersetzung in der gewählten Muttersprache
- Rückseite exakt wie in L6T4: links ein kleines quadratisches Bild; rechts deutsches Wort, Übersetzung, Plural, Beispiel und darunter „🔊 Anhören“
- Knöpfe: 🎤 Sprechen und ✍️ Schreiben
- Das Umdrehen zeigt nur die Rückseite und überspringt keine Karte.
- Unter der umgedrehten Karte steht ausschließlich: „Sprich oder schreib das Wort.“
- Erst eine richtige gesprochene oder geschriebene Antwort führt weiter.
- Fehlerhafte Karten werden später erneut gezeigt.
- Beim Öffnen der Karteikarten und nach jeder neuen Karte scrollt die Seite automatisch zur Karte.

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
