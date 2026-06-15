export function imageFileName(v){
  return String(v||"").toLowerCase()
    .replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") + ".png";
}
export function imagePath(v){ return "bilder/" + imageFileName(v); }
