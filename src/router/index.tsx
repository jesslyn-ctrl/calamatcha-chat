import React from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
// import PrivateRoute from "./privateRoute";
// import ProtectedRoute from "./protectedRoute";
import { Auth } from "../pages";
// import { NotFound } from "../components";

const RootRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Auth />} />
      </Route>
    </Routes>
  );
};

export default RootRouter;
