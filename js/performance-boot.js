(function(){
  "use strict";

  function idle(fn,timeout){
    if("requestIdleCallback" in window)return requestIdleCallback(fn,{timeout:timeout||1500});
    return setTimeout(fn,timeout||600);
  }

  function isImportantImage(img){
    var src=String(img.getAttribute("src")||"").toLowerCase();
    var alt=String(img.getAttribute("alt")||"").toLowerCase();
    return src.indexOf("sprachpilot-logo")!==-1 || alt.indexOf("sprachpilot")!==-1 || !!img.closest(".brand,.brand-logo,.logo,.teacher-brand,.topbar");
  }

  function tuneImage(img){
    if(!img || img.dataset.spPerfTuned==="1")return;
    img.dataset.spPerfTuned="1";
    img.decoding="async";
    if(isImportantImage(img)){
      img.loading="eager";
      try{img.setAttribute("fetchpriority","high")}catch(e){}
      return;
    }
    img.loading="lazy";
    try{img.setAttribute("fetchpriority","low")}catch(e){}
  }

  function tuneImages(root){
    var scope=root&&root.querySelectorAll?root:document;
    if(scope.tagName==="IMG")tuneImage(scope);
    scope.querySelectorAll("img").forEach(tuneImage);
  }

  var tunePending=false;
  function scheduleTune(root){
    if(tunePending)return;
    tunePending=true;
    requestAnimationFrame(function(){
      tunePending=false;
      tuneImages(root||document);
    });
  }

  function observeImages(){
    if(!("MutationObserver" in window))return;
    var observer=new MutationObserver(function(mutations){
      for(var i=0;i<mutations.length;i++){
        var nodes=mutations[i].addedNodes||[];
        for(var j=0;j<nodes.length;j++){
          var node=nodes[j];
          if(node && node.nodeType===1 && (node.tagName==="IMG" || (node.querySelector && node.querySelector("img")))){
            scheduleTune(document);
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  function startImageTuning(){
    tuneImages(document);
    observeImages();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startImageTuning,{once:true});
  else startImageTuning();

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
  if(document.readyState==="complete")idle(register,1200);
  else window.addEventListener("load",function(){idle(register,1200)},{once:true});
})();
