(function(){
  window.spHelpHtml=function(message){return '<div class="sp-help-message">'+message+'</div><div class="actions"><button type="button" class="btn secondary" onclick="spContinueAfterHelp()">Weiter</button></div>';};
  window.spContinueAfterHelp=function(){
    var fb=document.getElementById('fb');
    if(fb)fb.innerHTML='';
    document.querySelectorAll('#checkBtn,#speakBtn,#writeBtn,input,textarea').forEach(function(el){el.disabled=false;});
    var input=document.getElementById('answerInput')||document.querySelector('input,textarea');
    if(input)input.focus();
  };
  window.spStopForHelp=function(fb,message){
    document.querySelectorAll('#checkBtn,#speakBtn,#writeBtn,input,textarea').forEach(function(el){el.disabled=true;});
    if(fb)fb.innerHTML=window.spHelpHtml(message);
  };
})();