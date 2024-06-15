import { useState, useEffect, useCallback } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseAuthUser,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  child,
  query,
  equalTo,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import firebase from "../config/firebase";
import { User } from "../models";
import { useNavigate } from "react-router-dom";

const useFirebase = () => {
  const [auth, setAuth] = useState(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authInstance = getAuth(firebase);
    setAuth(authInstance);

    const unregister = onAuthStateChanged(
      authInstance,
      async (loggedInUser) => {
        // User has logged in
        if (loggedInUser) {
          console.log("Logged-in user unregist:", loggedInUser);
          const exists = await checkUserExists(loggedInUser.uid);
          if (exists) {
            // If user exists, fetch user data from the database
            const userData = await getUserData(loggedInUser.uid);
            if (userData) {
              // Set user state
              setUser(userData);
              navigate("/");
            }
          } else {
            // Save user to database
            // saveUserToDatabase(loggedInUser);
            navigate("/user-form");
          }
        } else {
          // User has logged out
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Clean up function
    return () => unregister();
  }, [navigate, auth, user?.username]);

  /**
   * Check if user exists
   */
  const checkUserExists = async (uid: string): Promise<boolean> => {
    const database = getDatabase(firebase);
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val() as User;
      // return userData && userData.username;
      return !!userData;
    }
  };

  /**
   * Check if username exists
   */
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const database = getDatabase(firebase);
    const usernameQuery = query(
      ref(database, "users"),
      orderByChild("username"),
      equalTo(username)
    );
    const snapshot = await get(usernameQuery);
    return snapshot.exists();
  };

  /**
   * Sign In with Google function
   */
  const signInWithGoogle = async () => {
    const authInstance = getAuth(firebase);
    setAuth(authInstance);

    if (!auth) {
      console.error("Firebase authentication instance not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      if (!loggedInUser) {
        throw new Error("No user information found in sign-in result.");
      }

      console.log("Logged-in user:", loggedInUser);

      // Check if user exists and redirect accordingly
      const exists = await checkUserExists(loggedInUser.uid);

      if (exists) {
        // If user exists, fetch user data from the database
        const userData = await getUserData(loggedInUser.uid);
        if (userData) {
          // Set user state
          setUser(userData);
          navigate("/");
        }
      } else {
        // Save user to database
        // saveUserToDatabase(loggedInUser);
        navigate("/user-form");
      }
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

    console.log("Yoo: ", loggedInUser);

    // Assuming you want to save the user with their UID as the key
    set(child(usersRef, loggedInUser.uid), {
      email: loggedInUser.email,
      displayName: loggedInUser.displayName,
      username: loggedInUser.username ?? null,
      chatDisplayName: loggedInUser.chatDisplayName ?? null,
    })
      .then(() => {
        console.log("User data saved to Realtime Database.");
      })
      .catch((error) => {
        console.error("Error saving user data to Realtime Database:", error);
      });
  };

  /**
   * Search for username
   */
  const searchUsername = useCallback(
    async (username: string): Promise<string[]> => {
      const usernameQuery = query(
        ref(getDatabase(firebase), "users"),
        orderByChild("username"),
        startAt(username),
        endAt(username + "\uf8ff")
      );

      const snapshot = await get(usernameQuery);
      if (snapshot.exists()) {
        const usernameData = Object.values(snapshot.val()).map(
          (user: User[]) => user.username
        );
        return usernameData as string[];
      } else {
        return [];
      }
    },
    []
  );

  /**
   * Fetch user data from the database
   */
  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const database = getDatabase(firebase);
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val() as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

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
    saveUserToDatabase,
    isAuthenticated,
    isLoading,
    logout,
    searchUsername,
    checkUsernameExists,
  };
};

export default useFirebase;
