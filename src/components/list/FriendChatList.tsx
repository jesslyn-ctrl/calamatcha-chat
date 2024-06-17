import React from "react";
import FriendChatCard from "./../cards/FriendChatCard";
import { Friend } from "../../models";

interface FriendChatListProps {
  friendChats: Friend[];
  onFriendClick: (friend: Friend, friendId: string) => void;
  selectedFriend?: Friend;
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
          friend={friend}
          onFriendClick={() => onFriendClick(friend, friend.id)}
          isSelected={friend === selectedFriend}
        />
      ))}
    </div>
  );
};

export default FriendChatList;
