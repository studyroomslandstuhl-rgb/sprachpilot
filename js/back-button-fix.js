(function(){
  const HUB='/verben-bereich/';

  function moduleTarget(path,query,text){
    const group=Math.max(0,Number(query.get('group'))||0);
    const task=query.get('task')||'';
    const overview=query.get('view')==='overview';

    if(path.includes('/perfekt/')){
      if(/verben-bereich/i.test(text))return HUB;
      if(overview||/←\s*perfekt/i.test(text))return '/perfekt/';
      if(task&&group)return `/perfekt/?group=${group}`;
      return HUB
    }

    if(path.includes('/verben/')){
      if(/verben-bereich/i.test(text))return HUB;
      if(overview||/^←\s*verben$/i.test(text))return '/verben/';
      if(task&&group)return `/verben/?group=${group}`;
      return HUB
    }

    return ''
  }

  function targetFor(el){
    const path=location.pathname;
    const query=new URLSearchParams(location.search);
    const text=String(el?.textContent||'').trim();
    const module=moduleTarget(path,query,text);
    if(module)return module;

    let match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/(.+)$/i);
    if(match)return 'index.html';
    match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/?(?:index\.html)?$/i);
    if(match)return '../index.html';
    match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/?(?:index\.html)?$/i);
    if(match)return '/wortschatz/';
    if(path.includes('/verben-A1/')||path.includes('/fragen-A1/'))return '/student-dashboard/index.html';
    return '/student-dashboard/index.html'
  }

  function isBack(el){
    return /zurück|zurueck|←/i.test(String(el?.textContent||'').trim())
  }

  function fix(){
    document.querySelectorAll('a,button').forEach(el=>{
      if(!isBack(el))return;
      const target=targetFor(el);
      if(el.tagName==='A'){
        el.setAttribute('href',target);
        return
      }
      if(el.dataset.spBackFixed)return;
      el.dataset.spBackFixed='1';
      el.addEventListener('click',event=>{
        event.preventDefault();
        location.href=targetFor(el)
      })
    })
  }

  document.addEventListener('DOMContentLoaded',fix);
  setTimeout(fix,300);
  setTimeout(fix,1200);
})();
