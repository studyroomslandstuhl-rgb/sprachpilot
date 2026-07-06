(function(){
  function targetForPath(){
    const p=location.pathname;
    let m=p.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/(.+)$/i);
    if(m)return 'index.html';
    m=p.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/?(?:index\.html)?$/i);
    if(m)return '../index.html';
    m=p.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/?(?:index\.html)?$/i);
    if(m)return '/wortschatz/';
    if(p.includes('/verben-A1/')||p.includes('/fragen-A1/'))return '/student-dashboard/index.html';
    return '/student-dashboard/index.html';
  }
  function isBack(el){return /zurück|zurueck|←/i.test((el.textContent||'').trim())}
  function fix(){
    const target=targetForPath();
    document.querySelectorAll('a,button').forEach(el=>{
      if(!isBack(el))return;
      if(el.tagName==='A')el.setAttribute('href',target);
      else if(!el.dataset.spBackFixed){el.dataset.spBackFixed='1';el.addEventListener('click',e=>{e.preventDefault();location.href=target})}
    });
  }
  document.addEventListener('DOMContentLoaded',fix);setTimeout(fix,300);setTimeout(fix,1200);
})();