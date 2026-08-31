(function(){
'use strict';
if(window.__SP_L8T2_TRANSLATIONS_V1)return;window.__SP_L8T2_TRANSLATIONS_V1=true;
window.L8_T2_TRANSLATIONS_PENDING=true;
const LANGS=['en','ru','tr','uk','ar','ja','ro','pl','ku'];
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const rows=new Map();
function add(aliases,en,ru,tr,uk,ar,ja,ro,pl,ku){const value={en,ru,tr,uk,ar,ja,ro,pl,ku};String(aliases).split('|').forEach(alias=>rows.set(norm(alias),value))}
add('die Ausbildung|Ausbildung','vocational training','профессиональное обучение','mesleki eğitim','професійне навчання','تدريب مهني','職業訓練','formare profesională','kształcenie zawodowe','perwerdehiya pîşeyî');
add('das Praktikum|Praktikum','internship','практика','staj','практика','تدريب عملي','実習','stagiu de practică','praktyka','staj');
add('der Praktikant|Praktikant','male intern','практикант','erkek stajyer','практикант','متدرب','男性の実習生','stagiar','praktykant','stajyer');
add('die Praktikantin|Praktikantin','female intern','практикантка','kadın stajyer','практикантка','متدربة','女性の実習生','stagiară','praktykantka','stajyer');
add('die Bewerbung|Bewerbung','job application','заявление о приёме на работу','iş başvurusu','заява на роботу','طلب توظيف','応募','candidatură','podanie o pracę','daxwaza kar');
add('sich bewerben|bewerben','to apply','подавать заявление','başvurmak','подавати заяву','يتقدم بطلب','応募する','a candida','ubiegać się','serlêdan');
add('der Lebenslauf|Lebenslauf','CV / résumé','резюме','özgeçmiş','резюме','السيرة الذاتية','履歴書','CV','życiorys','CV');
add('das Anschreiben|Anschreiben','cover letter','сопроводительное письмо','ön yazı','супровідний лист','خطاب تقديم','応募書類の送付状','scrisoare de intenție','list motywacyjny','nameya daxwazê');
add('das Bewerbungsfoto|Bewerbungsfoto','application photo','фото для резюме','başvuru fotoğrafı','фото для резюме','صورة طلب التوظيف','応募写真','fotografie pentru candidatură','zdjęcie do podania','wêneya daxwazê');
add('das Bewerbungsgespräch|Bewerbungsgespräch|das Vorstellungsgespräch|Vorstellungsgespräch','job interview','собеседование','iş görüşmesi','співбесіда','مقابلة عمل','面接','interviu de angajare','rozmowa kwalifikacyjna','hevpeyvîna kar');
add('der berufliche Werdegang|beruflicher Werdegang|der Werdegang|Werdegang','career history','профессиональный путь','mesleki geçmiş','професійний шлях','المسار المهني','職歴','parcurs profesional','przebieg kariery zawodowej','rêça pîşeyî');
add('die Berufserfahrung|Berufserfahrung','work experience','опыт работы','iş deneyimi','досвід роботи','خبرة مهنية','職務経験','experiență profesională','doświadczenie zawodowe','ezmûna kar');
add('der Arbeitgeber|Arbeitgeber','employer','работодатель','işveren','роботодавець','صاحب العمل','雇用主','angajator','pracodawca','kardêr');
add('die Arbeitgeberin|Arbeitgeberin','female employer','работодательница','kadın işveren','роботодавиця','صاحبة العمل','女性の雇用主','angajatoare','pracodawczyni','kardêra jin');
add('die Firma|Firma','company','фирма','şirket','фірма','شركة','会社','firmă','firma','şîrket');
add('die Stelle|Stelle','position / job','вакансия','pozisyon / iş','посада / вакансія','وظيفة شاغرة','求人・職','post / loc de muncă','stanowisko / praca','pozîsyon / kar');
add('der Job|Job','job','работа','iş','робота','عمل','仕事','job','praca','kar');
add('der Beruf|Beruf','profession','профессия','meslek','професія','مهنة','職業','profesie','zawód','pîşe');
add('die Arbeit|Arbeit','work','работа','iş','робота','عمل','仕事','muncă','praca','kar');
add('das Zeugnis|Zeugnis','certificate / report','свидетельство / аттестат','belge / karne','свідоцтво / атестат','شهادة','証明書・成績表','certificat','świadectwo','belge');
add('der Abschluss|Abschluss','qualification / graduation','диплом / окончание','mezuniyet / diploma','диплом / закінчення','مؤهل / تخرج','卒業・資格','absolvire / diplomă','ukończenie / dyplom','diploma / qedandin');
add('die Schule|Schule','school','школа','okul','школа','مدرسة','学校','școală','szkoła','dibistan');
add('die Berufsschule|Berufsschule','vocational school','профессиональная школа','meslek okulu','професійна школа','مدرسة مهنية','職業学校','școală profesională','szkoła zawodowa','dibistana pîşeyî');
add('die Universität|Universität','university','университет','üniversite','університет','جامعة','大学','universitate','uniwersytet','zanîngeh');
add('das Studium|Studium','university studies','учёба в вузе','üniversite eğitimi','навчання в університеті','دراسة جامعية','大学での勉強','studii universitare','studia','xwendina zanîngehê');
add('anfangen|beginnen','to begin','начинать','başlamak','починати','يبدأ','始める','a începe','zaczynać','dest pê kirin');
add('enden','to end','заканчиваться','bitmek','закінчуватися','ينتهي','終わる','a se termina','kończyć się','qediya');
add('dauern','to last / take time','длиться','sürmek','тривати','يستغرق','かかる・続く','a dura','trwać','dom kirin');
add('machen','to do / make','делать','yapmak','робити','يفعل','する','a face','robić','kirin');
add('arbeiten','to work','работать','çalışmak','працювати','يعمل','働く','a lucra','pracować','kar kirin');
add('lernen','to learn','учить / учиться','öğrenmek','вчити / навчатися','يتعلم','学ぶ','a învăța','uczyć się','fêr bûn');
add('studieren','to study at university','учиться в вузе','üniversitede okumak','навчатися в університеті','يدرس في الجامعة','大学で学ぶ','a studia','studiować','li zanîngehê xwendin');
add('schreiben','to write','писать','yazmak','писати','يكتب','書く','a scrie','pisać','nivîsandin');
add('schicken|senden','to send','отправлять','göndermek','надсилати','يرسل','送る','a trimite','wysyłać','şandin');
add('bekommen','to get / receive','получать','almak','отримувати','يحصل على','もらう','a primi','dostawać','wergirtin');
add('der Anfang|Anfang','beginning','начало','başlangıç','початок','بداية','始まり','început','początek','destpêk');
add('das Ende|Ende','end','конец','son','кінець','نهاية','終わり','sfârșit','koniec','dawî');
add('der Termin|Termin','appointment','встреча / назначенное время','randevu','зустріч / призначений час','موعد','予約・予定','programare','termin','demjimêr');
add('das Interview|Interview','interview','интервью','mülakat / röportaj','інтерв’ю','مقابلة','インタビュー','interviu','wywiad','hevpeyvîn');
add('die E-Mail|E-Mail','email','электронное письмо','e-posta','електронний лист','بريد إلكتروني','メール','e-mail','e-mail','e-name');
add('der Brief|Brief','letter','письмо','mektup','лист','رسالة','手紙','scrisoare','list','name');

function existing(item){const values=[item?.translations,item?.tr,item?.i18n];for(const obj of values)if(obj&&typeof obj==='object')return obj;return{}}
function own(value){return rows.get(norm(value))||null}
function t1(value){try{return window.L8T1TranslationLexicon?.find?.(value)||null}catch(e){return null}}
function complete(source){return source&&LANGS.every(code=>typeof source[code]==='string'&&source[code].trim())}
function apply(item){
 const value=term(item);if(!value)return;
 const current=existing(item),source=own(value)||t1(value)||current;
 if(!source)return;
 const merged={};for(const code of LANGS){const text=source?.[code]||current?.[code]||'';if(text)merged[code]=String(text).trim()}
 if(Object.keys(merged).length){item.translations={...current,...merged};item.tr={...current,...merged}}
}
function applyAll(theme){
 for(const task of theme?.tasks||[])if(task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(String(task?.title||'')))for(const item of task.items||[])apply(item);
 for(const item of theme?.overviewOnlyItems||[])apply(item);
}
window.L8_T2_TRANSLATIONS_READY=Promise.resolve(window.L8_T2_CURRENT_READY||window.L8_CONTENT_READY).then(()=>{
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];applyAll(theme);
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 window.L8_T2_TRANSLATIONS_PENDING=false;return theme;
}).catch(error=>{window.L8_T2_TRANSLATIONS_PENDING=false;console.error('L8T2 Übersetzungen',error);throw error});
})();
