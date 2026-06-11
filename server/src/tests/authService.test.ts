import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { loginUser, registerUser } from "../services/authService";
import { prismaMock } from "./setup/prisma.singleton";

jest.mock("node:crypto", () => ({
  randomBytes: jest.fn(() => Buffer.from("test-salt")),
  scryptSync: jest.fn(() => Buffer.from("hashed-password")),
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(() => "jwt-token"),
  },
}));

const user = {
  id: 1,
  username: "greg",
  email: "greg@test.com",
  created_at: new Date("2026-01-01"),
  isActive: true,
};

describe("Auth service", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  describe("registerUser", () => {
    it("crée un utilisateur, ses credentials, son adresse et retourne un token", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });
      prismaMock.role.findUnique.mockResolvedValue({ id: 2, name: "Client" });
      prismaMock.user.create.mockResolvedValue(user);
      prismaMock.credentials.create.mockResolvedValue({
        id: 1,
        user_id: 1,
        password_hash: "hashed-password",
        salt: "746573742d73616c74",
      });
      prismaMock.address.create.mockResolvedValue({
        id: 1,
        user_id: 1,
        street: "Rue test",
        city: "Bruxelles",
        state: "Bruxelles",
        postalCode: "1000",
        country: "Belgique",
      });

      const result = await registerUser({
        username: "greg",
        email: "greg@test.com",
        password: "password123",
        addresses: [
          {
            street: "Rue test",
            city: "Bruxelles",
            state: "Bruxelles",
            postalCode: "1000",
            country: "Belgique",
          },
        ],
      });

      expect(result).toEqual({
        token: "jwt-token",
        user: {
          id: 1,
          username: "greg",
          email: "greg@test.com",
        },
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "greg@test.com" },
      });
      expect(prismaMock.role.findUnique).toHaveBeenCalledWith({
        where: { name: "Client" },
      });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: "greg",
          email: "greg@test.com",
          roles: {
            create: {
              role_id: 2,
            },
          },
        },
      });
      expect(prismaMock.credentials.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          password_hash: "6861736865642d70617373776f7264",
          salt: "746573742d73616c74",
        },
      });
      expect(prismaMock.address.create).toHaveBeenCalledTimes(1);
    });

    it("rejette si l'email existe déjà", async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);

      await expect(
        registerUser({
          username: "greg",
          email: "greg@test.com",
          password: "password123",
        })
      ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
    });

    it("rejette si le rôle Client est absent", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });
      prismaMock.role.findUnique.mockResolvedValue(null);

      await expect(
        registerUser({
          username: "greg",
          email: "greg@test.com",
          password: "password123",
        })
      ).rejects.toThrow("CLIENT_ROLE_NOT_FOUND");
    });
  });

  describe("loginUser", () => {
    it("connecte un utilisateur avec un bon mot de passe", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        credentials: {
          id: 1,
          user_id: 1,
          password_hash: "6861736865642d70617373776f7264",
          salt: "salt",
        },
      } as any);

      const result = await loginUser({
        email: "greg@test.com",
        password: "password123",
      });

      expect(result).toEqual({
        token: "jwt-token",
        user: {
          id: 1,
          username: "greg",
          email: "greg@test.com",
        },
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "greg@test.com" },
        include: { credentials: true },
      });
    });

    it("rejette si l'utilisateur est introuvable", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(loginUser({ email: "none@test.com", password: "password123" })).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });

    it("rejette si le mot de passe est incorrect", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        credentials: {
          id: 1,
          user_id: 1,
          password_hash: "wrong-hash",
          salt: "salt",
        },
      } as any);

      await expect(loginUser({ email: "greg@test.com", password: "bad" })).rejects.toThrow(
        "FALSE_PASSWORD"
      );
    });
  });
});
