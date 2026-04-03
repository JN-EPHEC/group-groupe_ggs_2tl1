import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js"


export const checkUser = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
                return res.status(404).json({ message: 'Pas de user ayant cet ID' });
        }

        (req as any).user = user;
        next();
    }

    export default checkUser;