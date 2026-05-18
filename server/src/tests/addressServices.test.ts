import { describe, expect, it } from "@jest/globals";
import {
  allAdresses,
  createAdress,
  deleteAdress,
  updateAdress,
} from "../services/adressesServices";
import { prismaMock } from "./setup/prisma.singleton";

const address = {
  id: 1,
  user_id: 1,
  street: "Rue test",
  city: "Bruxelles",
  state: "Bruxelles",
  postalCode: "1000",
  country: "Belgique",
};

describe("Address services", () => {
  it("retourne les adresses d'un utilisateur", async () => {
    prismaMock.address.findMany.mockResolvedValue([address]);

    const result = await allAdresses(1);

    expect(result).toEqual([address]);
    expect(prismaMock.address.findMany).toHaveBeenCalledWith({
      where: { user_id: 1 },
      orderBy: { id: "asc" },
    });
  });

  it("crée une adresse pour un utilisateur", async () => {
    prismaMock.address.create.mockResolvedValue(address);

    const result = await createAdress(1, {
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });

    expect(result).toEqual(address);
    expect(prismaMock.address.create).toHaveBeenCalledWith({
      data: {
        user_id: 1,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
    });
  });

  it("modifie une adresse existante", async () => {
    const updatedAddress = { ...address, city: "Namur" };
    prismaMock.address.findFirst.mockResolvedValue(address);
    prismaMock.address.update.mockResolvedValue(updatedAddress);

    const result = await updateAdress(1, 1, { city: "Namur" });

    expect(result).toEqual(updatedAddress);
    expect(prismaMock.address.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        user_id: 1,
      },
    });
    expect(prismaMock.address.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { city: "Namur" },
    });
  });

  it("rejette une modification sans donnée autorisée", async () => {
    await expect(updateAdress(1, 1, {})).rejects.toThrow("NO_ADDRESS_DATA");
    expect(prismaMock.address.findFirst).not.toHaveBeenCalled();
  });

  it("rejette une modification si l'adresse est introuvable", async () => {
    prismaMock.address.findFirst.mockResolvedValue(null);

    await expect(updateAdress(1, 999, { city: "Namur" })).rejects.toThrow("ADDRESS_NOT_FOUND");
  });

  it("supprime une adresse existante", async () => {
    prismaMock.address.findFirst.mockResolvedValue(address);
    prismaMock.address.delete.mockResolvedValue(address);

    const result = await deleteAdress(1, 1);

    expect(result).toBeNull();
    expect(prismaMock.address.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("rejette une suppression si l'adresse est introuvable", async () => {
    prismaMock.address.findFirst.mockResolvedValue(null);

    await expect(deleteAdress(1, 999)).rejects.toThrow("ADDRESS_NOT_FOUND");
  });
});
