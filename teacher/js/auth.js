(function(){
  const OWNER_EMAILS = ["studyroomslandstuhl@gmail.com","alicekrekoten@gmail.com","alisa.krekoten@gmail.com"];

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
    try{
      sessionStorage.removeItem("SP_TEACHER_PREVIEW");
      localStorage.removeItem("SP_USER_PROFILE");
      localStorage.removeItem("SP_STUDENT_PROFILE");
      localStorage.removeItem("SP_STUDENT_ID");
    }catch(e){}
    localStorage.setItem("SP_TEACHER_MODE","1");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    localStorage.setItem("SP_USER_ROLE", teacher.role || "teacher");
    localStorage.setItem("SP_TEACHER_EMAIL", user.email || teacher.email || "");
    localStorage.setItem("SP_TEACHER_ID", user.uid);
    localStorage.setItem("SP_TEACHER_PROFILE",JSON.stringify({uid:user.uid,email:user.email||teacher.email||"",role:teacher.role||"teacher",firstName:teacher.firstName||"",lastName:teacher.lastName||""}));
  }

  function clearTeacherMode(){
    ["SP_TEACHER_MODE","SP_USER_ROLE","SP_TEACHER_EMAIL","SP_TEACHER_ID","SP_TEACHER_PROFILE","SP_LOGIN_ROLE","SP_ACTIVE_ROLE","SP_LOGIN_CONTEXT"].forEach(k=>localStorage.removeItem(k));
    try{sessionStorage.removeItem("SP_TEACHER_PREVIEW");}catch(e){}
  }


  function norm(value){ return String(value || "").trim().toLowerCase(); }
  function roleOk(data={}){
    const role=norm(data.role || data.typ || data.type || data.accountType || data.userRole || "teacher");
    return !role || ["owner","admin","teacher","lehrer","lehrerin","superadmin","kursleitung","dozent","dozentin"].includes(role);
  }
  function isPending(data={}){
    const status=norm(data.status || data.state || data.accessStatus || "");
    return data.pending===true || data.approved===false || status==="pending" || status==="wartet" || status==="beantragt" || status==="requested" || status==="waiting" || status==="submitted";
  }
  function isBlocked(data={}){
    const status=norm(data.status || data.state || data.accessStatus || "");
    return data.active===false || data.disabled===true || data.blocked===true || status==="inactive" || status==="disabled" || status==="blocked" || status==="gesperrt" || status==="deaktiviert";
  }
  async function getDocById(collection,id){
    if(!id) return null;
    try{
      const snap=await db.collection(collection).doc(id).get();
      if(snap.exists) return {collection,id:snap.id,docId:snap.id,...(snap.data()||{})};
    }catch(e){}
    return null;
  }
  async function firstByField(collection,field,value){
    if(!field || !value) return null;
    try{
      const snap=await db.collection(collection).where(field,"==",value).limit(1).get();
      if(!snap.empty){
        const doc=snap.docs[0];
        return {collection,id:doc.id,docId:doc.id,...(doc.data()||{})};
      }
    }catch(e){}
    return null;
  }
  async function findTeacherIn(collection,user){
    const email=norm(user.email);
    const uid=user.uid;
    const candidates=[];
    const byId=await getDocById(collection,uid);
    if(byId) candidates.push(byId);
    for(const field of ["uid","userUid","authUid","teacherUid","ownerUid","createdByUid"]){
      const found=await firstByField(collection,field,uid);
      if(found) candidates.push(found);
    }
    for(const field of ["email","emailLower","teacherEmail","teacherEmailLower","mail","loginEmail"]){
      const found=await firstByField(collection,field,email);
      if(found) candidates.push(found);
    }
    const seen=new Set();
    return candidates.find(c=>{
      const key=`${c.collection}:${c.docId||c.id}`;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    }) || null;
  }

  window.TeacherAuth = {
    OWNER_EMAILS,

    async ensureOwnerDoc(user){
      const email=(user.email||"").toLowerCase();
      if(!OWNER_EMAILS.includes(email)) return null;

      const ref=db.collection("teachers").doc(user.uid);
      await ref.set({
        uid:user.uid,
        email,
        emailLower:email,
        firstName:"Alisa",
        lastName:"",
        school:"SprachPilot",
        job:"Owner",
        role:"owner",
        active:true,
        approved:true,
        status:"approved",
        owner:true,
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});

      return (await ref.get()).data();
    },

    async getApprovedTeacher(user){
      const owner = await this.ensureOwnerDoc(user);
      if(owner) return owner;

      const approved=await findTeacherIn("teachers",user);
      if(approved) return approved;

      const pending=await findTeacherIn("teachers_pending",user);
      if(pending) return {pending:true,...pending};

      return null;
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

        if(isPending(teacher)){
          await auth.signOut();
          clearTeacherMode();
          show("Dein Lehrerkonto wartet noch auf Freigabe durch die Administratorin.");
          return;
        }

        if(isBlocked(teacher)){
          await auth.signOut();
          clearTeacherMode();
          show("Dieser Lehrerzugang ist deaktiviert.");
          return;
        }

        if(!roleOk(teacher)){
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
