const Releases = {
  async setCourseValue(course, group, key, value){
    if(!db || !course || !group || !key) return;
    await db.collection("courses").doc(course).set({
      [group]: { [key]: value },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge:true });
  },
  async toggleModule(course, moduleName, value){
    return this.setCourseValue(course, "enabledModules", moduleName, value);
  },
  async toggleLesson(course, lesson, value){
    return this.setCourseValue(course, "enabledLessons", lesson, value);
  },
  async toggleTask(course, task, value){
    return this.setCourseValue(course, "enabledTasks", task, value);
  },
  async toggleWord(course, word, value){
    return this.setCourseValue(course, "enabledWords", word, value);
  }
};
