import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import useFirebase from "../hooks/useFirebase";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useFirebase();

  if (!isAuthenticated()) {
    return (
      <RootLayout>
        <Outlet />
      </RootLayout>
    );
  }

  // Redirect to chat page if user is not authenticated
  return <Navigate to="/" />;
};

export default ProtectedRoute;
