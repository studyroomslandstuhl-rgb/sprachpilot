(function(){
  function el(id){return document.getElementById(id)}
  function show(text,type="no"){
    const msg=el("loginMsg");
    if(msg) msg.innerHTML=`<div class="${type}">${text}</div>`;
  }
  function setBusy(buttonId,busy,textBusy,textNormal){
    const b=el(buttonId);
    if(!b) return;
    b.disabled=busy;
    b.textContent=busy ? textBusy : textNormal;
  }
  function readableError(err, fallback){
    console.error(err);
    const code=err && err.code ? err.code : "";
    if(code==="auth/invalid-credential" || code==="auth/user-not-found" || code==="auth/wrong-password"){
      return "E-Mail oder Passwort ist falsch. Bitte prüfen und noch einmal versuchen.";
    }
    if(code==="auth/email-already-in-use"){
      return "Diese E-Mail ist schon registriert. Bitte einloggen.";
    }
    if(code==="auth/weak-password"){
      return "Das Passwort ist zu kurz. Bitte mindestens 6 Zeichen verwenden.";
    }
    if(code==="auth/invalid-email"){
      return "Diese E-Mail-Adresse ist ungültig.";
    }
    if(code==="auth/operation-not-allowed"){
      return "Firebase Authentication ist nicht aktiviert. Bitte in Firebase unter Authentication → Sign-in method → Email/Password aktivieren.";
    }
    if(code==="permission-denied" || String(err.message||"").includes("Missing or insufficient permissions")){
      return "Firebase-Regeln blockieren den Zugriff auf teachers. Bitte Firestore-Regeln prüfen.";
    }
    return fallback || (err.message || "Unbekannter Fehler.");
  }

  async function ensureFirebase(){
    if(!window.TeacherFirebaseReady || !window.auth || !window.db){
      const err=window.TeacherFirebaseError ? window.TeacherFirebaseError.message : "Firebase ist nicht verbunden.";
      throw new Error(err);
    }
  }

  window.TeacherAuth = {

    async ensureTeacherDoc(user, extra={}){
      const ref=db.collection("teachers").doc(user.uid);
      const snap=await ref.get();

      if(!snap.exists){
        await ref.set({
          email:user.email || extra.email || "",
          school:extra.school || "",
          job:extra.job || "Lehrkraft",
          role:"teacher",
          active:true,
          createdAt:firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
      }else{
        const old=snap.data();
        await ref.set({
          email:user.email || old.email || "",
          role:old.role || "teacher",
          active:old.active !== false,
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
      }

      return (await ref.get()).data();
    },

    async login(){
      const email=el("email").value.trim().toLowerCase();
      const password=el("password").value;

      if(!email || !password){
        show("Bitte E-Mail und Passwort eingeben.");
        return;
      }

      setBusy("loginBtn",true,"Login läuft...","Einloggen");
      show("Login wird geprüft...","ok");

      try{
        await ensureFirebase();

        const result=await auth.signInWithEmailAndPassword(email,password);
        const user=result.user;

        const teacher=await this.ensureTeacherDoc(user,{email});

        if(teacher.role!=="teacher" || teacher.active===false){
          await auth.signOut();
          show("Lehrerzugang ist nicht aktiv.");
          return;
        }

        show("Login erfolgreich. Dashboard wird geöffnet...","ok");
        setTimeout(()=>location.href="index.html",500);

      }catch(err){
        show(readableError(err,"Login nicht möglich."));
      }finally{
        setBusy("loginBtn",false,"Login läuft...","Einloggen");
      }
    },

    async register(){
      const email=el("regEmail").value.trim().toLowerCase();
      const password=el("regPassword").value;
      const school=el("regSchool").value.trim();
      const job=el("regJob").value.trim();

      if(!email || !password || !school || !job){
        show("Bitte alle Felder ausfüllen.");
        return;
      }
      if(password.length<6){
        show("Das Passwort muss mindestens 6 Zeichen haben.");
        return;
      }

      setBusy("regBtn",true,"Registrierung läuft...","Registrieren");
      show("Registrierung wird erstellt...","ok");

      try{
        await ensureFirebase();

        const result=await auth.createUserWithEmailAndPassword(email,password);
        const user=result.user;

        await this.ensureTeacherDoc(user,{email,school,job});

        show("Registrierung erfolgreich. Dashboard wird geöffnet...","ok");
        setTimeout(()=>location.href="index.html",800);

      }catch(err){
        show(readableError(err,"Registrierung nicht möglich."));
      }finally{
        setBusy("regBtn",false,"Registrierung läuft...","Registrieren");
      }
    },

    async resetPassword(){
      const email=el("resetEmail").value.trim().toLowerCase();

      if(!email){
        show("Bitte E-Mail eingeben.");
        return;
      }

      setBusy("resetBtn",true,"Wird gesendet...","Reset-Link senden");
      show("Reset-Link wird gesendet...","ok");

      try{
        await ensureFirebase();
        await auth.sendPasswordResetEmail(email);
        show("Reset-Link wurde an deine E-Mail gesendet.","ok");
      }catch(err){
        show(readableError(err,"Reset-Link konnte nicht gesendet werden."));
      }finally{
        setBusy("resetBtn",false,"Wird gesendet...","Reset-Link senden");
      }
    },

    async logout(){
      try{
        if(auth) await auth.signOut();
      }finally{
        location.href="login.html";
      }
    }
  };
})();
