import { useState, useEffect, useCallback } from "react";
import {
  getAuth,
  Auth,
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
import { User, Friend, ChatHeader } from "../models";
import { useNavigate } from "react-router-dom";

const useFirebase = () => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
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
      if (error instanceof Error) {
        throw new Error("Error signing in with Google: " + error.message);
      } else {
        throw new Error("Unexpected error signing in with Google: " + error);
      }
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

      const friendSnapshot = await get(friendsQuery);
      let existsFriendEmails: string[] = [];

      if (friendSnapshot.exists()) {
        const friendData: { [key: string]: Friend } | null = friendSnapshot.val();
        if (friendData) {
          existsFriendEmails = Object.values(friendData).map(
            (friend: Friend) => friend.email
          );
        }
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
        const usersData: { [key: string]: User } | null = snapshot.val();
        if (usersData) {
          const emails = Object.values(usersData).map((user: User) => user.email)
            .filter(
              (email) =>
                email !== user?.email && !existsFriendEmails.includes(email)
            );
          return emails as string[];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    [user]
  );

  /**
   * Add Friend by ID
   */
  const addFriendById = async (friendId: string) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const database = getDatabase(firebase);

    const usersRef = ref(database, "users");
    const userQuery = query(
      usersRef,
      orderByChild("id"),
      equalTo(friendId)
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
      email: friendData.email,
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
   * Add Friend by Email
   */
  const addFriendByEmail = async (friendEmail: string) => {
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

  const isRecipientFriend = async (friendId: string) => {
    if (user && friendId) {
      const database = getDatabase(firebase);
      const friendRef = query(
        ref(database, "friends"),
        orderByChild("userId"),
        equalTo(user.uid)
      );

      const snapshot = await get(friendRef);
      const friendData: { [key: string]: Friend } | null = snapshot.val();
      if (friendData) {
        return Object.values(friendData).some((friend: Friend) => friend.friendUserId === friendId);
      } else {
        return false;
      }

    }
    return false;
  };

  const sendChatMessage = async (friendId: string, message: string, senderHeaderId: string, recipientHeaderId: string) => {
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
      senderHeaderId,
      recipientHeaderId
    };

    try {
      await set(newChatRef, newMessage);
      console.log("Message sent.");
    } catch (error) {
      console.error("Error sending message to the database:", error);
    }
  };

  const getChatHeaderId = async (friendId: string) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const database = getDatabase(firebase);

    const combinedId1 = `${user.uid}_${friendId}`;
    const combinedId2 = `${friendId}_${user.uid}`;

    const chatHeaderRef1 = query(
      ref(database, "chat_headers"),
      orderByChild("combinedId"),
      equalTo(combinedId1)
    );

    const chatHeaderRef2 = query(
      ref(database, "chat_headers"),
      orderByChild("combinedId"),
      equalTo(combinedId2)
    );

    const snapshot1 = await get(chatHeaderRef1);
    const snapshot2 = await get(chatHeaderRef2);

    let existingHeader: ChatHeader | null = null;

    if (snapshot1.exists()) {
      existingHeader = Object.values<ChatHeader>(snapshot1.val())[0];
    } else if (snapshot2.exists()) {
      existingHeader = Object.values<ChatHeader>(snapshot2.val())[0];
    }

    if (existingHeader) {
      return existingHeader.id;
    } else {
      return;
    }
  }

  const createUpdateChatHeader = async (
    userId: string,
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
      equalTo(`${userId}_${friendId}`)
    );

    // Limit to 1 result
    const snapshot = await get(existingHeaderRef);
    if (snapshot.exists()) {
      // If chat header already exists, update it with the new message
      const existingHeader = Object.values<ChatHeader>(snapshot.val())[0];
      await update(ref(database, `chat_headers/${existingHeader.id}`), {
        lastMessage: message,
        timestamp: new Date().toISOString(),
      });
      return existingHeader.id;
    }

    // New chat header
    const newHeaderRef = push(ref(database, "chat_headers"));
    const newChatHeader = {
      id: newHeaderRef.key,
      senderId: userId,
      recipientId: friendId,
      combinedId: `${userId}_${friendId}`,
      recipientName: friendName,
      lastMessage: message,
      timestamp: new Date().toISOString(),
    };

    try {
      await set(newHeaderRef, newChatHeader);
      return newHeaderRef.key;
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
      if (auth) {
        await signOut(auth);
      } else {
        console.error("Error signing out: 'auth' is null");
      }
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
    addFriendById,
    addFriendByEmail,
    getFriends,
    isRecipientFriend,
    sendChatMessage,
    getChatHeaderId,
    createUpdateChatHeader,
  };
};

export default useFirebase;
