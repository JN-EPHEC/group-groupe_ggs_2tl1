import { describe, expect, it } from "vitest";
import { resolveAsyncError } from "./useAsyncData";

describe("resolveAsyncError", () => {
  it("retourne le message d'une Error", () => {
    expect(resolveAsyncError(new Error("échec réseau"))).toBe("échec réseau");
  });

  it("retourne le message de repli pour une valeur inconnue", () => {
    expect(resolveAsyncError("timeout", "Chargement impossible")).toBe(
      "Chargement impossible",
    );
  });
});
