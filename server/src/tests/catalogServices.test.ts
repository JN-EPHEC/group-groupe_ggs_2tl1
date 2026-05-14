import { describe, expect, it } from "@jest/globals";
import { allCategories, oneCat } from "../services/catServices";
import { allProduct, oneProduct } from "../services/prodServices";
import { prismaMock } from "./setup/prisma.singleton";

const product = {
  id: 1,
  name: "Produit test",
  description: "Description test",
  price: 10,
  stock: 5,
  category_id: 1,
};

const category = {
  id: 1,
  name: "Catégorie test",
};

describe("Catalog services", () => {
  describe("prodServices", () => {
    it("retourne tous les produits", async () => {
      prismaMock.products.findMany.mockResolvedValue([product]);

      const result = await allProduct();

      expect(result).toEqual([product]);
      expect(prismaMock.products.findMany).toHaveBeenCalledWith({});
    });

    it("rejette si aucun produit n'est trouvé", async () => {
      prismaMock.products.findMany.mockResolvedValue([]);

      await expect(allProduct()).rejects.toThrow("PRODUCTS_NOT_FOUND");
    });

    it("retourne un produit par id", async () => {
      prismaMock.products.findUnique.mockResolvedValue(product);

      const result = await oneProduct(1);

      expect(result).toEqual(product);
      expect(prismaMock.products.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("rejette si le produit est introuvable", async () => {
      prismaMock.products.findUnique.mockResolvedValue(null);

      await expect(oneProduct(999)).rejects.toThrow("PRODUCT_NOT_FOUND");
    });
  });

  describe("catServices", () => {
    it("retourne toutes les catégories", async () => {
      prismaMock.categories.findMany.mockResolvedValue([category]);

      const result = await allCategories();

      expect(result).toEqual([category]);
      expect(prismaMock.categories.findMany).toHaveBeenCalledWith({});
    });

    it("retourne une catégorie par id", async () => {
      prismaMock.categories.findUnique.mockResolvedValue(category);

      const result = await oneCat(1);

      expect(result).toEqual(category);
      expect(prismaMock.categories.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("rejette si la catégorie est introuvable", async () => {
      prismaMock.categories.findUnique.mockResolvedValue(null);

      await expect(oneCat(999)).rejects.toThrow("CAT_NOT_FOUND");
    });
  });
});
