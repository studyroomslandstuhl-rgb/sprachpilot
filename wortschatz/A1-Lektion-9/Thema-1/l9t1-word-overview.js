(function(){
'use strict';
const D=window.L9T1;if(!D||!window.SPWordOverviewStandard)return;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function languageLabel(){const p=profile(),raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/uk|ua|ukrain/.test(raw))return'Ukrainisch';if(/ru|russ/.test(raw))return'Russisch';if(/tr|türk|turk/.test(raw))return'Türkisch';if(/ar|arab/.test(raw))return'Arabisch';if(/ja|japan/.test(raw))return'Japanisch';if(/ro|rum|rom/.test(raw))return'Rumänisch';if(/pl|pol/.test(raw))return'Polnisch';if(/ku|kurd/.test(raw))return'Kurdisch';return'Englisch'}
window.SPWordOverviewStandard.render({
 root:'#app',
 items:D.cards||[],
 title:'Wörter aus Thema 1',
 description:'Hier siehst und hörst du die Wörter und Redewendungen aus diesem Thema.',
 translationLabel:languageLabel(),
 headerSubtitle:'Wortschatzübersicht · Was muss man machen? · A1 Lektion 9 · Thema 1'
});
})();
