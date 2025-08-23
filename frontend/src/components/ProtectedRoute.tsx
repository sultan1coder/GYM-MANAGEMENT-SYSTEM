import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  isAdmin,
  isStaff,
  canAccessAdminRoutes,
  canAccessStaffRoutes,
} from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireStaff?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireStaff = false,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) => {
  // Check if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !canAccessAdminRoutes()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if staff access is required (admin can also access staff routes)
  if (requireStaff && !canAccessStaffRoutes()) {
    return <Navigate to="/members/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
