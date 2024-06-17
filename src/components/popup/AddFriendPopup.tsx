import React, { useState, useEffect, useCallback } from "react";
import useFirebase from "./../../hooks/useFirebase";

interface AddFriendPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFriendPopup: React.FC<AddFriendPopupProps> = ({ isOpen, onClose }) => {
  const { searchEmails, addFriendByEmail } = useFirebase();
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchEmailSuggestions = useCallback(async () => {
    if (email) {
      try {
        const emails = await searchEmails(email);
        setSuggestions(emails);
      } catch (error) {
        console.error("Error fetching email suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [email, searchEmails]);

  useEffect(() => {
    fetchEmailSuggestions();
  }, [email, fetchEmailSuggestions]);

  const handleAddFriend = async () => {
    if (email) {
      try {
        await addFriendByEmail(email);
        // onAddFriend(email);
        setEmail("");
        setSuggestions([]);
        onClose();
      } catch (error) {
        console.error("Error adding friend:", error);
      }
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
            {suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded mb-4">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => setEmail(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
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
