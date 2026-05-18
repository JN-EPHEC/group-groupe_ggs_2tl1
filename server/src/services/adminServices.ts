import prisma from "../config/prisma.js";
import { isAdminRole, ROLE_ADMIN } from "../utils/roles.js";

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

export const getAllUsersAdmin = async () => {
  return prisma.user.findMany({
    select: userSelect,
  });
};

export const getUserAdmin = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
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

export const deleteAdminUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isAdmin = user.roles.some((userRole) => isAdminRole(userRole.role.name));
  if (!isAdmin) {
    throw new Error("USER_NOT_ADMIN");
  }

  const deletedUser = await prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  return { message: "Admin supprimé", user: deletedUser };
};

export const createCategoryAdmin = async (input: CategoryInput) => {
  return prisma.categories.create({
    data: input,
  });
};
