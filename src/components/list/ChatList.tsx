import React from "react";
import { ChatCard } from "../../components";
import { ChatHeader } from "../../models"

interface Chat {
  headerId: string;
  recipient: string;
  lastMessage: string;
}

interface ChatListProps {
  chats: ChatHeader[];
  onChatClick: (chatHeader: ChatHeader, headerId: string) => void;
  selectedChat?: ChatHeader;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatClick, selectedChat }) => {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          chat={chat}
          onChatClick={() => onChatClick(chat, chat.id)}
          isSelected={chat === selectedChat}
        />
      ))}
    </div>
  );
};

export default ChatList;
