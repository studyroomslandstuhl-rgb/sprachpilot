const TeacherAuth = {

  message(text,type="no"){
    const msg=document.getElementById("loginMsg");
    if(msg) msg.innerHTML=`<div class="${type}">${text}</div>`;
  },

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
      await ref.set({
        email:user.email || snap.data().email || "",
        role:snap.data().role || "teacher",
        active:snap.data().active !== false,
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
    }

    return (await ref.get()).data();
  },

  async login(){

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    this.message("");

    if(!email || !password){
      this.message("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    if(!auth || !db){
      this.message("Firebase ist nicht verbunden. Bitte teacher/js/firebase.js prüfen.");
      return;
    }

    try{
      this.message("Login wird geprüft...","ok");

      const result = await auth.signInWithEmailAndPassword(email,password);
      const user = result.user;

      const teacher = await this.ensureTeacherDoc(user,{email});

      if(teacher.role !== "teacher" || teacher.active === false){
        await auth.signOut();
        this.message("Lehrerzugang ist nicht aktiv.");
        return;
      }

      location.href = "index.html";

    }catch(err){
      console.error(err);
      this.message("E-Mail oder Passwort ist falsch. Bitte prüfen und noch einmal versuchen.");
    }
  },

  async register(){

    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const school = document.getElementById("regSchool").value.trim();
    const job = document.getElementById("regJob").value.trim();

    this.message("");

    if(!email || !password || !school || !job){
      this.message("Bitte alle Felder ausfüllen.");
      return;
    }

    if(password.length < 6){
      this.message("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    if(!auth || !db){
      this.message("Firebase ist nicht verbunden. Bitte teacher/js/firebase.js prüfen.");
      return;
    }

    try{
      this.message("Registrierung wird erstellt...","ok");

      const result = await auth.createUserWithEmailAndPassword(email,password);
      const user = result.user;

      await this.ensureTeacherDoc(user,{email,school,job});

      this.message("Registrierung erfolgreich. Du wirst eingeloggt...","ok");
      setTimeout(()=>location.href="index.html",700);

    }catch(err){
      console.error(err);
      if(err.code==="auth/email-already-in-use"){
        this.message("Diese E-Mail ist schon registriert. Bitte einloggen.");
      }else{
        this.message("Registrierung nicht möglich: "+(err.message||"Unbekannter Fehler"));
      }
    }
  },

  async resetPassword(){

    const email = document.getElementById("resetEmail").value.trim().toLowerCase();

    this.message("");

    if(!email){
      this.message("Bitte E-Mail eingeben.");
      return;
    }

    try{
      await auth.sendPasswordResetEmail(email);
      this.message("Reset-Link wurde an deine E-Mail gesendet.","ok");
    }catch(err){
      console.error(err);
      this.message("Reset-Link konnte nicht gesendet werden.");
    }
  },

  async logout(){
    if(auth) await auth.signOut();
    location.href = "login.html";
  }

};
