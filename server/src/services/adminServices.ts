import prisma from "../config/prisma.js";
import { ROLE_ADMIN } from "../utils/roles.js";

type ProductInput = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
};

type UserUpdateInput = {
  username?: string;
  email?: string;
  isActive?: boolean;
};

type AdminInput = {
  username: string;
  email: string;
  [key: string]: unknown;
};

type CategoryInput = {
  name: string;
};

const userSelect = {
  id: true,
  username: true,
  email: true,
  created_at: true,
  isActive: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export const createProductAdmin = async (input: ProductInput) => {
  return prisma.products.create({
    data: input as Required<ProductInput>,
  });
};

export const deleteProductAdmin = async (productId: number) => {
  const exists = await prisma.products.findUnique({ where: { id: productId } });

  if (!exists) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return prisma.products.delete({
    where: { id: productId },
  });
};

export const updateProductAdmin = async (productId: number, input: ProductInput) => {
  const exists = await prisma.products.findUnique({ where: { id: productId } });

  if (!exists) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return prisma.products.update({
    where: { id: productId },
    data: input,
  });
};

const USERS_PAGE_SIZE = 20;

type ListUsersInput = {
  search?: string;
  page?: number;
};

const orderInclude = {
  orderBy: { orderDate: "desc" as const },
  include: {
    status: true,
    orderProducts: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
};

export const listUsersAdmin = async (input: ListUsersInput = {}) => {
  const page = Number.isInteger(input.page) && (input.page as number) > 0 ? (input.page as number) : 1;
  const search = input.search?.trim();

  const where =
    search && search.length > 0
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * USERS_PAGE_SIZE,
      take: USERS_PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      pageSize: USERS_PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / USERS_PAGE_SIZE)),
    },
  };
};

export const getUserAdmin = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      orders: orderInclude,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const updateUserAdmin = async (userId: number, input: UserUpdateInput) => {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) {
    throw new Error("USER_NOT_FOUND");
  }

  const data: UserUpdateInput = {};

  if (input.username !== undefined) data.username = input.username;
  if (input.email !== undefined) data.email = input.email;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  if (Object.keys(data).length === 0) {
    throw new Error("NO_USER_DATA");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
};

export const createAdminUser = async (input: AdminInput) => {
  const adminRole = await prisma.role.findUnique({
    where: { name: ROLE_ADMIN },
  });

  if (!adminRole) {
    throw new Error("ADMIN_ROLE_NOT_FOUND");
  }

  return prisma.user.create({
    data: {
      ...input,
      roles: {
        create: {
          role_id: adminRole.id,
        },
      },
    },
    select: userSelect,
  });
};

const ANONYMIZED_EMAIL_SUFFIX = "@anonymized.local";

export const anonymizeUserAdmin = async (targetUserId: number, adminUserId: number) => {
  if (targetUserId === adminUserId) {
    throw new Error("CANNOT_DELETE_SELF");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.email.endsWith(ANONYMIZED_EMAIL_SUFFIX)) {
    throw new Error("USER_ALREADY_ANONYMIZED");
  }

  const anonymizedUser = await prisma.$transaction(async (tx) => {
    await tx.credentials.deleteMany({ where: { user_id: targetUserId } });
    await tx.address.deleteMany({ where: { user_id: targetUserId } });
    await tx.userRole.deleteMany({ where: { user_id: targetUserId } });

    return tx.user.update({
      where: { id: targetUserId },
      data: {
        username: `utilisateur_supprime_${targetUserId}`,
        email: `deleted_${targetUserId}${ANONYMIZED_EMAIL_SUFFIX}`,
        isActive: false,
      },
      select: userSelect,
    });
  });

  return {
    message: "Utilisateur anonymisé",
    user: anonymizedUser,
  };
};

export const createCategoryAdmin = async (input: CategoryInput) => {
  return prisma.categories.create({
    data: input,
  });
};
