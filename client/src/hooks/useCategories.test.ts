import { describe, expect, it } from "vitest";
import { getCategoriesLoadErrorMessage } from "./useCategories";

describe("getCategoriesLoadErrorMessage", () => {
  it("retourne un message utilisateur stable", () => {
    expect(getCategoriesLoadErrorMessage()).toBe(
      "Une erreur est survenue pendant le chargement des catégories.",
    );
  });
});
