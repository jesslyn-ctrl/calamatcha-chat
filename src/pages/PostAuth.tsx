import React from "react";
import { UserForm } from "../components";
import { useNavigate } from "react-router-dom";
import useFirebase from "./../hooks/useFirebase";

const PostAuth: React.FC = () => {
  const { saveUserToDatabase, user } = useFirebase();
  const navigate = useNavigate();

  const handleFormSubmit = (username: string, displayName: string) => {
    console.log(user);

    if (user) {
      user.username = username;
      user.chatDisplayName = displayName;
      console.log("Test");
      console.log(user);

      // saveUserToDatabase(user);
      // Redirect to the chat page
      // navigate("/");
    }
  };

  return (
    <section>
      <h1>Hi</h1>
      {/* <UserForm onFormSubmit={handleFormSubmit} />; */}
    </section>
  );
};

export default PostAuth;
