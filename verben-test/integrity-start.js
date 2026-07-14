(function(){
  const start=window.VT_START;
  if(typeof start!=='function')throw new Error('Startfunktion für Verben Test fehlt.');
  window.VT_START=async function(){
    await start();
    if(typeof state!=='undefined'&&state&&typeof assertIntegrity==='function')assertIntegrity();
  };
})();
