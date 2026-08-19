(function(root){
  'use strict';
  if(root.StudentAuthProvisioningCore)return;
  const VERSION=1;
  function text(v){return String(v==null?'':v).trim()}
  function email(v){return text(v).toLowerCase()}
  function isExcluded(student={}){
    return student.securityLookupExcluded===true && !email(student.email) && !text(student.authUid);
  }
  function classify(student={}){
    const mail=email(student.email),uid=text(student.authUid),version=Number(student.authProvisioningVersion||0);
    if(isExcluded(student))return{kind:'excluded',email:'',uid:'',done:true};
    if(!mail)return{kind:'missing-email',email:'',uid,done:false};
    if(version>=VERSION)return{kind:'prepared',email:mail,uid,done:true};
    if(uid)return{kind:'bound-existing',email:mail,uid,done:false};
    return{kind:'unbound',email:mail,uid:'',done:false};
  }
  function strongRandomPassword(cryptoObj=root.crypto){
    if(!cryptoObj?.getRandomValues)throw new Error('CRYPTO_RANDOM_REQUIRED');
    const bytes=new Uint8Array(32);cryptoObj.getRandomValues(bytes);
    const lower='abcdefghjkmnpqrstuvwxyz',upper='ABCDEFGHJKMNPQRSTUVWXYZ',nums='23456789',special='!@#$%&*?';
    const all=lower+upper+nums+special;
    const chars=[lower[bytes[0]%lower.length],upper[bytes[1]%upper.length],nums[bytes[2]%nums.length],special[bytes[3]%special.length]];
    for(let i=4;i<bytes.length;i++)chars.push(all[bytes[i]%all.length]);
    return chars.join('');
  }
  function shouldBulkProcess(student={}){const c=classify(student);return !c.done&&c.kind!=='missing-email'}
  root.StudentAuthProvisioningCore={VERSION,text,email,isExcluded,classify,strongRandomPassword,shouldBulkProcess};
})(typeof window!=='undefined'?window:globalThis);
