interface Chat {
  id: string;
  isRead: boolean;
  message: string;
  recipientId: string;
  senderId: string;
  sentAt: string;
  senderHeaderId: string;
  recipientHeaderId: string;
}

export default Chat;
