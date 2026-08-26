(function(){
'use strict';
if(window.__SP_DATIV_OVERVIEW_STANDARD_V1)return;
window.__SP_DATIV_OVERVIEW_STANDARD_V1=true;

const CDN='https://sprachpilot.b-cdn.net/';
const root=document.getElementById('app');
const LANGS=[
 ['en','Englisch',['en','english','englisch']],
 ['ru','Russisch',['ru','russian','russisch']],
 ['tr','Türkisch',['tr','turkish','türkisch','tuerkisch']],
 ['uk','Ukrainisch',['uk','ua','ukrainian','ukrainisch']],
 ['ar','Arabisch',['ar','arabic','arabisch']],
 ['ja','Japanisch',['ja','japanese','japanisch']],
 ['ro','Rumänisch',['ro','romanian','rumänisch','rumaenisch']],
 ['pl','Polnisch',['pl','polish','polnisch']],
 ['ku','Kurdisch',['ku','kurdish','kurdisch','kurmancî','kurmanci']]
];
const LABEL=Object.fromEntries(LANGS.map(([code,label])=>[code,label]));

const TR={
 'antworten':{en:'to answer',ru:'отвечать',tr:'cevap vermek',uk:'відповідати',ar:'يجيب',ja:'答える',ro:'a răspunde',pl:'odpowiadać',ku:'bersiv dan'},
 'folgen':{en:'to follow',ru:'следовать',tr:'takip etmek',uk:'слідувати',ar:'يتبع',ja:'ついて行く',ro:'a urma',pl:'podążać',ku:'peyrew kirin'},
 'gefallen':{en:'to like / to appeal to',ru:'нравиться',tr:'hoşuna gitmek',uk:'подобатися',ar:'يعجب',ja:'気に入る',ro:'a plăcea',pl:'podobać się',ku:'xweş hatin'},
 'gehören':{en:'to belong to',ru:'принадлежать',tr:'ait olmak',uk:'належати',ar:'يخص',ja:'属する',ro:'a aparține',pl:'należeć',ku:'aîd bûn'},
 'glauben':{en:'to believe',ru:'верить',tr:'inanmak',uk:'вірити',ar:'يصدق',ja:'信じる',ro:'a crede',pl:'wierzyć',ku:'bawer kirin'},
 'helfen':{en:'to help',ru:'помогать',tr:'yardım etmek',uk:'допомагати',ar:'يساعد',ja:'助ける',ro:'a ajuta',pl:'pomagać',ku:'alîkarî kirin'},
 'passieren':{en:'to happen to someone',ru:'случаться',tr:'başına gelmek',uk:'траплятися',ar:'يحدث',ja:'起こる',ro:'a se întâmpla',pl:'przydarzać się',ku:'qewimîn'},
 'raten':{en:'to advise',ru:'советовать',tr:'tavsiye etmek',uk:'радити',ar:'ينصح',ja:'助言する',ro:'a sfătui',pl:'radzić',ku:'şîret kirin'},
 'schmecken':{en:'to taste / to taste good',ru:'быть вкусным',tr:'tadı olmak',uk:'смакувати',ar:'يستطيب طعمه',ja:'味がする',ro:'a avea gust',pl:'smakować',ku:'tam kirin'},
 'wehtun':{en:'to hurt',ru:'болеть / причинять боль',tr:'acımak',uk:'боліти',ar:'يؤلم',ja:'痛む',ro:'a durea',pl:'boleć',ku:'êşandin'},
 'zuhören':{en:'to listen to',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يستمع إلى',ja:'話を聞く',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'},
 'befehlen':{en:'to order / command',ru:'приказывать',tr:'emretmek',uk:'наказувати',ar:'يأمر',ja:'命令する',ro:'a ordona',pl:'rozkazywać',ku:'ferman dan'},
 'danken':{en:'to thank',ru:'благодарить',tr:'teşekkür etmek',uk:'дякувати',ar:'يشكر',ja:'感謝する',ro:'a mulțumi',pl:'dziękować',ku:'spas kirin'},
 'fehlen':{en:'to be missing / be missed',ru:'не хватать / отсутствовать',tr:'eksik olmak / özlenmek',uk:'бракувати / бути відсутнім',ar:'يفتقد',ja:'いなくて寂しい',ro:'a lipsi',pl:'brakować',ku:'kêm bûn'},
 'nachlaufen':{en:'to run after',ru:'бежать следом',tr:'peşinden koşmak',uk:'бігти за',ar:'يركض خلف',ja:'追いかける',ro:'a alerga după',pl:'biec za',ku:'li pey bezîn'},
 'nachrennen':{en:'to run after',ru:'бежать следом',tr:'peşinden koşmak',uk:'бігти за',ar:'يركض خلف',ja:'追いかける',ro:'a alerga după',pl:'biec za',ku:'li pey bezîn'},
 'hinterherlaufen':{en:'to run after / follow',ru:'бежать следом',tr:'arkasından koşmak',uk:'бігти слідом',ar:'يركض وراء',ja:'後を追う',ro:'a alerga după',pl:'biec za',ku:'li pey bazdan'},
 'hinterherrennen':{en:'to run after',ru:'бежать следом',tr:'arkasından koşmak',uk:'бігти слідом',ar:'يركض وراء',ja:'後を追って走る',ro:'a alerga după',pl:'biec za',ku:'li pey bezîn'},
 'passen':{en:'to fit / suit',ru:'подходить',tr:'uymak',uk:'пасувати',ar:'يناسب',ja:'合う',ro:'a se potrivi',pl:'pasować',ku:'guncaw bûn'},
 'vertrauen':{en:'to trust',ru:'доверять',tr:'güvenmek',uk:'довіряти',ar:'يثق بـ',ja:'信頼する',ro:'a avea încredere',pl:'ufać',ku:'bawer pê anîn'},
 'vergeben':{en:'to forgive',ru:'прощать',tr:'affetmek',uk:'пробачати',ar:'يسامح',ja:'許す',ro:'a ierta',pl:'wybaczać',ku:'lêborîn'},
 'verzeihen':{en:'to forgive',ru:'прощать',tr:'affetmek',uk:'пробачати',ar:'يسامح',ja:'許す',ro:'a ierta',pl:'wybaczać',ku:'lêborîn'},
 'widersprechen':{en:'to contradict / disagree',ru:'возражать',tr:'karşı çıkmak',uk:'заперечувати',ar:'يعارض',ja:'反対する',ro:'a contrazice',pl:'sprzeciwiać się',ku:'dijberî kirin'},
 'zusehen':{en:'to watch',ru:'наблюдать',tr:'izlemek',uk:'спостерігати',ar:'يشاهد',ja:'見守る',ro:'a privi',pl:'przyglądać się',ku:'temaşe kirin'},
 'fremdgehen':{en:'to cheat on a partner',ru:'изменять партнёру',tr:'partnerini aldatmak',uk:'зраджувати партнеру',ar:'يخون الشريك',ja:'浮気する',ro:'a-și înșela partenerul',pl:'zdradzać partnera',ku:'xiyanet kirin'},
 'zustimmen':{en:'to agree',ru:'соглашаться',tr:'katılmak / onaylamak',uk:'погоджуватися',ar:'يوافق',ja:'賛成する',ro:'a fi de acord',pl:'zgadzać się',ku:'razî bûn'},
 'ähneln':{en:'to resemble',ru:'быть похожим',tr:'benzemek',uk:'бути схожим',ar:'يشبه',ja:'似ている',ro:'a semăna',pl:'przypominać',ku:'şibîn'},
 'begegnen':{en:'to encounter / meet',ru:'встречать',tr:'karşılaşmak',uk:'зустрічати',ar:'يقابل',ja:'出会う',ro:'a întâlni',pl:'spotykać',ku:'rast hatin'},
 'beistehen':{en:'to stand by / support',ru:'поддерживать',tr:'destek olmak',uk:'підтримувати',ar:'يساند',ja:'支える',ro:'a sprijini',pl:'wspierać',ku:'piştgirî kirin'},
 'beitreten':{en:'to join',ru:'вступать',tr:'katılmak',uk:'приєднуватися',ar:'ينضم إلى',ja:'加入する',ro:'a adera',pl:'przystąpić',ku:'tevlî bûn'},
 'drohen':{en:'to threaten',ru:'угрожать',tr:'tehdit etmek',uk:'погрожувати',ar:'يهدد',ja:'脅す',ro:'a amenința',pl:'grozić',ku:'gef xwarin'},
 'entgegengehen':{en:'to walk toward / meet halfway',ru:'идти навстречу',tr:'karşılamaya gitmek',uk:'йти назустріч',ar:'يتجه نحو',ja:'迎えに行く',ro:'a merge în întâmpinare',pl:'wychodzić naprzeciw',ku:'ber bi ... ve çûn'},
 'entgegenfahren':{en:'to drive toward',ru:'ехать навстречу',tr:'karşılamaya gitmek',uk:'їхати назустріч',ar:'يقود باتجاه',ja:'車で迎えに行く',ro:'a merge cu mașina în întâmpinare',pl:'jechać naprzeciw',ku:'bi erebeyê ber bi ... ve çûn'},
 'entgegenkommen':{en:'to come toward / accommodate',ru:'идти навстречу',tr:'karşılamaya gelmek',uk:'йти назустріч',ar:'يأتي باتجاه',ja:'近づいてくる',ro:'a veni în întâmpinare',pl:'wychodzić naprzeciw',ku:'ber bi ... ve hatin'},
 'gratulieren':{en:'to congratulate',ru:'поздравлять',tr:'tebrik etmek',uk:'вітати',ar:'يهنئ',ja:'お祝いする',ro:'a felicita',pl:'gratulować',ku:'pîrozbahî kirin'},
 'kündigen':{en:'to terminate / give notice',ru:'увольнять / расторгать',tr:'işten çıkarmak / feshetmek',uk:'звільняти / розривати договір',ar:'يفصل / ينهي العقد',ja:'解雇する / 解約する',ro:'a concedia / a rezilia',pl:'wypowiadać / zwalniać',ku:'ji kar derxistin'},
 'sich nähern':{en:'to approach',ru:'приближаться',tr:'yaklaşmak',uk:'наближатися',ar:'يقترب من',ja:'近づく',ro:'a se apropia',pl:'zbliżać się',ku:'nêzîk bûn'},
 'schaden':{en:'to harm',ru:'вредить',tr:'zarar vermek',uk:'шкодити',ar:'يضر',ja:'害する',ro:'a dăuna',pl:'szkodzić',ku:'zirar dan'},
 'einfallen':{en:'to occur to / come to mind',ru:'приходить в голову',tr:'aklına gelmek',uk:'спадати на думку',ar:'يخطر ببال',ja:'思いつく',ro:'a-i veni în minte',pl:'przychodzić do głowy',ku:'tê bîra'},
 'gehorchen':{en:'to obey',ru:'слушаться',tr:'itaat etmek',uk:'слухатися',ar:'يطيع',ja:'従う',ro:'a asculta de',pl:'słuchać',ku:'guhdarî kirin'},
 'genügen':{en:'to be enough',ru:'быть достаточным',tr:'yetmek',uk:'бути достатнім',ar:'يكفي',ja:'十分である',ro:'a fi suficient',pl:'wystarczać',ku:'bes bûn'},
 'guttun':{en:'to do someone good',ru:'идти на пользу',tr:'iyi gelmek',uk:'йти на користь',ar:'يفيد',ja:'体に良い',ro:'a face bine',pl:'dobrze robić',ku:'baş kirin'},
 'nützen':{en:'to benefit / be useful',ru:'приносить пользу',tr:'fayda sağlamak',uk:'бути корисним',ar:'ينفع',ja:'役に立つ',ro:'a folosi / a fi util',pl:'przynosić korzyść',ku:'sûd anîn'},
 'ausweichen':{en:'to avoid / dodge',ru:'уклоняться',tr:'kaçınmak / yol vermek',uk:'ухилятися',ar:'يتفادى',ja:'よける',ro:'a evita',pl:'omijać',ku:'xwe dûr xistin'},
 'dienen':{en:'to serve',ru:'служить',tr:'hizmet etmek',uk:'служити',ar:'يخدم',ja:'奉仕する',ro:'a servi',pl:'służyć',ku:'xizmet kirin'},
 'gelingen':{en:'to succeed / turn out well',ru:'удаваться',tr:'başarmak',uk:'вдаватися',ar:'ينجح',ja:'成功する',ro:'a reuși',pl:'udawać się',ku:'serkeftin'},
 'misslingen':{en:'to fail / go wrong',ru:'не удаваться',tr:'başarısız olmak',uk:'не вдаватися',ar:'يفشل',ja:'失敗する',ro:'a eșua',pl:'nie udać się',ku:'sernekeftin'}
};

const IMAGE_ALIASES={
 'nachrennen':['nachlaufen'],
 'hinterherrennen':['hinterherlaufen'],
 'sich nähern':['sich_nähern','nähern'],
 'verzeihen':['vergeben']
};

function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ')}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch{return{}}}
function languageCode(){
 const p=profile();
 const raw=norm(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'');
 if(!raw)return'';
 for(const[code,,keys]of LANGS){if(keys.some(key=>raw===norm(key)||raw.includes(norm(key))))return code}
 return'';
}
function translation(verb,germanMeaning){const code=languageCode();const row=TR[String(verb||'').trim().toLowerCase()]||{};if(code&&row[code])return{label:LABEL[code],text:row[code]};return{label:'Bedeutung',text:germanMeaning||''}}
function assetName(value){return String(value||'').trim().toLowerCase().replace(/\s+/g,'_').replace(/[\/]/g,'_')}
function assetUrl(name,folder=''){const parts=String(name||'').split('/').filter(Boolean).map(encodeURIComponent).join('/');return CDN+(folder?folder.replace(/^\/+|\/+$/g,'')+'/':'')+parts}
function imageCandidates(verb){const exact=assetName(verb);return [...new Set([exact,...(IMAGE_ALIASES[String(verb||'').trim().toLowerCase()]||[]).map(assetName)])].map(name=>assetUrl(name+'.webp'))}
function audioUrl(verb){return assetUrl(assetName(verb)+'.mp3','audio')}
function speakFallback(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)}catch{}}
function playBunny(verb,text){
 const audio=new Audio(audioUrl(verb));
 let settled=false;
 const fallback=()=>{if(settled)return;settled=true;speakFallback(text)};
 audio.addEventListener('error',fallback,{once:true});
 audio.play().then(()=>{settled=true}).catch(fallback);
}
function makeImage(verb){
 const box=document.createElement('div');box.className='sp-dativ-overview-image';
 const img=document.createElement('img');img.alt=verb;img.loading='lazy';img.decoding='async';
 const fallback=document.createElement('div');fallback.className='sp-dativ-overview-image-fallback';fallback.innerHTML='<span>Bild</span><strong>nicht verfügbar</strong>';fallback.hidden=true;
 const candidates=imageCandidates(verb);let index=0;
 const next=()=>{if(index>=candidates.length){img.hidden=true;fallback.hidden=false;return}img.src=candidates[index++];};
 img.addEventListener('error',next);next();box.append(img,fallback);return box;
}
function decorateCard(card){
 const h3=card.querySelector('h3');if(!h3)return;
 const verb=h3.textContent.trim();const meaning=card.querySelector('.verb-meaning')?.textContent?.trim()||'';const sentence=card.querySelector('.source-example')?.textContent?.trim()||'';
 const sig=verb+'|'+languageCode();if(card.dataset.spOverviewStandard===sig)return;
 card.dataset.spOverviewStandard=sig;card.classList.add('sp-standard-word-card');
 let image=card.querySelector('.sp-dativ-overview-image');if(image)image.remove();
 const chip=card.querySelector('.level-chip');(chip||card.firstElementChild)?.insertAdjacentElement('afterend',makeImage(verb));
 const info=translation(verb,meaning);
 const meaningNode=card.querySelector('.verb-meaning');if(meaningNode){meaningNode.className='sp-overview-translation';meaningNode.innerHTML=`<span>${info.label}</span><strong>${info.text}</strong>`}
 const sentenceNode=card.querySelector('.source-example');if(sentenceNode){sentenceNode.classList.add('sp-overview-example');sentenceNode.innerHTML=`<span>Beispiel</span><strong>${sentence}</strong>`}
 card.querySelectorAll('.audio-mini').forEach(node=>node.remove());
 const actions=document.createElement('div');actions.className='sp-overview-audio-row';
 actions.innerHTML=`<button type="button" class="btn secondary sp-overview-audio" data-sp-audio="word" data-verb="${verb}">🔊 Wort</button><button type="button" class="btn secondary sp-overview-audio" data-sp-audio="sentence" data-verb="${verb}" data-text="${sentence.replace(/"/g,'&quot;')}">🔊 Satz</button>`;
 card.appendChild(actions);
}
let raf=0;
function decorate(){
 raf=0;if(!root)return;
 const q=new URLSearchParams(location.search);if(q.get('view')!=='overview'){document.body.classList.remove('sp-dativ-standard-overview');return}
 document.body.classList.add('sp-dativ-standard-overview');
 const heading=root.querySelector('.section-head h2');if(heading)heading.textContent='Übersicht · Dativverben';
 let note=root.querySelector('.sp-overview-standard-note');
 if(!note){const card=root.querySelector('.card .section-head')?.parentElement;if(card){note=document.createElement('p');note.className='sp-overview-standard-note';note.textContent='Lerne die Verben mit Bild, Übersetzung und Audio.';card.querySelector('.section-head')?.insertAdjacentElement('afterend',note)}}
 root.querySelectorAll('.dativ-verb-card').forEach(decorateCard);
}
function schedule(){if(raf)return;raf=requestAnimationFrame(decorate)}
if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);window.addEventListener('load',schedule);document.addEventListener('DOMContentLoaded',schedule,{once:true});
document.addEventListener('click',event=>{const btn=event.target.closest?.('[data-sp-audio]');if(!btn)return;event.preventDefault();event.stopPropagation();const verb=btn.dataset.verb||'';const text=btn.dataset.spAudio==='sentence'?(btn.dataset.text||verb):verb;playBunny(verb,text)});
schedule();
})();
