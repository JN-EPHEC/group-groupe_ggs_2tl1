import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';

const DEFAULT_PAGE = 1;
const USERS_PER_PAGE = 20;

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

type UserWithRoleSummary = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          select: { name: true };
        };
      };
    };
  };
}>;

const mapUserSummary = (user: UserWithRoleSummary) => ({
  id: user.id,
  nom: user.username,
  email: user.email,
  role: user.roles[0]?.role.name ?? 'CLIENT',
  date_inscription: user.created_at,
  statut: 'actif',
});

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const skip = (page - 1) * USERS_PER_PAGE;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { id: 'asc' },
        skip,
        take: USERS_PER_PAGE,
        include: {
          roles: {
            include: {
              role: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      data: users.map(mapUserSummary),
      meta: {
        page,
        per_page: USERS_PER_PAGE,
        total,
        total_pages: Math.ceil(total / USERS_PER_PAGE),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID utilisateur invalide.' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              select: { name: true },
            },
          },
        },
        orders: {
          orderBy: { orderDate: 'desc' },
          select: {
            id: true,
            orderDate: true,
            status: true,
          },
        },
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json({
      id: user.id,
      nom: user.username,
      email: user.email,
      date_inscription: user.created_at,
      roles: user.roles.map((assignment) => assignment.role.name),
      statut: 'actif',
      adresses: user.addresses,
      commandes: user.orders,
      avis: [],
    });
  } catch (error) {
    return next(error);
  }
};
