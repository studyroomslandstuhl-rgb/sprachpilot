(function(){
'use strict';
if(window.L10T3Translations)return;
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci'],fa:['fa','farsi','persisch'],fr:['fr','french','französisch','franzoesisch'],es:['es','spanish','spanisch'],it:['it','italian','italienisch']
};
const LABELS={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch',fa:'Persisch',fr:'Französisch',es:'Spanisch',it:'Italienisch'};
const T={
 schritt:{en:'step',ru:'шаг',tr:'adım',uk:'крок',ar:'خطوة',ja:'一歩 / ステップ',ro:'pas',pl:'krok',ku:'gav',fa:'قدم / گام',fr:'pas',es:'paso',it:'passo'},
 ein_paar:{en:'a few',ru:'несколько',tr:'birkaç',uk:'кілька',ar:'بضعة',ja:'いくつか / 少し',ro:'câteva',pl:'kilka',ku:'çend heb',fa:'چند تا',fr:'quelques',es:'unos pocos',it:'alcuni / qualche'},
 medizin:{en:'medicine',ru:'лекарство',tr:'ilaç',uk:'ліки',ar:'دواء',ja:'薬',ro:'medicament',pl:'lekarstwo',ku:'derman',fa:'دارو',fr:'médicament',es:'medicina / medicamento',it:'medicina / farmaco'},
 ruhig:{en:'calm / quiet',ru:'спокойный',tr:'sakin',uk:'спокійний',ar:'هادئ',ja:'静かな / 安静に',ro:'liniștit',pl:'spokojny',ku:'aram',fa:'آرام',fr:'calme',es:'tranquilo',it:'tranquillo'},
 apotheke:{en:'pharmacy',ru:'аптека',tr:'eczane',uk:'аптека',ar:'صيدلية',ja:'薬局',ro:'farmacie',pl:'apteka',ku:'dermanxane',fa:'داروخانه',fr:'pharmacie',es:'farmacia',it:'farmacia'},
 fieber:{en:'fever',ru:'температура',tr:'ateş',uk:'температура',ar:'حمّى',ja:'熱 / 発熱',ro:'febră',pl:'gorączka',ku:'ta',fa:'تب',fr:'fièvre',es:'fiebre',it:'febbre'},
 husten:{en:'cough',ru:'кашель',tr:'öksürük',uk:'кашель',ar:'سعال',ja:'せき',ro:'tuse',pl:'kaszel',ku:'kuxik',fa:'سرفه',fr:'toux',es:'tos',it:'tosse'},
 salbe:{en:'ointment',ru:'мазь',tr:'merhem',uk:'мазь',ar:'مرهم',ja:'軟膏',ro:'unguent',pl:'maść',ku:'melhem',fa:'پماد',fr:'pommade',es:'pomada',it:'pomata'},
 verwenden:{en:'to use',ru:'использовать',tr:'kullanmak',uk:'використовувати',ar:'يستخدم',ja:'使う / 使用する',ro:'a folosi',pl:'używać',ku:'bi kar anîn',fa:'استفاده کردن',fr:'utiliser',es:'usar / utilizar',it:'usare / utilizzare'},
 gesundheit:{en:'health',ru:'здоровье',tr:'sağlık',uk:'здоров’я',ar:'الصحة',ja:'健康',ro:'sănătate',pl:'zdrowie',ku:'tenduristî',fa:'سلامتی',fr:'santé',es:'salud',it:'salute'},
 schnupfen:{en:'cold / runny nose',ru:'насморк',tr:'nezle',uk:'нежить',ar:'زكام',ja:'鼻かぜ / 鼻水',ro:'guturai',pl:'katar',ku:'serma / pozê herikî',fa:'آبریزش بینی / سرماخوردگی',fr:'rhume',es:'resfriado / moqueo',it:'raffreddore'},
 tun:{en:'to do',ru:'делать',tr:'yapmak',uk:'робити',ar:'يفعل',ja:'する',ro:'a face',pl:'robić',ku:'kirin',fa:'انجام دادن',fr:'faire',es:'hacer',it:'fare'},
 absender:{en:'sender',ru:'отправитель',tr:'gönderen',uk:'відправник',ar:'المرسل',ja:'差出人',ro:'expeditor',pl:'nadawca',ku:'şander',fa:'فرستنده',fr:'expéditeur',es:'remitente',it:'mittente'},
 ort:{en:'place / town',ru:'место',tr:'yer',uk:'місце',ar:'مكان',ja:'場所 / 市町村',ro:'loc',pl:'miejsce',ku:'cih',fa:'محل / مکان',fr:'lieu',es:'lugar',it:'luogo'},
 empfaenger:{en:'recipient',ru:'получатель',tr:'alıcı',uk:'одержувач',ar:'المستلم',ja:'受取人',ro:'destinatar',pl:'odbiorca',ku:'wergir',fa:'گیرنده',fr:'destinataire',es:'destinatario',it:'destinatario'},
 anrede:{en:'salutation',ru:'обращение',tr:'hitap',uk:'звертання',ar:'صيغة المخاطبة',ja:'呼びかけ / 敬称',ro:'formulă de adresare',pl:'zwrot grzecznościowy',ku:'bang / xîtab',fa:'خطاب / عنوان',fr:'formule d’appel',es:'saludo inicial',it:'formula di apertura'},
 datum:{en:'date',ru:'дата',tr:'tarih',uk:'дата',ar:'تاريخ',ja:'日付',ro:'dată',pl:'data',ku:'dîrok',fa:'تاریخ',fr:'date',es:'fecha',it:'data'},
 unterschrift:{en:'signature',ru:'подпись',tr:'imza',uk:'підпис',ar:'توقيع',ja:'署名',ro:'semnătură',pl:'podpis',ku:'îmze',fa:'امضا',fr:'signature',es:'firma',it:'firma'},
 schicken:{en:'to send',ru:'отправлять',tr:'göndermek',uk:'надсилати',ar:'يرسل',ja:'送る',ro:'a trimite',pl:'wysyłać',ku:'şandin',fa:'فرستادن',fr:'envoyer',es:'enviar',it:'inviare'},
 sprechstunde:{en:'consultation hours',ru:'приёмные часы',tr:'muayene saati',uk:'години прийому',ar:'ساعات العيادة',ja:'診療時間',ro:'ore de consultație',pl:'godziny przyjęć',ku:'saetên muayeneyê',fa:'ساعات ویزیت',fr:'heures de consultation',es:'horario de consulta',it:'orario di visita'},
 krankmeldung:{en:'sick note / sickness notification',ru:'больничный / сообщение о болезни',tr:'hastalık bildirimi / rapor',uk:'лікарняний / повідомлення про хворобу',ar:'إبلاغ بالمرض / إجازة مرضية',ja:'病欠届 / 診断書',ro:'anunț de boală / concediu medical',pl:'zgłoszenie choroby / zwolnienie lekarskie',ku:'agahdariya nexweşiyê',fa:'اعلام بیماری / گواهی استعلاجی',fr:'arrêt maladie / avis de maladie',es:'parte de baja / aviso de enfermedad',it:'comunicazione di malattia / certificato di malattia'},
 betreff:{en:'subject',ru:'тема письма',tr:'konu',uk:'тема листа',ar:'الموضوع',ja:'件名',ro:'subiect',pl:'temat',ku:'mijar',fa:'موضوع',fr:'objet',es:'asunto',it:'oggetto'},
 postleitzahl:{en:'postal code',ru:'почтовый индекс',tr:'posta kodu',uk:'поштовий індекс',ar:'الرمز البريدي',ja:'郵便番号',ro:'cod poștal',pl:'kod pocztowy',ku:'koda posteyê',fa:'کد پستی',fr:'code postal',es:'código postal',it:'CAP'},
 hausnummer:{en:'house number',ru:'номер дома',tr:'bina numarası',uk:'номер будинку',ar:'رقم المنزل',ja:'番地 / 家番号',ro:'numărul casei',pl:'numer domu',ku:'hejmara malê',fa:'شماره خانه',fr:'numéro de maison',es:'número de casa',it:'numero civico'},
 strasse:{en:'street',ru:'улица',tr:'sokak',uk:'вулиця',ar:'شارع',ja:'通り / 道路名',ro:'stradă',pl:'ulica',ku:'kolan',fa:'خیابان',fr:'rue',es:'calle',it:'strada'},
 gruss:{en:'closing / greeting',ru:'приветствие',tr:'selam / kapanış',uk:'привітання / завершальна формула',ar:'تحية',ja:'結びの挨拶',ro:'salut / formulă de încheiere',pl:'pozdrowienie',ku:'silav',fa:'درود / عبارت پایانی',fr:'formule de politesse',es:'saludo / despedida',it:'saluto / formula di chiusura'},
 empfangen:{en:'to receive',ru:'получать',tr:'teslim almak',uk:'отримувати',ar:'يستلم',ja:'受け取る',ro:'a primi',pl:'otrzymywać',ku:'wergirtin',fa:'دریافت کردن',fr:'recevoir',es:'recibir',it:'ricevere'},
 attest:{en:'medical certificate',ru:'медицинская справка',tr:'sağlık raporu',uk:'медична довідка',ar:'شهادة طبية',ja:'診断書 / 医療証明書',ro:'certificat medical',pl:'zaświadczenie lekarskie',ku:'belgeya bijîjkî',fa:'گواهی پزشکی',fr:'certificat médical',es:'certificado médico',it:'certificato medico'},
 arztbescheinigung:{en:"doctor's certificate",ru:'справка от врача',tr:'doktor raporu',uk:'довідка від лікаря',ar:'شهادة من الطبيب',ja:'医師の証明書',ro:'adeverință medicală',pl:'zaświadczenie od lekarza',ku:'belgeya ji bijîjk',fa:'گواهی پزشک',fr:'attestation du médecin',es:'certificado del médico',it:'certificato del medico'},
 anbei:{en:'attached / enclosed',ru:'в приложении',tr:'ekte',uk:'у додатку',ar:'مرفق',ja:'添付して / 同封して',ro:'atașat',pl:'w załączeniu',ku:'pêvekirî',fa:'پیوست',fr:'ci-joint',es:'adjunto',it:'in allegato'},
 gespraech:{en:'conversation',ru:'разговор',tr:'konuşma',uk:'розмова',ar:'محادثة',ja:'会話',ro:'conversație',pl:'rozmowa',ku:'axaftin',fa:'گفت‌وگو',fr:'conversation',es:'conversación',it:'conversazione'},
 sonnenbrand:{en:'sunburn',ru:'солнечный ожог',tr:'güneş yanığı',uk:'сонячний опік',ar:'حروق الشمس',ja:'日焼け / 日焼けによる炎症',ro:'arsură solară',pl:'oparzenie słoneczne',ku:'şewata rojê',fa:'آفتاب‌سوختگی',fr:'coup de soleil',es:'quemadura solar',it:'scottatura solare'},
 kuehlen:{en:'to cool',ru:'охлаждать',tr:'soğutmak',uk:'охолоджувати',ar:'يبرّد',ja:'冷やす',ro:'a răci',pl:'chłodzić',ku:'sar kirin',fa:'خنک کردن',fr:'refroidir',es:'enfriar',it:'raffreddare'},
 tabletten_nehmen:{en:'to take tablets',ru:'принимать таблетки',tr:'tablet almak',uk:'приймати таблетки',ar:'يتناول الأقراص',ja:'錠剤を飲む',ro:'a lua comprimate',pl:'brać tabletki',ku:'heb xwarin',fa:'قرص خوردن',fr:'prendre des comprimés',es:'tomar pastillas',it:'prendere compresse'},
 krankschreiben:{en:'to sign someone off sick',ru:'выписать больничный',tr:'rapor yazmak',uk:'оформити лікарняний',ar:'يمنح إجازة مرضية',ja:'病気休暇の診断書を出す',ro:'a acorda concediu medical',pl:'wystawić zwolnienie lekarskie',ku:'rapora nexweşiyê nivîsandin',fa:'مرخصی استعلاجی نوشتن',fr:'mettre en arrêt maladie',es:'dar la baja médica',it:'mettere in malattia / fare il certificato di malattia'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function norm(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function language(){const p=profile(),raw=norm(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'en');for(const[code,names]of Object.entries(LANGS))if(names.some(name=>raw===norm(name)||raw.includes(norm(name))))return code;return'en'}
const code=language(),B='https://sprachpilot.b-cdn.net/',A=B+'audio/';
for(const item of window.L10T3?.cards||[]){item.translations=T[item.id]||{};item.translation=T[item.id]?.[code]||T[item.id]?.en||'';item.image=B+item.id+'.webp?v=20260914-l10t3-bunny1';item.audioFile=item.id+'.mp3';item.audio=A+item.id+'.mp3?v=20260914-l10t3-bunny1';item.audioFallback=B+item.id+'.mp3?v=20260914-l10t3-bunny1'}
window.L10T3Translations={code,label:LABELS[code]||'Englisch',lexicon:T};
})();
