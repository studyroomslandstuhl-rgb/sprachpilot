export function progressHtml(percent){
  return `<div class="progress-line"><div class="progress-fill" style="width:${percent}%"></div></div>`;
}
export function notice(type,msg){ return `<div class="${type}">${msg}</div>`; }
