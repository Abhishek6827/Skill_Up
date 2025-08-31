import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./firebase"; // Make sure `firebase.js` exports initialized `db`

// Create context
export const FirestoreContext = createContext();

// Custom hook to use the context
export function useFirestore() {
  return useContext(FirestoreContext);
}

// Firestore Provider
export const FirestoreProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Example: Creating a new user document
  async function createUserData() {
    try {
      await setDoc(doc(db, "users", "user_id"), {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date(),
      });
      console.log("User data created successfully.");
    } catch (error) {
      console.error("Error creating user data:", error);
    }
  }

  useEffect(() => {
    // Simulate initial loading for demo purposes
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const value = {
    createUserData,
    userDataReference: collection(db, "users"), // optional: expose for querying
  };

  return (
    <FirestoreContext.Provider value={value}>
      {!loading && children}
    </FirestoreContext.Provider>
  );
};
