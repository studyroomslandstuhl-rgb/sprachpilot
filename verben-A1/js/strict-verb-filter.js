(function(){
function j(k){try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch(e){return {}}}
function p(){return window.profile||j('SP_USER_PROFILE')||j('SP_STUDENT_PROFILE')||{}}
function d(){var x=p();return x.assignments||j('SP_COURSE_RELEASES')||{}}
function g(o,a){var c=o;for(var i=0;i<a.length;i++){if(!c||typeof c!=='object'||!(a[i] in c))return undefined;c=c[a[i]]}return c}
function all(){return (window.ALL_VERBS||[]).map(function(x){return x.v}).filter(Boolean)}
function hasData(x){return !!(x&&(x.enabledWords||x.releases||x.enabledModules||x.settings||x.defaultLocked!==undefined||x.releaseMode))}
function val(x,v){var ps=[['enabledWords',v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]];for(var i=0;i<ps.length;i++){var z=g(x,ps[i]);if(z!==undefined)return z===true}return undefined}
function controls(x){var ew=x.enabledWords||{};var n=all();if(Object.keys(ew).some(function(k){return k.indexOf('verben-A1/')>=0||k.indexOf('Verben A1/')>=0||n.indexOf(k)>=0}))return true;return !!(g(x,['releases','verben-A1','words'])||g(x,['releases','Verben A1','words']))}
function list(){var x=d();var n=all();if(!hasData(x))return [];if(controls(x)||x.defaultLocked!==false)return n.filter(function(v){return val(x,v)===true});return n.filter(function(v){return val(x,v)!==false})}
function filt(a){var s=new Set(list());return (a||[]).filter(function(v){return s.has(v)})}
function patch(){if(typeof window.unusedVerbs==='function'&&!window.unusedVerbs.__sf){var u=window.unusedVerbs;window.unusedVerbs=function(){return filt(u())};window.unusedVerbs.__sf=true}if(typeof window.currentPracticeVerbs==='function'&&!window.currentPracticeVerbs.__sf){var c=window.currentPracticeVerbs;window.currentPracticeVerbs=function(){return filt(c())};window.currentPracticeVerbs.__sf=true}if(typeof window.currentPackageAllVerbs==='function'&&!window.currentPackageAllVerbs.__sf){var k=window.currentPackageAllVerbs;window.currentPackageAllVerbs=function(){return filt(k())};window.currentPackageAllVerbs.__sf=true}}
window.spStrictReleasedVerbList=list;patch();document.addEventListener('DOMContentLoaded',patch);setTimeout(patch,300);setTimeout(patch,1500);setTimeout(function(){patch();if(typeof renderHome==='function')renderHome()},3500);
})();