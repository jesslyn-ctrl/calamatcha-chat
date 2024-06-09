import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";

interface UserFormProps {
  onFormSubmit: (username: string, displayName: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onFormSubmit }) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [usernameErr, setUsernameErr] = useState<string | null>(null);
  const [displayNameErr, setDisplayNameErr] = useState<string | null>(null);
  const { checkUsernameExists, user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const validateUsername = async () => {
      if (username.length < 6) {
        setUsernameErr("Username must be at least 6 characters long.");
        return;
      }

      const exists = await checkUsernameExists(username);
      if (exists) {
        setUsernameErr("Username already exists.");
      } else {
        setUsernameErr(null);
      }
    };

    if (username) {
      validateUsername();
    }
  }, [username, checkUsernameExists]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() !== "" && displayName.trim() !== "") {
      if (usernameErr === null && displayName.length >= 3) {
        console.log("TEST1");

        onFormSubmit(username.trim(), displayName.trim());
        console.log("TEST2");
      } else {
        if (displayName.length < 3) {
          setDisplayNameErr("Display Name must be at least 3 characters long.");
        }
      }
    } else {
      if (username.trim() === "") {
        setUsernameErr("Username is required.");
      }
      if (displayName.trim() === "") {
        setDisplayNameErr("Display Name is required.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Fill Your Data
        </h2>
        {/* Username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {/* Username Error */}
        {usernameErr && (
          <p className="text-red-500 text-sm mb-2">{usernameErr}</p>
        )}
        {/* Display Name */}
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {/* Display Name Error */}
        {displayNameErr && (
          <p className="text-red-500 text-sm mb-2">{displayNameErr}</p>
        )}
        {/* Next > */}
        <button
          type="submit"
          className="w-full py-2 bg-red-500 font-semibold text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default UserForm;
