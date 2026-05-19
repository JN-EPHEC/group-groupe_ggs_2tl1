import { describe, expect, it } from "@jest/globals";
import {
  deleteProductAdmin,
  parseProductUpdateInput,
  updateProductAdmin,
} from "../services/adminServices";
import { prismaMock } from "./setup/prisma.singleton";

const product = {
  id: 1,
  name: "Jeans",
  description: "Blue jeans",
  price: 50,
  stock: 10,
  category_id: 1,
  isActive: true,
  category: { id: 1, name: "Pants" },
};

describe("Admin products (US06 US07)", () => {
  it("valide les champs de mise à jour produit", () => {
    expect(
      parseProductUpdateInput({
        name: "Nouveau nom",
        price: 25,
        stock: 3,
        category_id: 2,
      })
    ).toEqual({
      name: "Nouveau nom",
      price: 25,
      stock: 3,
      category_id: 2,
    });
  });

  it("rejette un nom de produit invalide", () => {
    expect(() => parseProductUpdateInput({ name: "" })).toThrow("INVALID_PRODUCT_NAME");
  });

  it("met à jour un produit", async () => {
    prismaMock.products.findUnique.mockResolvedValue(product as any);
    prismaMock.categories.findUnique.mockResolvedValue({ id: 2, name: "Shirts" });
    prismaMock.products.update.mockResolvedValue({ ...product, name: "Jean slim" } as any);

    const result = await updateProductAdmin(1, { name: "Jean slim", category_id: 2 });

    expect(result.name).toBe("Jean slim");
  });

  it("désactive un produit présent dans des commandes", async () => {
    prismaMock.products.findUnique.mockResolvedValue({
      ...product,
      _count: { orderProducts: 2 },
    } as any);
    prismaMock.products.update.mockResolvedValue({ ...product, isActive: false } as any);

    const result = await deleteProductAdmin(1);

    expect(result.mode).toBe("soft");
    expect(prismaMock.products.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { isActive: false },
      })
    );
  });

  it("supprime physiquement un produit sans commande", async () => {
    prismaMock.products.findUnique.mockResolvedValue({
      ...product,
      _count: { orderProducts: 0 },
    } as any);
    prismaMock.products.delete.mockResolvedValue(product as any);

    const result = await deleteProductAdmin(1);

    expect(result.mode).toBe("hard");
    expect(prismaMock.products.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      select: expect.any(Object),
    });
  });
});
