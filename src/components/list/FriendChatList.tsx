import React from "react";
import FriendChatCard from "./../cards/FriendChatCard";

interface FriendChat {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

interface FriendChatListProps {
  friendChats: FriendChat[];
  onFriendClick: (friendName: string) => void;
  selectedFriend?: string;
}

const FriendChatList: React.FC<FriendChatListProps> = ({
  friendChats,
  onFriendClick,
  selectedFriend,
}) => {
  return (
    <div className="space-y-2">
      {friendChats.map((friend) => (
        <FriendChatCard
          key={friend.id}
          id={friend.id}
          friendName={friend.name}
          email={friend.email}
          onFriendClick={onFriendClick}
          selectedFriend={selectedFriend}
        />
      ))}
    </div>
  );
};

export default FriendChatList;
