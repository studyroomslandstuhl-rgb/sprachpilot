(function(){
'use strict';
const D=window.L10T3;if(!D||!Array.isArray(D.cards))return;
const meanings={
 schritt:'Bewegen mit den Füßen.',
 ein_paar:'Zwei, drei oder vier.',
 medizin:'Tabletten, Hustensaft oder eine Spritze.',
 ruhig:'Leise und ohne Stress.',
 apotheke:'Ein Geschäft. Dort kann man Medikamente kaufen.',
 fieber:'Hohe Körpertemperatur, über 38 Grad.',
 husten:'Man hat Schmerzen in der Brust und muss laut husten.',
 salbe:'Eine Creme ohne Farbe.',
 verwenden:'Benutzen.',
 gesundheit:'Man ist gesund.',
 schnupfen:'Die Nase läuft.',
 tun:'Machen.',
 absender:'Die Person, die einen Brief schickt.',
 ort:'Eine Stadt oder eine Stelle.',
 empfaenger:'Die Person, die einen Brief bekommt.',
 anrede:'Der Anfang eines Briefes.',
 datum:'Tag, Monat und Jahr.',
 unterschrift:'Der Name auf einem Dokument.',
 schicken:'Senden.',
 sprechstunde:'Die Zeit für eine Beratung beim Arzt.',
 krankmeldung:'Information darüber, dass man krank ist.',
 betreff:'Das Thema.',
 postleitzahl:'Die Zahl der Stadt.',
 hausnummer:'Die Nummer eines Hauses.',
 strasse:'Ein Teil der Adresse.',
 gruss:'Der Schluss eines Briefes.',
 empfangen:'Bekommen.',
 attest:'Eine Bescheinigung vom Arzt.',
 arztbescheinigung:'Ein Attest vom Arzt.',
 anbei:'Ein Dokument, das wir mitschicken.',
 gespraech:'Menschen sprechen miteinander.',
 sonnenbrand:'Man ist zu lange in der Sonne und die Haut wird rot.',
 kuehlen:'Etwas kalt machen.',
 tabletten_nehmen:'Medizin nehmen: Tabletten schlucken, meistens mit Wasser.',
 krankschreiben:'Der Arzt gibt einem Patienten Kranktage.'
};
D.cards.forEach(card=>{if(Object.prototype.hasOwnProperty.call(meanings,card.id))card.meaning=meanings[card.id]});
})();
