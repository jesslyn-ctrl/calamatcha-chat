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
  child,
  query,
  update,
  equalTo,
  push,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import firebase from "../config/firebase";
import { User, Friend } from "../models";
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
  const saveUserToDatabase = (loggedInUser: FirebaseAuthUser) => {
    const database = getDatabase(firebase);
    const usersRef = ref(database, "users");

    // Assuming you want to save the user with their UID as the key
    set(child(usersRef, loggedInUser.uid), {
      id: loggedInUser.uid,
      email: loggedInUser.email,
      displayName: loggedInUser.displayName,
      timestamp: new Date().toISOString(),
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
  const searchEmails = useCallback(
    async (email: string): Promise<string[]> => {
      if (!user) {
        return [];
      }

      const database = getDatabase(firebase);

      // Fetch existing friends for the loggedIn user
      const friendsQuery = query(
        ref(database, "friends"),
        orderByChild("userId"),
        equalTo(user.uid)
      );

      const friendsSnapshot = await get(friendsQuery);
      let existsFriendEmails: string[] = [];

      if (friendsSnapshot.exists()) {
        existsFriendEmails = Object.values(friendsSnapshot.val()).map(
          (friend: Friend) => friend.email
        );
      }

      // Fetch users whose emails match the query
      const emailQuery = query(
        ref(database, "users"),
        orderByChild("email"),
        startAt(email),
        endAt(email + "\uf8ff")
      );

      const snapshot = await get(emailQuery);
      if (snapshot.exists()) {
        const emails = Object.values(snapshot.val())
          .map((user: User[]) => user.email)
          .filter(
            (email) =>
              email !== user?.email && !existsFriendEmails.includes(email)
          );
        return emails as string[];
      } else {
        return [];
      }
    },
    [user]
  );

  /**
   * Add Friend
   */
  const addFriend = async (friendEmail: string) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const database = getDatabase(firebase);

    const usersRef = ref(database, "users");
    const userQuery = query(
      usersRef,
      orderByChild("email"),
      equalTo(friendEmail)
    );
    const userSnapshot = await get(userQuery);

    if (!userSnapshot.exists()) {
      throw new Error("User does not exist.");
    }

    const friendData = Object.values(userSnapshot.val())[0] as User;
    const friendRef = ref(database, "friends");
    const newFriendRef = push(friendRef);

    const newFriend = {
      id: newFriendRef.key,
      name: friendData.displayName,
      email: friendEmail,
      friendUserId: friendData.id,
      userId: user.uid,
      timestamp: new Date().toISOString(),
    };

    try {
      await set(newFriendRef, newFriend);
      console.log("Friend added to the database.");
    } catch (error) {
      console.error("Error adding friend to the database:", error);
    }
  };

  /**
   * Fetch Friend List
   */
  const getFriends = useCallback(async (): Promise<Friend[]> => {
    if (!user) {
      return [];
    }

    const database = getDatabase(firebase);
    const friendRef = query(
      ref(database, "friends"),
      orderByChild("userId"),
      equalTo(user.uid)
    );
    const snapshot = await get(friendRef);

    if (snapshot.exists()) {
      const friendData = snapshot.val();
      const friends: Friend[] = Object.values(friendData);
      return friends;
    } else {
      return [];
    }
  }, [user]);

  const sendChatMessage = async (friendId: string, message: string) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    if (!message) {
      return;
    }

    const database = getDatabase(firebase);
    const chatRef = ref(database, "chats");
    const newChatRef = push(chatRef);

    const newMessage = {
      id: newChatRef.key,
      senderId: user.uid,
      recipientId: friendId,
      message,
      isRead: false,
      sentAt: new Date().toISOString(),
    };

    try {
      await set(newChatRef, newMessage);
      console.log("Message sent.");
    } catch (error) {
      console.error("Error sending message to the database:", error);
    }
  };

  const createUpdateChatHeader = async (
    friendId: string,
    friendName: string,
    message: string
  ) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    if (!message) {
      return;
    }

    const database = getDatabase(firebase);

    const existingHeaderRef = query(
      ref(database, "chat_headers"),
      orderByChild("combinedId"),
      equalTo(`${user.uid}_${friendId}`)
    );

    // Limit to 1 result
    const snapshot = await get(existingHeaderRef, { single: true });
    if (snapshot.exists()) {
      // If chat header already exists, update it with the new message
      const existingHeader = Object.values(snapshot.val())[0];
      await update(ref(database, `chat_headers/${existingHeader.id}`), {
        lastMessage: message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // New chat header
    const newHeaderRef = push(ref(database, "chat_headers"));
    const newChatHeader = {
      id: newHeaderRef.key,
      senderId: user.uid,
      recipientId: friendId,
      combinedId: `${user.uid}_${friendId}`,
      recipientName: friendName,
      lastMessage: message,
      timestamp: new Date().toISOString(),
    };

    try {
      await set(newHeaderRef, newChatHeader);
    } catch (error) {
      console.error("Error sending message header to the database:", error);
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
    isAuthenticated,
    isLoading,
    logout,
    searchEmails,
    addFriend,
    getFriends,
    sendChatMessage,
    createUpdateChatHeader,
  };
};

export default useFirebase;
