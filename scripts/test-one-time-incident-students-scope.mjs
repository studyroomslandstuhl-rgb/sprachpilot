import fs from 'node:fs';
import vm from 'node:vm';

function ok(condition,message){if(!condition)throw new Error(message)}

const context={console};
vm.createContext(context);

// Exakt wie im Lehrer-Dashboard: students.js ist ein klassisches Script und deklariert
// `const Students`. Dieses Binding ist für spätere Scripts sichtbar, aber keine window/globalThis-Eigenschaft.
vm.runInContext(fs.readFileSync('teacher/students.js','utf8'),context,{filename:'teacher/students.js'});
ok(context.Students===undefined,'Regression setup invalid: lexical Students unexpectedly became global property');

context.OneTimeDuplicateIncidentCore={VERSION:1};
vm.runInContext(fs.readFileSync('teacher/one-time-duplicate-incident.js','utf8'),context,{filename:'teacher/one-time-duplicate-incident.js'});
ok(typeof context.OneTimeDuplicateIncident?.mergeFn==='function','incident merge function was not exported');

const left={
  id:'old-a',
  fragen:{l1t1:{progressPercent:40,tasks:{a:{percent:100,completed:true}},lifetime:{points:25}}},
  pointsTotal:50,
  ranking:{points:50}
};
const right={
  id:'old-b',
  fragen:{l1t1:{progressPercent:80,tasks:{b:{percent:100,completed:true}},lifetime:{points:40}}},
  wortschatz:{l1t1:{progressPercent:100,tasks:{w1:{percent:100,completed:true}}}},
  pointsTotal:70,
  ranking:{points:70}
};

const merged=context.OneTimeDuplicateIncident.mergeFn(left,right);
ok(merged.fragen.l1t1.progressPercent===80,'topic progress did not merge');
ok(merged.fragen.l1t1.tasks.a?.completed===true,'left task was lost');
ok(merged.fragen.l1t1.tasks.b?.completed===true,'right task was lost');
ok(merged.wortschatz.l1t1.progressPercent===100,'second module was lost');
ok(merged.pointsTotal===70,'normal merge must keep max points before incident-specific sum override');
ok(merged.ranking.points===70,'ranking max merge failed');

console.log('One-time incident Students lexical-scope regression test passed.');
