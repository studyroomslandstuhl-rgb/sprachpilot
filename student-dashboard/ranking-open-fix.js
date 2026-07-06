(function(){
  function $(id){return document.getElementById(id)}
  function openRanking(){
    const box=$('leaderboard');
    if(!box)return;
    box.style.display='grid';
    box.hidden=false;
    box.removeAttribute('hidden');
    if(!box.innerHTML.trim())box.innerHTML='<div class="empty">Rangliste lädt …</div>';
    if(typeof window.loadRankingSafe==='function')window.loadRankingSafe(true);
    setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }
  function patch(){
    const btn=$('rankingBtn');
    const box=$('leaderboard');
    if(box){box.style.display='grid';box.hidden=false;box.removeAttribute('hidden')}
    if(btn&&!btn.dataset.openFix){
      btn.dataset.openFix='1';
      btn.type='button';
      btn.addEventListener('click',function(e){e.preventDefault();openRanking()});
    }
  }
  document.addEventListener('DOMContentLoaded',patch);
  setTimeout(patch,200);setTimeout(patch,1200);setTimeout(openRanking,1800);
  window.openRanking=openRanking;
})();