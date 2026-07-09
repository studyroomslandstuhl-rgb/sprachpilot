(function(){
  function nav(){return document.querySelector('header .nav')}
  function makeBtn(label,fn){
    const b=document.createElement('button');
    b.type='button';
    b.className='btn secondary sp-nav-link';
    b.textContent=label;
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();fn()},true);
    return b;
  }
  function simplifyHeader(){
    const n=nav();if(!n)return;
    try{
      [...n.querySelectorAll('a,button')].forEach(el=>{
        const t=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(t.includes('Zurück')){el.classList.add('sp-nav-back');return}
        if(t==='Übersicht'){el.classList.add('sp-overview-link');el.onclick=null;el.setAttribute('type','button');return}
        el.remove();
      });
      if(!n.querySelector('.sp-nav-back'))n.prepend(makeBtn('← Zurück',()=>{if(typeof spGoBack==='function')spGoBack()}));
      let overview=n.querySelector('.sp-overview-link');
      if(!overview){overview=makeBtn('Übersicht',()=>{if(typeof goOverviewView==='function')goOverviewView();else if(typeof renderVerbOverview==='function')renderVerbOverview()});overview.classList.add('sp-overview-link');n.appendChild(overview)}
    }catch(e){}
  }
  document.addEventListener('click',function(e){
    const el=e.target&&e.target.closest?e.target.closest('a,button'):null;if(!el)return;
    if(el.classList&&el.classList.contains('sp-nav-back')){e.preventDefault();e.stopPropagation();if(typeof spGoBack==='function')spGoBack();return}
    if(el.classList&&el.classList.contains('sp-overview-link')){e.preventDefault();e.stopPropagation();if(typeof goOverviewView==='function')goOverviewView();else if(typeof renderVerbOverview==='function')renderVerbOverview();return}
  },true);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(simplifyHeader,80);setTimeout(simplifyHeader,400)},{once:true});
  try{new MutationObserver(simplifyHeader).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();