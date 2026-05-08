export type StoredUser = {
  username?: string;
  email?: string;
  role?: string;
  roles?: string[] | string;
  isAdmin?: boolean;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

function safeJsonParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  const parsed = safeJsonParse(raw);
  return parsed && typeof parsed === "object" ? (parsed as StoredUser) : null;
}

export function setStoredUser(user: StoredUser | null): void {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function isAdminUser(user: StoredUser | null): boolean {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  if (typeof user.role === "string" && user.role.toLowerCase() === "admin") return true;
  const roles = user.roles;
  if (Array.isArray(roles)) return roles.some((r) => String(r).toLowerCase() === "admin");
  if (typeof roles === "string") return roles.toLowerCase().includes("admin");
  return false;
}

