# SprachPilot · verbindliche Checkliste vor jeder Änderung

Diese Checkliste ergänzt `PAEDAGOGIK-REGELN.md` und ist vor jeder Änderung an SprachPilot-Aufgaben zu prüfen.

## Wortschatz
- Wortschatzaufgaben dürfen **nur Wörter aus der sichtbaren Wortschatzübersicht des aktuellen Themas** verwenden.
- Karteikarten und Wortschatzübersicht haben **exakt dieselbe Wortmenge**: nicht mehr, nicht weniger.
- Entfernte Wörter dürfen nicht durch ältere Patches wieder in Karteikarten oder Wortschatzaufgaben kommen.
- Grammatikformen wie `morgens`, `nachmittags`, `jeden Montag` dürfen als Grammatik geübt werden, ohne automatisch Karteikarten-Wortschatz zu sein.
- Bild-/Höraufgaben mit Auswahl zeigen standardmäßig **4 Antwortmöglichkeiten**; auf dem Handy kompakt als 2×2, wenn Bilder gewählt werden.
- `Hören → Bild` startet nie automatisch. Erst Klick auf den Audio-Knopf.

## Prüfungen
- Pro Themenprüfung **höchstens 15 Aufgaben**.
- Nur Inhalte prüfen, die im selben Thema tatsächlich gelernt/geübt wurden.
- Keine neuen Wörter in Prüfungen.
- Keine Prüfungsfrage aus einem anderen Thema übernehmen.
- Maximal 25 % Multiple Choice; mindestens 75 % aktive Produktion.
- Multiple-Choice-Positionen werden gemischt; richtige Antworten dürfen kein festes A/B/C-Muster haben.
- Lese-/Hörprüfungen prüfen Verständnis und Transfer, nicht wortgleiches Wiederfinden oder Abschreiben.
- Vor dem Erstellen einer Prüfung werden die vorhandenen Aufgaben des Themas geprüft; die Prüfung nimmt daraus repräsentative Kompetenzen, ohne die Lernaufgaben wortgleich zu kopieren.

## Fortschritt, Punkte und Navigation
- Aufgabe und Themenübersicht verwenden dasselbe State-System.
- Fortschrittsbalken der Themenübersicht müssen unmittelbar den gespeicherten Aufgabenstand anzeigen.
- Punkte werden nach einer Fortschrittsänderung direkt für Firebase/Dashboard synchronisiert; die Synchronisierung darf nicht davon abhängen, dass anschließend die Themenübersicht geöffnet bleibt.
- Beim Öffnen jeder Aufgabe automatisch zur echten Arbeitsfläche scrollen; niemals zur Lade-Karte.
- Beim Zurückkehren zur Themenübersicht automatisch zur zuletzt bearbeiteten Aufgabe scrollen.

## Vor Veröffentlichung prüfen
1. Wortliste Übersicht = Wortliste Karteikarten.
2. Jede Wortschatzaufgabe enthält nur Wörter dieser Wortliste.
3. Alle vorgesehenen Bilder und Audios haben Bunny-Pfade.
4. Standardübersetzungen `en`, `ru`, `tr`, `uk`, `ar`, `ja`, `ro`, `pl`, `ku` sind vorhanden.
5. Mobile Bildauswahl ist kompakt.
6. Aufgabenstellungen sind kurz und im Du-Imperativ.
7. Emojis sind vielfältig und zum Aufgabentyp passend.
8. Prüfung: maximal 15 Items, maximal 25 % MC, keine neuen Inhalte.
9. Fortschritt lokal sichtbar und Firebase-Sync ausgelöst.
10. Autoscroll und Rückkehrscroll funktionieren.
