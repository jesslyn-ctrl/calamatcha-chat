import React from "react";
import { ChatCard } from "../../components";

interface Chat {
  id: string;
  sender: string;
  message: string;
}

interface ChatListProps {
  chats: Chat[];
}

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <ChatCard key={chat.id} sender={chat.sender} message={chat.message} />
      ))}
    </div>
  );
};

export default ChatList;
