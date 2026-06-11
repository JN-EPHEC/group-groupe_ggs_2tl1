import type { Request, Response, NextFunction } from "express";
import { allCategories, oneCat } from "../services/catServices.js";

export const getAllCat = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await allCategories();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getOneCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await oneCat(Number(req.params.id));

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "CAT_NOT_FOUND") {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    return next(error);
  }
};
