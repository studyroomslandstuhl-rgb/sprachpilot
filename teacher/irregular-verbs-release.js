(function(){
  if(typeof RELEASE_CATALOG==='undefined'||!RELEASE_CATALOG||!Array.isArray(RELEASE_CATALOG.modules))return;
  var exists=RELEASE_CATALOG.modules.some(function(module){return module&&module.key==='Irreguläre Verben';});
  if(!exists)RELEASE_CATALOG.modules.push({key:'Irreguläre Verben',title:'Irreguläre Verben'});
})();
