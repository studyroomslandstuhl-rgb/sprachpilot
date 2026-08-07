(function(){
'use strict';
if(window.__SP_VERB_EXAM_STANDARD_UPDATES_V1)return;
window.__SP_VERB_EXAM_STANDARD_UPDATES_V1=true;
const E=window.VerbGroupsEngine;if(!E||typeof E.examItems!=='function')return;
const previous=E.examItems.bind(E);
E.examItems=function(groupId){
 return previous(groupId).map((item,index)=>item?.task==='exam-group'?{...item,task:index%2?'exam-image':'exam-listen'}:item);
};
})();