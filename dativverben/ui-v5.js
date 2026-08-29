(function(){
'use strict';
if(window.__SP_DATIV_UI_V5)return;
window.__SP_DATIV_UI_V5=true;

const root=document.getElementById('app');
if(!root)return;

const LANGS=[
 ['en',['en','english','englisch']],
 ['ru',['ru','russian','russisch']],
 ['tr',['tr','turkish','türkisch','tuerkisch']],
 ['uk',['uk','ua','ukrainian','ukrainisch']],
 ['ar',['ar','arabic','arabisch']],
 ['ja',['ja','japanese','japanisch']],
 ['ro',['ro','romanian','rumänisch','rumaenisch']],
 ['pl',['pl','polish','polnisch']],
 ['ku',['ku','kurdish','kurdisch','kurmancî','kurmanci']]
];
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
 'hinterherlaufen':{en:'to run after / follow',ru:'бежать следом',tr:'arkasından koşmak',uk:'бігти слідом',ar:'يركض وراء',ja:'後を追う',ro:'a alerga după',pl:'biec za',ku:'li pey bazdan'},
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

function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ')}
function profile(){
 for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
   try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
 }
 return{};
}
function languageCode(){
 const p=profile();
 const raw=norm(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'');
 if(!raw)return'';
 for(const [code,keys] of LANGS)if(keys.some(key=>raw===norm(key)||raw.includes(norm(key))))return code;
 return'';
}
function translationFor(verb){
 const code=languageCode();
 const row=TR[String(verb||'').trim().toLowerCase()]||{};
 if(code&&row[code])return row[code];
 const entry=(window.SPDativLearningData?.ENTRIES||[]).find(item=>String(item.verb||'').trim().toLowerCase()===String(verb||'').trim().toLowerCase());
 return entry?.meaning||'';
}
function hideFallbacks(){
 root.querySelectorAll('.image-only-fallback,.dativ-image-fallback,.sp-dativ-overview-image-fallback').forEach(node=>{
   node.hidden=true;
   node.setAttribute('aria-hidden','true');
   node.style.setProperty('display','none','important');
 });
}
function decorateOverview(){
 const q=new URLSearchParams(location.search);
 if(q.get('view')!=='overview')return;
 root.querySelectorAll('.overview-image-only-card').forEach(card=>{
   const audio=card.querySelector('[data-action="audio"][data-text]');
   const verb=String(audio?.dataset.text||'').trim();
   if(!verb)return;
   if(verb==='nachrennen'||verb==='hinterherrennen'){card.remove();return}
   let copy=card.querySelector('.overview-word-copy');
   if(!copy){
     copy=document.createElement('div');
     copy.className='overview-word-copy';
     const word=document.createElement('strong');word.className='overview-word';
     const translation=document.createElement('span');translation.className='overview-translation';translation.setAttribute('dir','auto');
     copy.append(word,translation);
     audio?.insertAdjacentElement('beforebegin',copy);
   }
   const word=copy.querySelector('.overview-word'),translation=copy.querySelector('.overview-translation');
   if(word)word.textContent=verb;
   if(translation)translation.textContent=translationFor(verb);
 });
}
function decorateBlocks(){
 root.querySelectorAll('.block-bank').forEach(bank=>{
   const card=bank.closest('.question-card');
   if(!card)return;
   card.classList.add('pretty-block-task');
   const question=card.querySelector('.question');
   if(question)question.textContent='Baue den Satz fertig.';
   const answer=card.querySelector('#blockAnswer');
   const placeholder=answer?.querySelector('.block-placeholder');
   if(placeholder)placeholder.textContent='Dein Satz';
   if(answer&&!answer.previousElementSibling?.classList.contains('block-section-title')){
     const title=document.createElement('div');title.className='block-section-title';title.textContent='Dein Satz';answer.before(title);
   }
   if(!bank.previousElementSibling?.classList.contains('block-bank-title')){
     const title=document.createElement('div');title.className='block-bank-title';title.textContent='Bausteine';bank.before(title);
   }
 });
}
let frame=0;
function decorate(){frame=0;hideFallbacks();decorateOverview();decorateBlocks()}
function schedule(){if(frame)return;frame=requestAnimationFrame(decorate)}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
schedule();
})();
