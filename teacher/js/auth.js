const TeacherAuth = {

  async login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    try{

      const result = await auth.signInWithEmailAndPassword(
        email,
        password
      );

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
      msg.innerHTML = err.message;
    }
  },

  async logout(){
    await auth.signOut();
    location.href = "login.html";
  }
};
