(async function(){
'use strict';
const D=window.L9T2;if(!D||!window.SPWordOverviewStandard)return;
const A=D.assets||window.L9T2Assets||{};
const bunnyImage=id=>typeof A.image==='function'?A.image(id):`https://sprachpilot.b-cdn.net/${String(id||'')}.webp`;
const bunnyAudio=id=>typeof A.audio==='function'?A.audio(id):`https://sprachpilot.b-cdn.net/audio/${String(id||'')}.mp3`;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function languageLabel(){const p=profile(),raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/uk|ua|ukrain/.test(raw))return'Ukrainisch';if(/ru|russ/.test(raw))return'Russisch';if(/tr|türk|turk/.test(raw))return'Türkisch';if(/ar|arab/.test(raw))return'Arabisch';if(/ja|japan/.test(raw))return'Japanisch';if(/ro|rum|rom/.test(raw))return'Rumänisch';if(/pl|pol/.test(raw))return'Polnisch';if(/ku|kurd/.test(raw))return'Kurdisch';return'Englisch'}
function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function play(x){const src=String(x.audio||'');if(!src)return speak(x.word);try{const a=new Audio(src);a.onerror=()=>speak(x.word);a.play().catch(()=>speak(x.word))}catch(e){speak(x.word)}}
const canonical=new Map((window.L9_T2_WORDS||[]).map(item=>[item.id,item]));
const items=(D.cards||[]).map(item=>{const base=canonical.get(item.id)||{};return {...base,...item,perfect:item.perfect||base.perfect||'',plural:item.plural||base.plural||'',image:bunnyImage(item.id),audio:bunnyAudio(item.id)}});
await window.SPWordOverviewStandard.render({root:'#app',items,title:'Wörter aus Thema 2',description:'Hier siehst und hörst du die Wörter aus diesem Thema.',translationLabel:languageLabel(),headerSubtitle:'Wortschatzübersicht · Mach das bitte! · A1 Lektion 9 · Thema 2'});
const footer=document.querySelector('#app footer');
if(footer&&(D.grammarExtras||[]).length){
 const section=document.createElement('section');section.className='l8-card sp-vocab-group';
 section.innerHTML=`<div class="sp-vocab-group-head"><div><div class="sp-vocab-eyebrow">ZUSÄTZLICHE GRAMMATIK</div><h2>doch · bitte · mal</h2></div></div><div class="sp-vocab-list">${D.grammarExtras.map(x=>`<article class="sp-vocab-word"><div class="sp-vocab-image" aria-hidden="true"><div class="sp-vocab-fallback" style="font-size:46px">${x.emoji}</div></div><div class="sp-vocab-content"><h3>${x.word}</h3>${x.translation?`<div class="sp-vocab-meta">${languageLabel()}: ${x.translation}</div>`:''}<div class="sp-vocab-meta">${x.note}</div><div class="sp-vocab-example">${x.example}</div></div><div class="sp-vocab-actions"><button class="sp-vocab-audio l8-btn" type="button" data-extra-audio="${x.id}">🔊 Hören</button></div></article>`).join('')}</div>`;
 footer.before(section);
 section.querySelectorAll('[data-extra-audio]').forEach(btn=>btn.addEventListener('click',()=>{const x=D.grammarExtras.find(v=>v.id===btn.dataset.extraAudio);if(x)play(x)}));
}
})();