import React from "react";
import FriendChatCard from "./../cards/FriendChatCard";

interface FriendChat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface FriendChatListProps {
  friendChats: FriendChat[];
}

const FriendChatList: React.FC<FriendChatListProps> = ({ friendChats }) => {
  return (
    <div className="space-y-2">
      {friendChats.map((friend) => (
        <FriendChatCard
          key={friend.id}
          id={friend.id}
          friendName={friend.name}
          lastMessage={friend.lastMessage}
        />
      ))}
    </div>
  );
};

export default FriendChatList;
