import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface UserFormProps {
  onUsernameSubmit: (username: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUsernameSubmit }) => {
  const [username, setUsername] = useState("");
  const history = useHistory();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() !== "") {
      onUsernameSubmit(username.trim());
      // Redirect
      history.push("/");
    } else {
      // TODO: Add validation
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-full"
    >
      <h2 className="text-2xl font-semibold mb-4">Enter Your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </form>
  );
};

export default UserForm;
