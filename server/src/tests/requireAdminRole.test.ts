import type { NextFunction, Request, Response } from 'express';
import { requireAdminRole } from '../middlewares/requireAdminRole';

const createResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('requireAdminRole', () => {
  it('laisse passer un utilisateur admin', () => {
    const req = {
      user: {
        role: 'ADMIN',
      },
    } as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    requireAdminRole(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejette un utilisateur non admin', () => {
    const req = {
      user: {
        role: 'CLIENT',
      },
    } as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    requireAdminRole(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acces refuse: role ADMIN requis.' });
  });
});
