(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_20260831)return;window.__SP_L8T2_VOCAB_20260831=true;
window.L8_T2_VOCAB_PENDING=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const slug=v=>String(v||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const LANGS=['en','ru','tr','uk','ar','ja','ro','pl','ku'];
const blocked=new Set(['sehr geehrter herr','sehr geehrte frau','mit freundlichen grussen','mit freundlichen grussen']);
const grammarOnly=[/eine stelle haben\s+(als|bei)/i,/stelle haben\s+(als|bei)/i];
const TR=new Map();
function add(keys,en,ru,tr,uk,ar,ja,ro,pl,ku){const val={en,ru,tr,uk,ar,ja,ro,pl,ku};String(keys).split('|').forEach(k=>TR.set(norm(k),val))}
add('da','there','там','orada','там','هناك','そこ','acolo','tam','li wir');
add('zeigen','to show','показывать','göstermek','показувати','يُري','見せる','a arăta','pokazywać','nîşan dan');
add('gerade','right now / just','сейчас / как раз','şu anda / tam','зараз / саме','الآن / بالضبط','ちょうど今 / ちょうど','chiar acum / tocmai','właśnie / teraz','niha / tam');
add('später','later','позже','daha sonra','пізніше','لاحقًا','後で','mai târziu','później','paşê');
add('die Stelle|Stelle','position / job','должность / работа','pozisyon / iş','посада / робота','منصب / وظيفة','職 / ポジション','post / loc de muncă','stanowisko / praca','pozîsyon / kar');
add('zur Verfügung stellen|zur Verfuegung stellen','to provide / make available','предоставлять','kullanıma sunmak','надавати / робити доступним','يوفّر / يضع تحت التصرّف','提供する','a pune la dispoziție','udostępniać','berdest kirin');
add('die Bewerbung|Bewerbung','job application','заявление о приёме на работу','iş başvurusu','заява на роботу','طلب توظيف','応募','candidatură','podanie o pracę','daxwaza kar');
add('das Praktikum|Praktikum','internship','практика / стажировка','staj','практика / стажування','تدريب عملي','インターンシップ / 実習','stagiu / practică','praktyka / staż','staj');
add('die Abteilung|Abteilung','department','отдел','bölüm','відділ','قسم','部署','departament','dział','beş');
add('der Leiter|Leiter','manager / head','руководитель','yönetici','керівник','مدير','責任者','conducător / director','kierownik','rêveber');
add('die Leiterin|Leiterin','female manager / head','руководительница','kadın yönetici','керівниця','مديرة','女性責任者','conducătoare / directoare','kierowniczka','rêvebera jin');
add('die Wirtschaft|Wirtschaft','economy','экономика','ekonomi','економіка','الاقتصاد','経済','economie','gospodarka','aborî');
add('das Diplom|Diplom','diploma','диплом','diploma','диплом','دبلوم','卒業証書 / 学位記','diplomă','dyplom','diploma');
add('das Büro|Büro|Buero','office','офис','ofis','офіс','مكتب','オフィス','birou','biuro','ofîs');
add('die Information|Information','information','информация','bilgi','інформація','معلومة / معلومات','情報','informație','informacja','agahî');
add('der Gruß|Gruß|Gruss','greeting','приветствие','selam','привітання','تحية','あいさつ','salut','pozdrowienie','silav');
add('der Reiseführer|Reiseführer|Reisefuehrer','male tour guide','гид','erkek turist rehberi','гід','مرشد سياحي','男性ツアーガイド','ghid turistic','przewodnik turystyczny','rêberê geştê');
add('die Reiseführerin|Reiseführerin|Reisefuehrerin','female tour guide','женщина-гид','kadın turist rehberi','гідка','مرشدة سياحية','女性ツアーガイド','ghidă turistică','przewodniczka turystyczna','rêbera geştê');
add('der Tourist|Tourist','tourist','турист','turist','турист','سائح','観光客','turist','turysta','geştiyar');
add('die Touristin|Touristin','female tourist','туристка','kadın turist','туристка','سائحة','女性観光客','turistă','turystka','geştiyara jin');
add('heiraten','to marry / get married','жениться / выходить замуж','evlenmek','одружуватися','يتزوج','結婚する','a se căsători','brać ślub','zewicîn');
add('eigentlich','actually / really','вообще-то / собственно','aslında','власне / взагалі-то','في الواقع','実は / 本当は','de fapt','właściwie','bi rastî');
add('die Ausbildung|Ausbildung','vocational training','профессиональное обучение','mesleki eğitim','професійне навчання','تدريب مهني','職業訓練','formare profesională','kształcenie zawodowe','perwerdehiya pîşeyî');
add('die Berufserfahrung|Berufserfahrung','work experience','опыт работы','iş deneyimi','досвід роботи','خبرة مهنية','職務経験','experiență profesională','doświadczenie zawodowe','ezmûna kar');
add('der Arbeitgeber|Arbeitgeber','employer','работодатель','işveren','роботодавець','صاحب العمل','雇用主','angajator','pracodawca','kardêr');
add('die Arbeitgeberin|Arbeitgeberin','female employer','работодательница','kadın işveren','роботодавиця','صاحبة العمل','女性の雇用主','angajatoare','pracodawczyni','kardêra jin');
add('die Firma|Firma','company','фирма / компания','şirket','фірма / компанія','شركة','会社','firmă','firma','şîrket');
add('der Lebenslauf|Lebenslauf','CV / résumé','резюме','özgeçmiş','резюме','السيرة الذاتية','履歴書','CV','życiorys','CV');
add('das Anschreiben|Anschreiben','cover letter','сопроводительное письмо','ön yazı','супровідний лист','خطاب تقديم','応募書類の送付状','scrisoare de intenție','list motywacyjny','nameya daxwazê');
add('das Bewerbungsfoto|Bewerbungsfoto','application photo','фото для резюме','başvuru fotoğrafı','фото для резюме','صورة طلب التوظيف','応募写真','fotografie pentru candidatură','zdjęcie do podania','wêneya daxwazê');
add('das Bewerbungsgespräch|Bewerbungsgespräch|das Vorstellungsgespräch|Vorstellungsgespräch','job interview','собеседование','iş görüşmesi','співбесіда','مقابلة عمل','面接','interviu de angajare','rozmowa kwalifikacyjna','hevpeyvîna kar');
add('der berufliche Werdegang|beruflicher Werdegang|der Werdegang|Werdegang','career history','профессиональный путь','mesleki geçmiş','професійний шлях','المسار المهني','職歴','parcurs profesional','przebieg kariery zawodowej','rêça pîşeyî');
add('das Zeugnis|Zeugnis','certificate / school report','свидетельство / аттестат','belge / karne','свідоцтво / атестат','شهادة','証明書 / 成績表','certificat','świadectwo','belge');
add('der Abschluss|Abschluss','qualification / graduation','диплом / окончание','mezuniyet / diploma','диплом / закінчення','مؤهل / تخرج','卒業 / 資格','absolvire / diplomă','ukończenie / dyplom','diploma / qedandin');
add('die Berufsschule|Berufsschule','vocational school','профессиональная школа','meslek okulu','професійна школа','مدرسة مهنية','職業学校','școală profesională','szkoła zawodowa','dibistana pîşeyî');
add('das Studium|Studium','university studies','учёба в вузе','üniversite eğitimi','навчання в університеті','دراسة جامعية','大学での勉強','studii universitare','studia','xwendina zanîngehê');
add('anfangen|beginnen','to begin','начинать','başlamak','починати','يبدأ','始める','a începe','zaczynać','dest pê kirin');
add('enden','to end','заканчиваться','bitmek','закінчуватися','ينتهي','終わる','a se termina','kończyć się','qediya');
add('dauern','to last / take time','длиться','sürmek','тривати','يستغرق','かかる / 続く','a dura','trwać','dom kirin');
add('schicken|senden','to send','отправлять','göndermek','надсилати','يرسل','送る','a trimite','wysyłać','şandin');
add('bekommen','to get / receive','получать','almak','отримувати','يحصل على','もらう','a primi','dostawać','wergirtin');

const MEDIA=new Map();
function media(keys,stem){String(keys).split('|').forEach(k=>MEDIA.set(norm(k),stem))}
media('da','da');media('zeigen','zeigen');media('gerade','gerade');media('später','spaeter');media('die Stelle|Stelle','stelle');media('zur Verfügung stellen|zur Verfuegung stellen','zur_verfuegung_stellen');
media('die Bewerbung|Bewerbung','bewerbung');media('das Praktikum|Praktikum','praktikum');media('die Abteilung|Abteilung','abteilung');media('der Leiter|Leiter','leiter');media('die Leiterin|Leiterin','leiterin');media('die Wirtschaft|Wirtschaft','wirtschaft');media('das Diplom|Diplom','diplom');media('das Büro|Büro|Buero','buero');media('die Information|Information','information');media('der Gruß|Gruß|Gruss','gruss');media('der Reiseführer|Reiseführer|Reisefuehrer','reisefuehrer');media('die Reiseführerin|Reiseführerin|Reisefuehrerin','reisefuehrerin');media('der Tourist|Tourist','tourist');media('die Touristin|Touristin','touristin');media('heiraten','heiraten');media('eigentlich','eigentlich');

function mainCards(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function enrich(item){
 const key=norm(term(item));if(!key)return item;
 const tr=TR.get(key);if(tr){const cur=item.translations&&typeof item.translations==='object'?item.translations:{};item.translations={...cur,...tr};item.tr={...(item.tr&&typeof item.tr==='object'?item.tr:{}),...tr}}
 const stem=MEDIA.get(key);if(stem){item.image=CDN+stem+'.webp';item.audio=AUDIO+stem+'.mp3';item.audioFile=AUDIO+stem+'.mp3'}
 return item;
}
function upsert(task,item){const key=norm(item.term),found=(task.items||[]).find(x=>norm(term(x))===key);if(found){Object.assign(found,item);enrich(found);return found}task.items.push(item);enrich(item);return item}
function removeNonVocabulary(task){
 task.items=(task.items||[]).filter(item=>{const key=norm(term(item));if(!key)return false;if(blocked.has(key))return false;if(grammarOnly.some(re=>re.test(term(item))))return false;return true});
}
function addRequired(task){
 upsert(task,{term:'da',type:'adverb'});
 upsert(task,{term:'zeigen',type:'verb'});
 upsert(task,{term:'gerade',type:'adverb'});
 upsert(task,{term:'später',type:'adverb'});
 upsert(task,{term:'die Stelle',type:'noun',plural:'die Stellen'});
 upsert(task,{term:'zur Verfügung stellen',type:'verb'});
}
function fillKnown(theme){const cards=mainCards(theme);if(!cards)return;removeNonVocabulary(cards);addRequired(cards);for(const item of cards.items||[])enrich(item)}
window.L8_T2_VOCAB_READY=Promise.resolve(window.L8_T2_TRANSLATIONS_READY||window.L8_T2_CURRENT_READY||window.L8_CONTENT_READY).then(()=>{
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];if(!theme)return theme;fillKnown(theme);if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;window.L8_T2_VOCAB_PENDING=false;return theme;
}).catch(error=>{window.L8_T2_VOCAB_PENDING=false;console.error('L8T2 Wortschatz 20260831',error);throw error});
})();
