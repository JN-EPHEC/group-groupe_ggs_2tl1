import type { Request, Response, NextFunction } from 'express';

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user.roles) {
        return res.status(404).json({message: "Aucun rôle"})
    };

    for (let i of req.user.roles) {
        if (i.role.name === "Admin") {
            return next();
        };
    }

    return res.status(403).json({ message: "Accès non authorisé"});
}

export default verifyAdmin;