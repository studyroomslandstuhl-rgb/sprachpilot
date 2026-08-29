const PDF_GROUPS=[
  {level:'A1',rows:[
    'antworten - Ich antworte dir später.',
    'folgen - Ich folge dem Mann unauffällig.',
    'gefallen - Gefällt dir deine neue Wohnung?',
    'gehören - Das Auto gehört dem neuen Nachbarn.',
    'glauben - Warum glaubst du mir nicht?',
    'helfen - Sie hilft dem alten Mann.',
    'passieren - Passiert dir das öfters?',
    'raten - Der Arzt hat meinem Opa geraten, sich auszuruhen.',
    'schmecken - Pizza schmeckt meinem Vater nicht.',
    'wehtun - Ich werde dir wehtun.',
    'zuhören - Die Schüler hören dem Lehrer zu.'
  ]},
  {level:'A2',rows:[
    'befehlen - Der General befiehlt dem Soldaten zu schießen.',
    'danken - Ich danke dir für deine Hilfe.',
    'fehlen - Du fehlst mir!',
    'nachlaufen - Ich laufe dem Ball nach.',
    'hinterherlaufen - Ich laufe dem Ball hinterher.',
    'passen - Die Hose passt mir nicht mehr. Ich bin zu dick.',
    'vertrauen - Ich vertraue meinem Bruder.',
    'vergeben - Ich kann meinem Mann den Seitensprung nicht vergeben.',
    'verzeihen - Ich kann meinem Mann den Seitensprung nicht verzeihen.',
    'widersprechen - Der Chef widerspricht seinem Mitarbeiter.',
    'zusehen - Kann ich dir bei deiner Arbeit zusehen?',
    'fremdgehen - Bist du mir fremdgegangen?',
    'zustimmen - Der Politiker stimmt dem neuen Gesetz zu.'
  ]},
  {level:'B1',rows:[
    'ähneln - Ich ähnele meinem Bruder.',
    'begegnen - Ich bin heute Morgen zufällig einem alten Freund begegnet.',
    'beistehen - Ich stehe dir in dieser schweren Zeit bei.',
    'beitreten - Ich bin gestern einem Fußballclub beigetreten.',
    'drohen - Der Lehrer droht den Schülern mit extra Hausaufgaben, wenn sie nicht still sind.',
    'entgegengehen - Ich gehe dir schon mal entgegen.',
    'entgegenfahren - Er fährt dir schon entgegen.',
    'entgegenkommen - Kommst du mir entgegen?',
    'gratulieren - Ich gratuliere dir zum Geburtstag.',
    'kündigen - Der Chef hat mir gekündigt.',
    'sich nähern - Der Löwe nähert sich seiner Beute.',
    'schaden - Du schadest dir nur selbst mit deinem schlechten Verhalten.'
  ]},
  {level:'B2',rows:[
    'einfallen - Fällt dir noch etwas ein?',
    'gehorchen - Der Soldat gehorcht dem General.',
    'genügen - Das genügt mir.',
    'guttun - Ein Urlaub würde dir guttun.',
    'nützen - Der Sieg nützt dem Team nichts mehr.',
    'ausweichen - Du konntest dem Hindernis zum Glück noch ausweichen.'
  ]},
  {level:'C1',rows:[
    'dienen - Wie kann ich Ihnen dienen?',
    'gelingen - Das Bild ist dir wirklich gut gelungen.',
    'misslingen - Der Test ist mir total misslungen.'
  ]}
];

function cp1252Byte(ch){
  const code=ch.charCodeAt(0);
  if(code<=255)return code;
  const map={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159};
  return map[code]??63;
}
function pdfLiteral(text){
  let out='';
  for(const ch of String(text||'')){
    const b=cp1252Byte(ch);
    if(b===40||b===41||b===92)out+='\\'+String.fromCharCode(b);
    else if(b<32||b>126)out+='\\'+b.toString(8).padStart(3,'0');
    else out+=String.fromCharCode(b);
  }
  return out;
}
function wrap(text,max=82){
  const words=String(text).split(/\s+/),lines=[];let line='';
  for(const word of words){
    const next=line?line+' '+word:word;
    if(next.length>max&&line){lines.push(line);line=word}else line=next;
  }
  if(line)lines.push(line);
  return lines;
}
function buildPages(){
  const pages=[];let page=[],y=790;
  const push=(text,size=10,bold=false,indent=0,gap=14)=>{
    if(y<58){pages.push(page);page=[];y=790}
    page.push({text,size,bold,x:50+indent,y});y-=gap;
  };
  push('Verben mit Dativ',18,true,0,26);
  for(const group of PDF_GROUPS){
    if(y<100){pages.push(page);page=[];y=790}
    push(group.level,14,true,0,20);
    for(const row of group.rows){
      const lines=wrap(row);
      lines.forEach((line,index)=>push(line,10,false,index?14:0,13));
      y-=3;
    }
    y-=8;
  }
  if(page.length)pages.push(page);
  return pages;
}
function asciiBytes(text){const out=new Uint8Array(text.length);for(let i=0;i<text.length;i++)out[i]=text.charCodeAt(i)&255;return out}
function concat(parts){const total=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length}return out}
function makePdf(){
  const pageDefs=buildPages(),objects={};
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const kids=[];
  pageDefs.forEach((lines,index)=>{
    const pageId=5+index*2,contentId=pageId+1;kids.push(`${pageId} 0 R`);
    let stream='';
    for(const line of lines)stream+=`BT /${line.bold?'F2':'F1'} ${line.size} Tf 1 0 0 1 ${line.x} ${line.y} Tm (${pdfLiteral(line.text)}) Tj ET\n`;
    objects[contentId]=`<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
    objects[pageId]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
  });
  objects[2]=`<< /Type /Pages /Count ${pageDefs.length} /Kids [${kids.join(' ')}] >>`;
  const maxId=Math.max(...Object.keys(objects).map(Number)),parts=[asciiBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')],offsets=new Array(maxId+1).fill(0);let length=parts[0].length;
  for(let id=1;id<=maxId;id++){
    const part=asciiBytes(`${id} 0 obj\n${objects[id]}\nendobj\n`);offsets[id]=length;parts.push(part);length+=part.length;
  }
  const xrefOffset=length;
  let xref=`xref\n0 ${maxId+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=maxId;id++)xref+=String(offsets[id]).padStart(10,'0')+' 00000 n \n';
  xref+=`trailer\n<< /Size ${maxId+1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  parts.push(asciiBytes(xref));
  return new Blob([concat(parts)],{type:'application/pdf'});
}
function downloadPdf(){
  const blob=makePdf(),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='Dativtabelle.pdf';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
const button=document.querySelector('#dativPdfDownload');
if(button)button.addEventListener('click',downloadPdf);
