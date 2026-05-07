import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

// Permet de récupérer les adresses de l'utilisateur connecté
export const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { userId?: number } | undefined)?.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    const addresses = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { id: "asc" },
    });

    return res.status(200).json(addresses);
    
  } catch (error) {
    return next(error);
  }
};

// Permet d'ajouter une adresse pour l'utilisateur connecté
export const createMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { userId?: number } | undefined)?.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    const { street, city, state, postalCode, country } = req.body;

    if (!street || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "Champs adresse manquants" });
    }

    const address = await prisma.address.create({
      data: {
        user_id: userId,
        street,
        city,
        state,
        postalCode,
        country,
      },
    });

    return res.status(201).json(address);
  } catch (error) {
    return next(error);
  }
};

// Permet de modifier une adresse de l'utilisateur connecté
export const updateMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { userId?: number } | undefined)?.userId);
    const addressId = Number(req.params.addressId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({ message: "Id adresse invalide" });
    }

    const data: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    } = {};

    if (req.body.street !== undefined) data.street = req.body.street;
    if (req.body.city !== undefined) data.city = req.body.city;
    if (req.body.state !== undefined) data.state = req.body.state;
    if (req.body.postalCode !== undefined) data.postalCode = req.body.postalCode;
    if (req.body.country !== undefined) data.country = req.body.country;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucune donnée présente" });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Adresse introuvable" });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    return res.status(200).json(updatedAddress);
  } catch (error) {
    return next(error);
  }
};

// Permet de supprimer une adresse de l'utilisateur connecté
export const deleteMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as { userId?: number } | undefined)?.userId);
    const addressId = Number(req.params.addressId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Utilisateur non authentifie" });
    }

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({ message: "Id adresse invalide" });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Adresse introuvable" });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
