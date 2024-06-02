import React from "react";

interface FriendChatCardProps {
  id: string;
  friendName: string;
  lastMessage: string;
}

const FriendChatCard: React.FC<FriendChatCardProps> = ({
  friendName,
  lastMessage,
}) => {
  return (
    <div className="bg-white hover:bg-green-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer">
      <h4 className="text-lg font-semibold mb-2">{friendName}</h4>
      <p className="text-slate-500">Last message: {lastMessage}</p>
    </div>
  );
};

export default FriendChatCard;
