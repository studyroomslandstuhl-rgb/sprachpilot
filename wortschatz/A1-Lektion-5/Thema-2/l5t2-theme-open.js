(function(){
  function apply(){
    if(!window.SprachPilotRelease)return;
    window.SprachPilotRelease.taskReleased=function(){return true};
    window.SprachPilotRelease.filterTasks=function(list){return list||[]};
    window.SprachPilotRelease.blockCurrentIfNeeded=function(){};
  }
  function redraw(){
    apply();
    var area=document.getElementById('area');
    var text=document.body?document.body.textContent:'';
    if(area&&/Gesperrt|Freigabe wird/i.test(text)&&typeof window.show==='function'){
      area.innerHTML='';
      try{window.show()}catch(e){}
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded',redraw);
  setTimeout(redraw,150);
  setTimeout(redraw,700);
  setTimeout(redraw,1500);
})();