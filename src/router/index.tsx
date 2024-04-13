import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import PrivateRoute from "./privateRoute";
import ProtectedRoute from "./protectedRoute";
import { Auth, ChatHome } from "../pages";
// import { NotFound } from "../components";

const RootRouter: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Auth />} />
      </Route> */}

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
