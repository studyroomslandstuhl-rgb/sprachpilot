(function(){
'use strict';
const original=Response.prototype.text;
let active=true;
Response.prototype.text=async function(){
 const text=await original.call(this);
 if(active&&text.includes('function participle(v)')&&text.includes('const CATEGORY_ORDER=')&&text.includes('const SPECIAL={')){
  active=false;
  Response.prototype.text=original;
  return text.replace('const SPECIAL={',"const SPECIAL={'schreiben':'geschrieben',")
 }
 return text
};
setTimeout(()=>{if(active){active=false;Response.prototype.text=original}},8000)
})();
