import type { Request, Response, NextFunction } from 'express';

export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const role = (req.user as { role?: string } | undefined)?.role;

  if (typeof role !== 'string' || role.toUpperCase() !== 'ADMIN') {
    return res.status(403).json({ message: 'Acces refuse: role ADMIN requis.' });
  }

  return next();
};

export default requireAdminRole;
