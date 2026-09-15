(function(){
'use strict';
if(window.__SP_L10T2_FINAL_PATCH_V1)return;
window.__SP_L10T2_FINAL_PATCH_V1=true;
const D=window.L10T2;if(!D)return;

function bodyNumberLabel(item){
  const text=String(item?.q||'')+' '+String(item?.a||'');
  return /\b(?:Füße|Knie|Zähne|Köpfe|Hälse|Rücken)\s+tun\b/i.test(text)?'PLURAL':'SINGULAR';
}
function markNumber(items){
  return (items||[]).map(item=>{
    const q=String(item?.q||'').replace(/^(?:SINGULAR|PLURAL)\s*·\s*/i,'');
    return {...item,q:`${bodyNumberLabel(item)} · ${q}`};
  });
}
D.baseTransform=markNumber(D.baseTransform);
D.allTransform=markNumber(D.allTransform);

const qaTask={
 id:'gesundheit-fragen-antworten',
 title:'Was kann man da tun?',
 icon:'💬',
 cardText:'Formuliere 10 Fragen und passende Antworten.',
 text:'Formuliere die Frage und die Antwort. Sprich oder schreibe.',
 example:'Freund · Bauchschmerzen → Mein Freund hat Bauchschmerzen. Was kann man da tun? · spazieren gehen → Er soll spazieren gehen.'
};
D.healthQA=[
 {id:'qa1',person:'Freund',problem:'Bauchschmerzen',tip:'spazieren gehen',question:'Mein Freund hat Bauchschmerzen. Was kann man da tun?',answer:'Er soll spazieren gehen.'},
 {id:'qa2',person:'Freundin',problem:'Kopfschmerzen',tip:'viel Wasser trinken',question:'Meine Freundin hat Kopfschmerzen. Was kann man da tun?',answer:'Sie soll viel Wasser trinken.'},
 {id:'qa3',person:'Vater',problem:'Rückenschmerzen',tip:'eine Salbe verwenden',question:'Mein Vater hat Rückenschmerzen. Was kann man da tun?',answer:'Er soll eine Salbe verwenden.'},
 {id:'qa4',person:'Mutter',problem:'Halsschmerzen',tip:'Tee trinken',question:'Meine Mutter hat Halsschmerzen. Was kann man da tun?',answer:'Sie soll Tee trinken.'},
 {id:'qa5',person:'Bruder',problem:'Husten',tip:'warmen Tee trinken',question:'Mein Bruder hat Husten. Was kann man da tun?',answer:'Er soll warmen Tee trinken.'},
 {id:'qa6',person:'Schwester',problem:'Schnupfen',tip:'viel trinken',question:'Meine Schwester hat Schnupfen. Was kann man da tun?',answer:'Sie soll viel trinken.'},
 {id:'qa7',person:'Kollege',problem:'Zahnschmerzen',tip:'zum Zahnarzt gehen',question:'Mein Kollege hat Zahnschmerzen. Was kann man da tun?',answer:'Er soll zum Zahnarzt gehen.'},
 {id:'qa8',person:'Kollegin',problem:'Fieber',tip:'im Bett bleiben',question:'Meine Kollegin hat Fieber. Was kann man da tun?',answer:'Sie soll im Bett bleiben.'},
 {id:'qa9',person:'Sohn',problem:'Sonnenbrand',tip:'die Haut kühlen',question:'Mein Sohn hat Sonnenbrand. Was kann man da tun?',answer:'Er soll die Haut kühlen.'},
 {id:'qa10',person:'Tochter',problem:'starke Kopfschmerzen',tip:'eine Tablette nehmen',question:'Meine Tochter hat starke Kopfschmerzen. Was kann man da tun?',answer:'Sie soll eine Tablette nehmen.'}
];
if(Array.isArray(D.tasks)){
  const oldIndex=D.tasks.findIndex(t=>t.id==='biografien');
  const existing=D.tasks.findIndex(t=>t.id===qaTask.id);
  if(existing>=0)D.tasks[existing]=qaTask;
  else if(oldIndex>=0)D.tasks.splice(oldIndex,1,qaTask);
  else {
    const pharmacyIndex=D.tasks.findIndex(t=>t.id==='apotheke-dialoge-hoeren');
    D.tasks.splice(pharmacyIndex>=0?pharmacyIndex:D.tasks.length,0,qaTask);
  }
}

const pd=D.pharmacyDialogues||[];
const sun=pd.find(x=>String(x.id).includes('sonnenbrand'));
if(sun?.questions?.length>=3){
 sun.questions[0]={q:'Was ist das Problem?',a:'Sonnenbrand',options:['Sonnenbrand','Fieber','Rückenschmerzen','Hautausschlag']};
 sun.questions[1]={q:'Welche Symptome hat die Person?',a:'Rote, heiße Haut und Brennen',options:['Heiße Haut und Schnupfen','Rote, heiße Haut und Brennen','Rote Haut und Husten','Fieber und rote Haut']};
 sun.questions[2]={q:'Was soll die Person machen?',a:'Haut kühlen und Salbe verwenden',options:['Nur Wasser trinken','Wieder in die Sonne gehen','Eis direkt auf die Haut legen','Haut kühlen und Salbe verwenden']};
}
const back=pd.find(x=>String(x.id).includes('ruecken'));
if(back?.questions?.length>=3){
 back.questions[0]={q:'Was ist das Problem?',a:'Rückenschmerzen',options:['Rückenschmerzen','Kopfschmerzen','Bauchschmerzen','Knieschmerzen']};
 back.questions[1]={q:'Welche Symptome hat die Person?',a:'Schmerzen beim Bewegen und Heben',options:['Schmerzen beim Bewegen und Heben','Schmerzen beim Schlafen','Schmerzen beim Essen','Schmerzen beim Husten']};
}
})();
