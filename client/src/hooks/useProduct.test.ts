import { describe, expect, it } from "vitest";
import { getProductLoadErrorMessage } from "./useProduct";

describe("getProductLoadErrorMessage", () => {
  it("retourne un message dédié pour une 404", () => {
    expect(getProductLoadErrorMessage({ response: { status: 404 } })).toBe(
      "Produit introuvable.",
    );
  });

  it("retourne un message générique pour les autres erreurs", () => {
    expect(getProductLoadErrorMessage({ response: { status: 500 } })).toBe(
      "Erreur lors du chargement du produit.",
    );
  });
});
