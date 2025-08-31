import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  sendEmailVerification,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  deleteUser,
  isSignInWithEmailLink,
} from "firebase/auth";
import { auth, GoogleAuth, FacebookAuth } from "./firebase";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function Logout() {
    return signOut(auth);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function signInWithGoogle() {
    return signInWithPopup(auth, GoogleAuth);
  }

  function signInWithFacebook() {
    return signInWithPopup(auth, FacebookAuth);
  }

  function EmailVerification() {
    return sendEmailVerification(auth.currentUser);
  }

  function sendEmailLink(email) {
    return sendSignInLinkToEmail(auth, email, {
      url: window.location.origin + "/confirm",
      handleCodeInApp: true,
    });
  }

  function deleteUsers() {
    return deleteUser(auth.currentUser);
  }

  function signInWithEmail(email, emailLink) {
    return signInWithEmailLink(auth, email, emailLink);
  }

  function checkSignInWithEmailLink(emailLink) {
    return isSignInWithEmailLink(auth, emailLink);
  }

  function getEmailForSignIn() {
    return localStorage.getItem("emailForSignIn");
  }

  function saveEmailForSignIn(email) {
    localStorage.setItem("emailForSignIn", email);
  }

  function clearEmailForSignIn() {
    localStorage.removeItem("emailForSignIn");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    Logout,
    forgotPassword,
    signInWithGoogle,
    signInWithFacebook,
    EmailVerification,
    sendEmailLink,
    signInWithEmail,
    checkSignInWithEmailLink,
    getEmailForSignIn,
    saveEmailForSignIn,
    clearEmailForSignIn,
    deleteUsers,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
