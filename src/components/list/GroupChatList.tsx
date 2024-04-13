import React from "react";
// import { GroupChatCard } from "../../components";
import GroupChatCard from "./../cards/GroupChatCard";

interface GroupChat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface GroupChatListProps {
  groupChats: GroupChat[];
}

const GroupChatList: React.FC<GroupChatListProps> = ({ groupChats }) => {
  return (
    <div className="space-y-2">
      {groupChats.map((group) => (
        <GroupChatCard
          key={group.id}
          id={group.id}
          groupName={group.name}
          lastMessage={group.lastMessage}
        />
      ))}
    </div>
  );
};

export default GroupChatList;
