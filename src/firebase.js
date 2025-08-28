import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyBA9jpAbf3Y1ROdXEhUzwZGw__07kX9gL8",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "skill-up-c45ee.firebaseapp.com",
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    "https://skill-up-c45ee-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "skill-up-c45ee",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "skill-up-c45ee.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "782722579720",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:782722579720:web:4b0de277b01f8faea980bd",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-C0Q73VZ7SH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const GoogleAuth = new GoogleAuthProvider();
export const FacebookAuth = new FacebookAuthProvider();
