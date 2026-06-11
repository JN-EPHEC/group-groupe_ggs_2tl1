import { describe, expect, it } from "@jest/globals";
import { getUserAdmin, listUsersAdmin } from "../services/adminServices";
import { prismaMock } from "./setup/prisma.singleton";

const user = {
  id: 1,
  username: "alice",
  email: "alice@test.com",
  created_at: new Date("2026-01-01"),
  isActive: true,
  roles: [{ role: { id: 1, name: "Client" } }],
};

describe("Admin users (US01)", () => {
  it("liste les utilisateurs avec pagination", async () => {
    prismaMock.user.findMany.mockResolvedValue([user] as any);
    prismaMock.user.count.mockResolvedValue(1);

    const result = await listUsersAdmin({ page: 1 });

    expect(result.users).toEqual([user]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    });
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
        orderBy: { created_at: "desc" },
      })
    );
  });

  it("filtre par nom ou email sans tenir compte de la casse", async () => {
    prismaMock.user.findMany.mockResolvedValue([user] as any);
    prismaMock.user.count.mockResolvedValue(1);

    await listUsersAdmin({ search: "Ali", page: 1 });

    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { username: { contains: "Ali", mode: "insensitive" } },
            { email: { contains: "Ali", mode: "insensitive" } },
          ],
        },
      })
    );
  });

  it("retourne le détail d'un utilisateur avec ses commandes", async () => {
    const userWithOrders = {
      ...user,
      orders: [
        {
          id: 10,
          orderDate: new Date("2026-02-01"),
          status: { id: 1, name: "En attente" },
          orderProducts: [
            {
              quantity: 2,
              product: { id: 1, name: "Jeans" },
            },
          ],
        },
      ],
    };

    prismaMock.user.findUnique.mockResolvedValue(userWithOrders as any);

    const result = await getUserAdmin(1);

    expect(result).toEqual(userWithOrders);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        select: expect.objectContaining({
          orders: expect.any(Object),
        }),
      })
    );
  });

  it("rejette un utilisateur introuvable", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(getUserAdmin(999)).rejects.toThrow("USER_NOT_FOUND");
  });
});
