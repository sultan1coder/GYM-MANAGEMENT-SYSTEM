import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, isAdmin } from "../utils/auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = getUser();
  const isUserAdmin = isAdmin();

  if (!user || !isUserAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
