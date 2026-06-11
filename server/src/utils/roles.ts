export const ROLE_ADMIN = "Admin";
export const ROLE_CLIENT = "Client";

export function normalizeRoleName(name: string): string {
  return name.trim().toLowerCase();
}

export function isAdminRole(name: string): boolean {
  return normalizeRoleName(name) === "admin";
}

type UserRoleRelation = {
  role: { name: string };
};

export function extractRoleNames(roles: UserRoleRelation[] | undefined): string[] {
  if (!roles?.length) return [];
  return roles.map((entry) => entry.role.name);
}

export function userHasAdminRole(roles: UserRoleRelation[] | undefined): boolean {
  return extractRoleNames(roles).some(isAdminRole);
}
