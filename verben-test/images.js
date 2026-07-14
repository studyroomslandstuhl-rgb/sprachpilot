function normalizeVerbImageFile(value){
  const raw=String(value||'').split('/').pop().trim();
  if(!raw)return'';
  return raw.replace(/\.(png|jpe?g|gif|svg|webp)$/i,'')+'.webp';
}
imageCandidates=function(verb){
  const entry=catalogByVerb.get(verb)||{};
  const explicit=normalizeVerbImageFile(SPECIAL_IMAGE_FILES[verb]||entry.img||'');
  const underscore=normalizeVerbImageFile(slug(verb,'_'));
  const hyphen=normalizeVerbImageFile(slug(verb,'-'));
  const names=uniq([explicit,underscore,hyphen]);
  return uniq(names.flatMap(file=>[BUNNY+file,BUNNY+'Neu/'+file]));
};
window.vtImageNext=function(img){
  try{
    const list=JSON.parse(img.dataset.candidates||'[]');
    const index=Number(img.dataset.index||0)+1;
    if(index<list.length){img.dataset.index=String(index);img.src=list[index];return}
  }catch(e){}
  img.outerHTML='<span class="image-fallback">Bild fehlt</span>';
};
imageHtml=function(verb,alt=verb){
  const list=imageCandidates(verb);
  return `<img src="${esc(list[0]||'')}" alt="${esc(alt)}" data-candidates='${esc(JSON.stringify(list))}' data-index="0" loading="eager" decoding="async" onerror="vtImageNext(this)">`;
};
imageBox=function(verb){return `<div class="image-box">${imageHtml(verb)}</div>`};
window.VERBEN_TEST_IMAGES={candidates:imageCandidates,file:normalizeVerbImageFile};
