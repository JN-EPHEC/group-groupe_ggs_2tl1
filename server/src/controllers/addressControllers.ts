import type { NextFunction, Request, Response } from "express";
import {
  allAdresses,
  createAdress,
  updateAdress,
  deleteAdress,
} from "../services/adressesServices.js";

// Permet de récupérer les adresses de l'utilisateur connecté
export const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await allAdresses(Number(req.user.id));

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// Permet d'ajouter une adresse pour l'utilisateur connecté
export const createMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);

    const address = await createAdress(userId, req.body);

    return res.status(201).json(address);
  } catch (error) {
    return next(error);
  }
};

// Permet de modifier une adresse de l'utilisateur connecté
export const updateMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);

    const updatedAddress = await updateAdress(userId, addressId, req.body);

    return res.status(200).json(updatedAddress);
  } catch (error) {
    if (error instanceof Error && error.message === "NO_ADDRESS_DATA") {
      return res.status(400).json({ message: "Aucune donnée présente" });
    }

    if (error instanceof Error && error.message === "ADDRESS_NOT_FOUND") {
      return res.status(404).json({ message: "Adresse introuvable" });
    }

    return next(error);
  }
};

// Permet de supprimer une adresse de l'utilisateur connecté
export const deleteMyAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);

    await deleteAdress(userId, addressId);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "ADDRESS_NOT_FOUND") {
      return res.status(404).json({ message: "Adresse introuvable" });
    }

    return next(error);
  }
};
