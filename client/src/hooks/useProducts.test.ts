import { describe, expect, it } from "vitest";
import { getProductsLoadErrorMessage } from "./useProducts";

describe("getProductsLoadErrorMessage", () => {
  it("retourne un message utilisateur stable", () => {
    expect(getProductsLoadErrorMessage()).toBe(
      "Une erreur est survenue pendant le chargement des produits.",
    );
  });
});
