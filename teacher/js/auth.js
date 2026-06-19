const TeacherAuth = {

  async login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(!email || !password){
      msg.innerHTML = "<div class='no'>Bitte E-Mail und Passwort eingeben.</div>";
      return;
    }

    try{

      const result = await auth.signInWithEmailAndPassword(email,password);
      const user = result.user;

      if(!user.emailVerified){
        await user.sendEmailVerification();
        await auth.signOut();

        msg.innerHTML =
          "<div class='no'>Bitte bestätige zuerst deine E-Mail. Wir haben dir den Link noch einmal geschickt.</div>";

        return;
      }

      const teacherDoc = await db
        .collection("teachers")
        .doc(user.uid)
        .get();

      if(!teacherDoc.exists){
        await auth.signOut();
        throw new Error("Dieser Account ist kein Lehrer.");
      }

      const teacher = teacherDoc.data();

      if(teacher.role !== "teacher" || teacher.active !== true){
        await auth.signOut();
        throw new Error("Lehrerzugang nicht aktiv.");
      }

      location.href = "index.html";

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async register(){

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const school = document.getElementById("regSchool").value.trim();
    const job = document.getElementById("regJob").value.trim();
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(!email || !password || !school || !job){
      msg.innerHTML = "<div class='no'>Bitte alle Felder ausfüllen.</div>";
      return;
    }

    try{

      const result = await auth.createUserWithEmailAndPassword(email,password);
      const user = result.user;

      await db
        .collection("teachers")
        .doc(user.uid)
        .set({
          email,
          school,
          job,
          role:"teacher",
          active:true,
          emailVerified:false,
          createdAt:firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        });

      await user.sendEmailVerification();

      msg.innerHTML =
        "<div class='ok'>Registrierung erfolgreich. Bitte bestätige deine E-Mail über den Link, den wir dir geschickt haben.</div>";

      await auth.signOut();

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async resetPassword(){

    const email = document.getElementById("resetEmail").value.trim();
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(!email){
      msg.innerHTML = "<div class='no'>Bitte E-Mail eingeben.</div>";
      return;
    }

    try{

      await auth.sendPasswordResetEmail(email);

      msg.innerHTML =
        "<div class='ok'>Reset-Link wurde an deine E-Mail gesendet.</div>";

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async logout(){

    await auth.signOut();
    location.href = "login.html";

  }

};
      location.href = "index.html";

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async register(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(!email || !password){
      msg.innerHTML = "<div class='no'>Bitte E-Mail und Passwort eingeben.</div>";
      return;
    }

    try{

      const result = await auth.createUserWithEmailAndPassword(email,password);
      const uid = result.user.uid;

      await db
        .collection("teachers")
        .doc(uid)
        .set({
          email: email,
          role: "teacher",
          active: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      msg.innerHTML = "<div class='ok'>Registrierung erfolgreich. Du kannst dich jetzt einloggen.</div>";

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async resetPassword(){

    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(!email){
      msg.innerHTML = "<div class='no'>Bitte E-Mail eingeben.</div>";
      return;
    }

    try{

      await auth.sendPasswordResetEmail(email);

      msg.innerHTML = "<div class='ok'>Reset-Link wurde gesendet.</div>";

    }catch(err){
      msg.innerHTML = "<div class='no'>" + err.message + "</div>";
    }
  },

  async logout(){

    await auth.signOut();
    location.href = "login.html";

  }

};
