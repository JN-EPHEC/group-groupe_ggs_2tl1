import { describe, expect, it } from "@jest/globals";
import {
  getUserProfile,
  updateUserActiveStatus,
  updateUserPassword,
  updateUserProfile,
} from "../services/userServices";
import { prismaMock } from "./setup/prisma.singleton";

const userProfile = {
  id: 1,
  username: "greg",
  email: "greg@test.com",
  created_at: new Date("2026-01-01"),
  addresses: [],
  roles: [
    {
      role: {
        id: 1,
        name: "Client",
      },
    },
  ],
};

describe("User services", () => {
  describe("getUserProfile", () => {
    it("retourne le profil d'un utilisateur", async () => {
      prismaMock.user.findUnique.mockResolvedValue(userProfile as any);

      const result = await getUserProfile(1);

      expect(result).toEqual(userProfile);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          addresses: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it("rejette si l'utilisateur est introuvable", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(getUserProfile(999)).rejects.toThrow("USER_NOT_FOUND");
    });
  });

  describe("updateUserProfile", () => {
    it("modifie le profil d'un utilisateur", async () => {
      const updatedUser = { id: 1, username: "new", email: "new@test.com" };
      prismaMock.user.update.mockResolvedValue(updatedUser as any);

      const result = await updateUserProfile(1, {
        username: "new",
        email: "new@test.com",
      });

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          username: "new",
          email: "new@test.com",
        },
      });
    });

    it("rejette si aucune donnée de profil n'est fournie", async () => {
      await expect(updateUserProfile(1, {})).rejects.toThrow("NO_USER_DATA");
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });

  describe("updateUserPassword", () => {
    it("modifie le mot de passe d'un utilisateur", async () => {
      const credentials = {
        id: 1,
        user_id: 1,
        password_hash: "new-hash",
        salt: "salt",
      };
      prismaMock.credentials.update.mockResolvedValue(credentials);

      const result = await updateUserPassword(1, {
        password_hash: "new-hash",
      });

      expect(result).toEqual(credentials);
      expect(prismaMock.credentials.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: {
          password_hash: "new-hash",
        },
      });
    });

    it("rejette si aucun mot de passe n'est fourni", async () => {
      await expect(updateUserPassword(1, {})).rejects.toThrow("NO_USER_DATA");
      expect(prismaMock.credentials.update).not.toHaveBeenCalled();
    });
  });

  describe("updateUserActiveStatus", () => {
    it("modifie le statut actif d'un utilisateur", async () => {
      const updatedUser = { id: 1, username: "greg", email: "greg@test.com", isActive: false };
      prismaMock.user.update.mockResolvedValue(updatedUser as any);

      const result = await updateUserActiveStatus(1, {
        isActive: false,
      });

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isActive: false,
        },
      });
    });

    it("rejette si aucun statut actif n'est fourni", async () => {
      await expect(updateUserActiveStatus(1, {})).rejects.toThrow("NO_USER_DATA");
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });
});
