# SprachPilot – stabile Schüleridentität V1

## Ziel

Ein Schüler besitzt genau eine technische Firestore-Identität. Änderungen an Name, E-Mail, Muttersprache oder Kurs dürfen diese Identität nicht verändern und dürfen keinen zweiten Fortschrittsstand erzeugen.

## Kanonische ID

Die Dokument-ID in `students/{studentId}` ist die kanonische und unveränderliche Schüler-ID. Sie wird zusätzlich in folgenden Feldern gespiegelt:

- `canonicalStudentId`
- `docId`
- `studentId`
- `userId`

Frühere oder abweichende IDs werden in `aliasIds` erhalten.

## Verhalten

- Registrierung: bestehender Registrierungsablauf bleibt kompatibel; danach wird die Identität normalisiert.
- Login: der tatsächlich gefundene Firestore-Dokumentname wird kanonisch.
- Fortschritt: bei der Normalisierung werden nur Identitäts-Metadaten ergänzt. Aufgaben, Prüfungen und Punkte werden nicht gelöscht oder abgesenkt.
- Profilbearbeitung: vor einer Änderung wird die Identität normalisiert.
- Lehrer-Dashboard: Korrekturen an E-Mail/Kurs/Name/Muttersprache behalten dieselbe ID; passende Metadaten im Progress-Dokument werden mitgeführt.
- Alte Fortschritts-IDs: bleiben als Aliasse erhalten, damit vorhandene Recovery-/Alias-Logik sie zusammenführen kann.

## Nicht Bestandteil dieser Phase

- Umstellung der Schüler auf Firebase Email/Password Authentication
- Verschärfung der Firestore-Regeln
- Vereinheitlichung aller Aufgaben-/Punktesysteme
- vollständiger Audit aller direkten Aufgabenlinks

Diese Punkte folgen nach der Identitätsmigration, damit bestehende Teilnehmerdaten zuerst stabil referenziert werden.
