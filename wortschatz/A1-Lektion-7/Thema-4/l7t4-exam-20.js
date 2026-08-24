(function(){
'use strict';
if(window.__SP_L7T4_EXAM_20_V1)return;window.__SP_L7T4_EXAM_20_V1=true;
const q=(prompt,answer,wrong1,wrong2)=>({prompt,options:[answer,wrong1,wrong2],answer});
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const exam=theme.tasks.find(task=>task?.exam);if(!exam)return theme;
 exam.title='Prüfung';
 exam.description='Bearbeite die 20 Prüfungsfragen.';
 exam.instruction='Wähle die passende Antwort.';
 exam.kind='choice';
 exam.items=[
  q('Welcher Artikel passt? ___ Klasse','die','der','das'),
  q('Wie lautet der Plural von „der Junge“?','die Jungen','die Junge','die Junges'),
  q('Wie lautet der Plural von „das Schwimmbad“?','die Schwimmbäder','die Schwimmbade','die Schwimmbads'),
  q('Was bedeutet „Bescheid sagen“?','jemanden informieren','jemanden abholen','jemanden untersuchen'),
  q('Was bedeutet „fehlen“?','nicht da sein','zu früh kommen','einen Eintritt bezahlen'),
  q('Was bedeutet „losfahren“?','eine Fahrt beginnen','wieder zurückkommen','zu Hause bleiben'),
  q('Was sagt man zu einer kranken Person?','Gute Besserung!','Gute Reise!','Herzlichen Glückwunsch!'),
  q('Du rufst in der Schule an. Wie beginnst du passend?','Guten Morgen, hier spricht Omar Hassan.','Viele Grüße, Omar Hassan.','Mit freundlichen Grüßen, Omar Hassan.'),
  q('Dein Kind ist krank. Welche Information passt zur Krankmeldung?','Mein Sohn kann heute nicht zur Schule kommen.','Mein Sohn fährt heute auf jeden Fall mit.','Mein Sohn bezahlt heute den Eintritt.'),
  q('Das Sekretariat sagt: „Ich sage der Lehrerin Bescheid.“ Was passiert?','Die Lehrerin wird informiert.','Die Lehrerin wird abgeholt.','Die Lehrerin geht zum Arzt.'),
  q('Die Klasse trifft sich um 7:45 Uhr. Der Bus fährt um 8:00 Uhr. Wann ist der Treffpunkt?','um 7:45 Uhr','um 8:00 Uhr','um 8:45 Uhr'),
  q('Karim ist krank und kann beim Ausflug nicht mitkommen. Welche Reaktion passt?','Das ist schade. Gute Besserung!','Prima, dann fährt er sicher mit.','Wie viel kostet der Eintritt?'),
  q('Paul hat um 9:30 Uhr einen Arzttermin. Warum fehlt er in der Schule?','Er hat einen Arzttermin.','Er geht ins Schwimmbad.','Er macht einen Schulausflug.'),
  q('Welche Aussage passt zu „zurückkommen“?','Wir kommen um 16 Uhr wieder an der Schule an.','Wir fahren um 8 Uhr los.','Wir bleiben den ganzen Tag zu Hause.'),
  q('Welche Aussage passt zu „mitkommen“?','Sara fährt zusammen mit der Klasse zum Zoo.','Sara bleibt allein zu Hause.','Sara informiert das Sekretariat.'),
  q('Formelle E-Mail an Frau Müller: Welche Anrede passt?','Sehr geehrte Frau Müller,','Liebe Frau Müller,','Hallo Müller,'),
  q('Formelle E-Mail an Herrn Klein: Welcher Schluss passt?','Mit freundlichen Grüßen','Liebe Grüße','Bis später'),
  q('Halbformelle Nachricht an eine bekannte Lehrerin: Welche Kombination passt zusammen?','Liebe Frau Schneider, … Viele Grüße','Sehr geehrte Frau Schneider, … Liebe Grüße','Liebe Frau Schneider, … Mit freundlichen Grüßen'),
  q('Welche Nachricht ist sinnvoll?','Meine Tochter ist krank. Sie kann heute nicht zur Schule kommen.','Meine Tochter ist krank. Deshalb fährt sie heute sicher zum Ausflug mit.','Meine Tochter ist krank. Deshalb ist der Eintritt kostenlos.'),
  q('Was passt am Ende eines Telefonats mit dem Sekretariat?','Vielen Dank. Auf Wiederhören.','Sehr geehrte Frau Müller.','Guten Morgen, hier spricht …')
 ];
 exam.examQuestionCount=20;
 theme.contentRevision='l7t4-exam-20-20260824-v1';
 window.L7_THEME=theme;return theme;
});
})();