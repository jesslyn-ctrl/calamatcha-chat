interface ChatHeader {
  id: string;
  senderId: string;
  recipientId: string;
  recipientName: string;
  combinedId: string;
  lastMessage: string;
  timestamp: string;
}

export default ChatHeader;
