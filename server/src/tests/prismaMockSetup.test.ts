import prisma from "../config/prisma.js";
import { prismaMock } from "./setup/prisma.singleton";

describe("Prisma mock setup", () => {
  it("mocke Prisma pour les tests unitaires", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);

    const users = await prisma.user.findMany();

    expect(users).toEqual([]);
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });
});
