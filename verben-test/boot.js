import { getActiveProfile, getActiveRole, dashboardHref } from '/js/auth.js?v=verben-test-clean-3';
import { loadCourseRelease, moduleOpen } from '/js/course-releases.js?v=verben-test-clean-3';
import { db, doc, getDoc, setDoc } from '/js/firebase.js?v=verben-test-clean-3';

window.VT_DEPS={getActiveProfile,getActiveRole,dashboardHref,loadCourseRelease,moduleOpen};

window.firebase={
  firestore(){
    return {
      collection(name){
        return {
          doc(id){
            const ref=doc(db,name,id);
            return {
              async get(){
                return getDoc(ref);
              },
              async set(data,options){
                return setDoc(ref,data,options||{});
              }
            };
          }
        };
      }
    };
  }
};

function load(src){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=()=>reject(new Error('Datei konnte nicht geladen werden: '+src));
    document.body.appendChild(script);
  });
}

try{
  await load('./app-clean.js?v=3');
  if(window.VERBEN_TEST&&typeof window.VERBEN_TEST.start==='function'){
    await window.VERBEN_TEST.start();
  }else{
    throw new Error('Startfunktion fehlt.');
  }
}catch(error){
  const app=document.getElementById('app');
  if(app){
    app.innerHTML='<section class="card error-box"><h2>Verben Test konnte nicht geladen werden</h2><p>'+String(error.message||error)+'</p><button onclick="location.reload()">Neu laden</button></section>';
  }
}
