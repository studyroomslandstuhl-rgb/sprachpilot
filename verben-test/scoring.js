syncTaskPoints=async function(task){
  const pkg=activePackage();if(!pkg)return;
  const done=taskPercent(task.id)>=100;
  if(done&&Number(pkg.taskPoints[task.id]||0)<5){pkg.taskPoints[task.id]=5;persistLocal()}
  if(!done)return;
  try{
    const progress=await import('/js/progress.js?v=verben-test-scoring-1');
    await progress.recordTaskProgress?.({module:'verbenTest',moduleTitle:MODULE_TITLE,topicId:`verben-test-${pkg.id}`,title:`Verben Test · Paket ${pkg.id}`,level:'A1',file:task.id,taskTitle:task.title,percent:100,done:pkg.verbs.length,total:pkg.verbs.length,completed:true});
  }catch(e){}
};
syncExam=async function(percent){
  const pkg=activePackage();if(!pkg)return;
  try{
    const progress=await import('/js/progress.js?v=verben-test-scoring-1');
    await progress.recordExamResult?.({module:'verbenTest',moduleTitle:MODULE_TITLE,topicId:`verben-test-${pkg.id}`,title:`Verben Test · Paket ${pkg.id}`,level:'A1',percent,scorePercent:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0});
  }catch(e){}
};
window.VERBEN_TEST_SCORING={module:'verbenTest',taskPoints:5,examMax:100,packageMax:150};
