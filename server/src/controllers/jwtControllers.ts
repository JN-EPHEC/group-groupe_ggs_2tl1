import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

export const createAccessToken = () => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  if (!accessSecret) {
    throw new Error("JWT_ACCESS_SECRET non configuré");
  }

  return jwt.sign(
    { id: demoUser.id, username: demoUser.username, role: demoUser.role },
    accessSecret,
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = () => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET non configuré");
  }

  return jwt.sign(
    { id: demoUser.id, username: demoUser.username },
    refreshSecret,
    { expiresIn: "7d" }
  );
};

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Vérifier les identifiants (fictif pour l'exercice)
  if (username !== demoUser.username || password !== demoUser.password) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const accessToken = createAccessToken();
  const refreshToken = createRefreshToken();

  res.json({
    accessToken,
    refreshToken
  });
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    return res.status(500).json({ message: "JWT_REFRESH_SECRET non configuré" });
  }

  try {
    jwt.verify(refreshToken, refreshSecret);
    const newAccessToken = createAccessToken();
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Refresh token invalide" });
  }
};
