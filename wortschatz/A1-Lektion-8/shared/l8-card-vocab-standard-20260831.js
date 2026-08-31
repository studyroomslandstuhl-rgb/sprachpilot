(function(){
'use strict';
if(window.__SP_L8_CARD_VOCAB_STANDARD_20260831)return;window.__SP_L8_CARD_VOCAB_STANDARD_20260831=true;
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const LANGS=['en','ru','tr','uk','ar','ja','ro','pl','ku','fa','fr','es','it'];
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/,'').replace(/\s+/g,' ').trim();
const term=i=>String(i?.term||i?.full||i?.word||i?.answer||'').trim();
const slug=v=>String(v||'').split('–')[0].trim().replace(/^(der|die|das)\s+/i,'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const rows=new Map();
function add(keys,en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it){const x={en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it};String(keys).split('|').forEach(k=>rows.set(norm(k),x));}
// Thema 3: vorhandene 9 Standardsprachen + die vier neueren Standardsprachen.
add('die Erfahrung|Erfahrung','experience','опыт','deneyim','досвід','خبرة','経験','experiență','doświadczenie','ezmûn','تجربه','expérience','experiencia','esperienza');
add('das Café|Café','café','кафе','kafe','кафе','مقهى','カフェ','cafenea','kawiarnia','kafe','کافه','café','cafetería','caffè');
add('der Stress|Stress','stress','стресс','stres','стрес','توتر / ضغط','ストレス','stres','stres','stres','استرس','stress','estrés','stress');
add('der Kellner|Kellner','waiter','официант','garson','офіціант','نادل','ウェイター','chelner','kelner','garson','پیشخدمت مرد','serveur','camarero','cameriere');
add('die Kellnerin|Kellnerin','waitress','официантка','kadın garson','офіціантка','نادلة','ウェイトレス','chelneriță','kelnerka','garsona jin','پیشخدمت زن','serveuse','camarera','cameriera');
add('das Restaurant|Restaurant','restaurant','ресторан','restoran','ресторан','مطعم','レストラン','restaurant','restauracja','restoran','رستوران','restaurant','restaurante','ristorante');
add('der Architekt|Architekt','architect','архитектор','mimar','архітектор','مهندس معماري','建築家','arhitect','architekt','mîmar','معمار','architecte','arquitecto','architetto');
add('die Architektin|Architektin','female architect','архитектор','kadın mimar','архітекторка','مهندسة معمارية','女性建築家','arhitectă','architektka','mîmara jin','معمار زن','architecte','arquitecta','architetta');
add('der Arbeiter|Arbeiter','worker','рабочий','işçi','робітник','عامل','労働者','muncitor','robotnik','karker','کارگر','ouvrier','trabajador','operaio');
add('die Arbeiterin|Arbeiterin','female worker','работница','kadın işçi','робітниця','عاملة','女性労働者','muncitoare','robotnica','karkera jin','کارگر زن','ouvrière','trabajadora','operaia');
add('der Kollege|Kollege','colleague','коллега','iş arkadaşı','колега','زميل','同僚','coleg','kolega','hevalkar','همکار','collègue','compañero de trabajo','collega');
add('oft','often','часто','sık sık','часто','غالبًا','よく','des','często','pir caran','اغلب','souvent','a menudo','spesso');
add('manchmal','sometimes','иногда','bazen','іноді','أحيانًا','時々','uneori','czasami','carinan','گاهی','parfois','a veces','a volte');
add('wenig','little / not much','мало','az','мало','قليل','少し / 少ない','puțin','mało','kêm','کم','peu','poco','poco');
add('schlecht','bad','плохой / плохо','kötü','поганий / погано','سيئ','悪い','rău','zły / źle','xerab','بد','mauvais','malo','cattivo');
add('toll','great','отличный / здорово','harika','чудовий / чудово','رائع','すばらしい','grozav','świetny','pir baş','عالی','super','genial','fantastico');
add('einfach','easy / simple','простой / легко','kolay / basit','простий / легко','سهل / بسيط','簡単な','simplu / ușor','prosty / łatwy','hêsan','ساده / آسان','simple / facile','fácil / sencillo','facile / semplice');
add('professionell','professional','профессиональный','profesyonel','професійний','مهني / احترافي','プロフェッショナルな','profesionist','profesjonalny','profesyonel','حرفه‌ای','professionnel','profesional','professionale');
add('Spaß haben','to have fun','веселиться / получать удовольствие','eğlenmek','веселитися','يستمتع','楽しむ','a se distra','dobrze się bawić','kêfxweş bûn','خوش گذراندن','s’amuser','divertirse','divertirsi');
add('war','was','был / была / было','idi','був / була / було','كان','～だった','era','był / była / było','bû','بود','était','era','era');
add('hatte','had','имел / имела','vardı / sahipti','мав / мала','كان لديه','持っていた','avea','miał / miała','hebû','داشت','avait','tenía','aveva');
// Thema 4: Stellenanzeigen und Arbeit suchen.
add('die Stellenanzeige|Stellenanzeige|die Anzeige|Anzeige','job advertisement','объявление о работе','iş ilanı','оголошення про роботу','إعلان وظيفة','求人広告','anunț de angajare','ogłoszenie o pracę','ragihandina kar','آگهی استخدام','offre d’emploi','anuncio de empleo','annuncio di lavoro');
add('Vollzeit|in Vollzeit','full-time','полный рабочий день','tam zamanlı','повна зайнятість','دوام كامل','フルタイム','normă întreagă','pełny etat','tev-dem','تمام‌وقت','à temps plein','a tiempo completo','a tempo pieno');
add('Teilzeit|in Teilzeit','part-time','неполный рабочий день','yarı zamanlı','неповна зайнятість','دوام جزئي','パートタイム','part-time','niepełny etat','nîv-dem','پاره‌وقت','à temps partiel','a tiempo parcial','part-time');
add('befristet','fixed-term / temporary','срочный / временный','süreli','строковий / тимчасовий','محدد المدة','有期の','pe perioadă determinată','na czas określony','demkî','موقت','à durée déterminée','temporal','a tempo determinato');
add('unbefristet','permanent / open-ended','бессрочный','süresiz','безстроковий','غير محدد المدة','無期の','pe perioadă nedeterminată','na czas nieokreślony','bêdem','دائمی','à durée indéterminée','indefinido','a tempo indeterminato');
add('die Aushilfe|Aushilfe','temporary helper','временный помощник','geçici yardımcı','тимчасовий працівник','عامل مساعد مؤقت','臨時スタッフ','ajutor temporar','pracownik dorywczy','alîkarê demkî','نیروی کمکی موقت','aide temporaire','ayudante temporal','aiuto temporaneo');
add('der Service|Service','service','сервис / обслуживание','servis / hizmet','сервіс / обслуговування','خدمة','サービス','serviciu','obsługa / serwis','xizmet','خدمات','service','servicio','servizio');
add('der Verdienst|Verdienst','earnings / pay','заработок','kazanç / ücret','заробіток','الدخل / الأجر','収入 / 給料','câștig','zarobek','qezenc','درآمد','rémunération','ganancia / sueldo','guadagno');
add('das Gehalt|Gehalt','salary','зарплата','maaş','зарплата','راتب','給料','salariu','pensja','meaş','حقوق','salaire','sueldo','stipendio');
add('der Lohn|Lohn','wage','заработная плата','ücret','заробітна плата','أجر','賃金','salariu','wynagrodzenie','heq','دستمزد','salaire','salario','salario');
add('die Arbeitszeit|Arbeitszeit','working hours','рабочее время','çalışma süresi','робочий час','ساعات العمل','労働時間','timp de lucru','czas pracy','dema kar','ساعات کاری','temps de travail','horario laboral','orario di lavoro');
add('die Schicht|Schicht','shift','смена','vardiya','зміна','وردية','勤務シフト','tură','zmiana','nobeta kar','شیفت','équipe / poste','turno','turno');
add('sofort|ab sofort','immediately / from now','сразу / с настоящего момента','hemen / hemen başlayarak','негайно / відразу','فورًا / ابتداءً من الآن','すぐに / 即日','imediat / de acum','od zaraz','niha / ji niha ve','فوراً','immédiatement','inmediatamente','subito');
add('suchen','to look for','искать','aramak','шукати','يبحث عن','探す','a căuta','szukać','lê gerîn','جستجو کردن','chercher','buscar','cercare');
add('verdienen','to earn','зарабатывать','kazanmak','заробляти','يكسب','稼ぐ','a câștiga','zarabiać','qezenc kirin','درآمد داشتن','gagner','ganar','guadagnare');
add('pro Stunde','per hour','в час','saat başına','за годину','في الساعة','1時間あたり','pe oră','za godzinę','di saetekê de','در ساعت','par heure','por hora','all’ora');
add('täglich','daily','ежедневно','her gün','щодня','يوميًا','毎日','zilnic','codziennie','rojane','روزانه','tous les jours','diariamente','ogni giorno');
add('wöchentlich','weekly','еженедельно','haftalık','щотижня','أسبوعيًا','毎週','săptămânal','tygodniowo','heftane','هفتگی','hebdomadaire','semanalmente','settimanalmente');
add('monatlich','monthly','ежемесячно','aylık','щомісяця','شهريًا','毎月','lunar','miesięcznie','mehane','ماهانه','mensuel','mensualmente','mensilmente');
add('morgens','in the mornings','по утрам','sabahları','вранці','صباحًا','朝に','dimineața','rano','sibehan','صبح‌ها','le matin','por las mañanas','la mattina');
add('mittags','at midday','днём / в полдень','öğlenleri','опівдні','ظهرًا','昼に','la prânz','w południe','nîvro','ظهرها','à midi','al mediodía','a mezzogiorno');
add('abends','in the evenings','по вечерам','akşamları','увечері','مساءً','夕方に','seara','wieczorami','êvaran','عصرها','le soir','por las tardes/noches','la sera');
add('nachts','at night','по ночам','geceleri','вночі','ليلًا','夜に','noaptea','nocą','şevan','شب‌ها','la nuit','por la noche','di notte');
for(const [de,en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it] of [
 ['montags','on Mondays','по понедельникам','pazartesileri','щопонеділка','أيام الاثنين','月曜日に','lunea','w poniedziałki','duşeman','دوشنبه‌ها','le lundi','los lunes','il lunedì'],
 ['dienstags','on Tuesdays','по вторникам','salıları','щовівторка','أيام الثلاثاء','火曜日に','marțea','we wtorki','sêşeman','سه‌شنبه‌ها','le mardi','los martes','il martedì'],
 ['mittwochs','on Wednesdays','по средам','çarşambaları','щосереди','أيام الأربعاء','水曜日に','miercurea','w środy','çarşeman','چهارشنبه‌ها','le mercredi','los miércoles','il mercoledì'],
 ['donnerstags','on Thursdays','по четвергам','perşembeleri','щочетверга','أيام الخميس','木曜日に','joia','w czwartki','pêncşeman','پنجشنبه‌ها','le jeudi','los jueves','il giovedì'],
 ['freitags','on Fridays','по пятницам','cumaları','щоп’ятниці','أيام الجمعة','金曜日に','vinerea','w piątki','înînan','جمعه‌ها','le vendredi','los viernes','il venerdì'],
 ['samstags','on Saturdays','по субботам','cumartesileri','щосуботи','أيام السبت','土曜日に','sâmbăta','w soboty','şemiyan','شنبه‌ها','le samedi','los sábados','il sabato'],
 ['sonntags','on Sundays','по воскресеньям','pazarları','щонеділі','أيام الأحد','日曜日に','duminica','w niedziele','yekşeman','یکشنبه‌ها','le dimanche','los domingos','la domenica']]) add(de,en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it);
function existing(i){return (i?.translations&&typeof i.translations==='object'?i.translations:null)||(i?.tr&&typeof i.tr==='object'?i.tr:null)||{};}
function lookup(value){return rows.get(norm(value))||window.L8T1TranslationLexicon?.find?.(value)||null;}
function mediaName(item){const raw=String(item?.image||item?.img||'').trim();if(raw){try{return decodeURIComponent(raw.split(/[?#]/)[0].split('/').filter(Boolean).pop()||'').replace(/\.(png|jpe?g|gif|svg|webp)$/i,'')}catch(e){}}return slug(term(item));}
function audioName(item){const raw=String(item?.audioFile||item?.audio||item?.wordAudio||'').trim();if(raw){try{return decodeURIComponent(raw.split(/[?#]/)[0].split('/').filter(Boolean).pop()||'').replace(/\.(mp3|wav|ogg|m4a)$/i,'')}catch(e){}}return mediaName(item);}
function applyItem(item){if(!item||!term(item))return;const current=existing(item),source=lookup(term(item))||current,merged={...current};for(const code of LANGS){const value=source?.[code]||current?.[code];if(value)merged[code]=String(value).trim();}item.translations=merged;item.tr={...merged};const im=mediaName(item),au=audioName(item);if(im)item.image=CDN+encodeURIComponent(im)+'.webp';if(au){item.audio=AUDIO+encodeURIComponent(au)+'.mp3';item.audioFile=item.audio;}item.mediaProvider='bunny';}
const EMOJI_BY_KIND={cards:'📚',choice:'✅',dualinput:'🔢',order:'🧩',grammar:'🧠',input:'✍️',listen:'🎧',matching:'🔗','inline-dialog':'🗨️',exam:'⭐'};
function emoji(task){const t=norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''}`);if(task?.exam||/prufung|exam/.test(t))return'⭐';if(task?.kind==='cards'||/karte|card/.test(t))return'📚';if(/hor|listen|audio/.test(t))return'🎧';if(/lesen|reading/.test(t))return'📖';if(/dialog|sprechen|frage|antwort/.test(t))return'💬';if(/schreib|text|brief|lucke/.test(t))return'✍️';if(/ordnen|reihenfolge/.test(t))return'🧩';if(/grammatik|konjug|sein|haben/.test(t))return'🧠';if(/zuord|matching/.test(t))return'🔗';return EMOJI_BY_KIND[task?.kind]||'✅';}
function patchDom(theme){for(const task of theme?.tasks||[]){const e=emoji(task);task.icon=e;task.emoji=e;try{document.querySelectorAll(`a.l8-task-card[href*="task=${CSS.escape(task.id)}"] .emoji`).forEach(n=>n.textContent=e)}catch(_){}}}
function standardize(theme,n){if(!theme)return;const cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));if(cards){cards.kind='cards';cards.title='Karteikarten';cards.icon='📚';cards.emoji='📚';if(!cards.instruction)cards.instruction=`Lerne die Wörter aus Thema ${n}.`;for(const item of cards.items||[])applyItem(item);theme.vocabularyOverviewItems=cards.items||[];}for(const item of theme.overviewOnlyItems||[])applyItem(item);for(const task of theme.tasks||[]){task.icon=emoji(task);task.emoji=task.icon;}theme.cardStandard='l8t1-compatible-v1';theme.translationStandard='13-languages-v1';theme.mediaStandard='bunny-image-audio-v1';patchDom(theme);}
const n=Number(document.body?.dataset?.theme||0),base=window.L8_CONTENT_READY;
window.L8_CONTENT_READY=Promise.resolve(base).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);if(n>=2&&n<=4)standardize(theme,n);if(theme&&Number(window.L8_THEME?.number)===n)window.L8_THEME=theme;return window.L8_ALL_THEMES||themes;});
const root=document.getElementById('app');if(root)new MutationObserver(()=>{const all=window.L8_ALL_THEMES||{},theme=all[n]||all[String(n)]||window.L8_THEME;if(theme)patchDom(theme)}).observe(root,{childList:true,subtree:true});
})();
