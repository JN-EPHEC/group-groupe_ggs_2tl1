import { describe, expect, it, jest } from "@jest/globals";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "../services/adminOrderServices";
import { prismaMock } from "./setup/prisma.singleton";

jest.mock("../services/emailService.js", () => ({
  sendOrderStatusEmail: jest.fn(async () => undefined),
}));

const order = {
  id: 1,
  user_id: 1,
  orderDate: new Date("2026-01-01"),
  status_id: 1,
  status: { id: 1, name: "En attente" },
  user: { email: "alice@test.com" },
};

describe("Admin orders (US05)", () => {
  it("liste toutes les commandes", async () => {
    prismaMock.orders.findMany.mockResolvedValue([order] as any);

    const result = await getAllOrdersAdmin();

    expect(result).toEqual([order]);
  });

  it("met à jour le statut avec historique", async () => {
    prismaMock.orders.findUnique.mockResolvedValue(order as any);
    prismaMock.orderStatus.findUnique.mockResolvedValue({ id: 2, name: "Validée" });
    prismaMock.$transaction.mockImplementation(async (callback) => callback(prismaMock));
    prismaMock.orderStatusHistory.create.mockResolvedValue({ id: 1 } as any);
    prismaMock.orders.update.mockResolvedValue({
      ...order,
      status_id: 2,
      status: { id: 2, name: "Validée" },
    } as any);

    const result = await updateOrderStatusAdmin(1, { statut: "Validée" });

    expect(result.status.name).toBe("Validée");
    expect(prismaMock.orderStatusHistory.create).toHaveBeenCalled();
  });

  it("rejette une transition invalide", async () => {
    prismaMock.orders.findUnique.mockResolvedValue(order as any);

    await expect(updateOrderStatusAdmin(1, { statut: "Livrée" })).rejects.toThrow(
      "INVALID_STATUS_TRANSITION"
    );
  });
});
