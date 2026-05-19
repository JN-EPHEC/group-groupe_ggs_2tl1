import { describe, expect, it } from "vitest";
import { canAccessRoute, getRedirectForAccess } from "./authAccess";

describe("authAccess", () => {
  it("autorise les invités uniquement sans session", () => {
    expect(canAccessRoute("guest", { authenticated: false, admin: false })).toBe(true);
    expect(canAccessRoute("guest", { authenticated: true, admin: false })).toBe(false);
  });

  it("autorise les routes utilisateur pour toute session connectée", () => {
    expect(canAccessRoute("user", { authenticated: true, admin: false })).toBe(true);
    expect(canAccessRoute("user", { authenticated: true, admin: true })).toBe(true);
    expect(canAccessRoute("user", { authenticated: false, admin: false })).toBe(false);
  });

  it("autorise l'admin uniquement pour un compte admin", () => {
    expect(canAccessRoute("admin", { authenticated: true, admin: true })).toBe(true);
    expect(canAccessRoute("admin", { authenticated: true, admin: false })).toBe(false);
  });

  it("redirige vers la connexion si la route est protégée", () => {
    expect(getRedirectForAccess("user", { authenticated: false, admin: false })).toBe("/connexion");
    expect(getRedirectForAccess("admin", { authenticated: false, admin: false })).toBe("/connexion");
  });

  it("redirige un invité connecté vers compte ou admin", () => {
    expect(getRedirectForAccess("guest", { authenticated: true, admin: false })).toBe("/compte");
    expect(getRedirectForAccess("guest", { authenticated: true, admin: true })).toBe("/admin");
  });

  it("redirige un utilisateur non admin hors de l'espace admin", () => {
    expect(getRedirectForAccess("admin", { authenticated: true, admin: false })).toBe("/compte");
  });

  it("ne redirige pas si l'accès est autorisé", () => {
    expect(getRedirectForAccess("admin", { authenticated: true, admin: true })).toBeNull();
    expect(getRedirectForAccess("user", { authenticated: true, admin: false })).toBeNull();
  });
});
