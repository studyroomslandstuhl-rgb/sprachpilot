(async function(){
'use strict';
const D=window.L9T2;if(!D||!window.SPWordOverviewStandard)return;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function languageLabel(){const p=profile(),raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/uk|ua|ukrain/.test(raw))return'Ukrainisch';if(/ru|russ/.test(raw))return'Russisch';if(/tr|türk|turk/.test(raw))return'Türkisch';if(/ar|arab/.test(raw))return'Arabisch';if(/ja|japan/.test(raw))return'Japanisch';if(/ro|rum|rom/.test(raw))return'Rumänisch';if(/pl|pol/.test(raw))return'Polnisch';if(/ku|kurd/.test(raw))return'Kurdisch';return'Englisch'}
const canonical=new Map((window.L9_T2_WORDS||[]).map(item=>[item.id,item]));
const items=(D.cards||[]).map(item=>{
 const base=canonical.get(item.id)||{};
 return {...base,...item,perfect:item.perfect||base.perfect||'',plural:item.plural||base.plural||'',image:item.image||base.image||`https://sprachpilot.b-cdn.net/${item.id}.webp`,audio:item.audio||base.audio||`https://sprachpilot.b-cdn.net/audio/${item.id}.mp3`};
});
await window.SPWordOverviewStandard.render({
 root:'#app',items,title:'Wörter aus Thema 2',description:'Hier siehst und hörst du die Wörter aus diesem Thema.',translationLabel:languageLabel(),headerSubtitle:'Wortschatzübersicht · Mach das bitte! · A1 Lektion 9 · Thema 2'
});
const footer=document.querySelector('#app footer');
if(footer&&(D.grammarExtras||[]).length){
 const section=document.createElement('section');
 section.className='l8-card sp-vocab-group';
 section.innerHTML=`<div class="sp-vocab-group-head"><div><div class="sp-vocab-eyebrow">ZUSÄTZLICHE GRAMMATIK</div><h2>doch · bitte · mal</h2></div></div><div class="sp-vocab-list">${D.grammarExtras.map(x=>`<article class="sp-vocab-word"><div class="sp-vocab-image" aria-hidden="true"><div class="sp-vocab-fallback" style="font-size:46px">${x.emoji}</div></div><div class="sp-vocab-content"><h3>${x.word}</h3><div class="sp-vocab-meta">${x.note}</div><div class="sp-vocab-example">${x.example}</div></div></article>`).join('')}</div>`;
 footer.before(section);
}
})();