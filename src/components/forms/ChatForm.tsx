import React, { useState } from "react";
import useFirebase from "../../hooks/useFirebase";
import { Bubble } from "../../components";
import { Friend } from "../../models";

interface ChatFormProps {
  sender: string;
  recipientId: string;
  recipientName: string;
}

const ChatForm: React.FC<ChatFormProps> = ({
  sender,
  recipientId,
  recipientName,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { user, sendChatMessage, createUpdateChatHeader } = useFirebase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message || message.trim() === "") {
      return;
    }

    try {
      await sendChatMessage(recipientId, message);
      await createUpdateChatHeader(recipientId, recipientName, message);

      setMessages([...messages, message]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
      </div>

      {/* Chat content */}
      <div
        className="w-full p-2 relative overflow-hidden"
        style={{ height: "calc(85vh - 4rem)" }}
      >
        <div className="h-full overflow-y-auto bg-white p-3">
          {/* Display chat bubbles */}
          {messages.map((msg, index) => (
            <Bubble key={index} text={msg} position="right" />
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
