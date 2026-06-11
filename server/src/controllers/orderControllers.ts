import type { Response, Request, NextFunction } from "express";
import {ordersClient, oneOrderClient, createOrderClient} from "../services/orderServices.js"

// Permet de récupérer une seule commande d'un client
export const getOneOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);
    const orderId = Number(req.params.id);

    const result = await oneOrderClient(userId,orderId);

    if (!result) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// Permet de récupérer toutes les commandes d'un client
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);

    const result = await ordersClient(userId)

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// Permet de créer une commande pour un client
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user.id);

    const result = await createOrderClient(userId, req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "STATUS_NOT_FOUND") {
      return res.status(400).json({ message: 'Statut "En attente" introuvable' });
    }

    if (error instanceof Error && error.message === "PRODUCTS_NOT_FOUND") {
      return res.status(404).json({ message: "Un ou plusieurs produits sont introuvables" });
    }

    if (error instanceof Error && error.message.includes("Stock insuffisant")) {
      return res.status(409).json({ message: error.message });
    }

    return next(error);
  }
};
