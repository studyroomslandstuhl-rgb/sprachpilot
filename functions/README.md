# SprachPilot Custom Auth Mail

Dieser Ordner enthält ausschließlich serverseitige Firebase Functions für eigene SprachPilot-Authentifizierungs-E-Mails.

## Secret

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

Danach nur die drei Mail-Funktionen deployen:

```bash
firebase deploy --only functions:requestPasswordReset,functions:requestVerificationEmail,functions:provisionStudentAccess
```

Region: `europe-west1`.

## Funktionen

- `requestPasswordReset`: öffentliche, rate-limitierte Passwort-Mail. Antwort verrät nicht, ob das Konto existiert.
- `requestVerificationEmail`: nur für das aktuell authentifizierte Passwortkonto.
- `provisionStudentAccess`: nur für den verifizierten SprachPilot-Owner. Legt bei Bedarf das Firebase-Auth-Konto serverseitig mit einem zufälligen, nie ausgegebenen Startkennwort an und sendet anschließend die eigene Zugangsmail.

## Reihenfolge

Die Weboberfläche wird erst auf diese Functions umgestellt, nachdem SMTP-Secret und Functions erfolgreich deployed und mit einer Testadresse geprüft wurden. Bis dahin bleiben die bisherigen Firebase-Standardmails aktiv.
