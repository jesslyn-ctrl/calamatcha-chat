import React from "react";

interface GroupChatCardProps {
  id: string;
  groupName: string;
  lastMessage: string;
}

const GroupChatCard: React.FC<GroupChatCardProps> = ({
  groupName,
  lastMessage,
}) => {
  return (
    <div className="bg-white hover:bg-green-50 rounded-lg p-4 shadow-md mb-2 transition duration-200 ease-in-out cursor-pointer">
      <h4 className="text-lg font-semibold mb-2">{groupName}</h4>
      <p className="text-sm text-slate-500">Last message: {lastMessage}</p>
    </div>
  );
};

export default GroupChatCard;
