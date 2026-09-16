import '/js/role-session-guard.js?v=20260916-role2';
import '/js/session-restore.js?v=20260915-role1';
import { verifySecureAccess } from '/js/secure-access-gate.js?v=1';

// Die Deployment-Injektion hält das Dokument unsichtbar. Erst eine echte Firebase-
// Sitzung mit passender UID (oder eine echte Lehrer-Firebase-Sitzung) gibt es frei.
await verifySecureAccess({allowTeacher:true,redirect:true,mark:true});
