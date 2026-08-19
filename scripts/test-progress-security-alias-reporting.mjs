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

console.log('Progress security alias reporting tests passed.');
