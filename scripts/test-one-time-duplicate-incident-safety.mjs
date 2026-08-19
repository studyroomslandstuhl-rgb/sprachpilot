import fs from 'node:fs';

const src=fs.readFileSync('teacher/one-time-duplicate-incident.js','utf8');
function ok(condition,message){if(!condition)throw new Error(message)}

ok(src.includes("oneTimeDuplicateIncidentStatus==='complete'"),'global complete marker guard missing');
ok(src.includes('oneTimeDuplicateIncidentVersion'),'per-incident version marker missing');
ok(src.includes('securityArchived:true'),'old progress must be archived');
ok(src.includes("backupType:'one-time-duplicate-incident'"),'pre-write incident backups missing');
ok(src.includes("where('backupType','==','student-collision-repair')"),'original collision backups are not used');
ok(!/batch\.delete\([^\n]*collection\('progress'\)/.test(src),'progress documents must never be batch-deleted');
ok(!/collection\('progress'\)[^\n]*\.delete\(/.test(src),'progress documents must never be directly deleted');
ok(src.includes("batch.delete(state.db.collection('students')"),'duplicate student profile removal missing');

console.log('One-time duplicate incident safety contract passed.');
