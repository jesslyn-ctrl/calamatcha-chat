import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import ProtectedRoute from "./protectedRoute";
import { Auth, ChatHome } from "../pages";

const RootRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<ChatHome />} />
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Auth />} />
      </Route>
    </Routes>
  );
};

export default RootRouter;
