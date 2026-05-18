export type StoredUser = {
  id?: number;
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

function roleNameFromEntry(entry: unknown): string | null {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object" && "role" in entry) {
    const role = (entry as { role?: { name?: unknown } }).role;
    if (role && typeof role.name === "string") return role.name;
  }
  return null;
}

export function flattenRoleNames(roles: unknown): string[] {
  if (typeof roles === "string") return [roles];
  if (!Array.isArray(roles)) return [];
  return roles.map(roleNameFromEntry).filter((name): name is string => Boolean(name));
}

export function isAdminUser(user: StoredUser | null): boolean {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  if (typeof user.role === "string" && user.role.toLowerCase() === "admin") return true;
  return flattenRoleNames(user.roles).some((name) => name.toLowerCase() === "admin");
}

