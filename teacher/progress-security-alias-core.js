(function(root){
  'use strict';
  if(root.ProgressSecurityAliasCore)return;

  function text(value){return String(value==null?'':value).trim()}
  function email(value){return text(value).toLowerCase()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function courseValues(data={}){return uniq([data.courseDocId,data.courseCode,data.kurs,data.kursnummer,data.course])}
  function studentIdOf(student={}){return text(student.__docId||student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id)}
  function progressIdOf(progress={}){return text(progress.__docId||progress.id)}
  function identityValues(data={}){return uniq([data.canonicalStudentId,data.docId,data.studentId,data.userId])}

  function indexStudents(students=[]){
    const byId=new Map(),byAlias=new Map(),byUid=new Map(),byEmailCourse=new Map(),byEmail=new Map();
    const errors=[];

    for(const raw of students){
      const student={...raw},id=studentIdOf(student);
      if(!id){errors.push({type:'student-id-missing'});continue}
      student.__docId=id;
      if(byId.has(id))errors.push({type:'duplicate-student-id',studentId:id});
      byId.set(id,student);

      const aliases=uniq([id,...(Array.isArray(student.aliasIds)?student.aliasIds:[]),...identityValues(student)]);
      for(const alias of aliases){
        const prior=byAlias.get(alias);
        if(prior&&prior!==id)errors.push({type:'duplicate-student-alias',alias,studentId:id,otherStudentId:prior});
        else byAlias.set(alias,id);
      }

      const uid=text(student.authUid);
      if(uid){
        const prior=byUid.get(uid);
        if(prior&&prior!==id)errors.push({type:'duplicate-auth-uid',authUid:uid,studentId:id,otherStudentId:prior});
        else byUid.set(uid,id);
      }

      const mail=email(student.email||student.authEmail);
      if(mail){
        if(!byEmail.has(mail))byEmail.set(mail,new Set());
        byEmail.get(mail).add(id);
        for(const course of courseValues(student)){
          const key=mail+'\u0000'+text(course).toLowerCase();
          if(!byEmailCourse.has(key))byEmailCourse.set(key,new Set());
          byEmailCourse.get(key).add(id);
        }
      }
    }
    return{byId,byAlias,byUid,byEmailCourse,byEmail,errors};
  }

  function addEvidence(evidence,id,source){
    if(!id)return;
    if(!evidence.has(id))evidence.set(id,[]);
    evidence.get(id).push(source);
  }

  function resolveProgress(progress,index){
    const progressId=progressIdOf(progress),evidence=new Map();
    if(!progressId)return{ok:false,reason:'progress-id-missing',progressId:''};

    addEvidence(evidence,index.byAlias.get(progressId),'path');
    for(const value of identityValues(progress))addEvidence(evidence,index.byAlias.get(value),'identity:'+value);

    const uid=text(progress.authUid);
    if(uid)addEvidence(evidence,index.byUid.get(uid),'authUid');

    const mail=email(progress.email||progress.authEmail);
    const courses=courseValues(progress);
    if(mail&&courses.length){
      const candidates=new Set();
      for(const course of courses){
        const set=index.byEmailCourse.get(mail+'\u0000'+text(course).toLowerCase());
        if(set)for(const id of set)candidates.add(id);
      }
      if(candidates.size===1)addEvidence(evidence,[...candidates][0],'email+course');
      else if(candidates.size>1)return{ok:false,reason:'ambiguous-email-course',progressId,email:mail,candidates:[...candidates]};
    }

    if(mail){
      const set=index.byEmail.get(mail);
      if(set&&set.size===1)addEvidence(evidence,[...set][0],'unique-email');
    }

    const owners=[...evidence.keys()];
    if(owners.length>1){
      return{ok:false,reason:'progress-owner-collision',progressId,candidates:owners,evidence:Object.fromEntries(evidence)};
    }
    if(owners.length===1){
      const studentId=owners[0];
      if(uid&&index.byUid.has(uid)&&index.byUid.get(uid)!==studentId){
        return{ok:false,reason:'progress-authuid-mismatch',progressId,studentId,authUid:uid,authUidStudentId:index.byUid.get(uid)};
      }
      return{ok:true,progressId,studentId,evidence:evidence.get(studentId)||[]};
    }

    if(mail){
      const set=index.byEmail.get(mail);
      if(set&&set.size>1)return{ok:false,reason:'ambiguous-email',progressId,email:mail,candidates:[...set]};
    }
    return{ok:false,reason:'orphan-progress',progressId,email:mail||''};
  }

  function resolveOwnership(students=[],progressDocs=[]){
    const index=indexStudents(students);
    if(index.errors.length)return{ok:false,indexErrors:index.errors,assignments:[],failures:[]};
    const assignments=[],failures=[];
    for(const progress of progressDocs){
      const result=resolveProgress(progress,index);
      if(result.ok)assignments.push(result);else failures.push(result);
    }
    return{ok:failures.length===0,indexErrors:[],assignments,failures,index};
  }

  function buildAliasPlan(students=[],assignments=[]){
    const plan=new Map();
    for(const student of students){
      const id=studentIdOf(student);if(!id)continue;
      plan.set(id,new Set(uniq(Array.isArray(student.aliasIds)?student.aliasIds:[])));
    }
    for(const assignment of assignments){
      const set=plan.get(assignment.studentId)||new Set();
      if(assignment.progressId&&assignment.progressId!==assignment.studentId)set.add(assignment.progressId);
      plan.set(assignment.studentId,set);
    }
    return new Map([...plan].map(([id,set])=>[id,[...set].sort()]));
  }

  root.ProgressSecurityAliasCore={
    text,email,uniq,courseValues,studentIdOf,progressIdOf,identityValues,
    indexStudents,resolveProgress,resolveOwnership,buildAliasPlan
  };
})(typeof window!=='undefined'?window:globalThis);
