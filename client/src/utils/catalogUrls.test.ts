import { describe, expect, it } from "vitest";
import {
  categoryUrlByName,
  findCategoryIdByName,
  parseCategorieIdParam,
  productsByCategoryUrl,
} from "./catalogUrls";

describe("catalogUrls", () => {
  it("parse un identifiant de catégorie valide", () => {
    expect(parseCategorieIdParam("12")).toBe(12);
  });

  it("rejette un identifiant invalide", () => {
    expect(parseCategorieIdParam("abc")).toBeNull();
    expect(parseCategorieIdParam("0")).toBeNull();
    expect(parseCategorieIdParam(null)).toBeNull();
  });

  it("construit l'URL produits filtrée par catégorie", () => {
    expect(productsByCategoryUrl(3)).toBe("/produits?categorie_id=3");
  });

  it("retrouve une catégorie par nom", () => {
    const categories = [
      { id: 11, name: "Accessoires" },
      { id: 2, name: "Shirts" },
    ];
    expect(findCategoryIdByName(categories, "Accessoires")).toBe(11);
    expect(categoryUrlByName(categories, "Accessoires")).toBe(
      "/produits?categorie_id=11",
    );
  });
});
