# Temporärer studentLookups-Übergang

Dieser Schritt ist ausschließlich für die einmalige Sicherheitsmigration vor dem strikten Firestore-Cutover vorgesehen.

## Ausgangslage

Die bisher veröffentlichten Kompatibilitätsregeln erlauben angemeldeten Benutzern Zugriff auf `students`, `progress`, `settings` usw., enthalten aber keinen Match-Block für `studentLookups`. Deshalb schlägt `teacher/student-security-lookup.js` bereits beim Lesen vorhandener Lookup-Dokumente mit `Missing or insufficient permissions` fehl.

## Übergang

Für die einmalige Lookup-Migration die Datei `firestore.transition-student-lookups.rules` vollständig in Firebase Firestore Rules veröffentlichen.

Danach im Lehrer-Dashboard ausschließlich **„Schüler-Sicherheit vollständig prüfen“** ausführen. Erwartetes Ergebnis:

- Fortschritts-Sicherheit: BEREIT
- Sicherheits-Lookup: BEREIT
- Kollisionen: 0
- Fehlende Zuordnungen: 0

## Wichtig

Diese Regeln sind **nicht** der Endzustand. Sie bleiben nur so lange aktiv, bis:

1. die Lookup-Migration vollständig grün ist und
2. das tatsächliche Owner-Firebase-Auth-Konto geprüft wurde (allowlist-E-Mail, E-Mail verifiziert, Password-Provider, nicht deaktiviert).

Erst danach werden die strikten `firestore.rules` veröffentlicht und anschließend der Sicherheits-Cutover initialisiert.
