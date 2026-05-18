import { describe, expect, it } from "@jest/globals";
import {
  createCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
  updateCategoryAdmin,
} from "../services/adminCategoryServices";
import { prismaMock } from "./setup/prisma.singleton";

describe("Admin categories (US08)", () => {
  it("liste les catégories avec le nombre de produits", async () => {
    const categories = [{ id: 1, name: "Pants", _count: { products: 2 } }];
    prismaMock.categories.findMany.mockResolvedValue(categories as any);

    const result = await getAllCategoriesAdmin();

    expect(result).toEqual(categories);
  });

  it("crée une catégorie", async () => {
    const category = { id: 1, name: "Accessoires", _count: { products: 0 } };
    prismaMock.categories.create.mockResolvedValue(category as any);

    const result = await createCategoryAdmin({ name: "Accessoires" });

    expect(result).toEqual(category);
  });

  it("rejette la suppression si des produits sont liés", async () => {
    prismaMock.categories.findUnique.mockResolvedValue({
      id: 1,
      name: "Pants",
      _count: { products: 3 },
    } as any);

    await expect(deleteCategoryAdmin(1)).rejects.toThrow("CATEGORY_HAS_PRODUCTS");
  });
});
