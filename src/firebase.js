// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJGFLDv9PAWd0ANriJNpSVtef8F7uYUio",
  authDomain: "skillup-27da9.firebaseapp.com",
  databaseURL: "https://skillup-27da9-default-rtdb.firebaseio.com",
  projectId: "skillup-27da9",
  storageBucket: "skillup-27da9.firebasestorage.app",
  messagingSenderId: "758674590842",
  appId: "1:758674590842:web:d1ebd4d6f3e3f6eceabfc3",
  measurementId: "G-ZBN8TN9SKE",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const GoogleAuth = new GoogleAuthProvider();
export const FacebookAuth = new FacebookAuthProvider();
