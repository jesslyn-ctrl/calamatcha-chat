import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { getDatabase, ref, set, child } from "firebase/database";
import firebase from "../config/firebase";

const useFirebase = () => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authInstance = getAuth(firebase);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (loggedInUser) => {
      if (loggedInUser) {
        // User has logged in
        setUser(loggedInUser);
        saveUserToDatabase(loggedInUser);
      } else {
        // User has logged out
        setUser(null);
      }
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error("Firebase authentication instance not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Update user state
      setUser(user);
      // Save user to database
      saveUserToDatabase(user);
      return user;
    } catch (error) {
      throw new Error("Error signing in with Google: " + error.message);
    }
  };

  const saveUserToDatabase = (loggedInUser: User) => {
    const database = getDatabase(firebase);
    const usersRef = ref(database, "users");

    // Assuming you want to save the user with their UID as the key
    set(child(usersRef, loggedInUser.uid), {
      email: loggedInUser.email,
      displayName: loggedInUser.displayName,
    })
      .then(() => {
        console.log("User data saved to Realtime Database.");
      })
      .catch((error) => {
        console.error("Error saving user data to Realtime Database:", error);
      });
  };

  return { signInWithGoogle, user };
};

export default useFirebase;
