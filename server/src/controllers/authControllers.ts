import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from "../services/authService.js";

//Permet de créer un utilisateur
export const authRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerUser(req.body);

        res.cookie("accessToken", result.token, { //crée un cookie nommé accesToken
            //cookie non lisible coté frontend
            httpOnly: true,
            //si en prod, true --> envoyé uniquement en https
            secure: process.env.NODE_ENV === "production",
            //protege contre le cross site
            // process.env.NODE_ENV === "production" ? "none" :
            sameSite: "lax",
            //expire après 1h comme le jwt
            maxAge: 60 * 60 * 1000,
        });

        return res.status(201).json({
            user: result.user,
        });
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

        res.cookie("accessToken", result.token, { //crée un cookie nommé accesToken
            //cookie non lisible coté frontend
            httpOnly: true,
            //si en prod, true --> envoyé uniquement en https
            secure: process.env.NODE_ENV === "production",
            //protege contre le cross site
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            //expire après 1h comme le jwt
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            user: result.user,
        });
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

export const authLogout = async (_req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(204).send();
};
