import type { NextFunction, Request, Response } from 'express';
import { getAdminUserById, getAdminUsers } from '../controllers/adminUserControllers';
import { prismaMock } from './setup/prisma.singleton';

const createResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminUserControllers', () => {
  it('retourne la liste paginee des utilisateurs admin', async () => {
    const req = {
      query: {
        search: 'stefan',
        page: '2',
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 3,
        username: 'Stefan',
        email: 'stefan@example.com',
        created_at: new Date('2026-01-01T10:00:00.000Z'),
        roles: [{ role: { name: 'ADMIN' } }],
      } as never,
    ]);
    prismaMock.user.count.mockResolvedValue(21);

    await getAdminUsers(req, res, next);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
        where: {
          OR: [
            { username: { contains: 'stefan', mode: 'insensitive' } },
            { email: { contains: 'stefan', mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          id: 3,
          nom: 'Stefan',
          email: 'stefan@example.com',
          role: 'ADMIN',
          date_inscription: new Date('2026-01-01T10:00:00.000Z'),
          statut: 'actif',
        },
      ],
      meta: {
        page: 2,
        per_page: 20,
        total: 21,
        total_pages: 2,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 400 si id utilisateur invalide', async () => {
    const req = {
      params: {
        id: 'abc',
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await getAdminUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'ID utilisateur invalide.' });
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it('retourne 404 si utilisateur introuvable', async () => {
    const req = {
      params: {
        id: '8',
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.user.findUnique.mockResolvedValue(null);

    await getAdminUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur introuvable.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne le detail utilisateur avec roles, adresses et commandes', async () => {
    const req = {
      params: {
        id: '5',
      },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.user.findUnique.mockResolvedValue({
      id: 5,
      username: 'Alice',
      email: 'alice@example.com',
      created_at: new Date('2025-12-20T09:30:00.000Z'),
      roles: [{ role: { name: 'CLIENT' } }],
      addresses: [
        {
          id: 1,
          street: '1 rue des Tests',
          city: 'Bruxelles',
          state: 'Bruxelles',
          postalCode: '1000',
          country: 'Belgique',
        },
      ],
      orders: [
        {
          id: 42,
          orderDate: new Date('2026-02-10T08:00:00.000Z'),
          status: 'LIVREE',
        },
      ],
    } as never);

    await getAdminUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 5,
      nom: 'Alice',
      email: 'alice@example.com',
      date_inscription: new Date('2025-12-20T09:30:00.000Z'),
      roles: ['CLIENT'],
      statut: 'actif',
      adresses: [
        {
          id: 1,
          street: '1 rue des Tests',
          city: 'Bruxelles',
          state: 'Bruxelles',
          postalCode: '1000',
          country: 'Belgique',
        },
      ],
      commandes: [
        {
          id: 42,
          orderDate: new Date('2026-02-10T08:00:00.000Z'),
          status: 'LIVREE',
        },
      ],
      avis: [],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
