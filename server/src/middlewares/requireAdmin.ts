import type { Request, Response, NextFunction } from 'express';
import { userHasAdminRole } from '../utils/roles.js';

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.roles?.length) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    if (userHasAdminRole(req.user.roles)) {
        return next();
    }

    return res.status(403).json({ message: "Accès non autorisé" });
};

export default verifyAdmin;