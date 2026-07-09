(function(){
  "use strict";
  if(!("serviceWorker" in navigator))return;
  if(location.protocol!=="https:"&&location.hostname!=="localhost")return;
  function basePath(){
    var parts=location.pathname.split("/").filter(Boolean);
    return parts[0]==="sprachpilot"?"/sprachpilot/":"/";
  }
  function register(){
    var base=basePath();
    navigator.serviceWorker.register(base+"service-worker.js",{scope:base}).catch(function(err){
      console.warn("SprachPilot cache konnte nicht aktiviert werden",err);
    });
  }
  var idle=window.requestIdleCallback||function(fn){return setTimeout(fn,1200)};
  if(document.readyState==="complete")idle(register);
  else window.addEventListener("load",function(){idle(register)},{once:true});
})();
