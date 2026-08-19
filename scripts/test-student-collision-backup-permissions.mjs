import fs from 'node:fs';

const source=fs.readFileSync(new URL('../teacher/student-collision-repair.js',import.meta.url),'utf8');
function ok(condition,message){if(!condition)throw new Error(message)}

const start=source.indexOf('async function saveBackup');
const end=source.indexOf('\n  async function backupPlan',start);
ok(start>=0&&end>start,'saveBackup function not found');
const body=source.slice(start,end);

ok(!body.includes('.get('),'saveBackup must not read diagnostics before writing');
ok(body.includes("collection('diagnostics').doc(backupId(kind,path))"),'backup must use a fresh diagnostics document id');
ok(body.includes('await ref.set('),'backup must wait for server-confirmed Firestore write');
ok(source.includes('uniqueBackupSuffix'),'backup ids must contain a unique suffix');
ok(source.includes('error.repairStage'),'repair errors must report the failing phase');

console.log('Collision backup permission regression test passed.');
