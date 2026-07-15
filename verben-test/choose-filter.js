// Verben Test chooser UI only.
// Diese Datei filtert nur die sichtbaren Zeilen in "Verben wählen".
// Sie ändert keine Paket-, Punkte- oder Speicherlogik.
(function(){
  'use strict';

  const FILTERS=[
    {id:'all',label:'Alle'},
    {id:'regular',label:'Regulär'},
    {id:'irregular',label:'Irregulär'},
    {id:'modal',label:'Modal'},
    {id:'separable',label:'Trennbar'},
    {id:'reflexive',label:'Reflexiv'}
  ];
  const MODALS=new Set(['können','koennen','müssen','muessen','dürfen','duerfen','wollen','sollen','mögen','moegen']);
  const IRREGULAR=new Set(['sein','haben','werden','wissen','tun','geben','nehmen','essen','sprechen','lesen','sehen','fahren','laufen','schlafen','helfen','treffen','tragen','waschen','fallen','fangen','halten','lassen','gefallen','empfehlen','vergessen','verstehen','bringen','denken','kennen','nennen','rennen','brennen']);
  const SEPARABLE_PREFIXES=['ab','an','auf','aus','ein','mit','nach','vor','weg','zu','zurück','zurueck','fern','los','her','hin','raus','rein','um'];

  let active='all';
  let lastChooseCard=null;

  function clean(value){
    return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
  }

  function visibleText(row){
    const title=row.querySelector('b')?.textContent||'';
    const translation=row.querySelector('.translation')?.textContent||'';
    return {title,translation};
  }

  function hasIrregularData(verb){
    const source=window.VERBEN_TEST_SOURCE||{};
    const irregular=source.irregular||{};
    return Boolean(irregular[verb]||irregular[clean(verb)]||IRREGULAR.has(verb)||IRREGULAR.has(clean(verb))||MODALS.has(clean(verb)));
  }

  function isSeparable(verb){
    const low=clean(verb);
    if(low.startsWith('sich '))return false;
    return SEPARABLE_PREFIXES.some(prefix=>low.startsWith(prefix)&&low.length>prefix.length+3);
  }

  function typeOfVerb(verb){
    const low=clean(verb);
    const types=[];
    if(low.startsWith('sich '))types.push('reflexive');
    if(MODALS.has(low))types.push('modal');
    if(isSeparable(verb))types.push('separable');
    if(hasIrregularData(verb))types.push('irregular');
    if(!types.length)types.push('regular');
    return types;
  }

  function labelForType(type){
    return FILTERS.find(item=>item.id===type)?.label||type;
  }

  function rowMatches(row){
    if(active==='all')return true;
    const {title}=visibleText(row);
    return typeOfVerb(title).includes(active);
  }

  function updateCount(card){
    const rows=[...card.querySelectorAll('.verb-row')];
    const shown=rows.filter(row=>row.style.display!=='none').length;
    const checked=rows.filter(row=>row.querySelector('input[data-verb]')?.checked).length;
    const count=card.querySelector('[data-choice-count]');
    if(count)count.textContent=`${shown} sichtbar · ${checked} gewählt`;
  }

  function applyFilter(card){
    if(!card)return;
    card.querySelectorAll('.verb-row').forEach(row=>{
      row.style.display=rowMatches(row)?'flex':'none';
      const {title}=visibleText(row);
      row.dataset.types=typeOfVerb(title).map(labelForType).join(' · ');
    });
    card.querySelectorAll('[data-verb-filter]').forEach(button=>{
      button.classList.toggle('active',button.dataset.verbFilter===active);
      button.setAttribute('aria-pressed',String(button.dataset.verbFilter===active));
    });
    updateCount(card);
  }

  function makeFilterBar(card){
    if(card.querySelector('[data-verb-filter-bar]'))return;
    const list=card.querySelector('.verb-list');
    if(!list)return;

    card.classList.add('choose-clean');
    const intro=card.querySelector('h2+p');
    if(intro)intro.remove();

    const bar=document.createElement('div');
    bar.className='verb-filter-bar';
    bar.dataset.verbFilterBar='1';
    bar.innerHTML=`<div class="filter-buttons">${FILTERS.map(item=>`<button type="button" class="filter-chip${item.id===active?' active':''}" data-verb-filter="${item.id}" aria-pressed="${item.id===active}">${item.label}</button>`).join('')}</div><div class="choice-count" data-choice-count></div>`;
    list.before(bar);

    bar.addEventListener('click',event=>{
      const button=event.target.closest('[data-verb-filter]');
      if(!button)return;
      active=button.dataset.verbFilter||'all';
      applyFilter(card);
    });

    card.addEventListener('change',event=>{
      if(event.target.matches('input[data-verb]'))updateCount(card);
    });
  }

  function currentChooseCard(){
    const heading=[...document.querySelectorAll('#app h2')].find(h=>h.textContent.trim()==='Verben wählen');
    return heading?heading.closest('.card'):null;
  }

  function enhance(){
    const card=currentChooseCard();
    if(!card)return;
    lastChooseCard=card;
    makeFilterBar(card);
    applyFilter(card);
  }

  const observer=new MutationObserver(()=>{
    const card=currentChooseCard();
    if(card&&card!==lastChooseCard){
      enhance();
      return;
    }
    if(card&&card.querySelector('.verb-list'))applyFilter(card);
  });

  window.addEventListener('DOMContentLoaded',()=>{
    observer.observe(document.body,{childList:true,subtree:true});
    enhance();
  });
})();
