(function(){
  function normalizeBackText(el){
    if(!el)return;
    const txt=(el.textContent||"").trim();
    if(/^zurück$/i.test(txt)||/^←?\s*zurück$/i.test(txt))el.textContent="← Zurück";
  }
  function normalizeTopbar(){
    document.querySelectorAll("a,button").forEach(normalizeBackText);

    // In Aufgaben gab es oft einen zweiten Zurück-Button direkt unter der Leiste.
    // Standard: Zurück gibt es nur oben in der Navigationsleiste.
    document.querySelectorAll(".container > .actions").forEach(box=>{
      const text=(box.textContent||"").replace(/\s+/g," ").trim();
      const links=box.querySelectorAll("a,button");
      if(links.length===1 && /zurück/i.test(text))box.remove();
    });

    document.querySelectorAll(".topbar .nav, .hero .nav").forEach(nav=>{
      nav.classList.add("sp-page-nav");
      const back=[...nav.querySelectorAll("a,button")].find(x=>/zurück/i.test(x.textContent||""));
      if(back)normalizeBackText(back);
    });

    document.querySelectorAll(".topbar-main").forEach(main=>main.classList.add("sp-account-row"));
  }
  normalizeTopbar();
  document.addEventListener("DOMContentLoaded",normalizeTopbar);
  setTimeout(normalizeTopbar,50);
  setTimeout(normalizeTopbar,300);
  setTimeout(normalizeTopbar,1000);
})();
