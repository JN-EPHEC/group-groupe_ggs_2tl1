import { describe, expect, it } from "vitest";
import { getCategoryLoadErrorMessage } from "./useCategory";

describe("getCategoryLoadErrorMessage", () => {
  it("retourne un message dédié pour une 404", () => {
    expect(getCategoryLoadErrorMessage({ response: { status: 404 } })).toBe(
      "Catégorie introuvable.",
    );
  });

  it("retourne un message générique pour les autres erreurs", () => {
    expect(getCategoryLoadErrorMessage({ response: { status: 500 } })).toBe(
      "Impossible de charger cette catégorie.",
    );
  });
});
