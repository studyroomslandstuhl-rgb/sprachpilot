(function(){
  const OWNER_EMAILS=["studyroomslandstuhl@gmail.com","alicekrekoten@gmail.com","alisa.krekoten@gmail.com"];
  const FUNCTIONS_REGION="europe-west1";
  const el=id=>document.getElementById(id);
  const norm=value=>String(value||"").trim().toLowerCase();

  function show(text,type="no"){
    const msg=el("loginMsg");if(msg)msg.innerHTML=`<div class="${type}">${text}</div>`;
  }
  function setBusy(buttonId,busy,textBusy,textNormal){
    const button=el(buttonId);if(!button)return;button.disabled=busy;button.textContent=busy?textBusy:textNormal;
  }
  function readableError(err,fallback){
    console.error(err);const code=err?.code||"";
    if(["auth/invalid-credential","auth/user-not-found","auth/wrong-password"].includes(code))return "E-Mail oder Passwort ist falsch. Bitte prüfen und noch einmal versuchen.";
    if(code==="auth/email-already-in-use")return "Diese E-Mail ist schon registriert. Bitte einloggen.";
    if(code==="auth/weak-password")return "Das Passwort ist zu kurz. Bitte mindestens 6 Zeichen verwenden.";
    if(code==="auth/invalid-email")return "Diese E-Mail-Adresse ist ungültig.";
    if(code==="auth/too-many-requests")return "Zu viele Versuche. Bitte später noch einmal versuchen.";
    if(code==="permission-denied"||String(err?.message||"").includes("Missing or insufficient permissions"))return "Firebase-Regeln blockieren den Zugriff.";
    return fallback||(err?.message||"Unbekannter Fehler.");
  }
  async function ensureFirebase(){
    if(!window.TeacherFirebaseReady||!window.auth||!window.db)throw new Error(window.TeacherFirebaseError?.message||"Firebase ist nicht verbunden.");
    if(typeof firebase.functions!=="function")throw new Error("SprachPilot-Maildienst ist nicht geladen.");
  }
  function mailCallable(name){return firebase.app().functions(FUNCTIONS_REGION).httpsCallable(name)}
  async function sendVerificationMail(){return mailCallable("requestVerificationEmail")({})}
  async function sendPasswordResetMail(email){return mailCallable("requestPasswordReset")({email:norm(email)})}

  function clearTeacherMode(){
    ["SP_TEACHER_MODE","SP_USER_ROLE","SP_TEACHER_EMAIL","SP_TEACHER_ID","SP_TEACHER_UID","SP_TEACHER_PROFILE","SP_LOGIN_ROLE","SP_ACTIVE_ROLE","SP_LOGIN_CONTEXT"].forEach(k=>localStorage.removeItem(k));
    try{sessionStorage.removeItem("SP_TEACHER_PREVIEW")}catch(e){}
  }
  function setTeacherMode(user,teacher={}){
    clearTeacherMode();
    const profile={uid:user.uid,email:user.email||teacher.email||"",role:teacher.role||"teacher",firstName:teacher.firstName||"",lastName:teacher.lastName||"",owner:teacher.owner===true};
    localStorage.setItem("SP_TEACHER_MODE","1");localStorage.setItem("SP_LOGIN_ROLE","teacher");localStorage.setItem("SP_ACTIVE_ROLE","teacher");localStorage.setItem("SP_LOGIN_CONTEXT","teacher");localStorage.setItem("SP_USER_ROLE",profile.role);localStorage.setItem("SP_TEACHER_EMAIL",profile.email);localStorage.setItem("SP_TEACHER_ID",user.uid);localStorage.setItem("SP_TEACHER_UID",user.uid);localStorage.setItem("SP_TEACHER_PROFILE",JSON.stringify(profile));
  }
  function isPending(data={}){const status=norm(data.status);return data.pending===true||data.approved===false||["pending","waiting","requested","beantragt"].includes(status)}
  function isBlocked(data={}){const status=norm(data.status);return data.active===false||data.disabled===true||data.blocked===true||["inactive","disabled","blocked","gesperrt","deaktiviert"].includes(status)}

  window.TeacherAuth={
    OWNER_EMAILS,
    async ensureOwnerDoc(user){
      const email=norm(user.email);if(!OWNER_EMAILS.includes(email))return null;
      const ref=db.collection("teachers").doc(user.uid);
      await ref.set({uid:user.uid,email,emailLower:email,role:"owner",owner:true,active:true,approved:true,status:"approved",school:"SprachPilot",job:"Owner",updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      const snap=await ref.get();return {id:snap.id,...(snap.data()||{})};
    },
    async getApprovedTeacher(user){
      const owner=await this.ensureOwnerDoc(user);if(owner)return owner;
      const approved=await db.collection("teachers").doc(user.uid).get();if(approved.exists)return{id:approved.id,...(approved.data()||{})};
      const pending=await db.collection("teachers_pending").doc(user.uid).get();if(pending.exists)return{pending:true,id:pending.id,...(pending.data()||{})};
      return null;
    },
    async login(){
      const email=norm(el("email")?.value),password=el("password")?.value||"";
      if(!email||!password)return show("Bitte E-Mail und Passwort eingeben.");
      setBusy("loginBtn",true,"Login läuft...","Einloggen");show("Login wird geprüft...","ok");
      try{
        await ensureFirebase();const result=await auth.signInWithEmailAndPassword(email,password),user=result.user;
        if(user.emailVerified!==true){await auth.signOut();clearTeacherMode();show("Bitte bestätige zuerst deine E-Mail-Adresse. Den SprachPilot-Bestätigungslink hast du bei der Registrierung erhalten.");return}
        const teacher=await this.getApprovedTeacher(user);
        if(!teacher){await auth.signOut();clearTeacherMode();show("Für dieses Firebase-Konto liegt keine Lehrerregistrierung vor.");return}
        if(isPending(teacher)){await auth.signOut();clearTeacherMode();show("Dein Lehrerkonto wartet noch auf die Freigabe durch den Owner.");return}
        if(isBlocked(teacher)){await auth.signOut();clearTeacherMode();show("Dieser Lehrerzugang ist deaktiviert.");return}
        setTeacherMode(user,teacher);show("Login erfolgreich.","ok");location.href="index.html";
      }catch(err){show(readableError(err,"Login nicht möglich."))}finally{setBusy("loginBtn",false,"Login läuft...","Einloggen")}
    },
    async register(){
      const firstName=(el("regFirstName")?.value||"").trim(),lastName=(el("regLastName")?.value||"").trim(),email=norm(el("regEmail")?.value),password=el("regPassword")?.value||"",school=(el("regSchool")?.value||"").trim(),job=(el("regJob")?.value||"").trim();
      if(!firstName||!lastName||!email||!password||!school||!job)return show("Bitte alle Felder ausfüllen.");
      if(password.length<6)return show("Das Passwort muss mindestens 6 Zeichen haben.");
      setBusy("regBtn",true,"Registrierung läuft...","Registrieren");show("Registrierung wird erstellt...","ok");
      try{
        await ensureFirebase();const result=await auth.createUserWithEmailAndPassword(email,password),user=result.user;
        if(!OWNER_EMAILS.includes(email)){
          await db.collection("teachers_pending").doc(user.uid).set({uid:user.uid,firstName,lastName,email,emailLower:email,school,job,role:"teacher",approved:false,active:false,status:"pending",requestedAt:firebase.firestore.FieldValue.serverTimestamp(),createdAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        }
        let mailOk=true;
        try{await sendVerificationMail()}catch(mailError){mailOk=false;console.error("Lehrer-Bestätigungsmail fehlgeschlagen",mailError)}
        await auth.signOut();clearTeacherMode();
        if(!mailOk){show("Die Registrierung wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht versendet werden. Bitte versuche später „Bestätigungslink erneut senden“.");return}
        show(OWNER_EMAILS.includes(email)?"Registrierung erstellt. Bitte bestätige deine E-Mail-Adresse und logge dich danach erneut ein.":"Registrierung eingegangen. Bitte bestätige zuerst deine E-Mail-Adresse. Danach wartet dein Konto auf die Freigabe durch den Owner.","ok");
      }catch(err){show(readableError(err,"Registrierung nicht möglich."))}finally{setBusy("regBtn",false,"Registrierung läuft...","Registrieren")}
    },
    async resetPassword(){
      const email=norm(el("resetEmail")?.value);if(!email)return show("Bitte E-Mail eingeben.");
      setBusy("resetBtn",true,"Wird gesendet...","Reset-Link senden");show("Reset-Link wird gesendet...","ok");
      try{await ensureFirebase();await sendPasswordResetMail(email);show("Wenn ein SprachPilot-Konto für diese E-Mail existiert, wurde der Reset-Link versendet.","ok")}catch(err){show(readableError(err,"Reset-Link konnte nicht gesendet werden."))}finally{setBusy("resetBtn",false,"Wird gesendet...","Reset-Link senden")}
    },
    async resendVerification(){
      const email=norm(el("email")?.value),password=el("password")?.value||"";if(!email||!password)return show("Bitte E-Mail und Passwort eingeben.");
      try{
        await ensureFirebase();const result=await auth.signInWithEmailAndPassword(email,password);
        if(result.user.emailVerified)show("Die E-Mail-Adresse ist bereits bestätigt.","ok");
        else{await sendVerificationMail();show("SprachPilot-Bestätigungslink wurde erneut gesendet.","ok")}
        await auth.signOut();
      }catch(err){try{await auth.signOut()}catch(e){}show(readableError(err,"Bestätigungslink konnte nicht gesendet werden."))}
    },
    async logout(){try{clearTeacherMode();if(auth)await auth.signOut()}finally{location.href="login.html"}}
  };
})();
