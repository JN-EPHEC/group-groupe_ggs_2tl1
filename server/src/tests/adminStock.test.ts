import { describe, expect, it } from "@jest/globals";
import { listProductsAdmin, updateProductStockAdmin } from "../services/adminServices";
import { prismaMock } from "./setup/prisma.singleton";

const product = {
  id: 1,
  name: "Jeans",
  stock: 5,
  price: 50,
  isActive: true,
  category: { id: 1, name: "Pants" },
};

describe("Admin stock (US03 US04)", () => {
  it("liste les produits triés par stock croissant", async () => {
    prismaMock.products.findMany.mockResolvedValue([product] as any);

    const result = await listProductsAdmin({ sort: "stock_asc" });

    expect(result).toEqual([product]);
    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { stock: "asc" },
      })
    );
  });

  it("met à jour la quantité en stock", async () => {
    prismaMock.products.findUnique.mockResolvedValue(product as any);
    prismaMock.products.update.mockResolvedValue({ ...product, stock: 12 } as any);

    const result = await updateProductStockAdmin(1, 12);

    expect(result.stock).toBe(12);
    expect(prismaMock.products.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: { stock: 12 },
      })
    );
  });

  it("rejette une quantité invalide", async () => {
    await expect(updateProductStockAdmin(1, -1)).rejects.toThrow("INVALID_STOCK");
    await expect(updateProductStockAdmin(1, 1.5)).rejects.toThrow("INVALID_STOCK");
  });

  it("rejette un produit introuvable", async () => {
    prismaMock.products.findUnique.mockResolvedValue(null);

    await expect(updateProductStockAdmin(999, 10)).rejects.toThrow("PRODUCT_NOT_FOUND");
  });
});
