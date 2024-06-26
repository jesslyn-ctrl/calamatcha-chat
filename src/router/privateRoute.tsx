import React from "react";
import { Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import useFirebase from "../hooks/useFirebase";
import { LoadingSpinner } from "../components";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useFirebase();

  // If the auth state is still loading, return loading animation
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated()) {
    return <RootLayout />;
  }

  // Redirect to login page if user is not authenticated
  return <Navigate to="/login" />;
};

export default PrivateRoute;
