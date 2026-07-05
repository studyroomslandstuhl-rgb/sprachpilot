import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc as firestoreDoc,
  getDoc as firestoreGetDoc,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  addDoc as firestoreAddDoc,
  serverTimestamp,
  collection as firestoreCollection,
  query as firestoreQuery,
  where as firestoreWhere,
  getDocs as firestoreGetDocs,
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
export const authReady = new Promise(resolve=>{
  const stop=onAuthStateChanged(auth,user=>{if(user){try{stop()}catch(e){}resolve(user)}});
});
signInAnonymously(auth).catch(e=>console.warn("Firebase Anonymous Auth konnte nicht gestartet werden",e));

export async function getDoc(...args){await authReady;return firestoreGetDoc(...args)}
export async function setDoc(...args){await authReady;return firestoreSetDoc(...args)}
export async function updateDoc(...args){await authReady;return firestoreUpdateDoc(...args)}
export async function deleteDoc(...args){await authReady;return firestoreDeleteDoc(...args)}
export async function addDoc(...args){await authReady;return firestoreAddDoc(...args)}
export async function getDocs(...args){await authReady;return firestoreGetDocs(...args)}

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

    async get() {
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
      await authReady;
      return firestoreAddDoc(firestoreCollection(db, String(path)), data);
    },

    async get() {
      await authReady;
      return firestoreGetDocs(spBuildQuery(path, constraints));
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
window.db = compatDb;

window.spFirebase = {
  app,
  auth,
  authReady,
  db,
  compatDb,
  doc: firestoreDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  collection: firestoreCollection,
  query: firestoreQuery,
  where: firestoreWhere,
  getDocs,
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