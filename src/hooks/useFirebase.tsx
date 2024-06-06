import { useState, useEffect, useCallback } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import firebase from "../config/firebase";
import { Users } from "../models";
import { useNavigate } from "react-router-dom";

const useFirebase = () => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authInstance = getAuth(firebase);
    setAuth(authInstance);

    const unregister = onAuthStateChanged(authInstance, (loggedInUser) => {
      if (loggedInUser) {
        // User has logged in
        setUser(loggedInUser);
        saveUserToDatabase(loggedInUser);
      } else {
        // User has logged out
        setUser(null);
      }
      // Set loading to false if auth state obtained already
      setIsLoading(false);
    });

    // Clean up function
    return () => unregister();
  }, []);

  /**
   * Sign In with Google function
   */
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
      navigate("/");
      return user;
    } catch (error) {
      throw new Error("Error signing in with Google: " + error.message);
    }
  };

  /**
   * Save User to Realtime DB
   */
  const saveUserToDatabase = (loggedInUser: User) => {
    const database = getDatabase(firebase);
    const usersRef = ref(database, "users");
    console.log("User: " + loggedInUser);

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

  /**
   * Search for emails
   */
  const searchEmails = useCallback(async (email: string): Promise<string[]> => {
    const emailQuery = query(
      ref(getDatabase(firebase), "users"),
      orderByChild("email"),
      startAt(email),
      endAt(email + "\uf8ff")
    );

    const snapshot = await get(emailQuery);
    if (snapshot.exists()) {
      const emails = Object.values(snapshot.val()).map(
        (user: Users[]) => user.email
      );
      return emails as string[];
    } else {
      return [];
    }
  }, []);

  /**
   * Get user authenticated state
   */
  const isAuthenticated = () => {
    // Return true if user is logged in, otherwise it is false
    return !!user;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    signInWithGoogle,
    user,
    isAuthenticated,
    isLoading,
    logout,
    searchEmails,
  };
};

export default useFirebase;
