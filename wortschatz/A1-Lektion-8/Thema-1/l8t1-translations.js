(function(){
'use strict';
if(window.__SP_L8T1_TRANSLATIONS_V1)return;window.__SP_L8T1_TRANSLATIONS_V1=true;
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/,'').replace(/\s+/g,' ');
const rows=[];
function add(aliases,en,ru,tr,uk,ar,ja,ro,pl,ku){rows.push({aliases:aliases.map(norm),tr:{en,ru,tr,uk,ar,ja,ro,pl,ku}})}
add(['Physiotherapeut','Physiotherapeutin'], 'physiotherapist','физиотерапевт','fizyoterapist','фізіотерапевт','أخصائي علاج طبيعي','理学療法士','fizioterapeut','fizjoterapeuta','fîzyoterapîst');
add(['Hausmeister','Hausmeisterin'], 'caretaker / janitor','смотритель / завхоз','bina görevlisi','доглядач / завгосп','مسؤول صيانة / حارس مبنى','管理人','îngrijitor / administrator','dozorca / konserwator','karmendê avahiyê');
add(['Arzthelfer','Arzthelferin'], 'medical assistant','помощник врача','doktor asistanı','помічник лікаря','مساعد طبيب','医療助手','asistent medical','asystent medyczny','alîkarê bijîşk');
add(['Arzt','Ärztin'], 'doctor','врач','doktor','лікар','طبيب','医師','medic','lekarz','bijîşk');
add(['Mechatroniker','Mechatronikerin'], 'mechatronics technician','мехатроник','mekatronik teknisyeni','мехатронік','فني ميكاترونكس','メカトロニクス技術者','tehnician mecatronist','mechatronik','teknîsyenê mekatronîkê');
add(['Hausmann'], 'househusband','домохозяин','ev erkeği','домогосподар','رب منزل','主夫','casnic','gospodarz domowy','mêrê malê');
add(['Hausfrau'], 'housewife','домохозяйка','ev hanımı','домогосподарка','ربة منزل','主婦','casnică','gospodyni domowa','jina malê');
add(['Polizist','Polizistin'], 'police officer','полицейский','polis','поліцейський','شرطي','警察官','polițist','policjant','polîs');
add(['Krankenpfleger','Krankenpflegerin'], 'nurse','медбрат / медсестра','hemşire','медбрат / медсестра','ممرض / ممرضة','看護師','asistent medical','pielęgniarz / pielęgniarka','hemşîre');
add(['Lehrer','Lehrerin'], 'teacher','учитель','öğretmen','вчитель','معلّم','教師','profesor','nauczyciel','mamoste');
add(['Schauspieler','Schauspielerin'], 'actor / actress','актёр / актриса','oyuncu','актор / акторка','ممثل / ممثلة','俳優','actor / actriță','aktor / aktorka','lîstikvan');
add(['Bäcker','Bäckerin'], 'baker','пекарь','fırıncı','пекар','خباز','パン職人','brutar','piekarz','nanpêj');
add(['Koch','Köchin'], 'cook / chef','повар','aşçı','кухар','طباخ','料理人','bucătar','kucharz','aşpêj');
add(['Friseur','Friseurin'], 'hairdresser','парикмахер','kuaför','перукар','مصفف شعر','美容師','frizer / coafeză','fryzjer','porçêker');
add(['Patient','Patientin'], 'patient','пациент','hasta','пацієнт','مريض','患者','pacient','pacjent','nexweş');
add(['Chef','Chefin'], 'boss / manager','начальник','patron / yönetici','керівник','مدير / رئيس','上司 / 責任者','șef','szef','serkar');
add(['Journalist','Journalistin'], 'journalist','журналист','gazeteci','журналіст','صحفي','ジャーナリスト','jurnalist','dziennikarz','rojnamevan');
add(['Schüler','Schülerin'], 'pupil / school student','школьник','öğrenci','школяр','تلميذ','生徒','elev','uczeń','xwendekar');
add(['Student','Studentin'], 'university student','студент','üniversite öğrencisi','студент','طالب جامعي','大学生','student','student','xwendekarê zanîngehê');
add(['Taxifahrer','Taxifahrerin'], 'taxi driver','таксист','taksi şoförü','таксист','سائق سيارة أجرة','タクシー運転手','șofer de taxi','taksówkarz','şofêrê taksiyê');
add(['Beruf'], 'profession / occupation','профессия','meslek','професія','مهنة','職業','profesie','zawód','pîşe');
add(['Job'], 'job','работа','iş','робота','وظيفة','仕事','job / loc de muncă','praca','kar');
add(['Stelle'], 'position / job','должность / место работы','pozisyon / iş','посада / робоче місце','منصب / وظيفة','職 / ポジション','post / loc de muncă','stanowisko / praca','pozîsyon / kar');
add(['Ausbildung'], 'vocational training','профессиональное обучение','mesleki eğitim','професійне навчання','تدريب مهني','職業訓練','formare profesională','kształcenie zawodowe','perwerdehiya pîşeyî');
add(['Krankenhaus'], 'hospital','больница','hastane','лікарня','مستشفى','病院','spital','szpital','nexweşxane');
add(['Praxis'], 'medical practice / clinic','врачебная практика / кабинет','muayenehane','лікарський кабінет','عيادة','診療所','cabinet medical','gabinet lekarski','klînîk');
add(['Firma'], 'company','фирма / компания','şirket','фірма / компанія','شركة','会社','firmă','firma','şîrket');
add(['Interview'], 'interview','интервью','röportaj / mülakat','інтерв’ю','مقابلة','インタビュー','interviu','wywiad','hevpeyvîn');
add(['Geschichte'], 'story / history','история','hikâye / tarih','історія','قصة / تاريخ','物語 / 歴史','poveste / istorie','historia / opowieść','dîrok / çîrok');
add(['Zeitung'], 'newspaper','газета','gazete','газета','صحيفة','新聞','ziar','gazeta','rojname');
add(['Fernsehen'], 'television / TV','телевидение','televizyon','телебачення','تلفاز / تلفزيون','テレビ','televiziune','telewizja','televîzyon');
add(['Thema'], 'topic','тема','konu','тема','موضوع','テーマ','temă','temat','mijar');
add(['Arbeit'], 'work','работа','iş','робота','عمل','仕事','muncă','praca','kar');
add(['arbeiten'], 'to work','работать','çalışmak','працювати','يعمل','働く','a lucra','pracować','kar kirin');
add(['studieren'], 'to study at university','учиться в вузе','üniversitede okumak','навчатися в університеті','يدرس في الجامعة','大学で学ぶ','a studia la universitate','studiować','li zanîngehê xwendin');
add(['eine Ausbildung machen','Ausbildung machen'], 'to do vocational training','проходить профессиональное обучение','mesleki eğitim yapmak','проходити професійне навчання','يتدرب مهنياً','職業訓練を受ける','a face o formare profesională','odbywać kształcenie zawodowe','perwerdehiya pîşeyî dîtin');
add(['einen Job haben','Job haben'], 'to have a job','иметь работу','bir işi olmak','мати роботу','لديه وظيفة','仕事がある','a avea un loc de muncă','mieć pracę','kar hebûn');
add(['eine Stelle haben','Stelle haben'], 'to have a position / job','иметь должность / работу','bir pozisyonu olmak','мати посаду / роботу','لديه منصب / وظيفة','職がある','a avea un post','mieć stanowisko / pracę','pozîsyon / kar hebûn');
add(['beruflich'], 'professionally / work-related','профессионально / по работе','mesleki olarak','професійно / по роботі','مهنياً','仕事上の / 職業上の','profesional','zawodowo','bi pîşeyî');
add(['berufstätig'], 'employed / working','работающий','çalışan','працевлаштований','يعمل / موظف','就業している','angajat / activ profesional','aktywny zawodowo','kar dike');
add(['arbeitslos'], 'unemployed','безработный','işsiz','безробітний','عاطل عن العمل','失業している','șomer','bezrobotny','bêkar');
add(['Praktikum'], 'internship','практика / стажировка','staj','практика / стажування','تدريب عملي','インターンシップ / 実習','stagiu / practică','praktyka / staż','staj');
add(['Praktikant','Praktikantin'], 'intern / trainee','стажёр','stajyer','стажер','متدرب','研修生 / インターン','stagiar','stażysta','stajyer');
function findTranslation(value){const key=norm(value);let best=null;for(const row of rows){for(const alias of row.aliases){if(key===alias||key.includes(alias)){if(!best||alias.length>best.alias.length)best={alias,row}}}}return best?.row?.tr||null}
function term(item){return String(item?.term||item?.full||item?.word||item?.answer||'').trim()}
window.L8T1TranslationLexicon={languages:['en','ru','tr','uk','ar','ja','ro','pl','ku'],find:findTranslation};
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null);if(!theme)return themes;
 const cards=(theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));
 for(const item of cards?.items||[]){const found=findTranslation(term(item));if(found)item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...found}}
 for(const item of theme.overviewOnlyItems||[]){const found=findTranslation(term(item));if(found)item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...found}}
 theme.translationRevision='l8t1-standard-languages-v1';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();