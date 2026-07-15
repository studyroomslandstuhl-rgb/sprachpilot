(function(){
  'use strict';

  function installCss(){
    if(document.getElementById('vt-l6-card-style'))return;
    var style=document.createElement('style');
    style.id='vt-l6-card-style';
    style.textContent='\
.flip-wrap{width:min(390px,100%);margin:18px auto;perspective:1100px}\
.flip-card{position:relative;width:100%;height:330px;transform-style:preserve-3d;transition:transform .55s ease;cursor:pointer;touch-action:manipulation}\
.flip-card.flipped{transform:rotateY(180deg)}\
.flip-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;border:3px solid var(--line);border-radius:26px;background:#fff;box-shadow:0 12px 28px rgba(0,0,0,.1);backface-visibility:hidden;-webkit-backface-visibility:hidden;text-align:center}\
.flip-front .image-box{margin:0 auto 6px;border:0;box-shadow:none;background:transparent}\
.flip-back{transform:rotateY(180deg);background:var(--soft)}\
.flip-word{font-size:30px;font-weight:900;color:var(--blue-dark);line-height:1.35}\
.flip-note{font-size:14px;color:#667085}\
.card-listen-btn{margin-top:8px;position:relative;z-index:3}\
@media(max-width:600px){.flip-card{height:300px}.flip-word{font-size:24px}.flip-face{padding:14px}}';
    document.head.appendChild(style);
  }

  function isFlashcardTask(){
    var h=document.querySelector('#app h2');
    return h&&h.textContent.trim()==='Karteikarten';
  }

  function enhance(){
    if(!isFlashcardTask())return;
    var section=document.querySelector('#app section.card');
    if(!section||section.dataset.l6CardPattern==='1')return;
    var imageBox=section.querySelector('.image-box');
    var question=section.querySelector('.question');
    var translation=section.querySelector('p.small');
    var actions=section.querySelector('.actions');
    if(!imageBox||!question||!actions)return;

    installCss();
    var verb=question.textContent.trim();
    var tr=translation?translation.textContent.trim():'';
    var wrap=document.createElement('div');
    wrap.className='flip-wrap';
    wrap.innerHTML='<div class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen">'
      +'<div class="flip-face flip-front">'+imageBox.outerHTML+'<div class="small">Klicken: Karte umdrehen</div></div>'
      +'<div class="flip-face flip-back"><div class="flip-word">'+escapeHtml(verb)+'</div>'+(tr?'<div class="flip-note">'+escapeHtml(tr)+'</div>':'')+'<button type="button" class="btn secondary card-listen-btn" data-speak="'+escapeAttr(verb)+'">Hören</button></div>'
      +'</div>';

    imageBox.remove();
    question.remove();
    if(translation)translation.remove();
    actions.before(wrap);
    var card=wrap.querySelector('.flip-card');
    card.addEventListener('click',function(event){
      if(event.target.closest('button'))return;
      card.classList.add('flipped');
    });
    card.addEventListener('keydown',function(event){
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        card.classList.add('flipped');
      }
    });
    section.dataset.l6CardPattern='1';
  }

  function escapeHtml(value){
    return String(value||'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
  }
  function escapeAttr(value){return escapeHtml(value).replace(/`/g,'&#96;');}

  var observer=new MutationObserver(enhance);
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
