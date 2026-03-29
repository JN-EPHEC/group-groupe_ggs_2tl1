import type { Request, Response, NextFunction } from 'express'

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
        return res.send("Accès autorisé")
}