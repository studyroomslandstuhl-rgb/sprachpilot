(function(){
  const IMG={
    morgen:'/assets/img/der_morgen.png',
    vormittag:'/assets/img/der_vormittag.png',
    mittag:'/assets/img/der_mittag.png',
    nachmittag:'/assets/img/der_nachmittag.png',
    abend:'/assets/img/der_abend.png',
    nacht:'/assets/img/die_nacht.png',
    mitternacht:'/assets/img/die_mitternacht.png'
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(IMG[w.id])w.image=IMG[w.id]});
})();