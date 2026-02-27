import type { Request, Response, NextFunction } from 'express'
import User from "../models/User.js"

//Services pour récuperer tous les users de l'api
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.findAll();
        return res.status(200).json(users);
}

//Services pour récuperer un user précis 
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);

        const user = await User.findByPk(id);
        if (!user) {
                return res.status(404).json({ message: 'Pas de user ayant cet ID' });
        }

        return res.status(200).json(user);
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

        //déstructuration pour recup que 2 éléments.
        const { firstName, lastName } = req.body;
        const user = await User.create(req.body);

        return res.status(201).json(user);
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
                return res.status(404).json({ message: 'Pas de user ayant cet ID' });
        }

        await user.update(req.body);
        return res.status(200).json(user);
}

export const deleteUser = async (req: Request, res: Response,next: NextFunction) => {
        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json("Pas de user ayant cet ID");
        }

        await user.destroy();
        res.json({ message : `${user} a bien été supprimé`})
}
