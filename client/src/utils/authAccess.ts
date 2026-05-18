export type RouteAccess = "guest" | "user" | "admin";

export type AuthState = {
  authenticated: boolean;
  admin: boolean;
};

export function canAccessRoute(access: RouteAccess, state: AuthState): boolean {
  switch (access) {
    case "guest":
      return !state.authenticated;
    case "user":
      return state.authenticated;
    case "admin":
      return state.authenticated && state.admin;
    default:
      return false;
  }
}

export function getRedirectForAccess(access: RouteAccess, state: AuthState): string | null {
  if (canAccessRoute(access, state)) {
    return null;
  }

  if (!state.authenticated) {
    return "/connexion";
  }

  if (access === "admin") {
    return "/compte";
  }

  if (access === "guest") {
    return state.admin ? "/admin" : "/compte";
  }

  return "/connexion";
}
