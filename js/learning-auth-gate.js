import '/js/session-restore.js?v=4';
import { requireLogin } from '/js/auth.js?v=login-gate2';

// Ein Lernlink darf nie als anonymer Gast oder mit einem alten, nur lokal
// gespeicherten Schülerprofil geöffnet werden. session-restore v4 akzeptiert
// ausschließlich UID-gebundene sichere Schüler-Sessions.
const user = requireLogin();

if (user) {
  try { document.documentElement.dataset.spLearningAuth = 'ok'; } catch (e) {}
}
