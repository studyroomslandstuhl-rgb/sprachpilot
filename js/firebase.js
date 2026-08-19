import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc as firestoreDoc,
  getDoc as firestoreGetDoc,
  getDocFromServer as firestoreGetDocFromServer,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  addDoc as firestoreAddDoc,
  serverTimestamp,
  collection as firestoreCollection,
  query as firestoreQuery,
  where as firestoreWhere,
  getDocs as firestoreGetDocs,
  getDocsFromServer as firestoreGetDocsFromServer,
  limit as firestoreLimit,
  orderBy as firestoreOrderBy,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468",
  authDomain: "sprachpilot-12c68.firebaseapp.com",
  projectId: "sprachpilot-12c68",
  storageBucket: "sprachpilot-12c68.firebasestorage.app",
  messagingSenderId: "454992284519",
  appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2",
  measurementId: "G-2XXR3FSY89"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const IS_TEACHER_PATH=/^\/teacher(?:\/|$)/i.test(location.pathname||"");
let signInFlight=null;
let initialStateSettled=false;
const initialAuthState=new Promise(resolve=>{
  let stop=null;
  const finish=user=>{
    if(initialStateSettled)return;
    initialStateSettled=true;
    try{if(stop)stop()}catch(e){}
    resolve(user||auth.currentUser||null);
  };
  try{
    stop=onAuthStateChanged(auth,user=>finish(user||null),error=>{
      console.warn("Firebase Auth State konnte nicht gelesen werden",error);
      finish(auth.currentUser||null);
    });
  }catch(error){
    console.warn("Firebase Auth State Start fehlgeschlagen",error);
    finish(auth.currentUser||null);
  }
  setTimeout(()=>finish(auth.currentUser||null),5000);
});

async function ensureAuth(){
  if(auth.currentUser)return auth.currentUser;
  try{await initialAuthState}catch(e){}
  if(auth.currentUser)return auth.currentUser;
  if(IS_TEACHER_PATH)return null;
  if(!signInFlight){
    signInFlight=signInAnonymously(auth).then(cred=>{
      try{window.SP_FIREBASE_AUTH_MODE="anonymous";delete window.SP_FIREBASE_AUTH_ERROR}catch(e){}
      return cred?.user||auth.currentUser||null;
    }).catch(error=>{
      try{window.SP_FIREBASE_AUTH_MODE="none";window.SP_FIREBASE_AUTH_ERROR=error?.message||String(error)}catch(e){}
      console.warn("Firebase Anonymous Auth konnte nicht hergestellt werden",error);
      throw error;
    }).finally(()=>{signInFlight=null});
  }
  return signInFlight;
}

export const authReady=ensureAuth();

async function waitAuthRequired(){
  const user=await ensureAuth();
  if(!user&&!IS_TEACHER_PATH){
    const error=new Error("Firebase-Anmeldung ist nicht bereit. Die Synchronisierung wird später erneut versucht.");
    error.code="sp/auth-not-ready";
    throw error;
  }
  return user;
}

export async function getDoc(...args){await waitAuthRequired();return firestoreGetDoc(...args)}
export async function getDocFromServer(...args){await waitAuthRequired();return firestoreGetDocFromServer(...args)}
export async function setDoc(...args){await waitAuthRequired();return firestoreSetDoc(...args)}
export async function updateDoc(...args){await waitAuthRequired();return firestoreUpdateDoc(...args)}
export async function deleteDoc(...args){await waitAuthRequired();return firestoreDeleteDoc(...args)}
export async function addDoc(...args){await waitAuthRequired();return firestoreAddDoc(...args)}
export async function getDocs(...args){await waitAuthRequired();return firestoreGetDocs(...args)}
export async function getDocsFromServer(...args){await waitAuthRequired();return firestoreGetDocsFromServer(...args)}

function spBuildQuery(path, constraints = []) {
  const ref = firestoreCollection(db, String(path));
  return constraints.length ? firestoreQuery(ref, ...constraints) : ref;
}

function spCompatDoc(path, id) {
  const ref = id === undefined || id === null || id === ""
    ? firestoreDoc(firestoreCollection(db, String(path)))
    : firestoreDoc(db, String(path), String(id));

  return {
    id: ref.id,
    ref,
    _ref: ref,

    async get(options={}) {
      if(options?.source==="server")return getDocFromServer(ref);
      return getDoc(ref);
    },

    async set(data, options) {
      if (options) return setDoc(ref, data, options);
      return setDoc(ref, data);
    },

    async update(data) {
      return updateDoc(ref, data);
    },

    async delete() {
      return deleteDoc(ref);
    },

    collection(subPath) {
      return spCompatCollection(`${String(path)}/${ref.id}/${String(subPath)}`);
    }
  };
}

function spCompatCollection(path, constraints = []) {
  return {
    path: String(path),
    _path: String(path),

    doc(id) {
      return spCompatDoc(path, id);
    },

    async add(data) {
      await waitAuthRequired();
      return firestoreAddDoc(firestoreCollection(db, String(path)), data);
    },

    async get(options={}) {
      await waitAuthRequired();
      const ref=spBuildQuery(path, constraints);
      if(options?.source==="server")return firestoreGetDocsFromServer(ref);
      return firestoreGetDocs(ref);
    },

    where(field, operator, value) {
      return spCompatCollection(path, [...constraints, firestoreWhere(field, operator, value)]);
    },

    orderBy(field, direction) {
      return spCompatCollection(path, [...constraints, firestoreOrderBy(field, direction)]);
    },

    limit(count) {
      return spCompatCollection(path, [...constraints, firestoreLimit(count)]);
    },

    onSnapshot(next, error) {
      return onSnapshot(spBuildQuery(path, constraints), next, error);
    }
  };
}

const compatDb = {
  collection(path) {
    return spCompatCollection(path);
  }
};

window.spDb = db;
window.spAuth = auth;
window.spAuthReady = authReady;
window.spEnsureFirebaseAuth = ensureAuth;
window.db = compatDb;

window.spFirebase = {
  app,
  auth,
  authReady,
  ensureAuth,
  db,
  compatDb,
  doc: firestoreDoc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  collection: firestoreCollection,
  query: firestoreQuery,
  where: firestoreWhere,
  getDocs,
  getDocsFromServer,
  limit: firestoreLimit,
  orderBy: firestoreOrderBy,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  Timestamp
};

window.SP_FIREBASE = window.spFirebase;
window.firebase = window.firebase || {};
window.firebase.apps = window.firebase.apps || [app];
window.firebase.initializeApp = function () { return app; };
window.firebase.firestore = function () { return compatDb; };
window.firebase.firestore.FieldValue = { serverTimestamp, arrayUnion, arrayRemove, increment };
window.firebase.firestore.Timestamp = Timestamp;
window.firebase.auth = function(){ return auth; };

export {
  firestoreDoc as doc,
  serverTimestamp,
  firestoreCollection as collection,
  firestoreQuery as query,
  firestoreWhere as where,
  firestoreLimit as limit,
  firestoreOrderBy as orderBy,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  Timestamp
};