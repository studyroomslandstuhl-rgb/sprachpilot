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
- Das Umdrehen zeigt nur die Rückseite und löst weder Fortschritt noch Punkte aus.
- Unter der umgedrehten Karte steht: „Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.“
- Erst eine richtige gesprochene oder geschriebene Antwort führt weiter.
- Fehlerhafte Karten werden später erneut gezeigt.
- Enter und Leertaste drehen die Karte ebenfalls um.
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

## Verbindliche Inhaltsverteilung in Lektion 7

Der Wortschatz der Lektion 7 ist auf Thema 1 bis Thema 4 verteilt. Jedes Thema lädt ausschließlich seinen eigenen Datensatz:

- `Thema-1/data-loader.js`
- `Thema-2/data-loader.js`
- `Thema-3/data-loader.js`
- `Thema-4/data-loader.js`

Ein gemeinsamer Sammeldatensatz, ein historisches Gesamtpaket oder ein Loader, der Wörter aus mehreren Themen in eine TÜ, Aufgabe, Karteikartensammlung oder Übersicht einfügt, ist nicht erlaubt.

Die Standardisierung von Darstellung, Leisten, Farben, Übersetzungen, Audio und Karteikartenlogik darf die thematische Wortverteilung nicht verändern.

## Verbindlicher Inhalt für L7T1

L7T1 verwendet ausschließlich den Wortschatz aus `Thema-1/data-loader.js`. Die Datei `Thema-1/l7t1-content-restore.js` darf diese Daten nur ergänzen, nicht durch einen früheren Gesamtwortschatz ersetzen.

Für die vorhandenen L7T1-Wörter bleiben erhalten:

- passende A1-Beispielsätze auf den Karteikarten
- Übersetzungen in der gewählten Muttersprache
- die überarbeiteten kurzen Aufgabenbezeichnungen und Du-Anweisungen
- die Hör-Aufgaben nach der L6T4-Struktur
- die Karteikartenregeln aus dem Abschnitt „Karteikarten“

Für L7T1-Verben gilt zusätzlich:

- „Anhören“ lädt die Infinitiv-MP3 aus Bunny Storage.
- Trennbare und reflexive Verben erhalten Dateinamen mit Unterstrich, zum Beispiel `aufstehen.mp3` und `sich_anziehen.mp3`.
- Es wird keine Computerstimme als Ersatz abgespielt.
- Fehlt die MP3, erscheint exakt: „Die Audiodatei konnte nicht geladen werden.“
