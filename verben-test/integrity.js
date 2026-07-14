function runIntegrityChecks(){
  const errors=[];
  const taskIds=TASKS.map(task=>task.id);
  if(TASKS.length!==10)errors.push('Es müssen genau zehn Übungsaufgaben vorhanden sein.');
  if(new Set(taskIds).size!==taskIds.length)errors.push('Aufgaben-IDs sind nicht eindeutig.');
  if(!catalog.length)errors.push('Der Verben-Katalog ist leer.');
  if(new Set(catalog.map(item=>item.verb)).size!==catalog.length)errors.push('Der Verben-Katalog enthält doppelte Einträge.');
  if(window.VERBEN_TEST_SCORING?.module!=='verbenTest')errors.push('Verben Test verwendet nicht das getrennte Punktekonto.');
  if(Number(window.VERBEN_TEST_SCORING?.taskPoints)!==5)errors.push('Eine Aufgabe muss genau 5 Punkte geben.');
  if(Number(window.VERBEN_TEST_SCORING?.examMax)!==100)errors.push('Die Prüfung darf maximal 100 Punkte geben.');
  const exactImages={
    'sich vorstellen':'sich_vorstellen.webp','sich kämmen':'sich_kaemmen.webp','sich rasieren':'sich_rasieren.webp','sich schminken':'sich_schminken.webp',
    'sich bewegen':'sich_bewegen.webp','wandern':'wandern.webp','meinen':'meinen.webp','grillen':'grillen.webp','wecken':'wecken.webp','üben':'ueben.webp',
    'trainieren':'trainieren.webp','losfahren':'losfahren.webp','dabeihaben':'dabeihaben.webp','leidtun':'leidtun.webp','leiden':'leiden.webp',
    'opfern':'opfern.webp','reißen':'reissen.webp','können':'koennen.webp'
  };
  Object.entries(exactImages).forEach(([verb,file])=>{if(SPECIAL_IMAGE_FILES[verb]!==file)errors.push(`Falsche Bildzuordnung: ${verb}`)});
  if(state){
    const pkg=activePackage();
    if(pkg){
      if(pkg.verbs.length>PACKAGE_SIZE)errors.push('Das aktive Paket enthält mehr als 20 Verben.');
      if(new Set(pkg.verbs).size!==pkg.verbs.length)errors.push('Das aktive Paket enthält doppelte Verben.');
      if(pkg.verbs.some(verb=>!catalogByVerb.has(verb)))errors.push('Das aktive Paket enthält ein unbekanntes Verb.');
      TASKS.forEach(task=>{
        const done=taskDoneList(task.id);
        if(done.some(verb=>!pkg.verbs.includes(verb)))errors.push(`Fremdes Verb im Fortschritt von ${task.title}.`);
        if(Number(pkg.taskPoints?.[task.id]||0)>5)errors.push(`Zu viele Punkte bei ${task.title}.`);
      });
      if(Number(pkg.examBest||0)>100)errors.push('Die Prüfung enthält mehr als 100 Punkte.');
      if(packagePoints()>150)errors.push('Das Paket enthält mehr als 150 Punkte.');
    }
    if(state.learned.some(verb=>!catalogByVerb.has(verb)))errors.push('Gelernt enthält ein unbekanntes Verb.');
  }
  return errors;
}
function assertIntegrity(){const errors=runIntegrityChecks();if(errors.length)throw new Error(errors.join(' '));return true}
window.VERBEN_TEST_DIAGNOSTICS={
  run:()=>({ok:runIntegrityChecks().length===0,errors:runIntegrityChecks(),catalog:catalog.length,tasks:TASKS.length,packageSize:packageVerbs().length,points:packagePoints()}),
  state:()=>clone(state)
};
