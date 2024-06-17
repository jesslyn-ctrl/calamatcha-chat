import React, { useState, useEffect } from "react";
import useFirebase from "../hooks/useFirebase";
import {
  getDatabase,
  ref,
  query,
  onValue,
  orderByChild,
  equalTo,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
import {
  ChatList,
  FriendChatList,
  ChatForm,
  AddFriendPopup,
} from "../components";
import firebase from "../config/firebase";
import { Friend, ChatHeader } from "../models";

const ChatHome: React.FC = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "chats" | "friends" | "profile"
  >("chats");

  // Add Friend Popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch Friends
  const [friends, setFriends] = useState<Friend[]>([]);
  useEffect(() => {
    if (user) {
      const database = getDatabase(firebase);
      const friendRef = query(
        ref(database, "friends"),
        orderByChild("userId"),
        equalTo(user.uid)
      );

      onValue(friendRef, async (snapshot) => {
        const friendData = snapshot.val();
        if (friendData) {
          const friendList = Object.keys(friendData).map((key) => ({
            id: key,
            ...friendData[key],
          }));

          setFriends(friendList);
        }
      });
    }
  }, [user]);

  // Manage recipient state for ChatForm
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Fetch Chats
  const [chats, setChats] = useState<ChatHeader[]>([]);
  useEffect(() => {
    if (user) {
      const database = getDatabase(firebase);

      const chatRef = query(
        ref(database, "chat_headers"),
        orderByChild("senderId"),
        equalTo(user.uid)
      );

      onValue(chatRef, async (snapshot) => {
        const chatData = snapshot.val();
        if (chatData) {
          const chatList = Object.keys(chatData).map((key) => ({
            id: key,
            ...chatData[key],
          }));

          setChats(chatList);
        }
      });
    }
  }, [user]);

  const [selectedChat, setSelectedChat] = useState<ChatHeader | null>(null);

  // Handle switching between selectedFriend and selectedChat
  useEffect(() => {
    // If selectedChat is present, prio set selectedChat
    if (selectedChat) {
      setSelectedFriend(null);
    }
  }, [selectedChat]);

  useEffect(() => {
    // If selectedFriend is present and selectedChat is null, prio set selectedFriend
    if (selectedFriend) {
      setSelectedChat(null);
    }
  }, [selectedFriend]);

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing out:", error.message);
      } else {
        console.error("Unexpected error signing out:", error);
      }
    }
  };

  return (
    <section className="h-screen flex">
      {/* Left side */}
      <div className="w-1/2 h-full p-2 border-r flex flex-col">
        {/* Tabs */}
        <div className="bg-white py-2 px-4 z-10">
          {/* Chat Tab */}
          <button
            onClick={() => setActiveTab("chats")}
            className={`mr-2 py-2 px-4 rounded-md ${
              activeTab === "chats"
                ? "bg-green-400 hover:bg-green-500 text-white"
                : "bg-slate-400 hover:bg-slate-500 text-gray-700 hover:text-white"
            }`}
          >
            <span className="flex items-center font-semibold">
              <img
                width="28"
                height="28"
                src="/assets/images/icons/chat-white-48.png"
                alt="chat"
                className="pr-2"
              />
              Chats
            </span>
          </button>

          {/* Friends Tab */}
          <button
            onClick={() => setActiveTab("friends")}
            className={`mr-2 py-2 px-4 rounded-md ${
              activeTab === "friends"
                ? "bg-red-400 hover:bg-red-500 text-white"
                : "bg-slate-400 hover:bg-slate-500 text-gray-700 hover:text-white"
            }`}
          >
            <span className="flex items-center font-semibold">
              <img
                width="30"
                height="30"
                src="/assets/images/icons/group-white-48.png"
                alt="friend"
                className="pr-2"
              />
              Friends
            </span>
          </button>

          {/* Group Tab */}
          {/* <button
            onClick={() => setActiveTab("groups")}
            className={`mr-2 py-2 px-4 rounded-md ${
              activeTab === "groups"
                ? "bg-red-400 hover:bg-red-500 text-white"
                : "bg-slate-400 hover:bg-slate-500 text-gray-700 hover:text-white"
            }`}
          >
            <span className="flex items-center font-semibold">
              <img
                width="30"
                height="30"
                src="/assets/images/icons/group-white-48.png"
                alt="group"
                className="pr-2"
              />
              Groups
            </span>
          </button> */}

          {/* Profile Tab */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-4 rounded-md ${
              activeTab === "profile"
                ? "bg-blue-400 hover:bg-blue-500 text-white"
                : "bg-slate-400 hover:bg-slate-500 text-gray-700 hover:text-white"
            }`}
          >
            <span className="flex items-center font-semibold">
              <img
                width="30"
                height="30"
                src="/assets/images/icons/profile-white-64.png"
                alt="group"
                className="pr-2"
              />
              Profile
            </span>
          </button>
        </div>

        {/* Chat, Friends or Group List */}
        <div className="flex-grow overflow-y-auto py-2 px-4">
          {activeTab === "chats" ? (
            <ChatList chats={chats} onChatClick={(chatHeader: ChatHeader) => {
              setSelectedChat(chatHeader);
            }} selectedChat={selectedChat || undefined} />
          ) : activeTab === "friends" ? (
            <div>
              <button
                className="py-2 px-4 mb-4 rounded-md font-semibold bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setIsPopupOpen(true)}
              >
                <span className="flex items-center font-semibold">
                  <img
                    width="32"
                    height="32"
                    src="/assets/images/icons/add-friend-colored-100.png"
                    alt="add-friend"
                    className="pr-2"
                  />
                  Add Friend
                </span>
              </button>
              <AddFriendPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
              />
              <FriendChatList
                friendChats={friends}
                onFriendClick={(friend: Friend) => {
                  setSelectedFriend(friend);
                }}
                selectedFriend={selectedFriend || undefined}
              />
            </div>
          )
          // : activeTab === "groups" ? (
          //   <GroupChatList groupChats={dummyGroups} />
          // )
          : (
            // Handle logout
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-md font-semibold bg-slate-500 hover:bg-slate-600 text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="w-1/2 p-4 relative flex flex-col overflow-y-auto">
        {/* Right side (chat bubbles) */}
        <div className="flex-grow">
        {(selectedFriend || selectedChat) && (
            <ChatForm
              recipientId={selectedFriend ? selectedFriend.friendUserId : selectedChat!.recipientId}
              recipientName={selectedFriend ? selectedFriend.name : selectedChat!.recipientName}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatHome;
