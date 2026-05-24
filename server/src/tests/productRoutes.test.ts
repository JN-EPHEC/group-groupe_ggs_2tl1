import express from "express";
import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import productRoutes from "../routes/productRoutes";
import { errorHandler } from "../middlewares/errorHandlers";
import { prismaMock } from "./setup/prisma.singleton";

const app = express();

app.use(express.json());
app.use("/api/produits", productRoutes);
app.use(errorHandler);

const product = {
  id: 1,
  name: "Produit test",
  description: "Description test",
  price: 10,
  stock: 5,
  category_id: 1,
  isActive: true,
  category: { name: "Catégorie test" },
};

describe("Product routes", () => {
  it("GET /api/produits retourne la liste des produits", async () => {
    prismaMock.products.findMany.mockResolvedValue([product]);

    const response = await request(app).get("/api/produits");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: "Produit test",
        description: "Description test",
        price: 10,
        stock: 5,
        category: "Catégorie test",
        category_id: 1,
      },
    ]);
    expect(prismaMock.products.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      skip: 0,
      take: 12,
      orderBy: { id: "asc" },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  });

  it("GET /api/produits applique les filtres et le tri", async () => {
    prismaMock.products.findMany.mockResolvedValue([product]);

    const response = await request(app).get(
      "/api/produits?page=2&limit=5&categorie_id=1&prix_min=5&prix_max=20&sort=prix_desc"
    );

    expect(response.status).toBe(200);
    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isActive: true,
          category_id: 1,
          price: {
            gte: 5,
            lte: 20,
          },
        },
        skip: 5,
        take: 5,
        orderBy: { price: "desc" },
      })
    );
  });

  it("GET /api/produits rejette un tri invalide", async () => {
    const response = await request(app).get("/api/produits?sort=unknown");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "sort invalide." });
    expect(prismaMock.products.findMany).not.toHaveBeenCalled();
  });

  it("GET /api/produits/:id retourne un produit", async () => {
    prismaMock.products.findUnique.mockResolvedValue(product);

    const response = await request(app).get("/api/produits/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Produit test",
      description: "Description test",
      price: 10,
      stock: 5,
      category: "Catégorie test",
      category_id: 1,
    });
    expect(prismaMock.products.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  });

  it("GET /api/produits/:id rejette un id invalide", async () => {
    const response = await request(app).get("/api/produits/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "id invalide" });
    expect(prismaMock.products.findUnique).not.toHaveBeenCalled();
  });

  it("GET /api/produits/:id retourne 404 si le produit est introuvable", async () => {
    prismaMock.products.findUnique.mockResolvedValue(null);

    const response = await request(app).get("/api/produits/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Produit introuvable." });
  });
});
