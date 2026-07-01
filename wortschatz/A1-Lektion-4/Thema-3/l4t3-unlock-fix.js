(function(){
function doneOld(file){try{var st=JSON.parse(localStorage.getItem(taskKey(file))||'null');var total=Number(st&&st.total||0);var done=st&&Array.isArray(st.done)?st.done.length:0;return total>0&&done>=total;}catch(e){return false;}}
var oldPct=pct;
pct=function(file,total){return doneOld(file)?100:oldPct(file,total);};
taskDoneCount=function(){return TASK_FILES.filter(function(f){return pct(f,getTotal(f))>=100;}).length;};
allPrereqComplete=function(){return TASK_FILES.every(function(f){return pct(f,getTotal(f))>=100;});};
examUnlocked=function(){if(allPrereqComplete())localStorage.setItem(examUnlockKey(),'1');return localStorage.getItem(examUnlockKey())==='1';};
})();