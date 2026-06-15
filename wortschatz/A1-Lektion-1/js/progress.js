export function createEmptyProgress(assignment){
  return {
    version:2,
    assignmentId:assignment.assignmentId,
    seenAssignedVerbs:[],
    known:[],
    unsure:[],
    unknown:[],
    activeVerbs:assignment.activeVerbs.slice(0,20),
    completedVerbs:[],
    skillDone:{},
    skillAttempts:{},
    stars:0,
    overallPercent:0,
    updatedAt:Date.now()
  };
}

export function migrateProgress(oldProgress, assignment){
  const p = oldProgress || createEmptyProgress(assignment);
  p.version = 2;
  p.assignmentId = assignment.assignmentId;
  p.seenAssignedVerbs = Array.isArray(p.seenAssignedVerbs) ? p.seenAssignedVerbs : [];
  p.known = Array.isArray(p.known) ? p.known : [];
  p.unsure = Array.isArray(p.unsure) ? p.unsure : [];
  p.unknown = Array.isArray(p.unknown) ? p.unknown : [];
  p.activeVerbs = Array.isArray(p.activeVerbs) && p.activeVerbs.length ? p.activeVerbs : assignment.activeVerbs.slice(0,20);
  p.completedVerbs = Array.isArray(p.completedVerbs) ? p.completedVerbs : [];
  p.skillDone = p.skillDone || {};
  p.skillAttempts = p.skillAttempts || {};
  return p;
}

export function addNewAssignedVerbs(progress, newVerbs){
  const active = new Set(progress.activeVerbs);
  for(const v of newVerbs){
    if(!active.has(v) && !progress.completedVerbs.includes(v)){
      progress.activeVerbs.push(v);
      active.add(v);
    }
  }
  progress.seenAssignedVerbs = [...new Set([...(progress.seenAssignedVerbs||[]), ...newVerbs])];
  progress.updatedAt = Date.now();
  return progress;
}

export function markSkill(progress, verbId, taskId, correct=true){
  progress.skillDone[verbId] = progress.skillDone[verbId] || {};
  progress.skillAttempts[verbId] = progress.skillAttempts[verbId] || {};
  progress.skillAttempts[verbId][taskId] = (progress.skillAttempts[verbId][taskId] || 0) + 1;
  if(correct) progress.skillDone[verbId][taskId] = true;
  progress.updatedAt = Date.now();
  return progress;
}

export function verbPercent(progress, verbId, enabledTasks){
  const done = progress.skillDone[verbId] || {};
  if(!enabledTasks.length) return 0;
  const count = enabledTasks.filter(t => done[t]).length;
  return Math.round(count * 100 / enabledTasks.length);
}

export function recalc(progress, assignment){
  const verbs = progress.activeVerbs || [];
  if(!verbs.length){ progress.overallPercent = 0; return progress; }
  const sum = verbs.reduce((s,v)=>s+verbPercent(progress,v,assignment.enabledTasks),0);
  progress.overallPercent = Math.round(sum / verbs.length);
  progress.completedVerbs = verbs.filter(v => verbPercent(progress,v,assignment.enabledTasks) >= 100);
  progress.stars = progress.completedVerbs.length;
  return progress;
}

export function clearProgress(assignment){
  return createEmptyProgress(assignment);
}
