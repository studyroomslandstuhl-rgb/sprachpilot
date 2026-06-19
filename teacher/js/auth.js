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
      const uid = result.user.uid;

      const teacherDoc = await db
        .collection("teachers")
        .doc(uid)
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
