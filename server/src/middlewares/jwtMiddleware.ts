import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('Authorization header reçu:', req.headers.authorization)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.substring(7);
  const accessSecret = process.env.JWT_SECRET;

  if (!accessSecret) {
    return res.status(500).json({ message: "JWT_SECRET non configuré" });
  }

  try {
    const decoded = jwt.verify(token, accessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default verifyAccessToken;
