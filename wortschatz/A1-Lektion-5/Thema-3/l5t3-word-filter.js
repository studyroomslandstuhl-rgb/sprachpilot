(function(){
  const remove=new Set(['acht-uhr','halb-neun','viertel-nach-zehn','zehn-vor-acht','woche','monat']);
  if(typeof WORDS==='undefined')return;
  for(let i=WORDS.length-1;i>=0;i--){if(remove.has(WORDS[i].id))WORDS.splice(i,1)}
  const weekend=WORDS.find(w=>w.id==='wochenende');
  if(weekend)weekend.type='Tag';
})();