import React from "react";
import { Friend } from "../../models";

interface FriendChatCardProps {
  // id: string;
  // friendName: string;
  // email: string;
  friend: Friend;
  onFriendClick: (friend: Friend, friendId: string) => void;
  isSelected?: boolean;
}

const FriendChatCard: React.FC<FriendChatCardProps> = ({
  friend,
  onFriendClick,
  isSelected,
}) => {
  // const isSelected = friendName === selectedFriend;

  return (
    <div
      className={`bg-white hover:bg-green-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer ${
        isSelected ? "bg-gray-200" : ""
      }`} // Add background color class conditionally
      onClick={() => onFriendClick(friend, friend.id)}
    >
      <h4 className="text-lg font-semibold mb-2">{friend.name}</h4>
      <p className="text-sm text-slate-500">{friend.email}</p>
    </div>
  );
};

export default FriendChatCard;
