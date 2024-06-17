import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
} from "firebase/database";
import useFirebase from "../../hooks/useFirebase";
import { Bubble } from "../../components";
import { Chat } from "../../models";
import firebase from "../../config/firebase";

interface ChatFormProps {
  recipientId: string;
  recipientName: string;
}

const ChatForm: React.FC<ChatFormProps> = ({
  recipientId,
  recipientName,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const { user, addFriendById, isRecipientFriend, sendChatMessage, getChatHeaderId, createUpdateChatHeader } = useFirebase();
  const [chatHeaderId, setChatHeaderId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatHeaderIdAndMessages = async () => {
      if (user && recipientId) {
        setChatHeaderId(null);
        const headerId = await getChatHeaderId(recipientId);

        // Ensure headerId is not undefined before setting the state
        if (headerId !== undefined) {
          setChatHeaderId(headerId);
        }

        if (chatHeaderId) {
          const unsubscribe = onValue(ref(getDatabase(firebase), "chats"), (snapshot) => {
            const messageData = snapshot.val();
            if (messageData) {
              const messagesArray = Object.values(messageData) as Chat[];
              const filteredMessages = messagesArray.filter(
                (msg: Chat) => msg.senderHeaderId === chatHeaderId || msg.recipientHeaderId === chatHeaderId
              );
              setMessages(filteredMessages);
            } else {
              setMessages([]);
            }
          });

          // Unmount listener
          return () => unsubscribe();
        }
      }
    };

    fetchChatHeaderIdAndMessages();
  }, [user, recipientId, chatHeaderId, getChatHeaderId]);

  useEffect(() => {
    if (user && recipientId) {
      const checkFriendship = async () => {
        const isFriend = await isRecipientFriend(recipientId);
        setIsFriend(isFriend);
      };

      checkFriendship();
    }
  }, [user, recipientId, isRecipientFriend]);

  useLayoutEffect(() => {
    if (messages.length > 0) {
      chatContentRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message || message.trim() === "") {
      return;
    }

    try {
      if (user && recipientId) {
        if (user.displayName !== null) {
          // Both will have different headerId binded to every message
          const senderHeaderId = await createUpdateChatHeader(user.uid, recipientId, recipientName, message);
          const recipientHeaderId = await createUpdateChatHeader(recipientId, user.uid, user.displayName, message);

          // Ensure senderHeaderId and recipientHeaderId are not null
          if (senderHeaderId && recipientHeaderId) {
            await sendChatMessage(recipientId, message, senderHeaderId, recipientHeaderId);
          } else {
            console.error("Error creating chat headers - senderHeaderId or recipientHeaderId is undefined");
          }

          setMessage("");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAddFriend = async () => {
    if (recipientId) {
      try {
        await addFriendById(recipientId);
        setIsFriend(true);
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    }
  };

  return (
    <section>
      {/* Chat header */}
      <div
        className="z-1000 top-0 w-full rounded-sm shadow-md h-20 px-4 py-2 flex items-center"
        style={{ background: "linear-gradient(45deg, #FFC0CB, #FFAFBD)" }}
      >
        {/* Profile Icon */}
        <div className="rounded-full h-12 w-12 bg-gray-400 flex items-center justify-center mr-4">
          <img
            src="/assets/images/icons/profile-white-64.png"
            width="36"
            height="36"
          />
          {/* <span className="text-white text-lg font-bold">P</span> */}
        </div>

        {/* Sender Name and Last Seen */}
        <div className="flex flex-col">
          <h3 className="text-black font-semibold font-serif">
            {recipientName}
          </h3>
          <p className="text-gray-500 text-sm">Last seen recently</p>
        </div>

        {/* Add friend button if recipient is not a friend */}
        {!isFriend && (
          <button
            className="ml-auto rounded-full text-white font-semibold p-0 shadow-md"
            onClick={handleAddFriend}
          >
            <img
              src="/assets/images/icons/plus-sign-green-48.png"
              width="48"
              height="48"
            />
          </button>
        )}
      </div>

      {/* Chat content */}
      <div
        className="w-full p-2 relative overflow-hidden"
        style={{ height: "calc(85vh - 4rem)" }}
      >
        <div className="h-full overflow-y-auto bg-white p-3" ref={chatContentRef}>
          {/* Display chat bubbles */}
          {messages.map((msg, index) => (
            <Bubble key={index} text={msg.message} position={user && msg.senderId === user.uid ? "right" : "left"} />
          ))}
        </div>
      </div>

      {/* Message input form */}
      <div className="right-2 w-full">
        <form
          onSubmit={handleSubmit}
          className="flex justify-between items-center"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-white border border-red-50 rounded-full py-3 px-3 outline-none focus:border-red-200 shadow-md"
          />
          <button
            type="submit"
            className="ml-2 bg-red-300 text-white rounded-full px-3 py-3 font-semibold hover:bg-red-400 shadow-md transition duration-200"
          >
            <img
              width="32"
              height="32"
              src="/assets/images/icons/send-white-48.png"
              alt="sent--v1"
            />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatForm;
