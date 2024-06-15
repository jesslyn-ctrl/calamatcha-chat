import React from "react";

interface FriendChatCardProps {
  id: string;
  friendName: string;
  email: string;
  onFriendClick: (friendName: string) => void;
  selectedFriend?: string;
}

const FriendChatCard: React.FC<FriendChatCardProps> = ({
  friendName,
  email,
  onFriendClick,
  selectedFriend,
}) => {
  const isSelected = friendName === selectedFriend;

  return (
    <div
      className={`bg-white hover:bg-green-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer ${
        isSelected ? "bg-gray-200" : ""
      }`} // Add background color class conditionally
      onClick={() => onFriendClick(friendName)}
    >
      <h4 className="text-lg font-semibold mb-2">{friendName}</h4>
      <p className="text-sm text-slate-500">{email}</p>
    </div>
  );
};

export default FriendChatCard;
