import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, isAdminUser, isAuthenticated } from "../utils/auth";
import { getRedirectForAccess, type RouteAccess } from "../utils/authAccess";

type ProtectedRouteProps = {
  access: RouteAccess;
  children: ReactNode;
};

export default function ProtectedRoute({ access, children }: ProtectedRouteProps) {
  const location = useLocation();
  const state = {
    authenticated: isAuthenticated(),
    admin: isAdminUser(getStoredUser()),
  };
  const redirect = getRedirectForAccess(access, state);

  if (redirect) {
    return <Navigate to={redirect} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
