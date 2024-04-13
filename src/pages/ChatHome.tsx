import React, { useState } from "react";
import useFirebase from "../hooks/useFirebase";
import { useNavigate } from "react-router-dom";
import { ChatList, GroupChatList, ChatForm } from "../components";
import dummyChats from "../assets/data/dummyChats.json";
import dummyGroups from "../assets/data/dummyGroups.json";

const ChatHome: React.FC = () => {
  const { logout } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"chats" | "groups" | "profile">(
    "chats"
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
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

          {/* Group Tab */}
          <button
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
          </button>

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

        {/* Chat or Group List */}
        <div className="flex-grow overflow-y-auto py-2 px-4">
          {activeTab === "chats" ? (
            <ChatList chats={dummyChats} />
          ) : activeTab === "groups" ? (
            <GroupChatList groupChats={dummyGroups} />
          ) : (
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
          <ChatForm sender="Me" />
        </div>
      </div>
    </section>
  );
};

export default ChatHome;
