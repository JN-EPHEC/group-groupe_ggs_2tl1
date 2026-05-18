import { describe, expect, it } from "@jest/globals";
import {
  createAdminUser,
  createCategoryAdmin,
  createProductAdmin,
  deleteAdminUser,
  deleteProductAdmin,
  getUserAdmin,
  updateUserAdmin,
} from "../services/adminServices";
import { prismaMock } from "./setup/prisma.singleton";

const product = {
  id: 1,
  name: "Produit test",
  description: "Description test",
  price: 10,
  stock: 5,
  category_id: 1,
};

const user = {
  id: 1,
  username: "admin",
  email: "admin@test.com",
  created_at: new Date("2026-01-01"),
  isActive: true,
  roles: [
    {
      role: {
        id: 1,
        name: "admin",
      },
    },
  ],
};

describe("Admin services", () => {
  it("crée un produit", async () => {
    prismaMock.products.create.mockResolvedValue(product);

    const result = await createProductAdmin({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
    });

    expect(result).toEqual(product);
    expect(prismaMock.products.create).toHaveBeenCalledWith({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
      },
    });
  });

  it("supprime un produit existant", async () => {
    prismaMock.products.findUnique.mockResolvedValue(product);
    prismaMock.products.delete.mockResolvedValue(product);

    const result = await deleteProductAdmin(1);

    expect(result).toEqual(product);
    expect(prismaMock.products.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("rejette la suppression d'un produit introuvable", async () => {
    prismaMock.products.findUnique.mockResolvedValue(null);

    await expect(deleteProductAdmin(999)).rejects.toThrow("PRODUCT_NOT_FOUND");
  });

  it("retourne un utilisateur admin par id", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user as any);

    const result = await getUserAdmin(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      })
    );
  });

  it("rejette un utilisateur admin introuvable", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(getUserAdmin(999)).rejects.toThrow("USER_NOT_FOUND");
  });

  it("modifie un utilisateur admin", async () => {
    const updatedUser = { ...user, username: "new-admin" };
    prismaMock.user.findUnique.mockResolvedValue(user as any);
    prismaMock.user.update.mockResolvedValue(updatedUser as any);

    const result = await updateUserAdmin(1, { username: "new-admin" });

    expect(result).toEqual(updatedUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: { username: "new-admin" },
      })
    );
  });

  it("rejette une modification admin sans donnée autorisée", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user as any);

    await expect(updateUserAdmin(1, {})).rejects.toThrow("NO_USER_DATA");
  });

  it("crée un utilisateur admin", async () => {
    prismaMock.role.findUnique.mockResolvedValue({ id: 1, name: "admin" });
    prismaMock.user.create.mockResolvedValue(user as any);

    const result = await createAdminUser({
      username: "admin",
      email: "admin@test.com",
    });

    expect(result).toEqual(user);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          username: "admin",
          email: "admin@test.com",
          roles: {
            create: {
              role_id: 1,
            },
          },
        }),
      })
    );
  });

  it("rejette la création admin si le rôle admin est introuvable", async () => {
    prismaMock.role.findUnique.mockResolvedValue(null);

    await expect(createAdminUser({ username: "admin", email: "admin@test.com" })).rejects.toThrow(
      "ADMIN_ROLE_NOT_FOUND"
    );
  });

  it("supprime un utilisateur admin", async () => {
    const deletedUser = { id: 1, username: "admin", email: "admin@test.com" };
    prismaMock.user.findUnique.mockResolvedValue(user as any);
    prismaMock.user.delete.mockResolvedValue(deletedUser as any);

    const result = await deleteAdminUser(1);

    expect(result).toEqual({
      message: "Admin supprimé",
      user: deletedUser,
    });
  });

  it("rejette la suppression si l'utilisateur n'est pas admin", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      roles: [{ role: { name: "Client" } }],
    } as any);

    await expect(deleteAdminUser(1)).rejects.toThrow("USER_NOT_ADMIN");
  });

  it("crée une catégorie", async () => {
    const category = { id: 1, name: "Catégorie test" };
    prismaMock.categories.create.mockResolvedValue(category);

    const result = await createCategoryAdmin({ name: "Catégorie test" });

    expect(result).toEqual(category);
    expect(prismaMock.categories.create).toHaveBeenCalledWith({
      data: { name: "Catégorie test" },
    });
  });
});
