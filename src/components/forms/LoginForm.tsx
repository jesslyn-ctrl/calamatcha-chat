import React from "react";
import useFirebase from "../../hooks/useFirebase";

const LoginForm: React.FC = () => {
  const { signInWithGoogle } = useFirebase();

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={handleLoginWithGoogle}
        className="bg-white border border-red-600 hover:bg-red-300 hover:border-red-100 text-red-600 hover:text-white font-bold py-2 px-4 rounded-md flex items-center justify-center shadow-md transition duration-200 ease-in-out"
      >
        <img
          className="mr-2"
          width="36"
          height="36"
          src="https://img.icons8.com/color/36/google-logo.png"
          alt="google-logo"
        />
        Login with Google
      </button>
    </div>
  );
};

export default LoginForm;
