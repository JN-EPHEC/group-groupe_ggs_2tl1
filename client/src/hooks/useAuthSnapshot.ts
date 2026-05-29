import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getStoredUser, isAdminUser, isAuthenticated } from "../utils/auth";

export type AuthSnapshot = {
  connected: boolean;
  displayName: string | null;
  admin: boolean;
};

export function buildAuthSnapshot(): AuthSnapshot {
  const user = getStoredUser();
  return {
    connected: isAuthenticated(),
    displayName: user?.username ?? user?.email ?? null,
    admin: isAdminUser(user),
  };
}

export function useAuthSnapshot(): AuthSnapshot {
  const location = useLocation();

  return useMemo(() => buildAuthSnapshot(), [location.pathname]);
}
