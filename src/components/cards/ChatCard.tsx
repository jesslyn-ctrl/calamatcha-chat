import React from "react";
import { ChatHeader } from "../../models"

interface ChatCardProps {
  chat: ChatHeader;
  onChatClick: (chatHeader: ChatHeader, headerId: string) => void;
  isSelected?: boolean;
}

const ChatCard: React.FC<ChatCardProps> = ({ chat, onChatClick, isSelected }) => {
  return (
    <div
      className={`bg-white hover:bg-red-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer ${
        isSelected ? "bg-gray-200" : ""
      }`} // Add background color class conditionally
      onClick={() => onChatClick(chat, chat.id)}
    >
      <h4 className="text-lg font-semibold mb-2">{chat.recipientName}</h4>
      <p className="text-sm text-slate-500">Last message: {chat.lastMessage}</p>
    </div>
  );
};

export default ChatCard;
