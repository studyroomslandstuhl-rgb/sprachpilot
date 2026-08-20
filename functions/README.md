# SprachPilot Firebase Backend

Dieser Ordner enthält die serverseitigen Firebase Functions für SprachPilot-Konto- und Authentifizierungsfunktionen.

## SMTP-Secret

Die SMTP-Konfiguration wird als strukturiertes Secret `SPRACHPILOT_SMTP` gespeichert und **nicht** in GitHub eingecheckt.

Beispielstruktur (nur Schema, keine echten Zugangsdaten):

```json
{
  "host": "smtp.example.com",
  "port": 465,
  "secure": true,
  "user": "noreply@sprachpilot.org",
  "pass": "SECRET",
  "fromEmail": "noreply@sprachpilot.org",
  "fromName": "SprachPilot",
  "replyTo": ""
}
```

Secret setzen:

```bash
firebase functions:secrets:set SPRACHPILOT_SMTP
```

Region: `europe-west1`.

## Funktionen

- `requestPasswordReset`: öffentliche, rate-limitierte Passwort-Mail. Die Antwort verrät nicht, ob das Konto existiert.
- `requestVerificationEmail`: Bestätigungs-Mail für das aktuell authentifizierte Passwortkonto.
- `provisionStudentAccess`: Owner-only. Erstellt bzw. bindet einen Schülerzugang und sendet die SprachPilot-Zugangsmail.
- `updateStudentAccount`: Owner-only. Ändert eine Teilnehmer-E-Mail kontrolliert in Firebase Authentication, Firestore und den Student-Lookups, ohne die bestehende Auth-UID und damit die Kontozuordnung zu ersetzen.

## Deployment

Der Workflow `.github/workflows/firebase-backend-deploy.yml` validiert Functions und Tests, prüft die Erreichbarkeit von `updateStudentAccount` und deployt Functions sowie Firestore-Regeln automatisch, sobald ein unterstützter Firebase-/Google-Deploy-Zugang als GitHub-Actions-Secret vorhanden ist.

Ein manueller vollständiger Backend-Deploy lautet:

```bash
firebase deploy --only functions,firestore:rules --project sprachpilot-12c68
```

Der Deploy-Status wird vom Workflow in der Branch `firebase-status` als `firebase-backend-status.json` abgelegt. Ein HTTP-404 beim Probe-Aufruf von `updateStudentAccount` bedeutet, dass diese Function im Firebase-Projekt noch nicht veröffentlicht ist.
