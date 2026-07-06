(function(){
  function $(id){return document.getElementById(id)}
  function patch(){
    const box=$('leaderboard');
    if(box){box.style.display='grid';box.hidden=false;box.removeAttribute('hidden')}
    const btn=$('rankingBtn');
    if(btn)btn.type='button';
  }
  document.addEventListener('DOMContentLoaded',patch);
  setTimeout(patch,200);
})();