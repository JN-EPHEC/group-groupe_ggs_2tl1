import { describe, expect, it } from "@jest/globals";
import {
  extractRoleNames,
  isAdminRole,
  userHasAdminRole,
} from "../utils/roles";

describe("roles utils", () => {
  it("détecte le rôle admin sans tenir compte de la casse", () => {
    expect(isAdminRole("Admin")).toBe(true);
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("Client")).toBe(false);
  });

  it("extrait les noms de rôles depuis les relations Prisma", () => {
    expect(
      extractRoleNames([
        { role: { name: "Client" } },
        { role: { name: "Admin" } },
      ])
    ).toEqual(["Client", "Admin"]);
  });

  it("indique si un utilisateur possède le rôle admin", () => {
    expect(
      userHasAdminRole([{ role: { name: "Client" } }, { role: { name: "Admin" } }])
    ).toBe(true);
    expect(userHasAdminRole([{ role: { name: "Client" } }])).toBe(false);
    expect(userHasAdminRole(undefined)).toBe(false);
  });
});
