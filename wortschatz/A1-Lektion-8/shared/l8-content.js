window.L8_CONTENT_READY=(async()=>{
  if(!('DecompressionStream' in window))throw new Error('Dieser Browser unterstützt die Lerninhalte nicht. Bitte aktualisiere den Browser.');
  const b=atob(window.L8_DATA||'');
  const a=new Uint8Array(b.length);
  for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);
  const ds=new DecompressionStream('gzip');
  const text=await new Response(new Blob([a]).stream().pipeThrough(ds)).text();
  (0,eval)(text);

  // Datenkorrektur: Bei "etwas ausleihen" war die gespeicherte Lösung
  // "... bringt es später wieder.", während die sichtbare richtige Option
  // "... bringt es später zurück." lautet. Dadurch konnte keine sichtbare
  // Antwort als richtig erkannt werden.
  const themes=window.L8_ALL_THEMES||{};
  const themeList=Array.isArray(themes)?themes:Object.values(themes);
  for(const theme of themeList){
    for(const task of (theme?.tasks||[])){
      for(const item of (task?.items||[])){
        if(item?.type!=='choice'||!Array.isArray(item.options))continue;
        const prompt=String(item.prompt||'').trim().toLowerCase();
        if(prompt!=='etwas ausleihen')continue;
        const visibleCorrect=item.options.find(option=>String(option).trim()==='Man nimmt etwas und bringt es später zurück.');
        const stored=Array.isArray(item.answer)?item.answer[0]:item.answer;
        if(visibleCorrect&&String(stored||'').trim()==='Man nimmt etwas und bringt es später wieder.'){
          item.answer=visibleCorrect;
        }
      }
    }
  }

  delete window.L8_DATA;
  return window.L8_ALL_THEMES;
})();
