import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from "../services/authService.js";

//Permet de créer un utilisateur
export const authRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json(result);
    } catch (error) {
        if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(400).json({ message: "Compte utilisateur déjà existant" });
        }

        return next(error);
    }
};


export const authLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await loginUser(req.body);
        return res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error && error.message === "USER_NOT_FOUND") {
            return res.status(400).json({ message: "Utilisateur introuvable" });
        }
        if (error instanceof Error && error.message === "FALSE_PASSWORD") {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        return next(error);
    }
};
