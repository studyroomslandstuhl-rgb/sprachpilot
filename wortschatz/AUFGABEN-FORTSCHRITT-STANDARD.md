# Verbindlicher Aufgaben-Fortschritt- und Punkte-Standard

Referenz für die funktionierende Speicher- und Punkte-Logik: **A1 Lektion 4**. Neue und überarbeitete Aufgaben müssen dieselbe Grundlogik verwenden.

## 1. Fortschritt wird immer gespeichert

- Jede Aufgabe speichert ihren lokalen Zustand sofort nach einer Änderung.
- Richtige Items, aktuelle Position, Wiederholungsstatus und bereits beantwortete Items dürfen beim Seitenwechsel nicht verloren gehen.
- Zusätzlich wird der sichtbare Aufgabenfortschritt zentral über `/js/progress.js` mit `recordTaskProgress(...)` gespeichert.
- Wenn `SPProgress` beim Speichern noch nicht geladen ist, wird der Schreibvorgang wie in L4 in `SP_PROGRESS_QUEUE` gelegt und `/js/progress.js` nachgeladen. Ein noch nicht geladenes Modul darf niemals dazu führen, dass Fortschritt verloren geht.
- Die zentrale Laufzeitbasis für neue Standard-Aufgabenseiten ist `/js/sp-task-runtime-standard.js`.

## 2. Punkte

Das zentrale Punktesystem aus `/js/progress.js` ist verbindlich:

- Durchlauf 1: **5 Punkte** pro abgeschlossener Lernaufgabe.
- Durchlauf 2: **10 Punkte** pro abgeschlossener Lernaufgabe.
- Durchlauf 3: **15 Punkte** pro abgeschlossener Lernaufgabe.
- Prüfung Durchlauf 1: maximal **100 Punkte**.
- Prüfung Durchlauf 2: maximal **200 Punkte**.
- Prüfung Durchlauf 3: maximal **300 Punkte**.
- Prüfungspunkte werden entsprechend dem erreichten Prozentwert berechnet.
- Eine Lernaufgabe erhält Punkte erst bei 100 %.
- Bereits vergebene Punkte desselben Durchlaufs dürfen nicht doppelt addiert werden.

Am Ende einer Aufgabe muss sichtbar sein, dass die Punkte gespeichert wurden bzw. wie viele Punkte gerade erreicht wurden.

## 3. Dashboard

- Aufgaben und Prüfungen schreiben in denselben zentralen Fortschrittsdatensatz wie L4.
- Die Gesamtpunkte werden über den zentralen Progress-/Point-Recalculator berechnet und mit dem Schüler-Dashboard zusammengezählt.
- `SP_POINTS_TOTAL` darf nicht als eigenes, isoliertes Punktesystem einer Lektion geführt werden; es ist nur der lokale Spiegel des zentral berechneten Gesamtwerts.
- Themenübersichten zeigen den zentralen Gesamtpunktestand und den aktuellen Durchlauf.

## 4. Automatisches Scrollen – IMMER

- Jede geöffnete Aufgabe scrollt automatisch bis zur eigentlichen aktiven Aufgabenkarte.
- Das gilt beim ersten Öffnen, nach dem Rendern, nach dem Wechsel zur nächsten Teilaufgabe, nach einer richtigen Antwort, nach erneutem Laden und nach dynamischen DOM-Änderungen der Aufgabe.
- Der Schüler soll nicht nach jedem neuen Item manuell wieder nach unten scrollen müssen.
- Ziel ist immer die aktuelle Aufgaben-/Übungskarte, nicht die globale Kopfzeile oder Fortschrittskarte.
- Zentrale Standarddatei: `/js/sp-task-autoscroll.js`.
- `/js/sp-task-runtime-standard.js` darf zusätzlich scrollen, aber der globale Auto-Scroll-Standard ist maßgeblich.

## 5. Lehrer-Vorschau

- Lehrer-Vorschau speichert keine Teilnehmerpunkte und keinen Teilnehmerfortschritt in Firebase.
- Die Aufgabe darf innerhalb der Vorschau trotzdem normal weiterlaufen; temporärer Sitzungsstatus ist erlaubt.

Damit gilt verbindlich: **lokal sofort speichern, zentral synchronisieren, am Ende Punkte vergeben, Dashboard-Gesamtpunkte aktualisieren und immer zur aktiven Aufgabe scrollen.**
