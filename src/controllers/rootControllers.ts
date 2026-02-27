import type { Request, Response, NextFunction } from 'express'

export const showRoot = async (req : Request,res: Response,next: NextFunction) => {
    res.send('Bienvenue sur mon serveur API')
}