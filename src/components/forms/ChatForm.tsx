import React, { useState } from "react";
import { Bubble } from "../../components";

interface ChatFormProps {
  sender: string;
}

const ChatForm: React.FC<ChatFormProps> = ({ sender }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent: ", message);
    setMessages([...messages, message]);
    setMessage("");
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
          <span className="text-white text-lg font-bold">P</span>
        </div>

        {/* Sender Name and Last Seen */}
        <div className="flex flex-col">
          <h3 className="text-black font-semibold font-serif">{sender}</h3>
          <p className="text-gray-500 text-sm">Last seen: 2 hours ago</p>
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
