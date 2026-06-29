import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getFirestore,
  doc as firestoreDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  collection as firestoreCollection,
  query as firestoreQuery,
  where as firestoreWhere,
  getDocs,
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
export const db = getFirestore(app);

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
      if (options) {
        return setDoc(ref, data, options);
      }
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
      return addDoc(firestoreCollection(db, String(path)), data);
    },

    async get() {
      return getDocs(spBuildQuery(path, constraints));
    },

    where(field, operator, value) {
      return spCompatCollection(path, [
        ...constraints,
        firestoreWhere(field, operator, value)
      ]);
    },

    orderBy(field, direction) {
      return spCompatCollection(path, [
        ...constraints,
        firestoreOrderBy(field, direction)
      ]);
    },

    limit(count) {
      return spCompatCollection(path, [
        ...constraints,
        firestoreLimit(count)
      ]);
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
window.db = compatDb;

window.spFirebase = {
  app,
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

window.firebase.initializeApp = function () {
  return app;
};

window.firebase.firestore = function () {
  return compatDb;
};

window.firebase.firestore.FieldValue = {
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
};

window.firebase.firestore.Timestamp = Timestamp;

export {
  firestoreDoc as doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  firestoreCollection as collection,
  firestoreQuery as query,
  firestoreWhere as where,
  getDocs,
  firestoreLimit as limit,
  firestoreOrderBy as orderBy,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  Timestamp
};
