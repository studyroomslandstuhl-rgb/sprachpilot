import { VERB_SETS } from "../data/verbSets.js";

export function defaultAssignment(){
  return {
    assignmentId:"default-a1-standard-start",
    title:"A1 Standard Start",
    activeSetIds:["a1-standard-start"],
    enabledTasks:VERB_SETS["a1-standard-start"].tasks,
    activeVerbs:VERB_SETS["a1-standard-start"].verbs,
    notifyNewVerbs:true,
    updatedAt:null
  };
}

export function normalizeAssignment(remote){
  const fallback = defaultAssignment();
  if(!remote) return fallback;

  const setIds = Array.isArray(remote.activeSetIds) ? remote.activeSetIds : [];
  const verbsFromSets = setIds.flatMap(id => VERB_SETS[id]?.verbs || []);
  const activeVerbs = Array.isArray(remote.activeVerbs) && remote.activeVerbs.length
    ? remote.activeVerbs
    : verbsFromSets;

  const tasksFromSets = setIds.flatMap(id => VERB_SETS[id]?.tasks || []);
  const enabledTasks = Array.isArray(remote.enabledTasks) && remote.enabledTasks.length
    ? remote.enabledTasks
    : tasksFromSets;

  return {
    ...fallback,
    ...remote,
    activeSetIds:setIds.length ? setIds : fallback.activeSetIds,
    activeVerbs:[...new Set(activeVerbs.length ? activeVerbs : fallback.activeVerbs)],
    enabledTasks:[...new Set(enabledTasks.length ? enabledTasks : fallback.enabledTasks)]
  };
}

export function detectNewVerbs(assignment, progress){
  const alreadySeen = new Set(progress?.seenAssignedVerbs || []);
  return assignment.activeVerbs.filter(v => !alreadySeen.has(v));
}
