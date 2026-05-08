import type { Request, Response, NextFunction } from "express";

export const checkEmptyBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Le body est vide" });
  }

  next();
};

export default checkEmptyBody;
