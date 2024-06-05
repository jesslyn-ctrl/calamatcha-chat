import React, { useState } from "react";

interface AddFriendPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (email: string) => void;
}

const AddFriendPopup: React.FC<AddFriendPopupProps> = ({
  isOpen,
  onClose,
  onAddFriend,
}) => {
  const [email, setEmail] = useState("");

  const handleAddFriend = () => {
    if (email) {
      onAddFriend(email);
      setEmail("");
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-50 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Friend</h2>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter your friend's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-400 text-white py-2 px-4 rounded"
                onClick={handleAddFriend}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFriendPopup;
