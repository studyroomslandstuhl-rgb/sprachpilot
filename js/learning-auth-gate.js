import '/js/session-restore.js?v=4';
import { verifySecureAccess } from '/js/secure-access-gate.js?v=1';

// Die Deployment-Injektion hält das Dokument unsichtbar. Erst eine echte Firebase-
// Sitzung mit passender UID (oder eine echte Lehrer-Firebase-Sitzung) gibt es frei.
await verifySecureAccess({allowTeacher:true,redirect:true,mark:true});
