import type { NextFunction, Request, Response } from 'express';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../controllers/adminCategoryControllers';
import { prismaMock } from './setup/prisma.singleton';

const createResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminCategoryControllers', () => {
  it('retourne la liste des categories avec le nombre de produits', async () => {
    const req = {} as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findMany.mockResolvedValue([
      { id: 1, name: 'Snacks', _count: { products: 2 } },
      { id: 2, name: 'Boissons', _count: { products: 0 } },
    ] as never);

    await getAdminCategories(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        { id: 1, nom: 'Snacks', produits_count: 2 },
        { id: 2, nom: 'Boissons', produits_count: 0 },
      ],
    });
  });

  it('retourne 409 si la categorie existe deja a la creation', async () => {
    const req = { body: { nom: 'Snacks' } } as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findUnique.mockResolvedValue({ id: 1 } as never);

    await createAdminCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cette categorie existe deja.' });
  });

  it('cree une categorie avec succes', async () => {
    const req = { body: { nom: 'Nouveau' } } as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findUnique.mockResolvedValue(null);
    prismaMock.categories.create.mockResolvedValue({ id: 6, name: 'Nouveau' } as never);

    await createAdminCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Categorie creee avec succes.',
      categorie: { id: 6, nom: 'Nouveau' },
    });
  });

  it('retourne 409 a la suppression si produits lies', async () => {
    const req = { params: { id: '3' } } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findUnique.mockResolvedValue({
      id: 3,
      _count: { products: 1 },
    } as never);

    await deleteAdminCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Suppression interdite: des produits sont encore lies a cette categorie.',
    });
    expect(prismaMock.categories.delete).not.toHaveBeenCalled();
  });

  it('supprime une categorie sans produits lies', async () => {
    const req = { params: { id: '4' } } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findUnique.mockResolvedValue({
      id: 4,
      _count: { products: 0 },
    } as never);
    prismaMock.categories.delete.mockResolvedValue({ id: 4 } as never);

    await deleteAdminCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Categorie supprimee avec succes.' });
  });

  it('modifie une categorie avec succes', async () => {
    const req = {
      params: { id: '7' },
      body: { nom: 'Updated name' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    prismaMock.categories.findUnique.mockResolvedValue({ id: 7 } as never);
    prismaMock.categories.findFirst.mockResolvedValue(null);
    prismaMock.categories.update.mockResolvedValue({ id: 7, name: 'Updated name' } as never);

    await updateAdminCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Categorie modifiee avec succes.',
      categorie: { id: 7, nom: 'Updated name' },
    });
  });
});
