import { describe, expect, it } from "@jest/globals";
import { anonymizeUserAdmin } from "../services/adminServices";
import { prismaMock } from "./setup/prisma.singleton";

const user = {
  id: 2,
  username: "alice",
  email: "alice@test.com",
  created_at: new Date("2026-01-01"),
  isActive: true,
  roles: [],
};

describe("Admin user delete (US02)", () => {
  it("anonymise un utilisateur et conserve son identifiant", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 2,
      email: "alice@test.com",
    } as any);
    prismaMock.$transaction.mockImplementation(async (callback) => callback(prismaMock));
    prismaMock.credentials.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.address.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.userRole.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.user.update.mockResolvedValue({
      ...user,
      username: "utilisateur_supprime_2",
      email: "deleted_2@anonymized.local",
      isActive: false,
    } as any);

    const result = await anonymizeUserAdmin(2, 1);

    expect(result.message).toBe("Utilisateur anonymisé");
    expect(result.user.email).toBe("deleted_2@anonymized.local");
    expect(prismaMock.credentials.deleteMany).toHaveBeenCalledWith({
      where: { user_id: 2 },
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 2 },
        data: expect.objectContaining({
          isActive: false,
        }),
      })
    );
  });

  it("interdit la suppression de son propre compte", async () => {
    await expect(anonymizeUserAdmin(1, 1)).rejects.toThrow("CANNOT_DELETE_SELF");
  });

  it("rejette un utilisateur introuvable", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(anonymizeUserAdmin(999, 1)).rejects.toThrow("USER_NOT_FOUND");
  });

  it("rejette un utilisateur déjà anonymisé", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 2,
      email: "deleted_2@anonymized.local",
    } as any);

    await expect(anonymizeUserAdmin(2, 1)).rejects.toThrow("USER_ALREADY_ANONYMIZED");
  });
});
