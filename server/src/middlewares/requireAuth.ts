import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {

    //Récupère le header
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
        const decoded: any = jwt.verify(token, accessSecret);
        //Vérifie que l'utilisateur existe en db
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: { role: true }  // ← Ajouter ça pour avoir le détail du rôle
                }
            }
        });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        //Vérifie que l'utlisateur est bien actif
        if (!user.isActive) {
            return res.status(403).json({ message: "Compte désactivé" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

export default verifyAuth;