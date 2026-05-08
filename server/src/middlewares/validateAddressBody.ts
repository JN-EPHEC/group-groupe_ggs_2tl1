import type { Request, Response, NextFunction } from "express";

const requiredAddressFields = ["street", "city", "state", "postalCode", "country"];

export const validateAddressBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const field of requiredAddressFields) {
    if (typeof req.body?.[field] !== "string" || req.body[field].trim() === "") {
      return res.status(400).json({ message: "Champs adresse manquants" });
    }
  }

  next();
};

export default validateAddressBody;
