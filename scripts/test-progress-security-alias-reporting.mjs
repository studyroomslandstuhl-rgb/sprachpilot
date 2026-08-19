globalThis.window=globalThis;
globalThis.document={readyState:'loading',addEventListener(){}};

await import('../teacher/progress-security-alias-migration.js');

const migration=globalThis.ProgressSecurityAliasMigration;
if(!migration)throw new Error('ProgressSecurityAliasMigration not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

{
  const error=new Error('PROGRESS_ALIAS_MIGRATION_BLOCKED');
  error.indexErrors=[{type:'duplicate-student-alias',alias:'old-a',studentId:'a',otherStudentId:'b'}];
  error.failures=[];
  const items=migration.collectErrorItems(error);
  ok(items.length===1,'indexErrors must not be hidden by an empty failures array');
  ok(items[0].type==='duplicate-student-alias','wrong index error returned');
  const text=migration.describeErrorItem(items[0]);
  ok(text.includes('duplicate-student-alias')&&text.includes('old-a'),'diagnostic text must expose the actual conflict type and alias');
}

{
  const duplicate={type:'duplicate-auth-uid',authUid:'uid-x',studentId:'a',otherStudentId:'b'};
  const error=new Error('PROGRESS_ALIAS_MIGRATION_BLOCKED');
  error.indexErrors=[duplicate];
  error.failures=[duplicate];
  const items=migration.collectErrorItems(error);
  ok(items.length===1,'duplicate diagnostic items must be de-duplicated');
}

{
  const error=new Error('PROGRESS_ALIAS_VERIFICATION_FAILED');
  error.verification={failures:[{reason:'orphan-progress',progressId:'legacy-x'}]};
  const items=migration.collectErrorItems(error);
  ok(items.length===1&&items[0].reason==='orphan-progress','verification failures must be reported');
}

// Große kanonische Fortschrittsdokumente dürfen für die Sicherheitsmigration gar nicht
// neu geschrieben werden. Die Eigentümerschaft wird über students/{progressId} geprüft.
{
  const hugeDirect={__docId:'student-a',fragen:{veryLarge:'x'}};
  const patch=migration.progressOwnershipPatch(hugeDirect,{progressId:'student-a',studentId:'student-a'});
  ok(patch===null,'direct canonical progress must require zero writes');
}

// Bei einem historischen Alias wird ausschließlich canonicalStudentId benötigt.
// aliasIds/Versions-/Zeitfelder dürfen das große progress-Dokument nicht aufblasen.
{
  const patch=migration.progressOwnershipPatch({__docId:'old-student-a'},{progressId:'old-student-a',studentId:'student-a'});
  ok(JSON.stringify(patch)===JSON.stringify({canonicalStudentId:'student-a'}),'alias progress must receive only canonicalStudentId');
  ok(!('aliasIds' in patch)&&!('progressAliasVersion' in patch)&&!('progressAliasUpdatedAt' in patch),'unnecessary indexed fields leaked into progress patch');
}

// Bereits korrekt kanonisch markierte Alias-Dokumente werden ebenfalls nicht erneut geschrieben.
{
  const patch=migration.progressOwnershipPatch({__docId:'old-student-a',canonicalStudentId:'student-a'},{progressId:'old-student-a',studentId:'student-a'});
  ok(patch===null,'already canonical alias progress must not be rewritten');
}

// Schüler-Aliase werden nur als fehlende Werte geplant. Bestehende Aliaswerte dürfen nicht
// durch eine komplette neue Liste ersetzt werden; das spätere Firestore-Write nutzt arrayUnion.
{
  const analysis={
    students:[
      {__docId:'student-a',aliasIds:['existing-a']},
      {__docId:'student-b',aliasIds:['old-b']}
    ],
    aliasPlan:new Map([
      ['student-a',['existing-a','legacy-a-1','legacy-a-2']],
      ['student-b',['old-b']]
    ]),
    resolver:{
      studentIdOf:s=>s.__docId,
      uniq:values=>[...new Set((values||[]).map(String))]
    }
  };
  const writes=migration.studentAliasWritePlan(analysis);
  ok(writes.length===1,'only students with missing aliases should be written');
  ok(writes[0].studentId==='student-a','wrong student selected for alias write');
  ok(JSON.stringify(writes[0].missing)===JSON.stringify(['legacy-a-1','legacy-a-2']),'only missing aliases must be added');
  ok(writes[0].currentWasArray===true,'existing array field must use atomic arrayUnion path');
}

console.log('Progress security alias reporting tests passed.');
