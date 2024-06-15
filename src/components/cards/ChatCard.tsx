import React from "react";

interface ChatCardProps {
  recipient: string;
  lastMessage: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ recipient, lastMessage }) => {
  return (
    <div className="bg-white hover:bg-red-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer">
      <h4 className="text-lg font-semibold mb-2">{recipient}</h4>
      <p className="text-sm text-slate-500">Last message: {lastMessage}</p>
    </div>
  );
};

export default ChatCard;
