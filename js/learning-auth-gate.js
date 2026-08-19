import '/js/session-restore.js?v=3';
import { requireLogin } from '/js/auth.js?v=login-gate1';

// Ein Lernlink darf nie als anonymer Gast geöffnet werden.
// requireLogin() merkt sich den vollständigen Pfad inkl. Query/Hash und führt
// nach erfolgreichem Schüler-Login genau zu dieser Seite zurück.
const user = requireLogin();

if (user) {
  try {
    document.documentElement.dataset.spLearningAuth = 'ok';
  } catch (e) {}
}
