import React from "react";

interface ChatCardProps {
  sender: string;
  message: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ sender, message }) => {
  return (
    <div className="bg-white hover:bg-red-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer">
      <h4 className="text-lg font-semibold mb-2">{sender}</h4>
      <p className="text-slate-500">{message}</p>
    </div>
  );
};

export default ChatCard;
