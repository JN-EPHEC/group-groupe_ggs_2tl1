import type { Request, Response, NextFunction } from "express";
import { createCheckoutSessionService } from "../services/checkoutServices.js";

export const createCheckoutSession = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result = await createCheckoutSessionService(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "EMPTY_CART") {
      return res.status(400).json({ message: "Le panier est vide" });
    }

    if (error instanceof Error && error.message === "PRODUCTS_NOT_FOUND") {
      return res.status(404).json({ message: "Un ou plusieurs produits sont introuvables" });
    }

    return next(error);
  }
};
