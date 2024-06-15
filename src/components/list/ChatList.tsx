import React from "react";
import { ChatCard } from "../../components";

interface Chat {
  id: string;
  recipient: string;
  lastMessage: string;
}

interface ChatListProps {
  chats: Chat[];
}

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          recipient={chat.recipient}
          lastMessage={chat.lastMessage}
        />
      ))}
    </div>
  );
};

export default ChatList;
