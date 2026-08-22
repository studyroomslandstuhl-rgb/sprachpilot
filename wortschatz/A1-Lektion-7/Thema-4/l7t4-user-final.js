(function(){
'use strict';
if(window.__SP_L7T4_USER_FINAL_V3)return;window.__SP_L7T4_USER_FINAL_V3=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim();
const forbidden=norm('sich entschuldigen');
function task(theme,id){return (theme?.tasks||[]).find(t=>t?.id===id)}
function itemText(item){return [item?.word,item?.full,item?.answer,item?.term,item?.label,item?.front,item?.prompt].filter(Boolean).map(norm)}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=task(theme,'karteikarten');
 if(cards){
  cards.title='Karteikarten';cards.description='Lerne die Wörter.';
  cards.items=(cards.items||[]).filter(item=>!itemText(item).some(value=>value===forbidden));
 }
 const article=task(theme,'artikel');if(article){article.title='Artikel und Plural';article.description='Sieh das Bild an und schreibe Artikel und Plural.';article.instruction='Sieh das Bild an. Schreibe den richtigen Artikel und den Plural.'}
 const meaning=task(theme,'wort-bedeutung');if(meaning){meaning.title='Bedeutung';meaning.description='Finde die passende Bedeutung.';meaning.instruction=''}
 const order=task(theme,'redemittel-ordnen');if(order){
  order.title='Redemittel ordnen';order.description='Ordne die Redewendungen.';order.instruction='Ordne die Redewendungen.';
  order.items=Array.isArray(order.items)?order.items:[];
  const good=order.items.find(item=>norm(item?.answer)==='gute besserung');
  if(good){good.answer='Gute Besserung!';good.tokens=['rung!','Gu','Bes','te','se'];good.mode='syllables'}
  if(!order.items.some(item=>norm(item?.answer)==='das ist schade'))order.items.push({answer:'Das ist schade.',mode:'words',tokens:['schade.','ist','Das']});
 }
 const phone=task(theme,'telefonluecken');if(phone){phone.title='Telefonatlücken';phone.description='Ergänze die Telefonate.';phone.instruction='Ergänze die Telefonate.'}
 const messages=task(theme,'lesen-richtig-falsch');if(messages){messages.title='Nachrichten lesen';messages.description='Lies die Nachricht. Antworte A, B oder C.';messages.instruction='Lies die Nachricht. Antworte A, B oder C.'}
 const errors=task(theme,'rechtschreibung');if(errors){errors.title='Fehler korrigieren';errors.description='Finde die Rechtschreibfehler.';errors.instruction='1. Klicke das falsche Wort an. 2. Schreibe die richtige Form.'}
 const listening=task(theme,'hoeren-sekretariat');if(listening){listening.title='Hören Krankmeldungen';listening.description='Höre und antworte.';listening.instruction='Höre den Dialog und wähle A, B oder C.'}
 const dialogues=task(theme,'hoerdialog-ordnen');if(dialogues){dialogues.title='Dialoge';dialogues.description='Wähle passende Äußerung.';dialogues.instruction='Lese Dialoge und wähle die passende Äußerung.'}
 const school=task(theme,'nachrichten-schule');if(school){school.title='Nachrichten aus der Schule';school.description='Antworte auf die Fragen.';school.instruction='Lese den Text und wähle A, B oder C.'}
 const email=task(theme,'email-ergaenzen');if(email){email.title='E-Mail ergänzen';email.description='Ergänze die E-Mail.';email.instruction='Ergänze die E-Mail.'}
 const exam=(theme.tasks||[]).find(t=>t?.exam);if(exam){exam.title='Prüfung';exam.description='Bearbeite die Prüfung.'}
 theme.uiRules={...(theme.uiRules||{}),nativeTranslationOnly:true,shortCardInstructions:true,multipleChoiceMixed:true,examTitle:'Prüfung'};
 theme.contentRevision='l7t4-user-final-20260822-v3';window.L7_THEME=theme;return theme;
});
try{if(window.L7T4CardContent?.data)delete window.L7T4CardContent.data['sich entschuldigen']}catch(e){}
})();
