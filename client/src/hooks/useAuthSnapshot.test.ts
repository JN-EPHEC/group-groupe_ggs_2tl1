import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildAuthSnapshot } from "./useAuthSnapshot";
import * as auth from "../utils/auth";

describe("buildAuthSnapshot", () => {
  beforeEach(() => {
    vi.spyOn(auth, "getStoredUser").mockReturnValue(null);
    vi.spyOn(auth, "isAuthenticated").mockReturnValue(false);
    vi.spyOn(auth, "isAdminUser").mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("indique un invité sans utilisateur stocké", () => {
    expect(buildAuthSnapshot()).toEqual({
      connected: false,
      displayName: null,
      admin: false,
    });
  });

  it("détecte un administrateur connecté", () => {
    vi.spyOn(auth, "getStoredUser").mockReturnValue({
      username: "admin",
      role: "admin",
    });
    vi.spyOn(auth, "isAuthenticated").mockReturnValue(true);
    vi.spyOn(auth, "isAdminUser").mockReturnValue(true);

    expect(buildAuthSnapshot()).toEqual({
      connected: true,
      displayName: "admin",
      admin: true,
    });
  });
});
