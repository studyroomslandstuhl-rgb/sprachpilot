(function(){
  const OWNER_EMAILS = ["studyroomslandstuhl@gmail.com"];

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
      return "Firebase-Regeln blockieren den Zugriff. Bitte Firestore-Regeln prüfen.";
    }
    return fallback || (err.message || "Unbekannter Fehler.");
  }

  async function ensureFirebase(){
    if(!window.TeacherFirebaseReady || !window.auth || !window.db){
      const err=window.TeacherFirebaseError ? window.TeacherFirebaseError.message : "Firebase ist nicht verbunden.";
      throw new Error(err);
    }
  }

  function setTeacherMode(user, teacher){
    localStorage.setItem("SP_TEACHER_MODE","1");
    localStorage.setItem("SP_USER_ROLE", teacher.role || "teacher");
    localStorage.setItem("SP_TEACHER_EMAIL", user.email || teacher.email || "");
    localStorage.setItem("SP_TEACHER_ID", user.uid);
  }

  function clearTeacherMode(){
    localStorage.removeItem("SP_TEACHER_MODE");
    localStorage.removeItem("SP_USER_ROLE");
    localStorage.removeItem("SP_TEACHER_EMAIL");
    localStorage.removeItem("SP_TEACHER_ID");
  }

  window.TeacherAuth = {
    OWNER_EMAILS,

    async ensureOwnerDoc(user){
      const email=(user.email||"").toLowerCase();
      if(!OWNER_EMAILS.includes(email)) return null;

      const ref=db.collection("teachers").doc(user.uid);
      await ref.set({
        email,
        firstName:"Alisa",
        lastName:"",
        school:"SprachPilot",
        job:"Owner",
        role:"owner",
        active:true,
        approved:true,
        owner:true,
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});

      return (await ref.get()).data();
    },

    async getApprovedTeacher(user){
      const owner = await this.ensureOwnerDoc(user);
      if(owner) return owner;

      const pending=await db.collection("teachers_pending").doc(user.uid).get();
      if(pending.exists){
        return {pending:true,...pending.data()};
      }

      const approved=await db.collection("teachers").doc(user.uid).get();
      if(!approved.exists) return null;

      return approved.data();
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
        const teacher=await this.getApprovedTeacher(user);

        if(!teacher){
          await auth.signOut();
          clearTeacherMode();
          show("Dieser Account ist noch nicht als Lehrer registriert. Bitte zuerst registrieren.");
          return;
        }

        if(teacher.pending || teacher.approved===false){
          await auth.signOut();
          clearTeacherMode();
          show("Dein Lehrerkonto wartet noch auf Freigabe durch die Administratorin.");
          return;
        }

        if(teacher.active===false){
          await auth.signOut();
          clearTeacherMode();
          show("Dieser Lehrerzugang ist deaktiviert.");
          return;
        }

        if(!["owner","admin","teacher"].includes(teacher.role)){
          await auth.signOut();
          clearTeacherMode();
          show("Dieser Account hat keine gültige Lehrerrolle.");
          return;
        }

        setTeacherMode(user, teacher);
        show("Login erfolgreich. Dashboard wird geöffnet...","ok");
        setTimeout(()=>location.href="index.html",500);

      }catch(err){
        show(readableError(err,"Login nicht möglich."));
      }finally{
        setBusy("loginBtn",false,"Login läuft...","Einloggen");
      }
    },

    async register(){
      const firstName=(el("regFirstName")?.value || "").trim();
      const lastName=(el("regLastName")?.value || "").trim();
      const email=el("regEmail").value.trim().toLowerCase();
      const password=el("regPassword").value;
      const school=el("regSchool").value.trim();
      const job=el("regJob").value.trim();

      if(!firstName || !lastName || !email || !password || !school || !job){
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

        const ownerAutoApprove=OWNER_EMAILS.includes(email);
        if(ownerAutoApprove){
          await db.collection("teachers").doc(user.uid).set({
            firstName,lastName,email,school,job,
            role:"owner",
            owner:true,
            active:true,
            approved:true,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt:firebase.firestore.FieldValue.serverTimestamp()
          }, {merge:true});
          show("Owner-Registrierung erfolgreich. Dashboard wird geöffnet...","ok");
          setTeacherMode(user,{email,role:"owner"});
          setTimeout(()=>location.href="index.html",800);
          return;
        }

        await db.collection("teachers_pending").doc(user.uid).set({
          firstName,lastName,email,school,job,
          role:"teacher",
          approved:false,
          active:false,
          requestedAt:firebase.firestore.FieldValue.serverTimestamp(),
          createdAt:firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});

        await auth.signOut();
        clearTeacherMode();
        show("Registrierung eingegangen. Bitte warte auf Freigabe durch die Administratorin.","ok");

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
        clearTeacherMode();
        if(auth) await auth.signOut();
      }finally{
        location.href="login.html";
      }
    }
  };
})();
