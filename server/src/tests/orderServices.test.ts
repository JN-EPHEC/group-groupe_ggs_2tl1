import { describe, expect, it } from "@jest/globals";
import { createOrderClient, oneOrderClient, ordersClient } from "../services/orderServices";
import { prismaMock } from "./setup/prisma.singleton";

const product = {
  id: 1,
  name: "Produit test",
  description: "Description test",
  price: 10,
  stock: 5,
  category_id: 1,
};

const order = {
  id: 1,
  user_id: 1,
  orderDate: new Date("2026-01-01"),
  status_id: 1,
  status: { id: 1, name: "En attente" },
  orderProducts: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 2,
      priceAtPurchase: 10,
      product,
    },
  ],
};

describe("Order services", () => {
  it("retourne les commandes d'un utilisateur", async () => {
    prismaMock.orders.findMany.mockResolvedValue([order] as any);

    const result = await ordersClient(1);

    expect(result).toEqual([order]);
    expect(prismaMock.orders.findMany).toHaveBeenCalledWith({
      where: { user_id: 1 },
      orderBy: { orderDate: "desc" },
      include: {
        status: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  it("retourne une commande d'un utilisateur", async () => {
    prismaMock.orders.findFirst.mockResolvedValue(order as any);

    const result = await oneOrderClient(1, 1);

    expect(result).toEqual(order);
    expect(prismaMock.orders.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        user_id: 1,
      },
      include: {
        status: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  it("rejette si le statut par défaut est introuvable", async () => {
    prismaMock.orderStatus.findFirst.mockResolvedValue(null);

    await expect(
      createOrderClient(1, {
        items: [{ product_id: 1, quantity: 2 }],
      })
    ).rejects.toThrow("STATUS_NOT_FOUND");
  });

  it("rejette si un produit est introuvable", async () => {
    prismaMock.orderStatus.findFirst.mockResolvedValue({ id: 1, name: "En attente" });
    prismaMock.$transaction.mockImplementation(async (callback) => {
      prismaMock.products.findMany.mockResolvedValue([]);
      return callback(prismaMock);
    });

    await expect(
      createOrderClient(1, {
        items: [{ product_id: 1, quantity: 2 }],
      })
    ).rejects.toThrow("PRODUCTS_NOT_FOUND");
  });

  it("rejette si le stock est insuffisant", async () => {
    prismaMock.orderStatus.findFirst.mockResolvedValue({ id: 1, name: "En attente" });
    prismaMock.$transaction.mockImplementation(async (callback) => {
      prismaMock.products.findMany.mockResolvedValue([{ ...product, stock: 1 }]);
      return callback(prismaMock);
    });

    await expect(
      createOrderClient(1, {
        items: [{ product_id: 1, quantity: 2 }],
      })
    ).rejects.toThrow("Stock insuffisant pour le produit 1");
  });

  it("crée une commande et retourne son total", async () => {
    prismaMock.orderStatus.findFirst.mockResolvedValue({ id: 1, name: "En attente" });
    prismaMock.$transaction.mockImplementation(async (callback) => {
      prismaMock.products.findMany.mockResolvedValue([product]);
      prismaMock.orders.create.mockResolvedValue({
        id: 1,
        user_id: 1,
        orderDate: new Date("2026-01-01"),
        status_id: 1,
      });
      prismaMock.orderProduct.createMany.mockResolvedValue({ count: 1 });
      prismaMock.products.updateMany.mockResolvedValue({ count: 1 });
      prismaMock.orders.findUnique.mockResolvedValue(order as any);
      return callback(prismaMock);
    });

    const result = await createOrderClient(1, {
      items: [{ product_id: 1, quantity: 2 }],
    });

    expect(result).toEqual({
      ...order,
      totalPrice: 20,
    });
    expect(prismaMock.orderProduct.createMany).toHaveBeenCalledWith({
      data: [
        {
          order_id: 1,
          product_id: 1,
          quantity: 2,
          priceAtPurchase: 10,
        },
      ],
    });
    expect(prismaMock.products.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        stock: { gte: 2 },
      },
      data: {
        stock: { decrement: 2 },
      },
    });
  });
});
